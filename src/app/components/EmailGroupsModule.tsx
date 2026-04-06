import { useState, useMemo } from 'react';
import { Mail, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { FormField, FormLabel, FormInput, FormSelect } from './hb/common/Form';
import { SidePanel, SidePanelFooter } from './hb/common/SidePanel';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ListingColumnConfig } from './hb/listing';

interface EmailGroup {
  id: string;
  name: string;
  description: string;
  emails: string[];
  status: 'active' | 'inactive';
}

const mockGroups: EmailGroup[] = [
  {
    id: '1',
    name: 'Chirag Patel Group',
    description: 'Chirag Patel and associated members',
    emails: ['chirag.patel@company.com', 'assistant.chirag@company.com'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Jigar Joshi Group',
    description: 'Jigar Joshi and associated members',
    emails: ['jigar.joshi@company.com', 'support.jigar@company.com'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Nilay Mehta Group',
    description: 'Nilay Mehta and associated members',
    emails: ['nilay.mehta@company.com', 'admin.nilay@company.com'],
    status: 'active',
  },
];

export default function EmailGroupsModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  
  const [groups, setGroups] = useState<EmailGroup[]>(mockGroups);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<EmailGroup | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    emails: true,
    status: true,
  });

  const tableColumns: ListingColumnConfig[] = [
    { key: 'name', label: 'Group Name' },
    { key: 'emails', label: 'Recipients' },
    { key: 'status', label: 'Status' },
  ];

  const summaryData = useMemo(() => {
    const total = groups.length;
    const active = groups.filter(g => g.status === 'active').length;
    
    return [
      {
        label: 'Total Groups',
        value: total.toString(),
        icon: 'Mail',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Active Groups',
        value: active.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '',
        trendDirection: 'neutral' as const,
      },
    ];
  }, [groups]);

  const filteredGroups = useMemo(() => {
    let filtered = [...groups];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.description.toLowerCase().includes(query) || 
        g.emails.some(e => e.toLowerCase().includes(query))
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((g) => {
          const val = g[filter.field as keyof EmailGroup];
          if (typeof val === 'string') {
            return val.toLowerCase() === filter.value.toLowerCase();
          }
          return false;
        });
      }
    });

    return filtered;
  }, [groups, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGroups, currentPage, itemsPerPage]);

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const handleEdit = (group: EmailGroup) => {
    setSelectedGroup(group);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this email group?')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    setIsAddModalOpen(false);
    setSelectedGroup(null);
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Email Groups"
        subtitle="Manage email distribution lists for project communication"
        moduleName="Group"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        columns={tableColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onFilterClick={() => setIsAdvancedSearchOpen(true)}
        onRefresh={() => {}}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => {
          setSelectedGroup(null);
          setIsAddModalOpen(true);
        }}
      />

      {showSummary && (
        <div className="px-6 pb-6">
          <SummaryWidgets widgets={summaryData} />
        </div>
      )}

      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={(filter) => setActiveFilters([...activeFilters, filter])}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
            ]}
          />
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={(index) => setActiveFilters(activeFilters.filter((_, i) => i !== index))}
            onClear={() => setActiveFilters([])}
          />
        </div>
      )}

      <div className="px-6 pb-6">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGroups.map((group) => (
              <div key={group.id} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Colored Top Border Accent */}
                <div className={`h-1 ${group.status === 'active' ? 'bg-green-500' : 'bg-neutral-400'}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">{group.name}</h3>
                        <div className="text-xs text-neutral-500">{group.emails.length} recipients</div>
                      </div>
                    </div>
                    
                    <div className="relative ml-2">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </button>
                      {openMenuId === group.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-40 z-20">
                            <button
                              onClick={() => { handleEdit(group); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => { handleDelete(group.id); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{group.description}</p>
                  
                  <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto pr-1">
                    {group.emails.map((email, idx) => (
                      <div key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 px-2.5 py-1.5 rounded truncate">
                        {email}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex items-center justify-between">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider ${getStatusBadge(group.status)}`}>
                      {group.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedGroups.map((group) => (
              <div key={group.id} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 leading-snug">{group.name}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">{group.description}</p>
                      </div>
                      
                      <div>
                        <div className="text-xs uppercase font-medium text-neutral-500 mb-2">Recipients ({group.emails.length})</div>
                        <div className="flex flex-wrap gap-1.5 max-h-[50px] overflow-hidden">
                           {group.emails.slice(0, 3).map((email, i) => (
                             <span key={i} className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded block truncate">{email}</span>
                           ))}
                           {group.emails.length > 3 && (
                             <span className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">+{group.emails.length - 3}</span>
                           )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end pt-1">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wider ${getStatusBadge(group.status)}`}>
                          {group.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    {openMenuId === group.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-40 z-20">
                          <button
                            onClick={() => { handleEdit(group); setOpenMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => { handleDelete(group.id); setOpenMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
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
                    {visibleColumns.name && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Group Name
                      </th>
                    )}
                    {visibleColumns.emails && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Recipients
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
                  {paginatedGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      {visibleColumns.name && (
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900 dark:text-white mb-0.5">{group.name}</div>
                          <div className="text-xs text-neutral-500 max-w-[200px] truncate">{group.description}</div>
                        </td>
                      )}
                      {visibleColumns.emails && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="flex flex-wrap gap-1 max-w-[240px]">
                               {group.emails.slice(0, 2).map((email, i) => (
                                 <span key={i} className="text-xs px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded truncate max-w-[150px]">{email}</span>
                               ))}
                               {group.emails.length > 2 && (
                                 <span className="text-xs px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">+{group.emails.length - 2}</span>
                               )}
                             </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded uppercase tracking-wider ${getStatusBadge(group.status)}`}>
                            {group.status}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-32 z-10">
                            <button
                              onClick={() => handleEdit(group)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
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
            totalItems={filteredGroups.length}
          />
        </div>
      </div>

      <SidePanel
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedGroup(null);
        }}
        title={selectedGroup ? 'Edit :: Email Group' : 'Add :: Email Group'}
        footer={
          <SidePanelFooter
            onCancel={() => {
              setIsAddModalOpen(false);
              setSelectedGroup(null);
            }}
            onSave={handleSave}
            saveText="Save"
          />
        }
      >
        <div className="space-y-5">
          <FormField>
            <FormLabel required>Group Name</FormLabel>
            <FormInput placeholder="e.g. Chirag Patel Group" defaultValue={selectedGroup?.name} />
          </FormField>
          <FormField>
            <FormLabel>Description</FormLabel>
            <FormInput placeholder="Enter description" defaultValue={selectedGroup?.description} />
          </FormField>
          <FormField>
            <FormLabel required>Email Addresses (comma separated)</FormLabel>
            <textarea 
              className="w-full h-24 p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm"
              placeholder="email1@company.com, email2@company.com"
              defaultValue={selectedGroup?.emails.join(', ')}
            />
          </FormField>
          <FormField>
            <FormLabel required>Status</FormLabel>
            <FormSelect defaultValue={selectedGroup?.status || 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormField>
        </div>
      </SidePanel>
    </div>
  );
}
