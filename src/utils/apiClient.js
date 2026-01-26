/**
 * Centralized API client with authentication headers
 * All API calls should use these methods to ensure proper auth handling
 */

import { getApiUrls } from '@/config/api';

/**
 * Get authentication headers from Redux store or localStorage
 * @returns {Object} Headers object with Authorization
 */
const getAuthHeaders = () => {
  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authState?.accessToken) {
    headers['Authorization'] = `Bearer ${authState.accessToken}`;
  }
  
  return headers;
};

/**
 * Authenticated fetch wrapper
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  
  const mergedOptions = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, mergedOptions);
  
  // Handle 401 Unauthorized - could trigger logout
  if (response.status === 401) {
    console.warn('API returned 401 Unauthorized - token may be expired');
    // Could dispatch logout action here if needed
  }
  
  return response;
};

/**
 * GET request with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authGet = (url, options = {}) => {
  return authenticatedFetch(url, { ...options, method: 'GET' });
};

/**
 * POST request with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authPost = (url, body, options = {}) => {
  return authenticatedFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PATCH request with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authPatch = (url, body, options = {}) => {
  return authenticatedFetch(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

/**
 * PUT request with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authPut = (url, body, options = {}) => {
  return authenticatedFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request with authentication
 * @param {string} url - The URL to fetch
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authDelete = (url, options = {}) => {
  return authenticatedFetch(url, { ...options, method: 'DELETE' });
};

/**
 * POST with FormData (for file uploads) with authentication
 * @param {string} url - The URL to fetch
 * @param {FormData} formData - FormData object
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const authPostFormData = (url, formData, options = {}) => {
  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const headers = {};
  
  if (authState?.accessToken) {
    headers['Authorization'] = `Bearer ${authState.accessToken}`;
  }
  
  return fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      ...headers,
      ...options.headers,
    },
    body: formData,
  });
};

export default {
  authenticatedFetch,
  authGet,
  authPost,
  authPatch,
  authPut,
  authDelete,
  authPostFormData,
};
