import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDateSpanish } from '../../utils/formatters';
import { ExpenseCategory, TransactionType } from '../../types';

interface FinancesViewProps {
  onOpenAddTransaction: () => void;
  onOpenAddSavingsGoal: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  onOpenAddTransaction,
  onOpenAddSavingsGoal,
}) => {
  const {
    transactions,
    savingsGoals,
    budgetLimits,
    settings,
    deleteTransaction,
    contributeSavingsGoal,
    deleteSavingsGoal,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contributionAmount, setContributionAmount] = useState<Record<string, number>>({});

  // Totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  // Monthly Budget usage
  const budgetLimit = settings.monthlyBudgetLimit || 2400;
  const budgetUsedPercent = Math.min(100, Math.round((totalExpenses / budgetLimit) * 100));
  const isOverBudget = totalExpenses > budgetLimit;

  // Expenses by Category
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchDesc && !matchCat) return false;
    }
    return true;
  });

  const handleQuickContribution = (goalId: string, amount: number) => {
    contributeSavingsGoal(goalId, amount);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Finanzas & Presupuesto
          </h1>
          <p className="text-sm text-neutral-500">
            Monitorea flujo de caja, control de gastos y avance de metas de ahorro
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddSavingsGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <PiggyBank className="w-3.5 h-3.5 text-neutral-600" />
            <span>Nueva Meta</span>
          </button>
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Movimiento</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ingresos Totales</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatCurrency(totalIncome, settings.currency)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            {transactions.filter((t) => t.type === 'income').length} transacciones registradas
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gastos Totales</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatCurrency(totalExpenses, settings.currency)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            {transactions.filter((t) => t.type === 'expense').length} gastos contabilizados
          </div>
        </div>

        {/* Net Savings Balance */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Balance Neto</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums ${
              netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatCurrency(netBalance, settings.currency)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Superávit disponible del período
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tasa de Ahorro</span>
            <PiggyBank className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {savingsRate}%
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Budget Tracker Bar */}
      <div className="p-5 bg-white rounded-xl border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-900">
              Presupuesto Mensual de Gasto
            </h3>
            {isOverBudget && (
              <span className="flex items-center gap-1 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Límite superado
              </span>
            )}
          </div>
          <div className="text-xs text-neutral-600 font-mono tabular-nums">
            <span className="font-semibold text-neutral-900">
              {formatCurrency(totalExpenses, settings.currency)}
            </span>{' '}
            gastados de {formatCurrency(budgetLimit, settings.currency)} ({budgetUsedPercent}%)
          </div>
        </div>

        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isOverBudget
                ? 'bg-rose-600'
                : budgetUsedPercent > 80
                ? 'bg-amber-500'
                : 'bg-neutral-900'
            }`}
            style={{ width: `${budgetUsedPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Left (Metas de Ahorro) & Right (Desglose por Categoría) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metas de Ahorro (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Fondos & Metas de Ahorro
            </h2>
            <button
              onClick={onOpenAddSavingsGoal}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Meta</span>
            </button>
          </div>

          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {goal.title}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5">
                        <span>{goal.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Plazo: {formatDateSpanish(goal.targetDate)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 rounded"
                      title="Eliminar meta de ahorro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-mono tabular-nums font-semibold text-neutral-900">
                        {formatCurrency(goal.currentAmount, settings.currency)}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500">
                        Objetivo: {formatCurrency(goal.targetAmount, settings.currency)} ({progress}%)
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-600' : 'bg-neutral-900'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Contribution Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">Aporte rápido:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickContribution(goal.id, 50)}
                        className="px-2.5 py-1 text-xs font-mono tabular-nums font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors"
                      >
                        +50
                      </button>
                      <button
                        onClick={() => handleQuickContribution(goal.id, 100)}
                        className="px-2.5 py-1 text-xs font-mono tabular-nums font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors"
                      >
                        +100
                      </button>
                      <button
                        onClick={() => handleQuickContribution(goal.id, 250)}
                        className="px-2.5 py-1 text-xs font-mono tabular-nums font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors"
                      >
                        +250
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desglose de Gastos por Categoría (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Gastos por Categoría
          </h2>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
            {sortedCategories.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                Aún no hay gastos registrados este mes.
              </div>
            ) : (
              sortedCategories.map(([category, amount]) => {
                const percent = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800">{category}</span>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="text-neutral-500">{percent}%</span>
                        <span className="font-semibold text-neutral-900">
                          {formatCurrency(amount, settings.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-neutral-800 h-1.5 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-neutral-900">
            Historial de Transacciones
          </h2>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar movimiento..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === 'expense'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Gastos
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  typeFilter === 'income'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Ingresos
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-medium">
                  <th className="py-2.5 px-4">Fecha</th>
                  <th className="py-2.5 px-4">Concepto</th>
                  <th className="py-2.5 px-4">Categoría</th>
                  <th className="py-2.5 px-4">Método</th>
                  <th className="py-2.5 px-4 text-right">Importe</th>
                  <th className="py-2.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No se encontraron movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-2.5 px-4 text-neutral-500 whitespace-nowrap">
                        {formatDateSpanish(tx.date)}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-neutral-900">
                        {tx.description}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-600">
                        {tx.category}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-500">
                        {tx.paymentMethod || '—'}
                      </td>
                      <td
                        className={`py-2.5 px-4 text-right font-mono tabular-nums font-semibold ${
                          tx.type === 'income' ? 'text-emerald-700' : 'text-neutral-900'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount, settings.currency)}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
