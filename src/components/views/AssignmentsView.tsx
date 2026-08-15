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
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskPriority } from '../../types';
import { CustomSelect, CustomSelectOption } from '../common/CustomSelect';

export const AssignmentsView: React.FC = () => {
  const { 
    assignments, 
    courses, 
    taskTypes,
    addTaskType,
    deleteTaskType,
    addAssignment, 
    toggleAssignment, 
    toggleSubtask,
    deleteAssignment 
  } = useApp();

  const [selectedTypeId, setSelectedTypeId] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Belum' | 'Selesai'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTypeManagerModal, setShowTypeManagerModal] = useState(false);

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

  const filteredTasks = assignments.filter((task) => {
    // Filter by type
    if (selectedTypeId !== 'Semua' && task.typeId !== selectedTypeId) {
      return false;
    }
    // Filter by status
    if (filterStatus === 'Belum' && task.isDone) return false;
    if (filterStatus === 'Selesai' && !task.isDone) return false;
    return true;
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTypeManagerModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Kelola Tipe Tugas</span>
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

        {/* Filter Controls (Clean Custom Dropdowns with floating popover menus) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
              <span>Filter Berdasarkan Tipe Tugas:</span>
            </label>
            <CustomSelect
              value={selectedTypeId}
              onChange={setSelectedTypeId}
              options={[
                { value: 'Semua', label: 'Semua Tipe Tugas', count: assignments.length },
                ...taskTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
                  color: type.color,
                  count: `${assignments.filter((a) => a.typeId === type.id).length} Tugas`
                }))
              ]}
              ariaLabel="Pilih Tipe Tugas"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-900 flex-shrink-0" />
              <span>Status Pengerjaan:</span>
            </label>
            <CustomSelect
              value={filterStatus}
              onChange={(val) => setFilterStatus(val as 'Semua' | 'Belum' | 'Selesai')}
              options={[
                { 
                  value: 'Semua', 
                  label: 'Semua Status', 
                  count: assignments.length 
                },
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
        </div>
      </section>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-rose-200 text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="font-display font-semibold text-slate-800">Tidak ada tugas pada filter ini</p>
            <p className="text-xs text-slate-400">
              Kamu bisa membuat tugas baru atau mengganti filter tipe tugas di atas.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const matchedType = taskTypes.find((t) => t.id === task.typeId);
            const typeColor = matchedType?.color || '#831843';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-3 group ${
                  task.isDone
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
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

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteAssignment(task.id)}
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
                        onClick={() => deleteTaskType(type.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer flex-shrink-0"
                        title="Hapus Tipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
