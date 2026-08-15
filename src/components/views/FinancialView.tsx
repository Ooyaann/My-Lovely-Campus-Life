import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  Coffee, 
  BookOpen, 
  Home, 
  Car, 
  Heart, 
  MoreHorizontal, 
  Trash2, 
  Sparkles,
  Search,
  Filter,
  CreditCard,
  Calendar,
  Clock,
  FileText,
  Eye,
  X,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, ExpenseItem } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const FinancialView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, totalExpensesToday, totalExpensesAllTime, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [filterCat, setFilterCat] = useState<string>('Semua');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('25000');
  const [category, setCategory] = useState<ExpenseCategory>('Makan');
  const [notes, setNotes] = useState('');

  const getCategoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Makan':
        return Coffee;
      case 'Kopi/Nongkrong':
        return Coffee;
      case 'Alat Lab/Print':
        return BookOpen;
      case 'Kebutuhan Kos':
        return Home;
      case 'Transport':
        return Car;
      case 'Skincare/Pribadi':
        return Heart;
      default:
        return MoreHorizontal;
    }
  };

  const getCategoryColor = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Makan':
        return { bg: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500' };
      case 'Kopi/Nongkrong':
        return { bg: 'bg-purple-50 text-purple-900 border-purple-200', dot: 'bg-purple-500' };
      case 'Alat Lab/Print':
        return { bg: 'bg-sky-50 text-sky-900 border-sky-200', dot: 'bg-sky-500' };
      case 'Kebutuhan Kos':
        return { bg: 'bg-rose-50 text-rose-900 border-rose-200', dot: 'bg-rose-500' };
      case 'Transport':
        return { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', dot: 'bg-emerald-500' };
      case 'Skincare/Pribadi':
        return { bg: 'bg-pink-50 text-pink-900 border-pink-200', dot: 'bg-pink-500' };
      default:
        return { bg: 'bg-slate-50 text-slate-800 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    addExpense({
      title: title.trim(),
      amount: numAmount,
      category,
      notes: notes.trim() ? notes.trim() : undefined
    });

    setTitle('');
    setAmount('25000');
    setNotes('');
    setShowAddModal(false);
    showToast('Transaksi baru berhasil dicatat!');
  };

  const handleDeleteExpense = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteExpense(id);
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense(null);
    }
    showToast('Transaksi berhasil dihapus');
  };

  // Date helper logic for Time Range
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentYearMonth = now.toISOString().slice(0, 7);
  
  // Last month YYYY-MM calculation
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonthDate.toISOString().slice(0, 7);

  // 7 days ago timestamp
  const sevenDaysAgoDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const isWithinTimeRange = (dateStr: string, range: string) => {
    if (range === 'all') return true;
    if (range === 'today') return dateStr === todayStr;
    if (range === '7days') return dateStr >= sevenDaysAgoDate && dateStr <= todayStr;
    if (range === 'month') return dateStr.startsWith(currentYearMonth);
    if (range === 'last_month') return dateStr.startsWith(prevMonthStr);
    return true;
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Hari Ini';
      case '7days': return '7 Hari Terakhir';
      case 'month': return 'Bulan Ini';
      case 'last_month': return 'Bulan Lalu';
      default: return 'Semua Waktu';
    }
  };

  // 1. Filter by time range first
  const timeFilteredExpenses = expenses.filter((exp) => isWithinTimeRange(exp.date, filterTimeRange));
  const totalFilteredPeriod = timeFilteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Group by category for breakdown stats in the active time range
  const categoryTotals = timeFilteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // 3. Filter by category and search keyword
  const filteredExpenses = timeFilteredExpenses.filter((exp) => {
    const matchCat = filterCat === 'Semua' || exp.category === filterCat;
    const matchSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-12">
      {/* 1. Header Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total of Selected Period Card */}
        <div className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total ({getTimeRangeLabel(filterTimeRange)})
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100/90 flex items-center justify-center text-rose-900">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-2xl sm:text-3xl text-rose-900 tracking-tight">
              Rp {totalFilteredPeriod.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {timeFilteredExpenses.length} transaksi pada rentang {getTimeRangeLabel(filterTimeRange).toLowerCase()}
            </p>
          </div>
        </div>

        {/* All-time and Today Stat Card */}
        <div className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pengeluaran Hari Ini & Total
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100/90 flex items-center justify-center text-indigo-900">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-700" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-500">Hari Ini:</span>
              <span className="font-display font-bold text-lg text-slate-900">
                Rp {totalExpensesToday.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Total semua catatan:</span>
              <span className="font-semibold text-slate-700">Rp {totalExpensesAllTime.toLocaleString('id-ID')}</span>
            </p>
          </div>
        </div>

        {/* Action & Note from Mas */}
        <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1 border border-rose-300/20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-rose-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Pesan Mas Mie Ayam:</span>
            </div>
            <p className="font-reading text-xs sm:text-sm text-rose-100/95 leading-relaxed italic">
              "Jangan lupa makan teratur ya Sayang. Kalau uang bulanan mepet atau butuh fotokopi modul laptrak, kabarin Mas ya!"
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran Baru</span>
          </button>
        </div>
      </section>

      {/* 2. Category Breakdown Pills */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Distribusi Pengeluaran per Kategori
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Kelola bujet harian kos lebih rapi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(['Makan', 'Kopi/Nongkrong', 'Alat Lab/Print', 'Transport', 'Kebutuhan Kos', 'Skincare/Pribadi'] as ExpenseCategory[]).map((cat) => {
            const Icon = getCategoryIcon(cat);
            const total = categoryTotals[cat] || 0;
            const isSelected = filterCat === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(isSelected ? 'Semua' : cat)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-rose-900 text-white border-rose-900 ring-2 ring-rose-500/30 shadow-xs' 
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-rose-900'}`} />
                  <span className={`truncate ${isSelected ? 'text-white' : 'text-slate-700'}`}>{cat}</span>
                </div>
                <div className={`text-xs sm:text-sm font-bold font-mono mt-1.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  Rp {total.toLocaleString('id-ID')}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Transaction History List */}
      <section className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Riwayat Transaksi Pengeluaran
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredExpenses.length} dari {expenses.length} total catatan (klik transaksi untuk melihat detail)
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama/catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Time Range Filter */}
            <div className="w-full sm:w-44">
              <CustomSelect
                value={filterTimeRange}
                onChange={setFilterTimeRange}
                icon={Calendar}
                placeholder="Rentang Waktu"
                options={[
                  { value: 'all', label: 'Semua Waktu', count: expenses.length },
                  { value: 'today', label: 'Hari Ini' },
                  { value: '7days', label: '7 Hari Terakhir' },
                  { value: 'month', label: 'Bulan Ini' },
                  { value: 'last_month', label: 'Bulan Lalu' },
                ]}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-44">
              <CustomSelect
                value={filterCat}
                onChange={setFilterCat}
                icon={Filter}
                placeholder="Kategori"
                options={[
                  { value: 'Semua', label: 'Semua Kategori', count: expenses.length },
                  { value: 'Makan', label: 'Makan & Minum' },
                  { value: 'Kopi/Nongkrong', label: 'Kopi & Nongkrong' },
                  { value: 'Alat Lab/Print', label: 'Alat Lab & Print' },
                  { value: 'Transport', label: 'Transport' },
                  { value: 'Kebutuhan Kos', label: 'Kebutuhan Kos' },
                  { value: 'Skincare/Pribadi', label: 'Skincare / Pribadi' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 space-y-2.5">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Tidak ada catatan transaksi yang sesuai dengan pencarian atau filter ({getTimeRangeLabel(filterTimeRange)}).
              </p>
              {(filterCat !== 'Semua' || filterTimeRange !== 'all' || searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterCat('Semua');
                    setFilterTimeRange('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-rose-900 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Reset Semua Filter & Pencarian</span>
                </button>
              )}
            </div>
          ) : (
            filteredExpenses.map((exp) => {
              const Icon = getCategoryIcon(exp.category);
              const badgeStyle = getCategoryColor(exp.category);
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpense(exp)}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-rose-50/30 hover:border-rose-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer active:scale-[0.995]"
                >
                  {/* Left Side: Icon & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-900 flex-shrink-0 group-hover:bg-rose-100/80 group-hover:scale-105 transition-all">
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Title & Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-950 transition-colors">
                          {exp.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 ${badgeStyle.bg}`}>
                          {exp.category}
                        </span>
                      </div>

                      {/* Date, Time, and Optional Note */}
                      <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                        <span className="text-[11px] text-slate-500 whitespace-nowrap flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{exp.date}</span>
                        </span>

                        <span className="text-[11px] text-slate-300">•</span>
                        
                        <span className="text-[11px] text-slate-500 whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{exp.time}</span>
                        </span>

                        {exp.notes && (
                          <>
                            <span className="text-[11px] text-slate-300 hidden sm:inline">•</span>
                            <span className="text-[11px] text-slate-500 italic truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
                              "{exp.notes}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Nominal & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block sm:hidden">Nominal</span>
                      <div className="font-mono font-bold text-sm sm:text-base text-rose-950 whitespace-nowrap">
                        - Rp {exp.amount.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExpense(exp);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-100/70 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-900 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Detail</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteExpense(exp.id, e)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Transaction Detail Modal (Pop-up) */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-rose-200" />
                <h3 className="font-display font-bold text-base sm:text-lg">Detail Transaksi Pengeluaran</h3>
              </div>
              <button 
                onClick={() => setSelectedExpense(null)} 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Amount Highlight */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900">
                  Total Pengeluaran
                </span>
                <div className="font-display font-bold text-2xl sm:text-3xl text-rose-950">
                  Rp {selectedExpense.amount.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start justify-between py-2 border-b border-slate-100 gap-3">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5 flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nama Pengeluaran</span>
                  </span>
                  <span className="font-bold text-slate-900 text-right">
                    {selectedExpense.title}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 gap-3">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5 flex-shrink-0">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kategori</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getCategoryColor(selectedExpense.category).bg}`}>
                    {selectedExpense.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 gap-3">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanggal & Waktu</span>
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedExpense.date} • {selectedExpense.time}
                  </span>
                </div>

                {selectedExpense.notes && (
                  <div className="py-2 border-b border-slate-100 space-y-1">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>Catatan Tambahan:</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-50 text-slate-700 font-reading leading-relaxed italic border border-slate-200/80">
                      "{selectedExpense.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(selectedExpense.id)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Transaksi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedExpense(null)}
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-rose-200" />
                <h3 className="font-display font-bold text-base sm:text-lg">Catat Pengeluaran Baru</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nama Pengeluaran <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Makan Siang Kantin JICA / Cetak Modul"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nominal (Rupiah) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Kategori Pengeluaran
                </label>
                <CustomSelect
                  value={category}
                  onChange={(val) => setCategory(val as ExpenseCategory)}
                  options={[
                    { value: 'Makan', label: 'Makan & Minum', color: '#f59e0b' },
                    { value: 'Kopi/Nongkrong', label: 'Kopi & Nongkrong', color: '#8b5cf6' },
                    { value: 'Alat Lab/Print', label: 'Alat Lab & Print Laptrak', color: '#0284c7' },
                    { value: 'Transport', label: 'Transport & Bensin', color: '#10b981' },
                    { value: 'Kebutuhan Kos', label: 'Kebutuhan Kos & Laundry', color: '#e11d48' },
                    { value: 'Skincare/Pribadi', label: 'Skincare & Pribadi', color: '#ec4899' },
                    { value: 'Lainnya', label: 'Lainnya', color: '#64748b' }
                  ]}
                  ariaLabel="Pilih Kategori Pengeluaran"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Beli bareng temen praktikum..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-800 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


