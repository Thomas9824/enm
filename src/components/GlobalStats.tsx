import React from "react"
import { Target, BookOpen, CheckCircle2, Clock, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { Poly } from "@/types"

interface GlobalStatsProps {
  polys: Poly[];
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ polys }) => {
  const totalPages = polys.reduce((acc, p) => acc + (Number(p.totalPages) || 0), 0)
  const readPages = polys.reduce((acc, p) => acc + (Number(p.readPages) || 0), 0)
  const completedCount = polys.filter((p) => p.totalPages > 0 && p.readPages >= p.totalPages).length

  const globalPct = totalPages > 0 ? Math.min(100, Math.round((readPages / totalPages) * 1000) / 10) : 0
  const remainingPages = Math.max(0, totalPages - readPages)

  const avgProgress = polys.length > 0 
    ? Math.round(polys.reduce((acc, p) => acc + (p.totalPages > 0 ? (p.readPages / p.totalPages) * 100 : 0), 0) / polys.length)
    : 0

  return (
    <section className="rounded-lg border border-border bg-card p-5 mb-7 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Progression Globale des Révisions</h2>
            <p className="text-xs text-muted-foreground">Volume de lecture consolidé sur l'ensemble de vos polycopiés</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Avancement total :</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {globalPct}%
          </span>
        </div>
      </div>

      {/* Global Gauge */}
      <div className="mb-4">
        <Progress 
          value={globalPct} 
          className="h-2.5 bg-muted/60" 
          indicatorClassName={globalPct >= 100 ? "bg-emerald-600" : "bg-gradient-to-r from-blue-600 to-indigo-600"} 
        />
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-md border border-border/80 bg-background/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Pages lues</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">{readPages.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/ {totalPages.toLocaleString()} p.</span>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-background/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Polys terminés</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">{completedCount}</span>
            <span className="text-xs text-muted-foreground">/ {polys.length} polys</span>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-background/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Pages restantes</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">{remainingPages.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">à parcourir</span>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-background/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Moyenne par poly</span>
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">{avgProgress}%</span>
            <span className="text-xs text-muted-foreground">progression</span>
          </div>
        </div>
      </div>
    </section>
  )
}
