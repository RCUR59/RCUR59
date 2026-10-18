export type Priority = 'baja' | 'media' | 'alta';
export type TaskCategory = 'Trabajo' | 'Personal' | 'Salud' | 'Finanzas' | 'Hogar';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  category: TaskCategory;
  urgent: boolean;
  important: boolean;
  subtasks: Subtask[];
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  createdAt: string;
}

export type HabitCategory = 'Salud' | 'Productividad' | 'Mente' | 'Crecimiento';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  completedDates: string[]; // YYYY-MM-DD
}

export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Vivienda'
  | 'Alimentación'
  | 'Transporte'
  | 'Servicios'
  | 'Ocio'
  | 'Salud'
  | 'Educación'
  | 'Inversión'
  | 'Otros';

export type IncomeCategory = 'Sueldo' | 'Freelance' | 'Inversiones' | 'Ventas' | 'Otros';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod?: 'Tarjeta' | 'Transferencia' | 'Efectivo';
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface BudgetCategory {
  category: ExpenseCategory;
  monthlyLimit: number;
}

export type SleepQuality = 'excelente' | 'bueno' | 'regular' | 'malo';
export type MoodScore = 1 | 2 | 3 | 4 | 5; // 1: Muy bajo, 2: Bajo, 3: Regular, 4: Bueno, 5: Radiante

export interface HealthDailyLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number; // 1 glass = 250ml
  waterGoalGlasses: number;
  sleepHours: number;
  sleepQuality: SleepQuality;
  workoutMinutes: number;
  workoutType: string;
  mood: MoodScore;
  energyLevel: number; // 1-10
  weight?: number; // kg
  notes?: string;
}

export type LifeArea =
  | 'Carrera'
  | 'Finanzas'
  | 'Salud'
  | 'Crecimiento'
  | 'Relaciones'
  | 'Estilo de Vida';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface PersonalGoal {
  id: string;
  title: string;
  area: LifeArea;
  targetDate: string;
  progress: number; // 0-100
  status: 'en_progreso' | 'completado' | 'en_pausa';
  milestones: GoalMilestone[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  highlightOfDay?: string;
}

export type CurrencyCode = 'EUR' | 'USD' | 'MXN' | 'COP';

export interface UserSettings {
  userName: string;
  currency: CurrencyCode;
  monthlyBudgetLimit: number;
  waterTargetGlasses: number;
  sleepTargetHours: number;
  workMinutesPomodoro: number;
  breakMinutesPomodoro: number;
  soundEnabled: boolean;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'tasks'
  | 'habits'
  | 'finances'
  | 'health'
  | 'goals'
  | 'pomodoro';
