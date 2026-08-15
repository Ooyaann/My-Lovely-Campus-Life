import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  BookOpen, 
  Heart,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';

export const TargetReflectionView: React.FC = () => {
  const { goals, toggleGoal, addGoal, deleteGoal, showToast } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Akademik' | 'Kencan' | 'Pribadi'>('Akademik');
  const [showAdd, setShowAdd] = useState(false);

  // Reflection journal states
  const [reflectionText, setReflectionText] = useState(() => {
    return localStorage.getItem('mcl_reflection_note') || 'Minggu ini cukup menantang di praktikum Kimia Dasar, tapi senang sekali bisa selesai tepat waktu. Terima kasih Mas Mie Ayam yang selalu nyemangatin pas aku pusing ngerjain laptrak!';
  });

  const handleSaveReflection = () => {
    localStorage.setItem('mcl_reflection_note', reflectionText);
    showToast('Refleksi semester berhasil disimpan!');
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), newCategory);
    setNewTitle('');
    setShowAdd();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Academic Target Banner */}
      <section className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Target & Resolusi Semester UPI</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Target IPK & Prestasi Calon Guru Kimia
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 max-w-lg">
              Setiap usaha dan lembar laporan praktikum yang Sayang kerjakan adalah langkah pasti menuju masa depan yang cerah dan wisuda dengan bangga.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-3xl text-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-xs text-rose-200 uppercase tracking-wider font-semibold block">Target IPK Semester</span>
            <div className="font-display font-black text-4xl sm:text-5xl text-amber-300 mt-1">
              3.85 <span className="text-lg text-rose-200 font-sans font-normal">/ 4.00</span>
            </div>
            <span className="text-[11px] text-rose-200/80 mt-1 block">Dengan Pujian (Cum Laude)</span>
          </div>
        </div>
      </section>

      {/* 2. Goals & Commitments Checklist */}
      <section className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800">
              <Target className="w-5 h-5 text-[#831843]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Resolusi & Komitmen Semester
              </h3>
              <p className="text-xs text-slate-500">
                Checklist target akademik, pengembangan diri, dan momen berdua
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#831843] transition-all cursor-pointer"
            title="Tambah Target"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add Goal Form */}
        {showAdd && (
          <form onSubmit={handleAddGoalSubmit} className="flex flex-col sm:flex-row gap-2 p-3 bg-rose-50/70 rounded-2xl border border-rose-100 animate-fade-in">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Lulus praktikum Kimia Dasar dengan nilai A..."
              className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
              autoFocus
            />
            <div className="w-48">
              <CustomSelect
                value={newCategory}
                onChange={(val) => setNewCategory(val as 'Akademik' | 'Kencan' | 'Pribadi')}
                options={[
                  { value: 'Akademik', label: 'Akademik', color: '#881337' },
                  { value: 'Kencan', label: 'Kencan & Romantis', color: '#e11d48' },
                  { value: 'Pribadi', label: 'Pribadi', color: '#6366f1' }
                ]}
                ariaLabel="Kategori Target"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#831843] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Simpan Target
            </button>
          </form>
        )}

        <div className="space-y-2.5">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                goal.isDone
                  ? 'bg-rose-50/40 border-rose-100 text-slate-400'
                  : 'bg-slate-50/60 border-slate-200/80 text-slate-800 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {goal.isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-400 flex-shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${goal.isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {goal.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 uppercase">
                  {goal.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGoal(goal.id);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                  title="Hapus Target"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Reflective Journal Area */}
      <section className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Lightbulb className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Refleksi & Catatan Hati Semester Ini
            </h3>
            <p className="text-xs text-slate-500">
              Tuliskan hal-hal yang disyukuri, pelajaran berharga dari laboratorium, atau cerita kencan manis
            </p>
          </div>
        </div>

        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          rows={4}
          className="w-full p-4 text-xs sm:text-sm bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-rose-500"
          placeholder="Tuliskan refleksimu di sini..."
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveReflection}
            className="px-5 py-2.5 bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            Simpan Refleksi
          </button>
        </div>
      </section>
    </div>
  );
};
