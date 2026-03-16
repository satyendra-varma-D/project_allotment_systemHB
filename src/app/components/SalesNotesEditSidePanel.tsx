import { X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface SalesNotesEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  salesNotes: {
    clientsBrief: string;
    projectBackAndForth: string;
    clientComments: string;
    salesComments: string;
    preSalesTech1Comments: string;
    assumptions: string;
    futureBusiness: string;
    crtAccountsComments: string;
  };
  onSave: (notes: any) => void;
}

export function SalesNotesEditSidePanel({
  isOpen,
  onClose,
  salesNotes,
  onSave,
}: SalesNotesEditSidePanelProps) {
  const [editedNotes, setEditedNotes] = React.useState(salesNotes);

  React.useEffect(() => {
    setEditedNotes(salesNotes);
  }, [salesNotes, isOpen]);

  const handleSave = () => {
    onSave(editedNotes);
    onClose();
  };

  if (!isOpen) return null;

  const toolbarModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white dark:bg-neutral-900 shadow-2xl z-[61] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Edit Sales Notes
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Update detailed notes and comments for this project
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Clients Brief From Business Perspective */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Clients Brief From Business Perspective
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.clientsBrief}
                onChange={(value) => setEditedNotes({ ...editedNotes, clientsBrief: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Project Back and Forth */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Project Back and Forth
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.projectBackAndForth}
                onChange={(value) => setEditedNotes({ ...editedNotes, projectBackAndForth: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Client Comments */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Client Comments
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.clientComments}
                onChange={(value) => setEditedNotes({ ...editedNotes, clientComments: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Sales Comments */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Sales Comments
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.salesComments}
                onChange={(value) => setEditedNotes({ ...editedNotes, salesComments: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Pre-Sales Tech1 Comments */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Pre-Sales Tech1 Comments
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.preSalesTech1Comments}
                onChange={(value) => setEditedNotes({ ...editedNotes, preSalesTech1Comments: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Assumptions */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Assumptions
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.assumptions}
                onChange={(value) => setEditedNotes({ ...editedNotes, assumptions: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Future Business Possibilities */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Future Business Possibilities
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.futureBusiness}
                onChange={(value) => setEditedNotes({ ...editedNotes, futureBusiness: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>

            {/* Comment for CRT / Accounts */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Comment for CRT / Accounts
              </label>
              <ReactQuill
                theme="snow"
                value={editedNotes.crtAccountsComments}
                onChange={(value) => setEditedNotes({ ...editedNotes, crtAccountsComments: value })}
                className="bg-white dark:bg-neutral-900 rounded-lg"
                modules={toolbarModules}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Add React import
import React from 'react';