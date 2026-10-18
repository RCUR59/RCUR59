import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode } from '../../types';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportDataJSON,
    importDataJSON,
  } = useApp();

  const [userName, setUserName] = useState(settings.userName);
  const [currency, setCurrency] = useState<CurrencyCode>(settings.currency);
  const [budgetLimit, setBudgetLimit] = useState(settings.monthlyBudgetLimit);
  const [waterGoal, setWaterGoal] = useState(settings.waterTargetGlasses);
  const [sleepTarget, setSleepTarget] = useState(settings.sleepTargetHours);
  const [workMinutes, setWorkMinutes] = useState(settings.workMinutesPomodoro);
  const [breakMinutes, setBreakMinutes] = useState(settings.breakMinutesPomodoro);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  const [copiedMessage, setCopiedMessage] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim() || 'Usuario',
      currency,
      monthlyBudgetLimit: Number(budgetLimit) || 2400,
      waterTargetGlasses: Number(waterGoal) || 8,
      sleepTargetHours: Number(sleepTarget) || 8,
      workMinutesPomodoro: Number(workMinutes) || 25,
      breakMinutesPomodoro: Number(breakMinutes) || 5,
      soundEnabled,
    });
    if (soundEnabled) sounds.playPop();
    onClose();
  };

  const handleExport = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitanova-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Also copy to clipboard for convenience
    navigator.clipboard?.writeText(json);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const success = importDataJSON(importText);
    if (success) {
      setImportStatus('Copia importada con éxito ✓');
      setTimeout(() => {
        setImportStatus(null);
        setShowImportArea(false);
        onClose();
      }, 1500);
    } else {
      setImportStatus('Error: El formato JSON no es válido.');
    }
  };

  const handleReset = () => {
    if (confirm('¿Restablecer todos los datos a la plantilla inicial de ejemplo? Se sobrescribirán tus cambios actuales.')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">
            Ajustes & Gestión de Datos
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSavePreferences} className="p-5 space-y-5 text-xs">
          {/* User & Preferences */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              Perfil & Moneda
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Moneda de visualización
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="USD">Dólar ($ USD)</option>
                  <option value="MXN">Peso Mexicano ($ MXN)</option>
                  <option value="COP">Peso Colombiano ($ COP)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Targets */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              Metas Diarias & Presupuesto
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Presupuesto Mes
                </label>
                <input
                  type="number"
                  step="100"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Vasos de Agua
                </label>
                <input
                  type="number"
                  min="4"
                  max="20"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Horas de Sueño
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="12"
                  value={sleepTarget}
                  onChange={(e) => setSleepTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Pomodoro Durations & Sound */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              Enfoque Pomodoro & Audio
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Minutos de Enfoque
                </label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Minutos de Descanso
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/60">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-400" />
                )}
                <span className="font-medium text-neutral-800">
                  Efectos de sonido sutiles (campana y clics)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sounds.playComplete()}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                >
                  Probar
                </button>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
              Copia de Seguridad & Restauración
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 font-medium text-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImportArea(!showImportArea)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 font-medium text-neutral-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar JSON</span>
              </button>
            </div>

            {copiedMessage && (
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded text-center text-xs font-medium">
                ¡Archivo descargado y copiado al portapapeles!
              </div>
            )}

            {showImportArea && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <textarea
                  rows={3}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Pega aquí el contenido JSON exportado previamente..."
                  className="w-full p-2 text-xs font-mono rounded border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                {importStatus && (
                  <p className="text-xs text-neutral-700 font-medium">{importStatus}</p>
                )}
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800"
                >
                  Confirmar e Importar
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer a plantilla de datos de ejemplo</span>
            </button>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg shadow-xs"
            >
              Guardar Ajustes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
