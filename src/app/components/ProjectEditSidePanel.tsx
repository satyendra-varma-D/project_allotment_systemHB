import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ProjectEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    crmId: string;
    subject: string;
    projectCode: string;
    projectName: string;
    projectType: string;
    businessType: string;
    domain: string;
    industry: string;
  } | null;
  onSave?: (data: any) => void;
}

export function ProjectEditSidePanel({ isOpen, onClose, project, onSave }: ProjectEditSidePanelProps) {
  const [formData, setFormData] = useState({
    subject: project?.subject || '',
    projectName: project?.projectName || '',
    projectType: project?.projectType || 'Fixed Cost',
    businessType: project?.businessType || 'New',
    domain: project?.domain || 'Digital Experience',
    industry: project?.industry || 'Technology',
  });

  // Update form data when project changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        subject: project?.subject || '',
        projectName: project?.projectName || '',
        projectType: project?.projectType || 'Fixed Cost',
        businessType: project?.businessType || 'New',
        domain: project?.domain || 'Digital Experience',
        industry: project?.industry || 'Technology',
      });
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Handle save logic
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {project ? 'Edit Project Details' : 'Add New Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* CRM Code (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                CRM Code
              </label>
              <input
                type="text"
                value={project?.crmId || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Project Code (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Code
              </label>
              <input
                type="text"
                value={project?.projectCode || ''}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Type
              </label>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                Controls the project structure (Milestones vs Resources).
              </div>
              <div className="relative">
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Fixed Cost">Fixed Cost</option>
                  <option value="Hire">Hire</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Business Type
              </label>
              <div className="relative">
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="New">New</option>
                  <option value="Existing">Existing</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Domain
              </label>
              <div className="relative">
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Digital Experience">Digital Experience</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Finance & Banking">Finance & Banking</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Transportation & Logistics">Transportation & Logistics</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Industry
              </label>
              <div className="relative">
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Energy & Utilities">Energy & Utilities</option>
                  <option value="Government">Government</option>
                  <option value="Non-Profit">Non-Profit</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              Save Changes
              <span className="text-xs opacity-75">?</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}