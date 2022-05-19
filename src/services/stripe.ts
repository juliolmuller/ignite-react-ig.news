import Stripe from 'stripe';

import { name, version } from '~/../package.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
  appInfo: { name, version },
});

export default stripe;
