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
  BookOpen,
  Video,
  CalendarDays,
  ClipboardList,
  Palette,
} from "lucide-react"
import { useTheme } from "@/lib/ThemeContext"
import { ThemePanel } from "@/components/ThemePanel"
import { PolyCard } from "@/components/PolyCard"
import { PolyTable } from "@/components/PolyTable"
import { PolyDetailSheet } from "@/components/PolyDetailSheet"
import { CreatePolyDialog } from "@/components/CreatePolyDialog"
import { VideoCard } from "@/components/VideoCard"
import { VideoDetailSheet } from "@/components/VideoDetailSheet"
import { CreateVideoDialog } from "@/components/CreateVideoDialog"
import { ExamCard } from "@/components/ExamCard"
import { ExamDetailSheet } from "@/components/ExamDetailSheet"
import { CreateExamDialog } from "@/components/CreateExamDialog"
import { CalendarView } from "@/components/CalendarView"
import {
  loadPolysFromStorage,
  savePolysToStorage,
  loadVideosFromStorage,
  saveVideosToStorage,
  loadExamsFromStorage,
  saveExamsToStorage,
  loadActivityFromStorage,
  saveActivityToStorage,
  recordActivity,
  getTodayString,
} from "@/lib/storage"
import type { Poly, VideoCourse, MockExam, ViewMode, StatusFilter, SortOption, AppTab, ActivityEntry } from "@/types"

export function App() {
  const { darkMode, setDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState<AppTab>("polys")
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false)

  // ── Polys ──
  const [polys, setPolys] = useState<Poly[]>(loadPolysFromStorage)
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")
  const [search, setSearch] = useState("")
  const [selectedSubject] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [sortOption, setSortOption] = useState<SortOption>("progress-desc")
  const [selectedPoly, setSelectedPoly] = useState<Poly | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreatePolyOpen, setIsCreatePolyOpen] = useState(false)

  // ── Videos ──
  const [videos, setVideos] = useState<VideoCourse[]>(loadVideosFromStorage)
  const [videoSearch, setVideoSearch] = useState("")
  const [videoStatusFilter, setVideoStatusFilter] = useState<StatusFilter>("ALL")
  const [selectedVideo, setSelectedVideo] = useState<VideoCourse | null>(null)
  const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false)
  const [isCreateVideoOpen, setIsCreateVideoOpen] = useState(false)

  // ── Exams ──
  const [exams, setExams] = useState<MockExam[]>(loadExamsFromStorage)
  const [examSearch, setExamSearch] = useState("")
  const [examStatusFilter, setExamStatusFilter] = useState<"ALL" | "planned" | "in_progress" | "done">("ALL")
  const [selectedExam, setSelectedExam] = useState<MockExam | null>(null)
  const [isExamDetailOpen, setIsExamDetailOpen] = useState(false)
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false)

  // ── Activity ──
  const [activity, setActivity] = useState<ActivityEntry[]>(loadActivityFromStorage)

  // Persistence
  useEffect(() => { savePolysToStorage(polys) }, [polys])
  useEffect(() => { saveVideosToStorage(videos) }, [videos])
  useEffect(() => { saveExamsToStorage(exams) }, [exams])
  useEffect(() => { saveActivityToStorage(activity) }, [activity])

  // Subjects
  const existingPolySubjects = useMemo(() => {
    return Array.from(new Set(polys.map((p) => p.subject).filter(Boolean))).sort()
  }, [polys])

  const existingVideoSubjects = useMemo(() => {
    return Array.from(new Set(videos.map((v) => v.subject).filter(Boolean))).sort()
  }, [videos])

  const allSubjects = useMemo(() => {
    return Array.from(new Set([...existingPolySubjects, ...existingVideoSubjects])).sort()
  }, [existingPolySubjects, existingVideoSubjects])

  // ── Confetti ──
  const triggerCelebration = () => {
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ["var(--color-poly)", "#fb7185", "#fda4af", "var(--color-poly-light)"] })
    } catch { /* ignore */ }
  }

  // ── Poly handlers ──
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
        // Record activity only on positive delta
        if (delta > 0) {
          setActivity((prev) => recordActivity(prev, getTodayString(), { pagesRead: delta }))
        }
        return updated
      })
    )
  }

  const handleComplete = (id: string) => {
    setPolys((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        triggerCelebration()
        const pagesGained = p.totalPages - p.readPages
        const updated = { ...p, readPages: p.totalPages, updatedAt: Date.now() }
        if (selectedPoly?.id === id) setSelectedPoly(updated)
        if (pagesGained > 0) {
          setActivity((prev) => recordActivity(prev, getTodayString(), { pagesRead: pagesGained }))
        }
        return updated
      })
    )
  }

  const handleAddPoly = (newPolyData: Omit<Poly, "id" | "updatedAt">) => {
    const newPoly: Poly = { ...newPolyData, id: "poly-" + Date.now(), updatedAt: Date.now() }
    setPolys((prev) => [newPoly, ...prev])
  }

  const handleUpdatePoly = (updated: Poly) => {
    // Track pages diff for activity
    const old = polys.find((p) => p.id === updated.id)
    if (old && updated.readPages > old.readPages) {
      setActivity((prev) => recordActivity(prev, getTodayString(), { pagesRead: updated.readPages - old.readPages }))
    }
    setPolys((prev) => prev.map((p) => (p.id === updated.id ? { ...updated, updatedAt: Date.now() } : p)))
  }

  const handleDeletePoly = (id: string) => {
    setPolys((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSelectPoly = (poly: Poly) => {
    setSelectedPoly(poly)
    setIsDetailOpen(true)
  }

  // ── Video handlers ──
  const handleToggleLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setVideos((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c
        let wasWatched = false
        let isNowWatched = false
        const updated = {
          ...c,
          updatedAt: Date.now(),
          modules: c.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) => {
                    if (l.id !== lessonId) return l
                    wasWatched = l.watched
                    isNowWatched = !l.watched
                    return { ...l, watched: !l.watched }
                  }),
                }
              : m
          ),
        }
        // Record only when we mark as watched (not un-watched)
        if (!wasWatched && isNowWatched) {
          setActivity((prev) => recordActivity(prev, getTodayString(), { videosWatched: 1 }))
          // Check if all complete
          const totalLessons = updated.modules.reduce((a, m) => a + m.lessons.length, 0)
          const watchedLessons = updated.modules.reduce((a, m) => a + m.lessons.filter((l) => l.watched).length, 0)
          if (watchedLessons >= totalLessons && totalLessons > 0) triggerCelebration()
        }
        if (selectedVideo?.id === courseId) setSelectedVideo(updated)
        return updated
      })
    )
  }

  const handleAddVideo = (data: Omit<VideoCourse, "id" | "updatedAt">) => {
    const newCourse: VideoCourse = { ...data, id: "vid-" + Date.now(), updatedAt: Date.now() }
    setVideos((prev) => [newCourse, ...prev])
  }

  const handleUpdateVideo = (updated: VideoCourse) => {
    // Track newly watched lessons
    const old = videos.find((v) => v.id === updated.id)
    if (old) {
      const oldWatched = old.modules.reduce((a, m) => a + m.lessons.filter((l) => l.watched).length, 0)
      const newWatched = updated.modules.reduce((a, m) => a + m.lessons.filter((l) => l.watched).length, 0)
      if (newWatched > oldWatched) {
        setActivity((prev) => recordActivity(prev, getTodayString(), { videosWatched: newWatched - oldWatched }))
      }
    }
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? { ...updated, updatedAt: Date.now() } : v)))
  }

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  const handleSelectVideo = (course: VideoCourse) => {
    setSelectedVideo(course)
    setIsVideoDetailOpen(true)
  }

  // ── Exam handlers ──
  const handleAddExam = (data: Omit<MockExam, "id" | "updatedAt">) => {
    const newExam: MockExam = { ...data, id: "exam-" + Date.now(), updatedAt: Date.now() }
    setExams((prev) => [newExam, ...prev])
  }

  const handleUpdateExam = (updated: MockExam) => {
    // Si on passe à "done" depuis autre chose, enregistrer l'activité
    const old = exams.find((e) => e.id === updated.id)
    if (old && old.status !== "done" && updated.status === "done") {
      setActivity((prev) => recordActivity(prev, getTodayString(), { examsCompleted: 1 }))
      triggerCelebration()
    }
    setExams((prev) => prev.map((e) => (e.id === updated.id ? { ...updated, updatedAt: Date.now() } : e)))
  }

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
  }

  const handleSelectExam = (exam: MockExam) => {
    setSelectedExam(exam)
    setIsExamDetailOpen(true)
  }

  // ── Filtered exams ──
  const filteredExams = useMemo(() => {
    const query = examSearch.trim().toLowerCase()
    return exams.filter((e) => {
      const matchSearch = !query || e.title.toLowerCase().includes(query) || e.subject.toLowerCase().includes(query)
      const matchStatus = examStatusFilter === "ALL" || e.status === examStatusFilter
      return matchSearch && matchStatus
    })
  }, [exams, examSearch, examStatusFilter])

  // ── Export ──
  const handleExport = () => {
    const data = { polys, videos, exams, activity }
    const a = document.createElement("a")
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
    a.download = `revisions_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // ── Filtered polys ──
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

  // ── Filtered videos ──
  const filteredVideos = useMemo(() => {
    const query = videoSearch.trim().toLowerCase()
    return videos.filter((v) => {
      const matchSearch = !query || v.title.toLowerCase().includes(query) || v.subject.toLowerCase().includes(query)
      const total = v.modules.reduce((a, m) => a + m.lessons.length, 0)
      const watched = v.modules.reduce((a, m) => a + m.lessons.filter((l) => l.watched).length, 0)
      const pct = total > 0 ? (watched / total) * 100 : 0
      let matchStatus = true
      if (videoStatusFilter === "TODO") matchStatus = pct === 0
      else if (videoStatusFilter === "IN_PROGRESS") matchStatus = pct > 0 && pct < 100
      else if (videoStatusFilter === "DONE") matchStatus = pct >= 100
      return matchSearch && matchStatus
    })
  }, [videos, videoSearch, videoStatusFilter])

  // ── Global stats ──
  const totalPages = polys.reduce((acc, p) => acc + p.totalPages, 0)
  const readPages = polys.reduce((acc, p) => acc + p.readPages, 0)
  const globalPct = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
  const completedPolys = polys.filter((p) => p.totalPages > 0 && p.readPages >= p.totalPages).length

  const totalLessons = videos.reduce((a, v) => a + v.modules.reduce((b, m) => b + m.lessons.length, 0), 0)
  const watchedLessons = videos.reduce((a, v) => a + v.modules.reduce((b, m) => b + m.lessons.filter((l) => l.watched).length, 0), 0)
  const videoGlobalPct = totalLessons > 0 ? Math.round((watchedLessons / totalLessons) * 100) : 0
  const completedVideos = videos.filter((v) => {
    const t = v.modules.reduce((a, m) => a + m.lessons.length, 0)
    const w = v.modules.reduce((a, m) => a + m.lessons.filter((l) => l.watched).length, 0)
    return t > 0 && w >= t
  }).length

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* ── THEME PANEL ── */}
      <ThemePanel isOpen={isThemePanelOpen} onClose={() => setIsThemePanelOpen(false)} />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between gap-6">

          {/* Marque */}
          <span className="text-base font-bold tracking-tight text-[var(--color-foreground)] shrink-0">
            Révisions
          </span>

          {/* Onglets — centre */}
          <nav className="flex items-center gap-1 p-1 bg-[var(--color-secondary)] rounded-xl">
            {(
              [
                { id: "polys" as AppTab, label: "Polycopiés", icon: <BookOpen className="w-4 h-4" /> },
                { id: "videos" as AppTab, label: "Vidéos", icon: <Video className="w-4 h-4" /> },
                { id: "exams" as AppTab, label: "Concours", icon: <ClipboardList className="w-4 h-4" /> },
                { id: "calendar" as AppTab, label: "Calendrier", icon: <CalendarDays className="w-4 h-4" /> },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions — droite */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsThemePanelOpen(true)}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              title="Personnaliser"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              title="Exporter JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {activeTab === "polys" && (
              <button
                onClick={() => setIsCreatePolyOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-foreground)] text-[var(--color-background)] text-sm font-semibold rounded-full hover:opacity-80 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            )}
            {activeTab === "videos" && (
              <button
                onClick={() => setIsCreateVideoOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-video)] text-white text-sm font-semibold rounded-full hover:opacity-80 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            )}
            {activeTab === "exams" && (
              <button
                onClick={() => setIsCreateExamOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-exam)] text-white text-sm font-semibold rounded-full hover:opacity-80 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* ══════════════════════════════ POLYS TAB ══════════════════════════════ */}
        {activeTab === "polys" && (
          <>
            {/* Hero */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--color-foreground)]">Mes polycopiés</h1>
              <p className="text-base text-[var(--color-muted-foreground)]">Suivi de progression page par page</p>
            </div>

            {/* Global progress */}
            <div className="mb-10 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Progression globale</p>
                  <p className="text-3xl font-bold text-[var(--color-foreground)]">{globalPct}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--color-muted-foreground)]">{completedPolys} / {polys.length} terminés</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{readPages.toLocaleString()} / {totalPages.toLocaleString()} pages</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--color-secondary)]">
                <div className="h-full rounded-full bg-[var(--color-poly)] transition-all duration-500" style={{ width: `${globalPct}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <div className="flex items-center bg-[var(--color-secondary)] p-1 rounded-lg gap-0.5">
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "gallery" ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "table" ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-9 pr-8 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-poly)]/30 w-48 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="py-2 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-poly)]/30"
                >
                  <option value="ALL">Tous</option>
                  <option value="TODO">Non commencé</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminé</option>
                </select>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="py-2 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-poly)]/30"
                >
                  <option value="progress-desc">Plus avancé</option>
                  <option value="progress-asc">Moins avancé</option>
                  <option value="title-asc">A → Z</option>
                  <option value="date-newest">Récents</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {filteredPolys.length === 0 ? (
              <div className="text-center py-24">
                <FolderOpen className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-4 opacity-40" />
                <p className="text-base text-[var(--color-muted-foreground)] mb-5">Aucun polycopié trouvé</p>
                <button
                  onClick={() => setIsCreatePolyOpen(true)}
                  className="text-sm px-5 py-2.5 bg-[var(--color-foreground)] text-[var(--color-background)] rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                  Ajouter un polycopié
                </button>
              </div>
            ) : viewMode === "gallery" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <PolyTable polys={filteredPolys} onSelect={handleSelectPoly} onStep={handleStep} />
            )}
          </>
        )}

        {/* ══════════════════════════════ VIDEOS TAB ══════════════════════════════ */}
        {activeTab === "videos" && (
          <>
            {/* Hero */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--color-foreground)]">Mes cours vidéo</h1>
              <p className="text-base text-[var(--color-muted-foreground)]">Suivi des vidéos module par module</p>
            </div>

            {/* Global progress */}
            <div className="mb-10 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Progression globale</p>
                  <p className="text-3xl font-bold text-[var(--color-foreground)]">{videoGlobalPct}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--color-muted-foreground)]">{completedVideos} / {videos.length} terminés</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{watchedLessons} / {totalLessons} vidéos</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--color-secondary)]">
                <div className="h-full rounded-full bg-[var(--color-video)] transition-all duration-500" style={{ width: `${videoGlobalPct}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-8 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-video)]/30 w-48 transition-all"
                />
                {videoSearch && (
                  <button onClick={() => setVideoSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                value={videoStatusFilter}
                onChange={(e) => setVideoStatusFilter(e.target.value as StatusFilter)}
                className="py-2 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-video)]/30"
              >
                <option value="ALL">Tous</option>
                <option value="TODO">Non commencé</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
              </select>
            </div>

            {/* Content */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-24">
                <FolderOpen className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-4 opacity-40" />
                <p className="text-base text-[var(--color-muted-foreground)] mb-5">Aucun cours vidéo trouvé</p>
                <button
                  onClick={() => setIsCreateVideoOpen(true)}
                  className="text-sm px-5 py-2.5 bg-[var(--color-video)] text-white rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                  Ajouter un cours vidéo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((course) => (
                  <VideoCard
                    key={course.id}
                    course={course}
                    onSelect={handleSelectVideo}
                    onToggleLesson={handleToggleLesson}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════ EXAMS TAB ══════════════════════════════ */}
        {activeTab === "exams" && (
          <>
            {/* Hero */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--color-foreground)]">Concours blancs</h1>
              <p className="text-base text-[var(--color-muted-foreground)]">Suivi des entraînements et des notes</p>
            </div>

            {/* Stats globales */}
            {(() => {
              const done = exams.filter((e) => e.status === "done")
              const allScored = done.flatMap((e) => e.questions.filter((q) => q.score !== undefined))
              const avgGlobal = allScored.length > 0
                ? Math.round((allScored.reduce((a, q) => a + (q.score ?? 0), 0) / allScored.reduce((a, q) => a + q.maxScore, 0)) * 20 * 10) / 10
                : null
              return (
                <div className="mb-10 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-sm text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Moyenne générale</p>
                      <p className="text-3xl font-bold" style={{ color: avgGlobal !== null ? (avgGlobal >= 10 ? "#10b981" : "#ef4444") : "var(--color-muted-foreground)" }}>
                        {avgGlobal !== null ? `${avgGlobal}/20` : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--color-muted-foreground)]">{done.length} / {exams.length} terminés</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">{exams.filter((e) => e.status === "planned").length} planifié{exams.filter((e) => e.status === "planned").length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {avgGlobal !== null && (
                    <div className="h-2 w-full rounded-full bg-[var(--color-secondary)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((avgGlobal / 20) * 100)}%`, backgroundColor: avgGlobal >= 10 ? "#10b981" : "#ef4444" }}
                      />
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-8 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30 w-48 transition-all"
                />
                {examSearch && (
                  <button onClick={() => setExamSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                value={examStatusFilter}
                onChange={(e) => setExamStatusFilter(e.target.value as typeof examStatusFilter)}
                className="py-2 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-exam)]/30"
              >
                <option value="ALL">Tous</option>
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>

            {/* Content */}
            {filteredExams.length === 0 ? (
              <div className="text-center py-24">
                <FolderOpen className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-4 opacity-40" />
                <p className="text-base text-[var(--color-muted-foreground)] mb-5">Aucun concours blanc trouvé</p>
                <button
                  onClick={() => setIsCreateExamOpen(true)}
                  className="text-sm px-5 py-2.5 bg-[var(--color-exam)] text-white rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                  Créer un concours blanc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} onSelect={handleSelectExam} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════ CALENDAR TAB ══════════════════════════════ */}
        {activeTab === "calendar" && (
          <>
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-[var(--color-foreground)]">Calendrier</h1>
              <p className="text-base text-[var(--color-muted-foreground)]">Activité quotidienne et échéances à venir</p>
            </div>
            <CalendarView activity={activity} polys={polys} videos={videos} />
          </>
        )}
      </main>

      {/* ── Sheets & Dialogs ── */}
      <PolyDetailSheet
        poly={selectedPoly}
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedPoly(null) }}
        onUpdate={handleUpdatePoly}
        onDelete={handleDeletePoly}
      />

      <CreatePolyDialog
        isOpen={isCreatePolyOpen}
        onClose={() => setIsCreatePolyOpen(false)}
        onCreate={handleAddPoly}
        existingSubjects={allSubjects}
      />

      <VideoDetailSheet
        course={selectedVideo}
        isOpen={isVideoDetailOpen}
        onClose={() => { setIsVideoDetailOpen(false); setSelectedVideo(null) }}
        onUpdate={handleUpdateVideo}
        onDelete={handleDeleteVideo}
      />

      <CreateVideoDialog
        isOpen={isCreateVideoOpen}
        onClose={() => setIsCreateVideoOpen(false)}
        onCreate={handleAddVideo}
        existingSubjects={allSubjects}
      />

      <ExamDetailSheet
        exam={selectedExam}
        isOpen={isExamDetailOpen}
        onClose={() => { setIsExamDetailOpen(false); setSelectedExam(null) }}
        onUpdate={handleUpdateExam}
        onDelete={handleDeleteExam}
      />

      <CreateExamDialog
        isOpen={isCreateExamOpen}
        onClose={() => setIsCreateExamOpen(false)}
        onCreate={handleAddExam}
        existingSubjects={allSubjects}
      />
    </div>
  )
}

export default App
