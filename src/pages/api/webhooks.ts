import { query } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';

import fauna from '~/services/server/fauna';
import stripe from '~/services/server/stripe';

async function requestToBuffer(readable: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method Not Allowed');
    return;
  }

  const buffer = await requestToBuffer(request);
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      buffer,
      request.headers['stripe-signature']!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    response.status(400).end(`Webhook Error: ${error.message}`);
    return;
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const checkoutSession = stripeEvent.data
        .object as Stripe.Checkout.Session;
      const userRef = await fauna.query(
        query.Select(
          'ref',
          query.Get(
            query.Match(
              query.Index('user_by_stripe_customer_id'),
              checkoutSession.customer?.toString()!,
            ),
          ),
        ),
      );
      const subscription = await stripe.subscriptions.retrieve(
        checkoutSession.subscription?.toString()!,
      );
      await fauna.query(
        query.Create(query.Collection('subscriptions'), {
          data: {
            user_id: userRef,
            stripe_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
          },
        }),
      );

      break;
  }

  response.status(200).end();
};
