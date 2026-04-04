import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Quest, QuestStoreActions, ParentSettings } from '../types';

const DEFAULT_PIN = '1234';

const defaultQuests: Quest[] = [
  { id: '1', title: 'ทำการบ้านให้เสร็จ', description: 'ทำการบ้านทุกวิชาให้เสร็จสิ้น', icon: '📚', rewardMinutes: 30, completed: false },
  { id: '2', title: 'ออกกำลังกาย 20 นาที', description: 'วิ่ง กระโดด หรือเล่นกีฬา 20 นาที', icon: '🏃', rewardMinutes: 15, completed: false },
  { id: '3', title: 'ช่วยงานบ้าน', description: 'ช่วยพ่อแม่ทำงานบ้าน เช่น กวาดบ้าน ล้างจาน', icon: '🧹', rewardMinutes: 10, completed: false },
  { id: '4', title: 'อ่านหนังสือ 15 นาที', description: 'อ่านหนังสือที่ชอบอย่างน้อย 15 นาที', icon: '📖', rewardMinutes: 20, completed: false },
];

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
      timerRemainingSeconds: 0,
      timerSessions: [],
      lastResetDate: todayString(),
      pinLockoutUntil: null,
      pinFailCount: 0,

      // Selectors (computed as part of state for simplicity)
      completedQuests: [],
      isTimerActive: false,

      // Actions
      completeQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.map((q) =>
            q.id === id ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
          );
          const totalEarnedMinutes = quests
            .filter((q) => q.completed)
            .reduce((sum, q) => sum + q.rewardMinutes, 0);
          return { quests, totalEarnedMinutes, completedQuests: quests.filter((q) => q.completed) };
        });
      },

      uncompleteQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.map((q) =>
            q.id === id ? { ...q, completed: false, completedAt: undefined } : q
          );
          const totalEarnedMinutes = quests
            .filter((q) => q.completed)
            .reduce((sum, q) => sum + q.rewardMinutes, 0);
          return { quests, totalEarnedMinutes, completedQuests: quests.filter((q) => q.completed) };
        });
      },

      requestApproval: () => set({ pendingApproval: true }),

      approveUnlock: () => {
        set((state) => {
          const durationMinutes = Math.min(
            state.totalEarnedMinutes,
            state.settings.dailyLimitMinutes
          );
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
        const newQuest: Quest = {
          ...quest,
          id: Date.now().toString(),
          completed: false,
        };
        set((state) => ({ quests: [...state.quests, newQuest] }));
      },

      removeQuest: (id: string) => {
        set((state) => {
          const quests = state.quests.filter((q) => q.id !== id);
          const totalEarnedMinutes = quests
            .filter((q) => q.completed)
            .reduce((sum, q) => sum + q.rewardMinutes, 0);
          return { quests, totalEarnedMinutes, completedQuests: quests.filter((q) => q.completed) };
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

      stopTimer: () => set({ timerActive: false, isTimerActive: false }),

      resetDaily: () => {
        set((state) => ({
          quests: state.quests.map((q) => ({ ...q, completed: false, completedAt: undefined })),
          totalEarnedMinutes: 0,
          completedQuests: [],
          pendingApproval: false,
          timerActive: false,
          isTimerActive: false,
          timerRemainingSeconds: 0,
          timerSessions: [],
          lastResetDate: todayString(),
          pinFailCount: 0,
          pinLockoutUntil: null,
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
    }
  )
);
