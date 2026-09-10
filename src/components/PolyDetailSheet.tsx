import React, { useState, useEffect } from "react"
import { X, Trash2, BookOpen, Check } from "lucide-react"
import { PolyIcon, ICON_OPTIONS } from "@/components/PolyIcon"
import type { Poly, LucideIconName } from "@/types"

interface PolyDetailSheetProps {
  poly: Poly | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updated: Poly) => void
  onDelete: (id: string) => void
}

export const PolyDetailSheet: React.FC<PolyDetailSheetProps> = ({
  poly, isOpen, onClose, onUpdate, onDelete,
}) => {
  const [title, setTitle] = useState("")
  const [iconName, setIconName] = useState<LucideIconName>("BookOpen")
  const [subject, setSubject] = useState("")
  const [totalPages, setTotalPages] = useState(100)
  const [readPages, setReadPages] = useState(0)
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")
  const [showIconPicker, setShowIconPicker] = useState(false)

  useEffect(() => {
    if (poly) {
      setTitle(poly.title)
      setIconName(poly.iconName || "BookOpen")
      setSubject(poly.subject || "")
      setTotalPages(poly.totalPages)
      setReadPages(poly.readPages)
      setDeadline(poly.deadline || "")
      setNotes(poly.notes || "")
      setShowIconPicker(false)
    }
  }, [poly])

  if (!poly) return null

  const safeTotal = Math.max(1, totalPages)
  const safeRead = Math.max(0, Math.min(readPages, safeTotal))
  const pct = Math.min(100, Math.round((safeRead / safeTotal) * 100))
  const isComplete = pct >= 100

  const handleSave = () => {
    onUpdate({ ...poly, title: title.trim() || "Sans titre", iconName, subject, totalPages: safeTotal, readPages: safeRead, deadline, notes, updatedAt: Date.now() })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Supprimer "${poly.title}" ?`)) { onDelete(poly.id); onClose() }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-muted-foreground)]">Détails du polycopié</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Icon + Title */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="p-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[#fce7f3] hover:text-[#f472b6] text-[var(--color-muted-foreground)] transition-colors"
            >
              <PolyIcon name={iconName} className="w-5 h-5" />
            </button>
            {showIconPicker && (
              <div className="absolute top-12 left-0 z-10 p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl grid grid-cols-4 gap-2 w-52">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => { setIconName(opt.name); setShowIconPicker(false) }}
                    className={`p-2 rounded-xl transition-colors flex items-center justify-center ${iconName === opt.name ? "bg-[#fce7f3] text-[#f472b6]" : "hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"}`}
                    title={opt.label}
                  >
                    <PolyIcon name={opt.name} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-lg font-bold bg-transparent border-none outline-none text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
              placeholder="Titre du polycopié..."
            />
          </div>

          {/* Progress Display */}
          <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <div className="flex items-end justify-between mb-3">
              <span className="text-3xl font-bold" style={{ color: pct > 0 ? "#f472b6" : "var(--color-muted-foreground)" }}>{pct}%</span>
              <span className="text-xs text-[var(--color-muted-foreground)]">{safeRead} / {safeTotal} pages</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--color-card)]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: isComplete ? "#f472b6" : pct > 0 ? "#f9a8d4" : "transparent" }}
              />
            </div>
          </div>

          {/* Pages stepper */}
          <div>
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-2 block">Pages lues</label>
            <div className="flex items-center gap-1.5 mb-2">
              {[-10, -5, -1, 1, 5, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => setReadPages(Math.max(0, Math.min(safeTotal, safeRead + d)))}
                  className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-[var(--color-secondary)] hover:bg-[#fce7f3] hover:text-[#f472b6] text-[var(--color-muted-foreground)] transition-colors"
                >
                  {d > 0 ? `+${d}` : d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={safeRead}
                min={0}
                max={safeTotal}
                onChange={(e) => setReadPages(parseInt(e.target.value) || 0)}
                className="w-20 text-center text-sm font-semibold py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
              />
              <span className="text-xs text-[var(--color-muted-foreground)]">sur</span>
              <input
                type="number"
                value={safeTotal}
                min={1}
                onChange={(e) => setTotalPages(parseInt(e.target.value) || 1)}
                className="w-20 text-center text-sm font-semibold py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
              />
              <span className="text-xs text-[var(--color-muted-foreground)]">pages</span>
              {!isComplete && (
                <button
                  onClick={() => setReadPages(safeTotal)}
                  className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-[#fce7f3] text-[#f472b6] hover:bg-[#f472b6] hover:text-white transition-colors font-medium"
                >
                  Tout marquer
                </button>
              )}
            </div>
          </div>

          {/* Matière + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Matière</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Droit Pénal..."
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Échéance</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes de révision..."
              rows={4}
              className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm rounded-xl border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 text-sm rounded-xl bg-[var(--color-foreground)] text-[var(--color-background)] font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  )
}
