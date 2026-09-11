import React, { useState } from 'react';
import { TimerSettings } from '../../types/pomodoro';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { X, Settings as SettingsIcon, Volume2, Save, Play } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSaveSettings: (newSettings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formState, setFormState] = useState<TimerSettings>(settings);

  if (!isOpen) return null;

  const handleChange = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formState);
    onClose();
  };

  const testChimeSound = () => {
    audioSynth.playChime(formState.soundChime, formState.soundVolume);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <GlassCard className="modal-card settings-card" variant="glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <SettingsIcon className="modal-header-icon" />
            <h3>Timer Preferences</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="icon-sm" />
          </Button>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          <div className="settings-section">
            <h4 className="section-title">Timer Durations (minutes)</h4>
            <div className="durations-grid">
              <div className="form-group">
                <label>Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formState.focusTime}
                  onChange={(e) => handleChange('focusTime', parseInt(e.target.value) || 25)}
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formState.shortBreakTime}
                  onChange={(e) => handleChange('shortBreakTime', parseInt(e.target.value) || 5)}
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formState.longBreakTime}
                  onChange={(e) => handleChange('longBreakTime', parseInt(e.target.value) || 15)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4 className="section-title">Interval & Automation</h4>
            <div className="form-group">
              <label>Long Break Interval (Pomodoros)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formState.longBreakInterval}
                onChange={(e) => handleChange('longBreakInterval', parseInt(e.target.value) || 4)}
                className="glass-input"
              />
            </div>

            <div className="toggle-group">
              <label className="toggle-label">
                <span>Auto-start Breaks</span>
                <input
                  type="checkbox"
                  checked={formState.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                  className="glass-checkbox"
                />
              </label>

              <label className="toggle-label">
                <span>Auto-start Focus Sessions</span>
                <input
                  type="checkbox"
                  checked={formState.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                  className="glass-checkbox"
                />
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h4 className="section-title">Completion Alert Sound</h4>
            <div className="sound-setting-row">
              <div className="form-group flex-1">
                <label>Chime Sound</label>
                <select
                  value={formState.soundChime}
                  onChange={(e) => handleChange('soundChime', e.target.value as any)}
                  className="glass-select"
                >
                  <option value="zenBell">Zen Bell</option>
                  <option value="singingBowl">Tibetan Singing Bowl</option>
                  <option value="softChime">Soft Major Triad Chime</option>
                </select>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={testChimeSound}
                className="test-sound-btn"
                title="Test Chime Sound"
              >
                <Play className="icon-xs fill-current" />
                <span>Test</span>
              </Button>
            </div>

            <div className="form-group">
              <label>
                <Volume2 className="icon-xs inline-icon" /> Volume ({Math.round(formState.soundVolume * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formState.soundVolume}
                onChange={(e) => handleChange('soundVolume', parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Save className="icon-sm" />
              <span>Save Preferences</span>
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
