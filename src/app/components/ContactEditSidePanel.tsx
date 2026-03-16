import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  tags?: string[];
  channels?: string[];
  // New fields
  contactType?: string;
  designation?: string;
  address?: string;
  city?: string;
  country?: string;
  normalAvailability?: string;
  responseTime?: string;
  category?: string;
  treatment?: string;
}

interface ContactEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSave: (contact: Contact) => void;
}

export function ContactEditSidePanel({
  isOpen,
  onClose,
  contact,
  onSave,
}: ContactEditSidePanelProps) {
  const [contactType, setContactType] = useState('');
  const [normalAvailability, setNormalAvailability] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [category, setCategory] = useState('');
  const [treatment, setTreatment] = useState('');

  const [isContactTypeOpen, setIsContactTypeOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isResponseTimeOpen, setIsResponseTimeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTreatmentOpen, setIsTreatmentOpen] = useState(false);

  // Sync state when panel opens or contact changes
  useEffect(() => {
    if (isOpen && contact) {
      setContactType(contact.contactType || 'Primary Contact');
      setNormalAvailability(contact.normalAvailability || 'Business Hours (9 AM - 6 PM)');
      setResponseTime(contact.responseTime || 'Within 24 hours');
      setCategory(contact.category || 'Key Stakeholder');
      setTreatment(contact.treatment || 'High Priority');
      
      // Close all dropdowns
      setIsContactTypeOpen(false);
      setIsAvailabilityOpen(false);
      setIsResponseTimeOpen(false);
      setIsCategoryOpen(false);
      setIsTreatmentOpen(false);
    }
  }, [isOpen, contact]);

  const contactTypeOptions = [
    'Primary Contact',
    'Secondary Contact',
    'Technical Contact',
    'Billing Contact',
    'Escalation Contact',
  ];

  const availabilityOptions = [
    'Business Hours (9 AM - 6 PM)',
    'Extended Hours (8 AM - 8 PM)',
    'Flexible (On-demand)',
    'Limited Availability',
    '24/7 Available',
  ];

  const responseTimeOptions = [
    'Immediate (< 1 hour)',
    'Within 4 hours',
    'Within 24 hours',
    'Within 48 hours',
    'Within 1 week',
  ];

  const categoryOptions = [
    'Key Stakeholder',
    'Decision Maker',
    'Influencer',
    'End User',
    'Technical Lead',
    'Project Sponsor',
    'C-Level Executive',
  ];

  const treatmentOptions = [
    'Critical Priority',
    'High Priority',
    'Medium Priority',
    'Low Priority',
    'Standard',
  ];

  const handleSave = () => {
    if (contact) {
      onSave({
        ...contact,
        contactType,
        normalAvailability,
        responseTime,
        category,
        treatment,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (contact) {
      setContactType(contact.contactType || '');
      setNormalAvailability(contact.normalAvailability || '');
      setResponseTime(contact.responseTime || '');
      setCategory(contact.category || '');
      setTreatment(contact.treatment || '');
    }
    onClose();
  };

  if (!isOpen || !contact) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Edit Contact Details
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {contact.name}
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
            {/* Contact Type (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Contact Type
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsContactTypeOpen(!isContactTypeOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {contactType || 'Select contact type'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isContactTypeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isContactTypeOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {contactTypeOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setContactType(option);
                            setIsContactTypeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Designation (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Designation
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.role || 'N/A'}
                </span>
              </div>
            </div>

            {/* Address (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Address
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.address || '123 Business Street'}
                </span>
              </div>
            </div>

            {/* City (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                City
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.city || contact.location.split(',')[0] || 'N/A'}
                </span>
              </div>
            </div>

            {/* Country (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Country
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.country || contact.location.split(',').slice(-1)[0].trim() || 'N/A'}
                </span>
              </div>
            </div>

            {/* Timezone (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Timezone
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.timezone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Email (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 break-all">
                  {contact.email || 'N/A'}
                </span>
              </div>
            </div>

            {/* Mobile / Phone Number (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mobile / Phone Number
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {contact.phone || 'N/A'}
                </span>
              </div>
            </div>

            {/* WhatsApp / Teams / Slack (Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                WhatsApp / Teams / Slack
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {contact.channels && contact.channels.length > 0 ? (
                    contact.channels.map((channel, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                      >
                        {channel}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Normal Availability of Client (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Normal Availability of Client
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {normalAvailability || 'Select availability'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isAvailabilityOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAvailabilityOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {availabilityOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setNormalAvailability(option);
                            setIsAvailabilityOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Response Time (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Response Time
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsResponseTimeOpen(!isResponseTimeOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {responseTime || 'Select response time'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isResponseTimeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isResponseTimeOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {responseTimeOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setResponseTime(option);
                            setIsResponseTimeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category of Customer (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Category of Customer
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {category || 'Select category'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {categoryOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCategory(option);
                            setIsCategoryOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Treatment (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Treatment
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTreatmentOpen(!isTreatmentOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {treatment || 'Select treatment'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isTreatmentOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTreatmentOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {treatmentOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setTreatment(option);
                            setIsTreatmentOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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