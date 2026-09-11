import React from 'react';
import { TimerMode } from '../../types/pomodoro';
import { Button } from '../UI/Button';
import { Target, Coffee, Moon } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  return (
    <div className="mode-selector-container">
      <Button
        variant="pill"
        active={currentMode === 'focus'}
        onClick={() => onSelectMode('focus')}
        className="mode-btn focus-mode-btn"
      >
        <Target className="icon-sm" />
        <span>Focus</span>
      </Button>

      <Button
        variant="pill"
        active={currentMode === 'shortBreak'}
        onClick={() => onSelectMode('shortBreak')}
        className="mode-btn short-mode-btn"
      >
        <Coffee className="icon-sm" />
        <span>Short Break</span>
      </Button>

      <Button
        variant="pill"
        active={currentMode === 'longBreak'}
        onClick={() => onSelectMode('longBreak')}
        className="mode-btn long-mode-btn"
      >
        <Moon className="icon-sm" />
        <span>Long Break</span>
      </Button>
    </div>
  );
};
