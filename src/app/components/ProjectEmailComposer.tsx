import { X, Send, Paperclip } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  projectId: string; // Auto-generated
  crmCode: string; // Auto-generated CRM code
  subject: string; // Editable subject
  projectName: string;
  clientName: string;
  projectType: 'Fixed Cost' | 'Hire';
  projectManager: string;
  deliveryManager: string;
  startDate: string;
  expectedEndDate: string;
  projectStatus: 'Created' | 'Draft' | 'Published' | 'On Hold' | 'Cancelled';
  overallProgress: number;
  commercialValue: number;
  domain?: string;
  industry?: string;
  linkedLeadId?: string;
  riskIndicator?: 'Low' | 'Medium' | 'High';
  priorityLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  createdDate: string;
  modifiedDate: string;
  salesExecutive: string;
  techBA: string;
  confirmedDate: string;
  businessType: 'New' | 'Existing';
  technologyPlatform: string;
}

interface ProjectEmailComposerProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'account' | 'support' | 'project';
}

export function ProjectEmailComposer({ project, isOpen, onClose, initialTab = 'project' }: ProjectEmailComposerProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'support' | 'project'>(initialTab);
  const [emailFrom] = useState('crm@company.com');
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailBcc, setEmailBcc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // Update subject when project changes
  if (project && emailSubject === '') {
    setEmailSubject(`Project Update: ${project.projectName} (${project.projectId})`);
  }

  // Selected sections - only select sections from the initial tab
  const [selectedSections, setSelectedSections] = useState({
    account: {
      productOverview: initialTab === 'account',
      clientTeam: initialTab === 'account',
      commercialDetails: initialTab === 'account',
      agreementsInvoice: initialTab === 'account'
    },
    support: {
      preSalesTeam: initialTab === 'support',
      postSalesTeam: initialTab === 'support',
      resourceAllocation: initialTab === 'support',
      milestones: initialTab === 'support',
      attachments: initialTab === 'support'
    },
    project: {
      projectDetails: initialTab === 'project',
      technologyStack: initialTab === 'project',
      scheduleEfforts: initialTab === 'project',
      salesNotes: initialTab === 'project'
    }
  });

  if (!isOpen) return null;
  if (!project) return null;

  const handleSend = () => {
    if (!emailTo) {
      alert('Please enter recipient email address');
      return;
    }
    alert('Email sent successfully!');
    onClose();
  };

  const toggleSection = (tab: 'account' | 'support' | 'project', section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [section]: !prev[tab][section as keyof typeof prev[typeof tab]]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Compose Email
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {project.projectName} - {project.projectId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Email Fields */}
        <div className="px-6 py-4 space-y-3 border-b border-neutral-200 dark:border-neutral-800">
          {/* From Field */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20">From:</label>
            <input
              type="email"
              value={emailFrom}
              readOnly
              className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm rounded border border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* To Field */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20">To:</label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex items-center gap-2">
              {!showCc && (
                <button
                  onClick={() => setShowCc(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  onClick={() => setShowBcc(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* Cc Field */}
          {showCc && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20">Cc:</label>
              <input
                type="email"
                value={emailCc}
                onChange={(e) => setEmailCc(e.target.value)}
                placeholder="cc@example.com (separate multiple emails with commas)"
                className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={() => setShowCc(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          )}

          {/* Bcc Field */}
          {showBcc && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20">Bcc:</label>
              <input
                type="email"
                value={emailBcc}
                onChange={(e) => setEmailBcc(e.target.value)}
                placeholder="bcc@example.com (separate multiple emails with commas)"
                className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={() => setShowBcc(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-20">Subject:</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tabs for Content Selection */}
        <div className="flex items-center gap-0 px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-2.5 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'account'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-2.5 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'support'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Support
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-6 py-2.5 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'project'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Project
          </button>
        </div>

        {/* Content Selection - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Select sections to include in the email:
          </div>

          {/* Account Tab Sections */}
          {activeTab === 'account' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.account.productOverview}
                  onChange={() => toggleSection('account', 'productOverview')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Product Overview</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project code, name, dates, business & technical members, domain, industry
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.account.clientTeam}
                  onChange={() => toggleSection('account', 'clientTeam')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Client Team</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Client name, contact person, email, phone, client type
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.account.commercialDetails}
                  onChange={() => toggleSection('account', 'commercialDetails')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Commercial Details</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project value, category, payment terms, currency
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.account.agreementsInvoice}
                  onChange={() => toggleSection('account', 'agreementsInvoice')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Agreements & Invoice</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Contract type, contract date, invoice status, next invoice date
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Support Tab Sections */}
          {activeTab === 'support' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.support.preSalesTeam}
                  onChange={() => toggleSection('support', 'preSalesTeam')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Pre-Sales Team</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Sales executive, technical BA, confirmed date
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.support.postSalesTeam}
                  onChange={() => toggleSection('support', 'postSalesTeam')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Post-Sales Team</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project manager, delivery manager, QA lead, tech lead
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.support.resourceAllocation}
                  onChange={() => toggleSection('support', 'resourceAllocation')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Resource Allocation</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Team composition: frontend, backend, QA, DevOps resources
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.support.milestones}
                  onChange={() => toggleSection('support', 'milestones')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Milestone Listing</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project milestones with status (completed, in progress, pending)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.support.attachments}
                  onChange={() => toggleSection('support', 'attachments')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Attachments</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project documents: proposals, timelines, specifications
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Project Tab Sections */}
          {activeTab === 'project' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.project.projectDetails}
                  onChange={() => toggleSection('project', 'projectDetails')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Project Details</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Project name, type, status, progress, priority, risk indicator
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.project.technologyStack}
                  onChange={() => toggleSection('project', 'technologyStack')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Technology Stack</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Platform, frontend, backend, DevOps technologies
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.project.scheduleEfforts}
                  onChange={() => toggleSection('project', 'scheduleEfforts')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Schedule & Efforts</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Total effort, completed effort, team size, duration
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections.project.salesNotes}
                  onChange={() => toggleSection('project', 'salesNotes')}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">Sales Notes</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Initial contact, discovery meeting, proposal, risk assessment, next steps
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <Paperclip className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {Object.values(selectedSections).reduce((total, tab) => 
                total + Object.values(tab).filter(Boolean).length, 0
              )} sections selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}