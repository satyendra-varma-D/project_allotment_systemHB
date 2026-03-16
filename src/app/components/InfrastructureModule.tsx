import { useState, useMemo } from 'react';
import {
  Server,
  Cloud,
  Database,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  HardDrive,
} from 'lucide-react';
import { ListingHeader, SummaryWidgets, AdvancedSearchPanel, FilterChips, Pagination } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';

// Infrastructure data interface
interface Infrastructure {
  id: string;
  infraId: string;
  projectId: string;
  projectName: string;
  clientName: string;
  serviceType: 'Cloud Server' | 'Database' | 'Storage' | 'CDN' | 'Load Balancer' | 'Other';
  provider: 'AWS' | 'Azure' | 'Google Cloud' | 'DigitalOcean' | 'Self-Hosted';
  serviceName: string;
  instanceType?: string;
  region: string;
  provisionDate: string;
  expiryDate?: string;
  status: 'Active' | 'Provisioning' | 'Inactive' | 'Terminated' | 'Maintenance';
  monthlyCost: number;
  annualCost: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annually';
  autoRenewal: boolean;
  managedBy: string;
  environment: 'Production' | 'Staging' | 'Development' | 'Testing';
  specifications?: string;
  renewalAlert?: boolean;
  daysToExpiry?: number;
  remarks?: string;
  createdDate: string;
}

// Mock data
const mockInfrastructure: Infrastructure[] = [
  {
    id: '1',
    infraId: 'INF-AWS-001',
    projectId: 'PRJ-2024-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    serviceType: 'Cloud Server',
    provider: 'AWS',
    serviceName: 'EC2 Production Cluster',
    instanceType: 't3.xlarge (4 instances)',
    region: 'us-east-1',
    provisionDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: 'Active',
    monthlyCost: 1200,
    annualCost: 14400,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'DevOps Team',
    environment: 'Production',
    specifications: '16 vCPU, 64GB RAM, 500GB SSD',
    daysToExpiry: 321,
    createdDate: '2024-01-10',
  },
  {
    id: '2',
    infraId: 'INF-AWS-002',
    projectId: 'PRJ-2024-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'TechCorp Solutions',
    serviceType: 'Database',
    provider: 'AWS',
    serviceName: 'RDS PostgreSQL Production',
    instanceType: 'db.r5.2xlarge',
    region: 'us-east-1',
    provisionDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: 'Active',
    monthlyCost: 800,
    annualCost: 9600,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'Database Team',
    environment: 'Production',
    specifications: '8 vCPU, 64GB RAM, 1TB Storage',
    daysToExpiry: 321,
    createdDate: '2024-01-10',
  },
  {
    id: '3',
    infraId: 'INF-AZR-003',
    projectId: 'PRJ-2024-002',
    projectName: 'Mobile Banking App',
    clientName: 'FinanceHub Ltd',
    serviceType: 'Cloud Server',
    provider: 'Azure',
    serviceName: 'Azure App Service',
    instanceType: 'P3v2',
    region: 'East US',
    provisionDate: '2024-02-01',
    expiryDate: '2024-05-31',
    status: 'Active',
    monthlyCost: 450,
    annualCost: 5400,
    billingCycle: 'Monthly',
    autoRenewal: false,
    managedBy: 'Cloud Operations',
    environment: 'Production',
    renewalAlert: true,
    daysToExpiry: 30,
    remarks: 'Contract renewal discussion required',
    createdDate: '2024-01-25',
  },
  {
    id: '4',
    infraId: 'INF-GCP-004',
    projectId: 'PRJ-2023-015',
    projectName: 'E-Commerce Platform',
    clientName: 'RetailMax Inc',
    serviceType: 'Storage',
    provider: 'Google Cloud',
    serviceName: 'Cloud Storage Buckets',
    region: 'us-central1',
    provisionDate: '2023-09-01',
    expiryDate: '2024-08-31',
    status: 'Active',
    monthlyCost: 300,
    annualCost: 3600,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'Storage Team',
    environment: 'Production',
    specifications: '5TB Standard Storage',
    daysToExpiry: 184,
    createdDate: '2023-08-20',
  },
  {
    id: '5',
    infraId: 'INF-AWS-005',
    projectId: 'PRJ-2024-005',
    projectName: 'Healthcare Portal',
    clientName: 'MediCare Health',
    serviceType: 'Load Balancer',
    provider: 'AWS',
    serviceName: 'Application Load Balancer',
    region: 'us-west-2',
    provisionDate: '2024-03-01',
    status: 'Active',
    monthlyCost: 150,
    annualCost: 1800,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'Network Team',
    environment: 'Production',
    specifications: 'Multi-AZ, SSL/TLS enabled',
    createdDate: '2024-02-25',
  },
  {
    id: '6',
    infraId: 'INF-DO-006',
    projectId: 'PRJ-2023-010',
    projectName: 'Inventory Management System',
    clientName: 'LogiTrack Systems',
    serviceType: 'Cloud Server',
    provider: 'DigitalOcean',
    serviceName: 'Droplet Staging Server',
    instanceType: '4GB RAM, 2 vCPU',
    region: 'NYC3',
    provisionDate: '2023-06-15',
    status: 'Maintenance',
    monthlyCost: 48,
    annualCost: 576,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'DevOps Team',
    environment: 'Staging',
    remarks: 'Scheduled maintenance - OS updates',
    createdDate: '2023-06-10',
  },
  {
    id: '7',
    infraId: 'INF-AWS-007',
    projectId: 'PRJ-2024-003',
    projectName: 'Learning Management System',
    clientName: 'EduTech Academy',
    serviceType: 'CDN',
    provider: 'AWS',
    serviceName: 'CloudFront Distribution',
    region: 'Global',
    provisionDate: '2024-01-20',
    status: 'Active',
    monthlyCost: 200,
    annualCost: 2400,
    billingCycle: 'Monthly',
    autoRenewal: true,
    managedBy: 'Infrastructure Team',
    environment: 'Production',
    specifications: 'HTTPS, Custom SSL, 10TB transfer',
    createdDate: '2024-01-15',
  },
  {
    id: '8',
    infraId: 'INF-SH-008',
    projectId: 'PRJ-2023-008',
    projectName: 'Internal Tools',
    clientName: 'HB Company',
    serviceType: 'Database',
    provider: 'Self-Hosted',
    serviceName: 'On-Premise MySQL Server',
    region: 'HQ Data Center',
    provisionDate: '2023-03-01',
    status: 'Terminated',
    monthlyCost: 0,
    annualCost: 0,
    billingCycle: 'Annually',
    autoRenewal: false,
    managedBy: 'IT Team',
    environment: 'Development',
    remarks: 'Migrated to cloud services',
    createdDate: '2023-02-15',
  },
];

export default function InfrastructureModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInfra, setSelectedInfra] = useState<Infrastructure | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>(mockInfrastructure);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    const total = infrastructure.length;
    const active = infrastructure.filter(i => i.status === 'Active').length;
    const provisioning = infrastructure.filter(i => i.status === 'Provisioning').length;
    const maintenance = infrastructure.filter(i => i.status === 'Maintenance').length;
    const totalMonthlyCost = infrastructure
      .filter(i => i.status === 'Active')
      .reduce((sum, i) => sum + i.monthlyCost, 0);
    const totalAnnualCost = infrastructure
      .filter(i => i.status === 'Active')
      .reduce((sum, i) => sum + i.annualCost, 0);

    return [
      {
        label: 'Total Services',
        value: total.toString(),
        icon: 'Server',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        trend: '+2',
        trendDirection: 'up' as const,
      },
      {
        label: 'Active Services',
        value: active.toString(),
        icon: 'CheckCircle2',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        iconColor: 'text-green-600 dark:text-green-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Provisioning',
        value: provisioning.toString(),
        icon: 'Clock',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        trend: '0',
        trendDirection: 'neutral' as const,
      },
      {
        label: 'Under Maintenance',
        value: maintenance.toString(),
        icon: 'AlertCircle',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        trend: '+1',
        trendDirection: 'up' as const,
      },
      {
        label: 'Monthly Cost',
        value: `$${(totalMonthlyCost / 1000).toFixed(1)}K`,
        icon: 'Activity',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        trend: '+8',
        trendDirection: 'up' as const,
      },
      {
        label: 'Annual Cost',
        value: `$${(totalAnnualCost / 1000).toFixed(0)}K`,
        icon: 'TrendingUp',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        trend: '+10',
        trendDirection: 'up' as const,
      },
    ];
  }, [infrastructure]);

  // Filter and search logic
  const filteredInfrastructure = useMemo(() => {
    let filtered = [...infrastructure];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (infra) =>
          infra.infraId.toLowerCase().includes(query) ||
          infra.serviceName.toLowerCase().includes(query) ||
          infra.projectName.toLowerCase().includes(query) ||
          infra.clientName.toLowerCase().includes(query) ||
          infra.provider.toLowerCase().includes(query)
      );
    }

    activeFilters.forEach((filter) => {
      if (filter.value && filter.value !== 'all') {
        filtered = filtered.filter((infra) => {
          const infraValue = infra[filter.field as keyof Infrastructure];
          if (typeof infraValue === 'string') {
            return infraValue.toLowerCase().includes(filter.value.toLowerCase());
          }
          return infraValue === filter.value;
        });
      }
    });

    return filtered;
  }, [infrastructure, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredInfrastructure.length / itemsPerPage);
  const paginatedInfrastructure = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInfrastructure.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInfrastructure, currentPage, itemsPerPage]);

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

  const handleEditInfra = (infra: Infrastructure) => {
    setSelectedInfra(infra);
    setIsAddModalOpen(true);
  };

  const handleDeleteInfra = (infraId: string) => {
    if (confirm('Are you sure you want to delete this infrastructure service?')) {
      setInfrastructure(infrastructure.filter(i => i.id !== infraId));
    }
  };

  // Get status styles
  const getStatusStyle = (status: Infrastructure['status']) => {
    const styles = {
      'Active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Provisioning': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Inactive': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Terminated': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[status];
  };

  const getEnvironmentStyle = (environment: Infrastructure['environment']) => {
    const styles = {
      'Production': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Staging': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Development': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Testing': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[environment];
  };

  const getProviderIcon = (provider: Infrastructure['provider']) => {
    switch (provider) {
      case 'AWS':
        return <Cloud className="w-3 h-3" />;
      case 'Azure':
        return <Cloud className="w-3 h-3" />;
      case 'Google Cloud':
        return <Cloud className="w-3 h-3" />;
      case 'DigitalOcean':
        return <Server className="w-3 h-3" />;
      case 'Self-Hosted':
        return <HardDrive className="w-3 h-3" />;
      default:
        return <Server className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Infrastructure"
        subtitle="Track infrastructure provisioning, cloud services, and recurring infra costs"
        moduleName="Service"
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
              { field: 'serviceType', label: 'Service Type', type: 'select', options: ['Cloud Server', 'Database', 'Storage', 'CDN', 'Load Balancer', 'Other'] },
              { field: 'provider', label: 'Provider', type: 'select', options: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Self-Hosted'] },
              { field: 'status', label: 'Status', type: 'select', options: ['Active', 'Provisioning', 'Inactive', 'Terminated', 'Maintenance'] },
              { field: 'environment', label: 'Environment', type: 'select', options: ['Production', 'Staging', 'Development', 'Testing'] },
              { field: 'projectName', label: 'Project Name', type: 'text' },
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
            {paginatedInfrastructure.map((infra) => (
              <div
                key={infra.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {/* Colored Top Border Accent - Based on Status */}
                <div className={`h-1 ${
                  infra.status === 'Active' ? 'bg-green-500' :
                  infra.status === 'Provisioning' ? 'bg-blue-500' :
                  infra.status === 'Maintenance' ? 'bg-orange-500' :
                  infra.status === 'Terminated' ? 'bg-red-500' :
                  'bg-neutral-500'
                }`} />

                {/* Card Content */}
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                      {getProviderIcon(infra.provider)}
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{infra.infraId}</span>
                    </div>
                    
                    {/* Renewal Alert Badge */}
                    {infra.renewalAlert && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                        <AlertCircle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">RENEWAL DUE</span>
                      </div>
                    )}

                    {/* Action Menu */}
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === infra.id ? null : infra.id)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      {openMenuId === infra.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                            <button
                              onClick={() => {
                                handleEditInfra(infra);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteInfra(infra.id);
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

                  {/* Service Name Title */}
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {infra.serviceName}
                  </h3>
                  
                  {/* Project Name with Icon */}
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {infra.projectName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate">{infra.projectName}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusStyle(infra.status)}`}>
                      {infra.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getEnvironmentStyle(infra.environment)}`}>
                      {infra.environment}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                  {/* Compact Information Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Service Type */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Service Type</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{infra.serviceType}</div>
                    </div>
                    
                    {/* Provider */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Provider</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{infra.provider}</div>
                    </div>
                    
                    {/* Region */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Region</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">{infra.region}</div>
                    </div>
                    
                    {/* Billing Cycle */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Billing Cycle</div>
                      <div className="font-medium text-neutral-900 dark:text-white">{infra.billingCycle}</div>
                    </div>
                    
                    {/* Monthly Cost */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Monthly Cost</div>
                      <div className="font-medium text-neutral-900 dark:text-white">${infra.monthlyCost.toLocaleString()}</div>
                    </div>
                    
                    {/* Annual Cost */}
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Annual Cost</div>
                      <div className="font-medium text-neutral-900 dark:text-white truncate">${infra.annualCost.toLocaleString()}</div>
                    </div>

                    {/* Days to Expiry - Only if renewal alert */}
                    {infra.renewalAlert && infra.daysToExpiry !== undefined && (
                      <>
                        <div className="col-span-2">
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Days to Expiry</div>
                          <div className="font-medium text-orange-600 dark:text-orange-400">{infra.daysToExpiry} days</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedInfrastructure.map((infra) => (
              <div
                key={infra.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{infra.infraId}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(infra.status)}`}>
                        {infra.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEnvironmentStyle(infra.environment)}`}>
                        {infra.environment}
                      </span>
                      {infra.renewalAlert && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Renewal Due
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{infra.serviceName}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{infra.projectName} - {infra.clientName}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Service Type</span>
                        <span className="text-neutral-900 dark:text-white">{infra.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Provider</span>
                        <span className="text-neutral-900 dark:text-white">{infra.provider}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Monthly Cost</span>
                        <span className="text-neutral-900 dark:text-white font-medium">${infra.monthlyCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Region</span>
                        <span className="text-neutral-900 dark:text-white">{infra.region}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 relative group">
                    <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                      <button
                        onClick={() => handleEditInfra(infra)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInfra(infra.id)}
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
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Environment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Monthly Cost
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
                  {paginatedInfrastructure.map((infra) => (
                    <tr key={infra.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            {infra.infraId}
                            {infra.renewalAlert && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">{infra.serviceName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{infra.projectName}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{infra.clientName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {infra.provider}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {infra.serviceType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getEnvironmentStyle(infra.environment)}`}>
                          {infra.environment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        ${infra.monthlyCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(infra.status)}`}>
                          {infra.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block group">
                          <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                            <button
                              onClick={() => handleEditInfra(infra)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteInfra(infra.id)}
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
            totalItems={filteredInfrastructure.length}
          />
        </div>
      </div>
    </div>
  );
}
