import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiClient.get(url, config);
          break;
        case 'post':
          response = await apiClient.post(url, data, config);
          break;
        case 'put':
          response = await apiClient.put(url, data, config);
          break;
        case 'patch':
          response = await apiClient.patch(url, data, config);
          break;
        case 'delete':
          response = await apiClient.delete(url, config);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      setLoading(false);
      return { data: response.data, error: null };
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  return { request, loading, error };
}
