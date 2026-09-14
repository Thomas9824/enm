import type { Poly, VideoCourse, ActivityEntry, MockExam } from "@/types"

export function getFutureDateString(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export const INITIAL_POLYS: Poly[] = [
  {
    id: 'poly-1',
    title: 'Droit Pénal Général & Théorie de la Peine',
    iconName: 'Scale',
    subject: 'Droit Pénal',
    subjectColor: 'red',
    totalPages: 240,
    readPages: 180,
    deadline: getFutureDateString(18),
    notes: 'Élément moral, faute pénale et causes d\'irresponsabilité. Revoir les arrêts d\'assemblée plénière.',
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'poly-2',
    title: 'Procédure Civile & Compétence Juridictionnelle',
    iconName: 'Landmark',
    subject: 'Droit Civil',
    subjectColor: 'blue',
    totalPages: 310,
    readPages: 124,
    deadline: getFutureDateString(25),
    notes: 'Compétence matérielle des tribunaux judiciaires et fins de non-recevoir. Fiches à terminer.',
    updatedAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'poly-3',
    title: 'Régime Général des Obligations & Contrats',
    iconName: 'Scroll',
    subject: 'Droit Civil',
    subjectColor: 'blue',
    totalPages: 280,
    readPages: 280,
    deadline: getFutureDateString(5),
    notes: 'Terminé. Toutes les fiches de synthèse sont prêtes et révisées.',
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'poly-4',
    title: 'Note de Synthèse & Méthodologie ENM',
    iconName: 'Brain',
    subject: 'Méthodologie',
    subjectColor: 'purple',
    totalPages: 110,
    readPages: 35,
    deadline: getFutureDateString(12),
    notes: 'Plan en deux parties et deux sous-parties. Gestion du temps : 1h30 de lecture max.',
    updatedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'poly-5',
    title: 'Droit Public & Libertés Fondamentales',
    iconName: 'Briefcase',
    subject: 'Droit Public',
    subjectColor: 'green',
    totalPages: 195,
    readPages: 0,
    deadline: getFutureDateString(35),
    notes: 'QPC et jurisprudence du Conseil d\'État. Débuter la lecture dès lundi.',
    updatedAt: Date.now() - 3600000 * 48,
  },
  {
    id: 'poly-6',
    title: 'Procédure Pénale Approfondie & Nullités',
    iconName: 'FileText',
    subject: 'Droit Pénal',
    subjectColor: 'red',
    totalPages: 220,
    readPages: 95,
    deadline: getFutureDateString(20),
    notes: 'Garde à vue, droits de la défense et régime des perquisitions.',
    updatedAt: Date.now() - 3600000 * 18,
  },
]

export const INITIAL_VIDEO_COURSES: VideoCourse[] = [
  {
    id: 'vid-1',
    title: 'Droit Pénal — Cours Magistral Complet',
    iconName: 'Video',
    subject: 'Droit Pénal',
    subjectColor: 'red',
    deadline: getFutureDateString(15),
    notes: 'Série de 3 modules. Regarder dans l\'ordre.',
    updatedAt: Date.now() - 3600000 * 3,
    modules: [
      {
        id: 'm-1-1',
        title: 'Module 1 — Éléments constitutifs de l\'infraction',
        lessons: [
          { id: 'l-1-1-1', title: 'CM 1 : Introduction au droit pénal', durationMin: 55, watched: true },
          { id: 'l-1-1-2', title: 'CM 2 : L\'élément légal', durationMin: 48, watched: true },
          { id: 'l-1-1-3', title: 'CM 3 : L\'élément matériel', durationMin: 62, watched: false },
        ],
      },
      {
        id: 'm-1-2',
        title: 'Module 2 — La responsabilité pénale',
        lessons: [
          { id: 'l-1-2-1', title: 'CM 4 : Imputabilité et discernement', durationMin: 50, watched: false },
          { id: 'l-1-2-2', title: 'CM 5 : Les causes d\'irresponsabilité', durationMin: 58, watched: false },
        ],
      },
      {
        id: 'm-1-3',
        title: 'Module 3 — Les peines',
        lessons: [
          { id: 'l-1-3-1', title: 'CM 6 : Théorie de la peine', durationMin: 45, watched: false },
          { id: 'l-1-3-2', title: 'CM 7 : Individualisation et aménagement', durationMin: 52, watched: false },
        ],
      },
    ],
  },
  {
    id: 'vid-2',
    title: 'Procédure Civile — Vidéos ENM',
    iconName: 'Film',
    subject: 'Droit Civil',
    subjectColor: 'blue',
    deadline: getFutureDateString(22),
    notes: 'Compléter avec les fiches du poly 2.',
    updatedAt: Date.now() - 3600000 * 10,
    modules: [
      {
        id: 'm-2-1',
        title: 'Module 1 — Compétence juridictionnelle',
        lessons: [
          { id: 'l-2-1-1', title: 'Vidéo 1 : Compétence d\'attribution', durationMin: 40, watched: true },
          { id: 'l-2-1-2', title: 'Vidéo 2 : Compétence territoriale', durationMin: 38, watched: true },
          { id: 'l-2-1-3', title: 'Vidéo 3 : Règles spéciales', durationMin: 35, watched: false },
        ],
      },
      {
        id: 'm-2-2',
        title: 'Module 2 — L\'instance',
        lessons: [
          { id: 'l-2-2-1', title: 'Vidéo 4 : Introduction de l\'instance', durationMin: 42, watched: false },
          { id: 'l-2-2-2', title: 'Vidéo 5 : Les fins de non-recevoir', durationMin: 47, watched: false },
        ],
      },
    ],
  },
  {
    id: 'vid-3',
    title: 'Méthodologie Note de Synthèse',
    iconName: 'Monitor',
    subject: 'Méthodologie',
    subjectColor: 'purple',
    deadline: getFutureDateString(10),
    notes: 'Revoir les exemples de plans.',
    updatedAt: Date.now() - 3600000 * 5,
    modules: [
      {
        id: 'm-3-1',
        title: 'Module 1 — Technique de la note de synthèse',
        lessons: [
          { id: 'l-3-1-1', title: 'Vidéo 1 : Présentation de l\'épreuve', durationMin: 30, watched: true },
          { id: 'l-3-1-2', title: 'Vidéo 2 : Sélectionner les idées clés', durationMin: 35, watched: true },
          { id: 'l-3-1-3', title: 'Vidéo 3 : Rédiger la note', durationMin: 40, watched: true },
        ],
      },
    ],
  },
]

// ── Polys storage ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'notion_polys_react_data'

export function loadPolysFromStorage(): Poly[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn("Could not read polys from localStorage", e)
  }
  return INITIAL_POLYS
}

export function savePolysToStorage(polys: Poly[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(polys))
  } catch (e) {
    console.error("Could not save polys to localStorage", e)
  }
}

// ── Videos storage ─────────────────────────────────────────────────────────

const VIDEO_STORAGE_KEY = 'enm_videos_data'

export function loadVideosFromStorage(): VideoCourse[] {
  try {
    const raw = localStorage.getItem(VIDEO_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn("Could not read videos from localStorage", e)
  }
  return INITIAL_VIDEO_COURSES
}

export function saveVideosToStorage(courses: VideoCourse[]): void {
  try {
    localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(courses))
  } catch (e) {
    console.error("Could not save videos to localStorage", e)
  }
}

// ── Activity storage ───────────────────────────────────────────────────────

const ACTIVITY_STORAGE_KEY = 'enm_activity_data'

export function loadActivityFromStorage(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn("Could not read activity from localStorage", e)
  }
  return []
}

export function saveActivityToStorage(entries: ActivityEntry[]): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(entries))
  } catch (e) {
    console.error("Could not save activity to localStorage", e)
  }
}

export function recordActivity(
  entries: ActivityEntry[],
  date: string,
  delta: { pagesRead?: number; videosWatched?: number; examsCompleted?: number }
): ActivityEntry[] {
  const existing = entries.find((e) => e.date === date)
  if (existing) {
    return entries.map((e) =>
      e.date === date
        ? {
            ...e,
            pagesRead: Math.max(0, e.pagesRead + (delta.pagesRead ?? 0)),
            videosWatched: Math.max(0, e.videosWatched + (delta.videosWatched ?? 0)),
            examsCompleted: Math.max(0, (e.examsCompleted ?? 0) + (delta.examsCompleted ?? 0)),
          }
        : e
    )
  }
  return [
    ...entries,
    {
      date,
      pagesRead: Math.max(0, delta.pagesRead ?? 0),
      videosWatched: Math.max(0, delta.videosWatched ?? 0),
      examsCompleted: Math.max(0, delta.examsCompleted ?? 0),
    },
  ]
}

// ── Exams storage ──────────────────────────────────────────────────────────

export const INITIAL_EXAMS: MockExam[] = [
  {
    id: 'exam-1',
    title: 'Concours Blanc #1 — Pénal & Civil',
    iconName: 'ClipboardList',
    subject: 'Droit Pénal',
    subjectColor: 'red',
    date: getFutureDateString(-7),
    deadline: getFutureDateString(3),
    durationMin: 240,
    status: 'done',
    notes: 'Première session complète. Retravailler la structuration des arguments en pénal.',
    updatedAt: Date.now() - 3600000 * 48,
    questions: [
      { id: 'q-1-1', label: 'Note de synthèse', maxScore: 20, score: 14, notes: 'Bonne sélection des idées, manque de rigueur formelle.' },
      { id: 'q-1-2', label: 'Cas pratique pénal', maxScore: 20, score: 11, notes: 'Qualification correcte, développement insuffisant.' },
      { id: 'q-1-3', label: 'Commentaire d\'arrêt', maxScore: 20, score: 15 },
    ],
  },
  {
    id: 'exam-2',
    title: 'Concours Blanc #2 — Procédure Civile',
    iconName: 'PenLine',
    subject: 'Droit Civil',
    subjectColor: 'blue',
    date: getFutureDateString(5),
    deadline: getFutureDateString(12),
    durationMin: 180,
    status: 'planned',
    notes: 'Prévoir de revoir les fins de non-recevoir avant la session.',
    updatedAt: Date.now() - 3600000 * 24,
    questions: [
      { id: 'q-2-1', label: 'Note de synthèse', maxScore: 20 },
      { id: 'q-2-2', label: 'Cas pratique procédure', maxScore: 20 },
    ],
  },
  {
    id: 'exam-3',
    title: 'Entraînement Méthodologie ENM',
    iconName: 'SquarePen',
    subject: 'Méthodologie',
    subjectColor: 'purple',
    date: getFutureDateString(-2),
    deadline: getFutureDateString(1),
    durationMin: 90,
    status: 'in_progress',
    notes: 'Correction en cours avec le tuteur.',
    updatedAt: Date.now() - 3600000 * 6,
    questions: [
      { id: 'q-3-1', label: 'Note de synthèse', maxScore: 20, score: 13 },
    ],
  },
]

const EXAM_STORAGE_KEY = 'enm_exams_data'

export function loadExamsFromStorage(): MockExam[] {
  try {
    const raw = localStorage.getItem(EXAM_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn("Could not read exams from localStorage", e)
  }
  return INITIAL_EXAMS
}

export function saveExamsToStorage(exams: MockExam[]): void {
  try {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exams))
  } catch (e) {
    console.error("Could not save exams to localStorage", e)
  }
}
