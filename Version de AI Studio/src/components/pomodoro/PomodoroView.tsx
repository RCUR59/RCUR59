import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, CheckCircle2, Flame, Bell } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const PomodoroView: React.FC = () => {
  const {
    tasks,
    activePomodoroTask,
    setActivePomodoroTask,
    incrementTaskPomodoro,
    settings,
  } = useApp();

  type Mode = 'work' | 'shortBreak' | 'longBreak';
  const [mode, setMode] = useState<Mode>('work');

  const workDuration = (settings.workMinutesPomodoro || 25) * 60;
  const shortBreakDuration = (settings.breakMinutesPomodoro || 5) * 60;
  const longBreakDuration = 15 * 60;

  const getDurationForMode = (m: Mode) => {
    if (m === 'work') return workDuration;
    if (m === 'shortBreak') return shortBreakDuration;
    return longBreakDuration;
  };

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState(3);

  // Sync mode changes
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sounds.playBell();

      if (mode === 'work') {
        setSessionsCompletedToday((c) => c + 1);
        if (activePomodoroTask) {
          incrementTaskPomodoro(activePomodoroTask.id);
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, activePomodoroTask, incrementTaskPomodoro]);

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentDuration = getDurationForMode(mode);
  const progressPercent = Math.round(((currentDuration - timeLeft) / currentDuration) * 100);

  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center pb-2 border-b border-neutral-200">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Enfoque Pomodoro
        </h1>
        <p className="text-sm text-neutral-500">
          Bloques de concentración profunda con descansos deliberados
        </p>
      </div>

      {/* Main Focus Box */}
      <div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col items-center">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl mb-8">
          <button
            onClick={() => handleModeChange('work')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'work'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Enfoque ({Math.round(workDuration / 60)}m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'shortBreak'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Descanso Corto ({Math.round(shortBreakDuration / 60)}m)
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'longBreak'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Descanso Largo (15m)
          </button>
        </div>

        {/* Big Digital Display */}
        <div className="my-4 text-center">
          <div className="text-7xl sm:text-8xl font-mono font-bold tracking-tighter text-neutral-900 tabular-nums">
            {formattedTime}
          </div>
          <p className="text-xs text-neutral-400 mt-2 font-medium uppercase tracking-wider">
            {isRunning ? 'Sesión en curso...' : 'Pausado'}
          </p>
        </div>

        {/* Subtle Progress Bar */}
        <div className="w-64 bg-neutral-100 h-1.5 rounded-full overflow-hidden my-6">
          <div
            className="bg-neutral-900 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={toggleStartPause}
            className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xs ${
              isRunning
                ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar Enfoque</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            title="Reiniciar temporizador"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Task Assignment */}
        <div className="w-full pt-6 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-600 mb-2 text-center">
            Tarea Asignada a este Bloque
          </label>
          <div className="max-w-md mx-auto">
            <select
              value={activePomodoroTask?.id || ''}
              onChange={(e) => {
                const found = tasks.find((t) => t.id === e.target.value) || null;
                setActivePomodoroTask(found);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800 text-center"
            >
              <option value="">— Ninguna tarea específica (Enfoque libre) —</option>
              {pendingTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center">
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
            Sesiones de Hoy
          </span>
          <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {sessionsCompletedToday} bloques
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 text-center">
          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">
            Tiempo de Enfoque Hoy
          </span>
          <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {Math.round((sessionsCompletedToday * workDuration) / 60)} minutos
          </span>
        </div>
      </div>
    </div>
  );
};
