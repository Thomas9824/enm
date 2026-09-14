import React from "react"
import type { Poly } from "@/types"
import { PolyIcon } from "@/components/PolyIcon"
import { ExternalLink } from "lucide-react"

interface PolyTableProps {
  polys: Poly[]
  onSelect: (poly: Poly) => void
  onStep: (id: string, delta: number) => void
}

export const PolyTable: React.FC<PolyTableProps> = ({ polys, onSelect, onStep }) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]">
            <th className="text-left px-5 py-3.5 text-xs font-medium text-[var(--color-muted-foreground)] w-10"></th>
            <th className="text-left px-5 py-3.5 text-xs font-medium text-[var(--color-muted-foreground)]">Polycopié</th>
            <th className="text-left px-5 py-3.5 text-xs font-medium text-[var(--color-muted-foreground)] w-36 hidden sm:table-cell">Pages</th>
            <th className="text-left px-5 py-3.5 text-xs font-medium text-[var(--color-muted-foreground)] w-52">Progression</th>
            <th className="px-5 py-3.5 w-28 text-right text-xs font-medium text-[var(--color-muted-foreground)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {polys.map((poly) => {
            const pct = poly.totalPages > 0 ? Math.min(100, Math.round((poly.readPages / poly.totalPages) * 100)) : 0
            const isComplete = pct >= 100

            return (
              <tr
                key={poly.id}
                onClick={() => onSelect(poly)}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-secondary)] cursor-pointer transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-poly)] transition-colors">
                    <PolyIcon name={poly.iconName} className="w-4 h-4" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-[var(--color-foreground)] text-sm">{poly.title}</div>
                  {poly.subject && (
                    <div className="text-sm text-[var(--color-muted-foreground)] mt-0.5">{poly.subject}</div>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-foreground)] hidden sm:table-cell">
                  {poly.readPages} / {poly.totalPages}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--color-secondary)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: isComplete ? "var(--color-poly)" : pct > 0 ? "var(--color-poly-muted)" : "transparent" }}
                      />
                    </div>
                    <span className="text-sm font-bold w-9 text-right" style={{ color: pct > 0 ? "var(--color-poly)" : "var(--color-muted-foreground)" }}>
                      {pct}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onStep(poly.id, 5)}
                      className="px-2.5 py-1.5 text-xs rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-poly-light)] hover:text-[var(--color-poly)] text-[var(--color-muted-foreground)] transition-colors font-medium"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => onSelect(poly)}
                      className="p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
