import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const API_TIMEOUT = 10_000;
export const TOKEN_STORAGE_KEY = 'fineart_token';
export const TOKEN_COOKIE_KEY = 'fineart_token';
export const ROLE_STORAGE_KEY = 'fineart_role';
export const EMAIL_STORAGE_KEY = 'fineart_email';

const isServer = typeof window === 'undefined';
const needsDevHttpsBypass =
  isServer && API_BASE_URL.startsWith('https://') && process.env.NODE_ENV !== 'production';

let httpsAgent;
if (needsDevHttpsBypass) {
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

export const clearStoredSession = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage?.removeItem(ROLE_STORAGE_KEY);
    window.localStorage?.removeItem(EMAIL_STORAGE_KEY);
  } catch (error) {
    console.warn('[API] Unable to clear auth session:', error);
  }
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

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !Number.isNaN(value);
      return true;
    }),
  );

export const getArticles = (params = {}) =>
  request(
    () =>
      api.get('/api/articles', {
        params: sanitizeParams(params),
      }),
    'GET /api/articles',
  );

export const getArticleById = (id) => {
  const normalizedId =
    typeof id === 'number' ? id.toString() : typeof id === 'string' ? id.trim() : '';

  if (!normalizedId) {
    console.warn('[API] getArticleById called without valid id:', id);
    throw new Error('Article id is required');
  }

  return request(() => api.get(`/api/articles/${normalizedId}`), 'GET /api/articles/:id');
};

export const getArtists = () => request(() => api.get('/api/artists'), 'GET /api/artists');

export const getArtworks = (params = {}) =>
  request(
    () =>
      api.get('/api/artworks', {
        params: sanitizeParams(params),
      }),
    'GET /api/artworks',
  );

export const getArtworkById = (id) => {
  const normalizedId =
    typeof id === 'number' ? id.toString() : typeof id === 'string' ? id.trim() : '';

  if (!normalizedId) {
    throw new Error('Artwork id is required');
  }

  return request(() => api.get(`/api/artworks/${normalizedId}`), 'GET /api/artworks/:id');
};

export const getExhibitions = (params = {}) =>
  request(
    () =>
      api.get('/api/exhibitions', {
        params: sanitizeParams(params),
      }),
    'GET /api/exhibitions',
  );

export const getExhibitionById = (id) => {
  const normalizedId =
    typeof id === 'number' ? id.toString() : typeof id === 'string' ? id.trim() : '';

  if (!normalizedId) {
    console.warn('[API] getExhibitionById called without valid id:', id);
    throw new Error('Exhibition id is required');
  }

  return request(
    () => api.get(`/api/exhibitions/${normalizedId}`),
    'GET /api/exhibitions/:id',
  );
};

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

export const createExhibition = (payload) =>
  request(() => api.post('/api/exhibitions', payload), 'POST /api/exhibitions');

export const updateExhibition = (id, payload) => {
  if (!id) throw new Error('Exhibition id is required');
  return request(
    () => api.put(`/api/exhibitions/${id}`, payload),
    'PUT /api/exhibitions/:id',
  );
};

export const deleteExhibition = (id) => {
  if (!id) throw new Error('Exhibition id is required');
  return request(
    () => api.delete(`/api/exhibitions/${id}`),
    'DELETE /api/exhibitions/:id',
  );
};

export const uploadArticleImage = (file, fieldName = 'file') => {
  if (!file) {
    throw new Error('File is required for upload');
  }

  const formData = new FormData();
  formData.append(fieldName, file);

  return request(
    () =>
      api.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    'POST /api/uploads',
  );
};

export default api;
