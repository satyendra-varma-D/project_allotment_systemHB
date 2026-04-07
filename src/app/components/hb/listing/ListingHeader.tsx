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
        <div className="flex-1 flex items-start gap-3">
          {onBack && (
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h2 className="text-[32px] font-semibold">{title}</h2>
            {subtitle && <p className="text-sm">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switch */}
          <IconButton
            icon={CurrentViewIcon}
            onClick={() => setShowViewMenu(!showViewMenu)}
          />

          {/* Column Selector */}
          {viewMode === 'table' && (
            <IconButton
              icon={Columns} // ✅ FIXED
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            />
          )}

          {/* Filter */}
          {onFilterClick && <IconButton icon={Filter} onClick={onFilterClick} />}

          {/* Refresh */}
          {onRefresh && (
            <IconButton
              icon={RefreshCw}
              onClick={() => {
                onRefresh();
                toast.success('Data refreshed');
              }}
            />
          )}

          {/* Export */}
          {(onExport || exportOptions) && (
            <IconButton
              icon={Download}
              onClick={() => {
                if (exportOptions) {
                  setShowExportMenu(!showExportMenu);
                } else {
                  onExport?.();
                }
              }}
            />
          )}

          {/* Summary Toggle */}
          {onSummaryToggle && (
            <IconButton
              icon={showSummary ? EyeOff : Eye}
              onClick={onSummaryToggle}
            />
          )}

          {/* Clone */}
          {onClone && (
            <button onClick={onClone}>
              <Copy className="w-4 h-4" />
              Clone
            </button>
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