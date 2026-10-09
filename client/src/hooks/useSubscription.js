import { useSelector, useDispatch } from 'react-redux';
import { upgradeSubscription, cancelSubscription } from '../redux/user/userSlice';

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Explorer Free',
    badge: 'Free Tier',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Browse all real estate listings',
      'Filter by price, type, bedrooms',
      'Contact up to 3 owners per month',
      'Save properties to favorites',
      'Standard community forum access'
    ],
    limits: {
      inquiriesPerMonth: 3,
      aiAnalysis: false,
      directOwnerCall: false,
      virtualTours: false,
      earlyAccess: false,
      featuredPlacement: false,
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro Member',
    badge: 'Most Popular',
    popular: true,
    priceMonthly: 999,
    priceYearly: 799,
    features: [
      'Unlimited direct owner inquiries & chats',
      'Verified Pro Member gold aura badge',
      'PrimeAI Property Valuation & Cap Rate Estimator',
      'Instant Price Drop & New Listing alerts (24h early)',
      'Verified direct owner phone number reveals',
      'Priority customer assistance 7 days a week',
      'Zero brokerage connection fee'
    ],
    limits: {
      inquiriesPerMonth: Infinity,
      aiAnalysis: true,
      directOwnerCall: true,
      virtualTours: false,
      earlyAccess: true,
      featuredPlacement: false,
    }
  },
  ELITE: {
    id: 'elite',
    name: 'Elite VIP Investor',
    badge: 'VIP Platinum',
    vip: true,
    priceMonthly: 2499,
    priceYearly: 1999,
    features: [
      'All Pro perks included',
      'VIP Investor Crown badge & verified identity',
      '3D Interactive Virtual Tour & Blueprint access',
      'Direct seller WhatsApp & Concierge hotline',
      'Comprehensive 5-Year Capital Appreciation Projections',
      '3x Featured priority boost on your listed properties',
      'Dedicated personal Real Estate Wealth Advisor',
      'Exclusive off-market luxury listings access'
    ],
    limits: {
      inquiriesPerMonth: Infinity,
      aiAnalysis: true,
      directOwnerCall: true,
      virtualTours: true,
      earlyAccess: true,
      featuredPlacement: true,
    }
  }
};

export function useSubscription() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const tier = currentUser?.subscriptionTier || (currentUser?.isPremium ? 'pro' : 'free');
  const isSubscriber = tier === 'pro' || tier === 'elite';
  const isPro = tier === 'pro' || tier === 'elite';
  const isElite = tier === 'elite';
  const planDetails = SUBSCRIPTION_TIERS[tier.toUpperCase()] || SUBSCRIPTION_TIERS.FREE;

  const subscribe = ({ tier = 'pro', period = 'monthly', price = 999 }) => {
    const days = period === 'yearly' ? 365 : 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    dispatch(upgradeSubscription({ tier, period, price, expiresAt }));
  };

  const cancel = () => {
    dispatch(cancelSubscription());
  };

  return {
    currentUser,
    tier,
    isSubscriber,
    isPro,
    isElite,
    planDetails,
    subscribe,
    cancel,
    period: currentUser?.subscriptionPeriod || 'monthly',
    expiresAt: currentUser?.subscriptionExpiresAt || null,
  };
}
