import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Quest, QuestStoreActions, ParentSettings, KidProgress } from '../types';
import { QUEST_LIBRARY, MANDATORY_IDS, OPTIONAL_LIBRARY } from '../constants/questLibrary';

const DEFAULT_PIN = '1234';

const LEVEL_TITLES = ['มือใหม่', 'นักสำรวจ', 'นักผจญภัย', 'นักรบ', 'วีรบุรุษ', 'ตำนาน'];
const LEVEL_XP_THRESHOLDS = [0, 50, 120, 220, 350, 520];

function computeProgress(totalXp: number, streakDays: number, lastStreakDate: string): KidProgress {
  let currentLevel = 1;
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_XP_THRESHOLDS[i]) { currentLevel = i + 1; break; }
  }
  const isMaxLevel = currentLevel >= LEVEL_TITLES.length;
  const xpThisLevel = totalXp - LEVEL_XP_THRESHOLDS[currentLevel - 1];
  const xpToNextLevel = isMaxLevel ? 0 : LEVEL_XP_THRESHOLDS[currentLevel] - totalXp;
  return {
    totalXp,
    currentLevel,
    currentLevelTitle: LEVEL_TITLES[currentLevel - 1],
    xpToNextLevel,
    xpThisLevel,
    streakDays,
    lastStreakDate,
  };
}

function libraryItemToQuest(item: typeof QUEST_LIBRARY[0]): Quest {
  return {
    id: item.id,
    libraryId: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon,
    rewardMinutes: item.defaultRewardMinutes,
    xpReward: item.defaultXpReward,
    isMandatory: item.isMandatory,
    completed: false,
  };
}

const defaultQuests: Quest[] = MANDATORY_IDS.map((id) => {
  const item = QUEST_LIBRARY.find((q) => q.id === id)!;
  return libraryItemToQuest(item);
});

const defaultSettings: ParentSettings = {
  pin: DEFAULT_PIN,
  dailyLimitMinutes: 60,
  kidProfile: { name: 'น้องน้ำ', avatar: '🦸' },
};

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

type QuestStore = AppState & QuestStoreActions & {
  completedQuests: Quest[];
  isTimerActive: boolean;
};

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      // State
      quests: defaultQuests,
      settings: defaultSettings,
      totalEarnedMinutes: 0,
      pendingApproval: false,
      timerActive: false,
      timerPaused: false,
      activeQuestId: null,
      timerElapsedSeconds: 0,
      timerRemainingSeconds: 0,
      timerSessions: [],
      lastResetDate: todayString(),
      pinLockoutUntil: null,
      pinFailCount: 0,
      progress: computeProgress(0, 0, todayString()),
      activeCheer: null,
      questsLastSentAt: null,

      // Computed selectors
      completedQuests: [],
      isTimerActive: false,

      // Actions
      completeQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.map((q) =>
            q.id === id ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
          );
          const completedList = quests.filter((q) => q.completed);
          const totalEarnedMinutes = completedList.reduce((sum, q) => sum + q.rewardMinutes, 0);
          const totalXp = completedList.reduce((sum, q) => sum + q.xpReward, 0);
          return {
            quests,
            totalEarnedMinutes,
            completedQuests: completedList,
            progress: computeProgress(totalXp, state.progress.streakDays, state.progress.lastStreakDate),
          };
        });
      },

      uncompleteQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.map((q) =>
            q.id === id ? { ...q, completed: false, completedAt: undefined } : q
          );
          const completedList = quests.filter((q) => q.completed);
          const totalEarnedMinutes = completedList.reduce((sum, q) => sum + q.rewardMinutes, 0);
          const totalXp = completedList.reduce((sum, q) => sum + q.xpReward, 0);
          return {
            quests,
            totalEarnedMinutes,
            completedQuests: completedList,
            progress: computeProgress(totalXp, state.progress.streakDays, state.progress.lastStreakDate),
          };
        });
      },

      requestApproval: () => set({ pendingApproval: true }),

      approveUnlock: () => {
        set((state) => {
          const durationMinutes = Math.min(state.totalEarnedMinutes, state.settings.dailyLimitMinutes);
          const session = {
            startedAt: new Date().toISOString(),
            durationMinutes,
            approvedBy: 'parent' as const,
          };
          return {
            pendingApproval: false,
            timerActive: true,
            isTimerActive: true,
            timerRemainingSeconds: durationMinutes * 60,
            timerSessions: [...state.timerSessions, session],
          };
        });
      },

      denyUnlock: () => set({ pendingApproval: false }),

      addQuest: (quest) => {
        const newQuest: Quest = { ...quest, id: Date.now().toString(), completed: false };
        set((state) => ({ quests: [...state.quests, newQuest] }));
      },

      removeQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.filter((q) => q.id !== id);
          const completedList = quests.filter((q) => q.completed);
          const totalEarnedMinutes = completedList.reduce((sum, q) => sum + q.rewardMinutes, 0);
          const totalXp = completedList.reduce((sum, q) => sum + q.xpReward, 0);
          return {
            quests,
            totalEarnedMinutes,
            completedQuests: completedList,
            progress: computeProgress(totalXp, state.progress.streakDays, state.progress.lastStreakDate),
          };
        });
      },

      startTimer: () => {
        set((state) => ({
          pendingApproval: false,
          timerActive: true,
          isTimerActive: true,
          timerRemainingSeconds: state.totalEarnedMinutes * 60,
        }));
      },

      startQuestTimer: (questId: string) => {
        set({ activeQuestId: questId, timerActive: true, isTimerActive: true, timerPaused: false });
      },

      pauseTimer: () => set({ timerPaused: true }),
      resumeTimer: () => set({ timerPaused: false }),
      resetTimer: () => set({ timerActive: false, isTimerActive: false, timerPaused: false, timerElapsedSeconds: 0, activeQuestId: null }),

      randomizeQuests: () => {
        const mandatory = MANDATORY_IDS.map((id) => {
          const item = QUEST_LIBRARY.find((q) => q.id === id)!;
          return libraryItemToQuest(item);
        });
        const shuffled = [...OPTIONAL_LIBRARY].sort(() => Math.random() - 0.5);
        const optional = shuffled.slice(0, 3).map(libraryItemToQuest);
        set({ quests: [...mandatory, ...optional], totalEarnedMinutes: 0, completedQuests: [] });
      },

      saveQuestsForKid: () => {
        set({ questsLastSentAt: new Date().toISOString() });
      },

      addQuestsFromLibrary: (libraryIds: string[]) => {
        set((state) => {
          const existingLibraryIds = new Set(state.quests.map((q) => q.libraryId).filter(Boolean));
          const toAdd = libraryIds
            .filter((id) => !existingLibraryIds.has(id))
            .map((id) => {
              const item = QUEST_LIBRARY.find((q) => q.id === id);
              return item ? libraryItemToQuest(item) : null;
            })
            .filter((q): q is Quest => q !== null);
          return { quests: [...state.quests, ...toAdd] };
        });
      },

      tickTimer: () => {
        set((state) => {
          if (!state.timerActive || state.timerRemainingSeconds <= 0) {
            return { timerActive: false, isTimerActive: false, timerRemainingSeconds: 0 };
          }
          const next = state.timerRemainingSeconds - 1;
          if (next <= 0) {
            return { timerActive: false, isTimerActive: false, timerRemainingSeconds: 0 };
          }
          return { timerRemainingSeconds: next };
        });
      },

      stopTimer: () => set({ timerActive: false, isTimerActive: false, timerPaused: false }),

      markCheerRead: () => {
        set((state) => {
          if (!state.activeCheer) return {};
          return { activeCheer: { ...state.activeCheer, readAt: new Date().toISOString() } };
        });
        setTimeout(() => set({ activeCheer: null }), 0);
      },

      resetDaily: () => {
        set((state) => ({
          quests: state.quests.map((q) => ({ ...q, completed: false, completedAt: undefined })),
          totalEarnedMinutes: 0,
          completedQuests: [],
          pendingApproval: false,
          timerActive: false,
          isTimerActive: false,
          timerPaused: false,
          activeQuestId: null,
          timerElapsedSeconds: 0,
          timerRemainingSeconds: 0,
          timerSessions: [],
          lastResetDate: todayString(),
          pinFailCount: 0,
          pinLockoutUntil: null,
          progress: computeProgress(0, state.progress.streakDays, state.progress.lastStreakDate),
          questsLastSentAt: null,
        }));
      },

      updateSettings: (settings: Partial<ParentSettings>) => {
        set((state) => ({ settings: { ...state.settings, ...settings } }));
      },

      recordPinFail: () => {
        set((state) => {
          const newCount = state.pinFailCount + 1;
          if (newCount >= 3) {
            const lockoutUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            return { pinFailCount: newCount, pinLockoutUntil: lockoutUntil };
          }
          return { pinFailCount: newCount };
        });
      },

      resetPinFails: () => set({ pinFailCount: 0, pinLockoutUntil: null }),
    }),
    {
      name: 'little-heroes-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        const boolFields = ['timerActive', 'pendingApproval'] as const;
        for (const field of boolFields) {
          if (typeof state[field] === 'string') {
            state[field] = state[field] === 'true';
          }
        }
        if (typeof state['totalEarnedMinutes'] === 'string') {
          state['totalEarnedMinutes'] = Number(state['totalEarnedMinutes']) || 0;
        }
        if (typeof state['timerRemainingSeconds'] === 'string') {
          state['timerRemainingSeconds'] = Number(state['timerRemainingSeconds']) || 0;
        }
        if (typeof state['pinFailCount'] === 'string') {
          state['pinFailCount'] = Number(state['pinFailCount']) || 0;
        }
        if (version < 2) {
          if (!state['progress']) state['progress'] = computeProgress(0, 0, todayString());
          if (!('activeCheer' in state)) state['activeCheer'] = null;
          if (!('activeQuestId' in state)) state['activeQuestId'] = null;
          if (Array.isArray(state['quests'])) {
            state['quests'] = (state['quests'] as Quest[]).map((q) => ({
              ...q,
              xpReward: q.xpReward ?? Math.round((q as Quest & { rewardMinutes: number }).rewardMinutes * 0.6),
              isMandatory: q.isMandatory ?? false,
            }));
          }
        }
        if (!('questsLastSentAt' in state)) state['questsLastSentAt'] = null;
        return state;
      },
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { completedQuests, isTimerActive, ...rest } = state;
        return rest;
      },
    }
  )
);
