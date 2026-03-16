import { X } from 'lucide-react';
import { useState } from 'react';

interface HireRenewalEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  engagement?: any; // Pass engagement data for editing
  onSave?: (data: any) => void;
}

export function HireRenewalEditSidePanel({ isOpen, onClose, engagement, onSave }: HireRenewalEditSidePanelProps) {
  const [formData, setFormData] = useState({
    projectCode: engagement?.projectCode || '',
    projectName: engagement?.projectName || '',
    clientName: engagement?.clientName || '',
    crt: engagement?.crt || '',
    resourceType: engagement?.resourceType || '',
    resourceSkill: engagement?.resourceSkill || '',
    hireType: engagement?.hireType || 'Full-time',
    hireCycle: engagement?.hireCycle || '',
    noOfHours: engagement?.noOfHours || '',
    currency: engagement?.currency || 'USD',
    hourlyRate: engagement?.hourlyRate || '',
    resourceAmountUSD: engagement?.resourceAmountUSD || '',
    resourceAmountCurrency: engagement?.resourceAmountCurrency || '',
    renewalStartDate: engagement?.renewalStartDate || '',
    renewalEndDate: engagement?.renewalEndDate || '',
    publishStatus: engagement?.publishStatus || 'Draft',
    paymentStatus: engagement?.paymentStatus || 'Pending',
    invoiceNumber: engagement?.invoiceNumber || '',
    paymentMode: engagement?.paymentMode || '',
    subPaymentMode: engagement?.subPaymentMode || '',
    transactionCost: engagement?.transactionCost || '',
    transactionNumber: engagement?.transactionNumber || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative ml-auto bg-white dark:bg-neutral-900 w-full max-w-lg h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {engagement ? 'Edit Resource Engagement' : 'Add New Resource Engagement'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {engagement ? 'Update resource engagement details' : 'Create a new resource engagement'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project Code */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Code
              </label>
              <input
                type="text"
                value={formData.projectCode}
                onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="PRJ-2024-001"
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="E-Commerce Platform"
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Tech Solutions Inc"
              />
            </div>

            {/* CRT (Resource Name) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                CRT
              </label>
              <input
                type="text"
                value={formData.crt}
                onChange={(e) => setFormData({ ...formData, crt: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Arun Kumar"
              />
            </div>

            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Type
              </label>
              <input
                type="text"
                value={formData.resourceType}
                onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Senior Developer"
              />
            </div>

            {/* Resource Skill */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Skill
              </label>
              <input
                type="text"
                value={formData.resourceSkill}
                onChange={(e) => setFormData({ ...formData, resourceSkill: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="React.js"
              />
            </div>

            {/* Hire Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hire Type
              </label>
              <select
                value={formData.hireType}
                onChange={(e) => setFormData({ ...formData, hireType: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Average">Average</option>
              </select>
            </div>

            {/* Hire Cycle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hire Cycle
              </label>
              <input
                type="text"
                value={formData.hireCycle}
                onChange={(e) => setFormData({ ...formData, hireCycle: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Monthly"
              />
            </div>

            {/* No of Hours */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                No of Hours
              </label>
              <input
                type="number"
                value={formData.noOfHours}
                onChange={(e) => setFormData({ ...formData, noOfHours: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="160"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hourly Rate
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="50"
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
                onChange={(e) => setFormData({ ...formData, resourceAmountUSD: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="8000"
              />
            </div>

            {/* Resource Amount (Selected Currency) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Amount (Selected Currency)
              </label>
              <input
                type="number"
                value={formData.resourceAmountCurrency}
                onChange={(e) => setFormData({ ...formData, resourceAmountCurrency: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="8000"
              />
            </div>

            {/* Renewal Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Renewal Start Date
              </label>
              <input
                type="date"
                value={formData.renewalStartDate}
                onChange={(e) => setFormData({ ...formData, renewalStartDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            {/* Publish Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Publish Status
              </label>
              <select
                value={formData.publishStatus}
                onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
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
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="INV-2024-001"
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
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Bank Transfer"
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
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Wire Transfer"
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
                onChange={(e) => setFormData({ ...formData, transactionCost: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="25"
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
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="TXN-2024-001"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {engagement ? 'Update' : 'Create'} Engagement
          </button>
        </div>
      </div>
    </div>
  );
}