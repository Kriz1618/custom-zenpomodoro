import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../../../src/components/Tasks/TaskList';
import { Task } from '../../../src/types/pomodoro';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Write project proposal',
    estPomodoros: 3,
    completedPomodoros: 1,
    category: 'work',
    isCompleted: false,
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Read research paper',
    estPomodoros: 2,
    completedPomodoros: 2,
    category: 'study',
    isCompleted: true,
    createdAt: Date.now() - 1000,
    completedAt: Date.now() - 500,
  },
];

describe('when TaskList is rendered', () => {
  it('should render active tasks by default', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        activeTaskId="1"
        onSelectActiveTask={vi.fn()}
        onToggleCompleteTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onAddTask={vi.fn()}
      />
    );

    expect(screen.getByText('Write project proposal')).toBeInTheDocument();
    expect(screen.queryByText('Read research paper')).not.toBeInTheDocument();
  });

  it('should switch filter tabs to display all or completed tasks', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        activeTaskId="1"
        onSelectActiveTask={vi.fn()}
        onToggleCompleteTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onAddTask={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Read research paper')).toBeInTheDocument();

    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText('Write project proposal')).toBeInTheDocument();
    expect(screen.getByText('Read research paper')).toBeInTheDocument();
  });

  it('should trigger task completion toggle and deletion', () => {
    const onToggleComplete = vi.fn();
    const onDelete = vi.fn();

    render(
      <TaskList
        tasks={sampleTasks}
        activeTaskId="1"
        onSelectActiveTask={vi.fn()}
        onToggleCompleteTask={onToggleComplete}
        onDeleteTask={onDelete}
        onAddTask={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTitle('Mark complete'));
    expect(onToggleComplete).toHaveBeenCalledWith('1');

    fireEvent.click(screen.getAllByTitle('Delete Task')[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should reset filter to active when reset button is clicked', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        activeTaskId="1"
        onSelectActiveTask={vi.fn()}
        onToggleCompleteTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onAddTask={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Read research paper')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Reset filter to Active'));
    expect(screen.getByText('Write project proposal')).toBeInTheDocument();
    expect(screen.queryByText('Read research paper')).not.toBeInTheDocument();
  });
});
