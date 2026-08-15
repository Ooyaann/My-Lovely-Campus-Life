import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Droplets, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Sparkles,
  Coffee,
  Check,
  Activity,
  Heart,
  Minus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';

export const HabitsFocusView: React.FC = () => {
  const {
    habits,
    toggleHabit,
    addHabit,
    deleteHabit,
    wellnessLogs,
    addWellnessLog,
    deleteWellnessLog,
    toggleWellnessLogStatus,
    waterCount,
    incrementWater,
    decrementWater,
    resetWater,
    pomodoroTime,
    isPomodoroRunning,
    pomodoroMode,
    isAmbientActive,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    toggleAmbientSound
  } = useApp();

  const [newHabitLabel, setNewHabitLabel] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Kesehatan');
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Wellness Log State
  const [showAddWellness, setShowAddWellness] = useState(false);
  const [newWellnessTitle, setNewWellnessTitle] = useState('');
  const [newWellnessCategory, setNewWellnessCategory] = useState<'Kesehatan' | 'Nutrisi' | 'Istirahat' | 'Mental'>('Kesehatan');
  const [newWellnessNote, setNewWellnessNote] = useState('');

  // Format time mm:ss
  const minutes = Math.floor(pomodoroTime / 60);
  const seconds = pomodoroTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleAddHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitLabel.trim()) return;
    addHabit(newHabitLabel.trim(), newHabitCategory);
    setNewHabitLabel('');
    setShowAddHabit(false);
  };

  const handleAddWellnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWellnessTitle.trim()) return;
    addWellnessLog({
      title: newWellnessTitle.trim(),
      category: newWellnessCategory,
      note: newWellnessNote.trim() || undefined,
      status: 'pending'
    });
    setNewWellnessTitle('');
    setNewWellnessNote('');
    setShowAddWellness(false);
  };

  const completedHabits = habits.filter((h) => h.isDone).length;
  const totalHabits = habits.length;
  const habitPercent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const completedWellness = wellnessLogs.filter((w) => w.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Pomodoro Focus Engine for Laptrak */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
              <span>
                {pomodoroMode === 'work' ? 'Sesi Fokus Laptrak (25 Menit)' : 'Sesi Istirahat Manis (5 Menit)'}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Timer Fokus & Relaksasi
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 max-w-md leading-relaxed">
              Bantu Sayang fokus mencicil data percobaan tanpa distraksi. Dilengkapi synthesizer suara hujan tenang.
            </p>
          </div>

          {/* Big Digital Timer Display */}
          <div className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 px-8 py-6 rounded-3xl backdrop-blur-xs">
            <div className="font-mono font-extrabold text-5xl sm:text-6xl text-rose-100 tracking-wider">
              {formattedTime}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              {isPomodoroRunning ? (
                <button
                  id="pomodoro-pause-btn"
                  onClick={pausePomodoro}
                  className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Jeda Timer"
                >
                  <Pause className="w-5 h-5 fill-white flex-shrink-0" />
                </button>
              ) : (
                <button
                  id="pomodoro-start-btn"
                  onClick={startPomodoro}
                  className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Mulai Fokus"
                >
                  <Play className="w-5 h-5 fill-white flex-shrink-0" />
                </button>
              )}

              <button
                id="pomodoro-reset-btn"
                onClick={() => resetPomodoro(pomodoroMode === 'work' ? 25 : 5)}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-rose-200 transition-all cursor-pointer"
                title="Reset Waktu"
              >
                <RotateCcw className="w-5 h-5 flex-shrink-0" />
              </button>

              {/* Lo-Fi Ambient Synthesizer Button */}
              <button
                id="pomodoro-ambient-toggle-btn"
                onClick={toggleAmbientSound}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isAmbientActive
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-xs animate-pulse'
                    : 'bg-white/10 border-white/20 text-rose-200 hover:bg-white/20'
                }`}
                title={isAmbientActive ? 'Matikan Suara Hujan & Lo-Fi' : 'Nyalakan Suara Hujan & Lo-Fi'}
              >
                {isAmbientActive ? <Volume2 className="w-5 h-5 flex-shrink-0" /> : <VolumeX className="w-5 h-5 flex-shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hydration / Water Tracker (8 Glasses) */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-800 flex-shrink-0">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Pengingat Minum Air (Target 2 Liter)
              </h3>
              <p className="text-xs text-slate-500">
                Jangan sampai dehidrasi waktu praktikum di laboratorium FPMIPA ya Sayang 💧
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={decrementWater}
              disabled={waterCount === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
              title="Kurang 1 Gelas"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={resetWater}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
            <button
              id="drink-water-btn"
              onClick={incrementWater}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>+ 1 Gelas</span>
            </button>
          </div>
        </div>

        {/* 8 Glasses Visual Row */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < waterCount;
            return (
              <div
                key={idx}
                onClick={idx === waterCount ? incrementWater : undefined}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isFilled
                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-blue-300'
                }`}
              >
                <Droplets className={`w-5 h-5 ${isFilled ? 'text-blue-600 fill-blue-500' : 'text-slate-300'}`} />
                <span className="text-[10px] whitespace-nowrap">Gelas {idx + 1}</span>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-center text-slate-500 pt-1">
          {waterCount >= 8 ? (
            <span className="text-emerald-950 font-bold flex items-center justify-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              Target 8 gelas tercapai! Luar biasa Sayang!
            </span>
          ) : (
            <span>Tercatat: {waterCount} / 8 gelas ({waterCount * 250} mL)</span>
          )}
        </div>
      </section>

      {/* 3. Wellness & Health Tracker (Tambah & Hapus Kesehatan Sendiri) */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0">
              <Activity className="w-6 h-6 text-rose-900" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Log Kesehatan & Perawatan Diri
              </h3>
              <p className="text-xs text-slate-500">
                {completedWellness} dari {wellnessLogs.length} target kesehatan tercapai hari ini
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddWellness(!showAddWellness)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catatan Kesehatan</span>
          </button>
        </div>

        {/* Add Wellness Form */}
        {showAddWellness && (
          <form onSubmit={handleAddWellnessSubmit} className="space-y-3 p-4 bg-rose-50/70 rounded-2xl border border-rose-100 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Aktivitas / Indikator Kesehatan *</label>
                <input
                  type="text"
                  required
                  value={newWellnessTitle}
                  onChange={(e) => setNewWellnessTitle(e.target.value)}
                  placeholder="Contoh: Minum Vitamin C & Madu, Peregangan Punggung"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-rose-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                <CustomSelect
                  value={newWellnessCategory}
                  onChange={(val) => setNewWellnessCategory(val as any)}
                  options={[
                    { value: 'Kesehatan', label: 'Kesehatan', color: '#10b981' },
                    { value: 'Nutrisi', label: 'Nutrisi', color: '#f59e0b' },
                    { value: 'Istirahat', label: 'Istirahat', color: '#6366f1' },
                    { value: 'Mental', label: 'Mental', color: '#ec4899' }
                  ]}
                  ariaLabel="Pilih Kategori Kesehatan"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                value={newWellnessNote}
                onChange={(e) => setNewWellnessNote(e.target.value)}
                placeholder="Contoh: Sesudah sarapan pagi sebelum berangkat lab"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddWellness(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-white rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Simpan Kesehatan
              </button>
            </div>
          </form>
        )}

        {/* Wellness Logs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wellnessLogs.map((item) => {
            const isCompleted = item.status === 'completed';
            return (
              <div
                key={item.id}
                onClick={() => toggleWellnessLogStatus(item.id)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isCompleted
                    ? 'bg-rose-50/50 border-rose-200/80 text-slate-600'
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-800 hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-1.5 py-0.2 rounded whitespace-nowrap">
                        {item.category}
                      </span>
                      {item.note && (
                        <span className="text-[11px] text-slate-500 truncate">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWellnessLog(item.id);
                  }}
                  className="p-1.5 text-slate-300 hover:text-rose-600 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  title="Hapus Catatan Kesehatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Daily Micro-Habits Checklist */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0">
              <HeartHandshake className="w-6 h-6 text-rose-900" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Micro-Habits Keseharian & Kuliah
              </h3>
              <p className="text-xs text-slate-500">
                {completedHabits} dari {totalHabits} rutinitas terpenuhi hari ini ({habitPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Tambah Kebiasaan"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Kebiasaan</span>
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddHabit && (
          <form onSubmit={handleAddHabitSubmit} className="flex gap-2 p-3 bg-rose-50/70 rounded-2xl border border-rose-100 animate-fade-in">
            <input
              type="text"
              value={newHabitLabel}
              onChange={(e) => setNewHabitLabel(e.target.value)}
              placeholder="Contoh: Mengulang reaksi kimia 15 menit..."
              className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-rose-500"
              autoFocus
            />
            <div className="w-40">
              <CustomSelect
                value={newHabitCategory}
                onChange={setNewHabitCategory}
                options={[
                  { value: 'Kesehatan', label: 'Kesehatan', color: '#10b981' },
                  { value: 'Akademik', label: 'Akademik', color: '#881337' },
                  { value: 'Mindset', label: 'Mindset', color: '#6366f1' },
                  { value: 'Cinta', label: 'Cinta', color: '#e11d48' }
                ]}
                ariaLabel="Kategori Habit"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
            >
              Simpan
            </button>
          </form>
        )}

        {/* Habits Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                habit.isDone
                  ? 'bg-rose-50/50 border-rose-200/80 text-slate-600'
                  : 'bg-slate-50/50 border-slate-200/80 text-slate-800 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {habit.isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-400 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-medium truncate ${habit.isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {habit.label}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {habit.category}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHabit(habit.id);
                }}
                className="p-1.5 text-slate-300 hover:text-rose-600 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                title="Hapus Kebiasaan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

