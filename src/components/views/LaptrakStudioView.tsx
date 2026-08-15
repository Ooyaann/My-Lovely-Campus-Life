import React, { useState } from 'react';
import { 
  FlaskConical, 
  Copy, 
  Check, 
  Calculator, 
  ShieldAlert, 
  Layers, 
  Flame, 
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Search,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';
import { GHS_SAFETY_DATA } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { LaptrakTemplate, LaptrakSection } from '../../types';

export const LaptrakStudioView: React.FC = () => {
  const { 
    laptrakTemplates, 
    addLaptrakTemplate, 
    updateLaptrakTemplate, 
    deleteLaptrakTemplate, 
    resetLaptrakTemplates,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'format' | 'kalkulator' | 'keselamatan'>('format');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    laptrakTemplates[0]?.id || 'tpl-upi-standard'
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  // Search in GHS
  const [ghsSearch, setGhsSearch] = useState('');

  // Modal State for Adding / Editing Template
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [modalTag, setModalTag] = useState('');
  const [modalSections, setModalSections] = useState<LaptrakSection[]>([
    { step: 1, name: 'Cover / Judul', desc: 'Identitas mahasiswa dan judul praktikum', template: 'JUDUL PRAKTIKUM\nNama: [Nama]\nNIM: [NIM]' },
    { step: 2, name: 'Tujuan Percobaan', desc: 'Tujuan spesifik praktikum', template: '1. Memahami prinsip...\n2. Menentukan kadar...' },
    { step: 3, name: 'Dasar Teori', desc: 'Konsep ilmiah dan persamaan reaksi', template: 'Dasar teori yang mendasari percobaan ini...' },
    { step: 4, name: 'Alat & Bahan', desc: 'Daftar alat gelas dan bahan kimia', template: 'Alat:\nBahan:' },
    { step: 5, name: 'Prosedur Kerja', desc: 'Langkah kerja sistematis', template: '1. Timbang zat...\n2. Larutkan dalam...' },
    { step: 6, name: 'Data Pengamatan', desc: 'Tabel data kuantitatif & kualitatif', template: '| No | Percobaan | Hasil |\n|---|---|---|' },
    { step: 7, name: 'Pembahasan', desc: 'Analisis fenomena dan perhitungan', template: 'Pembahasan hasil pengamatan...' },
    { step: 8, name: 'Kesimpulan', desc: 'Kesimpulan ringkas yang menjawab tujuan', template: 'Dapat disimpulkan bahwa...' },
    { step: 9, name: 'Daftar Pustaka', desc: 'Rujukan pustaka ilmiah', template: 'Daftar Pustaka...' }
  ]);

  // Dilution Calculator State (V1 x M1 = V2 x M2)
  const [v1, setV1] = useState<string>('');
  const [m1, setM1] = useState<string>('12'); // e.g. HCl pekat 12 M
  const [v2, setV2] = useState<string>('100'); // target 100 mL
  const [m2, setM2] = useState<string>('0.1'); // target 0.1 M
  const [dilutionTarget, setDilutionTarget] = useState<'V1' | 'V2'>('V1');

  // Molarity from Mass Calculator (M = (gram / Mr) * (1000 / mL))
  const [massGram, setMassGram] = useState<string>('4.0'); // e.g. NaOH 4g
  const [mrValue, setMrValue] = useState<string>('40.0'); // NaOH Mr = 40
  const [volMl, setVolMl] = useState<string>('1000'); // 1000 mL

  const activeTemplate = laptrakTemplates.find(t => t.id === selectedTemplateId) || laptrakTemplates[0];

  const copyToClipboard = (text: string, index: number, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast(`Format bagian "${label}" berhasil disalin! 📋`);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const copyAllSections = () => {
    if (!activeTemplate) return;
    const fullTemplate = activeTemplate.sections
      .map(f => `=== BAGIAN ${f.step}: ${f.name.toUpperCase()} ===\n${f.template}\n\n`)
      .join('\n');
    navigator.clipboard.writeText(fullTemplate);
    setIsCopiedAll(true);
    showToast(`Seluruh template "${activeTemplate.title}" berhasil disalin lengkap!`);
    setTimeout(() => setIsCopiedAll(false), 2500);
  };

  const openCreateModal = () => {
    setEditingTemplateId(null);
    setModalTitle('');
    setModalSubtitle('');
    setModalTag('Kustom');
    setModalSections([
      { step: 1, name: 'Cover / Judul Praktikum', desc: 'Identitas mahasiswa dan judul', template: 'JUDUL PRAKTIKUM\nNama: [Nama Sayang]\nNIM: [NIM Mahasiswi UPI]\nKelas: Pendidikan Kimia 2026' },
      { step: 2, name: 'Tujuan Percobaan', desc: 'Poin utama yang ingin dicapai', template: '1. Mempelajari...\n2. Mengukur...' },
      { step: 3, name: 'Dasar Teori & Reaksi', desc: 'Penjelasan konsep ilmiah', template: 'Dasar teori praktikum...' },
      { step: 4, name: 'Alat & Bahan', desc: 'Spesifikasi alat gelas & reagen', template: 'Alat:\nBahan:' },
      { step: 5, name: 'Prosedur & Bagan Alir', desc: 'Langkah kerja kalimat pasif', template: '1. Zat ditimbang...\n2. Larutan dipanaskan...' },
      { step: 6, name: 'Data Pengamatan', desc: 'Tabel hasil pengukuran', template: '| No | Parameter | Nilai |\n|---|---|---|' },
      { step: 7, name: 'Pengolahan Data & Pembahasan', desc: 'Kalkulasi & analisis ilmiah', template: 'Kalkulasi & Pembahasan...' },
      { step: 8, name: 'Kesimpulan', desc: 'Jawaban atas tujuan praktikum', template: 'Berdasarkan percobaan, disimpulkan...' },
      { step: 9, name: 'Daftar Pustaka', desc: 'Buku teks dan jurnal rujukan', template: 'Daftar Pustaka...' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (tpl: LaptrakTemplate) => {
    setEditingTemplateId(tpl.id);
    setModalTitle(tpl.title);
    setModalSubtitle(tpl.subtitle);
    setModalTag(tpl.tag);
    setModalSections([...tpl.sections]);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      showToast('Mohon masukkan nama template laptrak.');
      return;
    }

    if (editingTemplateId) {
      updateLaptrakTemplate(editingTemplateId, {
        title: modalTitle.trim(),
        subtitle: modalSubtitle.trim() || 'Template kustom praktikum kimia',
        tag: modalTag.trim() || 'Kustom',
        sections: modalSections
      });
    } else {
      addLaptrakTemplate({
        title: modalTitle.trim(),
        subtitle: modalSubtitle.trim() || 'Template kustom praktikum kimia',
        tag: modalTag.trim() || 'Kustom',
        sections: modalSections
      });
    }

    setIsModalOpen(false);
  };

  const handleAddSectionToModal = () => {
    const nextStep = modalSections.length + 1;
    setModalSections([
      ...modalSections,
      {
        step: nextStep,
        name: `Bagian ${nextStep}: Tambahan`,
        desc: 'Deskripsi bagian tambahan...',
        template: `Isi template bagian ${nextStep}...`
      }
    ]);
  };

  const handleRemoveSectionFromModal = (index: number) => {
    if (modalSections.length <= 1) {
      showToast('Minimal harus ada 1 bagian format.');
      return;
    }
    const updated = modalSections.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, step: idx + 1 }));
    setModalSections(updated);
  };

  const handleSectionChange = (index: number, field: keyof LaptrakSection, val: string | number) => {
    const updated = [...modalSections];
    updated[index] = { ...updated[index], [field]: val };
    setModalSections(updated);
  };

  // Compute dilution
  const calculateDilution = (): string => {
    const nV1 = parseFloat(v1);
    const nM1 = parseFloat(m1);
    const nV2 = parseFloat(v2);
    const nM2 = parseFloat(m2);

    if (dilutionTarget === 'V1') {
      if (nM1 && nV2 && nM2) {
        return `${((nV2 * nM2) / nM1).toFixed(3)} mL`;
      }
    } else if (dilutionTarget === 'V2') {
      if (nV1 && nM1 && nM2) {
        return `${((nV1 * nM1) / nM2).toFixed(3)} mL`;
      }
    }
    return 'Lengkapi angka di atas';
  };

  // Compute Molarity
  const calculateMolarity = (): string => {
    const gram = parseFloat(massGram);
    const mr = parseFloat(mrValue);
    const ml = parseFloat(volMl);
    if (gram && mr && ml) {
      const molarity = (gram / mr) * (1000 / ml);
      return `${molarity.toFixed(4)} M (mol/L)`;
    }
    return '0.00 M';
  };

  const filteredGhs = GHS_SAFETY_DATA.filter(g => 
    g.symbol.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.code.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.risk.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.examples.toLowerCase().includes(ghsSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold whitespace-nowrap">
              <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Studio & Format Laptrak Kimia UPI</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Template Laporan & Kalkulator Lab
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 max-w-xl leading-relaxed">
              Atur template laptrak bebas sesuai kebutuhan (Template 1, 2, 3 atau kustom sendiri), salin sistematika format praktikum, dan hitung larutan kimia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#831843] hover:bg-rose-50 text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>+ Buat Template Sendiri</span>
            </button>

            <button
              onClick={copyAllSections}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-800/80 hover:bg-rose-700 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {isCopiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span className="text-emerald-300">Tersalin Lengkap!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-300 flex-shrink-0" />
                  <span>Salin Seluruh Template</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub Navigation: Clean Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('format')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'format'
                ? 'bg-white text-[#831843] shadow-xs'
                : 'bg-white/10 text-rose-200 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Pilihan Template Laptrak</span>
          </button>

          <button
            onClick={() => setActiveTab('kalkulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'kalkulator'
                ? 'bg-white text-[#831843] shadow-xs'
                : 'bg-white/10 text-rose-200 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Kalkulator Kimia & Molaritas</span>
          </button>

          <button
            onClick={() => setActiveTab('keselamatan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'keselamatan'
                ? 'bg-white text-[#831843] shadow-xs'
                : 'bg-white/10 text-rose-200 hover:bg-white/20'
            }`}
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Simbol GHS & K3 Lab</span>
          </button>
        </div>
      </section>

      {/* 1. Format & Template Management Tab */}
      {activeTab === 'format' && (
        <div className="space-y-6">
          {/* Template Selector Card */}
          <div className="bg-white rounded-3xl border border-rose-100/80 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Daftar Template Tersedia
                </span>
                <p className="text-xs text-slate-500">
                  Pilih format laptrak atau buat template kustom baru:
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+ Template Baru</span>
              </button>
            </div>

            {/* Non-scrolling Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {laptrakTemplates.map((tpl) => {
                const isSelected = tpl.id === (activeTemplate?.id || selectedTemplateId);
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 border text-left ${
                      isSelected
                        ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-rose-200' : 'text-slate-400'}`} />
                      <span className="truncate">{tpl.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex-shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tpl.tag || `${tpl.sections.length} Bab`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Template Header Info */}
          {activeTemplate && (
            <div className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-lg whitespace-nowrap flex-shrink-0">
                    {activeTemplate.tag || 'Template'}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {activeTemplate.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  {activeTemplate.subtitle} ({activeTemplate.sections.length} Bagian / Bab)
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={copyAllSections}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Salin Semua</span>
                </button>

                {activeTemplate.isCustom && (
                  <>
                    <button
                      onClick={() => openEditModal(activeTemplate)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-all cursor-pointer flex-shrink-0"
                      title="Edit Template Ini"
                    >
                      <Edit3 className="w-4 h-4 flex-shrink-0" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus template "${activeTemplate.title}"?`)) {
                          deleteLaptrakTemplate(activeTemplate.id);
                          setSelectedTemplateId(laptrakTemplates[0]?.id || 'tpl-upi-standard');
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-all cursor-pointer flex-shrink-0"
                      title="Hapus Template Ini"
                    >
                      <Trash2 className="w-4 h-4 flex-shrink-0" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTemplate?.sections.map((item, idx) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-xs flex flex-col justify-between hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 bg-rose-100/80 px-2.5 py-0.5 rounded-lg whitespace-nowrap flex-shrink-0">
                      Bagian {item.step}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.template, idx, item.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 text-xs whitespace-nowrap flex-shrink-0 font-medium"
                      title="Salin Bagian Ini"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-600 font-bold">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <pre className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-28 border border-slate-100">
                    {item.template}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Kalkulator Kimia Tab */}
      {activeTab === 'kalkulator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dilution Calculator */}
          <div className="bg-white rounded-3xl border border-rose-100/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-rose-50 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0">
                <FlaskConical className="w-5 h-5 text-rose-900" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Rumus Pengenceran Larutan
                </h3>
                <p className="text-xs font-mono text-rose-800 font-bold">
                  V₁ × M₁ = V₂ × M₂
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hitung volume larutan pekat ($V_1$) yang harus dipipet untuk membuat larutan encer ($V_2$, $M_2$).
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Konsentrasi Larutan Induk / Pekat ($M_1$) [Molar]
                </label>
                <input
                  type="number"
                  step="any"
                  value={m1}
                  onChange={(e) => setM1(e.target.value)}
                  placeholder="Contoh: 12 (untuk HCl pekat 12 M)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Volume Target ($V_2$) [mL]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={v2}
                    onChange={(e) => setV2(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Konsentrasi Target ($M_2$) [Molar]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={m2}
                    onChange={(e) => setM2(e.target.value)}
                    placeholder="0.1"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
                <span className="text-xs text-rose-900 font-bold uppercase tracking-wider block">
                  Volume Larutan Pekat yang Harus Dipipet (V₁):
                </span>
                <div className="font-display font-bold text-2xl text-rose-900">
                  {calculateDilution()}
                </div>
                <p className="text-[11px] text-slate-500">
                  Pipet volume ini lalu encerkan dengan akuades dalam labu ukur {v2} mL hingga tanda batas.
                </p>
              </div>
            </div>
          </div>

          {/* Molarity from Solid Mass Calculator */}
          <div className="bg-white rounded-3xl border border-rose-100/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-rose-50 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 flex-shrink-0">
                <Calculator className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Kalkulator Molaritas Zat Padat
                </h3>
                <p className="text-xs font-mono text-blue-800 font-bold">
                  M = (massa / Mr) × (1000 / mL)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hitung molaritas larutan yang dibuat dari penimbangan padatan (misal NaOH, NaCl, asam oksalat).
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Massa Padatan yang Ditimbang (gram)
                </label>
                <input
                  type="number"
                  step="any"
                  value={massGram}
                  onChange={(e) => setMassGram(e.target.value)}
                  placeholder="Contoh: 4.0"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Massa Molar / Mr (g/mol)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={mrValue}
                    onChange={(e) => setMrValue(e.target.value)}
                    placeholder="40 (NaOH)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Volume Labu Ukur (mL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={volMl}
                    onChange={(e) => setVolMl(e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                <span className="text-xs text-blue-900 font-bold uppercase tracking-wider block">
                  Konsentrasi Larutan (M):
                </span>
                <div className="font-display font-bold text-2xl text-blue-950">
                  {calculateMolarity()}
                </div>
                <p className="text-[11px] text-slate-500">
                  Pastikan padatan larut sempurna sebelum menepatkan meniskus air ke garis batas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Simbol Keselamatan GHS Tab */}
      {activeTab === 'keselamatan' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari simbol GHS, bahan kimia (e.g. Asam Sulfat, Etanol)..."
                value={ghsSearch}
                onChange={(e) => setGhsSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-2xl border border-rose-100 shadow-xs focus:outline-rose-500"
              />
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap self-center">
              Menampilkan {filteredGhs.length} Panduan K3
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold">Prosedur Keselamatan Kerja Laboratorium FPMIPA UPI:</span>
              <p>Selalu gunakan jas lab lengan panjang berkancing penuh, kacamata pengaman (goggles), sepatu tertutup, dan sarung tangan sesuai sifat bahan kimia yang digunakan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGhs.map((ghs) => (
              <div
                key={ghs.code}
                className="bg-white rounded-3xl border border-rose-100/80 p-5 shadow-xs space-y-3 hover:border-rose-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 whitespace-nowrap flex-shrink-0">
                    {ghs.code}
                  </span>
                  <Flame className="w-4 h-4 text-amber-600 flex-shrink-0" />
                </div>

                <h4 className="font-display font-bold text-base text-slate-900">
                  {ghs.symbol}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">Tingkat Bahaya:</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{ghs.risk}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700">Contoh Bahan Kimia:</span>
                    <p className="text-rose-900 font-medium mt-0.5">{ghs.examples}</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Tindakan Penanganan & APD:</span>
                    <p className="leading-relaxed">{ghs.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Buat / Edit Template Laptrak Kustom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-rose-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-900">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {editingTemplateId ? 'Edit Template Laptrak' : 'Buat Template Laptrak Kustom'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tentukan nama modul praktikum dan susun format bab sesuai kebutuhan dosen UPI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Template / Modul Praktikum *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="Contoh: Template 1: Kimia Anorganik & Kation"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Label Tag
                  </label>
                  <input
                    type="text"
                    value={modalTag}
                    onChange={(e) => setModalTag(e.target.value)}
                    placeholder="Contoh: Anorganik"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Deskripsi / Catatan Singkat
                </label>
                <input
                  type="text"
                  value={modalSubtitle}
                  onChange={(e) => setModalSubtitle(e.target.value)}
                  placeholder="Contoh: Format praktikum uji nyala dan pemisahan kation golongan I-V"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500"
                />
              </div>

              {/* Sections Editor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daftar Bab & Format ({modalSections.length} Bagian)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSectionToModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Bab</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {modalSections.map((sec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded-md">
                          Bab {sec.step}
                        </span>
                        <input
                          type="text"
                          value={sec.name}
                          onChange={(e) => handleSectionChange(idx, 'name', e.target.value)}
                          placeholder="Nama Bab (e.g. Tujuan Percobaan)"
                          className="flex-1 px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-200 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSectionFromModal(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                          title="Hapus Bab Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={sec.desc}
                        onChange={(e) => handleSectionChange(idx, 'desc', e.target.value)}
                        placeholder="Deskripsi singkat panduan penulisan..."
                        className="w-full px-2.5 py-1 text-[11px] bg-white rounded-lg border border-slate-200 text-slate-600"
                      />

                      <textarea
                        rows={2}
                        value={sec.template}
                        onChange={(e) => handleSectionChange(idx, 'template', e.target.value)}
                        placeholder="Contoh teks template bab ini..."
                        className="w-full p-2 text-[11px] font-mono bg-white rounded-lg border border-slate-200 text-slate-700"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-900 hover:bg-rose-800 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

