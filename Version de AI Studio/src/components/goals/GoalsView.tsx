import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeArea, PersonalGoal } from '../../types';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Check,
  Award,
} from 'lucide-react';
import { formatDateSpanish } from '../../utils/formatters';

interface GoalsViewProps {
  onOpenAddGoal: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ onOpenAddGoal }) => {
  const { goals, toggleMilestone, deleteGoal, updateGoal } = useApp();
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'en_progreso' | 'completado'>('all');

  const areas: (LifeArea | 'Todas')[] = [
    'Todas',
    'Carrera',
    'Finanzas',
    'Salud',
    'Crecimiento',
    'Relaciones',
    'Estilo de Vida',
  ];

  const filteredGoals = goals.filter((g) => {
    if (selectedArea !== 'Todas' && g.area !== selectedArea) return false;
    if (selectedStatus !== 'all' && g.status !== selectedStatus) return false;
    return true;
  });

  const completedGoalsCount = goals.filter((g) => g.status === 'completado').length;
  const inProgressGoalsCount = goals.filter((g) => g.status === 'en_progreso').length;

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Objetivos Vitales & Metas
          </h1>
          <p className="text-sm text-neutral-500">
            Alinea tus esfuerzos diarios con tu visión de vida a medio y largo plazo
          </p>
        </div>

        <button
          onClick={onOpenAddGoal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Objetivo</span>
        </button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Objetivos en Curso
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {inProgressGoalsCount}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Metas activas con hitos medibles
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Metas Alcanzadas
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>{completedGoalsCount} cumplidos</span>
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Logros consolidados
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Progreso Global Medio
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {goals.length > 0
              ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
              : 0}
            %
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Avance ponderado de todas las áreas
          </div>
        </div>
      </div>

      {/* Filters: Areas and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedArea === area
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg shrink-0">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedStatus === 'all'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedStatus('en_progreso')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedStatus === 'en_progreso'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            En Curso
          </button>
          <button
            onClick={() => setSelectedStatus('completado')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedStatus === 'completado'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cumplidos
          </button>
        </div>
      </div>

      {/* Goals Cards Grid */}
      {filteredGoals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500 text-sm">
            No hay objetivos registrados para esta área o estado.
          </p>
          <button
            onClick={onOpenAddGoal}
            className="mt-3 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear primer objetivo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;
            const isFinished = goal.status === 'completado';

            return (
              <div
                key={goal.id}
                className={`p-5 bg-white rounded-xl border transition-all ${
                  isFinished
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="font-medium text-neutral-700">{goal.area}</span>
                      <span aria-hidden="true">·</span>
                      <span>Fecha límite: {formatDateSpanish(goal.targetDate)}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          isFinished
                            ? 'text-emerald-700 font-semibold'
                            : 'text-neutral-600'
                        }
                      >
                        {isFinished ? 'Cumplido' : 'En curso'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 leading-snug">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition-colors shrink-0"
                    title="Eliminar objetivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Notes */}
                {goal.notes && (
                  <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                    {goal.notes}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Progreso medible:</span>
                    <span className="font-mono tabular-nums font-bold text-neutral-900">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isFinished ? 'bg-emerald-600' : 'bg-neutral-900'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones / Checkpoints */}
                <div className="space-y-2 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>Hitos de Avance ({completedMilestones}/{goal.milestones.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-2.5 text-xs text-neutral-700"
                      >
                        <button
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                          className="text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          className={
                            milestone.completed
                              ? 'line-through text-neutral-400'
                              : 'text-neutral-800'
                          }
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
