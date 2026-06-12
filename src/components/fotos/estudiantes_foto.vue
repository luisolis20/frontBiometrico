<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center mb-6">
    <!-- Search Form -->
    <form class="flex-grow">
     <div class="relative">
        <div class="absolute -translate-y-1/2 left-4 top-1/2 flex items-center justify-center">
          <svg v-if="cargando" class="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
          </svg>
        </div>
        <input type="text" placeholder="Ingresa la cédula o nombre a buscar..." v-model="searchQuery"
          @input="debouncedFilter" :disabled="cargando || syncMode" @keypress="onlyNumbers"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px] disabled:opacity-50 disabled:cursor-not-allowed" />
      </div>
    </form>
    <div>
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Total de estudiantes matriculados y con foto: {{ totalEstudiantes }}</label>
    </div>

    <!-- Combobox for Carrera Filter -->
    <div class="relative w-full md:w-auto md:min-w-[280px]">
      <select v-model="selectedCarrera" @change="debouncedFilter" :disabled="cargando || syncMode"
        class="appearance-none h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed">
        <option value="Todos">Todas las Carreras</option>
        <option v-for="carrera in carrerasList" :key="carrera.id" :value="carrera.id">
          {{ carrera.nombre }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>
  <div class="mb-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800" v-if="syncMode">
    <div class="flex justify-between mb-2">
      <span class="text-sm font-medium">Sincronizando con HikCentral: {{ syncIndex }} / {{ pendientes.length }}</span>
      <span class="text-sm font-bold">{{ progressSync }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-brand-500 h-2.5 rounded-full transition-all duration-300" :style="{ width: progressSync + '%' }">
      </div>
    </div>
    <p class="text-xs mt-2 text-gray-500 italic">Procesando: {{ currentSyncName }}</p>
  </div>

  <div v-if="noRegistradosCount > 0 && !cargando" 
    class="mb-4 p-4 border rounded-xl bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300">
    <div class="flex items-center gap-3 text-yellow-800 dark:text-yellow-400">
      <svg class="w-5 h-5 flex-shrink-0 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium">
        Se detectaron <span class="font-bold text-lg">{{ noRegistradosCount }}</span> estudiante(s) sin registro en HikCentral dentro de esta página.
      </p>
    </div>
    <button @click="iniciarSincronizacionMasiva" :disabled="syncMode"
      class="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      Sincronizar Pendientes (Masivo)
    </button>
  </div>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-3/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Estudiante
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Carrera
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
                <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Obteniendo listado de estudiantes...</span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="post in filteredpostulaciones" :key="post.CIInfPer"
            class="border-t border-gray-100 dark:border-gray-800">
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full">
                  <img v-if="post.hasPhoto" :src="getPhotoUrl(post.CIInfPer)" @error="handleImageError" />
                </div>
                <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ post.CIInfPer }}
                  </span>
                  <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {{
                      post.NombInfPer + " " + post.ApellInfPer + " " + post.ApellMatInfPer
                    }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ post.NombCarr }}
              </p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full">
                  <img :src="getPhotoUrl2(post.CIInfPer)" @error="handleImageError" />
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center">
                <span v-if="post.estaRegistradoHC === null" class="flex items-center gap-1 text-gray-400 text-theme-xs">
                  <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"></svg>
                  Verificando...
                </span>

                <span v-else-if="post.estaRegistradoHC === true"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  Sí
                </span>

                <span v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd" />
                  </svg>
                  No
                </span>
              </div>
            </td>
          </tr>
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
    <div class="d-flex justify-content-center mb-4" v-if="!cargando">

      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-primary text-white" @click="descargarDatosMasiva">
        Descargar en formato ZIP
      </button>
    </div>
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
        mailInst: "",
      },
      searchQuery: "",
      cargando: false,
      currentPage: 1,
      lastPage: 1,
      buscando: false, // Mantenido, pero no se usa en la lógica de paginación actual
      grafico: null, // Mantenido, pero no se usa aquí
      photoCache: {}, // 🆕 Cache para almacenar URLs de fotos si es necesario
      debouncedFilter: null,
      selectedCarrera: 'Todos', // Valor inicial para seleccionar todas las carreras
      carrerasList: [], // Lista de carreras únicas para el combobox
      totalEstudiantes: 0,
      refreshKey: Date.now(),
      estaRegistrado: false,
      cargandoStatus: false,
      comparando: false,
      syncMode: false,
      pendientes: [],
      syncIndex: 0,
      currentSyncName: '',
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
    this.getEstudiantes(1, this.searchQuery, this.selectedCarrera);
    this.loadCarrerasList();
  },
  methods: {
    async iniciarSincronizacionMasiva() {
     const confirmacion = await Swal.fire({
        title: '¿Confirmar Sincronización?',
        text: `Se buscarán usuarios no registrados y se enviarán a HikCentral. ¿Continuar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#126E1B',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
      });
      if (!confirmacion.isConfirmed) return;

      this.syncMode = true;
      this.syncIndex = 0;

      try {
        // 1. Obtener lista de pendientes desde el nuevo endpoint
        const { data } = await API.get(`${this.baseUrl}/get-pending-sync-est`, {
          params: { carrera_name: this.selectedCarrera }
        });

        this.pendientes = data.pendientes;
        console.log(this.pendientes);
        if (this.pendientes.length === 0) {
          mostraralertas2("No se encontraron usuarios pendientes de registro.", "warning");
          this.syncMode = false;
          return;
        }

        // 2. Procesar uno por uno (Evita 429 y Timeouts)
        for (const p of this.pendientes) {
          this.currentSyncName = p.NombInfPer;

          try {
            // Reutilizamos tu método individual que ya maneja la firma y el envío
            const res = await API.post(`${this.baseUrl}/sync-hikdoc/${p.CIInfPer}`);

            if (res.data.code === "0" || res.data.msg === "Success") {
              console.log(`✅ Sincronizado: ${p.CIInfPer}`);
            }else if(res.data.code === "131"){
              console.warn(`⚠️ Ya registrado: ${p.CIInfPer}`);
            }else if(res.data.code === "128"){
              console.warn(`La foto de: ${p.CIInfPer} no es compatible con HikCentral.`);
            }
          } catch (e) {
            console.error(`❌ Error en CI ${p.CIInfPer}:`, e.response?.data || e.message);
          }

          this.syncIndex++;
          // Pequeño delay opcional para ser aún más "amigables" con la CPU del servidor
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        mostraralertas2("Sincronización masiva finalizada.", "success");
        this.getEstudiantes(this.currentPage, this.searchQuery, this.selectedCarrera); // Refrescar tabla

      } catch (error) {
        mostraralertas2("Error al obtener la lista de pendientes.", "error");
      } finally {
        this.syncMode = false;
      }
    },
    // Nuevo método para validar los estados de la tabla actual
    async verificarRegistrosMasivos() {
      // Creamos una copia local para evitar problemas si filteredpostulaciones cambia
      const items = this.filteredpostulaciones;

      for (let post of items) {
        // Si el usuario cambió de página o filtró de nuevo mientras procesábamos, detenemos este bucle
        if (!this.filteredpostulaciones.length) break;

        try {
          // Hacemos las peticiones UNA POR UNA
          const res = await API.get(`${this.baseUrl}/getperson-est/${post.CIInfPer}`);
          
          post.estaRegistradoHC = res.data.registrado;
        } catch (e) {
          post.estaRegistradoHC = false;
        }

        // Opcional: un delay de 50ms para dar respiro al servidor
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
    // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
    getPhotoUrl(ci) {
      const baseURL2 = API.defaults.baseURL;
      return `${baseURL2}/biometrico/fotografia/${ci}?v=${this.refreshKey}`;
    },
    getPhotoUrl2(ci) {
      const baseURL2 = API.defaults.baseURL
      return `${baseURL2}/biometrico/gethick/${ci}?v=${this.refreshKey}`;
    },
    async loadCarrerasList() {
      try {
        const response = await API.get(`${this.baseUrl}/carrerasList`);

        // Validamos que venga la data y asignamos el array de objetos
        this.carrerasList = response.data?.data || [];
      } catch (error) {
        console.error("❌ Error al obtener carreras:", error);
        this.carrerasList = [];
        // Opcional: Notificación al usuario (Toast/Alert)
      }
    },
    
    // 🆕 Maneja el error de carga de imagen (ej: si el CI no tiene foto a pesar del filtro)
    handleImageError(event) {
      // Reemplaza la imagen con el ícono de usuario por defecto
      event.target.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
    },

    async getEstudiantes(page = 1, searchQuery = "", carreraName = "Todos") {
      this.cargando = true;
      try {
        const params = {
          page: page,
          search_query: searchQuery, // Parámetro para búsqueda de CI/Nombres
          carrera_name: carreraName === 'Todos' ? '' : carreraName, // Parámetro para carrera
        };

        // Petición al backend CON filtros incluidos
        const response = await API.get(`${this.baseUrl}/estudiantesfoto`, {
          params
        });
        console.log("✅ Datos recibidos del backend:", response.data);
        const data = response.data?.data || [];
        const pagination = response.data?.pagination || {};

        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;
        this.totalEstudiantes = response.data.pagination.total;
        this.filteredpostulaciones = data;

        // 2. Procesar la diferencia de fotos
        //await this.procesarFotosConLimite(3);
        this.cargando = false;
        // 3. Actualizar la tabla con los datos filtrados y paginados
        await this.verificarRegistrosMasivos();

      } catch (error) {
        console.warn("⚠️ Error al obtener datos:", error?.response?.data || error);
        this.filteredpostulaciones = [];
        this.currentPage = 1;
        this.lastPage = 1;
        this.cargando = false;
      } finally {
        this.cargando = false;
      }
    },



    filterAndFetch() {
      // 1. Siempre se va a la página 1 cuando se aplican nuevos filtros
      this.currentPage = 1;
      // 2. Llama a la función principal con los filtros actuales
      this.getEstudiantes(this.currentPage, this.searchQuery, this.selectedCarrera);
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
        this.getEstudiantes(this.currentPage + 1, this.searchQuery, this.selectedCarrera);
      }
    },

    previousPage() {
      if (this.currentPage > 1 && !this.cargando) {
        this.getEstudiantes(this.currentPage - 1, this.searchQuery, this.selectedCarrera);
      }
    },

    actualizar() {
      // Simplemente recarga la página actual de datos
      this.getEstudiantes(this.currentPage, this.searchQuery, this.selectedCarrera);
    },

    // 🆕 Descarga de una sola foto
    async descargarFoto(ci, nombre, apellido1, apellido2) {
      try {
        // Llama al endpoint que devuelve la foto binaria
        const response = await API.get(`${this.baseUrl}/fotografia/${ci}`, {
          responseType: "blob", // Importante para manejar datos binarios
        });

        const contentType = response.headers["content-type"] || "image/jpeg";

        // Determinar extensión y nombre de archivo
        let extension = "jpg";
        if (contentType.includes("png")) extension = "png";
        else if (contentType.includes("jpeg")) extension = "jpeg";

        const nombreLimpio = (nombre || "sinNombre").replace(/\s+/g, " ").trim();
        const apellido1Limpio = (apellido1 || "sinApellido1").replace(/\s+/g, " ").trim();
        const apellido2Limpio = (apellido2 || "sinApellido2").replace(/\s+/g, " ").trim();
        const fileName = `${nombreLimpio}_${apellido1Limpio}_${apellido2Limpio}_${ci}.${extension}`;

        // Crea un Blob y usa file-saver para la descarga
        const blob = new Blob([response.data], { type: contentType });
        saveAs(blob, fileName);
      } catch (error) {
        console.error("Error al descargar la foto:", error?.response?.data || error);
        mostraralertas2("Ocurrió un error al descargar la foto. Es posible que el estudiante no tenga una fotografía.", "error");
      }
    },

    // 🆕 Descarga Masiva (Similar al original, pero adaptado a la nueva API)
    async descargarDatosMasiva() {
      this.cargando = true;
      try {
        const zip = new JSZip();

        console.log(
          "⏱️ Iniciando la obtención masiva de metadatos y fotos (una sola petición)... Esto puede tardar varios minutos."
        );

        // 1. PETICIÓN ÚNICA AL NUEVO ENDPOINT
        const response = await API.get(`${this.baseUrl}/descargarfotosmasiva`, {
          // Aumentar el timeout del cliente para esta petición masiva
          timeout: 600000, // 10 minutos (600,000 ms). Ajusta si es necesario.
        });

        const registros = response.data?.data || [];
        const totalRegistros = registros.length;

        if (totalRegistros === 0) {
          mostraralertas2("No se encontraron estudiantes con foto para descargar.", "warning");
          return;
        }

        console.log(
          `✅ Datos recibidos. Procesando ${totalRegistros} registros para generar el ZIP.`
        );

        let contadorProcesado = 0;

        // 2. PROCESAR CADA REGISTRO (CON FOTO EN BASE64 INCLUIDA)
        for (const post of registros) {
          // Decodificar Base64 y preparar la descarga
          try {
            // Convertir la cadena Base64 a un ArrayBuffer o Blob
            const fotoBinariaBase64 = post.fotografia;

            // NOTA: Base64 en JSON no trae el prefijo 'data:image/jpeg;base64,...'
            // JSZip necesita el blob o arraybuffer directo.
            // Usamos atob para decodificar, y luego a ArrayBuffer para JSZip
            const byteCharacters = atob(fotoBinariaBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // El mime type no es crucial para JSZip, pero se puede estimar
            // o usar 'image/jpeg' por defecto si el backend no lo provee.

            const carreraNombre = post.NombCarr
              ? post.NombCarr.replace(/[\\/:*?"<>|]/g, "_").trim()
              : "Sin_Carrera";

            const folder = zip.folder(carreraNombre);

            // Determinar extensión (simplemente usamos .jpg si el backend no lo indica)
            let extension = "jpg";
            // Podrías intentar detectar el tipo de imagen leyendo los primeros bytes si fuera crucial,
            // pero por simplicidad, dado que la mayoría de fotos estudiantiles son JPG, lo dejamos así.

            // Generar nombre de archivo
            const nombre = (post.NombInfPer || "sinNombre").replace(/\s+/g, " ").trim();
            const apellido = (post.ApellInfPer || "sinApellido1")
              .replace(/\s+/g, " ")
              .trim();
            const apellido2 = (post.ApellMatInfPer || "sinApellido2")
              .replace(/\s+/g, " ")
              .trim();
            const cedula = post.CIInfPer || "sinCedula";
            const fileName = `${nombre}_${apellido}_${apellido2}_${cedula}.${extension}`;

            // Añadir la foto (ArrayBuffer) al ZIP
            folder.file(fileName, byteArray, { binary: true });
          } catch (processingError) {
            console.warn(
              `No se pudo procesar la foto para CI: ${post.CIInfPer}. Omitting.`,
              processingError
            );
          }

          contadorProcesado++;
          // Mostrar progreso en consola
          const progreso = ((contadorProcesado / totalRegistros) * 100).toFixed(2);
          console.log(
            `⏳ Procesado: ${contadorProcesado} / ${totalRegistros} (${progreso}%)`
          );
        }

        console.log("💾 Generando archivo ZIP final... (Puede tardar)");

        // 3. GENERAR Y DESCARGAR EL ZIP
        const content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        });
        saveAs(content, "Estudiantes_con_Foto_por_Carrera.zip");
        mostraralertas2("Descarga completada con éxito!", "success");
      } catch (error) {
        console.error("❌ Error al generar ZIP:", error.response?.status, error);
        if (error.response?.status === 429) {
          mostraralertas2(
            "El servidor reportó 'Too Many Requests' (429). Por favor, inténtelo de nuevo en un momento.",
            "error"
          );
        } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
          mostraralertas2(
            "La conexión expiró al intentar descargar todos los datos. El proceso es muy pesado. Inténtelo de nuevo o contacte a soporte.",
            "error"
          );
        } else {
          mostraralertas2(
            "Ocurrió un error general al descargar los datos. Revise la consola para más detalles.",
            "error"
          );
        }
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
