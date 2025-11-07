import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
});

export const getArticles = async () => {
  const response = await api.get('/api/articles');
  return response.data;
};

export const getArticleById = async (id) => {
  if (!id) throw new Error('Article id is required');
  const response = await api.get(`/api/articles/${id}`);
  return response.data;
};

export default api;
