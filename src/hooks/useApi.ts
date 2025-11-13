import { useState, useCallback } from 'react';
import apiClient from '../services/api/apiClient';
import { AxiosRequestConfig, AxiosError } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T = unknown>(
    method: HttpMethod, 
    url: string, 
    data: unknown = null, 
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiClient.get<T>(url, config);
          break;
        case 'post':
          response = await apiClient.post<T>(url, data, config);
          break;
        case 'put':
          response = await apiClient.put<T>(url, data, config);
          break;
        case 'patch':
          response = await apiClient.patch<T>(url, data, config);
          break;
        case 'delete':
          response = await apiClient.delete<T>(url, config);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      setLoading(false);
      return { data: response.data, error: null };
      
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  return { request, loading, error };
}
