import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Plus, Minus } from 'lucide-react';
import { Button } from '../UI/Button';

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onAdjustTime: (minutes: number) => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onToggle,
  onReset,
  onSkip,
  onAdjustTime,
}) => {
  return (
    <div className="timer-controls-container">
      {/* Subtract 5 min */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdjustTime(-5)}
        title="Subtract 5 Minutes"
        className="ctrl-btn sub-btn"
      >
        <Minus className="icon-sm" />
        <span className="ctrl-btn-label">5m</span>
      </Button>

      {/* Reset */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onReset}
        title="Reset Timer"
        className="ctrl-btn"
      >
        <RotateCcw className="icon-md" />
      </Button>

      {/* Play / Pause Hero Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onToggle}
        title={isRunning ? 'Pause Timer' : 'Start Timer'}
        className={`hero-play-btn ${isRunning ? 'is-playing' : ''}`}
      >
        {isRunning ? (
          <>
            <Pause className="icon-lg" />
            <span>PAUSE</span>
          </>
        ) : (
          <>
            <Play className="icon-lg fill-current" />
            <span>START</span>
          </>
        )}
      </Button>

      {/* Skip */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onSkip}
        title="Skip Session"
        className="ctrl-btn"
      >
        <SkipForward className="icon-md" />
      </Button>

      {/* Add 5 min */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdjustTime(5)}
        title="Add 5 Minutes"
        className="ctrl-btn add-btn"
      >
        <Plus className="icon-sm" />
        <span className="ctrl-btn-label">5m</span>
      </Button>
    </div>
  );
};
