import axios from 'axios';

// Configuración base de la API
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests: Inyecta token + tenantId
apiClient.interceptors.request.use(
  (config) => {
    // Obtener usuario del localStorage
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Agregar JWT token si existe
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        // Agregar Tenant-ID header (solo si no es SuperAdmin)
        if (user.empresaId && user.rol !== 'SuperAdmin') {
          config.headers['X-Tenant-ID'] = user.empresaId;
        }
        
        // Para SuperAdmin, puede enviar tenantId como parámetro opcional
        if (user.rol === 'SuperAdmin' && config.params?.tenantId) {
          config.headers['X-Tenant-ID'] = config.params.tenantId;
        }
        
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses: Manejo de errores globales
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o no autorizado
          console.error('No autorizado - redirigiendo al login');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Acceso prohibido (sin permisos para este recurso)
          console.error('Acceso prohibido:', error.response.data);
          break;
          
        case 404:
          console.error('Recurso no encontrado:', error.response.config.url);
          break;
          
        case 500:
          console.error('Error del servidor:', error.response.data);
          break;
          
        default:
          console.error('Error de API:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      // Request hecho pero sin respuesta
      console.error('Sin respuesta del servidor:', error.request);
    } else {
      // Error al configurar el request
      console.error('Error en la configuración del request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
