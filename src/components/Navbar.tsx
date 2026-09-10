import React from "react"
import { BookOpen, Moon, Sun, Download, Plus, Type } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  font: "sans" | "serif";
  onToggleFont: () => void;
  onExport: () => void;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  font,
  onToggleFont,
  onExport,
  onOpenCreate,
}) => {
  return (
    <header className="sticky top-0 z-40 h-12 w-full border-b border-border/80 bg-background/95 backdrop-blur px-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted/60 transition-colors cursor-pointer text-foreground font-medium">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Espace ENM</span>
        </div>
        <span>/</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Révisions</span>
        <span>/</span>
        <span className="text-foreground font-medium">Polycopiés & Progression</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFont}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          title={`Changer de style : Actuel ${font === "serif" ? "Serif" : "Sans-serif"}`}
        >
          <Type className="w-3.5 h-3.5 mr-1" />
          <span className={font === "serif" ? "font-serif" : "font-sans"}>Aa</span>
        </Button>

        <Button
          variant="ghost"
          size="iconSm"
          onClick={onToggleTheme}
          className="text-muted-foreground hover:text-foreground"
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          title="Exporter la sauvegarde JSON"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          <span>Exporter</span>
        </Button>

        <Button
          variant="notionPrimary"
          size="sm"
          onClick={onOpenCreate}
          className="h-8 text-xs font-medium px-3 ml-1"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Nouveau poly</span>
        </Button>
      </div>
    </header>
  )
}
