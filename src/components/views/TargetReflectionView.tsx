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
  GraduationCap,
  Edit3,
  X,
  Copy,
  Filter,
  Flame,
  Coffee,
  FlaskConical,
  TrendingUp,
  Bookmark,
  ChevronDown,
  ChevronUp,
  MessageSquareHeart,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoalItem, SemesterTarget, ReflectionItem } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

const DEFAULT_ACADEMIC_TARGET: SemesterTarget = {
  targetIPK: '3.85',
  currentIPS: '3.90',
  targetSKS: '21',
  semesterName: 'Semester Ganjil 2026/2027',
  predicate: 'Dengan Pujian (Cum Laude)',
  motivationNote: 'Setiap lembar laporan praktikum & ujian yang Sayang selesaikan adalah langkah nyata menuju calon pendidik kimia hebat dan wisuda kehormatan. Mas selalu bangga padamu! 🤍'
};

const DEFAULT_REFLECTIONS: ReflectionItem[] = [];

export const TargetReflectionView: React.FC = () => {
  const { goals, toggleGoal, addGoal, deleteGoal, showToast } = useApp();
  
  // Goals state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<GoalItem['category']>('Kuliah Bareng');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Academic Target state
  const [academicTarget, setAcademicTarget] = useState<SemesterTarget>(() => {
    try {
      const saved = localStorage.getItem('mcl_academic_target');
      return saved ? JSON.parse(saved) : DEFAULT_ACADEMIC_TARGET;
    } catch {
      return DEFAULT_ACADEMIC_TARGET;
    }
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editFormTarget, setEditFormTarget] = useState<SemesterTarget>(academicTarget);

  // Reflections state
  const [reflections, setReflections] = useState<ReflectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('mcl_reflections_list_v2');
      return saved ? JSON.parse(saved) : DEFAULT_REFLECTIONS;
    } catch {
      return DEFAULT_REFLECTIONS;
    }
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');
  const [expandedReflectionId, setExpandedReflectionId] = useState<string | null>('ref-1');
  const [showAddReflection, setShowAddReflection] = useState(false);

  // New Reflection Form state
  const [newRefTitle, setNewRefTitle] = useState('');
  const [newRefCategory, setNewRefCategory] = useState<ReflectionItem['category']>('Praktikum & Lab');
  const [newRefMood, setNewRefMood] = useState('✨ Ceria');
  const [newRefDate, setNewRefDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newRefContent, setNewRefContent] = useState('');

  const reflectionPrompts = [
    'Apa hal yang paling kamu banggakan dari usahamu minggu ini di Kimia UPI?',
    'Bagaimana perasaanmu setelah menyelesaikan laporan praktikum hari ini?',
    'Apa evaluasi belajar atau target materi kimia yang ingin diperbaiki?',
    'Momen manis apa yang paling bikin kamu bersyukur dan bahagia akhir-akhir ini?'
  ];

  // Save academic target
  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setAcademicTarget(editFormTarget);
    localStorage.setItem('mcl_academic_target', JSON.stringify(editFormTarget));
    setIsEditingTarget(false);
    showToast('Target IP & Akademik berhasil diperbarui!');
  };

  // Save new reflection
  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefTitle.trim() || !newRefContent.trim()) {
      showToast('Mohon lengkapi judul dan isi refleksi.');
      return;
    }

    const newEntry: ReflectionItem = {
      id: 'ref-' + Date.now(),
      title: newRefTitle.trim(),
      category: newRefCategory,
      mood: newRefMood,
      date: newRefDate || new Date().toISOString().split('T')[0],
      content: newRefContent.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newEntry, ...reflections];
    setReflections(updated);
    localStorage.setItem('mcl_reflections_list_v1', JSON.stringify(updated));

    // Reset form
    setNewRefTitle('');
    setNewRefContent('');
    setExpandedReflectionId(newEntry.id);
    setShowAddReflection(false);
    showToast('Refleksi baru berhasil ditambahkan! 🤍');
  };

  // Delete reflection
  const handleDeleteReflection = (id: string, title: string) => {
    const updated = reflections.filter((r) => r.id !== id);
    setReflections(updated);
    localStorage.setItem('mcl_reflections_list_v1', JSON.stringify(updated));
    showToast(`Refleksi "${title.slice(0, 20)}..." dihapus.`);
  };

  // Copy reflection
  const handleCopyReflection = (r: ReflectionItem) => {
    navigator.clipboard.writeText(`[Refleksi ${r.date} - ${r.title}]\nKategori: ${r.category} | Mood: ${r.mood}\n\n${r.content}`);
    showToast('Isi refleksi berhasil disalin!');
  };

  // Add goal submit
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addGoal(newGoalTitle.trim(), newGoalCategory);
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  const completedGoals = goals.filter((g) => g.isDone).length;
  const totalGoals = goals.length;
  const goalPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const filteredReflections = selectedCategoryFilter === 'Semua' 
    ? reflections 
    : reflections.filter(r => r.category === selectedCategoryFilter);

  // Category counts
  const categoryOptions = [
    { value: 'Semua', label: 'Semua Kategori', count: reflections.length, color: '#881337' },
    { value: 'Praktikum & Lab', label: 'Praktikum & Lab Kimia', count: reflections.filter(r => r.category === 'Praktikum & Lab').length, color: '#be123c' },
    { value: 'Perkuliahan', label: 'Perkuliahan & Teori', count: reflections.filter(r => r.category === 'Perkuliahan').length, color: '#2563eb' },
    { value: 'Pengembangan Diri', label: 'Pengembangan Diri', count: reflections.filter(r => r.category === 'Pengembangan Diri').length, color: '#16a34a' },
    { value: 'Momen Manis', label: 'Momen Manis Bersama', count: reflections.filter(r => r.category === 'Momen Manis').length, color: '#e11d48' },
    { value: 'Evaluasi Diri', label: 'Evaluasi & Target', count: reflections.filter(r => r.category === 'Evaluasi Diri').length, color: '#d97706' }
  ];

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Academic Target Hero Banner (Polished, Editable IP & Metadata) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white p-6 sm:p-8 shadow-sm border border-rose-300/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs border border-white/20 whitespace-nowrap">
                <Award className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
                <span>{academicTarget.semesterName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[11px] font-medium border border-rose-400/20 whitespace-nowrap">
                <GraduationCap className="w-3 h-3 text-rose-300" />
                <span>Pendidikan Kimia UPI</span>
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Target IPK {academicTarget.targetIPK} & Sukses Calon Guru Kimia
            </h2>

            <p className="font-sans text-xs sm:text-sm text-rose-100/90 max-w-2xl leading-relaxed">
              {academicTarget.motivationNote}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  setEditFormTarget(academicTarget);
                  setIsEditingTarget(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-rose-300" />
                <span>Edit Target IP & Semester</span>
              </button>
            </div>
          </div>

          {/* Metric Dashboard Box */}
          <div className="grid grid-cols-2 gap-2.5 w-full lg:w-auto flex-shrink-0">
            {/* Target IPK */}
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-xs text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold block mb-1">
                Target IPK
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-white">
                {academicTarget.targetIPK}
                <span className="text-xs text-rose-200 font-sans font-normal ml-1">/4.00</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold mt-1 block truncate">
                {academicTarget.predicate}
              </span>
            </div>

            {/* Target IPS */}
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-xs text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold block mb-1">
                Target IPS Semester
              </span>
              <div className="font-display font-black text-2xl sm:text-3xl text-white">
                {academicTarget.currentIPS}
              </div>
              <span className="text-[10px] text-rose-200 font-medium mt-1 block">
                Beban {academicTarget.targetSKS} SKS
              </span>
            </div>
          </div>
        </div>

        {/* Modal Edit Target IP (Refined, Highly Polished UI/UX) */}
        {isEditingTarget && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-200 animate-scale-up space-y-5 my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-rose-900 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                      Edit Target IP & Akademik
                    </h3>
                    <p className="text-xs text-slate-500">Sesuaikan target nilai, semester & motivasi belajar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTarget} className="space-y-4">
                {/* 1. Academic Numerical Goals Grid */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Target Indeks Prestasi (IP)
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Skala 4.00</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* Target IPK */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Target IPK
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editFormTarget.targetIPK}
                          onChange={(e) => setEditFormTarget({ ...editFormTarget, targetIPK: e.target.value })}
                          placeholder="3.85"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-900 font-bold text-slate-900 shadow-2xs"
                          required
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                          /4.00
                        </span>
                      </div>
                    </div>

                    {/* Target IPS */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Target IPS
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editFormTarget.currentIPS}
                          onChange={(e) => setEditFormTarget({ ...editFormTarget, currentIPS: e.target.value })}
                          placeholder="3.90"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-900 font-bold text-slate-900 shadow-2xs"
                          required
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                          /4.00
                        </span>
                      </div>
                    </div>

                    {/* Beban SKS */}
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Beban SKS
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editFormTarget.targetSKS}
                          onChange={(e) => setEditFormTarget({ ...editFormTarget, targetSKS: e.target.value })}
                          placeholder="21"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-900 font-bold text-slate-900 shadow-2xs"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                          SKS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Predikat & Semester Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Predikat Kelulusan
                    </label>
                    <CustomSelect
                      value={editFormTarget.predicate}
                      onChange={(val) => setEditFormTarget({ ...editFormTarget, predicate: val })}
                      options={[
                        { value: 'Dengan Pujian (Cum Laude)', label: 'Dengan Pujian (Cum Laude)', color: '#10b981' },
                        { value: 'Sangat Memuaskan', label: 'Sangat Memuaskan', color: '#2563eb' },
                        { value: 'Memuaskan', label: 'Memuaskan', color: '#f59e0b' }
                      ]}
                      ariaLabel="Predikat Kelulusan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Nama / Keterangan Semester
                    </label>
                    <input
                      type="text"
                      value={editFormTarget.semesterName}
                      onChange={(e) => setEditFormTarget({ ...editFormTarget, semesterName: e.target.value })}
                      placeholder="Contoh: Semester Ganjil 2026/2027"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-900 font-semibold text-slate-800 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 3. Motivation Note */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pesan Motivasi & Doa Mas
                    </label>
                    <span className="text-[10px] text-rose-800 font-semibold">Bisa diedit</span>
                  </div>
                  <textarea
                    rows={3}
                    value={editFormTarget.motivationNote}
                    onChange={(e) => setEditFormTarget({ ...editFormTarget, motivationNote: e.target.value })}
                    placeholder="Tuliskan motivasi, target, atau kata-kata penyemangat..."
                    className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-rose-900 text-slate-800 leading-relaxed font-sans shadow-2xs"
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingTarget(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold bg-rose-900 hover:bg-rose-800 text-white rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Target IP</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* 2. Goals & Commitments Checklist */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-900 flex-shrink-0 shadow-2xs">
              <Target className="w-6 h-6 text-rose-900" />
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
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Target Baru</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
          <div
            className="bg-gradient-to-r from-rose-700 to-rose-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>

        {/* Add Goal Form */}
        {showAddGoal && (
          <form onSubmit={handleAddGoalSubmit} className="flex flex-col sm:flex-row gap-2.5 p-4 bg-rose-50/60 rounded-2xl border border-rose-200 animate-fade-in">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Contoh: Lulus praktikum Kimia Dasar dengan nilai A..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-800"
              autoFocus
            />
            <div className="w-full sm:w-52">
              <CustomSelect
                value={newGoalCategory}
                onChange={(val) => setNewGoalCategory(val as GoalItem['category'])}
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

      {/* 3. Multi-Item Reflection Manager (Dropdown Category & Neat Expandable Layout) */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 flex-shrink-0 shadow-2xs">
              <Lightbulb className="w-6 h-6 text-amber-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Refleksi & Catatan Hati Semester
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                  {reflections.length} Catatan Tersimpan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi praktikum kimia, pencapaian mingguan, dan momen indah bersama Mas
              </p>
            </div>
          </div>

          {/* Action Row: Dropdown Filter + Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start lg:self-center flex-shrink-0 w-full sm:w-auto">
            {/* Category Dropdown Selector */}
            <div className="w-full sm:w-60">
              <CustomSelect
                value={selectedCategoryFilter}
                onChange={(val) => setSelectedCategoryFilter(val)}
                options={categoryOptions}
                icon={Filter}
                placeholder="Pilih Kategori..."
                ariaLabel="Filter Kategori Refleksi"
              />
            </div>

            {/* Write Reflection Button */}
            <button
              onClick={() => setShowAddReflection(!showAddReflection)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddReflection ? 'Tutup Form' : 'Tulis Refleksi'}</span>
            </button>
          </div>
        </div>

        {/* Add Reflection Form Drawer/Box */}
        {showAddReflection && (
          <form onSubmit={handleAddReflection} className="p-5 sm:p-6 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-4 animate-fade-in shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/70">
              <span className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Tuliskan Refleksi Baru
              </span>
              <span className="text-[11px] text-slate-500">Pilih inspirasi topik atau ketik bebas</span>
            </div>

            {/* Quick Inspiration Topics Dropdown / Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 block">Inspirasi Topik Cepat:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {reflectionPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewRefTitle(prompt);
                      if (!newRefContent) {
                        setNewRefContent(`Refleksi: `);
                      }
                    }}
                    className="text-xs p-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-slate-700 text-left transition-all cursor-pointer line-clamp-1 hover:bg-rose-50/80 shadow-2xs"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Topik Refleksi</label>
                <input
                  type="text"
                  value={newRefTitle}
                  onChange={(e) => setNewRefTitle(e.target.value)}
                  placeholder="Contoh: Refleksi Minggu Ini di Lab Kimia UPI..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:border-rose-900 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={newRefDate}
                  onChange={(e) => setNewRefDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:border-rose-900 shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Refleksi</label>
                <CustomSelect
                  value={newRefCategory}
                  onChange={(val) => setNewRefCategory(val as ReflectionItem['category'])}
                  options={[
                    { value: 'Praktikum & Lab', label: 'Praktikum & Lab Kimia', color: '#881337' },
                    { value: 'Perkuliahan', label: 'Perkuliahan & Teori', color: '#2563eb' },
                    { value: 'Pengembangan Diri', label: 'Pengembangan Diri', color: '#16a34a' },
                    { value: 'Momen Manis', label: 'Momen Manis Bersama', color: '#e11d48' },
                    { value: 'Evaluasi Diri', label: 'Evaluasi Diri & Kebiasaan', color: '#d97706' }
                  ]}
                  ariaLabel="Kategori Refleksi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mood / Suasana Hati</label>
                <CustomSelect
                  value={newRefMood}
                  onChange={(val) => setNewRefMood(val)}
                  options={[
                    { value: '✨ Ceria', label: '✨ Ceria & Bersyukur' },
                    { value: '🧪 Ambis Lab', label: '🧪 Ambis Lab & Praktikum' },
                    { value: '💡 Pencerahan', label: '💡 Pencerahan & Ide Baru' },
                    { value: '❤️ Bahagia Bersama', label: '❤️ Bahagia & Kangen Mas' },
                    { value: '☕ Butuh Kopi', label: '☕ Lelah & Butuh Kopi' }
                  ]}
                  ariaLabel="Mood Refleksi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Catatan & Refleksi Hati</label>
              <textarea
                rows={4}
                value={newRefContent}
                onChange={(e) => setNewRefContent(e.target.value)}
                placeholder="Tuliskan pengalaman, perasaan, atau insight yang kamu dapatkan..."
                className="w-full p-3.5 text-xs sm:text-sm bg-white rounded-xl border border-rose-200 text-slate-800 leading-relaxed font-reading focus:outline-hidden focus:border-rose-900 shadow-2xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddReflection(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-bold bg-rose-900 hover:bg-rose-800 text-white rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Simpan Refleksi
              </button>
            </div>
          </form>
        )}

        {/* Reflections List with Accordion / Dropdown Cards */}
        {filteredReflections.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada catatan refleksi untuk filter ini</p>
            <p className="text-xs text-slate-400 mt-1">Pilih kategori lain di dropdown atas atau klik tombol "Tulis Refleksi".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReflections.map((item) => {
              const isExpanded = expandedReflectionId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-white border-rose-300 shadow-xs ring-1 ring-rose-200/50'
                      : 'bg-slate-50/60 hover:bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Collapsible Header Row (Dropdown click) */}
                  <div
                    onClick={() => setExpandedReflectionId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
                        isExpanded ? 'bg-rose-100 text-rose-900' : 'bg-white text-slate-500 border border-slate-200 group-hover:text-rose-900'
                      }`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 uppercase">
                            {item.category}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                            {item.mood}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Action buttons */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyReflection(item);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Salin Isi Refleksi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReflection(item.id, item.title);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus Refleksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className={`p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 transition-transform ${isExpanded ? 'rotate-180 text-rose-900' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Dropdown Content Body */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-rose-50/20 animate-fade-in space-y-3">
                      <p className="text-xs sm:text-sm text-slate-800 font-reading leading-relaxed bg-white p-4 rounded-xl border border-rose-100/80 shadow-2xs">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Tersimpan di jurnal digital santuari</span>
                        <button
                          onClick={() => setExpandedReflectionId(null)}
                          className="text-rose-900 hover:underline font-semibold cursor-pointer"
                        >
                          Tutup Catatan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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

