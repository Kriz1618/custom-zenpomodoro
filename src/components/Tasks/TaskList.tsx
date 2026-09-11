import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskFilter } from '../../types/pomodoro';
import { TaskItem } from './TaskItem';
import { AddTaskModal } from './AddTaskModal';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { Plus, ListTodo, CheckCircle2, RotateCcw } from 'lucide-react';
import { getStoredTaskFilter, setStoredTaskFilter } from '../../utils/storage';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectActiveTask: (id: string) => void;
  onToggleCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (title: string, estPomodoros: number, category: TaskCategory) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onToggleCompleteTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<TaskFilter>(() => getStoredTaskFilter());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setStoredTaskFilter(filter);
  }, [filter]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'done') return task.isCompleted;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.isCompleted).length;

  return (
    <GlassCard className="tasks-card" variant="default">
      <div className="tasks-header">
        <div className="tasks-title-group">
          <ListTodo className="title-icon" />
          <h3>Focus Tasks</h3>
          <span className="task-badge-count">{activeCount}</span>
        </div>

        <div className="tasks-header-actions">
          <div className="filter-pill-group">
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
              onClick={() => setFilter('done')}
            >
              Done
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilter('active')}
            title="Reset filter to Active"
            aria-label="Reset filter to Active"
            className="filter-reset-btn"
          >
            <RotateCcw className="icon-xs" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="add-task-header-btn"
          >
            <Plus className="icon-sm" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      <div className="tasks-list-container">
        {filteredTasks.length === 0 ? (
          <div className="tasks-empty-state">
            <CheckCircle2 className="empty-icon text-muted" />
            <p className="empty-title">
              {filter === 'done'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'All caught up! Add a task to focus on.'
                : 'No tasks found.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={task.id === activeTaskId}
              onSelectActive={onSelectActiveTask}
              onToggleComplete={onToggleCompleteTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={onAddTask}
      />
    </GlassCard>
  );
};
