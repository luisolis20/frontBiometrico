<template>
  <FullScreenLayout>
    <!-- Pantalla de carga (Spinner Animado) -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 z-50">
      <div class="relative flex items-center justify-center w-24 h-24">
        <!-- Anillo exterior -->
        <div class="absolute inset-0 border-4 border-transparent border-t-brand-500 border-b-brand-500 rounded-full animate-spin"></div>
        <!-- Anillo interior (giro inverso) -->
        <div class="absolute inset-2 border-4 border-transparent border-l-brand-400 border-r-brand-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <!-- Núcleo central palpitante -->
        <div class="absolute inset-7 bg-brand-500/20 rounded-full backdrop-blur-sm animate-pulse border border-brand-500/50"></div>
        <svg class="w-6 h-6 text-brand-500 z-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      </div>
      <p class="mt-6 text-sm font-semibold tracking-widest text-brand-600 uppercase dark:text-brand-400 animate-pulse">
        Inicializando Sistema...
      </p>
    </div>

    <!-- Contenido del Login -->
    <div v-else class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0 transition-opacity duration-500 animate-fade-in">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 lg:mt-0">
            
            <!-- AVATAR ANIMADO TIPO VISME -->
            <div class="relative w-32 h-32 mx-auto mb-8 group cursor-default">
              <!-- Resplandor de fondo -->
              <div class="absolute inset-0 bg-brand-500/30 rounded-full blur-xl animate-pulse group-hover:bg-brand-500/50 transition-colors duration-500"></div>
              
              <!-- Contenedor del Avatar Flotante -->
              <div class="relative w-full h-full bg-gray-50 dark:bg-gray-800 rounded-full border-4 border-brand-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)] overflow-hidden animate-float">
                <!-- SVG del Usuario -->
                <svg viewBox="0 0 100 100" class="w-full h-full text-gray-300 dark:text-gray-600 pt-4" fill="currentColor">
                  <path d="M50 55 C30 55, 15 75, 15 100 L85 100 C85 75, 70 55, 50 55 Z" />
                  <circle cx="50" cy="32" r="18" />
                </svg>
                
                <!-- Animación de Escaneo Facial -->
                <div class="absolute left-0 right-0 h-1 bg-brand-400 opacity-80 scanner-line">
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-b from-brand-400/40 to-transparent"></div>
                </div>
              </div>
            </div>
            <!-- FIN AVATAR -->

            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
                  Sistema Acceso Facial
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                  ¡Ingresa tu usuario y contraseña para iniciar sesión!
                </p>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Usuario<span class="text-error-500">*</span>
                      </label>
                      <input v-model="email" type="name" id="email" name="email" placeholder="info@gmail.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-all duration-300" />
                    </div>
                    <!-- Password -->
                    <div>
                      <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Contraseña<span class="text-error-500">*</span>
                      </label>
                      <div class="relative group">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
                          placeholder="Enter your password"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-all duration-300" />
                        <span @click="togglePasswordVisibility"
                          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 hover:text-brand-500 transition-colors">
                          <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" />
                          </svg>
                          <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Button -->
                    <div>
                      <button type="submit" :disabled="loginInstance.isLoggingIn"
                        class="relative overflow-hidden group flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                        
                        <!-- Efecto de brillo en el botón al pasar el mouse -->
                        <span class="absolute top-0 left-[-100%] w-full h-full bg-white/20 transform skew-x-[45deg] group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></span>
                        
                        <template v-if="loginInstance.isLoggingIn">
                          <svg class="relative z-10 w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="relative z-10">Verificando...</span>
                        </template>
                        <template v-else>
                          <span class="relative z-10">Ingresar</span>
                        </template>
                      </button>
                    </div>
                  </div>
                </form>
                <div class="mt-5">
                  <p class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Si no tienes un usuario y clave dirígete a la Dirección de TIC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4 hover:scale-105 transition-transform duration-300">
                <img width="231" height="48" src="@/assets/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                ¡Juntos y Unidos por la Universidad!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import script3 from "@/assets/js/login";
import CommonGridShape from "@/components/common/CommonGridShape.vue";
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
import { useRouter } from "vue-router";

// Estado para controlar la pantalla de carga inicial
const isLoading = ref(true);

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const keepLoggedIn = ref(false);

const router = useRouter();

const loginInstance = reactive({
  ...script3.data(),
  $router: router,
  ...script3.methods,
});

// Sincronizar valores
watch(email, (val) => (loginInstance.email = val));
watch(password, (val) => (loginInstance.password = val));

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = () => {
  loginInstance.login.call(loginInstance);
};

// Temporizador para quitar el spinner inicial
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1800);
});
</script>

<style scoped>
/* Transición suave para la aparición del login */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- ANIMACIONES TIPO VISME --- */

/* 1. Animación del Avatar Flotando */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); } /* Sube ligeramente */
}

/* 2. Animación de Escaneo Biométrico (Línea que sube y baja) */
.scanner-line {
  animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.6); /* Brillo láser */
}

@keyframes scan {
  0% { top: 0%; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
</style>