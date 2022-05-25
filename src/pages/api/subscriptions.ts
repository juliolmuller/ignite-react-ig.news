import { query } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import fauna from '~/services/server/fauna';
import stripe from '~/services/server/stripe';

interface FaunaUser {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id?: string;
  };
}

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
export default async (request: NextApiRequest, response: NextApiResponse) => {
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

  const faunaUser = await fauna.query<FaunaUser>(
    query.Get(
      query.Match(
        query.Index('user_by_email'),
        query.Casefold(session.user.email),
      ),
    ),
  );

  if (!faunaUser?.ref?.id) {
    response.status(401).end('Unauthorized');
    return;
  }

  let stripeCustomerId = faunaUser?.data?.stripe_customer_id;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      //metadata: {}
    });
    await fauna.query(
      query.Update(query.Ref(query.Collection('users'), faunaUser.ref.id), {
        data: {
          stripe_customer_id: stripeCustomer.id,
        },
      }),
    );
    stripeCustomerId = stripeCustomer.id;
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
