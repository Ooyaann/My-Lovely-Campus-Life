import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  Lightbulb, 
  HelpCircle,
  FileText,
  Compass,
  GraduationCap,
  Atom,
  FlaskConical
} from 'lucide-react';
import { CHEMISTRY_AI_PROMPTS, UPI_SURVIVAL_NOTES, CHEMISTRY_TEACHING_IDEAS } from '../../data/initialData';
import { useApp } from '../../context/AppContext';

type StudyTab = 'prompts' | 'survival' | 'teaching' | 'notebooklm';

export const AIStudyHubView: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<StudyTab>('prompts');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pedagogi & RPP', 'Laptrak & Lab', 'Pendidikan Kimia', 'Studi Literatur'];

  const filteredPrompts = selectedCategory === 'Semua'
    ? CHEMISTRY_AI_PROMPTS
    : CHEMISTRY_AI_PROMPTS.filter((p) => p.category === selectedCategory);

  const copyPrompt = (id: string, text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Prompt "${title}" berhasil disalin!`);
    setTimeout(() => {
      setCopiedId(null), 2000;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-10">
      {/* 1. Header Banner with Bright Maroon Gradient */}
      <section className="bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#be123c] text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-rose-300/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              <span>Ruang Belajar Pendidikan Kimia UPI</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Pojok AI & Survival Kimia
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-sans">
              Asisten cerdas untuk membuat RPP Kurikulum Merdeka, analisis data laptrak, dan tips kuliah sukses di Kampus UPI Bumi Siliwangi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#9f1239] hover:bg-rose-50 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Buka Google NotebookLM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Sub-Tabs (Clean Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'prompts', label: '7 Prompt AI Kimia', count: '7', icon: Sparkles },
          { id: 'survival', label: 'Survival Guide UPI', count: '6', icon: Compass },
          { id: 'teaching', label: 'Media Ajar Seru', count: '5', icon: GraduationCap },
          { id: 'notebooklm', label: 'NotebookLM Guide', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StudyTab)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-rose-50 border-slate-200/80 hover:text-rose-900'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-rose-900'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 1: AI PROMPTS */}
      {activeTab === 'prompts' && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Pustaka Prompt AI Pendidikan Kimia
              </h3>
              <p className="text-xs text-slate-500">
                Tinggal salin dan tempel ke ChatGPT, Gemini, atau Claude
              </p>
            </div>

            {/* Category Filter Pills (Wrapping grid / flex) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-5 rounded-2xl border border-rose-100 bg-white hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#9f1239] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {prompt.category}
                    </span>
                    <button
                      onClick={() => copyPrompt(prompt.id, prompt.promptText, prompt.title)}
                      className="p-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#9f1239] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {prompt.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 line-clamp-3 leading-relaxed">
                  {prompt.promptText}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: SURVIVAL GUIDE UPI */}
      {activeTab === 'survival' && (
        <section className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
            <h3 className="font-display font-bold text-base text-slate-900">
              Survival Notes & Tips Khusus Mahasiswa Kimia UPI
            </h3>
            <p className="text-xs text-slate-500">
              Catatan praktis lokasi, fasilitas FPMIPA, dan trik perkuliahan dari Mas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {UPI_SURVIVAL_NOTES.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#9f1239] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {note.category}
                    </span>
                    <Compass className="w-4 h-4 text-rose-400" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>

                {note.location && (
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                    📍 {note.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: TEACHING & PEDAGOGY IDEAS */}
      {activeTab === 'teaching' && (
        <section className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
            <h3 className="font-display font-bold text-base text-slate-900">
              Bank Ide Media Mengajar Kimia Kreatif
            </h3>
            <p className="text-xs text-slate-500">
              Inspirasi demonstrasi kelas mikro-teaching & praktikum seru untuk siswa SMA
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHEMISTRY_TEACHING_IDEAS.map((idea) => (
              <div
                key={idea.id}
                className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#9f1239] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {idea.topic}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {idea.level}
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-slate-900">
                  {idea.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {idea.description}
                </p>

                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                  <span className="font-bold text-[#9f1239] block text-[11px]">Bahan & Media:</span>
                  <p className="text-slate-700">{idea.materials}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: NOTEBOOKLM GUIDE */}
      {activeTab === 'notebooklm' && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-5">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Cara Maksimalkan Google NotebookLM untuk Mahasiswa Kimia UPI
            </h3>
            <p className="text-xs text-slate-500">
              Alat bantu gratis bertenaga Gemini untuk membaca jurnal dan modul praktikum tebal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <span className="font-bold text-[#9f1239] text-sm block">1. Unggah Modul / Diktat</span>
              <p className="text-slate-600 leading-relaxed">
                Download PDF buku Chang, Petrucci, atau petunjuk praktikum kimia UPI lalu masukkan ke NotebookLM.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <span className="font-bold text-[#9f1239] text-sm block">2. Tanya Mekanisme Reaksi</span>
              <p className="text-slate-600 leading-relaxed">
                AI hanya akan menjawab berdasarkan buku yang kamu unggah, sehingga bebas halusinasi dan terverifikasi sumbernya.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <span className="font-bold text-[#9f1239] text-sm block">3. Buat Audio Podcast</span>
              <p className="text-slate-600 leading-relaxed">
                Klik 'Generate Audio Overview' untuk mengubah rangkuman materi menjadi obrolan podcast yang bisa didengarkan di jalan.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9f1239] text-white font-bold text-xs hover:bg-rose-800 transition-all cursor-pointer"
            >
              <span>Buka Google NotebookLM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      )}
    </div>
  );
};
