import { useState } from 'react';
import {
  Plus,
  Upload,
  Download,
  Printer,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  User,
  Briefcase,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Target,
  TrendingDown,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';
import { PrimaryButton, IconButton, SecondaryButton } from './hb/listing';
import ImageViewerModal from './ImageViewerModal';

// Lead data interface based on spec
interface Lead {
  id: string;
  leadId: string; // Auto-generated Lead ID
  clientName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  salesOwner: string;
  leadSource: string;
  industry: string;
  location: string;
  opportunityValue: number;
  expectedClosureDate: string;
  currentStage: 'New Lead' | 'Qualified' | 'Proposal Shared' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
  status: 'Open' | 'Closed-Won' | 'Closed-Lost';
  projectType?: string;
  functionalRequirements?: string;
  technicalRequirements?: string;
  estimatedTimeline?: string;
  estimatedBudget?: string;
  competitorInfo?: string;
  budgetConfirmed?: boolean;
  decisionMakerIdentified?: boolean;
  timelineConfirmed?: boolean;
  leadScore?: number;
  riskIndicator?: 'Low' | 'Medium' | 'High';
  createdDate: string;
  modifiedDate: string;
}

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: '1',
    leadId: 'LD-2024-001',
    clientName: 'TechCorp Solutions',
    contactPerson: 'John Anderson',
    contactEmail: 'john.anderson@techcorp.com',
    contactPhone: '+1 (555) 100-2000',
    salesOwner: 'Sarah Mitchell',
    leadSource: 'Website Inquiry',
    industry: 'Technology',
    location: 'San Francisco, CA',
    opportunityValue: 250000,
    expectedClosureDate: '2024-03-15',
    currentStage: 'Proposal Shared',
    status: 'Open',
    projectType: 'Web Application',
    functionalRequirements: 'Enterprise CRM system with custom workflow automation',
    estimatedTimeline: '6 months',
    estimatedBudget: '$250,000',
    budgetConfirmed: true,
    decisionMakerIdentified: true,
    timelineConfirmed: true,
    leadScore: 85,
    riskIndicator: 'Low',
    createdDate: '2024-01-10',
    modifiedDate: '2024-02-18',
  },
  {
    id: '2',
    leadId: 'LD-2024-002',
    clientName: 'Global Finance Inc',
    contactPerson: 'Maria Rodriguez',
    contactEmail: 'maria.r@globalfinance.com',
    contactPhone: '+1 (555) 200-3000',
    salesOwner: 'Michael Chen',
    leadSource: 'Referral',
    industry: 'Finance',
    location: 'New York, NY',
    opportunityValue: 500000,
    expectedClosureDate: '2024-04-20',
    currentStage: 'Negotiation',
    status: 'Open',
    projectType: 'Mobile + Web',
    functionalRequirements: 'Banking application with real-time transaction processing',
    estimatedTimeline: '9 months',
    estimatedBudget: '$500,000',
    budgetConfirmed: true,
    decisionMakerIdentified: true,
    timelineConfirmed: false,
    leadScore: 92,
    riskIndicator: 'Low',
    createdDate: '2024-01-15',
    modifiedDate: '2024-02-20',
  },
  {
    id: '3',
    leadId: 'LD-2024-003',
    clientName: 'HealthPlus Medical',
    contactPerson: 'Dr. James Wilson',
    contactEmail: 'j.wilson@healthplus.com',
    contactPhone: '+1 (555) 300-4000',
    salesOwner: 'Sarah Mitchell',
    leadSource: 'Trade Show',
    industry: 'Healthcare',
    location: 'Boston, MA',
    opportunityValue: 180000,
    expectedClosureDate: '2024-03-30',
    currentStage: 'Qualified',
    status: 'Open',
    projectType: 'Web Application',
    functionalRequirements: 'Patient management system with telemedicine features',
    estimatedTimeline: '5 months',
    estimatedBudget: '$180,000',
    budgetConfirmed: false,
    decisionMakerIdentified: true,
    timelineConfirmed: true,
    leadScore: 68,
    riskIndicator: 'Medium',
    createdDate: '2024-02-01',
    modifiedDate: '2024-02-22',
  },
  {
    id: '4',
    leadId: 'LD-2024-004',
    clientName: 'RetailMart Chain',
    contactPerson: 'Lisa Thompson',
    contactEmail: 'l.thompson@retailmart.com',
    contactPhone: '+1 (555) 400-5000',
    salesOwner: 'David Park',
    leadSource: 'Cold Call',
    industry: 'Retail',
    location: 'Chicago, IL',
    opportunityValue: 120000,
    expectedClosureDate: '2024-05-10',
    currentStage: 'New Lead',
    status: 'Open',
    projectType: 'Mobile Application',
    functionalRequirements: 'Inventory management and POS system',
    estimatedTimeline: '4 months',
    estimatedBudget: '$120,000',
    budgetConfirmed: false,
    decisionMakerIdentified: false,
    timelineConfirmed: false,
    leadScore: 45,
    riskIndicator: 'High',
    createdDate: '2024-02-10',
    modifiedDate: '2024-02-15',
  },
  {
    id: '5',
    leadId: 'LD-2024-005',
    clientName: 'EduTech Learning',
    contactPerson: 'Robert Chen',
    contactEmail: 'r.chen@edutech.com',
    contactPhone: '+1 (555) 500-6000',
    salesOwner: 'Michael Chen',
    leadSource: 'LinkedIn',
    industry: 'Education',
    location: 'Austin, TX',
    opportunityValue: 95000,
    expectedClosureDate: '2024-06-15',
    currentStage: 'Closed-Lost',
    status: 'Closed-Lost',
    projectType: 'Web Application',
    functionalRequirements: 'E-learning platform with video streaming',
    estimatedTimeline: '3 months',
    estimatedBudget: '$95,000',
    budgetConfirmed: true,
    decisionMakerIdentified: true,
    timelineConfirmed: true,
    leadScore: 72,
    riskIndicator: 'Low',
    createdDate: '2024-01-20',
    modifiedDate: '2024-02-25',
  },
  {
    id: '6',
    leadId: 'LD-2024-006',
    clientName: 'AutoParts Direct',
    contactPerson: 'Emily Davis',
    contactEmail: 'e.davis@autoparts.com',
    contactPhone: '+1 (555) 600-7000',
    salesOwner: 'Sarah Mitchell',
    leadSource: 'Email Campaign',
    industry: 'Automotive',
    location: 'Detroit, MI',
    opportunityValue: 340000,
    expectedClosureDate: '2024-02-28',
    currentStage: 'Closed-Won',
    status: 'Closed-Won',
    projectType: 'Mobile + Web',
    functionalRequirements: 'E-commerce platform with supplier integration',
    estimatedTimeline: '7 months',
    estimatedBudget: '$340,000',
    budgetConfirmed: true,
    decisionMakerIdentified: true,
    timelineConfirmed: true,
    leadScore: 98,
    riskIndicator: 'Low',
    createdDate: '2023-12-15',
    modifiedDate: '2024-02-20',
  },
];

export default function LeadsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [previousViewMode, setPreviousViewMode] = useState<ViewMode>('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Action menu state
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Summary widgets toggle state (default closed)
  const [showSummary, setShowSummary] = useState(false);

  // Filter options for the AdvancedSearchPanel
  const filterOptions = {
    'Stage': ['New Lead', 'Qualified', 'Proposal Shared', 'Negotiation', 'Closed-Won', 'Closed-Lost'],
    'Status': ['Open', 'Closed-Won', 'Closed-Lost'],
    'Industry': ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Automotive'],
    'Lead Source': ['Website Inquiry', 'Referral', 'Trade Show', 'Cold Call', 'LinkedIn', 'Email Campaign'],
    'Sales Owner': ['Sarah Mitchell', 'Michael Chen', 'David Park'],
    'Risk Indicator': ['Low', 'Medium', 'High'],
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Lead>>({
    clientName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    industry: '',
    location: '',
    leadSource: '',
    salesOwner: '',
    opportunityValue: 0,
    expectedClosureDate: '',
    currentStage: 'New Lead',
    status: 'Open',
  });

  // Filter leads
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.leadId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply advanced filters
    const matchesFilters = filters.every(filter => {
      if (filter.field === 'Stage') {
        return filter.values.includes(lead.currentStage);
      } else if (filter.field === 'Status') {
        return filter.values.includes(lead.status);
      } else if (filter.field === 'Industry') {
        return filter.values.includes(lead.industry);
      } else if (filter.field === 'Lead Source') {
        return filter.values.includes(lead.leadSource);
      } else if (filter.field === 'Sales Owner') {
        return filter.values.includes(lead.salesOwner);
      } else if (filter.field === 'Risk Indicator') {
        return filter.values.includes(lead.riskIndicator || '');
      }
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  // Calculate paginated data
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Stage badge helper
  const getStageBadge = (stage: string) => {
    const stageConfig = {
      'New Lead': { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-400', icon: Target },
      'Qualified': { bg: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-400', icon: CheckCircle2 },
      'Proposal Shared': { bg: 'bg-cyan-100 dark:bg-cyan-950', text: 'text-cyan-700 dark:text-cyan-400', icon: FileText },
      'Negotiation': { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-400', icon: Users },
      'Closed-Won': { bg: 'bg-success-100 dark:bg-success-950', text: 'text-success-700 dark:text-success-400', icon: CheckCircle2 },
      'Closed-Lost': { bg: 'bg-error-100 dark:bg-error-950', text: 'text-error-700 dark:text-error-400', icon: XCircle },
    };
    return stageConfig[stage as keyof typeof stageConfig] || stageConfig['New Lead'];
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Open': { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-400' },
      'Closed-Won': { bg: 'bg-success-100 dark:bg-success-950', text: 'text-success-700 dark:text-success-400' },
      'Closed-Lost': { bg: 'bg-error-100 dark:bg-error-950', text: 'text-error-700 dark:text-error-400' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.Open;
  };

  // Risk badge helper
  const getRiskBadge = (risk?: string) => {
    if (!risk) return { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-400' };
    const riskConfig = {
      'Low': { bg: 'bg-success-100 dark:bg-success-950', text: 'text-success-700 dark:text-success-400' },
      'Medium': { bg: 'bg-warning-100 dark:bg-warning-950', text: 'text-warning-700 dark:text-warning-400' },
      'High': { bg: 'bg-error-100 dark:bg-error-950', text: 'text-error-700 dark:text-error-400' },
    };
    return riskConfig[risk as keyof typeof riskConfig];
  };

  // Calculate summary statistics
  const stats = {
    total: filteredLeads.length,
    open: filteredLeads.filter(l => l.status === 'Open').length,
    closedWon: filteredLeads.filter(l => l.status === 'Closed-Won').length,
    closedLost: filteredLeads.filter(l => l.status === 'Closed-Lost').length,
    totalValue: filteredLeads.reduce((sum, l) => sum + l.opportunityValue, 0),
    avgLeadScore: Math.round(filteredLeads.reduce((sum, l) => sum + (l.leadScore || 0), 0) / filteredLeads.length),
  };

  const summaryWidgets = [
    { 
      label: 'Total Leads', 
      value: stats.total.toString(), 
      icon: Target,
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    { 
      label: 'Open Leads', 
      value: stats.open.toString(), 
      icon: TrendingUp,
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    { 
      label: 'Closed-Won', 
      value: stats.closedWon.toString(), 
      icon: CheckCircle2,
      bgColor: 'bg-success-50 dark:bg-success-950/30',
      iconColor: 'text-success-600 dark:text-success-400',
    },
    { 
      label: 'Total Value', 
      value: `$${(stats.totalValue / 1000).toFixed(0)}K`, 
      icon: DollarSign,
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    { 
      label: 'Avg Lead Score', 
      value: `${stats.avgLeadScore}/100`, 
      icon: BarChart3,
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    { 
      label: 'Closed-Lost', 
      value: stats.closedLost.toString(), 
      icon: XCircle,
      bgColor: 'bg-error-50 dark:bg-error-950/30',
      iconColor: 'text-error-600 dark:text-error-400',
    },
  ];

  const handleAddLead = () => {
    setFormData({
      clientName: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      industry: '',
      location: '',
      leadSource: '',
      salesOwner: '',
      opportunityValue: 0,
      expectedClosureDate: '',
      currentStage: 'New Lead',
      status: 'Open',
    });
    setShowAddModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData(lead);
    setShowEditModal(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setPreviousViewMode(viewMode);
    setShowDetailView(true);
  };

  const handleDeleteLead = (id: string) => {
    console.log('Delete lead:', id);
    // Implement delete logic
  };

  const handleConvertToProject = (lead: Lead) => {
    if (lead.status === 'Closed-Won') {
      console.log('Convert to project:', lead);
      // Implement conversion logic
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setViewMode(previousViewMode);
    setSelectedLead(null);
  };

  // Action menu items
  const getActionMenuItems = (lead: Lead) => {
    const items = [
      {
        icon: Eye,
        label: 'View Details',
        onClick: () => handleViewLead(lead),
      },
      {
        icon: Edit2,
        label: 'Edit Lead',
        onClick: () => handleEditLead(lead),
      },
    ];

    if (lead.status === 'Closed-Won') {
      items.push({
        icon: Briefcase,
        label: 'Convert to Project',
        onClick: () => handleConvertToProject(lead),
      });
    }

    items.push({
      icon: Trash2,
      label: 'Delete Lead',
      onClick: () => handleDeleteLead(lead.id),
      className: 'text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950',
    });

    return items;
  };

  // Detail View Component
  if (showDetailView && selectedLead) {
    return (
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <button
            onClick={handleBackToList}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Leads
          </button>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">{selectedLead.leadId}</span>
        </nav>

        {/* Detail Header */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl text-neutral-900 dark:text-white">{selectedLead.clientName}</h1>
                <span className={`px-3 py-1 rounded-full text-xs ${getStageBadge(selectedLead.currentStage).bg} ${getStageBadge(selectedLead.currentStage).text}`}>
                  {selectedLead.currentStage}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(selectedLead.status).bg} ${getStatusBadge(selectedLead.status).text}`}>
                  {selectedLead.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Lead ID: {selectedLead.leadId} • Created: {new Date(selectedLead.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SecondaryButton
                onClick={() => handleEditLead(selectedLead)}
                icon={Edit2}
              >
                Edit Lead
              </SecondaryButton>
              {selectedLead.status === 'Closed-Won' && (
                <PrimaryButton
                  onClick={() => handleConvertToProject(selectedLead)}
                  icon={Briefcase}
                >
                  Convert to Project
                </PrimaryButton>
              )}
            </div>
          </div>

          {/* Tabs for Detail View */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 -mx-6 px-6">
            <div className="flex gap-6 overflow-x-auto">
              {['Basic Information', 'Requirement Details', 'Activity & Communication', 'Documents', 'Qualification & Scoring'].map((tab, idx) => (
                <button
                  key={tab}
                  className={`py-4 px-2 text-sm border-b-2 whitespace-nowrap transition-colors ${
                    idx === 0
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content - Basic Information (Default Tab) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Client Organization</label>
              <div className="text-sm text-neutral-900 dark:text-white">{selectedLead.clientName}</div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Contact Person</label>
              <div className="text-sm text-neutral-900 dark:text-white">{selectedLead.contactPerson}</div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Email</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                {selectedLead.contactEmail}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Phone</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                {selectedLead.contactPhone}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Industry</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-400" />
                {selectedLead.industry}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Location</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                {selectedLead.location}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lead Source</label>
              <div className="text-sm text-neutral-900 dark:text-white">{selectedLead.leadSource}</div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lead Owner</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                {selectedLead.salesOwner}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Opportunity Value</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-neutral-400" />
                ${selectedLead.opportunityValue.toLocaleString()}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Expected Closure Date</label>
              <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                {new Date(selectedLead.expectedClosureDate).toLocaleDateString()}
              </div>
            </div>

            {selectedLead.projectType && (
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Project Type</label>
                <div className="text-sm text-neutral-900 dark:text-white">{selectedLead.projectType}</div>
              </div>
            )}

            {selectedLead.estimatedTimeline && (
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Estimated Timeline</label>
                <div className="text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  {selectedLead.estimatedTimeline}
                </div>
              </div>
            )}

            {selectedLead.leadScore !== undefined && (
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lead Score</label>
                <div className="text-sm text-neutral-900 dark:text-white">{selectedLead.leadScore}/100</div>
              </div>
            )}

            {selectedLead.riskIndicator && (
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Risk Indicator</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRiskBadge(selectedLead.riskIndicator).bg} ${getRiskBadge(selectedLead.riskIndicator).text}`}>
                  {selectedLead.riskIndicator}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Listing View
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <ListingHeader
        title="Leads Management"
        subtitle="Manage sales opportunities and track lead progress"
        moduleName="Lead"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        onRefresh={() => {}}
        onExport={() => {}}
        showSummary={showSummary}
        onSummaryToggle={() => setShowSummary(!showSummary)}
        onAdd={handleAddLead}
      />

      {/* Summary Widgets - Conditionally shown */}
      {showSummary && <SummaryWidgets
        widgets={summaryWidgets}
      />}

      {/* Filter Chips */}
      {filters.length > 0 && (
        <FilterChips
          filters={filters}
          onRemoveFilter={(index) => {
            setFilters(filters.filter((_, i) => i !== index));
          }}
          onClearAll={() => setFilters([])}
        />
      )}

      {/* Advanced Search Panel */}
      <AdvancedSearchPanel
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        filterOptions={filterOptions}
        activeFilters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setShowAdvancedSearch(false);
        }}
      />

      {/* Content Area */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {paginatedLeads.map((lead) => {
              const stageBadge = getStageBadge(lead.currentStage);
              const StatusIcon = stageBadge.icon;
              
              return (
                <div
                  key={lead.id}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:shadow-md transition-shadow relative group"
                >
                  {/* Action Menu */}
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openActionMenuId === lead.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-10">
                          {getActionMenuItems(lead).map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  item.onClick();
                                  setOpenActionMenuId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                                  item.className || 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                              >
                                <ItemIcon className="w-4 h-4" />
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-lg ${stageBadge.bg} flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${stageBadge.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {lead.clientName}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {lead.leadId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{lead.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{lead.industry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">${lead.opportunityValue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <span className={`px-2 py-1 rounded text-xs ${stageBadge.bg} ${stageBadge.text}`}>
                        {lead.currentStage}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(lead.status).bg} ${getStatusBadge(lead.status).text}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paginatedLeads.map((lead) => {
              const stageBadge = getStageBadge(lead.currentStage);
              const StatusIcon = stageBadge.icon;
              
              return (
                <div
                  key={lead.id}
                  className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors relative group"
                >
                  {/* Action Menu */}
                  <div className="absolute top-6 right-6">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openActionMenuId === lead.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-10">
                          {getActionMenuItems(lead).map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  item.onClick();
                                  setOpenActionMenuId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                                  item.className || 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                              >
                                <ItemIcon className="w-4 h-4" />
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pr-12">
                    <div className={`w-12 h-12 rounded-lg ${stageBadge.bg} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-6 h-6 ${stageBadge.text}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-medium text-neutral-900 dark:text-white">
                            {lead.clientName}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs ${stageBadge.bg} ${stageBadge.text}`}>
                            {lead.currentStage}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(lead.status).bg} ${getStatusBadge(lead.status).text}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {lead.leadId} • {lead.industry}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{lead.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{lead.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">${lead.opportunityValue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{new Date(lead.expectedClosureDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                      {lead.leadId}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                      {lead.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {lead.contactPerson}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {lead.industry}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                      ${lead.opportunityValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${getStageBadge(lead.currentStage).bg} ${getStageBadge(lead.currentStage).text}`}>
                        {lead.currentStage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(lead.status).bg} ${getStatusBadge(lead.status).text}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openActionMenuId === lead.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-10">
                            {getActionMenuItems(lead).map((item, idx) => {
                              const ItemIcon = item.icon;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    item.onClick();
                                    setOpenActionMenuId(null);
                                  }}
                                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                                    item.className || 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                  }`}
                                >
                                  <ItemIcon className="w-4 h-4" />
                                  {item.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredLeads.length / itemsPerPage)}
            totalItems={filteredLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Add Lead Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lead"
        description="Enter lead information to create a new sales opportunity"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmitForm}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="clientName" required>Client Organization</FormLabel>
                <FormInput
                  id="clientName"
                  placeholder="Enter client organization name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="contactPerson" required>Contact Person</FormLabel>
                <FormInput
                  id="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="contactEmail" required>Email</FormLabel>
                <FormInput
                  id="contactEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="contactPhone">Phone</FormLabel>
                <FormInput
                  id="contactPhone"
                  placeholder="Enter phone number"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="industry" required>Industry</FormLabel>
                <FormSelect
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Automotive">Automotive</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="location">Location</FormLabel>
                <FormInput
                  id="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="leadSource" required>Lead Source</FormLabel>
                <FormSelect
                  id="leadSource"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                  required
                >
                  <option value="">Select Lead Source</option>
                  <option value="Website Inquiry">Website Inquiry</option>
                  <option value="Referral">Referral</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Email Campaign">Email Campaign</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="salesOwner" required>Sales Owner</FormLabel>
                <FormSelect
                  id="salesOwner"
                  value={formData.salesOwner}
                  onChange={(e) => setFormData({ ...formData, salesOwner: e.target.value })}
                  required
                >
                  <option value="">Select Sales Owner</option>
                  <option value="Sarah Mitchell">Sarah Mitchell</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="David Park">David Park</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="opportunityValue" required>Opportunity Value ($)</FormLabel>
                <FormInput
                  id="opportunityValue"
                  type="number"
                  placeholder="Enter opportunity value"
                  value={formData.opportunityValue}
                  onChange={(e) => setFormData({ ...formData, opportunityValue: parseFloat(e.target.value) })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="expectedClosureDate">Expected Closure Date</FormLabel>
                <FormInput
                  id="expectedClosureDate"
                  type="date"
                  value={formData.expectedClosureDate}
                  onChange={(e) => setFormData({ ...formData, expectedClosureDate: e.target.value })}
                />
              </FormField>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowAddModal(false)} type="button">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Add Lead
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>

      {/* Edit Lead Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lead"
        description="Update lead information"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmitForm}>
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel htmlFor="edit-clientName" required>Client Organization</FormLabel>
                <FormInput
                  id="edit-clientName"
                  placeholder="Enter client organization name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-contactPerson" required>Contact Person</FormLabel>
                <FormInput
                  id="edit-contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-contactEmail" required>Email</FormLabel>
                <FormInput
                  id="edit-contactEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-contactPhone">Phone</FormLabel>
                <FormInput
                  id="edit-contactPhone"
                  placeholder="Enter phone number"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-currentStage" required>Current Stage</FormLabel>
                <FormSelect
                  id="edit-currentStage"
                  value={formData.currentStage}
                  onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as any })}
                  required
                >
                  <option value="New Lead">New Lead</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Shared">Proposal Shared</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed-Won">Closed-Won</option>
                  <option value="Closed-Lost">Closed-Lost</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-status" required>Status</FormLabel>
                <FormSelect
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                >
                  <option value="Open">Open</option>
                  <option value="Closed-Won">Closed-Won</option>
                  <option value="Closed-Lost">Closed-Lost</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-opportunityValue" required>Opportunity Value ($)</FormLabel>
                <FormInput
                  id="edit-opportunityValue"
                  type="number"
                  placeholder="Enter opportunity value"
                  value={formData.opportunityValue}
                  onChange={(e) => setFormData({ ...formData, opportunityValue: parseFloat(e.target.value) })}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel htmlFor="edit-expectedClosureDate">Expected Closure Date</FormLabel>
                <FormInput
                  id="edit-expectedClosureDate"
                  type="date"
                  value={formData.expectedClosureDate}
                  onChange={(e) => setFormData({ ...formData, expectedClosureDate: e.target.value })}
                />
              </FormField>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowEditModal(false)} type="button">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Save Changes
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}