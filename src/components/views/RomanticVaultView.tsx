import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Heart, 
  Sparkles, 
  Lock, 
  Unlock, 
  Calendar, 
  X, 
  Coffee,
  Check,
  Copy,
  Shuffle,
  Smile,
  MessageCircle,
  Gift,
  Award,
  BookHeart,
  Quote,
  Search,
  Star,
  RefreshCw,
  CheckCircle2,
  Flame,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Maximize2,
  GraduationCap,
  Sun,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { 
  SEVEN_SEALED_LETTERS, 
  BIRTHDAY_LETTER, 
  MILESTONE_LETTERS, 
  REASONS_TO_TRUST, 
  DAILY_SUPPORT_MESSAGES, 
  WEEKLY_QUESTIONS,
  OUR_STORY_FIRST_ENTRY 
} from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { SealedLetter, MilestoneLetter, WeeklyQuestion, RomanticAffirmation } from '../../types';
import confetti from 'canvas-confetti';
import { CustomSelect } from '../common/CustomSelect';

type VaultTab = 'letters' | 'milestones' | 'affirmations' | 'reasons' | 'messages' | 'ritual' | 'story';

export const RomanticVaultView: React.FC = () => {
  const { 
    letters, 
    openLetter, 
    affirmations, 
    currentAffirmation, 
    nextAffirmation, 
    toggleFavoriteAffirmation, 
    showToast 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<VaultTab>('letters');
  
  // Modals & letter states
  const [selectedLetter, setSelectedLetter] = useState<SealedLetter | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneLetter | null>(null);
  const [showBirthdayLetter, setShowBirthdayLetter] = useState(false);
  
  // Persistent opened milestone letters state
  const [openedMilestones, setOpenedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('unlocked_milestones_vault');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  // Milestone interactive dropdown accordion state
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    'mile-1': true,
    'mile-2': false,
    'mile-3': false,
    'mile-4': false
  });
  const [milestoneFilter, setMilestoneFilter] = useState<string>('Semua');
  const [milestoneStatusFilter, setMilestoneStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const toggleMilestoneAccordion = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAllMilestones = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    MILESTONE_LETTERS.forEach((m) => {
      updated[m.id] = expand;
    });
    setExpandedMilestones(updated);
  };

  // Affirmation states
  const [affirmationFilter, setAffirmationFilter] = useState<string>('Semua');
  const [affirmationSearch, setAffirmationSearch] = useState<string>('');
  const [affirmationViewMode, setAffirmationViewMode] = useState<'grid' | 'flashcard'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  
  // Interactive Message Bank states
  const [searchMsg, setSearchMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Connection ritual state
  const [currentQuestion, setCurrentQuestion] = useState<WeeklyQuestion>(WEEKLY_QUESTIONS[0]);
  const [selectedRitualCategory, setSelectedRitualCategory] = useState<string>('Semua');
  const [ritualSearch, setRitualSearch] = useState<string>('');

  const handleOpenSealed = (letter: SealedLetter) => {
    if (!letter.isOpen) {
      openLetter(letter.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#881337', '#be123c', '#fda4af']
      });
    }
    setSelectedLetter({ ...letter, isOpen: true });
  };

  const handleOpenMilestone = (m: MilestoneLetter) => {
    setOpenedMilestones((prev) => {
      const updated = { ...prev, [m.id]: true };
      try {
        localStorage.setItem('unlocked_milestones_vault', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setSelectedMilestone(m);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#881337', '#be123c', '#fb7185', '#ffd700']
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Teks berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePickRandomQuestion = () => {
    const randIdx = Math.floor(Math.random() * WEEKLY_QUESTIONS.length);
    setCurrentQuestion(WEEKLY_QUESTIONS[randIdx]);
    showToast('Topik obrolan baru dipilih!');
  };

  // ESC listener for closing all modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLetter(null);
        setSelectedMilestone(null);
        setShowBirthdayLetter(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredMessages = DAILY_SUPPORT_MESSAGES.filter((msg) =>
    msg.toLowerCase().includes(searchMsg.toLowerCase())
  );

  const filteredAffirmations = affirmations.filter((aff) => {
    const matchesCategory = 
      affirmationFilter === 'Semua' ? true :
      affirmationFilter === 'Favorit' ? aff.isFavorite :
      aff.category === affirmationFilter;

    const matchesSearch = 
      !affirmationSearch.trim() ||
      aff.text.toLowerCase().includes(affirmationSearch.toLowerCase()) ||
      aff.category.toLowerCase().includes(affirmationSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const categoryCounts: Record<string, number> = {
    'Semua': affirmations.length,
    'Cinta & Sayang': affirmations.filter(a => a.category === 'Cinta & Sayang').length,
    'Penyemangat Kuliah': affirmations.filter(a => a.category === 'Penyemangat Kuliah').length,
    'Ketenangan Hati': affirmations.filter(a => a.category === 'Ketenangan Hati').length,
    'Masa Depan Bersama': affirmations.filter(a => a.category === 'Masa Depan Bersama').length,
    'Rasa Syukur': affirmations.filter(a => a.category === 'Rasa Syukur').length,
    'Favorit': affirmations.filter(a => a.isFavorite).length
  };

  const affirmationCategories = [
    { id: 'Semua', label: 'Semua Afirmasi', icon: Sparkles },
    { id: 'Cinta & Sayang', label: 'Cinta & Sayang', icon: Heart },
    { id: 'Penyemangat Kuliah', label: 'Penyemangat Kuliah', icon: GraduationCap },
    { id: 'Ketenangan Hati', label: 'Ketenangan Hati', icon: Sun },
    { id: 'Masa Depan Bersama', label: 'Masa Depan Bersama', icon: Award },
    { id: 'Rasa Syukur', label: 'Rasa Syukur', icon: Smile },
    { id: 'Favorit', label: 'Favorit Pilihan', icon: Star }
  ];

  const ritualCategories = [
    { id: 'Semua', label: 'Semua Topik Obrolan', icon: Layers, count: WEEKLY_QUESTIONS.length },
    { id: 'Kenangan', label: 'Kenangan Manis', icon: Clock, count: WEEKLY_QUESTIONS.filter(q => q.category === 'Kenangan').length },
    { id: 'Refleksi', label: 'Refleksi & Hati', icon: Sun, count: WEEKLY_QUESTIONS.filter(q => q.category === 'Refleksi').length },
    { id: 'Mimpi & Masa Depan', label: 'Mimpi & Masa Depan', icon: Award, count: WEEKLY_QUESTIONS.filter(q => q.category === 'Mimpi & Masa Depan').length },
    { id: 'Kimia & Kuliah', label: 'Kimia & Kuliah', icon: GraduationCap, count: WEEKLY_QUESTIONS.filter(q => q.category === 'Kimia & Kuliah').length },
    { id: 'Lucu & Ringan', label: 'Lucu & Ringan', icon: Smile, count: WEEKLY_QUESTIONS.filter(q => q.category === 'Lucu & Ringan').length }
  ];

  const getRitualCategoryMeta = (catName: string) => {
    switch (catName) {
      case 'Kenangan':
        return { icon: Clock, color: 'text-rose-900 bg-rose-50 border-rose-200' };
      case 'Refleksi':
        return { icon: Sun, color: 'text-amber-900 bg-amber-50 border-amber-200' };
      case 'Mimpi & Masa Depan':
        return { icon: Award, color: 'text-emerald-900 bg-emerald-50 border-emerald-200' };
      case 'Kimia & Kuliah':
        return { icon: GraduationCap, color: 'text-blue-900 bg-blue-50 border-blue-200' };
      case 'Lucu & Ringan':
        return { icon: Smile, color: 'text-purple-900 bg-purple-50 border-purple-200' };
      default:
        return { icon: Heart, color: 'text-rose-900 bg-rose-50 border-rose-200' };
    }
  };

  const filteredRitualQuestions = WEEKLY_QUESTIONS.filter((q) => {
    const matchesCategory = selectedRitualCategory === 'Semua' || q.category === selectedRitualCategory;
    const matchesSearch = !ritualSearch.trim() || 
      q.question.toLowerCase().includes(ritualSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(ritualSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const milestoneMeta = [
    {
      id: 'mile-1',
      badge: 'Momen Pertama',
      subtext: 'Pertemuan Langsung & Jalan Bareng',
      color: 'bg-rose-50 text-rose-900 border-rose-200',
      icon: Coffee
    },
    {
      id: 'mile-2',
      badge: 'Kekuatan Hati',
      subtext: 'Melewati Minggu Paling Berat',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: Award
    },
    {
      id: 'mile-3',
      badge: 'Wishlist Terwujud',
      subtext: 'Membeli Barang Impian yang Diidamkan',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: Gift
    },
    {
      id: 'mile-4',
      badge: 'Kelegaan Hati',
      subtext: 'Menuntaskan Urusan Penting yang Bikin Pusing',
      color: 'bg-sky-50 text-sky-900 border-sky-200',
      icon: CheckCircle2
    }
  ];

  const openedMilestoneCount = MILESTONE_LETTERS.filter((m) => openedMilestones[m.id]).length;

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Grand 16 August Birthday Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white p-6 sm:p-9 shadow-sm border border-rose-300/20">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs border border-white/20 whitespace-nowrap">
            <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200 animate-pulse flex-shrink-0" />
            <span>Surat Spesial Tersegel Emas • {BIRTHDAY_LETTER.date}</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
            {BIRTHDAY_LETTER.title}
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-sans line-clamp-2">
            Surat panjang penuh ketulusan untuk merayakan hadirnya sosok paling berarti di dunia ini. Mas tulis dengan segenap cinta untukmu.
          </p>

          <div className="pt-2">
            <button
              id="open-birthday-letter-hero-btn"
              onClick={() => {
                setShowBirthdayLetter(true);
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.5 },
                  colors: ['#881337', '#be123c', '#fda4af', '#ffffff']
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-4 h-4 text-rose-900 flex-shrink-0" />
              <span>Buka Surat Ulang Tahun (16 Agustus)</span>
            </button>
          </div>
        </div>

        {/* Decorative Light Glow */}
        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Sub-Navigation: Custom Dropdown on Mobile + Responsive Button Grid on Desktop */}
      <div className="space-y-2">
        {/* Mobile Custom Dropdown */}
        <div className="sm:hidden bg-white p-3.5 rounded-3xl border border-rose-200/90 shadow-2xs space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-900" />
            <span>Pilih Kategori Surat & Pesan:</span>
          </label>
          <CustomSelect
            value={activeTab}
            onChange={(val) => setActiveTab(val as VaultTab)}
            options={[
              { value: 'letters', label: '7 Surat Tersegel ("Buka Saat...")', count: 7, icon: Mail },
              { value: 'milestones', label: '4 Milestone Masa Depan', count: 4, icon: Gift },
              { value: 'affirmations', label: 'Afirmasi Romantis', count: affirmations.length, icon: Sparkles },
              { value: 'reasons', label: '12 Alasan Percaya', count: 12, icon: Star },
              { value: 'messages', label: '30 Pesan Cinta', count: 30, icon: MessageCircle },
              { value: 'ritual', label: 'Menu Obrolan LDR', icon: Heart },
              { value: 'story', label: 'Cerita Kita', icon: BookHeart }
            ]}
            ariaLabel="Pilih Kategori Vault"
          />
        </div>

        {/* Desktop / Tablet Grid View */}
        <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: 'letters', label: '7 Surat Tersegel', count: '7', icon: Mail },
            { id: 'milestones', label: '4 Milestone', count: '4', icon: Gift },
            { id: 'affirmations', label: 'Afirmasi Romantis', count: `${affirmations.length}`, icon: Sparkles },
            { id: 'reasons', label: '12 Alasan Percaya', count: '12', icon: Star },
            { id: 'messages', label: '30 Pesan Cinta', count: '30', icon: MessageCircle },
            { id: 'ritual', label: 'Menu Obrolan', icon: Heart },
            { id: 'story', label: 'Cerita Kita', icon: BookHeart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as VaultTab)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center border ${
                  isActive
                    ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200/80 hover:text-rose-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-rose-900'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Contents */}
      
      {/* TAB 1: 7 Open When Letters */}
      {activeTab === 'letters' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 truncate">
                7 Surat Tersegel ("Buka Saat...")
              </h3>
              <p className="text-xs text-slate-500 truncate">
                Amplop khusus dari Mas untuk menemani setiap suasana hatimu
              </p>
            </div>
            <span className="text-xs font-semibold text-rose-900 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 whitespace-nowrap self-start sm:self-auto shadow-2xs">
              {letters.filter((l) => l.isOpen).length} dari 7 Terbuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {letters.map((letter, idx) => (
              <div
                key={letter.id}
                onClick={() => handleOpenSealed(letter)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-2xs ${
                  letter.isOpen
                    ? 'bg-white border-rose-200 hover:border-rose-300 hover:shadow-xs'
                    : 'bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60 border-rose-200 hover:border-rose-900 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-bold text-rose-900 bg-rose-100/90 px-2.5 py-0.5 rounded-md whitespace-nowrap truncate max-w-[170px]">
                        {letter.openWhen}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      {letter.isOpen ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-rose-900" />
                      )}
                    </div>
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-900 transition-colors leading-snug">
                    {letter.title}
                  </h4>

                  <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100/70">
                    <p className="font-reading text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
                      {letter.isOpen ? letter.content : 'Amplop masih tersegel rapi dengan cap lilin merah dari Mas... Klik untuk membaca isinya.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold whitespace-nowrap">
                  <span className={letter.isOpen ? 'text-emerald-700' : 'text-rose-900'}>
                    {letter.isOpen ? 'Sudah Dibuka • Baca Lagi' : 'Klik untuk Buka Amplop'}
                  </span>
                  <span className="text-slate-400 group-hover:text-rose-900 transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: 4 Milestone Masa Depan (Interactive Dropdowns, Label Geser & Accordion) */}
      {activeTab === 'milestones' && (
        <section className="space-y-4 animate-fade-in">
          {/* Header & Overall Stats Progress */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-rose-100/90 text-rose-900 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-rose-900" />
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                    4 Surat Milestone Masa Depan
                  </h3>
                  <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Surat-surat rahasia yang Mas siapkan khusus untuk menemani momen-momen penting perjalanan kita berdua
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-rose-950 bg-rose-50 px-3.5 py-1.5 rounded-2xl border border-rose-200 whitespace-nowrap shadow-2xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{openedMilestoneCount} dari 4 Milestone Terbuka ({Math.round((openedMilestoneCount / 4) * 100)}%)</span>
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-rose-50 rounded-full h-2 overflow-hidden p-0.5 border border-rose-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-900 via-rose-700 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(openedMilestoneCount / 4) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-0.5">
                <span>Awal Langkah</span>
                <span>Semua Milestone Terwujud</span>
              </div>
            </div>
          </div>

          {/* Milestone Selection Toolbar: 2 Responsive Dropdowns + Accordion Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Dropdown 1: Pilih Surat Milestone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                  <span>Pilih Surat Milestone:</span>
                </label>
                <CustomSelect
                  value={milestoneFilter}
                  onChange={(val) => setMilestoneFilter(val)}
                  options={[
                    { 
                      value: 'Semua', 
                      label: 'Semua 4 Milestone', 
                      description: 'Tampilkan seluruh kumpulan surat milestone',
                      count: 4, 
                      icon: Sparkles 
                    },
                    { 
                      value: 'mile-1', 
                      label: '1. Momen Pertama: Ketemu Langsung', 
                      description: 'Saat kita akhirnya bertemu langsung & jalan bareng',
                      badge: openedMilestones['mile-1'] ? 'Terbuka' : 'Tersegel',
                      icon: Coffee 
                    },
                    { 
                      value: 'mile-2', 
                      label: '2. Kekuatan Hati: Minggu Berat', 
                      description: 'Saat kamu melewati minggu kuliah paling berat',
                      badge: openedMilestones['mile-2'] ? 'Terbuka' : 'Tersegel',
                      icon: Award 
                    },
                    { 
                      value: 'mile-3', 
                      label: '3. Wishlist Terwujud: Barang Impian', 
                      description: 'Saat berhasil membeli barang yang kamu impikan',
                      badge: openedMilestones['mile-3'] ? 'Terbuka' : 'Tersegel',
                      icon: Gift 
                    },
                    { 
                      value: 'mile-4', 
                      label: '4. Kelegaan Hati: Urusan Tuntas', 
                      description: 'Saat urusan besar/skripsi/tugas tuntas selesai',
                      badge: openedMilestones['mile-4'] ? 'Terbuka' : 'Tersegel',
                      icon: CheckCircle2 
                    }
                  ]}
                  ariaLabel="Pilih Milestone"
                />
              </div>

              {/* Dropdown 2: Filter Status Segel (Tanpa Emote, Pakai Icon) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                  <span>Filter Status Segel:</span>
                </label>
                <CustomSelect
                  value={milestoneStatusFilter}
                  onChange={(val) => setMilestoneStatusFilter(val as 'all' | 'unlocked' | 'locked')}
                  options={[
                    { 
                      value: 'all', 
                      label: 'Semua Status Milestone', 
                      description: 'Tampilkan surat terbuka dan yang masih tersegel',
                      count: 4, 
                      icon: Layers 
                    },
                    { 
                      value: 'unlocked', 
                      label: 'Surat Sudah Terbuka', 
                      description: 'Surat milestone yang telah dibuka segelnya',
                      count: openedMilestoneCount, 
                      icon: Unlock 
                    },
                    { 
                      value: 'locked', 
                      label: 'Surat Masih Tersegel', 
                      description: 'Surat rahasia masa depan yang belum dibuka',
                      count: 4 - openedMilestoneCount, 
                      icon: Lock 
                    }
                  ]}
                  ariaLabel="Filter Status Segel"
                />
              </div>
            </div>

            {/* Quick Action Control Bar */}
            <div className="pt-2.5 border-t border-rose-100/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Buka dropdown surat di bawah untuk membaca isi pesan milestone</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExpandAllMilestones(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-[11px] font-bold border border-rose-200 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Buka Semua</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAllMilestones(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Tutup Semua</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dropdown Accordion List for Milestones */}
          <div className="space-y-3.5">
            {MILESTONE_LETTERS
              .filter((m) => {
                const matchFilter = milestoneFilter === 'Semua' || m.id === milestoneFilter;
                const isOpened = !!openedMilestones[m.id];
                const matchStatus = 
                  milestoneStatusFilter === 'all' ? true :
                  milestoneStatusFilter === 'unlocked' ? isOpened :
                  !isOpened;
                return matchFilter && matchStatus;
              })
              .map((m, idx) => {
                const isOpened = openedMilestones[m.id];
                const isExpanded = !!expandedMilestones[m.id];
                const meta = milestoneMeta.find((metaItem) => metaItem.id === m.id) || milestoneMeta[idx % milestoneMeta.length];
                const MetaIcon = meta.icon;

                return (
                  <div
                    key={m.id}
                    id={`milestone-card-${m.id}`}
                    className={`rounded-3xl border transition-all overflow-hidden shadow-2xs ${
                      isExpanded 
                        ? 'bg-white border-rose-300 ring-1 ring-rose-200/50 shadow-xs' 
                        : 'bg-white border-rose-200/90 hover:border-rose-300 hover:bg-rose-50/20'
                    }`}
                  >
                    {/* Dropdown Header Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleMilestoneAccordion(m.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100/90 flex items-center justify-center flex-shrink-0 text-rose-900 border border-rose-200/80 shadow-2xs">
                          <MetaIcon className="w-4 h-4 flex-shrink-0" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${meta.color} whitespace-nowrap`}>
                              {meta.badge}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline truncate">
                              • {meta.subtext}
                            </span>
                            {isOpened ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                <span>Terbuka</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-[10px] font-bold">
                                <Lock className="w-3 h-3 text-rose-900 flex-shrink-0" />
                                <span>Tersegel</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 truncate leading-snug">
                            {m.title}
                          </h4>
                        </div>
                      </div>

                      {/* Chevron Indicator */}
                      <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                        <span className="text-[11px] font-bold text-rose-900 hidden md:inline">
                          {isExpanded ? 'Tutup Detail' : 'Buka Dropdown'}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform duration-200 ${
                          isExpanded 
                            ? 'bg-rose-900 text-white border-rose-900 rotate-180' 
                            : 'bg-rose-50 text-rose-900 border-rose-200'
                        }`}>
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        </div>
                      </div>
                    </button>

                    {/* Dropdown Expanded Body */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-rose-100/80 space-y-4 animate-fade-in bg-rose-50/15">
                        {/* Scenario Context Box */}
                        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-rose-600" />
                            <span>Skenario / Momen Membuka Surat Ini:</span>
                          </span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {m.scenario}
                          </p>
                        </div>

                        {/* Letter Content Box */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/90 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between text-xs border-b border-rose-100 pb-2">
                            <span className="font-bold text-rose-900 flex items-center gap-1.5">
                              <Quote className="w-3.5 h-3.5 text-rose-600" />
                              <span>Isi Surat Milestone dari Mas:</span>
                            </span>
                            <span className="text-[11px] text-slate-400">Digital Sanctuary • Dari Mas</span>
                          </div>

                          <div className="font-reading text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {isOpened ? m.content : (
                              <div className="py-4 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center mx-auto border border-rose-200">
                                  <Lock className="w-5 h-5 text-rose-900" />
                                </div>
                                <div className="max-w-md mx-auto space-y-1">
                                  <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                                    Surat ini masih tersegel rapi untuk momen spesial tersebut.
                                  </p>
                                  <p className="italic text-slate-500 text-xs">
                                    "Jika momen ini sudah tiba, kamu boleh membukanya sekarang untuk membaca pesan penuh cinta dari Mas."
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenMilestone(m)}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                  <Unlock className="w-4 h-4 text-emerald-400" />
                                  <span>Buka Segel Milestone Sekarang</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {isOpened && (
                            <div className="pt-3 border-t border-rose-100 flex flex-wrap items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyText(m.content, `milestone-${m.id}`)}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                {copiedId === `milestone-${m.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Salin Teks Surat</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedMilestone(m)}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Buka Tampilan Layar Penuh</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* TAB 3: Afirmasi Harian Romantis (Interactive Dropdown, Label Geser & Flashcard Mode) */}
      {activeTab === 'affirmations' && (
        <section className="space-y-4 animate-fade-in">
          {/* Header & Spotlight Afirmasi Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-rose-100/90 text-rose-900 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-rose-900" />
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                    Afirmasi Harian Romantis
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Koleksi kata-kata penguat hati, cinta tulus, dan keyakinan masa depan dari Mas untuk menemani harimu
                </p>
              </div>

              <button
                onClick={() => {
                  nextAffirmation();
                  confetti({
                    particleCount: 35,
                    spread: 50,
                    origin: { y: 0.7 },
                    colors: ['#881337', '#be123c', '#fb7185']
                  });
                  showToast('Afirmasi romantis baru berhasil dimuat');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-900 text-white text-xs font-bold hover:bg-rose-800 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Acak Afirmasi Hari Ini</span>
              </button>
            </div>

            {/* Featured Spotlight Card */}
            {currentAffirmation && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/70 to-rose-50/90 border border-rose-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100/90 px-2.5 py-0.5 rounded-lg border border-rose-200">
                      Sorotan Afirmasi Saat Ini • {currentAffirmation.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavoriteAffirmation(currentAffirmation.id)}
                    className="p-1 text-slate-400 hover:text-rose-900 cursor-pointer transition-colors"
                    title={currentAffirmation.isFavorite ? 'Hapus Favorit' : 'Simpan ke Favorit'}
                  >
                    <Star className={`w-4 h-4 ${currentAffirmation.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                <p className="font-reading text-sm sm:text-base text-slate-900 leading-relaxed italic font-medium">
                  "{currentAffirmation.text}"
                </p>

                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500 flex-shrink-0" />
                    <span>Dari Mas untuk Sayang</span>
                  </div>
                  <button
                    onClick={() => handleCopyText(`"${currentAffirmation.text}" — Dari Mas untuk Sayang`, `spotlight-${currentAffirmation.id}`)}
                    className="text-[11px] font-semibold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `spotlight-${currentAffirmation.id}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Affirmations Category Toolbar: Dropdown + Search + View Mode Toggle */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-3.5 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5">
              {/* Category Dropdown */}
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1.5 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                  <span>Pilih Dropdown Kategori Afirmasi:</span>
                </label>
                <CustomSelect
                  value={affirmationFilter}
                  onChange={(val) => {
                    setAffirmationFilter(val);
                    setFlashcardIndex(0);
                  }}
                  options={affirmationCategories.map((c) => ({
                    value: c.id,
                    label: c.label,
                    count: categoryCounts[c.id] || 0,
                    icon: c.icon
                  }))}
                  ariaLabel="Pilih Kategori Afirmasi"
                />
              </div>

              {/* Search Bar & View Mode Toggle Controls */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1 lg:max-w-md w-full">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={affirmationSearch}
                    onChange={(e) => {
                      setAffirmationSearch(e.target.value);
                      setFlashcardIndex(0);
                    }}
                    placeholder="Cari afirmasi..."
                    className="w-full pl-8.5 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-rose-900 focus:ring-1 focus:ring-rose-900/20 bg-slate-50/50"
                  />
                  {affirmationSearch && (
                    <button
                      type="button"
                      onClick={() => setAffirmationSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="inline-flex p-1 rounded-xl bg-rose-50/80 border border-rose-200/80 flex-shrink-0 self-stretch sm:self-auto items-center">
                  <button
                    type="button"
                    onClick={() => setAffirmationViewMode('grid')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      affirmationViewMode === 'grid'
                        ? 'bg-rose-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-rose-950 hover:bg-rose-100/50'
                    }`}
                    title="Tampilan Grid"
                  >
                    <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[11px] whitespace-nowrap">Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAffirmationViewMode('flashcard')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      affirmationViewMode === 'flashcard'
                        ? 'bg-rose-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-rose-950 hover:bg-rose-100/50'
                    }`}
                    title="Tampilan Flashcard Fokus"
                  >
                    <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[11px] whitespace-nowrap">Flashcard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mode 1: Flashcard Fokus View */}
          {affirmationViewMode === 'flashcard' && filteredAffirmations.length > 0 && (
            <div className="p-4 sm:p-7 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-5 animate-fade-in text-center max-w-xl mx-auto overflow-hidden">
              {(() => {
                const currentItem = filteredAffirmations[flashcardIndex % filteredAffirmations.length];
                const currentIndex = flashcardIndex % filteredAffirmations.length;

                return (
                  <div className="space-y-4 sm:space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200/70 truncate max-w-[160px] sm:max-w-none">
                        {currentItem.category}
                      </span>

                      <span className="text-[11px] font-bold text-slate-600 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0">
                        {currentIndex + 1} / {filteredAffirmations.length}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleFavoriteAffirmation(currentItem.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0"
                        title={currentItem.isFavorite ? 'Hapus Favorit' : 'Simpan ke Favorit'}
                      >
                        <Star className={`w-5 h-5 ${currentItem.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Big Quote Card */}
                    <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/50 border border-rose-100 shadow-2xs space-y-3.5">
                      <Quote className="w-7 h-7 text-rose-300 mx-auto flex-shrink-0" />
                      <p className="font-reading text-sm sm:text-base md:text-lg text-slate-900 leading-relaxed italic font-medium px-1 sm:px-3">
                        "{currentItem.text}"
                      </p>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-rose-900 font-bold pt-2 border-t border-rose-100/60">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 flex-shrink-0" />
                        <span>Dari Mas untuk Sayang</span>
                      </div>
                    </div>

                    {/* Responsive 3-Column Navigation Controls (No Overflow) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 w-full">
                      <button
                        type="button"
                        onClick={() => setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredAffirmations.length - 1))}
                        className="w-full py-2.5 px-2 sm:px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                        title="Afirmasi Sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate text-[11px] sm:text-xs">Sebelumnya</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(`"${currentItem.text}" — Dari Mas`, `flash-${currentItem.id}`)}
                        className="w-full py-2.5 px-2 sm:px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                        title="Salin Teks Afirmasi"
                      >
                        {copiedId === `flash-${currentItem.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="text-emerald-600 truncate text-[11px] sm:text-xs">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate text-[11px] sm:text-xs">Salin</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setFlashcardIndex((prev) => (prev + 1) % filteredAffirmations.length)}
                        className="w-full py-2.5 px-2 sm:px-3.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                        title="Afirmasi Berikutnya"
                      >
                        <span className="truncate text-[11px] sm:text-xs">Berikutnya</span>
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Mode 2: Grid 2-Kolom View */}
          {affirmationViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredAffirmations.map((aff) => (
                <div
                  key={aff.id}
                  className="p-5 rounded-3xl bg-white border border-rose-200/90 hover:border-rose-300 shadow-2xs flex flex-col justify-between transition-all space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-lg whitespace-nowrap border border-rose-200/70">
                        {aff.category}
                      </span>
                      <button
                        onClick={() => toggleFavoriteAffirmation(aff.id)}
                        className="text-slate-400 hover:text-rose-900 cursor-pointer p-1"
                        title={aff.isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                      >
                        <Star className={`w-4 h-4 ${aff.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>
                    </div>
                    <p className="font-reading text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                      "{aff.text}"
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-rose-100/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Heart className="w-3 h-3 text-rose-400 flex-shrink-0" />
                      <span>Dari Mas untuk Sayang</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(`"${aff.text}" — Afirmasi Romantis dari Mas`, `aff-${aff.id}`)}
                      className="text-[11px] font-semibold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      {copiedId === `aff-${aff.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 flex-shrink-0" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredAffirmations.length === 0 && (
            <div className="p-8 rounded-3xl bg-white border border-rose-200/90 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">
                Tidak ada afirmasi yang cocok dengan pencarian "{affirmationSearch}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setAffirmationSearch('');
                  setAffirmationFilter('Semua');
                }}
                className="px-4 py-2 rounded-xl bg-rose-900 text-white font-bold text-xs cursor-pointer shadow-2xs"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: 12 Reasons Why Mas Trusts You */}
      {activeTab === 'reasons' && (
        <section className="space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
              12 Alasan Kenapa Mas Percaya 100% Sama Kamu
            </h3>
            <p className="text-xs text-slate-500">
              Bukan cuma kata-kata, tapi hal nyata yang Mas lihat dan rasakan setiap hari
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {REASONS_TO_TRUST.map((reason, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-100/90 hover:border-rose-300 shadow-2xs transition-all flex gap-3.5 items-start"
              >
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-reading text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {reason}
                  </p>
                  <div className="mt-2.5 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyText(reason, `reason-${idx}`)}
                      className="text-[11px] font-semibold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      {copiedId === `reason-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 flex-shrink-0" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: 30 Message Bank */}
      {activeTab === 'messages' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                Bank 30 Pesan Cinta & Dukungan
              </h3>
              <p className="text-xs text-slate-500">
                Kumpulan pesan penyemangat Mas untuk setiap saat
              </p>
            </div>
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari pesan penyemangat..."
                value={searchMsg}
                onChange={(e) => setSearchMsg(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-rose-800 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMessages.map((msg, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs flex flex-col justify-between transition-all space-y-2.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-md whitespace-nowrap border border-rose-100">
                      Pesan #{idx + 1}
                    </span>
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 flex-shrink-0" />
                  </div>
                  <p className="font-reading text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{msg}"
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 whitespace-nowrap">
                  <span>Dari Mas ❤️</span>
                  <button
                    onClick={() => handleCopyText(`"${msg}" — Dari Mas ❤️`, `msg-${idx}`)}
                    className="text-[11px] font-semibold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    {copiedId === `msg-${idx}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 flex-shrink-0" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 6: Weekly Connection Ritual (Menu Obrolan LDR) */}
      {activeTab === 'ritual' && (
        <section className="space-y-5 animate-fade-in">
          {/* Header & Overview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <PhoneCall className="w-4 h-4 text-rose-900" />
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                    Menu Obrolan LDR Malam Ini
                  </h3>
                  <Sparkles className="w-4 h-4 text-rose-500 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kumpulan topik pertanyaan manis & reflektif untuk menemani obrolan teleponan atau voice call bersama Mas
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-rose-950 bg-rose-50 px-3.5 py-1.5 rounded-2xl border border-rose-200 whitespace-nowrap shadow-2xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                  <span>{WEEKLY_QUESTIONS.length} Topik Obrolan Tersedia</span>
                </span>
              </div>
            </div>
          </div>

          {/* Featured Spotlight Card: Active Question */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-pink-50/70 border border-rose-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-rose-100/80 pb-3.5">
              {(() => {
                const meta = getRitualCategoryMeta(currentQuestion.category);
                const CatIcon = meta.icon;
                return (
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xl border flex items-center gap-1.5 shadow-2xs ${meta.color}`}>
                      <CatIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{currentQuestion.category}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                      Topik Pilihan Malam Ini
                    </span>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={handlePickRandomQuestion}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-900 text-white text-xs font-bold hover:bg-rose-800 transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
                title="Pilih Topik Secara Acak"
              >
                <Shuffle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Acak Topik</span>
              </button>
            </div>

            {/* Spotlight Quote Display */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-100/90 shadow-2xs text-center space-y-4">
              <Quote className="w-8 h-8 text-rose-300 mx-auto flex-shrink-0" />
              <p className="font-display font-bold text-base sm:text-xl text-slate-900 max-w-xl mx-auto leading-relaxed px-2">
                "{currentQuestion.question}"
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-rose-900 font-semibold pt-2 border-t border-rose-100/60 max-w-md mx-auto">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Cocok buat ditanyakan ke Mas saat teleponan malam ini</span>
              </div>
            </div>

            {/* Quick Navigation & Copy Controls */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {(() => {
                const currentIdx = WEEKLY_QUESTIONS.findIndex(q => q.id === currentQuestion.id);
                const prevIdx = currentIdx > 0 ? currentIdx - 1 : WEEKLY_QUESTIONS.length - 1;
                const nextIdx = (currentIdx + 1) % WEEKLY_QUESTIONS.length;
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(WEEKLY_QUESTIONS[prevIdx])}
                      className="w-full py-2.5 px-2 sm:px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-950 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                      title="Topik Sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate text-[11px] sm:text-xs">Sebelumnya</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyText(`"${currentQuestion.question}" — Topik Obrolan LDR Malam Ini`, `ritual-${currentQuestion.id}`)}
                      className="w-full py-2.5 px-2 sm:px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                      title="Salin Topik Pertanyaan"
                    >
                      {copiedId === `ritual-${currentQuestion.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-600 truncate text-[11px] sm:text-xs">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span className="truncate text-[11px] sm:text-xs">Salin Topik</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(WEEKLY_QUESTIONS[nextIdx])}
                      className="w-full py-2.5 px-2 sm:px-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                      title="Topik Berikutnya"
                    >
                      <span className="truncate text-[11px] sm:text-xs">Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Filter Toolbar: Dropdown Category + Search Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-3.5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5">
              {/* Category Dropdown */}
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1.5 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-rose-900" />
                  <span>Filter Kategori Obrolan:</span>
                </label>
                <CustomSelect
                  value={selectedRitualCategory}
                  onChange={(val) => setSelectedRitualCategory(val)}
                  options={ritualCategories.map(cat => ({
                    value: cat.id,
                    label: cat.label,
                    count: cat.count,
                    icon: cat.icon
                  }))}
                  ariaLabel="Pilih Kategori Obrolan"
                />
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2 flex-1 lg:max-w-md w-full">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={ritualSearch}
                    onChange={(e) => setRitualSearch(e.target.value)}
                    placeholder="Cari kata dalam pertanyaan..."
                    className="w-full pl-8.5 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-rose-900 focus:ring-1 focus:ring-rose-900/20 bg-slate-50/50"
                  />
                  {ritualSearch && (
                    <button
                      type="button"
                      onClick={() => setRitualSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results count & active tags */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[11px]">
                Menampilkan <strong className="text-rose-900 font-bold">{filteredRitualQuestions.length}</strong> dari {WEEKLY_QUESTIONS.length} pertanyaan
              </span>
              {selectedRitualCategory !== 'Semua' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRitualCategory('Semua');
                    setRitualSearch('');
                  }}
                  className="text-[11px] font-bold text-rose-900 hover:underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* List of All Questions Grid */}
          {filteredRitualQuestions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredRitualQuestions.map((q, idx) => {
                const isCurrent = currentQuestion.id === q.id;
                const meta = getRitualCategoryMeta(q.category);
                const CatIcon = meta.icon;
                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3.5 shadow-2xs ${
                      isCurrent
                        ? 'bg-rose-50/70 border-rose-900 ring-2 ring-rose-900/20'
                        : 'bg-white border-rose-100/90 hover:border-rose-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border flex items-center gap-1 ${meta.color}`}>
                          <CatIcon className="w-3 h-3 flex-shrink-0" />
                          <span>{q.category}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Question Text */}
                      <p className="font-reading text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        "{q.question}"
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2.5 border-t border-rose-100/70 flex items-center justify-between text-xs gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentQuestion(q)}
                        className={`text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isCurrent
                            ? 'text-rose-900'
                            : 'text-slate-600 hover:text-rose-900'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                            <span>Sedang Dipilih</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                            <span>Jadikan Topik Utama</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(`"${q.question}" — Topik Obrolan LDR dari Mas`, `q-list-${q.id}`)}
                        className="text-[11px] font-semibold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        title="Salin Pertanyaan"
                      >
                        {copiedId === `q-list-${q.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span className="text-emerald-600">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 flex-shrink-0 text-slate-500" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-rose-200/90 text-center space-y-3 shadow-2xs">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">
                Tidak ada topik obrolan yang cocok dengan pencarian "{ritualSearch}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setRitualSearch('');
                  setSelectedRitualCategory('Semua');
                }}
                className="px-4 py-2 rounded-xl bg-rose-900 text-white font-bold text-xs cursor-pointer shadow-2xs"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          )}

          {/* Cozy Guide / Tips for LDR Calls */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50/60 via-white to-pink-50/40 border border-rose-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600 flex-shrink-0" />
              <span>Saran Hangat Sesi Teleponan LDR</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-2xl bg-white/80 border border-rose-100/80 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] text-rose-900">1. Mulai dengan Santai</span>
                <p className="text-[11px] leading-relaxed">Pilih 1–2 topik pertanyaan ringan untuk mencairkan suasana setelah seharian lelah nugas.</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-rose-100/80 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] text-rose-900">2. Dengarkan Sepenuh Hati</span>
                <p className="text-[11px] leading-relaxed">Berikan ruang aman untuk saling bertukar cerita tanpa tergesa-gesa atau khawatir dihakimi.</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-rose-100/80 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px] text-rose-900">3. Tutup dengan Doa Manis</span>
                <p className="text-[11px] leading-relaxed">Akhiri sesi panggilan dengan saling mendoakan dan mengucapkan selamat istirahat dengan tenang.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 7: Cerita Kita (First Entry) */}
      {activeTab === 'story' && (
        <section className="space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200/90 shadow-2xs space-y-5">
            <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-900 bg-rose-50 px-3 py-0.5 rounded-md whitespace-nowrap">
                  Entry Pertama • {OUR_STORY_FIRST_ENTRY.date}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-2">
                  {OUR_STORY_FIRST_ENTRY.title}
                </h3>
              </div>
              <BookHeart className="w-8 h-8 text-rose-900 flex-shrink-0" />
            </div>

            <div className="font-reading text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {OUR_STORY_FIRST_ENTRY.content}
            </div>

            <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-slate-500 whitespace-nowrap">
              <span className="font-display italic text-rose-900 font-bold text-sm">
                Mas kamu🤍
              </span>
              <span>Digital Sanctuary • Selamanya</span>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Reading a Sealed Letter */}
      {selectedLetter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedLetter(null)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-200 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-100 whitespace-nowrap">
                  {selectedLetter.openWhen}
                </span>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                {selectedLetter.title}
              </h3>

              <div className="font-reading text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {selectedLetter.content}
              </div>

              <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-slate-500 whitespace-nowrap">
                <span className="font-display italic text-rose-900 font-bold text-sm">
                  Dari Mas
                </span>
                <span className="text-[11px] text-slate-400">Digital Sanctuary</span>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 bg-rose-50/70 border-t border-rose-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyText(selectedLetter.content, 'modal-letter')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Surat</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup & Kembali</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reading a Milestone Letter */}
      {selectedMilestone && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedMilestone(null)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-200 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-100 whitespace-nowrap">
                  Surat Milestone Masa Depan
                </span>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              <span className="text-xs font-bold text-rose-900 bg-rose-50 px-3 py-1 rounded-md whitespace-nowrap inline-block border border-rose-200">
                {selectedMilestone.scenario}
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {selectedMilestone.title}
              </h3>

              <div className="font-reading text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {selectedMilestone.content}
              </div>

              <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-slate-500 whitespace-nowrap">
                <span className="font-display italic text-rose-900 font-bold text-sm">
                  Dari Mas
                </span>
                <span className="text-[11px] text-slate-400">Digital Sanctuary</span>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 bg-rose-50/70 border-t border-rose-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyText(selectedMilestone.content, 'modal-milestone')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Surat</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="px-5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup & Kembali</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grand 16 August Birthday Letter */}
      {showBirthdayLetter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowBirthdayLetter(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-rose-300 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-200 fill-rose-200 animate-pulse flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-100 whitespace-nowrap">
                  Surat Spesial Ulang Tahun • 16 Agustus
                </span>
              </div>
              <button
                onClick={() => setShowBirthdayLetter(false)}
                className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-9 overflow-y-auto space-y-5 flex-1">
              <div className="text-center space-y-1.5 border-b border-rose-100 pb-4">
                <span className="text-[11px] font-bold text-rose-900 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-md whitespace-nowrap">
                  16 Agustus
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-rose-900 mt-2">
                  {BIRTHDAY_LETTER.title}
                </h3>
              </div>

              <div className="font-reading text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
                {BIRTHDAY_LETTER.content}
              </div>

              <div className="pt-6 border-t border-rose-100 text-center space-y-1">
                <p className="font-display italic text-lg text-rose-900 font-bold">
                  Dari Mas
                </p>
                <p className="text-xs text-slate-400">
                  Digital Sanctuary • Selalu dan Selamanya
                </p>
              </div>
            </div>

            {/* Modal Bottom Action Bar (Fixed, Always Visible & Easy to Close) */}
            <div className="p-4 sm:p-5 bg-rose-50/80 border-t border-rose-200/90 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleCopyText(BIRTHDAY_LETTER.content, 'birthday-modal')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Surat</span>
              </button>

              <button
                type="button"
                id="close-birthday-letter-bottom-btn"
                onClick={() => setShowBirthdayLetter(false)}
                className="px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Tutup & Kembali</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
