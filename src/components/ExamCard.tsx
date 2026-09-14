import React from "react"
import { ChevronRight, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { PolyIcon } from "@/components/PolyIcon"
import { DeadlineBadge } from "@/components/DeadlineBadge"
import type { MockExam, ExamStatus } from "@/types"

interface ExamCardProps {
  exam: MockExam
  onSelect: (exam: MockExam) => void
}

function getExamAverage(exam: MockExam): number | null {
  const scored = exam.questions.filter((q) => q.score !== undefined)
  if (scored.length === 0) return null
  const total = scored.reduce((a, q) => a + (q.score ?? 0), 0)
  const max = scored.reduce((a, q) => a + q.maxScore, 0)
  return max > 0 ? Math.round((total / max) * 20 * 10) / 10 : null
}

const STATUS_META: Record<ExamStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  planned: {
    label: "Planifié",
    color: "#6366f1",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    icon: <Circle className="w-3 h-3" />,
  },
  in_progress: {
    label: "En cours",
    color: "var(--color-exam)",
    bg: "bg-[var(--color-exam-light)]",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  done: {
    label: "Terminé",
    color: "#10b981",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onSelect }) => {
  const avg = getExamAverage(exam)
  const meta = STATUS_META[exam.status]
  const scoredCount = exam.questions.filter((q) => q.score !== undefined).length
  const totalQ = exam.questions.length

  const examDate = exam.date
    ? new Date(exam.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null

  return (
    <div
      onClick={() => onSelect(exam)}
      className="group relative flex flex-col bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 cursor-pointer hover:border-[var(--color-exam)]/50 hover:shadow-sm transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] group-hover:bg-[var(--color-exam-light)] group-hover:text-[var(--color-exam)] transition-colors">
          <PolyIcon name={exam.iconName} className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5" />
      </div>

      {/* Title + meta */}
      <div className="mb-5 flex-1">
        <h3 className="text-base font-semibold text-[var(--color-foreground)] leading-snug line-clamp-2 mb-1.5">
          {exam.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {exam.subject && (
            <span className="text-sm text-[var(--color-muted-foreground)]">{exam.subject}</span>
          )}
          {exam.deadline && <DeadlineBadge deadline={exam.deadline} />}
        </div>
      </div>

      {/* Note moyenne */}
      <div className="mb-4 p-3 rounded-xl bg-[var(--color-secondary)]">
        {avg !== null ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[var(--color-muted-foreground)] uppercase tracking-wider mb-0.5">Moyenne</p>
              <p className="text-2xl font-bold" style={{ color: avg >= 10 ? "#10b981" : "#ef4444" }}>
                {avg}<span className="text-sm font-normal text-[var(--color-muted-foreground)]">/20</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-muted-foreground)]">{scoredCount}/{totalQ} notées</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
            <Circle className="w-4 h-4 opacity-40" />
            <span className="text-sm">{totalQ} épreuve{totalQ > 1 ? "s" : ""} — pas encore notée{totalQ > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Footer : statut + durée + date */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${meta.bg}`}
          style={{ color: meta.color }}
        >
          {meta.icon}
          {meta.label}
        </span>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
          {exam.durationMin && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {exam.durationMin >= 60
                ? `${Math.floor(exam.durationMin / 60)}h${exam.durationMin % 60 ? String(exam.durationMin % 60).padStart(2, "0") : ""}`
                : `${exam.durationMin}min`}
            </span>
          )}
          {examDate && <span>{examDate}</span>}
        </div>
      </div>
    </div>
  )
}
