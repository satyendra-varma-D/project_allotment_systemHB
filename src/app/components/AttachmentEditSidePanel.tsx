import { useState, useEffect } from 'react';
import { X, Upload, FileText, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AttachmentEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attachment: any) => void;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export function AttachmentEditSidePanel({
  isOpen,
  onClose,
  onSave,
  teamMembers,
}: AttachmentEditSidePanelProps) {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    fileName: '',
    assignedMembers: [] as string[],
    attachWithProject: 'Yes',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset form when panel opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: '',
        description: '',
        fileName: '',
        assignedMembers: [],
        attachWithProject: 'Yes',
      });
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, fileName: file.name });
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedMembers: prev.assignedMembers.includes(memberId)
        ? prev.assignedMembers.filter((id) => id !== memberId)
        : [...prev.assignedMembers, memberId],
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.category) {
      alert('Please select an attachment category');
      return;
    }
    if (!selectedFile) {
      alert('Please upload a file');
      return;
    }
    if (formData.assignedMembers.length === 0) {
      alert('Please assign at least one team member');
      return;
    }

    const newAttachment = {
      id: `attachment-${Date.now()}`,
      fileName: formData.fileName,
      category: formData.category,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description,
      assignedMembers: formData.assignedMembers,
      attachWithProject: formData.attachWithProject === 'Yes',
      isConfidential: formData.attachWithProject === 'No',
    };

    onSave(newAttachment);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const attachmentCategories = [
    'Project Documents',
    'Contracts & Legal',
    'Technical Specifications',
    'Design Assets',
    'Financial Documents',
    'Meeting Notes',
    'Reports & Analytics',
    'Marketing Materials',
    'Training Materials',
    'Other',
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Upload New Attachment
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Add documents and files to the project
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-200">
                All fields are required. Files will be uploaded to the project repository and accessible to assigned team members.
              </p>
            </div>

            {/* Attachment Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Attachment Category
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {attachmentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a brief description of this attachment..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent resize-none"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Describe the content, purpose, or key information contained in this file
              </p>
            </div>

            {/* Upload Attachment */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Upload Attachment
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PDF, DOC, XLS, PPT, ZIP, Images (Max 50MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 dark:text-green-200 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFormData({ ...formData, fileName: '' });
                    }}
                    className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Assign Members */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Assign Members (Business Unit Team)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                Select team members who should have access to this attachment
              </p>
              <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedMembers.includes(member.id)}
                        onChange={() => handleMemberToggle(member.id)}
                        className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {formData.assignedMembers.length > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ {formData.assignedMembers.length} member(s) selected
                </p>
              )}
            </div>

            {/* Attach With Project */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Attach With Project?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                Choose whether this attachment is linked to the project or kept as a confidential document
              </p>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`
                    relative flex items-center justify-center px-4 py-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      formData.attachWithProject === 'Yes'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="attachWithProject"
                    value="Yes"
                    checked={formData.attachWithProject === 'Yes'}
                    onChange={(e) => setFormData({ ...formData, attachWithProject: e.target.value })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <CheckCircle2
                      className={`w-6 h-6 mx-auto mb-2 ${
                        formData.attachWithProject === 'Yes'
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        formData.attachWithProject === 'Yes'
                          ? 'text-primary-700 dark:text-primary-400'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Yes
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Public Access
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    relative flex items-center justify-center px-4 py-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      formData.attachWithProject === 'No'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="attachWithProject"
                    value="No"
                    checked={formData.attachWithProject === 'No'}
                    onChange={(e) => setFormData({ ...formData, attachWithProject: e.target.value })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <AlertCircle
                      className={`w-6 h-6 mx-auto mb-2 ${
                        formData.attachWithProject === 'No'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        formData.attachWithProject === 'No'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      No
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Confidential
                    </p>
                  </div>
                </label>
              </div>
              {formData.attachWithProject === 'No' && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>Note:</strong> This attachment will be marked as confidential and restricted to assigned members only.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            * All fields are required
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Upload Attachment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}