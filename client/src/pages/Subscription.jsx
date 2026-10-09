import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Check, Zap, Crown, Shield, Star, 
  HelpCircle, ChevronDown, ChevronUp, ArrowRight, 
  CheckCircle2, Flame, Building, PhoneCall, TrendingUp, Layers
} from 'lucide-react';
import { useSubscription, SUBSCRIPTION_TIERS } from '../hooks/useSubscription';
import SubscriptionModal from '../components/SubscriptionModal';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'Can I cancel or switch my plan at any time?',
    a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your Profile settings. If you cancel, your benefits remain active until the end of your billing cycle.'
  },
  {
    q: 'How does the PrimeAI Property Valuation work?',
    a: 'Our AI model analyzes local registry records, comparable nearby transactions, square footage, neighborhood amenities, and current market volatility to provide accurate fair-market values and rental yield estimates.'
  },
  {
    q: 'What is the "Direct Owner Phone Reveal" feature?',
    a: 'Pro and Elite subscribers can bypass middlemen and immediately see the direct verified telephone and WhatsApp contacts of listing owners, eliminating broker delays and extra fees.'
  },
  {
    q: 'How does the 3x Listing Boost work for sellers and landlords?',
    a: 'Elite VIP members have their own listed properties pinned with top-priority placement, highlighted badges, and instant notification alerts sent to interested premium buyers.'
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept all major Credit and Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), and Net Banking from all primary banks.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Kulkarni',
    role: 'Commercial Property Investor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    plan: 'Elite VIP Investor',
    comment: 'The 5-Year Capital Appreciation Projections and direct owner calls saved me at least ₹2,50,000 in brokerage on a villa in Bangalore. Essential for serious buyers.'
  },
  {
    name: 'Ananya Sharma',
    role: 'Homebuyer & Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    plan: 'Pro Member',
    comment: 'Found my dream apartment 24 hours before it was listed publicly thanks to early-access alerts! The AI valuation helped me negotiate ₹1.2L off the asking price.'
  },
  {
    name: 'Vikram Malhotra',
    role: 'Real Estate Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    plan: 'Elite VIP Investor',
    comment: 'The 3x Featured listing boost gave our penthouses 4 times more inquiries in the first week. PrimeEstate subscription pays for itself ten times over.'
  }
];

const COMPARISON_ROWS = [
  { feature: 'Property Search & Standard Filters', free: 'Unlimited', pro: 'Unlimited', elite: 'Unlimited' },
  { feature: 'Monthly Direct Owner Inquiries', free: '3 inquiries', pro: 'Unlimited', elite: 'Unlimited' },
  { feature: 'PrimeAI Fair Valuation & Yield Estimator', free: '—', pro: 'Included', elite: 'Included + 5-Yr Projections' },
  { feature: 'Direct Verified Owner Phone Reveal', free: '—', pro: 'Instant Reveal', elite: 'Instant Reveal + WhatsApp' },
  { feature: 'Early Access Alerts (24h Before Public)', free: '—', pro: 'Included', elite: 'Included' },
  { feature: '3D Virtual Tours & Blueprints', free: '—', pro: '—', elite: 'Full Access' },
  { feature: 'Featured Listing Boost for Sellers', free: '—', pro: '—', elite: '3x Boost & VIP Placement' },
  { feature: 'Dedicated Relationship Advisor', free: '—', pro: 'Priority Email', elite: 'Personal 1-on-1 Hotline' },
  { feature: 'Zero Brokerage Fee Guarantee', free: '—', pro: 'Yes', elite: 'Yes' },
];

export default function Subscription() {
  const { currentUser, tier, isSubscriber } = useSubscription();
  const [billingPeriod, setBillingPeriod] = useState('yearly');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState('pro');
  const [openFaq, setOpenFaq] = useState(null);

  const handleOpenCheckout = (planTier) => {
    if (planTier === 'free') return;
    setSelectedPlanTier(planTier);
    setModalOpen(true);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-[#07090e] pt-28 pb-24 text-slate-900 dark:text-slate-100 transition-colors'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20'>
        {/* Header Hero */}
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm'>
            <Sparkles className='h-3.5 w-3.5' /> PrimeEstate Membership Club
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight'>
            Invest Smarter. Close Deals Faster. <span className='text-gradient'>Go Premium.</span>
          </h1>
          <p className='text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed'>
            Unlock proprietary AI property valuations, direct owner phone contacts, 24-hour early access, and zero brokerage connection fees.
          </p>

          {/* Billing Switcher */}
          <div className='pt-4 flex items-center justify-center gap-3'>
            <span className={`text-sm font-semibold ${billingPeriod === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              type='button'
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className='relative w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors'
            >
              <div
                className={`w-6 h-6 rounded-full bg-indigo-600 shadow-md transform transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className='flex items-center gap-2'>
              <span className={`text-sm font-semibold ${billingPeriod === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className='px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse'>
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>
          {/* FREE PLAN */}
          <div className='bg-white dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative'>
            <div className='space-y-6'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-slate-400'>Starter</span>
                <h3 className='text-2xl font-black mt-1 text-slate-900 dark:text-white'>Explorer Free</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                  Ideal for casual home searchers and neighborhood research.
                </p>
              </div>

              <div className='flex items-baseline gap-1'>
                <span className='text-4xl font-black text-slate-900 dark:text-white'>₹0</span>
                <span className='text-xs text-slate-400 font-semibold'>/ forever</span>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3'>
                <div className='text-xs font-bold uppercase tracking-wider text-slate-400'>Included:</div>
                {SUBSCRIPTION_TIERS.FREE.features.map((feat, i) => (
                  <div key={i} className='flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300'>
                    <Check className='h-4 w-4 text-emerald-500 shrink-0 mt-0.5' />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='pt-8'>
              <button
                disabled
                className='w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-default'
              >
                {tier === 'free' ? 'Current Active Tier' : 'Default Basic'}
              </button>
            </div>
          </div>

          {/* PRO PLAN (HIGHLIGHTED) */}
          <div className='bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/40 dark:to-slate-900 rounded-3xl p-8 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 flex flex-col justify-between relative transform md:-translate-y-2'>
            {/* Top pill badge */}
            <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5'>
              <Sparkles className='h-3.5 w-3.5' /> Most Popular Choice
            </div>

            <div className='space-y-6'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1'>
                  <Zap className='h-3.5 w-3.5' /> Recommended For Buyers & Renters
                </span>
                <h3 className='text-2xl font-black mt-1 text-slate-900 dark:text-white'>Pro Member</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                  Full property analytics, unlimited owner chats, and verified member badge.
                </p>
              </div>

              <div className='flex items-baseline gap-1'>
                <span className='text-4xl font-black text-slate-900 dark:text-white'>
                  ₹{billingPeriod === 'yearly' ? SUBSCRIPTION_TIERS.PRO.priceYearly : SUBSCRIPTION_TIERS.PRO.priceMonthly}
                </span>
                <span className='text-xs text-slate-400 font-semibold'>/ month</span>
                {billingPeriod === 'yearly' && (
                  <span className='text-[10px] text-emerald-500 font-bold ml-1'>
                    (Billed ₹{SUBSCRIPTION_TIERS.PRO.priceYearly * 12}/yr)
                  </span>
                )}
              </div>

              <div className='pt-4 border-t border-indigo-200/50 dark:border-indigo-900/50 space-y-3'>
                <div className='text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400'>
                  Everything in Free, plus:
                </div>
                {SUBSCRIPTION_TIERS.PRO.features.map((feat, i) => (
                  <div key={i} className='flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium'>
                    <CheckCircle2 className='h-4 w-4 text-indigo-500 shrink-0 mt-0.5' />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='pt-8'>
              <button
                type='button'
                onClick={() => handleOpenCheckout('pro')}
                className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
              >
                {tier === 'pro' ? (
                  <span>Current Active Plan ✓</span>
                ) : (
                  <>
                    <span>Upgrade to Pro Now</span>
                    <ArrowRight className='h-3.5 w-3.5' />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ELITE VIP PLAN */}
          <div className='bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 rounded-3xl p-8 border border-amber-300 dark:border-amber-700/50 shadow-xl flex flex-col justify-between relative'>
            <div className='space-y-6'>
              <div>
                <span className='text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1'>
                  <Crown className='h-3.5 w-3.5' /> Ultra Luxury & Commercial
                </span>
                <h3 className='text-2xl font-black mt-1 text-slate-900 dark:text-white'>Elite VIP Investor</h3>
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                  For high-net-worth buyers, multi-property investors, and luxury developers.
                </p>
              </div>

              <div className='flex items-baseline gap-1'>
                <span className='text-4xl font-black text-slate-900 dark:text-white'>
                  ₹{billingPeriod === 'yearly' ? SUBSCRIPTION_TIERS.ELITE.priceYearly : SUBSCRIPTION_TIERS.ELITE.priceMonthly}
                </span>
                <span className='text-xs text-slate-400 font-semibold'>/ month</span>
                {billingPeriod === 'yearly' && (
                  <span className='text-[10px] text-emerald-500 font-bold ml-1'>
                    (Billed ₹{SUBSCRIPTION_TIERS.ELITE.priceYearly * 12}/yr)
                  </span>
                )}
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3'>
                <div className='text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400'>
                  All Pro perks, plus:
                </div>
                {SUBSCRIPTION_TIERS.ELITE.features.map((feat, i) => (
                  <div key={i} className='flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium'>
                    <CheckCircle2 className='h-4 w-4 text-amber-500 shrink-0 mt-0.5' />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='pt-8'>
              <button
                type='button'
                onClick={() => handleOpenCheckout('elite')}
                className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
              >
                {tier === 'elite' ? (
                  <span>Current Active Plan ✓</span>
                ) : (
                  <>
                    <span>Unlock Elite VIP Access</span>
                    <Crown className='h-3.5 w-3.5' />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className='space-y-6 pt-10'>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
              Detailed Feature Comparison
            </h2>
            <p className='text-xs sm:text-sm text-slate-500 max-w-xl mx-auto'>
              Compare all member privileges side-by-side to choose the perfect membership tier for your needs.
            </p>
          </div>

          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm'>
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider'>
                  <th className='py-4 px-6 text-slate-700 dark:text-slate-200'>Platform Feature</th>
                  <th className='py-4 px-6 text-center'>Free</th>
                  <th className='py-4 px-6 text-center text-indigo-600 dark:text-indigo-400'>Pro Member</th>
                  <th className='py-4 px-6 text-center text-amber-600 dark:text-amber-400'>Elite VIP</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-800 font-medium'>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors'>
                    <td className='py-4 px-6 font-semibold text-slate-800 dark:text-slate-200'>{row.feature}</td>
                    <td className='py-4 px-6 text-center text-slate-500'>{row.free}</td>
                    <td className='py-4 px-6 text-center font-bold text-indigo-600 dark:text-indigo-400'>{row.pro}</td>
                    <td className='py-4 px-6 text-center font-bold text-amber-600 dark:text-amber-400'>{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Testimonials */}
        <div className='space-y-6 pt-10'>
          <div className='text-center space-y-2'>
            <span className='text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400'>
              Real Stories & Results
            </span>
            <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
              Loved by India's Top Homebuyers & Investors
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className='bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm'>
                <div className='flex items-center gap-1 text-amber-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='h-3.5 w-3.5 fill-amber-400' />
                  ))}
                </div>
                <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic'>
                  "{t.comment}"
                </p>
                <div className='flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800'>
                  <img src={t.avatar} alt={t.name} className='w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20' />
                  <div>
                    <h4 className='text-xs font-bold text-slate-900 dark:text-white'>{t.name}</h4>
                    <span className='text-[10px] text-slate-400 block'>{t.role}</span>
                    <span className='text-[10px] font-bold text-indigo-600 dark:text-indigo-400'>{t.plan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className='max-w-3xl mx-auto space-y-6 pt-10'>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
              Frequently Asked Questions
            </h2>
            <p className='text-xs text-slate-500'>Everything you need to know about PrimeEstate Membership</p>
          </div>

          <div className='space-y-3'>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all'
              >
                <button
                  type='button'
                  onClick={() => toggleFaq(idx)}
                  className='w-full py-4 px-6 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className='h-4 w-4 text-slate-400 shrink-0' />
                  ) : (
                    <ChevronDown className='h-4 w-4 text-slate-400 shrink-0' />
                  )}
                </button>
                {openFaq === idx && (
                  <div className='px-6 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3'>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTier={selectedPlanTier}
      />
    </div>
  );
}
