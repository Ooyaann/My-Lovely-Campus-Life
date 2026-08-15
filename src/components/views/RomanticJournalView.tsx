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
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoveNoteEntry } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const RomanticJournalView: React.FC = () => {
  const { loveNotes, addLoveNote, deleteLoveNote } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('Manis');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addLoveNote(title.trim(), content.trim(), moodTag);
    setTitle('');
    setContent('');
    setMoodTag('Manis');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <section className="bg-white rounded-3xl border border-rose-100/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0">
              <BookHeart className="w-6 h-6 text-[#831843]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  Jurnal Kenangan & Buku Harian Kita
                </h2>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Catatan momen bahagia, kencan sederhana, dan apresiasi rasa cinta berdua
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Cerita Baru</span>
          </button>
        </div>
      </section>

      {/* 2. Journal Timeline / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {loveNotes.map((note) => (
          <article
            key={note.id}
            className="bg-white rounded-3xl border border-rose-100/90 p-5 sm:p-6 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>{note.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    {note.moodTag || 'Manis'}
                  </span>
                  <button
                    onClick={() => deleteLoveNote(note.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-900/70 font-semibold">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Ditulis oleh {note.author}</span>
              </span>
              <span className="text-slate-400 font-normal">Kenangan Indah</span>
            </div>
          </article>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-base sm:text-lg">Tulis Catatan Harian Kenangan</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white cursor-pointer text-lg">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Momen</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kencan Sore di Kantin FPMIPA & Curhat Laptrak"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Suasana / Mood Momen</label>
                <CustomSelect
                  value={moodTag}
                  onChange={setMoodTag}
                  options={[
                    { value: 'Manis', label: 'Manis & Romantis', color: '#ec4899' },
                    { value: 'Bahagia', label: 'Penuh Tawa', color: '#f59e0b' },
                    { value: 'Hangat', label: 'Hangat & Menenangkan', color: '#8b5cf6' },
                    { value: 'Penyemangat', label: 'Penyemangat Kuliah', color: '#10b981' },
                    { value: 'Kangen', label: 'Rindu', color: '#881337' }
                  ]}
                  ariaLabel="Pilih Suasana Mood"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Isi Cerita / Pesan Cinta</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan apa yang kamu rasakan hari ini bersama Mas..."
                  className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 font-reading leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold cursor-pointer shadow-xs"
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
