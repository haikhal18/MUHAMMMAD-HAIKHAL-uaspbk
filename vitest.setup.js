// vitest.setup.js

import { createTestingPinia } from '@pinia/testing';
import { vi } from 'vitest';

// 🔧 1. Setup Mock LocalStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// 🧪 2. Setup createTestingPinia globally if needed
// NOTE: For most component tests using `mount`, you should pass `createTestingPinia()` in `global.plugins`
// This file is useful for non-component test setup (e.g., for direct store testing).
globalThis.createTestingPinia = createTestingPinia;
