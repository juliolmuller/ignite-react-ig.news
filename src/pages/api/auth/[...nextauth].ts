import { query } from 'faunadb';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import fauna from '~/services/server/fauna';

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
      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email ?? ''),
                ),
              ),
            ),
            query.Create(query.Collection('users'), {
              data: {
                name: user.name,
                email: user.email,
              },
            }),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email ?? ''),
              ),
            ),
          ),
        );

        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      try {
        await fauna.query(
          query.Get(
            query.Intersection(
              query.Match(
                query.Index('subscription_by_user_id'),
                query.Select(
                  'ref',
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user?.email ?? ''),
                    ),
                  ),
                ),
              ),
              query.Match(query.Index('subscription_by_status'), 'active'),
            ),
          ),
        );

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
