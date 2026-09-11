# ZenPomodoro

A serene, aesthetic Pomodoro timer & productivity suite built with React 19 and TypeScript. Features ambient sound mixing, task tracking with completion history, box breathing exercises, and detailed productivity analytics — all wrapped in a glassmorphism design with dynamic theme palettes.

![ZenPomodoro](https://img.shields.io/badge/status-complete-brightgreen)
![React 19](https://img.shields.io/badge/react-19-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.7-purple)
![Vite](https://img.shields.io/badge/vite-6.1-green)

## Features

- **Pomodoro Timer** — Focus, short break, and long break modes with SVG circular progress, adjustable times, skip, and reset controls
- **Task Manager** — Create, complete, and delete tasks with categories (Work, Study, Personal, Creative). Filter by Active / All / Done with persistent state
- **Ambient Sounds** — 5 sound tracks (Rain, Ocean Waves, Forest Breeze, Cozy Fire, Coffee Shop) with individual volume control and master mute
- **Box Breathing** — Guided 4-4-4-4 breathing exercise modal
- **Analytics Dashboard** — Real-time stats: total focus time, completed sessions, finished tasks, daily streak, and activity log with completion history
- **Browser Notifications** — Desktop notifications when a session completes
- **Confetti** — Celebration animation when tasks are completed
- **Persistence** — All settings, tasks, filter state, active task, and analytics saved to `localStorage`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript (strict mode) |
| **Build Tool** | Vite 6 |
| **Styling** | CSS3 with custom properties (glassmorphism) |
| **Testing** | Vitest + Testing Library |
| **Icons** | Lucide React |
| **Sound** | Web Audio API (synthesized) + canvas-confetti |
| **Fonts** | Outfit (numeric display) + Plus Jakarta Sans (UI) |

## Project Structure

```
src/
├── components/
│   ├── Analytics/          # AnalyticsModal — productivity insights & history
│   ├── Ambient/            # AmbientSoundMixer — sound track controls
│   ├── Breathing/          # BreathingModal — guided box breathing
│   ├── Header/             # App header with streaks, pomodoros, nav
│   ├── Settings/           # SettingsModal — timer & sound configuration
│   ├── Tasks/              # TaskList & TaskItem — task management
│   ├── Timer/              # TimerDisplay, TimerControls, ModeSelector
│   ├── UI/                 # GlassCard, Button shared components
│   └── ...
├── hooks/
│   ├── usePomodoroTimer    # Timer logic: tick, mode switching, session completion
│   ├── useTaskManager      # Task CRUD, completion with timestamps, active task persistence
│   └── useAmbientSound     # Ambient track state & Web Audio synthesis
├── types/
│   └── pomodoro.ts         # Shared type definitions (Task, TimerSettings, AnalyticsData, etc.)
├── utils/
│   ├── storage.ts          # localStorage helpers with typed keys
│   ├── formatTime.ts       # Time formatting utilities
│   └── audioSynth.ts       # Web Audio API synthesizer
├── App.tsx                 # Root component — orchestrates all hooks and modals
├── main.tsx                # Entry point
└── index.css               # Design system: CSS variables, glassmorphism, themes
```

### Key Design Decisions

- **Custom Hooks** — All business logic is encapsulated in `usePomodoroTimer`, `useTaskManager`, and `useAmbientSound`. The `App` component is a thin orchestrator.
- **CSS Variables for Theming** — Each timer mode (Focus, Short Break, Long Break) maps to a curated color palette via CSS custom properties, enabling instant theme transitions.
- **localStorage Persistence** — Every mutable state (settings, tasks, filter, active task ID, analytics) is synchronized to `localStorage` so the app restores exactly as left on reload.
- **Glassmorphism UI** — Consistent `backdrop-filter: blur(16px)`, semi-transparent backgrounds, and subtle border glows create a cohesive frosted-glass aesthetic.
- **Strict TypeScript** — `noUnusedLocals`, `noUnusedParameters`, `noEmit` enforced in `tsconfig.json`.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Usage

1. **Set your timer** — Configure focus/break durations in the Settings modal (default: 25/5/15 min)
2. **Add tasks** — Click "Add Task" to create focus targets with estimated pomodoros
3. **Start a session** — Select a mode (Focus / Short Break / Long Break) and press Play
4. **Track tasks** — Click a task to anchor it to the active timer; pomodoros increment automatically on session completion
5. **Complete tasks** — Toggle the checkbox or finish all estimated pomodoros — confetti celebrates 🎉
6. **View analytics** — Open the Analytics modal to see focus time, streaks, and completion history
7. **Add ambient sounds** — Open the Ambient mixer to layer background sounds for deeper focus
8. **Practice breathing** — Open the Breathing modal for a guided 4-4-4-4 exercise between sessions

## Testing

Tests use **Vitest** with **jsdom** environment and **Testing Library**. Key patterns:

- Timer tests use `vi.useFakeTimers()` with `vi.advanceTimersByTime(...)`
- `setupTests.ts` mocks Web Audio and Notification APIs
- All components tested with real React renders (no snapshot tests)

```bash
# Run all tests
pnpm test
```

## Browser Support

Modern browsers supporting ES2022, CSS custom properties, and `localStorage`. Notifications and Web Audio require HTTPS in production.
