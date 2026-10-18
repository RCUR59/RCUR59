import { CurrencyCode, MoodScore } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'EUR'): string {
  const currencyMap: Record<CurrencyCode, { locale: string; code: string }> = {
    EUR: { locale: 'es-ES', code: 'EUR' },
    USD: { locale: 'en-US', code: 'USD' },
    MXN: { locale: 'es-MX', code: 'MXN' },
    COP: { locale: 'es-CO', code: 'COP' },
  };

  const config = currencyMap[currency] || currencyMap.EUR;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const today = getTodayDateString();
  if (dateStr === today) return 'Hoy';

  // Compare tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (dateStr === tomorrowStr) return 'Mañana';

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function formatDateFull(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function getLastNDays(n = 7): { date: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const result = [];
  const todayStr = getTodayDateString();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'narrow' }).format(d);
    result.push({
      date: dateStr,
      dayName: dayName.toUpperCase(),
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }
  return result;
}

export function getMoodDetails(score: MoodScore): { label: string; emoji: string; colorClass: string; bgClass: string } {
  switch (score) {
    case 5:
      return { label: 'Radiante', emoji: '✨', colorClass: 'text-amber-500', bgClass: 'bg-amber-50 border-amber-200' };
    case 4:
      return { label: 'Muy bien', emoji: '😊', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50 border-emerald-200' };
    case 3:
      return { label: 'Neutral', emoji: '😐', colorClass: 'text-blue-500', bgClass: 'bg-blue-50 border-blue-200' };
    case 2:
      return { label: 'Cansado', emoji: '🥱', colorClass: 'text-orange-500', bgClass: 'bg-orange-50 border-orange-200' };
    case 1:
      return { label: 'Agotado', emoji: '🌧️', colorClass: 'text-rose-500', bgClass: 'bg-rose-50 border-rose-200' };
    default:
      return { label: 'Regular', emoji: '😐', colorClass: 'text-neutral-500', bgClass: 'bg-neutral-50 border-neutral-200' };
  }
}
