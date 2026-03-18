import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2, FileText, ChevronLeft, ChevronRight, Calendar, Clock, DollarSign, CheckCircle2, Mail, Phone, MapPin, Globe, MessageSquare, Paperclip, Eye, EyeOff, Package, AlertCircle, Users, TrendingUp, StickyNote, User, Flag } from 'lucide-react';
import { ProjectEditSidePanel } from './ProjectEditSidePanel';
import { TeamEditSidePanel } from './TeamEditSidePanel';
import { ClientTeamEditSidePanel } from './ClientTeamEditSidePanel';
import { ContactEditSidePanel } from './ContactEditSidePanel';
import { TechnologyEditSidePanel } from './TechnologyEditSidePanel';
import { ScheduleEditSidePanel } from './ScheduleEditSidePanel';
import { CommercialEditSidePanel } from './CommercialEditSidePanel';
import { AgreementsEditSidePanel } from './AgreementsEditSidePanel';
import { MilestoneEditSidePanel } from './MilestoneEditSidePanel';
import { ResourcesEditSidePanel } from './ResourcesEditSidePanel';
import { AttachmentEditSidePanel } from './AttachmentEditSidePanel';
import { SalesNotesEditSidePanel } from './SalesNotesEditSidePanel';
import { ResourceRenewalsEditSidePanel } from './ResourceRenewalsEditSidePanel';
import { ProjectEmailPreviewModal } from './ProjectEmailPreviewModal';
import { ProjectMilestonesModal } from './ProjectMilestonesModal';
import { ProjectAddonsModal } from './ProjectAddonsModal';
import { ProjectRenewalsModal } from './ProjectRenewalsModal';

// Project details view component
interface ProjectDetailsModuleProps {
  project?: any; // Accept project data (optional for now as it uses mock data)
  onBack?: () => void;
  onEdit?: () => void; // Optional edit handler
  onAgreementUpdate?: (summary: {
    assignedMembersCount: number;
    attachedToProjectCount: number;
    assignedMembers: string[];
  }) => void; // Callback when agreements are updated
  onNavigate?: (pageId: string, filters?: any[]) => void;
}

export function ProjectDetailsModule({ project: propProject, onBack, onEdit, onAgreementUpdate, onNavigate }: ProjectDetailsModuleProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isTeamEditPanelOpen, setIsTeamEditPanelOpen] = useState(false);
  const [currentEditTeam, setCurrentEditTeam] = useState<'preSales' | 'postSales' | 'client' | null>(null);
  const [isContactEditPanelOpen, setIsContactEditPanelOpen] = useState(false);
  const [currentEditContact, setCurrentEditContact] = useState<any | null>(null);
  const [isTechnologyEditPanelOpen, setIsTechnologyEditPanelOpen] = useState(false);
  const [isScheduleEditPanelOpen, setIsScheduleEditPanelOpen] = useState(false);
  const [isCommercialEditPanelOpen, setIsCommercialEditPanelOpen] = useState(false);
  const [isAgreementsEditPanelOpen, setIsAgreementsEditPanelOpen] = useState(false);
  const [isMilestoneEditPanelOpen, setIsMilestoneEditPanelOpen] = useState(false);
  const [isResourcesEditPanelOpen, setIsResourcesEditPanelOpen] = useState(false);
  const [isAttachmentEditPanelOpen, setIsAttachmentEditPanelOpen] = useState(false);
  const [isSalesNotesEditPanelOpen, setIsSalesNotesEditPanelOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isRenewalsModalOpen, setIsRenewalsModalOpen] = useState(false);
  const [isRenewalsEditPanelOpen, setIsRenewalsEditPanelOpen] = useState(false);
  const [currentEditRenewal, setCurrentEditRenewal] = useState<any | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // State for Pre-Sales Team
  const [preSalesTeam, setPreSalesTeam] = useState([
    { id: 'pre-1', name: 'Sarah Connor', role: 'Sales HOD', department: 'Sales', subDepartment: 'Management', division: 'Sales Division', email: 'sarah.connor@company.com', phone: '+1 (968) 306-6008' },
    { id: 'pre-2', name: 'John Reese', role: 'Sales Team Lead', department: 'Sales', subDepartment: 'Sales Team', division: 'Sales Division', email: 'john.reese@company.com', phone: '+1 (733) 409-1711' },
    { id: 'pre-3', name: 'T-800', role: 'Sales Executive', department: 'Sales', subDepartment: 'Sales Team', division: 'Sales Division', email: 't-800@company.com', phone: '+1 (575) 705-8983' },
    { id: 'pre-4', name: 'Miles Dyson', role: 'Contact Owner', department: 'Sales', subDepartment: 'Account Management', division: 'Sales Division', email: 'miles.dyson@company.com', phone: '+1 (271) 696-3837' },
    { id: 'pre-5', name: 'To be assigned', role: 'Tech1 Member', department: 'Sales', subDepartment: 'Technical Sales', division: 'Sales Division', email: 'to.be@company.com', phone: '+1 (446) 959-2668' },
    { id: 'pre-6', name: 'To be assigned', role: 'Tech1 Analyst', department: 'Sales', subDepartment: 'Technical Sales', division: 'Sales Division', email: 'to.be@company.com', phone: '+1 (848) 488-4430' },
    { id: 'pre-7', name: 'To be assigned', role: 'Estimation Approver', department: 'Sales', subDepartment: 'Estimations', division: 'Sales Division', email: 'to.be@company.com', phone: '+1 (780) 785-4118' },
  ]);

  // State for Post-Sales Team
  const [postSalesTeam, setPostSalesTeam] = useState([
    { id: 'post-1', name: 'Kevin Park', role: 'Development HOD', department: 'Engineering', subDepartment: 'Web Development', division: 'Digital Solutions', email: 'kevin.park@company.com', phone: '+1 (315) 466-5850' },
    { id: 'post-2', name: 'Chris Wilson', role: 'Project Manager', department: 'Engineering', subDepartment: 'Web Development', division: 'Digital Solutions', email: 'chris.wilson@company.com', phone: '+1 (786) 706-2222' },
    { id: 'post-3', name: 'Sarah Mitchell', role: 'Support Manager (CRT)', department: 'Engineering', subDepartment: 'Web Development', division: 'Digital Solutions', email: 'sarah.mitchell@company.com', phone: '+1 (555) 987-6543' },
  ]);

  // State for Client Team
  const [clientTeamInfo, setClientTeamInfo] = useState({
    companyName: 'ClientCo Technologies',
    companyType: 'Enterprise',
    contacts: [
      {
        id: '1',
        name: 'Sarah Williams',
        initials: 'SW',
        role: 'Chief Technology Officer',
        email: 'sarah.williams@clientco.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, United States',
        timezone: 'EST (UTC-5)',
        tags: ['Existing', 'Key Stakeholder', 'High Priority'],
        channels: ['WhatsApp', 'Teams'],
      },
      {
        id: '2',
        name: 'James Patterson',
        initials: 'JP',
        role: 'VP of Digital Transformation',
        email: 'james.patterson@clientco.com',
        phone: '+1 (555) 123-4568',
        location: 'San Francisco, United States',
        timezone: 'PST (UTC-8)',
        tags: ['New', 'Decision Maker', 'High Priority'],
        channels: ['Teams', 'Slack'],
      },
    ],
  });

  // State for project data, with normalization for different field naming conventions
  const [project, setProject] = useState(() => {
    const baseProject = propProject || {
      id: 'PRJ-2026-001',
      projectCode: 'PRJ-2026-001',
      projectName: 'Enterprise Resource Planning System',
      clientName: 'Global Tech Solutions Inc.',
      subject: 'Corporate Website Revamp',
      projectType: 'Hire',
      status: 'In Progress',
      startDate: 'Jan 15, 2025',
      endDate: 'Dec 31, 2025',
      budget: 245000,
      crmCode: 'CRM-10293',
      businessType: 'Existing',
      domain: 'Digital Experience',
      industry: 'Technology',
    };

    return {
      ...baseProject,
      projectCode: baseProject.projectCode || baseProject.projectId,
      status: baseProject.status || baseProject.projectStatus,
      businessType: baseProject.businessType || baseProject.clientType,
    };
  });

  // Section IDs matching tab keys - Conditional based on project type
  const sections = [
    { id: 'details', label: 'Project Details' },
    { id: 'preSales', label: 'Pre-Sales Team' },
    { id: 'postSales', label: 'Post-Sales Team' },
    { id: 'client', label: 'Client Team' },
    { id: 'technology', label: 'Technology Details' },
    { id: 'schedule', label: 'Project Schedule & Efforts' },
    { id: 'commercial', label: 'Commercial Details' },
    { id: 'agreements', label: 'Agreements & Invoice' },
    ...(project.projectType === 'Fixed Cost' 
      ? [{ id: 'milestones', label: 'Milestone Listing' }]
      : [{ id: 'resources', label: 'Resource Allocation' }]
    ),
    { id: 'attachments', label: 'Attachments' },
    { id: 'salesNotes', label: 'Sales Notes' },
  ];

  // State for Technology Stack
  const [technologyStack, setTechnologyStack] = useState({
    platform: 'SaaS Platform',
    backendFramework: 'Node.js, Express.js',
    frontendFramework: 'React, TypeScript, Tailwind CSS',
    mobileApps: 'Cross Platform',
    mobilePlatform: 'Both (iOS & Android)',
    trendingTech: 'Micro-frontends',
    aiUsage: true,
    aiUsageDetails: 'OpenAI (GPT-4/o), NLP (Natural Language Processing)',
  });

  // State for Schedule & Efforts
  const [scheduleEfforts, setScheduleEfforts] = useState({
    startDate: '2025-02-01',
    endDate: '2025-08-31',
    projectPDs: '450 Hours',
    scheduleWeeks: '24 Weeks',
    uatWeeks: '4 Weeks',
    postDeliverySupport: '12 Weeks',
    projectType: project.projectType,
  });

  // State for Commercial Details
  const [commercialDetails, setCommercialDetails] = useState({
    costingUSD: 150000,
    currency: 'USD',
    costLocal: 150000,
    exchangeRate: 1,
    paymentTerms: '30:40:30',
    selectedMilestones: ['M1', 'M2', 'M3'],
    upfrontAmount: 45000,
    upfrontStatus: 'On the Way',
    paymentMode: 'Bank Transfer (Wire)',
    subPaymentMode: 'SWIFT',
    transactionAmountCharged: true,
    transactionCost: 3750,
    supportIncluded: true,
    supportType: 'Premium Support',
    supportValidity: '12 months post-launch',
    supportMonths: '12',
    supportHours: '160',
    supportAmount: 25000,
    projectType: project.projectType,
  });

  // Sync commercialDetails.projectType with project.projectType
  useEffect(() => {
    setCommercialDetails((prev) => ({
      ...prev,
      projectType: project.projectType,
    }));
  }, [project.projectType]);

  // State for Agreements
  const [agreements, setAgreements] = useState({
    invoiceSent: { name: 'Invoice Sent', status: true, fileName: 'INV-2026-001.pdf', fileSize: '245 KB', requiresAttachment: true },
    paymentSwiftCopy: { name: 'Payment Swift Copy Attached', status: false, fileName: '', fileSize: '', requiresAttachment: true },
    hbNda: { name: 'HB NDA', status: true, fileName: 'HB_NDA_Signed.pdf', fileSize: '1.2 MB', requiresAttachment: true },
    clientNda: { name: 'Client NDA', status: true, fileName: 'Client_NDA_Final.pdf', fileSize: '980 KB', requiresAttachment: true },
    hireAgreement: { name: 'Hire Agreement Signed', status: false, fileName: '', fileSize: '', requiresAttachment: true },
    postDeliverySupport: { name: 'Post Delivery Support Agreement', status: false, fileName: '', fileSize: '', requiresAttachment: true },
    proposalCopySigned: { name: 'Proposal Copy Signed', status: true, fileName: 'Proposal_V2_Signed.pdf', fileSize: '3.5 MB', requiresAttachment: true },
    designDevelopByHB: { name: 'Design & Develop By HB *', status: true, fileName: '', fileSize: '', requiresAttachment: false },
    portfolioDisplay: { name: 'Portfolio Display', status: false, fileName: '', fileSize: '', requiresAttachment: false },
  });

  // State for Milestones
  const [milestones, setMilestones] = useState([
    {
      id: '1',
      milestoneId: 'MS-2026-001',
      projectId: 'PRJ-2026-001',
      code: 'M1',
      name: 'Project Kickoff',
      milestoneName: 'Project Kickoff',
      milestoneCode: 'M1',
      percentage: 30,
      dueDate: '2025-02-15',
      plannedDate: '2025-02-15',
      actualDate: '2025-02-14',
      deliverables: 'Signed Requirements Document, Project Plan',
      amount: 45000,
      milestoneAmount: 45000,
      currency: 'USD',
      milestoneType: 'Kickoff',
      paymentStatus: 'Paid' as const,
      completionStatus: 'Completed' as const,
      approvalStatus: 'Approved' as const,
      invoiceStatus: 'Paid' as const,
      assignedTo: 'John Anderson',
      priority: 'High' as const,
      remarks: 'Completed on time',
    },
    {
      id: '2',
      milestoneId: 'MS-2026-002',
      projectId: 'PRJ-2026-001',
      code: 'M2',
      name: 'Design Completion',
      milestoneName: 'Design Completion',
      milestoneCode: 'M2',
      percentage: 40,
      dueDate: '2025-04-10',
      plannedDate: '2025-04-10',
      deliverables: 'UI/UX Design Prototypes, High-Fidelity Wireframes',
      amount: 60000,
      milestoneAmount: 60000,
      currency: 'USD',
      milestoneType: 'Design',
      paymentStatus: 'Pending' as const,
      completionStatus: 'In Progress' as const,
      approvalStatus: 'Pending' as const,
      invoiceStatus: 'Not Generated' as const,
      assignedTo: 'Sarah Mitchell',
      priority: 'High' as const,
      remarks: 'Currently in progress',
    },
    {
      id: '3',
      milestoneId: 'MS-2026-003',
      projectId: 'PRJ-2026-001',
      code: 'M3',
      name: 'Final Delivery',
      milestoneName: 'Final Delivery',
      milestoneCode: 'M3',
      percentage: 30,
      dueDate: '2025-08-31',
      plannedDate: '2025-08-31',
      deliverables: 'Live Application, Source Code, User Manuals',
      amount: 45000,
      milestoneAmount: 45000,
      currency: 'USD',
      milestoneType: 'Delivery',
      paymentStatus: 'Pending' as const,
      completionStatus: 'Not Started' as const,
      approvalStatus: 'Pending' as const,
      invoiceStatus: 'Not Generated' as const,
      assignedTo: 'Chris Wilson',
      priority: 'Medium' as const,
      remarks: 'Scheduled for future',
    },
  ]);

  // State for Addons
  const [addons, setAddons] = useState([
    {
      id: '1',
      addonId: 'AD-2026-001',
      addonTitle: 'Advanced Analytics Dashboard',
      addonType: 'Addon' as const,
      addonStatus: 'Confirmed' as const,
      proposedTotalHours: 120,
      scheduleInWeeks: 4,
      amount: 15000,
      addonRequestedDate: '2024-02-15',
      addonRequestedBy: 'John Smith',
      approvedHours: 120,
      approvedAmount: 15000,
      addonActionDate: '2024-02-18',
      addonConfirmedBy: 'Sarah Johnson',
      projectName: 'Enterprise Resource Planning System',
      projectId: 'PRJ-2026-001',
      clientName: 'Tech Solutions Inc.',
      createdDate: '2024-02-15',
    },
    {
      id: '2',
      addonId: 'AD-2026-002',
      addonTitle: 'Mobile App Support - Q1 2024',
      addonType: 'Support' as const,
      addonStatus: 'Requested' as const,
      proposedTotalHours: 80,
      scheduleInWeeks: 12,
      amount: 8000,
      addonRequestedDate: '2024-02-20',
      addonRequestedBy: 'Michael Chen',
      projectName: 'Enterprise Resource Planning System',
      projectId: 'PRJ-2026-001',
      clientName: 'Tech Solutions Inc.',
      remarks: 'Pending approval from management',
      createdDate: '2024-02-20',
    },
  ]);

  // State for Resources (HIRE Projects)
  const [resources, setResources] = useState([
    {
      id: '1',
      resourceType: 'Senior Developer',
      resourceSkill: 'React.js',
      hireType: 'Full Time',
      hireCycle: 'Monthly',
      hoursPerCycle: 160,
      hourlyRate: 50,
      resourceAmount: 24000,
      hireStartDate: '2025-03-01',
      hireEndDate: '2025-08-31',
    },
    {
      id: '2',
      resourceType: 'UI/UX Designer',
      resourceSkill: 'UI/UX Design',
      hireType: 'Part Time',
      hireCycle: 'Monthly',
      hoursPerCycle: 80,
      hourlyRate: 45,
      resourceAmount: 10800,
      hireStartDate: '2025-03-15',
      hireEndDate: '2025-06-15',
    },
    {
      id: '3',
      resourceType: 'QA Engineer',
      resourceSkill: 'QA/Testing',
      hireType: 'Full Time',
      hireCycle: 'Bi-Weekly',
      hoursPerCycle: 80,
      hourlyRate: 40,
      resourceAmount: 20480,
      hireStartDate: '2025-04-01',
      hireEndDate: '2025-08-31',
    },
  ]);

  // State for Attachments
  const [attachments, setAttachments] = useState([
    {
      id: '1',
      fileName: 'Project_Proposal_Final.pdf',
      category: 'Project Documents',
      uploadDate: 'Jan 10, 2026',
      description: 'Final approved project proposal and scope of work',
      isConfidential: true,
      assignedMembers: ['pre-1', 'pre-2'],
      attachWithProject: true,
    },
    {
      id: '2',
      fileName: 'MSA_Agreement_Signed.pdf',
      category: 'Contracts & Legal',
      uploadDate: 'Jan 12, 2026',
      description: 'Master Service Agreement with client signatures',
      isConfidential: true,
      assignedMembers: ['pre-1', 'post-4'],
      attachWithProject: true,
    },
    {
      id: '3',
      fileName: 'Technical_Specifications_v2.docx',
      category: 'Technical Specifications',
      uploadDate: 'Jan 15, 2026',
      description: 'Detailed technical requirements and architecture',
      isConfidential: false,
      assignedMembers: ['post-4', 'post-5', 'post-6'],
      attachWithProject: true,
    },
  ]);

  // State for Sales Notes
  const [salesNotes, setSalesNotes] = useState({
    clientsBrief: '',
    projectBackAndForth: '',
    clientComments: '',
    salesComments: '',
    preSalesTech1Comments: '',
    assumptions: '',
    futureBusiness: '',
    crtAccountsComments: '',
  });

  // Scroll spy implementation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-100px 0px -80% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Scroll to section when tab is clicked
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 180; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = document.getElementById('tabs-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'Created': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Draft': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'In Progress': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'On Hold': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status as keyof typeof styles] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  const getUpfrontStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'unpaid':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  const getCurrentTeamMembers = () => {
    switch (currentEditTeam) {
      case 'preSales':
        return preSalesTeam;
      case 'postSales':
        return postSalesTeam;
      case 'client':
        return clientTeamInfo.contacts;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="px-6 py-4">
          {/* Header Section */}
          <div className="mb-6">
            {/* Top Row: Back Button, Icon, Title */}
            <div className="flex items-center gap-5 mb-4">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>

              {/* Title Section */}
              <div className="flex-1 min-w-0 py-0.5">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white leading-tight mb-2">
                  {project.projectName}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-neutral-600 dark:text-neutral-400">{project.projectCode}</span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${getStatusBadge(project.status || '')}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Fixed Cost Project Buttons */}
                {project.projectType === 'Fixed Cost' && (
                  <>
                    {/* Milestones Button */}
                    <button
                      onClick={() => onNavigate?.('milestones', [{ field: 'projectName', operator: 'contains', value: project.projectName }])}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="View Milestones"
                    >
                      <Flag className="w-4 h-4" />
                      Milestones
                    </button>
                    {/* Addons Button */}
                    <button
                      onClick={() => onNavigate?.('addons', [{ field: 'projectName', operator: 'contains', value: project.projectName }])}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="View Addons"
                    >
                      <Package className="w-4 h-4" />
                      Addons
                    </button>
                  </>
                )}

                {/* Hire Project Buttons */}
                {project.projectType === 'Hire' && (
                  <>
                    {/* Resources Button */}
                    <button
                      onClick={() => onNavigate?.('hire-renewal', [{ field: 'projectName', operator: 'contains', value: project.projectName }])}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="View Resources"
                    >
                      <Users className="w-4 h-4" />
                      Resources
                    </button>

                    {/* Resource Renewals Button */}
                    <button
                      onClick={() => onNavigate?.('resource-renewals', [{ field: 'projectName', operator: 'contains', value: project.projectName }])}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="View Resource Renewals"
                    >
                      <Clock className="w-4 h-4" />
                      Resource Renewals
                    </button>
                  </>
                )}

                {/* Send Email Button - Show for both types */}
                <button
                  onClick={() => setIsEmailPreviewOpen(true)}
                  className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>

            {/* Metadata Row - REMOVED (Start, End, Budget) */}
          </div>

          {/* Tabs Navigation */}
          <div className="relative -mx-6 px-6">
            <button
              onClick={() => scrollTabs('left')}
              className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-start pl-2 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-400" />
            </button>

            <div
              id="tabs-container"
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === section.id
                      ? 'text-neutral-900 dark:text-white border-primary-600 dark:border-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollTabs('right')}
              className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-end pr-2 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent"
            >
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content - All Sections Visible */}
      <div ref={contentRef} className="px-6 py-6 space-y-6">
        {/* Project Details Section */}
        <section id="details" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Project Details</h2>
              <button
                onClick={() => setIsEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">CRM Code</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.crmCode}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Subject</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.subject}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Project Code</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.projectCode}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Project Name</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.projectName}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Project Type</label>
                <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {project.projectType}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Business Type</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.businessType}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Domain</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.domain}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Industry</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.industry}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Sales Team Section */}
        <section id="preSales" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Pre-Sales Team</h2>
              <button
                onClick={() => {
                  setCurrentEditTeam('preSales');
                  setIsTeamEditPanelOpen(true);
                }}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preSalesTeam.map((member) => (
                <div 
                  key={member.id}
                  className="group relative p-5 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-transparent dark:from-primary-400/10 rounded-tr-xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Avatar with gradient */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white dark:ring-neutral-900 ring-offset-2 ring-offset-transparent group-hover:ring-primary-100 dark:group-hover:ring-primary-900/50 transition-all">
                      <span className="text-base font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate mb-1">
                        {member.name}
                      </h3>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                        <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                          {member.role}
                        </span>
                      </div>
                      
                      {/* Contact info */}
                      <div className="mt-3 space-y-2">
                        {member.email && (
                          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 group/email">
                            <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover/email:text-primary-500 transition-colors flex-shrink-0" />
                            <span className="truncate group-hover/email:text-primary-600 dark:group-hover/email:text-primary-400 transition-colors">
                              {member.email}
                            </span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 group/phone">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover/phone:text-primary-500 transition-colors flex-shrink-0" />
                            <span className="group-hover/phone:text-primary-600 dark:group-hover/phone:text-primary-400 transition-colors">
                              {member.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Post-Sales Team Section */}
        <section id="postSales" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Post-Sales Team</h2>
              <button
                onClick={() => {
                  setCurrentEditTeam('postSales');
                  setIsTeamEditPanelOpen(true);
                }}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postSalesTeam.map((member) => (
                <div 
                  key={member.id}
                  className="group relative p-5 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-transparent dark:from-primary-400/10 rounded-tr-xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Avatar with gradient */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white dark:ring-neutral-900 ring-offset-2 ring-offset-transparent group-hover:ring-primary-100 dark:group-hover:ring-primary-900/50 transition-all">
                      <span className="text-base font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate mb-1">
                        {member.name}
                      </h3>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                        <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                          {member.role}
                        </span>
                      </div>
                      
                      {/* Organizational Info */}
                      {(member.department || member.subDepartment || member.division) && (
                        <div className="mt-3 space-y-1.5">
                          {member.department && (
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">Department:</span> {member.department}
                            </div>
                          )}
                          {member.subDepartment && (
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">Sub Department:</span> {member.subDepartment}
                            </div>
                          )}
                          {member.division && (
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">Division:</span> {member.division}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Contact info - only show if email or phone exists */}
                      {(member.email || member.phone) && (
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                          {member.email && (
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 group/email">
                              <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover/email:text-primary-500 transition-colors flex-shrink-0" />
                              <span className="truncate group-hover/email:text-primary-600 dark:group-hover/email:text-primary-400 transition-colors">
                                {member.email}
                              </span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 group/phone">
                              <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover/phone:text-primary-500 transition-colors flex-shrink-0" />
                              <span className="group-hover/phone:text-primary-600 dark:group-hover/phone:text-primary-400 transition-colors">
                                {member.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Team Section */}
        <section id="client" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Client Team</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{clientTeamInfo.contacts.length} team members</p>
              </div>
              <button
                onClick={() => {
                  setCurrentEditTeam('client');
                  setIsTeamEditPanelOpen(true);
                }}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {clientTeamInfo.contacts.map((member) => (
                <div
                  key={member.id}
                  className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5 relative"
                >
                  {/* Edit Button - Top Right */}
                  <button
                    onClick={() => {
                      setCurrentEditContact(member);
                      setIsContactEditPanelOpen(true);
                    }}
                    className="absolute top-4 right-4 p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title="Edit contact details"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{member.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{member.role}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {clientTeamInfo.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{member.timezone}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {member.tags?.map((tag, index) => {
                      const tagColors = [
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                      ];
                      return (
                        <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-medium ${tagColors[index % tagColors.length]}`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {member.channels?.map((channel, index) => {
                      const channelColors = [
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
                      ];
                      return (
                        <span key={index} className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${channelColors[index % channelColors.length]}`}>
                          <MessageSquare className="w-3 h-3" />
                          {channel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Details Section */}
        <section id="technology" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Technology Details</h2>
              <button
                onClick={() => setIsTechnologyEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Platform</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.platform}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Backend Framework</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.backendFramework}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Frontend Framework</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.frontendFramework}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Mobile Apps</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.mobileApps}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Mobile Platform</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.mobilePlatform}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Trending Tech</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.trendingTech}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">AI Usage?</label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${technologyStack.aiUsage ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}>
                    {technologyStack.aiUsage ? 'Yes' : 'No'}
                  </span>
                  {technologyStack.aiUsage && technologyStack.aiUsageDetails && (
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{technologyStack.aiUsageDetails}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Schedule & Efforts Section */}
        <section id="schedule" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Project Schedule & Efforts</h2>
              <button
                onClick={() => setIsScheduleEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Project Start Date
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.startDate}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Project End Date
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.endDate}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Project PDs
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.projectPDs}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Schedule in Weeks
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.scheduleWeeks}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  UAT in Weeks
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.uatWeeks}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Post Delivery Support
                </label>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{scheduleEfforts.postDeliverySupport}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial Details Section */}
        <section id="commercial" className="scroll-mt-48">
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Commercial Details</h2>
                <button
                  onClick={() => setIsCommercialEditPanelOpen(true)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Currency</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.currency}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    Costing (USD)
                  </label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">${commercialDetails.costingUSD.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Cost (Local Currency)</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.currency} {commercialDetails.costLocal.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Payment Terms
                  </label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.paymentTerms}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    Upfront Amount
                  </label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">${commercialDetails.upfrontAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Upfront Status</label>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${getUpfrontStatusBadge(commercialDetails.upfrontStatus)}`}>
                    {commercialDetails.upfrontStatus}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Payment Mode</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.paymentMode}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Sub Payment Mode</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.subPaymentMode}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Support Included
                  </label>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${commercialDetails.supportIncluded ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                    {commercialDetails.supportIncluded ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Transaction Cost</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    ${commercialDetails.transactionCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {project.projectType === 'Fixed Cost' && commercialDetails.supportIncluded && (
              <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Support Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Support Type</label>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.supportType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Validity</label>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.supportValidity}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">No. of Months</label>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.supportMonths}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">No. of Hours</label>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{commercialDetails.supportHours}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">Support Amount</label>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">${commercialDetails.supportAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Agreements & Invoice Section */}
        <section id="agreements" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">MSA / Agreement / Invoice</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {Object.entries(agreements)
                    .filter(([key]) => {
                      if (key === 'hireAgreement') return project.projectType === 'Hire';
                      if (key === 'postDeliverySupport') return project.projectType === 'Fixed Cost';
                      return true;
                    })
                    .filter(([, agreement]) => agreement.status).length} of {Object.entries(agreements)
                    .filter(([key]) => {
                      if (key === 'hireAgreement') return project.projectType === 'Hire';
                      if (key === 'postDeliverySupport') return project.projectType === 'Fixed Cost';
                      return true;
                    }).length} items completed
                </p>
              </div>
              <button 
                onClick={() => setIsAgreementsEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Agreements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(agreements)
                .filter(([key]) => {
                  // Show "Hire Agreement Signed" only for HIRE projects
                  if (key === 'hireAgreement') return project.projectType === 'Hire';
                  // Show "Post Delivery Support Agreement" only for Fixed Cost projects
                  if (key === 'postDeliverySupport') return project.projectType === 'Fixed Cost';
                  // Show all other agreements
                  return true;
                })
                .map(([key, agreement]) => (
                <div
                  key={key}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    agreement.status
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {agreement.status ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-neutral-400 dark:border-neutral-600 flex-shrink-0" />
                        )}
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {agreement.name}
                        </p>
                      </div>
                      
                      {agreement.fileName && agreement.status && (
                        <div className="ml-6 mt-2 p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                          <a
                            href="#"
                            className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate font-medium">{agreement.fileName}</span>
                            {agreement.fileSize && (
                              <span className="text-neutral-500 dark:text-neutral-400">
                                ({agreement.fileSize})
                              </span>
                            )}
                          </a>
                        </div>
                      )}

                      {!agreement.fileName && agreement.status && agreement.requiresAttachment && (
                        <div className="ml-6 mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-700">
                          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            Attachment required
                          </p>
                        </div>
                      )}

                      {/* Assigned Members - Show if status is YES and members are assigned */}
                      {agreement.status && (agreement as any).assignedMembers && (agreement as any).assignedMembers.length > 0 && (
                        <div className="ml-6 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                          <div className="flex items-start gap-2">
                            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                Assigned to
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                {(() => {
                                  const mockEmployees = [
                                    { id: '1', name: 'John Anderson' },
                                    { id: '2', name: 'Sarah Mitchell' },
                                    { id: '3', name: 'Emily Chen' },
                                    { id: '4', name: 'Michael Brown' },
                                    { id: '5', name: 'David Wilson' },
                                    { id: '6', name: 'Rachel Green' },
                                    { id: '7', name: 'James Martinez' },
                                    { id: '8', name: 'Lisa Anderson' },
                                  ];
                                  const memberNames = (agreement as any).assignedMembers
                                    .map((id: string) => mockEmployees.find(emp => emp.id === id)?.name)
                                    .filter((name: string | undefined) => name);
                                  return memberNames.join(', ');
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attached to Project - Show if status is YES and attachedToProject is true */}
                      {agreement.status && (agreement as any).attachedToProject === true && (
                        <div className="ml-6 mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                              Attached to Project
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {agreement.status ? (
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          YES
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                          NO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestone Listing Section (Fixed Cost Only) */}
        {project.projectType === 'Fixed Cost' && (
        <section id="milestones" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Milestone Listing</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {milestones.length} defined milestones • Project Type: <span className="font-medium text-neutral-700 dark:text-neutral-300">{project.projectType}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsMilestoneEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Warning for HIRE Projects */}
            {project.projectType !== 'Fixed Cost' && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    Milestones Only Apply to Fixed Cost Projects
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    This is a {project.projectType} project. Milestone-based payment structure is only applicable for Fixed Cost projects.
                  </p>
                </div>
              </div>
            )}

            {/* Milestone Table - Clean Tabular Format */}
            <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Milestone Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Deliverables
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Payment %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {milestones.map((milestone, index) => (
                    <tr key={milestone.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-600 dark:bg-primary-500 text-white font-bold rounded-lg">
                          {milestone.code}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">
                          {milestone.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
                          {milestone.deliverables}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          ${milestone.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {milestone.percentage}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        )}

        {/* Resources Section (Hire Projects Only) */}
        {project.projectType === 'Hire' && (
        <section id="resources" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Resource Allocation</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {resources.length} hired resources • Project Type: <span className="font-medium text-neutral-700 dark:text-neutral-300">{project.projectType}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsResourcesEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Resource Table - Clean Tabular Format */}
            <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Resource Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Hire Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Cycle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Hours/Cycle
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {resources.map((resource, index) => (
                    <tr key={resource.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">
                          {resource.resourceType}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                          {resource.resourceSkill}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {resource.hireType}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {resource.hireCycle}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(resource.hireStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          <br />
                          {new Date(resource.hireEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {resource.hoursPerCycle} hrs
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          ${resource.hourlyRate}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${resource.resourceAmount.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        )}

        {/* Attachments Section */}
        <section id="attachments" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Attachments</h2>
              <button 
                onClick={() => setIsAttachmentEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="space-y-4">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-medium text-neutral-900 dark:text-white">{attachment.fileName}</h3>
                        <div className="flex items-center gap-2">
                          {attachment.isConfidential ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <EyeOff className="w-3 h-3" />
                              Confidential
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <Eye className="w-3 h-3" />
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        <span className="text-primary-600 dark:text-primary-400">{attachment.category}</span>
                        <span>•</span>
                        <span>{attachment.uploadDate}</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{attachment.description}</p>
                      {attachment.assignedMembers && attachment.assignedMembers.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">Assigned to:</span>
                          {attachment.assignedMembers.map((memberId) => {
                            const member = [...preSalesTeam, ...postSalesTeam].find(m => m.id === memberId);
                            return member ? (
                              <span key={memberId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                                <Users className="w-3 h-3" />
                                {member.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sales Notes Section */}
        <section id="salesNotes" className="scroll-mt-48">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 flex items-center justify-center shadow-lg">
                  <StickyNote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sales Notes</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Detailed notes and comments for this project</p>
                </div>
              </div>
              <button
                onClick={() => setIsSalesNotesEditPanelOpen(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clients Brief From Business Perspective */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Clients Brief From Business Perspective
                </h3>
                {salesNotes.clientsBrief ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.clientsBrief }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Project Back and Forth */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Project Back and Forth
                </h3>
                {salesNotes.projectBackAndForth ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.projectBackAndForth }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Client Comments */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Client Comments
                </h3>
                {salesNotes.clientComments ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.clientComments }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Sales Comments */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Sales Comments
                </h3>
                {salesNotes.salesComments ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.salesComments }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Pre-Sales Tech1 Comments */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Pre-Sales Tech1 Comments
                </h3>
                {salesNotes.preSalesTech1Comments ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.preSalesTech1Comments }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Assumptions */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Assumptions
                </h3>
                {salesNotes.assumptions ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.assumptions }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Future Business Possibilities */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Future Business Possibilities
                </h3>
                {salesNotes.futureBusiness ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.futureBusiness }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>

              {/* Comment for CRT / Accounts */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Comment for CRT / Accounts
                </h3>
                {salesNotes.crtAccountsComments ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-neutral-600 dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: salesNotes.crtAccountsComments }}
                  />
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">No content added yet</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Side Panel */}
      <ProjectEditSidePanel
        key={project.id}
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        project={project}
        onSave={(data) => {
          setProject({ ...project, ...data });
          setIsEditPanelOpen(false);
        }}
      />

      {/* Team Edit Side Panel */}
      <TeamEditSidePanel
        key={`team-${currentEditTeam}`}
        isOpen={isTeamEditPanelOpen && currentEditTeam !== 'client'}
        onClose={() => {
          setIsTeamEditPanelOpen(false);
          setCurrentEditTeam(null);
        }}
        teamType={currentEditTeam}
        currentMembers={getCurrentTeamMembers()}
        onSave={(updatedMembers: any) => {
          // Update the appropriate team state
          if (currentEditTeam === 'preSales') {
            setPreSalesTeam(updatedMembers as any);
          } else if (currentEditTeam === 'postSales') {
            setPostSalesTeam(updatedMembers as any);
          }
          setIsTeamEditPanelOpen(false);
          setCurrentEditTeam(null);
        }}
      />

      {/* Client Team Edit Side Panel */}
      <ClientTeamEditSidePanel
        key="client-team-panel"
        isOpen={isTeamEditPanelOpen && currentEditTeam === 'client'}
        onClose={() => {
          setIsTeamEditPanelOpen(false);
          setCurrentEditTeam(null);
        }}
        currentData={clientTeamInfo}
        onSave={(updatedData: any) => {
          setClientTeamInfo(updatedData as any);
          setIsTeamEditPanelOpen(false);
          setCurrentEditTeam(null);
        }}
      />

      {/* Contact Edit Side Panel */}
      <ContactEditSidePanel
        key={project.id}
        isOpen={isContactEditPanelOpen}
        onClose={() => {
          setIsContactEditPanelOpen(false);
          setCurrentEditContact(null);
        }}
        contact={currentEditContact}
        onSave={(updatedContact) => {
          // Update the contact in the client team info
          const updatedContacts = clientTeamInfo.contacts.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact
          );
          setClientTeamInfo({ ...clientTeamInfo, contacts: updatedContacts } as any);
          setIsContactEditPanelOpen(false);
          setCurrentEditContact(null);
        }}
      />

      {/* Technology Edit Side Panel */}
      <TechnologyEditSidePanel
        key={project.id}
        isOpen={isTechnologyEditPanelOpen}
        onClose={() => setIsTechnologyEditPanelOpen(false)}
        currentData={technologyStack}
        onSave={(updatedStack) => {
          setTechnologyStack(updatedStack);
          setIsTechnologyEditPanelOpen(false);
        }}
      />

      {/* Schedule Edit Side Panel */}
      <ScheduleEditSidePanel
        key={project.id}
        isOpen={isScheduleEditPanelOpen}
        onClose={() => setIsScheduleEditPanelOpen(false)}
        currentData={scheduleEfforts}
        onSave={(updatedEfforts) => {
          setScheduleEfforts(updatedEfforts);
          setIsScheduleEditPanelOpen(false);
        }}
      />

      {/* Commercial Edit Side Panel */}
      <CommercialEditSidePanel
        key={project.id}
        isOpen={isCommercialEditPanelOpen}
        onClose={() => setIsCommercialEditPanelOpen(false)}
        currentData={commercialDetails}
        onSave={(updatedDetails) => {
          setCommercialDetails(updatedDetails);
          setIsCommercialEditPanelOpen(false);
        }}
      />

      {/* Agreements Edit Side Panel */}
      <AgreementsEditSidePanel
        key={project.id}
        isOpen={isAgreementsEditPanelOpen}
        onClose={() => setIsAgreementsEditPanelOpen(false)}
        currentData={agreements}
        projectType={project.projectType}
        onSave={(updatedAgreements: any) => {
          setAgreements(updatedAgreements as any);
          setIsAgreementsEditPanelOpen(false);
          
          // Calculate agreement summary
          const mockEmployees = [
            { id: '1', name: 'John Anderson' },
            { id: '2', name: 'Sarah Mitchell' },
            { id: '3', name: 'Emily Chen' },
            { id: '4', name: 'Michael Brown' },
            { id: '5', name: 'David Wilson' },
            { id: '6', name: 'Rachel Green' },
            { id: '7', name: 'James Martinez' },
            { id: '8', name: 'Lisa Anderson' },
          ];
          
          const agreementValues = Object.values(updatedAgreements);
          const assignedMembersCount = agreementValues.filter(
            (agreement: any) => agreement.status && agreement.assignedMembers && agreement.assignedMembers.length > 0
          ).length;
          
          const attachedToProjectCount = agreementValues.filter(
            (agreement: any) => agreement.status && agreement.attachedToProject === true
          ).length;
          
          // Collect all unique assigned member IDs and convert to names
          const allMemberIds = new Set<string>();
          agreementValues.forEach((agreement: any) => {
            if (agreement.status && agreement.assignedMembers) {
              agreement.assignedMembers.forEach((id: string) => allMemberIds.add(id));
            }
          });
          
          const assignedMembers = Array.from(allMemberIds).map(id => {
            const employee = mockEmployees.find(emp => emp.id === id);
            return employee ? employee.name : '';
          }).filter(name => name !== '');
          
          // Call the callback to update parent
          if (onAgreementUpdate) {
            onAgreementUpdate({
              assignedMembersCount,
              attachedToProjectCount,
              assignedMembers,
            });
          }
        }}
      />

      {/* Milestone Edit Side Panel */}
      <MilestoneEditSidePanel
        key={currentEditMilestone?.id || 'new-milestone'}
        isOpen={isMilestoneEditPanelOpen}
        onClose={() => setIsMilestoneEditPanelOpen(false)}
        currentMilestones={milestones}
        onSave={(updatedMilestones: any) => {
          setMilestones(updatedMilestones as any);
          setIsMilestoneEditPanelOpen(false);
        }}
        projectType={project.projectType}
        totalAmount={commercialDetails.costingUSD}
        selectedMilestoneCodes={commercialDetails.selectedMilestones || ['M1', 'M2', 'M3']}
      />

      {/* Resources Edit Side Panel */}
      <ResourcesEditSidePanel
        key={project.id}
        isOpen={isResourcesEditPanelOpen}
        onClose={() => setIsResourcesEditPanelOpen(false)}
        currentResources={resources}
        onSave={(updatedResources) => {
          setResources(updatedResources);
          setIsResourcesEditPanelOpen(false);
        }}
        projectType={project.projectType}
        localCurrency={commercialDetails.currency}
      />

      {/* Attachment Edit Side Panel */}
      <AttachmentEditSidePanel
        key={project.id}
        isOpen={isAttachmentEditPanelOpen}
        onClose={() => setIsAttachmentEditPanelOpen(false)}
        onSave={(newAttachment) => {
          setAttachments([...attachments, newAttachment]);
          setIsAttachmentEditPanelOpen(false);
        }}
        teamMembers={[...preSalesTeam, ...postSalesTeam].map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
        }))}
      />

      {/* Sales Notes Edit Side Panel */}
      <SalesNotesEditSidePanel
        key={project.id}
        isOpen={isSalesNotesEditPanelOpen}
        onClose={() => setIsSalesNotesEditPanelOpen(false)}
        salesNotes={salesNotes}
        onSave={(updatedNotes) => {
          setSalesNotes(updatedNotes);
          setIsSalesNotesEditPanelOpen(false);
        }}
      />

      {/* Email Preview Modal */}
      <ProjectEmailPreviewModal
        key={project.id}
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        project={project}
        preSalesTeam={preSalesTeam}
        postSalesTeam={postSalesTeam}
        clientTeamInfo={clientTeamInfo}
        technologyStack={technologyStack}
        scheduleEfforts={scheduleEfforts}
        commercialDetails={commercialDetails}
        agreements={agreements}
        milestones={project.projectType === 'Fixed Cost' ? milestones : undefined}
        resources={project.projectType === 'Hire' ? resources : undefined}
        attachments={attachments}
        salesNotes={salesNotes}
      />

      {/* Project Milestones Modal */}
      <ProjectMilestonesModal
        key={project.id}
        isOpen={isMilestonesModalOpen}
        onClose={() => setIsMilestonesModalOpen(false)}
        projectId={project.id}
        projectName={project.projectName}
        milestones={milestones}
        onAddMilestone={() => {
          setIsMilestonesModalOpen(false);
          setIsMilestoneEditPanelOpen(true);
        }}
        onEditMilestone={(milestone) => {
          setIsMilestonesModalOpen(false);
          setIsMilestoneEditPanelOpen(true);
        }}
      />

      {/* Project Addons Modal */}
      <ProjectAddonsModal
        key={project.id}
        isOpen={isAddonsModalOpen}
        onClose={() => setIsAddonsModalOpen(false)}
        projectId={project.id}
        projectName={project.projectName}
        addons={addons}
        onAddAddon={() => {
          setIsAddonsModalOpen(false);
          // TODO: Open addon edit panel if needed
        }}
        onEditAddon={(addon) => {
          setIsAddonsModalOpen(false);
          // TODO: Open addon edit panel with addon data
        }}
      />

      {/* Project Renewals Modal - Shows Resource Renewals */}
      <ProjectRenewalsModal
        key={project.id}
        isOpen={isRenewalsModalOpen}
        onClose={() => setIsRenewalsModalOpen(false)}
        projectId={project.id}
        projectName={project.projectName}
        onAddRenewal={() => {
          setIsRenewalsModalOpen(false);
          setCurrentEditRenewal(null);
          setIsRenewalsEditPanelOpen(true);
        }}
        onEditRenewal={(renewal) => {
          setIsRenewalsModalOpen(false);
          setCurrentEditRenewal(renewal);
          setIsRenewalsEditPanelOpen(true);
        }}
      />

      {/* Resource Renewals Edit Side Panel */}
      <ResourceRenewalsEditSidePanel
        key={currentEditRenewal?.id || 'new-renewal'}
        isOpen={isRenewalsEditPanelOpen}
        onClose={() => {
          setIsRenewalsEditPanelOpen(false);
          setCurrentEditRenewal(null);
        }}
        renewal={currentEditRenewal}
        onSave={(data) => {
          console.log('Renewal saved:', data);
          // TODO: Save renewal data to backend
        }}
      />
    </div>
  );
}