import React, { useState } from "react"
import { Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TagColor } from "@/types"

interface QuickAddBarProps {
  onAddPoly: (data: {
    title: string;
    subject: string;
    subjectColor: TagColor;
    totalPages: number;
    readPages: number;
  }) => void;
  existingSubjects: string[];
}

const TAG_COLORS: TagColor[] = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'gray']

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onAddPoly, existingSubjects }) => {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [totalPages, setTotalPages] = useState<number>(120)
  const [readPages, setReadPages] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const randomColor = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
    onAddPoly({
      title: title.trim(),
      subject: subject.trim() || "Général",
      subjectColor: randomColor,
      totalPages: Math.max(1, totalPages),
      readPages: Math.max(0, Math.min(readPages, totalPages)),
    })

    setTitle("")
    setSubject("")
    setReadPages(0)
    setTotalPages(120)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-dashed border-border/90 bg-card/60 hover:bg-card hover:border-primary/40 focus-within:border-primary focus-within:bg-card transition-all mb-6 text-xs"
    >
      <div className="flex items-center gap-1.5 text-primary font-medium pl-1">
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Ajout rapide :</span>
      </div>

      <Input
        type="text"
        placeholder="Nom du polycopié (ex: Droit Pénal Spécial)..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-8 min-w-[200px] flex-2 bg-background text-xs"
        required
      />

      <div className="relative min-w-[130px] flex-1">
        <Input
          type="text"
          placeholder="Matière..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-8 bg-background text-xs"
          list="quick-subjects-list"
        />
        <datalist id="quick-subjects-list">
          {existingSubjects.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="flex items-center gap-1 bg-background border border-input rounded-md px-2 py-0.5">
        <input
          type="number"
          min="0"
          value={readPages}
          onChange={(e) => setReadPages(parseInt(e.target.value, 10) || 0)}
          className="w-11 text-center bg-transparent border-none text-xs font-semibold text-foreground focus:outline-none"
          title="Pages déjà lues"
        />
        <span className="text-muted-foreground">/</span>
        <input
          type="number"
          min="1"
          value={totalPages}
          onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 1)}
          className="w-11 text-center bg-transparent border-none text-xs font-semibold text-foreground focus:outline-none"
          title="Nombre total de pages"
        />
        <span className="text-[11px] text-muted-foreground pr-1">pages</span>
      </div>

      <Button type="submit" size="sm" variant="default" className="h-8 text-xs font-medium ml-auto">
        <Plus className="w-3.5 h-3.5 mr-1" />
        <span>Créer le bloc</span>
      </Button>
    </form>
  )
}
