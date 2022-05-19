import Stripe from 'stripe';

import projectMeta from '~/../package.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: projectMeta.name,
    version: projectMeta.version,
  },
});

export default stripe;
