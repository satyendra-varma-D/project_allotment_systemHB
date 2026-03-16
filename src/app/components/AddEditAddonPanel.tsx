import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';

interface AddonFormData {
  id?: string;
  addonId: string;
  addonTitle: string;
  addonDescription?: string;
  addonType: 'Addon' | 'Support' | 'AMC';
  addonStatus: 'Identified' | 'Requested' | 'Confirmed' | 'Cancelled' | 'On Hold';
  addonAddedDate: string;
  proposedTotalHours: number | string;
  scheduleInWeeks: number | string;
  amountUSD: number | string;
  amountProjectCurrency: number | string;
  addonRequestedDate: string;
  addonRequestedBy: string;
  approvedHours?: number | string;
  approvedAmountUSD?: number | string;
  approvedAmountProjectCurrency?: number | string;
  paymentTerms?: string;
  addonActionDate?: string;
  addonConfirmedBy?: string;
  projectName?: string;
  clientName?: string;
}

interface AddEditAddonPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddonFormData) => void;
  initialData?: Partial<AddonFormData>;
  mode: 'add' | 'edit';
}

export function AddEditAddonPanel({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: AddEditAddonPanelProps) {
  const [formData, setFormData] = useState<AddonFormData>({
    addonId: '',
    addonTitle: '',
    addonDescription: '',
    addonType: 'Addon',
    addonStatus: 'Identified',
    addonAddedDate: new Date().toISOString().split('T')[0],
    proposedTotalHours: '',
    scheduleInWeeks: '',
    amountUSD: '',
    amountProjectCurrency: '',
    addonRequestedDate: new Date().toISOString().split('T')[0],
    addonRequestedBy: '',
    approvedHours: '',
    approvedAmountUSD: '',
    approvedAmountProjectCurrency: '',
    paymentTerms: '',
    addonActionDate: '',
    addonConfirmedBy: '',
    projectName: '',
    clientName: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData } as AddonFormData);
    }
  }, [initialData]);

  const handleChange = (field: keyof AddonFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // Check if status is Confirmed to show approved fields
  const showApprovedFields = formData.addonStatus === 'Confirmed';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-white dark:bg-neutral-900 shadow-2xl z-[101] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {mode === 'add' ? 'Add New Addon' : 'Edit Addon'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information Section */}
          <FormSection title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Addon Title</FormLabel>
                <FormInput
                  type="text"
                  value={formData.addonTitle}
                  onChange={(e) => handleChange('addonTitle', e.target.value)}
                  placeholder="Enter addon title"
                  required
                />
              </FormField>

              <FormField>
                <FormLabel required>Addon Added Date</FormLabel>
                <FormInput
                  type="date"
                  value={formData.addonAddedDate}
                  onChange={(e) => handleChange('addonAddedDate', e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField>
              <FormLabel>Addon Description</FormLabel>
              <FormTextarea
                value={formData.addonDescription}
                onChange={(e) => handleChange('addonDescription', e.target.value)}
                placeholder="Describe the addon requirements and scope"
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Addon Type</FormLabel>
                <FormSelect
                  value={formData.addonType}
                  onChange={(e) => handleChange('addonType', e.target.value)}
                  required
                >
                  <option value="Addon">Addon</option>
                  <option value="Support">Support</option>
                  <option value="AMC">AMC</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel required>Addon Status</FormLabel>
                <FormSelect
                  value={formData.addonStatus}
                  onChange={(e) => handleChange('addonStatus', e.target.value)}
                  required
                >
                  <option value="Identified">Identified</option>
                  <option value="Requested">Requested</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On Hold">On Hold</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          {/* Proposed Details Section - Only visible when status is Confirmed */}
          {showApprovedFields && (
            <FormSection title="Proposed Details">
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel required>Proposed Total Hours</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.proposedTotalHours}
                    onChange={(e) => handleChange('proposedTotalHours', e.target.value)}
                    placeholder="Enter hours"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Schedule (In Weeks)</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.scheduleInWeeks}
                    onChange={(e) => handleChange('scheduleInWeeks', e.target.value)}
                    placeholder="Enter weeks"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Amount (USD)</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.amountUSD}
                    onChange={(e) => handleChange('amountUSD', e.target.value)}
                    placeholder="Enter amount in USD"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel>Amount (Project Currency)</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.amountProjectCurrency}
                    onChange={(e) => handleChange('amountProjectCurrency', e.target.value)}
                    placeholder="Enter amount in project currency"
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Addon Requested Date</FormLabel>
                  <FormInput
                    type="date"
                    value={formData.addonRequestedDate}
                    onChange={(e) => handleChange('addonRequestedDate', e.target.value)}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Addon Requested By</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.addonRequestedBy}
                    onChange={(e) => handleChange('addonRequestedBy', e.target.value)}
                    placeholder="Enter requester name"
                    required
                  />
                </FormField>
              </div>
            </FormSection>
          )}

          {/* Project Information Section */}
          <FormSection 
            title="Project Information"
            subtitle={mode === 'edit' ? 'System Generated - Read Only' : undefined}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel>Project Name</FormLabel>
                <FormInput
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  placeholder={mode === 'add' ? 'Enter project name' : ''}
                  disabled={mode === 'edit'}
                  className={mode === 'edit' ? 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed' : ''}
                />
              </FormField>

              <FormField>
                <FormLabel>Client Name</FormLabel>
                <FormInput
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  placeholder={mode === 'add' ? 'Enter client name' : ''}
                  disabled={mode === 'edit'}
                  className={mode === 'edit' ? 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed' : ''}
                />
              </FormField>
            </div>
          </FormSection>

          {/* Approved Details Section - Visible only if Status is Confirmed */}
          {showApprovedFields && (
            <FormSection 
              title="Approved Details"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Approved Hours</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.approvedHours}
                    onChange={(e) => handleChange('approvedHours', e.target.value)}
                    placeholder="Enter approved hours"
                  />
                </FormField>

                <FormField>
                  <FormLabel>Addon Confirmed Date</FormLabel>
                  <FormInput
                    type="date"
                    value={formData.addonActionDate}
                    onChange={(e) => handleChange('addonActionDate', e.target.value)}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Approved Amount (USD)</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.approvedAmountUSD}
                    onChange={(e) => handleChange('approvedAmountUSD', e.target.value)}
                    placeholder="Enter approved amount in USD"
                  />
                </FormField>

                <FormField>
                  <FormLabel>Approved Amount (Project Currency)</FormLabel>
                  <FormInput
                    type="number"
                    value={formData.approvedAmountProjectCurrency}
                    onChange={(e) => handleChange('approvedAmountProjectCurrency', e.target.value)}
                    placeholder="Enter approved amount"
                  />
                </FormField>

                <FormField className="col-span-2">
                  <FormLabel>Addon Confirmed By</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.addonConfirmedBy}
                    onChange={(e) => handleChange('addonConfirmedBy', e.target.value)}
                    placeholder="Enter confirmer name"
                  />
                </FormField>
              </div>

              <FormField>
                <FormLabel>Payment Terms</FormLabel>
                <FormSelect
                  value={formData.paymentTerms}
                  onChange={(e) => handleChange('paymentTerms', e.target.value)}
                >
                  <option value="">Select payment terms</option>
                  <option value="PT-001">50:50 Model</option>
                  <option value="PT-002">30:40:30 Model</option>
                  <option value="PT-003">20:30:30:20 Model</option>
                  <option value="PT-004">25:25:25:25 Model</option>
                  <option value="PT-005">40:35:25 Model</option>
                  <option value="custom">Custom Payment Terms</option>
                </FormSelect>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Selecting a payment term will automatically create milestones in the Milestone Module for this project/addon
                </p>
              </FormField>
            </FormSection>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-end gap-3 bg-white dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium text-sm"
          >
            {mode === 'add' ? 'Add Addon' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}