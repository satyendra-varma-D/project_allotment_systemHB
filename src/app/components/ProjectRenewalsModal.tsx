import { X, RefreshCw, Plus, Edit2, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface Renewal {
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

interface ProjectRenewalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  renewals?: Renewal[];
  onAddRenewal?: () => void;
  onEditRenewal?: (renewal: Renewal) => void;
}

export function ProjectRenewalsModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  renewals = [],
  onAddRenewal,
  onEditRenewal,
}: ProjectRenewalsModalProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  if (!isOpen) return null;

  // Mock data for demonstration
  const mockRenewals: Renewal[] = renewals.length > 0 ? renewals : [
    {
      id: '1',
      projectCode: 'PRJ-2024-001',
      projectName: 'E-Commerce Platform',
      clientName: 'Tech Solutions Inc',
      crt: 'Arun Kumar',
      resourceType: 'Senior Developer',
      resourceSkill: 'React.js',
      hireType: 'Full-time',
      hireCycle: 'Monthly',
      noOfHours: 160,
      currency: 'USD',
      hourlyRate: 50,
      resourceAmountUSD: 8000,
      resourceAmountCurrency: 8000,
      renewalStartDate: '2024-01-01',
      renewalEndDate: '2024-01-31',
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
      projectCode: 'PRJ-2024-002',
      projectName: 'Mobile App Development',
      clientName: 'Startup Ventures Ltd',
      crt: 'Priya Sharma',
      resourceType: 'UI/UX Designer',
      resourceSkill: 'UI/UX Design',
      hireType: 'Part-time',
      hireCycle: 'Bi-weekly',
      noOfHours: 80,
      currency: 'EUR',
      hourlyRate: 45,
      resourceAmountUSD: 3600,
      resourceAmountCurrency: 3330,
      renewalStartDate: '2024-02-01',
      renewalEndDate: '2024-02-14',
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
      projectCode: 'PRJ-2024-003',
      projectName: 'Cloud Infrastructure',
      clientName: 'Global Enterprises',
      crt: 'Rajesh Patel',
      resourceType: 'DevOps Engineer',
      resourceSkill: 'AWS/Azure',
      hireType: 'Full-time',
      hireCycle: 'Monthly',
      noOfHours: 160,
      currency: 'GBP',
      hourlyRate: 55,
      resourceAmountUSD: 8800,
      resourceAmountCurrency: 6952,
      renewalStartDate: '2024-03-01',
      renewalEndDate: '2024-03-31',
      publishStatus: 'Draft',
      paymentStatus: 'Pending',
      invoiceNumber: 'INV-2024-003',
      paymentMode: 'PayPal',
      subPaymentMode: 'PayPal Standard',
      transactionCost: 75,
      transactionNumber: 'TXN-2024-003',
    },
  ];

  // Filter renewals based on status
  const filteredRenewals = mockRenewals.filter((renewal) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'published') return renewal.publishStatus === 'Published';
    if (filterStatus === 'draft') return renewal.publishStatus === 'Draft';
    return true;
  });

  const getPublishStatusStyle = (status: Renewal['publishStatus']) => {
    const styles = {
      'Published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Draft': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[status];
  };

  const getPaymentStatusStyle = (status: Renewal['paymentStatus']) => {
    const styles = {
      'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Pending': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Overdue': 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    };
    return styles[status];
  };

  const getHireTypeStyle = (hireType: Renewal['hireType']) => {
    const styles = {
      'Full-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Part-time': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Average': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return styles[hireType];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Resource Renewals</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{projectName} • {projectId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Filter Tabs and Add Button */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              All ({mockRenewals.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Published ({mockRenewals.filter(r => r.publishStatus === 'Published').length})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Draft ({mockRenewals.filter(r => r.publishStatus === 'Draft').length})
            </button>
          </div>
          {onAddRenewal && (
            <button
              onClick={onAddRenewal}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Renewal
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredRenewals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No {filterStatus !== 'all' ? filterStatus : ''} renewals found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {filterStatus === 'all' 
                  ? 'Get started by adding your first renewal.'
                  : `No ${filterStatus} renewals to display.`}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Project Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Client Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        CRT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Resource Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Resource Skill
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Hire Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Hire Cycle
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        No of Hours
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Currency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Hourly Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Resource Amount (USD)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Resource Amount (Currency)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Renewal Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Renewal End Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Publish Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Payment Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Invoice Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Payment Mode
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Sub Payment Mode
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Transaction Cost
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap">
                        Transaction Number
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-neutral-50 dark:bg-neutral-800/50">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {filteredRenewals.map((renewal) => (
                      <tr key={renewal.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {renewal.projectCode}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {renewal.projectName}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.clientName}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {renewal.crt}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.resourceType}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.resourceSkill}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${getHireTypeStyle(renewal.hireType)}`}>
                            {renewal.hireType}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.hireCycle}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {renewal.noOfHours}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {renewal.currency}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            ${renewal.hourlyRate}/hr
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            ${renewal.resourceAmountUSD.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {renewal.currency} {renewal.resourceAmountCurrency.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.renewalStartDate}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.renewalEndDate}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getPublishStatusStyle(renewal.publishStatus)}`}>
                            {renewal.publishStatus === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                            {renewal.publishStatus === 'Pending' && <Clock className="w-3 h-3" />}
                            {renewal.publishStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusStyle(renewal.paymentStatus)}`}>
                            {renewal.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                            {renewal.paymentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                            {renewal.paymentStatus === 'Overdue' && <XCircle className="w-3 h-3" />}
                            {renewal.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {renewal.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.paymentMode}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {renewal.subPaymentMode}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            ${renewal.transactionCost}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {renewal.transactionNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap sticky right-0 bg-white dark:bg-neutral-900">
                          <div className="flex items-center justify-center gap-2">
                            {onEditRenewal && (
                              <button
                                onClick={() => onEditRenewal(renewal)}
                                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                                title="Edit Renewal"
                              >
                                <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                            )}
                            <button
                              className="p-1.5 hover:bg-error-50 dark:hover:bg-error-950/30 rounded transition-colors"
                              title="Delete Renewal"
                            >
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}