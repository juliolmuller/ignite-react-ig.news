import { type Client, createClient } from '@prismicio/client';
import { type PrismicDocument } from '@prismicio/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPrismicClient(): Client<PrismicDocument<Record<string, any>, string, string>> {
  return createClient(process.env.PRISMIC_ENDPOINT!, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
}
