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
  | 'Bookmark';

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

export type ViewMode = 'gallery' | 'table';

export type StatusFilter = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export type SortOption = 
  | 'progress-desc' 
  | 'progress-asc' 
  | 'pages-remaining-desc' 
  | 'title-asc' 
  | 'date-newest';
