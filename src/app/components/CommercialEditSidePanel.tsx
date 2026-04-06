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
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Commercial
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
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
          <div className="space-y-8">
            {/* 1. Total Amount Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-500" />
                Total Amount
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Costing (USD) */}
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Local Currency */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 transition-colors"
                    >
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {currency ? currency : 'Select currency'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCurrencyOpen && (
                      <div className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {currencyOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleCurrencyChange(option.code, option.rate)}
                            className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm"
                          >
                            {option.code} - {option.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cost (Local Currency) */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cost (Local Currency Cost)
                </label>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {currency || 'USD'} {costLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Payment Terms Section (Only if Fixed Cost) */}
            {isFixedCost && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  Payment Terms
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g., 50:50 or 30:40:30"
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 text-xs">
                    Select Milestones
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {milestoneOptions.map((milestone) => (
                      <button
                        key={milestone}
                        onClick={() => toggleMilestone(milestone)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                          selectedMilestones.includes(milestone)
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                        }`}
                      >
                        {milestone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Upfront Amount Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Upfront Amount
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Upfront Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">{currency}</span>
                    <input
                      type="number"
                      value={upfrontAmount}
                      onChange={(e) => setUpfrontAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Upfront Payment Status
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsUpfrontStatusOpen(!isUpfrontStatusOpen)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left text-sm flex items-center justify-between"
                    >
                      {upfrontStatus || 'Paid/On the Way'}
                      <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform ${isUpfrontStatusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUpfrontStatusOpen && (
                      <div className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 shadow-lg rounded-lg">
                        {upfrontStatusOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => { setUpfrontStatus(option); setIsUpfrontStatusOpen(false); }}
                            className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 text-sm first:rounded-t-lg last:rounded-b-lg"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Payment Mode Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Payment Mode
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Payment Mode
                  </label>
                  <button
                    onClick={() => setIsPaymentModeOpen(!isPaymentModeOpen)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left text-sm flex items-center justify-between"
                  >
                    {paymentMode || 'Select mode'}
                    <ChevronDown className="w-3 h-3 text-neutral-500" />
                  </button>
                </div>
                
                {paymentMode && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Sub Payment Mode
                    </label>
                    <button
                      onClick={() => setIsSubPaymentModeOpen(!isSubPaymentModeOpen)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left text-sm flex items-center justify-between"
                    >
                      {subPaymentMode || 'Select sub-mode'}
                      <ChevronDown className="w-3 h-3 text-neutral-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Transaction Amount Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Transaction Amount
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Transaction Amount (Yes/No)
                  </label>
                  <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                    <button
                      onClick={() => setTransactionAmountCharged(true)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${transactionAmountCharged ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm' : 'text-neutral-500'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setTransactionAmountCharged(false)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${!transactionAmountCharged ? 'bg-white dark:bg-neutral-700 text-neutral-600 shadow-sm' : 'text-neutral-500'}`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {transactionAmountCharged && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Transaction Cost (Amount)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">{currency}</span>
                      <input
                        type="number"
                        value={transactionCost}
                        onChange={(e) => setTransactionCost(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Support Section (Only if Fixed Cost) */}
            {isFixedCost && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  Support
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Support Amount Included?
                  </label>
                  <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg w-1/2">
                    <button
                      onClick={() => setSupportIncluded(true)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${supportIncluded ? 'bg-white dark:bg-neutral-700 text-green-600 shadow-sm' : 'text-neutral-500'}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setSupportIncluded(false)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${!supportIncluded ? 'bg-white dark:bg-neutral-700 text-neutral-600 shadow-sm' : 'text-neutral-500'}`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {supportIncluded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Support Type
                      </label>
                      <button
                        onClick={() => setIsSupportTypeOpen(!isSupportTypeOpen)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-left text-sm flex items-center justify-between"
                      >
                        {supportType || 'Select type'}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Validity
                      </label>
                      <input
                        type="text"
                        value={supportValidity}
                        onChange={(e) => setSupportValidity(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        No Of Months
                      </label>
                      <input
                        type="text"
                        value={supportMonths}
                        onChange={(e) => setSupportMonths(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        No Of Hours
                      </label>
                      <input
                        type="text"
                        value={supportHours}
                        onChange={(e) => setSupportHours(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Support Amount ({currency})
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="number"
                          value={supportAmount}
                          onChange={(e) => setSupportAmount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
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