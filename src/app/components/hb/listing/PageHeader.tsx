import { useState, ReactNode } from 'react';
import {
  MoreVertical,
  Upload,
  Download,
  Printer,
  ArrowUpDown,
  Columns,
  ChevronRight,
  Check,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { IconButton } from './IconButton';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from './FlyoutMenu';
import { cn } from '../../ui/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
    current?: boolean;
    onClick?: () => void;
  }[];
  children?: ReactNode;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  className?: string;
  moreMenu?: {
    sortOptions?: { label: string; value: string; direction: 'asc' | 'desc' }[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
    customizeColumns?: {
      columns: { key: string; label: string }[];
      visibleColumns: Record<string, boolean>;
      onToggleColumn: (key: string) => void;
    };
  };
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  children,
  primaryAction,
  secondaryActions,
  className = '',
  moreMenu,
}: PageHeaderProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const hasMoreMenu = moreMenu && (
    moreMenu.sortOptions ||
    moreMenu.customizeColumns
  );

  return (
    <div className={`mb-6 px-6 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-[24px]">

        {/* LEFT SECTION */}
        <div className="flex-1">
          <h2 className="text-[32px] leading-[40px] font-semibold text-neutral-900 dark:text-white mb-1">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb>
              {breadcrumbs.map((item, index) => (
                <BreadcrumbItem
                  key={index}
                  href={item.href}
                  current={item.current}
                  onClick={item.onClick}
                >
                  {item.label}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )}
        </div>

        {/* RIGHT SECTION */}
        {(children || hasMoreMenu || primaryAction || secondaryActions) && (
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">

            {children}

            {/* MORE MENU */}
            {hasMoreMenu && (
              <div className="relative" data-flyout-container>
                <IconButton
                  icon={MoreVertical}
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  title="More options"
                />

                {showMoreMenu && (
                  <FlyoutMenu position="right" onClose={() => setShowMoreMenu(false)}>

                    {/* SORT */}
                    {moreMenu.sortOptions && moreMenu.sortOptions.length > 0 && (
                      <FlyoutMenuItem icon={ArrowUpDown} asDiv>
                        <div className="relative group/sort w-full">
                          <div className="flex items-center justify-between w-full">
                            <span>Sort</span>
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </div>

                          <div className="absolute left-full top-0 ml-1 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1.5 z-50 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all duration-200 pointer-events-none group-hover/sort:pointer-events-auto">

                            <div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 mb-1">
                              Sort By
                            </div>

                            {moreMenu.sortOptions.map((option, index) => (
                              <button
                                key={`${option.value}-${option.direction}-${index}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moreMenu.onSortChange?.(option.value, option.direction);
                                  setShowMoreMenu(false);
                                  toast.success(`Sorted by ${option.label}`);
                                }}
                                className={cn(
                                  'w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors',
                                  moreMenu.sortField === option.value &&
                                    moreMenu.sortDirection === option.direction
                                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20'
                                    : 'text-neutral-700 dark:text-neutral-300'
                                )}
                              >
                                <span>{option.label}</span>
                                {moreMenu.sortField === option.value &&
                                  moreMenu.sortDirection === option.direction && (
                                    <Check className="w-4 h-4" />
                                  )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </FlyoutMenuItem>
                    )}

                    {/* DIVIDER */}
                    {(moreMenu.sortOptions && moreMenu.customizeColumns) && (
                      <FlyoutMenuDivider />
                    )}

                    {/* CUSTOMIZE COLUMNS */}
                    {moreMenu.customizeColumns && (
                      <FlyoutMenuItem icon={Columns} asDiv roundedBottom>
                        <div className="relative group/columns w-full">
                          <div className="flex items-center justify-between w-full">
                            <span>Customize Columns</span>
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </div>

                          <div className="absolute left-full top-0 ml-1 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1.5 z-50 opacity-0 invisible group-hover/columns:opacity-100 group-hover/columns:visible transition-all duration-200 pointer-events-none group-hover/columns:pointer-events-auto">

                            <div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 mb-1">
                              Table Columns
                            </div>

                            {moreMenu.customizeColumns.columns.map((column) => (
                              <label
                                key={column.key}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={moreMenu.customizeColumns?.visibleColumns[column.key]}
                                  onChange={() =>
                                    moreMenu.customizeColumns?.onToggleColumn(column.key)
                                  }
                                  className="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <span>{column.label}</span>

                                {moreMenu.customizeColumns?.visibleColumns[column.key] && (
                                  <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 ml-auto" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      </FlyoutMenuItem>
                    )}

                  </FlyoutMenu>
                )}
              </div>
            )}

            {primaryAction}
            {secondaryActions}

          </div>
        )}
      </div>
    </div>
  );
}