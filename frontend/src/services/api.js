import { Platform } from 'react-native';
import Constants from 'expo-constants';

const envBaseUrl =
  typeof process !== 'undefined' && process.env
    ? process.env.EXPO_PUBLIC_API_BASE_URL
    : undefined;

const configBaseUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  Constants.manifest?.extra?.apiBaseUrl;

const defaultBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export const API_BASE_URL = (envBaseUrl || configBaseUrl || defaultBaseUrl).replace(/\/+$/, '');

export const buildApiUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

async function parseResponse(response) {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestHeaders = {
    Accept: 'application/json',
    ...headers
  };

  if (body && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Erro ${response.status} ao chamar a API`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  login: (input) => apiRequest('/auth/login', { method: 'POST', body: input }),
  register: (input) => apiRequest('/auth/register', { method: 'POST', body: input }),

  listPets: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiRequest(`/pets${suffix}`);
  },
  listMyPets: (token) => apiRequest('/pets/mine', { token }),
  createPet: (token, input) => apiRequest('/pets', { method: 'POST', token, body: input }),
  updatePet: (token, petId, input) => apiRequest(`/pets/${petId}`, { method: 'PATCH', token, body: input }),
  addPetPhoto: (token, petId, formData) =>
    apiRequest(`/pets/${petId}/photos`, { method: 'POST', token, body: formData }),
  favoritePet: (token, petId) => apiRequest(`/pets/${petId}/favorite`, { method: 'POST', token }),
  unfavoritePet: (token, petId) => apiRequest(`/pets/${petId}/favorite`, { method: 'DELETE', token }),

  createAdoptionRequest: (token, input) =>
    apiRequest('/adoptions/requests', { method: 'POST', token, body: input }),
  listMyRequests: (token) => apiRequest('/adoptions/requests/mine', { token }),
  listInboxRequests: (token) => apiRequest('/adoptions/requests/inbox', { token }),
  approveRequest: (token, requestId, input = {}) =>
    apiRequest(`/adoptions/requests/${requestId}/approve`, { method: 'POST', token, body: input }),
  rejectRequest: (token, requestId) =>
    apiRequest(`/adoptions/requests/${requestId}/reject`, { method: 'POST', token }),

  listMessages: (token, threadId) => apiRequest(`/chat/threads/${threadId}/messages`, { token }),
  sendMessage: (token, threadId, content) =>
    apiRequest(`/chat/threads/${threadId}/messages`, {
      method: 'POST',
      token,
      body: { content }
    })
};
