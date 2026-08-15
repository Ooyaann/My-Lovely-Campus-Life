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
  Lightbulb,
  Save,
  Check,
  Calendar,
  Smile,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoalItem } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const TargetReflectionView: React.FC = () => {
  const { goals, toggleGoal, addGoal, deleteGoal, showToast } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalItem['category']>('Kuliah Bareng');
  const [showAdd, setShowAdd] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Reflection journal states
  const [reflectionText, setReflectionText] = useState(() => {
    return localStorage.getItem('mcl_reflection_note') || 'Minggu ini cukup menantang di praktikum Kimia Dasar, tapi senang sekali bisa selesai tepat waktu. Terima kasih Mas Mie Ayam yang selalu nyemangatin pas aku pusing ngerjain laptrak!';
  });

  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);

  const reflectionPrompts = [
    'Apa hal yang paling kamu banggakan dari usahamu minggu ini di Kimia UPI?',
    'Bagaimana perasaanmu setelah menyelesaikan laporan praktikum hari ini?',
    'Momen kencan/makan bareng apa yang paling bikin kamu bahagia akhir-akhir ini?',
    'Apa target praktikum atau materi kimia yang ingin kamu kuasai selanjutnya?'
  ];

  const handleSaveReflection = () => {
    localStorage.setItem('mcl_reflection_note', reflectionText);
    setIsSaved(true);
    showToast('Refleksi semester berhasil disimpan!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), newCategory);
    setNewTitle('');
    setShowAdd(false);
  };

  const completedGoals = goals.filter((g) => g.isDone).length;
  const totalGoals = goals.length;
  const goalPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Academic Target Banner */}
      <section className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-300/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs border border-white/20 whitespace-nowrap">
              <Award className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
              <span>Target & Resolusi Semester Pendidikan Kimia UPI</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Target IPK Cum Laude & Sukses Calon Guru Kimia
            </h2>
            <p className="font-sans text-xs sm:text-sm text-rose-100/90 max-w-lg leading-relaxed">
              Setiap usaha dan lembar laporan praktikum yang Sayang kerjakan adalah langkah pasti menuju masa depan yang cerah dan wisuda dengan predikat kehormatan. Mas selalu mendampingi setiap langkahmu.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 px-7 py-5 rounded-3xl text-center flex-shrink-0 backdrop-blur-xs w-full md:w-auto shadow-inner">
            <span className="text-[11px] text-rose-200 uppercase tracking-wider font-bold block mb-1">
              Target IPK Semester
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white">
              3.85 <span className="text-base text-rose-200 font-sans font-normal">/ 4.00</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 px-3 py-0.5 rounded-full mt-2 inline-block border border-emerald-400/30">
              Dengan Pujian (Cum Laude)
            </span>
          </div>
        </div>
      </section>

      {/* 2. Goals & Commitments Checklist */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-900 flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Resolusi & Wishlist Kita Berdua
              </h3>
              <p className="text-xs text-slate-500">
                {completedGoals} dari {totalGoals} target tercapai ({goalPercent}%) • Akademik, momen manis, dan impian bersama
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Target Baru</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-700 to-rose-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>

        {/* Add Goal Form */}
        {showAdd && (
          <form onSubmit={handleAddGoalSubmit} className="flex flex-col sm:flex-row gap-2.5 p-4 bg-rose-50/60 rounded-2xl border border-rose-200 animate-fade-in">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Lulus praktikum Kimia Dasar dengan nilai A..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-800"
              autoFocus
            />
            <div className="w-full sm:w-52">
              <CustomSelect
                value={newCategory}
                onChange={(val) => setNewCategory(val as GoalItem['category'])}
                options={[
                  { value: 'Kuliah Bareng', label: 'Kuliah & Lab Kimia', color: '#881337' },
                  { value: 'Kencan', label: 'Kencan & Jalan Santai', color: '#e11d48' },
                  { value: 'Mimpi Bersama', label: 'Mimpi & Masa Depan', color: '#6366f1' },
                  { value: 'Kuliner', label: 'Kulineran & Jajan', color: '#f59e0b' }
                ]}
                ariaLabel="Kategori Target"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
            >
              Simpan Target
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs ${
                goal.isDone
                  ? 'bg-rose-50/50 border-rose-200 text-slate-600'
                  : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {goal.isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-700 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-600 flex-shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-semibold truncate ${goal.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {goal.title}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 uppercase">
                  {goal.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGoal(goal.id);
                  }}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Hapus Target"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Reflective Journal Area */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Refleksi & Catatan Hati Semester Ini
              </h3>
              <p className="text-xs text-slate-500">
                Tuliskan hal-hal yang disyukuri, evaluasi laptrak, atau uneg-uneg bersama Mas
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveReflection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Refleksi'}</span>
          </button>
        </div>

        {/* Prompt suggestions */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Ide Topik Refleksi:
          </span>
          <div className="flex flex-wrap gap-2">
            {reflectionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedPrompt(idx);
                  if (!reflectionText || reflectionText.startsWith('Minggu ini cukup menantang')) {
                    setReflectionText(`[${prompt}]\n\n`);
                  }
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedPrompt === idx
                    ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-200'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          rows={5}
          className="w-full p-4 text-xs sm:text-sm bg-slate-50/70 hover:bg-white focus:bg-white rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-reading focus:outline-hidden focus:border-rose-800 transition-all shadow-inner"
          placeholder="Tuliskan refleksimu di sini..."
        />

        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{reflectionText.length} karakter tersimpan</span>
          <span className="italic text-rose-900 font-medium">Tersimpan otomatis secara privat 🤍</span>
        </div>
      </section>

      {/* 4. Encouragement Quote from Mas Mie Ayam */}
      <section className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-300/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-rose-200 flex-shrink-0 backdrop-blur-xs">
            <Heart className="w-6 h-6 text-rose-300 fill-rose-300" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-base sm:text-lg text-white">
              Pesan Cinta Mas Mie Ayam
            </h4>
            <p className="font-reading text-xs sm:text-sm text-rose-100/95 leading-relaxed italic">
              "Hasil laptrak yang revisi atau ujian yang sulit bukan penentu masa depanmu Sayang. Yang terpenting adalah konsistensi usahamu hari ini. Mas selalu bangga dan ada di barisan terdepan untuk mendukungmu."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

