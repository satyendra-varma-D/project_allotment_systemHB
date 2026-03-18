import { useState, useMemo } from 'react';
import {
  Database,
  MoreVertical,
  GitBranch,
  RefreshCw,
  Download,
  Printer,
  Box,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  Share2,
  Lock,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SecondaryButton } from './hb/listing';

// Entity interface
interface Entity {
  id: string;
  name: string;
  description: string;
  primaryKey: string;
  relationships: {
    entity: string;
    type: '1:1' | '1:M' | 'M:1' | 'M:M';
    description: string;
  }[];
  category: 'core' | 'master' | 'submodule' | 'governance';
  attributes: string[];
}

// Data flow stage interface
interface DataFlowStage {
  id: string;
  name: string;
  phase: 'Sales' | 'Governance' | 'Execution' | 'Post-Delivery';
  description: string;
  entities: string[];
  order: number;
}

// Integrity rule interface
interface IntegrityRule {
  id: string;
  rule: string;
  priority: 'critical' | 'high' | 'medium';
  entities: string[];
}

// Mock entities data
const mockEntities: Entity[] = [
  {
    id: 'lead',
    name: 'Lead',
    description: 'Represents a sales opportunity from initial contact to closure',
    primaryKey: 'Lead_ID',
    category: 'core',
    attributes: ['Lead_ID', 'Client_Name', 'Contact_Person', 'Stage', 'Status', 'Estimated_Value', 'Closure_Date', 'Created_By', 'Created_Date'],
    relationships: [
      { entity: 'Project Intake', type: '1:1', description: 'One Lead creates One Project Intake (when Closed-Won)' },
      { entity: 'Project', type: '1:1', description: 'One Lead maps to One Project (after approval)' },
    ],
  },
  {
    id: 'project-intake',
    name: 'Project Intake',
    description: 'Governance checkpoint between Sales closure and Project activation',
    primaryKey: 'Intake_ID',
    category: 'governance',
    attributes: ['Intake_ID', 'Lead_ID', 'Estimated_Start_Date', 'Estimated_End_Date', 'Proposed_Budget', 'Status', 'Approval_Status', 'Created_Date'],
    relationships: [
      { entity: 'Lead', type: '1:1', description: 'Linked to parent Lead' },
      { entity: 'Resource Requirement', type: '1:M', description: 'Has many Resource Requirements' },
      { entity: 'Resource Allocation', type: '1:M', description: 'Has many Resource Allocations' },
      { entity: 'Project', type: '1:1', description: 'Approved Intake creates Project' },
    ],
  },
  {
    id: 'project',
    name: 'Project',
    description: 'Active execution entity representing approved and activated projects',
    primaryKey: 'Project_ID',
    category: 'core',
    attributes: ['Project_ID', 'Project_Code', 'Project_Name', 'Lead_ID', 'Intake_ID', 'Start_Date', 'End_Date', 'Status', 'Project_Manager', 'Created_Date'],
    relationships: [
      { entity: 'Lead', type: '1:1', description: 'Linked to originating Lead' },
      { entity: 'Project Intake', type: '1:1', description: 'Created from approved Intake' },
      { entity: 'Milestone', type: '1:M', description: 'Has many Milestones' },
      { entity: 'Commercial Structure', type: '1:1', description: 'Has one Commercial Structure' },
      { entity: 'Change Request', type: '1:M', description: 'Has many Change Requests' },
      { entity: 'Support Contract', type: '1:M', description: 'Has many Support Contracts' },
      { entity: 'Infrastructure Service', type: '1:M', description: 'Has many Infrastructure Services' },
    ],
  },
  {
    id: 'resource',
    name: 'Resource',
    description: 'Human resource entity (employee/contractor)',
    primaryKey: 'Resource_ID',
    category: 'core',
    attributes: ['Resource_ID', 'Name', 'Email', 'Role', 'Skills', 'Experience_Level', 'Department', 'Status', 'Current_Utilization'],
    relationships: [
      { entity: 'Resource Allocation', type: '1:M', description: 'Linked to multiple Resource Allocations' },
      { entity: 'Hire Renewal Cycle', type: '1:M', description: 'Linked to Hire Renewal records' },
    ],
  },
  {
    id: 'milestone',
    name: 'Milestone',
    description: 'Execution checkpoint within a project lifecycle',
    primaryKey: 'Milestone_ID',
    category: 'core',
    attributes: ['Milestone_ID', 'Project_ID', 'Milestone_Name', 'Sequence', 'Start_Date', 'End_Date', 'Status', 'Payment_Percentage', 'Completion_Date'],
    relationships: [
      { entity: 'Project', type: 'M:1', description: 'Belongs to one Project' },
      { entity: 'Payment Milestones', type: 'M:1', description: 'Mapped from Payment Milestones template' },
      { entity: 'Commercial Structure', type: 'M:1', description: 'Linked to Payment structure' },
    ],
  },
  {
    id: 'milestone-master',
    name: 'Payment Milestones',
    description: 'Template defining reusable milestone configurations',
    primaryKey: 'Milestone_Master_ID',
    category: 'master',
    attributes: ['Milestone_Master_ID', 'Milestone_Code', 'Milestone_Name', 'Domain', 'Sequence', 'Default_Payment_Percentage', 'Status'],
    relationships: [
      { entity: 'Milestone', type: '1:M', description: 'Template for multiple Project Milestones' },
    ],
  },
  {
    id: 'payment-terms-master',
    name: 'Milestone Terms Templates',
    description: 'Standardized payment distribution structures',
    primaryKey: 'Payment_Terms_ID',
    category: 'master',
    attributes: ['Payment_Terms_ID', 'Structure_Name', 'Payment_Distribution', 'Total_Percentage', 'Status', 'Linked_Projects_Count'],
    relationships: [
      { entity: 'Commercial Structure', type: '1:M', description: 'Referenced by Project Commercial Structures' },
    ],
  },
  {
    id: 'commercial-structure',
    name: 'Commercial Structure',
    description: 'Financial tracking and payment structure for projects',
    primaryKey: 'Commercial_ID',
    category: 'core',
    attributes: ['Commercial_ID', 'Project_ID', 'Payment_Terms_ID', 'Total_Value', 'Currency', 'Invoice_Status', 'Payment_Status'],
    relationships: [
      { entity: 'Project', type: '1:1', description: 'Linked to one Project' },
      { entity: 'Milestone Terms Template', type: 'M:1', description: 'References Milestone Terms Template' },
      { entity: 'Invoice', type: '1:M', description: 'Has many Invoice records' },
    ],
  },
  {
    id: 'change-request',
    name: 'Change Request',
    description: 'Scope modifications and enhancements during project execution',
    primaryKey: 'CR_ID',
    category: 'submodule',
    attributes: ['CR_ID', 'Project_ID', 'CR_Title', 'Description', 'Impact_Type', 'Cost_Impact', 'Status', 'Approval_Status'],
    relationships: [
      { entity: 'Project', type: 'M:1', description: 'Linked to parent Project' },
      { entity: 'Milestone', type: '1:M', description: 'May generate additional Milestones' },
      { entity: 'Commercial Structure', type: 'M:1', description: 'Impacts Commercial Structure' },
    ],
  },
  {
    id: 'support-contract',
    name: 'Support Contract',
    description: 'Post-delivery support and maintenance agreements',
    primaryKey: 'Support_ID',
    category: 'submodule',
    attributes: ['Support_ID', 'Project_ID', 'Contract_Type', 'Start_Date', 'End_Date', 'Monthly_Cost', 'Status', 'Renewal_Date'],
    relationships: [
      { entity: 'Project', type: 'M:1', description: 'Linked to parent Project' },
      { entity: 'Invoice', type: '1:M', description: 'Linked to Invoice tracking' },
    ],
  },
  {
    id: 'infrastructure-service',
    name: 'Infrastructure Service',
    description: 'Cloud and infrastructure resource allocations',
    primaryKey: 'Infra_ID',
    category: 'submodule',
    attributes: ['Infra_ID', 'Project_ID', 'Service_Type', 'Provider', 'Monthly_Cost', 'Start_Date', 'Status'],
    relationships: [
      { entity: 'Project', type: 'M:1', description: 'Linked to parent Project' },
      { entity: 'Billing', type: '1:M', description: 'Linked to Billing records' },
    ],
  },
];

// Mock data flow stages
const mockDataFlowStages: DataFlowStage[] = [
  {
    id: 'stage-1',
    name: 'Lead Management',
    phase: 'Sales',
    description: 'Sales opportunity tracking from initial contact to closure',
    entities: ['Lead'],
    order: 1,
  },
  {
    id: 'stage-2',
    name: 'Project Intake',
    phase: 'Governance',
    description: 'Governance checkpoint validating resources and feasibility',
    entities: ['Project Intake', 'Resource Requirement', 'Resource Allocation'],
    order: 2,
  },
  {
    id: 'stage-3',
    name: 'Project Activation',
    phase: 'Governance',
    description: 'Approved intake transitions to active project',
    entities: ['Project', 'Commercial Structure'],
    order: 3,
  },
  {
    id: 'stage-4',
    name: 'Execution & Milestones',
    phase: 'Execution',
    description: 'Active project execution with milestone tracking',
    entities: ['Milestone', 'Resource', 'Commercial Structure'],
    order: 4,
  },
  {
    id: 'stage-5',
    name: 'Change Management',
    phase: 'Execution',
    description: 'Scope modifications and enhancement requests',
    entities: ['Change Request'],
    order: 5,
  },
  {
    id: 'stage-6',
    name: 'Post-Delivery',
    phase: 'Post-Delivery',
    description: 'Support, maintenance, and infrastructure management',
    entities: ['Support Contract', 'Infrastructure Service'],
    order: 6,
  },
];

// Mock integrity rules
const mockIntegrityRules: IntegrityRule[] = [
  {
    id: 'rule-1',
    rule: 'Project cannot exist without approved Intake',
    priority: 'critical',
    entities: ['Project', 'Project Intake'],
  },
  {
    id: 'rule-2',
    rule: 'Intake cannot exist without Closed-Won Lead',
    priority: 'critical',
    entities: ['Project Intake', 'Lead'],
  },
  {
    id: 'rule-3',
    rule: 'Milestones must reference valid Payment Milestones',
    priority: 'high',
    entities: ['Milestone', 'Payment Milestones'],
  },
  {
    id: 'rule-4',
    rule: 'Payment structure must reference valid Milestone Terms Templates',
    priority: 'high',
    entities: ['Commercial Structure', 'Milestone Terms Templates'],
  },
  {
    id: 'rule-5',
    rule: 'Change Request cannot exist without Project',
    priority: 'critical',
    entities: ['Change Request', 'Project'],
  },
  {
    id: 'rule-6',
    rule: 'Resource Allocation cannot exceed capacity threshold',
    priority: 'high',
    entities: ['Resource Allocation', 'Resource'],
  },
  {
    id: 'rule-7',
    rule: 'Support Contract must be linked to completed Project',
    priority: 'medium',
    entities: ['Support Contract', 'Project'],
  },
];

export default function SystemArchitectureModule() {
  const [activeTab, setActiveTab] = useState<'entities' | 'dataflow' | 'integrity' | 'overview'>('overview');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const coreEntities = mockEntities.filter(e => e.category === 'core').length;
    const masterEntities = mockEntities.filter(e => e.category === 'master').length;
    const totalRelationships = mockEntities.reduce((sum, e) => sum + e.relationships.length, 0);
    const criticalRules = mockIntegrityRules.filter(r => r.priority === 'critical').length;

    return [
      {
        label: 'Total Entities',
        value: mockEntities.length.toString(),
        icon: 'Database',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Core Entities',
        value: coreEntities.toString(),
        icon: 'Box',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Master Tables',
        value: masterEntities.toString(),
        icon: 'Layers',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Relationships',
        value: totalRelationships.toString(),
        icon: 'Share2',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '+4',
        trendDirection: 'up' as const,
      },
      {
        label: 'Data Flow Stages',
        value: mockDataFlowStages.length.toString(),
        icon: 'GitBranch',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Critical Rules',
        value: criticalRules.toString(),
        icon: 'Lock',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
    ];
  }, []);

  // Get category badge color
  const getCategoryBadge = (category: Entity['category']) => {
    const styles = {
      'core': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'master': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'submodule': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'governance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[category];
  };

  // Get priority badge color
  const getPriorityBadge = (priority: IntegrityRule['priority']) => {
    const styles = {
      'critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'high': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return styles[priority];
  };

  // Get phase badge color
  const getPhaseBadge = (phase: DataFlowStage['phase']) => {
    const styles = {
      'Sales': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Governance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Execution': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Post-Delivery': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return styles[phase];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <PageHeader
        title="System Data Architecture"
        subtitle="Structural relationships, data flow, and referential integrity across the platform"
        secondaryActions={
          <>
            <IconButton icon={RefreshCw} title="Refresh" onClick={() => {}} />
            <IconButton icon={Download} title="Export" onClick={() => {}} />
            <IconButton icon={Printer} title="Print" onClick={() => {}} />
          </>
        }
      />

      {/* Tab Switcher */}
      <div className="px-6 pb-6">
        <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'entities'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Entities
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dataflow')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'dataflow'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Data Flow
            </div>
          </button>
          <button
            onClick={() => setActiveTab('integrity')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'integrity'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Integrity Rules
            </div>
          </button>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>

      {/* Content Area */}
      <div className="px-6 pb-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Architecture Description */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Architecture Purpose</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                The ROCKEYE System Data Architecture defines the structural relationships between all modules, ensuring logical data flow, referential integrity, modular separation, and scalability across the platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Core Principles
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Logical data flow across lifecycle</li>
                    <li>• Referential integrity enforcement</li>
                    <li>• Modular entity separation</li>
                    <li>• Master-driven configuration</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Architecture Goals
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Scalability & extensibility</li>
                    <li>• Performance optimization</li>
                    <li>• Audit traceability</li>
                    <li>• Future enhancement readiness</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Lifecycle Flow Visualization */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-4">High-Level Entity Flow</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                    Lead
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium">
                    Project Intake
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium">
                    Resource Allocation
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                    Project
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                    Project
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                    Milestones
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                    Commercials
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium">
                    Submodules
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg text-sm font-medium">
                    Masters
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                  <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 rounded-lg text-sm">
                    Payment Milestones → Milestones
                  </div>
                  <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 rounded-lg text-sm">
                    Milestone Terms Templates → Commercial Structure
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Entity Categories</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Core Entities</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{mockEntities.filter(e => e.category === 'core').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Master Tables</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{mockEntities.filter(e => e.category === 'master').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Submodules</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{mockEntities.filter(e => e.category === 'submodule').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Governance</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{mockEntities.filter(e => e.category === 'governance').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <GitBranch className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Lifecycle Phases</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Sales Phase</span>
                    <span className="font-medium text-neutral-900 dark:text-white">1 stage</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Governance Phase</span>
                    <span className="font-medium text-neutral-900 dark:text-white">2 stages</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Execution Phase</span>
                    <span className="font-medium text-neutral-900 dark:text-white">2 stages</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Post-Delivery</span>
                    <span className="font-medium text-neutral-900 dark:text-white">1 stage</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Integrity Controls</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Critical Rules</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{mockIntegrityRules.filter(r => r.priority === 'critical').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">High Priority</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">{mockIntegrityRules.filter(r => r.priority === 'high').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Medium Priority</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">{mockIntegrityRules.filter(r => r.priority === 'medium').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Total Rules</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{mockIntegrityRules.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entities Tab */}
        {activeTab === 'entities' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockEntities.map((entity) => (
              <div
                key={entity.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-neutral-500" />
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getCategoryBadge(entity.category)}`}>
                        {entity.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{entity.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{entity.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEntity(selectedEntity?.id === entity.id ? null : entity)}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Primary Key: </span>
                    <span className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-900 dark:text-white">
                      {entity.primaryKey}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Relationships:</div>
                  <div className="space-y-2">
                    {entity.relationships.map((rel, idx) => (
                      <div key={idx} className="text-sm bg-neutral-50 dark:bg-neutral-800 p-2 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-3 h-3 text-neutral-400" />
                          <span className="font-medium text-neutral-900 dark:text-white">{rel.entity}</span>
                          <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                            {rel.type}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 ml-5">{rel.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEntity?.id === entity.id && (
                  <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Attributes:</div>
                    <div className="flex flex-wrap gap-1">
                      {entity.attributes.map((attr, idx) => (
                        <span key={idx} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 text-xs rounded font-mono">
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Data Flow Tab */}
        {activeTab === 'dataflow' && (
          <div className="space-y-6">
            {mockDataFlowStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{stage.order}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-neutral-900 dark:text-white">{stage.name}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPhaseBadge(stage.phase)}`}>
                        {stage.phase}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{stage.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.entities.map((entity, entityIdx) => (
                        <span key={entityIdx} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 text-sm rounded-lg">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                  {idx < mockDataFlowStages.length - 1 && (
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Integrity Rules Tab */}
        {activeTab === 'integrity' && (
          <div className="space-y-4">
            {mockIntegrityRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${
                      rule.priority === 'critical' 
                        ? 'bg-red-50 dark:bg-red-950/30' 
                        : rule.priority === 'high'
                        ? 'bg-orange-50 dark:bg-orange-950/30'
                        : 'bg-yellow-50 dark:bg-yellow-950/30'
                    }`}>
                      <Lock className={`w-5 h-5 ${
                        rule.priority === 'critical'
                          ? 'text-red-600 dark:text-red-400'
                          : rule.priority === 'high'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${getPriorityBadge(rule.priority)}`}>
                        {rule.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{rule.rule}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Affected Entities:</span>
                      {rule.entities.map((entity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}