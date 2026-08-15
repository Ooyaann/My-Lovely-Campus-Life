import React, { useState } from 'react';
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
  ChevronRight,
  BookHeart,
  Quote,
  Flame,
  Search,
  Star,
  RefreshCw,
  Send
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
import { SealedLetter, MilestoneLetter, WeeklyQuestion } from '../../types';
import confetti from 'canvas-confetti';
import { CustomSelect } from '../common/CustomSelect';

type VaultTab = 'letters' | 'affirmations' | 'milestones' | 'reasons' | 'messages' | 'ritual' | 'story';

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
  const [openedMilestones, setOpenedMilestones] = useState<Record<string, boolean>>({});
  
  // Interactive Message Bank states
  const [searchMsg, setSearchMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Connection ritual state
  const [currentQuestion, setCurrentQuestion] = useState<WeeklyQuestion>(WEEKLY_QUESTIONS[0]);

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
    setOpenedMilestones((prev) => ({ ...prev, [m.id]: true }));
    setSelectedMilestone(m);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#881337', '#be123c', '#fb7185']
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
  React.useEffect(() => {
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

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Grand 16 August Birthday Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white p-6 sm:p-9 shadow-sm border border-rose-300/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs border border-white/20 whitespace-nowrap">
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
              <span>Buka Surat Ulang Tahun</span>
            </button>
          </div>
        </div>

        {/* Decorative Light Glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />
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
              { value: 'affirmations', label: 'Afirmasi Romantis', count: affirmations.length, icon: Sparkles },
              { value: 'milestones', label: '4 Milestone Masa Depan', count: 4, icon: Gift },
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
            { id: 'affirmations', label: 'Afirmasi Romantis', count: `${affirmations.length}`, icon: Sparkles },
            { id: 'milestones', label: '4 Milestone', count: '4', icon: Gift },
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
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
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
            <span className="text-xs font-semibold text-rose-900 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 whitespace-nowrap self-start sm:self-auto">
              {letters.filter((l) => l.isOpen).length} dari 7 Terbuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {letters.map((letter) => (
              <div
                key={letter.id}
                onClick={() => handleOpenSealed(letter)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-2xs ${
                  letter.isOpen
                    ? 'bg-white border-rose-200 hover:border-rose-300'
                    : 'bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60 border-rose-200 hover:border-rose-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900 bg-rose-100/90 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                      {letter.openWhen}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
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

                  <p className="font-reading text-xs text-slate-600 italic line-clamp-2 leading-relaxed">
                    {letter.isOpen ? letter.content : 'Amplop masih tersegel rapi dengan cap lilin merah dari Mas...'}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold whitespace-nowrap">
                  <span className={letter.isOpen ? 'text-emerald-700' : 'text-rose-900'}>
                    {letter.isOpen ? 'Sudah Dibuka' : 'Klik untuk Buka Amplop'}
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

      {/* TAB: Afirmasi Harian Romantis */}
      {activeTab === 'affirmations' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                Afirmasi Harian Romantis
              </h3>
              <p className="text-xs text-slate-500">
                Koleksi afirmasi positif cinta, kedewasaan, dan keyakinan hubungan berdua
              </p>
            </div>
            <button
              onClick={nextAffirmation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-900 text-white text-xs font-bold hover:bg-rose-800 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Acak Afirmasi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {affirmations.map((aff) => (
              <div
                key={aff.id}
                className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs flex flex-col justify-between transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {aff.category}
                    </span>
                    <button
                      onClick={() => toggleFavoriteAffirmation(aff.id)}
                      className="text-slate-400 hover:text-rose-900 cursor-pointer p-1"
                    >
                      <Star className={`w-4 h-4 ${aff.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                  </div>
                  <p className="font-reading text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                    "{aff.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Dari Mas untuk Sayang ❤️</span>
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
        </section>
      )}

      {/* TAB 2: 4 Future Milestone Letters */}
      {activeTab === 'milestones' && (
        <section className="space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
              4 Surat Milestone Masa Depan
            </h3>
            <p className="text-xs text-slate-500">
              Surat-surat untuk momen penting kita yang akan datang
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MILESTONE_LETTERS.map((m) => {
              const isOpened = openedMilestones[m.id];
              return (
                <div
                  key={m.id}
                  onClick={() => handleOpenMilestone(m)}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-200/90 hover:border-rose-900 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 whitespace-nowrap">
                        {m.scenario}
                      </span>
                      <Gift className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 mt-2">
                      {m.title}
                    </h4>
                    <p className="font-reading text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {isOpened ? m.content : 'Surat rahasia untuk masa depan berdua... Klik untuk membuka amplop.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-900 whitespace-nowrap">
                    <span>{isOpened ? 'Baca Ulang Surat' : 'Buka Surat Milestone'}</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: 12 Reasons Why Mas Trusts You */}
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100/90 hover:border-rose-300 shadow-2xs transition-all flex gap-3.5 items-start"
              >
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
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

      {/* TAB 4: 30 Message Bank */}
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs flex flex-col justify-between transition-all space-y-2.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md whitespace-nowrap">
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

      {/* TAB 5: Weekly Connection Ritual (Menu Obrolan LDR) */}
      {activeTab === 'ritual' && (
        <section className="space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-pink-50 border border-rose-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-900 flex-shrink-0" />
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  Menu Obrolan LDR Malam Ini
                </h3>
              </div>
              <button
                onClick={handlePickRandomQuestion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 text-white text-xs sm:text-sm font-bold hover:bg-rose-800 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-xs active:scale-98"
              >
                <Shuffle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Acak Pertanyaan</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-2xs text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 px-3 py-1 rounded-md border border-rose-200 whitespace-nowrap inline-block">
                Topik: {currentQuestion.category}
              </span>
              <p className="font-display font-bold text-base sm:text-xl text-slate-800 max-w-xl mx-auto leading-relaxed">
                "{currentQuestion.question}"
              </p>
              <p className="font-reading text-xs text-slate-400">
                Cocok buat ditanyain ke Mas pas teleponan malam ini! 🌙
              </p>
            </div>

            {/* List of All Questions */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Daftar Pertanyaan Lainnya:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WEEKLY_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(q)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      currentQuestion.id === q.id
                        ? 'bg-rose-50 border-rose-900 text-rose-900 font-bold shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:border-rose-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] text-rose-600 font-bold uppercase block mb-0.5">
                      {q.category}
                    </span>
                    <span className="font-reading">"{q.question}"</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 6: Cerita Kita (First Entry) */}
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
                  Mas kamu🤍
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
              <span className="text-xs font-bold text-rose-900 bg-rose-50 px-3 py-1 rounded-md whitespace-nowrap inline-block">
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
                  Mas kamu🤍
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
                  Mas kamu🤍
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

