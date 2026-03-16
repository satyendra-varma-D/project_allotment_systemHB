import { useState, useMemo } from 'react';
import {
  Zap,
  Shield,
  TrendingUp,
  Server,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Activity,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets } from './hb/listing';

// Performance metric interface
interface PerformanceMetric {
  id: string;
  name: string;
  category: 'Response Time' | 'Concurrent Users' | 'Data Volume';
  target: string;
  current: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

// Security control interface
interface SecurityControl {
  id: string;
  category: 'Authentication' | 'Authorization' | 'Data Protection' | 'Audit';
  control: string;
  implementation: string;
  status: 'active' | 'planned' | 'partial';
  priority: 'critical' | 'high' | 'medium';
}

// Scalability configuration interface
interface ScalabilityConfig {
  id: string;
  component: string;
  type: 'Horizontal' | 'Vertical' | 'Modular';
  currentCapacity: string;
  maxCapacity: string;
  status: 'ready' | 'in-progress' | 'planned';
}

// Reliability metric interface
interface ReliabilityMetric {
  id: string;
  metric: string;
  target: string;
  current: string;
  status: 'met' | 'near' | 'below';
  category: 'Uptime' | 'Backup' | 'Failover';
}

// Mock data
const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: 'perf-1',
    name: 'Dashboard Load Time',
    category: 'Response Time',
    target: '≤ 3 seconds',
    current: '2.1 seconds',
    status: 'healthy',
    description: 'For <10,000 records',
  },
  {
    id: 'perf-2',
    name: 'CRUD Operations',
    category: 'Response Time',
    target: '≤ 2 seconds',
    current: '1.5 seconds',
    status: 'healthy',
    description: 'Standard create/read/update/delete operations',
  },
  {
    id: 'perf-3',
    name: 'Allocation Engine',
    category: 'Response Time',
    target: '≤ 5 seconds',
    current: '4.2 seconds',
    status: 'healthy',
    description: 'Resource allocation recommendation processing',
  },
  {
    id: 'perf-4',
    name: 'Report Generation',
    category: 'Response Time',
    target: '≤ 10 seconds',
    current: '7.8 seconds',
    status: 'healthy',
    description: 'Complex report generation time',
  },
  {
    id: 'perf-5',
    name: 'Concurrent Users - Current',
    category: 'Concurrent Users',
    target: '200 minimum',
    current: '450 users',
    status: 'healthy',
    description: 'Active concurrent user support',
  },
  {
    id: 'perf-6',
    name: 'Concurrent Users - Max',
    category: 'Concurrent Users',
    target: '2,000+ scalable',
    current: '2,500 capacity',
    status: 'healthy',
    description: 'Maximum scalable concurrent users',
  },
  {
    id: 'perf-7',
    name: 'Database Indexing',
    category: 'Data Volume',
    target: 'All FKs indexed',
    current: '98% indexed',
    status: 'warning',
    description: 'Foreign key optimization coverage',
  },
  {
    id: 'perf-8',
    name: 'Pagination Efficiency',
    category: 'Data Volume',
    target: '100% paginated',
    current: '100% implemented',
    status: 'healthy',
    description: 'All listing screens use pagination',
  },
];

const mockSecurityControls: SecurityControl[] = [
  {
    id: 'sec-1',
    category: 'Authentication',
    control: 'Role-Based Access Control (RBAC)',
    implementation: 'Fully implemented with 7 role definitions',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-2',
    category: 'Authentication',
    control: 'Encrypted Password Storage',
    implementation: 'bcrypt hashing algorithm',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-3',
    category: 'Authentication',
    control: 'Secure Session Management',
    implementation: 'JWT tokens with expiration',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-4',
    category: 'Authentication',
    control: 'SSO Integration',
    implementation: 'OAuth 2.0 support planned',
    status: 'planned',
    priority: 'medium',
  },
  {
    id: 'sec-5',
    category: 'Authorization',
    control: 'Module-level Permissions',
    implementation: 'Permission matrix enforced across all modules',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-6',
    category: 'Authorization',
    control: 'Action-level Enforcement',
    implementation: 'Granular CRUD permissions',
    status: 'active',
    priority: 'high',
  },
  {
    id: 'sec-7',
    category: 'Authorization',
    control: 'API-level Validation',
    implementation: 'Middleware-based authorization checks',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-8',
    category: 'Data Protection',
    control: 'Encryption at Rest',
    implementation: 'Financial data encrypted in database',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-9',
    category: 'Data Protection',
    control: 'HTTPS/TLS Encryption',
    implementation: 'All traffic encrypted in transit',
    status: 'active',
    priority: 'critical',
  },
  {
    id: 'sec-10',
    category: 'Data Protection',
    control: 'Secure Document Storage',
    implementation: 'S3-compatible encrypted storage',
    status: 'active',
    priority: 'high',
  },
  {
    id: 'sec-11',
    category: 'Audit',
    control: 'Status Change Logging',
    implementation: 'All workflow transitions logged',
    status: 'active',
    priority: 'high',
  },
  {
    id: 'sec-12',
    category: 'Audit',
    control: 'Financial Edit Tracking',
    implementation: 'Complete audit trail for commercial data',
    status: 'active',
    priority: 'critical',
  },
];

const mockScalabilityConfigs: ScalabilityConfig[] = [
  {
    id: 'scale-1',
    component: 'API Layer',
    type: 'Horizontal',
    currentCapacity: '2 instances',
    maxCapacity: '10 instances',
    status: 'ready',
  },
  {
    id: 'scale-2',
    component: 'Database',
    type: 'Vertical',
    currentCapacity: '16 GB RAM',
    maxCapacity: '64 GB RAM',
    status: 'ready',
  },
  {
    id: 'scale-3',
    component: 'Leads Module',
    type: 'Modular',
    currentCapacity: 'Monolithic',
    maxCapacity: 'Microservice-ready',
    status: 'planned',
  },
  {
    id: 'scale-4',
    component: 'Allotment Module',
    type: 'Modular',
    currentCapacity: 'Monolithic',
    maxCapacity: 'Microservice-ready',
    status: 'planned',
  },
  {
    id: 'scale-5',
    component: 'Load Balancer',
    type: 'Horizontal',
    currentCapacity: 'Active',
    maxCapacity: 'Multi-region',
    status: 'in-progress',
  },
  {
    id: 'scale-6',
    component: 'Container Platform',
    type: 'Horizontal',
    currentCapacity: 'Docker',
    maxCapacity: 'Kubernetes',
    status: 'planned',
  },
];

const mockReliabilityMetrics: ReliabilityMetric[] = [
  {
    id: 'rel-1',
    metric: 'System Uptime',
    target: '99.5% minimum',
    current: '99.7%',
    status: 'met',
    category: 'Uptime',
  },
  {
    id: 'rel-2',
    metric: 'Daily Automated Backup',
    target: '100% success',
    current: '100%',
    status: 'met',
    category: 'Backup',
  },
  {
    id: 'rel-3',
    metric: 'Weekly Full Snapshot',
    target: '100% completion',
    current: '100%',
    status: 'met',
    category: 'Backup',
  },
  {
    id: 'rel-4',
    metric: 'Backup Retention',
    target: '30 days minimum',
    current: '45 days',
    status: 'met',
    category: 'Backup',
  },
  {
    id: 'rel-5',
    metric: 'Database Replication',
    target: 'Active',
    current: 'Active',
    status: 'met',
    category: 'Failover',
  },
  {
    id: 'rel-6',
    metric: 'Auto Failover',
    target: '< 2 minutes',
    current: '1.5 minutes',
    status: 'met',
    category: 'Failover',
  },
  {
    id: 'rel-7',
    metric: 'RPO (Recovery Point)',
    target: '≤ 24 hours',
    current: '12 hours',
    status: 'met',
    category: 'Backup',
  },
  {
    id: 'rel-8',
    metric: 'RTO (Recovery Time)',
    target: '≤ 4 hours',
    current: '3 hours',
    status: 'met',
    category: 'Failover',
  },
];

export default function NonFunctionalArchitectureModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'security' | 'scalability' | 'reliability'>('overview');

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const healthyPerf = mockPerformanceMetrics.filter(m => m.status === 'healthy').length;
    const activeControls = mockSecurityControls.filter(c => c.status === 'active').length;
    const readyScale = mockScalabilityConfigs.filter(s => s.status === 'ready').length;
    const metReliability = mockReliabilityMetrics.filter(r => r.status === 'met').length;

    return [
      {
        label: 'Performance Metrics',
        value: `${healthyPerf}/${mockPerformanceMetrics.length}`,
        icon: 'Zap',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Security Controls',
        value: `${activeControls}/${mockSecurityControls.length}`,
        icon: 'Shield',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Scalability Ready',
        value: `${readyScale}/${mockScalabilityConfigs.length}`,
        icon: 'TrendingUp',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Reliability Targets',
        value: `${metReliability}/${mockReliabilityMetrics.length}`,
        icon: 'CheckCircle',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'System Uptime',
        value: '99.7%',
        icon: 'Activity',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+0.2%',
        trendDirection: 'up' as const,
      },
      {
        label: 'Critical Controls',
        value: mockSecurityControls.filter(c => c.priority === 'critical' && c.status === 'active').length.toString(),
        icon: 'Lock',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        iconColor: 'text-red-600 dark:text-red-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
    ];
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'healthy': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'warning': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'planned': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'partial': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'ready': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'met': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'near': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'below': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      'critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'high': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return styles[priority];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <PageHeader
        title="Non-Functional Architecture"
        subtitle="Performance, security, scalability, and reliability standards across the platform"
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
              <Settings className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </div>
          </button>
          <button
            onClick={() => setActiveTab('scalability')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'scalability'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Scalability
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reliability')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'reliability'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Reliability
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
            {/* Architecture Purpose */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Non-Functional Architecture Purpose</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                This architecture defines how ROCKEYE performs, scales, secures data, ensures reliability, and supports enterprise growth. While functional modules define what the system does, this module defines how it does it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance Standards
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Response time optimization</li>
                    <li>• Concurrent user support</li>
                    <li>• Data volume handling</li>
                    <li>• Efficient pagination</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Controls
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Authentication & authorization</li>
                    <li>• Data encryption</li>
                    <li>• Audit trails</li>
                    <li>• Compliance readiness</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Scalability Design
                  </h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• Horizontal scaling ready</li>
                    <li>• Modular architecture</li>
                    <li>• Container deployment</li>
                    <li>• Load balancer support</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Reliability Targets
                  </h4>
                  <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
                    <li>• 99.5%+ uptime target</li>
                    <li>• Automated backups</li>
                    <li>• Disaster recovery</li>
                    <li>• Failover strategy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Performance</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Healthy</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{mockPerformanceMetrics.filter(m => m.status === 'healthy').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Warning</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">{mockPerformanceMetrics.filter(m => m.status === 'warning').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Security</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Active</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{mockSecurityControls.filter(c => c.status === 'active').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Planned</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{mockSecurityControls.filter(c => c.status === 'planned').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Scalability</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Ready</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{mockScalabilityConfigs.filter(s => s.status === 'ready').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Planned</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{mockScalabilityConfigs.filter(s => s.status === 'planned').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Server className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">Reliability</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Target Met</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{mockReliabilityMetrics.filter(r => r.status === 'met').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Below Target</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{mockReliabilityMetrics.filter(r => r.status === 'below').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPerformanceMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-neutral-500" />
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{metric.category}</span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{metric.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{metric.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Target:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{metric.target}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Current:</span>
                    <span className={`font-medium ${
                      metric.status === 'healthy' 
                        ? 'text-green-600 dark:text-green-400' 
                        : metric.status === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {metric.current}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {['Authentication', 'Authorization', 'Data Protection', 'Audit'].map((category) => (
              <div key={category} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <h3 className="font-medium text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  {category}
                </h3>
                <div className="space-y-3">
                  {mockSecurityControls
                    .filter(c => c.category === category)
                    .map((control) => (
                      <div
                        key={control.id}
                        className="flex items-start justify-between bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-neutral-900 dark:text-white text-sm">{control.control}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getPriorityBadge(control.priority)}`}>
                              {control.priority}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{control.implementation}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ml-4 ${getStatusBadge(control.status)}`}>
                          {control.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scalability Tab */}
        {activeTab === 'scalability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockScalabilityConfigs.map((config) => (
              <div
                key={config.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-neutral-500" />
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{config.type}</span>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{config.component}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(config.status)}`}>
                    {config.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Current:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{config.currentCapacity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Max:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{config.maxCapacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reliability Tab */}
        {activeTab === 'reliability' && (
          <div className="space-y-4">
            {['Uptime', 'Backup', 'Failover'].map((category) => (
              <div key={category} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <h3 className="font-medium text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  {category === 'Uptime' && <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                  {category === 'Backup' && <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                  {category === 'Failover' && <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  {category}
                </h3>
                <div className="space-y-3">
                  {mockReliabilityMetrics
                    .filter(m => m.category === category)
                    .map((metric) => (
                      <div
                        key={metric.id}
                        className="flex items-start justify-between bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900 dark:text-white text-sm mb-2">{metric.metric}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-neutral-500 dark:text-neutral-400">Target: </span>
                              <span className="text-neutral-900 dark:text-white">{metric.target}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 dark:text-neutral-400">Current: </span>
                              <span className={`font-medium ${
                                metric.status === 'met' 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : metric.status === 'near'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {metric.current}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ml-4 ${getStatusBadge(metric.status)}`}>
                          {metric.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
