import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePomodoroTimer } from '../../src/hooks/usePomodoroTimer';
import { DEFAULT_SETTINGS } from '../../src/utils/storage';

describe('when usePomodoroTimer is initialized', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default focus mode and 25 minutes (1500 seconds)', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings: DEFAULT_SETTINGS })
    );

    expect(result.current.mode).toBe('focus');
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start, pause, and toggle timer state', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings: DEFAULT_SETTINGS })
    );

    act(() => {
      result.current.startTimer();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(1497);

    act(() => {
      result.current.pauseTimer();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('should switch timer modes cleanly', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings: DEFAULT_SETTINGS })
    );

    act(() => {
      result.current.switchMode('shortBreak');
    });
    expect(result.current.mode).toBe('shortBreak');
    expect(result.current.timeLeft).toBe(300);

    act(() => {
      result.current.switchMode('longBreak');
    });
    expect(result.current.mode).toBe('longBreak');
    expect(result.current.timeLeft).toBe(900);
  });

  it('should reset timer duration', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings: DEFAULT_SETTINGS })
    );

    act(() => {
      result.current.startTimer();
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current.timeLeft).toBe(1490);

    act(() => {
      result.current.resetTimer();
    });
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it('should adjust time with +5 / -5 minute controls', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings: DEFAULT_SETTINGS })
    );

    act(() => {
      result.current.adjustTime(5);
    });
    expect(result.current.timeLeft).toBe(1800);

    act(() => {
      result.current.adjustTime(-10);
    });
    expect(result.current.timeLeft).toBe(1200);
  });
});
