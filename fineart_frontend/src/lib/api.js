import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const API_TIMEOUT = 10_000;
const TOKEN_STORAGE_KEY = 'fineart_token';
const TOKEN_COOKIE_KEY = 'fineart_token';

const isServer = typeof window === 'undefined';
const needsDevHttpsBypass =
  isServer && API_BASE_URL.startsWith('https://') && process.env.NODE_ENV !== 'production';

let httpsAgent;
if (needsDevHttpsBypass) {
  // eslint-disable-next-line global-require
  const { Agent } = require('https');
  httpsAgent = new Agent({ rejectUnauthorized: false });
  console.warn('[API] Development HTTPS certificate validation disabled for self-signed backend.');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  ...(httpsAgent ? { httpsAgent } : {}),
});

const readCookieToken = () => {
  if (typeof document === 'undefined') return null;
  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE_KEY}=([^;]*)`),
  );
  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;

  try {
    const storedToken = window.localStorage?.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      return storedToken;
    }
  } catch (error) {
    console.warn('[API] Unable to read token from localStorage:', error);
  }

  return readCookieToken();
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const request = async (callback, label) => {
  try {
    const response = await callback();
    return response.data;
  } catch (error) {
    const reason = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
    console.error(`[API] ${label} failed: ${reason}`, error);
    throw error;
  }
};

export const getArticles = () => request(() => api.get('/api/articles'), 'GET /api/articles');

export const getArticleById = (id) => {
  if (!id) throw new Error('Article id is required');
  return request(() => api.get(`/api/articles/${id}`), 'GET /api/articles/:id');
};

export const getArtists = () => request(() => api.get('/api/artists'), 'GET /api/artists');

export const getArtworks = () => request(() => api.get('/api/artworks'), 'GET /api/artworks');

export const createArticle = (payload) =>
  request(() => api.post('/api/articles', payload), 'POST /api/articles');

export const updateArticle = (id, payload) => {
  if (!id) throw new Error('Article id is required');
  return request(() => api.put(`/api/articles/${id}`, payload), 'PUT /api/articles/:id');
};

export const deleteArticle = (id) => {
  if (!id) throw new Error('Article id is required');
  return request(() => api.delete(`/api/articles/${id}`), 'DELETE /api/articles/:id');
};

export default api;
