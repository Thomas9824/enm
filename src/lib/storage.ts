import type { Poly } from "@/types"

export function getFutureDateString(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
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
