jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
  }),
}));

export {}; // only to pass through TS compiler "isolateModule" rule
