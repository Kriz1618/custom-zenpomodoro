import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsModal } from '../../../src/components/Analytics/AnalyticsModal';
import { Task } from '../../../src/types/pomodoro';
import { AnalyticsData } from '../../../src/types/pomodoro';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Write project proposal',
    estPomodoros: 3,
    completedPomodoros: 3,
    category: 'work',
    isCompleted: true,
    completedAt: Date.now() - 1000,
    createdAt: Date.now() - 2000,
  },
  {
    id: '2',
    title: 'Read research paper',
    estPomodoros: 2,
    completedPomodoros: 2,
    category: 'study',
    isCompleted: true,
    completedAt: Date.now() - 500,
    createdAt: Date.now() - 1500,
  },
  {
    id: '3',
    title: 'Incomplete task',
    estPomodoros: 2,
    completedPomodoros: 0,
    category: 'personal',
    isCompleted: false,
    createdAt: Date.now(),
  },
];

const mockAnalytics: AnalyticsData = {
  totalFocusMinutes: 120,
  completedSessions: 5,
  completedTasks: 2,
  dailyStreak: 3,
  lastActiveDate: '2025-01-15',
  historyLog: [
    {
      id: '1',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date().toISOString(),
      taskTitle: 'Write project proposal',
    },
  ],
};

describe('when AnalyticsModal is rendered', () => {
  it('should render analytics stats correctly', () => {
    render(
      <AnalyticsModal
        isOpen
        onClose={() => {}}
        analytics={mockAnalytics}
        tasks={mockTasks}
      />
    );

    expect(screen.getByText('2h')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3 Days')).toBeInTheDocument();
  });

  it('should render completed tasks history', () => {
    render(
      <AnalyticsModal
        isOpen
        onClose={() => {}}
        analytics={mockAnalytics}
        tasks={mockTasks}
      />
    );

    const taskTitles = screen.getAllByText('Write project proposal');
    expect(taskTitles.length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Read research paper').length).toBeGreaterThanOrEqual(1);
  });

  it('should not render incomplete tasks in completed tasks history', () => {
    render(
      <AnalyticsModal
        isOpen
        onClose={() => {}}
        analytics={mockAnalytics}
        tasks={mockTasks}
      />
    );

    expect(screen.queryByText('Incomplete task')).not.toBeInTheDocument();
  });

  it('should render activity log', () => {
    render(
      <AnalyticsModal
        isOpen
        onClose={() => {}}
        analytics={mockAnalytics}
        tasks={mockTasks}
      />
    );

    expect(screen.getByText('Focus')).toBeInTheDocument();
  });

  it('should render empty states when no data', () => {
    const emptyAnalytics: AnalyticsData = {
      ...mockAnalytics,
      historyLog: [],
    };
    const emptyTasks: Task[] = mockTasks.filter((t) => !t.isCompleted);

    render(
      <AnalyticsModal
        isOpen
        onClose={() => {}}
        analytics={emptyAnalytics}
        tasks={emptyTasks}
      />
    );

    expect(screen.getByText(/No completed tasks yet/)).toBeInTheDocument();
  });
});
