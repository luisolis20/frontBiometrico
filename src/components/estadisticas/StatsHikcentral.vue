<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
    
    <!-- ==========================================
         TARJETA 1: CONTROL DE ACCESO
         ========================================== -->
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

    <!-- ==========================================
         TARJETA 2: CÁMARAS DE SEGURIDAD
         ========================================== -->
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
  <br>
  <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10 w-full">
    
    <!-- Destello decorativo de fondo -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <div class="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl"></div>
    </div>

    <div class="p-6 flex flex-col h-full relative z-10">

      <!-- Encabezado de la Tarjeta -->
      <!-- Encabezado + Pestañas de Navegación -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Asistencia Facial - Estudiantes matriculados
            </h3>
            <p class="text-[11px] text-gray-400">Control de accesos de estudiantes matriculados</p>
          </div>
        </div>

        <!-- Selector de Pestañas (Vista Gráfica vs Tabla) -->
        <div class="flex items-center bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl text-xs font-medium self-stretch sm:self-auto">
          <button 
            @click="cambiarVista('grafico')" 
            :class="vistaActiva === 'grafico' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all"
          >
            Gráfico
          </button>
          <button 
            @click="cambiarVista('tabla')" 
            :class="vistaActiva === 'tabla' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all"
          >
            Tabla de Eventos
          </button>
        </div>
      </div>

      <!-- Barra de Filtros Intuitiva -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60 text-xs">
        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Rango Rápido</label>
          <select 
            v-model="rangoSeleccionado" 
            @change="onRangoSelectChange" 
            :disabled="cargandoEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="custom">Personalizado</option>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="esta_semana">Esta semana</option>
            <option value="mes_actual">Mes actual</option>
            <option value="mes_anterior">Mes anterior</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Fecha Inicio</label>
          <input 
            type="date" 
            v-model="beginTime" 
            @change="onCustomDateChange" 
            :disabled="cargandoEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>

        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Fecha Fin</label>
          <input 
            type="date" 
            v-model="endTime" 
            @change="onCustomDateChange" 
            :disabled="cargandoEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>
      </div>
      <div v-if="vistaActiva === 'grafico'" class="flex flex-col flex-1">
        <!-- Métricas Resumen (KPIs) -->
        <div v-if="estadisticasData" class="grid grid-cols-3 gap-2 mb-4 text-center">
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
            <span class="block text-[10px] text-gray-400 uppercase font-semibold">Total matriculados</span>
            <span class="text-sm font-bold text-gray-800 dark:text-white">{{ estadisticasData.total_matriculados }}</span>
          </div>
          <div class="bg-emerald-50/60 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <span class="block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Con Acceso</span>
            <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ estadisticasData.con_acceso }}</span>
          </div>
          <div class="bg-rose-50/60 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
            <span class="block text-[10px] text-rose-600 dark:text-rose-400 uppercase font-semibold">Sin Registro</span>
            <span class="text-sm font-bold text-rose-600 dark:text-rose-400">{{ estadisticasData.sin_acceso }}</span>
          </div>
        </div>

        <!-- Estado de Carga (Skeleton) -->
        <div v-if="cargandoEstadisticas" class="animate-pulse flex flex-col items-center justify-center flex-1 min-h-[200px] my-2">
          <div class="w-36 h-36 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
          <span class="mt-3 text-xs text-gray-400 font-medium">Consultando eventos de puertas...</span>
        </div>

        <!-- Gráfico ApexCharts (Donut) -->
        <div v-show="!cargandoEstadisticas" class="flex-1 w-full flex items-center justify-center min-h-[200px]">
          <apexchart 
            v-if="estadisticasData && !cargandoEstadisticas"
            type="donut" 
            width="100%" 
            height="220"
            :options="chartOptions" 
            :series="chartSeries"
          ></apexchart>
        </div>
      </div>
      <!-- ================= VISTA 2: TABLA DE EVENTOS ================= -->
      <div v-else-if="vistaActiva === 'tabla'" class="flex flex-col flex-1">
        
        <!-- Skeleton Tabla -->
        <div v-if="cargando" class="animate-pulse space-y-2 py-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-lg w-full"></div>
        </div>

        <!-- Tabla de Datos -->
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase text-[10px] font-semibold">
                <th class="py-2.5 px-3">Estudiante</th>
                <th class="py-2.5 px-3">Puerta</th>
                <th class="py-2.5 px-3">Fecha y Hora</th>
                <th class="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-300">
              <tr v-if="eventosTabla.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-400">
                  No se encontraron registros en este rango de fechas.
                </td>
              </tr>
              <tr v-for="evt in eventosTabla" :key="evt.eventId" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <td class="py-2.5 px-3">
                  <p class="font-bold text-gray-800 dark:text-gray-100 truncate max-w-[180px]">{{ evt.personName }}</p>
                  <p class="text-[10px] text-gray-400 font-mono">CI: {{ evt.cardNo }} • {{ evt.carrera }}</p>
                </td>
                <td class="py-2.5 px-3 font-medium text-gray-600 dark:text-gray-300">
                  {{ evt.doorName }}
                </td>
                <td class="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                  {{ formatearFecha(evt.eventTime) }}
                </td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Matriculado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación de Tabla -->
        <div v-if="pagination.last_page > 1" class="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-gray-700 text-xs">
          <span class="text-gray-400 text-[11px]">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
          <div class="flex gap-1">
            <button 
              @click="cambiarPaginaTabla(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1 || cargando"
              class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 disabled:opacity-40"
            >
              Anterior
            </button>
            <button 
              @click="cambiarPaginaTabla(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page || cargando"
              class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
  <br>
  <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10 w-full">
    
    <!-- Destello decorativo de fondo (Azul/Indigo para diferenciar del de estudiantes) -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <div class="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
    </div>

    <div class="p-6 flex flex-col h-full relative z-10">

      <!-- Encabezado + Pestañas de Navegación -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Asistencia de Personal
            </h3>
            <p class="text-[11px] text-gray-400">Control de accesos para empleados activos</p>
          </div>
        </div>

        <!-- Selector de Pestañas -->
        <div class="flex items-center bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl text-xs font-medium self-stretch sm:self-auto">
          <button 
            @click="cambiarPersonalVista('grafico')" 
            :class="vistaActivaPersonal === 'grafico' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all"
          >
            Gráfico
          </button>
          <button 
            @click="cambiarPersonalVista('tabla')" 
            :class="vistaActivaPersonal === 'tabla' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all"
          >
            Tabla de Eventos
          </button>
        </div>
      </div>

      <!-- Barra de Filtros -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60 text-xs">
        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Rango Rápido</label>
          <select 
            v-model="rangoPersonalSeleccionado" 
            @change="onRangoPersonalSelectChange" 
            :disabled="cargandoPersonalEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="custom">Personalizado</option>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="esta_semana">Esta semana</option>
            <option value="mes_actual">Mes actual</option>
            <option value="mes_anterior">Mes anterior</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Fecha Inicio</label>
          <input 
            type="date" 
            v-model="beginTimePersonal" 
            @change="onCustomDatePersonalChange" 
            :disabled="cargandoPersonalEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>

        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Fecha Fin</label>
          <input 
            type="date" 
            v-model="endTimePersonal" 
            @change="onCustomDatePersonalChange" 
            :disabled="cargandoPersonalEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>
      </div>

      <!-- ================= VISTA 1: GRÁFICO DONUT ================= -->
      <div v-if="vistaActivaPersonal === 'grafico'" class="flex flex-col flex-1">
        <!-- KPIs -->
        <div v-if="estadisticasPersonalData" class="grid grid-cols-3 gap-2 mb-4 text-center">
          <div class="bg-gray-50 dark:bg-gray-700/40 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
            <span class="block text-[10px] text-gray-400 uppercase font-semibold">Total Personal</span>
            <span class="text-sm font-bold text-gray-800 dark:text-white">{{ estadisticasPersonalData.total_personal }}</span>
          </div>
          <div class="bg-indigo-50/60 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <span class="block text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-semibold">Con Acceso</span>
            <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ estadisticasPersonalData.con_acceso }}</span>
          </div>
          <div class="bg-rose-50/60 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
            <span class="block text-[10px] text-rose-600 dark:text-rose-400 uppercase font-semibold">Sin Registro</span>
            <span class="text-sm font-bold text-rose-600 dark:text-rose-400">{{ estadisticasPersonalData.sin_acceso }}</span>
          </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="cargandoPersonalEstadisticas" class="animate-pulse flex flex-col items-center justify-center flex-1 min-h-[200px] my-2">
          <div class="w-36 h-36 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
          <span class="mt-3 text-xs text-gray-400 font-medium">Consultando eventos de puertas...</span>
        </div>

        <!-- Componente ApexCharts -->
        <div v-show="!cargandoPersonalEstadisticas" class="flex-1 w-full flex items-center justify-center min-h-[200px]">
          <apexchart 
            v-if="estadisticasPersonalData && !cargandoPersonalEstadisticas"
            type="donut" 
            width="100%" 
            height="220"
            :options="chartOptionsPersonal" 
            :series="chartSeriesPersonal"
          ></apexchart>
        </div>
      </div>

      <!-- ================= VISTA 2: TABLA DE EVENTOS ================= -->
      <div v-else-if="vistaActivaPersonal === 'tabla'" class="flex flex-col flex-1">
        
        <!-- Skeleton Tabla -->
        <div v-if="cargandoPersonal" class="animate-pulse space-y-2 py-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-lg w-full"></div>
        </div>

        <!-- Tabla de Datos -->
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase text-[10px] font-semibold">
                <th class="py-2.5 px-3">Empleado</th>
                <th class="py-2.5 px-3">Puerta</th>
                <th class="py-2.5 px-3">Fecha y Hora</th>
                <th class="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-300">
              <tr v-if="eventosTablaPersonal.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-400">
                  No se encontraron eventos de personal en este rango.
                </td>
              </tr>
              <tr v-for="evt in eventosTablaPersonal" :key="evt.eventId" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <td class="py-2.5 px-3">
                  <p class="font-bold text-gray-800 dark:text-gray-100 truncate max-w-[200px]">{{ evt.personName }}</p>
                  <p class="text-[10px] text-gray-400 font-mono">CI: {{ evt.cardNo }} • {{ evt.tipoEmpleado }}</p>
                </td>
                <td class="py-2.5 px-3 font-medium text-gray-600 dark:text-gray-300">
                  {{ evt.doorName }}
                </td>
                <td class="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                  {{ formatearFecha(evt.eventTime) }}
                </td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                    Personal Activo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación de Tabla -->
        <div v-if="paginationPersonal.last_page > 1" class="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-gray-700 text-xs">
          <span class="text-gray-400 text-[11px]">Página {{ paginationPersonal.current_page }} de {{ paginationPersonal.last_page }}</span>
          <div class="flex gap-1">
            <button 
              @click="cambiarPaginaTablaPersonal(paginationPersonal.current_page - 1)"
              :disabled="paginationPersonal.current_page === 1 || cargandoPersonal"
              class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 disabled:opacity-40"
            >
              Anterior
            </button>
            <button 
              @click="cambiarPaginaTablaPersonal(paginationPersonal.current_page + 1)"
              :disabled="paginationPersonal.current_page === paginationPersonal.last_page || cargandoPersonal"
              class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import API from "@/assets/js/services/axios";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'StatsHikcentral',
  components: { apexchart: VueApexCharts },
  data() {
    return {
      
      baseUrl: "/biometrico",
      vistaActiva: 'grafico',
      vistaActivaPersonal: 'grafico',
      cargando: false,
      cargandoPersonal: false,
      // Control de Acceso
      cargandoDispositivos: true,
      dispositivos: [],

      // Cámaras
      cargandoCamaras: true,
      camaras: [],
      cargandoEstadisticas: false,
      estadisticasData: null,
      eventosTabla: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },
      rangoSeleccionado: 'mes_actual',
      beginTime: '',
      endTime: '',
      // Personal
      cargandoPersonalEstadisticas: false,
      estadisticasPersonalData: null,
      eventosTablaPersonal: [],
      paginationPersonal: {
        current_page: 1,
        last_page: 1,
        total: 0
      },
      rangoPersonalSeleccionado: 'mes_actual',
      beginTimePersonal: '',
      endTimePersonal: '',
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
    chartSeries() {
      if (!this.estadisticasData) return [0, 0];
      return [
        Number(this.estadisticasData.con_acceso) || 0, 
        Number(this.estadisticasData.sin_acceso) || 0
      ];
    },
    chartOptions() {
      const total = this.estadisticasData ? this.estadisticasData.total_matriculados : 1;
      const conAcceso = this.estadisticasData ? this.estadisticasData.con_acceso : 0;
      const porcentaje = total > 0 ? Math.round((conAcceso / total) * 100) : 0;

      return {
        chart: { 
          type: 'donut', 
          fontFamily: 'inherit', 
          background: 'transparent' 
        },
        labels: ['Con Registro de Acceso', 'Sin Registro de Acceso'],
        colors: ['#10b981', '#f43f5e'], // Verde Esmeralda y Rojo Rosado
        stroke: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              size: '72%',
              labels: {
                show: true,
                name: { 
                  show: true, 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  offsetY: -4 
                },
                value: { 
                  show: true, 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: '#10b981', 
                  formatter: () => `${porcentaje}%` 
                },
                total: { 
                  show: true, 
                  showAlways: true, 
                  label: 'ASISTENCIA', 
                  fontSize: '10px', 
                  color: '#9ca3af', 
                  formatter: () => `${porcentaje}%` 
                }
              }
            }
          }
        },
        legend: { 
          position: 'bottom', 
          fontSize: '11px', 
          labels: { colors: '#9ca3af' },
          markers: { radius: 12 } 
        },
        tooltip: { 
          theme: 'dark', 
          y: { formatter: (val) => `${val} Estudiantes` } 
        }
      };
    },
    //Personal
    chartSeriesPersonal() {
      if (!this.estadisticasPersonalData) return [0, 0];
      return [
        Number(this.estadisticasPersonalData.con_acceso) || 0, 
        Number(this.estadisticasPersonalData.sin_acceso) || 0
      ];
    },
    chartOptionsPersonal() {
      const total = this.estadisticasPersonalData ? this.estadisticasPersonalData.total_personal : 1;
      const conAcceso = this.estadisticasPersonalData ? this.estadisticasPersonalData.con_acceso : 0;
      const porcentaje = total > 0 ? Math.round((conAcceso / total) * 100) : 0;

      return {
        chart: { 
          type: 'donut', 
          fontFamily: 'inherit', 
          background: 'transparent' 
        },
        labels: ['Con Registro de Acceso', 'Sin Registro de Acceso'],
        colors: ['#10b981', '#f43f5e'], // Verde Esmeralda y Rojo Rosado
        stroke: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              size: '72%',
              labels: {
                show: true,
                name: { 
                  show: true, 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  offsetY: -4 
                },
                value: { 
                  show: true, 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: '#10b981', 
                  formatter: () => `${porcentaje}%` 
                },
                total: { 
                  show: true, 
                  showAlways: true, 
                  label: 'ASISTENCIA', 
                  fontSize: '10px', 
                  color: '#9ca3af', 
                  formatter: () => `${porcentaje}%` 
                }
              }
            }
          }
        },
        legend: { 
          position: 'bottom', 
          fontSize: '11px', 
          labels: { colors: '#9ca3af' },
          markers: { radius: 12 } 
        },
        tooltip: { 
          theme: 'dark', 
          y: { formatter: (val) => `${val} Personal` } 
        }
      };
    },
  },
  mounted() {
    this.aplicarRangoFecha();
    this.aplicarRangoFechaPersonal();
    this.cargarTodo();
  },
  methods: {
    cargarTodo() {
      this.obtenerDispositivos();
      this.obtenerCamaras();
      this.cargarVistaActual();
      this.cargarPersonalVistaActual();
    },
    cambiarVista(vista) {
      this.vistaActiva = vista;
      this.cargarVistaActual();
    },
    //Personal
    cambiarPersonalVista(vista) {
      this.vistaActivaPersonal = vista;
      this.cargarPersonalVistaActual();
    },

    cargarVistaActual() {
      if (this.vistaActiva === 'grafico') {
        this.obtenerEstadisticas();
      } else {
        this.obtenerTablaEventos();
      }
    },
    //Personal
    cargarPersonalVistaActual() {
      if (this.vistaActivaPersonal === 'grafico') {
        this.obtenerEstadisticasPersonal();
      } else {
        this.obtenerTablaEventosPersonal();
      }
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
    async obtenerEstadisticas() {
      this.cargandoEstadisticas = true;
      try {
        const payload = { beginTime: this.beginTime, endTime: this.endTime };
        // Ajusta la ruta a tu API de Laravel
        const response = await API.post(`${this.baseUrl}/eventos-estadisticas-estudiantes`, payload);
        
        if (response.data && response.data.success) {
          this.estadisticasData = response.data.data;
        } else {
          this.estadisticasData = { total_matriculados: 0, con_acceso: 0, sin_acceso: 0 };
        }
      } catch (error) {
        console.error("Error estadísticas:", error);
        this.estadisticasData = null;
      } finally {
        this.cargandoEstadisticas = false;
      }
    },
    //Personal
    async obtenerEstadisticasPersonal() {
      this.cargandoPersonalEstadisticas = true;
      try {
        const payload = { beginTime: this.beginTimePersonal, endTime: this.endTimePersonal };
        // Ajusta la ruta a tu API de Laravel
        const response = await API.post(`${this.baseUrl}/eventos-estadisticas-personal`, payload);
        
        if (response.data && response.data.success) {
          this.estadisticasPersonalData = response.data.data;
        } else {
          this.estadisticasPersonalData = { total_personal: 0, con_acceso: 0, sin_acceso: 0 };
        }
      } catch (error) {
        console.error("Error estadísticas:", error);
        this.estadisticasPersonalData = null;
      } finally {
        this.cargandoPersonalEstadisticas = false;
      }
    },
    aplicarRangoFecha() {
      if (this.rangoSeleccionado === 'custom') return;

      const hoy = new Date();
      const formatoFecha = (d) => {
        let mes = '' + (d.getMonth() + 1);
        let dia = '' + d.getDate();
        const anio = d.getFullYear();

        if (mes.length < 2) mes = '0' + mes;
        if (dia.length < 2) dia = '0' + dia;

        return [anio, mes, dia].join('-');
      };

      if (this.rangoSeleccionado === 'hoy') {
        this.beginTime = formatoFecha(hoy);
        this.endTime = formatoFecha(hoy);
      } else if (this.rangoSeleccionado === 'ayer') {
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);
        this.beginTime = formatoFecha(ayer);
        this.endTime = formatoFecha(ayer);
      } else if (this.rangoSeleccionado === 'esta_semana') {
        const diaSemana = hoy.getDay();
        const distLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
        const distViernes = diaSemana === 0 ? -2 : 5 - diaSemana;
        
        const lunes = new Date(hoy);
        lunes.setDate(hoy.getDate() + distLunes);
        
        const viernes = new Date(hoy);
        viernes.setDate(hoy.getDate() + distViernes);

        this.beginTime = formatoFecha(lunes);
        this.endTime = formatoFecha(viernes);
      } else if (this.rangoSeleccionado === 'mes_actual') {
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        this.beginTime = formatoFecha(primerDiaMes);
        this.endTime = formatoFecha(ultimoDiaMes);
      } else if (this.rangoSeleccionado === 'mes_anterior') {
        const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

        this.beginTime = formatoFecha(primerDiaMesAnterior);
        this.endTime = formatoFecha(ultimoDiaMesAnterior);
      }
    },
    //Personal
    aplicarRangoFechaPersonal() {
      if (this.rangoPersonalSeleccionado === 'custom') return;      
      const hoy = new Date();
      const formatoFecha = (d) => {
        let mes = '' + (d.getMonth() + 1), dia = '' + d.getDate(), anio = d.getFullYear();
        if (mes.length < 2) mes = '0' + mes;
        if (dia.length < 2) dia = '0' + dia;
        return [anio, mes, dia].join('-');
      };
      if (this.rangoPersonalSeleccionado === 'hoy') {
        this.beginTimePersonal = formatoFecha(hoy); this.endTimePersonal = formatoFecha(hoy);
      } else if (this.rangoPersonalSeleccionado === 'ayer') {
        const ayer = new Date(hoy); ayer.setDate(hoy.getDate() - 1);
        this.beginTimePersonal = formatoFecha(ayer); this.endTimePersonal = formatoFecha(ayer);
      } else if (this.rangoPersonalSeleccionado === 'esta_semana') {
        const diaSemana = hoy.getDay(), distLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
        const distViernes = diaSemana === 0 ? -2 : 5 - diaSemana;
        
        const lunes = new Date(hoy); lunes.setDate(hoy.getDate() + distLunes);
        const viernes = new Date(hoy); viernes.setDate(hoy.getDate() + distViernes);
        
        this.beginTimePersonal = formatoFecha(lunes); this.endTimePersonal = formatoFecha(viernes);
      } else if (this.rangoPersonalSeleccionado === 'mes_actual') {
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        
        this.beginTimePersonal = formatoFecha(primerDiaMes); this.endTimePersonal = formatoFecha(ultimoDiaMes);
      } else if (this.rangoPersonalSeleccionado === 'mes_anterior') {
        const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        
        this.beginTimePersonal = formatoFecha(primerDiaMesAnterior); this.endTimePersonal = formatoFecha(ultimoDiaMesAnterior);
      }
    },

    onRangoSelectChange() {
      this.aplicarRangoFecha();
      this.cargarVistaActual();
    },
    //Personal
    onRangoPersonalSelectChange() {
      this.aplicarRangoFechaPersonal();
      this.cargarPersonalVistaActual();
    },

    onCustomDateChange() {
      this.rangoSeleccionado = 'custom';
      if (this.beginTime && this.endTime) {
        this.cargarVistaActual();
      }
    },
    //Personal
    onCustomDatePersonalChange() {
      this.rangoPersonalSeleccionado = 'custom';
      if (this.beginTimePersonal && this.endTimePersonal) {
        this.cargarPersonalVistaActual();
      }
    },
    async obtenerTablaEventos(pagina = 1) {
      if (!this.beginTime || !this.endTime) return;

      this.cargando = true;
      try {
        const response = await API.post(`${this.baseUrl}/eventos-tabla-estudiantes`, {
          beginTime: this.beginTime,
          endTime: this.endTime,
          page: pagina,
          perPage: 10
        });

        if (response.data && response.data.success) {
          this.eventosTabla = response.data.data || [];
          this.pagination = response.data.pagination || this.pagination;
        }
      } catch (error) {
        console.error("Error tabla eventos:", error);
      } finally {
        this.cargando = false;
      }
    },
    //Personal
    async obtenerTablaEventosPersonal(pagina = 1) {
      if (!this.beginTimePersonal || !this.endTimePersonal) return;      
      this.cargandoPersonal = true;
      try {
        const response = await API.post(`${this.baseUrl}/eventos-tabla-personal`, {
          beginTime: this.beginTimePersonal,
          endTime: this.endTimePersonal,
          page: pagina,
          perPage: 10
        });
        console.log("✅ Eventos obtenidos tabla:", response);
        if (response.data && response.data.success) {
          this.eventosTablaPersonal = response.data.data || [];
          this.paginationPersonal = response.data.pagination || this.paginationPersonal;
        }
      } catch (error) {
        console.error("Error tabla eventos:", error);
      } finally {
        this.cargandoPersonal = false;
      }
    },

    cambiarPaginaTabla(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.pagination.last_page) {
        this.obtenerTablaEventos(nuevaPagina);
      }
    },
    //Personal
    cambiarPaginaTablaPersonal(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.paginationPersonal.last_page) {
        this.obtenerTablaEventosPersonal(nuevaPagina);
      }
    },

    formatearFecha(fechaIso) {
      if (!fechaIso) return '-';
      const f = new Date(fechaIso);
      return f.toLocaleString('es-EC', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
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
/* Opcional: Asegurar que el gráfico de ApexCharts se adapte bien en dark mode si tu app lo usa */
:deep(.apexcharts-tooltip) {
  background: #1f2937 !important;
  border: 1px solid #374151 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}
:deep(.apexcharts-tooltip-title) {
  background: #111827 !important;
  border-bottom: 1px solid #374151 !important;
}
</style>