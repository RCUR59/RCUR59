import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HabitCategory } from '../../types';
import { X } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const { addHabit } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Salud');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      category,
      targetDaysPerWeek: Number(targetDaysPerWeek),
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Nuevo Hábito Diario</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Nombre del hábito *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Beber 2L de agua, Meditación 10 min..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Área / Dimensión
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                <option value="Salud">Salud</option>
                <option value="Productividad">Productividad</option>
                <option value="Mente">Mente & Bienestar</option>
                <option value="Crecimiento">Crecimiento</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Frecuencia objetivo
              </label>
              <select
                value={targetDaysPerWeek}
                onChange={(e) => setTargetDaysPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-mono tabular-nums"
              >
                <option value={7}>Todos los días (7/7)</option>
                <option value={6}>6 días por semana</option>
                <option value={5}>Días laborables (5/7)</option>
                <option value={4}>4 días por semana</option>
                <option value={3}>3 días por semana</option>
              </select>
            </div>
          </div>

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
              Crear Hábito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
