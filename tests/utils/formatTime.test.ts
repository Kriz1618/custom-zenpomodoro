import { describe, it, expect } from 'vitest';
import { formatTime, formatDuration, getTodayDateString } from '../../src/utils/formatTime';

describe('when formatTime is called', () => {
  it('should format seconds to MM:SS correctly', () => {
    expect(formatTime(1500)).toBe('25:00');
    expect(formatTime(300)).toBe('05:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(9)).toBe('00:09');
    expect(formatTime(0)).toBe('00:00');
  });

  it('should handle negative or invalid values gracefully', () => {
    expect(formatTime(-10)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
  });
});

describe('when formatDuration is called', () => {
  it('should format minutes into human readable hours and minutes', () => {
    expect(formatDuration(150)).toBe('2h 30m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(0)).toBe('0m');
  });
});

describe('when getTodayDateString is called', () => {
  it('should return valid YYYY-MM-DD date string', () => {
    const today = getTodayDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
