import { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Server,
  Database,
  HardDrive
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import { toast } from 'sonner';
import type { FilterCondition, ViewMode } from './hb/listing';
import { AddEditAwsPanel } from './AddEditAwsPanel';
import type { AwsFormData } from './AddEditAwsPanel';

// Mock data
const mockAwsData: AwsFormData[] = [
  {
    id: '1',
    awsId: 'AWS-2024-001',
    title: 'Primary Web Application Server',
    type: 'HostingServer',
    serverType: 'EC2 t3.large',
    description: 'Main production server for the client facing portal',
    subscriptionType: 'Annual',
    requestedDate: '2024-01-15',
    status: 'Provisioned',
    subscriptionStatus: 'Active',
    configuration: 'Ubuntu 22.04 LTS, 8GB RAM, 50GB NVMe',
    durationMonths: 12,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    confirmedDate: '2024-01-20',
    confirmedBy: 'Management',
    supportPerson: 'Sourav Dokania',
    amount: 85000,
    currency: 'Indian Rupee - INR',
    amountUSD: 1020,
    projectName: 'Enterprise Portal',
  },
  {
    id: '2',
    awsId: 'AWS-2024-002',
    title: 'Production Database Cluster',
    type: 'Database',
    serverType: 'RDS PostgreSQL',
    description: 'High-availability database cluster',
    subscriptionType: 'PayAsYouGo',
    requestedDate: '2024-02-01',
    status: 'Requested',
    subscriptionStatus: 'Proposed',
    configuration: 'Multi-AZ, 100GB SSD, Automated Backups',
    durationMonths: '',
    startDate: '',
    endDate: '',
    confirmedDate: '2024-02-05',
    confirmedBy: 'Client',
    supportPerson: 'Admin User',
    amount: 150000,
    currency: 'Indian Rupee - INR',
    amountUSD: 1800,
    projectName: 'Enterprise Portal',
  },
  {
    id: '3',
    awsId: 'AWS-2024-003',
    title: 'S3 Asset Storage',
    type: 'Storage',
    serverType: 'S3 Standard',
    description: 'Media and document storage for the application',
    subscriptionType: 'Monthly',
    requestedDate: '2024-01-10',
    status: 'Approved',
    subscriptionStatus: 'Active',
    configuration: 'Versioning enabled, Lifecycle rules applied',
    durationMonths: 1,
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    confirmedDate: '2024-01-12',
    confirmedBy: 'Support',
    supportPerson: 'Sourav Dokania',
    amount: 12000,
    currency: 'Indian Rupee - INR',
    amountUSD: 145,
    projectName: 'Media Platform',
  }
];

interface AwsModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
  onNavigate?: (pageId: string, filters?: any[]) => void;
}

export default function AwsModule({ initialFilters, onFiltersConsumed, onNavigate }: AwsModuleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAws, setSelectedAws] = useState<AwsFormData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [awsEntries, setAwsEntries] = useState<AwsFormData[]>(mockAwsData);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
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
    const total = awsEntries.length;
    const active = awsEntries.filter(a => a.subscriptionStatus === 'Active').length;
    const proposed = awsEntries.filter(a => a.subscriptionStatus === 'Proposed').length;
    const provisioned = awsEntries.filter(a => a.status === 'Provisioned').length;
    const totalUsd = awsEntries.reduce((sum, a) => sum + Number(a.amountUSD || 0), 0);

    return [
      { label: 'Total Resources', value: total.toString(), icon: 'Server', bgColor: 'bg-blue-50 dark:bg-blue-950/30', iconColor: 'text-blue-600 dark:text-blue-400', trend: '+1', trendDirection: 'up' as const },
      { label: 'Active Subs', value: active.toString(), icon: 'CheckCircle2', bgColor: 'bg-green-50 dark:bg-green-950/30', iconColor: 'text-green-600 dark:text-green-400', trend: '+2', trendDirection: 'up' as const },
      { label: 'Proposed Subs', value: proposed.toString(), icon: 'Clock', bgColor: 'bg-orange-50 dark:bg-orange-950/30', iconColor: 'text-orange-600 dark:text-orange-400', trend: '0', trendDirection: 'neutral' as const },
      { label: 'Provisioned', value: provisioned.toString(), icon: 'Activity', bgColor: 'bg-purple-50 dark:bg-purple-950/30', iconColor: 'text-purple-600 dark:text-purple-400', trend: '+1', trendDirection: 'up' as const },
      { label: 'Total Value (USD)', value: `$${totalUsd.toLocaleString()}`, icon: 'TrendingUp', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30', iconColor: 'text-indigo-600 dark:text-indigo-400', trend: '+5%', trendDirection: 'up' as const },
    ];
  }, [awsEntries]);

  // Filter & search
  const filteredEntries = useMemo(() => {
    let filtered = [...awsEntries];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.awsId.toLowerCase().includes(query) ||
        (a.projectName && a.projectName.toLowerCase().includes(query)) ||
        (a.serverType && a.serverType.toLowerCase().includes(query))
      );
    }
    activeFilters.forEach((filter) => {
      if (filter.values && filter.values.length > 0) {
        filtered = filtered.filter(a => {
          const val = a[filter.field as keyof AwsFormData];
          if (typeof val === 'string') return filter.values.some(v => val.toLowerCase().includes(v.toLowerCase()));
          return filter.values.includes(String(val));
        });
      }
    });
    return filtered;
  }, [awsEntries, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  const handleEdit = (entry: AwsFormData) => {
    setSelectedAws(entry);
    setIsAddModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this AWS project record?')) {
      setAwsEntries(awsEntries.filter(a => a.id !== id));
    }
  };

  // Styles
  const getStatusStyle = (status: AwsFormData['status']) => {
    const styles = {
      'Requested': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Approved': 'bg-green-50 text-green-700 border border-green-200',
      'Provisioned': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Terminated': 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[status] || 'bg-neutral-50 text-neutral-700 border border-neutral-200';
  };

  const getSubStatusStyle = (status: AwsFormData['subscriptionStatus']) => {
    const styles = {
      'Proposed': 'bg-orange-50 text-orange-700 border border-orange-200',
      'Active': 'bg-green-50 text-green-700 border border-green-200',
      'Suspended': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[status] || 'bg-neutral-50 text-neutral-700 border border-neutral-200';
  };

  const getTypeIcon = (type: AwsFormData['type']) => {
    switch (type) {
      case 'HostingServer': return <Server className="w-3.5 h-3.5" />;
      case 'Database': return <Database className="w-3.5 h-3.5" />;
      case 'Storage': return <HardDrive className="w-3.5 h-3.5" />;
      default: return <Server className="w-3.5 h-3.5" />;
    }
  };

  const getBorderColor = (status: AwsFormData['subscriptionStatus']) => {
    const colors = {
      'Proposed': 'bg-orange-500',
      'Active': 'bg-green-500',
      'Suspended': 'bg-yellow-500',
      'Cancelled': 'bg-red-500',
    };
    return colors[status] || 'bg-neutral-400';
  };

  // Action Menu
  const ActionMenu = ({ entry }: { entry: AwsFormData }) => (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === entry.id ? null : (entry.id || null))}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-neutral-400" />
      </button>
      {openMenuId === entry.id && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-48 z-20 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => handleEdit(entry)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-primary-600" />
              <span className="font-medium">Edit AWS Entry</span>
            </button>
            <button
              onClick={() => { handleDelete(entry.id!); setOpenMenuId(null); }}
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
      {paginatedEntries.map((entry) => (
        <div
          key={entry.id}
          className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
        >
          {/* Status Accent */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${getBorderColor(entry.subscriptionStatus)}`} />
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30 shrink-0">
                    {entry.awsId}
                  </span>
                  <span className={`px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0`}>
                    {getTypeIcon(entry.type)}
                    {entry.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getSubStatusStyle(entry.subscriptionStatus)}`}>
                    {entry.subscriptionStatus}
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2" title={entry.title}>
                  {entry.title}
                </h3>
              </div>
              <ActionMenu entry={entry} />
            </div>

            <div className="space-y-3">
              {entry.projectName && (
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Project</div>
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{entry.projectName}</div>
                </div>
              )}

              {/* Commercials Highlight - Standardized */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                 <div className="flex justify-between items-end">
                    <div>
                       <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Resource Amount</div>
                       <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-neutral-900 dark:text-white">
                            ${Number(entry.amountUSD).toLocaleString()}
                          </span>
                       </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusStyle(entry.status)}`}>
                       {entry.status}
                    </span>
                 </div>
              </div>

              {/* Server Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Server Type</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{entry.serverType || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Subs Type</div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{entry.subscriptionType || '—'}</div>
                </div>
              </div>

              {/* Details Details Grid */}
              <div className="grid grid-cols-2 gap-3 pb-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Duration/Dates</div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {entry.durationMonths ? `${entry.durationMonths}m ` : ''}
                    {entry.startDate ? `${entry.startDate} to ${entry.endDate}` : 'No dates'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Support Person</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{entry.supportPerson || 'Unassigned'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Confirmed By</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{entry.confirmedBy || 'Pending'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount (INR)</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{Number(entry.amount).toLocaleString()} {entry.currency?.split(' - ')[1] || 'INR'}</div>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-[10px]">
                 <span className="font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Calendar className="w-3 h-3" />
                   Requested: {entry.requestedDate}
                 </span>
                 <span className="text-neutral-400 font-bold uppercase tracking-widest">
                    CONFIG: <span className="text-neutral-700 dark:text-neutral-300">{entry.configuration || '—'}</span>
                 </span>
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
        <table className="w-full text-left border-collapse min-w-[2000px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider sticky left-0 bg-neutral-50 dark:bg-neutral-800/50 z-10">ID</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Title / Project</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Type & Server</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Subs Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Req Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Subs Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Configuration / Description</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Start & End</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Conf Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Conf By</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Support Person</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Currency</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Amount (USD)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {paginatedEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group text-sm">
                <td className="px-4 py-3 sticky left-0 bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/30 z-10 w-24">
                  <span className="font-bold text-primary-600 text-xs">{entry.awsId}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate max-w-[200px]" title={entry.title}>{entry.title}</div>
                  <div className="text-xs text-neutral-500">{entry.projectName || '—'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                    {getTypeIcon(entry.type)} {entry.type}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{entry.serverType || '—'}</div>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{entry.subscriptionType || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{entry.requestedDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyle(entry.status)}`}>{entry.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSubStatusStyle(entry.subscriptionStatus)}`}>{entry.subscriptionStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]" title={entry.configuration}>{entry.configuration || '—'}</div>
                  <div className="text-xs text-neutral-500 truncate max-w-[200px]" title={entry.description}>{entry.description || '—'}</div>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-center">{entry.durationMonths ? `${entry.durationMonths}m` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs whitespace-nowrap">
                  {entry.startDate ? `${entry.startDate} - ${entry.endDate}` : '—'}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{entry.confirmedDate}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{entry.confirmedBy || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{entry.supportPerson || '—'}</td>
                <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">{Number(entry.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs truncate max-w-[150px]">{entry.currency}</td>
                <td className="px-4 py-3 text-right font-black text-neutral-900 dark:text-white">${Number(entry.amountUSD).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(entry)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(entry.id!)} className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
      {paginatedEntries.map((entry) => (
        <div key={entry.id} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
          {/* Top accent */}
          <div className={`h-1 ${getBorderColor(entry.subscriptionStatus)}`} />
          
          <div className="p-5">
            {/* Row 1: Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30 shrink-0">
                  {entry.awsId}
                </span>
                <span className={`px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase shrink-0 bg-neutral-100 text-neutral-700 border border-neutral-200`}>
                  {getTypeIcon(entry.type)}
                  {entry.type}
                </span>
                <h3 className="font-bold text-neutral-900 dark:text-white truncate text-base">{entry.title}</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${getStatusStyle(entry.status)}`}>
                  {entry.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${getSubStatusStyle(entry.subscriptionStatus)}`}>
                  {entry.subscriptionStatus}
                </span>
              </div>
              <ActionMenu entry={entry} />
            </div>

            {/* Row 2: AWS Overview Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
              <div className="col-span-2">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Project</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{entry.projectName || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Server Type</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{entry.serverType || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Subs Type</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{entry.subscriptionType || '—'}</div>
              </div>
              <div className="col-span-4">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Configuration</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-full" title={entry.configuration}>{entry.configuration || '—'}</div>
              </div>
            </div>

            {/* Row 3: AWS Details Section */}
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Duration</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{entry.durationMonths ? `${entry.durationMonths} months` : '—'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Start & End Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {entry.startDate ? `${entry.startDate} to ${entry.endDate}` : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Confirmed Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{entry.confirmedDate}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Confirmed By</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{entry.confirmedBy || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Support Person</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{entry.supportPerson || '—'}</div>
              </div>
              
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Currency</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{entry.currency}</div>
              </div>
               <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount</div>
                <div className="text-sm font-black text-neutral-800 dark:text-neutral-200">{Number(entry.amount).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount (USD)</div>
                <div className="text-sm font-black text-green-600 dark:text-green-500">${Number(entry.amountUSD).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleCloneAws = () => {
    if (!selectedAws) return;
    const clonedAws: AwsFormData = {
      ...selectedAws,
      id: `clone-${Date.now()}`,
      awsId: `${selectedAws.awsId}-COPY`,
      projectName: `Copy of ${selectedAws.projectName}`,
    };
    setAwsEntries([clonedAws, ...awsEntries]);
    setSelectedAws(clonedAws);
    toast.success(`Cloned ${selectedAws.awsId} successfully`);
  };

  const handleRefresh = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
      loading: 'Refreshing AWS data...',
      success: 'AWS data updated from cloud',
      error: 'Refresh failed',
    });
  };

  const handleExport = () => {
    toast.info('Generating AWS resource report...');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="AWS"
        subtitle="Track AWS and cloud infrastructure, servers, and subscriptions"
        moduleName="AWS Project"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onClone={handleCloneAws}
        cloneDisabled={!selectedAws}
        cloneTooltip={selectedAws ? `Clone ${selectedAws.awsId}` : 'Select a record to clone'}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => setIsAddModalOpen(true)}
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
          'Type': ['HostingServer', 'Database', 'Storage', 'Other'],
          'Status': ['Requested', 'Approved', 'Provisioned', 'Terminated'],
          'Subscription Status': ['Proposed', 'Active', 'Suspended', 'Cancelled'],
          'Confirmed By': ['Support', 'Client', 'Management'],
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
            totalItems={filteredEntries.length}
          />
        </div>
      </div>

      <AddEditAwsPanel
        isOpen={isAddModalOpen}
        mode={selectedAws ? 'edit' : 'add'}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedAws(null);
        }}
        initialData={selectedAws || undefined}
        onSave={(data) => {
          if (selectedAws) {
            setAwsEntries(awsEntries.map(a => a.id === selectedAws.id ? { ...data, id: selectedAws.id } : a));
            toast.success('AWS details updated');
          } else {
            const newId = `AWS-${Date.now()}`;
            setAwsEntries([...awsEntries, { 
              ...data, 
              id: newId,
              awsId: `AWS-${new Date().getFullYear()}-${String(awsEntries.length + 1).padStart(3, '0')}`
            }]);
            toast.success('New AWS configuration added');
          }
          setIsAddModalOpen(false);
          setSelectedAws(null);
        }}
      />
    </div>
  );
}
