import Stripe from 'stripe';

import projectMeta from '~/../package.json';

/**
 * Stripe's service to be used on server-side
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: projectMeta.name,
    version: projectMeta.version,
  },
});

export default stripe;
