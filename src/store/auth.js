import { ref } from 'vue';
import axios from 'axios'; 
import store from "@/store";
import Swal from 'sweetalert2';

const logged = ref(false); 
const user = ref('');
const baseURL = `${__API_BIOMETRICO__}/biometrico`; 

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

// Función para decodificar el JWT y ver si expira en los próximos "X" minutos
function isTokenAboutToExpire(token, minutesToWarn = 3) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expTime = payload.exp * 1000; // El JWT exp está en segundos, lo pasamos a milisegundos
    const now = Date.now();
    const timeLeft = expTime - now;

    // Si el tiempo que le queda es menor a los minutos de advertencia y aún no ha expirado
    return timeLeft > 0 && timeLeft < (minutesToWarn * 60 * 1000);
  } catch (e) {
    return false;
  }
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de PETICIÓN (Request) - AQUÍ DETECTAMOS ANTES DE QUE EXPIRE
apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token_bio');
    let tokenType = localStorage.getItem('token_type_bio') || 'Bearer';
    
    // Si la petición actual es para refrescar el token, la dejamos pasar normal
    if (config.url === '/refresh') {
      config.headers.Authorization = `${tokenType} ${token}`;
      return config;
    }

    if (token) {
      // Verificamos si faltan 3 minutos (o menos) para que caduque
      if (isTokenAboutToExpire(token, 3)) {
        
        if (isRefreshing) {
          // Si ya estamos preguntando al usuario, pausamos esta otra petición
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              config.headers.Authorization = `${tokenType} ${newToken}`;
              resolve(config);
            });
          });
        }

        isRefreshing = true;

        try {
          const result = await Swal.fire({
            title: 'Sesión por Expirar',
            text: 'Tu sesión está a punto de caducar. ¿Deseas extenderla?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, extender sesión',
            cancelButtonText: 'No, salir',
            allowOutsideClick: false
          });

          if (result.isConfirmed) {
            // Hacemos la petición de refresh ANTES de que muera
            const refreshResponse = await axios.post(`${baseURL}/refresh`, {}, {
              headers: { 'Authorization': `${tokenType} ${token}` }
            });

            token = refreshResponse.data.token;
            tokenType = refreshResponse.data.token_type || 'Bearer';

            store.commit('setToken_bio', token);
            store.commit('setTokenType_bio', tokenType);

            isRefreshing = false;
            onRefreshed(token);
          } else {
            throw new Error("Usuario rechazó extender la sesión");
          }
        } catch (error) {
          console.warn('Cerrando sesión:', error.message || error);
          isRefreshing = false;
          refreshSubscribers = [];
          store.commit('logout_bio');
          window.location.href = '/biometrico';
          return Promise.reject(error);
        }
      }

      // Si todo está bien o se acaba de refrescar, inyectamos el token
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de RESPUESTA (Response) - Captura por si expira repentinamente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si por algún motivo se nos pasó y el backend nos devuelve 401, cerramos sesión.
    if (error.response && error.response.status === 401 && error.config.url !== '/refresh') {
      store.commit('logout_bio');
      window.location.href = '/biometrico';
    }
    return Promise.reject(error);
  }
);

// Función para obtener el usuario logueado
export const getMe = async () => {
  try {
    const response = await apiClient.get('/me'); 
    localStorage.setItem('user_bio', JSON.stringify(response.data));
    logged.value = true;
    user.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil data:', error);
    throw error;
  }
};