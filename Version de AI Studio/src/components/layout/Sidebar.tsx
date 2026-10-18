import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveNavTab } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  Wallet,
  HeartPulse,
  Target,
  Timer,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab, tasks, habits, settings } = useApp();

  // Compute pending counts for indicators
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingHabitsToday = habits.filter((h) => !h.completedDates.includes(todayStr)).length;

  const navItems: { id: ActiveNavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Centro de Control', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tareas & Proyectos', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'habits', label: 'Hábitos Diarios', icon: Repeat, badge: pendingHabitsToday },
    { id: 'finances', label: 'Finanzas & Gastos', icon: Wallet },
    { id: 'health', label: 'Salud & Bienestar', icon: HeartPulse },
    { id: 'goals', label: 'Objetivos Vitales', icon: Target },
    { id: 'pomodoro', label: 'Enfoque Pomodoro', icon: Timer },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-neutral-200 shrink-0 flex flex-col justify-between">
      {/* Top section: User greeting & Navigation */}
      <div className="p-4 space-y-6">
        {/* User Card */}
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {settings.userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-neutral-900 truncate">
                {settings.userName}
              </div>
              <div className="text-xs text-neutral-500 truncate">
                Life OS Activo
              </div>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded hover:bg-neutral-200/50 transition-colors"
            title="Ajustes de usuario"
          >
            Perfil
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Áreas Principales
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-neutral-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono tabular-nums ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom status widget: Quick Motivation / Life Balance quote */}
      <div className="p-4 border-t border-neutral-100">
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60 text-xs text-neutral-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-neutral-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Principio del Día</span>
          </div>
          <p className="text-neutral-500 leading-relaxed italic">
            "Lo que no se mide no se gestiona, y lo que se gestiona con intención florece."
          </p>
        </div>
      </div>
    </aside>
  );
};
