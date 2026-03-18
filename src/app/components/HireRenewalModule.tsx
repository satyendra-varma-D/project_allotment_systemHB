import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Briefcase,
  FileText,
  Code,
  Search,
  Filter,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';
import { HireRenewalEditSidePanel } from './HireRenewalEditSidePanel';

// Resource Engagement data interface
interface ResourceEngagement {
  id: string;
  resourceId: string;
  resourceName: string;
  role: string;
  department: string;
  engagementModel: 'Full-Time' | 'Part-Time' | 'Contract' | 'Consultant';
  status: 'Active' | 'Inactive';
  projectName?: string;
  startDate: string;
  endDate?: string;
  email: string;
  phone: string;
  skills: string[];
  yearsOfExperience: number;
  remarks?: string;
  createdDate: string;
}

// Mock data
const mockEngagements: ResourceEngagement[] = [
  {
    id: '1',
    resourceId: 'RES-2024-001',
    resourceName: 'Alex Thompson',
    role: 'Senior Backend Developer',
    department: 'Development',
    engagementModel: 'Full-Time',
    status: 'Active',
    projectName: 'Enterprise CRM Platform',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    email: 'alex.thompson@example.com',
    phone: '+1-555-123-4567',
    skills: ['Node.js', 'Python', 'AWS'],
    yearsOfExperience: 5,
    createdDate: '2024-01-10',
  },
  {
    id: '2',
    resourceId: 'RES-2024-002',
    resourceName: 'Sarah Williams',
    role: 'UI/UX Designer',
    department: 'Design',
    engagementModel: 'Contract',
    status: 'Active',
    projectName: 'Mobile Banking App',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    email: 'sarah.williams@example.com',
    phone: '+1-555-987-6543',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    yearsOfExperience: 3,
    remarks: 'Contract renewal under discussion',
    createdDate: '2024-01-25',
  },
  {
    id: '3',
    resourceId: 'RES-2023-045',
    resourceName: 'Michael Chen',
    role: 'DevOps Engineer',
    department: 'Operations',
    engagementModel: 'Part-Time',
    status: 'Inactive',
    projectName: 'Enterprise CRM Platform',
    startDate: '2023-06-20',
    endDate: '2024-01-15',
    email: 'michael.chen@example.com',
    phone: '+1-555-555-5555',
    skills: ['Docker', 'Kubernetes', 'Jenkins'],
    yearsOfExperience: 4,
    remarks: 'Contract ended, available for future projects',
    createdDate: '2023-06-15',
  },
  {
    id: '4',
    resourceId: 'RES-2024-003',
    resourceName: 'Emma Davis',
    role: 'QA Lead',
    department: 'Quality Assurance',
    engagementModel: 'Consultant',
    status: 'Active',
    projectName: 'E-Commerce Platform Redesign',
    startDate: '2023-11-01',
    endDate: '2024-05-31',
    email: 'emma.davis@example.com',
    phone: '+1-555-111-2222',
    skills: ['Selenium', 'JIRA', 'TestRail'],
    yearsOfExperience: 6,
    createdDate: '2023-10-25',
  },
  {
    id: '5',
    resourceId: 'RES-2024-004',
    resourceName: 'James Rodriguez',
    role: 'Mobile Developer',
    department: 'Development',
    engagementModel: 'Full-Time',
    status: 'Active',
    projectName: 'Mobile Banking App',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    email: 'james.rodriguez@example.com',
    phone: '+1-555-333-4444',
    skills: ['React Native', 'Swift', 'Kotlin'],
    yearsOfExperience: 4,
    createdDate: '2024-01-28',
  },
  {
    id: '6',
    resourceId: 'RES-2023-012',
    resourceName: 'Lisa Anderson',
    role: 'Frontend Developer',
    department: 'Development',
    engagementModel: 'Contract',
    status: 'Inactive',
    projectName: 'Corporate Website Redesign',
    startDate: '2023-03-01',
    endDate: '2023-11-30',
    email: 'lisa.anderson@example.com',
    phone: '+1-555-777-8888',
    skills: ['React', 'TypeScript', 'Tailwind'],
    yearsOfExperience: 3,
    remarks: 'Project completed successfully',
    createdDate: '2023-02-25',
  },
];

interface HireRenewalModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
  onNavigate?: (pageId: string, filters?: any[]) => void;
}

export default function HireRenewalModule({ initialFilters, onFiltersConsumed, onNavigate }: HireRenewalModuleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState<ResourceEngagement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [engagements, setEngagements] = useState<ResourceEngagement[]>(mockEngagements);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [backToProjectName, setBackToProjectName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
      // Capture project name for back navigation before consuming filters
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

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = engagements.length;
    const active = engagements.filter(e => e.status === 'Active').length;
    const inactive = engagements.filter(e => e.status === 'Inactive').length;
    const fullTime = engagements.filter(e => e.engagementModel === 'Full-Time').length;
    const contract = engagements.filter(e => e.engagementModel === 'Contract').length;
    const development = engagements.filter(e => e.department === 'Development').length;

    return [
      {
        label: 'Total Resources',
        value: total.toString(),
        icon: 'Users',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+3',
        trendDirection: 'up' as const,
      },
      {
        label: 'Active',
        value: active.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Inactive',
        value: inactive.toString(),
        icon: 'XCircle',
        bgColor: 'bg-neutral-50 dark:bg-neutral-800/30',
        iconColor: 'text-neutral-600 dark:text-neutral-400',
        trend: '-1',
        trendDirection: 'down' as const,
      },
      {
        label: 'Full-Time',
        value: fullTime.toString(),
        icon: 'Briefcase',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Contract',
        value: contract.toString(),
        icon: 'FileText',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Development',
        value: development.toString(),
        icon: 'Code',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
    ];
  }, [engagements]);

  // Filter and search logic
  const filteredEngagements = useMemo(() => {
    let filtered = [...engagements];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (engagement) =>
          engagement.resourceName.toLowerCase().includes(query) ||
          engagement.resourceId.toLowerCase().includes(query) ||
          engagement.projectName?.toLowerCase().includes(query) ||
          engagement.role.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.values && filter.values.length > 0) {
        filtered = filtered.filter((engagement) => {
          const engagementValue = engagement[filter.field as keyof ResourceEngagement];
          if (typeof engagementValue === 'string') {
            return filter.values.some(val => 
              engagementValue.toLowerCase().includes(val.toLowerCase())
            );
          }
          return filter.values.includes(String(engagementValue));
        });
      }
    });

    return filtered;
  }, [engagements, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredEngagements.length / itemsPerPage);
  const paginatedEngagements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEngagements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEngagements, currentPage, itemsPerPage]);

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

  const handleEditEngagement = (engagement: ResourceEngagement) => {
    setSelectedEngagement(engagement);
    setIsAddModalOpen(true);
  };

  const handleDeleteEngagement = (engagementId: string) => {
    if (confirm('Are you sure you want to delete this engagement?')) {
      setEngagements(engagements.filter(e => e.id !== engagementId));
    }
  };

  const handleSaveEngagement = () => {
    setIsAddModalOpen(false);
    setSelectedEngagement(null);
  };

  // Style helper functions
  const getStatusStyle = (status: 'Active' | 'Inactive') => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  const getEngagementModelStyle = (model: string) => {
    const styles: Record<string, string> = {
      'Full-Time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Part-Time': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Contract': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Consultant': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return styles[model] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };


  const handleBack = () => {
    if (backToProjectName && onNavigate) {
      onNavigate('projects', [{ field: 'projectName', value: backToProjectName, openDetail: true }]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <ListingHeader
        title="Resources"
        subtitle="Manage all hired resources (Active & Inactive) - Complete resource directory irrespective of status"
        moduleName="Resource Engagement"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsAdvancedSearchOpen(true)}
        onRefresh={() => console.log('Refresh')}
        exportOptions={{
          onExportCSV: () => console.log('Export CSV'),
          onExportExcel: () => console.log('Export Excel'),
          onExportPDF: () => console.log('Export PDF'),
        }}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={() => setIsAddModalOpen(true)}
        onBack={backToProjectName ? handleBack : undefined}
      />

      {/* Summary Widgets - Conditionally shown */}
      {showSummary && <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>}

      <AdvancedSearchPanel
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
        filterOptions={{
          'Engagement Model': ['Full-Time', 'Part-Time', 'Contract', 'Consultant'],
          'Project Name': [],
          'Resource Name': [],
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
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEngagements.map((engagement) => (
              <div
                key={engagement.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Status */}
                <div className={`h-1 ${ engagement.status === 'Active' ? 'bg-green-500' : 'bg-neutral-300'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <User className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{engagement.resourceId}</span>
                    </div>

                    {/* Action Menu */}
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === engagement.id ? null : engagement.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === engagement.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditEngagement(engagement);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteEngagement(engagement.id);
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

                  {/* Resource Name Title */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {engagement.resourceName}
                  </h3>
                  
                  {/* Role with Icon */}
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {engagement.resourceName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate">{engagement.role}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(engagement.status)}`}>
                      {engagement.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getEngagementModelStyle(engagement.engagementModel)}`}>
                      {engagement.engagementModel}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Compact Information Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Project Name */}
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Project</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{engagement.projectName || 'N/A'}</div>
                    </div>
                    
                    {/* Department */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Department</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{engagement.department}</div>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Experience</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{engagement.yearsOfExperience} years</div>
                    </div>
                    
                    {/* Start Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Start Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{engagement.startDate}</div>
                    </div>
                    
                    {/* End Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">End Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{engagement.endDate || 'Ongoing'}</div>
                    </div>
                    
                    {/* Skills */}
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Skills</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{engagement.skills.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedEngagements.map((engagement) => (
              <div
                key={engagement.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{engagement.resourceId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(engagement.status)}`}>
                        {engagement.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEngagementModelStyle(engagement.engagementModel)}`}>
                        {engagement.engagementModel}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-3">{engagement.resourceName} - {engagement.role}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Project</span>
                        <span className="text-neutral-900 dark:text-white">{engagement.projectName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Department</span>
                        <span className="text-neutral-900 dark:text-white">{engagement.department}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Experience</span>
                        <span className="text-neutral-900 dark:text-white">{engagement.yearsOfExperience} years</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">End Date</span>
                        <span className="text-neutral-900 dark:text-white font-medium">{engagement.endDate || 'Ongoing'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleEditEngagement(engagement)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEngagement(engagement.id)}
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
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Period
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
                  {paginatedEngagements.map((engagement) => (
                    <tr key={engagement.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            {engagement.resourceName}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{engagement.role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {engagement.projectName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {engagement.department}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getEngagementModelStyle(engagement.engagementModel)}`}>
                          {engagement.engagementModel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-neutral-900 dark:text-white">{engagement.startDate}</div>
                        <div className="text-neutral-500 dark:text-neutral-400">{engagement.endDate || 'Ongoing'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(engagement.status)}`}>
                          {engagement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleEditEngagement(engagement)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEngagement(engagement.id)}
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
            totalItems={filteredEngagements.length}
          />
        </div>
      </div>

      <HireRenewalEditSidePanel
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEngagement(null);
        }}
        engagement={selectedEngagement}
        onSave={handleSaveEngagement}
      />
    </div>
  );
}