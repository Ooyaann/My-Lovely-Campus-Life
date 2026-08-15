import React, { useState } from 'react';
import { 
  BookHeart, 
  Heart, 
  Plus, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Smile, 
  Coffee,
  X,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoveNoteEntry } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const RomanticJournalView: React.FC = () => {
  const { loveNotes, addLoveNote, deleteLoveNote, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('Manis');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addLoveNote(title.trim(), content.trim(), moodTag);
    setTitle('');
    setContent('');
    setMoodTag('Manis');
    setShowAddModal(false);
    showToast('Kenangan baru berhasil ditulis ke dalam buku harian! 🌸');
  };

  const handleCopyNote = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Catatan kenangan berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = loveNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.moodTag && note.moodTag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-900 flex-shrink-0">
              <BookHeart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                  Jurnal Kenangan & Buku Harian Kita
                </h2>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {loveNotes.length} lembar kenangan manis, kencan sederhana, dan apresiasi rasa cinta berdua
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Cerita Baru</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-5 pt-4 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kenangan atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 transition-all"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium self-end sm:self-center">
            Menampilkan {filteredNotes.length} dari {loveNotes.length} catatan
          </span>
        </div>
      </section>

      {/* 2. Journal Timeline / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredNotes.map((note) => (
          <article
            key={note.id}
            className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-rose-700" />
                  <span>{note.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {note.moodTag || 'Manis'}
                  </span>
                  <button
                    onClick={() => deleteLoveNote(note.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                {note.title}
              </h3>

              <div className="font-reading text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-900/80 font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-700 fill-rose-700 flex-shrink-0" />
                <span>Ditulis oleh {note.author}</span>
              </span>

              <button
                onClick={() => handleCopyNote(`"${note.title}"\n\n${note.content}\n\n— Ditulis oleh ${note.author} (${note.date})`, note.id)}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedId === note.id ? (
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
          </article>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookHeart className="w-5 h-5 text-rose-200" />
                <h3 className="font-display font-bold text-base sm:text-lg">Tulis Catatan Kenangan Baru</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Momen <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kencan Sore di Kantin FPMIPA & Curhat Laptrak"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Suasana / Mood Momen</label>
                <CustomSelect
                  value={moodTag}
                  onChange={setMoodTag}
                  options={[
                    { value: 'Manis', label: 'Manis & Romantis', color: '#ec4899' },
                    { value: 'Bahagia', label: 'Penuh Tawa & Bahagia', color: '#f59e0b' },
                    { value: 'Hangat', label: 'Hangat & Menenangkan', color: '#8b5cf6' },
                    { value: 'Penyemangat', label: 'Penyemangat Kuliah', color: '#10b981' },
                    { value: 'Kangen', label: 'Rindu & Kangen', color: '#881337' }
                  ]}
                  ariaLabel="Pilih Suasana Mood"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Isi Cerita / Ungkapan Hati <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan apa yang kamu rasakan hari ini bersama Mas..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 font-reading leading-relaxed focus:outline-hidden focus:border-rose-800 transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

