import { useState, useEffect, useRef } from 'react';
import { X, Upload, File, Trash2, CheckCircle2, XCircle, Users, Link2 } from 'lucide-react';

interface AgreementItem {
  name: string;
  status: boolean;
  fileName?: string;
  fileSize?: string;
  requiresAttachment: boolean;
  assignedMembers?: string[]; // New field for assigned members
  attachedToProject?: boolean; // New field for project attachment
}

interface AgreementsData {
  invoiceSent: AgreementItem;
  paymentSwiftCopy: AgreementItem;
  hbNda: AgreementItem;
  clientNda: AgreementItem;
  hireAgreement: AgreementItem;
  postDeliverySupport: AgreementItem;
  proposalCopySigned: AgreementItem;
  designDevelopByHB: AgreementItem;
  portfolioDisplay: AgreementItem;
}

interface AgreementsEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: AgreementsData;
  projectType: string;
  onSave: (data: AgreementsData) => void;
}

export function AgreementsEditSidePanel({
  isOpen,
  onClose,
  currentData,
  projectType,
  onSave,
}: AgreementsEditSidePanelProps) {
  const [agreements, setAgreements] = useState<AgreementsData>(currentData);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Mock employee list for assignment
  const mockEmployees = [
    { id: '1', name: 'John Anderson' },
    { id: '2', name: 'Sarah Mitchell' },
    { id: '3', name: 'Emily Chen' },
    { id: '4', name: 'Michael Brown' },
    { id: '5', name: 'David Wilson' },
    { id: '6', name: 'Rachel Green' },
    { id: '7', name: 'James Martinez' },
    { id: '8', name: 'Lisa Anderson' },
  ];

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      setAgreements(currentData);
    }
  }, [isOpen, currentData]);

  const handleStatusToggle = (key: keyof AgreementsData, value: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: value,
        // Clear attachment if status is set to No
        ...(value === false && { fileName: undefined, fileSize: undefined }),
      },
    }));
  };

  const handleFileSelect = (key: keyof AgreementsData) => {
    fileInputRefs.current[key]?.click();
  };

  const handleFileChange = (key: keyof AgreementsData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const displaySize = parseFloat(fileSizeMB) >= 1 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

      setAgreements((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          fileName: file.name,
          fileSize: displaySize,
        },
      }));
    }
  };

  const handleRemoveFile = (key: keyof AgreementsData) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        fileName: undefined,
        fileSize: undefined,
      },
    }));
    // Clear the file input
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]!.value = '';
    }
  };

  const handleMemberToggle = (key: keyof AgreementsData, memberId: string) => {
    setAgreements((prev) => {
      const currentMembers = prev[key].assignedMembers || [];
      const isSelected = currentMembers.includes(memberId);
      
      return {
        ...prev,
        [key]: {
          ...prev[key],
          assignedMembers: isSelected
            ? currentMembers.filter(id => id !== memberId)
            : [...currentMembers, memberId],
        },
      };
    });
  };

  const handleProjectAttachment = (key: keyof AgreementsData, value: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        attachedToProject: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(agreements);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const agreementFields: { key: keyof AgreementsData; label: string }[] = [
    { key: 'invoiceSent', label: 'Invoice Sent' },
    { key: 'paymentSwiftCopy', label: 'Payment Swift Copy Attached' },
    { key: 'hbNda', label: 'HB NDA' },
    { key: 'clientNda', label: 'Client NDA' },
    { key: 'hireAgreement', label: 'Hire Agreement Signed' },
    { key: 'postDeliverySupport', label: 'Post Delivery Support Agreement' },
    { key: 'proposalCopySigned', label: 'Proposal Copy Signed' },
    { key: 'designDevelopByHB', label: 'Design & Develop By HB *' },
    { key: 'portfolioDisplay', label: 'Portfolio Display' },
  ];

  // Filter agreement fields based on project type
  const filteredAgreementFields = agreementFields.filter((field) => {
    // Show "Hire Agreement Signed" only for HIRE projects
    if (field.key === 'hireAgreement') return projectType === 'Hire';
    // Show "Post Delivery Support Agreement" only for Fixed Cost projects
    if (field.key === 'postDeliverySupport') return projectType === 'Fixed Cost';
    // Show all other agreements
    return true;
  });

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
              Edit MSA / Agreement / Invoice
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage agreements, invoices, and related documents
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
            {filteredAgreementFields.map((field) => {
              const agreement = agreements[field.key];
              const showUpload = agreement.requiresAttachment && agreement.status;

              return (
                <div
                  key={field.key}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5"
                >
                  {/* Agreement Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        {field.label}
                      </label>
                      {agreement.requiresAttachment && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Attachment required if set to "Yes"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Yes/No Toggle */}
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => handleStatusToggle(field.key, true)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        agreement.status
                          ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-500 text-green-700 dark:text-green-400'
                          : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Yes</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStatusToggle(field.key, false)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        !agreement.status
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-500 text-red-700 dark:text-red-400'
                          : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />
                        <span>No</span>
                      </div>
                    </button>
                  </div>

                  {/* File Upload Section */}
                  {showUpload && (
                    <div className="space-y-3">
                      {!agreement.fileName ? (
                        <button
                          onClick={() => handleFileSelect(field.key)}
                          className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors bg-neutral-50 dark:bg-neutral-800/50"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Click to upload attachment
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                PDF, DOC, DOCX, or image files
                              </p>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                            <File className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                              {agreement.fileName}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {agreement.fileSize}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(field.key)}
                            className="flex-shrink-0 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                          </button>
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => (fileInputRefs.current[field.key] = el)}
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(field.key, e)}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* New Fields: Assign Members & Attach with Project */}
                  {agreement.status && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      {/* Assign Members */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white mb-3">
                          <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          Assign Members
                        </label>
                        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                          <div className="space-y-2">
                            {mockEmployees.map((employee) => {
                              const isSelected = (agreement.assignedMembers || []).includes(employee.id);
                              return (
                                <label
                                  key={employee.id}
                                  className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleMemberToggle(field.key, employee.id)}
                                    className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                                  />
                                  <span className="text-sm text-neutral-900 dark:text-white">{employee.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        {(agreement.assignedMembers || []).length > 0 && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            {(agreement.assignedMembers || []).length} member(s) assigned
                          </p>
                        )}
                      </div>

                      {/* Attach with Project */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white mb-3">
                          <Link2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          Attach with Project
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleProjectAttachment(field.key, true)}
                            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                              agreement.attachedToProject === true
                                ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-500 text-green-700 dark:text-green-400'
                                : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Yes</span>
                            </div>
                          </button>
                          <button
                            onClick={() => handleProjectAttachment(field.key, false)}
                            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                              agreement.attachedToProject === false
                                ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-500 text-red-700 dark:text-red-400'
                                : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <XCircle className="w-4 h-4" />
                              <span>No</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> Documents marked with "Yes" should have their corresponding attachments uploaded. Files will be securely stored and can be accessed from the project details page.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
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
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}