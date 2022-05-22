import { query } from 'faunadb';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import fauna from '~/services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async signIn(context) {
      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(context.user.email ?? ''),
                ),
              ),
            ),
            query.Create(query.Collection('users'), {
              data: {
                name: context.user.name,
                email: context.user.email,
              },
            }),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(context.user.email ?? ''),
              ),
            ),
          ),
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
