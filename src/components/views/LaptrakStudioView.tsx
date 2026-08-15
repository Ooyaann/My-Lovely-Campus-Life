import React, { useState, useEffect } from 'react';
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
  X,
  ChevronDown,
  Atom,
  Beaker,
  Scale,
  Gauge,
  ArrowRight,
  ListPlus
} from 'lucide-react';
import { GHS_SAFETY_DATA } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { LaptrakTemplate, LaptrakSection } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

interface CustomChemicalSymbol {
  id: string;
  name: string;
  symbol: string;
}

const DEFAULT_CHEMICAL_SYMBOLS = [
  {
    category: 'Subskrip (Bawah)',
    symbols: ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₊', '₋', '₍', '₎']
  },
  {
    category: 'Superskrip (Atas / Muatan)',
    symbols: ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻', '²⁺', '³⁺', '²⁻', '³⁻', '˙']
  },
  {
    category: 'Huruf Yunani (Greek)',
    symbols: ['α', 'β', 'γ', 'δ', 'Δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'ν', 'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω', 'Ω']
  },
  {
    category: 'Panah & Kesetimbangan Reaksi',
    symbols: ['→', '←', '⇌', '↔', '↑', '↓', '⇄', '⇆', '➔', '⟶', '⟵', '⟹', 'Δ', 'xrightarrow[Δ]{}']
  },
  {
    category: 'Satuan & Notasi Lab Kimia',
    symbols: ['°C', 'K', 'ΔH', 'kJ/mol', 'J/mol·K', 'atm', 'torr', 'mmHg', 'M', 'mol/L', 'm', 'N', 'g/cm³', 'ppm', 'pH', 'pOH', 'pKa', 'pKb', 'Ka', 'Kb', 'Ksp', 'Kw', 'E°', 'λ_max', 'Å']
  },
  {
    category: 'Rumus & Ion Umum',
    symbols: ['H₂O', 'H₃O⁺', 'OH⁻', 'H⁺', 'CO₂', 'NH₃', 'NH₄⁺', 'CH₄', 'C₂H₅OH', 'CH₃COOH', 'HCl', 'H₂SO₄', 'HNO₃', 'NaOH', 'NaCl', 'KMnO₄', 'Fe³⁺', 'Cu²⁺', 'SO₄²⁻', 'NO₃⁻']
  },
  {
    category: 'Operator & Simbol Ilmiah',
    symbols: ['±', '≈', '≠', '≤', '≥', '×', '÷', '·', '√', '∞', '∝', '∫', '∑']
  }
];

const COMMON_REAGENTS = [
  { name: 'HCl Pekat 37%', m: '12.06', desc: 'Asam klorida pekat ~12.06 M' },
  { name: 'H₂SO₄ Pekat 98%', m: '18.0', desc: 'Asam sulfat pekat ~18.0 M' },
  { name: 'HNO₃ Pekat 65%', m: '14.4', desc: 'Asam nitrat pekat ~14.4 M' },
  { name: 'CH₃COOH Glasial', m: '17.4', desc: 'Asam asetat glasial 100% ~17.4 M' },
  { name: 'NH₃ (Amonia 25%)', m: '13.4', desc: 'Larutan amonium hidroksida pekat ~13.4 M' },
  { name: 'NaOH 50%', m: '19.1', desc: 'Larutan natrium hidroksida pekat ~19.1 M' }
];

const COMMON_SOLIDS = [
  { name: 'NaOH (Natrium Hidroksida)', mr: '40.00' },
  { name: 'NaCl (Natrium Klorida)', mr: '58.44' },
  { name: 'H₂C₂O₄·2H₂O (Asam Oksalat)', mr: '126.07' },
  { name: 'KMnO₄ (Kalium Permanganat)', mr: '158.03' },
  { name: 'CuSO₄·5H₂O (Tembaga Sulfat)', mr: '249.68' },
  { name: 'CaCO₃ (Kalsium Karbonat)', mr: '100.09' },
  { name: 'NaHCO₃ (Natrium Bikarbonat)', mr: '84.01' },
  { name: 'K₂Cr₂O₇ (Kalium Dikromat)', mr: '294.18' },
  { name: 'C₆H₁₂O₆ (Glukosa)', mr: '180.16' },
  { name: 'C₁₂H₂₂O₁₁ (Sukrosa)', mr: '342.30' }
];

export const LaptrakStudioView: React.FC = () => {
  const { 
    laptrakTemplates, 
    addLaptrakTemplate, 
    updateLaptrakTemplate, 
    deleteLaptrakTemplate, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'format' | 'kalkulator' | 'simbol' | 'keselamatan'>('format');
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

  // Calculator Sub-tab
  const [calcTab, setCalcTab] = useState<'dilution' | 'molarity' | 'stoichiometry' | 'ph'>('dilution');

  // Dilution Calculator State (V1 x M1 = V2 x M2)
  const [dilutionTarget, setDilutionTarget] = useState<'V1' | 'V2' | 'M2'>('V1');
  const [v1, setV1] = useState<string>('');
  const [m1, setM1] = useState<string>('12.06'); // default HCl pekat
  const [v2, setV2] = useState<string>('100'); // target 100 mL
  const [m2, setM2] = useState<string>('0.1'); // target 0.1 M

  // Molarity from Mass Calculator
  const [solidCalcMode, setSolidCalcMode] = useState<'mass' | 'molarity'>('mass');
  const [massGram, setMassGram] = useState<string>('4.0');
  const [mrValue, setMrValue] = useState<string>('40.00');
  const [volMl, setVolMl] = useState<string>('1000');
  const [targetMolarity, setTargetMolarity] = useState<string>('0.1');

  // Stoichiometry Calculator State
  const [stoichMass, setStoichMass] = useState<string>('5.85');
  const [stoichMr, setStoichMr] = useState<string>('58.44');

  // pH Calculator State
  const [phType, setPhType] = useState<'strong_acid' | 'strong_base' | 'weak_acid' | 'weak_base'>('strong_acid');
  const [phConcentration, setPhConcentration] = useState<string>('0.01');
  const [phValence, setPhValence] = useState<string>('1'); // e.g. HCl = 1, H2SO4 = 2
  const [phKaKb, setPhKaKb] = useState<string>('1.8e-5'); // e.g. CH3COOH Ka = 1.8e-5

  // Custom Chemical Symbols State
  const [customSymbols, setCustomSymbols] = useState<CustomChemicalSymbol[]>(() => {
    try {
      const saved = localStorage.getItem('mcl_custom_chem_symbols');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newSymName, setNewSymName] = useState('');
  const [newSymValue, setNewSymValue] = useState('');
  const [scratchpadText, setScratchpadText] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mcl_custom_chem_symbols', JSON.stringify(customSymbols));
    } catch (e) {
      console.error(e);
    }
  }, [customSymbols]);

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
      { step: 1, name: 'Cover / Judul Praktikum', desc: 'Identitas mahasiswa dan judul', template: 'JUDUL PRAKTIKUM\nNama: [Nama Mahasiswi]\nNIM: [NIM Mahasiswi UPI]\nKelas: Pendidikan Kimia 2026' },
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
  const calculateDilution = (): { result: string; formula: string; instruction: string } => {
    const nM1 = parseFloat(m1);
    const nV2 = parseFloat(v2);
    const nM2 = parseFloat(m2);
    const nV1 = parseFloat(v1);

    if (dilutionTarget === 'V1') {
      if (nM1 > 0 && nV2 > 0 && nM2 > 0) {
        const res = (nV2 * nM2) / nM1;
        return {
          result: `${res.toFixed(3)} mL`,
          formula: `V₁ = (V₂ × M₂) / M₁ = (${nV2} × ${nM2}) / ${nM1}`,
          instruction: `Pipet sebanyak ${res.toFixed(3)} mL larutan pekat (${nM1} M), masukkan ke labu ukur ${nV2} mL, lalu tambahkan akuades hingga tanda batas.`
        };
      }
    } else if (dilutionTarget === 'V2') {
      if (nV1 > 0 && nM1 > 0 && nM2 > 0) {
        const res = (nV1 * nM1) / nM2;
        return {
          result: `${res.toFixed(2)} mL`,
          formula: `V₂ = (V₁ × M₁) / M₂ = (${nV1} × ${nM1}) / ${nM2}`,
          instruction: `Dengan memipet ${nV1} mL larutan pekat (${nM1} M), encerkan hingga volume akhir ${res.toFixed(2)} mL untuk mendapatkan ${nM2} M.`
        };
      }
    } else if (dilutionTarget === 'M2') {
      if (nV1 > 0 && nM1 > 0 && nV2 > 0) {
        const res = (nV1 * nM1) / nV2;
        return {
          result: `${res.toFixed(4)} M`,
          formula: `M₂ = (V₁ × M₁) / V₂ = (${nV1} × ${nM1}) / ${nV2}`,
          instruction: `Mencampurkan ${nV1} mL larutan (${nM1} M) ke labu ${nV2} mL menghasilkan konsentrasi ${res.toFixed(4)} M.`
        };
      }
    }
    return { result: 'Masukkan nilai di atas', formula: 'V₁ × M₁ = V₂ × M₂', instruction: 'Isi parameter dengan benar untuk melihat prosedur praktikum.' };
  };

  // Compute Molarity Solid
  const calculateSolidDetails = (): { value: string; step: string } => {
    const mr = parseFloat(mrValue);
    const vol = parseFloat(volMl);

    if (solidCalcMode === 'mass') {
      const targetM = parseFloat(targetMolarity);
      if (targetM > 0 && mr > 0 && vol > 0) {
        const neededGram = (targetM * mr * vol) / 1000;
        return {
          value: `${neededGram.toFixed(4)} gram`,
          step: `Massa = (M × Mr × V_mL) / 1000 = (${targetM} × ${mr} × ${vol}) / 1000 = ${neededGram.toFixed(4)} g. Timbang padatan pada kaca arloji/gelas piala, larutkan, masukkan ke labu ukur ${vol} mL dan paskan hingga meniskus.`
        };
      }
    } else {
      const gram = parseFloat(massGram);
      if (gram > 0 && mr > 0 && vol > 0) {
        const resultM = (gram / mr) * (1000 / vol);
        return {
          value: `${resultM.toFixed(4)} M (mol/L)`,
          step: `M = (gram / Mr) × (1000 / V_mL) = (${gram} / ${mr}) × (1000 / ${vol}) = ${resultM.toFixed(4)} M.`
        };
      }
    }
    return { value: '0.00', step: 'Lengkapi parameter perhitungan.' };
  };

  // Compute Stoichiometry
  const calculateStoichiometry = () => {
    const g = parseFloat(stoichMass);
    const mr = parseFloat(stoichMr);
    if (g > 0 && mr > 0) {
      const mol = g / mr;
      const particles = mol * 6.022e23;
      const volStp = mol * 22.4;
      return {
        mol: `${mol.toFixed(4)} mol (${(mol * 1000).toFixed(2)} mmol)`,
        particles: `${particles.toExponential(4)} partikel/molekul`,
        volStp: `${volStp.toFixed(3)} Liter (pada kondisi STP 0°C, 1 atm)`
      };
    }
    return { mol: '0.00 mol', particles: '0 partikel', volStp: '0.00 L' };
  };

  // Compute pH
  const calculatePH = () => {
    const c = parseFloat(phConcentration);
    const val = parseFloat(phValence) || 1;
    const k = parseFloat(phKaKb) || 1.8e-5;

    if (c <= 0) return { ph: '7.00', poh: '7.00', hConc: '1.0e-7 M', typeDesc: 'Netral' };

    let phVal = 7;
    let pohVal = 7;
    let hConc = 1e-7;

    if (phType === 'strong_acid') {
      hConc = c * val;
      phVal = -Math.log10(hConc);
      pohVal = 14 - phVal;
    } else if (phType === 'strong_base') {
      const ohConc = c * val;
      pohVal = -Math.log10(ohConc);
      phVal = 14 - pohVal;
      hConc = Math.pow(10, -phVal);
    } else if (phType === 'weak_acid') {
      hConc = Math.sqrt(k * c);
      phVal = -Math.log10(hConc);
      pohVal = 14 - phVal;
    } else if (phType === 'weak_base') {
      const ohConc = Math.sqrt(k * c);
      pohVal = -Math.log10(ohConc);
      phVal = 14 - pohVal;
      hConc = Math.pow(10, -phVal);
    }

    return {
      ph: phVal.toFixed(2),
      poh: pohVal.toFixed(2),
      hConc: `${hConc.toExponential(3)} M`,
      typeDesc: phVal < 7 ? 'Asam' : phVal > 7 ? 'Basa' : 'Netral'
    };
  };

  const handleCopySymbol = (sym: string) => {
    navigator.clipboard.writeText(sym);
    setCopiedSymbol(sym);
    setScratchpadText(prev => prev + sym);
    showToast(`Simbol "${sym}" disalin & ditambahkan ke papan!`);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  const handleAddCustomSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymValue.trim()) return;
    const newSym: CustomChemicalSymbol = {
      id: `sym-${Date.now()}`,
      name: newSymName.trim() || newSymValue.trim(),
      symbol: newSymValue.trim()
    };
    setCustomSymbols(prev => [...prev, newSym]);
    setNewSymName('');
    setNewSymValue('');
    showToast('Simbol kimia kustom berhasil ditambahkan!');
  };

  const handleDeleteCustomSymbol = (id: string) => {
    setCustomSymbols(prev => prev.filter(s => s.id !== id));
    showToast('Simbol kustom dihapus.');
  };

  const filteredGhs = GHS_SAFETY_DATA.filter(g => 
    g.symbol.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.code.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.risk.toLowerCase().includes(ghsSearch.toLowerCase()) ||
    g.examples.toLowerCase().includes(ghsSearch.toLowerCase())
  );

  const dilutionData = calculateDilution();
  const solidData = calculateSolidDetails();
  const stoichData = calculateStoichiometry();
  const phData = calculatePH();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-7 shadow-xs border border-rose-200/20 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold whitespace-nowrap">
            <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Studio & Format Laptrak Kimia UPI</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
            Studio Laporan Praktikum & Laboratorium
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/90 max-w-2xl leading-relaxed">
            Pilihan template laptrak terstruktur, kalkulator kimia lab presisi, palet simbol kimia lengkap, dan panduan K3 GHS.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveTab('format')}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'format'
                ? 'bg-white text-rose-950 shadow-xs'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Template Laptrak</span>
          </button>

          <button
            onClick={() => setActiveTab('kalkulator')}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'kalkulator'
                ? 'bg-white text-rose-950 shadow-xs'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Kalkulator Kimia</span>
          </button>

          <button
            onClick={() => setActiveTab('simbol')}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'simbol'
                ? 'bg-white text-rose-950 shadow-xs'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <Atom className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Simbol & Rumus</span>
          </button>

          <button
            onClick={() => setActiveTab('keselamatan')}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'keselamatan'
                ? 'bg-white text-rose-950 shadow-xs'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Simbol GHS & K3</span>
          </button>
        </div>
      </section>

      {/* 1. Format & Template Management Tab */}
      {activeTab === 'format' && (
        <div className="space-y-6">
          {/* Unified Template Controller & Active Header */}
          <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Top Control Bar: Template Selector & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex-1 max-w-xl space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Pilihan Format Template Laptrak
                  </label>
                </div>
                <CustomSelect
                  value={selectedTemplateId}
                  onChange={setSelectedTemplateId}
                  options={laptrakTemplates.map(tpl => ({
                    value: tpl.id,
                    label: tpl.title,
                    count: `${tpl.sections.length} Bab • ${tpl.tag || 'Format'}`
                  }))}
                  ariaLabel="Pilih Template Laptrak"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 border border-rose-200/80 active:scale-95 shadow-2xs"
                >
                  <Plus className="w-4 h-4 flex-shrink-0 text-rose-700" />
                  <span>Buat Template Sendiri</span>
                </button>

                <button
                  onClick={copyAllSections}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95 shadow-xs"
                >
                  {isCopiedAll ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                      <span className="text-emerald-300">Tersalin Lengkap!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-rose-200 flex-shrink-0" />
                      <span>Salin Semua Bab</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Template Information Banner */}
            {activeTemplate && (
              <div className="bg-gradient-to-r from-rose-50/70 via-rose-50/40 to-slate-50/60 rounded-2xl border border-rose-100/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-rose-900 bg-rose-100/90 px-3 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 border border-rose-200">
                      {activeTemplate.tag || 'Format Laptrak'}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-0.5 rounded-full whitespace-nowrap border border-slate-200/70 shadow-2xs">
                      {activeTemplate.sections.length} Bab Terstruktur
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                    {activeTemplate.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                    {activeTemplate.subtitle}
                  </p>
                </div>

                {activeTemplate.isCustom && (
                  <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-rose-100/70">
                    <button
                      onClick={() => openEditModal(activeTemplate)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer flex-shrink-0 shadow-2xs"
                      title="Edit Template Ini"
                    >
                      <Edit3 className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus template "${activeTemplate.title}"?`)) {
                          deleteLaptrakTemplate(activeTemplate.id);
                          setSelectedTemplateId(laptrakTemplates[0]?.id || 'tpl-upi-standard');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer flex-shrink-0 shadow-2xs"
                      title="Hapus Template Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {activeTemplate?.sections.map((item, idx) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs flex flex-col justify-between hover:border-rose-300 hover:shadow-sm transition-all duration-200 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-rose-950 bg-rose-50 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 border border-rose-200/80">
                      Bagian {item.step}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.template, idx, item.name)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs whitespace-nowrap flex-shrink-0 font-bold active:scale-95"
                      title="Salin Bagian Ini"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span>Salin Format</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <pre className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-36 border border-slate-200/70 leading-relaxed select-all">
                    {item.template}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Kalkulator Kimia Lab Suite Tab */}
      {activeTab === 'kalkulator' && (
        <div className="space-y-6">
          {/* Calculator Mode Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-rose-100 shadow-xs">
            {[
              { id: 'dilution', label: 'Pengenceran (V₁·M₁)', icon: FlaskConical },
              { id: 'molarity', label: 'Molaritas Padatan', icon: Beaker },
              { id: 'stoichiometry', label: 'Stoikiometri & Mol', icon: Scale },
              { id: 'ph', label: 'pH Asam-Basa', icon: Gauge }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = calcTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCalcTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                      : 'bg-transparent text-slate-700 border-transparent hover:bg-rose-50 hover:text-rose-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CALCULATOR 1: DILUTION */}
          {calcTab === 'dilution' && (
            <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Calculator Header & Target Selector */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-800 flex-shrink-0 mt-0.5 shadow-2xs">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                      Kalkulator Pengenceran Larutan (Dilution Formula)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      Gunakan rumus <span className="font-mono font-bold text-rose-900">V₁ × M₁ = V₂ × M₂</span> untuk membuat larutan encer dari reagen pekat.
                    </p>
                  </div>
                </div>

                {/* Clean Segmented Target Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 self-start lg:self-auto flex-shrink-0">
                  <span className="text-xs font-bold text-slate-500 px-2.5">Cari:</span>
                  <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                    {(['V1', 'V2', 'M2'] as const).map(target => {
                      const isActive = dilutionTarget === target;
                      return (
                        <button
                          key={target}
                          onClick={() => setDilutionTarget(target)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                            isActive
                              ? 'bg-white text-rose-950 shadow-xs border border-rose-100'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          {target === 'V1' ? 'V₁ (Pekat)' : target === 'V2' ? 'V₂ (Target)' : 'M₂ (Konsentrasi)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Common Reagents Quick Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Preset Reagen Pekat Laboratorium UPI (Klik untuk mengisi M₁):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {COMMON_REAGENTS.map(reagent => (
                    <button
                      key={reagent.name}
                      onClick={() => setM1(reagent.m)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        m1 === reagent.m
                          ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold ring-1 ring-rose-400'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-rose-50/50 hover:border-rose-200'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{reagent.name}</div>
                      <div className="text-[11px] text-rose-800 font-mono">{reagent.m} M</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {dilutionTarget !== 'V1' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Volume Larutan Pekat (V₁) [mL]
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={v1}
                      onChange={e => setV1(e.target.value)}
                      placeholder="Contoh: 8.33"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Konsentrasi Larutan Pekat (M₁) [Molar]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={m1}
                    onChange={e => setM1(e.target.value)}
                    placeholder="Contoh: 12.06 (HCl)"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium"
                  />
                </div>

                {dilutionTarget !== 'V2' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Volume Labu Ukur Target (V₂) [mL]
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={v2}
                      onChange={e => setV2(e.target.value)}
                      placeholder="Contoh: 100"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium"
                    />
                  </div>
                )}

                {dilutionTarget !== 'M2' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Konsentrasi Larutan Target (M₂) [Molar]
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={m2}
                      onChange={e => setM2(e.target.value)}
                      placeholder="Contoh: 0.1"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Dilution Result Display Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 border border-rose-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Hasil Perhitungan Presisi:
                  </span>
                  <span className="text-xs font-mono font-semibold text-rose-800 bg-white/80 px-2.5 py-0.5 rounded-lg border border-rose-200">
                    {dilutionData.formula}
                  </span>
                </div>

                <div className="font-display font-black text-3xl sm:text-4xl text-rose-950">
                  {dilutionData.result}
                </div>

                <p className="text-xs text-rose-900/90 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-rose-200/50">
                  💡 <strong>Prosedur Praktikum:</strong> {dilutionData.instruction}
                </p>
              </div>
            </div>
          )}

          {/* CALCULATOR 2: SOLID MOLARITY */}
          {calcTab === 'molarity' && (
            <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 flex-shrink-0 mt-0.5 shadow-2xs">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                      Pembuatan Larutan dari Zat Padat
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      Hitung massa padatan yang harus ditimbang atau konsentrasi larutan menggunakan rumus <span className="font-mono font-bold text-blue-900">M = (gram / Mr) × (1000 / mL)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 self-start lg:self-auto flex-shrink-0">
                  <button
                    onClick={() => setSolidCalcMode('mass')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                      solidCalcMode === 'mass'
                        ? 'bg-white text-blue-950 shadow-xs border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    Hitung Massa (Gram)
                  </button>
                  <button
                    onClick={() => setSolidCalcMode('molarity')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                      solidCalcMode === 'molarity'
                        ? 'bg-white text-blue-950 shadow-xs border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    Hitung Molaritas (M)
                  </button>
                </div>
              </div>

              {/* Common Solids Quick Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Preset Senyawa Padat Populer (Klik untuk mengisi Mr):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {COMMON_SOLIDS.map(solid => (
                    <button
                      key={solid.name}
                      onClick={() => setMrValue(solid.mr)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        mrValue === solid.mr
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold ring-1 ring-blue-400'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-blue-50/50 hover:border-blue-200'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{solid.name}</div>
                      <div className="text-[11px] text-blue-800 font-mono">Mr = {solid.mr}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {solidCalcMode === 'mass' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Target Konsentrasi (M) [Molar]
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={targetMolarity}
                      onChange={e => setTargetMolarity(e.target.value)}
                      placeholder="0.1"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500 font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Massa Padatan yang Ditimbang (gram)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={massGram}
                      onChange={e => setMassGram(e.target.value)}
                      placeholder="4.0"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Massa Molar Relatif (Mr) [g/mol]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={mrValue}
                    onChange={e => setMrValue(e.target.value)}
                    placeholder="40.00"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Volume Labu Ukur (mL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={volMl}
                    onChange={e => setVolMl(e.target.value)}
                    placeholder="1000"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Molarity Result Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                  {solidCalcMode === 'mass' ? 'Massa Padatan yang Harus Ditimbang:' : 'Molaritas Larutan yang Terbentuk:'}
                </span>

                <div className="font-display font-black text-3xl sm:text-4xl text-blue-950">
                  {solidData.value}
                </div>

                <p className="text-xs text-blue-900/90 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-blue-200/50">
                  📋 <strong>Langkah Pengerjaan:</strong> {solidData.step}
                </p>
              </div>
            </div>
          )}

          {/* CALCULATOR 3: STOICHIOMETRY & MOLE */}
          {calcTab === 'stoichiometry' && (
            <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-start gap-3.5 border-b border-slate-100 pb-5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0 mt-0.5 shadow-2xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                    Kalkulator Konversi Mol & Stoikiometri Kimia
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Hitung hubungan kuantitatif antara massa zat, jumlah mol, jumlah partikel (N), dan volume gas STP (V = n × 22.4 L).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Massa Zat (gram)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={stoichMass}
                    onChange={e => setStoichMass(e.target.value)}
                    placeholder="5.85"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Massa Molar Zat (Mr / Ar) [g/mol]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={stoichMr}
                    onChange={e => setStoichMr(e.target.value)}
                    placeholder="58.44"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Jumlah Mol (n = g / Mr)
                  </span>
                  <div className="font-display font-bold text-xl text-emerald-950">
                    {stoichData.mol}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Jumlah Partikel (n × 6.022·10²³)
                  </span>
                  <div className="font-display font-bold text-sm sm:text-base text-emerald-950 break-all">
                    {stoichData.particles}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Volume Gas Ideal STP (n × 22.4 L)
                  </span>
                  <div className="font-display font-bold text-sm sm:text-base text-emerald-950">
                    {stoichData.volStp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 4: pH & ACID-BASE */}
          {calcTab === 'ph' && (
            <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-start gap-3.5 border-b border-slate-100 pb-5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-800 flex-shrink-0 mt-0.5 shadow-2xs">
                  <Gauge className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                    Kalkulator pH Larutan Asam & Basa
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Hitung nilai derajat keasaman ($pH$) dan $pOH$ untuk asam kuat, basa kuat, asam lemah ($Ka$), maupun basa lemah ($Kb$).
                  </p>
                </div>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'strong_acid', label: 'Asam Kuat (HCl, H₂SO₄)' },
                  { id: 'strong_base', label: 'Basa Kuat (NaOH, KOH)' },
                  { id: 'weak_acid', label: 'Asam Lemah (CH₃COOH)' },
                  { id: 'weak_base', label: 'Basa Lemah (NH₄OH)' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setPhType(type.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center whitespace-normal active:scale-95 ${
                      phType === type.id
                        ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Input parameters for pH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Konsentrasi Larutan (M) [Molar]
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={phConcentration}
                    onChange={e => setPhConcentration(e.target.value)}
                    placeholder="0.01"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-purple-500 font-medium"
                  />
                </div>

                {(phType === 'strong_acid' || phType === 'strong_base') ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Valensi Asam / Basa (Jumlah H⁺ atau OH⁻ per molekul)
                    </label>
                    <input
                      type="number"
                      value={phValence}
                      onChange={e => setPhValence(e.target.value)}
                      placeholder="1 (e.g. HCl) atau 2 (e.g. H2SO4)"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-purple-500 font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Tetapan Ionisasi ({phType === 'weak_acid' ? 'Ka' : 'Kb'})
                    </label>
                    <input
                      type="text"
                      value={phKaKb}
                      onChange={e => setPhKaKb(e.target.value)}
                      placeholder="Contoh: 1.8e-5 atau 0.000018"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-purple-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* pH Meter Card Display */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                      Karakteristik Keasaman Larutan:
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-display font-black text-4xl text-purple-950">
                        pH {phData.ph}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-purple-900 border border-purple-200">
                        Sifat: {phData.typeDesc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right space-y-0.5 text-xs text-slate-600">
                    <div>pOH = <span className="font-mono font-bold text-slate-900">{phData.poh}</span></div>
                    <div>[H⁺] = <span className="font-mono font-bold text-slate-900">{phData.hConc}</span></div>
                  </div>
                </div>

                {/* Visual pH Scale Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-emerald-400 to-blue-600 shadow-inner relative" />
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-1">
                    <span>0 (Sangat Asam)</span>
                    <span>7 (Netral)</span>
                    <span>14 (Sangat Basa)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Simbol & Rumus Kimia Tab */}
      {activeTab === 'simbol' && (
        <div className="space-y-6">
          {/* Header & Scratchpad */}
          <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-rose-800" />
                  <span>Papan Susun Rumus & Simbol Kimia</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Klik simbol apa saja di bawah untuk menyalin langsung atau merangkai rumus kimia di papan ini.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scratchpadText);
                    showToast('Seluruh rumus di papan berhasil disalin! 📋');
                  }}
                  disabled={!scratchpadText}
                  className="px-3.5 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Rumus Utuh</span>
                </button>
                <button
                  onClick={() => setScratchpadText('')}
                  disabled={!scratchpadText}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Hapus Papan
                </button>
              </div>
            </div>

            {/* Live Interactive Scratchpad Area */}
            <div className="relative">
              <textarea
                value={scratchpadText}
                onChange={e => setScratchpadText(e.target.value)}
                placeholder="Klik simbol di bawah atau ketik di sini (contoh: 2H₂O(l) ⇌ 2H₂(g) + O₂(g) ΔH = +571.6 kJ/mol)..."
                rows={3}
                className="w-full p-3.5 text-sm font-mono bg-slate-50 rounded-2xl border border-slate-200 focus:outline-rose-500 text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          {/* Form Tambah Simbol / Notasi Kustom Sendiri */}
          <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-rose-800" />
              <h4 className="font-display font-bold text-base text-slate-900">
                Tambah Simbol / Notasi Reaksi Kustom Sendiri
              </h4>
            </div>

            <form onSubmit={handleAddCustomSymbol} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={newSymName}
                  onChange={e => setNewSymName(e.target.value)}
                  placeholder="Nama Notasi (e.g. Kompleks Fe(SCN)²⁺)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={newSymValue}
                  onChange={e => setNewSymValue(e.target.value)}
                  placeholder="Simbol / Teks (e.g. [Fe(SCN)]²⁺, ⇌)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-rose-500 font-medium font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#831843] hover:bg-[#9f1239] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Simbol Kustom</span>
              </button>
            </form>

            {/* Custom Symbols List (if any) */}
            {customSymbols.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Simbol Kustom Saya ({customSymbols.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {customSymbols.map(sym => (
                    <div
                      key={sym.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-slate-800 text-xs shadow-2xs group"
                    >
                      <button
                        onClick={() => handleCopySymbol(sym.symbol)}
                        className="font-mono font-bold text-rose-950 hover:underline cursor-pointer flex items-center gap-1"
                        title="Klik untuk menyalin"
                      >
                        <span>{sym.symbol}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({sym.name})</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomSymbol(sym.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 ml-1 cursor-pointer"
                        title="Hapus Simbol"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Standard Chemical Symbols Palette Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_CHEMICAL_SYMBOLS.map(group => (
              <div
                key={group.category}
                className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    {group.category}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {group.symbols.length} Simbol
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {group.symbols.map(sym => (
                    <button
                      key={sym}
                      onClick={() => handleCopySymbol(sym)}
                      className={`min-w-8 h-8 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center border active:scale-95 ${
                        copiedSymbol === sym
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-rose-900 border-slate-200 hover:border-rose-300'
                      }`}
                      title={`Klik untuk salin ${sym}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Simbol Keselamatan GHS Tab */}
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl cursor-pointer transition-all border border-rose-200/60"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Bab</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {modalSections.map((sec, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
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
