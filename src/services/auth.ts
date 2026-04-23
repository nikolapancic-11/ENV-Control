import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/config';
import { User } from '../types';
import { getAccessToken, setTokens, clearTokens } from './api';

const USER_KEY = '@env-control/user';

const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@envcontrol.com',
  displayName: 'Demo User',
  role: 'user',
};

// ─── Public API ──────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<User> {
  if (
    email === Config.demo.email &&
    password === Config.demo.password
  ) {
    // Demo mode – store a fake token and user
    await setTokens('demo-access-token', 'demo-refresh-token');
    await storeUser(DEMO_USER);
    return DEMO_USER;
  }

  // Real credentials would go through Azure AD here.
  throw new Error('Invalid credentials');
}

export async function logout(): Promise<void> {
  await clearTokens();
  await AsyncStorage.removeItem(USER_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}

export async function getCurrentUser(): Promise<User | null> {
  return getStoredUser();
}

// ─── Helpers ─────────────────────────────────────────────────────

export async function storeUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as User;
}
