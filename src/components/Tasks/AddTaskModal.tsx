import React, { useState } from 'react';
import { TaskCategory } from '../../types/pomodoro';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { X, Plus, Target } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, estPomodoros: number, category: TaskCategory) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [estPomodoros, setEstPomodoros] = useState(2);
  const [category, setCategory] = useState<TaskCategory>('work');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title, estPomodoros, category);
    setTitle('');
    setEstPomodoros(2);
    setCategory('work');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <GlassCard className="modal-card" variant="glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Focus Task</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="icon-sm" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g., Write report or review code..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input"
              autoFocus
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Est. Pomodoros</label>
              <div className="est-pomodoro-picker">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEstPomodoros((prev) => Math.max(1, prev - 1))}
                >
                  -
                </Button>
                <span className="est-count">
                  <Target className="icon-xs inline-icon" /> {estPomodoros}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEstPomodoros((prev) => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="form-group flex-1">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="glass-select"
              >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="personal">Personal</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="icon-sm" />
              <span>Add Task</span>
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
