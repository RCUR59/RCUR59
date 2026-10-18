/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { HabitsView } from './components/habits/HabitsView';
import { FinancesView } from './components/finances/FinancesView';
import { HealthView } from './components/health/HealthView';
import { GoalsView } from './components/goals/GoalsView';
import { PomodoroView } from './components/pomodoro/PomodoroView';
import { PomodoroModal } from './components/pomodoro/PomodoroModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { AddHabitModal } from './components/modals/AddHabitModal';
import { AddGoalModal } from './components/modals/AddGoalModal';
import { AddSavingsGoalModal } from './components/modals/AddSavingsGoalModal';
import { QuickAddChooserModal } from './components/modals/QuickAddChooserModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { QuickGuideModal } from './components/modals/QuickGuideModal';
import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  Wallet,
  HeartPulse,
  Target,
  Timer,
} from 'lucide-react';
import { ActiveNavTab } from './types';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddSavingsGoalOpen, setIsAddSavingsGoalOpen] = useState(false);
  const [isQuickChooserOpen, setIsQuickChooserOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleQuickAddSelect = (type: 'task' | 'transaction' | 'habit' | 'goal' | 'health') => {
    if (type === 'task') setIsAddTaskOpen(true);
    else if (type === 'transaction') setIsAddTransactionOpen(true);
    else if (type === 'habit') setIsAddHabitOpen(true);
    else if (type === 'goal') setIsAddGoalOpen(true);
    else if (type === 'health') setActiveTab('health');
  };

  const mobileTabs: { id: ActiveNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'habits', label: 'Hábitos', icon: Repeat },
    { id: 'finances', label: 'Finanzas', icon: Wallet },
    { id: 'health', label: 'Salud', icon: HeartPulse },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'pomodoro', label: 'Enfoque', icon: Timer },
  ];

  return (
    <div className="min-h-screen bg-neutral-100/50 flex flex-col text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenQuickAdd={() => setIsQuickChooserOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        {/* Sidebar Navigation */}
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView onOpenAddTask={() => setIsAddTaskOpen(true)} />
          )}

          {activeTab === 'habits' && (
            <HabitsView onOpenAddHabit={() => setIsAddHabitOpen(true)} />
          )}

          {activeTab === 'finances' && (
            <FinancesView
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
              onOpenAddSavingsGoal={() => setIsAddSavingsGoalOpen(true)}
            />
          )}

          {activeTab === 'health' && <HealthView />}

          {activeTab === 'goals' && (
            <GoalsView onOpenAddGoal={() => setIsAddGoalOpen(true)} />
          )}

          {activeTab === 'pomodoro' && <PomodoroView />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation (fits within 15% mobile viewport cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
                isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pop-in Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
      />

      <AddSavingsGoalModal
        isOpen={isAddSavingsGoalOpen}
        onClose={() => setIsAddSavingsGoalOpen(false)}
      />

      <QuickAddChooserModal
        isOpen={isQuickChooserOpen}
        onClose={() => setIsQuickChooserOpen(false)}
        onSelectAction={handleQuickAddSelect}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
      />

      <PomodoroModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
