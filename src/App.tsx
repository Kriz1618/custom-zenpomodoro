import { useState, useCallback, useEffect } from 'react';
import { TimerMode, TimerSettings, AnalyticsData } from './types/pomodoro';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import { useTaskManager } from './hooks/useTaskManager';
import { useAmbientSound } from './hooks/useAmbientSound';
import { getStoredSettings, setStoredSettings, getStoredAnalytics, setStoredAnalytics } from './utils/storage';

import { Header } from './components/Header';
import { ModeSelector } from './components/Timer/ModeSelector';
import { TimerDisplay } from './components/Timer/TimerDisplay';
import { TimerControls } from './components/Timer/TimerControls';
import { TaskList } from './components/Tasks/TaskList';
import { AmbientSoundMixer } from './components/Ambient/AmbientSoundMixer';
import { BreathingModal } from './components/Breathing/BreathingModal';
import { AnalyticsModal } from './components/Analytics/AnalyticsModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { GlassCard } from './components/UI/GlassCard';

export function App() {
  const [settings, setSettings] = useState<TimerSettings>(getStoredSettings);
  const [analytics, setAnalytics] = useState<AnalyticsData>(getStoredAnalytics);

  // Modals state
  const [isAmbientOpen, setIsAmbientOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    tasks,
    activeTaskId,
    activeTask,
    setActiveTaskId,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    incrementActiveTaskPomodoro,
  } = useTaskManager();

  // Notification permission request on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Persist analytics
  useEffect(() => {
    setStoredAnalytics(analytics);
  }, [analytics]);

  // Sync completedTasks count from tasks to analytics
  useEffect(() => {
    setAnalytics((prev) => {
      const completedTasks = tasks.filter((task) => task.isCompleted).length;
      if (prev.completedTasks === completedTasks) return prev;
      return { ...prev, completedTasks };
    });
  }, [tasks]);

  const handleSessionComplete = useCallback(
    (completedMode: TimerMode, durationMinutes: number) => {
      if (completedMode === 'focus') {
        incrementActiveTaskPomodoro();

        setAnalytics((prev) => {
          const newTotal = prev.totalFocusMinutes + durationMinutes;
          const newSessions = prev.completedSessions + 1;
          const newLog = [
            {
              id: String(Date.now()),
              mode: completedMode,
              durationMinutes,
              completedAt: new Date().toISOString(),
              taskTitle: activeTask?.title,
            },
            ...prev.historyLog,
          ];
          return {
            ...prev,
            totalFocusMinutes: newTotal,
            completedSessions: newSessions,
            historyLog: newLog,
          };
        });
      }
    },
    [incrementActiveTaskPomodoro, activeTask]
  );

  const {
    mode,
    timeLeft,
    isRunning,
    completedPomodoros,
    progressPercent,
    toggleTimer,
    resetTimer,
    switchMode,
    skipMode,
    adjustTime,
  } = usePomodoroTimer({
    settings,
    onSessionComplete: handleSessionComplete,
  });

  const ambient = useAmbientSound();

  const handleSaveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setStoredSettings(newSettings);
  };

  return (
    <div className={`app-root theme-${mode}`}>
      <div className="background-ambient-glow" />

      <div className="app-container">
        <Header
          activeAmbientCount={ambient.activeTracksCount}
          dailyStreak={analytics.dailyStreak}
          completedPomodoros={completedPomodoros}
          onOpenAmbient={() => setIsAmbientOpen(true)}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="app-main">
          {/* Central Timer Card */}
          <GlassCard className="timer-hero-card" variant="glow">
            <ModeSelector currentMode={mode} onSelectMode={switchMode} />

            <TimerDisplay
              timeLeft={timeLeft}
              progressPercent={progressPercent}
              mode={mode}
              isRunning={isRunning}
              activeTask={activeTask}
            />

            <TimerControls
              isRunning={isRunning}
              onToggle={toggleTimer}
              onReset={resetTimer}
              onSkip={skipMode}
              onAdjustTime={adjustTime}
            />
          </GlassCard>

          {/* Integrated Focus Task Manager */}
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectActiveTask={setActiveTaskId}
            onToggleCompleteTask={toggleTaskCompleted}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
        </main>

        <footer className="app-footer">
          <p>ZenPomodoro • Designed for Calm Deep Work & Mindful Focus</p>
        </footer>
      </div>

      {/* Modals */}
      <AmbientSoundMixer
        isOpen={isAmbientOpen}
        onClose={() => setIsAmbientOpen(false)}
        tracks={ambient.tracks}
        masterMute={ambient.masterMute}
        onToggleTrack={ambient.toggleTrack}
        onUpdateVolume={ambient.updateTrackVolume}
        onToggleMasterMute={ambient.toggleMasterMute}
        onStopAll={ambient.stopAll}
      />

      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        analytics={analytics}
        tasks={tasks}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
