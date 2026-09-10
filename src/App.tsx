import { useState, useEffect, useMemo } from "react"
import confetti from "canvas-confetti"
import {
  FolderOpen,
  Plus,
  Moon,
  Sun,
  Download,
  Search,
  X,
  LayoutGrid,
  List,
} from "lucide-react"
import { PolyCard } from "@/components/PolyCard"
import { PolyTable } from "@/components/PolyTable"
import { PolyDetailSheet } from "@/components/PolyDetailSheet"
import { CreatePolyDialog } from "@/components/CreatePolyDialog"
import {
  loadPolysFromStorage,
  savePolysToStorage,
} from "@/lib/storage"
import type { Poly, ViewMode, StatusFilter, SortOption } from "@/types"

export function App() {
  const [polys, setPolys] = useState<Poly[]>(loadPolysFromStorage)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("notion_theme") as "light" | "dark") || "light"
  })
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")
  const [search, setSearch] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [sortOption, setSortOption] = useState<SortOption>("progress-desc")

  const [selectedPoly, setSelectedPoly] = useState<Poly | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("notion_theme", theme)
  }, [theme])

  useEffect(() => {
    savePolysToStorage(polys)
  }, [polys])

  const existingSubjects = useMemo(() => {
    return Array.from(new Set(polys.map((p) => p.subject).filter(Boolean))).sort()
  }, [polys])

  const triggerCelebration = () => {
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ["#f472b6", "#fb7185", "#fda4af", "#fce7f3"] })
    } catch { /* ignore */ }
  }

  const handleStep = (id: string, delta: number) => {
    setPolys((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const oldPct = p.totalPages > 0 ? p.readPages / p.totalPages : 0
        const newRead = Math.max(0, Math.min(p.totalPages, p.readPages + delta))
        const newPct = p.totalPages > 0 ? newRead / p.totalPages : 0
        if (newPct >= 1 && oldPct < 1) triggerCelebration()
        const updated = { ...p, readPages: newRead, updatedAt: Date.now() }
        if (selectedPoly?.id === id) setSelectedPoly(updated)
        return updated
      })
    )
  }

  const handleComplete = (id: string) => {
    setPolys((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        triggerCelebration()
        const updated = { ...p, readPages: p.totalPages, updatedAt: Date.now() }
        if (selectedPoly?.id === id) setSelectedPoly(updated)
        return updated
      })
    )
  }

  const handleAddPoly = (newPolyData: Omit<Poly, "id" | "updatedAt">) => {
    const newPoly: Poly = { ...newPolyData, id: "poly-" + Date.now(), updatedAt: Date.now() }
    setPolys((prev) => [newPoly, ...prev])
  }

  const handleUpdatePoly = (updated: Poly) => {
    setPolys((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, updatedAt: Date.now() } : p)))
  }

  const handleDeletePoly = (id: string) => {
    setPolys((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSelectPoly = (poly: Poly) => {
    setSelectedPoly(poly)
    setIsDetailOpen(true)
  }

  const handleExport = () => {
    const a = document.createElement("a")
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(polys, null, 2))
    a.download = `polys_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const filteredPolys = useMemo(() => {
    const query = search.trim().toLowerCase()
    return polys
      .filter((p) => {
        const matchSearch = !query || p.title.toLowerCase().includes(query) || (p.subject && p.subject.toLowerCase().includes(query))
        const matchSubject = selectedSubject === "ALL" || p.subject === selectedSubject
        const pct = p.totalPages > 0 ? (p.readPages / p.totalPages) * 100 : 0
        let matchStatus = true
        if (statusFilter === "TODO") matchStatus = pct === 0
        else if (statusFilter === "IN_PROGRESS") matchStatus = pct > 0 && pct < 100
        else if (statusFilter === "DONE") matchStatus = pct >= 100
        return matchSearch && matchSubject && matchStatus
      })
      .sort((a, b) => {
        const pA = a.totalPages > 0 ? a.readPages / a.totalPages : 0
        const pB = b.totalPages > 0 ? b.readPages / b.totalPages : 0
        if (sortOption === "progress-desc") return pB - pA
        if (sortOption === "progress-asc") return pA - pB
        if (sortOption === "title-asc") return a.title.localeCompare(b.title, "fr")
        return (b.updatedAt || 0) - (a.updatedAt || 0)
      })
  }, [polys, search, selectedSubject, statusFilter, sortOption])

  // Global stats
  const totalPages = polys.reduce((acc, p) => acc + p.totalPages, 0)
  const readPages = polys.reduce((acc, p) => acc + p.readPages, 0)
  const globalPct = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
  const completedCount = polys.filter((p) => p.totalPages > 0 && p.readPages >= p.totalPages).length

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">
              Révisions
            </span>
            <span className="text-[var(--color-muted-foreground)] text-sm">/</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">Polycopiés</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              title="Exporter JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme((t) => t === "light" ? "dark" : "light")}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-foreground)] text-[var(--color-background)] text-xs font-semibold rounded-full hover:opacity-80 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* ── HERO ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-[var(--color-foreground)]">
            Mes polycopiés
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Suivi de progression page par page
          </p>
        </div>

        {/* ── GLOBAL PROGRESS STRIP ── */}
        <div className="mb-10 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-0.5">Progression globale</p>
              <p className="text-2xl font-bold text-[var(--color-foreground)]">{globalPct}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-muted-foreground)]">{completedCount} / {polys.length} terminés</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{readPages.toLocaleString()} / {totalPages.toLocaleString()} pages</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-[var(--color-secondary)]">
            <div
              className="h-full rounded-full bg-[#f472b6] transition-all duration-500"
              style={{ width: `${globalPct}%` }}
            />
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* View toggle */}
          <div className="flex items-center bg-[var(--color-secondary)] p-1 rounded-lg gap-0.5">
            <button
              onClick={() => setViewMode("gallery")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "gallery" ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-8 pr-7 py-1.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30 w-44 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
            >
              <option value="ALL">Tous</option>
              <option value="TODO">Non commencé</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminé</option>
            </select>

            {/* Sort */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[#f472b6]/30"
            >
              <option value="progress-desc">Plus avancé</option>
              <option value="progress-asc">Moins avancé</option>
              <option value="title-asc">A → Z</option>
              <option value="date-newest">Récents</option>
            </select>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {filteredPolys.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Aucun polycopié trouvé</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs px-4 py-2 bg-[var(--color-foreground)] text-[var(--color-background)] rounded-full font-medium hover:opacity-80 transition-opacity"
            >
              Ajouter un polycopié
            </button>
          </div>
        ) : viewMode === "gallery" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolys.map((poly) => (
              <PolyCard
                key={poly.id}
                poly={poly}
                onSelect={handleSelectPoly}
                onStep={handleStep}
                onComplete={handleComplete}
              />
            ))}
          </div>
        ) : (
          <PolyTable
            polys={filteredPolys}
            onSelect={handleSelectPoly}
            onStep={handleStep}
          />
        )}
      </main>

      <PolyDetailSheet
        poly={selectedPoly}
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedPoly(null) }}
        onUpdate={handleUpdatePoly}
        onDelete={handleDeletePoly}
      />

      <CreatePolyDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleAddPoly}
        existingSubjects={existingSubjects}
      />
    </div>
  )
}

export default App
