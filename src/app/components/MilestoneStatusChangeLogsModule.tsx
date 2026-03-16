import { useState, useMemo } from 'react';
import {
  MoreVertical,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ListingColumnConfig } from './hb/listing';

// Milestone Status Change Log interface
interface MilestoneStatusChangeLog {
  id: string;
  projectCode: string;
  projectName: string;
  milestoneCode: string;
  milestoneName: string;
  milestoneAmount: number;
  currency: string;
  milestoneActualDate?: string;
  milestonePlannedDate: string;
  paymentStatusDate?: string;
  paymentStatus: 'Pending' | 'Requested' | 'Invoice Raised' | 'Received';
  previousPaymentStatus?: string;
  changedBy: string;
  changedDate: string;
}

// Mock data
const mockStatusChangeLogs: MilestoneStatusChangeLog[] = [
  {
    id: '1',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    milestoneCode: 'REQ-ANALYSIS',
    milestoneName: 'Requirements & Analysis',
    milestoneAmount: 50000,
    currency: 'USD',
    milestoneActualDate: '2024-02-14',
    milestonePlannedDate: '2024-02-15',
    paymentStatusDate: '2024-02-15',
    paymentStatus: 'Received',
    previousPaymentStatus: 'Invoice Raised',
    changedBy: 'John Smith',
    changedDate: '2024-02-15T10:30:00',
  },
  {
    id: '2',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    milestoneCode: 'REQ-ANALYSIS',
    milestoneName: 'Requirements & Analysis',
    milestoneAmount: 50000,
    currency: 'USD',
    milestoneActualDate: '2024-02-14',
    milestonePlannedDate: '2024-02-15',
    paymentStatusDate: '2024-02-14',
    paymentStatus: 'Invoice Raised',
    previousPaymentStatus: 'Requested',
    changedBy: 'John Smith',
    changedDate: '2024-02-14T14:20:00',
  },
  {
    id: '3',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    milestoneCode: 'DESIGN-PROTO',
    milestoneName: 'Design & Prototyping',
    milestoneAmount: 30000,
    currency: 'USD',
    milestoneActualDate: '2024-03-16',
    milestonePlannedDate: '2024-03-15',
    paymentStatusDate: '2024-03-15',
    paymentStatus: 'Invoice Raised',
    previousPaymentStatus: 'Requested',
    changedBy: 'Sarah Johnson',
    changedDate: '2024-03-15T09:15:00',
  },
  {
    id: '4',
    projectCode: 'MB-001',
    projectName: 'Mobile Banking App',
    milestoneCode: 'DEV-PHASE-1',
    milestoneName: 'Development Phase 1',
    milestoneAmount: 100000,
    currency: 'USD',
    milestoneActualDate: undefined,
    milestonePlannedDate: '2024-04-30',
    paymentStatusDate: undefined,
    paymentStatus: 'Pending',
    previousPaymentStatus: undefined,
    changedBy: 'System',
    changedDate: '2024-01-01T08:00:00',
  },
  {
    id: '5',
    projectCode: 'EC-001',
    projectName: 'E-Commerce Platform Redesign',
    milestoneCode: 'QA-TESTING',
    milestoneName: 'Quality Assurance & Testing',
    milestoneAmount: 15000,
    currency: 'USD',
    milestoneActualDate: '2024-03-25',
    milestonePlannedDate: '2024-03-20',
    paymentStatusDate: '2024-03-26',
    paymentStatus: 'Requested',
    previousPaymentStatus: 'Pending',
    changedBy: 'Michael Brown',
    changedDate: '2024-03-26T11:45:00',
  },
  {
    id: '6',
    projectCode: 'EC-001',
    projectName: 'E-Commerce Platform Redesign',
    milestoneCode: 'GO-LIVE',
    milestoneName: 'Go Live & Deployment',
    milestoneAmount: 25000,
    currency: 'USD',
    milestoneActualDate: '2024-07-02',
    milestonePlannedDate: '2024-07-01',
    paymentStatusDate: '2024-07-03',
    paymentStatus: 'Received',
    previousPaymentStatus: 'Invoice Raised',
    changedBy: 'Emily Davis',
    changedDate: '2024-07-03T16:30:00',
  },
  {
    id: '7',
    projectCode: 'MB-001',
    projectName: 'Mobile Banking App',
    milestoneCode: 'MOBILE-NATIVE',
    milestoneName: 'Native Mobile Development',
    milestoneAmount: 120000,
    currency: 'USD',
    milestoneActualDate: undefined,
    milestonePlannedDate: '2024-05-15',
    paymentStatusDate: '2024-05-16',
    paymentStatus: 'Requested',
    previousPaymentStatus: 'Pending',
    changedBy: 'Robert Wilson',
    changedDate: '2024-05-16T13:20:00',
  },
];

export default function MilestoneStatusChangeLogsModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [logs] = useState<MilestoneStatusChangeLog[]>(mockStatusChangeLogs);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    projectCode: true,
    milestoneCode: true,
    amount: true,
    dates: true,
    paymentStatus: true,
    changedBy: true,
  });
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Table columns configuration
  const tableColumns: ListingColumnConfig[] = [
    { key: 'projectCode', label: 'Project Code' },
    { key: 'milestoneCode', label: 'Milestone Code' },
    { key: 'amount', label: 'Amount' },
    { key: 'dates', label: 'Dates' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'changedBy', label: 'Changed By' },
  ];

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = logs.length;
    
    const statusChanges = logs.filter(log => log.previousPaymentStatus).length;
    const pendingCount = logs.filter(log => log.paymentStatus === 'Pending').length;
    const requestedCount = logs.filter(log => log.paymentStatus === 'Requested').length;
    const invoiceRaisedCount = logs.filter(log => log.paymentStatus === 'Invoice Raised').length;
    const receivedCount = logs.filter(log => log.paymentStatus === 'Received').length;

    return [
      {
        label: 'Total Log Entries',
        value: total.toString(),
        icon: 'Database',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Status Changes',
        value: statusChanges.toString(),
        icon: 'TrendingUp',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: `${statusChanges} changes recorded`,
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Pending Status',
        value: pendingCount.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Requested Status',
        value: requestedCount.toString(),
        icon: 'FileText',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Invoice Raised',
        value: invoiceRaisedCount.toString(),
        icon: 'FileText',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Received Status',
        value: receivedCount.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '',
        trendDirection: 'up' as const,
      },
    ];
  }, [logs]);

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.projectCode.toLowerCase().includes(query) ||
          log.projectName.toLowerCase().includes(query) ||
          log.milestoneCode.toLowerCase().includes(query) ||
          log.milestoneName.toLowerCase().includes(query) ||
          log.changedBy.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((log) => {
          const logValue = log[filter.field as keyof MilestoneStatusChangeLog];
          if (typeof logValue === 'string') {
            return logValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return logValue === filter.value;
        });
      }
    });

    return filtered;
  }, [logs, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  // Handlers
  const handleAddFilter = (filter: FilterCondition) => {
    setActiveFilters([...activeFilters, filter]);
  };

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleViewDetails = (log: MilestoneStatusChangeLog) => {
    console.log('View details:', log);
  };

  // Get status badge style
  const getPaymentStyle = (status: MilestoneStatusChangeLog['paymentStatus']) => {
    const styles = {
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Requested': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Invoice Raised': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Received': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status];
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const validCurrency = currency && currency.length === 3 ? currency : 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header with ListingHeader Component */}
      <ListingHeader
        title="Milestone Status Change Logs"
        subtitle="Track all milestone payment status changes and historical records"
        moduleName="Status Change Log"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        columns={tableColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onFilterClick={() => setIsAdvancedSearchOpen(true)}
        onRefresh={() => {}}
        exportOptions={{
          onExportCSV: () => console.log('Export CSV'),
          onExportExcel: () => console.log('Export Excel'),
          onExportPDF: () => console.log('Export PDF'),
        }}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        hideAddButton={true}
      />

      {/* Summary Widgets - HIDDEN by default */}
      {showSummary && (
        <div className="px-6 pb-6">
          <SummaryWidgets widgets={summaryData} />
        </div>
      )}

      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'paymentStatus', label: 'Payment Status', type: 'select', options: ['Pending', 'Requested', 'Invoice Raised', 'Received'] },
              { field: 'projectCode', label: 'Project Code', type: 'text' },
              { field: 'milestoneCode', label: 'Milestone Code', type: 'text' },
              { field: 'changedBy', label: 'Changed By', type: 'text' },
            ]}
          />
        </div>
      )}

      {/* Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClear={handleClearFilters}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="px-6 pb-6">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLogs.map((log) => {
              const changeDateTime = formatDateTime(log.changedDate);
              return (
                <div
                  key={log.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header with Status Change Badge */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                            {log.projectCode}
                          </span>
                          {log.previousPaymentStatus && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Status Changed
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white text-sm leading-snug line-clamp-1">
                          {log.projectName}
                        </h3>
                      </div>
                      <div className="relative ml-2">
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === log.id ? null : log.id)}
                          className="p-1.5 hover:bg-white/50 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        {openDropdownId === log.id && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => {
                                handleViewDetails(log);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Milestone Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Milestone Details
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Code</span>
                          <span className="text-xs font-medium text-neutral-900 dark:text-white">
                            {log.milestoneCode}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Name</span>
                          <span className="text-xs font-medium text-neutral-900 dark:text-white text-right max-w-[60%] line-clamp-2">
                            {log.milestoneName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Amount - Highlighted */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Amount
                          </span>
                        </div>
                        <span className="text-lg font-bold text-green-900 dark:text-green-100">
                          {formatCurrency(log.milestoneAmount, log.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Timeline
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Planned Date</span>
                          <span className="text-xs font-medium text-neutral-900 dark:text-white">
                            {new Date(log.milestonePlannedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        {log.milestoneActualDate && (
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Actual Date</span>
                            <span className="text-xs font-medium text-neutral-900 dark:text-white">
                              {new Date(log.milestoneActualDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                        {log.paymentStatusDate && (
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Status Date</span>
                            <span className="text-xs font-medium text-neutral-900 dark:text-white">
                              {new Date(log.paymentStatusDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Status Section */}
                    <div className="space-y-2">
                      {log.previousPaymentStatus && (
                        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Previous Status</span>
                            <span className={`px-2 py-1 rounded-md font-medium ${getPaymentStyle(log.previousPaymentStatus as any)}`}>
                              {log.previousPaymentStatus}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className={`w-full text-center py-2.5 px-3 rounded-lg font-semibold text-sm ${getPaymentStyle(log.paymentStatus)}`}>
                        {log.paymentStatus}
                      </div>
                    </div>

                    {/* Change Information */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Changed By
                        </span>
                        <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                          {log.changedBy}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {changeDateTime.date}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {changeDateTime.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedLogs.map((log) => {
              const changeDateTime = formatDateTime(log.changedDate);
              return (
                <div
                  key={log.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{log.projectCode}</span>
                        <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{log.milestoneCode}</span>
                        {log.previousPaymentStatus && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Status Changed
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{log.projectName}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{log.milestoneName}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Amount</span>
                          <span className="text-neutral-900 dark:text-white font-semibold">{formatCurrency(log.milestoneAmount, log.currency)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Planned Date</span>
                          <span className="text-neutral-900 dark:text-white">
                            {new Date(log.milestonePlannedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Payment Status</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPaymentStyle(log.paymentStatus)}`}>
                            {log.paymentStatus}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Changed By</span>
                          <span className="text-neutral-900 dark:text-white">{log.changedBy}</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 block">{changeDateTime.date} {changeDateTime.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 relative group">
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Changed Info
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedLogs.map((log) => {
                    const changeDateTime = formatDateTime(log.changedDate);
                    return (
                      <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-white">{log.projectName}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">{log.projectCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-white">{log.milestoneName}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">{log.milestoneCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-white">
                          {formatCurrency(log.milestoneAmount, log.currency)}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                          <div className="space-y-1">
                            <div>
                              <span className="text-neutral-500 dark:text-neutral-400">Planned: </span>
                              {new Date(log.milestonePlannedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            {log.milestoneActualDate && (
                              <div>
                                <span className="text-neutral-500 dark:text-neutral-400">Actual: </span>
                                {new Date(log.milestoneActualDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPaymentStyle(log.paymentStatus)}`}>
                              {log.paymentStatus}
                            </span>
                            {log.previousPaymentStatus && (
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                From: {log.previousPaymentStatus}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                          <div>
                            <div className="font-medium">{log.changedBy}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {changeDateTime.date} {changeDateTime.time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block group">
                            <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                              <MoreVertical className="w-4 h-4 text-neutral-500" />
                            </button>
                            <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                              <button
                                onClick={() => handleViewDetails(log)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredLogs.length}
          />
        </div>
      </div>
    </div>
  );
}
