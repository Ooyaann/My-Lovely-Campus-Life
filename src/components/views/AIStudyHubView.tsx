import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  MapPin, 
  FlaskConical, 
  Lightbulb, 
  Layers, 
  FileText, 
  Share2,
  Atom,
  HelpCircle,
  ChevronDown,
  Filter
} from 'lucide-react';
import { CHEMISTRY_AI_PROMPTS, UPI_SURVIVAL_NOTES, CHEMISTRY_TEACHING_IDEAS } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { AIPromptTemplate, UPISurvivalNote, TeachingIdea } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

type StudyTab = 'prompts' | 'survival' | 'teaching' | 'notebooklm';

const PROMPTS_STORAGE_KEY = 'upi_chemistry_ai_prompts';
const SURVIVAL_STORAGE_KEY = 'upi_chemistry_survival_notes';
const TEACHING_STORAGE_KEY = 'upi_chemistry_teaching_ideas';

export const AIStudyHubView: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<StudyTab>('prompts');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Prompts State & Filter
  const [prompts, setPrompts] = useState<AIPromptTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(PROMPTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse prompts', e);
    }
    return CHEMISTRY_AI_PROMPTS;
  });
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('Semua');
  const [promptSearch, setPromptSearch] = useState<string>('');

  // 2. Survival Notes State & Filter
  const [survivalNotes, setSurvivalNotes] = useState<UPISurvivalNote[]>(() => {
    try {
      const saved = localStorage.getItem(SURVIVAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse survival notes', e);
    }
    return UPI_SURVIVAL_NOTES;
  });
  const [selectedSurvivalCategory, setSelectedSurvivalCategory] = useState<string>('Semua');
  const [survivalSearch, setSurvivalSearch] = useState<string>('');

  // 3. Teaching Ideas State & Filter
  const [teachingIdeas, setTeachingIdeas] = useState<TeachingIdea[]>(() => {
    try {
      const saved = localStorage.getItem(TEACHING_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse teaching ideas', e);
    }
    return CHEMISTRY_TEACHING_IDEAS;
  });
  const [selectedTeachingLevel, setSelectedTeachingLevel] = useState<string>('Semua');
  const [teachingSearch, setTeachingSearch] = useState<string>('');

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.error(e);
    }
  }, [prompts]);

  useEffect(() => {
    try {
      localStorage.setItem(SURVIVAL_STORAGE_KEY, JSON.stringify(survivalNotes));
    } catch (e) {
      console.error(e);
    }
  }, [survivalNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(TEACHING_STORAGE_KEY, JSON.stringify(teachingIdeas));
    } catch (e) {
      console.error(e);
    }
  }, [teachingIdeas]);

  // Modal States
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptForm, setPromptForm] = useState({
    title: '',
    category: 'Pendidikan Kimia',
    description: '',
    promptText: ''
  });

  const [isSurvivalModalOpen, setIsSurvivalModalOpen] = useState(false);
  const [editingSurvivalId, setEditingSurvivalId] = useState<string | null>(null);
  const [survivalForm, setSurvivalForm] = useState({
    title: '',
    category: 'Perlengkapan Kuliah',
    content: '',
    location: ''
  });

  const [isTeachingModalOpen, setIsTeachingModalOpen] = useState(false);
  const [editingTeachingId, setEditingTeachingId] = useState<string | null>(null);
  const [teachingForm, setTeachingForm] = useState({
    title: '',
    topic: 'Reaksi Kimia & Stoikiometri',
    level: 'Kelas X SMA',
    description: '',
    materials: ''
  });

  // Prompt Categories
  const promptCategories = [
    'Semua',
    'Pedagogi & RPP',
    'Laptrak & Lab',
    'Pendidikan Kimia',
    'Studi Literatur',
    'Kustom'
  ];

  // Survival Categories
  const survivalCategories = [
    'Semua',
    'Perlengkapan Kuliah',
    'Kesehatan',
    'Tempat Belajar',
    'Etika Akademik',
    'Kuliner & Kos',
    'Laboratorium Kimia',
    'Kustom'
  ];

  // Teaching Levels
  const teachingLevels = [
    'Semua',
    'Kelas X SMA',
    'Kelas XI SMA',
    'Kelas XII SMA',
    'SMP / Pengantar'
  ];

  // Copy helper
  const copyText = (id: string, text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`"${title}" berhasil disalin!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // --- PROMPT HANDLERS ---
  const handleOpenPromptModal = (prompt?: AIPromptTemplate) => {
    if (prompt) {
      setEditingPromptId(prompt.id);
      setPromptForm({
        title: prompt.title,
        category: prompt.category,
        description: prompt.description,
        promptText: prompt.promptText
      });
    } else {
      setEditingPromptId(null);
      setPromptForm({
        title: '',
        category: 'Pendidikan Kimia',
        description: '',
        promptText: ''
      });
    }
    setIsPromptModalOpen(true);
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title.trim() || !promptForm.promptText.trim()) {
      showToast('Harap lengkapi judul dan teks prompt AI!');
      return;
    }

    if (editingPromptId) {
      setPrompts(prev => prev.map(p => p.id === editingPromptId ? {
        ...p,
        title: promptForm.title.trim(),
        category: promptForm.category,
        description: promptForm.description.trim() || 'Prompt AI kustom untuk pendidikan kimia.',
        promptText: promptForm.promptText.trim(),
        isCustom: true
      } : p));
      showToast('Prompt AI berhasil diperbarui!');
    } else {
      const newPrompt: AIPromptTemplate = {
        id: `prompt-custom-${Date.now()}`,
        title: promptForm.title.trim(),
        category: promptForm.category,
        description: promptForm.description.trim() || 'Prompt AI kustom untuk pendidikan kimia.',
        promptText: promptForm.promptText.trim(),
        isCustom: true
      };
      setPrompts(prev => [newPrompt, ...prev]);
      showToast('Prompt AI baru berhasil ditambahkan!');
    }
    setIsPromptModalOpen(false);
  };

  const handleDeletePrompt = (id: string, title: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    showToast(`Prompt "${title}" berhasil dihapus.`);
  };

  // --- SURVIVAL HANDLERS ---
  const handleOpenSurvivalModal = (note?: UPISurvivalNote) => {
    if (note) {
      setEditingSurvivalId(note.id);
      setSurvivalForm({
        title: note.title,
        category: note.category,
        content: note.content,
        location: note.location || ''
      });
    } else {
      setEditingSurvivalId(null);
      setSurvivalForm({
        title: '',
        category: 'Perlengkapan Kuliah',
        content: '',
        location: ''
      });
    }
    setIsSurvivalModalOpen(true);
  };

  const handleSaveSurvival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!survivalForm.title.trim() || !survivalForm.content.trim()) {
      showToast('Harap lengkapi judul dan isi catatan survival!');
      return;
    }

    if (editingSurvivalId) {
      setSurvivalNotes(prev => prev.map(n => n.id === editingSurvivalId ? {
        ...n,
        title: survivalForm.title.trim(),
        category: survivalForm.category,
        content: survivalForm.content.trim(),
        location: survivalForm.location.trim() || undefined,
        isCustom: true
      } : n));
      showToast('Catatan survival kampus berhasil diperbarui!');
    } else {
      const newNote: UPISurvivalNote = {
        id: `survival-custom-${Date.now()}`,
        title: survivalForm.title.trim(),
        category: survivalForm.category,
        content: survivalForm.content.trim(),
        location: survivalForm.location.trim() || undefined,
        isCustom: true
      };
      setSurvivalNotes(prev => [newNote, ...prev]);
      showToast('Catatan survival baru berhasil ditambahkan!');
    }
    setIsSurvivalModalOpen(false);
  };

  const handleDeleteSurvival = (id: string, title: string) => {
    setSurvivalNotes(prev => prev.filter(n => n.id !== id));
    showToast(`Catatan "${title}" berhasil dihapus.`);
  };

  // --- TEACHING IDEA HANDLERS ---
  const handleOpenTeachingModal = (idea?: TeachingIdea) => {
    if (idea) {
      setEditingTeachingId(idea.id);
      setTeachingForm({
        title: idea.title,
        topic: idea.topic,
        level: idea.level,
        description: idea.description,
        materials: idea.materials
      });
    } else {
      setEditingTeachingId(null);
      setTeachingForm({
        title: '',
        topic: 'Reaksi Kimia & Stoikiometri',
        level: 'Kelas X SMA',
        description: '',
        materials: ''
      });
    }
    setIsTeachingModalOpen(true);
  };

  const handleSaveTeaching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachingForm.title.trim() || !teachingForm.description.trim()) {
      showToast('Harap lengkapi judul eksperimen dan deskripsi demonstrasi!');
      return;
    }

    if (editingTeachingId) {
      setTeachingIdeas(prev => prev.map(i => i.id === editingTeachingId ? {
        ...i,
        title: teachingForm.title.trim(),
        topic: teachingForm.topic.trim(),
        level: teachingForm.level,
        description: teachingForm.description.trim(),
        materials: teachingForm.materials.trim() || 'Alat dan bahan laboratorium standar / bahan dapur sehari-hari.',
        isCustom: true
      } : i));
      showToast('Ide media ajar berhasil diperbarui!');
    } else {
      const newIdea: TeachingIdea = {
        id: `teaching-custom-${Date.now()}`,
        title: teachingForm.title.trim(),
        topic: teachingForm.topic.trim(),
        level: teachingForm.level,
        description: teachingForm.description.trim(),
        materials: teachingForm.materials.trim() || 'Alat dan bahan laboratorium standar / bahan dapur sehari-hari.',
        isCustom: true
      };
      setTeachingIdeas(prev => [newIdea, ...prev]);
      showToast('Ide media ajar baru berhasil ditambahkan!');
    }
    setIsTeachingModalOpen(false);
  };

  const handleDeleteTeaching = (id: string, title: string) => {
    setTeachingIdeas(prev => prev.filter(i => i.id !== id));
    showToast(`Ide ajar "${title}" berhasil dihapus.`);
  };

  // Filtered lists
  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedPromptCategory === 'Semua' 
      ? true 
      : selectedPromptCategory === 'Kustom' 
        ? p.isCustom 
        : p.category === selectedPromptCategory;
    const matchesSearch = promptSearch.trim() === '' || 
      p.title.toLowerCase().includes(promptSearch.toLowerCase()) || 
      p.description.toLowerCase().includes(promptSearch.toLowerCase()) ||
      p.promptText.toLowerCase().includes(promptSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSurvivalNotes = survivalNotes.filter(n => {
    const matchesCategory = selectedSurvivalCategory === 'Semua' 
      ? true 
      : selectedSurvivalCategory === 'Kustom' 
        ? n.isCustom 
        : n.category === selectedSurvivalCategory;
    const matchesSearch = survivalSearch.trim() === '' || 
      n.title.toLowerCase().includes(survivalSearch.toLowerCase()) || 
      n.content.toLowerCase().includes(survivalSearch.toLowerCase()) ||
      (n.location && n.location.toLowerCase().includes(survivalSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredTeachingIdeas = teachingIdeas.filter(i => {
    const matchesLevel = selectedTeachingLevel === 'Semua' 
      ? true 
      : i.level === selectedTeachingLevel;
    const matchesSearch = teachingSearch.trim() === '' || 
      i.title.toLowerCase().includes(teachingSearch.toLowerCase()) || 
      i.topic.toLowerCase().includes(teachingSearch.toLowerCase()) ||
      i.description.toLowerCase().includes(teachingSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-7 shadow-xs border border-rose-200/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Ruang Belajar Pendidikan Kimia UPI</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
              Pojok AI & Survival Kimia
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed font-sans">
              Pustaka prompt AI Pendidikan Kimia, catatan survival seputar FPMIPA UPI, bank ide media ajar kreatif, dan panduan riset bertenaga AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center flex-shrink-0">
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-950 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Buka NotebookLM</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-700" />
            </a>
          </div>
        </div>

        {/* Sub-Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/15">
          {[
            { id: 'prompts', label: 'Prompt AI Kimia', count: prompts.length, icon: Sparkles },
            { id: 'survival', label: 'Survival Guide UPI', count: survivalNotes.length, icon: Compass },
            { id: 'teaching', label: 'Media Ajar Seru', count: teachingIdeas.length, icon: GraduationCap },
            { id: 'notebooklm', label: 'Panduan NotebookLM', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudyTab)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-rose-950 shadow-xs'
                    : 'bg-white/10 text-rose-100 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-rose-100 text-rose-900' : 'bg-white/20 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TAB CONTENTS */}

      {/* TAB 1: AI PROMPTS */}
      {activeTab === 'prompts' && (
        <section className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                  Pustaka Prompt AI Pendidikan Kimia
                </h3>
                <p className="text-xs text-slate-500">
                  Salin prompt ke Gemini, ChatGPT, Claude, atau NotebookLM untuk analisis laptrak dan RPP
                </p>
              </div>

              <button
                onClick={() => handleOpenPromptModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4 text-rose-200" />
                <span>Tambah Prompt AI</span>
              </button>
            </div>

            {/* Search & Categories Filter */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  placeholder="Cari prompt laptrak, RPP, HOTS, analogi..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
                />
                {promptSearch && (
                  <button
                    onClick={() => setPromptSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="w-full sm:w-64 flex-shrink-0">
                <CustomSelect
                  value={selectedPromptCategory}
                  onChange={setSelectedPromptCategory}
                  icon={Filter}
                  placeholder="Filter Kategori"
                  options={promptCategories.map((cat) => ({
                    value: cat,
                    label: cat === 'Semua' ? 'Semua Kategori' : cat,
                    count: cat === 'Semua' ? prompts.length : prompts.filter((p) => p.category === cat).length,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Prompt Cards Grid */}
          {filteredPrompts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Tidak ada prompt yang sesuai</h4>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori yang dipilih.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-5 rounded-2xl border border-rose-100 bg-white hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-rose-950 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80">
                          {prompt.category}
                        </span>
                        {prompt.isCustom && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Kustom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {prompt.isCustom && (
                          <>
                            <button
                              onClick={() => handleOpenPromptModal(prompt)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                              title="Edit Prompt"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(prompt.id, prompt.title)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Hapus Prompt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => copyText(prompt.id, prompt.promptText, prompt.title)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200/80 active:scale-95"
                          title="Salin Prompt"
                        >
                          {copiedId === prompt.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                        {prompt.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {prompt.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed select-all max-h-36 overflow-y-auto">
                      {prompt.promptText}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: SURVIVAL GUIDE UPI */}
      {activeTab === 'survival' && (
        <section className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                  Survival Guide & Catatan Khusus Mahasiswa Kimia UPI
                </h3>
                <p className="text-xs text-slate-500">
                  Catatan praktis fasilitas FPMIPA, fotokopi laptrak, laboratorium, dan tips kuliah dari Mas
                </p>
              </div>

              <button
                onClick={() => handleOpenSurvivalModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4 text-rose-200" />
                <span>Tambah Catatan Survival</span>
              </button>
            </div>

            {/* Search & Categories Filter */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={survivalSearch}
                  onChange={(e) => setSurvivalSearch(e.target.value)}
                  placeholder="Cari lokasi fotokopi, poliklinik, tips lab, wifi..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
                />
                {survivalSearch && (
                  <button
                    onClick={() => setSurvivalSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="w-full sm:w-64 flex-shrink-0">
                <CustomSelect
                  value={selectedSurvivalCategory}
                  onChange={setSelectedSurvivalCategory}
                  icon={Filter}
                  placeholder="Filter Kategori"
                  options={survivalCategories.map((cat) => ({
                    value: cat,
                    label: cat === 'Semua' ? 'Semua Kategori' : cat,
                    count: cat === 'Semua' ? survivalNotes.length : survivalNotes.filter((n) => n.category === cat).length,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Survival Cards Grid */}
          {filteredSurvivalNotes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-3">
              <Compass className="w-8 h-8 text-rose-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Tidak ada catatan survival yang cocok</h4>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurvivalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-rose-950 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80">
                        {note.category}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyText(note.id, `${note.title}\n\n${note.content}${note.location ? `\n\nLokasi: ${note.location}` : ''}`, note.title)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-900 transition-colors cursor-pointer"
                          title="Salin Catatan"
                        >
                          {copiedId === note.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {note.isCustom && (
                          <>
                            <button
                              onClick={() => handleOpenSurvivalModal(note)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                              title="Edit Catatan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSurvival(note.id, note.title)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {note.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {note.content}
                    </p>
                  </div>

                  {note.location && (
                    <div className="pt-2.5 border-t border-slate-100 text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span className="truncate">{note.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: TEACHING & PEDAGOGY IDEAS */}
      {activeTab === 'teaching' && (
        <section className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                  Bank Ide Media Mengajar Kimia Kreatif
                </h3>
                <p className="text-xs text-slate-500">
                  Inspirasi demonstrasi kelas mikro-teaching & praktikum seru untuk siswa SMA dan tugas pedagogi UPI
                </p>
              </div>

              <button
                onClick={() => handleOpenTeachingModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4 text-rose-200" />
                <span>Tambah Ide Mengajar</span>
              </button>
            </div>

            {/* Search & Level Filter */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={teachingSearch}
                  onChange={(e) => setTeachingSearch(e.target.value)}
                  placeholder="Cari ide asam basa, redoks, plastisin VSEPR, kromatografi..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
                />
                {teachingSearch && (
                  <button
                    onClick={() => setTeachingSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="w-full sm:w-64 flex-shrink-0">
                <CustomSelect
                  value={selectedTeachingLevel}
                  onChange={setSelectedTeachingLevel}
                  icon={Filter}
                  placeholder="Tingkatan Kelas"
                  options={teachingLevels.map((lvl) => ({
                    value: lvl,
                    label: lvl === 'Semua' ? 'Semua Tingkatan' : lvl,
                    count: lvl === 'Semua' ? teachingIdeas.length : teachingIdeas.filter((t) => t.level === lvl).length,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Teaching Ideas Grid */}
          {filteredTeachingIdeas.length === 0 ? (
            <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-3">
              <GraduationCap className="w-8 h-8 text-rose-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Tidak ada ide mengajar yang cocok</h4>
              <p className="text-xs text-slate-500">Coba ubah filter tingkatan kelas atau kata kunci.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeachingIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-rose-950 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80">
                          {idea.topic}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {idea.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyText(idea.id, `${idea.title}\n\nTopik: ${idea.topic} (${idea.level})\n\nDeskripsi:\n${idea.description}\n\nBahan & Media:\n${idea.materials}`, idea.title)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-900 transition-colors cursor-pointer"
                          title="Salin Ide Ajar"
                        >
                          {copiedId === idea.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {idea.isCustom && (
                          <>
                            <button
                              onClick={() => handleOpenTeachingModal(idea)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                              title="Edit Ide"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeaching(idea.id, idea.title)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Hapus Ide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {idea.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {idea.description}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs space-y-1">
                    <span className="font-bold text-rose-950 block text-[11px] flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-rose-700" />
                      <span>Alat, Bahan & Media:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed">{idea.materials}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: NOTEBOOKLM & AI TOOLS GUIDE */}
      {activeTab === 'notebooklm' && (
        <section className="space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  Panduan Maksimalkan Google NotebookLM untuk Mahasiswi Kimia
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Asisten riset bertenaga Gemini yang aman dari halusinasi karena hanya membaca dokumen yang kamu unggah
                </p>
              </div>

              <a
                href="https://notebooklm.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs"
              >
                <span>Buka NotebookLM</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-200" />
              </a>
            </div>

            {/* 3 Langkah Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Unggah Diktat & Jurnal PDF</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unggah PDF buku Kimia Dasar (Chang, Petrucci, Oxtoby), panduan modul laptrak FPMIPA, atau jurnal referensi skripsi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Tanya Mekanisme Reaksi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ajukan pertanyaan seputar dasar teori praktikum. NotebookLM menyertakan kutipan nomor halaman yang dapat diverifikasi.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Generate Audio Overview</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Klik tombol Audio Overview untuk mengubah materi bab tebal menjadi podcast obrolan dua pembicara yang asyik didengarkan saat istirahat.
                </p>
              </div>
            </div>

            {/* Quick Prompt Generator for NotebookLM */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Prompt Cepat Siap Salin untuk NotebookLM</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'nlm-1',
                    title: 'Buat Rangkuman Dasar Teori Praktikum',
                    text: 'Ekstrak dan rangkum 3 konsep kimia utama, persamaan reaksi stoikiometri, serta mekanisme dasar yang terdapat dalam dokumen ini untuk bahan dasar teori laporan praktikum.'
                  },
                  {
                    id: 'nlm-2',
                    title: 'Bandingkan Metode Analisis dalam Tabel',
                    text: 'Buatkan tabel perbandingan kelebihan, kelemahan, limit deteksi, dan prinsip kerja dari metode-metode analisis kimia yang dibahas di dokumen ini.'
                  },
                  {
                    id: 'nlm-3',
                    title: 'Generate 10 Soal Kuis & Pembahasan',
                    text: 'Berdasarkan dokumen modul ini, buatkan 10 butir soal kuis pilihan ganda beserta kunci jawaban dan penjelasannya untuk latihan sebelum responsi lab.'
                  },
                  {
                    id: 'nlm-4',
                    title: 'Sederhanakan Konsep untuk RPP SMA',
                    text: 'Jelaskan konsep abstrak dalam dokumen ini menjadi penjelasan yang sederhana dan mudah dipahami murid SMA kelas XI lengkap dengan 1 contoh analogi sehari-hari.'
                  }
                ].map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{item.title}</span>
                        <button
                          onClick={() => copyText(item.id, item.text, item.title)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-900 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-600 mt-2 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chemistry & AI Links */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Tautan Alat AI & Laboratorium Virtual Pendukung:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Google Gemini', url: 'https://gemini.google.com', desc: 'Pemecah Persamaan & LaTeX' },
                  { name: 'PhET Simulations', url: 'https://phet.colorado.edu/in/simulations/filter?subjects=chemistry', desc: 'Simulasi Lab Virtual Interaktif' },
                  { name: 'PubChem Database', url: 'https://pubchem.ncbi.nlm.nih.gov', desc: 'Struktur Molekul & Data MSDS' },
                  { name: 'SciSpace Literature', url: 'https://scispace.com', desc: 'Analisis Jurnal Ilmiah Cepat' }
                ].map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer space-y-1 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-rose-950 truncate">
                        {tool.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-rose-700 flex-shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 group-hover:text-rose-800 truncate">
                      {tool.desc}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MODAL 1: TAMBAH / EDIT PROMPT AI --- */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-rose-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-800" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editingPromptId ? 'Edit Prompt AI Kimia' : 'Tambah Prompt AI Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Judul Prompt
                </label>
                <input
                  type="text"
                  required
                  value={promptForm.title}
                  onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                  placeholder="Contoh: Generator Soal Termokimia HOTS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Kategori
                </label>
                <select
                  value={promptForm.category}
                  onChange={(e) => setPromptForm({ ...promptForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                >
                  <option value="Pendidikan Kimia">Pendidikan Kimia</option>
                  <option value="Laptrak & Lab">Laptrak & Lab</option>
                  <option value="Pedagogi & RPP">Pedagogi & RPP</option>
                  <option value="Studi Literatur">Studi Literatur</option>
                  <option value="Kustom">Kustom / Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Deskripsi Singkat / Tujuan
                </label>
                <input
                  type="text"
                  value={promptForm.description}
                  onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                  placeholder="Contoh: Membuat 5 soal perhitungan hukum Hess tingkat analisis..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Teks Prompt AI (Instruksi Lengkap)
                </label>
                <textarea
                  required
                  rows={4}
                  value={promptForm.promptText}
                  onChange={(e) => setPromptForm({ ...promptForm, promptText: e.target.value })}
                  placeholder="Tuliskan prompt yang akan disalin ke AI..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {editingPromptId ? 'Simpan Perubahan' : 'Tambahkan Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TAMBAH / EDIT SURVIVAL NOTE --- */}
      {isSurvivalModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-rose-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-800" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editingSurvivalId ? 'Edit Catatan Survival' : 'Tambah Catatan Survival Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsSurvivalModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurvival} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Judul Catatan / Info
                </label>
                <input
                  type="text"
                  required
                  value={survivalForm.title}
                  onChange={(e) => setSurvivalForm({ ...survivalForm, title: e.target.value })}
                  placeholder="Contoh: Spot Colokan & Print Dekat FPMIPA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Kategori
                </label>
                <select
                  value={survivalForm.category}
                  onChange={(e) => setSurvivalForm({ ...survivalForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                >
                  <option value="Perlengkapan Kuliah">Perlengkapan Kuliah</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Tempat Belajar">Tempat Belajar</option>
                  <option value="Etika Akademik">Etika Akademik</option>
                  <option value="Kuliner & Kos">Kuliner & Kos</option>
                  <option value="Laboratorium Kimia">Laboratorium Kimia</option>
                  <option value="Kustom">Kustom / Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Isi Tips / Catatan Penting
                </label>
                <textarea
                  required
                  rows={4}
                  value={survivalForm.content}
                  onChange={(e) => setSurvivalForm({ ...survivalForm, content: e.target.value })}
                  placeholder="Tuliskan info, tips, atau pesan penting yang membantu perkuliahan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Lokasi / Kontak (Opsional)
                </label>
                <input
                  type="text"
                  value={survivalForm.location}
                  onChange={(e) => setSurvivalForm({ ...survivalForm, location: e.target.value })}
                  placeholder="Contoh: Gedung JICA FPMIPA Lantai 2 / Gerlong Hilir"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSurvivalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {editingSurvivalId ? 'Simpan Perubahan' : 'Tambahkan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: TAMBAH / EDIT TEACHING IDEA --- */}
      {isTeachingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-rose-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-rose-800" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editingTeachingId ? 'Edit Ide Media Ajar' : 'Tambah Ide Mengajar Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsTeachingModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeaching} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Judul Eksperimen / Demonstrasi
                </label>
                <input
                  type="text"
                  required
                  value={teachingForm.title}
                  onChange={(e) => setTeachingForm({ ...teachingForm, title: e.target.value })}
                  placeholder="Contoh: Demonstrasi Reaksi Redoks Bunglon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Topik Materi Kimia
                  </label>
                  <input
                    type="text"
                    required
                    value={teachingForm.topic}
                    onChange={(e) => setTeachingForm({ ...teachingForm, topic: e.target.value })}
                    placeholder="Contoh: Asam-Basa & pH"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={teachingForm.level}
                    onChange={(e) => setTeachingForm({ ...teachingForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  >
                    <option value="Kelas X SMA">Kelas X SMA</option>
                    <option value="Kelas XI SMA">Kelas XI SMA</option>
                    <option value="Kelas XII SMA">Kelas XII SMA</option>
                    <option value="SMP / Pengantar">SMP / Pengantar</option>
                    <option value="Umum">Umum / Semua Tingkat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Deskripsi Cara Kerja & Konsep
                </label>
                <textarea
                  required
                  rows={3}
                  value={teachingForm.description}
                  onChange={(e) => setTeachingForm({ ...teachingForm, description: e.target.value })}
                  placeholder="Jelaskan fenomena yang terjadi dan konsep ilmiah yang diajarkan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Alat, Bahan & Media
                </label>
                <input
                  type="text"
                  value={teachingForm.materials}
                  onChange={(e) => setTeachingForm({ ...teachingForm, materials: e.target.value })}
                  placeholder="Contoh: Ekstrak kol ungu, cuka, sabun, tabung reaksi..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTeachingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {editingTeachingId ? 'Simpan Perubahan' : 'Tambahkan Ide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
