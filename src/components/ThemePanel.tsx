import React, { useState } from "react"
import { X, Check, RotateCcw } from "lucide-react"
import { useTheme } from "@/lib/ThemeContext"
import { THEME_PRESETS, DEFAULT_THEME } from "@/lib/theme"
import type { ThemeConfig } from "@/lib/theme"

interface ThemePanelProps {
  isOpen: boolean
  onClose: () => void
}

// Palettes de couleurs rapides proposées par picker
const COLOR_PALETTE = [
  "#f472b6","#ec4899","#e11d48","#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6",
  "#6366f1","#8b5cf6","#a855f7","#7c3aed","#d946ef","#64748b","#6b7280",
]

const RADIUS_OPTIONS = [
  { label: "Droit", value: "0.2rem" },
  { label: "Petit", value: "0.5rem" },
  { label: "Moyen", value: "0.75rem" },
  { label: "Grand", value: "1rem" },
  { label: "Pill", value: "1.5rem" },
]

function ColorSwatch({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div>
      <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{label}</p>
      <div className="flex items-center gap-2 mb-2">
        {/* native color picker */}
        <label className="relative cursor-pointer">
          <span
            className="block w-8 h-8 rounded-lg border-2 border-[var(--color-border)] shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          maxLength={7}
          className="flex-1 text-xs font-mono px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-poly)]/30"
        />
      </div>
      {/* Palette rapide */}
      <div className="grid grid-cols-7 gap-1">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-6 h-6 rounded-md border transition-transform hover:scale-110 focus:outline-none"
            style={{
              backgroundColor: c,
              borderColor: value === c ? "var(--color-foreground)" : "transparent",
              transform: value === c ? "scale(1.15)" : undefined,
            }}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}

export function ThemePanel({ isOpen, onClose }: ThemePanelProps) {
  const { themeConfig, setThemeConfig, darkMode, setDarkMode } = useTheme()
  const [draft, setDraft] = useState<ThemeConfig>(themeConfig)

  // Sync draft quand le panel s'ouvre
  React.useEffect(() => {
    if (isOpen) setDraft(themeConfig)
  }, [isOpen, themeConfig])

  // Preview en temps réel
  const update = (patch: Partial<ThemeConfig>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    setThemeConfig(next)  // live preview
  }

  const applyPreset = (id: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === id)
    if (preset) update(preset.config)
  }

  const reset = () => update(DEFAULT_THEME)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-foreground)]">Personnalisation</h2>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Apparence de l'application</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={reset}
              title="Réinitialiser"
              className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8">

          {/* ── Mode clair / sombre ── */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">Mode</p>
            <div className="flex gap-2">
              {[
                { label: "Clair", value: false },
                { label: "Sombre", value: true },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setDarkMode(opt.value)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    darkMode === opt.value
                      ? "border-[var(--color-poly)] bg-[var(--color-poly-light)] text-[var(--color-foreground)]"
                      : "border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Presets ── */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">Thèmes prédéfinis</p>
            <div className="grid grid-cols-1 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isActive =
                  draft.colorPoly === preset.config.colorPoly &&
                  draft.colorVideo === preset.config.colorVideo &&
                  draft.colorExam === preset.config.colorExam &&
                  draft.radius === preset.config.radius
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      isActive
                        ? "border-[var(--color-poly)] bg-[var(--color-poly-light)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-secondary)]"
                    }`}
                  >
                    {/* Aperçu des 3 couleurs */}
                    <div className="flex gap-1 shrink-0">
                      {[preset.config.colorPoly, preset.config.colorVideo, preset.config.colorExam].map((c, i) => (
                        <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-foreground)] flex-1">{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-[var(--color-poly)] shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Couleurs d'accent ── */}
          <div className="space-y-5">
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Couleurs d'accent</p>

            <ColorSwatch
              label="Polycopiés"
              value={draft.colorPoly}
              onChange={(v) => update({ colorPoly: v })}
            />
            <ColorSwatch
              label="Vidéos"
              value={draft.colorVideo}
              onChange={(v) => update({ colorVideo: v })}
            />
            <ColorSwatch
              label="Concours blancs"
              value={draft.colorExam}
              onChange={(v) => update({ colorExam: v })}
            />
          </div>

          {/* ── Fond & Carte ── */}
          <div className="space-y-5">
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Couleurs de fond</p>
            {darkMode ? (
              <>
                <ColorSwatch
                  label="Fond de page (sombre)"
                  value={draft.bgDark}
                  onChange={(v) => update({ bgDark: v })}
                />
                <ColorSwatch
                  label="Fond des cartes (sombre)"
                  value={draft.cardDark}
                  onChange={(v) => update({ cardDark: v })}
                />
              </>
            ) : (
              <>
                <ColorSwatch
                  label="Fond de page (clair)"
                  value={draft.bgLight}
                  onChange={(v) => update({ bgLight: v })}
                />
                <ColorSwatch
                  label="Fond des cartes (clair)"
                  value={draft.cardLight}
                  onChange={(v) => update({ cardLight: v })}
                />
              </>
            )}
          </div>

          {/* ── Rayon des coins ── */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">Arrondi des coins</p>
            <div className="grid grid-cols-5 gap-2">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ radius: opt.value })}
                  className={`py-2 text-xs font-medium border transition-colors ${
                    draft.radius === opt.value
                      ? "border-[var(--color-poly)] bg-[var(--color-poly-light)] text-[var(--color-foreground)]"
                      : "border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                  style={{ borderRadius: opt.value }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Aperçu visuel du rayon */}
            <div className="mt-3 flex gap-2">
              {(["poly", "video", "exam"] as const).map((key) => (
                <div
                  key={key}
                  className="flex-1 h-8"
                  style={{
                    borderRadius: draft.radius,
                    backgroundColor:
                      key === "poly" ? draft.colorPoly
                      : key === "video" ? draft.colorVideo
                      : draft.colorExam,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm rounded-xl bg-[var(--color-foreground)] text-[var(--color-background)] font-semibold hover:opacity-80 transition-opacity"
          >
            Fermer
          </button>
        </div>
      </aside>
    </>
  )
}
