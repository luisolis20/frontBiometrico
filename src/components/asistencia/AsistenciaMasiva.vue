<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center mb-6">
    <!-- Search Form -->
    <form class="flex-grow">
      <div class="relative">
        <div class="absolute -translate-y-1/2 left-4 top-1/2 flex items-center justify-center">
          <svg v-if="cargando" class="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <svg v-else class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
          </svg>
        </div>
        <input type="text" placeholder="Ingresa la cédula o nombre a buscar..." v-model="searchQuery"
          @input="debouncedFilter" :disabled="cargando || syncMode" @keypress="onlyNumbers"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px] disabled:opacity-50 disabled:cursor-not-allowed" />
      </div>
    </form>
    <div>
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Total de personal UTLVTE con foto: {{
        totalEmpleados }}</label>
    </div>

    <!-- Combobox for Carrera Filter -->
    <div class="relative w-full md:w-auto md:min-w-[280px]">
      <!-- @change llama al debouncedFilter, que inicia la nueva consulta al backend -->
      <select v-model="selectedtipodoc" @change="debouncedFilter" :disabled="cargando || syncMode"
        class="appearance-none h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed">
        <option v-for="item in tipodocList" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>

  </div>
  <div class="flex flex-col gap-4 mt-4 mb-6 md:flex-row md:items-end">
    <div class="flex-1">
      <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rango
        Rápido</label>
      <select v-model="rangoSeleccionado" @change="aplicarRangoFecha" :disabled="cargandoAsistencia"
        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90">
        <option value="custom">Personalizado</option>
        <option value="hoy">Hoy</option>
        <option value="ayer">Ayer</option>
        <option value="esta_semana">Esta semana (Lun - Vie)</option>
        <option value="mes_actual">Mes actual</option>
        <option value="mes_anterior">Mes anterior</option>
      </select>
    </div>

    <div class="flex-1">
      <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de
        Inicio</label>
      <input type="date" v-model="beginTime" @change="rangoSeleccionado = 'custom'" :disabled="cargandoAsistencia"
        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90" />
    </div>

    <div class="flex-1">
      <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de
        Fin</label>
      <input type="date" v-model="endTime" @change="rangoSeleccionado = 'custom'" :disabled="cargandoAsistencia"
        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90" />
    </div>

    <button @click="buscarAsistencia" :disabled="cargandoAsistencia"
      class="h-11 px-6 rounded-lg flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600">
      <svg v-if="cargandoAsistencia" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
        </circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <span>{{ cargandoAsistencia ? 'Buscando...' : 'Buscar Reporte' }}</span>
    </button>
    <button @click="sincronizarMasivo" :disabled="syncModeMasivo || cargandoAsistencia"
      class="h-11 px-6 rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
      <svg v-if="syncModeMasivo" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
        </path>
      </svg>
      <span>{{ syncModeMasivo ? 'Procesando DB Completa...' : 'Sincronización Masiva Total' }}</span>
    </button>
  </div>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-3/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Usuario
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Tipo personal
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Foto HIKCENTRAL
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Registrado en HIKCENTRAL
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400"></p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr class="border-t border-gray-100 dark:border-gray-800" v-if="cargando">
            <td class="px-5 py-8 sm:px-6" colspan="4">
              <div class="flex flex-col items-center justify-center gap-2">
                <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Obteniendo listado de
                  empleados...</span>
              </div>
            </td>
          </tr>
          <template v-else v-for="post in filteredpostulaciones" :key="post.CIInfPer">
            <tr
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                    <img v-if="post.hasPhoto" :src="getPhotoUrl(post.CIInfPer)" @error="handleImageError"
                      class="object-cover w-full h-full" />
                  </div>
                  <div>
                    <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {{ post.CIInfPer }}
                    </span>
                    <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ post.NombInfPer + " " + post.ApellInfPer + " " + post.ApellMatInfPer }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ post.TipoInfPer === 'A' ? 'Administrativo' : (post.TipoInfPer === 'T' ? 'Trabajador' : 'Otro') }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                    <img :src="getPhotoUrl2(post.CIInfPer)" @error="handleImageError"
                      class="object-cover w-full h-full" />
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center">
                  <span v-if="post.estaRegistradoHC === null"
                    class="flex items-center gap-1 text-gray-400 text-theme-xs">
                    <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"></svg>
                    Verificando...
                  </span>
                  <span v-else-if="post.estaRegistradoHC === true"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg> Sí
                  </span>
                  <span v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                    </svg> No
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 sm:px-6 text-center">
                <button v-if="post.estaRegistradoHC" @click="toggleAccordion(post)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm focus:outline-none">
                  {{ post.showAccordion ? 'Ocultar Asistencia' : 'Ver Asistencia' }}
                  <i :class="post.showAccordion ? 'fas fa-chevron-up ml-1' : 'fas fa-chevron-down ml-1'"></i>
                </button>
              </td>
            </tr>

            <transition name="fade-slide">
              <tr v-if="post.showAccordion" class="bg-gray-50/50 dark:bg-gray-800/20">
                <td colspan="5" class="p-6">
                  <div
                    class="relative border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">

                    <div v-if="post.cargandoDatos" class="flex justify-center items-center py-6">
                      <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      <span class="ml-2 text-sm text-gray-500">Obteniendo registros...</span>
                    </div>

                    <div v-else>
                      <transition name="fade">
                        <div v-if="post.mostrarTablaLocal && post.datosLocales && post.datosLocales.length > 0"
                          class="mb-6">
                          <h4
                            class="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80 flex items-center gap-2">
                            <i class="fas fa-database text-blue-500"></i> Registros Actuales (Base de Datos Local)
                          </h4>
                          <div class="overflow-x-auto border border-blue-100 dark:border-blue-800/50 rounded-lg">
                            <table class="w-full text-left border-collapse min-w-[800px]">
                              <thead class="bg-blue-50/50 dark:bg-blue-900/10">
                                <tr class="text-xs font-medium text-blue-800 dark:text-blue-400">
                                  <th class="py-2 px-4">Fecha</th>
                                  <th class="py-2 px-4 text-center">Hora Entrada</th>
                                  <th class="py-2 px-4 text-center">Hora Salida</th>
                                  <th class="py-2 px-4 text-center">Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(localRecord, index) in post.datosLocales" :key="index"
                                  class="border-t border-gray-100 dark:border-gray-800/50 text-xs text-gray-700 dark:text-gray-300">
                                  <td class="py-2 px-4 font-medium">{{ localRecord.fecha }}</td>
                                  <td class="py-2 px-4 text-center font-mono">{{
                                    formatTimeFromDB(localRecord.hora_entrada) }}</td>
                                  <td class="py-2 px-4 text-center font-mono">{{
                                    formatTimeFromDB(localRecord.hora_salida) }}</td>
                                  <td class="py-2 px-4 text-center">
                                    <span
                                      :class="['px-2 py-0.5 text-[10px] font-semibold rounded-full border', obtenerClasePorEstadoDB(localRecord.estado_asistencia || localRecord.estado)]">
                                      {{ localRecord.estado_asistencia || localRecord.estado || 'Desconocido' }}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </transition>

                      <div v-if="post.existeEnDB && post.mostrarTablaLocal"
                        class="p-3 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        <span class="font-bold">Información Local:</span> Se encontraron marcaciones previas. Puedes
                        sobreescribirlas.
                      </div>
                      <div v-else-if="post.attendanceData && post.attendanceData.length > 0"
                        class="p-3 mb-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        <span class="font-bold">Información Local:</span> No hay marcaciones previas. Serán registradas
                        como nuevas.
                      </div>

                      <div v-if="post.attendanceData && post.attendanceData.length > 0">
                        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80 flex items-center gap-2">
                          <i class="fas fa-cloud-download-alt text-emerald-500"></i> Datos Encontrados en HikCentral
                        </h4>
                        <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                          <table class="w-full text-left border-collapse min-w-[800px]">
                            <thead class="bg-gray-50 dark:bg-gray-800/50">
                              <tr class="text-xs font-medium text-gray-500 dark:text-gray-400">
                                <th class="py-2 px-4">Fecha</th>
                                <th class="py-2 px-4 text-center">Entrada HC</th>
                                <th class="py-2 px-4 text-center">Salida HC</th>
                                <th class="py-2 px-4 text-center">Estado HC</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(record, idx) in post.attendanceData" :key="idx"
                                class="border-t border-gray-100 dark:border-gray-800/50 text-xs text-gray-700 dark:text-gray-300">
                                <td class="py-2 px-4 font-medium">{{ record.date }}</td>
                                <td class="py-2 px-4 text-center font-mono">{{
                                  formatTimeFromDB(record.attendanceBaseInfo?.beginTime) }}</td>
                                <td class="py-2 px-4 text-center font-mono">{{
                                  formatTimeFromDB(record.attendanceBaseInfo?.endTime) }}</td>
                                <td class="py-2 px-4 text-center">
                                  <span
                                    :class="['px-2.5 py-1 text-[10px] font-semibold rounded-full border', obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).class]">
                                    {{ obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label }}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <button @click="sincronizarUsuarioIndividual(post)" :disabled="post.sincronizando"
                          class="h-10 px-6 w-full rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                          <svg v-if="post.sincronizando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                          </svg>
                          <i v-else class="fas fa-sync-alt"></i>
                          <span>{{ post.sincronizando ? 'Procesando Sincronización...' : 'Comparar y Registrar (Solo este usuario)' }}</span>
                        </button>
                      </div>

                      <div v-else-if="!post.cargandoDatos" class="text-center py-6 text-gray-500 dark:text-gray-400">
                        <i class="fas fa-folder-open text-3xl mb-2 opacity-50"></i>
                        <p class="text-sm">No se encontraron marcaciones en HikCentral para este rango de fechas.</p>
                      </div>

                    </div>
                  </div>
                </td>
              </tr>
            </transition>
          </template>
        </tbody>
      </table>
    </div>

    <br /><br />
    <div class="d-flex justify-content-center mb-4">
      <button @click="previousPage" :disabled="currentPage === 1 || buscando" class="btn btn-primary text-white">
        <i class="fas fa-angle-left"></i></button>&nbsp; <span class="text-dark">Página {{ currentPage }} de {{ lastPage
        }}</span>&nbsp;
      <button @click="nextPage" :disabled="currentPage === lastPage || buscando" class="btn btn-primary text-white">
        <i class="fas fa-angle-right"></i>
      </button>
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;
  </div>
</template>


<script>
import API from "@/assets/js/services/axios";
import { useRoute } from "vue-router";
import JSZip from "jszip";
import Modal from '@/components/Modal/Modal.vue'
import { saveAs } from "file-saver";
import debounce from 'lodash.debounce';
import Swal from 'sweetalert2';
import { mostraralertas2, enviarsolig, eliminacion, confimarhabi, elimnarpermanente } from '@/assets/js/function/funciones';

export default {
  data() {
    return {
      idus: 0,
      baseUrl: "/biometrico", // Ajustado para usar la base
      postulacionespr: [],
      filteredpostulaciones: [],
      objetoeditar: {
        CIInfPer: 0,
        nombre_us: "",
        mailPer: "",
        TipoInfPer: "",
      },
      searchQuery: "",
      cargando: false,
      currentPage: 1,
      lastPage: 1,
      buscando: false, // Mantenido, pero no se usa en la lógica de paginación actual
      grafico: null, // Mantenido, pero no se usa aquí
      photoCache: {}, // 🆕 Cache para almacenar URLs de fotos si es necesario
      debouncedFilter: null,
      selectedtipodoc: 'Todos', // Valor inicial para seleccionar todas las carreras
      tipodocList: [
        { label: "Todos", value: "Todos" },
        { label: "Administrativo", value: "A" },
        { label: "Trabajador", value: "T" },
      ], // Lista de carreras únicas para el combobox
      totalEmpleados: 0,
      refreshKey: Date.now(),
      estaRegistrado: false,
      cargandoStatus: false,
      comparando: false,
      syncMode: false,
      pendientes: [],
      syncIndex: 0,
      currentSyncName: '',
      abortController: null,
      rangoSeleccionado: "custom",
      cargandoAsistencia: false,
      beginTime: "",
      endTime: "",
      // Variables de estados
      cargandoAsistencia: false,
      syncModeMasivo: false,
      abortController: null,
    };
  },
  computed: {
    progressSync() {
      return this.pendientes.length > 0
        ? Math.round((this.syncIndex / this.pendientes.length) * 100)
        : 0;
    },
    noRegistradosCount() {
      return this.filteredpostulaciones.filter(post => post.estaRegistradoHC === false).length;
    }
  },
  created() {
    // Ahora sí puedes usar this.filterAndFetch
    this.debouncedFilter = debounce(() => {
      this.filterAndFetch();
    }, 900);
  },
  async mounted() {
    const ruta = useRoute();
    // const usuario = await getMe(); // Solo si es necesario para autenticación
    //this.idus = ruta.params.id; // Asumiendo que `id` es relevante
    this.getAdministrativosD(1, this.searchQuery, this.selectedtipodoc);

  },
  methods: {
    aplicarRangoFecha() {
      if (this.rangoSeleccionado === 'custom') return;

      const hoy = new Date();

      const formatoFecha = (fecha) => {
        const d = new Date(fecha);
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
        // 🆕 Lógica para el día de Ayer
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);

        this.beginTime = formatoFecha(ayer);
        this.endTime = formatoFecha(ayer);

      } else if (this.rangoSeleccionado === 'esta_semana') {
        const diaSemana = hoy.getDay();
        const distanciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
        const lunes = new Date(hoy);
        lunes.setDate(hoy.getDate() + distanciaLunes);

        const distanciaViernes = diaSemana === 0 ? -2 : 5 - diaSemana;
        const viernes = new Date(hoy);
        viernes.setDate(hoy.getDate() + distanciaViernes);

        this.beginTime = formatoFecha(lunes);
        this.endTime = formatoFecha(viernes);

      } else if (this.rangoSeleccionado === 'mes_actual') {
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        this.beginTime = formatoFecha(primerDiaMes);
        this.endTime = formatoFecha(ultimoDiaMes);

      } else if (this.rangoSeleccionado === 'mes_anterior') {
        // 🆕 Lógica exacta para el Mes Anterior
        const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

        this.beginTime = formatoFecha(primerDiaMesAnterior);
        this.endTime = formatoFecha(ultimoDiaMesAnterior);
      }
    },
    async buscarAsistencia() {
      if (!this.beginTime || !this.endTime) {
        mostraralertas2("Por favor seleccione la fecha de inicio y fin.", "warning");
        return;
      }
      if (new Date(this.beginTime) > new Date(this.endTime)) {
        mostraralertas2("La fecha de inicio no puede ser mayor que la fecha de fin.", "warning");
        return;
      }

      this.cargandoAsistencia = true;

      // Iterar sobre los postulantes filtrados y cargarlos uno por uno (abriendo el acordeón)
      for (let post of this.filteredpostulaciones) {
        if (post.estaRegistradoHC) {
          post.showAccordion = true;
          await this.cargarDatosUsuario(post);
        }
      }
      this.cargandoAsistencia = false;
      mostraralertas2("Búsqueda completada en la página actual.", "success");
    },

    // Lógica para abrir/cerrar acordeón individual
    async toggleAccordion(post) {
      post.showAccordion = !post.showAccordion;
      if (post.showAccordion && (!post.attendanceData || post.attendanceData.length === 0)) {
        await this.cargarDatosUsuario(post);
      }
    },
    async cargarDatosUsuario(post) {
      if (!this.beginTime || !this.endTime) {
        mostraralertas2("Faltan fechas", "warning");
        post.showAccordion = false;
        return;
      }

      post.cargandoDatos = true;
      try {
        // 1. Datos HC
        const resHC = await API.post('/biometrico/attendance-report', {
          personCode: post.CIInfPer,
          personId: post.personIdHC, // <-- Agregamos el personId aquí por si la API lo requiere
          beginTime: this.beginTime,
          endTime: this.endTime
        });

        if (resHC.data && resHC.data.data && resHC.data.data.record) {
          post.attendanceData = resHC.data.data.record;
        } else {
          post.attendanceData = [];
        }

        // 2. Datos Locales
        const resLocal = await API.post('/biometrico/check-local-attendance', {
          ci_empleado: post.CIInfPer,
          beginTime: this.beginTime,
          endTime: this.endTime
        });

        post.existeEnDB = resLocal.data.exists;
        post.datosLocales = resLocal.data.data || [];
        post.mostrarTablaLocal = post.existeEnDB;

      } catch (error) {
        console.error("Error cargando usuario " + post.CIInfPer, error);
        post.attendanceData = [];
        post.datosLocales = [];
      } finally {
        post.cargandoDatos = false;
      }
    },
    async sincronizarUsuarioIndividual(post) {
      post.mostrarTablaLocal = false;
      post.sincronizando = true;

      const marcacionesValidas = post.attendanceData.filter(
        record => String(record.attendanceBaseInfo?.attendanceStatus) !== '7'
      );

      const marcacionesFormateadas = marcacionesValidas.map(record => {
        return {
          fecha: record.date,
          hora_entrada: record.attendanceBaseInfo?.beginTime || null,
          hora_almuerzo_salida: this.calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime, record.restInfo?.durationTime) || null,
          hora_almuerzo_entrada: record.attendanceDetailInfo?.recordTime?.[0]?.endTime || null,
          hora_salida: record.attendanceBaseInfo?.endTime || null,
          estado_asistencia: this.obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label || null
        };
      });

      try {
        const response = await API.post('/biometrico/attendance-sync', {
          ci_empleado: post.CIInfPer,
          beginTime: this.beginTime,
          endTime: this.endTime,
          marcaciones: marcacionesFormateadas
        });

        mostraralertas2("Usuario sincronizado con éxito.", "success");
        // Refrescar sus datos
        await this.cargarDatosUsuario(post);
      } catch (error) {
        console.error("Error al sincronizar individual", error);
        mostraralertas2("Ocurrió un error en la sincronización individual.", "error");
        post.mostrarTablaLocal = true;
      } finally {
        post.sincronizando = false;
      }
    },

    // Nuevo método para validar los estados de la tabla actual
    async verificarRegistrosMasivos() {
      // Creamos una copia local para evitar problemas si filteredpostulaciones cambia
      const items = this.filteredpostulaciones;

      for (let post of items) {
        // Si el usuario cambió de página o filtró de nuevo mientras procesábamos, detenemos este bucle
        if (this.cargando) break;

        try {
          // Hacemos las peticiones UNA POR UNA
          const res = await API.get(`${this.baseUrl}/getperson/${post.CIInfPer}`);
          post.estaRegistradoHC = res.data.registrado;
          post.personIdHC = res.data.personId || null;
          console.log(`CI ${post.CIInfPer}: Registrado en HC = ${post.estaRegistradoHC}`);

        } catch (e) {
          post.estaRegistradoHC = false;
          post.personIdHC = null;
        }

        // Opcional: un delay de 50ms para dar respiro al servidor
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
    calcularSalidaBreak(horaEntrada, duracionMinutos) {
      if (!horaEntrada || !duracionMinutos) return null;
      const [horas, minutos] = horaEntrada.split(':');
      const fecha = new Date();
      fecha.setHours(parseInt(horas, 10));
      fecha.setMinutes(parseInt(minutos, 10));

      // Restar los minutos de duración para obtener la hora en la que salió
      fecha.setMinutes(fecha.getMinutes() - parseInt(duracionMinutos, 10));

      return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:00`;
    },

    formatTimeFromDB(isoString) {
      if (!isoString) return "--:--";
      try {
        if (isoString.includes("T")) {
          const date = new Date(isoString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        if (isoString.match(/^\d{2}:\d{2}:\d{2}$/)) {
          return isoString.substring(0, 5);
        }
        return isoString;
      } catch (e) {
        return "--:--";
      }
    },
    async sincronizarMasivo() {
      if (!this.beginTime || !this.endTime) {
        mostraralertas2("Por favor seleccione el rango de fechas antes de sincronizar.", "warning");
        return;
      }

      // Flag global para controlar estados de carga en la vista general si lo necesitas (ej: deshabilitar botones)
      this.cargandoSincronizacionMasiva = true;
      let usuariosProcesados = 0;

      // Iterar de manera secuencial sobre la lista filtrada
      for (let post of this.filteredpostulaciones) {

        // Solo sincronizar si está registrado en HC y tiene marcaciones listas para procesar
        if (!post.estaRegistradoHC || !post.attendanceData || post.attendanceData.length === 0) {
          continue;
        }

        post.mostrarTablaLocal = false;
        post.sincronizando = true;

        // 1. Filtrar las marcaciones (Excluir estado '7')
        const marcacionesValidas = post.attendanceData.filter(
          record => String(record.attendanceBaseInfo?.attendanceStatus) !== '7'
        );

        // 2. Formatear idéntico al método individual
        const marcacionesFormateadas = marcacionesValidas.map(record => {
          return {
            fecha: record.date,
            hora_entrada: record.attendanceBaseInfo?.beginTime || null,
            hora_almuerzo_salida: this.calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime, record.restInfo?.durationTime) || null,
            hora_almuerzo_entrada: record.attendanceDetailInfo?.recordTime?.[0]?.endTime || null,
            hora_salida: record.attendanceBaseInfo?.endTime || null,
            estado_asistencia: this.obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label || null
          };
        });

        try {
          // 3. Enviar al backend incluyendo el personId procesado previamente
          await API.post('/biometrico/attendance-sync', {
            ci_empleado: post.CIInfPer,
            personId: post.personIdHC, // Enviado por consistencia arquitectónica
            beginTime: this.beginTime,
            endTime: this.endTime,
            marcaciones: marcacionesFormateadas
          });

          // 4. Refrescar los datos locales del usuario de forma inmediata
          await this.cargarDatosUsuario(post);
          usuariosProcesados++;

        } catch (error) {
          console.error(`Error al sincronizar masivamente al usuario: ${post.CIInfPer}`, error);
          post.mostrarTablaLocal = true;
        } finally {
          post.sincronizando = false;
        }

        // Delay preventivo de 50ms para evitar colisiones de concurrencia en ráfaga hacia la base de datos
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.cargandoSincronizacionMasiva = false;

      if (usuariosProcesados > 0) {
        mostraralertas2(`Sincronización masiva completada con éxito. ${usuariosProcesados} usuarios actualizados.`, "success");
      } else {
        mostraralertas2("No se encontraron usuarios válidos con marcaciones cargadas para sincronizar.", "info");
      }
    },

    obtenerClasePorEstadoDB(estadoTexto) {
      if (!estadoTexto) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      const clases = {
        "Normal": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        "Tarde": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        "Salida Anticipada": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
        "Ausente": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        "Tarde y Salida Ant.": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
        "Día Festivo": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        "No Programado": "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        "Permiso": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
      };
      return clases[estadoTexto] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    },

    obtenerEstiloEstado(estadoId) {
      const estados = {
        1: { label: "Normal", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200" },
        2: { label: "Tarde", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" },
        3: { label: "Salida Anticipada", class: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200" },
        4: { label: "Ausente", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200" },
        5: { label: "Tarde y Salida Ant.", class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200" },
        6: { label: "Día Festivo", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" },
        7: { label: "No Programado", class: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200" },
        8: { label: "Permiso", class: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200" }
      };
      return estados[estadoId] || { label: "Desconocido", class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200" };
    },
    // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
    getPhotoUrl(ci) {
      const baseURL2 = API.defaults.baseURL;
      return `${baseURL2}/biometrico/fotografiadoc/${ci}?v=${this.refreshKey}`;
    },
    getPhotoUrl2(ci) {
      const baseURL2 = API.defaults.baseURL
      return `${baseURL2}/biometrico/gethick/${ci}?v=${this.refreshKey}`;
    },


    // 🆕 Maneja el error de carga de imagen (ej: si el CI no tiene foto a pesar del filtro)
    handleImageError(event) {
      // Reemplaza la imagen con el ícono de usuario por defecto
      event.target.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
    },

    async getAdministrativosD(page = 1, searchQuery = "", tipoFilter = "Todos") {

      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();
      try {
        const params = {
          page: page,
          search_query: searchQuery, // Parámetro para búsqueda de CI/Nombres
          tipoFilter: tipoFilter === 'Todos' ? '' : tipoFilter, // Parámetro para carrera
        };

        // Petición al backend CON filtros incluidos
        const response = await API.get(`${this.baseUrl}/getpersonal-utlvte`, {
          params,
          signal: this.abortController.signal
        });

        const data = response.data?.data || [];
        const pagination = response.data?.pagination || {};

        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;
        this.totalEmpleados = response.data.pagination.total;
        // Mapear los datos añadiendo reactividad para los acordeones
        this.filteredpostulaciones = data.map(post => ({
          ...post,
          showAccordion: false,
          cargandoDatos: false,
          sincronizando: false,
          attendanceData: [],
          datosLocales: [],
          existeEnDB: false,
          mostrarTablaLocal: false
        }));

        await this.verificarRegistrosMasivos();

      } catch (error) {
        console.warn("⚠️ Error al obtener datos:", error?.response?.data || error);
        this.filteredpostulaciones = [];
        this.currentPage = 1;
        this.lastPage = 1;
      } finally {
        this.cargando = false;
      }
    },



    filterAndFetch() {
      // 1. Siempre se va a la página 1 cuando se aplican nuevos filtros
      this.currentPage = 1;
      // 2. Llama a la función principal con los filtros actuales
      this.getAdministrativosD(this.currentPage, this.searchQuery, this.selectedtipodoc);
    },

    onlyNumbers(event) {
      // Permite solo números y las teclas de navegación (ej. Backspace) si es una cédula
      const charCode = event.which ? event.which : event.keyCode;
      // Permite números (48-57) y el guion (-) si es necesario, si no, solo números.
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },

    nextPage() {
      if (this.currentPage < this.lastPage && !this.cargando) {
        this.getAdministrativosD(this.currentPage + 1, this.searchQuery, this.selectedtipodoc);
      }
    },

    previousPage() {
      if (this.currentPage > 1 && !this.cargando) {
        this.getAdministrativosD(this.currentPage - 1, this.searchQuery, this.selectedtipodoc);
      }
    },

  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
