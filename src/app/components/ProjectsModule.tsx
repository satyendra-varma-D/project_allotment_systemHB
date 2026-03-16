import { useState, useMemo } from 'react';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Mail, 
  Clock, 
  Package, 
  Cloud,
  Briefcase,
  User,
  Calendar,
  FileText,
  Settings,
  Users,
  Link2
} from 'lucide-react';
import { ListingHeader, type ListingViewMode, type ListingColumnConfig } from './hb/listing/ListingHeader';
import { SummaryWidgets } from './hb/listing/SummaryWidgets';
import { AdvancedSearchPanel, type FilterCondition } from './hb/listing/AdvancedSearchPanel';
import { FilterChips } from './hb/listing/FilterChips';
import { Pagination } from './hb/listing/Pagination';
import { ProjectDetailsModule } from './ProjectDetailsModule';
import { ProjectEditSidePanel } from './ProjectEditSidePanel';
import { ProjectEmailPreview } from './ProjectEmailPreview';
import { ProjectEmailComposer } from './ProjectEmailComposer';

// Project data interface based on spec
interface Project {
  id: string;
  projectId: string; // Auto-generated
  crmCode: string; // Auto-generated CRM code
  subject: string; // Editable subject
  projectName: string;
  clientName: string;
  projectType: 'Web' | 'Mobile' | 'Total';
  projectManager: string;
  deliveryManager: string;
  startDate: string;
  expectedEndDate: string;
  projectStatus: 'Created' | 'Draft' | 'Published' | 'On Hold' | 'Cancelled';
  overallProgress: number;
  commercialValue: number;
  domain?: string;
  industry?: string; // New industry field
  linkedLeadId?: string;
  riskIndicator?: 'Low' | 'Medium' | 'High';
  priorityLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  createdDate: string;
  modifiedDate: string;
  // New fields
  salesExecutive: string;
  techBA: string;
  confirmedDate: string;
  clientType: 'New' | 'Existing';
  projectTypeCategory: 'Fixed Cost' | 'Hire';
  technologyPlatform: string;
  // Agreement summary
  agreementSummary?: {
    assignedMembersCount: number; // Total agreements with assigned members
    attachedToProjectCount: number; // Total agreements attached to project
    assignedMembers: string[]; // List of unique assigned member names
  };
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: '1',
    projectId: 'PRJ-2024-001',
    crmCode: 'CRM-2024-001',
    subject: 'Enterprise CRM Platform',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    projectType: 'Web',
    projectManager: 'John Anderson',
    deliveryManager: 'Sarah Mitchell',
    startDate: '2024-01-15',
    expectedEndDate: '2024-07-15',
    projectStatus: 'Published',
    overallProgress: 65,
    commercialValue: 250000,
    domain: 'Technology',
    industry: 'IT Services',
    linkedLeadId: 'LD-2024-001',
    riskIndicator: 'Low',
    priorityLevel: 'High',
    createdDate: '2024-01-10',
    modifiedDate: '2024-02-20',
    salesExecutive: 'Alice Johnson',
    techBA: 'Bob Smith',
    confirmedDate: '2024-01-10',
    clientType: 'Existing',
    projectTypeCategory: 'Fixed Cost',
    technologyPlatform: 'AWS',
    agreementSummary: {
      assignedMembersCount: 3,
      attachedToProjectCount: 2,
      assignedMembers: ['John Anderson', 'Sarah Mitchell', 'Emily Chen'],
    },
  },
  {
    id: '2',
    projectId: 'PRJ-2024-002',
    crmCode: 'CRM-2024-002',
    subject: 'Mobile Banking App',
    projectName: 'Mobile Banking App',
    clientName: 'FinanceGlobal Bank',
    projectType: 'Mobile',
    projectManager: 'Emily Chen',
    deliveryManager: 'Michael Brown',
    startDate: '2024-02-01',
    expectedEndDate: '2024-08-01',
    projectStatus: 'Published',
    overallProgress: 45,
    commercialValue: 180000,
    domain: 'Finance',
    industry: 'Banking',
    linkedLeadId: 'LD-2024-005',
    riskIndicator: 'Medium',
    priorityLevel: 'High',
    createdDate: '2024-01-25',
    modifiedDate: '2024-02-18',
    salesExecutive: 'Charlie Brown',
    techBA: 'David Wilson',
    confirmedDate: '2024-01-25',
    clientType: 'New',
    projectTypeCategory: 'Hire',
    technologyPlatform: 'Azure',
  },
  {
    id: '3',
    projectId: 'PRJ-2024-003',
    crmCode: 'CRM-2024-003',
    subject: 'E-Commerce Platform Redesign',
    projectName: 'E-Commerce Platform Redesign',
    clientName: 'RetailMax Inc',
    projectType: 'Total',
    projectManager: 'David Wilson',
    deliveryManager: 'Sarah Mitchell',
    startDate: '2023-11-01',
    expectedEndDate: '2024-04-30',
    projectStatus: 'Published',
    overallProgress: 85,
    commercialValue: 320000,
    domain: 'Retail',
    industry: 'E-commerce',
    linkedLeadId: 'LD-2023-089',
    riskIndicator: 'Low',
    priorityLevel: 'Medium',
    createdDate: '2023-10-20',
    modifiedDate: '2024-02-22',
    salesExecutive: 'Eve Davis',
    techBA: 'Franklin Stone',
    confirmedDate: '2023-10-20',
    clientType: 'Existing',
    projectTypeCategory: 'Fixed Cost',
    technologyPlatform: 'Google Cloud',
  },
  {
    id: '4',
    projectId: 'PRJ-2023-045',
    crmCode: 'CRM-2023-045',
    subject: 'Healthcare Management System',
    projectName: 'Healthcare Management System',
    clientName: 'MediCare Solutions',
    projectType: 'Web',
    projectManager: 'Rachel Green',
    deliveryManager: 'Michael Brown',
    startDate: '2023-09-01',
    expectedEndDate: '2024-02-28',
    projectStatus: 'Draft',
    overallProgress: 100,
    commercialValue: 450000,
    domain: 'Healthcare',
    industry: 'Healthcare',
    linkedLeadId: 'LD-2023-034',
    riskIndicator: 'Low',
    priorityLevel: 'Critical',
    createdDate: '2023-08-15',
    modifiedDate: '2024-02-28',
    salesExecutive: 'Grace Lee',
    techBA: 'Henry Adams',
    confirmedDate: '2023-08-15',
    clientType: 'New',
    projectTypeCategory: 'Hire',
    technologyPlatform: 'IBM Cloud',
  },
  {
    id: '5',
    projectId: 'PRJ-2024-004',
    crmCode: 'CRM-2024-004',
    subject: 'Supply Chain Optimization',
    projectName: 'Supply Chain Optimization',
    clientName: 'LogisticsPro Corp',
    projectType: 'Web',
    projectManager: 'James Martinez',
    deliveryManager: 'Sarah Mitchell',
    startDate: '2024-01-20',
    expectedEndDate: '2024-06-20',
    projectStatus: 'On Hold',
    overallProgress: 30,
    commercialValue: 195000,
    domain: 'Logistics',
    industry: 'Logistics',
    linkedLeadId: 'LD-2024-012',
    riskIndicator: 'High',
    priorityLevel: 'Medium',
    createdDate: '2024-01-15',
    modifiedDate: '2024-02-10',
    salesExecutive: 'Ivy Taylor',
    techBA: 'Jack White',
    confirmedDate: '2024-01-15',
    clientType: 'Existing',
    projectTypeCategory: 'Fixed Cost',
    technologyPlatform: 'Oracle Cloud',
  },
  {
    id: '6',
    projectId: 'PRJ-2024-005',
    crmCode: 'CRM-2024-005',
    subject: 'Smart City Dashboard',
    projectName: 'Smart City Dashboard',
    clientName: 'Urban Development Authority',
    projectType: 'Total',
    projectManager: 'Lisa Anderson',
    deliveryManager: 'Michael Brown',
    startDate: '2024-03-01',
    expectedEndDate: '2024-12-31',
    projectStatus: 'Created',
    overallProgress: 15,
    commercialValue: 580000,
    domain: 'Government',
    industry: 'Government',
    linkedLeadId: 'LD-2024-018',
    riskIndicator: 'Medium',
    priorityLevel: 'Critical',
    createdDate: '2024-02-15',
    modifiedDate: '2024-02-25',
    salesExecutive: 'Katherine Johnson',
    techBA: 'Leo Black',
    confirmedDate: '2024-02-15',
    clientType: 'New',
    projectTypeCategory: 'Hire',
    technologyPlatform: 'Salesforce',
  },
];

export default function ProjectsModule() {
  const [viewMode, setViewMode] = useState<ListingViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Email preview state
  const [emailProject, setEmailProject] = useState<Project | null>(null);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailComposerTab, setEmailComposerTab] = useState<'account' | 'support' | 'project'>('project');

  // Active filters
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // Show summary toggle
  const [showSummary, setShowSummary] = useState(false);

  // Column selection for table view
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    project: true,
    client: true,
    type: true,
    salesExecutive: true,
    techBA: true,
    confirmedDate: true,
    clientType: true,
    projectTypeCategory: true,
    technologyPlatform: true,
    projectAllotment: true,
    projectStatus: true,
    paymentStatus: true,
  });

  // Table columns configuration
  const tableColumns: ListingColumnConfig[] = [
    { key: 'project', label: 'Project' },
    { key: 'client', label: 'Client' },
    { key: 'type', label: 'Type' },
    { key: 'salesExecutive', label: 'Sales Executive' },
    { key: 'techBA', label: 'Tech BA' },
    { key: 'confirmedDate', label: 'Confirmed Date' },
    { key: 'clientType', label: 'Client Type' },
    { key: 'projectTypeCategory', label: 'Project Category' },
    { key: 'technologyPlatform', label: 'Tech Platform' },
    { key: 'projectStatus', label: 'Status' },
  ];

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = projects.length;
    const published = projects.filter(p => p.projectStatus === 'Published').length;
    const draft = projects.filter(p => p.projectStatus === 'Draft').length;
    const onHold = projects.filter(p => p.projectStatus === 'On Hold').length;
    const totalValue = projects.reduce((sum, p) => sum + p.commercialValue, 0);
    const highRisk = projects.filter(p => p.riskIndicator === 'High').length;

    return [
      {
        label: 'Total Projects',
        value: total.toString(),
        icon: 'Briefcase',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+12',
        trendDirection: 'up' as const,
      },
      {
        label: 'Published Projects',
        value: published.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+8',
        trendDirection: 'up' as const,
      },
      {
        label: 'Draft',
        value: draft.toString(),
        icon: 'TrendingUp',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+15',
        trendDirection: 'up' as const,
      },
      {
        label: 'On Hold',
        value: onHold.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+3',
        trendDirection: 'up' as const,
      },
      {
        label: 'Total Value',
        value: `$${(totalValue / 1000).toFixed(0)}K`,
        icon: 'Activity',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+22',
        trendDirection: 'up' as const,
      },
      {
        label: 'High Risk',
        value: highRisk.toString(),
        icon: 'XCircle',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '-5',
        trendDirection: 'down' as const,
      },
    ];
  }, [projects]);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.projectName.toLowerCase().includes(query) ||
          project.projectId.toLowerCase().includes(query) ||
          project.clientName.toLowerCase().includes(query) ||
          project.projectManager.toLowerCase().includes(query)
      );
    }

    // Apply advanced filters
    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((project) => {
          const projectValue = project[filter.field as keyof Project];
          if (typeof projectValue === 'string') {
            return projectValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return projectValue === filter.value;
        });
      }
    });

    return filtered;
  }, [projects, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

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

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailView(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsAddModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleSaveProject = () => {
    // Mock save functionality
    setIsAddModalOpen(false);
    setSelectedProject(null);
  };

  const handleCloneProject = () => {
    if (!selectedProject) {
      alert('Please select a project to clone');
      return;
    }
    alert(`Cloning project: ${selectedProject.projectName}`);
    // In real implementation, create a copy of the selected project
  };

  const handleRefresh = () => {
    // Reload data
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting data...');
  };

  const handleEmailPreview = (project: Project) => {
    setEmailProject(project);
    setIsEmailPreviewOpen(true);
  };

  const handleEmailComposer = (project: Project) => {
    setEmailProject(project);
    setIsEmailComposerOpen(true);
  };

  // Get status styles
  const getStatusStyle = (status: Project['projectStatus']) => {
    const styles = {
      'Created': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Draft': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'On Hold': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status];
  };

  const getRiskStyle = (risk?: Project['riskIndicator']) => {
    if (!risk) return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    const styles = {
      'Low': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Medium': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[risk];
  };

  if (isDetailView && selectedProject) {
    return (
      <ProjectDetailsModule
        project={selectedProject}
        onBack={() => {
          setIsDetailView(false);
          setSelectedProject(null);
        }}
        onEdit={() => {
          setIsDetailView(false);
          setIsAddModalOpen(true);
        }}
        onAgreementUpdate={(summary) => {
          // Update the project in the projects list with the new agreement summary
          setProjects(prevProjects => 
            prevProjects.map(p => 
              p.id === selectedProject.id 
                ? { ...p, agreementSummary: summary }
                : p
            )
          );
          // Also update the selected project
          setSelectedProject(prev => prev ? { ...prev, agreementSummary: summary } : null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <ListingHeader
        title="Project Management"
        subtitle="Manage delivery operations, team allocation, and commercial tracking"
        moduleName="Project"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        columns={tableColumns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onFilterClick={() => setIsAdvancedSearchOpen(true)}
        onRefresh={handleRefresh}
        exportOptions={{
          onExportCSV: () => console.log('Export CSV'),
          onExportExcel: () => console.log('Export Excel'),
          onExportPDF: () => console.log('Export PDF'),
        }}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onClone={handleCloneProject}
        cloneDisabled={!selectedProject}
        cloneTooltip={selectedProject ? `Clone ${selectedProject.projectName}` : 'Select a project to clone'}
        onAdd={() => setIsAddModalOpen(true)}
      />

      {/* Summary Widgets - Conditionally shown */}
      {showSummary && <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>}

      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'projectStatus', label: 'Project Status', type: 'select', options: ['Created', 'Draft', 'Published', 'On Hold', 'Cancelled'] },
              { field: 'projectType', label: 'Project Type', type: 'select', options: ['Web', 'Mobile', 'Total'] },
              { field: 'projectManager', label: 'Project Manager', type: 'text' },
              { field: 'clientName', label: 'Client Name', type: 'text' },
              { field: 'riskIndicator', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High'] },
              { field: 'startDate', label: 'Start Date', type: 'date' },
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
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent */}
                <div className={`h-1 ${
                  project.projectStatus === 'Published' ? 'bg-green-500' :
                  project.projectStatus === 'Draft' ? 'bg-neutral-400' :
                  project.projectStatus === 'On Hold' ? 'bg-orange-500' :
                  project.projectStatus === 'Cancelled' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      <Briefcase className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{project.projectId}</span>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === project.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleViewProject(project);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                if (project.projectStatus === 'Published') {
                                  handleEmailPreview(project);
                                  setOpenMenuId(null);
                                }
                              }}
                              disabled={project.projectStatus !== 'Published'}
                              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2.5 transition-colors ${
                                project.projectStatus === 'Published'
                                  ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                  : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Send Email
                            </button>
                            <button
                              onClick={() => {
                                alert('Milestones / Renewals');
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Milestones / Renewals
                            </button>
                            <button
                              onClick={() => {
                                alert('Addons / Supports');
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Package className="w-3.5 h-3.5" />
                              Addons / Supports
                            </button>
                            <button
                              onClick={() => {
                                alert('AWS Settings');
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Cloud className="w-3.5 h-3.5" />
                              AWS
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {project.projectName}
                  </h3>
                  
                  {/* Client Name with Icon */}
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {project.clientName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate">{project.clientName}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(project.projectStatus)}`}>
                      {project.projectStatus}
                    </span>
                    {project.riskIndicator && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getRiskStyle(project.riskIndicator)}`}>
                        {project.riskIndicator} Risk
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Compact Information Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Sales Executive */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Sales Executive</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{project.salesExecutive}</div>
                    </div>
                    
                    {/* Tech BA */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Tech SA</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{project.techBA}</div>
                    </div>
                    
                    {/* Confirmed Date */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Confirmed Date</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{project.confirmedDate}</div>
                    </div>
                    
                    {/* Client Type */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Client Type</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{project.clientType}</div>
                    </div>
                    
                    {/* Project Type */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Project Type</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{project.projectTypeCategory}</div>
                    </div>
                    
                    {/* Tech Platform */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Tech Platform</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{project.technologyPlatform}</div>
                    </div>
                  </div>


                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Colored Left Border Accent */}
                <div className="flex">
                  <div className={`w-1.5 flex-shrink-0 ${
                    project.projectStatus === 'Published' ? 'bg-green-500' :
                    project.projectStatus === 'Draft' ? 'bg-neutral-400' :
                    project.projectStatus === 'On Hold' ? 'bg-orange-500' :
                    project.projectStatus === 'Cancelled' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-5">
                      {/* Left Section: Header Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Project ID Badge */}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg">
                            <Briefcase className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{project.projectId}</span>
                          </div>
                          
                          {/* Status Badges */}
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusStyle(project.projectStatus)}`}>
                            {project.projectStatus}
                          </span>
                          {project.riskIndicator && (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${getRiskStyle(project.riskIndicator)}`}>
                              {project.riskIndicator} Risk
                            </span>
                          )}
                        </div>
                        
                        {/* Project Name */}
                        <h3 className="font-semibold text-xl text-neutral-900 dark:text-white mb-3 line-clamp-1">
                          {project.projectName}
                        </h3>
                        
                        {/* Client with Avatar */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {project.clientName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{project.clientName}</span>
                        </div>
                      </div>

                      {/* Action Menu */}
                      <div className="relative ml-4">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        </button>
                        {openMenuId === project.id && (
                          <div className="absolute right-0 top-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-44 z-10">
                            <button
                              onClick={() => {
                                handleViewProject(project);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-3 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleEditProject(project);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-3 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit Project
                            </button>
                            <div className="my-1 border-t border-neutral-200 dark:border-neutral-700" />
                            <button
                              onClick={() => {
                                handleDeleteProject(project.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/30 flex items-center gap-3 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 mb-5" />

                    {/* Information Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* Sales Executive */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Sales Executive</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{project.salesExecutive}</div>
                        </div>
                      </div>

                      {/* Tech BA */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Tech BA</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{project.techBA}</div>
                        </div>
                      </div>

                      {/* Confirmed Date */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Confirmed Date</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{project.confirmedDate}</div>
                        </div>
                      </div>

                      {/* Client Type */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Client Type</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{project.clientType}</div>
                        </div>
                      </div>

                      {/* Project Type */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Project Type</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{project.projectTypeCategory}</div>
                        </div>
                      </div>

                      {/* Tech Platform */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium mb-0.5">Tech Platform</div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{project.technologyPlatform}</div>
                        </div>
                      </div>
                    </div>


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
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Sales Executive
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Tech SA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Confirmed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Client Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Tech Platform
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">{project.projectName}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{project.projectId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {project.clientName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(project.projectStatus)}`}>
                            {project.projectStatus}
                          </span>
                          {project.riskIndicator && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getRiskStyle(project.riskIndicator)}`}>
                              {project.riskIndicator} Risk
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {project.salesExecutive}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {project.techBA}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {project.confirmedDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">{project.clientType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">{project.projectTypeCategory}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {project.technologyPlatform}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleViewProject(project)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditProject(project)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
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

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredProjects.length}
          />
        </div>
      </div>

      {/* Add/Edit Side Panel */}
      <ProjectEditSidePanel
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject ? {
          crmId: selectedProject.crmCode,
          subject: selectedProject.subject,
          projectCode: selectedProject.projectId,
          projectName: selectedProject.projectName,
          projectType: selectedProject.projectTypeCategory,
          businessType: selectedProject.clientType,
          domain: selectedProject.domain || 'Digital Experience',
          industry: selectedProject.industry || 'Technology',
        } : null}
        onSave={handleSaveProject}
      />

      {/* Email Preview */}
      <ProjectEmailPreview
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        onOpenComposer={(tab) => {
          setEmailComposerTab(tab);
          setIsEmailComposerOpen(true);
        }}
        project={emailProject!}
      />

      {/* Email Composer */}
      <ProjectEmailComposer
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        project={emailProject!}
        initialTab={emailComposerTab}
      />
    </div>
  );
}