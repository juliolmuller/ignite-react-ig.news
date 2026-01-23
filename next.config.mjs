/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/',
      destination: '/home',
      permanent: true,
    },
  ],
};

export default nextConfig;
