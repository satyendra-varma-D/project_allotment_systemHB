import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

export interface AddonData {
  id?: string;
  requestId?: string;
  // Addon Overview
  addonTitle: string;
  addonDescription: string;
  addonType: string;
  addonStatus: string;
  addonAddedDate: string;
  
  // Estimation & Costing Details
  proposedTotalHours: number;
  scheduleInWeeks: number;
  amountUSD: number;
  amountProjectCurrency: number;
  addonRequestedDate: string;
  addonRequestedBy: string;
  
  // Confirmation Details
  approvedHours: number;
  approvedAmountUSD: number;
  approvedAmountProjectCurrency: number;
  paymentTerms: string;
  addonActionDate: string;
  addonConfirmedBy: string;
}

interface AddonsEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any | null;
  onSave: (data: any) => void;
}

const initialAddonData: AddonData = {
  addonTitle: '',
  addonDescription: '',
  addonType: 'Feature Enhancement',
  addonStatus: 'Draft',
  addonAddedDate: new Date().toISOString().split('T')[0],
  proposedTotalHours: 0,
  scheduleInWeeks: 0,
  amountUSD: 0,
  amountProjectCurrency: 0,
  addonRequestedDate: new Date().toISOString().split('T')[0],
  addonRequestedBy: '',
  approvedHours: 0,
  approvedAmountUSD: 0,
  approvedAmountProjectCurrency: 0,
  paymentTerms: '',
  addonActionDate: '',
  addonConfirmedBy: '',
};

export function AddonsEditSidePanel({
  isOpen,
  onClose,
  request,
  onSave,
}: AddonsEditSidePanelProps) {
  const [formData, setFormData] = useState<AddonData>(initialAddonData);

  useEffect(() => {
    if (isOpen) {
      setFormData(request || initialAddonData);
    }
  }, [isOpen, request]);

  const handleInputChange = (field: keyof AddonData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const addonTypes = ['Feature Enhancement', 'Additional Scope', 'Delivery Extension', 'Bug Fix', 'Performance Optimization'];
  const addonStatuses = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'In Progress', 'Completed', 'On Hold'];
  const paymentTermsOptions = ['Immediate', '30 Days', '60 Days', '90 Days', 'Upon Completion', 'Milestone Based', 'Custom'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {formData?.id ? 'Edit Addon' : 'Add New Addon'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {formData?.requestId || 'Track additional scope and delivery extensions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">{/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Request Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.addonType}
                onChange={(e) => handleInputChange('addonType', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {addonTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Addon Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.addonTitle}
                onChange={(e) => handleInputChange('addonTitle', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter addon title"
              />
            </div>

            {/* Addon Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.addonDescription}
                onChange={(e) => handleInputChange('addonDescription', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the addon requirements"
              />
            </div>

            {/* Addon Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.addonStatus}
                onChange={(e) => handleInputChange('addonStatus', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {addonStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Addon Added Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Added Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.addonAddedDate}
                  onChange={(e) => handleInputChange('addonAddedDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Proposed Total Hours */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Proposed Total Hours
              </label>
              <input
                type="number"
                value={formData.proposedTotalHours}
                onChange={(e) => handleInputChange('proposedTotalHours', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            {/* Schedule (In Weeks) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Schedule (In Weeks)
              </label>
              <input
                type="number"
                value={formData.scheduleInWeeks}
                onChange={(e) => handleInputChange('scheduleInWeeks', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            {/* Amount (USD) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">$</span>
                <input
                  type="number"
                  value={formData.amountUSD}
                  onChange={(e) => handleInputChange('amountUSD', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Amount (Project Currency) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Amount (Project Currency)
              </label>
              <input
                type="number"
                value={formData.amountProjectCurrency}
                onChange={(e) => handleInputChange('amountProjectCurrency', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Addon Requested Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Requested Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.addonRequestedDate}
                  onChange={(e) => handleInputChange('addonRequestedDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Addon Requested By */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Requested By
              </label>
              <input
                type="text"
                value={formData.addonRequestedBy}
                onChange={(e) => handleInputChange('addonRequestedBy', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter name"
              />
            </div>

            {/* Approved Hours */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Approved Hours
              </label>
              <input
                type="number"
                value={formData.approvedHours}
                onChange={(e) => handleInputChange('approvedHours', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            {/* Approved Amount (USD) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Approved Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">$</span>
                <input
                  type="number"
                  value={formData.approvedAmountUSD}
                  onChange={(e) => handleInputChange('approvedAmountUSD', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Approved Amount (Project Currency) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Approved Amount (Project Currency)
              </label>
              <input
                type="number"
                value={formData.approvedAmountProjectCurrency}
                onChange={(e) => handleInputChange('approvedAmountProjectCurrency', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Terms
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select payment terms</option>
                {paymentTermsOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            {/* Addon Action Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Action Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.addonActionDate}
                  onChange={(e) => handleInputChange('addonActionDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Addon Confirmed By */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Addon Confirmed By
              </label>
              <input
                type="text"
                value={formData.addonConfirmedBy}
                onChange={(e) => handleInputChange('addonConfirmedBy', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter name"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
          >
            {formData?.id ? 'Save Changes' : 'Add Addon'}
          </button>
        </div>
      </div>
    </>
  );
}