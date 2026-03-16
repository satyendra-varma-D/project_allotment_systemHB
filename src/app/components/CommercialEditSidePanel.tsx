import { useState, useEffect } from 'react';
import { X, ChevronDown, DollarSign, AlertCircle } from 'lucide-react';

interface CommercialData {
  costingUSD: number;
  currency: string;
  costLocal: number;
  exchangeRate: number;
  paymentTerms: string;
  selectedMilestones: string[];
  upfrontAmount: number;
  upfrontStatus: string;
  paymentMode: string;
  subPaymentMode: string;
  transactionAmountCharged: boolean;
  transactionCost: number;
  supportIncluded: boolean;
  supportType: string;
  supportValidity: string;
  supportMonths: string;
  supportHours: string;
  supportAmount: number;
  projectType: string; // Fixed Cost or HIRE
}

interface CommercialEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: CommercialData;
  onSave: (data: CommercialData) => void;
}

export function CommercialEditSidePanel({
  isOpen,
  onClose,
  currentData,
  onSave,
}: CommercialEditSidePanelProps) {
  const [costingUSD, setCostingUSD] = useState(0);
  const [currency, setCurrency] = useState('');
  const [costLocal, setCostLocal] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [upfrontAmount, setUpfrontAmount] = useState(0);
  const [upfrontStatus, setUpfrontStatus] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [subPaymentMode, setSubPaymentMode] = useState('');
  const [transactionAmountCharged, setTransactionAmountCharged] = useState(false);
  const [transactionCost, setTransactionCost] = useState(0);
  const [supportIncluded, setSupportIncluded] = useState(false);
  const [supportType, setSupportType] = useState('');
  const [supportValidity, setSupportValidity] = useState('');
  const [supportMonths, setSupportMonths] = useState('');
  const [supportHours, setSupportHours] = useState('');
  const [supportAmount, setSupportAmount] = useState(0);

  // Dropdown states
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUpfrontStatusOpen, setIsUpfrontStatusOpen] = useState(false);
  const [isPaymentModeOpen, setIsPaymentModeOpen] = useState(false);
  const [isSubPaymentModeOpen, setIsSubPaymentModeOpen] = useState(false);
  const [isSupportTypeOpen, setIsSupportTypeOpen] = useState(false);

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', rate: 1 },
    { code: 'EUR', name: 'Euro', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', rate: 0.79 },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.35 },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.52 },
    { code: 'AED', name: 'UAE Dirham', rate: 3.67 },
    { code: 'INR', name: 'Indian Rupee', rate: 83.12 },
    { code: 'SGD', name: 'Singapore Dollar', rate: 1.34 },
  ];

  const upfrontStatusOptions = ['Paid', 'On the Way', 'Unpaid', 'Partial'];

  const paymentModeOptions = [
    'Bank Transfer (Wire)',
    'Credit Card',
    'PayPal',
    'Cryptocurrency',
    'Check',
    'ACH Transfer',
  ];

  const subPaymentModeMap: { [key: string]: string[] } = {
    'Bank Transfer (Wire)': ['SWIFT', 'SEPA', 'Local Transfer', 'International Wire'],
    'Credit Card': ['Visa', 'Mastercard', 'American Express', 'Discover'],
    'PayPal': ['PayPal Standard', 'PayPal Express'],
    'Cryptocurrency': ['Bitcoin', 'Ethereum', 'USDT', 'USDC'],
    'Check': ['Personal Check', 'Cashier\'s Check', 'Business Check'],
    'ACH Transfer': ['ACH Direct Debit', 'ACH Credit'],
  };

  const supportTypeOptions = [
    'Basic Support',
    'Standard Support',
    'Premium Support',
    'Enterprise Support',
    '24/7 Support',
  ];

  const milestoneOptions = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'];

  const isFixedCost = currentData.projectType === 'Fixed Cost';

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      setCostingUSD(currentData.costingUSD);
      setCurrency(currentData.currency);
      setCostLocal(currentData.costLocal);
      setExchangeRate(currentData.exchangeRate);
      setPaymentTerms(currentData.paymentTerms);
      setSelectedMilestones(currentData.selectedMilestones);
      setUpfrontAmount(currentData.upfrontAmount);
      setUpfrontStatus(currentData.upfrontStatus);
      setPaymentMode(currentData.paymentMode);
      setSubPaymentMode(currentData.subPaymentMode);
      setTransactionAmountCharged(currentData.transactionAmountCharged);
      setTransactionCost(currentData.transactionCost);
      setSupportIncluded(currentData.supportIncluded);
      setSupportType(currentData.supportType);
      setSupportValidity(currentData.supportValidity);
      setSupportMonths(currentData.supportMonths);
      setSupportHours(currentData.supportHours);
      setSupportAmount(currentData.supportAmount);

      // Close all dropdowns
      setIsCurrencyOpen(false);
      setIsUpfrontStatusOpen(false);
      setIsPaymentModeOpen(false);
      setIsSubPaymentModeOpen(false);
      setIsSupportTypeOpen(false);
    }
  }, [isOpen, currentData]);

  // Auto-calculate local currency cost when USD cost or currency changes
  useEffect(() => {
    setCostLocal(costingUSD * exchangeRate);
  }, [costingUSD, exchangeRate]);

  const handleCurrencyChange = (currencyCode: string, rate: number) => {
    setCurrency(currencyCode);
    setExchangeRate(rate);
    setIsCurrencyOpen(false);
  };

  const handlePaymentModeChange = (mode: string) => {
    setPaymentMode(mode);
    setSubPaymentMode(''); // Reset sub payment mode
    setIsPaymentModeOpen(false);
  };

  const toggleMilestone = (milestone: string) => {
    if (selectedMilestones.includes(milestone)) {
      setSelectedMilestones(selectedMilestones.filter((m) => m !== milestone));
    } else {
      setSelectedMilestones([...selectedMilestones, milestone]);
    }
  };

  const handleSave = () => {
    onSave({
      ...currentData,
      costingUSD,
      currency,
      costLocal,
      exchangeRate,
      paymentTerms: isFixedCost ? paymentTerms : '',
      selectedMilestones: isFixedCost ? selectedMilestones : [],
      upfrontAmount,
      upfrontStatus,
      paymentMode,
      subPaymentMode,
      transactionAmountCharged,
      transactionCost: transactionAmountCharged ? transactionCost : 0,
      supportIncluded: isFixedCost ? supportIncluded : false,
      supportType: supportIncluded && isFixedCost ? supportType : '',
      supportValidity: supportIncluded && isFixedCost ? supportValidity : '',
      supportMonths: supportIncluded && isFixedCost ? supportMonths : '',
      supportHours: supportIncluded && isFixedCost ? supportHours : '',
      supportAmount: supportIncluded && isFixedCost ? supportAmount : 0,
    });
    onClose();
  };

  const handleCancel = () => {
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
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Edit Commercial
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage project financials and payment terms
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
            {/* Costing (USD) - System Generated & Editable */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Costing (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="number"
                  value={costingUSD}
                  onChange={(e) => setCostingUSD(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Currency - System Generated & Editable */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Local Currency
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {currency ? `${currency} - ${currencyOptions.find(c => c.code === currency)?.name}` : 'Select currency'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCurrencyOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {currencyOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleCurrencyChange(option.code, option.rate)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {option.code} - {option.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Rate: 1 USD = {option.rate} {option.code}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cost (Local Currency) - Auto Calculated */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Cost ({currency || 'Local Currency'})
                <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                  (Auto-calculated)
                </span>
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {currency || 'N/A'} {costLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Automatically calculated: {costingUSD} USD × {exchangeRate}
              </p>
            </div>

            {/* Payment Terms - Only for Fixed Cost */}
            {isFixedCost && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Payment Terms
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                      (Fixed Cost Only)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g., 30:40:30 or 50:50"
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                    Enter payment split (e.g., 50:50 for two milestones)
                  </p>
                </div>

                {/* Select Milestones */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Select Milestones
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                      (Fixed Cost Only)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {milestoneOptions.map((milestone) => (
                      <button
                        key={milestone}
                        onClick={() => toggleMilestone(milestone)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedMilestones.includes(milestone)
                            ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        {milestone}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Selected: {selectedMilestones.length > 0 ? selectedMilestones.join(', ') : 'None'}
                  </p>
                </div>
              </>
            )}

            {/* Upfront Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Upfront Amount ({currency || 'USD'})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="number"
                  value={upfrontAmount}
                  onChange={(e) => setUpfrontAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Upfront Payment Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Upfront Payment Status
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsUpfrontStatusOpen(!isUpfrontStatusOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {upfrontStatus || 'Select status'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isUpfrontStatusOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUpfrontStatusOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {upfrontStatusOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setUpfrontStatus(option);
                            setIsUpfrontStatusOpen(false);
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

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Payment Mode
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsPaymentModeOpen(!isPaymentModeOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-900 dark:text-white">
                    {paymentMode || 'Select payment mode'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isPaymentModeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPaymentModeOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {paymentModeOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handlePaymentModeChange(option)}
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

            {/* Sub Payment Mode */}
            {paymentMode && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Sub Payment Mode
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsSubPaymentModeOpen(!isSubPaymentModeOpen)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  >
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {subPaymentMode || 'Select sub payment mode'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isSubPaymentModeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSubPaymentModeOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {subPaymentModeMap[paymentMode]?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSubPaymentMode(option);
                              setIsSubPaymentModeOpen(false);
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
            )}

            {/* Transaction Amount Charged */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Transaction Cost Charged?
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTransactionAmountCharged(true)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    transactionAmountCharged
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="text-sm font-medium">Yes</span>
                </button>
                <button
                  onClick={() => {
                    setTransactionAmountCharged(false);
                    setTransactionCost(0);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    !transactionAmountCharged
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="text-sm font-medium">No</span>
                </button>
              </div>
            </div>

            {/* Transaction Cost Amount */}
            {transactionAmountCharged && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Transaction Cost Amount ({currency || 'USD'})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="number"
                    value={transactionCost}
                    onChange={(e) => setTransactionCost(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Support Amount Included - Only for Fixed Cost */}
            {isFixedCost && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Support Amount Included?
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                      (Fixed Cost Only)
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSupportIncluded(true)}
                      className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                        supportIncluded
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                          : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-sm font-medium">Yes</span>
                    </button>
                    <button
                      onClick={() => {
                        setSupportIncluded(false);
                        setSupportType('');
                        setSupportValidity('');
                        setSupportMonths('');
                        setSupportHours('');
                        setSupportAmount(0);
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                        !supportIncluded
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-400'
                          : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-sm font-medium">No</span>
                    </button>
                  </div>
                </div>

                {/* Support Details - Conditional */}
                {supportIncluded && (
                  <>
                    {/* Support Type */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Support Type
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setIsSupportTypeOpen(!isSupportTypeOpen)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                        >
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {supportType || 'Select support type'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isSupportTypeOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSupportTypeOpen && (
                          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                            <div className="max-h-64 overflow-y-auto">
                              {supportTypeOptions.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSupportType(option);
                                    setIsSupportTypeOpen(false);
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

                    {/* Validity */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Validity
                      </label>
                      <input
                        type="text"
                        value={supportValidity}
                        onChange={(e) => setSupportValidity(e.target.value)}
                        placeholder="e.g., 12 months post-launch"
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </div>

                    {/* No Of Months */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        No. of Months
                      </label>
                      <input
                        type="text"
                        value={supportMonths}
                        onChange={(e) => setSupportMonths(e.target.value)}
                        placeholder="e.g., 12"
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </div>

                    {/* No Of Hours */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        No. of Hours
                      </label>
                      <input
                        type="text"
                        value={supportHours}
                        onChange={(e) => setSupportHours(e.target.value)}
                        placeholder="e.g., 160"
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </div>

                    {/* Support Amount */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Support Amount ({currency || 'USD'})
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="number"
                          value={supportAmount}
                          onChange={(e) => setSupportAmount(Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
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