'use client';

import { useSyncExternalStore } from 'react';
import { getAuthSnapshot } from '@/lib/auth';

const defaultValue = {
  isAuthenticated: false,
  role: null,
  name: null,
  email: null,
  token: null,
};

const subscribe = (callback) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

export default function useAuthContext() {
  return useSyncExternalStore(subscribe, getAuthSnapshot, () => defaultValue);
}
