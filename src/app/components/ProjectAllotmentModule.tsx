import { useState, useMemo } from 'react';
import {
  FolderCheck,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, SearchBar, Pagination } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';

// Resource Requirement interface
interface ResourceRequirement {
  id: string;
  role: string;
  skillSet: string[];
  experienceLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead';
  requiredCount: number;
  allocationType: 'Full-Time' | 'Part-Time';
  billable: boolean;
  estimatedCost: number;
}

// Project Intake interface
interface ProjectIntake {
  id: string;
  intakeId: string;
  leadId: string;
  clientName: string;
  projectName: string;
  projectType: 'Web' | 'Mobile' | 'Total';
  estimatedStartDate: string;
  estimatedEndDate: string;
  estimatedEffort: number;
  proposedBudget: number;
  salesNotes: string;
  priorityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskIndicator: 'Low' | 'Medium' | 'High';
  status: 'Pending Review' | 'Under Allocation' | 'Approved' | 'Rejected' | 'Sent Back';
  approvalStatus: 'Pending' | 'Level 1 Approved' | 'Level 2 Approved' | 'Fully Approved' | 'Rejected';
  resourceRequirements: ResourceRequirement[];
  approvedBy?: string;
  approvedDate?: string;
  createdDate: string;
  createdBy: string;
}

// Mock data
const mockIntakes: ProjectIntake[] = [
  {
    id: '1',
    intakeId: 'INT-2024-001',
    leadId: 'LEAD-2024-156',
    clientName: 'Acme Corporation',
    projectName: 'Enterprise CRM Platform',
    projectType: 'Web',
    estimatedStartDate: '2024-03-01',
    estimatedEndDate: '2024-09-30',
    estimatedEffort: 24,
    proposedBudget: 350000,
    salesNotes: 'High-priority client, existing relationship. Needs rapid deployment.',
    priorityLevel: 'Critical',
    riskIndicator: 'Medium',
    status: 'Pending Review',
    approvalStatus: 'Pending',
    resourceRequirements: [
      {
        id: 'RR-001',
        role: 'Backend Developer',
        skillSet: ['Node.js', 'PostgreSQL', 'AWS'],
        experienceLevel: 'Senior',
        requiredCount: 2,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 98000,
      },
      {
        id: 'RR-002',
        role: 'Frontend Developer',
        skillSet: ['React', 'TypeScript', 'Tailwind'],
        experienceLevel: 'Mid-Level',
        requiredCount: 2,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 72000,
      },
    ],
    createdDate: '2024-02-20',
    createdBy: 'Sales Team',
  },
  {
    id: '2',
    intakeId: 'INT-2024-002',
    leadId: 'LEAD-2024-178',
    clientName: 'TechStart Inc',
    projectName: 'Mobile Banking Application',
    projectType: 'Mobile',
    estimatedStartDate: '2024-03-15',
    estimatedEndDate: '2024-08-15',
    estimatedEffort: 18,
    proposedBudget: 280000,
    salesNotes: 'New client, competitive pricing required. Focus on quality.',
    priorityLevel: 'High',
    riskIndicator: 'Low',
    status: 'Under Allocation',
    approvalStatus: 'Level 1 Approved',
    resourceRequirements: [
      {
        id: 'RR-003',
        role: 'Mobile Developer',
        skillSet: ['React Native', 'iOS', 'Android'],
        experienceLevel: 'Senior',
        requiredCount: 2,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 70000,
      },
    ],
    createdDate: '2024-02-18',
    createdBy: 'Sales Team',
  },
  {
    id: '3',
    intakeId: 'INT-2024-003',
    leadId: 'LEAD-2024-192',
    clientName: 'Global Solutions Ltd',
    projectName: 'E-Commerce Platform Redesign',
    projectType: 'Total',
    estimatedStartDate: '2024-04-01',
    estimatedEndDate: '2024-10-31',
    estimatedEffort: 32,
    proposedBudget: 450000,
    salesNotes: 'Large-scale project, multi-platform requirements.',
    priorityLevel: 'High',
    riskIndicator: 'High',
    status: 'Approved',
    approvalStatus: 'Fully Approved',
    resourceRequirements: [
      {
        id: 'RR-005',
        role: 'Full Stack Developer',
        skillSet: ['React', 'Node.js', 'MongoDB'],
        experienceLevel: 'Lead',
        requiredCount: 1,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 98000,
      },
    ],
    approvedBy: 'Delivery Manager',
    approvedDate: '2024-02-22',
    createdDate: '2024-02-15',
    createdBy: 'Sales Team',
  },
  {
    id: '4',
    intakeId: 'INT-2024-004',
    leadId: 'LEAD-2024-201',
    clientName: 'Healthcare Systems Co',
    projectName: 'Patient Management Portal',
    projectType: 'Web',
    estimatedStartDate: '2024-03-20',
    estimatedEndDate: '2024-07-20',
    estimatedEffort: 14,
    proposedBudget: 210000,
    salesNotes: 'Healthcare domain, compliance requirements.',
    priorityLevel: 'Medium',
    riskIndicator: 'Medium',
    status: 'Rejected',
    approvalStatus: 'Rejected',
    resourceRequirements: [
      {
        id: 'RR-007',
        role: 'Backend Developer',
        skillSet: ['Python', 'Django', 'PostgreSQL'],
        experienceLevel: 'Senior',
        requiredCount: 1,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 56000,
      },
    ],
    createdDate: '2024-02-10',
    createdBy: 'Sales Team',
  },
  {
    id: '5',
    intakeId: 'INT-2024-005',
    leadId: 'LEAD-2024-215',
    clientName: 'FinTech Innovations',
    projectName: 'Investment Dashboard',
    projectType: 'Web',
    estimatedStartDate: '2024-04-10',
    estimatedEndDate: '2024-09-10',
    estimatedEffort: 20,
    proposedBudget: 320000,
    salesNotes: 'Financial sector, high security requirements.',
    priorityLevel: 'High',
    riskIndicator: 'High',
    status: 'Sent Back',
    approvalStatus: 'Pending',
    resourceRequirements: [
      {
        id: 'RR-008',
        role: 'Full Stack Developer',
        skillSet: ['React', 'Node.js', 'Security'],
        experienceLevel: 'Senior',
        requiredCount: 2,
        allocationType: 'Full-Time',
        billable: true,
        estimatedCost: 140000,
      },
    ],
    createdDate: '2024-02-12',
    createdBy: 'Sales Team',
  },
];

export default function ProjectAllotmentModule() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<ProjectIntake | null>(null);
  const [intakes, setIntakes] = useState<ProjectIntake[]>(mockIntakes);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = intakes.length;
    const pending = intakes.filter(i => i.status === 'Pending Review').length;
    const underAllocation = intakes.filter(i => i.status === 'Under Allocation').length;
    const approved = intakes.filter(i => i.status === 'Approved').length;
    const rejected = intakes.filter(i => i.status === 'Rejected').length;
    const highPriority = intakes.filter(i => i.priorityLevel === 'Critical' || i.priorityLevel === 'High').length;

    return [
      {
        label: 'Total Intakes',
        value: total.toString(),
        icon: 'FileText',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Pending Review',
        value: pending.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Under Allocation',
        value: underAllocation.toString(),
        icon: 'Users',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Approved',
        value: approved.toString(),
        icon: 'CheckCircle',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Rejected',
        value: rejected.toString(),
        icon: 'XCircle',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'High Priority',
        value: highPriority.toString(),
        icon: 'AlertTriangle',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
    ];
  }, [intakes]);

  // Filter and search logic
  const filteredIntakes = useMemo(() => {
    let filtered = [...intakes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (intake) =>
          intake.projectName.toLowerCase().includes(query) ||
          intake.intakeId.toLowerCase().includes(query) ||
          intake.clientName.toLowerCase().includes(query) ||
          intake.leadId.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((intake) => {
          const intakeValue = intake[filter.field as keyof ProjectIntake];
          if (typeof intakeValue === 'string') {
            return intakeValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return intakeValue === filter.value;
        });
      }
    });

    return filtered;
  }, [intakes, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredIntakes.length / itemsPerPage);
  const paginatedIntakes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIntakes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIntakes, currentPage, itemsPerPage]);

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

  const handleEditIntake = (intake: ProjectIntake) => {
    setSelectedIntake(intake);
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (intake: ProjectIntake) => {
    setSelectedIntake(intake);
    setIsDetailModalOpen(true);
  };

  const handleDeleteIntake = (intakeId: string) => {
    if (confirm('Are you sure you want to delete this intake?')) {
      setIntakes(intakes.filter(i => i.id !== intakeId));
    }
  };

  const handleSaveIntake = () => {
    setIsAddModalOpen(false);
    setSelectedIntake(null);
  };

  const handleApprove = (intakeId: string) => {
    setIntakes(intakes.map(i => 
      i.id === intakeId 
        ? { 
            ...i, 
            status: 'Approved' as const, 
            approvalStatus: 'Fully Approved' as const, 
            approvedBy: 'Current User', 
            approvedDate: new Date().toISOString().split('T')[0] 
          }
        : i
    ));
  };

  const handleReject = (intakeId: string) => {
    setIntakes(intakes.map(i => 
      i.id === intakeId 
        ? { ...i, status: 'Rejected' as const, approvalStatus: 'Rejected' as const }
        : i
    ));
  };

  // Get status styles
  const getStatusStyle = (status: ProjectIntake['status']) => {
    const styles = {
      'Pending Review': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Under Allocation': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Approved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Sent Back': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return styles[status];
  };

  const getPriorityStyle = (priority: ProjectIntake['priorityLevel']) => {
    const styles = {
      'Low': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      'Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[priority];
  };

  const getRiskStyle = (risk: ProjectIntake['riskIndicator']) => {
    const styles = {
      'Low': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[risk];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <PageHeader
        title="Project Allotment System"
        subtitle="Governance checkpoint between Sales closure and Project activation"
        primaryAction={
          <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Intake
          </PrimaryButton>
        }
        secondaryActions={
          <>
            <IconButton icon={RefreshCw} title="Refresh" onClick={() => {}} />
            <IconButton icon={Upload} title="Import" onClick={() => {}} />
            <IconButton icon={Download} title="Export" onClick={() => {}} />
            <IconButton icon={Printer} title="Print" onClick={() => {}} />
            <IconButton icon={BarChart3} title="Analytics" onClick={() => {}} />
          </>
        }
      />

      {/* Summary Widgets */}
      <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>

      {/* Search and View Controls */}
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
            placeholder="Search intakes..."
          />
          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={[
              { field: 'status', label: 'Status', type: 'select', options: ['Pending Review', 'Under Allocation', 'Approved', 'Rejected', 'Sent Back'] },
              { field: 'priorityLevel', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
              { field: 'riskIndicator', label: 'Risk', type: 'select', options: ['Low', 'Medium', 'High'] },
              { field: 'projectType', label: 'Project Type', type: 'select', options: ['Web', 'Mobile', 'Total'] },
              { field: 'clientName', label: 'Client Name', type: 'text' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedIntakes.map((intake) => (
              <div
                key={intake.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderCheck className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{intake.intakeId}</span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{intake.projectName}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{intake.clientName}</p>
                  </div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleViewDetails(intake)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditIntake(intake)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {intake.status === 'Pending Review' && (
                        <>
                          <button
                            onClick={() => handleApprove(intake.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(intake.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteIntake(intake.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Lead ID:</span>
                    <span className="text-neutral-900 dark:text-white">{intake.leadId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Type:</span>
                    <span className="text-neutral-900 dark:text-white">{intake.projectType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Start Date:</span>
                    <span className="text-neutral-900 dark:text-white">{intake.estimatedStartDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Budget:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">${(intake.proposedBudget / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Resources:</span>
                    <span className="text-neutral-900 dark:text-white">{intake.resourceRequirements.reduce((sum, r) => sum + r.requiredCount, 0)} roles</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium w-full justify-center ${getStatusStyle(intake.status)}`}>
                    {intake.status}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium justify-center ${getPriorityStyle(intake.priorityLevel)}`}>
                      {intake.priorityLevel}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium justify-center ${getRiskStyle(intake.riskIndicator)}`}>
                      Risk: {intake.riskIndicator}
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
            {paginatedIntakes.map((intake) => (
              <div
                key={intake.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{intake.intakeId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(intake.status)}`}>
                        {intake.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityStyle(intake.priorityLevel)}`}>
                        {intake.priorityLevel}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRiskStyle(intake.riskIndicator)}`}>
                        Risk: {intake.riskIndicator}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{intake.projectName}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{intake.salesNotes}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Client</span>
                        <span className="text-neutral-900 dark:text-white">{intake.clientName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Type</span>
                        <span className="text-neutral-900 dark:text-white">{intake.projectType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Start Date</span>
                        <span className="text-neutral-900 dark:text-white">{intake.estimatedStartDate}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Budget</span>
                        <span className="text-neutral-900 dark:text-white font-medium">${(intake.proposedBudget / 1000).toFixed(0)}K</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Resources</span>
                        <span className="text-neutral-900 dark:text-white">{intake.resourceRequirements.reduce((sum, r) => sum + r.requiredCount, 0)} roles</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleViewDetails(intake)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditIntake(intake)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {intake.status === 'Pending Review' && (
                        <>
                          <button
                            onClick={() => handleApprove(intake.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(intake.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteIntake(intake.id)}
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Budget
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
                  {paginatedIntakes.map((intake) => (
                    <tr key={intake.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">{intake.projectName}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{intake.intakeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {intake.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {intake.projectType}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {intake.estimatedStartDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        ${(intake.proposedBudget / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(intake.status)}`}>
                            {intake.status}
                          </span>
                          <div className="flex gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPriorityStyle(intake.priorityLevel)}`}>
                              {intake.priorityLevel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleViewDetails(intake)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditIntake(intake)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            {intake.status === 'Pending Review' && (
                              <>
                                <button
                                  onClick={() => handleApprove(intake.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-green-600"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(intake.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteIntake(intake.id)}
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
            totalItems={filteredIntakes.length}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedIntake(null);
        }}
        title={selectedIntake ? 'Edit Project Intake' : 'Create Project Intake'}
      >
        <FormSection title="Intake Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <FormLabel required>Linked Lead ID</FormLabel>
              <FormInput placeholder="e.g., LEAD-2024-001" defaultValue={selectedIntake?.leadId} />
            </FormField>
            <FormField>
              <FormLabel required>Client Name</FormLabel>
              <FormInput placeholder="Enter client name" defaultValue={selectedIntake?.clientName} />
            </FormField>
            <FormField className="col-span-2">
              <FormLabel required>Project Name</FormLabel>
              <FormInput placeholder="Enter project name" defaultValue={selectedIntake?.projectName} />
            </FormField>
            <FormField>
              <FormLabel required>Project Type</FormLabel>
              <FormSelect defaultValue={selectedIntake?.projectType}>
                <option value="">Select type</option>
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="Total">Total (Web + Mobile)</option>
              </FormSelect>
            </FormField>
            <FormField>
              <FormLabel required>Priority Level</FormLabel>
              <FormSelect defaultValue={selectedIntake?.priorityLevel}>
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </FormSelect>
            </FormField>
            <FormField>
              <FormLabel required>Estimated Start Date</FormLabel>
              <FormInput type="date" defaultValue={selectedIntake?.estimatedStartDate} />
            </FormField>
            <FormField>
              <FormLabel required>Estimated End Date</FormLabel>
              <FormInput type="date" defaultValue={selectedIntake?.estimatedEndDate} />
            </FormField>
            <FormField>
              <FormLabel required>Estimated Effort (PM)</FormLabel>
              <FormInput type="number" placeholder="Person-months" defaultValue={selectedIntake?.estimatedEffort} />
            </FormField>
            <FormField>
              <FormLabel required>Proposed Budget ($)</FormLabel>
              <FormInput type="number" placeholder="Enter budget" defaultValue={selectedIntake?.proposedBudget} />
            </FormField>
            <FormField>
              <FormLabel required>Risk Indicator</FormLabel>
              <FormSelect defaultValue={selectedIntake?.riskIndicator}>
                <option value="">Select risk</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </FormSelect>
            </FormField>
            <FormField className="col-span-2">
              <FormLabel>Sales Notes</FormLabel>
              <FormTextarea rows={3} placeholder="Enter sales notes" defaultValue={selectedIntake?.salesNotes} />
            </FormField>
          </div>
        </FormSection>
        <FormFooter
          onCancel={() => {
            setIsAddModalOpen(false);
            setSelectedIntake(null);
          }}
          onSave={handleSaveIntake}
        />
      </FormModal>

      {/* Detail Modal */}
      <FormModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIntake(null);
        }}
        title="Project Intake Details"
      >
        {selectedIntake && (
          <>
            <FormSection title="Basic Information">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Intake ID</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedIntake.intakeId}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Lead ID</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedIntake.leadId}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Client</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedIntake.clientName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Project Type</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedIntake.projectType}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Budget</span>
                  <span className="text-neutral-900 dark:text-white font-medium">${selectedIntake.proposedBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Effort</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedIntake.estimatedEffort} PM</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(selectedIntake.status)}`}>
                    {selectedIntake.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Priority</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPriorityStyle(selectedIntake.priorityLevel)}`}>
                    {selectedIntake.priorityLevel}
                  </span>
                </div>
              </div>
            </FormSection>

            <FormSection title="Resource Requirements">
              <div className="space-y-3">
                {selectedIntake.resourceRequirements.map((req) => (
                  <div key={req.id} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{req.role}</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {req.experienceLevel} • {req.allocationType}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {req.requiredCount} {req.requiredCount > 1 ? 'resources' : 'resource'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {req.skillSet.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400">Estimated Cost</span>
                      <span className="font-medium text-neutral-900 dark:text-white">${req.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>
          </>
        )}
        <FormFooter
          onCancel={() => {
            setIsDetailModalOpen(false);
            setSelectedIntake(null);
          }}
          onSave={() => {
            setIsDetailModalOpen(false);
            setSelectedIntake(null);
          }}
          saveLabel="Close"
        />
      </FormModal>
    </div>
  );
}