import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_placeholder')) return null;
  return new Stripe(key);
}

export const AED = 'aed';
/** AED uses 2 decimals (fils) — Stripe expects the smallest unit. */
export const toFils = (aed: number) => Math.round(aed * 100);
