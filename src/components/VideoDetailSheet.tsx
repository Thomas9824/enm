import React, { useState, useEffect } from "react"
import { X, Trash2, Check, ChevronDown, ChevronRight, Play, CheckCircle2 } from "lucide-react"
import { PolyIcon, ICON_OPTIONS } from "@/components/PolyIcon"
import type { VideoCourse, VideoModule, VideoLesson, LucideIconName } from "@/types"

interface VideoDetailSheetProps {
  course: VideoCourse | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updated: VideoCourse) => void
  onDelete: (id: string) => void
}

export const VideoDetailSheet: React.FC<VideoDetailSheetProps> = ({
  course, isOpen, onClose, onUpdate, onDelete,
}) => {
  const [title, setTitle] = useState("")
  const [iconName, setIconName] = useState<LucideIconName>("Video")
  const [subject, setSubject] = useState("")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")
  const [modules, setModules] = useState<VideoModule[]>([])
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (course) {
      setTitle(course.title)
      setIconName(course.iconName || "Video")
      setSubject(course.subject || "")
      setDeadline(course.deadline || "")
      setNotes(course.notes || "")
      setModules(course.modules)
      setShowIconPicker(false)
      // Expand all by default
      setExpandedModules(new Set(course.modules.map((m) => m.id)))
    }
  }, [course])

  if (!course || !isOpen) return null

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const watchedLessons = modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.watched).length, 0)
  const pct = totalLessons > 0 ? Math.min(100, Math.round((watchedLessons / totalLessons) * 100)) : 0
  const isComplete = pct >= 100

  const toggleLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, watched: !l.watched } : l) }
          : m
      )
    )
  }

  const toggleModuleAll = (moduleId: string, watched: boolean) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => ({ ...l, watched })) }
          : m
      )
    )
  }

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const addModule = () => {
    const id = `m-new-${Date.now()}`
    setModules((prev) => [...prev, { id, title: "Nouveau module", lessons: [] }])
    setExpandedModules((prev) => new Set([...prev, id]))
  }

  const updateModuleTitle = (moduleId: string, newTitle: string) => {
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, title: newTitle } : m))
  }

  const deleteModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId))
  }

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { id: `l-new-${Date.now()}`, title: "Nouvelle vidéo", watched: false }] }
          : m
      )
    )
  }

  const updateLesson = (moduleId: string, lessonId: string, patch: Partial<VideoLesson>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, ...patch } : l) }
          : m
      )
    )
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    )
  }

  const handleSave = () => {
    onUpdate({ ...course, title: title.trim() || "Sans titre", iconName, subject, deadline, notes, modules, updatedAt: Date.now() })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Supprimer "${course.title}" ?`)) { onDelete(course.id); onClose() }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-muted-foreground)]">Détails du cours vidéo</span>
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
              className="p-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-video-light)] hover:text-[var(--color-video)] text-[var(--color-muted-foreground)] transition-colors"
            >
              <PolyIcon name={iconName} className="w-5 h-5" />
            </button>
            {showIconPicker && (
              <div className="absolute top-12 left-0 z-10 p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl grid grid-cols-4 gap-2 w-52">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => { setIconName(opt.name); setShowIconPicker(false) }}
                    className={`p-2 rounded-xl transition-colors flex items-center justify-center ${iconName === opt.name ? "bg-[var(--color-video-light)] text-[var(--color-video)]" : "hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"}`}
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
              placeholder="Titre du cours vidéo..."
            />
          </div>

          {/* Progress */}
          <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
            <div className="flex items-end justify-between mb-3">
              <span className="text-3xl font-bold" style={{ color: pct > 0 ? "var(--color-video)" : "var(--color-muted-foreground)" }}>{pct}%</span>
              <span className="text-xs text-[var(--color-muted-foreground)]">{watchedLessons} / {totalLessons} vidéos</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--color-card)]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: isComplete ? "var(--color-video)" : pct > 0 ? "var(--color-video-muted)" : "transparent" }}
              />
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
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-video)]/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Échéance</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-video)]/30"
              />
            </div>
          </div>

          {/* Modules & Lessons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Modules & vidéos</label>
              <button
                onClick={addModule}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-video-light)] hover:text-[var(--color-video)] text-[var(--color-muted-foreground)] transition-colors font-medium"
              >
                + Module
              </button>
            </div>
            <div className="space-y-2">
              {modules.map((mod) => {
                const modWatched = mod.lessons.filter((l) => l.watched).length
                const modTotal = mod.lessons.length
                const modPct = modTotal > 0 ? Math.round((modWatched / modTotal) * 100) : 0
                const isExpanded = expandedModules.has(mod.id)

                return (
                  <div key={mod.id} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                    {/* Module header */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-secondary)]">
                      <button onClick={() => toggleExpand(mod.id)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors shrink-0">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                      <input
                        value={mod.title}
                        onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-xs font-semibold bg-transparent border-none outline-none text-[var(--color-foreground)]"
                      />
                      <span className="text-[10px] text-[var(--color-muted-foreground)] shrink-0">{modWatched}/{modTotal}</span>
                      {modPct < 100 ? (
                        <button
                          onClick={() => toggleModuleAll(mod.id, true)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-card)] hover:bg-[var(--color-video-light)] hover:text-[var(--color-video)] text-[var(--color-muted-foreground)] transition-colors shrink-0"
                        >
                          Tout cocher
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleModuleAll(mod.id, false)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-video-light)] text-[var(--color-video)] hover:bg-[var(--color-card)] hover:text-[var(--color-muted-foreground)] transition-colors shrink-0"
                        >
                          Décocher
                        </button>
                      )}
                      <button
                        onClick={() => deleteModule(mod.id)}
                        className="text-[var(--color-muted-foreground)] hover:text-red-500 transition-colors shrink-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="divide-y divide-[var(--color-border)]">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 px-3 py-2">
                            <button
                              onClick={() => toggleLesson(mod.id, lesson.id)}
                              className={`shrink-0 transition-colors ${lesson.watched ? "text-[var(--color-video)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-video)]"}`}
                            >
                              {lesson.watched ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <input
                              value={lesson.title}
                              onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                              className={`flex-1 text-xs bg-transparent border-none outline-none ${lesson.watched ? "line-through text-[var(--color-muted-foreground)]" : "text-[var(--color-foreground)]"}`}
                            />
                            <input
                              type="number"
                              min={0}
                              value={lesson.durationMin ?? ""}
                              onChange={(e) => updateLesson(mod.id, lesson.id, { durationMin: parseInt(e.target.value) || undefined })}
                              placeholder="min"
                              className="w-12 text-[10px] text-center bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-md py-0.5 text-[var(--color-muted-foreground)] focus:outline-none"
                            />
                            <button
                              onClick={() => deleteLesson(mod.id, lesson.id)}
                              className="text-[var(--color-muted-foreground)] hover:text-red-500 transition-colors shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <div className="px-3 py-2">
                          <button
                            onClick={() => addLesson(mod.id)}
                            className="text-[10px] text-[var(--color-muted-foreground)] hover:text-[var(--color-video)] transition-colors"
                          >
                            + Ajouter une vidéo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes..."
              rows={3}
              className="w-full text-sm py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-video)]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-[var(--color-border)] flex gap-2">
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
