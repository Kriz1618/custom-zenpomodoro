import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { X, Wind, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setPhase('inhale');
      setSecondsLeft(4);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Advance phase (4-7-8 breathing technique)
            if (phase === 'inhale') {
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 8;
            } else if (phase === 'exhale') {
              setCyclesCompleted((c) => c + 1);
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase]);

  if (!isOpen) return null;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In Slowly...';
      case 'hold':
        return 'Hold Your Breath...';
      case 'exhale':
        return 'Exhale Gently...';
      default:
        return 'Get Ready...';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <GlassCard className="modal-card breathing-card" variant="glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Wind className="modal-header-icon" />
            <h3>Zen 4-7-8 Breathing Guide</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="icon-sm" />
          </Button>
        </div>

        <div className="breathing-content">
          {/* Animated Pulsing Circle */}
          <div className={`breathing-circle-container phase-${phase} ${isActive ? 'is-active' : ''}`}>
            <div className="breathing-outer-ring" />
            <div className="breathing-inner-circle">
              <span className="breathing-seconds">{secondsLeft}s</span>
              <span className="breathing-phase-label">{phase.toUpperCase()}</span>
            </div>
          </div>

          <h4 className="breathing-guide-prompt">{getPhaseText()}</h4>
          <p className="breathing-cycles-badge">Completed Cycles: {cyclesCompleted}</p>

          <div className="breathing-controls">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsActive(!isActive)}
              className="breathing-start-btn"
            >
              {isActive ? <Pause className="icon-sm" /> : <Play className="icon-sm fill-current" />}
              <span>{isActive ? 'Pause' : 'Start Exercise'}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsActive(false);
                setPhase('inhale');
                setSecondsLeft(4);
                setCyclesCompleted(0);
              }}
              title="Reset Exercise"
            >
              <RotateCcw className="icon-sm" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
