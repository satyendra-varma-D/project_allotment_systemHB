import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface TechnologyData {
  platform: string;
  backendFramework: string;
  frontendFramework: string;
  mobileApps: string;
  mobilePlatform: string;
  trendingTech: string;
  aiUsage: boolean;
  aiUsageDetails: string;
}

interface TechnologyEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: TechnologyData;
  onSave: (data: TechnologyData) => void;
}

export function TechnologyEditSidePanel({
  isOpen,
  onClose,
  currentData,
  onSave,
}: TechnologyEditSidePanelProps) {
  const [platform, setPlatform] = useState('');
  const [backendFramework, setBackendFramework] = useState('');
  const [frontendFramework, setFrontendFramework] = useState('');
  const [mobileApps, setMobileApps] = useState('');
  const [mobilePlatform, setMobilePlatform] = useState('');
  const [trendingTech, setTrendingTech] = useState('');
  const [aiUsage, setAiUsage] = useState(false);
  const [aiUsageDetails, setAiUsageDetails] = useState('');

  // Dropdown states
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isBackendOpen, setIsBackendOpen] = useState(false);
  const [isFrontendOpen, setIsFrontendOpen] = useState(false);
  const [isMobileAppsOpen, setIsMobileAppsOpen] = useState(false);
  const [isMobilePlatformOpen, setIsMobilePlatformOpen] = useState(false);
  const [isTrendingTechOpen, setIsTrendingTechOpen] = useState(false);

  // Dropdown options
  const platformOptions = [
    'Web Application',
    'Mobile Application',
    'Desktop Application',
    'SaaS Platform',
    'Enterprise Platform',
    'E-Commerce Platform',
    'CMS Platform',
    'Progressive Web App (PWA)',
  ];

  const backendFrameworkOptions = [
    'Node.js, Express.js',
    'Python, Django',
    'Python, Flask',
    'Ruby on Rails',
    'PHP, Laravel',
    '.NET Core',
    'Java, Spring Boot',
    'Go (Golang)',
  ];

  const frontendFrameworkOptions = [
    'React, TypeScript, Tailwind CSS',
    'Vue.js, TypeScript',
    'Angular, TypeScript',
    'Next.js, TypeScript',
    'Svelte',
    'React Native',
    'Flutter',
    'Vanilla JavaScript',
  ];

  const mobileAppsOptions = [
    'Native',
    'Cross Platform',
    'Hybrid',
    'Progressive Web App (PWA)',
    'Not Applicable',
  ];

  const mobilePlatformOptions = [
    'iOS',
    'Android',
    'Both (iOS & Android)',
    'Windows Mobile',
    'Not Applicable',
  ];

  const trendingTechOptions = [
    'Artificial Intelligence (AI)',
    'Machine Learning (ML)',
    'Augmented Reality (AR)',
    'Virtual Reality (VR)',
    'Blockchain',
    'Internet of Things (IoT)',
    'Cloud Computing',
    'Micro-services',
    'Micro-frontends',
    'Edge Computing',
    'WebAssembly',
    'Serverless',
    'GraphQL',
    'Jamstack',
  ];

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      setPlatform(currentData.platform);
      setBackendFramework(currentData.backendFramework);
      setFrontendFramework(currentData.frontendFramework);
      setMobileApps(currentData.mobileApps);
      setMobilePlatform(currentData.mobilePlatform);
      setTrendingTech(currentData.trendingTech);
      setAiUsage(currentData.aiUsage);
      setAiUsageDetails(currentData.aiUsageDetails);

      // Close all dropdowns
      setIsPlatformOpen(false);
      setIsBackendOpen(false);
      setIsFrontendOpen(false);
      setIsMobileAppsOpen(false);
      setIsMobilePlatformOpen(false);
      setIsTrendingTechOpen(false);
    }
  }, [isOpen, currentData]);

  const handleSave = () => {
    onSave({
      platform,
      backendFramework,
      frontendFramework,
      mobileApps,
      mobilePlatform,
      trendingTech,
      aiUsage,
      aiUsageDetails: aiUsage ? aiUsageDetails : '',
    });
    onClose();
  };

  const handleCancel = () => {
    setPlatform(currentData.platform);
    setBackendFramework(currentData.backendFramework);
    setFrontendFramework(currentData.frontendFramework);
    setMobileApps(currentData.mobileApps);
    setMobilePlatform(currentData.mobilePlatform);
    setTrendingTech(currentData.trendingTech);
    setAiUsage(currentData.aiUsage);
    setAiUsageDetails(currentData.aiUsageDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Technology Details
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Configure project technology stack
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
          <div className="space-y-6">
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Platform
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {platform || 'Select platform'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isPlatformOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPlatformOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {platformOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setPlatform(option);
                            setIsPlatformOpen(false);
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

            {/* Backend Framework */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Backend Framework
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsBackendOpen(!isBackendOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {backendFramework || 'Select backend framework'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isBackendOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBackendOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {backendFrameworkOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setBackendFramework(option);
                            setIsBackendOpen(false);
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

            {/* Frontend Framework */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Frontend Framework
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsFrontendOpen(!isFrontendOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {frontendFramework || 'Select frontend framework'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isFrontendOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFrontendOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {frontendFrameworkOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFrontendFramework(option);
                            setIsFrontendOpen(false);
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

            {/* Mobile Apps */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mobile Apps
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsMobileAppsOpen(!isMobileAppsOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {mobileApps || 'Select mobile app type'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isMobileAppsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileAppsOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {mobileAppsOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setMobileApps(option);
                            setIsMobileAppsOpen(false);
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

            {/* Mobile Platform */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mobile Platform
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsMobilePlatformOpen(!isMobilePlatformOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {mobilePlatform || 'Select mobile platform'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isMobilePlatformOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobilePlatformOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {mobilePlatformOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setMobilePlatform(option);
                            setIsMobilePlatformOpen(false);
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

            {/* Trending Tech */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Trending Tech
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTrendingTechOpen(!isTrendingTechOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {trendingTech || 'Select trending technology'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isTrendingTechOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTrendingTechOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {trendingTechOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setTrendingTech(option);
                            setIsTrendingTechOpen(false);
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

            {/* AI Usage Toggle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                AI Usage?
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAiUsage(true)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    aiUsage
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="text-sm font-medium">Yes</span>
                </button>
                <button
                  onClick={() => {
                    setAiUsage(false);
                    setAiUsageDetails('');
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    !aiUsage
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="text-sm font-medium">No</span>
                </button>
              </div>
            </div>

            {/* AI Usage Details (Conditional) */}
            {aiUsage && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  AI Usage Details
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                    (What AI technologies are being used?)
                  </span>
                </label>
                <textarea
                  value={aiUsageDetails}
                  onChange={(e) => setAiUsageDetails(e.target.value)}
                  placeholder="e.g., OpenAI (GPT-4/o), NLP (Natural Language Processing), Computer Vision..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            )}
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
