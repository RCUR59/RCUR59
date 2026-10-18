import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Droplets,
  Moon,
  Dumbbell,
  Smile,
  Zap,
  Scale,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  getLastNDays,
  getMoodDetails,
  getTodayDateString,
} from '../../utils/formatters';
import { MoodScore, SleepQuality } from '../../types';

export const HealthView: React.FC = () => {
  const {
    todayHealth,
    healthLogs,
    settings,
    addWaterGlass,
    removeWaterGlass,
    updateTodayHealth,
    setMood,
  } = useApp();

  const days = getLastNDays(7);
  const todayStr = getTodayDateString();

  const [workoutMinutes, setWorkoutMinutes] = useState(todayHealth.workoutMinutes || 45);
  const [workoutType, setWorkoutType] = useState(todayHealth.workoutType || 'Gimnasio fuerza');
  const [sleepHours, setSleepHours] = useState(todayHealth.sleepHours || 7.5);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(todayHealth.sleepQuality || 'bueno');
  const [energyLevel, setEnergyLevel] = useState(todayHealth.energyLevel || 8);
  const [weight, setWeight] = useState(todayHealth.weight || 74.2);
  const [notes, setNotes] = useState(todayHealth.notes || '');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const handleSaveHealthDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodayHealth({
      workoutMinutes: Number(workoutMinutes),
      workoutType,
      sleepHours: Number(sleepHours),
      sleepQuality,
      energyLevel: Number(energyLevel),
      weight: Number(weight),
      notes,
    });
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2000);
  };

  const currentMood = getMoodDetails(todayHealth.mood);

  // Workout types
  const workoutOptions = [
    'Gimnasio fuerza',
    'Cardio & Running',
    'Yoga & Movilidad',
    'Caminata rápida',
    'Ciclismo',
    'Natación',
    'Descanso activo',
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Salud, Bienestar & Vitalidad
          </h1>
          <p className="text-sm text-neutral-500">
            Monitorea los pilares esenciales: hidratación, sueño reparador, ejercicio y energía
          </p>
        </div>

        {feedbackSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registro actualizado con éxito</span>
          </div>
        )}
      </div>

      {/* 4 Health Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Hidratación */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Agua Consumida</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {todayHealth.waterGlasses * 250} ml
            </div>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              Meta: {todayHealth.waterGoalGlasses * 250} ml
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {todayHealth.waterGlasses} de {todayHealth.waterGoalGlasses} vasos
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={removeWaterGlass}
                disabled={todayHealth.waterGlasses <= 0}
                className="w-6 h-6 rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                onClick={addWaterGlass}
                className="w-6 h-6 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pillar 2: Sueño */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Descanso Anoche</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {todayHealth.sleepHours} hrs
            </div>
            <span className="text-xs text-neutral-500 capitalize">
              {todayHealth.sleepQuality}
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-3 pt-2 border-t border-neutral-100 font-mono tabular-nums">
            Meta objetivo: {settings.sleepTargetHours || 8} horas
          </div>
        </div>

        {/* Pillar 3: Actividad física */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Entrenamiento Hoy</span>
            <Dumbbell className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {todayHealth.workoutMinutes} min
            </div>
            <span className="text-xs text-neutral-500 truncate max-w-[110px]">
              {todayHealth.workoutType}
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-3 pt-2 border-t border-neutral-100">
            {todayHealth.workoutMinutes >= 30 ? 'Objetivo diario cumplido' : 'Meta: 30 min mínimo'}
          </div>
        </div>

        {/* Pillar 4: Estado y Energía */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Vitalidad & Ánimo</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums flex items-center gap-1.5">
              <span>{currentMood.emoji}</span>
              <span>{currentMood.label}</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-neutral-500">
              {todayHealth.energyLevel}/10 energía
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-3 pt-2 border-t border-neutral-100 font-mono tabular-nums">
            Peso actual: {todayHealth.weight ? `${todayHealth.weight} kg` : 'Sin registrar'}
          </div>
        </div>
      </div>

      {/* Main Health Grid: Left (Daily Health Editor) & Right (Weekly Trends Visualizer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Health Log Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 bg-white rounded-xl border border-neutral-200">
            <h2 className="text-base font-semibold text-neutral-900 mb-4">
              Registro Detallado del Día
            </h2>

            <form onSubmit={handleSaveHealthDetails} className="space-y-4">
              {/* Mood selector buttons */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Estado de Ánimo Predominante
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {([1, 2, 3, 4, 5] as MoodScore[]).map((score) => {
                    const mood = getMoodDetails(score);
                    const isSelected = todayHealth.mood === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMood(score)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? `${mood.bgClass} font-semibold shadow-xs`
                            : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        <div className="text-xl mb-1">{mood.emoji}</div>
                        <div className="text-[11px] truncate">{mood.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleep & Quality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Horas de Sueño Anoche
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="16"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Calidad de Sueño
                  </label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as SleepQuality)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    <option value="excelente">Excelente (Profundo & Reparador)</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="malo">Malo / Interrumpido</option>
                  </select>
                </div>
              </div>

              {/* Workout Duration & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Minutos de Ejercicio
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={workoutMinutes}
                    onChange={(e) => setWorkoutMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Tipo de Actividad
                  </label>
                  <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    {workoutOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Energy Level & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Nivel de Energía (1-10): <span className="font-mono tabular-nums font-bold">{energyLevel}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Peso Corporal (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Notas sobre sensaciones corporales y nutrición
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Buena digestión, hidratación constante, estiramientos realizados..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Guardar Datos de Salud
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Weekly Trend Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Tendencia de los Últimos 7 Días
          </h2>

          {/* Sleep chart SVG */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-800">Horas de Sueño Semanal</span>
              <span className="text-neutral-500 font-mono tabular-nums">Objetivo: 8h</span>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-neutral-100">
              {days.map((d) => {
                const log = healthLogs[d.date];
                const hours = log ? log.sleepHours : 0;
                const max = 10;
                const heightPercent = Math.min(100, (hours / max) * 100);

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono tabular-nums text-neutral-600">
                      {hours > 0 ? `${hours}h` : '-'}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-sm transition-all ${
                        d.isToday ? 'bg-indigo-600' : 'bg-indigo-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-neutral-500 uppercase">{d.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Water intake chart SVG */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-800">Vasos de Agua Diarios</span>
              <span className="text-neutral-500 font-mono tabular-nums">Meta: 8 vasos</span>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-neutral-100">
              {days.map((d) => {
                const log = healthLogs[d.date];
                const glasses = log ? log.waterGlasses : 0;
                const max = 10;
                const heightPercent = Math.min(100, (glasses / max) * 100);

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono tabular-nums text-neutral-600">
                      {glasses}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-sm transition-all ${
                        d.isToday ? 'bg-blue-600' : 'bg-blue-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-neutral-500 uppercase">{d.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
