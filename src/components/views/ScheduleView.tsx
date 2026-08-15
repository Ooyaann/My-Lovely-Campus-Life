import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  BookOpen, 
  GraduationCap, 
  Filter, 
  Info,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseSchedule } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

export const ScheduleView: React.FC = () => {
  const { courses, addCourse, deleteCourse } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<CourseSchedule | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    day: 'Senin' as CourseSchedule['day'],
    time: '08:00 - 10:00',
    sks: 2,
    category: '[Teori]' as CourseSchedule['category'],
    room: 'Gedung JICA FPMIPA UPI',
    lecturer: 'Dosen Pengampu',
    notes: ''
  });

  const daysList = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const filteredCourses = selectedDay === 'Semua' 
    ? courses 
    : courses.filter((c) => c.day === selectedDay);

  const totalSKS = courses.reduce((sum, c) => sum + c.sks, 0);

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case '[Pedagogi]':
        return 'bg-blue-100/90 text-blue-900 border-blue-200';
      case '[Teori/Lab]':
        return 'bg-emerald-100/90 text-emerald-950 border-emerald-200';
      case '[Teori]':
        return 'bg-pink-100/90 text-pink-900 border-pink-200';
      case '[Umum]':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addCourse(formData);
    setFormData({
      name: '',
      day: 'Senin',
      time: '08:00 - 10:00',
      sks: 2,
      category: '[Teori]',
      room: 'Gedung JICA FPMIPA UPI',
      lecturer: 'Dosen Pengampu',
      notes: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Overview Header */}
      <section className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-rose-100/90 border border-rose-200/60 flex items-center justify-center text-rose-800 flex-shrink-0 shadow-2xs">
              <CalendarIcon className="w-5 h-5 text-[#831843]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Jadwal Kuliah Resmi (KRS UPI)
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-[#831843] text-[11px] font-bold whitespace-nowrap flex-shrink-0 border border-rose-200/50">
                  Semester Ganjil
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:truncate">
                Program Studi S-1 Pendidikan Kimia FPMIPA Universitas Pendidikan Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Beban</span>
              <span className="font-display font-bold text-lg text-[#831843]">{totalSKS} SKS</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          </div>
        </div>

        {/* Day Filter Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rose-900" />
              <span>Filter Hari Kuliah:</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center border ${
                  selectedDay === day
                    ? 'bg-rose-900 text-white border-rose-900 shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-rose-50 hover:text-rose-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourseDetail(course)}
            className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Header: Course Code, SKS & Category Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {course.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    • {course.sks} SKS
                  </span>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${getCategoryBadgeClass(course.category)}`}>
                  {course.category}
                </span>
              </div>

              {/* Course Name */}
              <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#831843] transition-colors leading-snug">
                {course.name}
              </h3>

              {/* Timing & Day */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-xl">
                <Clock className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-bold text-[#831843]">{course.day}</span>
                <span>•</span>
                <span>{course.time} WIB</span>
              </div>

              {/* Room & Building */}
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{course.room}</span>
              </div>

              {/* Lecturer */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">{course.lecturer}</span>
              </div>
            </div>

            {/* Bottom info link */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-rose-700">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Klik untuk lihat detail & catatan</span>
              </span>
              <span className="font-semibold">Buka &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-scale-up">
            <div className="p-6 bg-gradient-to-r from-rose-900 to-rose-800 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-lg text-rose-100">
                  {selectedCourseDetail.id}
                </span>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCourseDetail.sks} SKS
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {selectedCourseDetail.name}
              </h3>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-rose-700" />
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Hari & Waktu</div>
                    <div className="font-semibold text-slate-900">{selectedCourseDetail.day}, {selectedCourseDetail.time} WIB</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-rose-700" />
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Ruangan & Gedung</div>
                    <div className="font-semibold text-slate-900">{selectedCourseDetail.room}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-rose-700" />
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Dosen Pengampu</div>
                    <div className="font-semibold text-slate-900">{selectedCourseDetail.lecturer}</div>
                  </div>
                </div>
              </div>

              {selectedCourseDetail.notes && (
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-rose-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#831843]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Catatan Kuliah / Silabus:</span>
                  </div>
                  <p>{selectedCourseDetail.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    deleteCourse(selectedCourseDetail.id);
                    setSelectedCourseDetail(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Jadwal</span>
                </button>
                <button
                  onClick={() => setSelectedCourseDetail(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Tambah Jadwal Mata Kuliah</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Mata Kuliah / Praktikum</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kimia Organik 1 / Asistensi Lab"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hari Kuliah</label>
                  <CustomSelect
                    value={formData.day}
                    onChange={(val) => setFormData({ ...formData, day: val as CourseSchedule['day'] })}
                    options={[
                      { value: 'Senin', label: 'Senin' },
                      { value: 'Selasa', label: 'Selasa' },
                      { value: 'Rabu', label: 'Rabu' },
                      { value: 'Kamis', label: 'Kamis' },
                      { value: 'Jumat', label: 'Jumat' },
                      { value: 'Sabtu', label: 'Sabtu' }
                    ]}
                    ariaLabel="Pilih Hari Kuliah"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Waktu (Jam)</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="07:00 - 09:30"
                    className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-rose-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jumlah SKS</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.sks}
                    onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value, 10) || 2 })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-rose-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val as CourseSchedule['category'] })}
                    options={[
                      { value: '[Teori]', label: '[Teori]', color: '#0284c7' },
                      { value: '[Teori/Lab]', label: '[Teori/Lab]', color: '#881337' },
                      { value: '[Pedagogi]', label: '[Pedagogi]', color: '#059669' },
                      { value: '[Umum]', label: '[Umum]', color: '#7c3aed' }
                    ]}
                    ariaLabel="Pilih Kategori Mata Kuliah"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ruangan & Gedung</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Gedung JICA FPMIPA A Lt.3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dosen Pengampu</label>
                <input
                  type="text"
                  value={formData.lecturer}
                  onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                  placeholder="Nama Dosen beserta Gelar"
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
