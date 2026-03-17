import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Eye, 
  LayoutGrid,
  List,
  MoreVertical,
  Edit2,
  Trash2,
  User,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { ResourceRenewalsEditSidePanel } from './ResourceRenewalsEditSidePanel';

interface ResourceRenewal {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  crt: string;
  resourceType: string;
  resourceSkill: string;
  hireType: 'Full-time' | 'Part-time' | 'Average';
  hireCycle: string;
  noOfHours: number;
  currency: string;
  hourlyRate: number;
  resourceAmountUSD: number;
  resourceAmountCurrency: number;
  renewalStartDate: string;
  renewalEndDate: string;
  publishStatus: 'Published' | 'Draft' | 'Pending';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  invoiceNumber: string;
  paymentMode: string;
  subPaymentMode: string;
  transactionCost: number;
  transactionNumber: string;
}

interface ResourceRenewalsModuleProps {
  initialFilters?: any[];
  onFiltersConsumed?: () => void;
}

export function ResourceRenewalsModule({ initialFilters, onFiltersConsumed }: ResourceRenewalsModuleProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [currentEditRenewal, setCurrentEditRenewal] = useState<ResourceRenewal | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'current' | 'completed'>('all');
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilters && initialFilters.length > 0) {
      const projectFilter = initialFilters.find(f => f.field === 'projectName');
      if (projectFilter) {
        setActiveProjectFilter(Array.isArray(projectFilter.value) ? projectFilter.value[0] : projectFilter.value);
      }
      onFiltersConsumed?.();
    }
  }, [initialFilters, onFiltersConsumed]);

  // Mock data
  const renewals: ResourceRenewal[] = [
    {
      id: '1',
      projectCode: 'ENG-2024-001',
      projectName: 'Enterprise CRM Platform',
      clientName: 'Tech Solutions Inc',
      crt: 'Alex Thompson',
      resourceType: 'Senior Backend Developer',
      resourceSkill: 'Node.js, MongoDB',
      hireType: 'Full-time',
      hireCycle: 'Monthly',
      noOfHours: 160,
      currency: 'USD',
      hourlyRate: 85,
      resourceAmountUSD: 8500,
      resourceAmountCurrency: 8500,
      renewalStartDate: '2024-01-15',
      renewalEndDate: '2024-07-15',
      publishStatus: 'Published',
      paymentStatus: 'Paid',
      invoiceNumber: 'INV-2024-001',
      paymentMode: 'Bank Transfer',
      subPaymentMode: 'Wire Transfer',
      transactionCost: 25,
      transactionNumber: 'TXN-2024-001',
    },
    {
      id: '2',
      projectCode: 'ENG-2024-002',
      projectName: 'Mobile Banking App',
      clientName: 'FinTech Corp',
      crt: 'Sarah Mitchell',
      resourceType: 'UI/UX Designer',
      resourceSkill: 'Figma, React Native',
      hireType: 'Part-time',
      hireCycle: 'Bi-weekly',
      noOfHours: 80,
      currency: 'USD',
      hourlyRate: 75,
      resourceAmountUSD: 6000,
      resourceAmountCurrency: 6000,
      renewalStartDate: '2024-02-01',
      renewalEndDate: '2024-08-01',
      publishStatus: 'Published',
      paymentStatus: 'Pending',
      invoiceNumber: 'INV-2024-002',
      paymentMode: 'Credit Card',
      subPaymentMode: 'Visa',
      transactionCost: 50,
      transactionNumber: 'TXN-2024-002',
    },
    {
      id: '3',
      projectCode: 'ENG-2024-003',
      projectName: 'Cloud Infrastructure',
      clientName: 'Global Enterprises',
      crt: 'Rajesh Patel',
      resourceType: 'DevOps Engineer',
      resourceSkill: 'AWS, Kubernetes',
      hireType: 'Full-time',
      hireCycle: 'Monthly',
      noOfHours: 160,
      currency: 'USD',
      hourlyRate: 95,
      resourceAmountUSD: 15200,
      resourceAmountCurrency: 15200,
      renewalStartDate: '2024-03-01',
      renewalEndDate: '2024-09-01',
      publishStatus: 'Draft',
      paymentStatus: 'Pending',
      invoiceNumber: 'INV-2024-003',
      paymentMode: 'PayPal',
      subPaymentMode: 'PayPal Standard',
      transactionCost: 75,
      transactionNumber: 'TXN-2024-003',
    },
  ];

  const filteredRenewals = useMemo(() => {
    return renewals.filter(renewal => {
      const matchesSearch = 
        renewal.crt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        renewal.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        renewal.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        renewal.resourceType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject = !activeProjectFilter || renewal.projectName.toLowerCase() === activeProjectFilter.toLowerCase();
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'current' && new Date(renewal.renewalEndDate) >= new Date()) ||
        (filterStatus === 'completed' && new Date(renewal.renewalEndDate) < new Date());

      return matchesSearch && matchesFilter && matchesProject;
    });
  }, [renewals, searchQuery, filterStatus, activeProjectFilter]);

  const getStatusBadgeStyle = (status: ResourceRenewal['publishStatus']) => {
    const styles = {
      'Published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Draft': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[status];
  };

  const getPaymentStatusStyle = (status: ResourceRenewal['paymentStatus']) => {
    const styles = {
      'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Overdue': 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    };
    return styles[status];
  };

  const getHireTypeStyle = (hireType: ResourceRenewal['hireType']) => {
    const styles = {
      'Full-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Part-time': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Average': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[hireType];
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Resource Renewals</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              Manage active resource billing cycles and renewals - Track billing, payments, and renewal schedules for currently engaged resources
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* View Toggle Buttons */}
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800'
                : 'bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Search Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Filter Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Refresh Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Download Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* View Button */}
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === 'table'
                ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800'
                : 'bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
            title="Table View"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add Button */}
          <button
            onClick={() => {
              setCurrentEditRenewal(null);
              setIsEditPanelOpen(true);
            }}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add Resource Engagement
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRenewals.map((renewal) => (
              <div
                key={renewal.id}
                className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Status Border */}
                <div className={`h-1 ${
                  renewal.publishStatus === 'Published' ? 'bg-green-500' :
                  renewal.publishStatus === 'Pending' ? 'bg-orange-500' :
                  'bg-neutral-300'
                }`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
                          {renewal.projectCode}
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {renewal.crt}
                        </h3>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>

                  {/* Role and Hire Type */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getHireTypeStyle(renewal.hireType)}`}>
                        {renewal.hireType}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeStyle(renewal.publishStatus)}`}>
                        {renewal.publishStatus === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                        {renewal.publishStatus}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-900 dark:text-white font-medium">{renewal.resourceType}</p>
                  </div>

                  {/* Project Info */}
                  <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">PROJECT</div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">{renewal.projectName}</div>
                  </div>

                  {/* Dates and Billing */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">START DATE</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{renewal.renewalStartDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">END DATE</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{renewal.renewalEndDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">BILLING CYCLE</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{renewal.hireCycle}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">MONTHLY RATE</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        ${renewal.resourceAmountUSD.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusStyle(renewal.paymentStatus)}`}>
                      {renewal.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                      {renewal.paymentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                      {renewal.paymentStatus === 'Overdue' && <XCircle className="w-3 h-3" />}
                      {renewal.paymentStatus}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCurrentEditRenewal(renewal);
                          setIsEditPanelOpen(true);
                        }}
                        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                      <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Hire Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredRenewals.map((renewal) => (
                    <tr key={renewal.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-white">{renewal.crt}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{renewal.projectCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{renewal.projectName}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{renewal.clientName}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{renewal.resourceType}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${getHireTypeStyle(renewal.hireType)}`}>
                          {renewal.hireType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{renewal.renewalStartDate}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">to {renewal.renewalEndDate}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                          ${renewal.resourceAmountUSD.toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{renewal.hireCycle}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeStyle(renewal.publishStatus)}`}>
                          {renewal.publishStatus === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                          {renewal.publishStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusStyle(renewal.paymentStatus)}`}>
                          {renewal.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                          {renewal.paymentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                          {renewal.paymentStatus === 'Overdue' && <XCircle className="w-3 h-3" />}
                          {renewal.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentEditRenewal(renewal);
                              setIsEditPanelOpen(true);
                            }}
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors" title="View">
                            <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          <button className="p-1.5 hover:bg-error-50 dark:hover:bg-error-950/30 rounded transition-colors" title="Delete">
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

        {filteredRenewals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No resource renewals found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first resource engagement.'}
            </p>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <ResourceRenewalsEditSidePanel
        isOpen={isEditPanelOpen}
        onClose={() => {
          setIsEditPanelOpen(false);
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

export default ResourceRenewalsModule;