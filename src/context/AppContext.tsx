import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationTab, 
  CourseSchedule, 
  AssignmentTask, 
  TaskTypeConfig,
  TaskPriority,
  ExpenseItem, 
  DailyHabit, 
  GoalItem, 
  MoodCheckin, 
  LoveNoteEntry, 
  SealedLetter, 
  ExpenseCategory,
  RomanticAffirmation,
  LaptrakTemplate,
  WellnessLogItem
} from '../types';
import { 
  OFFICIAL_UPI_KRS, 
  DAILY_SUPPORT_MESSAGES, 
  INITIAL_TASK_TYPES,
  INITIAL_ASSIGNMENTS, 
  INITIAL_EXPENSES, 
  INITIAL_HABITS, 
  INITIAL_GOALS, 
  SEVEN_SEALED_LETTERS, 
  INITIAL_LOVE_NOTES,
  INITIAL_ROMANTIC_AFFIRMATIONS,
  INITIAL_LAPTRAK_TEMPLATES,
  INITIAL_WELLNESS_LOGS,
  DEFAULT_MAS_PHONE
} from '../data/initialData';
import { playChimeSuccess, playGentlePop, toggleLofiRainAmbient } from '../utils/audio';
import { sendLocalNotification } from '../utils/notifications';
import confetti from 'canvas-confetti';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  
  // Quotes & Messages from Mas
  currentQuote: string;
  nextQuote: () => void;
  
  // Romantic Affirmations
  affirmations: RomanticAffirmation[];
  currentAffirmation: RomanticAffirmation;
  nextAffirmation: () => void;
  toggleFavoriteAffirmation: (id: string) => void;
  addAffirmation: (text: string, category: RomanticAffirmation['category']) => void;
  
  // Courses
  courses: CourseSchedule[];
  addCourse: (course: Omit<CourseSchedule, 'id'>) => void;
  deleteCourse: (id: string) => void;
  
  // Task Types & Assignments
  taskTypes: TaskTypeConfig[];
  addTaskType: (name: string, color: string, bgLight: string, description?: string) => void;
  deleteTaskType: (id: string) => void;
  assignments: AssignmentTask[];
  addAssignment: (task: {
    title: string;
    typeId: string;
    categoryName: string;
    course?: string;
    deadline: string;
    priority: TaskPriority;
    notes?: string;
    subtasks?: { id: string; title: string; isDone: boolean }[];
  }) => void;
  toggleAssignment: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteAssignment: (id: string) => void;
  
  // Expenses
  expenses: ExpenseItem[];
  addExpense: (expense: { title: string; amount: number; category: ExpenseCategory; notes?: string }) => void;
  deleteExpense: (id: string) => void;
  totalExpensesToday: number;
  totalExpensesAllTime: number;
  
  // Habits & Wellness
  habits: DailyHabit[];
  toggleHabit: (id: string) => void;
  addHabit: (label: string, category: string) => void;
  deleteHabit: (id: string) => void;
  wellnessLogs: WellnessLogItem[];
  addWellnessLog: (log: Omit<WellnessLogItem, 'id' | 'date' | 'time'>) => void;
  deleteWellnessLog: (id: string) => void;
  toggleWellnessLogStatus: (id: string) => void;
  waterCount: number;
  incrementWater: () => void;
  decrementWater: () => void;
  resetWater: () => void;
  
  // Laptrak Templates
  laptrakTemplates: LaptrakTemplate[];
  addLaptrakTemplate: (template: Omit<LaptrakTemplate, 'id'>) => void;
  updateLaptrakTemplate: (id: string, updated: Partial<LaptrakTemplate>) => void;
  deleteLaptrakTemplate: (id: string) => void;
  resetLaptrakTemplates: () => void;
  
  // Mas Phone & Emergency
  masPhone: string;
  setMasPhone: (phone: string) => void;
  
  // Mood
  currentMood: MoodCheckin;
  updateMood: (mood: string, energy: number, note?: string) => void;
  
  // Goals
  goals: GoalItem[];
  toggleGoal: (id: string) => void;
  addGoal: (title: string, category: GoalItem['category']) => void;
  deleteGoal: (id: string) => void;
  
  // Sealed Letters
  letters: SealedLetter[];
  openLetter: (id: string) => void;
  
  // Love Notes
  loveNotes: LoveNoteEntry[];
  addLoveNote: (title: string, content: string, moodTag?: string) => void;
  deleteLoveNote: (id: string) => void;
  
  // Pomodoro
  pomodoroTime: number;
  isPomodoroRunning: boolean;
  pomodoroMode: 'work' | 'break';
  isAmbientActive: boolean;
  setPomodoroTime: React.Dispatch<React.SetStateAction<number>>;
  setPomodoroMode: React.Dispatch<React.SetStateAction<'work' | 'break'>>;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: (minutes?: number) => void;
  toggleAmbientSound: () => void;
  
  // Toast / Alerts
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Data Backup
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  COURSES: 'mcl_courses_v6',
  TASK_TYPES: 'mcl_task_types_v6',
  ASSIGNMENTS: 'mcl_assignments_v6',
  AFFIRMATIONS: 'mcl_affirmations_v6',
  EXPENSES: 'mcl_expenses_v6',
  HABITS: 'mcl_habits_v6',
  WELLNESS_LOGS: 'mcl_wellness_logs_v6',
  LAPTRAK_TEMPLATES: 'mcl_laptrak_templates_v6',
  MAS_PHONE: 'mcl_mas_phone',
  GOALS: 'mcl_goals_v6',
  MOOD: 'mcl_mood_v6',
  LETTERS: 'mcl_letters_v6',
  LOVE_NOTES: 'mcl_lovenotes_v6',
  WATER: 'mcl_water_v6',
  QUOTE_IDX: 'mcl_quote_idx_v6',
  AFFIRMATION_IDX: 'mcl_affirmation_idx_v6'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('beranda');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States with localStorage persistence
  const [courses, setCourses] = useState<CourseSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : OFFICIAL_UPI_KRS;
  });

  const [taskTypes, setTaskTypes] = useState<TaskTypeConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASK_TYPES);
    return saved ? JSON.parse(saved) : INITIAL_TASK_TYPES;
  });

  const [assignments, setAssignments] = useState<AssignmentTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [affirmations, setAffirmations] = useState<RomanticAffirmation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AFFIRMATIONS);
    return saved ? JSON.parse(saved) : INITIAL_ROMANTIC_AFFIRMATIONS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [currentMood, setCurrentMood] = useState<MoodCheckin>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOOD);
    return saved ? JSON.parse(saved) : { date: new Date().toISOString().slice(0, 10), mood: '[Mood: Ceria]', energy: 100 };
  });

  const [letters, setLetters] = useState<SealedLetter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LETTERS);
    return saved ? JSON.parse(saved) : SEVEN_SEALED_LETTERS;
  });

  const [loveNotes, setLoveNotes] = useState<LoveNoteEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOVE_NOTES);
    return saved ? JSON.parse(saved) : INITIAL_LOVE_NOTES;
  });

  const [waterCount, setWaterCount] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER);
    return saved ? parseInt(saved, 10) : 4;
  });

  const [wellnessLogs, setWellnessLogs] = useState<WellnessLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WELLNESS_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_WELLNESS_LOGS;
  });

  const [laptrakTemplates, setLaptrakTemplates] = useState<LaptrakTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAPTRAK_TEMPLATES);
    return saved ? JSON.parse(saved) : INITIAL_LAPTRAK_TEMPLATES;
  });

  const [masPhone, setMasPhoneState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAS_PHONE);
    return saved ? saved : DEFAULT_MAS_PHONE;
  });

  const setMasPhone = (phone: string) => {
    setMasPhoneState(phone);
    localStorage.setItem(STORAGE_KEYS.MAS_PHONE, phone);
    showToast('Nomor Mas berhasil diperbarui.');
  };

  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASK_TYPES, JSON.stringify(taskTypes));
  }, [taskTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AFFIRMATIONS, JSON.stringify(affirmations));
  }, [affirmations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WELLNESS_LOGS, JSON.stringify(wellnessLogs));
  }, [wellnessLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAPTRAK_TEMPLATES, JSON.stringify(laptrakTemplates));
  }, [laptrakTemplates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOOD, JSON.stringify(currentMood));
  }, [currentMood]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOVE_NOTES, JSON.stringify(loveNotes));
  }, [loveNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, waterCount.toString());
  }, [waterCount]);

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Pomodoro Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && isPomodoroRunning) {
      playChimeSuccess();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (pomodoroMode === 'work') {
        showToast('Sesi belajar selesai! Waktunya istirahat 5 menit ya Sayang ❤️');
        sendLocalNotification('🎉 Sesi Belajar Selesai!', {
          body: 'Hebat banget Sayang! Waktunya istirahat manis 5 menit & minum air ya ❤️'
        });
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
      } else {
        showToast('Waktu istirahat selesai! Semangat kembali, Bu Guru Kimia ✨');
        sendLocalNotification('✨ Waktu Istirahat Selesai!', {
          body: 'Yuk mulai sesi fokus lagi, calon sarjana pendidikan kimia hebat UPI! Mas dukung selalu🤍'
        });
        setPomodoroMode('work');
        setPomodoroTime(25 * 60);
      }
      setIsPomodoroRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroTime, pomodoroMode]);

  const startPomodoro = () => {
    playGentlePop();
    setIsPomodoroRunning(true);
  };

  const pausePomodoro = () => {
    setIsPomodoroRunning(false);
  };

  const resetPomodoro = (minutes = 25) => {
    setIsPomodoroRunning(false);
    setPomodoroTime(minutes * 60);
    setPomodoroMode(minutes <= 10 ? 'break' : 'work');
  };

  const toggleAmbientSound = () => {
    const nextState = !isAmbientActive;
    toggleLofiRainAmbient(nextState, 0.25);
    setIsAmbientActive(nextState);
    showToast(nextState ? 'Suara Hujan & Lo-Fi Tenang Diaktifkan 🎧' : 'Suara Ambient Dinonaktifkan');
  };

  // Quote Rotator
  const currentQuote = DAILY_SUPPORT_MESSAGES[quoteIndex % DAILY_SUPPORT_MESSAGES.length];
  const nextQuote = () => {
    playGentlePop();
    setQuoteIndex((prev) => (prev + 1) % DAILY_SUPPORT_MESSAGES.length);
  };

  // Affirmations
  const currentAffirmation = affirmations.length > 0 
    ? affirmations[affirmationIndex % affirmations.length] 
    : INITIAL_ROMANTIC_AFFIRMATIONS[0];

  const nextAffirmation = () => {
    playGentlePop();
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  const toggleFavoriteAffirmation = (id: string) => {
    setAffirmations((prev) =>
      prev.map((aff) => (aff.id === id ? { ...aff, isFavorite: !aff.isFavorite } : aff))
    );
    showToast('Status favorit afirmasi diperbarui ❤️');
  };

  const addAffirmation = (text: string, category: RomanticAffirmation['category']) => {
    const newAff: RomanticAffirmation = {
      id: `aff-${Date.now()}`,
      text,
      category,
      author: 'Mas',
      isFavorite: true
    };
    setAffirmations((prev) => [newAff, ...prev]);
    showToast('Afirmasi romantis baru berhasil ditambahkan!');
  };

  // Course Handlers
  const addCourse = (courseData: Omit<CourseSchedule, 'id'>) => {
    const newCourse: CourseSchedule = {
      ...courseData,
      id: `C-${Date.now()}`
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast(`Mata kuliah ${newCourse.name} berhasil ditambahkan!`);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast('Jadwal mata kuliah dihapus.');
  };

  // Task Type Handlers
  const addTaskType = (name: string, color: string, bgLight: string, description?: string) => {
    const newType: TaskTypeConfig = {
      id: `type-${Date.now()}`,
      name,
      color,
      bgLight,
      description,
      iconName: 'CheckSquare'
    };
    setTaskTypes((prev) => [...prev, newType]);
    showToast(`Kategori tugas "${name}" berhasil dibuat!`);
  };

  const deleteTaskType = (id: string) => {
    if (taskTypes.length <= 1) {
      showToast('Minimal harus ada 1 kategori tugas.');
      return;
    }
    setTaskTypes((prev) => prev.filter((t) => t.id !== id));
    showToast('Kategori tugas dihapus.');
  };

  // Assignment Handlers
  const addAssignment = (data: {
    title: string;
    typeId: string;
    categoryName: string;
    course?: string;
    deadline: string;
    priority: TaskPriority;
    notes?: string;
    subtasks?: { id: string; title: string; isDone: boolean }[];
  }) => {
    const newTask: AssignmentTask = {
      id: `task-${Date.now()}`,
      title: data.title,
      typeId: data.typeId,
      categoryName: data.categoryName,
      course: data.course || '',
      deadline: data.deadline,
      priority: data.priority,
      notes: data.notes,
      subtasks: data.subtasks || [],
      isDone: false,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setAssignments((prev) => [newTask, ...prev]);
    showToast('Tugas/pengingat baru berhasil ditambahkan!');
  };

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isDone;
          if (nextState) {
            playChimeSuccess();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.8 },
              colors: ['#9f1239', '#fb7185', '#f43f5e', '#fbcfe8']
            });
            showToast('Hebat Sayang! Satu tugas selesai diselesaikan! 🎉');
          }
          return { ...item, isDone: nextState };
        }
        return item;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setAssignments((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, isDone: !sub.isDone } : sub
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((t) => t.id !== id));
    showToast('Tugas dihapus dari daftar.');
  };

  // Expense Handlers
  const addExpense = (data: { title: string; amount: number; category: ExpenseCategory; notes?: string }) => {
    const now = new Date();
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      notes: data.notes
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Pengeluaran Rp ${data.amount.toLocaleString('id-ID')} berhasil dicatat.`);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Catatan pengeluaran dihapus.');
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const totalExpensesToday = expenses
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpensesAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Habits
  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          playGentlePop();
          return { ...h, isDone: !h.isDone };
        }
        return h;
      })
    );
  };

  const addHabit = (label: string, category: string) => {
    const newH: DailyHabit = {
      id: `h-${Date.now()}`,
      label,
      category,
      iconName: 'CheckCircle2',
      isDone: false
    };
    setHabits((prev) => [...prev, newH]);
    showToast('Kebiasaan baru ditambahkan!');
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const incrementWater = () => {
    playGentlePop();
    const next = waterCount + 1;
    setWaterCount(next);
    if (next === 8) {
      playChimeSuccess();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      showToast('Target minum 2 Liter (8 gelas) tercapai hari ini! Keren Sayang 💧');
    }
  };

  const decrementWater = () => {
    playGentlePop();
    setWaterCount((prev) => Math.max(0, prev - 1));
  };

  const resetWater = () => {
    setWaterCount(0);
    showToast('Hitungan air minum di-reset.');
  };

  // Wellness Logs
  const addWellnessLog = (log: Omit<WellnessLogItem, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const newLog: WellnessLogItem = {
      id: `well-${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...log
    };
    setWellnessLogs((prev) => [newLog, ...prev]);
    showToast('Catatan kesehatan berhasil disimpan!');
  };

  const deleteWellnessLog = (id: string) => {
    setWellnessLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Catatan kesehatan dihapus.');
  };

  const toggleWellnessLogStatus = (id: string) => {
    setWellnessLogs((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'Selesai' ? 'Baik' : 'Selesai';
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  // Laptrak Templates CRUD
  const addLaptrakTemplate = (template: Omit<LaptrakTemplate, 'id'>) => {
    const newTpl: LaptrakTemplate = {
      id: `tpl-${Date.now()}`,
      isCustom: true,
      ...template
    };
    setLaptrakTemplates((prev) => [...prev, newTpl]);
    showToast(`Template "${newTpl.title}" berhasil dibuat!`);
  };

  const updateLaptrakTemplate = (id: string, updated: Partial<LaptrakTemplate>) => {
    setLaptrakTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    showToast('Template laptrak berhasil diperbarui!');
  };

  const deleteLaptrakTemplate = (id: string) => {
    setLaptrakTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template laptrak dihapus.');
  };

  const resetLaptrakTemplates = () => {
    setLaptrakTemplates(INITIAL_LAPTRAK_TEMPLATES);
    showToast('Template laptrak di-reset ke format bawaan.');
  };

  // Mood
  const updateMood = (mood: string, energy: number, note?: string) => {
    playGentlePop();
    const updated = {
      date: new Date().toISOString().slice(0, 10),
      mood,
      energy,
      note
    };
    setCurrentMood(updated);
    showToast(`Mood harian diupdate: ${mood}`);
  };

  // Goals
  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.isDone;
          if (next) {
            playChimeSuccess();
            confetti({ particleCount: 50, spread: 60, colors: ['#f43f5e', '#fb7185', '#be123c'] });
            showToast('Wishlist romantis tercapai! Bahagia selalu bersama Mas ❤️');
          }
          return { ...g, isDone: next };
        }
        return g;
      })
    );
  };

  const addGoal = (title: string, category: GoalItem['category']) => {
    const newG: GoalItem = {
      id: `g-${Date.now()}`,
      title,
      category,
      isDone: false
    };
    setGoals((prev) => [...prev, newG]);
    showToast('Rencana baru kita bersama berhasil dicatat!');
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Letters
  const openLetter = (id: string) => {
    playChimeSuccess();
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isOpen: true, openedAt: new Date().toISOString() } : l))
    );
  };

  // Love Notes
  const addLoveNote = (title: string, content: string, moodTag?: string) => {
    const newN: LoveNoteEntry = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title,
      content,
      author: 'Sayang',
      moodTag: moodTag || 'Manis'
    };
    setLoveNotes((prev) => [newN, ...prev]);
    showToast('Catatan cinta tersimpan di buku harian!');
  };

  const deleteLoveNote = (id: string) => {
    setLoveNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Data Backup / Restore
  const exportDataJSON = () => {
    const backupObj = {
      appName: 'My Lovely Campus Diary',
      exportedAt: new Date().toISOString(),
      owner: 'Mas & Sayang',
      masPhone,
      courses,
      taskTypes,
      assignments,
      affirmations,
      expenses,
      habits,
      wellnessLogs,
      laptrakTemplates,
      goals,
      currentMood,
      letters,
      loveNotes,
      waterCount
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-lovely-campus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil di-export ke file JSON!');
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.courses) setCourses(data.courses);
      if (data.taskTypes) setTaskTypes(data.taskTypes);
      if (data.assignments) setAssignments(data.assignments);
      if (data.affirmations) setAffirmations(data.affirmations);
      if (data.expenses) setExpenses(data.expenses);
      if (data.habits) setHabits(data.habits);
      if (data.wellnessLogs) setWellnessLogs(data.wellnessLogs);
      if (data.laptrakTemplates) setLaptrakTemplates(data.laptrakTemplates);
      if (data.masPhone) setMasPhoneState(data.masPhone);
      if (data.goals) setGoals(data.goals);
      if (data.currentMood) setCurrentMood(data.currentMood);
      if (data.letters) setLetters(data.letters);
      if (data.loveNotes) setLoveNotes(data.loveNotes);
      if (data.waterCount !== undefined) setWaterCount(data.waterCount);
      showToast('Data berhasil dipulihkan dari file backup!');
      return true;
    } catch {
      showToast('Format file backup tidak valid.');
      return false;
    }
  };

  const resetToDefaults = () => {
    setCourses(OFFICIAL_UPI_KRS);
    setTaskTypes(INITIAL_TASK_TYPES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAffirmations(INITIAL_ROMANTIC_AFFIRMATIONS);
    setExpenses(INITIAL_EXPENSES);
    setHabits(INITIAL_HABITS);
    setWellnessLogs(INITIAL_WELLNESS_LOGS);
    setLaptrakTemplates(INITIAL_LAPTRAK_TEMPLATES);
    setMasPhoneState(DEFAULT_MAS_PHONE);
    setGoals(INITIAL_GOALS);
    setLetters(SEVEN_SEALED_LETTERS);
    setLoveNotes(INITIAL_LOVE_NOTES);
    setWaterCount(4);
    showToast('Semua data berhasil di-reset ke setelan awal.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        currentQuote,
        nextQuote,
        affirmations,
        currentAffirmation,
        nextAffirmation,
        toggleFavoriteAffirmation,
        addAffirmation,
        courses,
        addCourse,
        deleteCourse,
        taskTypes,
        addTaskType,
        deleteTaskType,
        assignments,
        addAssignment,
        toggleAssignment,
        toggleSubtask,
        deleteAssignment,
        expenses,
        addExpense,
        deleteExpense,
        totalExpensesToday,
        totalExpensesAllTime,
        habits,
        toggleHabit,
        addHabit,
        deleteHabit,
        wellnessLogs,
        addWellnessLog,
        deleteWellnessLog,
        toggleWellnessLogStatus,
        waterCount,
        incrementWater,
        decrementWater,
        resetWater,
        laptrakTemplates,
        addLaptrakTemplate,
        updateLaptrakTemplate,
        deleteLaptrakTemplate,
        resetLaptrakTemplates,
        masPhone,
        setMasPhone,
        currentMood,
        updateMood,
        goals,
        toggleGoal,
        addGoal,
        deleteGoal,
        letters,
        openLetter,
        loveNotes,
        addLoveNote,
        deleteLoveNote,
        pomodoroTime,
        isPomodoroRunning,
        pomodoroMode,
        isAmbientActive,
        setPomodoroTime,
        setPomodoroMode,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        toggleAmbientSound,
        toastMessage,
        showToast,
        exportDataJSON,
        importDataJSON,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
