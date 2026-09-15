import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTaskManager } from '../../src/hooks/useTaskManager';
import { Task } from '../../src/types/pomodoro';
import * as storage from '../../src/utils/storage';

vi.mock('../../src/utils/audioSynth', () => ({
  audioSynth: {
    playSuccessSound: vi.fn(),
  },
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(() => {}),
}));

vi.mock('../../src/utils/storage', () => ({
  getStoredTasks: vi.fn(() => []),
  setStoredTasks: vi.fn(),
  getStoredActiveTaskId: vi.fn(() => null),
  setStoredActiveTaskId: vi.fn(),
}));

describe('when useTaskManager is initialized', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty tasks and no active task', () => {
    const { result } = renderHook(() => useTaskManager());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.activeTaskId).toBeNull();
    expect(result.current.activeTask).toBeNull();
  });

  it('should restore tasks from storage', () => {
    const storedTasks: Task[] = [
      {
        id: '1',
        title: 'Stored Task',
        estPomodoros: 3,
        completedPomodoros: 0,
        category: 'work',
        isCompleted: false,
        createdAt: 1000,
      },
    ];
    vi.mocked(storage.getStoredTasks).mockReturnValue(storedTasks);

    const { result } = renderHook(() => useTaskManager());

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Stored Task');
  });

  it('should restore activeTaskId from storage when task exists and is not completed', () => {
    const storedTasks: Task[] = [
      {
        id: '1',
        title: 'Active Task',
        estPomodoros: 2,
        completedPomodoros: 0,
        category: 'study',
        isCompleted: false,
        createdAt: 1000,
      },
    ];
    vi.mocked(storage.getStoredTasks).mockReturnValue(storedTasks);
    vi.mocked(storage.getStoredActiveTaskId).mockReturnValue('1');

    const { result } = renderHook(() => useTaskManager());

    expect(result.current.activeTaskId).toBe('1');
    expect(result.current.activeTask?.title).toBe('Active Task');
  });

  it('should not restore activeTaskId if stored task is completed', () => {
    const storedTasks: Task[] = [
      {
        id: '1',
        title: 'Completed Task',
        estPomodoros: 2,
        completedPomodoros: 2,
        category: 'work',
        isCompleted: true,
        createdAt: 1000,
      },
    ];
    vi.mocked(storage.getStoredTasks).mockReturnValue(storedTasks);
    vi.mocked(storage.getStoredActiveTaskId).mockReturnValue('1');

    const { result } = renderHook(() => useTaskManager());

    expect(result.current.activeTaskId).toBeNull();
    expect(result.current.activeTask).toBeNull();
  });
});

describe('when addTask is called', () => {
  it('should add a new task and set it as active', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('New Task', 3, 'work');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('New Task');
    expect(result.current.tasks[0].estPomodoros).toBe(3);
    expect(result.current.tasks[0].category).toBe('work');
    expect(result.current.tasks[0].isCompleted).toBe(false);
    expect(result.current.activeTaskId).toBe(result.current.tasks[0].id);
  });

  it('should prepend new task to the list', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('First', 1, 'personal');
    });
    act(() => {
      result.current.addTask('Second', 2, 'study');
    });

    expect(result.current.tasks[0].title).toBe('Second');
    expect(result.current.tasks[1].title).toBe('First');
  });

  it('should trim title and clamp estPomodoros to minimum 1', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('  Trimmed  ', 0, 'creative');
    });

    expect(result.current.tasks[0].title).toBe('Trimmed');
    expect(result.current.tasks[0].estPomodoros).toBe(1);
  });
});

describe('when toggleTaskCompleted is called', () => {
  it('should mark a task as completed', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task to complete', 2, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTaskCompleted(taskId);
    });

    expect(result.current.tasks[0].isCompleted).toBe(true);
    expect(result.current.tasks[0].completedAt).toBeDefined();
  });

  it('should clear activeTaskId when the active task is completed', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Active Task', 2, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTaskCompleted(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it('should not clear activeTaskId when a non-active task is completed', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('First', 2, 'work');
    });
    const firstId = result.current.tasks[0].id;
    act(() => {
      result.current.addTask('Second', 1, 'study');
    });
    const secondId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTaskCompleted(firstId);
    });

    expect(result.current.activeTaskId).toBe(secondId);
  });

  it('should toggle back to incomplete', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task', 1, 'personal');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTaskCompleted(taskId);
    });
    expect(result.current.tasks[0].isCompleted).toBe(true);

    act(() => {
      result.current.toggleTaskCompleted(taskId);
    });
    expect(result.current.tasks[0].isCompleted).toBe(false);
    expect(result.current.tasks[0].completedAt).toBeUndefined();
  });

  it('should do nothing if task id does not exist', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.toggleTaskCompleted('nonexistent');
    });

    expect(result.current.tasks).toEqual([]);
  });
});

describe('when deleteTask is called', () => {
  it('should remove a task from the list', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task to delete', 2, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('should clear activeTaskId if the deleted task was active', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Active Task', 2, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.activeTaskId).toBeNull();
  });

  it('should keep activeTaskId when a different task is deleted', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('First', 2, 'work');
    });
    const firstId = result.current.tasks[0].id;
    act(() => {
      result.current.addTask('Second', 1, 'study');
    });
    const secondId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(firstId);
    });

    expect(result.current.activeTaskId).toBe(secondId);
  });
});

describe('when incrementActiveTaskPomodoro is called', () => {
  it('should increment completedPomodoros for the active task', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task', 5, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });

    expect(result.current.tasks[0].completedPomodoros).toBe(1);
  });

  it('should not increment when no active task', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('should mark task as completed when estPomodoros is reached', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task', 2, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });
    expect(result.current.tasks[0].isCompleted).toBe(false);

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });

    expect(result.current.tasks[0].completedPomodoros).toBe(2);
    expect(result.current.tasks[0].isCompleted).toBe(true);
    expect(result.current.activeTaskId).toBeNull();
  });

  it('should not increment a completed task', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('Task', 1, 'work');
    });
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });

    act(() => {
      result.current.incrementActiveTaskPomodoro();
    });

    expect(result.current.tasks[0].completedPomodoros).toBe(1);
  });
});
