import { useState, useMemo, useEffect } from 'react';
import {
  Flag,
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ListingColumnConfig } from './hb/listing';
import { MilestonesEditSidePanel } from './MilestonesEditSidePanel';
import type { MilestoneData } from './MilestonesEditSidePanel';

// Milestone data interface
interface Milestone {
  id: string;
  milestoneId: string;
  projectId: string;
  projectCode: string; // Added
  projectName: string;
  clientName: string; // Added
  milestoneName: string;
  milestoneCode: string;
  milestoneAmount: number; // Added
  currency: string; // Added
  milestoneType: string; // Added
  plannedDate: string;
  actualDate?: string;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue'; // Added
  completionStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  invoiceStatus: 'Not Generated' | 'Generated' | 'Sent' | 'Paid';
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  dependencies?: string[];
  remarks?: string;
  createdDate?: string;
}

// Mock data
const mockMilestones: Milestone[] = [
  {
    id: '1',
    milestoneId: 'MS-2024-001',
    projectId: 'PRJ-2024-001',
    projectCode: 'CRM-001', // Added
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.', // Added
    milestoneName: 'Requirements & Analysis',
    milestoneCode: 'REQ-ANALYSIS',
    milestoneAmount: 50000, // Added
    currency: 'USD', // Added
    milestoneType: 'Analysis', // Added
    plannedDate: '2024-02-15',
    actualDate: '2024-02-14',
    paymentStatus: 'Paid', // Added
    completionStatus: 'Completed',
    approvalStatus: 'Approved',
    invoiceStatus: 'Paid',
    assignedTo: 'John Anderson',
    priority: 'High',
    remarks: 'Completed ahead of schedule',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    milestoneId: 'MS-2024-002',
    projectId: 'PRJ-2024-001',
    projectCode: 'CRM-001', // Added
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.', // Added
    milestoneName: 'Design & Prototyping',
    milestoneCode: 'DESIGN-PROTO',
    milestoneAmount: 30000, // Added
    currency: 'USD', // Added
    milestoneType: 'Design', // Added
    plannedDate: '2024-03-15',
    actualDate: '2024-03-16',
    paymentStatus: 'Partially Paid', // Added
    completionStatus: 'Completed',
    approvalStatus: 'Approved',
    invoiceStatus: 'Sent',
    assignedTo: 'John Anderson',
    priority: 'Medium',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    milestoneId: 'MS-2024-003',
    projectId: 'PRJ-2024-001',
    projectCode: 'CRM-001', // Added
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.', // Added
    milestoneName: 'Development Phase 1',
    milestoneCode: 'DEV-PHASE-1',
    milestoneAmount: 100000, // Added
    currency: 'USD', // Added
    milestoneType: 'Development', // Added
    plannedDate: '2024-04-30',
    paymentStatus: 'Pending', // Added
    completionStatus: 'In Progress',
    approvalStatus: 'Pending',
    invoiceStatus: 'Not Generated',
    assignedTo: 'John Anderson',
    priority: 'High',
    remarks: 'On track for completion',
    createdDate: '2024-01-15',
  },
  {
    id: '4',
    milestoneId: 'MS-2024-004',
    projectId: 'PRJ-2024-002',
    projectCode: 'MB-001', // Added
    projectName: 'Mobile Banking App',
    clientName: 'Bank of America', // Added
    milestoneName: 'UI/UX Design',
    milestoneCode: 'UIUX-DESIGN',
    milestoneAmount: 20000, // Added
    currency: 'USD', // Added
    milestoneType: 'Design', // Added
    plannedDate: '2024-03-01',
    actualDate: '2024-03-05',
    paymentStatus: 'Paid', // Added
    completionStatus: 'Completed',
    approvalStatus: 'Approved',
    invoiceStatus: 'Generated',
    assignedTo: 'Emily Chen',
    priority: 'Medium',
    remarks: 'Minor delays due to client feedback iterations',
    createdDate: '2024-02-01',
  },
  {
    id: '5',
    milestoneId: 'MS-2024-005',
    projectId: 'PRJ-2024-002',
    projectCode: 'MB-001', // Added
    projectName: 'Mobile Banking App',
    clientName: 'Bank of America', // Added
    milestoneName: 'Backend Development',
    milestoneCode: 'BACKEND-DEV',
    milestoneAmount: 50000, // Added
    currency: 'USD', // Added
    milestoneType: 'Development', // Added
    plannedDate: '2024-04-15',
    paymentStatus: 'Pending', // Added
    completionStatus: 'In Progress',
    approvalStatus: 'Pending',
    invoiceStatus: 'Not Generated',
    assignedTo: 'Emily Chen',
    priority: 'High',
    createdDate: '2024-02-01',
  },
  {
    id: '6',
    milestoneId: 'MS-2024-006',
    projectId: 'PRJ-2024-003',
    projectCode: 'EC-001', // Added
    projectName: 'E-Commerce Platform Redesign',
    clientName: 'Retail Giant', // Added
    milestoneName: 'Quality Assurance',
    milestoneCode: 'QA-TESTING',
    milestoneAmount: 15000, // Added
    currency: 'USD', // Added
    milestoneType: 'Testing', // Added
    plannedDate: '2024-03-20',
    actualDate: '2024-03-25',
    paymentStatus: 'Overdue', // Added
    completionStatus: 'Delayed',
    approvalStatus: 'Pending',
    invoiceStatus: 'Not Generated',
    assignedTo: 'Sarah Johnson',
    priority: 'Low',
    remarks: 'Extended testing due to critical bugs found',
    createdDate: '2023-11-01',
  },
];

interface MilestonesModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
}

export default function MilestonesModule({ initialFilters, onFiltersConsumed }: MilestonesModuleProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
      // Map initial filters to include unique IDs if they don't have them
      const filtersWithIds = initialFilters.map(f => ({
        id: f.id || `filter-${Date.now()}-${Math.random()}`,
        field: f.field,
        values: Array.isArray(f.value) ? f.value : [f.value]
      }));
      setActiveFilters(prev => [...prev, ...filtersWithIds]);
      onFiltersConsumed?.();
    }
  }, [initialFilters, onFiltersConsumed]);
  const [showSummary, setShowSummary] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    milestone: true,
    project: true,
    code: true,
    dates: true,
    payment: true,
    status: true,
  });

  // Table columns configuration
  const tableColumns: ListingColumnConfig[] = [
    { key: 'milestone', label: 'Milestone' },
    { key: 'project', label: 'Project' },
    { key: 'code', label: 'Code' },
    { key: 'dates', label: 'Dates' },
    { key: 'payment', label: 'Payment %' },
    { key: 'status', label: 'Status' },
  ];

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.completionStatus === 'Completed').length;
    const inProgress = milestones.filter(m => m.completionStatus === 'In Progress').length;
    const delayed = milestones.filter(m => m.completionStatus === 'Delayed').length;
    const paid = milestones.filter(m => m.paymentStatus === 'Paid').length;
    const invoicesPending = milestones.filter(m => m.invoiceStatus === 'Not Generated').length;

    return [
      {
        label: 'Total Milestones',
        value: total.toString(),
        icon: 'Flag',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+5',
        trendDirection: 'up' as const,
      },
      {
        label: 'Completed',
        value: completed.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+3',
        trendDirection: 'up' as const,
      },
      {
        label: 'In Progress',
        value: inProgress.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Delayed',
        value: delayed.toString(),
        icon: 'XCircle',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '-1',
        trendDirection: 'down' as const,
      },
      {
        label: 'Total Payment %',
        value: `${paid}%`,
        icon: 'Activity',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+8',
        trendDirection: 'up' as const,
      },
      {
        label: 'Pending Invoices',
        value: invoicesPending.toString(),
        icon: 'AlertCircle',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        trend: '-2',
        trendDirection: 'down' as const,
      },
    ];
  }, [milestones]);

  // Filter and search logic
  const filteredMilestones = useMemo(() => {
    let filtered = [...milestones];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (milestone) =>
          milestone.milestoneName.toLowerCase().includes(query) ||
          milestone.milestoneId.toLowerCase().includes(query) ||
          milestone.projectName.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.values && filter.values.length > 0) {
        filtered = filtered.filter((milestone) => {
          const milestoneValue = milestone[filter.field as keyof Milestone];
          if (typeof milestoneValue === 'string') {
            return filter.values.some(val => 
              milestoneValue.toLowerCase().includes(val.toLowerCase())
            );
          }
          return filter.values.includes(String(milestoneValue));
        });
      }
    });

    return filtered;
  }, [milestones, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredMilestones.length / itemsPerPage);
  const paginatedMilestones = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMilestones.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMilestones, currentPage, itemsPerPage]);

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

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsAddModalOpen(true);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      setMilestones(milestones.filter(m => m.id !== milestoneId));
    }
  };

  const handleSaveMilestone = () => {
    setIsAddModalOpen(false);
    setSelectedMilestone(null);
  };

  // Get status styles
  const getCompletionStyle = (status: Milestone['completionStatus']) => {
    const styles = {
      'Not Started': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Delayed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status];
  };

  const getPaymentStyle = (status: Milestone['paymentStatus']) => {
    const styles = {
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Partially Paid': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Overdue': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status];
  };

  const getPaymentStatusBadgeStyle = (status: Milestone['paymentStatus']) => {
    const styles = {
      'Pending': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      'Partially Paid': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'Paid': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'Overdue': 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };
    return styles[status];
  };

  const getApprovalStyle = (status: Milestone['approvalStatus']) => {
    const styles = {
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Approved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status];
  };

  const getInvoiceStyle = (status: Milestone['invoiceStatus']) => {
    const styles = {
      'Not Generated': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      'Generated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Sent': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return styles[status];
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header with ListingHeader Component */}
      <ListingHeader
        title="Project Milestones"
        subtitle="Track milestone-level delivery and payment execution"
        moduleName="Milestone"
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
        onAdd={() => setIsAddModalOpen(true)}
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
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
        filterOptions={{
          'Completion Status': ['Not Started', 'In Progress', 'Completed', 'Delayed'],
          'Approval Status': ['Pending', 'Approved', 'Rejected'],
          'Invoice Status': ['Not Generated', 'Generated', 'Sent', 'Paid'],
          'Project Name': [], // Text fields can be handled by empty options or specialized logic if the component supports it. Since AdvancedSearchPanel uses the options to build dropdowns, for text fields we might need a different approach or just provide an empty list. 
          'Milestone Code': [],
        }}
      />
        </div>
      )}

      {/* Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={(id) => setActiveFilters(activeFilters.filter((f) => f.id !== id))}
            onClearAll={() => setActiveFilters([])}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="px-6 pb-6">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Completion Status */}
                <div className={`h-1 ${
                  milestone.completionStatus === 'Completed' ? 'bg-green-500' :
                  milestone.completionStatus === 'In Progress' ? 'bg-blue-500' :
                  milestone.completionStatus === 'Delayed' ? 'bg-red-500' :
                  milestone.completionStatus === 'Not Started' ? 'bg-orange-500' :
                  'bg-neutral-300'
                }`} />

                {/* Card Content */}
                <div className="p-5">
                  {/* Header Row - Title with Badges and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-md text-xs font-semibold">
                          {milestone.milestoneId}
                        </span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">{milestone.milestoneType}</span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2">
                        {milestone.milestoneName}
                      </h3>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative ml-2">
                      <button 
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="flex items-start gap-2 mb-3 text-sm">
                    <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Project</div>
                      <div className="text-neutral-900 dark:text-white font-medium">{milestone.projectName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{milestone.projectCode}</div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-start gap-2 mb-4 text-sm">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0 mt-0.5">
                      {milestone.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Client</div>
                      <div className="text-neutral-900 dark:text-white font-medium">{milestone.clientName}</div>
                    </div>
                  </div>

                  {/* Amount - Prominent */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <DollarSign className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Milestone Amount</div>
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(milestone.milestoneAmount, milestone.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        Planned Date
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {milestone.plannedDate}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        Actual Date
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {milestone.actualDate || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Assigned To Info */}
                  <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Assigned: {milestone.assignedTo}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getCompletionStyle(milestone.completionStatus)}`}>
                      {milestone.completionStatus}
                    </span>
                  </div>

                  {/* Payment Status Badge - Bottom */}
                  <div className={`w-full py-2 px-3 rounded-md text-center text-sm font-semibold ${getPaymentStatusBadgeStyle(milestone.paymentStatus)}`}>
                    Payment: {milestone.paymentStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{milestone.milestoneId}</span>
                      {/* Payment Status Badge - matching Grid view */}
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPaymentStyle(milestone.paymentStatus)}`}>
                        Payment: {milestone.paymentStatus}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-3">{milestone.milestoneName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Project</span>
                        <span className="text-neutral-900 dark:text-white">{milestone.projectName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Code</span>
                        <span className="text-neutral-900 dark:text-white">{milestone.milestoneCode}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Planned Date</span>
                        <span className="text-neutral-900 dark:text-white">{milestone.plannedDate}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Assigned To</span>
                        <span className="text-neutral-900 dark:text-white">{milestone.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleEditMilestone(milestone)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                      Milestone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Payment %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedMilestones.map((milestone) => (
                    <tr key={milestone.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">{milestone.milestoneName}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{milestone.milestoneId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {milestone.projectName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">{milestone.milestoneCode}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-neutral-900 dark:text-white">{milestone.plannedDate}</div>
                        {milestone.actualDate && (
                          <div className="text-neutral-500 dark:text-neutral-400">{milestone.actualDate}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{milestone.paymentStatus}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getCompletionStyle(milestone.completionStatus)}`}>
                              {milestone.completionStatus}
                            </span>
                          </div>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getApprovalStyle(milestone.approvalStatus)}`}>
                              {milestone.approvalStatus}
                            </span>
                          </div>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getInvoiceStyle(milestone.invoiceStatus)}`}>
                              {milestone.invoiceStatus}
                            </span>
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
                              onClick={() => handleEditMilestone(milestone)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMilestone(milestone.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            totalItems={filteredMilestones.length}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <MilestonesEditSidePanel
        isOpen={isAddModalOpen}
        milestone={selectedMilestone as any}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedMilestone(null);
        }}
        onSave={(milestoneData) => {
          if (selectedMilestone) {
            // Update existing milestone
            setMilestones(milestones.map(m =>
              m.id === selectedMilestone.id
                ? ({ ...selectedMilestone, ...milestoneData } as any)
                : m
            ));
          } else {
            // Add new milestone
            const newMilestone: Milestone = {
              id: `milestone-${Date.now()}`,
              milestoneId: `MS-2024-${String(milestones.length + 1).padStart(3, '0')}`,
              projectId: milestoneData.projectId,
              projectCode: 'PRJ-CODE',
              projectName: 'Project Name',
              clientName: 'Client Name',
              milestoneName: milestoneData.milestoneName,
              milestoneCode: milestoneData.milestoneCode,
              milestoneAmount: 0,
              currency: 'USD',
              milestoneType: 'Development',
              plannedDate: milestoneData.plannedDate,
              actualDate: milestoneData.actualDate,
              paymentStatus: milestoneData.paymentStatus as any || 'Pending',
              completionStatus: milestoneData.completionStatus as any,
              approvalStatus: milestoneData.approvalStatus as any,
              invoiceStatus: milestoneData.invoiceStatus as any,
              assignedTo: milestoneData.assignedTo,
              priority: milestoneData.priority as any,
              remarks: milestoneData.remarks,
              createdDate: new Date().toISOString().split('T')[0],
            };
            setMilestones([...milestones, newMilestone]);
          }
          setIsAddModalOpen(false);
          setSelectedMilestone(null);
        }}
      />
    </div>
  );
}