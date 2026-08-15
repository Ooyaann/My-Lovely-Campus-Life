import React from 'react';
import { Menu, Heart, Sparkles, PhoneCall } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface HeaderProps {
  onOpenBackup?: () => void;
}

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string }> = {
  beranda: { title: 'Halo, Sayang', subtitle: 'Digital Sanctuary & Ruang Belajar dari Mas' },
  jadwal: { title: 'Jadwal Kuliah UPI', subtitle: 'KRS Pendidikan Kimia FPMIPA \'26' },
  tugas: { title: 'Tugas & Pengingat', subtitle: 'Laptrak, Makalah & Jadwal Kencan' },
  laptrak: { title: 'Laptrak Studio', subtitle: '9 Format Laporan UPI & Kalkulator Lab' },
  'belajar-ai': { title: 'Pojok AI & Kimia', subtitle: 'NotebookLM & 7 Prompt Pendidikan Kimia' },
  keuangan: { title: 'Catatan Keuangan Kos', subtitle: 'Pengeluaran Harian & Mingguan' },
  kebiasaan: { title: 'Kesehatan & Fokus', subtitle: '2L Air, Micro-habits & Pomodoro' },
  'target-refleksi': { title: 'Target & Refleksi', subtitle: 'Target Semester & Rencana Berdua' },
  'romantic-vault': { title: 'Surat & Pesan Mas', subtitle: 'Surat Ulang Tahun, 7 Amplop & Obrolan' },
  'jurnal-romantis': { title: 'Jurnal Kenangan', subtitle: 'Kisah Cerita Kita & Catatan Manis' },
  'kontak-siaga': { title: 'Siaga Mas (24 Jam)', subtitle: 'Kontak Darurat Siaga 24 Jam' }
};

export const Header: React.FC<HeaderProps> = ({ onOpenBackup }) => {
  const { activeTab, setActiveTab, setIsSidebarOpen } = useApp();
  const currentInfo = TAB_TITLES[activeTab] || { title: 'Halo, Sayang', subtitle: 'Workspace Khusus Sayang' };

  return (
    <header className="sticky top-0 z-30 bg-[#fffdfa]/95 backdrop-blur-md border-b border-rose-100 px-3.5 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Burger Menu Toggle & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            id="burger-menu-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Buka Menu"
            className="p-1.5 sm:p-2 rounded-xl bg-white border border-rose-200 text-rose-900 shadow-2xs hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <Menu className="w-4 h-4 text-rose-900" />
          </button>

          <img
            src="/logo.jpg"
            alt="Campus Diary Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-rose-200 shadow-2xs flex-shrink-0 cursor-pointer"
            onClick={() => setActiveTab('beranda')}
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-display font-bold text-sm sm:text-base lg:text-lg text-rose-900 tracking-tight whitespace-nowrap truncate">
                {currentInfo.title}
              </h1>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 hidden sm:inline-block animate-pulse flex-shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block font-sans truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick SOS / Call Mas */}
          <button
            id="header-sos-btn"
            onClick={() => setActiveTab('kontak-siaga')}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Mas Siaga 24 Jam"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-900" />
            <span className="hidden md:inline">Siaga Mas</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Romantic Vault Icon */}
          <button
            id="header-vault-btn"
            onClick={() => setActiveTab('romantic-vault')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-600 p-0.5 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 transition-all flex-shrink-0 flex items-center justify-center"
            title="Surat & Pesan Mas"
          >
            <div className="w-full h-full rounded-full bg-rose-950 flex items-center justify-center text-white">
              <Sparkles className="w-3 h-3 text-rose-200" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

