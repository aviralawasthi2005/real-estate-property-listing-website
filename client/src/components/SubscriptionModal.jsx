import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ShieldCheck, CreditCard, QrCode, Building2, 
  Sparkles, Crown, Zap, Lock, ArrowRight, CheckCircle2, 
  Star, HeartHandshake, AlertCircle 
} from 'lucide-react';
import { useSubscription, SUBSCRIPTION_TIERS } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionModal({ isOpen, onClose, defaultTier = 'pro' }) {
  const { currentUser, subscribe } = useSubscription();
  const navigate = useNavigate();

  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // 'monthly' | 'yearly'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.username || 'Alex Sterling');
  const [upiId, setUpiId] = useState('alex@okaxis');

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_TIERS[selectedTier.toUpperCase()] || SUBSCRIPTION_TIERS.PRO;
  const price = billingPeriod === 'yearly' ? currentPlan.priceYearly : currentPlan.priceMonthly;
  const totalPrice = billingPeriod === 'yearly' ? price * 12 : price;
  const monthlySavings = (currentPlan.priceMonthly - currentPlan.priceYearly) * 12;

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      navigate('/sign-in');
      return;
    }

    setIsProcessing(true);

    // Simulate fast realistic gateway transaction
    setTimeout(() => {
      subscribe({
        tier: selectedTier,
        period: billingPeriod,
        price: totalPrice,
      });
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1400);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className='relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden'
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className='absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors'
          >
            <X className='h-5 w-5' />
          </button>

          {!isSuccess ? (
            <div>
              {/* Header Gradient */}
              <div className='relative px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-slate-900 border-b border-slate-200/50 dark:border-slate-800'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'>
                    <Sparkles className='h-3.5 w-3.5' /> PrimeEstate Membership
                  </span>
                </div>
                <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                  Unlock Premium Real Estate Powers
                </h2>
                <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg'>
                  Get instant access to AI Property Valuation, direct owner contacts, price alerts, and priority status.
                </p>

                {/* Plan Selector tabs */}
                <div className='grid grid-cols-2 gap-3 mt-6'>
                  <button
                    type='button'
                    onClick={() => setSelectedTier('pro')}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      selectedTier === 'pro'
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5'>
                        <Zap className='h-4 w-4 text-indigo-500' /> Pro Member
                      </span>
                      {selectedTier === 'pro' && (
                        <span className='h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px]'>
                          ✓
                        </span>
                      )}
                    </div>
                    <div className='mt-2 flex items-baseline gap-1'>
                      <span className='text-xl font-black text-slate-900 dark:text-white'>
                        ₹{billingPeriod === 'yearly' ? SUBSCRIPTION_TIERS.PRO.priceYearly : SUBSCRIPTION_TIERS.PRO.priceMonthly}
                      </span>
                      <span className='text-[11px] text-slate-500'>/ mo</span>
                    </div>
                  </button>

                  <button
                    type='button'
                    onClick={() => setSelectedTier('elite')}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all ${
                      selectedTier === 'elite'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5'>
                        <Crown className='h-4 w-4 text-amber-500' /> Elite VIP
                      </span>
                      {selectedTier === 'elite' && (
                        <span className='h-4 w-4 rounded-full bg-amber-600 flex items-center justify-center text-white text-[10px]'>
                          ✓
                        </span>
                      )}
                    </div>
                    <div className='mt-2 flex items-baseline gap-1'>
                      <span className='text-xl font-black text-slate-900 dark:text-white'>
                        ₹{billingPeriod === 'yearly' ? SUBSCRIPTION_TIERS.ELITE.priceYearly : SUBSCRIPTION_TIERS.ELITE.priceMonthly}
                      </span>
                      <span className='text-[11px] text-slate-500'>/ mo</span>
                    </div>
                  </button>
                </div>

                {/* Billing cycle toggle */}
                <div className='mt-4 flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl text-xs font-semibold'>
                  <button
                    type='button'
                    onClick={() => setBillingPeriod('monthly')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      billingPeriod === 'monthly'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type='button'
                    onClick={() => setBillingPeriod('yearly')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      billingPeriod === 'yearly'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className='px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]'>
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubscribeSubmit} className='p-6 sm:p-8 space-y-6'>
                {/* Payment Method Selector */}
                <div>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5'>
                    Select Payment Method
                  </label>
                  <div className='grid grid-cols-3 gap-2.5'>
                    <button
                      type='button'
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className='h-4 w-4' />
                      <span>Card</span>
                    </button>
                    <button
                      type='button'
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <QrCode className='h-4 w-4' />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      type='button'
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Building2 className='h-4 w-4' />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Method Details */}
                {paymentMethod === 'card' && (
                  <div className='space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800'>
                    <div>
                      <label className='block text-[11px] font-bold text-slate-500 mb-1'>Card Number</label>
                      <div className='relative'>
                        <input
                          type='text'
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder='4242 4242 4242 4242'
                          className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none'
                          required
                        />
                        <CreditCard className='absolute right-3 top-2.5 h-4 w-4 text-slate-400' />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>Expiry Date</label>
                        <input
                          type='text'
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder='MM/YY'
                          className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>CVV / CVC</label>
                        <input
                          type='password'
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder='•••'
                          className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none'
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3'>
                    <label className='block text-[11px] font-bold text-slate-500'>Enter UPI Virtual ID (VPA)</label>
                    <input
                      type='text'
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder='username@okhdfcbank'
                      className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none'
                      required
                    />
                    <p className='text-[11px] text-slate-500 flex items-center gap-1.5'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' /> Instant one-click confirmation will be requested
                    </p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800'>
                    <label className='block text-[11px] font-bold text-slate-500 mb-1.5'>Select Your Bank</label>
                    <select className='w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none'>
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Price Breakdown & Summary */}
                <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
                  <div>
                    <span className='font-semibold text-slate-500 dark:text-slate-400'>Total Due Today:</span>
                    {billingPeriod === 'yearly' && (
                      <span className='block text-[11px] text-emerald-500 font-bold'>
                        Billed annually (You save ₹{monthlySavings.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                  <div className='text-right'>
                    <span className='text-xl font-black text-slate-900 dark:text-white'>
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className='text-[10px] text-slate-400 block'>Includes all taxes</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type='submit'
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                    selectedTier === 'elite'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 shadow-indigo-600/25'
                  }`}
                >
                  {isProcessing ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Verifying & Activating Membership...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className='h-4 w-4' />
                      <span>Complete & Activate Membership</span>
                    </>
                  )}
                </button>

                <div className='flex items-center justify-center gap-6 text-[11px] text-slate-400 font-medium'>
                  <span className='flex items-center gap-1'>
                    <ShieldCheck className='h-3.5 w-3.5 text-emerald-500' /> 256-bit Encrypted
                  </span>
                  <span className='flex items-center gap-1'>
                    <HeartHandshake className='h-3.5 w-3.5 text-indigo-500' /> Cancel anytime
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* Success State */
            <div className='p-8 sm:p-12 text-center space-y-6'>
              <div className='relative w-20 h-20 mx-auto'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
                    selectedTier === 'elite'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/40'
                      : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-indigo-600/40'
                  }`}
                >
                  <Sparkles className='h-10 w-10 animate-pulse' />
                </motion.div>
              </div>

              <div className='space-y-2'>
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'>
                  Payment Successful
                </span>
                <h3 className='text-3xl font-black text-slate-900 dark:text-white'>
                  Welcome to {selectedTier === 'elite' ? 'Elite VIP' : 'Pro'} Status!
                </h3>
                <p className='text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto'>
                  Your subscription is now active! All exclusive benefits, AI valuation metrics, and owner direct access are unlocked.
                </p>
              </div>

              {/* Perks Unlocked Checklist */}
              <div className='p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left max-w-md mx-auto space-y-2.5'>
                <div className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                  Now Activated On Your Account:
                </div>
                {currentPlan.features.slice(0, 4).map((feat, i) => (
                  <div key={i} className='flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium'>
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 shrink-0' />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                type='button'
                onClick={handleFinish}
                className='btn-primary w-full max-w-sm py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/25'
              >
                <span>Start Exploring Premium Benefits</span>
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
