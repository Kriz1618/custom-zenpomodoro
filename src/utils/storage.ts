import { TimerSettings, Task, AnalyticsData, TaskFilter } from '../types/pomodoro';
import { getTodayDateString } from './formatTime';

const SETTINGS_KEY = 'zen_pomodoro_settings';
const TASKS_KEY = 'zen_pomodoro_tasks';
const TASK_FILTER_KEY = 'zen_pomodoro_task_filter';
const ACTIVE_TASK_KEY = 'zen_pomodoro_active_task';
const ANALYTICS_KEY = 'zen_pomodoro_analytics';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundVolume: 0.7,
  soundChime: 'zenBell',
};

export const DEFAULT_ANALYTICS: AnalyticsData = {
  totalFocusMinutes: 0,
  completedSessions: 0,
  completedTasks: 0,
  dailyStreak: 1,
  lastActiveDate: getTodayDateString(),
  historyLog: [],
};

export const DEFAULT_TASKS: Task[] = [];

export function getStoredSettings(): TimerSettings {
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? { ...DEFAULT_SETTINGS, ...JSON.parse(item) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
    return DEFAULT_SETTINGS;
  }
}

export function setStoredSettings(settings: TimerSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function getStoredTasks(): Task[] {
  try {
    const item = localStorage.getItem(TASKS_KEY);
    return item ? JSON.parse(item) : DEFAULT_TASKS;
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return DEFAULT_TASKS;
  }
}

export function setStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks from localStorage', e);
  }
}

export function getStoredTaskFilter(): TaskFilter {
  try {
    const item = localStorage.getItem(TASK_FILTER_KEY);
    if (!item) return 'active';
    const filter = JSON.parse(item) as TaskFilter;
    return filter === 'active' || filter === 'all' || filter === 'done' ? filter : 'active';
  } catch (e) {
    console.error('Error loading task filter from localStorage', e);
    return 'active';
  }
}

export function setStoredTaskFilter(filter: TaskFilter): void {
  try {
    localStorage.setItem(TASK_FILTER_KEY, JSON.stringify(filter));
  } catch (e) {
    console.error('Error saving task filter to localStorage', e);
  }
}

export function getStoredActiveTaskId(): string | null {
  try {
    const item = localStorage.getItem(ACTIVE_TASK_KEY);
    const taskId = item ? JSON.parse(item) : null;
    return typeof taskId === 'string' ? taskId : null;
  } catch (e) {
    console.error('Error loading active task from localStorage', e);
    return null;
  }
}

export function setStoredActiveTaskId(taskId: string | null): void {
  try {
    localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskId));
  } catch (e) {
    console.error('Error saving active task to localStorage', e);
  }
}

export function getStoredAnalytics(): AnalyticsData {

  try {
    const item = localStorage.getItem(ANALYTICS_KEY);
    if (!item) return DEFAULT_ANALYTICS;
    const data: AnalyticsData = JSON.parse(item);
    const today = getTodayDateString();

    // Calculate daily streak logic
    if (data.lastActiveDate !== today) {
      const lastDate = new Date(data.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        data.dailyStreak += 1;
      } else if (diffDays > 1) {
        data.dailyStreak = 1;
      }
      data.lastActiveDate = today;
    }
    return data;
  } catch (e) {
    console.error('Error loading analytics from localStorage', e);
    return DEFAULT_ANALYTICS;
  }
}

export function setStoredAnalytics(analytics: AnalyticsData): void {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error saving analytics to localStorage', e);
  }
}
