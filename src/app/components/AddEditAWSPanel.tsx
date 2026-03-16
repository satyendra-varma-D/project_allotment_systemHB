import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';

interface AWSFormData {
  id?: string;
  title: string;
  type: 'HostingServer' | 'EC2' | 'S3' | 'RDS' | 'Lambda' | 'CloudFront' | 'Other' | '';
  requestedDate: string;
  status: 'Requested' | 'Approved' | 'Active' | 'Inactive' | 'Cancelled';
  serverType: string;
  subscriptionStatus: 'Proposed' | 'Trial' | 'Active' | 'Suspended' | 'Expired' | 'Cancelled' | '';
  description?: string;
  configuration?: string;
  subscriptionType: 'Monthly' | 'Yearly' | 'Pay-as-you-go' | '';
  durationMonths: number | string;
  amount: number | string;
  startDate: string;
  endDate: string;
  currency: string;
  confirmedDate?: string;
  amountUSD?: number | string;
  confirmedBy?: string;
  supportPerson?: string;
  projectName?: string;
  clientName?: string;
}

interface AddEditAWSPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AWSFormData) => void;
  initialData?: Partial<AWSFormData>;
  mode: 'add' | 'edit';
}

export function AddEditAWSPanel({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: AddEditAWSPanelProps) {
  const [formData, setFormData] = useState<AWSFormData>({
    title: '',
    type: '',
    requestedDate: new Date().toISOString().split('T')[0],
    status: 'Requested',
    serverType: '',
    subscriptionStatus: '',
    description: '',
    configuration: '',
    subscriptionType: '',
    durationMonths: '',
    amount: '',
    startDate: '',
    endDate: '',
    currency: '',
    confirmedDate: '',
    amountUSD: '',
    confirmedBy: '',
    supportPerson: '',
    projectName: '',
    clientName: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData } as AWSFormData);
    }
  }, [initialData]);

  const handleChange = (field: keyof AWSFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl z-[101] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {mode === 'add' ? 'Add AWS Resource' : 'Edit AWS Resource'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {formData.title || 'Configure AWS infrastructure and subscriptions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Title & Requested Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Title</FormLabel>
                <FormInput
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </FormField>

              <FormField>
                <FormLabel required>Requested Date</FormLabel>
                <FormInput
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleChange('requestedDate', e.target.value)}
                  required
                />
              </FormField>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Type</FormLabel>
                <FormSelect
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="HostingServer">Hosting Server</option>
                  <option value="EC2">EC2</option>
                  <option value="S3">S3</option>
                  <option value="RDS">RDS</option>
                  <option value="Lambda">Lambda</option>
                  <option value="CloudFront">CloudFront</option>
                  <option value="Other">Other</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel required>Status</FormLabel>
                <FormSelect
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                >
                  <option value="Requested">Requested</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Cancelled">Cancelled</option>
                </FormSelect>
              </FormField>
            </div>

            {/* Server Type & Subscription Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel>Server Type</FormLabel>
                <FormInput
                  type="text"
                  value={formData.serverType}
                  onChange={(e) => handleChange('serverType', e.target.value)}
                  placeholder="Enter server type"
                />
              </FormField>

              <FormField>
                <FormLabel required>Subscription Status</FormLabel>
                <FormSelect
                  value={formData.subscriptionStatus}
                  onChange={(e) => handleChange('subscriptionStatus', e.target.value)}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Proposed">Proposed</option>
                  <option value="Trial">Trial</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </FormSelect>
              </FormField>
            </div>

            {/* Description & Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </FormField>

              <FormField>
                <FormLabel>Configuration</FormLabel>
                <FormTextarea
                  value={formData.configuration}
                  onChange={(e) => handleChange('configuration', e.target.value)}
                  placeholder="Enter configuration details"
                  rows={3}
                />
              </FormField>
            </div>

            {/* Subscription Type */}
            <FormField>
              <FormLabel required>Subscription Type</FormLabel>
              <FormSelect
                value={formData.subscriptionType}
                onChange={(e) => handleChange('subscriptionType', e.target.value)}
                required
              >
                <option value="">Please select Subscription Type</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Pay-as-you-go">Pay-as-you-go</option>
              </FormSelect>
            </FormField>

            {/* Duration Months & Amount */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel>Duration Months</FormLabel>
                <FormInput
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => handleChange('durationMonths', e.target.value)}
                  placeholder="0"
                />
              </FormField>

              <FormField>
                <FormLabel required>Amount</FormLabel>
                <FormInput
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </FormField>
            </div>

            {/* Start & End Date | Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-5">
                <FormField>
                  <FormLabel required>Start & End Date</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                    <FormInput
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                </FormField>
              </div>

              <FormField>
                <FormLabel required>Currency</FormLabel>
                <FormSelect
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  required
                >
                  <option value="">Select currency</option>
                  <option value="INR">Indian Rupee - INR</option>
                  <option value="USD">US Dollar - USD</option>
                  <option value="EUR">Euro - EUR</option>
                  <option value="GBP">British Pound - GBP</option>
                </FormSelect>
              </FormField>
            </div>

            {/* Confirmed Date & Amount (USD) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Confirmed Date</FormLabel>
                <FormInput
                  type="date"
                  value={formData.confirmedDate}
                  onChange={(e) => handleChange('confirmedDate', e.target.value)}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel required>Amount (USD)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.amountUSD}
                  onChange={(e) => handleChange('amountUSD', e.target.value)}
                  placeholder="Enter USD amount"
                  required
                />
              </FormField>
            </div>

            {/* Confirmed By */}
            <FormField>
              <FormLabel required>Confirmed By</FormLabel>
              <FormSelect
                value={formData.confirmedBy}
                onChange={(e) => handleChange('confirmedBy', e.target.value)}
                required
              >
                <option value="">Select approver</option>
                <option value="Support">Support</option>
                <option value="John Smith">John Smith</option>
                <option value="Michael Davis">Michael Davis</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Emily Brown">Emily Brown</option>
              </FormSelect>
            </FormField>

            {/* Support Person */}
            <FormField>
              <FormLabel required>Support Person</FormLabel>
              <FormSelect
                value={formData.supportPerson}
                onChange={(e) => handleChange('supportPerson', e.target.value)}
                required
              >
                <option value="">Select support person</option>
                <option value="Sourav Dokania">Sourav Dokania</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Robert Wilson">Robert Wilson</option>
                <option value="Emily Brown">Emily Brown</option>
                <option value="David Lee">David Lee</option>
              </FormSelect>
            </FormField>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
          >
            {mode === 'add' ? 'Add AWS Resource' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}