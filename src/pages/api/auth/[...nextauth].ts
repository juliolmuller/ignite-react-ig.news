import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import supabase from '~/services/server/supabase';
import { type User } from '~/types';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      user.email = user.email.toLowerCase();

      try {
        const { data: userData } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .maybeSingle<User>();

        if (!userData) {
          await supabase
            .from('users')
            .insert({
              email: user.email,
              name: user.name,
            })
            .throwOnError();
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select()
          .eq('email', session.user?.email?.toLowerCase() ?? '')
          .single()
          .throwOnError();

        await supabase
          .from('subscriptions')
          .select('id')
          .eq('status', 'active')
          .eq('user_id', userData.id)
          .single()
          .throwOnError();

        return {
          ...session,
          activeSubscription: true,
        };
      } catch {
        return {
          ...session,
          activeSubscription: false,
        };
      }
    },
  },
});
