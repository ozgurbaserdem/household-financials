import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    // Simple mock that returns the key with interpolation support
    if (values) {
      // eslint-disable-next-line unicorn/no-array-reduce
      const result = Object.entries(values).reduce((acc, [k, v]) => {
        return acc.replace(`{${k}}`, String(v));
      }, key);
      return result;
    }
    return key;
  },
  useLocale: vi.fn(() => "en"),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

// Suppress React prop warnings and SVG warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === "string") {
      const suppressedMessages = [
        "React does not recognize",
        "is unrecognized in this browser",
        "is using incorrect casing",
      ];
      const shouldSuppress = suppressedMessages.some((suppressedMessage) =>
        message.includes(suppressedMessage)
      );
      if (shouldSuppress) {
        return;
      }
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Add any other global test setup here
