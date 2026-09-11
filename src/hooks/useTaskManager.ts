import { useState, useEffect, useCallback } from 'react';
import { Task, TaskCategory } from '../types/pomodoro';
import { getStoredTasks, setStoredTasks, getStoredActiveTaskId, setStoredActiveTaskId } from '../utils/storage';
import { audioSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

export function useTaskManager() {
  const storedTasks = getStoredTasks();
  const [tasks, setTasks] = useState<Task[]>(storedTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    const storedTaskId = getStoredActiveTaskId();
    if (storedTaskId && storedTasks.some((task) => task.id === storedTaskId && !task.isCompleted)) {
      return storedTaskId;
    }
    const active = storedTasks.find((task) => !task.isCompleted);
    return active ? active.id : null;
  });

  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    setStoredActiveTaskId(activeTaskId);
  }, [activeTaskId]);

  const addTask = useCallback((title: string, estPomodoros: number, category: TaskCategory) => {
    const createdAt = Date.now();
    const newTask: Task = {
      id: String(createdAt),
      title: title.trim(),
      estPomodoros: Math.max(1, estPomodoros),
      completedPomodoros: 0,
      category,
      isCompleted: false,
      createdAt,
    };

    setTasks((prev) => [newTask, ...prev]);
    setActiveTaskId(newTask.id);
  }, []);

  const toggleTaskCompleted = useCallback((id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const nextCompleted = !task.isCompleted;
    if (nextCompleted) {
      audioSynth.playSuccessSound(0.6);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#344e41', '#a3b18a', '#dad7cd', '#e9c46a'],
        });
      } catch (e) {}
    }

    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? Date.now() : undefined,
        };
      })
    );

    if (activeTaskId === id && nextCompleted) {
      setActiveTaskId(null);
    }
  }, [activeTaskId, tasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setActiveTaskId((prev) => (prev === id ? null : prev));
  }, []);

  const incrementActiveTaskPomodoro = useCallback(() => {
    const activeTask = tasks.find((task) => task.id === activeTaskId && !task.isCompleted);
    if (!activeTask) return;

    const nextCount = activeTask.completedPomodoros + 1;
    const isDone = nextCount >= activeTask.estPomodoros;

    if (isDone) {
      audioSynth.playSuccessSound(0.7);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== activeTaskId) return task;
        return {
          ...task,
          completedPomodoros: nextCount,
          isCompleted: task.isCompleted || isDone,
          completedAt: task.completedAt ?? (isDone ? Date.now() : undefined),
        };
      })
    );

    if (isDone) {
      setActiveTaskId(null);
    }
  }, [activeTaskId, tasks]);

  const activeTask = tasks.find((task) => task.id === activeTaskId && !task.isCompleted) || null;

  return {
    tasks,
    activeTaskId,
    activeTask,
    setActiveTaskId,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    incrementActiveTaskPomodoro,
  };
}
