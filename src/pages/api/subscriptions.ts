import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import stripe from '~/services/server/stripe';
import supabase from '~/services/server/supabase';
import { type User } from '~/types';

/**
 * Steps of this respirce:
 * 1. Ensure a POST request was submitted;
 * 2. Ensure user is authenticated in Next Auth;
 * 3. Get user ref at FaunaDB;
 * 4. Ensure user exists at FaunaDB;
 * 5. Verify if user already has a Stripe customer ID;
 *    5.1. If not, create a new Stripe customer and save it at FaunaDB;
 * 6. Create a new Stripe checkout session;
 * 7. Return the session ID to the client.
 */
export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method Not Allowed');
    return;
  }

  const session = await getSession({ req: request });

  if (!session?.user?.email) {
    response.status(401).end('Unauthorized');
    return;
  }

  const { data: userData } = await supabase
    .from('users')
    .select()
    .eq('email', session.user.email)
    .single<User>();

  if (!userData?.id) {
    response.status(401).end('Unauthorized');
    return;
  }

  let stripeCustomerId = userData?.stripe_customer_id;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    stripeCustomerId = stripeCustomer.id;

    await supabase
      .from('users')
      .update({
        stripe_customer_id: stripeCustomerId,
      })
      .eq('id', userData.id)
      .throwOnError();
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
    allow_promotion_codes: true,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    customer: stripeCustomerId,
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  response.status(201).json({
    amount_total: stripeCheckoutSession.amount_total,
    sessionId: stripeCheckoutSession.id,
  });
};
