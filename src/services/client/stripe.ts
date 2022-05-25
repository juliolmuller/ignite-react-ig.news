import { loadStripe } from '@stripe/stripe-js';

/**
 * Stripe's service to be used on client-side
 */

export function getStripe() {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
}
