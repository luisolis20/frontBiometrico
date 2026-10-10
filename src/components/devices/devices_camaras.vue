<template>
  <div class="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300">
    
    <!-- Encabezado de la Tabla -->
    <div class="p-5 border-b border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Dispositivos y Cámaras</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Listado de equipos de videovigilancia de HikCentral</p>
        </div>
      </div>

      <!-- Controles Superiores: Buscador + Selector Registros por Página + Refrescar -->
      <div class="flex items-center gap-2">
        <!-- Buscador Local -->
        <div class="relative flex-1 sm:w-64">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar por nombre o IP..." 
            class="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Cantidad por Página -->
        <select 
          v-model="pageSize" 
          @change="onPageSizeChange"
          class="h-9 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 focus:border-indigo-500"
        >
          <option :value="5">5 por pág.</option>
          <option :value="10">10 por pág.</option>
          <option :value="20">20 por pág.</option>
          <option :value="50">50 por pág.</option>
        </select>

        <!-- Botón Actualizar -->
        <button 
          @click="getDevices(currentPage)" 
          :disabled="cargando"
          class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none disabled:opacity-50"
          title="Actualizar"
        >
          <svg class="w-4 h-4" :class="{'animate-spin text-indigo-600': cargando}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenedor de la Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/30 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <th class="py-3 px-5">Nombre del dispositivo</th>
            <th class="py-3 px-5">Dirección IP</th>
            <th class="py-3 px-5 text-center">Conexión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs">
          
          <!-- Skeleton Loading -->
          <tr v-if="cargando" v-for="i in pageSize" :key="'skel-'+i" class="animate-pulse">
            <td class="py-3.5 px-5"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
            <td class="py-3.5 px-5"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
            <td class="py-3.5 px-5 flex justify-center"><div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div></td>
          </tr>

          <!-- Sin Resultados -->
          <tr v-else-if="dispositivosFiltrados.length === 0">
            <td colspan="3" class="py-10 text-center text-gray-400">
              <svg class="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              No se encontraron dispositivos registrados.
            </td>
          </tr>

          <!-- Listado de Dispositivos -->
          <tr 
            v-else 
            v-for="post in dispositivosFiltrados" 
            :key="post.encodeDevIndexCode || post.encodeDevIp"
            class="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
          >
            <td class="py-3.5 px-5 font-medium text-gray-800 dark:text-gray-100">
              {{ post.encodeDevName || 'Dispositivo Sin Nombre' }}
            </td>
            <td class="py-3.5 px-5 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
              {{ post.encodeDevIp || 'N/A' }}
            </td>
            <td class="py-3.5 px-5 text-center">
              <span 
                v-if="post.status === 1"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Online
              </span>
              <span 
                v-else
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                Offline
              </span>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Paginación Inferior -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/30">
      
      <div>
        Mostrando página <span class="font-bold text-gray-800 dark:text-gray-200">{{ currentPage }}</span> de <span class="font-bold text-gray-800 dark:text-gray-200">{{ lastPage }}</span> 
        <span v-if="totalItems > 0">({{ totalItems }} dispositivos en total)</span>
      </div>

      <!-- Botones Paginador -->
      <div class="flex items-center gap-1">
        <button 
          @click="cambiarPagina(currentPage - 1)" 
          :disabled="currentPage === 1 || cargando"
          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-all focus:outline-none"
        >
          Anterior
        </button>

        <button 
          v-for="p in paginasVisibles" 
          :key="'p-'+p"
          @click="cambiarPagina(p)"
          :class="p === currentPage ? 'bg-emerald-600 text-white font-bold border-emerald-600' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'"
          class="px-3 py-1.5 rounded-lg border text-xs transition-all focus:outline-none"
        >
          {{ p }}
        </button>

        <button 
          @click="cambiarPagina(currentPage + 1)" 
          :disabled="currentPage === lastPage || cargando"
          class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-all focus:outline-none"
        >
          Siguiente
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import API from "@/assets/js/services/axios";

export default {
  name: "TablaCamarasHikcentral",
  data() {
    return {
      baseUrl: "/biometrico",
      datadevice: [],
      cargando: false,
      currentPage: 1,
      lastPage: 1,
      pageSize: 10,
      totalItems: 0,
      searchQuery: "",
    };
  },
  computed: {
    // Filtrado en tiempo real sobre la página actual
    dispositivosFiltrados() {
      if (!this.searchQuery) return this.datadevice;
      const q = this.searchQuery.toLowerCase();
      return this.datadevice.filter(
        (dev) =>
          (dev.encodeDevName && dev.encodeDevName.toLowerCase().includes(q)) ||
          (dev.encodeDevIp && dev.encodeDevIp.toLowerCase().includes(q))
      );
    },
    // Calcula los botones numéricos de paginación
    paginasVisibles() {
      const paginas = [];
      const maxVisibles = 5;
      let inicio = Math.max(1, this.currentPage - 2);
      let fin = Math.min(this.lastPage, inicio + maxVisibles - 1);

      if (fin - inicio < maxVisibles - 1) {
        inicio = Math.max(1, fin - maxVisibles + 1);
      }

      for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
      }
      return paginas;
    }
  },
  mounted() {
    this.getDevices(1);
  },
  methods: {
    async getDevices(page = 1) {
      this.cargando = true;
      try {
        const response = await API.get(`${this.baseUrl}/cameras-all`, {
          params: {
            pageNo: page,
            pageSize: this.pageSize
          }
        });

        if (response.data && response.data.success) {
          this.datadevice = response.data.data || [];
          this.currentPage = response.data.pagination.current_page;
          this.lastPage = response.data.pagination.last_page;
          this.totalItems = response.data.pagination.total;
        } else if (response.data && response.data.code === "0") {
          // Soporte directo si el backend retorna formato nativo HikCentral
          this.datadevice = response.data.data.list || [];
          this.currentPage = response.data.data.pageNo || 1;
          this.totalItems = response.data.data.total || 0;
          this.lastPage = Math.ceil(this.totalItems / this.pageSize) || 1;
        } else {
          this.datadevice = [];
        }
      } catch (error) {
        console.warn("⚠️ Error al obtener dispositivos:", error?.response?.data || error);
        this.datadevice = [];
      } finally {
        this.cargando = false;
      }
    },

    cambiarPagina(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.lastPage) {
        this.getDevices(nuevaPagina);
      }
    },

    onPageSizeChange() {
      this.currentPage = 1;
      this.getDevices(1);
    }
  }
};
</script>