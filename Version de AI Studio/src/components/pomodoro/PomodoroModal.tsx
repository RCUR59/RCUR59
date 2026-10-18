import React from 'react';
import { useApp } from '../../context/AppContext';
import { PomodoroView } from './PomodoroView';
import { X } from 'lucide-react';

export const PomodoroModal: React.FC = () => {
  const { isPomodoroModalOpen, setIsPomodoroModalOpen } = useApp();

  if (!isPomodoroModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={() => setIsPomodoroModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <PomodoroView />
      </div>
    </div>
  );
};
