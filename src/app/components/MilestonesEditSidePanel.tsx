import { useState, useEffect } from 'react';
import { X, Calendar, FileText, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface MilestoneData {
  id?: string;
  milestoneName: string;
  milestoneCode: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  crt: string;
  currency: string;
  milestonePercentage: number;
  amountLocal: number;
  amountUSD: number;
  milestoneType: 'Fixed' | 'T&M' | 'Retainer' | 'Support';
  plannedDate: string;
  actualDate: string;
  deliverable?: string;
  paymentStatus: 'Draft' | 'Published' | 'Requested' | 'Invoice Raised' | 'Received';
  paymentStatusDate: string;
  completionStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  invoiceNumber?: string;
  paymentMode?: 'Bank Transfer' | 'Credit Card' | 'Check' | 'Cash';
  subPaymentMode?: string;
  transactionCost?: number;
  transactionNumber?: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
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
  projectCode: '',
  projectName: '',
  clientName: '',
  crt: '',
  currency: 'USD',
  milestonePercentage: 0,
  amountLocal: 0,
  amountUSD: 0,
  milestoneType: 'Fixed',
  plannedDate: '',
  actualDate: '',
  deliverable: '',
  paymentStatus: 'Draft',
  paymentStatusDate: new Date().toISOString().split('T')[0],
  completionStatus: 'Not Started',
  approvalStatus: 'Pending',
  assignedTo: '',
  priority: 'Medium',
  remarks: '',
};

const mockProjects = [
  {
    id: 'PRJ-2024-001',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.',
    crt: 'Sarah Wilson',
  },
  {
    id: 'PRJ-2024-002',
    projectCode: 'MB-001',
    projectName: 'Mobile Banking App',
    clientName: 'Bank of America',
    crt: 'Michael Ross',
  },
  {
    id: 'PRJ-2024-003',
    projectCode: 'EC-001',
    projectName: 'E-Commerce Platform Redesign',
    clientName: 'Retail Giant',
    crt: 'Jessica Lee',
  },
];

export function MilestonesEditSidePanel({
  isOpen,
  onClose,
  milestone,
  onSave,
}: MilestonesEditSidePanelProps) {
  const [formData, setFormData] = useState<MilestoneData>(initialMilestoneData);

  useEffect(() => {
    if (isOpen) {
      if (milestone) {
        setFormData({
          ...initialMilestoneData,
          ...milestone,
        });
      } else {
        setFormData(initialMilestoneData);
      }
    }
  }, [isOpen, milestone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-population for Project
    if (name === 'projectId') {
      const selectedProject = mockProjects.find(p => p.id === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectId: value,
          projectCode: selectedProject.projectCode,
          projectName: selectedProject.projectName,
          clientName: selectedProject.clientName,
          crt: selectedProject.crt,
        }));
        return;
      }
    }

    // Amount Conversion logic
    if (name === 'amountLocal' || name === 'currency') {
      const newLocal = name === 'amountLocal' ? parseFloat(value) || 0 : formData.amountLocal;
      const newCurrency = name === 'currency' ? value : formData.currency;
      
      let newUSD = newLocal;
      if (newCurrency === 'EUR') newUSD = newLocal * 1.08;
      else if (newCurrency === 'GBP') newUSD = newLocal * 1.27;
      else if (newCurrency === 'INR') newUSD = newLocal / 83;

      setFormData(prev => ({
        ...prev,
        amountLocal: newLocal,
        currency: newCurrency,
        amountUSD: Math.round(newUSD),
      }));
      return;
    }

    // Payment Status Date auto-population
    if (name === 'paymentStatus' && (value === 'Received' || value === 'Invoice Raised' || value === 'Requested')) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        paymentStatusDate: new Date().toISOString().split('T')[0],
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {milestone ? 'Edit Milestone' : 'Add Milestone'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Configure project milestones and commercial tracking
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <form id="milestone-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
            
            {/* Section 1: Basic Information */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Project Selection <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a project...</option>
                    {mockProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName} ({p.projectCode})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="milestoneName"
                      value={formData.milestoneName}
                      onChange={handleInputChange}
                      placeholder="e.g. Design Completion"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="milestoneCode"
                      value={formData.milestoneCode}
                      onChange={handleInputChange}
                      placeholder="e.g. MS-01"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                {formData.projectId && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Project Code</label>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{formData.projectCode}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Client</label>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{formData.clientName}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">CRT Representative</label>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{formData.crt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Commercial Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Commercial Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Milestone %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="milestonePercentage"
                      value={formData.milestonePercentage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Amount ({formData.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amountLocal"
                    value={formData.amountLocal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Equivalent Amount (USD)
                  </label>
                  <div className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-semibold text-neutral-900 dark:text-white">
                    ${formData.amountUSD.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Status Tracking */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Status Tracking
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Planned Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="plannedDate"
                    value={formData.plannedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Actual Date
                  </label>
                  <input
                    type="date"
                    name="actualDate"
                    value={formData.actualDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Completion Status
                  </label>
                  <select
                    name="completionStatus"
                    value={formData.completionStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Requested">Requested</option>
                    <option value="Invoice Raised">Invoice Raised</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Payment & Tracking (Conditional) */}
            {(formData.paymentStatus === 'Received' || formData.paymentStatus === 'Invoice Raised' || formData.paymentStatus === 'Requested') && (
              <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Payment & Tracking
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. INV-001"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Payment Status Date
                    </label>
                    <input
                      type="date"
                      name="paymentStatusDate"
                      value={formData.paymentStatusDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {formData.paymentStatus === 'Received' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Payment Mode
                        </label>
                        <select
                          name="paymentMode"
                          value={formData.paymentMode || 'Bank Transfer'}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Check">Check</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Transaction Number
                        </label>
                        <input
                          type="text"
                          name="transactionNumber"
                          value={formData.transactionNumber || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Section 5: Deliverables & Remarks */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-500" />
                Deliverables & Remarks
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Deliverables
                  </label>
                  <input
                    type="text"
                    name="deliverable"
                    value={formData.deliverable || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. SRS Document, UI Mockups"
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="milestone-form"
            className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {milestone ? 'Update Milestone' : 'Confirm & Create'}
          </button>
        </div>
      </div>
    </>
  );
}