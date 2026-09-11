import React from 'react';
import { Volume2, Wind, BarChart3, Settings as SettingsIcon, Flame } from 'lucide-react';
import { Button } from './UI/Button';

interface HeaderProps {
  activeAmbientCount: number;
  dailyStreak: number;
  completedPomodoros: number;
  onOpenAmbient: () => void;
  onOpenBreathing: () => void;
  onOpenAnalytics: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeAmbientCount,
  dailyStreak,
  completedPomodoros,
  onOpenAmbient,
  onOpenBreathing,
  onOpenAnalytics,
  onOpenSettings,
}) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <Wind className="brand-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-title">ZenPomodoro</span>
          <span className="brand-subtitle">Serene Focus & Flow</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Streak & Sessions Pill */}
        <div className="streak-badge" title="Daily Streak & Sessions Completed">
          <Flame className="streak-icon" />
          <span className="streak-text">{dailyStreak}d streak</span>
          <span className="badge-divider">•</span>
          <span className="sessions-text">{completedPomodoros} 🧘</span>
        </div>

        {/* Ambient Audio Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenAmbient}
          title="Ambient Sound Mixer"
          className="header-btn"
        >
          <Volume2 className="icon-md" />
          {activeAmbientCount > 0 && (
            <span className="active-dot" />
          )}
        </Button>

        {/* Breathing Guide Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenBreathing}
          title="Mindful Breathing Guide"
          className="header-btn"
        >
          <Wind className="icon-md" />
        </Button>

        {/* Analytics Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenAnalytics}
          title="Productivity Insights"
          className="header-btn"
        >
          <BarChart3 className="icon-md" />
        </Button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          title="Timer Settings"
          className="header-btn"
        >
          <SettingsIcon className="icon-md" />
        </Button>
      </div>
    </header>
  );
};
