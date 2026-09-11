import React from 'react';
import { Task } from '../../types/pomodoro';
import { CheckCircle2, Circle, Trash2, Anchor, Briefcase, BookOpen, User, Palette } from 'lucide-react';
import { Button } from '../UI/Button';

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onSelectActive: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isActive,
  onSelectActive,
  onToggleComplete,
  onDelete,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work':
        return <Briefcase className="icon-xs" />;
      case 'study':
        return <BookOpen className="icon-xs" />;
      case 'creative':
        return <Palette className="icon-xs" />;
      case 'personal':
      default:
        return <User className="icon-xs" />;
    }
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'is-completed' : ''} ${isActive ? 'is-active-task' : ''}`}>
      <button
        type="button"
        className="task-checkbox-btn"
        onClick={() => onToggleComplete(task.id)}
        title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.isCompleted ? (
          <CheckCircle2 className="checkbox-icon checked" />
        ) : (
          <Circle className="checkbox-icon unchecked" />
        )}
      </button>

      <div className="task-content" onClick={() => !task.isCompleted && onSelectActive(task.id)}>
        <span className="task-title">{task.title}</span>
<div className="task-meta">
            <span className={`task-tag tag-${task.category}`}>
              {getCategoryIcon(task.category)}
              <span>{task.category}</span>
            </span>
            <span className="pomodoro-counter">
              {task.completedPomodoros}/{task.estPomodoros} 🍅
            </span>
            {task.isCompleted && task.completedAt && (
              <span className="task-completed-date">
                {new Date(task.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
      </div>

      <div className="task-actions">
        {!task.isCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectActive(task.id)}
            title={isActive ? 'Currently Anchored Task' : 'Anchor to current Timer session'}
            className={`anchor-btn ${isActive ? 'active-anchor' : ''}`}
          >
            <Anchor className="icon-xs" />
            <span className="anchor-text">{isActive ? 'Active' : 'Anchor'}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
          className="delete-task-btn"
        >
          <Trash2 className="icon-xs text-muted" />
        </Button>
      </div>
    </div>
  );
};
