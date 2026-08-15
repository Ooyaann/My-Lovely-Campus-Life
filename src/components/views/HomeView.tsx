import React, { useState } from 'react';
import { 
  RefreshCw, 
  Heart, 
  Sparkles, 
  Smile, 
  Frown, 
  Coffee, 
  Battery, 
  Flame, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  BookOpen, 
  PhoneCall, 
  GraduationCap,
  Mail,
  FlaskConical,
  ExternalLink,
  Copy,
  Check,
  Shuffle,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_PORTAL_LINKS, WEEKLY_QUESTIONS } from '../../data/initialData';
import { WeeklyQuestion } from '../../types';

export const HomeView: React.FC = () => {
  const {
    currentQuote,
    nextQuote,
    affirmations,
    currentAffirmation,
    nextAffirmation,
    toggleFavoriteAffirmation,
    currentMood,
    updateMood,
    goals,
    toggleGoal,
    addGoal,
    assignments,
    toggleAssignment,
    courses,
    setActiveTab,
    showToast
  } = useApp();

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState<WeeklyQuestion>(WEEKLY_QUESTIONS[0]);

  const pendingTasks = assignments.filter((t) => !t.isDone);
  const upcomingTasks = pendingTasks.slice(0, 3);

  // Get current day in Indonesian
  const dayNamesIndo: Record<number, string> = {
    0: 'Minggu',
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu'
  };
  const currentDayName = dayNamesIndo[new Date().getDay()] || 'Senin';
  const todayCourses = courses.filter((c) => c.day === currentDayName);

  const moodOptions = [
    { label: 'Ceria ✨' },
    { label: 'Pusing Lab 🧪' },
    { label: 'Semangat Ambis 🔥' },
    { label: 'Butuh Kopi ☕' },
    { label: 'Kangen Mas ❤️' },
    { label: 'Lelah 🔋' }
  ];

  const energyOptions = [25, 50, 75, 100];

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote}" — Dari Mas 🤍`);
    setCopiedMsg(true);
    showToast('Pesan Mas berhasil disalin!');
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleShuffleQuestion = () => {
    const rand = WEEKLY_QUESTIONS[Math.floor(Math.random() * WEEKLY_QUESTIONS.length)];
    setRandomQuestion(rand);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addGoal(newGoalTitle.trim(), 'Kencan');
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* 1. Hero Card: Pesan Sayang dari Mas (Bright Maroon Gradient) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white p-5 sm:p-7 shadow-sm border border-rose-300/20">
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-3.5">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs border border-white/20 whitespace-nowrap">
              <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200 flex-shrink-0" />
              <span>Pesan Sayang dari Mas</span>
            </span>
            <button
              id="refresh-quote-btn"
              onClick={nextQuote}
              aria-label="Ganti Pesan dari Mas"
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all active:rotate-180 duration-300 cursor-pointer flex-shrink-0"
              title="Ganti Pesan Mas"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <blockquote className="font-display font-medium italic text-base sm:text-xl text-white leading-relaxed max-w-xl px-2">
            "{currentQuote}"
          </blockquote>

          <div className="flex items-center gap-2 pt-1 text-xs whitespace-nowrap justify-center flex-wrap">
            <span className="text-rose-100 font-semibold px-2.5 py-1 bg-white/10 rounded-lg whitespace-nowrap">
              — Mas kamu 🤍
            </span>
            <button
              onClick={handleCopyQuote}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors cursor-pointer whitespace-nowrap border border-white/15"
            >
              {copiedMsg ? <Check className="w-3 h-3 text-emerald-300 flex-shrink-0" /> : <Copy className="w-3 h-3 flex-shrink-0" />}
              <span>{copiedMsg ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>
            <button
              onClick={() => setActiveTab('romantic-vault')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-white font-medium transition-colors cursor-pointer whitespace-nowrap border border-rose-400/30"
            >
              <span>Buka Vault Surat</span>
              <ArrowRight className="w-3 h-3 text-rose-200 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Subtle Decorative Aura */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* 2. Afirmasi Harian Romantis (Fitur Khusus Hubungan & Penyemangat) */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-pink-50 rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-100 text-rose-900 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Afirmasi Harian Romantis
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyemangat cinta & kekuatan mental untuk hari-harimu di Kimia UPI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => toggleFavoriteAffirmation(currentAffirmation.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                currentAffirmation.isFavorite
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-rose-900'
              }`}
              title={currentAffirmation.isFavorite ? 'Disukai' : 'Simpan ke Favorit'}
            >
              <Star className={`w-4 h-4 ${currentAffirmation.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
            <button
              onClick={nextAffirmation}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-900 hover:border-rose-300 transition-all cursor-pointer"
              title="Afirmasi Berikutnya"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Affirmation Card Box */}
        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100/80 px-2 py-0.5 rounded-md whitespace-nowrap">
              {currentAffirmation.category}
            </span>
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
              Afirmasi Hari Ini ✨
            </span>
          </div>

          <p className="font-display font-semibold text-slate-800 text-sm sm:text-base leading-relaxed italic">
            "{currentAffirmation.text}"
          </p>

          <p className="text-[11px] text-slate-500 font-sans">
            Katakan pada dirimu sendiri: <span className="font-semibold text-rose-900">"Aku pantas bahagia, dicintai tulus, dan mampu melewati setiap tantangan kuliah."</span>
          </p>
        </div>
      </section>

      {/* 3. Mood & Energy Quick Check-In */}
      <section className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-900 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider whitespace-nowrap">
              Bagaimana Harimu Hari Ini, Sayang?
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
              Energi: <strong className="text-rose-900">{currentMood.energy}%</strong>
            </span>
          </div>
        </div>

        {/* Mood Selector: Clean non-scrolling Grid with Dropdown Fallback */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {moodOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateMood(opt.label, currentMood.energy)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border ${
                currentMood.mood === opt.label
                  ? 'bg-rose-900 text-white border-rose-900 shadow-xs font-bold'
                  : 'bg-rose-50/50 hover:bg-rose-100/80 text-slate-700 border-rose-100/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Energy Meter Buttons (Full Width Grid) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Tingkat Energi:</span>
          <div className="grid grid-cols-4 gap-2 flex-1">
            {energyOptions.map((lvl) => (
              <button
                key={lvl}
                onClick={() => updateMood(currentMood.mood, lvl)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  currentMood.energy === lvl
                    ? 'bg-rose-900 text-white border border-rose-900 shadow-xs'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-600 border border-slate-200/80'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quick Jump Grid (Clean & Visual, Low Clutter) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {[
          { id: 'jadwal', label: 'Jadwal Kuliah', desc: 'KRS FPMIPA UPI', icon: Calendar, color: 'text-sky-700', bg: 'bg-sky-50' },
          { id: 'tugas', label: 'Tugas & Deadline', desc: `${pendingTasks.length} belum selesai`, icon: CheckCircle2, color: 'text-amber-700', bg: 'bg-amber-50' },
          { id: 'laptrak', label: 'Laptrak Studio', desc: 'Template & Kalkulator', icon: FlaskConical, color: 'text-rose-900', bg: 'bg-rose-50' },
          { id: 'belajar-ai', label: 'Belajar & AI Hub', desc: 'NotebookLM & Materi', icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-50' },
          { id: 'romantic-vault', label: 'Surat & Pesan', desc: 'Afirmasi & Amplop', icon: Mail, color: 'text-rose-700', bg: 'bg-pink-50' },
          { id: 'kontak-siaga', label: 'Kontak Mas', desc: 'Siaga 24 Jam', icon: PhoneCall, color: 'text-emerald-700', bg: 'bg-emerald-50' }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-900 transition-colors truncate">
                  {item.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {/* 5. Two-Column Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Column: Today's Classes & Urgent Tasks */}
        <div className="space-y-5">
          {/* Today's Schedule Card */}
          <div className="p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-900 flex-shrink-0" />
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800 truncate">
                  Kuliah Hari Ini ({currentDayName})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('jadwal')}
                className="text-xs font-bold text-rose-900 hover:underline flex items-center gap-0.5 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {todayCourses.length > 0 ? (
              <div className="space-y-2.5">
                {todayCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-rose-200 transition-colors flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 whitespace-nowrap">
                        {c.category} • {c.sks} SKS
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" /> {c.time}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" /> {c.room}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 space-y-1">
                <Smile className="w-8 h-8 mx-auto text-rose-300" />
                <p className="text-xs font-medium">Tidak ada jadwal kuliah hari ini!</p>
                <p className="text-[11px] text-slate-400">Waktunya istirahat, nugas santai, atau ngobrol bareng Mas ❤️</p>
              </div>
            )}
          </div>

          {/* Urgent Tasks Card */}
          <div className="p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-900 flex-shrink-0" />
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800 truncate">
                  Tugas & Deadline Terdekat
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-xs font-bold text-rose-900 hover:underline flex items-center gap-0.5 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <span>Kelola ({pendingTasks.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleAssignment(t.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-800 truncate">
                          {t.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          Deadline: <span className="text-rose-900 font-medium">{t.deadline}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-900 border border-rose-200 flex-shrink-0 whitespace-nowrap">
                      {t.categoryName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center text-slate-400 space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <p className="text-xs font-medium">Semua tugas beres! Hebat banget Sayang ✨</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Connection Ritual & Wishlist */}
        <div className="space-y-5">
          {/* Weekly Connection Ritual Box (Menu Obrolan LDR) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-pink-50 border border-rose-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-900 flex-shrink-0" />
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800 truncate">
                  Ide Obrolan Telepon Malam Ini
                </h3>
              </div>
              <button
                onClick={handleShuffleQuestion}
                className="p-1.5 rounded-xl bg-white text-rose-900 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                title="Ganti Topik Pertanyaan"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-100 text-center space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                {randomQuestion.category}
              </span>
              <p className="font-display font-semibold text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                "{randomQuestion.question}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 text-[11px] truncate">Tanya Mas waktu teleponan nanti ya!</span>
              <button
                onClick={() => setActiveTab('romantic-vault')}
                className="text-xs font-bold text-rose-900 hover:underline cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                Buka Semua Topik &rarr;
              </button>
            </div>
          </div>

          {/* Quick Wishlist & Rencana Berdua */}
          <div className="p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-900 flex-shrink-0" />
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-800 truncate">
                  Rencana & Wishlist Berdua
                </h3>
              </div>
              <button
                onClick={() => setShowAddGoal(!showAddGoal)}
                className="text-xs font-bold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah</span>
              </button>
            </div>

            {showAddGoal && (
              <form onSubmit={handleCreateGoal} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rencana baru (contoh: makan bareng)..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-rose-200 text-xs focus:outline-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-rose-900 text-white text-xs font-bold hover:bg-rose-800 cursor-pointer whitespace-nowrap"
                >
                  Simpan
                </button>
              </form>
            )}

            <div className="space-y-2">
              {goals.slice(0, 4).map((g) => (
                <div
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-rose-50/60 border border-slate-100 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  {g.isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium truncate ${g.isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {g.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Portal Shortcuts */}
          <div className="p-4 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <BookOpen className="w-4 h-4 text-rose-900 flex-shrink-0" /> Portal Akademik UPI:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {CAMPUS_PORTAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-[11px] font-bold text-slate-700 hover:text-rose-900 border border-slate-200/80 transition-colors inline-flex items-center justify-center gap-1 text-center"
                >
                  <span className="truncate">{link.title.split(' ')[0]}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

