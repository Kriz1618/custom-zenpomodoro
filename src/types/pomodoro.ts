export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type TaskCategory = 'work' | 'study' | 'personal' | 'creative';

export type TaskFilter = 'active' | 'all' | 'done';

export interface TimerSettings {
  focusTime: number; // in minutes
  shortBreakTime: number; // in minutes
  longBreakTime: number; // in minutes
  longBreakInterval: number; // pomodoros count before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundVolume: number; // 0 to 1
  soundChime: 'zenBell' | 'softChime' | 'singingBowl';
}

export interface Task {
  id: string;
  title: string;
  estPomodoros: number;
  completedPomodoros: number;
  category: TaskCategory;
  isCompleted: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface SessionHistoryLog {
  id: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: string; // ISO timestamp
  taskTitle?: string;
}

export interface AnalyticsData {
  totalFocusMinutes: number;
  completedSessions: number;
  completedTasks: number;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  historyLog: SessionHistoryLog[];
}

export interface AmbientTrack {
  id: string;
  name: string;
  iconName: 'CloudRain' | 'Waves' | 'Trees' | 'Flame' | 'Coffee';
  volume: number; // 0 to 1
  isPlaying: boolean;
}
