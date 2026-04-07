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
import { toast } from 'sonner';
import type { FilterCondition, ListingColumnConfig } from './hb/listing';
import { MilestonesEditSidePanel } from './MilestonesEditSidePanel';
import type { MilestoneData } from './MilestonesEditSidePanel';

// Milestone data interface
interface Milestone {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  crt: string;
  milestoneName: string;
  milestoneCode: string;
  milestonePercentage: number;
  amountLocal: number;
  amountUSD: number;
  currency: string;
  milestoneType: string;
  plannedDate: string;
  actualDate?: string;
  deliverable?: string;
  paymentStatus: 'Draft' | 'Published' | 'Requested' | 'Invoice Raised' | 'Received';
  paymentStatusDate?: string;
  invoiceNumber?: string;
  paymentMode?: string;
  subPaymentMode?: string;
  transactionCost?: number;
  transactionNumber?: string;
  completionStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  remarks?: string;
  createdDate?: string;
}

// Mock data
const mockMilestones: Milestone[] = [
  {
    id: '1',
    projectId: 'PRJ-001',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.',
    crt: 'Sarah Wilson',
    milestoneName: 'Requirements & Analysis Completion',
    milestoneCode: 'MS-REQ-01',
    milestonePercentage: 10,
    amountLocal: 5000,
    amountUSD: 5000,
    currency: 'USD',
    milestoneType: 'Fixed',
    plannedDate: '2024-02-15',
    actualDate: '2024-02-14',
    deliverable: 'Functional Requirements Document, Technical Specification',
    paymentStatus: 'Received',
    paymentStatusDate: '2024-02-28',
    invoiceNumber: 'INV-2024-001',
    paymentMode: 'Bank Transfer',
    subPaymentMode: 'Wire',
    transactionCost: 15,
    transactionNumber: 'TXN-99881',
    completionStatus: 'Completed',
    approvalStatus: 'Approved',
    assignedTo: 'John Anderson',
    priority: 'High',
    remarks: 'Early delivery validated by client.',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    projectId: 'PRJ-001',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.',
    crt: 'Sarah Wilson',
    milestoneName: 'System Architecture Design',
    milestoneCode: 'MS-DES-02',
    milestonePercentage: 15,
    amountLocal: 7500,
    amountUSD: 7500,
    currency: 'USD',
    milestoneType: 'Fixed',
    plannedDate: '2024-03-20',
    actualDate: '2024-03-22',
    deliverable: 'High Level Design, Database Schema',
    paymentStatus: 'Invoice Raised',
    paymentStatusDate: '2024-03-25',
    invoiceNumber: 'INV-2024-012',
    completionStatus: 'Completed',
    approvalStatus: 'Approved',
    assignedTo: 'John Anderson',
    priority: 'High',
    createdDate: '2024-01-15',
  },
  {
    id: '3',
    projectId: 'PRJ-002',
    projectCode: 'MB-001',
    projectName: 'Mobile Banking App',
    clientName: 'Bank of America',
    crt: 'Michael Ross',
    milestoneName: 'UI/UX Interactive Prototype',
    milestoneCode: 'MS-UI-01',
    milestonePercentage: 20,
    amountLocal: 4000,
    amountUSD: 5080,
    currency: 'GBP',
    milestoneType: 'Fixed',
    plannedDate: '2024-03-01',
    deliverable: 'Figma Prototype, Style Guide',
    paymentStatus: 'Requested',
    paymentStatusDate: '2024-03-01',
    paymentMode: 'Credit Card',
    completionStatus: 'In Progress',
    approvalStatus: 'Pending',
    assignedTo: 'Emily Chen',
    priority: 'Medium',
    createdDate: '2024-02-01',
  },
  {
    id: '4',
    projectId: 'PRJ-003',
    projectCode: 'EC-001',
    projectName: 'E-Commerce Platform Redesign',
    clientName: 'Retail Giant',
    crt: 'Jessica Lee',
    milestoneName: 'Backend Core Integration',
    milestoneCode: 'MS-BE-03',
    milestonePercentage: 25,
    amountLocal: 12500,
    amountUSD: 13500,
    currency: 'EUR',
    milestoneType: 'Fixed',
    plannedDate: '2024-04-15',
    deliverable: 'API Documentation, Core Services',
    paymentStatus: 'Draft',
    completionStatus: 'Not Started',
    approvalStatus: 'Pending',
    assignedTo: 'Sarah Johnson',
    priority: 'High',
    createdDate: '2023-11-01',
  },
];

interface MilestonesModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
  onNavigate?: (pageId: string, filters?: any[]) => void;
}

export default function MilestonesModule({ initialFilters, onFiltersConsumed, onNavigate }: MilestonesModuleProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [backToProjectName, setBackToProjectName] = useState<string | undefined>(undefined);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
      // Capture project name for back navigation before consuming filters
      const projectFilter = initialFilters.find(f => f.field === 'projectName' || f.field === 'Project');
      if (projectFilter?.value) {
        setBackToProjectName(projectFilter.value);
      }

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
    const paidCount = milestones.filter(m => m.paymentStatus === 'Received').length;
    const requestedCount = milestones.filter(m => m.paymentStatus === 'Requested').length;

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
        label: 'Received',
        value: paidCount.toString(),
        icon: 'DollarSign',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        trend: '+8',
        trendDirection: 'up' as const,
      },
      {
        label: 'Requested',
        value: requestedCount.toString(),
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
          milestone.milestoneCode.toLowerCase().includes(query) ||
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

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== id));
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
      'Not Started': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700',
      'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
      'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/10 dark:text-green-400 border border-green-200 dark:border-green-800',
      'Delayed': 'bg-red-100 text-red-700 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-800',
    };
    return styles[status];
  };

  const getPaymentStyle = (status: Milestone['paymentStatus']) => {
    const styles = {
      'Draft': 'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
      'Published': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800',
      'Requested': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800',
      'Invoice Raised': 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800',
      'Received': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800',
    };
    return styles[status] || styles['Draft'];
  };

  const getApprovalStyle = (status: Milestone['approvalStatus']) => {
    const styles = {
      'Pending': 'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
      'Approved': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800',
      'Rejected': 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800',
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


  const handleCloneMilestone = () => {
    if (!selectedMilestone) return;
    
    const clonedMilestone: Milestone = {
      ...selectedMilestone,
      id: `clone-${Date.now()}`,
      milestoneCode: `${selectedMilestone.milestoneCode}-COPY`,
      milestoneName: `Copy of ${selectedMilestone.milestoneName}`,
      completionStatus: 'Not Started',
      approvalStatus: 'Pending',
      paymentStatus: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
    };
    
    setMilestones([clonedMilestone, ...milestones]);
    setSelectedMilestone(clonedMilestone);
    toast.success(`Milestone "${selectedMilestone.milestoneName}" cloned successfully`);
  };

  const handleRefresh = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
      loading: 'Refreshing milestones list...',
      success: 'Milestone data updated',
      error: 'Refresh failed',
    });
  };

  const handleExport = () => {
    toast.info('Exporting milestones data...');
  };

  const handleBack = () => {
    if (backToProjectName && onNavigate) {
      onNavigate('projects', [{ field: 'projectName', value: backToProjectName, openDetail: true }]);
    }
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
        onRefresh={handleRefresh}
        onExport={handleExport}
        onClone={handleCloneMilestone}
        cloneDisabled={!selectedMilestone}
        cloneTooltip={selectedMilestone ? `Clone ${selectedMilestone.milestoneName}` : 'Select a milestone to clone'}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => setIsAddModalOpen(true)}
        onBack={backToProjectName ? handleBack : undefined}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                {/* Status Indicator Top */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${
                  milestone.completionStatus === 'Completed' ? 'bg-green-500' :
                  milestone.completionStatus === 'In Progress' ? 'bg-blue-500' :
                  milestone.completionStatus === 'Delayed' ? 'bg-red-500' :
                  'bg-neutral-300 dark:bg-neutral-700'
                }`} />

                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                          {milestone.milestoneCode}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                          {milestone.milestonePercentage}% Weight
                        </span>
                      </div>
                      <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {milestone.milestoneName}
                      </h3>
                    </div>
                    
                    <div className="relative ml-2">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === milestone.id ? null : milestone.id)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-400" />
                      </button>
                      {openMenuId === milestone.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-48 z-20 animate-in fade-in zoom-in-95 duration-200">
                            <button
                              onClick={() => {
                                handleEditMilestone(milestone);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-primary-600" />
                              <span className="font-medium">Edit Milestone</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteMilestone(milestone.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="font-medium">Remove</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Project & Client */}
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Project & Client</div>
                      <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{milestone.projectName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                         {milestone.clientName}
                      </div>
                    </div>

                    {/* Commercials Highlight */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                       <div className="flex justify-between items-end">
                          <div>
                             <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Milestone Amount</div>
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-neutral-900 dark:text-white">
                                  ${milestone.amountUSD.toLocaleString()}
                                </span>
                                {milestone.currency !== 'USD' && (
                                  <span className="text-xs font-bold text-neutral-500">
                                    ({milestone.amountLocal.toLocaleString()} {milestone.currency})
                                  </span>
                                )}
                             </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getPaymentStyle(milestone.paymentStatus)}`}>
                             {milestone.paymentStatus}
                          </div>
                       </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4 py-1">
                      <div>
                        <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Planned Date</div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                           <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                           {milestone.plannedDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Status</div>
                        <div className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${getCompletionStyle(milestone.completionStatus)}`}>
                          {milestone.completionStatus}
                        </div>
                      </div>
                    </div>

                    {/* Deliverable/Remarks */}
                    {milestone.deliverable && (
                      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                           <FileText className="w-3 h-3" />
                           Deliverables
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed italic">
                          "{milestone.deliverable}"
                        </p>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="pt-4 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                       <span>Assigned: <span className="text-neutral-600 dark:text-neutral-300 font-bold">{milestone.assignedTo}</span></span>
                       <span className="uppercase tracking-tighter">{milestone.milestoneType}</span>
                    </div>
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
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 flex items-center gap-6"
              >
                <div className={`w-1.5 h-16 rounded-full ${
                  milestone.completionStatus === 'Completed' ? 'bg-green-500' :
                  milestone.completionStatus === 'In Progress' ? 'bg-blue-500' :
                  'bg-neutral-200 dark:bg-neutral-800'
                }`} />

                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-100 dark:border-primary-900/30">
                        {milestone.milestoneCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getPaymentStyle(milestone.paymentStatus)}`}>
                        {milestone.paymentStatus}
                      </span>
                   </div>
                   <h3 className="font-bold text-neutral-900 dark:text-white text-lg mb-1">{milestone.milestoneName}</h3>
                   <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      {milestone.projectName} &bull; {milestone.clientName}
                   </div>
                </div>

                <div className="hidden lg:flex flex-col gap-1 px-8 border-x border-neutral-100 dark:border-neutral-800">
                   <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Amount (USD)</div>
                   <div className="text-lg font-black text-neutral-900 dark:text-white">${milestone.amountUSD.toLocaleString()}</div>
                   <div className="text-[10px] font-bold text-neutral-400">{milestone.milestonePercentage}% Total</div>
                </div>

                <div className="hidden md:block min-w-[140px]">
                   <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Target Date</div>
                   <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{milestone.plannedDate}</div>
                   <div className={`mt-1 w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${getCompletionStyle(milestone.completionStatus)}`}>
                      {milestone.completionStatus}
                   </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditMilestone(milestone)}
                      className="p-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-400 dark:hover:text-white transition-all transform active:scale-95 shadow-lg shadow-neutral-900/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Milestone Info</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Project & Client</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Commercials</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Timeline</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {paginatedMilestones.map((milestone) => (
                    <tr key={milestone.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/20 rounded-md w-fit border border-primary-100 dark:border-primary-900/30">
                            {milestone.milestoneCode}
                          </span>
                          <div className="font-bold text-neutral-900 dark:text-white line-clamp-1">{milestone.milestoneName}</div>
                          <div className="text-[10px] text-neutral-500 font-medium italic line-clamp-1">{milestone.deliverable || 'No deliverable specified'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{milestone.projectName}</div>
                          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">{milestone.clientName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                           <div className="text-sm font-black text-neutral-900 dark:text-white">${milestone.amountUSD.toLocaleString()}</div>
                           <div className="text-[10px] text-neutral-400 font-bold">{milestone.milestonePercentage}% of Total</div>
                           {milestone.currency !== 'USD' && (
                             <div className="text-[10px] text-neutral-400 font-medium italic">
                               ({milestone.amountLocal.toLocaleString()} {milestone.currency})
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                             <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                             {milestone.plannedDate}
                          </div>
                          {milestone.actualDate && (
                            <div className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                               <CheckCircle2 className="w-3 h-3" />
                               Done: {milestone.actualDate}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${getCompletionStyle(milestone.completionStatus)}`}>
                            {milestone.completionStatus}
                          </span>
                          <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getPaymentStyle(milestone.paymentStatus)}`}>
                            Payment: {milestone.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditMilestone(milestone)}
                            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors group/edit"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-neutral-400 group-hover/edit:text-primary-600 transition-colors" />
                          </button>
                          <button 
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group/del"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-neutral-400 group-hover/del:text-red-500 transition-colors" />
                          </button>
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
        key={selectedMilestone?.id || 'new-milestone'}
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
                ? ({ ...selectedMilestone, ...milestoneData } as Milestone)
                : m
            ));
            toast.success('Milestone updated');
          } else {
            // Add new milestone
            const newMilestone: Milestone = {
              id: `milestone-${Date.now()}`,
              projectId: milestoneData.projectId || '',
              projectCode: milestoneData.projectCode || 'PRJ-CODE',
              projectName: milestoneData.projectName || 'Project Name',
              clientName: milestoneData.clientName || 'Client Name',
              crt: milestoneData.crt || 'Sarah Wilson',
              milestoneName: milestoneData.milestoneName,
              milestoneCode: milestoneData.milestoneCode || `MS-${Date.now()}`,
              milestonePercentage: milestoneData.milestonePercentage || 0,
              amountLocal: milestoneData.amountLocal || 0,
              amountUSD: milestoneData.amountUSD || 0,
              currency: milestoneData.currency || 'USD',
              milestoneType: milestoneData.milestoneType || 'Fixed',
              plannedDate: milestoneData.plannedDate,
              actualDate: milestoneData.actualDate,
              deliverable: milestoneData.deliverable,
              paymentStatus: (milestoneData.paymentStatus as any) || 'Draft',
              paymentStatusDate: milestoneData.paymentStatusDate,
              invoiceNumber: milestoneData.invoiceNumber,
              paymentMode: milestoneData.paymentMode,
              subPaymentMode: milestoneData.subPaymentMode,
              transactionCost: milestoneData.transactionCost,
              transactionNumber: milestoneData.transactionNumber,
              completionStatus: (milestoneData.completionStatus as any) || 'Not Started',
              approvalStatus: (milestoneData.approvalStatus as any) || 'Pending',
              assignedTo: milestoneData.assignedTo || 'Unassigned',
              priority: (milestoneData.priority as any) || 'Medium',
              remarks: milestoneData.remarks || '',
              createdDate: new Date().toISOString().split('T')[0],
            };
            setMilestones([...milestones, newMilestone]);
            toast.success('New milestone added');
          }
          setIsAddModalOpen(false);
          setSelectedMilestone(null);
        }}
      />
    </div>
  );
}