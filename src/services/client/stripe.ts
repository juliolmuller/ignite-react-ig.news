import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * Stripe's service to be used on client-side
 */

export function getStripe(): Promise<null | Stripe> {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
}
