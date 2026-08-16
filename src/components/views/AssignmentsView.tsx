import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Filter, 
  Sparkles,
  Tag,
  ListTodo,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  Calendar,
  ArrowUpDown,
  CalendarClock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, AssignmentTask, TaskTypeConfig } from '../../types';
import { CustomSelect, CustomSelectOption } from '../common/CustomSelect';

export const AssignmentsView: React.FC = () => {
  const { 
    assignments, 
    courses, 
    taskTypes,
    addTaskType,
    deleteTaskType,
    resetTaskTypesToDefault,
    addAssignment, 
    toggleAssignment, 
    toggleSubtask,
    deleteAssignment,
    resetAssignmentsToDefault
  } = useApp();

  const [selectedTypeId, setSelectedTypeId] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Belum' | 'Selesai'>('Semua');
  const [sortOption, setSortOption] = useState<'terdekat' | 'terjauh' | 'prioritas' | 'terbaru'>('terdekat');
  const [dateFilter, setDateFilter] = useState<'semua' | 'hari-ini' | 'pra-acara' | 'pelaksanaan' | 'pasca-acara'>('semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTypeManagerModal, setShowTypeManagerModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<AssignmentTask | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<TaskTypeConfig | null>(null);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);

  // Form State for Adding Task
  const [title, setTitle] = useState('');
  const [chosenTypeId, setChosenTypeId] = useState(taskTypes[0]?.id || 'type-laptrak');
  const [course, setCourse] = useState(courses[0]?.name || 'KIMIA DASAR 1');
  const [deadline, setDeadline] = useState('Besok, 23:59');
  const [priority, setPriority] = useState<TaskPriority>('Tinggi');
  const [notes, setNotes] = useState('');
  const [subtasksInput, setSubtasksInput] = useState<string[]>(['']);

  // Form State for Adding New Task Type
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#831843');
  const [newTypeBg, setNewTypeBg] = useState('#ffe4e6');
  const [newTypeDesc, setNewTypeDesc] = useState('');

  const completedCount = assignments.filter((t) => t.isDone).length;
  const totalCount = assignments.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const colorPresets = [
    { name: 'Rose', color: '#831843', bg: '#ffe4e6' },
    { name: 'Sky Blue', color: '#0369a1', bg: '#e0f2fe' },
    { name: 'Emerald', color: '#047857', bg: '#d1fae5' },
    { name: 'Amber', color: '#b45309', bg: '#fef3c7' },
    { name: 'Purple', color: '#6b21a8', bg: '#f3e8ff' },
    { name: 'Crimson', color: '#be123c', bg: '#ffe4e6' }
  ];

  const handleAddSubtaskField = () => {
    setSubtasksInput([...subtasksInput, '']);
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtasksInput];
    updated[index] = val;
    setSubtasksInput(updated);
  };

  const handleRemoveSubtaskField = (index: number) => {
    setSubtasksInput(subtasksInput.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedType = taskTypes.find((t) => t.id === chosenTypeId);
    const categoryName = matchedType ? matchedType.name : 'Tugas';

    const cleanSubtasks = subtasksInput
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: s.trim(),
        isDone: false
      }));

    addAssignment({
      title: title.trim(),
      typeId: chosenTypeId,
      categoryName,
      course,
      deadline,
      priority,
      notes: notes.trim() ? notes.trim() : undefined,
      subtasks: cleanSubtasks
    });

    setTitle('');
    setNotes('');
    setSubtasksInput(['']);
    setShowAddModal(false);
  };

  const handleCreateTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    addTaskType(newTypeName.trim(), newTypeColor, newTypeBg, newTypeDesc.trim() || undefined);
    setNewTypeName('');
    setNewTypeDesc('');
    setShowTypeManagerModal(false);
  };

  const parseDeadlineToTimestamp = (deadlineStr: string): number => {
    if (!deadlineStr) return Infinity;
    const str = deadlineStr.toLowerCase().trim();

    const monthMap: Record<string, number> = {
      'januari': 0, 'jan': 0,
      'februari': 1, 'feb': 1,
      'maret': 2, 'mar': 2,
      'april': 3, 'apr': 3,
      'mei': 4,
      'juni': 5, 'jun': 5,
      'juli': 6, 'jul': 6,
      'agustus': 7, 'ags': 7, 'agu': 7,
      'september': 8, 'sep': 8,
      'oktober': 9, 'okt': 9,
      'november': 10, 'nov': 10,
      'desember': 11, 'des': 11
    };

    const match = str.match(/(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2];
      const year = match[3] ? parseInt(match[3], 10) : 2026;
      
      if (monthMap[monthName] !== undefined) {
        const month = monthMap[monthName];
        const timeMatch = str.match(/(\d{1,2})[:.](\d{2})/);
        const hours = timeMatch ? parseInt(timeMatch[1], 10) : 23;
        const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 59;
        return new Date(year, month, day, hours, minutes).getTime();
      }
    }

    const isoTime = Date.parse(deadlineStr);
    if (!isNaN(isoTime)) return isoTime;

    if (str.includes('hari ini')) return new Date(2026, 7, 16, 23, 59).getTime();
    if (str.includes('besok')) return new Date(2026, 7, 17, 23, 59).getTime();
    if (str.includes('lusa')) return new Date(2026, 7, 18, 23, 59).getTime();

    return Infinity;
  };

  const filteredTasks = assignments
    .filter((task) => {
      // 1. Filter by category / type
      if (selectedTypeId !== 'Semua' && task.typeId !== selectedTypeId) {
        return false;
      }
      // 2. Filter by status
      if (filterStatus === 'Belum' && task.isDone) return false;
      if (filterStatus === 'Selesai' && !task.isDone) return false;

      // 3. Filter by date category
      if (dateFilter !== 'semua') {
        const ts = parseDeadlineToTimestamp(task.deadline);
        const day16 = new Date(2026, 7, 16, 23, 59, 59).getTime();
        const day18 = new Date(2026, 7, 18, 23, 59, 59).getTime();
        const day20 = new Date(2026, 7, 20, 0, 0, 0).getTime();

        if (dateFilter === 'hari-ini') {
          const isDay16 = task.deadline.toLowerCase().includes('16 agustus') || ts <= day16;
          if (!isDay16) return false;
        } else if (dateFilter === 'pra-acara') {
          const isPra = ts <= day18 || task.deadline.toLowerCase().includes('16 agustus') || task.deadline.toLowerCase().includes('17 agustus') || task.deadline.toLowerCase().includes('18 agustus') || task.deadline.toLowerCase().includes('h-1');
          if (!isPra) return false;
        } else if (dateFilter === 'pelaksanaan') {
          const isPelaksanaan = task.deadline.toLowerCase().includes('18 agustus') || task.deadline.toLowerCase().includes('19 agustus') || task.deadline.toLowerCase().includes('20 agustus') || task.deadline.toLowerCase().includes('21 agustus') || task.deadline.toLowerCase().includes('day 1') || task.deadline.toLowerCase().includes('day 3') || task.deadline.toLowerCase().includes('day 4');
          if (!isPelaksanaan) return false;
        } else if (dateFilter === 'pasca-acara') {
          const isPasca = ts >= day20 || task.deadline.toLowerCase().includes('20 agustus') || task.deadline.toLowerCase().includes('21 agustus') || task.deadline.toLowerCase().includes('22 agustus') || task.deadline.toLowerCase().includes('h+1') || task.deadline.toLowerCase().includes('h+2') || task.deadline.toLowerCase().includes('h+3');
          if (!isPasca) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'terdekat') {
        const timeA = parseDeadlineToTimestamp(a.deadline);
        const timeB = parseDeadlineToTimestamp(b.deadline);
        if (timeA !== timeB) return timeA - timeB;
        return 0;
      }
      if (sortOption === 'terjauh') {
        const timeA = parseDeadlineToTimestamp(a.deadline);
        const timeB = parseDeadlineToTimestamp(b.deadline);
        if (timeA !== timeB) return timeB - timeA;
        return 0;
      }
      if (sortOption === 'prioritas') {
        const priorityWeight = { 'Tinggi': 3, 'Sedang': 2, 'Santai': 1 };
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        if (weightA !== weightB) return weightB - weightA;
        return parseDeadlineToTimestamp(a.deadline) - parseDeadlineToTimestamp(b.deadline);
      }
      if (sortOption === 'terbaru') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

  const getPriorityBadgeClass = (p: TaskPriority) => {
    switch (p) {
      case 'Tinggi':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'Sedang':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Santai':
      default:
        return 'bg-emerald-100 text-emerald-950 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header & Type Manager Banner */}
      <section className="bg-white rounded-3xl border border-rose-100/90 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0">
              <CheckSquare className="w-6 h-6 text-[#831843]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                Matriks Tugas & Pengingat
              </h2>
              <p className="text-xs text-slate-500">
                Kelola jenis tugas, laptrak, pengingat kosan, dan rencana kuliah UPI
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowRestoreConfirmModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold transition-all cursor-pointer"
              title="Pulihkan seluruh daftar tugas resmi MOKA-KU UPI & FPMIPA"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Pulihkan Tugas MOKA-KU</span>
              <span className="sm:hidden">Pulihkan</span>
            </button>
            <button
              onClick={() => setShowTypeManagerModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Kelola Kategori</span>
            </button>
            <button
              id="add-assignment-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#831843] flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span>Progress Penyelesaian</span>
            </span>
            <span className="font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-lg text-xs whitespace-nowrap">
              {progressPercent}% Selesai
            </span>
          </div>
          <div className="w-full h-2.5 bg-rose-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-700 to-[#831843] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Controls (Clean Custom Dropdowns + Quick Date Pills) */}
        <div className="pt-4 border-t border-slate-100 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 1. Category / Type Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                <span>Kategori Tugas:</span>
              </label>
              <CustomSelect
                value={selectedTypeId}
                onChange={setSelectedTypeId}
                options={[
                  { value: 'Semua', label: 'Semua Kategori', count: assignments.length },
                  ...taskTypes.map((type) => ({
                    value: type.id,
                    label: type.name,
                    color: type.color,
                    count: `${assignments.filter((a) => a.typeId === type.id).length}`
                  }))
                ]}
                ariaLabel="Pilih Tipe Tugas"
              />
            </div>

            {/* 2. Status Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                <span>Status Pengerjaan:</span>
              </label>
              <CustomSelect
                value={filterStatus}
                onChange={(val) => setFilterStatus(val as 'Semua' | 'Belum' | 'Selesai')}
                options={[
                  { value: 'Semua', label: 'Semua Status', count: assignments.length },
                  { 
                    value: 'Belum', 
                    label: 'Belum Selesai', 
                    count: assignments.filter((a) => !a.isDone).length,
                    color: '#e11d48'
                  },
                  { 
                    value: 'Selesai', 
                    label: 'Sudah Selesai', 
                    count: assignments.filter((a) => a.isDone).length,
                    color: '#059669'
                  }
                ]}
                ariaLabel="Pilih Status Tugas"
              />
            </div>

            {/* 3. Sort Order (Nearest deadline, Farthest, Priority, Newest) */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
                <span>Urutan Tanggal & Deadline:</span>
              </label>
              <CustomSelect
                value={sortOption}
                onChange={(val) => setSortOption(val as any)}
                options={[
                  { value: 'terdekat', label: '📅 Deadline Terdekat (Segera)', color: '#be123c' },
                  { value: 'terjauh', label: '🗓️ Deadline Terjauh', color: '#0284c7' },
                  { value: 'prioritas', label: '⚡ Prioritas Tertinggi', color: '#d97706' },
                  { value: 'terbaru', label: '✨ Baru Ditambahkan', color: '#7c3aed' }
                ]}
                ariaLabel="Urutkan Tanggal"
              />
            </div>
          </div>

          {/* Quick Date Range Pill Filter */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-rose-800" />
              <span>Jadwal:</span>
            </span>

            {[
              { id: 'semua', label: 'Semua Tanggal' },
              { id: 'hari-ini', label: '🔴 Deadline Hari Ini (16 Ags)' },
              { id: 'pra-acara', label: '🟡 Pra-Acara (16-18 Ags)' },
              { id: 'pelaksanaan', label: '🔵 Pelaksanaan (18-21 Ags)' },
              { id: 'pasca-acara', label: '🟢 Pasca & Pengganti' }
            ].map((tab) => {
              const active = dateFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDateFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-900 text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-rose-200 text-slate-500 space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="font-display font-semibold text-slate-800">Tidak ada tugas pada filter ini</p>
            <p className="text-xs text-slate-400">
              Kamu bisa membuat tugas baru, mengganti filter tipe tugas, atau memulihkan daftar tugas MOKA-KU.
            </p>
            <button
              onClick={() => setShowRestoreConfirmModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Pulihkan 14 Tugas MOKA-KU UPI & FPMIPA</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const matchedType = taskTypes.find((t) => t.id === task.typeId);
            const typeColor = matchedType?.color || '#831843';
            const isTodayDeadline = task.deadline.toLowerCase().includes('16 agustus') || task.deadline.toLowerCase().includes('hari ini');
            const isTomorrowDeadline = task.deadline.toLowerCase().includes('17 agustus') || task.deadline.toLowerCase().includes('18 agustus') || task.deadline.toLowerCase().includes('besok');

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-3 group ${
                  task.isDone
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : isTodayDeadline
                    ? 'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/40 border-rose-300 shadow-xs'
                    : 'bg-white border-rose-100/90 hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Checkbox Trigger */}
                  <button
                    id={`task-toggle-${task.id}`}
                    onClick={() => toggleAssignment(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0 cursor-pointer"
                    aria-label="Tandai Selesai"
                  >
                    {task.isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-rose-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-rose-400" />
                    )}
                  </button>

                  {/* Task Header & Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span 
                        style={{ color: typeColor, borderColor: `${typeColor}40`, backgroundColor: `${typeColor}15` }}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border"
                      >
                        {task.categoryName || matchedType?.name || 'Tugas'}
                      </span>

                      {task.course && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {task.course}
                        </span>
                      )}

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Deadline Urgency Badge */}
                      {!task.isDone && isTodayDeadline && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse flex items-center gap-1 shadow-2xs">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Deadline Hari Ini!</span>
                        </span>
                      )}

                      {!task.isDone && !isTodayDeadline && isTomorrowDeadline && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-700" />
                          <span>Segera</span>
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm sm:text-base font-semibold ${task.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>

                    {task.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
                        {task.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-rose-900/80 font-medium">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Deadline: {task.deadline}</span>
                    </div>
                  </div>

                  {/* Delete Button with Confirmation */}
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                    title="Hapus Tugas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtasks Checklist if exists */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="ml-9 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Langkah Pengerjaan ({task.subtasks.filter(s => s.isDone).length}/{task.subtasks.length}):
                    </div>
                    <div className="space-y-1.5">
                      {task.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => toggleSubtask(task.id, sub.id)}
                          className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-rose-900"
                        >
                          {sub.isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          )}
                          <span className={sub.isDone ? 'line-through text-slate-400' : ''}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Add Task Modal (Select Type First) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-[#831843] to-[#701a75] text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-base sm:text-lg">Catat Tugas / Pengingat Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white cursor-pointer text-lg">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* 1. Select Task Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  1. Pilih Tipe Tugas / Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {taskTypes.map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setChosenTypeId(type.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        chosenTypeId === type.id
                          ? 'border-rose-500 bg-rose-50/80 font-bold shadow-2xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-1.5" style={{ color: type.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                        <span className="truncate font-semibold">{type.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Task Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  2. Judul Tugas / Pengingat
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Laptrak Kimia Dasar Percobaan 4: Kinetika Reaksi"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* 3. Course & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mata Kuliah (Opsional)</label>
                  <CustomSelect
                    value={course}
                    onChange={setCourse}
                    options={[
                      ...courses.map((c) => ({
                        value: c.name,
                        label: c.name,
                        count: `${c.sks} SKS`
                      })),
                      { value: 'Kegiatan Mandiri', label: 'Kegiatan Mandiri / Lainnya' }
                    ]}
                    icon={BookOpen}
                    ariaLabel="Pilih Mata Kuliah"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deadline / Waktu</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Besok 23:59 / Kamis Sore"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* 4. Priority */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tingkat Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tinggi', 'Sedang', 'Santai'] as TaskPriority[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        priority === p ? getPriorityBadgeClass(p) + ' shadow-2xs ring-1 ring-rose-500' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Subtasks / Breakdown Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Langkah Pengerjaan (Subtasks Checklist)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubtaskField}
                    className="text-[11px] font-bold text-rose-800 hover:underline cursor-pointer"
                  >
                    Tambah Langkah
                  </button>
                </div>
                <div className="space-y-2">
                  {subtasksInput.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                        placeholder={`Langkah ${idx + 1}: misalnya Buat Grafik Titrasi`}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                      {subtasksInput.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtaskField(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Perlu tanda tangan asisten lab sebelum jam 12 siang..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Task Type Management */}
      {showTypeManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-200" />
                <h3 className="font-display font-bold text-base">Kelola Kategori / Tipe Tugas</h3>
              </div>
              <button onClick={() => setShowTypeManagerModal(false)} className="text-white/80 hover:text-white cursor-pointer text-lg">✕</button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Form Add New Task Type */}
              <form onSubmit={handleCreateTypeSubmit} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Buat Tipe Tugas Baru
                </span>
                <div>
                  <input
                    type="text"
                    required
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Nama Tipe (contoh: Proyek Kuis, Tugas Kelompok, dll)"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newTypeDesc}
                    onChange={(e) => setNewTypeDesc(e.target.value)}
                    placeholder="Deskripsi singkat tipe tugas..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Pilih Warna Aksen:</label>
                  <div className="flex items-center gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => {
                          setNewTypeColor(preset.color);
                          setNewTypeBg(preset.bg);
                        }}
                        style={{ backgroundColor: preset.color }}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                          newTypeColor === preset.color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                        }`}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-2xs"
                >
                  Tambah Tipe Tugas
                </button>
              </form>

              {/* List of existing task types */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Daftar Tipe Tugas Aktif:
                </span>
                {taskTypes.map((type) => (
                  <div
                    key={type.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{type.name}</p>
                        {type.description && (
                          <p className="text-[11px] text-slate-500 truncate">{type.description}</p>
                        )}
                      </div>
                    </div>

                    {taskTypes.length > 1 && (
                      <button
                        onClick={() => setTypeToDelete(type)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer flex-shrink-0"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Restore default types button */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">Kategori hilang atau salah hapus?</span>
                <button
                  type="button"
                  onClick={() => resetTaskTypesToDefault()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pulihkan Kategori Default</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Delete Task Type (Label) */}
      {typeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900">
                Hapus Kategori "{typeToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kategori ini akan dihapus dari daftar label. Tugas yang sudah ada dengan kategori ini tidak akan terhapus.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setTypeToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteTaskType(typeToDelete.id);
                  setTypeToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Delete Task */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900 line-clamp-2">
                Hapus Tugas "{taskToDelete.title}"?
              </h3>
              <p className="text-xs text-slate-500">
                Tugas ini akan dihapus permanen dari daftar tugas kamu.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAssignment(taskToDelete.id);
                  setTaskToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Restore MOKA-KU Tasks */}
      {showRestoreConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900">
                Pulihkan Semua Tugas MOKA-KU UPI & FPMIPA?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan memulihkan seluruh 14 daftar tugas resmi MOKA-KU UPI (Univ) & MOKA-KU FPMIPA 2026 beserta seluruh kategori labelnya.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRestoreConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetTaskTypesToDefault();
                  resetAssignmentsToDefault();
                  setShowRestoreConfirmModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
              >
                Ya, Pulihkan Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
