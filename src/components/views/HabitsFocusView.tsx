import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
  Heart,
  Minus,
  Brain,
  Bell,
  BellRing,
  Send,
  BookOpen,
  ChevronDown,
  SlidersHorizontal,
  GraduationCap,
  FlaskConical,
  ListTodo,
  Calendar,
  AlertCircle,
  XCircle,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendLocalNotification, 
  isNotificationSupported 
} from '../../utils/notifications';

interface PresetOption {
  id: string;
  label: string;
  sublabel: string;
  minutes: number;
  mode: 'work' | 'break';
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  colorScheme: {
    bgLight: string;
    badgeText: string;
    badgeBorder: string;
    iconBg: string;
    iconColor: string;
    activeBorder: string;
    accentDot: string;
  };
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'work-25',
    label: 'Fokus Belajar Standar (25 Menit)',
    sublabel: 'Pomodoro klasik untuk materi kuliah kimia',
    minutes: 25,
    mode: 'work',
    icon: BookOpen,
    tag: 'Fokus 25m',
    colorScheme: {
      bgLight: 'bg-sky-950/50',
      badgeText: 'text-sky-300',
      badgeBorder: 'border-sky-500/40',
      iconBg: 'bg-sky-500/20',
      iconColor: 'text-sky-300',
      activeBorder: 'border-sky-400',
      accentDot: 'bg-sky-400'
    }
  },
  {
    id: 'work-45',
    label: 'Sesi Laptrak & Jurnal (45 Menit)',
    sublabel: 'Analisis data praktikum & penyusunan laptrak',
    minutes: 45,
    mode: 'work',
    icon: FlaskConical,
    tag: 'Laptrak 45m',
    colorScheme: {
      bgLight: 'bg-purple-950/50',
      badgeText: 'text-purple-300',
      badgeBorder: 'border-purple-500/40',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      activeBorder: 'border-purple-400',
      accentDot: 'bg-purple-400'
    }
  },
  {
    id: 'work-60',
    label: 'Sesi Belajar Intensif (60 Menit)',
    sublabel: 'Latihan soal kimia fisik & persiapan UTS / UAS',
    minutes: 60,
    mode: 'work',
    icon: Brain,
    tag: 'Intensif 60m',
    colorScheme: {
      bgLight: 'bg-amber-950/50',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/40',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-300',
      activeBorder: 'border-amber-400',
      accentDot: 'bg-amber-400'
    }
  },
  {
    id: 'work-90',
    label: 'Sesi Praktikum Laboratorium (90 Menit)',
    sublabel: 'Simulasi ritme kerja di lab kimia FPMIPA UPI',
    minutes: 90,
    mode: 'work',
    icon: Activity,
    tag: 'Lab Kimia 90m',
    colorScheme: {
      bgLight: 'bg-rose-950/50',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-500/40',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-300',
      activeBorder: 'border-rose-400',
      accentDot: 'bg-rose-400'
    }
  },
  {
    id: 'break-5',
    label: 'Jeda Istirahat Pendek (5 Menit)',
    sublabel: 'Waktu minum air putih, peregangan & relaksasi mata',
    minutes: 5,
    mode: 'break',
    icon: Coffee,
    tag: 'Jeda 5m',
    colorScheme: {
      bgLight: 'bg-emerald-950/50',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/40',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-300',
      activeBorder: 'border-emerald-400',
      accentDot: 'bg-emerald-400'
    }
  },
  {
    id: 'break-15',
    label: 'Jeda Istirahat Panjang (15 Menit)',
    sublabel: 'Rehat menyeluruh, camilan sehat & re-energize',
    minutes: 15,
    mode: 'break',
    icon: Sparkles,
    tag: 'Jeda 15m',
    colorScheme: {
      bgLight: 'bg-teal-950/50',
      badgeText: 'text-teal-300',
      badgeBorder: 'border-teal-500/40',
      iconBg: 'bg-teal-500/20',
      iconColor: 'text-teal-300',
      activeBorder: 'border-teal-400',
      accentDot: 'bg-teal-400'
    }
  }
];

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
    setPomodoroTime,
    setPomodoroMode,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    toggleAmbientSound,
    showToast,
    courses,
    assignments
  } = useApp();

  // Preset Selection State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('work-25');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Habit & Wellness Form States
  const [newHabitLabel, setNewHabitLabel] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Kesehatan');
  const [showAddHabit, setShowAddHabit] = useState(false);

  const [showAddWellness, setShowAddWellness] = useState(false);
  const [newWellnessTitle, setNewWellnessTitle] = useState('');
  const [newWellnessCategory, setNewWellnessCategory] = useState<'Kesehatan' | 'Nutrisi' | 'Istirahat' | 'Mental'>('Kesehatan');
  const [newWellnessNote, setNewWellnessNote] = useState('');

  // Notification State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(getNotificationPermission());

  useEffect(() => {
    setNotifPermission(getNotificationPermission());
  }, []);

  const handleRequestNotification = async () => {
    if (!isNotificationSupported()) {
      showToast('Browser ini belum mendukung fitur web notification.');
      return;
    }
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted') {
      showToast('Notifikasi pengingat browser berhasil diaktifkan.');
      sendLocalNotification('Notifikasi Kampus UPI Aktif', {
        body: 'Pengingat laptrak, tugas, jadwal kuliah & sesi fokus siap mengingatkanmu.'
      });
    } else {
      showToast('Izin notifikasi belum diberikan di browser.');
    }
  };

  const handleTestNotification = () => {
    if (notifPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    const sent = sendLocalNotification('Pengingat Mas', {
      body: 'Tetap jaga hidrasi, istirahatkan mata sejenak, dan semangat belajarnya ya.'
    });
    if (sent) {
      showToast('Notifikasi pengingat umum berhasil dikirim ke browser.');
    } else {
      showToast('Gagal mengirim notifikasi (periksa perizinan browser).');
    }
  };

  // 1. Notification: Tasks & Assignment Reminder
  const handleTestTaskNotification = () => {
    if (notifPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    const pendingTasks = assignments.filter(t => !t.isCompleted);
    if (pendingTasks.length === 0) {
      sendLocalNotification('Semua Tugas Selesai', {
        body: 'Hebat! Tidak ada tugas atau laptrak tertunda saat ini. Tetap pertahankan ritme belajarmu.'
      });
      showToast('Notifikasi status tugas berhasil dikirim.');
      return;
    }

    const nearestTask = pendingTasks[0];
    const sent = sendLocalNotification(`Pengingat Tugas: ${nearestTask.title}`, {
      body: `Mata Kuliah: ${nearestTask.course || nearestTask.categoryName} • Deadline: ${nearestTask.deadline} • Prioritas: ${nearestTask.priority.toUpperCase()}`
    });
    if (sent) {
      showToast(`Notifikasi tugas "${nearestTask.title}" dikirim.`);
    } else {
      showToast('Gagal mengirim notifikasi tugas.');
    }
  };

  // 2. Notification: Course / Class Schedule Reminder
  const handleTestCourseNotification = () => {
    if (notifPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    if (courses.length === 0) {
      sendLocalNotification('Jadwal Kuliah UPI', {
        body: 'Belum ada jadwal kuliah yang terdaftar di KRS.'
      });
      return;
    }

    const sampleCourse = courses[0];
    const sent = sendLocalNotification(`Jadwal Kuliah: ${sampleCourse.name}`, {
      body: `Hari: ${sampleCourse.day}, ${sampleCourse.time} • Ruang: ${sampleCourse.room} • Dosen: ${sampleCourse.lecturer}`
    });
    if (sent) {
      showToast(`Notifikasi jadwal kuliah "${sampleCourse.name}" dikirim.`);
    } else {
      showToast('Gagal mengirim notifikasi kuliah.');
    }
  };

  // 3. Notification: Focus & Timer Reminder
  const handleTestFocusNotification = () => {
    if (notifPermission !== 'granted') {
      handleRequestNotification();
      return;
    }
    const sent = sendLocalNotification('Sesi Fokus Belajar Selesai', {
      body: 'Waktu belajar telah selesai. Silakan lakukan peregangan dan minum air putih sejenak.'
    });
    if (sent) {
      showToast('Notifikasi pengingat timer fokus dikirim.');
    }
  };

  const handleSelectPreset = (preset: PresetOption) => {
    setSelectedPresetId(preset.id);
    pausePomodoro();
    setPomodoroMode(preset.mode);
    setPomodoroTime(preset.minutes * 60);
    setIsDropdownOpen(false);
    showToast(`Timer diatur ke ${preset.minutes} menit (${preset.mode === 'work' ? 'Sesi Fokus' : 'Istirahat'})`);
  };

  const activePreset = PRESET_OPTIONS.find(p => p.id === selectedPresetId) || PRESET_OPTIONS[0];
  const ActiveIcon = activePreset.icon;

  // Format mm:ss
  const minutes = Math.floor(pomodoroTime / 60);
  const seconds = pomodoroTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate remaining percentage for current preset
  const totalPresetSeconds = activePreset.minutes * 60;
  const timerPercentage = Math.min(100, Math.max(0, Math.round(((totalPresetSeconds - pomodoroTime) / totalPresetSeconds) * 100)));

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
  const wellnessPercent = wellnessLogs.length > 0 ? Math.round((completedWellness / wellnessLogs.length) * 100) : 0;

  const pendingAssignmentsCount = assignments.filter(a => !a.isCompleted).length;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Hero Box: Maroon Gradient Header with Integrated Pomodoro Timer & Colorful Dropdown */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm border border-rose-300/20 space-y-6 relative overflow-visible">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 overflow-hidden" />
        
        {/* Polished Header Title & Info Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-rose-800/60 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-900/90 text-rose-200 border border-rose-700/70 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-rose-300" />
                <span>Pendidikan Kimia UPI</span>
              </span>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-900/60 text-rose-200 border border-rose-700/50">
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>Ritme Belajar & Kebugaran</span>
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Habits, Hidrasi & Timer Fokus
            </h1>
            
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed max-w-2xl">
              Pusat manajemen waktu fokus praktikum kimia, pengingat minum 2 liter, serta log perawatan kesehatan harian.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-900/70 border border-rose-700/60 text-rose-100 text-xs font-medium shadow-xs">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Didampingi Mas Sepenuh Hati</span>
            </div>
          </div>
        </div>

        {/* Integrated Pomodoro Clock Section */}
        <div className="relative z-10 space-y-4">
          {/* Dropdown Preset Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-950/70 border border-rose-800/70 p-3 sm:p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-200">
              <SlidersHorizontal className="w-4 h-4 text-rose-300" />
              <span>Pilihan Mode & Durasi Timer:</span>
            </div>

            {/* Custom Colorful Dropdown Trigger */}
            <div ref={dropdownRef} className="relative w-full sm:w-88">
              <button
                type="button"
                id="pomodoro-preset-dropdown-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none text-left shadow-xs ${
                  isDropdownOpen
                    ? 'bg-rose-900/95 border-rose-400 text-white ring-2 ring-rose-400/30'
                    : 'bg-rose-900/70 hover:bg-rose-800/90 border-rose-700/80 text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${activePreset.colorScheme.iconBg} ${activePreset.colorScheme.iconColor} ${activePreset.colorScheme.badgeBorder}`}>
                    <ActiveIcon className="w-4 h-4" />
                  </div>
                  <span className="truncate text-white font-semibold">{activePreset.label}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold border ${activePreset.colorScheme.bgLight} ${activePreset.colorScheme.badgeText} ${activePreset.colorScheme.badgeBorder}`}>
                    {activePreset.tag}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-rose-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Colorful Dropdown Menu Options */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-950/95 rounded-2xl border border-rose-700/80 shadow-2xl overflow-hidden py-2 backdrop-blur-md animate-fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300/80 border-b border-slate-800/80 mb-1.5 flex items-center justify-between">
                    <span>Pilih Sesi Fokus / Istirahat</span>
                    <span className="text-[9px] text-slate-400 font-normal">Klik untuk memilih</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1 px-1.5">
                    {PRESET_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = option.id === selectedPresetId;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectPreset(option)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                            isSelected
                              ? `${option.colorScheme.bgLight} ${option.colorScheme.activeBorder} text-white font-bold shadow-xs`
                              : 'bg-transparent border-transparent hover:bg-slate-850 text-slate-200 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${option.colorScheme.iconBg} ${option.colorScheme.iconColor} ${option.colorScheme.badgeBorder}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate leading-snug">
                                {option.label}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {option.sublabel}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${option.colorScheme.bgLight} ${option.colorScheme.badgeText} ${option.colorScheme.badgeBorder}`}>
                              {option.tag}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className={`w-4 h-4 ${option.colorScheme.iconColor}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Large Monumental Clock Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-rose-900/40 border border-rose-700/50 p-6 sm:p-7 rounded-3xl backdrop-blur-xs">
            <div className="flex flex-col items-center sm:items-start space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isPomodoroRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-300'
                }`} />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  {pomodoroMode === 'work' ? 'Sesi Fokus Belajar Kimia' : 'Sesi Istirahat & Relaksasi'}
                </span>
              </div>
              <div className="font-mono font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white select-none">
                {formattedTime}
              </div>
              {/* Progress bar */}
              <div className="w-full bg-rose-950/60 rounded-full h-1.5 mt-2 overflow-hidden border border-rose-800/40">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-500 rounded-full"
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {isPomodoroRunning ? (
                <button
                  id="hero-pause-btn"
                  onClick={pausePomodoro}
                  className="py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Jeda Sesi</span>
                </button>
              ) : (
                <button
                  id="hero-start-btn"
                  onClick={startPomodoro}
                  className="py-3 px-6 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-rose-950" />
                  <span>Mulai Fokus</span>
                </button>
              )}

              <button
                id="hero-reset-btn"
                onClick={() => resetPomodoro(activePreset.minutes)}
                className="py-3 px-4 rounded-2xl bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-700/60 font-bold text-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                title="Reset Waktu Sesi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                id="hero-ambient-btn"
                onClick={toggleAmbientSound}
                className={`py-3 px-4 rounded-2xl border font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  isAmbientActive
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-rose-900/80 hover:bg-rose-800 text-rose-100 border-rose-700/60'
                }`}
                title={isAmbientActive ? 'Matikan Suara Ambien' : 'Nyalakan Suara Tenang'}
              >
                {isAmbientActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{isAmbientActive ? 'Suara Hujan ON' : 'Suara Tenang'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Notification Center: Refined and Highly Polished Layout */}
      <section 
        id="notification-center-section"
        className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-xs space-y-5"
      >
        {/* Notification Header with Balanced Alignment */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-900 flex-shrink-0 shadow-2xs">
              <BellRing className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Pusat Notifikasi & Pengingat Kuliah
                </h2>
                
                {/* Modern Status Badge with Dot Indicator */}
                <div 
                  id="notification-status-badge"
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    notifPermission === 'granted'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : notifPermission === 'denied'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    notifPermission === 'granted'
                      ? 'bg-emerald-500 animate-pulse'
                      : notifPermission === 'denied'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`} />
                  <span>
                    {notifPermission === 'granted' 
                      ? 'Notifikasi Browser Aktif' 
                      : notifPermission === 'denied' 
                      ? 'Izin Ditolak' 
                      : 'Izin Belum Diberikan'}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                Pemberitahuan otomatis untuk jadwal kuliah KRS UPI, batas waktu laptrak, dan timer fokus belajar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
            {notifPermission !== 'granted' ? (
              <button
                type="button"
                id="enable-notification-btn"
                onClick={handleRequestNotification}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Aktifkan Izin Notifikasi</span>
              </button>
            ) : (
              <button
                type="button"
                id="test-notification-general-btn"
                onClick={handleTestNotification}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-rose-800" />
                <span>Uji Notifikasi Cepat</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Polished Notification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Assignment & Laptrak */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-purple-200 hover:shadow-xs transition-all flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/60">
                  <ListTodo className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80">
                  {pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Tugas Aktif` : 'Semua Selesai'}
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Pengingat Deadline Tugas & Laptrak
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Peringatan otomatis sebelum tenggat waktu pengumpulan tugas & laporan praktikum kimia.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="test-task-notif-btn"
              onClick={handleTestTaskNotification}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition-all cursor-pointer active:scale-98"
            >
              <Send className="w-3.5 h-3.5 text-purple-700" />
              <span>Uji Notifikasi Tugas</span>
            </button>
          </div>

          {/* Card 2: KRS Class Schedule */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-sky-200 hover:shadow-xs transition-all flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200/60">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/80">
                  {courses.length} Mata Kuliah
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Pengingat Jadwal Kuliah KRS UPI
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Peringatan jam perkuliahan, ruang lab FPMIPA UPI, dan nama dosen pengampu mata kuliah.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="test-course-notif-btn"
              onClick={handleTestCourseNotification}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-xs transition-all cursor-pointer active:scale-98"
            >
              <Send className="w-3.5 h-3.5 text-sky-700" />
              <span>Uji Notifikasi Kuliah</span>
            </button>
          </div>

          {/* Card 3: Focus & Rest Timer */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  {pomodoroMode === 'work' ? 'Sesi Fokus' : 'Istirahat'}
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Pengingat Sesi Fokus & Istirahat
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Notifikasi saat timer fokus selesai dan waktu relaksasi, minum air, atau jeda tiba.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="test-focus-notif-btn"
              onClick={handleTestFocusNotification}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs transition-all cursor-pointer active:scale-98"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>Uji Notifikasi Fokus</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Hydration / Water Tracker (8 Glasses / 2 Liters) */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 flex-shrink-0 shadow-2xs">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
                  Pengingat Hidrasi Air Putih (Target 2 Liter)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {waterCount * 250} / 2000 mL
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Jaga cairan tubuh saat beraktivitas praktikum di laboratorium FPMIPA UPI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={decrementWater}
              disabled={waterCount === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
              title="Kurang 1 Gelas"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={resetWater}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-900 transition-colors cursor-pointer whitespace-nowrap bg-slate-50 hover:bg-slate-100 border border-slate-200"
            >
              Reset
            </button>
            <button
              id="drink-water-btn"
              onClick={incrementWater}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-98"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>Tambah 1 Gelas</span>
            </button>
          </div>
        </div>

        {/* 8 Glasses Visual Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < waterCount;
            return (
              <button
                key={idx}
                type="button"
                onClick={idx === waterCount ? incrementWater : undefined}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isFilled
                    ? 'bg-blue-50/90 border-blue-300 text-blue-950 font-bold shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <Droplets className={`w-5 h-5 transition-transform ${isFilled ? 'text-blue-600 fill-blue-500 scale-110' : 'text-slate-300'}`} />
                <span className="text-[11px] whitespace-nowrap font-semibold">Gelas {idx + 1}</span>
                <span className="text-[9px] text-slate-400">{250 * (idx + 1)} ml</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-center text-slate-600 pt-1 flex items-center justify-center gap-2">
          {waterCount >= 8 ? (
            <span className="text-emerald-800 font-bold flex items-center justify-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Target 8 gelas (2.000 mL) tercapai hari ini. Keren banget!
            </span>
          ) : (
            <span className="font-medium">
              Tercatat: <strong>{waterCount}</strong> dari <strong>8 gelas</strong> ({waterCount * 250} mL) • Kurang {Math.max(0, 8 - waterCount)} gelas lagi
            </span>
          )}
        </div>
      </section>

      {/* 4. Wellness & Health Tracker */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-900 flex-shrink-0 shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
                Log Kesehatan & Perawatan Diri
              </h2>
              <p className="text-xs text-slate-500">
                {completedWellness} dari {wellnessLogs.length} target kesehatan tercapai ({wellnessPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddWellness(!showAddWellness)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto border border-rose-200/80"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan Kesehatan</span>
          </button>
        </div>

        {/* Add Wellness Form */}
        {showAddWellness && (
          <form onSubmit={handleAddWellnessSubmit} className="space-y-3.5 p-4 sm:p-5 bg-rose-50/60 rounded-2xl border border-rose-200 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Aktivitas / Indikator Kesehatan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newWellnessTitle}
                  onChange={(e) => setNewWellnessTitle(e.target.value)}
                  placeholder="Contoh: Minum Vitamin C & Madu, Peregangan Punggung"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-800"
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
                    { value: 'Mental', label: 'Mental & Relaksasi', color: '#ec4899' }
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
                placeholder="Contoh: Sesudah sarapan pagi sebelum berangkat ke laboratorium"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() => setShowAddWellness(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs ${
                  isCompleted
                    ? 'bg-rose-50/50 border-rose-200 text-slate-600'
                    : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-700 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {item.category}
                      </span>
                      {item.note && (
                        <span className="text-xs text-slate-500 truncate">
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
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0 cursor-pointer"
                  title="Hapus Catatan Kesehatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Daily Micro-Habits Checklist */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-900 flex-shrink-0 shadow-2xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
                Micro-Habits Keseharian & Kuliah
              </h2>
              <p className="text-xs text-slate-500">
                {completedHabits} dari {totalHabits} rutinitas terpenuhi hari ini ({habitPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddHabit(!showAddHabit)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto border border-rose-200/80"
            title="Tambah Kebiasaan"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kebiasaan</span>
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddHabit && (
          <form onSubmit={handleAddHabitSubmit} className="flex flex-col sm:flex-row gap-2.5 p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 animate-fade-in">
            <input
              type="text"
              value={newHabitLabel}
              onChange={(e) => setNewHabitLabel(e.target.value)}
              placeholder="Contoh: Mengulang reaksi kimia 15 menit..."
              className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-800"
              autoFocus
            />
            <div className="w-full sm:w-44">
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
              className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
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
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs ${
                habit.isDone
                  ? 'bg-rose-50/50 border-rose-200 text-slate-600'
                  : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {habit.isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-700 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-rose-600 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold truncate ${habit.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {habit.label}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {habit.category}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHabit(habit.id);
                }}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0 cursor-pointer"
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
