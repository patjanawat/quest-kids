export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  rewardMinutes: number;
  completed: boolean;
  completedAt?: string; // ISO date string
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

export interface AppState {
  quests: Quest[];
  settings: ParentSettings;
  totalEarnedMinutes: number;
  pendingApproval: boolean;
  timerActive: boolean;
  timerRemainingSeconds: number;
  timerSessions: TimerSession[];
  lastResetDate: string; // YYYY-MM-DD
  pinLockoutUntil: string | null; // ISO date string or null
  pinFailCount: number;
}

export interface QuestStoreActions {
  completeQuest: (id: string) => void;
  uncompleteQuest: (id: string) => void;
  requestApproval: () => void;
  approveUnlock: () => void;
  denyUnlock: () => void;
  addQuest: (quest: Omit<Quest, 'id' | 'completed' | 'completedAt'>) => void;
  removeQuest: (id: string) => void;
  startTimer: () => void;
  tickTimer: () => void;
  stopTimer: () => void;
  resetDaily: () => void;
  updateSettings: (settings: Partial<ParentSettings>) => void;
  recordPinFail: () => void;
  resetPinFails: () => void;
}
