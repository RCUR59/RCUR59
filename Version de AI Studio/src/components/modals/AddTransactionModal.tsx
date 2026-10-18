import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
  TransactionType,
} from '../../types';
import { X } from 'lucide-react';
import { getTodayDateString } from '../../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, settings } = useApp();
  const todayStr = getTodayDateString();

  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Alimentación');
  const [date, setDate] = useState(todayStr);
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Transferencia' | 'Efectivo'>('Tarjeta');

  if (!isOpen) return null;

  const expenseCategories: ExpenseCategory[] = [
    'Vivienda',
    'Alimentación',
    'Transporte',
    'Servicios',
    'Ocio',
    'Salud',
    'Educación',
    'Inversión',
    'Otros',
  ];

  const incomeCategories: IncomeCategory[] = [
    'Sueldo',
    'Freelance',
    'Inversiones',
    'Ventas',
    'Otros',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      type,
      description: description.trim(),
      amount: parsedAmount,
      category,
      date,
      paymentMethod,
    });

    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">
            Registrar Movimiento Financiero
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Alimentación');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                type === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Gasto (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Sueldo');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                type === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ingreso (+)
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Concepto o descripción *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'expense' ? 'Ej: Compra supermercado semanal' : 'Ej: Cobro factura cliente'}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Importe ({settings.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                {type === 'expense'
                  ? expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : incomeCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Método de pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'Tarjeta' | 'Transferencia' | 'Efectivo')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
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
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
