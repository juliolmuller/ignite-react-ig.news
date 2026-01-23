import 'next-auth';

declare module 'next-auth' {
  interface Session {
    activeSubscription: boolean;
  }
}

export interface User {
  created_at: string;
  email: string;
  id: string;
  name: string;
  stripe_customer_id?: string;
}

export interface Subscription {
  id: string;
  status: string;
  stripe_id: string;
  stripe_price_id: string;
  user_id: string;
}
