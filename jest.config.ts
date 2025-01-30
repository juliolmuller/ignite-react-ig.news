import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(gif|ico|jpe?g|mp3|mp4|png|svg|ttf|wav|webm|webp|woff|woff2)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default config;
