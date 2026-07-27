import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

afterEach(() => {
  // Prevent calls from one test leaking into the next test.
  vi.clearAllMocks();
});
