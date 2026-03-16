import { useState, useMemo } from 'react';
import {
  Package,
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  User,
  X,
  FileText,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';
import { AddEditAddonPanel } from './AddEditAddonPanel';

// Addon data interface
interface Addon {
  id: string;
  addonId: string;
  addonTitle: string;
  addonType: 'Addon' | 'Support' | 'AMC';
  addonStatus: 'Identified' | 'Requested' | 'Confirmed' | 'Cancelled' | 'On Hold';
  proposedTotalHours: number;
  scheduleInWeeks: number;
  amount: number;
  addonRequestedDate: string;
  addonRequestedBy: string;
  approvedHours?: number;
  approvedAmount?: number;
  addonActionDate?: string;
  addonConfirmedBy?: string;
  projectName?: string;
  projectId?: string;
  clientName?: string;
  remarks?: string;
  createdDate: string;
  approvalStatus?: 'Approved' | 'Under Review' | 'Rejected';
}

// Mock data
const mockAddons: Addon[] = [
  {
    id: '1',
    addonId: 'AD-2024-001',
    addonTitle: 'Advanced Analytics Dashboard',
    addonType: 'Addon',
    addonStatus: 'Confirmed',
    proposedTotalHours: 120,
    scheduleInWeeks: 4,
    amount: 15000,
    addonRequestedDate: '2024-02-15',
    addonRequestedBy: 'John Smith',
    approvedHours: 120,
    approvedAmount: 15000,
    addonActionDate: '2024-02-18',
    addonConfirmedBy: 'Sarah Johnson',
    projectName: 'Enterprise CRM Platform',
    projectId: 'CRM-001',
    clientName: 'Tech Solutions Inc.',
    createdDate: '2024-02-15',
  },
  {
    id: '2',
    addonId: 'AD-2024-002',
    addonTitle: 'Mobile App Support - Q1 2024',
    addonType: 'Support',
    addonStatus: 'Requested',
    proposedTotalHours: 80,
    scheduleInWeeks: 12,
    amount: 8000,
    addonRequestedDate: '2024-02-20',
    addonRequestedBy: 'Michael Chen',
    projectName: 'Mobile Banking App',
    projectId: 'MB-001',
    clientName: 'FinanceHub Ltd',
    remarks: 'Pending approval from management',
    createdDate: '2024-02-20',
  },
  {
    id: '3',
    addonId: 'AD-2024-003',
    addonTitle: 'Annual Maintenance Contract 2024',
    addonType: 'AMC',
    addonStatus: 'Confirmed',
    proposedTotalHours: 500,
    scheduleInWeeks: 52,
    amount: 60000,
    addonRequestedDate: '2024-01-10',
    addonRequestedBy: 'Emma Davis',
    approvedHours: 500,
    approvedAmount: 60000,
    addonActionDate: '2024-01-15',
    addonConfirmedBy: 'David Wilson',
    projectName: 'E-Commerce Platform',
    projectId: 'EC-001',
    clientName: 'RetailMax Inc',
    createdDate: '2024-01-10',
  },
  {
    id: '4',
    addonId: 'AD-2024-004',
    addonTitle: 'API Integration Module',
    addonType: 'Addon',
    addonStatus: 'On Hold',
    proposedTotalHours: 60,
    scheduleInWeeks: 3,
    amount: 7500,
    addonRequestedDate: '2024-02-22',
    addonRequestedBy: 'Lisa Anderson',
    projectName: 'Healthcare Portal',
    projectId: 'HP-001',
    clientName: 'MediCare Health',
    remarks: 'Waiting for client budget approval',
    createdDate: '2024-02-22',
  },
  {
    id: '5',
    addonId: 'AD-2024-005',
    addonTitle: 'Performance Optimization',
    addonType: 'Addon',
    addonStatus: 'Identified',
    proposedTotalHours: 40,
    scheduleInWeeks: 2,
    amount: 5000,
    addonRequestedDate: '2024-02-25',
    addonRequestedBy: 'James Rodriguez',
    projectName: 'Inventory Management System',
    projectId: 'IMS-001',
    clientName: 'LogiTrack Systems',
    remarks: 'Initial assessment completed',
    createdDate: '2024-02-25',
  },
  {
    id: '6',
    addonId: 'AD-2024-006',
    addonTitle: 'Extended Support Package',
    addonType: 'Support',
    addonStatus: 'Cancelled',
    proposedTotalHours: 100,
    scheduleInWeeks: 8,
    amount: 10000,
    addonRequestedDate: '2024-02-01',
    addonRequestedBy: 'Robert Taylor',
    addonActionDate: '2024-02-05',
    addonConfirmedBy: 'Sarah Johnson',
    projectName: 'Learning Management System',
    projectId: 'LMS-001',
    clientName: 'EduTech Academy',
    remarks: 'Client opted for standard support',
    createdDate: '2024-02-01',
  },
];

export default function AddonsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = addons.length;
    const confirmed = addons.filter(a => a.addonStatus === 'Confirmed').length;
    const requested = addons.filter(a => a.addonStatus === 'Requested').length;
    const onHold = addons.filter(a => a.addonStatus === 'On Hold').length;
    const totalProposedAmount = addons.reduce((sum, a) => sum + a.amount, 0);
    const totalApprovedAmount = addons
      .filter(a => a.approvedAmount)
      .reduce((sum, a) => sum + (a.approvedAmount || 0), 0);

    return [
      {
        label: 'Total Addons',
        value: total.toString(),
        icon: 'Package',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Confirmed',
        value: confirmed.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Requested',
        value: requested.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'On Hold',
        value: onHold.toString(),
        icon: 'AlertCircle',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Proposed Value',
        value: `$${(totalProposedAmount / 1000).toFixed(0)}K`,
        icon: 'TrendingUp',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+12',
        trendDirection: 'up' as const,
      },
      {
        label: 'Approved Value',
        value: `$${(totalApprovedAmount / 1000).toFixed(0)}K`,
        icon: 'Activity',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+8',
        trendDirection: 'up' as const,
      },
    ];
  }, [addons]);

  // Filter and search logic
  const filteredAddons = useMemo(() => {
    let filtered = [...addons];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (addon) =>
          addon.addonId.toLowerCase().includes(query) ||
          addon.addonTitle.toLowerCase().includes(query) ||
          addon.addonRequestedBy.toLowerCase().includes(query) ||
          (addon.projectName && addon.projectName.toLowerCase().includes(query)) ||
          (addon.clientName && addon.clientName.toLowerCase().includes(query))
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((addon) => {
          const addonValue = addon[filter.field as keyof Addon];
          if (typeof addonValue === 'string') {
            return addonValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return addonValue === filter.value;
        });
      }
    });

    return filtered;
  }, [addons, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage);
  const paginatedAddons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAddons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAddons, currentPage, itemsPerPage]);

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

  const handleEditAddon = (addon: Addon) => {
    setSelectedAddon(addon);
    setIsAddModalOpen(true);
  };

  const handleDeleteAddon = (addonId: string) => {
    if (confirm('Are you sure you want to delete this addon?')) {
      setAddons(addons.filter(a => a.id !== addonId));
    }
  };

  // Get status styles
  const getStatusStyle = (status: Addon['addonStatus']) => {
    const styles = {
      'Identified': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Requested': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Confirmed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'On Hold': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[status];
  };

  const getPaymentStatusStyle = (status: Addon['addonStatus']) => {
    const styles = {
      'Identified': 'bg-neutral-50 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      'Requested': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'Confirmed': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      'On Hold': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    };
    return styles[status];
  };

  const getTypeStyle = (type: Addon['addonType']) => {
    const styles = {
      'Addon': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Support': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'AMC': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    };
    return styles[type];
  };

  const getBorderColor = (status: Addon['addonStatus']) => {
    const colors = {
      'Identified': 'bg-neutral-400',
      'Requested': 'bg-blue-500',
      'Confirmed': 'bg-green-500',
      'Cancelled': 'bg-red-500',
      'On Hold': 'bg-orange-500',
    };
    return colors[status];
  };

  const getPaymentLabel = (status: Addon['addonStatus']) => {
    const labels = {
      'Identified': 'Status: Identified',
      'Requested': 'Payment: Requested',
      'Confirmed': 'Payment: Confirmed',
      'Cancelled': 'Payment: Cancelled',
      'On Hold': 'Payment: On Hold',
    };
    return labels[status];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Addons"
        subtitle="Manage project addons, support packages, and AMC contracts"
        moduleName="Addon"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
        onRefresh={() => {}}
        onExport={() => {}}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => setIsAddModalOpen(true)}
      />

      {/* Summary Widgets - Conditionally shown */}
      {showSummary && <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>}

      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'addonType', label: 'Addon Type', type: 'select', options: ['Addon', 'Support', 'AMC'] },
              { field: 'addonStatus', label: 'Addon Status', type: 'select', options: ['Identified', 'Requested', 'Confirmed', 'Cancelled', 'On Hold'] },
              { field: 'addonRequestedBy', label: 'Requested By', type: 'text' },
              { field: 'projectName', label: 'Project Name', type: 'text' },
            ]}
          />
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClear={handleClearFilters}
          />
        </div>
      )}

      <div className="px-6 pb-6">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedAddons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Status */}
                <div className={`h-1 ${
                  addon.addonStatus === 'Confirmed' ? 'bg-green-500' :
                  addon.addonStatus === 'Requested' ? 'bg-orange-500' :
                  addon.addonStatus === 'Cancelled' ? 'bg-red-500' :
                  addon.addonStatus === 'On Hold' ? 'bg-purple-500' :
                  addon.addonStatus === 'Identified' ? 'bg-blue-500' :
                  'bg-neutral-300'
                }`} />

                {/* Card Content */}
                <div className="p-5">
                  {/* Header Row - Title with Badges and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-md text-xs font-semibold">
                          {addon.addonId}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getTypeStyle(addon.addonType)}`}>
                          {addon.addonType}
                        </span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2">
                        {addon.addonTitle}
                      </h3>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative ml-2">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === addon.id ? null : addon.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-all"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === addon.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden min-w-[140px] z-20">
                            <button
                              onClick={() => {
                                handleEditAddon(addon);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteAddon(addon.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/30 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  {addon.projectName && (
                    <div className="flex items-start gap-2 mb-3 text-sm">
                      <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Project</div>
                        <div className="text-neutral-900 dark:text-white font-medium">{addon.projectName}</div>
                        {addon.projectId && <div className="text-xs text-neutral-500 dark:text-neutral-400">{addon.projectId}</div>}
                      </div>
                    </div>
                  )}

                  {/* Client Info */}
                  {addon.clientName && (
                    <div className="flex items-start gap-2 mb-4 text-sm">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0 mt-0.5">
                        {addon.clientName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Client</div>
                        <div className="text-neutral-900 dark:text-white font-medium">{addon.clientName}</div>
                      </div>
                    </div>
                  )}

                  {/* Amount - Prominent */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <DollarSign className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Amount</div>
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        ${addon.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Dates & Effort Section */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        Requested Date
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {addon.addonRequestedDate}
                      </div>
                    </div>
                    {addon.addonActionDate && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                          <Calendar className="w-3 h-3" />
                          Action Date
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {addon.addonActionDate}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Effort Info */}
                  <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-neutral-500 dark:text-neutral-400">Hours: {addon.proposedTotalHours}h</span>
                    <span className="text-neutral-500 dark:text-neutral-400">Schedule: {addon.scheduleInWeeks}w</span>
                  </div>

                  {/* Status Badge - Bottom */}
                  <div className={`w-full py-2 px-3 rounded-md text-center text-sm font-semibold ${getPaymentStatusStyle(addon.addonStatus)}`}>
                    {getPaymentLabel(addon.addonStatus)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="divide-y divide-neutral-200 dark:border-neutral-800">
              {paginatedAddons.map((addon) => (
                <div key={addon.id} className="p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeStyle(addon.addonType)}`}>
                          {addon.addonId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusStyle(addon.addonStatus)}`}>
                          {addon.addonStatus}
                        </span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{addon.addonTitle}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{addon.projectName} • {addon.clientName}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Amount</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">${addon.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Hours</span>
                          <span className="text-neutral-900 dark:text-white">{addon.proposedTotalHours}h</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Schedule</span>
                          <span className="text-neutral-900 dark:text-white">{addon.scheduleInWeeks}w</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Requested By</span>
                          <span className="text-neutral-900 dark:text-white">{addon.addonRequestedBy}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedAddons.map((addon) => (
                  <tr key={addon.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{addon.addonId}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{addon.addonTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeStyle(addon.addonType)}`}>
                        {addon.addonType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white">${addon.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusStyle(addon.addonStatus)}`}>
                        {addon.addonStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredAddons.length}
          />
        </div>
      </div>

      {/* Add/Edit Addon Panel */}
      <AddEditAddonPanel
        isOpen={isAddModalOpen}
        mode={selectedAddon ? 'edit' : 'add'}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedAddon(null);
        }}
        initialData={selectedAddon ? {
          addonId: selectedAddon.addonId,
          addonTitle: selectedAddon.addonTitle,
          addonType: selectedAddon.addonType,
          addonStatus: selectedAddon.addonStatus,
          addonAddedDate: selectedAddon.createdDate,
          proposedTotalHours: selectedAddon.proposedTotalHours,
          scheduleInWeeks: selectedAddon.scheduleInWeeks,
          amountUSD: selectedAddon.amount,
          amountProjectCurrency: '',
          addonRequestedDate: selectedAddon.addonRequestedDate,
          addonRequestedBy: selectedAddon.addonRequestedBy,
          approvedHours: selectedAddon.approvedHours,
          approvedAmountUSD: selectedAddon.approvedAmount,
          approvedAmountProjectCurrency: '',
          addonActionDate: selectedAddon.addonActionDate,
          addonConfirmedBy: selectedAddon.addonConfirmedBy,
          projectName: selectedAddon.projectName,
          clientName: selectedAddon.clientName,
        } : undefined}
        onSave={(formData) => {
          if (selectedAddon) {
            const updatedAddon: Addon = {
              ...selectedAddon,
              addonId: formData.addonId,
              addonTitle: formData.addonTitle,
              addonType: formData.addonType,
              addonStatus: formData.addonStatus,
              proposedTotalHours: Number(formData.proposedTotalHours),
              scheduleInWeeks: Number(formData.scheduleInWeeks),
              amount: Number(formData.amountUSD),
              addonRequestedDate: formData.addonRequestedDate,
              addonRequestedBy: formData.addonRequestedBy,
              approvedHours: formData.approvedHours ? Number(formData.approvedHours) : undefined,
              approvedAmount: formData.approvedAmountUSD ? Number(formData.approvedAmountUSD) : undefined,
              addonActionDate: formData.addonActionDate,
              addonConfirmedBy: formData.addonConfirmedBy,
              projectName: formData.projectName,
              clientName: formData.clientName,
              createdDate: formData.addonAddedDate,
            };
            setAddons(addons.map(a => a.id === selectedAddon.id ? updatedAddon : a));
          } else {
            const newAddon: Addon = {
              id: `AD-${Date.now()}`,
              addonId: formData.addonId || `AD-${new Date().getFullYear()}-${String(addons.length + 1).padStart(3, '0')}`,
              addonTitle: formData.addonTitle,
              addonType: formData.addonType,
              addonStatus: formData.addonStatus,
              proposedTotalHours: Number(formData.proposedTotalHours),
              scheduleInWeeks: Number(formData.scheduleInWeeks),
              amount: Number(formData.amountUSD),
              addonRequestedDate: formData.addonRequestedDate,
              addonRequestedBy: formData.addonRequestedBy,
              approvedHours: formData.approvedHours ? Number(formData.approvedHours) : undefined,
              approvedAmount: formData.approvedAmountUSD ? Number(formData.approvedAmountUSD) : undefined,
              addonActionDate: formData.addonActionDate,
              addonConfirmedBy: formData.addonConfirmedBy,
              projectName: formData.projectName,
              clientName: formData.clientName,
              createdDate: formData.addonAddedDate,
            };
            setAddons([...addons, newAddon]);
          }
          setIsAddModalOpen(false);
          setSelectedAddon(null);
        }}
      />
    </div>
  );
}