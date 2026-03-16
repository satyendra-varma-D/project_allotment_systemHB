/**
 * ENHANCED LISTING HEADER COMPONENT
 * 
 * Standardized header for all listing modules with consistent layout:
 * 
 * LEFT SIDE:
 * - Module Title
 * - Subtitle (optional)
 * 
 * RIGHT SIDE (in order):
 * - Structure View (Grid/List/Table selector)
 * - Search Icon
 * - Column Selection (only visible in Table view)
 * - Filter Icon
 * - Refresh Icon
 * - Export Icon
 * - Summary View Toggle
 * - Clone Button (optional, for specific modules)
 * - Add New Button
 * 
 * USAGE:
 * <ListingHeader
 *   title="Projects"
 *   subtitle="Manage delivery operations"
 *   moduleName="Project"
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   searchValue={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   onFilterClick={() => setShowFilters(!showFilters)}
 *   onRefresh={() => loadData()}
 *   onExport={() => exportData()}
 *   showSummary={showSummary}
 *   onSummaryToggle={() => setShowSummary(!showSummary)}
 *   onAdd={() => setIsAddModalOpen(true)}
 *   onClone={handleCloneProject} // Optional
 *   // Column selection (only for table view)
 *   columns={columns}
 *   visibleColumns={visibleColumns}
 *   onToggleColumn={toggleColumn}
 * />
 */

import { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Plus,
  Copy,
  Grid3x3,
  List,
  Table,
  Columns3,
  ChevronRight,
  Check,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { IconButton } from './IconButton';
import { PrimaryButton } from './PrimaryButton';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from './FlyoutMenu';
import { cn } from '../../ui/utils';

export type ViewMode = 'grid' | 'list' | 'table';

export interface ColumnConfig {
  key: string;
  label: string;
}

interface ListingHeaderProps {
  // Title section
  title: string;
  subtitle?: string;
  moduleName: string; // e.g., "Project", "Milestone", "Lead"

  // View mode
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableViews?: ViewMode[]; // Default: ['grid', 'list', 'table']

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Column selection (table view only)
  columns?: ColumnConfig[];
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (key: string) => void;

  // Actions
  onFilterClick?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  
  // Export options
  exportOptions?: {
    onExportCSV?: () => void;
    onExportExcel?: () => void;
    onExportPDF?: () => void;
  };

  // Summary view toggle
  showSummary?: boolean;
  onSummaryToggle?: () => void;

  // Clone functionality (optional)
  onClone?: () => void;
  cloneDisabled?: boolean;
  cloneTooltip?: string;

  // Add button
  onAdd: () => void;

  // Custom actions (optional)
  customActions?: React.ReactNode;

  className?: string;
}

export function ListingHeader({
  title,
  subtitle,
  moduleName,
  viewMode,
  onViewModeChange,
  availableViews = ['grid', 'list', 'table'],
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  columns = [],
  visibleColumns = {},
  onToggleColumn,
  onFilterClick,
  onRefresh,
  onExport,
  exportOptions,
  showSummary = true,
  onSummaryToggle,
  onClone,
  cloneDisabled = false,
  cloneTooltip,
  onAdd,
  customActions,
  className = '',
}: ListingHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const viewIcons = {
    grid: Grid3x3,
    list: List,
    table: Table,
  };

  const viewLabels = {
    grid: 'Grid View',
    list: 'List View',
    table: 'Table View',
  };

  const CurrentViewIcon = viewIcons[viewMode];

  return (
    <div className={`mb-6 px-6 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        {/* LEFT SIDE - Title and Subtitle */}
        <div className="flex-1">
          <h2 className="text-[32px] leading-[40px] font-semibold text-neutral-900 dark:text-white mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* RIGHT SIDE - All Action Icons */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          {/* Structure View Selector */}
          <div className="relative" data-flyout-container>
            <IconButton
              icon={CurrentViewIcon}
              onClick={() => setShowViewMenu(!showViewMenu)}
              title="Change view"
            />
            {showViewMenu && (
              <FlyoutMenu position="right" onClose={() => setShowViewMenu(false)}>
                {availableViews.map((view) => {
                  const ViewIcon = viewIcons[view];
                  return (
                    <FlyoutMenuItem
                      key={view}
                      icon={ViewIcon}
                      onClick={() => {
                        onViewModeChange(view);
                        setShowViewMenu(false);
                        toast.success(`Switched to ${viewLabels[view]}`);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{viewLabels[view]}</span>
                        {viewMode === view && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                      </div>
                    </FlyoutMenuItem>
                  );
                })}
              </FlyoutMenu>
            )}
          </div>

          {/* Search Icon/Input */}
          {onSearchChange && (
            <>
              {!showSearchInput ? (
                <IconButton
                  icon={Search}
                  onClick={() => setShowSearchInput(true)}
                  title="Search"
                />
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onBlur={() => {
                      if (!searchValue) setShowSearchInput(false);
                    }}
                    placeholder={searchPlaceholder || `Search ${moduleName.toLowerCase()}s...`}
                    className="w-64 px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    autoFocus
                  />
                  {searchValue && (
                    <button
                      onClick={() => {
                        onSearchChange('');
                        setShowSearchInput(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Column Selection (only in table view) */}
          {viewMode === 'table' && columns.length > 0 && onToggleColumn && (
            <div className="relative" data-flyout-container>
              <IconButton
                icon={Columns3}
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                title="Customize columns"
              />
              {showColumnMenu && (
                <FlyoutMenu position="right" onClose={() => setShowColumnMenu(false)}>
                  <div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 mb-1">
                    Table Columns
                  </div>
                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[column.key]}
                        onChange={() => onToggleColumn(column.key)}
                        className="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{column.label}</span>
                      {visibleColumns[column.key] && (
                        <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 ml-auto" />
                      )}
                    </label>
                  ))}
                </FlyoutMenu>
              )}
            </div>
          )}

          {/* Filter Icon */}
          {onFilterClick && (
            <IconButton
              icon={Filter}
              onClick={onFilterClick}
              title="Filter"
            />
          )}

          {/* Refresh Icon */}
          {onRefresh && (
            <IconButton
              icon={RefreshCw}
              onClick={() => {
                onRefresh();
                toast.success('Data refreshed');
              }}
              title="Refresh"
            />
          )}

          {/* Export Icon with submenu */}
          {(onExport || exportOptions) && (
            <div className="relative" data-flyout-container>
              <IconButton
                icon={Download}
                onClick={() => {
                  if (exportOptions) {
                    setShowExportMenu(!showExportMenu);
                  } else {
                    onExport?.();
                    toast.success('Exporting data...');
                  }
                }}
                title="Export"
              />
              {exportOptions && showExportMenu && (
                <FlyoutMenu position="right" onClose={() => setShowExportMenu(false)}>
                  <div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 mb-1">
                    Export As
                  </div>
                  {exportOptions.onExportCSV && (
                    <FlyoutMenuItem
                      icon={FileSpreadsheet}
                      onClick={() => {
                        exportOptions.onExportCSV?.();
                        setShowExportMenu(false);
                        toast.success('Exporting as CSV...');
                      }}
                    >
                      CSV
                    </FlyoutMenuItem>
                  )}
                  {exportOptions.onExportExcel && (
                    <FlyoutMenuItem
                      icon={FileSpreadsheet}
                      onClick={() => {
                        exportOptions.onExportExcel?.();
                        setShowExportMenu(false);
                        toast.success('Exporting as Excel...');
                      }}
                    >
                      Excel
                    </FlyoutMenuItem>
                  )}
                  {exportOptions.onExportPDF && (
                    <FlyoutMenuItem
                      icon={FileText}
                      onClick={() => {
                        exportOptions.onExportPDF?.();
                        setShowExportMenu(false);
                        toast.success('Exporting as PDF...');
                      }}
                    >
                      PDF
                    </FlyoutMenuItem>
                  )}
                </FlyoutMenu>
              )}
            </div>
          )}

          {/* Summary View Toggle */}
          {onSummaryToggle && (
            <IconButton
              icon={showSummary ? EyeOff : Eye}
              onClick={() => {
                onSummaryToggle();
                toast.success(showSummary ? 'Summary hidden' : 'Summary visible');
              }}
              title={showSummary ? 'Hide summary' : 'Show summary'}
            />
          )}

          {/* Custom Actions */}
          {customActions}

          {/* Clone Button (if provided) */}
          {onClone && (
            <button
              onClick={onClone}
              disabled={cloneDisabled}
              title={cloneTooltip || `Clone ${moduleName}`}
              className={cn(
                'inline-flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-lg border transition-colors',
                cloneDisabled
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-700 cursor-not-allowed'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              )}
            >
              <Copy className="w-4 h-4" />
              Clone {moduleName}
            </button>
          )}

          {/* Add New Button */}
          <PrimaryButton icon={Plus} onClick={onAdd}>
            Add {moduleName}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}