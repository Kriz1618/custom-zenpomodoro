/**
 * Formats total seconds into MM:SS format.
 * Example: 1500 -> "25:00", 65 -> "01:05"
 */
export function formatTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  return `${formattedMins}:${formattedSecs}`;
}

/**
 * Converts minutes to hours and minutes string format.
 * Example: 90 -> "1h 30m", 45 -> "45m"
 */
export function formatDuration(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
