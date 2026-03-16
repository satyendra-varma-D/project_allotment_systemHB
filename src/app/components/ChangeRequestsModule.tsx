import { useState, useMemo } from 'react';
import {
  FileEdit,
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
  Users,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';
import { AddonsEditSidePanel } from './AddonsEditSidePanel';
import type { AddonData } from './AddonsEditSidePanel';

// Change Request data interface
interface ChangeRequest {
  id: string;
  requestId: string;
  projectId: string;
  projectName: string;
  clientName: string;
  requestType: 'Additional Scope' | 'Change Request' | 'Delivery Extension' | 'Feature Enhancement';
  title: string;
  description: string;
  requestDate: string;
  estimatedHours: number;
  estimatedCost: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requestedBy: string;
  assignedTo: string;
  approvalDate?: string;
  completionDate?: string;
  actualHours?: number;
  actualCost?: number;
  remarks?: string;
  createdDate: string;
}

// Mock data
const mockChangeRequests: ChangeRequest[] = [
  {
    id: '1',
    requestId: 'AD-2024-001',
    projectId: 'PRJ-2024-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    requestType: 'Feature Enhancement',
    title: 'Add Advanced Reporting Dashboard',
    description: 'Client requested custom analytics dashboard with real-time data visualization',
    requestDate: '2024-02-15',
    estimatedHours: 120,
    estimatedCost: 15000,
    status: 'Approved',
    priority: 'High',
    requestedBy: 'John Smith',
    assignedTo: 'Development Team A',
    approvalDate: '2024-02-20',
    createdDate: '2024-02-15',
  },
  {
    id: '2',
    requestId: 'AD-2024-002',
    projectId: 'PRJ-2024-002',
    projectName: 'Mobile Banking App',
    clientName: 'FinanceHub Ltd',
    requestType: 'Additional Scope',
    title: 'Biometric Authentication Integration',
    description: 'Add fingerprint and face recognition login capabilities',
    requestDate: '2024-02-18',
    estimatedHours: 80,
    estimatedCost: 10000,
    status: 'Under Review',
    priority: 'High',
    requestedBy: 'Sarah Williams',
    assignedTo: 'Mobile Team',
    remarks: 'Security assessment in progress',
    createdDate: '2024-02-18',
  },
  {
    id: '3',
    requestId: 'AD-2024-003',
    projectId: 'PRJ-2023-015',
    projectName: 'E-Commerce Platform',
    clientName: 'RetailMax Inc',
    requestType: 'Delivery Extension',
    title: 'Extended Testing Phase',
    description: 'Request for additional 2 weeks for comprehensive UAT and bug fixes',
    requestDate: '2024-02-10',
    estimatedHours: 160,
    estimatedCost: 8000,
    status: 'Approved',
    priority: 'Medium',
    requestedBy: 'Michael Chen',
    assignedTo: 'QA Team',
    approvalDate: '2024-02-12',
    createdDate: '2024-02-10',
  },
  {
    id: '4',
    requestId: 'AD-2024-004',
    projectId: 'PRJ-2024-005',
    projectName: 'Healthcare Portal',
    clientName: 'MediCare Health',
    requestType: 'Feature Enhancement',
    title: 'Modify Patient Records Module',
    description: 'Update data structure and UI for improved patient information management',
    requestDate: '2024-02-22',
    estimatedHours: 60,
    estimatedCost: 7500,
    status: 'In Progress',
    priority: 'High',
    requestedBy: 'Emma Davis',
    assignedTo: 'Development Team B',
    approvalDate: '2024-02-23',
    actualHours: 35,
    createdDate: '2024-02-22',
  },
  {
    id: '5',
    requestId: 'AD-2024-005',
    projectId: 'PRJ-2023-010',
    projectName: 'Inventory Management System',
    clientName: 'LogiTrack Systems',
    requestType: 'Feature Enhancement',
    title: 'Multi-Warehouse Support',
    description: 'Add capability to manage inventory across multiple warehouse locations',
    requestDate: '2024-02-05',
    estimatedHours: 200,
    estimatedCost: 25000,
    status: 'Submitted',
    priority: 'Medium',
    requestedBy: 'James Rodriguez',
    assignedTo: 'Architecture Team',
    remarks: 'Feasibility study required',
    createdDate: '2024-02-05',
  },
  {
    id: '6',
    requestId: 'AD-2024-006',
    projectId: 'PRJ-2024-003',
    projectName: 'Learning Management System',
    clientName: 'EduTech Academy',
    requestType: 'Additional Scope',
    title: 'Video Conferencing Integration',
    description: 'Integrate Zoom/Teams for live virtual classrooms',
    requestDate: '2024-01-28',
    estimatedHours: 100,
    estimatedCost: 12000,
    status: 'Rejected',
    priority: 'Low',
    requestedBy: 'Lisa Anderson',
    assignedTo: 'Integration Team',
    remarks: 'Out of current scope, deferred to Phase 2',
    createdDate: '2024-01-28',
  },
  {
    id: '7',
    requestId: 'AD-2024-007',
    projectId: 'PRJ-2024-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    requestType: 'Feature Enhancement',
    title: 'API Response Format Update',
    description: 'Update REST API response structure for better frontend integration',
    requestDate: '2024-02-25',
    estimatedHours: 40,
    estimatedCost: 5000,
    status: 'Completed',
    priority: 'Medium',
    requestedBy: 'John Smith',
    assignedTo: 'API Team',
    approvalDate: '2024-02-26',
    completionDate: '2024-02-27',
    actualHours: 38,
    actualCost: 4800,
    createdDate: '2024-02-25',
  },
];

export default function ChangeRequestsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [requests, setRequests] = useState<ChangeRequest[]>(mockChangeRequests);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = requests.length;
    const submitted = requests.filter(r => r.status === 'Submitted').length;
    const underReview = requests.filter(r => r.status === 'Under Review').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const inProgress = requests.filter(r => r.status === 'In Progress').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const totalEstimatedCost = requests.reduce((sum, r) => sum + r.estimatedCost, 0);

    return [
      {
        label: 'Total Requests',
        value: total.toString(),
        icon: 'FileEdit',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+3',
        trendDirection: 'up' as const,
      },
      {
        label: 'Under Review',
        value: underReview.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Approved',
        value: approved.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'In Progress',
        value: inProgress.toString(),
        icon: 'TrendingUp',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Completed',
        value: completed.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Estimated Cost',
        value: `$${(totalEstimatedCost / 1000).toFixed(0)}K`,
        icon: 'Activity',
        bgColor: 'bg-pink-50 dark:bg-pink-950/30',
        iconColor: 'text-pink-600 dark:text-pink-400',
        trend: '+15',
        trendDirection: 'up' as const,
      },
    ];
  }, [requests]);

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.requestId.toLowerCase().includes(query) ||
          request.title.toLowerCase().includes(query) ||
          request.projectName.toLowerCase().includes(query) ||
          request.clientName.toLowerCase().includes(query) ||
          request.requestedBy.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((request) => {
          const requestValue = request[filter.field as keyof ChangeRequest];
          if (typeof requestValue === 'string') {
            return requestValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return requestValue === filter.value;
        });
      }
    });

    return filtered;
  }, [requests, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

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

  const handleEditRequest = (request: ChangeRequest) => {
    setSelectedRequest(request);
    setIsAddModalOpen(true);
  };

  const handleDeleteRequest = (requestId: string) => {
    if (confirm('Are you sure you want to delete this change request?')) {
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  // Get status styles
  const getStatusStyle = (status: ChangeRequest['status']) => {
    const styles = {
      'Draft': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Submitted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Under Review': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Approved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'In Progress': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Completed': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return styles[status];
  };

  const getPriorityStyle = (priority: ChangeRequest['priority']) => {
    const styles = {
      'Low': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[priority];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Addons"
        subtitle="Track additional scope, addons, and delivery extensions"
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
              { field: 'requestType', label: 'Request Type', type: 'select', options: ['Additional Scope', 'Change Request', 'Delivery Extension', 'Feature Enhancement'] },
              { field: 'status', label: 'Status', type: 'select', options: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'In Progress', 'Completed'] },
              { field: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
              { field: 'projectName', label: 'Project Name', type: 'text' },
              { field: 'requestedBy', label: 'Requested By', type: 'text' },
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
            {paginatedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Status */}
                <div className={`h-1 ${
                  request.status === 'Completed' ? 'bg-indigo-500' :
                  request.status === 'Approved' ? 'bg-green-500' :
                  request.status === 'In Progress' ? 'bg-purple-500' :
                  request.status === 'Under Review' ? 'bg-orange-500' :
                  request.status === 'Rejected' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <FileEdit className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{request.requestId}</span>
                    </div>
                    
                    {/* Priority Badge */}
                    {request.priority === 'Critical' && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded-md">
                        <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">CRITICAL</span>
                      </div>
                    )}

                    {/* Action Menu */}
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === request.id ? null : request.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === request.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditRequest(request);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteRequest(request.id);
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

                  {/* Title */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {request.title}
                  </h3>
                  
                  {/* Project Name with Icon */}
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {request.projectName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate">{request.projectName}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getPriorityStyle(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Compact Information Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Request Type */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Request Type</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{request.requestType}</div>
                    </div>
                    
                    {/* Client Name */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Client</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{request.clientName}</div>
                    </div>
                    
                    {/* Requested By */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Requested By</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{request.requestedBy}</div>
                    </div>
                    
                    {/* Request Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Request Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{request.requestDate}</div>
                    </div>
                    
                    {/* Estimated Hours */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Est. Hours</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{request.estimatedHours}h</div>
                    </div>
                    
                    {/* Estimated Cost */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Est. Cost</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">${request.estimatedCost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{request.requestId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityStyle(request.priority)}`}>
                        {request.priority}
                      </span>
                      {request.priority === 'Critical' && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Critical Priority
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{request.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{request.projectName} - {request.clientName}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Request Type</span>
                        <span className="text-neutral-900 dark:text-white">{request.requestType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Requested By</span>
                        <span className="text-neutral-900 dark:text-white">{request.requestedBy}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Estimated Cost</span>
                        <span className="text-neutral-900 dark:text-white font-medium">${request.estimatedCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Request Date</span>
                        <span className="text-neutral-900 dark:text-white">{request.requestDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleEditRequest(request)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
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
                      Request
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Estimated Cost
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
                  {paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            {request.requestId}
                            {request.priority === 'Critical' && <AlertCircle className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">{request.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{request.projectName}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{request.clientName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {request.requestType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPriorityStyle(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        ${request.estimatedCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleEditRequest(request)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(request.id)}
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
            totalItems={filteredRequests.length}
          />
        </div>
      </div>

      {/* Addons Edit Side Panel */}
      <AddonsEditSidePanel
        isOpen={isAddModalOpen}
        request={selectedRequest}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedRequest(null);
        }}
        onSave={(updatedRequest) => {
          if (selectedRequest) {
            setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
          } else {
            setRequests([...requests, updatedRequest]);
          }
          setIsAddModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}