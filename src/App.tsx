import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BackupModal } from './components/modals/BackupModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ScheduleView } from './components/views/ScheduleView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { LaptrakStudioView } from './components/views/LaptrakStudioView';
import { AIStudyHubView } from './components/views/AIStudyHubView';
import { FinancialView } from './components/views/FinancialView';
import { HabitsFocusView } from './components/views/HabitsFocusView';
import { TargetReflectionView } from './components/views/TargetReflectionView';
import { RomanticVaultView } from './components/views/RomanticVaultView';
import { RomanticJournalView } from './components/views/RomanticJournalView';
import { EmergencyContactView } from './components/views/EmergencyContactView';

// Toast and Icons
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'beranda':
        return <HomeView />;
      case 'jadwal':
        return <ScheduleView />;
      case 'tugas':
        return <AssignmentsView />;
      case 'laptrak':
        return <LaptrakStudioView />;
      case 'belajar-ai':
        return <AIStudyHubView />;
      case 'keuangan':
        return <FinancialView />;
      case 'kebiasaan':
        return <HabitsFocusView />;
      case 'target-refleksi':
        return <TargetReflectionView />;
      case 'romantic-vault':
        return <RomanticVaultView />;
      case 'jurnal-romantis':
        return <RomanticJournalView />;
      case 'kontak-siaga':
        return <EmergencyContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf5f6] text-slate-800 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900 pb-10">
      {/* Top Header */}
      <Header onOpenBackup={() => setIsBackupModalOpen(true)} />

      {/* Slide-out Sidebar Drawer (Sole Navigation via Top-Left Burger Menu) */}
      <Sidebar onOpenBackup={() => setIsBackupModalOpen(true)} />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-medium rounded-2xl shadow-xl border border-white/10 max-w-md">
            <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
