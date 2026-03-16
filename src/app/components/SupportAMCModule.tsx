import { useState, useMemo } from 'react';
import {
  Headphones,
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
  FileText,
  Shield,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';

// Support/AMC Contract data interface
interface SupportContract {
  id: string;
  contractId: string;
  projectId: string;
  projectName: string;
  clientName: string;
  contractType: 'AMC' | 'Support' | 'Both';
  startDate: string;
  endDate: string;
  annualValue: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annually';
  contractStatus: 'Active' | 'Expiring Soon' | 'Expired' | 'Renewed';
  supportLevel: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  responseTime: '4 hours' | '8 hours' | '24 hours' | '48 hours';
  renewalAlert: boolean;
  daysToExpiry?: number;
  accountManager: string;
  remarks?: string;
  createdDate: string;
}

// Mock data
const mockContracts: SupportContract[] = [
  {
    id: '1',
    contractId: 'AMC-2024-001',
    projectId: 'PRJ-2024-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    contractType: 'Both',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    annualValue: 45000,
    billingCycle: 'Quarterly',
    contractStatus: 'Active',
    supportLevel: 'Premium',
    responseTime: '4 hours',
    renewalAlert: false,
    daysToExpiry: 308,
    accountManager: 'Sarah Williams',
    createdDate: '2023-12-15',
  },
  {
    id: '2',
    contractId: 'SUP-2024-002',
    projectId: 'PRJ-2024-002',
    projectName: 'Mobile Banking App',
    clientName: 'FinanceHub Ltd',
    contractType: 'Support',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    annualValue: 18000,
    billingCycle: 'Monthly',
    contractStatus: 'Expiring Soon',
    supportLevel: 'Standard',
    responseTime: '8 hours',
    renewalAlert: true,
    daysToExpiry: 15,
    remarks: 'Client requested renewal discussion',
    accountManager: 'Michael Chen',
    createdDate: '2024-01-20',
  },
  {
    id: '3',
    contractId: 'AMC-2024-003',
    projectId: 'PRJ-2023-015',
    projectName: 'E-Commerce Platform',
    clientName: 'RetailMax Inc',
    contractType: 'AMC',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    annualValue: 60000,
    billingCycle: 'Annually',
    contractStatus: 'Active',
    supportLevel: 'Enterprise',
    responseTime: '4 hours',
    renewalAlert: false,
    daysToExpiry: 184,
    accountManager: 'Emma Davis',
    createdDate: '2023-08-15',
  },
  {
    id: '4',
    contractId: 'SUP-2023-045',
    projectId: 'PRJ-2023-010',
    projectName: 'Inventory Management System',
    clientName: 'LogiTrack Systems',
    contractType: 'Support',
    startDate: '2023-06-01',
    endDate: '2024-02-29',
    annualValue: 24000,
    billingCycle: 'Monthly',
    contractStatus: 'Expired',
    supportLevel: 'Basic',
    responseTime: '24 hours',
    renewalAlert: true,
    daysToExpiry: -28,
    remarks: 'Contract expired, renewal pending',
    accountManager: 'James Rodriguez',
    createdDate: '2023-05-20',
  },
  {
    id: '5',
    contractId: 'AMC-2024-004',
    projectId: 'PRJ-2024-005',
    projectName: 'Healthcare Portal',
    clientName: 'MediCare Health',
    contractType: 'Both',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    annualValue: 72000,
    billingCycle: 'Quarterly',
    contractStatus: 'Active',
    supportLevel: 'Enterprise',
    responseTime: '4 hours',
    renewalAlert: false,
    daysToExpiry: 365,
    accountManager: 'Sarah Williams',
    createdDate: '2024-02-15',
  },
];

export default function SupportAMCModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<SupportContract | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [contracts, setContracts] = useState<SupportContract[]>(mockContracts);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter(c => c.contractStatus === 'Active').length;
    const expiringSoon = contracts.filter(c => c.contractStatus === 'Expiring Soon').length;
    const expired = contracts.filter(c => c.contractStatus === 'Expired').length;
    const totalAnnualValue = contracts.reduce((sum, c) => sum + c.annualValue, 0);
    const premiumContracts = contracts.filter(c => c.supportLevel === 'Premium' || c.supportLevel === 'Enterprise').length;

    return [
      {
        label: 'Total Contracts',
        value: total.toString(),
        icon: 'FileText',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Active Contracts',
        value: active.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Expiring Soon',
        value: expiringSoon.toString(),
        icon: 'AlertCircle',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Expired',
        value: expired.toString(),
        icon: 'XCircle',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '-1',
        trendDirection: 'down' as const,
      },
      {
        label: 'Annual Contract Value',
        value: `$${(totalAnnualValue / 1000).toFixed(0)}K`,
        icon: 'Activity',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+12',
        trendDirection: 'up' as const,
      },
      {
        label: 'Premium Support',
        value: premiumContracts.toString(),
        icon: 'Shield',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
    ];
  }, [contracts]);

  // Filter and search logic
  const filteredContracts = useMemo(() => {
    let filtered = [...contracts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contract) =>
          contract.contractId.toLowerCase().includes(query) ||
          contract.projectName.toLowerCase().includes(query) ||
          contract.clientName.toLowerCase().includes(query) ||
          contract.accountManager.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((contract) => {
          const contractValue = contract[filter.field as keyof SupportContract];
          if (typeof contractValue === 'string') {
            return contractValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return contractValue === filter.value;
        });
      }
    });

    return filtered;
  }, [contracts, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContracts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContracts, currentPage, itemsPerPage]);

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

  const handleEditContract = (contract: SupportContract) => {
    setSelectedContract(contract);
    setIsAddModalOpen(true);
  };

  const handleDeleteContract = (contractId: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== contractId));
    }
  };

  // Get status styles
  const getStatusStyle = (status: SupportContract['contractStatus']) => {
    const styles = {
      'Active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Expiring Soon': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Expired': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Renewed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return styles[status];
  };

  const getSupportLevelStyle = (level: SupportContract['supportLevel']) => {
    const styles = {
      'Basic': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Standard': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Premium': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Enterprise': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return styles[level];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Support / AMC Management"
        subtitle="Manage post-delivery support contracts and Annual Maintenance Contracts"
        moduleName="Contract"
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
              { field: 'contractType', label: 'Contract Type', type: 'select', options: ['AMC', 'Support', 'Both'] },
              { field: 'contractStatus', label: 'Status', type: 'select', options: ['Active', 'Expiring Soon', 'Expired', 'Renewed'] },
              { field: 'supportLevel', label: 'Support Level', type: 'select', options: ['Basic', 'Standard', 'Premium', 'Enterprise'] },
              { field: 'billingCycle', label: 'Billing Cycle', type: 'select', options: ['Monthly', 'Quarterly', 'Annually'] },
              { field: 'clientName', label: 'Client Name', type: 'text' },
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
            {paginatedContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Status */}
                <div className={`h-1 ${
                  contract.contractStatus === 'Active' ? 'bg-green-500' :
                  contract.contractStatus === 'Expiring Soon' ? 'bg-orange-500' :
                  contract.contractStatus === 'Renewed' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <Headphones className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{contract.contractId}</span>
                    </div>
                    
                    {/* Renewal Alert Badge */}
                    {contract.renewalAlert && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                        <AlertCircle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">ACTION REQUIRED</span>
                      </div>
                    )}

                    {/* Action Menu */}
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === contract.id ? null : contract.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === contract.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditContract(contract);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteContract(contract.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Project Name Title */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {contract.projectName}
                  </h3>
                  
                  {/* Client Name with Icon */}
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {contract.clientName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate">{contract.clientName}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(contract.contractStatus)}`}>
                      {contract.contractStatus}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getSupportLevelStyle(contract.supportLevel)}`}>
                      {contract.supportLevel}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Compact Information Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Contract Type */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Contract Type</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{contract.contractType}</div>
                    </div>
                    
                    {/* Account Manager */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Account Manager</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{contract.accountManager}</div>
                    </div>
                    
                    {/* Start Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Start Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{contract.startDate}</div>
                    </div>
                    
                    {/* End Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">End Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{contract.endDate}</div>
                    </div>
                    
                    {/* Response Time */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Response Time</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{contract.responseTime}</div>
                    </div>
                    
                    {/* Annual Value */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Annual Value</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">${contract.annualValue.toLocaleString()}</div>
                    </div>

                    {/* Days to Expiry - Only if renewal alert */}
                    {contract.renewalAlert && contract.daysToExpiry !== undefined && (
                      <>
                        <div className="col-span-2">
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">
                            {contract.daysToExpiry > 0 ? 'Days to Expiry' : 'Days Overdue'}
                          </div>
                          <div className={`font-medium ${contract.daysToExpiry > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Math.abs(contract.daysToExpiry)} days
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{contract.contractId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(contract.contractStatus)}`}>
                        {contract.contractStatus}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSupportLevelStyle(contract.supportLevel)}`}>
                        {contract.supportLevel}
                      </span>
                      {contract.renewalAlert && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Action Required
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-3">{contract.projectName} - {contract.clientName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Contract Type</span>
                        <span className="text-neutral-900 dark:text-white">{contract.contractType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">End Date</span>
                        <span className="text-neutral-900 dark:text-white">{contract.endDate}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Annual Value</span>
                        <span className="text-neutral-900 dark:text-white font-medium">${contract.annualValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Account Manager</span>
                        <span className="text-neutral-900 dark:text-white">{contract.accountManager}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleEditContract(contract)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContract(contract.id)}
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

        {viewMode === 'table' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Support Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Annual Value
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
                  {paginatedContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            {contract.contractId}
                            {contract.renewalAlert && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{contract.projectName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {contract.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {contract.contractType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getSupportLevelStyle(contract.supportLevel)}`}>
                          {contract.supportLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-neutral-900 dark:text-white">{contract.startDate}</div>
                        <div className="text-neutral-500 dark:text-neutral-400">{contract.endDate}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        ${contract.annualValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(contract.contractStatus)}`}>
                          {contract.contractStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleEditContract(contract)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContract(contract.id)}
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

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredContracts.length}
          />
        </div>
      </div>
    </div>
  );
}
