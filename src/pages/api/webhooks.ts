import { type NextApiRequest, type NextApiResponse } from 'next';
import { type Readable } from 'stream';
import type Stripe from 'stripe';

import stripe from '~/services/server/stripe';
import supabase from '~/services/server/supabase';
import { type User } from '~/types';

async function requestToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  isUpdating = false,
): Promise<void> {
  const { data: userData } = await supabase
    .from('users')
    .select()
    .eq('stripe_customer_id', customerId)
    .single<User>()
    .throwOnError();
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const subscriptionToSave = {
    user_id: userData.id,
    stripe_id: stripeSubscription.id,
    stripe_price_id: stripeSubscription.items.data[0].price.id,
    status: stripeSubscription.status,
  };

  if (isUpdating) {
    await supabase
      .from('subscriptions')
      .update(subscriptionToSave)
      .eq('stripe_id', stripeSubscription.id)
      .throwOnError();
    return;
  }

  await supabase.from('subscriptions').insert(subscriptionToSave).throwOnError();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    response.status(400).end(`Webhook Error: ${error.message}`);
    return;
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const checkoutSession = stripeEvent.data.object as Stripe.Checkout.Session;

      await saveSubscription(
        checkoutSession.subscription?.toString() ?? '',
        checkoutSession.customer?.toString() ?? '',
      );
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object as Stripe.Subscription;

      await saveSubscription(
        subscription.id,
        subscription.customer?.toString() ?? '',
        !stripeEvent.type.endsWith('created'),
      );
      break;
    }
  }

  response.status(200).end();
};
