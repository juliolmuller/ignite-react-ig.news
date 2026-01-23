import { type Client, createClient } from '@prismicio/client';
import { type PrismicDocument } from '@prismicio/types';

const prismicEndpoint = process.env.PRISMIC_ENDPOINT;
const prismicAccessToken = process.env.PRISMIC_ACCESS_TOKEN;

if (!prismicEndpoint || !prismicAccessToken) {
  throw new Error('Missing Prismic environment variables');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPrismicClient(): Client<PrismicDocument<Record<string, any>, string, string>> {
  return createClient(prismicEndpoint as string, {
    accessToken: prismicAccessToken,
  });
}
