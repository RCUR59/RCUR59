import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HabitCategory } from '../../types';
import {
  Flame,
  Award,
  Plus,
  Trash2,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getLastNDays, getTodayDateString } from '../../utils/formatters';

interface HabitsViewProps {
  onOpenAddHabit: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({ onOpenAddHabit }) => {
  const { habits, toggleHabitForDate, deleteHabit } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const days = getLastNDays(7);
  const todayStr = getTodayDateString();

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory !== 'Todas' && h.category !== selectedCategory) return false;
    return true;
  });

  const categories: (HabitCategory | 'Todas')[] = [
    'Todas',
    'Salud',
    'Productividad',
    'Mente',
    'Crecimiento',
  ];

  // Consistency metrics
  const totalSlots = habits.length * 7;
  const completedSlots = habits.reduce((acc, h) => {
    const hits = days.filter((d) => h.completedDates.includes(d.date)).length;
    return acc + hits;
  }, 0);
  const consistencyPercent = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Hábitos Diarios
          </h1>
          <p className="text-sm text-neutral-500">
            Construye consistencia a través de micro-victorias repetidas
          </p>
        </div>

        <button
          onClick={onOpenAddHabit}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Hábito</span>
        </button>
      </div>

      {/* Consistency Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Consistencia Semanal
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {consistencyPercent}%
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${consistencyPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Mejor Racha Activa
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>
              {Math.max(...habits.map((h) => h.currentStreak), 0)} días seguidos
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Récord histórico: {Math.max(...habits.map((h) => h.bestStreak), 0)} días
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Hábitos Rastreados
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {habits.length} activos
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            {habits.filter((h) => h.completedDates.includes(todayStr)).length} completados hoy
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits 7-Day Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 border-b border-neutral-200 bg-neutral-50/70 text-xs font-medium text-neutral-500">
          <div className="col-span-5 md:col-span-4">Hábito / Categoría</div>
          <div className="col-span-2 hidden md:block text-center">Rachas</div>
          <div className="col-span-6 md:col-span-5 flex justify-end gap-1.5 sm:gap-3 text-center">
            {days.map((d) => (
              <div
                key={d.date}
                className={`w-7 sm:w-8 text-center ${
                  d.isToday ? 'font-bold text-neutral-900' : 'text-neutral-500'
                }`}
              >
                <div className="text-[10px] uppercase">{d.dayName}</div>
                <div className="font-mono tabular-nums">{d.dayNum}</div>
              </div>
            ))}
            <div className="w-6 shrink-0" />
          </div>
          <div className="col-span-1 hidden md:block text-right">Acción</div>
        </div>

        {/* Table Body */}
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-400">
            No hay hábitos registrados en esta categoría.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredHabits.map((habit) => {
              return (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 gap-2 p-3.5 items-center hover:bg-neutral-50/50 transition-colors"
                >
                  {/* Title & Category */}
                  <div className="col-span-5 md:col-span-4 min-w-0 pr-2">
                    <div className="text-sm font-semibold text-neutral-900 truncate">
                      {habit.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5">
                      <span>{habit.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Meta: {habit.targetDaysPerWeek} días/sem
                      </span>
                    </div>
                  </div>

                  {/* Streaks (desktop) */}
                  <div className="col-span-2 hidden md:flex items-center justify-center gap-3 text-xs font-mono tabular-nums">
                    <span className="text-amber-600 font-semibold" title="Racha actual">
                      🔥 {habit.currentStreak}d
                    </span>
                    <span className="text-neutral-400" title="Mejor racha">
                      🏆 {habit.bestStreak}d
                    </span>
                  </div>

                  {/* 7-Day checkboxes */}
                  <div className="col-span-6 md:col-span-5 flex justify-end gap-1.5 sm:gap-3 items-center">
                    {days.map((d) => {
                      const isDone = habit.completedDates.includes(d.date);
                      return (
                        <button
                          key={d.date}
                          onClick={() => toggleHabitForDate(habit.id, d.date)}
                          title={`${d.date} - ${isDone ? 'Completado' : 'Pendiente'}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-amber-500 text-white shadow-xs'
                              : d.isToday
                              ? 'border-2 border-neutral-300 hover:border-neutral-500 bg-white'
                              : 'border border-neutral-200 hover:border-neutral-400 bg-neutral-50'
                          }`}
                        >
                          {isDone && <Check className="w-4 h-4 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 hidden md:flex justify-end">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition-colors"
                      title="Eliminar hábito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
