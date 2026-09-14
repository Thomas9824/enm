import React, { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, BookOpen, Play } from "lucide-react"
import type { ActivityEntry, Poly, VideoCourse } from "@/types"

interface CalendarViewProps {
  activity: ActivityEntry[]
  polys: Poly[]
  videos: VideoCourse[]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=dim, on veut lundi en premier → (0+6)%7=6, (1+6)%7=0, ...
  return (new Date(year, month, 1).getDay() + 6) % 7
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]
const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

export const CalendarView: React.FC<CalendarViewProps> = ({ activity, polys, videos }) => {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  // Index activity by date
  const activityByDate = useMemo(() => {
    const map: Record<string, ActivityEntry> = {}
    for (const e of activity) map[e.date] = e
    return map
  }, [activity])

  // Collect all deadlines
  const deadlines = useMemo(() => {
    const list: { date: string; title: string; type: "poly" | "video" }[] = []
    for (const p of polys) {
      if (p.deadline) list.push({ date: p.deadline, title: p.title, type: "poly" })
    }
    for (const v of videos) {
      if (v.deadline) list.push({ date: v.deadline, title: v.title, type: "video" })
    }
    return list
  }, [polys, videos])

  const deadlinesByDate = useMemo(() => {
    const map: Record<string, typeof deadlines> = {}
    for (const d of deadlines) {
      if (!map[d.date]) map[d.date] = []
      map[d.date].push(d)
    }
    return map
  }, [deadlines])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }

  // Max pages read in month for intensity calculation
  const maxPagesInMonth = useMemo(() => {
    let max = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateString(currentYear, currentMonth, d)
      const entry = activityByDate[dateStr]
      if (entry && entry.pagesRead > max) max = entry.pagesRead
    }
    return max || 1
  }, [activityByDate, currentYear, currentMonth, daysInMonth])

  // Upcoming deadlines (next 30 days)
  const upcomingDeadlines = useMemo(() => {
    return deadlines
      .filter((d) => {
        const diff = (new Date(d.date + "T00:00:00").getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
        return diff >= -1 && diff <= 30
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [deadlines])

  // Total activity this month
  const monthStats = useMemo(() => {
    let pages = 0; let vids = 0; let daysActive = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const entry = activityByDate[toDateString(currentYear, currentMonth, d)]
      if (entry) {
        pages += entry.pagesRead
        vids += entry.videosWatched
        if (entry.pagesRead > 0 || entry.videosWatched > 0) daysActive++
      }
    }
    return { pages, vids, daysActive }
  }, [activityByDate, currentYear, currentMonth, daysInMonth])

  return (
    <div className="space-y-8">
      {/* ── Stats du mois ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pages lues", value: monthStats.pages.toLocaleString(), icon: <BookOpen className="w-3.5 h-3.5" /> },
          { label: "Vidéos vues", value: monthStats.vids.toString(), icon: <Play className="w-3.5 h-3.5" /> },
          { label: "Jours actifs", value: monthStats.daysActive.toString(), icon: null },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-[var(--color-foreground)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Calendrier ── */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-[var(--color-muted-foreground)] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = toDateString(currentYear, currentMonth, day)
              const entry = activityByDate[dateStr]
              const dayDeadlines = deadlinesByDate[dateStr] || []
              const isToday = dateStr === todayStr
              const hasActivity = entry && (entry.pagesRead > 0 || entry.videosWatched > 0)
              const intensity = hasActivity && entry ? Math.min(1, entry.pagesRead / maxPagesInMonth) : 0

              // Couleur d'activité pages (rose)
              const pagesColor = hasActivity && entry?.pagesRead
                ? `rgba(244, 114, 182, ${0.2 + intensity * 0.7})`
                : undefined

              return (
                <div
                  key={day}
                  className={`relative min-h-[52px] rounded-xl p-1.5 border transition-colors ${
                    isToday
                      ? "border-[#f472b6] bg-[#fdf2f8] dark:bg-[#1a0f13]"
                      : dayDeadlines.length > 0
                      ? "border-[var(--color-border)] bg-[var(--color-secondary)]"
                      : "border-transparent hover:bg-[var(--color-secondary)]"
                  }`}
                  style={pagesColor ? { backgroundColor: pagesColor } : undefined}
                >
                  <span
                    className={`text-[11px] font-medium ${
                      isToday ? "text-[#f472b6] font-bold" : "text-[var(--color-foreground)]"
                    }`}
                  >
                    {day}
                  </span>

                  {/* Activity dots */}
                  {hasActivity && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {entry?.pagesRead ? (
                        <div className="flex items-center gap-0.5">
                          <BookOpen className="w-2 h-2 text-[#f472b6]" />
                          <span className="text-[9px] text-[#f472b6] font-medium">{entry.pagesRead}</span>
                        </div>
                      ) : null}
                      {entry?.videosWatched ? (
                        <div className="flex items-center gap-0.5">
                          <Play className="w-2 h-2 text-[#7c3aed]" />
                          <span className="text-[9px] text-[#7c3aed] font-medium">{entry.videosWatched}</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Deadline dots */}
                  {dayDeadlines.length > 0 && (
                    <div className="absolute bottom-1 right-1 flex gap-0.5">
                      {dayDeadlines.slice(0, 3).map((dl, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${dl.type === "poly" ? "bg-[#f472b6]" : "bg-[#7c3aed]"}`}
                          title={dl.title}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted-foreground)]">
              <div className="w-2 h-2 rounded-full bg-[#f472b6]" />
              Poly lu
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted-foreground)]">
              <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
              Vidéo vue
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted-foreground)]">
              <div className="w-3 h-3 rounded-sm border border-[#f472b6]" />
              Aujourd'hui
            </div>
          </div>
        </div>
      </div>

      {/* ── Deadlines à venir ── */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
            Échéances à venir
          </h3>
          <div className="space-y-2">
            {upcomingDeadlines.map((dl, idx) => {
              const deadlineDate = new Date(dl.date + "T00:00:00")
              const diffDays = Math.ceil(
                (deadlineDate.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
              )
              const isUrgent = diffDays <= 3
              const isWarning = diffDays > 3 && diffDays <= 7

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    isUrgent
                      ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
                      : isWarning
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/40 dark:bg-yellow-950/20"
                      : "border-[var(--color-border)] bg-[var(--color-card)]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${dl.type === "poly" ? "bg-[#f472b6]" : "bg-[#7c3aed]"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--color-foreground)] truncate">{dl.title}</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">
                      {dl.type === "poly" ? "Polycopié" : "Cours vidéo"} · {new Date(dl.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      isUrgent
                        ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                        : isWarning
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                        : "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    {diffDays <= 0 ? "Passée" : `J-${diffDays}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
