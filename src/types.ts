export type LucideIconName =
  | 'BookOpen'
  | 'Scale'
  | 'Landmark'
  | 'FileText'
  | 'GraduationCap'
  | 'Search'
  | 'Briefcase'
  | 'Scroll'
  | 'Brain'
  | 'Award'
  | 'Compass'
  | 'Bookmark'
  | 'Video'
  | 'PlayCircle'
  | 'Film'
  | 'Monitor'
  | 'TvMinimalPlay'
  | 'Tv'
  | 'ClipboardList'
  | 'Trophy'
  | 'Timer'
  | 'PenLine'
  | 'SquarePen';

export type TagColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray';

export interface Poly {
  id: string;
  title: string;
  iconName: LucideIconName;
  subject: string;
  subjectColor: TagColor;
  totalPages: number;
  readPages: number;
  deadline?: string;
  notes?: string;
  updatedAt: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  durationMin?: number;
  watched: boolean;
}

export interface VideoModule {
  id: string;
  title: string;
  lessons: VideoLesson[];
}

export interface VideoCourse {
  id: string;
  title: string;
  iconName: LucideIconName;
  subject: string;
  subjectColor: TagColor;
  modules: VideoModule[];
  deadline?: string;
  notes?: string;
  updatedAt: number;
}

export type ViewMode = 'gallery' | 'table';

export type StatusFilter = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export type SortOption = 
  | 'progress-desc' 
  | 'progress-asc' 
  | 'pages-remaining-desc' 
  | 'title-asc' 
  | 'date-newest';

export type AppTab = 'polys' | 'videos' | 'exams' | 'calendar';

/** Entrée d'activité journalière pour le calendrier */
export interface ActivityEntry {
  date: string; // YYYY-MM-DD
  pagesRead: number;
  videosWatched: number;
  examsCompleted: number;
}

// ── Concours blanc ──────────────────────────────────────────────────────────

export type ExamStatus = 'planned' | 'in_progress' | 'done';

export interface ExamQuestion {
  id: string;
  label: string;         // ex: "Note de synthèse"
  maxScore: number;      // ex: 20
  score?: number;        // note obtenue (undefined = pas encore noté)
  notes?: string;
}

export interface MockExam {
  id: string;
  title: string;
  iconName: LucideIconName;
  subject: string;
  subjectColor: TagColor;
  /** Date de passage (YYYY-MM-DD) */
  date?: string;
  /** Deadline de rendu / correction (YYYY-MM-DD) */
  deadline?: string;
  durationMin?: number;        // durée prévue en minutes
  status: ExamStatus;
  questions: ExamQuestion[];   // épreuves / sous-parties notées
  notes?: string;
  updatedAt: number;
}
