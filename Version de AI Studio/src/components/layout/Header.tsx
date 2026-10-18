import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Clock, SlidersHorizontal } from 'lucide-react';
import { formatDateSpanish, getTodayDateString } from '../../utils/formatters';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAdd, onOpenSettings, onOpenGuide }) => {
  const { setIsPomodoroModalOpen } = useApp();
  const todayStr = getTodayDateString();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 bg-white border-b border-neutral-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="#home" className="text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap">
          Vitanova
        </a>
        <span className="hidden sm:inline-block text-xs text-neutral-400">/</span>
        <span className="hidden sm:inline-block text-xs font-medium text-neutral-500 whitespace-nowrap">
          {formatDateSpanish(todayStr)}
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links (desktop) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
        <span className="text-xs text-neutral-400 font-normal">
          Centro Integral de Administración Personal
        </span>
      </nav>

      {/* Zone 3: Actions adhering to strict contract */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
          title="Guía de inicio rápido"
        >
          <span className="hidden sm:inline">Guía de Inicio</span>
          <span className="sm:hidden">Guía</span>
        </button>

        <button
          onClick={() => setIsPomodoroModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
          title="Abrir temporizador Pomodoro"
        >
          <Clock className="w-3.5 h-3.5 text-neutral-600" />
          <span className="hidden sm:inline">Pomodoro</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
          title="Ajustes y respaldo"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
          <span className="hidden sm:inline">Ajustes</span>
        </button>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Registro</span>
        </button>
      </div>
    </header>
  );
};
