import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskCategory } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { getTodayDateString } from '../../utils/formatters';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useApp();
  const todayStr = getTodayDateString();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayStr);
  const [category, setCategory] = useState<TaskCategory>('Trabajo');
  const [priority, setPriority] = useState<Priority>('media');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(true);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([...subtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      dueDate,
      category,
      priority,
      urgent,
      important,
      subtasks: subtasks.map((st, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: st,
        completed: false,
      })),
      completedPomodoros: 0,
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setSubtasks([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Nueva Tarea</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Título de la tarea *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Revisar documentación del proyecto..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Descripción o notas adicionales
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre entregables, enlaces o contexto..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            />
          </div>

          {/* Category, Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Área / Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Salud">Salud</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Hogar">Hogar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Fecha de entrega
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          {/* Eisenhower flags */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2">
            <span className="font-semibold text-neutral-800 block">
              Clasificación Eisenhower
            </span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0"
                />
                <span className="text-neutral-700">¿Es Urgente? (Requiere acción inmediata)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0"
                />
                <span className="text-neutral-700">¿Es Importante? (Contribuye a metas)</span>
              </label>
            </div>
          </div>

          {/* Subtasks checklist */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Subtareas o Pasos accionables ({subtasks.length})
            </label>
            <div className="flex items-center gap-1.5 mb-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Añadir paso concreto..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-neutral-700"
              >
                + Añadir
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {subtasks.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-200/60"
                  >
                    <span className="text-neutral-800">{st}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg shadow-xs"
            >
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
