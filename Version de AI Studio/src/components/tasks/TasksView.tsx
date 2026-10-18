import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskCategory } from '../../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Grid2X2,
  List,
} from 'lucide-react';
import { formatDateSpanish } from '../../utils/formatters';

interface TasksViewProps {
  onOpenAddTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenAddTask }) => {
  const {
    tasks,
    toggleTaskComplete,
    toggleSubtask,
    deleteTask,
    setActivePomodoroTask,
    setIsPomodoroModalOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'eisenhower'>('list');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartPomodoro = (task: Task) => {
    setActivePomodoroTask(task);
    setIsPomodoroModalOpen(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'Todas' && t.category !== categoryFilter) return false;
    if (statusFilter === 'pending' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const categories: (TaskCategory | 'Todas')[] = [
    'Todas',
    'Trabajo',
    'Personal',
    'Salud',
    'Finanzas',
    'Hogar',
  ];

  // Eisenhower quadrants
  const q1 = tasks.filter((t) => !t.completed && t.urgent && t.important);
  const q2 = tasks.filter((t) => !t.completed && !t.urgent && t.important);
  const q3 = tasks.filter((t) => !t.completed && t.urgent && !t.important);
  const q4 = tasks.filter((t) => !t.completed && !t.urgent && !t.important);

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top action and title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Tareas & Proyectos
          </h1>
          <p className="text-sm text-neutral-500">
            {pendingCount} tareas pendientes organizadas por prioridad y urgencia
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('eisenhower')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'eisenhower'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>Matriz Eisenhower</span>
            </button>
          </div>

          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-neutral-200">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tarea..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Status Segmented Control */}
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg shrink-0">
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Completadas
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Todas
              </button>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
              <p className="text-neutral-500 text-sm">
                No se encontraron tareas con los filtros actuales.
              </p>
              <button
                onClick={onOpenAddTask}
                className="mt-3 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear tarea ahora</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isExpanded = !!expandedTaskIds[task.id];
                const subtasksDone = task.subtasks.filter((s) => s.completed).length;

                return (
                  <div
                    key={task.id}
                    className={`p-4 bg-white rounded-xl border transition-all ${
                      task.completed
                        ? 'border-neutral-200 opacity-60 bg-neutral-50/40'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
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

                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-semibold ${
                              task.completed
                                ? 'line-through text-neutral-400'
                                : 'text-neutral-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          {task.description && (
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Clean unboxed metadata with separators */}
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-500">
                            <span>{task.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Vence: {formatDateSpanish(task.dueDate)}</span>
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
                            {task.urgent && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-rose-600 font-medium">Urgente</span>
                              </>
                            )}
                            {task.important && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-blue-600 font-medium">Importante</span>
                              </>
                            )}
                            {task.completedPomodoros !== undefined && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">
                                  🍅 {task.completedPomodoros} sesiones
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!task.completed && (
                          <button
                            onClick={() => handleStartPomodoro(task)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Iniciar sesión de enfoque"
                          >
                            <Play className="w-3 h-3 text-neutral-900" />
                            <span className="hidden sm:inline">Enfocar</span>
                          </button>
                        )}

                        {task.subtasks.length > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                            title="Ver subtareas"
                          >
                            <span className="font-mono tabular-nums">
                              {subtasksDone}/{task.subtasks.length}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition-colors"
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks Accordion */}
                    {isExpanded && task.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 pl-8 space-y-2">
                        {task.subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-2.5 text-xs text-neutral-700"
                          >
                            <button
                              onClick={() => toggleSubtask(task.id, subtask.id)}
                              className="text-neutral-400 hover:text-neutral-900 transition-colors"
                            >
                              {subtask.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <span
                              className={
                                subtask.completed
                                  ? 'line-through text-neutral-400'
                                  : 'text-neutral-800'
                              }
                            >
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Eisenhower Matrix View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1: Urgent & Important */}
          <div className="p-4 bg-white rounded-xl border border-rose-200/80">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-100">
              <div>
                <h3 className="text-sm font-bold text-rose-900">
                  1. Hacer Ya (Urgente e Importante)
                </h3>
                <p className="text-xs text-rose-600">
                  Crisis, entregas inmediatas y problemas apremiantes
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-rose-700 font-semibold">
                {q1.length}
              </span>
            </div>
            <div className="space-y-2">
              {q1.length === 0 ? (
                <div className="text-xs text-neutral-400 py-6 text-center italic">
                  Sin tareas en este cuadrante
                </div>
              ) : (
                q1.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-neutral-400 hover:text-neutral-900"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium text-neutral-900 truncate">
                        {t.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartPomodoro(t)}
                      className="p-1 text-neutral-600 hover:text-neutral-900"
                      title="Enfocar"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quadrant 2: Important, Not Urgent */}
          <div className="p-4 bg-white rounded-xl border border-blue-200/80">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-100">
              <div>
                <h3 className="text-sm font-bold text-blue-900">
                  2. Planificar (Importante, No Urgente)
                </h3>
                <p className="text-xs text-blue-600">
                  Desarrollo personal, salud, relaciones y visión a largo plazo
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-blue-700 font-semibold">
                {q2.length}
              </span>
            </div>
            <div className="space-y-2">
              {q2.length === 0 ? (
                <div className="text-xs text-neutral-400 py-6 text-center italic">
                  Sin tareas en este cuadrante
                </div>
              ) : (
                q2.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-neutral-400 hover:text-neutral-900"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium text-neutral-900 truncate">
                        {t.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartPomodoro(t)}
                      className="p-1 text-neutral-600 hover:text-neutral-900"
                      title="Enfocar"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quadrant 3: Urgent, Not Important */}
          <div className="p-4 bg-white rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-100">
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  3. Delegar / Rápido (Urgente, No Importante)
                </h3>
                <p className="text-xs text-amber-600">
                  Interrupciones, llamadas, favores menores y gestiones
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-amber-700 font-semibold">
                {q3.length}
              </span>
            </div>
            <div className="space-y-2">
              {q3.length === 0 ? (
                <div className="text-xs text-neutral-400 py-6 text-center italic">
                  Sin tareas en este cuadrante
                </div>
              ) : (
                q3.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-neutral-400 hover:text-neutral-900"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium text-neutral-900 truncate">
                        {t.title}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quadrant 4: Neither Urgent nor Important */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-bold text-neutral-700">
                  4. Eliminar / Reducir (Ni urgente ni importante)
                </h3>
                <p className="text-xs text-neutral-500">
                  Distracciones, tareas triviales y ladrones de tiempo
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-neutral-600 font-semibold">
                {q4.length}
              </span>
            </div>
            <div className="space-y-2">
              {q4.length === 0 ? (
                <div className="text-xs text-neutral-400 py-6 text-center italic">
                  Sin tareas en este cuadrante
                </div>
              ) : (
                q4.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        className="text-neutral-400 hover:text-neutral-900"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium text-neutral-900 truncate">
                        {t.title}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
