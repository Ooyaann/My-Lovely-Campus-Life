export type NavigationTab = 
  | 'beranda'
  | 'jadwal'
  | 'tugas'
  | 'laptrak'
  | 'belajar-ai'
  | 'keuangan'
  | 'kebiasaan'
  | 'target-refleksi'
  | 'romantic-vault'
  | 'jurnal-romantis'
  | 'kontak-siaga';

export interface CourseSchedule {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  name: string;
  sks: number;
  category: '[Pedagogi]' | '[Teori]' | '[Teori/Lab]' | '[Umum]';
  room: string;
  lecturer: string;
  notes?: string;
}

export type TaskPriority = 'Tinggi' | 'Sedang' | 'Santai';

export interface TaskTypeConfig {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  description?: string;
  iconName?: string;
}

export interface TaskSubItem {
  id: string;
  title: string;
  isDone: boolean;
}

export interface AssignmentTask {
  id: string;
  title: string;
  typeId: string; // references TaskTypeConfig.id or custom type name
  categoryName: string; // display name e.g. "Laptrak Kimia", "Organisasi", "Pengingat Pribadi"
  course?: string;
  deadline: string; // YYYY-MM-DD or formatted string
  deadlineTime?: string;
  priority: TaskPriority;
  isDone: boolean;
  notes?: string;
  subtasks?: TaskSubItem[];
  createdAt: string;
}

export type ExpenseCategory = 'Makan' | 'Kopi/Nongkrong' | 'Alat Lab/Print' | 'Transport' | 'Kebutuhan Kos' | 'Skincare/Pribadi' | 'Lainnya';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  time: string;
  notes?: string;
}

export interface DailyHabit {
  id: string;
  label: string;
  category: string;
  iconName: string;
  isDone: boolean;
}

export interface MoodCheckin {
  date: string;
  mood: string;
  energy: number; // 25, 50, 75, 100
  note?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  isDone: boolean;
  targetDate?: string;
  category: 'Kencan' | 'Kuliah Bareng' | 'Mimpi Bersama' | 'Kuliner';
}

export interface LoveNoteEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  author: 'Sayang' | 'Mas';
  moodTag?: string;
  imageUrl?: string;
}

export interface SealedLetter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  openWhen: string;
  content: string;
  isOpen: boolean;
  openedAt?: string;
  icon: string;
}

export interface MilestoneLetter {
  id: string;
  title: string;
  scenario: string;
  content: string;
  isOpen: boolean;
  openedAt?: string;
  icon: string;
}

export interface WeeklyQuestion {
  id: string;
  question: string;
  category: 'Kenangan' | 'Refleksi' | 'Mimpi & Masa Depan' | 'Kimia & Kuliah' | 'Lucu & Ringan';
}

export interface TeachingIdea {
  id: string;
  title: string;
  topic: string;
  level: string;
  description: string;
  materials: string;
  isCustom?: boolean;
}

export interface UPISurvivalNote {
  id: string;
  title: string;
  category: string;
  content: string;
  location?: string;
  isCustom?: boolean;
}

export interface RomanticAffirmation {
  id: string;
  text: string;
  category: 'Cinta & Sayang' | 'Penyemangat Kuliah' | 'Rasa Syukur' | 'Ketenangan Hati' | 'Masa Depan Bersama';
  author: string;
  isFavorite?: boolean;
}

export interface AIPromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  promptText: string;
  isCustom?: boolean;
}

export interface ReflectionEntry {
  id: string;
  week: string;
  date: string;
  academicWins: string;
  challengesFaced: string;
  gratefulFor: string;
  messageToSelf: string;
}

export interface CampusPortalLink {
  id: string;
  title: string;
  url: string;
  category: 'Akademik UPI' | 'Perpustakaan' | 'Ruang Kolaborasi' | 'Bahan Praktikum';
  description: string;
  badge?: string;
}

export interface LaptrakSection {
  step: number;
  name: string;
  desc: string;
  template: string;
}

export interface LaptrakTemplate {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  isCustom?: boolean;
  sections: LaptrakSection[];
}

export interface GHSSymbolItem {
  id?: string;
  code: string;
  symbol: string;
  risk: string;
  examples: string;
  action: string;
  category?: string;
  isCustom?: boolean;
}

export interface WellnessLogItem {
  id: string;
  date: string;
  time: string;
  category: 'Fisik & Energi' | 'Vitamin & Obat' | 'Gejala & Keluhan' | 'Pola Makan' | 'Catatan Mas';
  title: string;
  notes: string;
  status: 'Baik' | 'Perlu Istirahat' | 'Selesai';
}

