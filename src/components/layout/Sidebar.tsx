import React from 'react';
import { 
  X, 
  Home, 
  Calendar, 
  CheckSquare, 
  FlaskConical, 
  Sparkles, 
  Wallet, 
  HeartHandshake, 
  Target, 
  Mail, 
  BookHeart, 
  PhoneCall, 
  Heart,
  ExternalLink,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  onOpenBackup: () => void;
}

interface NavMenuItem {
  id: NavigationTab;
  label: string;
  badge?: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenBackup }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    assignments, 
    expenses 
  } = useApp();

  const pendingTasksCount = assignments.filter((t) => !t.isDone).length;

  const menuSections: { title: string; items: NavMenuItem[] }[] = [
    {
      title: 'UTAMA & LIVE HUB',
      items: [
        { id: 'beranda', label: 'Beranda & Live Hub', icon: Home, badge: 'Live' }
      ]
    },
    {
      title: 'AKADEMIK & KULIAH UPI',
      items: [
        { id: 'jadwal', label: 'Jadwal Kuliah (KRS)', icon: Calendar, badge: '8 Matkul' },
        { id: 'tugas', label: 'Tugas & Pengingat', icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined },
        { id: 'laptrak', label: 'Laptrak Studio & Format', icon: FlaskConical, badge: '9 Format' },
        { id: 'belajar-ai', label: 'Pojok AI & Kimia', icon: Sparkles }
      ]
    },
    {
      title: 'KESEHARIAN ANAK KOS',
      items: [
        { id: 'keuangan', label: 'Catatan Keuangan Kos', icon: Wallet, badge: expenses.length > 0 ? 'Aktif' : undefined },
        { id: 'kebiasaan', label: 'Kesehatan & Fokus', icon: HeartHandshake },
        { id: 'target-refleksi', label: 'Target & Refleksi IPK', icon: Target }
      ]
    },
    {
      title: 'ZONA SAYANG & KENANGAN',
      items: [
        { id: 'romantic-vault', label: 'Surat & Pesan Mas', icon: Mail, badge: '7 Surat' },
        { id: 'jurnal-romantis', label: 'Jurnal Kenangan Berdua', icon: BookHeart }
      ]
    },
    {
      title: 'DARURAT & SIAGA',
      items: [
        { id: 'kontak-siaga', label: 'Siaga Mas (24 Jam)', icon: PhoneCall, badge: 'Darurat' }
      ]
    }
  ];

  return (
    <>
      {/* Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="app-sidebar-drawer"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-white border-r border-rose-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Bright Maroon Gradient */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#be123c] text-white">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="My Lovely Campus Diary Logo"
              className="w-10 h-10 rounded-xl object-cover border border-white/30 shadow-xs flex-shrink-0"
            />
            <div>
              <h2 className="font-display font-bold text-base tracking-wide text-white">
                Campus Diary
              </h2>
              <p className="text-[11px] text-rose-100 font-sans">
                Karya Mas untuk Sayang 🤍
              </p>
            </div>
          </div>

          <button
            id="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-sans">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-50 text-[#9f1239] font-bold border border-rose-200'
                          : 'text-slate-700 hover:bg-rose-50/60 hover:text-[#9f1239]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#9f1239]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#9f1239] text-white'
                              : item.badge === 'Darurat'
                              ? 'bg-rose-100 text-[#9f1239]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-rose-100 bg-[#fffdfa] space-y-2">
          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#9f1239] font-bold">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#9f1239] text-[#9f1239]" />
                <span>Pesan dari Mas</span>
              </span>
              <span className="text-[10px] text-slate-500">UPI '26</span>
            </div>
            <p className="text-[11px] text-slate-700 font-reading italic line-clamp-2">
              "Semangat kuliahnya hari ini ya Sayang. Mas selalu bangga sama kamu!"
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="sidebar-backup-data-btn"
              onClick={() => {
                setIsSidebarOpen(false);
                onOpenBackup();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-rose-900" />
              <span>Cadangkan Data</span>
            </button>
            <a
              href="https://spot.upi.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-600 hover:text-rose-900 transition-all cursor-pointer"
              title="Buka SPOT UPI"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
