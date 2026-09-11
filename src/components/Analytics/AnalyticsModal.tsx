import React from 'react';
import { AnalyticsData, Task } from '../../types/pomodoro';
import { formatDuration } from '../../utils/formatTime';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { X, BarChart3, Clock, CheckCircle2, Flame, Award, History } from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsData;
  tasks: Task[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  analytics,
  tasks,
}) => {
  const completedTasksHistory = tasks
    .filter((t) => t.isCompleted && t.completedAt)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <GlassCard className="modal-card analytics-card" variant="glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <BarChart3 className="modal-header-icon" />
            <h3>Productivity Insights</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="icon-sm" />
          </Button>
        </div>

        <div className="analytics-stats-grid">
          <div className="stat-box">
            <Clock className="stat-icon text-emerald" />
            <div className="stat-details">
              <span className="stat-value">{formatDuration(analytics.totalFocusMinutes)}</span>
              <span className="stat-label">Total Focus Time</span>
            </div>
          </div>

          <div className="stat-box">
            <Award className="stat-icon text-amber" />
            <div className="stat-details">
              <span className="stat-value">{analytics.completedSessions}</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
          </div>

          <div className="stat-box">
            <CheckCircle2 className="stat-icon text-teal" />
            <div className="stat-details">
              <span className="stat-value">{analytics.completedTasks}</span>
              <span className="stat-label">Tasks Finished</span>
            </div>
          </div>

          <div className="stat-box">
            <Flame className="stat-icon text-rose" />
            <div className="stat-details">
              <span className="stat-value">{analytics.dailyStreak} Days</span>
              <span className="stat-label">Daily Streak</span>
            </div>
          </div>
        </div>

        <div className="analytics-history-section">
          <div className="history-header">
            <History className="icon-sm" />
            <h4>Recent Activity Log</h4>
          </div>

          {analytics.historyLog.length === 0 ? (
            <div className="history-empty">
              <p>No completed sessions recorded yet. Start a focus timer to log activity!</p>
            </div>
          ) : (
            <div className="history-list">
              {analytics.historyLog.slice(0, 8).map((log) => (
                <div key={log.id} className="history-item">
                  <div className="history-item-left">
                    <span className={`history-mode-pill mode-${log.mode}`}>
                      {log.mode === 'focus' ? 'Focus' : log.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </span>
                    {log.taskTitle && <span className="history-task-title">{log.taskTitle}</span>}
                  </div>
                  <div className="history-item-right">
                    <span className="history-duration">{log.durationMinutes} min</span>
                    <span className="history-date">
                      {new Date(log.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="analytics-history-section">
          <div className="history-header">
            <CheckCircle2 className="icon-sm" />
            <h4>Completed Tasks</h4>
          </div>

          {completedTasksHistory.length === 0 ? (
            <div className="history-empty">
              <p>No completed tasks yet. Mark a task as done to see it here!</p>
            </div>
          ) : (
            <div className="history-list">
              {completedTasksHistory.slice(0, 8).map((task) => (
                <div key={task.id} className="history-item">
                  <div className="history-item-left">
                    <span className="history-task-title">{task.title}</span>
                  </div>
                  <div className="history-item-right">
                    <span className="task-history-pomodoros">{task.completedPomodoros}/{task.estPomodoros} 🍅</span>
                    <span className="history-date">
                      {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
