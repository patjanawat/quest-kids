export type QuestCategory = 'education' | 'exercise' | 'chores' | 'reading' | 'social' | 'health' | 'creativity';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  rewardMinutes: number;
  xpReward: number;
  completed: boolean;
  completedAt?: string; // ISO date string
  isMandatory: boolean;
  libraryId?: string;
}

export interface QuestLibraryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultRewardMinutes: number;
  defaultXpReward: number;
  isMandatory: boolean;
  category: QuestCategory;
}

export interface KidProfile {
  name: string;
  avatar: string; // emoji
}

export interface TimerSession {
  startedAt: string; // ISO date string
  durationMinutes: number;
  approvedBy: 'parent';
}

export interface ParentSettings {
  pin: string; // 4-digit string
  dailyLimitMinutes: number;
  kidProfile: KidProfile;
}

export interface KidProgress {
  totalXp: number;
  currentLevel: number;
  currentLevelTitle: string;
  xpToNextLevel: number;
  xpThisLevel: number;
  streakDays: number;
  lastStreakDate: string;
}

export interface QuestRequest {
  id: string;
  kidName: string;
  requestedAt: string;
  libraryIds: string[];
  status: 'pending' | 'approved' | 'denied';
  respondedAt?: string;
}

export interface CheerMessage {
  id: string;
  text: string;
  emoji: string;
  sentAt: string;
  readAt?: string;
}

export interface AppState {
  quests: Quest[];
  settings: ParentSettings;
  totalEarnedMinutes: number;
  pendingApproval: boolean;
  timerActive: boolean;
  timerPaused: boolean;
  activeQuestId: string | null;
  timerElapsedSeconds: number;
  timerRemainingSeconds: number;
  timerSessions: TimerSession[];
  lastResetDate: string; // YYYY-MM-DD
  pinLockoutUntil: string | null;
  pinFailCount: number;
  progress: KidProgress;
  activeCheer: CheerMessage | null;
  questsLastSentAt: string | null;
  pendingQuestRequests: QuestRequest[];
  hasOnboarded: boolean;
}

export interface QuestStoreActions {
  completeQuest: (id: string) => void;
  uncompleteQuest: (id: string) => void;
  requestApproval: () => void;
  approveUnlock: () => void;
  denyUnlock: () => void;
  addQuest: (quest: Omit<Quest, 'id' | 'completed' | 'completedAt'>) => void;
  removeQuest: (id: string) => void;
  randomizeQuests: () => void;
  saveQuestsForKid: () => void;
  addQuestsFromLibrary: (libraryIds: string[]) => void;
  startTimer: () => void;
  startQuestTimer: (questId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  tickTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  resetDaily: () => void;
  updateSettings: (settings: Partial<ParentSettings>) => void;
  recordPinFail: () => void;
  resetPinFails: () => void;
  markCheerRead: () => void;
  approveQuestRequest: (requestId: string) => void;
  denyQuestRequest: (requestId: string) => void;
  sendCheer: (text: string, emoji: string) => void;
  submitQuestRequest: (libraryIds: string[]) => void;
  completeOnboarding: (kidName: string, avatar: string, pin: string) => void;
}
