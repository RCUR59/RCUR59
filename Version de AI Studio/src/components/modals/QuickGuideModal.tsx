import React from 'react';
import { X, CheckCircle2, ArrowRight, User, CheckSquare, Wallet, HeartPulse, Target, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenAddTask: () => void;
  onOpenAddTransaction: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenAddTask,
  onOpenAddTransaction,
}) => {
  const { setActiveTab, setIsPomodoroModalOpen } = useApp();

  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      title: 'Personaliza tu Perfil y Moneda',
      desc: 'Ve a Ajustes para poner tu nombre, tu moneda preferida (€, $, etc.) y tu límite de presupuesto mensual.',
      actionLabel: 'Abrir Ajustes',
      action: () => {
        onClose();
        onOpenSettings();
      },
      icon: User,
    },
    {
      step: '2',
      title: 'Anota tus 3 Prioridades de Hoy',
      desc: 'Agrega las tareas más importantes del día. Si son urgentes o estratégicas, márcalas para verlas en la Matriz Eisenhower.',
      actionLabel: 'Crear Tarea',
      action: () => {
        onClose();
        onOpenAddTask();
      },
      icon: CheckSquare,
    },
    {
      step: '3',
      title: 'Lleva el Registro de Salud y Hábitos',
      desc: 'Haz clic en los vasos de agua para sumar hidratación (+250ml), selecciona tu estado de ánimo con 1 clic y marca tus hábitos diarios.',
      actionLabel: 'Ir a Salud',
      action: () => {
        onClose();
        setActiveTab('health');
      },
      icon: HeartPulse,
    },
    {
      step: '4',
      title: 'Controla tus Finanzas y Metas',
      desc: 'Registra tus gastos del mes para saber si estás dentro de presupuesto y haz aportes rápidos a tus fondos de ahorro.',
      actionLabel: 'Registrar Gasto',
      action: () => {
        onClose();
        onOpenAddTransaction();
      },
      icon: Wallet,
    },
    {
      step: '5',
      title: 'Trabaja con Enfoque Pomodoro',
      desc: 'Elige una tarea y arranca un bloque de 25 minutos con sonidos suaves para evitar distracciones.',
      actionLabel: 'Abrir Pomodoro',
      action: () => {
        onClose();
        setIsPomodoroModalOpen(true);
      },
      icon: Timer,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Guía de Inicio Rápido
            </h2>
            <p className="text-xs text-neutral-500">
              Cómo aprovechar tu Life OS al máximo en 5 sencillos pasos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-neutral-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                  <button
                    onClick={item.action}
                    className="mt-2 text-xs font-semibold text-neutral-900 hover:text-neutral-700 inline-flex items-center gap-1 group"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Tus datos se guardan automáticamente en tu navegador.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            ¡Entendido, empezar!
          </button>
        </div>
      </div>
    </div>
  );
};
