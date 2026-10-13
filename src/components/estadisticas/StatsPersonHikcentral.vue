<template>
  <br>
  <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10 w-full">
    
    
    <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <div class="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
    </div>

    <div class="p-6 flex flex-col h-full relative z-10">

      <!-- Encabezado + Pestañas de Navegación -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            :class="vistaActivaPersonal === 'grafico' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all"
          >
            Gráfico
          </button>
          <button 
            @click="cambiarPersonalVista('tabla')" 
            :class="vistaActivaPersonal === 'tabla' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
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
          <div class="bg-emerald-50/60 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <span class="block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Con Acceso</span>
            <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ estadisticasPersonalData.con_acceso }}</span>
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
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
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
      vistaActivaPersonal: 'grafico',
      cargandoPersonal: false,
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
    this.aplicarRangoFechaPersonal();
    this.cargarTodo();
  },
  methods: {
    cargarTodo() {
      this.cargarPersonalVistaActual();
    },
    cambiarPersonalVista(vista) {
      this.vistaActivaPersonal = vista;
      this.cargarPersonalVistaActual();
    },
    cargarPersonalVistaActual() {
      if (this.vistaActivaPersonal === 'grafico') {
        this.obtenerEstadisticasPersonal();
      } else {
        this.obtenerTablaEventosPersonal();
      }
    },
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
    onRangoPersonalSelectChange() {
      this.aplicarRangoFechaPersonal();
      this.cargarPersonalVistaActual();
    },
    onCustomDatePersonalChange() {
      this.rangoPersonalSeleccionado = 'custom';
      if (this.beginTimePersonal && this.endTimePersonal) {
        this.cargarPersonalVistaActual();
      }
    },
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
        //console.log("✅ Eventos obtenidos tabla:", response);
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