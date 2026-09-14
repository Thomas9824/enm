import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PolyIcon, ICON_OPTIONS } from "@/components/PolyIcon"
import type { MockExam, LucideIconName, TagColor, ExamStatus } from "@/types"

interface CreateExamDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (exam: Omit<MockExam, "id" | "updatedAt">) => void
  existingSubjects: string[]
}

const TAG_COLORS: TagColor[] = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'gray']

export const CreateExamDialog: React.FC<CreateExamDialogProps> = ({
  isOpen, onClose, onCreate, existingSubjects,
}) => {
  const [title, setTitle] = useState("")
  const [iconName, setIconName] = useState<LucideIconName>("ClipboardList")
  const [subject, setSubject] = useState("")
  const [subjectColor, setSubjectColor] = useState<TagColor>("orange")
  const [date, setDate] = useState("")
  const [deadline, setDeadline] = useState("")
  const [durationMin, setDurationMin] = useState<number | "">("")
  const [status, setStatus] = useState<ExamStatus>("planned")
  const [notes, setNotes] = useState("")

  const reset = () => {
    setTitle(""); setIconName("ClipboardList"); setSubject(""); setSubjectColor("orange")
    setDate(""); setDeadline(""); setDurationMin(""); setStatus("planned"); setNotes("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      iconName,
      subject: subject.trim() || "Général",
      subjectColor,
      date: date || undefined,
      deadline: deadline || undefined,
      durationMin: durationMin !== "" ? Number(durationMin) : undefined,
      status,
      questions: [],
      notes: notes.trim() || undefined,
    })
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-amber-100 text-amber-600 dark:bg-amber-950/40">
              <PolyIcon name={iconName} className="w-4 h-4" />
            </div>
            <span>Nouveau concours blanc</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Titre */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Titre <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Concours Blanc #3 — Droit Pénal..."
              required
              className="h-9 text-xs"
              autoFocus
            />
          </div>

          {/* Icône */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1.5">Icône</label>
            <div className="grid grid-cols-6 gap-1.5 p-2 rounded-md border border-border bg-muted/30">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setIconName(opt.name)}
                  className={`flex items-center justify-center p-2 rounded hover:bg-muted transition-colors ${
                    iconName === opt.name
                      ? "bg-amber-100 text-amber-600 border border-amber-300/50 dark:bg-amber-950/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={opt.label}
                >
                  <PolyIcon name={opt.name} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Matière + Couleur */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Matière</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Droit Pénal..."
                className="h-8 text-xs"
                list="exam-subjects-list"
              />
              <datalist id="exam-subjects-list">
                {existingSubjects.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Couleur</label>
              <select
                value={subjectColor}
                onChange={(e) => setSubjectColor(e.target.value as TagColor)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                {TAG_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ExamStatus)}
              className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="planned">Planifié</option>
              <option value="in_progress">En cours</option>
              <option value="done">Terminé</option>
            </select>
          </div>

          {/* Date passage + Durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Date de passage</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-xs" />
            </div>
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Durée (min)</label>
              <Input
                type="number"
                min={0}
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
                placeholder="ex: 240"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Deadline correction */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1">Deadline correction (optionnel)</label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-8 text-xs" />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, points à préparer..."
              rows={2}
              className="w-full rounded-md border border-input bg-background p-2 text-xs leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50"
            />
          </div>

          <p className="text-[10px] text-muted-foreground">
            💡 Les épreuves et notes s'ajoutent depuis le détail du concours.
          </p>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => { reset(); onClose() }} className="h-8 text-xs">
              Annuler
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">
              Créer le concours
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
