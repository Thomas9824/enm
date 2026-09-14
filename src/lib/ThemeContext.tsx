import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ThemeConfig } from "@/lib/theme"
import { loadThemeFromStorage, saveThemeToStorage, applyTheme } from "@/lib/theme"

interface ThemeContextValue {
  themeConfig: ThemeConfig
  setThemeConfig: (config: ThemeConfig) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeConfig, setThemeConfigState] = useState<ThemeConfig>(loadThemeFromStorage)
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return (localStorage.getItem("notion_theme") as "light" | "dark") === "dark"
  })

  const setThemeConfig = useCallback((config: ThemeConfig) => {
    setThemeConfigState(config)
    saveThemeToStorage(config)
    applyTheme(config, darkMode)
  }, [darkMode])

  const setDarkMode = useCallback((dark: boolean) => {
    setDarkModeState(dark)
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("notion_theme", dark ? "dark" : "light")
    applyTheme(themeConfig, dark)
  }, [themeConfig])

  // Apply on mount and when either changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    applyTheme(themeConfig, darkMode)
  }, [themeConfig, darkMode])

  return (
    <ThemeContext.Provider value={{ themeConfig, setThemeConfig, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}
