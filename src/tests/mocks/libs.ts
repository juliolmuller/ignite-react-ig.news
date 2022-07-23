jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({}),
}));

export {}; // only to pass through TS compiler "isolateModule" rule
