import React from 'react';
import { TimerMode, Task } from '../../types/pomodoro';
import { formatTime } from '../../utils/formatTime';
import { Sparkles } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  progressPercent: number;
  mode: TimerMode;
  isRunning: boolean;
  activeTask: Task | null;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  progressPercent,
  mode,
  isRunning,
  activeTask,
}) => {
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const modeTitle =
    mode === 'focus' ? 'Deep Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Rest';

  return (
    <div className={`timer-display-wrapper ${mode}-theme ${isRunning ? 'is-running' : ''}`}>
      <svg className="timer-svg" viewBox="0 0 320 320">
        <defs>
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#344e41" />
            <stop offset="50%" stopColor="#52796f" />
            <stop offset="100%" stopColor="#a3b18a" />
          </linearGradient>

          <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a373" />
            <stop offset="50%" stopColor="#faedcd" />
            <stop offset="100%" stopColor="#ccd5ae" />
          </linearGradient>

          <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7b75a6" />
            <stop offset="50%" stopColor="#9a8c98" />
            <stop offset="100%" stopColor="#c9ada7" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer background track */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          className="timer-track"
          strokeWidth="10"
        />

        {/* Animated progress ring */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          className="timer-progress"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={`url(#${mode}Gradient)`}
          filter="url(#glow)"
        />
      </svg>

      {/* Central Content */}
      <div className="timer-inner-content">
        <div className="mode-badge">
          <Sparkles className="badge-sparkle" />
          <span>{modeTitle}</span>
        </div>

        <div className="time-digits" data-testid="time-digits">
          {formatTime(timeLeft)}
        </div>

        {activeTask ? (
          <div className="active-task-anchor" title={activeTask.title}>
            <span className="task-anchor-dot" />
            <span className="task-anchor-text">{activeTask.title}</span>
          </div>
        ) : (
          <div className="active-task-placeholder">
            <span>Select a task to anchor session</span>
          </div>
        )}
      </div>
    </div>
  );
};
