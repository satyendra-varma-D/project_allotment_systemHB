import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ResourceRenewalEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  renewal?: {
    id: string;
    projectCode: string;
    projectName: string;
    clientName: string;
    crt: string;
    resourceType: string;
    resourceSkill: string;
    hireType: string;
    hireCycle: string;
    numberOfHours: number;
    hourlyRate: number;
    resourceAmountUSD: number;
    currency: string;
    resourceAmountCurrency: number;
    renewalStartDate: string;
    renewalEndDate: string;
    publishStatus: string;
    paymentStatus: string;
    invoiceNumber?: string;
    paymentMode?: string;
    subPaymentMode?: string;
    transactionCost?: number;
    transactionNumber?: string;
  } | null;
  onSave?: (data: any) => void;
}

export function ResourceRenewalEditSidePanel({ isOpen, onClose, renewal, onSave }: ResourceRenewalEditSidePanelProps) {
  const [formData, setFormData] = useState({
    resourceSkill: renewal?.resourceSkill || '',
    hireType: renewal?.hireType || 'Full-time',
    hireCycle: renewal?.hireCycle || 'Monthly',
    numberOfHours: renewal?.numberOfHours || 0,
    hourlyRate: renewal?.hourlyRate || 0,
    resourceAmountUSD: renewal?.resourceAmountUSD || 0,
    currency: renewal?.currency || 'USD',
    resourceAmountCurrency: renewal?.resourceAmountCurrency || 0,
    renewalStartDate: renewal?.renewalStartDate || '',
    renewalEndDate: renewal?.renewalEndDate || '',
    publishStatus: renewal?.publishStatus || 'Draft',
    paymentStatus: renewal?.paymentStatus || 'Pending',
    invoiceNumber: renewal?.invoiceNumber || '',
    paymentMode: renewal?.paymentMode || '',
    subPaymentMode: renewal?.subPaymentMode || '',
    transactionCost: renewal?.transactionCost || 0,
    transactionNumber: renewal?.transactionNumber || '',
  });

  // Update form data when renewal changes
  useEffect(() => {
    if (isOpen && renewal) {
      setFormData({
        resourceSkill: renewal.resourceSkill || '',
        hireType: renewal.hireType || 'Full-time',
        hireCycle: renewal.hireCycle || 'Monthly',
        numberOfHours: renewal.numberOfHours || 0,
        hourlyRate: renewal.hourlyRate || 0,
        resourceAmountUSD: renewal.resourceAmountUSD || 0,
        currency: renewal.currency || 'USD',
        resourceAmountCurrency: renewal.resourceAmountCurrency || 0,
        renewalStartDate: renewal.renewalStartDate || '',
        renewalEndDate: renewal.renewalEndDate || '',
        publishStatus: renewal.publishStatus || 'Draft',
        paymentStatus: renewal.paymentStatus || 'Pending',
        invoiceNumber: renewal.invoiceNumber || '',
        paymentMode: renewal.paymentMode || '',
        subPaymentMode: renewal.subPaymentMode || '',
        transactionCost: renewal.transactionCost || 0,
        transactionNumber: renewal.transactionNumber || '',
      });
    }
  }, [isOpen, renewal]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {renewal ? 'Edit Resource Renewal' : 'Add New Resource Renewal'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Project Code (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Code
              </label>
              <input
                type="text"
                value={renewal?.projectCode || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Project Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={renewal?.projectName || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Client Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={renewal?.clientName || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* CRT (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                CRT
              </label>
              <input
                type="text"
                value={renewal?.crt || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Resource Type (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Type
              </label>
              <input
                type="text"
                value={renewal?.resourceType || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Resource Skill */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Skill
              </label>
              <div className="relative">
                <select
                  value={formData.resourceSkill}
                  onChange={(e) => setFormData({ ...formData, resourceSkill: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select Resource Skill</option>
                  <option value="React Developer">React Developer</option>
                  <option value="Angular Developer">Angular Developer</option>
                  <option value="Vue Developer">Vue Developer</option>
                  <option value="Node.js Developer">Node.js Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value=".NET Developer">.NET Developer</option>
                  <option value="PHP Developer">PHP Developer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="iOS Developer">iOS Developer</option>
                  <option value="Android Developer">Android Developer</option>
                  <option value="React Native Developer">React Native Developer</option>
                  <option value="Flutter Developer">Flutter Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Database Administrator">Database Administrator</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Hire Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hire Type
              </label>
              <div className="relative">
                <select
                  value={formData.hireType}
                  onChange={(e) => setFormData({ ...formData, hireType: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Full-time">Full Time</option>
                  <option value="Part-time">Part Time</option>
                  <option value="Average">Average</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Hire Cycle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hire Cycle
              </label>
              <div className="relative">
                <select
                  value={formData.hireCycle}
                  onChange={(e) => setFormData({ ...formData, hireCycle: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Hourly">Hourly</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* No of Hours (Per Cycle) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                No of Hours (Per Cycle)
              </label>
              <input
                type="number"
                value={formData.numberOfHours}
                onChange={(e) => setFormData({ ...formData, numberOfHours: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 160"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hourly Rate
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 75"
              />
            </div>

            {/* Resource Amount (USD) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Amount (USD)
              </label>
              <input
                type="number"
                value={formData.resourceAmountUSD}
                onChange={(e) => setFormData({ ...formData, resourceAmountUSD: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 12000"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Currency
              </label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Resource Amount (Selected Currency) - Conditional */}
            {formData.currency && formData.currency !== 'USD' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Resource Amount ({formData.currency})
                </label>
                <input
                  type="number"
                  value={formData.resourceAmountCurrency}
                  onChange={(e) => setFormData({ ...formData, resourceAmountCurrency: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={`e.g., Amount in ${formData.currency}`}
                />
              </div>
            )}

            {/* Renewal Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Renewal Start Date
              </label>
              <input
                type="date"
                value={formData.renewalStartDate}
                onChange={(e) => setFormData({ ...formData, renewalStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Renewal End Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Renewal End Date
              </label>
              <input
                type="date"
                value={formData.renewalEndDate}
                onChange={(e) => setFormData({ ...formData, renewalEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Publish Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Publish Status
              </label>
              <div className="relative">
                <select
                  value={formData.publishStatus}
                  onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Status
              </label>
              <div className="relative">
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Requested">Requested</option>
                  <option value="Invoice Raised">Invoice Raised</option>
                  <option value="Received">Received</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Conditional Payment Details - Only when Invoice Raised */}
            {(formData.paymentStatus === 'Invoice Raised' || formData.paymentStatus === 'Received') && (
              <>
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    The following fields are applicable only when Invoice Raised
                  </p>
                </div>

                {/* Invoice Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., INV-2024-001"
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Payment Mode
                  </label>
                  <input
                    type="text"
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Bank Transfer"
                  />
                </div>

                {/* Sub Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Sub Payment Mode
                  </label>
                  <input
                    type="text"
                    value={formData.subPaymentMode}
                    onChange={(e) => setFormData({ ...formData, subPaymentMode: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Wire Transfer"
                  />
                </div>

                {/* Transaction Cost */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Transaction Cost
                  </label>
                  <input
                    type="number"
                    value={formData.transactionCost}
                    onChange={(e) => setFormData({ ...formData, transactionCost: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                </div>

                {/* Transaction Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Transaction Number
                  </label>
                  <input
                    type="text"
                    value={formData.transactionNumber}
                    onChange={(e) => setFormData({ ...formData, transactionNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., TXN-001234"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              Save Changes
              <span className="text-xs opacity-75">⌘</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
