import React from "react"
import {
  LayoutGrid,
  List,
  Search,
  X,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ViewMode, StatusFilter, SortOption } from "@/types"

interface ControlsBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjects: string[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  onOpenCreate: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  subjects,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  onOpenCreate,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-border/80 mb-5">
      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md border border-border/60 self-start">
        <button
          onClick={() => onViewModeChange("gallery")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            viewMode === "gallery"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Galerie</span>
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            viewMode === "table"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Tableau</span>
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[190px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un polycopié..."
            className="h-8 pl-8 pr-7 text-xs bg-background"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">Toutes les matières</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="TODO">Non commencé (0%)</option>
            <option value="IN_PROGRESS">En cours (1 - 99%)</option>
            <option value="DONE">Terminé (100%)</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center">
          <select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="progress-desc">Progression (Plus avancé)</option>
            <option value="progress-asc">Progression (Moins avancé)</option>
            <option value="pages-remaining-desc">Pages restantes</option>
            <option value="title-asc">Nom (A → Z)</option>
            <option value="date-newest">Récents d'abord</option>
          </select>
        </div>

        {/* New button */}
        <Button
          variant="notionPrimary"
          size="sm"
          onClick={onOpenCreate}
          className="h-8 text-xs font-medium px-3"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Nouveau</span>
        </Button>
      </div>
    </div>
  )
}
