import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Phone,
  HelpCircle,
  Building,
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyContactView: React.FC = () => {
  const { masPhone, setMasPhone, showToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(masPhone || '083849708166');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const quickMessages = [
    {
      title: '🚨 Butuh Telepon Cepat',
      text: 'Mas, aku lagi overthinking dan pusing banget sama tugas lab UPI. Bisa telepon sebentar gak? 🥺'
    },
    {
      title: '🍜 Temani Makan / Ngobrol',
      text: 'Mas, aku baru beres kuliah dan laper banget di kosan. Temenin cari makan atau ngobrol yuk 🍜'
    },
    {
      title: '🎉 Laptrak Selesai!',
      text: 'Mas! Laporan praktikum kimia aku akhirnya selesai tepat waktu! Mau cerita ke kamu ❤️'
    },
    {
      title: '🥺 Butuh Penyemangat',
      text: 'Mas, lagi capek banget hari ini. Butuh kata-kata penyemangat dari Mas sekarang 😭'
    },
    {
      title: '🛵 Minta Jemput Kampus',
      text: 'Mas, aku udah di lobi Gedung JICA FPMIPA UPI nih. Mas lagi senggang gak buat jemput? 🥰'
    },
    {
      title: '❤️ Kangen Sederhana',
      text: 'Cuma mau bilang, makasih ya Mas udah selalu sabar dan ada buat aku. Kangen kamu!'
    }
  ];

  const campusEmergency = [
    { name: 'Panggilan Darurat Bandung', number: '112', desc: 'Layanan terpadu ambulans, kepolisian & kebencanaan' },
    { name: 'Poliklinik Pratama UPI', number: '022-2013163', desc: 'Pelayanan medis & pertolongan pertama mahasiswa UPI' },
    { name: 'Pos Keamanan FPMIPA UPI', number: '022-2000579', desc: 'Keamanan gedung kuliah & laboratorium kimia' },
    { name: 'Ambulans / PMI Bandung', number: '118', desc: 'Penanganan gawat darurat medis cepat' }
  ];

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setMasPhone(phoneNumber.trim());
    setIsEditingPhone(false);
    showToast('Nomor kontak Mas berhasil diperbarui!');
  };

  const getCleanWaPhone = (num: string) => {
    let clean = num.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const handleSendWA = (message: string) => {
    const encoded = encodeURIComponent(message);
    const cleanPhone = getCleanWaPhone(masPhone || phoneNumber);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Pesan berhasil disalin!');
    setTimeout(() => {
      setCopiedIdx(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Mas Main SOS Card with Bright Maroon Gradient */}
      <section className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-300/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-semibold backdrop-blur-xs whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span>Status: Siaga 24 Jam untuk Sayang</span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Mas 🤍 (Kontak Siaga Pribadi)
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/90 max-w-lg leading-relaxed font-sans">
              Tempat pulang ternyaman kapan pun kamu butuh ditemani, berkeluh kesah, atau lelah menjalani perkuliahan di Kimia UPI.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0 w-full md:w-auto">
            <button
              id="mas-direct-wa-btn"
              onClick={() => handleSendWA('Halo Mas Sayang! Aku lagi butuh kamu nih ❤️')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>WhatsApp Mas</span>
            </button>

            <a
              href={`tel:${masPhone || phoneNumber}`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-rose-200 flex-shrink-0" />
              <span>Telepon Langsung</span>
            </a>
          </div>
        </div>

        {/* Contact Info Edit Bar */}
        <div className="mt-5 pt-3.5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-rose-100 gap-2">
          {!isEditingPhone ? (
            <div className="flex items-center gap-2">
              <span>Nomor WhatsApp Mas: <strong className="font-mono text-white tracking-wide">{masPhone || phoneNumber}</strong></span>
              <button
                onClick={() => {
                  setPhoneNumber(masPhone || '083849708166');
                  setIsEditingPhone(true);
                }}
                className="text-rose-200 underline hover:text-white cursor-pointer ml-1 text-[11px] whitespace-nowrap"
              >
                Ubah Nomor
              </button>
            </div>
          ) : (
            <form onSubmit={handleSavePhone} className="flex items-center gap-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="083849708166"
                className="px-3 py-1 rounded-xl bg-white text-slate-900 font-mono text-xs focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-white text-rose-900 font-bold rounded-xl text-xs cursor-pointer whitespace-nowrap"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingPhone(false)}
                className="text-white/80 hover:text-white text-xs cursor-pointer whitespace-nowrap"
              >
                Batal
              </button>
            </form>
          )}

          <span className="text-[11px] text-rose-200/80 whitespace-nowrap">
            Tersedia untuk obrolan malam & telepon kapan pun ✨
          </span>
        </div>
      </section>

      {/* 2. One-Tap Quick Message Templates */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-rose-900 flex-shrink-0" />
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Pesan Cepat 1-Klik ke Mas
            </h3>
            <p className="text-xs text-slate-500">
              Pilih template pesan untuk langsung dikirim via WhatsApp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickMessages.map((msg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-rose-100/90 bg-rose-50/20 hover:bg-white hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {msg.title}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                  "{msg.text}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleSendWA(msg.text)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Kirim WA</span>
                </button>
                <button
                  onClick={() => handleCopyMessage(msg.text, idx)}
                  className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-900 border border-slate-200 transition-colors cursor-pointer flex-shrink-0"
                  title="Salin Teks"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Custom Quick Message Box */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-xs space-y-3">
        <h3 className="font-display font-bold text-sm text-slate-900">
          Tulis Pesan Bebas ke Mas
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Tulis pesan untuk Mas..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
          />
          <button
            onClick={() => {
              if (customMsg.trim()) {
                handleSendWA(customMsg.trim());
                setCustomMsg('');
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Kirim</span>
          </button>
        </div>
      </section>

      {/* 4. Campus & Bandung Emergency Directory */}
      <section className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-700 flex-shrink-0" />
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
              Kontak Penting Kampus UPI & Bandung
            </h3>
            <p className="text-xs text-slate-500">
              Nomor darurat medis, keamanan kampus, dan kepolisian
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {campusEmergency.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
              </div>
              <a
                href={`tel:${item.number}`}
                className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold text-xs hover:bg-rose-50 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>{item.number}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

