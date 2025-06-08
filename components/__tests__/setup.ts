import '@testing-library/jest-dom';

// Mock next/navigation
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

export const mockSearchParams = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  toString: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

// Mock hooks
export const mockUseIsMobile = jest.fn(() => false);

jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => mockUseIsMobile(),
})); 