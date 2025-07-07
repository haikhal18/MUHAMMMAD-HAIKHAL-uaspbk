// __tests__/auth.spec.js

// Import utilities dari Vitest dan Pinia
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Import axios dan mock implementasinya
import axios from 'axios';
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Import store yang akan diuji
import { useAuthStore } from '../src/stores/auth'; // Sesuaikan path jika berbeda

// Mock localStorage agar tidak berinteraksi dengan browser localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    // Reset axios mocks
    axios.get.mockReset();
    axios.post.mockReset();

    // Clear localStorage mocks
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should initialize with no user and not authenticated', () => {
    const auth = useAuthStore();
    expect(auth.user).toBeNull();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.userRole).toBeNull();
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
  });

  it('should successfully log in a client user', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          username: 'testclient',
          password: 'password123',
          role: 'client',
          email: 'c@c.com',
          company: 'TestCorp',
        },
      ],
    });

    const auth = useAuthStore();
    const success = await auth.login('testclient', 'password123');

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:3000/users?username=testclient&password=password123'
    );

    expect(success).toBe(true);
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user).toEqual({
      id: 1,
      username: 'testclient',
      password: 'password123',
      role: 'client',
      email: 'c@c.com',
      company: 'TestCorp',
    });
    expect(auth.userRole).toBe('client');
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(auth.user)
    );
  });

  it('should successfully log in a ninja user', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 2,
          username: 'testninja',
          password: 'password123',
          role: 'ninja',
          email: 'n@n.com',
          skills: ['Stealth'],
        },
      ],
    });

    const auth = useAuthStore();
    const success = await auth.login('testninja', 'password123');

    expect(success).toBe(true);
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user.username).toBe('testninja');
    expect(auth.userRole).toBe('ninja');
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
  });

  it('should fail to log in with incorrect credentials', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const auth = useAuthStore();
    const success = await auth.login('wronguser', 'wrongpass');

    expect(success).toBe(false);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.userRole).toBeNull();
    expect(auth.loading).toBe(false);
    expect(auth.error).toBe('Username atau password salah.');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should handle API errors during login', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const auth = useAuthStore();
    const success = await auth.login('testuser', 'password');

    expect(success).toBe(false);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.userRole).toBeNull();
    expect(auth.loading).toBe(false);
    expect(auth.error).toBe('Terjadi kesalahan saat login. Coba lagi nanti.');
  });

  it('should log out the user', () => {
    const auth = useAuthStore();
    auth.user = { id: 1, username: 'loggedInUser', role: 'client' };
    auth.isAuthenticated = true;
    auth.userRole = 'client';
    localStorageMock.setItem('user', JSON.stringify(auth.user));

    auth.logout();

    expect(auth.user).toBeNull();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.userRole).toBeNull();
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('should initialize auth from localStorage if user data exists', () => {
    const storedUser = {
      id: 3,
      username: 'persisteduser',
      role: 'ninja',
      email: 'p@p.com',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

    const auth = useAuthStore();
    auth.initializeAuth();

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user).toEqual(storedUser);
    expect(auth.userRole).toBe('ninja');
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
  });

  it('should log out if localStorage data is invalid', () => {
    localStorageMock.getItem.mockReturnValue('invalid json string');

    const auth = useAuthStore();
    auth.user = { id: 1, username: 'dummy', role: 'client' };
    auth.isAuthenticated = true;

    auth.initializeAuth();

    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
  });

  it('should successfully register a new client user', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({
      data: {
        id: 4,
        username: 'newclient',
        email: 'new@client.com',
        role: 'client',
        password: 'newpass',
        company: '',
      },
    });
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 4,
          username: 'newclient',
          email: 'new@client.com',
          role: 'client',
          password: 'newpass',
          company: '',
        },
      ],
    });

    const auth = useAuthStore();
    const success = await auth.register({
      username: 'newclient',
      email: 'new@client.com',
      password: 'newpass',
      role: 'client',
    });

    expect(success).toBe(true);
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user.username).toBe('newclient');
    expect(auth.userRole).toBe('client');
    expect(auth.loading).toBe(false);
    expect(auth.error).toBeNull();

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/users', {
      username: 'newclient',
      email: 'new@client.com',
      password: 'newpass',
      role: 'client',
      company: '',
    });
  });

  it('should fail registration if username already exists', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, username: 'existinguser' }] });

    const auth = useAuthStore();
    const success = await auth.register({
      username: 'existinguser',
      email: 'new@client.com',
      password: 'newpass',
      role: 'client',
    });

    expect(success).toBe(false);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.error).toBe('Username sudah digunakan. Pilih username lain.');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should fail registration if email already exists', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, email: 'existing@email.com' }] });

    const auth = useAuthStore();
    const success = await auth.register({
      username: 'newuser',
      email: 'existing@email.com',
      password: 'newpass',
      role: 'client',
    });

    expect(success).toBe(false);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.error).toBe('Email sudah terdaftar. Gunakan email lain.');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('should handle API errors during registration', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockRejectedValueOnce(new Error('Server Down'));

    const auth = useAuthStore();
    const success = await auth.register({
      username: 'usererror',
      email: 'error@user.com',
      password: 'pass',
      role: 'ninja',
    });

    expect(success).toBe(false);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.error).toBe('Terjadi kesalahan saat registrasi. Coba lagi nanti.');
  });

  it('isClient getter should return true if userRole is client', () => {
    const auth = useAuthStore();
    auth.userRole = 'client';
    expect(auth.isClient).toBe(true);
    auth.userRole = 'ninja';
    expect(auth.isClient).toBe(false);
  });

  it('isNinja getter should return true if userRole is ninja', () => {
    const auth = useAuthStore();
    auth.userRole = 'ninja';
    expect(auth.isNinja).toBe(true);
    auth.userRole = 'client';
    expect(auth.isNinja).toBe(false);
  });
});
