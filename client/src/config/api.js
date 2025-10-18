// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  baseUrl: API_BASE_URL,
  auth: {
    login: `${API_BASE_URL}/apis/auth/login`,
    register: `${API_BASE_URL}/apis/auth/register`,
    google: `${API_BASE_URL}/apis/auth/google`,
  },
  recipes: {
    all: `${API_BASE_URL}/apis/recipes`,
    my: `${API_BASE_URL}/apis/recipes/my`,
    byId: (id) => `${API_BASE_URL}/apis/recipes/${id}`,
    create: `${API_BASE_URL}/apis/recipes`,
    update: (id) => `${API_BASE_URL}/apis/recipes/${id}`,
    delete: (id) => `${API_BASE_URL}/apis/recipes/${id}`,
  },
  categories: {
    all: `${API_BASE_URL}/apis/categories`,
  },
  gemini: {
    generate: `${API_BASE_URL}/apis/gemini/generate`,
  },
};

export default API_ENDPOINTS;
