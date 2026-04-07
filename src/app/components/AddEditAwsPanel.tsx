import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';

export interface AwsFormData {
  id?: string;
  awsId: string;
  title: string;
  type: 'HostingServer' | 'Database' | 'Storage' | 'Other';
  serverType?: string;
  description?: string;
  subscriptionType: string;
  requestedDate: string;
  status: 'Requested' | 'Approved' | 'Provisioned' | 'Terminated';
  subscriptionStatus: 'Proposed' | 'Active' | 'Suspended' | 'Cancelled';
  configuration?: string;
  durationMonths?: number | string;
  startDate?: string;
  endDate?: string;
  confirmedDate: string;
  confirmedBy: string;
  supportPerson: string;
  amount: number | string;
  currency: string;
  amountUSD: number | string;
  projectName?: string;
}

interface AddEditAwsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AwsFormData) => void;
  initialData?: Partial<AwsFormData>;
  mode: 'add' | 'edit';
}

export function AddEditAwsPanel({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: AddEditAwsPanelProps) {
  const [formData, setFormData] = useState<AwsFormData>({
    awsId: '',
    title: '',
    type: 'HostingServer',
    serverType: '',
    description: '',
    subscriptionType: '',
    requestedDate: new Date().toISOString().split('T')[0],
    status: 'Requested',
    subscriptionStatus: 'Proposed',
    configuration: '',
    durationMonths: '',
    startDate: '',
    endDate: '',
    confirmedDate: new Date().toISOString().split('T')[0],
    confirmedBy: '',
    supportPerson: '',
    amount: '',
    currency: 'Indian Rupee - INR',
    amountUSD: '',
    projectName: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData } as AwsFormData);
    }
  }, [initialData]);

  const handleChange = (field: keyof AwsFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="text-primary-600">Add ::</span> Project AWS
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-neutral-900">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField>
                <FormLabel required>Title</FormLabel>
                <FormInput
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter Title"
                  required
                />
              </FormField>
              <FormField>
                <FormLabel required>Type</FormLabel>
                <FormSelect
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  <option value="HostingServer">HostingServer</option>
                  <option value="Database">Database</option>
                  <option value="Storage">Storage</option>
                  <option value="Other">Other</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Server Type</FormLabel>
                <FormInput
                  value={formData.serverType}
                  onChange={(e) => handleChange('serverType', e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </FormField>
              <FormField>
                <FormLabel required>Subscription Type</FormLabel>
                <FormSelect
                  value={formData.subscriptionType}
                  onChange={(e) => handleChange('subscriptionType', e.target.value)}
                  required
                >
                  <option value="">Please select Subscription Type</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="PayAsYouGo">Pay As You Go</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel>Duration Months</FormLabel>
                <FormInput
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => handleChange('durationMonths', e.target.value)}
                />
              </FormField>
              
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                  <FormField>
                    <FormLabel required>Start & End Date</FormLabel>
                    <FormInput
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                  </FormField>
                  <span className="pb-2 text-neutral-400">to</span>
                  <FormField>
                    <FormLabel>&nbsp;</FormLabel> {/* spacer */}
                    <FormInput
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      required
                    />
                  </FormField>
              </div>

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
                <FormLabel required>Confirmed By</FormLabel>
                <FormSelect
                  value={formData.confirmedBy}
                  onChange={(e) => handleChange('confirmedBy', e.target.value)}
                  required
                >
                  <option value="">Select Confirming Party</option>
                  <option value="Support">Support</option>
                  <option value="Client">Client</option>
                  <option value="Management">Management</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Support Person</FormLabel>
                <FormSelect
                  value={formData.supportPerson}
                  onChange={(e) => handleChange('supportPerson', e.target.value)}
                  required
                >
                  <option value="">Select Support Person</option>
                  <option value="Sourav Dokania">Sourav Dokania</option>
                  <option value="Admin User">Admin User</option>
                </FormSelect>
              </FormField>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField>
                <FormLabel required>Requested Date</FormLabel>
                <FormInput
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleChange('requestedDate', e.target.value)}
                  required
                />
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
                  <option value="Provisioned">Provisioned</option>
                  <option value="Terminated">Terminated</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Subscription Status</FormLabel>
                <FormSelect
                  value={formData.subscriptionStatus}
                  onChange={(e) => handleChange('subscriptionStatus', e.target.value)}
                  required
                >
                  <option value="Proposed">Proposed</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Cancelled">Cancelled</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Configuration</FormLabel>
                <FormTextarea
                  value={formData.configuration}
                  onChange={(e) => handleChange('configuration', e.target.value)}
                  rows={3}
                />
              </FormField>

              <FormField>
                <FormLabel required>Amount</FormLabel>
                <FormInput
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel required>Currency</FormLabel>
                <FormSelect
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  required
                >
                  <option value="Indian Rupee - INR">Indian Rupee - INR</option>
                  <option value="US Dollar - USD">US Dollar - USD</option>
                  <option value="Euro - EUR">Euro - EUR</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Amount (USD)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.amountUSD}
                  onChange={(e) => handleChange('amountUSD', e.target.value)}
                  required
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            {mode === 'add' ? 'Save AWS Project' : 'Update AWS Details'}
          </button>
        </div>
      </div>
    </>
  );
}