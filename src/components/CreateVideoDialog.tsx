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
import type { VideoCourse, LucideIconName, TagColor } from "@/types"

interface CreateVideoDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (course: Omit<VideoCourse, "id" | "updatedAt">) => void
  existingSubjects: string[]
}

const TAG_COLORS: TagColor[] = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'gray']

export const CreateVideoDialog: React.FC<CreateVideoDialogProps> = ({
  isOpen, onClose, onCreate, existingSubjects,
}) => {
  const [title, setTitle] = useState("")
  const [iconName, setIconName] = useState<LucideIconName>("Video")
  const [subject, setSubject] = useState("")
  const [subjectColor, setSubjectColor] = useState<TagColor>("purple")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      iconName,
      subject: subject.trim() || "Général",
      subjectColor,
      deadline: deadline || undefined,
      notes: notes.trim() || undefined,
      modules: [],
    })

    setTitle("")
    setIconName("Video")
    setSubject("")
    setSubjectColor("purple")
    setDeadline("")
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-[#ede9fe] text-[#7c3aed]">
              <PolyIcon name={iconName} className="w-4 h-4" />
            </div>
            <span>Nouveau Cours Vidéo</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Titre du cours <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Droit Pénal — Cours Magistral..."
              required
              className="h-9 text-xs"
              autoFocus
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1.5">
              Icône thématique
            </label>
            <div className="grid grid-cols-6 gap-1.5 p-2 rounded-md border border-border bg-muted/30">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => setIconName(opt.name)}
                  className={`flex items-center justify-center p-2 rounded hover:bg-muted transition-colors ${
                    iconName === opt.name
                      ? "bg-[#ede9fe] text-[#7c3aed] border border-[#a78bfa]/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={opt.label}
                >
                  <PolyIcon name={opt.name} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-muted-foreground mb-1">Matière</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Droit Civil..."
                className="h-8 text-xs"
                list="video-subjects-list"
              />
              <datalist id="video-subjects-list">
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

          {/* Deadline */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1">
              Date cible / Examen (optionnel)
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-muted-foreground mb-1">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chapitres prioritaires, remarques..."
              rows={2}
              className="w-full rounded-md border border-input bg-background p-2 text-xs leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <p className="text-[10px] text-muted-foreground">
            💡 Les modules et vidéos s'ajoutent depuis le détail du cours.
          </p>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Annuler
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white">
              Créer le cours
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
