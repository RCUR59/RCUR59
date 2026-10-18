import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveNavTab,
  BudgetCategory,
  ExpenseCategory,
  Habit,
  HealthDailyLog,
  JournalEntry,
  MoodScore,
  PersonalGoal,
  SavingsGoal,
  SleepQuality,
  Task,
  Transaction,
  UserSettings,
} from '../types';
import {
  initialBudgetLimits,
  initialGoals,
  initialHabits,
  initialHealthLogs,
  initialJournal,
  initialSavingsGoals,
  initialTasks,
  initialTransactions,
  initialUserSettings,
} from '../data/initialData';
import { getTodayDateString } from '../utils/formatters';
import { sounds } from '../utils/audio';

const STORAGE_KEYS = {
  TASKS: 'vitanova_tasks_v1',
  HABITS: 'vitanova_habits_v1',
  TRANSACTIONS: 'vitanova_transactions_v1',
  BUDGETS: 'vitanova_budgets_v1',
  SAVINGS: 'vitanova_savings_v1',
  HEALTH: 'vitanova_health_v1',
  GOALS: 'vitanova_goals_v1',
  JOURNAL: 'vitanova_journal_v1',
  SETTINGS: 'vitanova_settings_v1',
};

interface AppContextType {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  budgetLimits: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  healthLogs: Record<string, HealthDailyLog>;
  goals: PersonalGoal[];
  journal: JournalEntry[];
  settings: UserSettings;

  // Active pomodoro state
  activePomodoroTask: Task | null;
  setActivePomodoroTask: (task: Task | null) => void;
  isPomodoroModalOpen: boolean;
  setIsPomodoroModalOpen: (open: boolean) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  incrementTaskPomodoro: (taskId: string) => void;

  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'completedDates'>) => void;
  toggleHabitForDate: (habitId: string, dateStr: string) => void;
  deleteHabit: (habitId: string) => void;

  // Finance actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudgetLimit: (category: ExpenseCategory, monthlyLimit: number) => void;
  contributeSavingsGoal: (goalId: string, amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteSavingsGoal: (id: string) => void;

  // Health actions
  todayHealth: HealthDailyLog;
  updateTodayHealth: (updates: Partial<HealthDailyLog>) => void;
  addWaterGlass: () => void;
  removeWaterGlass: () => void;
  setMood: (mood: MoodScore) => void;
  setSleepHours: (hours: number, quality: SleepQuality) => void;
  setWorkout: (minutes: number, type: string) => void;

  // Goals actions
  addGoal: (goal: Omit<PersonalGoal, 'id'>) => void;
  updateGoal: (goal: PersonalGoal) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  // Journal actions
  saveJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;

  // System & Settings
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEYS.TASKS, initialTasks));
  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage(STORAGE_KEYS.HABITS, initialHabits));
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, initialTransactions)
  );
  const [budgetLimits, setBudgetLimits] = useState<BudgetCategory[]>(() =>
    loadFromStorage(STORAGE_KEYS.BUDGETS, initialBudgetLimits)
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() =>
    loadFromStorage(STORAGE_KEYS.SAVINGS, initialSavingsGoals)
  );
  const [healthLogs, setHealthLogs] = useState<Record<string, HealthDailyLog>>(() =>
    loadFromStorage(STORAGE_KEYS.HEALTH, initialHealthLogs)
  );
  const [goals, setGoals] = useState<PersonalGoal[]>(() => loadFromStorage(STORAGE_KEYS.GOALS, initialGoals));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadFromStorage(STORAGE_KEYS.JOURNAL, initialJournal));
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, initialUserSettings)
  );

  const [activePomodoroTask, setActivePomodoroTask] = useState<Task | null>(null);
  const [isPomodoroModalOpen, setIsPomodoroModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgetLimits));
  }, [budgetLimits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthLogs));
  }, [healthLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Today's health log fallback
  const todayStr = getTodayDateString();
  const todayHealth: HealthDailyLog = healthLogs[todayStr] || {
    date: todayStr,
    waterGlasses: 0,
    waterGoalGlasses: settings.waterTargetGlasses || 8,
    sleepHours: 7,
    sleepQuality: 'bueno',
    workoutMinutes: 0,
    workoutType: 'Sin registrar',
    mood: 3,
    energyLevel: 7,
  };

  // Sound helper
  const playSound = (type: 'complete' | 'bell' | 'pop') => {
    if (!settings.soundEnabled) return;
    if (type === 'complete') sounds.playComplete();
    else if (type === 'bell') sounds.playBell();
    else if (type === 'pop') sounds.playPop();
  };

  // TASK ACTIONS
  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: getTodayDateString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    playSound('pop');
  };

  const updateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activePomodoroTask?.id === id) {
      setActivePomodoroTask(null);
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) playSound('complete');
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          // If all subtasks completed, mark task completed
          const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
          if (allCompleted && !t.completed) {
            playSound('complete');
          } else {
            playSound('pop');
          }
          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allCompleted ? true : t.completed,
          };
        }
        return t;
      })
    );
  };

  const incrementTaskPomodoro = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
          : t
      )
    );
    playSound('complete');
  };

  // HABIT ACTIONS
  const addHabit = (newHabitData: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
    playSound('pop');
  };

  const toggleHabitForDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        let updatedDates: string[];
        if (exists) {
          updatedDates = h.completedDates.filter((d) => d !== dateStr);
        } else {
          updatedDates = [...h.completedDates, dateStr].sort();
          playSound('pop');
        }

        // Calculate simple streak (last consecutive days ending at today or yesterday)
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (updatedDates.includes(ds)) {
            streak++;
          } else if (i === 0) {
            // If today is not completed, check if streak holds from yesterday
            continue;
          } else {
            break;
          }
        }

        const best = Math.max(h.bestStreak, streak);
        return {
          ...h,
          completedDates: updatedDates,
          currentStreak: streak,
          bestStreak: best,
        };
      })
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // FINANCE ACTIONS
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    playSound('pop');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudgetLimit = (category: ExpenseCategory, monthlyLimit: number) => {
    setBudgetLimits((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, monthlyLimit } : b));
      }
      return [...prev, { category, monthlyLimit }];
    });
  };

  const contributeSavingsGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const next = Math.max(0, g.currentAmount + amount);
          if (next >= g.targetAmount && g.currentAmount < g.targetAmount) {
            playSound('complete');
          } else {
            playSound('pop');
          }
          return { ...g, currentAmount: next };
        }
        return g;
      })
    );
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `sg-${Date.now()}`,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    playSound('pop');
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // HEALTH ACTIONS
  const updateTodayHealth = (updates: Partial<HealthDailyLog>) => {
    setHealthLogs((prev) => {
      const current = prev[todayStr] || todayHealth;
      return {
        ...prev,
        [todayStr]: { ...current, ...updates, date: todayStr },
      };
    });
  };

  const addWaterGlass = () => {
    updateTodayHealth({ waterGlasses: todayHealth.waterGlasses + 1 });
    playSound('pop');
  };

  const removeWaterGlass = () => {
    if (todayHealth.waterGlasses > 0) {
      updateTodayHealth({ waterGlasses: todayHealth.waterGlasses - 1 });
      playSound('pop');
    }
  };

  const setMood = (mood: MoodScore) => {
    updateTodayHealth({ mood });
    playSound('pop');
  };

  const setSleepHours = (hours: number, quality: SleepQuality) => {
    updateTodayHealth({ sleepHours: hours, sleepQuality: quality });
  };

  const setWorkout = (minutes: number, type: string) => {
    updateTodayHealth({ workoutMinutes: minutes, workoutType: type });
    playSound('pop');
  };

  // GOALS ACTIONS
  const addGoal = (goal: Omit<PersonalGoal, 'id'>) => {
    const newG: PersonalGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newG]);
    playSound('pop');
  };

  const updateGoal = (updated: PersonalGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const calculatedProgress =
          updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : g.progress;

        if (calculatedProgress === 100 && g.progress < 100) {
          playSound('complete');
        } else {
          playSound('pop');
        }

        return {
          ...g,
          milestones: updatedMilestones,
          progress: calculatedProgress,
          status: calculatedProgress === 100 ? 'completado' : g.status === 'completado' ? 'en_progreso' : g.status,
        };
      })
    );
  };

  // JOURNAL
  const saveJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournal((prev) => {
      const existingIdx = prev.findIndex((j) => j.date === entry.date);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...entry };
        return copy;
      }
      return [{ ...entry, id: `journal-${Date.now()}` }, ...prev];
    });
    playSound('pop');
  };

  // SETTINGS & BACKUP
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.SAVINGS);
    localStorage.removeItem(STORAGE_KEYS.HEALTH);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    setTasks(initialTasks);
    setHabits(initialHabits);
    setTransactions(initialTransactions);
    setBudgetLimits(initialBudgetLimits);
    setSavingsGoals(initialSavingsGoals);
    setHealthLogs(initialHealthLogs);
    setGoals(initialGoals);
    setJournal(initialJournal);
    setSettings(initialUserSettings);
    playSound('bell');
  };

  const exportDataJSON = () => {
    const data = {
      tasks,
      habits,
      transactions,
      budgetLimits,
      savingsGoals,
      healthLogs,
      goals,
      journal,
      settings,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks) setTasks(data.tasks);
      if (data.habits) setHabits(data.habits);
      if (data.transactions) setTransactions(data.transactions);
      if (data.budgetLimits) setBudgetLimits(data.budgetLimits);
      if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
      if (data.healthLogs) setHealthLogs(data.healthLogs);
      if (data.goals) setGoals(data.goals);
      if (data.journal) setJournal(data.journal);
      if (data.settings) setSettings(data.settings);
      playSound('complete');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        habits,
        transactions,
        budgetLimits,
        savingsGoals,
        healthLogs,
        goals,
        journal,
        settings,
        activePomodoroTask,
        setActivePomodoroTask,
        isPomodoroModalOpen,
        setIsPomodoroModalOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtask,
        incrementTaskPomodoro,
        addHabit,
        toggleHabitForDate,
        deleteHabit,
        addTransaction,
        deleteTransaction,
        updateBudgetLimit,
        contributeSavingsGoal,
        addSavingsGoal,
        deleteSavingsGoal,
        todayHealth,
        updateTodayHealth,
        addWaterGlass,
        removeWaterGlass,
        setMood,
        setSleepHours,
        setWorkout,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        saveJournalEntry,
        updateSettings,
        resetAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
