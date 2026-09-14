import React from "react"
import { AlertTriangle, Clock } from "lucide-react"

interface DeadlineBadgeProps {
  deadline: string
  className?: string
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline, className = "" }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(deadline + "T00:00:00")
  const diffMs = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    // Passée
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 ${className}`}
      >
        <AlertTriangle className="w-2.5 h-2.5" />
        Passée
      </span>
    )
  }

  if (diffDays === 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 ${className}`}
      >
        <AlertTriangle className="w-2.5 h-2.5" />
        Aujourd'hui !
      </span>
    )
  }

  if (diffDays <= 3) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 ${className}`}
      >
        <AlertTriangle className="w-2.5 h-2.5" />
        J-{diffDays}
      </span>
    )
  }

  if (diffDays <= 7) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 ${className}`}
      >
        <Clock className="w-2.5 h-2.5" />
        J-{diffDays}
      </span>
    )
  }

  // Plus de 7 jours : discret
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] ${className}`}
    >
      <Clock className="w-2.5 h-2.5" />
      J-{diffDays}
    </span>
  )
}
