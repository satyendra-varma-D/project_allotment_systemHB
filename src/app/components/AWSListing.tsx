import { useState, useMemo } from 'react';
import {
  Cloud,
  Server,
  Calendar,
  DollarSign,
  Activity,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';
import { ListingHeader, Pagination, AdvancedSearchPanel, FilterChips } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { getAWSData, AWSItem } from '../../mockAPI/awsData';
import { AddEditAWSPanel } from './AddEditAWSPanel';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list' | 'table';

export function AWSListing() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AWSItem | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const itemsPerPage = 12;

  const allItems = getAWSData();

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let filtered = [...allItems];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query) ||
          item.serverType.toLowerCase().includes(query) ||
          item.projectName?.toLowerCase().includes(query) ||
          item.clientName?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterKey, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((item) => {
          const itemValue = item[filterKey as keyof AWSItem];
          return values.includes(String(itemValue));
        });
      }
    });

    return filtered;
  }, [allItems, searchQuery, selectedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddNew = () => {
    setEditingItem(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (item: AWSItem) => {
    setEditingItem(item);
    setIsPanelOpen(true);
    setShowActionsMenu(null);
  };

  const handleDelete = (item: AWSItem) => {
    toast.success(`AWS resource "${item.title}" deleted successfully`);
    setShowActionsMenu(null);
  };

  const handleSave = (data: any) => {
    if (editingItem) {
      toast.success('AWS resource updated successfully');
    } else {
      toast.success('AWS resource added successfully');
    }
    setIsPanelOpen(false);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  };

  const handleAddFilter = (filter: FilterCondition) => {
    setFilters([...filters, filter]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleRefresh = () => {
    toast.success('Data refreshed');
  };

  // Define filters
  const filterConfig = [
    {
      id: 'type',
      label: 'Type',
      options: [
        { value: 'EC2', label: 'EC2' },
        { value: 'S3', label: 'S3' },
        { value: 'RDS', label: 'RDS' },
        { value: 'Lambda', label: 'Lambda' },
        { value: 'CloudFront', label: 'CloudFront' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'Requested', label: 'Requested' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'subscriptionStatus',
      label: 'Subscription Status',
      options: [
        { value: 'Trial', label: 'Trial' },
        { value: 'Active', label: 'Active' },
        { value: 'Suspended', label: 'Suspended' },
        { value: 'Expired', label: 'Expired' },
        { value: 'Cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'subscriptionType',
      label: 'Subscription Type',
      options: [
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' },
        { value: 'Pay-as-you-go', label: 'Pay-as-you-go' },
      ],
    },
  ];

  // Style helpers
  const getStatusStyle = (status: AWSItem['status']) => {
    const styles = {
      'Requested': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Approved': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Inactive': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status];
  };

  const getStatusBadgeStyle = (status: AWSItem['status']) => {
    const styles = {
      'Requested': 'bg-blue-500 text-white',
      'Approved': 'bg-purple-500 text-white',
      'Active': 'bg-green-500 text-white',
      'Inactive': 'bg-neutral-500 text-white',
      'Cancelled': 'bg-red-500 text-white',
    };
    return styles[status];
  };

  const getBorderColor = (type: AWSItem['type']) => {
    const colors = {
      'HostingServer': 'bg-cyan-500',
      'EC2': 'bg-orange-500',
      'S3': 'bg-green-500',
      'RDS': 'bg-blue-500',
      'Lambda': 'bg-purple-500',
      'CloudFront': 'bg-pink-500',
      'Other': 'bg-neutral-400',
    };
    return colors[type];
  };

  const getTypeStyle = (type: AWSItem['type']) => {
    const styles = {
      'HostingServer': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'EC2': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'S3': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'RDS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Lambda': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'CloudFront': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'Other': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    };
    return styles[type];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="py-6">
        <ListingHeader
          title="AWS Resources"
          subtitle="Manage AWS infrastructure and subscriptions"
          moduleName="AWS"
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAdd={handleAddNew}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
          onFilterClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
          onRefresh={handleRefresh}
          onExport={() => toast.success('Exporting AWS resources...')}
        />

        {/* Advanced Search Panel */}
        {isAdvancedSearchOpen && (
          <div className="px-6 pb-4">
            <AdvancedSearchPanel
              onAddFilter={handleAddFilter}
              onClose={() => setIsAdvancedSearchOpen(false)}
              filterOptions={[
                { field: 'type', label: 'AWS Type', type: 'select', options: ['HostingServer', 'EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'Other'] },
                { field: 'status', label: 'Status', type: 'select', options: ['Requested', 'Approved', 'Active', 'Inactive', 'Cancelled'] },
                { field: 'subscriptionStatus', label: 'Subscription Status', type: 'select', options: ['Proposed', 'Trial', 'Active', 'Suspended', 'Expired', 'Cancelled'] },
                { field: 'subscriptionType', label: 'Subscription Type', type: 'select', options: ['Monthly', 'Yearly', 'Pay-as-you-go'] },
                { field: 'title', label: 'Title', type: 'text' },
                { field: 'serverType', label: 'Server Type', type: 'text' },
                { field: 'clientName', label: 'Client Name', type: 'text' },
                { field: 'projectName', label: 'Project Name', type: 'text' },
              ]}
            />
          </div>
        )}

        {/* Filter Chips */}
        {filters.length > 0 && (
          <div className="px-6 pb-4">
            <FilterChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group"
                >
                  {/* Colored Top Border Accent - Based on Status */}
                  <div className={`h-1 ${
                    item.status === 'Active' ? 'bg-green-500' :
                    item.status === 'Approved' ? 'bg-purple-500' :
                    item.status === 'Requested' ? 'bg-blue-500' :
                    item.status === 'Cancelled' ? 'bg-red-500' :
                    'bg-neutral-300'
                  }`} />

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Header Row - Title with Badges and Actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getTypeStyle(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">{item.subscriptionType}</span>
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Action Menu */}
                      <div className="relative ml-2">
                        <button
                          onClick={() => setShowActionsMenu(showActionsMenu === item.id ? null : item.id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-all"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        </button>
                        
                        {showActionsMenu === item.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/30 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Server Type Info */}
                    <div className="flex items-start gap-2 mb-3 text-sm">
                      <Server className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Server Type</div>
                        <div className="text-neutral-900 dark:text-white font-medium">{item.serverType}</div>
                      </div>
                    </div>

                    {/* Client Info */}
                    {item.clientName && (
                      <div className="flex items-start gap-2 mb-4 text-sm">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0 mt-0.5">
                          {item.clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Client</div>
                          <div className="text-neutral-900 dark:text-white font-medium">{item.clientName}</div>
                        </div>
                      </div>
                    )}

                    {/* Amount - Prominent */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <DollarSign className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Amount</div>
                        <div className="text-2xl font-semibold text-neutral-900 dark:text-white">
                          {item.currency} {item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                          <Calendar className="w-3 h-3" />
                          Start Date
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {new Date(item.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                          <Calendar className="w-3 h-3" />
                          End Date
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {new Date(item.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500 dark:text-neutral-400">Subscription: {item.subscriptionStatus}</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{item.durationMonths} months</span>
                    </div>

                    {/* Status Badge - Bottom */}
                    <div className={`w-full py-2 px-3 rounded-md text-center text-sm font-semibold ${getStatusBadgeStyle(item.status)}`}>
                      Status: {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="divide-y divide-neutral-200 dark:border-neutral-800">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeStyle(item.type)}`}>
                            {item.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{item.projectName} • {item.clientName}</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Amount</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{item.currency} {item.amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Server Type</span>
                            <span className="text-neutral-900 dark:text-white">{item.serverType}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Duration</span>
                            <span className="text-neutral-900 dark:text-white">{item.durationMonths} months</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block text-xs mb-1">Subscription</span>
                            <span className="text-neutral-900 dark:text-white">{item.subscriptionStatus}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsMenu(showActionsMenu === item.id ? null : item.id)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                        
                        {showActionsMenu === item.id && (
                          <div className="absolute right-0 top-10 z-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/30 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Server Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Subscription</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Start Date</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-neutral-900 dark:text-white">{item.title}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.clientName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeStyle(item.type)}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{item.serverType}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{item.subscriptionStatus}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white">{item.currency} {item.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{item.durationMonths} months</td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{new Date(item.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1.5 hover:bg-error-50 dark:hover:bg-error-950/30 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-error-600 dark:text-error-400" />
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={() => {}}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Panel */}
      <AddEditAWSPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSave={handleSave}
        initialData={editingItem || undefined}
        mode={editingItem ? 'edit' : 'add'}
      />
    </div>
  );
}