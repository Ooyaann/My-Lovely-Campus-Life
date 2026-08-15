import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJSON, importDataJSON, resetToDefaults } = useApp();
  const [jsonInput, setJsonInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importDataJSON(text);
          if (success) {
            onClose();
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualImport = () => {
    if (!jsonInput.trim()) return;
    const success = importDataJSON(jsonInput);
    if (success) {
      setJsonInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-rose-200" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Cadangkan & Pulihkan Data
              </h3>
              <p className="text-xs text-rose-200">
                Penyimpanan aman lokal di peramban Anda (JSON)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Export Section */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#831843]">
                  1. Unduh Cadangan (Export JSON)
                </h4>
                <p className="text-xs text-slate-600">
                  Simpan semua jadwal KRS, tugas laptrak, catatan keuangan, dan surat ke file .json.
                </p>
              </div>
            </div>
            <button
              id="download-backup-json-btn"
              onClick={exportDataJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Cadangan Sekarang</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                2. Pulihkan Data (Import JSON)
              </h4>
              <p className="text-xs text-slate-600">
                Unggah file .json cadangan Anda untuk mengembalikan data kapan saja.
              </p>
            </div>

            {/* File Input */}
            <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-rose-300 bg-white hover:bg-rose-50/50 text-rose-900 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-rose-600" />
              <span>Pilih File .JSON dari Perangkat</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Manual Paste */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-500">
                Atau tempel teks JSON di sini:
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"appName": "My Lovely Campus Life", ...}'
                rows={3}
                className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              {jsonInput.trim() && (
                <button
                  onClick={handleManualImport}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Terapkan Data JSON
                </button>
              )}
            </div>
          </div>

          {/* Reset Defaults */}
          <div className="border-t border-slate-200 pt-4">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset semua data ke data awal contoh UPI & Sayang</span>
              </button>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Konfirmasi Reset Data</span>
                </div>
                <p>Data perubahan Anda akan dikembalikan ke setelan pabrik. Lanjutkan?</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Ya, Reset Sekarang
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
