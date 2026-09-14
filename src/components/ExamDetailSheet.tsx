import React, { useState, useEffect } from "react"
import { X, Trash2, Check, Plus, Circle, AlertCircle, CheckCircle2 } from "lucide-react"
import { PolyIcon, ICON_OPTIONS } from "@/components/PolyIcon"
import type { MockExam, ExamQuestion, ExamStatus, LucideIconName, TagColor } from "@/types"

interface ExamDetailSheetProps {
  exam: MockExam | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updated: MockExam) => void
  onDelete: (id: string) => void
}

const STATUS_OPTIONS: { value: ExamStatus; label: string; color: string }[] = [
  { value: "planned",     label: "Planifié",   color: "#6366f1" },
  { value: "in_progress", label: "En cours",   color: "var(--color-exam)" },
  { value: "done",        label: "Terminé",    color: "#10b981" },
]

export const ExamDetailSheet: React.FC<ExamDetailSheetProps> = ({
  exam, isOpen, onClose, onUpdate, onDelete,
}) => {
  const [title, setTitle] = useState("")
  const [iconName, setIconName] = useState<LucideIconName>("ClipboardList")
  const [subject, setSubject] = useState("")
  const [subjectColor, setSubjectColor] = useState<TagColor>("orange")
  const [date, setDate] = useState("")
  const [deadline, setDeadline] = useState("")
  const [durationMin, setDurationMin] = useState<number | "">("")
  const [status, setStatus] = useState<ExamStatus>("planned")
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [notes, setNotes] = useState("")
  const [showIconPicker, setShowIconPicker] = useState(false)

  useEffect(() => {
    if (exam) {
      setTitle(exam.title)
      setIconName(exam.iconName || "ClipboardList")
      setSubject(exam.subject || "")
      setSubjectColor(exam.subjectColor || "orange")
      setDate(exam.date || "")
      setDeadline(exam.deadline || "")
      setDurationMin(exam.durationMin ?? "")
      setStatus(exam.status)
      setQuestions(exam.questions)
      setNotes(exam.notes || "")
      setShowIconPicker(false)
    }
  }, [exam])

  if (!exam || !isOpen) return null

  // ── Stats ──
  const scored = questions.filter((q) => q.score !== undefined)
  const totalScore = scored.reduce((a, q) => a + (q.score ?? 0), 0)
  const totalMax = scored.reduce((a, q) => a + q.maxScore, 0)
  const average = totalMax > 0 ? Math.round((totalScore / totalMax) * 20 * 10) / 10 : null

  // ── Question handlers ──
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `q-new-${Date.now()}`, label: "Nouvelle épreuve", maxScore: 20 },
    ])
  }

  const updateQuestion = (id: string, patch: Partial<ExamQuestion>) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, ...patch } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSave = () => {
    onUpdate({
      ...exam,
      title: title.trim() || "Sans titre",
      iconName,
      subject,
      subjectColor,
      date: date || undefined,
      deadline: deadline || undefined,
      durationMin: durationMin !== "" ? Number(durationMin) : undefined,
      status,
      questions,
      notes,
      updatedAt: Date.now(),
    })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Supprimer "${exam.title}" ?`)) { onDelete(exam.id); onClose() }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-muted-foreground)]">Détails du concours blanc</span>
          <div className="flex items-center gap-1">
            <button onClick={handleDelete} className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-7 space-y-6">

          {/* Icon + Title */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="p-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-exam-light)] hover:text-[var(--color-exam)] text-[var(--color-muted-foreground)] transition-colors shrink-0"
            >
              <PolyIcon name={iconName} className="w-5 h-5" />
            </button>
            {showIconPicker && (
              <div className="absolute top-12 left-0 z-10 p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl grid grid-cols-5 gap-2 w-60">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => { setIconName(opt.name); setShowIconPicker(false) }}
                    className={`p-2 rounded-xl transition-colors flex items-center justify-center ${iconName === opt.name ? "bg-[var(--color-exam-light)] text-[var(--color-exam)]" : "hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"}`}
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
              placeholder="Titre du concours blanc..."
            />
          </div>

          {/* Statut */}
          <div>
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-2 block">Statut</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    status === s.value
                      ? "border-transparent text-white"
                      : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] bg-[var(--color-secondary)]"
                  }`}
                  style={status === s.value ? { backgroundColor: s.color } : {}}
                >
                  {s.value === "planned" && <Circle className="w-3.5 h-3.5" />}
                  {s.value === "in_progress" && <AlertCircle className="w-3.5 h-3.5" />}
                  {s.value === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats globales */}
          {average !== null && (
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Moyenne générale</p>
                  <p className="text-4xl font-bold" style={{ color: average >= 10 ? "#10b981" : "#ef4444" }}>
                    {average}
                    <span className="text-lg font-normal text-[var(--color-muted-foreground)]">/20</span>
                  </p>
                </div>
                <div className="text-right text-sm text-[var(--color-muted-foreground)]">
                  <p>{scored.length}/{questions.length} notées</p>
                  <p>{totalScore} / {totalMax} pts</p>
                </div>
              </div>
              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-[var(--color-card)]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((totalScore / totalMax) * 100)}%`,
                    backgroundColor: average >= 10 ? "#10b981" : "#ef4444",
                  }}
                />
              </div>
            </div>
          )}

          {/* Matière + Durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Matière</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Droit Pénal..."
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Durée (min)</label>
              <input
                type="number"
                min={0}
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
                placeholder="ex: 240"
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30"
              />
            </div>
          </div>

          {/* Date passage + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Date de passage</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Deadline correction</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30"
              />
            </div>
          </div>

          {/* Épreuves / Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Épreuves & notes</label>
              <button
                onClick={addQuestion}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-exam-light)] hover:text-[var(--color-exam)] text-[var(--color-muted-foreground)] transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>

            <div className="space-y-2">
              {questions.map((q) => {
                const notePct = q.score !== undefined ? (q.score / q.maxScore) * 100 : null
                return (
                  <div key={q.id} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                    {/* Question header row */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--color-secondary)]">
                      <input
                        value={q.label}
                        onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                        className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-[var(--color-foreground)]"
                        placeholder="Nom de l'épreuve..."
                      />
                      {/* Score input */}
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={q.maxScore}
                          step={0.5}
                          value={q.score ?? ""}
                          onChange={(e) => updateQuestion(q.id, { score: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
                          placeholder="—"
                          className="w-14 text-sm text-center py-1 px-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-exam)]/40 font-semibold"
                          style={{ color: notePct !== null ? (notePct >= 50 ? "#10b981" : "#ef4444") : undefined }}
                        />
                        <span className="text-xs text-[var(--color-muted-foreground)]">/</span>
                        <input
                          type="number"
                          min={1}
                          value={q.maxScore}
                          onChange={(e) => updateQuestion(q.id, { maxScore: parseInt(e.target.value) || 20 })}
                          className="w-12 text-sm text-center py-1 px-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="text-[var(--color-muted-foreground)] hover:text-red-500 transition-colors shrink-0 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Note bar */}
                    {notePct !== null && (
                      <div className="px-3 py-1.5">
                        <div className="h-1 w-full rounded-full bg-[var(--color-border)]">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${notePct}%`, backgroundColor: notePct >= 50 ? "#10b981" : "#ef4444" }}
                          />
                        </div>
                      </div>
                    )}
                    {/* Notes de l'épreuve */}
                    <div className="px-3 py-2 border-t border-[var(--color-border)]">
                      <input
                        value={q.notes ?? ""}
                        onChange={(e) => updateQuestion(q.id, { notes: e.target.value || undefined })}
                        placeholder="Notes / commentaires sur cette épreuve..."
                        className="w-full text-xs bg-transparent border-none outline-none text-[var(--color-muted-foreground)] placeholder:text-[var(--color-muted-foreground)]/50"
                      />
                    </div>
                  </div>
                )
              })}

              {questions.length === 0 && (
                <p className="text-sm text-[var(--color-muted-foreground)] text-center py-4 border border-dashed border-[var(--color-border)] rounded-xl">
                  Aucune épreuve — cliquer sur "+ Ajouter"
                </p>
              )}
            </div>
          </div>

          {/* Notes globales */}
          <div>
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Notes générales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, points à améliorer..."
              rows={3}
              className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[var(--color-border)] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm rounded-xl border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm rounded-xl bg-[var(--color-foreground)] text-[var(--color-background)] font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  )
}
