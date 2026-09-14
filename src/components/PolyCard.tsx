import React from "react"
import { ChevronRight } from "lucide-react"
import { PolyIcon } from "@/components/PolyIcon"
import { DeadlineBadge } from "@/components/DeadlineBadge"
import type { Poly } from "@/types"

interface PolyCardProps {
  poly: Poly
  onSelect: (poly: Poly) => void
  onStep: (id: string, delta: number) => void
  onComplete: (id: string) => void
}

export const PolyCard: React.FC<PolyCardProps> = ({ poly, onSelect, onStep, onComplete }) => {
  const pct = poly.totalPages > 0
    ? Math.min(100, Math.round((poly.readPages / poly.totalPages) * 100))
    : 0
  const isComplete = pct >= 100

  return (
    <div
      onClick={() => onSelect(poly)}
      className="group relative flex flex-col bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 cursor-pointer hover:border-[var(--color-poly)]/40 hover:shadow-sm transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] group-hover:bg-[var(--color-poly-light)] group-hover:text-[var(--color-poly)] transition-colors">
          <PolyIcon name={poly.iconName} className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5" />
      </div>

      {/* Title & subject */}
      <div className="mb-5 flex-1">
        <h3 className="text-base font-semibold text-[var(--color-foreground)] leading-snug line-clamp-2 mb-1.5">
          {poly.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {poly.subject && (
            <p className="text-sm text-[var(--color-muted-foreground)]">{poly.subject}</p>
          )}
          {poly.deadline && <DeadlineBadge deadline={poly.deadline} />}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--color-muted-foreground)]">
            {poly.readPages} / {poly.totalPages} pages
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: isComplete ? "var(--color-poly)" : pct > 0 ? "var(--color-poly)" : "var(--color-muted-foreground)", opacity: pct > 0 ? 1 : 0.5 }}
          >
            {pct}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--color-secondary)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              backgroundColor: isComplete ? "var(--color-poly)" : pct > 0 ? "var(--color-poly-muted)" : "transparent",
            }}
          />
        </div>
      </div>

      {/* Quick steppers */}
      <div
        className="flex items-center gap-1 pt-3 border-t border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {[-5, -1, 1, 5, 10].map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => onStep(poly.id, delta)}
            className="flex-1 py-1.5 text-xs font-medium rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-poly-light)] hover:text-[var(--color-poly)] text-[var(--color-muted-foreground)] transition-colors"
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
        {!isComplete && (
          <button
            type="button"
            onClick={() => onComplete(poly.id)}
            className="flex-1 py-1.5 text-xs font-medium rounded-md bg-[var(--color-poly-light)] text-[var(--color-poly)] hover:bg-[var(--color-poly)] hover:text-white transition-colors"
          >
            Fin
          </button>
        )}
      </div>
    </div>
  )
}
