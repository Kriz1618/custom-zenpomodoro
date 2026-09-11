import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimerDisplay } from '../../../src/components/Timer/TimerDisplay';
import { TimerControls } from '../../../src/components/Timer/TimerControls';
import { ModeSelector } from '../../../src/components/Timer/ModeSelector';

describe('when TimerDisplay is rendered', () => {
  it('should render time digits formatted correctly', () => {
    render(
      <TimerDisplay
        timeLeft={1500}
        progressPercent={0}
        mode="focus"
        isRunning={false}
        activeTask={null}
      />
    );

    expect(screen.getByTestId('time-digits')).toHaveTextContent('25:00');
    expect(screen.getByText('Deep Focus')).toBeInTheDocument();
  });

  it('should render active task title when anchored', () => {
    const mockTask = {
      id: '1',
      title: 'Design Zen Palette',
      estPomodoros: 2,
      completedPomodoros: 0,
      category: 'design' as any,
      isCompleted: false,
      createdAt: Date.now(),
    };

    render(
      <TimerDisplay
        timeLeft={300}
        progressPercent={50}
        mode="shortBreak"
        isRunning={true}
        activeTask={mockTask}
      />
    );

    expect(screen.getByText('Design Zen Palette')).toBeInTheDocument();
  });
});

describe('when TimerControls is rendered', () => {
  it('should call toggle, reset, skip, and time adjust callbacks on click', () => {
    const onToggle = vi.fn();
    const onReset = vi.fn();
    const onSkip = vi.fn();
    const onAdjustTime = vi.fn();

    render(
      <TimerControls
        isRunning={false}
        onToggle={onToggle}
        onReset={onReset}
        onSkip={onSkip}
        onAdjustTime={onAdjustTime}
      />
    );

    fireEvent.click(screen.getByTitle('Start Timer'));
    expect(onToggle).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle('Reset Timer'));
    expect(onReset).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle('Skip Session'));
    expect(onSkip).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle('Add 5 Minutes'));
    expect(onAdjustTime).toHaveBeenCalledWith(5);
  });
});

describe('when ModeSelector is rendered', () => {
  it('should render all mode buttons and trigger selection', () => {
    const onSelectMode = vi.fn();
    render(<ModeSelector currentMode="focus" onSelectMode={onSelectMode} />);

    fireEvent.click(screen.getByText('Short Break'));
    expect(onSelectMode).toHaveBeenCalledWith('shortBreak');
  });
});
