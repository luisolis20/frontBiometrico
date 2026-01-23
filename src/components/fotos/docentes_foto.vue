<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center mb-6">
    <!-- Search Form -->
    <form class="flex-grow">
      <div class="relative">
        <button class="absolute -translate-y-1/2 left-4 top-1/2">
          <svg class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              fill="" />
          </svg>
        </button>
        <!-- @input llama al debouncedFilter, que inicia la nueva consulta al backend -->
        <input type="text" placeholder="Ingresa la cédula o nombre a buscar..." v-model="searchQuery"
          @input="debouncedFilter" @keypress="onlyNumbers"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]" />
      </div>
    </form>
    <div>
      <label for="">Total de personal UTLVTE con foto: {{ totalEstudiantes }}</label>
    </div>

    <!-- Combobox for Carrera Filter -->
    <div class="relative w-full md:w-auto md:min-w-[280px]">
      <!-- @change llama al debouncedFilter, que inicia la nueva consulta al backend -->
      <select v-model="selectedtipodoc" @change="debouncedFilter"
        class="appearance-none h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
        <option v-for="item in tipodocList" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
      <!-- Custom Arrow Down Icon -->
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

  <button @click="iniciarSincronizacionMasiva" :disabled="cargando || syncMode"
    class="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg">
    Sincronizar Pendientes (Masivo)
  </button>
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
            <td class="px-5 py-4 sm:px-6" colspan="9">
              <h3 class="text-center">Cargando....</h3>
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
              <p class="text-gray-500 text-theme-sm dark:text-gray-400" v-if="post.TipoInfPer === 'D'">
                Docente
              </p>
              <p class="text-gray-500 text-theme-sm dark:text-gray-400" v-else-if="post.TipoInfPer === 'A'">
                Administrativo
              </p>
              <p class="text-gray-500 text-theme-sm dark:text-gray-400" v-else-if="post.TipoInfPer === 'T'">
                Trabajador
              </p>
              <p class="text-gray-500 text-theme-sm dark:text-gray-400" v-else-if="post.TipoInfPer === 'TDO'">
                Tecnico Docente
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


            <td class="px-5 py-4 sm:px-6">
              <button @click="abrirModalEdicion(post)"
                class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg text-xs transition duration-150 ease-in-out shadow-md">
                Actualizar foto
              </button>

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

      <button class="btn btn-primary text-white" @click="descargarDatosMasiva">
        Descargar en formato ZIP
      </button>
    </div>
    <!-- Modal de Edición de Usuario -->
    <Modal v-if="isEditModalOpen" @close="isEditModalOpen = false">
      <template #body>
        <div
          class="relative w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl">

          <button @click="isEditModalOpen = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.07]">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
            </svg>
          </button>

          <div class="px-6 pt-8 lg:px-11 lg:pt-11">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Usuario
            </h4>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Los datos mostrados son los actuales del usuario registrado en el SIAD. Realice los cambios necesarios.
            </p>
          </div>

          <form class="flex flex-col flex-1 overflow-hidden">
            <div class="px-6 pb-4 overflow-y-auto custom-scrollbar lg:px-11">
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nombres</label>
                  <input type="text" v-model="objetoeditar.nombre_us"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-white"
                    disabled />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Correo
                    Personal</label>
                  <input type="text" v-model="objetoeditar.mailPer"
                    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-white"
                    disabled />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Precio
                  </label>
                  <input type="text" v-model="objetoeditar.TipoInfPer" placeholder="0.00"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-white" />
                </div>


              </div>



              <div class="file-uploader mt-5 pb-6">
                <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-400">Foto</label>

                <div v-if="objetoeditar.CIInfPer" class="mb-4 flex justify-center">
                  <div class="relative">
                    <img :src="getPhotoUrl(objetoeditar.CIInfPer)"
                      class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                      @error="handleImageError" />
                    <span
                      class="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">SIAD</span>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div class="relative">
                    <img :src="getPhotoUrl2(objetoeditar.CIInfPer)" loading="lazy"
                      class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                      @error="handleImageError" />
                    <span
                      class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">HIKCENTRAL</span>
                  </div>
                </div>


              </div>
              <div class="mt-2">
                <span v-if="cargandoStatus" class="text-xs text-gray-400">Verificando en HikCentral...</span>
                <span v-else :class="estaRegistrado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-2 py-1 rounded-md text-xs font-bold uppercase">
                  {{ estaRegistrado ? 'Registrado en HC' : 'No Registrado en HC' }}
                </span>
              </div>

              <div class="flex items-center gap-3 ...">
                <button @click="ejecutarComparacion" type="button" :disabled="comparando || !estaRegistrado"
                  class="flex w-full justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-gray-400 shadow-lg transition-all">
                  {{ comparando ? 'Comparando...' : 'Comparar Fotos' }}
                </button>
              </div>

            </div>

            <div
              class="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-white/[0.02] lg:justify-end lg:px-11">
              <button @click="isEditModalOpen = false" type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto">
                Cerrar
              </button>
              <button type="button" @click="registrarEnHikCentral(objetoeditar.CIInfPer)"
                class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto shadow-lg transition-all">
                Guardar Cambios
              </button>
              <!-- Modal de Edición de Usuario 
              <p v-else class="text-[11px] text-gray-400 italic">Complete todos los campos para editar.</p>-->
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'

const isProfileAddressModal = ref(false)
const isEditModalOpen = ref(false)
const showPassword = ref(false)
// Creamos una función para que el bloque de abajo pueda cerrar el modal
const cerrarModalDesdeAfuera = () => {
  isProfileAddressModal.value = false
}

// Exponemos la variable y la función
defineExpose({
  isProfileAddressModal,
  isEditModalOpen,
  cerrarModalDesdeAfuera
})
</script>
<script>
import API from "@/assets/js/services/axios";
import { useRoute } from "vue-router";
import JSZip from "jszip";
import Modal from '@/components/Modal/Modal.vue'
import { saveAs } from "file-saver";
import debounce from 'lodash.debounce';

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
        { label: "Docente", value: "D" },
        { label: "Administrativo", value: "A" },
        { label: "Trabajador", value: "T" },
        { label: "Tecnico Docente", value: "TDO" }
      ], // Lista de carreras únicas para el combobox
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
    abrirModalEdicion(user) {
      // Clonamos el objeto para no modificar la tabla directamente antes de guardar
      this.objetoeditar = {
        CIInfPer: user.CIInfPer,
        nombre_us: user.NombInfPer + ' ' + user.ApellMatInfPer + ' ' + user.ApellInfPer,
        mailPer: user.mailPer,

      };
      if (user.TipoInfPer === 'D') {
        this.objetoeditar.TipoInfPer = 'DOCENTE';
      }
      else if (user.TipoInfPer === 'A') {
        this.objetoeditar.TipoInfPer = 'ADMINISTRATIVO';
      }
      else if (user.TipoInfPer === 'T') {
        this.objetoeditar.TipoInfPer = 'TRABAJADOR';
      }
      this.estaRegistrado = false;
      this.$.setupState.isEditModalOpen = true;
      this.verificarRegistroHC(user.CIInfPer);
    },
    async iniciarSincronizacionMasiva() {
      if (!confirm("Se buscarán usuarios no registrados y se enviarán a HikCentral. ¿Continuar?")) return;

      this.syncMode = true;
      this.syncIndex = 0;

      try {
        // 1. Obtener lista de pendientes desde el nuevo endpoint
        const { data } = await API.get(`${this.baseUrl}/get-pending-sync`, {
          params: { tipoFilter: this.selectedtipodoc }
        });

        this.pendientes = data.pendientes;
        console.log(this.pendientes);
        if (this.pendientes.length === 0) {
          alert("No se encontraron usuarios pendientes de registro.");
          this.syncMode = false;
          return;
        }

        // 2. Procesar uno por uno (Evita 429 y Timeouts)
        for (const p of this.pendientes) {
          this.currentSyncName = p.NombInfPer;

          try {
            // Reutilizamos tu método individual que ya maneja la firma y el envío
            const res = await API.post(`${this.baseUrl}/sync-hikcentral/${p.CIInfPer}`);

            if (res.data.code === "0" || res.data.msg === "Success") {
              console.log(`✅ Sincronizado: ${p.CIInfPer}`);
            }
          } catch (e) {
            console.error(`❌ Error en CI ${p.CIInfPer}:`, e.response?.data || e.message);
          }

          this.syncIndex++;
          // Pequeño delay opcional para ser aún más "amigables" con la CPU del servidor
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        alert("Sincronización masiva finalizada.");
        this.getAdministrativosD(this.currentPage, this.searchQuery, this.selectedtipodoc); // Refrescar tabla

      } catch (error) {
        alert("Error al obtener la lista de pendientes.");
      } finally {
        this.syncMode = false;
      }
    },
    async verificarRegistroHC(ci) {
      this.cargandoStatus = true;
      try {
        const response = await API.get(`${this.baseUrl}/getperson/${ci}?v=${this.refreshKey}`);
        this.estaRegistrado = response.data.registrado;
      } catch (error) {
        this.estaRegistrado = false;
      } finally {
        this.cargandoStatus = false;
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
        } catch (e) {
          post.estaRegistradoHC = false;
        }

        // Opcional: un delay de 50ms para dar respiro al servidor
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
    async registrarEnHikCentral(post) {
      // Confirmación simple
      if (!confirm(`¿Deseas registrar a ${post} en HikCentral?`)) return;

      this.cargando = true; // Bloquear UI para evitar clics repetidos
      try {
        const response = await API.post(`${this.baseUrl}/sync-hikcentral/${post}`);

        // Si el código que retorna Artemis es "0" es éxito
        if (response.data.code === "0" || response.data.msg === "Success") {
          alert(`✅ Registrado con éxito. ID en HC: ${response.data.data}`);

          // Actualizar el estado en la tabla localmente sin recargar
          post.estaRegistradoHC = true;
        } else {
          alert(`⚠️ Respuesta del servidor: ${response.data.msg}`);
        }
      } catch (error) {
        console.error("Error al sincronizar:", error);
        const mensaje = error.response?.data?.details?.msg || "Error desconocido al conectar con el Biométrico";
        alert(`❌ Error: ${mensaje}`);
      } finally {
        this.cargando = false;
      }
    },
    async ejecutarComparacion() {
      this.comparando = true;
      try {
        const ci = this.objetoeditar.CIInfPer;
        const { data } = await API.get(`${this.baseUrl}/compare-hikdoc/${ci}?v=${this.refreshKey}`);

        if (data.identicas) {
          // Usar un alert o notificación con el porcentaje
          alert(`✅ Match: ${data.similitud} de similitud.`);
        } else {
          alert(`❌ Diferentes: Solo ${data.similitud} de parecido.`);
        }
      } catch (error) {
        alert("Error en la comparación");
      } finally {
        this.comparando = false;
      }
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
    async forzarRefrescoFoto(ci) {

      this.cargandoStatus = true;

      try {
        // 1. Actualizamos el refreshKey local para forzar al navegador a pedir la imagen de nuevo
        this.refreshKey = Date.now();

        // 2. Opcional: Podrías crear un endpoint en Laravel para limpiar solo esa caché
        await API.get(`${this.baseUrl}/clear-cache/${ci}`);

        // 3. Volvemos a verificar el registro y la foto
        await this.verificarRegistroHC(ci);

        // Pequeño feedback visual
        console.log("Caché refrescada para el usuario:", ci);
      } catch (error) {
        console.error("Error al refrescar:", error);
      } finally {
        this.cargandoStatus = false;
      }
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
        const response = await API.get(`${this.baseUrl}/getdocentes`, {
          params,
          signal: this.abortController.signal
        });

        const data = response.data?.data || [];
        const pagination = response.data?.pagination || {};

        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;
        this.totalEstudiantes = response.data.pagination.total;
        this.filteredpostulaciones = data;

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

    // 🆕 Descarga Masiva (Similar al original, pero adaptado a la nueva API)
    async descargarDatosMasiva() {
      this.cargando = true;
      try {
        const zip = new JSZip();

        console.log(
          "⏱️ Iniciando la obtención masiva de metadatos y fotos (una sola petición)... Esto puede tardar varios minutos."
        );

        // 1. PETICIÓN ÚNICA AL NUEVO ENDPOINT
        const response = await API.get(`${this.baseUrl}/descargarfotosmasivadoc`, {
          // Aumentar el timeout del cliente para esta petición masiva
          timeout: 600000, // 10 minutos (600,000 ms). Ajusta si es necesario.
        });

        const registros = response.data?.data || [];
        const totalRegistros = registros.length;

        if (totalRegistros === 0) {
          alert("No se encontraron estudiantes con foto para descargar.");
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

            let folderName = "Otros";
            if (post.TipoInfPer === "D") folderName = "Docente";
            else if (post.TipoInfPer === "A") folderName = "Administrativo";
            else if (post.TipoInfPer === "T") folderName = "Trabajador";

            const folder = zip.folder(folderName);

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
        alert("Descarga completada con éxito!");
      } catch (error) {
        console.error("❌ Error al generar ZIP:", error.response?.status, error);
        if (error.response?.status === 429) {
          alert(
            "El servidor reportó 'Too Many Requests' (429). Por favor, inténtelo de nuevo en un momento."
          );
        } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
          alert(
            "La conexión expiró al intentar descargar todos los datos. El proceso es muy pesado. Inténtelo de nuevo o contacte a soporte."
          );
        } else {
          alert(
            "Ocurrió un error general al descargar los datos. Revise la consola para más detalles."
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
