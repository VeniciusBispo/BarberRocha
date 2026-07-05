import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor de requisições: injeta o Bearer token JWT em cada chamada se ele existir no localStorage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@Rocha20:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respostas: trata erros globais, em especial expiração de sessão (401)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Tratamento de sessão expirada ou não autorizada
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.warn('[API Client] Sessão expirada ou não autorizada. Limpando dados locais...');
      localStorage.removeItem('@Rocha20:token');
      localStorage.removeItem('@Rocha20:user');
      
      // Apenas redireciona se não estivermos nas páginas de autenticação
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;
