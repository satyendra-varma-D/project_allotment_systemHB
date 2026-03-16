import { useState, useMemo } from 'react';
import {
  Flag,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ListingColumnConfig } from './hb/listing';
import {
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';
import { SidePanel, SidePanelFooter } from './hb/common/SidePanel';

// Milestone Master data interface
interface MilestoneMaster {
  id: string;
  milestoneCode: string;
  milestoneName: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

// Mock data
const mockMilestones: MilestoneMaster[] = [
  {
    id: '1',
    milestoneCode: 'M0',
    milestoneName: 'M0 (Upfront)',
    description: 'Initial upfront payment before project commencement',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '2',
    milestoneCode: 'M1',
    milestoneName: 'M1',
    description: 'First milestone after project initiation',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '3',
    milestoneCode: 'M2',
    milestoneName: 'M2',
    description: 'Second milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '4',
    milestoneCode: 'M3',
    milestoneName: 'M3',
    description: 'Third milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '5',
    milestoneCode: 'M4',
    milestoneName: 'M4',
    description: 'Fourth milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '6',
    milestoneCode: 'M5',
    milestoneName: 'M5',
    description: 'Fifth milestone completion',
    status: 'Inactive',
    createdDate: '2024-01-01',
  },
  {
    id: '7',
    milestoneCode: 'M6',
    milestoneName: 'M6',
    description: 'Sixth milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '8',
    milestoneCode: 'M7',
    milestoneName: 'M7',
    description: 'Seventh milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '9',
    milestoneCode: 'M8',
    milestoneName: 'M8',
    description: 'Eighth milestone completion',
    status: 'Inactive',
    createdDate: '2024-01-01',
  },
  {
    id: '10',
    milestoneCode: 'M9',
    milestoneName: 'M9',
    description: 'Ninth milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
  {
    id: '11',
    milestoneCode: 'M10',
    milestoneName: 'M10',
    description: 'Final milestone completion',
    status: 'Active',
    createdDate: '2024-01-01',
  },
];

export default function MilestonesMasterModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneMaster | null>(null);
  const [milestones, setMilestones] = useState<MilestoneMaster[]>(mockMilestones);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    milestoneCode: true,
    milestoneName: true,
    description: true,
    status: true,
  });
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Table columns configuration
  const tableColumns: ListingColumnConfig[] = [
    { key: 'milestoneCode', label: 'Code' },
    { key: 'milestoneName', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
  ];

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = milestones.length;
    const active = milestones.filter(m => m.status === 'Active').length;
    const inactive = milestones.filter(m => m.status === 'Inactive').length;

    return [
      {
        label: 'Total Templates',
        value: total.toString(),
        icon: 'Database',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Active Templates',
        value: active.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Inactive Templates',
        value: inactive.toString(),
        icon: 'XCircle',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '',
        trendDirection: 'neutral' as const,
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
          (milestone.description && milestone.description.toLowerCase().includes(query))
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((milestone) => {
          const milestoneValue = milestone[filter.field as keyof MilestoneMaster];
          if (typeof milestoneValue === 'string') {
            return milestoneValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return milestoneValue === filter.value;
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

  const handleEditMilestone = (milestone: MilestoneMaster) => {
    setSelectedMilestone(milestone);
    setIsAddModalOpen(true);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (confirm('Are you sure you want to delete this milestone template?')) {
      setMilestones(milestones.filter(m => m.id !== milestoneId));
    }
  };

  const handleSaveMilestone = () => {
    setIsAddModalOpen(false);
    setSelectedMilestone(null);
  };

  // Get status badge style
  const getStatusBadge = (status: MilestoneMaster['status']) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header with ListingHeader Component */}
      <ListingHeader
        title="Milestones Master"
        subtitle="Define milestone templates for your projects"
        moduleName="Milestone Template"
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
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
              { field: 'milestoneCode', label: 'Milestone Code', type: 'text' },
              { field: 'milestoneName', label: 'Milestone Name', type: 'text' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent */}
                <div className={`h-1 ${
                  milestone.status === 'Active' ? 'bg-green-500' : 'bg-neutral-400'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <Flag className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{milestone.milestoneCode}</span>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === milestone.id ? null : milestone.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openDropdownId === milestone.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditMilestone(milestone);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteMilestone(milestone.id);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Milestone Name */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {milestone.milestoneName}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(milestone.status)}`}>
                      {milestone.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {milestone.status}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-semibold mb-1.5">Description</div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 min-h-[3rem]">
                      {milestone.description || 'No description provided'}
                    </p>
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
                      <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{milestone.milestoneCode}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(milestone.status)}`}>
                        {milestone.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{milestone.milestoneName}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{milestone.description}</p>
                  </div>
                  <div className="ml-4 relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === milestone.id ? null : milestone.id)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    {openDropdownId === milestone.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-20">
                          <button
                            onClick={() => {
                              handleEditMilestone(milestone);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteMilestone(milestone.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
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

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    {visibleColumns.milestoneCode && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Code
                      </th>
                    )}
                    {visibleColumns.milestoneName && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Name
                      </th>
                    )}
                    {visibleColumns.description && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Description
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedMilestones.map((milestone) => (
                    <tr key={milestone.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      {visibleColumns.milestoneCode && (
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-neutral-900 dark:text-white">{milestone.milestoneCode}</span>
                        </td>
                      )}
                      {visibleColumns.milestoneName && (
                        <td className="px-6 py-4">
                          <span className="font-medium text-neutral-900 dark:text-white">{milestone.milestoneName}</span>
                        </td>
                      )}
                      {visibleColumns.description && (
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{milestone.description}</span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusBadge(milestone.status)}`}>
                            {milestone.status}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === milestone.id ? null : milestone.id)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          {openDropdownId === milestone.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-20">
                                <button
                                  onClick={() => {
                                    handleEditMilestone(milestone);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteMilestone(milestone.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
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
      <SidePanel
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedMilestone(null);
        }}
        title={selectedMilestone ? 'Edit Milestone Template' : 'Add Milestone Template'}
        footer={
          <SidePanelFooter
            onCancel={() => {
              setIsAddModalOpen(false);
              setSelectedMilestone(null);
            }}
            onSave={handleSaveMilestone}
          />
        }
      >
        <div className="space-y-5">
          <FormField>
            <FormLabel required>Milestone Code</FormLabel>
            <FormInput 
              placeholder="e.g., M0, M1, M2" 
              defaultValue={selectedMilestone?.milestoneCode} 
            />
          </FormField>

          <FormField>
            <FormLabel required>Milestone Name</FormLabel>
            <FormInput 
              placeholder="e.g., M0 (Upfront), M1, M2" 
              defaultValue={selectedMilestone?.milestoneName} 
            />
          </FormField>

          <FormField>
            <FormLabel>Description</FormLabel>
            <FormTextarea 
              placeholder="Enter milestone description" 
              defaultValue={selectedMilestone?.description}
              rows={4}
            />
          </FormField>

          <FormField>
            <FormLabel required>Status</FormLabel>
            <FormSelect defaultValue={selectedMilestone?.status || 'Active'}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </FormSelect>
          </FormField>
        </div>
      </SidePanel>
    </div>
  );
}