// vitest.setup.js

// Import utilities from Pinia Testing
import { createTestingPinia } from '@pinia/testing';
// Import utilities from Vitest
import { vi } from 'vitest';

// 1. Global Setup for Pinia Testing
// This makes createTestingPinia available globally for all your tests
// and ensures Pinia stores are properly mocked and isolated for testing.
// You can provide default configurations here, such as initial state or stubbing actions.
// By default, it stubs actions, meaning they won't execute their original logic
// unless explicitly told not to (stubActions: false).
const testingPinia = createTestingPinia({

    
  // You can set default options here if you want:
  // createSpy: vi.fn, // Use Vitest's spy function
  // stubActions: true, // Stub all actions by default
  // initialStates: { // Optional: set a default initial state for all stores
  //   auth: {
  //     isAuthenticated: false,
  //     user: null,
  //     userRole: null,
  //   }
  // }
});
// Make the testing Pinia instance available to your tests
// This is often implicitly handled by @pinia/testing's integration with Vitest,
// but explicitly setting it up can be useful.
// For components tested with mount/shallowMount, ensure you still pass `createTestingPinia()`
// to the `global.plugins` array as shown in MissionCard.spec.js.
// This setup file primarily ensures Vitest is aware of Pinia for unit testing purposes.


// 2. Global Mock for localStorage
// This intercepts all calls to window.localStorage in your tests,
// preventing actual browser storage side effects.
const localStorageMock = (function() {
  let store = {}; // Private store for localStorage mock
  return {
    getItem: vi.fn((key) => store[key] || null), // Mock getItem
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }), // Mock setItem
    removeItem: vi.fn((key) => { delete store[key]; }), // Mock removeItem
    clear: vi.fn(() => { store = {}; }), // Mock clear
  };
})();

// Replace the global window.localStorage object with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true, // Allow localStorage to be overwritten if needed in a specific test
});