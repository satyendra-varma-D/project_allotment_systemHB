import { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import { toast } from 'sonner';
import type { FilterCondition, ViewMode } from './hb/listing';
import { AddEditAddonPanel } from './AddEditAddonPanel';

// Addon data interface
interface Addon {
  id: string;
  addonId: string;
  addonTitle: string;
  addonDescription?: string;
  addonType: 'Addon' | 'Support' | 'AMC';
  addonStatus: 'Identified' | 'Requested' | 'Confirmed' | 'Cancelled' | 'On Hold';
  addonAddedDate: string;
  proposedTotalHours: number;
  scheduleInWeeks: number;
  amount: number;
  amountProjectCurrency?: number;
  addonRequestedDate: string;
  addonRequestedBy: string;
  approvedHours?: number;
  approvedAmount?: number;
  approvedAmountProjectCurrency?: number;
  paymentTerms?: string;
  addonActionDate?: string;
  addonConfirmedBy?: string;
  projectName?: string;
  projectId?: string;
  clientName?: string;
  remarks?: string;
  createdDate: string;
}

// Mock data
const mockAddons: Addon[] = [
  {
    id: '1',
    addonId: 'AD-2024-001',
    addonTitle: 'Advanced Analytics Dashboard',
    addonDescription: 'Custom analytics dashboard with real-time data visualization and reporting modules',
    addonType: 'Addon',
    addonStatus: 'Confirmed',
    addonAddedDate: '2024-02-14',
    proposedTotalHours: 120,
    scheduleInWeeks: 4,
    amount: 15000,
    amountProjectCurrency: 12500,
    addonRequestedDate: '2024-02-15',
    addonRequestedBy: 'John Smith',
    approvedHours: 120,
    approvedAmount: 15000,
    approvedAmountProjectCurrency: 12500,
    paymentTerms: '50:50 Model',
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
    addonDescription: 'Quarterly support package for mobile application maintenance and bug fixes',
    addonType: 'Support',
    addonStatus: 'Requested',
    addonAddedDate: '2024-02-19',
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
    addonDescription: 'Full year maintenance with 24/7 support and quarterly updates',
    addonType: 'AMC',
    addonStatus: 'Confirmed',
    addonAddedDate: '2024-01-09',
    proposedTotalHours: 500,
    scheduleInWeeks: 52,
    amount: 60000,
    amountProjectCurrency: 50000,
    addonRequestedDate: '2024-01-10',
    addonRequestedBy: 'Emma Davis',
    approvedHours: 500,
    approvedAmount: 60000,
    approvedAmountProjectCurrency: 50000,
    paymentTerms: '25:25:25:25 Model',
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
    addonDescription: 'Third-party API integration for payment and logistics services',
    addonType: 'Addon',
    addonStatus: 'On Hold',
    addonAddedDate: '2024-02-21',
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
    addonDescription: 'System-wide performance audit and optimization',
    addonType: 'Addon',
    addonStatus: 'Identified',
    addonAddedDate: '2024-02-24',
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
    addonDescription: 'Extended support coverage with dedicated resources',
    addonType: 'Support',
    addonStatus: 'Cancelled',
    addonAddedDate: '2024-01-31',
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

interface AddonsModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
  onNavigate?: (pageId: string, filters?: any[]) => void;
}

export default function AddonsModule({ initialFilters, onFiltersConsumed, onNavigate }: AddonsModuleProps) {
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
  const [backToProjectName, setBackToProjectName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
      const projectFilter = initialFilters.find(f => f.field === 'projectName' || f.field === 'Project Name');
      if (projectFilter?.value) {
        setBackToProjectName(projectFilter.value);
      }
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

  // Summary statistics
  const summaryData = useMemo(() => {
    const total = addons.length;
    const confirmed = addons.filter(a => a.addonStatus === 'Confirmed').length;
    const requested = addons.filter(a => a.addonStatus === 'Requested').length;
    const onHold = addons.filter(a => a.addonStatus === 'On Hold').length;
    const totalProposedAmount = addons.reduce((sum, a) => sum + a.amount, 0);
    const totalApprovedAmount = addons.filter(a => a.approvedAmount).reduce((sum, a) => sum + (a.approvedAmount || 0), 0);

    return [
      { label: 'Total Addons', value: total.toString(), icon: 'Package', bgColor: 'bg-blue-50 dark:bg-blue-950/30', iconColor: 'text-blue-600 dark:text-blue-400', trend: '+2', trendDirection: 'up' as const },
      { label: 'Confirmed', value: confirmed.toString(), icon: 'CheckCircle2', bgColor: 'bg-green-50 dark:bg-green-950/30', iconColor: 'text-green-600 dark:text-green-400', trend: '+1', trendDirection: 'up' as const },
      { label: 'Requested', value: requested.toString(), icon: 'Clock', bgColor: 'bg-orange-50 dark:bg-orange-950/30', iconColor: 'text-orange-600 dark:text-orange-400', trend: '+1', trendDirection: 'up' as const },
      { label: 'On Hold', value: onHold.toString(), icon: 'AlertCircle', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30', iconColor: 'text-yellow-600 dark:text-yellow-400', trend: '0', trendDirection: 'neutral' as const },
      { label: 'Proposed Value', value: `$${(totalProposedAmount / 1000).toFixed(0)}K`, icon: 'TrendingUp', bgColor: 'bg-purple-50 dark:bg-purple-950/30', iconColor: 'text-purple-600 dark:text-purple-400', trend: '+12', trendDirection: 'up' as const },
      { label: 'Approved Value', value: `$${(totalApprovedAmount / 1000).toFixed(0)}K`, icon: 'Activity', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30', iconColor: 'text-indigo-600 dark:text-indigo-400', trend: '+8', trendDirection: 'up' as const },
    ];
  }, [addons]);

  // Filter & search
  const filteredAddons = useMemo(() => {
    let filtered = [...addons];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.addonId.toLowerCase().includes(query) ||
        a.addonTitle.toLowerCase().includes(query) ||
        a.addonRequestedBy.toLowerCase().includes(query) ||
        (a.projectName && a.projectName.toLowerCase().includes(query)) ||
        (a.clientName && a.clientName.toLowerCase().includes(query))
      );
    }
    activeFilters.forEach((filter) => {
      if (filter.values && filter.values.length > 0) {
        filtered = filtered.filter(a => {
          const val = a[filter.field as keyof Addon];
          if (typeof val === 'string') return filter.values.some(v => val.toLowerCase().includes(v.toLowerCase()));
          return filter.values.includes(String(val));
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

  const handleEditAddon = (addon: Addon) => {
    setSelectedAddon(addon);
    setIsAddModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteAddon = (addonId: string) => {
    if (confirm('Are you sure you want to delete this addon?')) {
      setAddons(addons.filter(a => a.id !== addonId));
    }
  };

  // Style helpers
  const getStatusStyle = (status: Addon['addonStatus']) => {
    const styles = {
      'Identified': 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      'Requested': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'Confirmed': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      'On Hold': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    };
    return styles[status];
  };

  const getTypeStyle = (type: Addon['addonType']) => {
    const styles = {
      'Addon': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Support': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      'AMC': 'bg-pink-50 text-pink-700 border border-pink-200',
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

  // Action Menu component
  const ActionMenu = ({ addon }: { addon: Addon }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === addon.id ? null : addon.id)}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-neutral-400" />
      </button>
      {openMenuId === addon.id && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-48 z-20 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => handleEditAddon(addon)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-primary-600" />
              <span className="font-medium">Edit Addon</span>
            </button>
            <button
              onClick={() => { handleDeleteAddon(addon.id); setOpenMenuId(null); }}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ─── GRID VIEW ─────────────────────────────────
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedAddons.map((addon) => (
        <div
          key={addon.id}
          className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
        >
          {/* Status Accent */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${getBorderColor(addon.addonStatus)}`} />
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                    {addon.addonId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getTypeStyle(addon.addonType)}`}>
                    {addon.addonType}
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">
                  {addon.addonTitle}
                </h3>
              </div>
              <ActionMenu addon={addon} />
            </div>

            <div className="space-y-3">
              {/* Project & Client */}
              {addon.projectName && (
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Project & Client</div>
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{addon.projectName}</div>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    {addon.clientName}
                  </div>
                </div>
              )}

              {/* Commercials Highlight */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {addon.addonStatus === 'Confirmed' ? 'Approved Amount' : 'Proposed Amount'}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-neutral-900 dark:text-white">
                        ${(addon.addonStatus === 'Confirmed' && addon.approvedAmount ? addon.approvedAmount : addon.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusStyle(addon.addonStatus)}`}>
                    {addon.addonStatus}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                    {addon.addonStatus === 'Confirmed' ? 'Approved Hours' : 'Proposed Hours'}
                  </div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {addon.addonStatus === 'Confirmed' && addon.approvedHours ? addon.approvedHours : addon.proposedTotalHours}h
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Schedule</div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{addon.scheduleInWeeks} weeks</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Added Date</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{addon.addonAddedDate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Requested By</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{addon.addonRequestedBy}</div>
                </div>
                {addon.addonStatus === 'Confirmed' && addon.addonConfirmedBy && (
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Confirmed By</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{addon.addonConfirmedBy}</div>
                  </div>
                )}
                {addon.addonStatus === 'Confirmed' && addon.addonActionDate && (
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Action Date</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{addon.addonActionDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {addon.addonRequestedDate}
                </span>
                {addon.addonStatus === 'Confirmed' && addon.paymentTerms && (
                  <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest truncate max-w-[150px]">
                    {addon.paymentTerms}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── TABLE VIEW ─────────────────────────────────
  const renderTableView = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1600px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider sticky left-0 bg-neutral-50 dark:bg-neutral-800/50 z-10">Addon ID</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Addon Title</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Added Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Proposed Hours</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Schedule</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Amount (USD)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Amount (Proj)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Requested Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Requested By</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Approved Hours</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Approved Amt (USD)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Approved Amt (Proj)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Payment Terms</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Action Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Confirmed By</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {paginatedAddons.map((addon) => (
              <tr key={addon.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group text-sm">
                <td className="px-4 py-3 sticky left-0 bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/30 z-10">
                  <span className="font-bold text-primary-600 text-xs">{addon.addonId}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap max-w-[200px] truncate">{addon.addonTitle}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getTypeStyle(addon.addonType)}`}>{addon.addonType}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyle(addon.addonStatus)}`}>{addon.addonStatus}</span>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{addon.addonAddedDate}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-center">{addon.proposedTotalHours}h</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-center">{addon.scheduleInWeeks}w</td>
                <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">${addon.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{addon.amountProjectCurrency ? `$${addon.amountProjectCurrency.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{addon.addonRequestedDate}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{addon.addonRequestedBy}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-center">{addon.approvedHours ? `${addon.approvedHours}h` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{addon.approvedAmount ? `$${addon.approvedAmount.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{addon.approvedAmountProjectCurrency ? `$${addon.approvedAmountProjectCurrency.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs whitespace-nowrap">{addon.paymentTerms || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{addon.addonActionDate || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{addon.addonConfirmedBy || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditAddon(addon)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteAddon(addon.id)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── LIST VIEW ─────────────────────────────────
  const renderListView = () => (
    <div className="space-y-3">
      {paginatedAddons.map((addon) => (
        <div key={addon.id} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
          {/* Top accent */}
          <div className={`h-1 ${getBorderColor(addon.addonStatus)}`} />
          
          <div className="p-5">
            {/* Row 1: Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30 shrink-0">
                  {addon.addonId}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getTypeStyle(addon.addonType)}`}>
                  {addon.addonType}
                </span>
                <h3 className="font-bold text-neutral-900 dark:text-white truncate text-base">{addon.addonTitle}</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${getStatusStyle(addon.addonStatus)}`}>
                  {addon.addonStatus}
                </span>
              </div>
              <ActionMenu addon={addon} />
            </div>

            {/* Row 2: Overview fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Project</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{addon.projectName || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Client</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{addon.clientName || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Added Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{addon.addonAddedDate}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Proposed Hours</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.proposedTotalHours}h</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Schedule</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.scheduleInWeeks} weeks</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount (USD)</div>
                <div className="text-sm font-black text-neutral-900 dark:text-white">${addon.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount (Proj Curr)</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.amountProjectCurrency ? `$${addon.amountProjectCurrency.toLocaleString()}` : '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Requested By</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{addon.addonRequestedBy}</div>
              </div>
            </div>

            {/* Row 3: Requested Date + Confirmation Details (conditional) */}
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Requested Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{addon.addonRequestedDate}
                </div>
              </div>
              {addon.addonStatus === 'Confirmed' && (
                <>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Approved Hours</div>
                    <div className="text-xs font-semibold text-green-700 dark:text-green-400">{addon.approvedHours ? `${addon.approvedHours}h` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Approved Amt (USD)</div>
                    <div className="text-sm font-black text-green-700 dark:text-green-400">{addon.approvedAmount ? `$${addon.approvedAmount.toLocaleString()}` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Approved Amt (Proj)</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.approvedAmountProjectCurrency ? `$${addon.approvedAmountProjectCurrency.toLocaleString()}` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Payment Terms</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.paymentTerms || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Action Date</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{addon.addonActionDate || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Confirmed By</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">{addon.addonConfirmedBy || '—'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleCloneAddon = () => {
    if (!selectedAddon) return;
    
    const clonedAddon: Addon = {
      ...selectedAddon,
      id: `AD-CLONE-${Date.now()}`,
      addonId: `${selectedAddon.addonId}-COPY`,
      addonTitle: `Copy of ${selectedAddon.addonTitle}`,
      addonStatus: 'Identified',
      createdDate: new Date().toISOString().split('T')[0],
      addonAddedDate: new Date().toISOString().split('T')[0],
    };
    
    setAddons([clonedAddon, ...addons]);
    setSelectedAddon(clonedAddon);
    toast.success(`Addon "${selectedAddon.addonTitle}" cloned successfully`);
  };

  const handleRefresh = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
      loading: 'Refreshing addons list...',
      success: 'Data updated successfully',
      error: 'Refresh failed',
    });
  };

  const handleExport = () => {
    toast.info('Exporting addons data...');
  };

  const handleBack = () => {
    if (backToProjectName && onNavigate) {
      onNavigate('projects', [{ field: 'projectName', value: backToProjectName, openDetail: true }]);
    }
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
        onRefresh={handleRefresh}
        onExport={handleExport}
        onClone={handleCloneAddon}
        cloneDisabled={!selectedAddon}
        cloneTooltip={selectedAddon ? `Clone ${selectedAddon.addonTitle}` : 'Select an addon to clone'}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => setIsAddModalOpen(true)}
        onBack={backToProjectName ? handleBack : undefined}
      />

      {showSummary && <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>}

      <AdvancedSearchPanel
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
        filterOptions={{
          'Addon Type': ['Addon', 'Support', 'AMC'],
          'Addon Status': ['Identified', 'Requested', 'Confirmed', 'Cancelled', 'On Hold'],
          'Requested By': [],
          'Project Name': [],
        }}
      />

      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={(id) => setActiveFilters(activeFilters.filter((f) => f.id !== id))}
            onClearAll={() => setActiveFilters([])}
          />
        </div>
      )}

      <div className="px-6 pb-6">
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'table' && renderTableView()}

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
          addonDescription: selectedAddon.addonDescription,
          addonType: selectedAddon.addonType,
          addonStatus: selectedAddon.addonStatus,
          addonAddedDate: selectedAddon.addonAddedDate,
          proposedTotalHours: selectedAddon.proposedTotalHours,
          scheduleInWeeks: selectedAddon.scheduleInWeeks,
          amountUSD: selectedAddon.amount,
          amountProjectCurrency: selectedAddon.amountProjectCurrency || '',
          addonRequestedDate: selectedAddon.addonRequestedDate,
          addonRequestedBy: selectedAddon.addonRequestedBy,
          approvedHours: selectedAddon.approvedHours,
          approvedAmountUSD: selectedAddon.approvedAmount,
          approvedAmountProjectCurrency: selectedAddon.approvedAmountProjectCurrency || '',
          paymentTerms: selectedAddon.paymentTerms,
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
              addonDescription: formData.addonDescription,
              addonType: formData.addonType,
              addonStatus: formData.addonStatus,
              addonAddedDate: formData.addonAddedDate,
              proposedTotalHours: Number(formData.proposedTotalHours),
              scheduleInWeeks: Number(formData.scheduleInWeeks),
              amount: Number(formData.amountUSD),
              amountProjectCurrency: formData.amountProjectCurrency ? Number(formData.amountProjectCurrency) : undefined,
              addonRequestedDate: formData.addonRequestedDate,
              addonRequestedBy: formData.addonRequestedBy,
              approvedHours: formData.approvedHours ? Number(formData.approvedHours) : undefined,
              approvedAmount: formData.approvedAmountUSD ? Number(formData.approvedAmountUSD) : undefined,
              approvedAmountProjectCurrency: formData.approvedAmountProjectCurrency ? Number(formData.approvedAmountProjectCurrency) : undefined,
              paymentTerms: formData.paymentTerms,
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
              addonDescription: formData.addonDescription,
              addonType: formData.addonType,
              addonStatus: formData.addonStatus,
              addonAddedDate: formData.addonAddedDate,
              proposedTotalHours: Number(formData.proposedTotalHours),
              scheduleInWeeks: Number(formData.scheduleInWeeks),
              amount: Number(formData.amountUSD),
              amountProjectCurrency: formData.amountProjectCurrency ? Number(formData.amountProjectCurrency) : undefined,
              addonRequestedDate: formData.addonRequestedDate,
              addonRequestedBy: formData.addonRequestedBy,
              approvedHours: formData.approvedHours ? Number(formData.approvedHours) : undefined,
              approvedAmount: formData.approvedAmountUSD ? Number(formData.approvedAmountUSD) : undefined,
              approvedAmountProjectCurrency: formData.approvedAmountProjectCurrency ? Number(formData.approvedAmountProjectCurrency) : undefined,
              paymentTerms: formData.paymentTerms,
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