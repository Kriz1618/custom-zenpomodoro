import React from 'react';
import { AmbientTrack } from '../../types/pomodoro';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { X, Volume2, VolumeX, CloudRain, Waves, Trees, Flame, Coffee, Play, Pause } from 'lucide-react';

interface AmbientSoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: AmbientTrack[];
  masterMute: boolean;
  onToggleTrack: (id: string) => void;
  onUpdateVolume: (id: string, volume: number) => void;
  onToggleMasterMute: () => void;
  onStopAll: () => void;
}

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({
  isOpen,
  onClose,
  tracks,
  masterMute,
  onToggleTrack,
  onUpdateVolume,
  onToggleMasterMute,
  onStopAll,
}) => {
  if (!isOpen) return null;

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="icon-md" />;
      case 'Waves':
        return <Waves className="icon-md" />;
      case 'Trees':
        return <Trees className="icon-md" />;
      case 'Flame':
        return <Flame className="icon-md" />;
      case 'Coffee':
      default:
        return <Coffee className="icon-md" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <GlassCard className="modal-card ambient-mixer-card" variant="glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Volume2 className="modal-header-icon" />
            <h3>Zen Ambient Soundscapes</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="icon-sm" />
          </Button>
        </div>

        <div className="mixer-toolbar">
          <Button
            variant={masterMute ? 'danger' : 'secondary'}
            size="sm"
            onClick={onToggleMasterMute}
          >
            {masterMute ? <VolumeX className="icon-xs" /> : <Volume2 className="icon-xs" />}
            <span>{masterMute ? 'Muted' : 'Master Mute'}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={onStopAll}>
            Stop All
          </Button>
        </div>

        <div className="tracks-grid">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`track-card ${track.isPlaying && !masterMute ? 'is-playing' : ''}`}
            >
              <div className="track-info">
                <div className="track-icon-wrapper">{getTrackIcon(track.iconName)}</div>
                <span className="track-name">{track.name}</span>
              </div>

              <div className="track-controls">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleTrack(track.id)}
                  className="track-play-btn"
                  title={track.isPlaying ? 'Pause sound' : 'Play sound'}
                >
                  {track.isPlaying && !masterMute ? (
                    <Pause className="icon-sm" />
                  ) : (
                    <Play className="icon-sm fill-current" />
                  )}
                </Button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={track.volume}
                  onChange={(e) => onUpdateVolume(track.id, parseFloat(e.target.value))}
                  className="volume-slider"
                  disabled={!track.isPlaying || masterMute}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
