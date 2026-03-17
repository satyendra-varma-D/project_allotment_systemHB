import { X, Send, Eye } from 'lucide-react';
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
  clientType: 'New' | 'Existing';
  technologyPlatform: string;
}

interface ProjectEmailPreviewProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onOpenComposer: (activeTab: 'account' | 'support' | 'project') => void;
}

export function ProjectEmailPreview({ project, isOpen, onClose, onOpenComposer }: ProjectEmailPreviewProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'support' | 'project'>('project');

  if (!isOpen) return null;
  if (!project) return null;

  const handleSendClick = () => {
    onClose(); // Close preview
    onOpenComposer(activeTab); // Pass the active tab to composer
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
              Email Preview
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {project.projectName} - {project.projectId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSendClick}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-6 bg-neutral-100 dark:bg-neutral-800/50">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'account'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'support'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Support
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'project'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Project
          </button>
        </div>

        {/* Email Content Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {project.subject}
          </h3>
          <p className="text-sm text-primary-100">
            {project.projectId} ({project.crmCode})
          </p>
        </div>

        {/* Email Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Account Tab Content */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Product Overview */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Product Overview
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Product Code</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectId} ({project.crmCode})</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Product Name</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectName}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Start Date</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.startDate}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">End Date</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.expectedEndDate}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Biz Member</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.salesExecutive}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Tech Member</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.techBA}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Domain</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.domain || 'N/A'}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Industry</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.industry || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Client Team */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Client Team
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Client Name</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.clientName}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Client Contact</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">John Smith</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Email</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">john.smith@{project.clientName.toLowerCase().replace(/\s/g, '')}.com</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Phone</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">+1 (555) 123-4567</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Client Type</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.clientType}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Commercial Details */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Commercial Details
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Project Value</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">${project.commercialValue.toLocaleString()}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Project Category</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectType}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Payment Terms</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Milestone-based</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Currency</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Agreements & Invoice */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Agreements & Invoice
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Contract Type</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Master Service Agreement</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Contract Date</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.createdDate}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Invoice Status</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Paid</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Next Invoice</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">2024-03-15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Support Tab Content */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {/* Pre-Sales Team */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Pre-Sales Team
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Sales Executive</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.salesExecutive}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Technical BA</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.techBA}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Confirmed Date</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.confirmedDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Post-Sales Team */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Post-Sales Team
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Project Manager</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectManager}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Delivery Manager</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.deliveryManager}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">QA Lead</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Michael Torres</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Tech Lead</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Sarah Kim</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Resource Allocation */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Resource Allocation
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Frontend Developers</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">3 developers</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Backend Developers</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">2 developers</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">QA Engineers</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">2 engineers</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">DevOps Engineer</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">1 engineer</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Milestone Listing */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Milestone Listing
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-2/3">Milestone 1: Requirements & Design</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">Completed</span>
                      </td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Milestone 2: Development Phase 1</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">In Progress</span>
                      </td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Milestone 3: Testing & QA</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-center">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded text-xs font-medium">Pending</span>
                      </td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Milestone 4: Deployment & Go-Live</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-center">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded text-xs font-medium">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Attachments
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">PDF</span>
                          </div>
                          <span>Project_Proposal_{project.projectId}.pdf</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">XLS</span>
                          </div>
                          <span>Project_Timeline_{project.projectId}.xlsx</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">DOC</span>
                          </div>
                          <span>Technical_Specification_{project.projectId}.docx</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Project Tab Content */}
          {activeTab === 'project' && (
            <div className="space-y-6">
              {/* Project Details */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Project Details
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Project Name</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectName}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Project Type</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectType}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Status</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.projectStatus}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Progress</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.overallProgress}%</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Priority Level</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.priorityLevel || 'Medium'}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Risk Indicator</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.riskIndicator || 'Low'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Technology Stack */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Technology Stack
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Platform</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{project.technologyPlatform}</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Frontend</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">React, TypeScript, Tailwind CSS</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Backend</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Node.js, Express, PostgreSQL</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">DevOps</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">Docker, Kubernetes, CI/CD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule & Efforts */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Schedule & Efforts
                </h4>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 w-1/3">Total Effort</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">1,200 hours</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Completed Effort</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">{Math.round(1200 * (project.overallProgress / 100))} hours</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Team Size</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">8 members</td>
                    </tr>
                    <tr className="border border-neutral-300 dark:border-neutral-700">
                      <td className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Duration</td>
                      <td className="bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-white">6 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sales Notes */}
              <div>
                <h4 className="bg-primary-500 text-white px-4 py-2 font-semibold mb-0">
                  Sales Notes
                </h4>
                <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
                  <p>
                    <strong>Initial Contact:</strong> Client reached out through website inquiry form on {project.createdDate}.
                  </p>
                  <p>
                    <strong>Discovery Meeting:</strong> Conducted comprehensive discovery session to understand business requirements and technical constraints.
                  </p>
                  <p>
                    <strong>Proposal Submitted:</strong> Detailed proposal with technical architecture and pricing submitted on {project.confirmedDate}.
                  </p>
                  <p>
                    <strong>Risk Assessment:</strong> Risk level assessed as <strong>{project.riskIndicator || 'Low'}</strong> based on technical complexity and timeline constraints.
                  </p>
                  <p>
                    <strong>Next Steps:</strong> Regular bi-weekly status meetings scheduled. Next milestone review on March 15, 2024.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSendClick}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}