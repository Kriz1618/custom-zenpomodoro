import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TimerSettings } from '../types/pomodoro';
import { formatTime } from '../utils/formatTime';
import { audioSynth } from '../utils/audioSynth';

interface UsePomodoroTimerOptions {
  settings: TimerSettings;
  onSessionComplete?: (completedMode: TimerMode, durationMinutes: number) => void;
}

export function usePomodoroTimer({ settings, onSessionComplete }: UsePomodoroTimerOptions) {
  const [mode, setModeState] = useState<TimerMode>('focus');
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Calculate target duration in seconds for current mode
  const getModeDurationSeconds = useCallback(
    (targetMode: TimerMode): number => {
      switch (targetMode) {
        case 'focus':
          return settings.focusTime * 60;
        case 'shortBreak':
          return settings.shortBreakTime * 60;
        case 'longBreak':
          return settings.longBreakTime * 60;
      }
    },
    [settings.focusTime, settings.shortBreakTime, settings.longBreakTime]
  );

  const [timeLeft, setTimeLeft] = useState<number>(() => getModeDurationSeconds('focus'));

  // Sync time left if settings change while timer is not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getModeDurationSeconds(mode));
    }
  }, [settings, mode, getModeDurationSeconds, isRunning]);

  // Document Title update
  useEffect(() => {
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `${formatTime(timeLeft)} • ${modeLabel} | ZenPomodoro`;
  }, [timeLeft, mode]);

  // Handle timer completion
  const handleTimerFinished = useCallback(() => {
    setIsRunning(false);

    // Play chime sound
    audioSynth.playChime(settings.soundChime, settings.soundVolume);

    // Browser Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const title = mode === 'focus' ? 'Focus session completed! 🧘' : 'Break finished! Time to reset 🌿';
      const body = mode === 'focus' ? 'Great work! Take a well-deserved break.' : 'Ready to start your next focus session?';
      new Notification(title, { body });
    }

    const completedDurationMins = Math.round(getModeDurationSeconds(mode) / 60);
    onSessionComplete?.(mode, completedDurationMins);

    // Auto-advance mode logic
    if (mode === 'focus') {
      const nextCount = completedPomodoros + 1;
      setCompletedPomodoros(nextCount);

      if (nextCount % settings.longBreakInterval === 0) {
        setModeState('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      } else {
        setModeState('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
        if (settings.autoStartBreaks) setIsRunning(true);
      }
    } else {
      setModeState('focus');
      setTimeLeft(settings.focusTime * 60);
      if (settings.autoStartPomodoros) setIsRunning(true);
    }
  }, [mode, completedPomodoros, settings, getModeDurationSeconds, onSessionComplete]);

  // Interval timer tick
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleTimerFinished]);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const toggleTimer = useCallback(() => setIsRunning((prev) => !prev), []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getModeDurationSeconds(mode));
  }, [mode, getModeDurationSeconds]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setIsRunning(false);
      setModeState(newMode);
      setTimeLeft(getModeDurationSeconds(newMode));
    },
    [getModeDurationSeconds]
  );

  const skipMode = useCallback(() => {
    setIsRunning(false);
    if (mode === 'focus') {
      const nextCount = completedPomodoros + 1;
      setCompletedPomodoros(nextCount);
      const nextMode = nextCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
    } else {
      switchMode('focus');
    }
  }, [mode, completedPomodoros, settings.longBreakInterval, switchMode]);

  const adjustTime = useCallback((minutesChange: number) => {
    setTimeLeft((prev) => Math.max(0, prev + minutesChange * 60));
  }, []);

  const totalDuration = getModeDurationSeconds(mode);
  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return {
    mode,
    timeLeft,
    isRunning,
    completedPomodoros,
    progressPercent,
    totalDuration,
    startTimer,
    pauseTimer,
    toggleTimer,
    resetTimer,
    switchMode,
    skipMode,
    adjustTime,
  };
}
