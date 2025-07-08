// __tests__/auth.spec.js
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useAuthStore } from '../src/stores/auth';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Store', () => {
  let authStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    authStore = useAuthStore();
  });

  it('initial state should be correct', () => {
    expect(authStore.user).toBe(null);
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.userRole).toBe(null);
  });

  it('should login user successfully', async () => {
    const userData = { id: 'id-1', username: 'testuser', password: '123456', role: 'client' };

    axios.get.mockResolvedValueOnce({
      data: [userData],
    });

    const result = await authStore.login('testuser', '123456');

    expect(result).toBe(true);
    expect(authStore.user).toEqual(userData);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.userRole).toBe('client');
  });

  it('should handle login failure', async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });

    const result = await authStore.login('wronguser', 'wrongpass');

    expect(result).toBe(false);
    expect(authStore.user).toBe(null);
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.error).toBe('Username atau password salah.');
  });

  it('should logout user', () => {
    authStore.user = { id: 'id-1', username: 'user', role: 'client' };
    authStore.isAuthenticated = true;
    authStore.userRole = 'client';
    localStorage.setItem('user', JSON.stringify(authStore.user));

    authStore.logout();

    expect(authStore.user).toBe(null);
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.userRole).toBe(null);
    expect(localStorage.getItem('user')).toBe(null);
  });

  it('should register new user successfully', async () => {
    const newUser = {
      username: 'newuser',
      password: 'pass',
      role: 'ninja',
    };

    axios.get
      .mockResolvedValueOnce({ data: [] }) // Cek user sudah ada?
      .mockResolvedValueOnce({ data: [] }); // Ambil semua user buat id

    axios.post.mockResolvedValueOnce({
      data: { ...newUser, id: 'id-1' },
    });

    const result = await authStore.register(newUser);

    expect(result).toBe(true);
    expect(authStore.user.username).toBe('newuser');
    expect(authStore.userRole).toBe('ninja');
  });

  it('getter isClient should return true if role is client', () => {
    authStore.userRole = 'client';
    expect(authStore.isClient).toBe(true);
    expect(authStore.isNinja).toBe(false);
  });

  it('getter isNinja should return true if role is ninja', () => {
    authStore.userRole = 'ninja';
    expect(authStore.isNinja).toBe(true);
    expect(authStore.isClient).toBe(false);
  });

  it('getter isClient and isNinja false if userRole null', () => {
    authStore.userRole = null;
    expect(authStore.isClient).toBe(false);
    expect(authStore.isNinja).toBe(false);
  });
});
