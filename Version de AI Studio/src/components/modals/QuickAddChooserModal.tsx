import React from 'react';
import { X, CheckSquare, Wallet, Repeat, Target, HeartPulse } from 'lucide-react';

interface QuickAddChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'task' | 'transaction' | 'habit' | 'goal' | 'health') => void;
}

export const QuickAddChooserModal: React.FC<QuickAddChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'task' as const,
      title: 'Nueva Tarea',
      desc: 'Planifica un pendiente con prioridad y fecha',
      icon: CheckSquare,
      color: 'text-neutral-900',
    },
    {
      id: 'transaction' as const,
      title: 'Movimiento Financiero',
      desc: 'Registra un gasto o ingreso al presupuesto',
      icon: Wallet,
      color: 'text-emerald-700',
    },
    {
      id: 'habit' as const,
      title: 'Nuevo Hábito',
      desc: 'Crea una rutina diaria para construir racha',
      icon: Repeat,
      color: 'text-amber-600',
    },
    {
      id: 'goal' as const,
      title: 'Objetivo Vital',
      desc: 'Define una meta a medio/largo plazo con hitos',
      icon: Target,
      color: 'text-blue-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-sm w-full">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">¿Qué deseas registrar?</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-1.5">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onClose();
                  onSelectAction(opt.id);
                }}
                className="w-full flex items-start gap-3 p-3 rounded-xl border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-neutral-100 mt-0.5">
                  <Icon className={`w-4 h-4 ${opt.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 leading-snug">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
