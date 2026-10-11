<template>
  <br>
  <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 hover:shadow-md overflow-visible z-10 w-full mt-6">
    
    <!-- Destello decorativo de fondo (Púrpura/Fucsia para el Gym) -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <div class="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-full blur-2xl"></div>
    </div>

    <div class="p-6 flex flex-col h-full relative z-10">

      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Accesos al Gimnasio
            </h3>
            <p class="text-[11px] text-gray-400">Porcentaje de asistencia (Personal vs Estudiantes)</p>
          </div>
        </div>
      </div>

      <!-- Barra de Filtros -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60 text-xs">
        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Rango Rápido</label>
          <select 
            v-model="rangoGymSeleccionado" 
            @change="onRangoGymSelectChange" 
            :disabled="cargandoGymEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
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
            v-model="beginTimeGym" 
            @change="onCustomDateGymChange" 
            :disabled="cargandoGymEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>

        <div>
          <label class="block text-[10px] font-medium text-gray-400 mb-1">Fecha Fin</label>
          <input 
            type="date" 
            v-model="endTimeGym" 
            @change="onCustomDateGymChange" 
            :disabled="cargandoGymEstadisticas"
            class="w-full h-9 rounded-lg border-gray-200 bg-white px-2 py-1 text-gray-800 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" 
          />
        </div>
      </div>

      <!-- VISTA GRÁFICO -->
      <div class="flex flex-col flex-1">
        
        <!-- KPIs Combinados -->
        <div v-if="estadisticasGymData" class="grid grid-cols-2 gap-4 mb-2 text-center">
          <!-- Tarjeta Estudiantes -->
          <div class="bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <span class="block text-[11px] text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-1">Estudiantes</span>
            <div class="flex justify-around text-xs">
              <div>
                <span class="block text-[10px] text-gray-500">Total</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">{{ estadisticasGymData.estudiantes.total }}</span>
              </div>
              <div>
                <span class="block text-[10px] text-gray-500">Accesos</span>
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ estadisticasGymData.estudiantes.con_acceso }}</span>
              </div>
            </div>
          </div>
          
          <!-- Tarjeta Personal -->
          <div class="bg-rose-50/60 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
            <span class="block text-[11px] text-rose-600 dark:text-rose-400 uppercase font-bold mb-1">Personal</span>
            <div class="flex justify-around text-xs">
              <div>
                <span class="block text-[10px] text-gray-500">Total</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">{{ estadisticasGymData.personal.total }}</span>
              </div>
              <div>
                <span class="block text-[10px] text-gray-500">Accesos</span>
                <span class="font-semibold text-rose-600 dark:text-rose-400">{{ estadisticasGymData.personal.con_acceso }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="cargandoGymEstadisticas" class="animate-pulse flex flex-col items-center justify-center flex-1 min-h-[220px] my-2">
          <div class="w-36 h-36 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
          <span class="mt-3 text-xs text-gray-400 font-medium">Consultando accesos al Gym...</span>
        </div>

        <!-- Componente ApexCharts (Radial Bar) -->
        <div v-show="!cargandoGymEstadisticas" class="flex-1 w-full flex items-center justify-center min-h-[220px]">
          <apexchart 
            v-if="estadisticasGymData && !cargandoGymEstadisticas"
            type="radialBar" 
            width="100%" 
            height="260"
            :options="chartOptionsGym" 
            :series="chartSeriesGym"
          ></apexchart>
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
      // Gym
      cargandoGymEstadisticas: false,
      estadisticasGymData: null,
      rangoGymSeleccionado: 'mes_actual',
      beginTimeGym: '',
      endTimeGym: '',
    };
  },
  computed: {
    chartSeriesGym() {
      if (!this.estadisticasGymData) return [0, 0];
      
      const est = this.estadisticasGymData.estudiantes;
      const per = this.estadisticasGymData.personal;

      const pctEstudiantes = est.total > 0 ? Math.round((est.con_acceso / est.total) * 100) : 0;
      const pctPersonal = per.total > 0 ? Math.round((per.con_acceso / per.total) * 100) : 0;

      return [pctEstudiantes, pctPersonal];
    },
    chartOptionsGym() {
      return {
        chart: { 
          type: 'radialBar', 
          fontFamily: 'inherit', 
          background: 'transparent' 
        },
        labels: ['Estudiantes', 'Personal'],
        colors: ['#10B981', '#F43F5E'], // Verde y Rojo
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '13px',
                color: '#9ca3af',
              },
              value: {
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#374151',
                formatter: function (val) {
                  return val + "%";
                }
              },
              total: {
                show: true,
                label: 'Global %',
                color: '#9ca3af',
                formatter: (w) => {
                  // Promedio simple de asistencia global
                  const series = w.globals.seriesTotals;
                  const avg = Math.round((series[0] + series[1]) / 2);
                  return avg + "%";
                }
              }
            },
            hollow: { size: '45%' },
            track: {
              background: '#f3f4f6', // Color de fondo del riel
              strokeWidth: '100%',
              margin: 5,
            }
          }
        },
        stroke: { lineCap: 'round' },
        legend: {
          show: true,
          position: 'bottom',
          fontSize: '11px',
          labels: { colors: '#9ca3af' },
          markers: { radius: 12 }
        },
        tooltip: { theme: 'dark' }
      };
    }
  },
  mounted() {
    this.aplicarRangoFechaGym();
    this.cargarTodo();
  },
  methods: {
    cargarTodo() {
      this.obtenerEstadisticasGym();
    },
    async obtenerEstadisticasGym() {
      if (!this.beginTimeGym || !this.endTimeGym) return;

      this.cargandoGymEstadisticas = true;
      try {
        const payload = { beginTime: this.beginTimeGym, endTime: this.endTimeGym };
        // Endpoint que creamos en el backend combinando ambas consultas
        const response = await API.post(`${this.baseUrl}/estadisticas-accesos-gym`, payload);
        
        if (response.data && response.data.success) {
          this.estadisticasGymData = response.data.data;
        } else {
          this.resetData();
        }
      } catch (error) {
        console.error("Error estadísticas Gym:", error);
        this.resetData();
      } finally {
        this.cargandoGymEstadisticas = false;
      }
    },
    resetData() {
      this.estadisticasGymData = { 
        estudiantes: { total: 0, con_acceso: 0, sin_acceso: 0 },
        personal: { total: 0, con_acceso: 0, sin_acceso: 0 }
      };
    },
    aplicarRangoFechaGym() {
      if (this.rangoGymSeleccionado === 'custom') return;      
      const hoy = new Date();
      
      const formatoFecha = (d) => {
        let mes = '' + (d.getMonth() + 1), dia = '' + d.getDate(), anio = d.getFullYear();
        if (mes.length < 2) mes = '0' + mes;
        if (dia.length < 2) dia = '0' + dia;
        return [anio, mes, dia].join('-');
      };

      if (this.rangoGymSeleccionado === 'hoy') {
        this.beginTimeGym = formatoFecha(hoy); this.endTimeGym = formatoFecha(hoy);
      } else if (this.rangoGymSeleccionado === 'ayer') {
        const ayer = new Date(hoy); ayer.setDate(hoy.getDate() - 1);
        this.beginTimeGym = formatoFecha(ayer); this.endTimeGym = formatoFecha(ayer);
      } else if (this.rangoGymSeleccionado === 'esta_semana') {
        const diaSemana = hoy.getDay(), distLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
        const distViernes = diaSemana === 0 ? -2 : 5 - diaSemana;
        const lunes = new Date(hoy); lunes.setDate(hoy.getDate() + distLunes);
        const viernes = new Date(hoy); viernes.setDate(hoy.getDate() + distViernes);
        this.beginTimeGym = formatoFecha(lunes); this.endTimeGym = formatoFecha(viernes);
      } else if (this.rangoGymSeleccionado === 'mes_actual') {
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        this.beginTimeGym = formatoFecha(primerDiaMes); this.endTimeGym = formatoFecha(ultimoDiaMes);
      } else if (this.rangoGymSeleccionado === 'mes_anterior') {
        const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        this.beginTimeGym = formatoFecha(primerDiaMesAnterior); this.endTimeGym = formatoFecha(ultimoDiaMesAnterior);
      }
    },
    onRangoGymSelectChange() {
      this.aplicarRangoFechaGym();
      this.obtenerEstadisticasGym();
    },
    onCustomDateGymChange() {
      this.rangoGymSeleccionado = 'custom';
      if (this.beginTimeGym && this.endTimeGym) {
        this.obtenerEstadisticasGym();
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