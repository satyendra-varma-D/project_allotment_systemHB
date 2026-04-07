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
  Columns, // ✅ FIXED
  ChevronRight,
  Check,
  FileSpreadsheet,
  FileText,
  ArrowLeft,
  Briefcase,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { IconButton } from './IconButton';
import { PrimaryButton } from './PrimaryButton';
import { FlyoutMenu, FlyoutMenuItem } from './FlyoutMenu';
import { cn } from '../../ui/utils';

export type ViewMode = 'grid' | 'list' | 'table';

export interface ColumnConfig {
  key: string;
  label: string;
}

export interface ListingHeaderProps {
  title: string;
  subtitle?: string;
  moduleName: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableViews?: ViewMode[];

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  columns?: ColumnConfig[];
  visibleColumns?: Record<string, boolean>;
  onToggleColumn?: (key: string) => void;

  onFilterClick?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;

  exportOptions?: {
    onExportCSV?: () => void;
    onExportExcel?: () => void;
    onExportPDF?: () => void;
  };

  showSummary?: boolean;
  onSummaryToggle?: () => void;

  onClone?: () => void;
  cloneDisabled?: boolean;
  cloneTooltip?: string;

  onAdd?: () => void;
  hideAddButton?: boolean;

  onBack?: () => void;

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
  hideAddButton = false,
  onBack,
  customActions,
  className = '',
}: ListingHeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const viewIcons = {
    grid: Grid3x3,
    list: List,
    table: Table,
  };

  const CurrentViewIcon = viewIcons[viewMode];

  const handleRefreshClick = () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      onRefresh();
      toast.success('Data refreshed');
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className={`mb-6 px-6 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 flex items-start gap-3">
          {onBack && (
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h2 className="text-[32px] font-semibold text-neutral-900 dark:text-white leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-tight font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher Dropdown */}
          <IconButton
            icon={CurrentViewIcon}
            title="Change View"
            active={false}
            menuItems={[
              { icon: Grid3x3, label: 'Grid View', onClick: () => onViewModeChange('grid') },
              { icon: List, label: 'List View', onClick: () => onViewModeChange('list') },
              { icon: Table, label: 'Table View', onClick: () => onViewModeChange('table') },
            ]}
          />

          {/* Column Selector */}
          {viewMode === 'table' && (
            <IconButton
              icon={Columns}
              title="Select Columns"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            />
          )}

          {/* Filter */}
          {onFilterClick && (
            <IconButton 
              icon={Filter} 
              title="Advanced Filter"
              onClick={onFilterClick} 
            />
          )}

          {/* Refresh */}
          {onRefresh && (
            <IconButton
              icon={RefreshCw}
              title="Refresh Data"
              className={isRefreshing ? 'animate-spin border-primary-500 text-primary-500' : ''}
              onClick={handleRefreshClick}
            />
          )}

          {/* Export Dropdown */}
          {(onExport || exportOptions) && (
            <IconButton
              icon={Download}
              title="Export Options"
              menuItems={[
                { icon: FileText, label: 'Export as CSV', onClick: exportOptions?.onExportCSV || onExport },
                { icon: Briefcase, label: 'Export as Excel', onClick: exportOptions?.onExportExcel || onExport },
                { divider: true },
                { icon: Settings, label: 'Export as PDF', onClick: exportOptions?.onExportPDF || onExport },
              ]}
            />
          )}

          {/* Summary Toggle */}
          {onSummaryToggle && (
            <IconButton
              icon={showSummary ? EyeOff : Eye}
              title={showSummary ? "Hide Summary" : "Show Summary"}
              active={showSummary}
              onClick={onSummaryToggle}
            />
          )}

          {/* Clone */}
          {onClone && (
            <IconButton
              icon={Copy}
              title={cloneTooltip || "Clone Selected"}
              disabled={cloneDisabled}
              onClick={onClone}
              className={cloneDisabled ? 'opacity-50' : ''}
            />
          )}

          {/* Add */}
          {!hideAddButton && onAdd && (
            <PrimaryButton icon={Plus} onClick={onAdd}>
              Add {moduleName}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}