import { createClient } from '@prismicio/client';

export function getPrismicClient() {
  return createClient(process.env.PRISMIC_ENDPOINT!, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
}
