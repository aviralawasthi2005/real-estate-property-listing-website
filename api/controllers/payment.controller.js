import Stripe from 'stripe';
import User from '../models/user.model.js';
import { config } from '../config/environment.js';
import { errorHandler } from '../utils/error.js';

const stripe = config.stripeSecretKey ? new Stripe(config.stripeSecretKey, { apiVersion: '2024-06-20' }) : null;

const getOrigin = (req) => {
  const configuredOrigins = config.clientOrigin || [];
  const requestOrigin = req.headers.origin;

  if (requestOrigin && configuredOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return configuredOrigins[0] || 'http://localhost:5173';
};

export const createCheckoutSession = async (req, res, next) => {
  if (!stripe) {
    return next(errorHandler(500, 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables.'));
  }

  try {
    const { tier = 'pro', period = 'monthly', amount = 999, currency = 'inr' } = req.body || {};
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    const normalizedTier = ['pro', 'elite'].includes(tier) ? tier : 'pro';
    const numericAmount = Number(amount) || 999;
    const secureOrigin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      success_url: `${secureOrigin}/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${secureOrigin}/subscription?checkout=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(numericAmount * 100),
            product_data: {
              name: normalizedTier === 'elite' ? 'PrimeEstate Elite VIP Membership' : 'PrimeEstate Pro Membership',
              description: `${normalizedTier === 'elite' ? 'Elite VIP' : 'Pro'} plan billed ${period}`,
            },
          },
        },
      ],
      metadata: {
        userId: req.user.id.toString(),
        tier: normalizedTier,
        period,
        amount: String(numericAmount),
      },
      payment_method_types: ['card', 'upi'],
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCheckoutSession = async (req, res, next) => {
  if (!stripe) {
    return next(errorHandler(500, 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables.'));
  }

  try {
    const { sessionId } = req.body || {};

    if (!sessionId) {
      return next(errorHandler(400, 'Missing checkout session ID.'));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return next(errorHandler(402, 'Payment has not been completed yet.'));
    }

    const tier = session.metadata?.tier || 'pro';
    const period = session.metadata?.period || 'monthly';
    const amount = Number(session.metadata?.amount || session.amount_total / 100 || 0);
    const expiresAt = new Date(Date.now() + (period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          isPremium: true,
          subscriptionTier: ['pro', 'elite'].includes(tier) ? tier : 'pro',
          subscriptionPeriod: period,
          subscriptionAmount: amount,
          subscriptionExpiresAt: expiresAt,
          subscriptionUpdated: new Date().toISOString(),
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
