export interface ThemeConfig {
  colorPoly: string
  colorVideo: string
  colorExam: string
  radius: string
  bgLight: string
  cardLight: string
  bgDark: string
  cardDark: string
}

export interface ThemePreset {
  id: string
  name: string
  config: ThemeConfig
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "rose-violet",
    name: "Rose & Violet",
    config: { colorPoly: "#f472b6", colorVideo: "#7c3aed", colorExam: "#f59e0b", radius: "0.75rem", bgLight: "#fafafa", cardLight: "#ffffff", bgDark: "#0a0a0a", cardDark: "#111111" },
  },
  {
    id: "indigo-cyan",
    name: "Indigo & Cyan",
    config: { colorPoly: "#6366f1", colorVideo: "#06b6d4", colorExam: "#f59e0b", radius: "0.75rem", bgLight: "#f8fafc", cardLight: "#ffffff", bgDark: "#09090b", cardDark: "#18181b" },
  },
  {
    id: "emerald-amber",
    name: "Émeraude & Ambre",
    config: { colorPoly: "#10b981", colorVideo: "#f59e0b", colorExam: "#8b5cf6", radius: "0.75rem", bgLight: "#f8faf8", cardLight: "#ffffff", bgDark: "#0a0f0a", cardDark: "#111811" },
  },
  {
    id: "red-orange",
    name: "Rouge & Orange",
    config: { colorPoly: "#ef4444", colorVideo: "#f97316", colorExam: "#8b5cf6", radius: "0.75rem", bgLight: "#fafafa", cardLight: "#ffffff", bgDark: "#0a0a0a", cardDark: "#111111" },
  },
  {
    id: "sky-teal",
    name: "Ciel & Teal",
    config: { colorPoly: "#0ea5e9", colorVideo: "#14b8a6", colorExam: "#f59e0b", radius: "0.75rem", bgLight: "#f8fafc", cardLight: "#ffffff", bgDark: "#09090b", cardDark: "#111111" },
  },
  {
    id: "candy",
    name: "Candy",
    config: { colorPoly: "#ec4899", colorVideo: "#a855f7", colorExam: "#06b6d4", radius: "1rem", bgLight: "#fdf4ff", cardLight: "#ffffff", bgDark: "#0f0a14", cardDark: "#1a0f1e" },
  },
  {
    id: "midnight",
    name: "Midnight",
    config: { colorPoly: "#818cf8", colorVideo: "#34d399", colorExam: "#fb923c", radius: "0.75rem", bgLight: "#f1f5f9", cardLight: "#ffffff", bgDark: "#0f172a", cardDark: "#1e293b" },
  },
  {
    id: "rounded",
    name: "Pill (très arrondi)",
    config: { colorPoly: "#f472b6", colorVideo: "#7c3aed", colorExam: "#f59e0b", radius: "1.25rem", bgLight: "#fafafa", cardLight: "#ffffff", bgDark: "#0a0a0a", cardDark: "#111111" },
  },
  {
    id: "sharp",
    name: "Sharp (angles droits)",
    config: { colorPoly: "#f472b6", colorVideo: "#7c3aed", colorExam: "#f59e0b", radius: "0.2rem", bgLight: "#fafafa", cardLight: "#ffffff", bgDark: "#0a0a0a", cardDark: "#111111" },
  },
]

export const DEFAULT_THEME: ThemeConfig = THEME_PRESETS[0].config

const STORAGE_KEY = "enm_theme_config"

export function loadThemeFromStorage(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_THEME, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_THEME
}

export function saveThemeToStorage(config: ThemeConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch { /* ignore */ }
}

/** Injecte toutes les CSS vars dynamiques sur :root */
export function applyTheme(config: ThemeConfig, dark: boolean): void {
  const root = document.documentElement

  root.style.setProperty("--color-poly",        config.colorPoly)
  root.style.setProperty("--color-poly-light",  alpha(config.colorPoly, 0.13))
  root.style.setProperty("--color-poly-soft",   alpha(config.colorPoly, 0.20))
  root.style.setProperty("--color-poly-muted",  alpha(config.colorPoly, 0.55))

  root.style.setProperty("--color-video",       config.colorVideo)
  root.style.setProperty("--color-video-light", alpha(config.colorVideo, 0.13))
  root.style.setProperty("--color-video-soft",  alpha(config.colorVideo, 0.20))
  root.style.setProperty("--color-video-muted", alpha(config.colorVideo, 0.55))

  root.style.setProperty("--color-exam",        config.colorExam)
  root.style.setProperty("--color-exam-light",  alpha(config.colorExam, 0.13))
  root.style.setProperty("--color-exam-soft",   alpha(config.colorExam, 0.20))
  root.style.setProperty("--color-exam-muted",  alpha(config.colorExam, 0.55))

  root.style.setProperty("--radius", config.radius)

  if (dark) {
    root.style.setProperty("--color-background", config.bgDark)
    root.style.setProperty("--color-card",       config.cardDark)
    root.style.setProperty("--color-popover",    config.cardDark)
    // secondary / muted derivés du fond dark
    root.style.setProperty("--color-secondary",  lighten(config.bgDark, 12))
    root.style.setProperty("--color-muted",      lighten(config.bgDark, 12))
    root.style.setProperty("--color-border",     lighten(config.bgDark, 22))
  } else {
    root.style.setProperty("--color-background", config.bgLight)
    root.style.setProperty("--color-card",       config.cardLight)
    root.style.setProperty("--color-popover",    config.cardLight)
    // secondary / muted derivés du fond light
    root.style.setProperty("--color-secondary",  darken(config.bgLight, 4))
    root.style.setProperty("--color-muted",      darken(config.bgLight, 4))
    root.style.setProperty("--color-border",     darken(config.bgLight, 10))
  }
}

// ── Helpers couleur ────────────────────────────────────────────────────────

function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

function darken(hex: string, pct: number): string {
  let [r, g, b] = hexToRgb(hex)
  r = Math.max(0, r - pct)
  g = Math.max(0, g - pct)
  b = Math.max(0, b - pct)
  return toHex(r, g, b)
}

function lighten(hex: string, pct: number): string {
  let [r, g, b] = hexToRgb(hex)
  r = Math.min(255, r + pct)
  g = Math.min(255, g + pct)
  b = Math.min(255, b + pct)
  return toHex(r, g, b)
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function toHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
