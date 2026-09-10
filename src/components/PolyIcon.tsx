import React from "react"
import {
  BookOpen,
  Scale,
  Landmark,
  FileText,
  GraduationCap,
  Search,
  Briefcase,
  Scroll,
  Brain,
  Award,
  Compass,
  Bookmark,
  type LucideProps
} from "lucide-react"
import type { LucideIconName } from "@/types"

interface PolyIconProps extends LucideProps {
  name?: LucideIconName;
}

export const ICON_OPTIONS: { name: LucideIconName; label: string }[] = [
  { name: 'BookOpen', label: 'Livre / Manuel' },
  { name: 'Scale', label: 'Balance / Droit' },
  { name: 'Landmark', label: 'Institution / Tribunal' },
  { name: 'FileText', label: 'Document / Polycopié' },
  { name: 'GraduationCap', label: 'Concours / Études' },
  { name: 'Brain', label: 'Méthodologie / Réflexion' },
  { name: 'Scroll', label: 'Textes / Jurisprudence' },
  { name: 'Briefcase', label: 'Affaires / Professionnel' },
  { name: 'Award', label: 'Objectif / Réussite' },
  { name: 'Compass', label: 'Orientation / Synthèse' },
  { name: 'Bookmark', label: 'Repère / Fiche' },
  { name: 'Search', label: 'Recherche / Analyse' },
]

export const PolyIcon: React.FC<PolyIconProps> = ({ name = 'BookOpen', className = "w-5 h-5", ...props }) => {
  switch (name) {
    case 'Scale':
      return <Scale className={className} {...props} />
    case 'Landmark':
      return <Landmark className={className} {...props} />
    case 'FileText':
      return <FileText className={className} {...props} />
    case 'GraduationCap':
      return <GraduationCap className={className} {...props} />
    case 'Search':
      return <Search className={className} {...props} />
    case 'Briefcase':
      return <Briefcase className={className} {...props} />
    case 'Scroll':
      return <Scroll className={className} {...props} />
    case 'Brain':
      return <Brain className={className} {...props} />
    case 'Award':
      return <Award className={className} {...props} />
    case 'Compass':
      return <Compass className={className} {...props} />
    case 'Bookmark':
      return <Bookmark className={className} {...props} />
    case 'BookOpen':
    default:
      return <BookOpen className={className} {...props} />
  }
}
