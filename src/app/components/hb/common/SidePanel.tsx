import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export function SidePanel({ isOpen, onClose, title, children, width = 'md', footer }: SidePanelProps) {
  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 ${widthClasses[width]} w-full bg-white dark:bg-neutral-900 shadow-2xl z-[9999] flex flex-col animate-in slide-in-from-right duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer - Fixed at bottom */}
        {footer && (
          <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

interface SidePanelSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SidePanelSection({ title, children, className = '' }: SidePanelSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface SidePanelFooterProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
}

export function SidePanelFooter({ 
  onCancel, 
  onSave, 
  saveLabel = 'Save Changes', 
  cancelLabel = 'Cancel' 
}: SidePanelFooterProps) {
  return (
    <div className="px-6 py-4 flex items-center justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        {saveLabel}
      </button>
    </div>
  );
}