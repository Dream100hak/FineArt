import { TOKEN_COOKIE_KEY, TOKEN_STORAGE_KEY } from './api';

const defaultSnapshot = Object.freeze({
  isAuthenticated: false,
  role: null,
  name: null,
  email: null,
  token: null,
});

const decodeSegment = (segment) => {
  const padded = segment.padEnd(Math.ceil(segment.length / 4) * 4, '=');
  const normalized = padded.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const json = window.atob(normalized);
    return JSON.parse(json);
  } catch {
    return {};
  }
};

const readCookieToken = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.localStorage?.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      return token;
    }
  } catch {
    // no-op
  }

  return readCookieToken();
};

export const decodeJwtPayload = (token) => {
  if (!token) return null;
  const [, payloadSegment] = token.split('.');
  if (!payloadSegment) return null;
  return decodeSegment(payloadSegment);
};

const resolveRole = (payload) => {
  if (!payload) return null;
  if (payload.role) return payload.role;
  if (payload.Role) return payload.Role;
  if (Array.isArray(payload.roles) && payload.roles.length > 0) {
    return payload.roles[0];
  }

  return null;
};

let cachedSnapshot = defaultSnapshot;
let cachedToken = null;

const buildSnapshot = (token) => {
  if (!token) {
    return defaultSnapshot;
  }

  try {
    const payload = decodeJwtPayload(token);
    return {
      isAuthenticated: true,
      role: resolveRole(payload),
      name: payload?.name ?? payload?.nickname ?? payload?.sub ?? null,
      email: payload?.email ?? payload?.sub ?? null,
      token,
    };
  } catch {
    return defaultSnapshot;
  }
};

export const getAuthSnapshot = () => {
  if (typeof window === 'undefined') {
    return cachedSnapshot;
  }

  const token = getStoredToken();
  if (token === cachedToken) {
    return cachedSnapshot;
  }

  cachedToken = token;
  cachedSnapshot = buildSnapshot(token);
  return cachedSnapshot;
};
