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
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const FinancialView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, totalExpensesToday, totalExpensesAllTime } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

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
  };

  // Group by category for breakdown stats
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Expense Card */}
        <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pengeluaran Hari Ini
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
              <Wallet className="w-5 h-5 text-[#831843]" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#831843]">
            Rp {totalExpensesToday.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500">
            Total tercatat untuk tanggal hari ini
          </p>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Seluruh Catatan
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800">
              <TrendingUp className="w-5 h-5 text-indigo-700" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-slate-900">
            Rp {totalExpensesAllTime.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500">
            Dari {expenses.length} transaksi yang tercatat
          </p>
        </div>

        {/* Action & Note from Mas Mie Ayam */}
        <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-rose-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pesan Mas Mie Ayam:</span>
            </div>
            <p className="text-xs text-rose-100/90 leading-relaxed">
              "Jangan lupa makan teratur ya Sayang. Kalau uang bulanan mepet atau butuh fotokopi modul laptrak, kabarin Mas ya!"
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white text-[#831843] hover:bg-rose-50 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran Baru</span>
          </button>
        </div>
      </section>

      {/* 2. Category Breakdown Pills */}
      <section className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          Distribusi Pengeluaran Berdasarkan Kategori
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(['Makan', 'Kopi/Nongkrong', 'Alat Lab/Print', 'Transport', 'Kebutuhan Kos', 'Skincare/Pribadi'] as ExpenseCategory[]).map((cat) => {
            const Icon = getCategoryIcon(cat);
            const total = categoryTotals[cat] || 0;
            return (
              <div key={cat} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 truncate">
                  <Icon className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                  <span className="truncate">{cat}</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-900">
                  Rp {total.toLocaleString('id-ID')}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Transaction History List */}
      <section className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Riwayat Transaksi Harian
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {expenses.length} Catatan
          </span>
        </div>

        <div className="space-y-2.5">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada pengeluaran yang dicatat.
            </div>
          ) : (
            expenses.map((exp) => {
              const Icon = getCategoryIcon(exp.category);
              return (
                <div
                  key={exp.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-rose-200 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-100/70 flex items-center justify-center text-rose-800 flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#831843]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {exp.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800">
                          {exp.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{exp.date}</span>
                        <span>•</span>
                        <span>{exp.time}</span>
                        {exp.notes && (
                          <>
                            <span>•</span>
                            <span className="italic truncate text-slate-500">{exp.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-display font-bold text-base text-rose-950">
                        - Rp {exp.amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Catat Pengeluaran Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Pengeluaran</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Makan Siang Kantin JICA / Cetak Modul"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nominal (Rupiah)</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Pengeluaran</label>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Beli bareng temen lab..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
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
