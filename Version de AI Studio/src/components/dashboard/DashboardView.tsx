import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  Droplets,
  Moon,
  Smile,
  BookOpen,
  DollarSign,
  Calendar,
  Flame,
} from 'lucide-react';
import {
  formatCurrency,
  formatDateFull,
  getMoodDetails,
  getTodayDateString,
} from '../../utils/formatters';
import { MoodScore, Task } from '../../types';

interface DashboardViewProps {
  onOpenAddTask: () => void;
  onOpenAddTransaction: () => void;
  onOpenGuide?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTask,
  onOpenAddTransaction,
  onOpenGuide,
}) => {
  const {
    tasks,
    habits,
    transactions,
    savingsGoals,
    goals,
    todayHealth,
    settings,
    setActiveTab,
    toggleTaskComplete,
    toggleHabitForDate,
    setMood,
    addWaterGlass,
    removeWaterGlass,
    setActivePomodoroTask,
    setIsPomodoroModalOpen,
    journal,
    saveJournalEntry,
  } = useApp();

  const todayStr = getTodayDateString();

  // Tasks calculations
  const todayTasks = tasks.filter(
    (t) => t.dueDate === todayStr || (!t.completed && t.urgent)
  );
  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;
  const tasksProgress = todayTasks.length > 0
    ? Math.round((completedTodayTasks / todayTasks.length) * 100)
    : 100;

  // Habits calculations
  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter((h) =>
    h.completedDates.includes(todayStr)
  ).length;
  const habitsProgress = totalHabits > 0
    ? Math.round((completedHabitsToday / totalHabits) * 100)
    : 100;

  // Finances calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
    : 0;

  // Key goal
  const primaryGoal = goals.find((g) => g.status === 'en_progreso') || goals[0];
  const nextMilestone = primaryGoal?.milestones.find((m) => !m.completed);

  // Journal entry state for today
  const existingJournal = journal.find((j) => j.date === todayStr);
  const [journalContent, setJournalContent] = useState(existingJournal?.content || '');
  const [journalSaved, setJournalSaved] = useState(false);

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    saveJournalEntry({
      date: todayStr,
      title: 'Reflexión diaria',
      content: journalContent,
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  const handleStartTaskPomodoro = (task: Task) => {
    setActivePomodoroTask(task);
    setIsPomodoroModalOpen(true);
  };

  const moodDetails = getMoodDetails(todayHealth.mood);

  return (
    <div className="space-y-6">
      {/* Welcome & Date Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Hola, {settings.userName}
            </h1>
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="px-2 py-0.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md font-medium transition-colors"
                title="Ver pasos recomendados para empezar"
              >
                ¿Cómo empezar?
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-500 capitalize">
            {formatDateFull(todayStr)}
          </p>
        </div>

        {/* Quick Mood Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-lg">
          <span className="text-xs text-neutral-500 font-medium px-2 hidden sm:inline">
            Estado de ánimo:
          </span>
          {([1, 2, 3, 4, 5] as MoodScore[]).map((score) => {
            const isSelected = todayHealth.mood === score;
            const mood = getMoodDetails(score);
            return (
              <button
                key={score}
                onClick={() => setMood(score)}
                title={mood.label}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  isSelected
                    ? `${mood.bgClass} font-semibold shadow-xs`
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span className="mr-1">{mood.emoji}</span>
                <span className="hidden md:inline">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Essential Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tareas de Hoy */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tareas de Hoy</span>
            <CheckCircle2 className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {completedTodayTasks} / {todayTasks.length}
            </div>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {tasksProgress}% listas
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-neutral-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${tasksProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Hábitos de Hoy */}
        <div
          onClick={() => setActiveTab('habits')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Hábitos Hoy</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {completedHabitsToday} / {totalHabits}
            </div>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {habitsProgress}% hechos
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${habitsProgress}%` }}
            />
          </div>
        </div>

        {/* Card 3: Balance Financiero */}
        <div
          onClick={() => setActiveTab('finances')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Balance Mensual</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {formatCurrency(netBalance, settings.currency)}
            </div>
            <span className="text-xs text-emerald-600 font-medium font-mono tabular-nums">
              {savingsRate}% ahorro
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-3 truncate font-mono tabular-nums">
            Gastos: {formatCurrency(totalExpenses, settings.currency)}
          </div>
        </div>

        {/* Card 4: Salud & Bienestar */}
        <div
          onClick={() => setActiveTab('health')}
          className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Salud & Energía</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {todayHealth.waterGlasses * 250} ml
            </div>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {todayHealth.sleepHours}h sueño
            </span>
          </div>
          <div className="text-xs text-neutral-500 mt-3 flex items-center justify-between">
            <span>Ánimo: {moodDetails.label}</span>
            <span className="font-mono tabular-nums">Energía {todayHealth.energyLevel}/10</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Actions, Tasks & Habits) & Right (Finances, Goals & Journal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tareas Prioritarias de Hoy */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <h2 className="text-base font-semibold text-neutral-900">
                  Prioridades de Hoy
                </h2>
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  ({todayTasks.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddTask}
                  className="flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 p-1 rounded hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-0.5"
                >
                  <span>Ver todas</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-sm">
                No tienes tareas programadas para hoy.
                <button
                  onClick={onOpenAddTask}
                  className="block mx-auto mt-2 text-xs text-neutral-900 font-medium underline"
                >
                  Crear una nueva tarea
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                      task.completed
                        ? 'bg-neutral-50/70 border-neutral-200/60 opacity-60'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            task.completed
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-900'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                          <span>{task.category}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.priority === 'alta'
                                ? 'text-rose-600 font-medium'
                                : task.priority === 'media'
                                ? 'text-amber-600'
                                : 'text-neutral-500'
                            }
                          >
                            Prioridad {task.priority}
                          </span>
                          {task.subtasks.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {task.subtasks.filter((s) => s.completed).length}/
                                {task.subtasks.length} pasos
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {!task.completed && (
                      <button
                        onClick={() => handleStartTaskPomodoro(task)}
                        title="Enfocar con Pomodoro"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors shrink-0"
                      >
                        <Play className="w-3 h-3 text-neutral-700" />
                        <span className="hidden sm:inline">Enfocar</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hábitos Rápidos de Hoy */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-neutral-900">
                  Rastreador de Hábitos
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-0.5"
              >
                <span>Ver historial</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habits.map((habit) => {
                const isCompleted = habit.completedDates.includes(todayStr);
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitForDate(habit.id, todayStr)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isCompleted
                        ? 'bg-amber-50/60 border-amber-200 text-neutral-900'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold truncate">
                        {habit.title}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                        <span>{habit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-amber-600 font-medium">
                          🔥 {habit.currentStreak} días
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isCompleted
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hidratación Rápida & Registro de Agua */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Hidratación Diaria
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums text-neutral-500">
                {todayHealth.waterGlasses} de {todayHealth.waterGoalGlasses} vasos
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: todayHealth.waterGoalGlasses }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-8 rounded-sm flex items-center justify-center text-xs transition-all ${
                      idx < todayHealth.waterGlasses
                        ? 'bg-blue-500 text-white shadow-xs'
                        : 'bg-neutral-200 text-neutral-400'
                    }`}
                    title={`Vaso ${idx + 1}`}
                  >
                    💧
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={removeWaterGlass}
                  disabled={todayHealth.waterGlasses <= 0}
                  className="w-7 h-7 rounded border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 disabled:opacity-40 flex items-center justify-center text-sm font-bold"
                  title="Restar vaso"
                >
                  -
                </button>
                <button
                  onClick={addWaterGlass}
                  className="w-7 h-7 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-xs"
                  title="Añadir vaso (+250ml)"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Objetivo Principal Activo */}
          {primaryGoal && (
            <div className="p-5 bg-white rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Objetivo Prioritario · {primaryGoal.area}
                </span>
                <span className="text-xs font-semibold text-neutral-900 font-mono tabular-nums">
                  {primaryGoal.progress}%
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 leading-snug mb-2">
                {primaryGoal.title}
              </h3>
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${primaryGoal.progress}%` }}
                />
              </div>

              {nextMilestone && (
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/80 text-xs">
                  <span className="text-neutral-500 block font-medium mb-0.5">
                    Próximo hito:
                  </span>
                  <span className="text-neutral-800">{nextMilestone.title}</span>
                </div>
              )}

              <button
                onClick={() => setActiveTab('goals')}
                className="mt-3 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
              >
                <span>Ver todos los objetivos</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Bitácora / Notas de Enfoque del Día */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Reflexión / Bitácora del Día
                </h3>
              </div>
              {journalSaved && (
                <span className="text-xs text-emerald-600 font-medium">
                  Guardado ✓
                </span>
              )}
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-2">
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="¿Qué lograste hoy? ¿En qué pondrás tu enfoque principal mañana?"
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800 placeholder-neutral-400 resize-none leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Guardar Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
