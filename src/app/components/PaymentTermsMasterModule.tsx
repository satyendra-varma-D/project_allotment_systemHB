import { useState, useMemo } from 'react';
import {
  DollarSign,
  Percent,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';

// Payment Terms interface
interface PaymentTermsDetail {
  milestoneCode: string;
  milestoneName: string;
  percentage: number;
}

interface PaymentTermsMaster {
  id: string;
  paymentTermsId: string;
  structureName: string;
  description: string;
  details: PaymentTermsDetail[];
  totalPercentage: number;
  isValid: boolean;
  status: 'active' | 'inactive';
  linkedProjects: number;
  createdBy: string;
  createdDate: string;
}

// Mock data
const mockPaymentTerms: PaymentTermsMaster[] = [
  {
    id: '1',
    paymentTermsId: 'PT-001',
    structureName: '50:50 Model',
    description: 'Equal split payment structure - 50% upfront, 50% on completion',
    details: [
      { milestoneCode: 'PROJECT-KICKOFF', milestoneName: 'Project Kickoff', percentage: 50 },
      { milestoneCode: 'FINAL-DELIVERY', milestoneName: 'Final Delivery', percentage: 50 },
    ],
    totalPercentage: 100,
    isValid: true,
    status: 'active',
    linkedProjects: 12,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
  },
  {
    id: '2',
    paymentTermsId: 'PT-002',
    structureName: '30:40:30 Model',
    description: 'Three-phase payment structure for milestone-based delivery',
    details: [
      { milestoneCode: 'REQ-ANALYSIS', milestoneName: 'Requirement Signoff', percentage: 30 },
      { milestoneCode: 'UAT', milestoneName: 'UAT Completion', percentage: 40 },
      { milestoneCode: 'GO-LIVE', milestoneName: 'Go Live', percentage: 30 },
    ],
    totalPercentage: 100,
    isValid: true,
    status: 'active',
    linkedProjects: 8,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
  },
  {
    id: '3',
    paymentTermsId: 'PT-003',
    structureName: '20:30:30:20 Model',
    description: 'Four-phase balanced payment structure',
    details: [
      { milestoneCode: 'REQ-ANALYSIS', milestoneName: 'Requirements', percentage: 20 },
      { milestoneCode: 'DESIGN-PROTO', milestoneName: 'Design', percentage: 30 },
      { milestoneCode: 'DEV-PHASE-1', milestoneName: 'Development', percentage: 30 },
      { milestoneCode: 'GO-LIVE', milestoneName: 'Deployment', percentage: 20 },
    ],
    totalPercentage: 100,
    isValid: true,
    status: 'active',
    linkedProjects: 15,
    createdBy: 'Finance',
    createdDate: '2024-01-15',
  },
  {
    id: '4',
    paymentTermsId: 'PT-004',
    structureName: '25:25:25:25 Model',
    description: 'Equal quarterly payment distribution',
    details: [
      { milestoneCode: 'REQ-ANALYSIS', milestoneName: 'Q1 - Requirements', percentage: 25 },
      { milestoneCode: 'DESIGN-PROTO', milestoneName: 'Q2 - Design', percentage: 25 },
      { milestoneCode: 'DEV-PHASE-1', milestoneName: 'Q3 - Development', percentage: 25 },
      { milestoneCode: 'GO-LIVE', milestoneName: 'Q4 - Deployment', percentage: 25 },
    ],
    totalPercentage: 100,
    isValid: true,
    status: 'active',
    linkedProjects: 5,
    createdBy: 'Finance',
    createdDate: '2024-02-01',
  },
  {
    id: '5',
    paymentTermsId: 'PT-005',
    structureName: '40:35:25 Model',
    description: 'Front-loaded payment structure',
    details: [
      { milestoneCode: 'PROJECT-KICKOFF', milestoneName: 'Project Start', percentage: 40 },
      { milestoneCode: 'DEV-PHASE-1', milestoneName: 'Development', percentage: 35 },
      { milestoneCode: 'GO-LIVE', milestoneName: 'Final Delivery', percentage: 25 },
    ],
    totalPercentage: 100,
    isValid: true,
    status: 'active',
    linkedProjects: 6,
    createdBy: 'Finance',
    createdDate: '2024-02-10',
  },
];

export default function PaymentTermsMasterModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<PaymentTermsMaster | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermsMaster[]>(mockPaymentTerms);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = paymentTerms.length;
    const active = paymentTerms.filter(p => p.status === 'active').length;
    const inactive = paymentTerms.filter(p => p.status === 'inactive').length;
    const valid = paymentTerms.filter(p => p.isValid).length;
    const totalLinked = paymentTerms.reduce((sum, p) => sum + p.linkedProjects, 0);
    const avgPhases = Math.round(paymentTerms.reduce((sum, p) => sum + p.details.length, 0) / paymentTerms.length);

    return [
      {
        label: 'Total Structures',
        value: total.toString(),
        icon: 'Database',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Active',
        value: active.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Inactive',
        value: inactive.toString(),
        icon: 'XCircle',
        bgColor: 'bg-neutral-50 dark:bg-neutral-800',
        iconColor: 'text-neutral-600 dark:text-neutral-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Validated',
        value: valid.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Linked Projects',
        value: totalLinked.toString(),
        icon: 'Activity',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+5',
        trendDirection: 'up' as const,
      },
      {
        label: 'Avg Phases',
        value: avgPhases.toString(),
        icon: 'Layers',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
    ];
  }, [paymentTerms]);

  // Filter and search logic
  const filteredPaymentTerms = useMemo(() => {
    let filtered = [...paymentTerms];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (term) =>
          term.structureName.toLowerCase().includes(query) ||
          term.paymentTermsId.toLowerCase().includes(query) ||
          term.description.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.values && filter.values.length > 0) {
        filtered = filtered.filter((term) => {
          const termValue = term[filter.field as keyof PaymentTermsMaster];
          if (typeof termValue === 'string') {
            return filter.values.some(val => 
              termValue.toLowerCase().includes(val.toLowerCase())
            );
          }
          return filter.values.includes(String(termValue));
        });
      }
    });

    return filtered;
  }, [paymentTerms, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredPaymentTerms.length / itemsPerPage);
  const paginatedPaymentTerms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPaymentTerms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPaymentTerms, currentPage, itemsPerPage]);

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

  const handleEditTerm = (term: PaymentTermsMaster) => {
    setSelectedTerm(term);
    setIsAddModalOpen(true);
  };

  const handleDeleteTerm = (termId: string) => {
    const term = paymentTerms.find(t => t.id === termId);
    if (term && term.linkedProjects > 0) {
      alert(`Cannot delete. This payment term is linked to ${term.linkedProjects} active project(s).`);
      return;
    }
    if (confirm('Are you sure you want to delete this template?')) {
      setPaymentTerms(paymentTerms.filter(t => t.id !== termId));
    }
  };

  // Get status badge style
  const getStatusBadge = (status: PaymentTermsMaster['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Milestone Terms Templates"
        subtitle="Standardize financial milestone distribution structures across projects"
        moduleName="Structure"
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

        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            isOpen={isAdvancedSearchOpen}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterOptions={{
              'Status': ['active', 'inactive'],
              'Structure Name': Array.from(new Set(paymentTerms.map(p => p.structureName))).sort(),
            }}
          />
        </div>

      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        </div>
      )}

      <div className="px-6 pb-6">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPaymentTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent */}
                <div className={`h-1 ${term.isValid ? 'bg-green-500' : 'bg-red-500'}`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <DollarSign className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{term.paymentTermsId}</span>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === term.id ? null : term.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openDropdownId === term.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditTerm(term);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteTerm(term.id);
                                setOpenDropdownId(null);
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

                  {/* Structure Name */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {term.structureName}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 min-h-[2rem]">
                    {term.description}
                  </p>

                  {/* Status Badge */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${getStatusBadge(term.status)}`}>
                      {term.status}
                    </span>
                    {term.isValid && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Validated
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Distribution Section */}
                  <div className="space-y-2 mb-3">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-semibold mb-1.5">Distribution</div>
                    <div className="space-y-1.5">
                      {term.details.map((detail, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded">
                          <span className="text-neutral-600 dark:text-neutral-400 truncate pr-2">{detail.milestoneName}</span>
                          <span className="font-semibold text-neutral-900 dark:text-white flex-shrink-0">{detail.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    {/* Total Row */}
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">Total:</span>
                      <span className={`font-bold text-sm ${term.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {term.totalPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Footer: Linked Projects */}
                  <div className="text-xs">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Linked Projects</div>
                    <div className="font-medium text-neutral-900 dark:text-white">{term.linkedProjects} projects</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedPaymentTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{term.paymentTermsId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(term.status)}`}>
                        {term.status}
                      </span>
                      {term.isValid && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Validated
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{term.structureName}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{term.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {term.details.map((detail, index) => (
                        <div key={index} className="bg-neutral-50 dark:bg-neutral-800 p-2 rounded">
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{detail.milestoneName}</div>
                          <div className="font-medium text-neutral-900 dark:text-white">{detail.percentage}%</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Total: </span>
                        <span className={`font-bold ${term.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {term.totalPercentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Linked: </span>
                        <span className="text-neutral-900 dark:text-white font-medium">{term.linkedProjects} projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === term.id ? null : term.id)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    {openDropdownId === term.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-40 z-20">
                          <button
                            onClick={() => {
                              handleEditTerm(term);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteTerm(term.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
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
                      Structure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Distribution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Projects
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
                  {paginatedPaymentTerms.map((term) => (
                    <tr key={term.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">{term.structureName}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{term.paymentTermsId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {term.details.map((detail, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {detail.percentage}%
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${term.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {term.totalPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {term.linkedProjects}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md capitalize ${getStatusBadge(term.status)}`}>
                          {term.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === term.id ? null : term.id)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          {openDropdownId === term.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-40 z-20">
                                <button
                                  onClick={() => {
                                    handleEditTerm(term);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteTerm(term.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
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
            totalItems={filteredPaymentTerms.length}
          />
        </div>
      </div>
    </div>
  );
}
