import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeArea } from '../../types';
import { X, Trash2 } from 'lucide-react';
import { getTodayDateString } from '../../utils/formatters';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useApp();
  const todayStr = getTodayDateString();

  const [title, setTitle] = useState('');
  const [area, setArea] = useState<LifeArea>('Carrera');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [notes, setNotes] = useState('');
  const [milestones, setMilestones] = useState<string[]>([]);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (newMilestoneInput.trim()) {
      setMilestones([...milestones, newMilestoneInput.trim()]);
      setNewMilestoneInput('');
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      area,
      targetDate,
      progress: 0,
      status: 'en_progreso',
      notes: notes.trim() || undefined,
      milestones: milestones.map((m, idx) => ({
        id: `ms-${Date.now()}-${idx}`,
        title: m,
        completed: false,
      })),
    });

    setTitle('');
    setNotes('');
    setMilestones([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Nuevo Objetivo Personal</h2>
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
              Nombre de la meta u objetivo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Aumentar patrimonio un 20%, Correr media maratón..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Área de Vida
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as LifeArea)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                <option value="Carrera">Carrera & Negocios</option>
                <option value="Finanzas">Finanzas & Patrimonio</option>
                <option value="Salud">Salud & Físico</option>
                <option value="Crecimiento">Crecimiento Personal</option>
                <option value="Relaciones">Relaciones & Familia</option>
                <option value="Estilo de Vida">Estilo de Vida & Ocio</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Fecha objetivo
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              ¿Por qué es importante este objetivo? (Motivación)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Claridad en el propósito y beneficios directos..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
            />
          </div>

          {/* Milestones */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Hitos medibles / Checkpoints ({milestones.length})
            </label>
            <div className="flex items-center gap-1.5 mb-2">
              <input
                type="text"
                value={newMilestoneInput}
                onChange={(e) => setNewMilestoneInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Ej: Completar primera fase..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-neutral-700"
              >
                + Añadir
              </button>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-200/60"
                  >
                    <span className="text-neutral-800">{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(i)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              Crear Objetivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
