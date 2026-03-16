import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

export interface MilestoneData {
  id?: string;
  milestoneName: string;
  milestoneCode: string;
  projectId: string;
  paymentStatus: string;
  plannedDate: string;
  actualDate: string;
  completionStatus: string;
  approvalStatus: string;
  invoiceStatus: string;
  assignedTo: string;
  priority: string;
  remarks: string;
}

interface MilestonesEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: MilestoneData | null;
  onSave: (data: MilestoneData) => void;
}

const initialMilestoneData: MilestoneData = {
  milestoneName: '',
  milestoneCode: '',
  projectId: '',
  paymentStatus: '',
  plannedDate: '',
  actualDate: '',
  completionStatus: 'Not Started',
  approvalStatus: 'Pending',
  invoiceStatus: 'Not Generated',
  assignedTo: '',
  priority: 'Medium',
  remarks: '',
};

export function MilestonesEditSidePanel({
  isOpen,
  onClose,
  milestone,
  onSave,
}: MilestonesEditSidePanelProps) {
  const [formData, setFormData] = useState<MilestoneData>(initialMilestoneData);

  useEffect(() => {
    if (isOpen) {
      setFormData(milestone || initialMilestoneData);
    }
  }, [isOpen, milestone]);

  const handleInputChange = (field: keyof MilestoneData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.milestoneName) {
      alert('Please enter milestone name');
      return;
    }
    if (!formData.milestoneCode) {
      alert('Please enter milestone code');
      return;
    }
    if (!formData.projectId) {
      alert('Please select a project');
      return;
    }
    if (!formData.paymentStatus) {
      alert('Please enter payment percentage');
      return;
    }
    if (!formData.plannedDate) {
      alert('Please select planned date');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

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
              {formData?.id ? 'Edit Milestone' : 'Add New Milestone'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {formData?.milestoneCode || 'Track milestone-level delivery and payment execution'}
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
          <div className="space-y-5">
            {/* Milestone Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Milestone Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.milestoneName}
                onChange={(e) => handleInputChange('milestoneName', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter milestone name"
              />
            </div>

            {/* Milestone Code */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Milestone Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.milestoneCode}
                onChange={(e) => handleInputChange('milestoneCode', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., REQ-ANALYSIS"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select project</option>
                <option value="PRJ-2024-001">Enterprise CRM Platform</option>
                <option value="PRJ-2024-002">Mobile Banking App</option>
                <option value="PRJ-2024-003">E-Commerce Platform Redesign</option>
              </select>
            </div>

            {/* Payment Percentage */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Percentage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.paymentStatus}
                onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter percentage"
                min="0"
                max="100"
              />
            </div>

            {/* Planned Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Planned Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => handleInputChange('plannedDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Actual Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Actual Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.actualDate}
                  onChange={(e) => handleInputChange('actualDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Completion Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Completion Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.completionStatus}
                onChange={(e) => handleInputChange('completionStatus', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>

            {/* Approval Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Approval Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.approvalStatus}
                onChange={(e) => handleInputChange('approvalStatus', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Invoice Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Invoice Status
              </label>
              <select
                value={formData.invoiceStatus}
                onChange={(e) => handleInputChange('invoiceStatus', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="Not Generated">Not Generated</option>
                <option value="Generated">Generated</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Assigned To
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter assignee name"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter remarks"
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
            {formData?.id ? 'Save Changes' : 'Add Milestone'}
          </button>
        </div>
      </div>
    </>
  );
}