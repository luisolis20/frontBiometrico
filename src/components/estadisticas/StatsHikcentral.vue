<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10">
      <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
        <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      <div class="p-6 flex flex-col h-full z-10 relative">
        <!-- Skeleton Loading -->
        <div v-if="cargandoDispositivos" class="animate-pulse flex flex-col h-full gap-4">
          <div class="flex justify-between w-full">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mt-auto"></div>
        </div>

        <!-- Contenido -->
        <div v-else class="flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Dispositivos de Control de Acceso
            </h3>
            <div class="flex items-center gap-2">
              <!-- Botón Actualizar -->
              <button @click="obtenerDispositivos" class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none" title="Actualizar">
                <svg class="w-4 h-4" :class="{'animate-spin text-blue-500': cargandoDispositivos}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
              <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ porcentajeOnline }}%</span>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Online</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {{ dispositivosOnline }} de {{ totalDispositivos }} dispositivos activos
          </p>

          <div class="mt-auto">
            <div class="flex items-center gap-1 w-full h-3 rounded-full overflow-visible">
              <div v-for="(dev, index) in dispositivos" :key="index"
                   class="relative group h-full flex-1 rounded-full cursor-pointer transition-all duration-300 hover:scale-y-150"
                   :class="dev.status === 1 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'">
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-[60] w-max max-w-[220px]">
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45"></div>
                  <div class="bg-gray-900 text-white text-xs rounded-lg py-2.5 px-3.5 shadow-xl animate-fade-in-up relative z-10 border border-gray-700">
                    <p class="font-bold truncate text-sm mb-0.5">{{ dev.acsDevName || 'Dispositivo' }}</p>
                    <p class="text-gray-400 font-mono text-[11px]">{{ dev.acsDevIp || 'Sin IP' }}</p>
                  </div>
                </div>
              </div>
            </div>
             <div class="flex items-center justify-between mt-4 text-[11px] font-medium text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Conectados
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Desconectados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10">
      
      <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
        <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div class="p-6 flex flex-col h-full z-10 relative">
        
        <!-- Skeleton Loading -->
        <div v-if="cargandoCamaras" class="animate-pulse flex flex-col h-full gap-4">
          <div class="flex justify-between w-full">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mt-auto"></div>
        </div>

        <!-- Contenido Principal -->
        <div v-else class="flex flex-col h-full">
          <!-- Encabezado de la tarjeta -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cámaras CCTV
            </h3>
            <div class="flex items-center gap-2">
              <!-- Botón Actualizar -->
              <button @click="obtenerCamaras" class="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none" title="Actualizar">
                <svg class="w-4 h-4" :class="{'animate-spin text-indigo-500': cargandoCamaras}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Métricas (Porcentaje y Totales) -->
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ porcentajeCamarasOnline }}%
            </span>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Online</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {{ camarasOnline }} de {{ totalCamaras }} cámaras activas
          </p>

          <!-- Gráfico de Segmentos (Indicadores por cámara) -->
          <div class="mt-auto">
            <div class="flex items-center gap-0.5 w-full h-3 rounded-full overflow-visible">
              <div 
                v-for="(cam, index) in camaras" 
                :key="index"
                class="relative group h-full flex-1 cursor-pointer transition-all duration-300 hover:scale-y-150"
                :class="[
                  cam.status === 1 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400',
                  index === 0 ? 'rounded-l-full' : '', 
                  index === camaras.length - 1 ? 'rounded-r-full' : ''
                ]"
              >
                <!-- Tooltip Animado (Hover) -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-[60] w-max max-w-[220px]">
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45"></div>
                  <div class="bg-gray-900 text-white text-xs rounded-lg py-2.5 px-3.5 shadow-xl animate-fade-in-up relative z-10 border border-gray-700">
                    <p class="font-bold truncate text-sm mb-0.5">{{ cam.encodeDevName || 'Cámara' }}</p>
                    <p class="text-gray-400 font-mono text-[11px]">{{ cam.encodeDevIp || 'Sin IP' }}</p>
                    <div class="flex items-center gap-1.5 mt-2 border-t border-gray-700 pt-1.5">
                      <span class="w-1.5 h-1.5 rounded-full" :class="cam.status === 1 ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'"></span>
                      <span class="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                        {{ cam.status === 1 ? 'En línea' : 'Fuera de línea' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Leyenda simple inferior -->
            <div class="flex items-center justify-between mt-4 text-[11px] font-medium text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Conectadas
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Desconectadas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import API from "@/assets/js/services/axios";

export default {
  name: 'StatsHikcentral',
  data() {
    return {
      baseUrl: "/biometrico",
      // Control de Acceso
      cargandoDispositivos: true,
      dispositivos: [],
      // Cámaras
      cargandoCamaras: true,
      camaras: [],
    };
  },
  computed: {
    // Computados Control de Acceso
    totalDispositivos() { return this.dispositivos.length; },
    dispositivosOnline() { return this.dispositivos.filter(d => d.status === 1).length; },
    porcentajeOnline() {
      if (this.totalDispositivos === 0) return 0;
      return Math.round((this.dispositivosOnline / this.totalDispositivos) * 100);
    },

    // Computados Cámaras
    totalCamaras() { return this.camaras.length; },
    camarasOnline() { return this.camaras.filter(c => c.status === 1).length; },
    porcentajeCamarasOnline() {
      if (this.totalCamaras === 0) return 0;
      return Math.round((this.camarasOnline / this.totalCamaras) * 100);
    },
   
  },
  mounted() {
    this.cargarTodo();
  },
  methods: {
    cargarTodo() {
      this.obtenerDispositivos();
      this.obtenerCamaras();
    },
    async obtenerDispositivos() {
      this.cargandoDispositivos = true;
      try {
        const response = await API.get(`${this.baseUrl}/devices`);
        if (response.data && response.data.code === "0") {
          this.dispositivos = response.data.data.list || [];
        } else {
          this.dispositivos = [];
        }
      } catch (error) {
        console.error("Error en la petición de dispositivos:", error);
        this.dispositivos = [];
      } finally {
        this.cargandoDispositivos = false;
      }
    },
    async obtenerCamaras() {
      this.cargandoCamaras = true;
      try {
        const response = await API.get(`${this.baseUrl}/cameras`);
        // Depuración
        if (response.data && response.data.code === "0") {
          this.camaras = response.data.data.list || [];
        } else {
          this.camaras = [];
        }
      } catch (error) {
        console.error("Error en la petición de cámaras:", error);
        this.camaras = [];
      } finally {
        this.cargandoCamaras = false;
      }
    },
  },
};
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.15s ease-out forwards;
}

</style>