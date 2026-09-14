import React from "react"
import { ChevronRight, Play, CheckCircle2 } from "lucide-react"
import { PolyIcon } from "@/components/PolyIcon"
import { DeadlineBadge } from "@/components/DeadlineBadge"
import type { VideoCourse } from "@/types"

interface VideoCardProps {
  course: VideoCourse
  onSelect: (course: VideoCourse) => void
  onToggleLesson: (courseId: string, moduleId: string, lessonId: string) => void
}

function getCourseStats(course: VideoCourse) {
  const total = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const watched = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.watched).length,
    0
  )
  const pct = total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0
  const totalMin = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.durationMin ?? 0), 0),
    0
  )
  return { total, watched, pct, totalMin }
}

export const VideoCard: React.FC<VideoCardProps> = ({ course, onSelect, onToggleLesson }) => {
  const { total, watched, pct, totalMin } = getCourseStats(course)
  const isComplete = pct >= 100

  // Récupère toutes les leçons aplaties pour un accès rapide
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  )

  // Prochaine leçon non regardée
  const nextLesson = allLessons.find((l) => !l.watched)

  return (
    <div
      onClick={() => onSelect(course)}
      className="group relative flex flex-col bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 cursor-pointer hover:border-[var(--color-video)]/40 hover:shadow-sm transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] group-hover:bg-[var(--color-video-light)] group-hover:text-[var(--color-video)] transition-colors">
          <PolyIcon name={course.iconName} className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5" />
      </div>

      {/* Title & subject */}
      <div className="mb-4 flex-1">
        <h3 className="text-base font-semibold text-[var(--color-foreground)] leading-snug line-clamp-2 mb-1.5">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {course.subject && (
            <p className="text-sm text-[var(--color-muted-foreground)]">{course.subject}</p>
          )}
          {course.deadline && <DeadlineBadge deadline={course.deadline} />}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--color-muted-foreground)]">
            {watched} / {total} vidéos
            {totalMin > 0 && (
              <span className="ml-1 opacity-60">· {Math.round(totalMin / 60)}h{String(totalMin % 60).padStart(2, "0")}</span>
            )}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: isComplete ? "var(--color-video)" : pct > 0 ? "var(--color-video-muted)" : "var(--color-muted-foreground)", opacity: pct > 0 ? 1 : 0.5 }}
          >
            {pct}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--color-secondary)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              backgroundColor: isComplete ? "var(--color-video)" : pct > 0 ? "var(--color-video-muted)" : "transparent",
            }}
          />
        </div>
      </div>

      {/* Modules mini-view */}
      <div className="mb-3 space-y-1">
        {course.modules.slice(0, 3).map((mod) => {
          const modWatched = mod.lessons.filter((l) => l.watched).length
          const modTotal = mod.lessons.length
          const modPct = modTotal > 0 ? Math.round((modWatched / modTotal) * 100) : 0
          return (
            <div key={mod.id} className="flex items-center gap-2">
              <div
                className="flex-1 h-0.5 rounded-full bg-[var(--color-secondary)]"
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${modPct}%`, backgroundColor: modPct >= 100 ? "var(--color-video)" : "var(--color-video-muted)" }}
                />
              </div>
              <span className="text-[10px] text-[var(--color-muted-foreground)] w-12 text-right shrink-0">
                {modWatched}/{modTotal}
              </span>
            </div>
          )
        })}
        {course.modules.length > 3 && (
          <p className="text-[10px] text-[var(--color-muted-foreground)]">+{course.modules.length - 3} autres modules</p>
        )}
      </div>

      {/* Quick action: toggle next lesson */}
      <div
        className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {isComplete ? (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-video)] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Toutes vues
          </div>
        ) : nextLesson ? (
          <button
            type="button"
            onClick={() => onToggleLesson(course.id, nextLesson.moduleId, nextLesson.id)}
            className="flex items-center gap-1.5 flex-1 py-1.5 px-2.5 text-xs font-medium rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-video-light)] hover:text-[var(--color-video)] text-[var(--color-muted-foreground)] transition-colors"
          >
            <Play className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{nextLesson.title}</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
