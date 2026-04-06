import { useState, useEffect } from 'react';
import { X, Calendar, FileText, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResourceEngagementData } from '../types/ResourceEngagement';

interface ResourceRenewalsEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  renewal?: ResourceEngagementData | null;
  onSave: (data: ResourceEngagementData) => void;
}

const initialRenewalData: ResourceEngagementData = {
  projectCode: '',
  projectName: '',
  clientName: '',
  crt: '',
  resourceType: '',
  resourceSkill: '',
  hireType: 'Full-Time',
  hireCycle: 'Monthly',
  noOfHours: 0,
  currency: 'USD',
  hourlyRate: 0,
  amountLocal: 0,
  amountUSD: 0,
  renewalStartDate: '',
  renewalEndDate: '',
  publishStatus: 'Draft',
  paymentStatus: 'Pending',
  paymentStatusDate: new Date().toISOString().split('T')[0],
  status: 'Active',
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

export function ResourceRenewalsEditSidePanel({
  isOpen,
  onClose,
  renewal,
  onSave,
}: ResourceRenewalsEditSidePanelProps) {
  const [formData, setFormData] = useState<ResourceEngagementData>(initialRenewalData);

  useEffect(() => {
    if (isOpen) {
      if (renewal) {
        setFormData({
          ...initialRenewalData,
          ...renewal,
        });
      } else {
        setFormData(initialRenewalData);
      }
    }
  }, [isOpen, renewal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-population for Project
    if (name === 'projectCode') {
      const selectedProject = mockProjects.find(p => p.projectCode === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectCode: value,
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
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {renewal ? 'Edit Resource Renewal' : 'Add New Renewal'}
            </h2>
            <p className="text-neutral-500 mt-1 uppercase tracking-wider font-medium text-[11px]">
              Manage resource billing cycles and renewals
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
          <form id="renewal-form" onSubmit={handleSubmit} className="space-y-8 pb-10">
            
            {/* Section 1: Project Information */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Project Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Project Code Selection <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a project code...</option>
                    {mockProjects.map(p => (
                      <option key={p.id} value={p.projectCode}>{p.projectCode} - {p.projectName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      readOnly
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      readOnly
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    CRT
                  </label>
                  <input
                    type="text"
                    value={formData.crt}
                    readOnly
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Resource Type (Designation / Seniority)
                  </label>
                  <select
                    name="resourceType"
                    value={formData.resourceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select designation...</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Lead Developer">Lead Developer</option>
                    <option value="Architect">Architect</option>
                    <option value="Junior Designer">Junior Designer</option>
                    <option value="Senior Designer">Senior Designer</option>
                    <option value="Lead Designer">Lead Designer</option>
                    <option value="Junior QA">Junior QA</option>
                    <option value="Senior QA">Senior QA</option>
                    <option value="QA Lead">QA Lead</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Senior DevOps Engineer">Senior DevOps Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Tech Lead">Tech Lead</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Resource Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Resource Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Resource Skill
                  </label>
                  <select
                    name="resourceSkill"
                    value={formData.resourceSkill}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select skill...</option>
                    <option value="React">React</option>
                    <option value="Angular">Angular</option>
                    <option value="Vue.js">Vue.js</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value=".NET">.NET</option>
                    <option value="PHP">PHP</option>
                    <option value="Ruby on Rails">Ruby on Rails</option>
                    <option value="Flutter">Flutter</option>
                    <option value="React Native">React Native</option>
                    <option value="iOS (Swift)">iOS (Swift)</option>
                    <option value="Android (Kotlin)">Android (Kotlin)</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="Docker/Kubernetes">Docker/Kubernetes</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="Figma">Figma</option>
                    <option value="Adobe XD">Adobe XD</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Manual Testing">Manual Testing</option>
                    <option value="Automation Testing">Automation Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Hire Type
                  </label>
                  <select
                    name="hireType"
                    value={formData.hireType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Full-Time">Full Time</option>
                    <option value="Part-Time">Part Time</option>
                    <option value="Average">Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Hire Cycle
                  </label>
                  <select
                    name="hireCycle"
                    value={formData.hireCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    No of Hours <span className="text-[10px] text-neutral-400">(Per Cycle)</span>
                  </label>
                  <input
                    type="number"
                    name="noOfHours"
                    value={formData.noOfHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Commercials */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Commercials
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
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Resource Amount ({formData.currency}) <span className="text-red-500">*</span>
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
                    Resource Amount (USD)
                  </label>
                  <div className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-semibold text-neutral-900 dark:text-white">
                    ${formData.amountUSD.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Schedule & Status */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                Schedule & Status
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Renewal Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="renewalStartDate"
                    value={formData.renewalStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Renewal End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="renewalEndDate"
                    value={formData.renewalEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Publish Status
                  </label>
                  <select
                    name="publishStatus"
                    value={formData.publishStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Cancelled">Cancelled</option>
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
                    <option value="Pending">Pending</option>
                    <option value="Requested">Requested</option>
                    <option value="Invoice Raised">Invoice Raised</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Payment & Tracking (Conditional - only if Invoice Raised) */}
            {(formData.paymentStatus === 'Invoice Raised' || formData.paymentStatus === 'Received') && (
              <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-green-500" />
                  Payment & Tracking
                </h3>

                <div className="grid grid-cols-2 gap-4">
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
                      Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select mode...</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Check">Check</option>
                      <option value="Cash">Cash</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Sub Payment Mode
                    </label>
                    <select
                      name="subPaymentMode"
                      value={formData.subPaymentMode || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select sub mode...</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                      <option value="IMPS">IMPS</option>
                      <option value="UPI">UPI</option>
                      <option value="SWIFT">SWIFT</option>
                      <option value="ACH">ACH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Transaction Cost
                    </label>
                    <input
                      type="number"
                      name="transactionCost"
                      value={formData.transactionCost || 0}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
                      placeholder="e.g. TXN-001"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
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
            form="renewal-form"
            className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {renewal ? 'Update Renewal' : 'Create Renewal'}
          </button>
        </div>
      </div>
    </>
  );
}