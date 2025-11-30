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

    <!-- Combobox for Carrera Filter -->
    <div class="relative w-full md:w-auto md:min-w-[280px]">
      <!-- @change llama al debouncedFilter, que inicia la nueva consulta al backend -->
      <select v-model="selectedCarrera" @change="debouncedFilter"
        class="appearance-none h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
        <option value="Todos">Todas las Carreras</option>
        <option v-for="carrera in carrerasList" :key="carrera" :value="carrera">{{ carrera }}</option>
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
                Foto SIAD
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Foto HC
              </p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400"></p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr class="border-t border-gray-100 dark:border-gray-800" v-if="this.cargando">
            <td class="px-5 py-4 sm:px-6" colspan="9">
              <h3 class="text-center">Cargando....</h3>
            </td>
          </tr>
          <tr v-else v-for="post in this.filteredpostulaciones" :key="post.CIInfPer"
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
                  <img :src="getPhotoUrl(post.CIInfPer)" @error="handleImageError" />
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full">
                  <img :src="getPhotoUrl2(post.CIInfPer)" @error="handleImageError" />
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <button v-if="post.different"
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg text-xs transition duration-150 ease-in-out shadow-md">
                Actualizar foto
              </button>
              <span v-else class="text-gray-400 text-xs">Fotos similares</span>
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
    <div class="d-flex justify-content-center mb-4" v-if="!this.cargando">
      <button class="btn btn-primary text-white" @click="actualizar">
        Actualizar Datos
      </button>
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
import { saveAs } from "file-saver";
import debounce from 'lodash.debounce';

export default {
  data() {
    return {
      idus: 0,
      baseUrl: "/biometrico", // Ajustado para usar la base
      postulacionespr: [],
      filteredpostulaciones: [],
      searchQuery: "",
      cargando: false,
      currentPage: 1,
      lastPage: 1,
      buscando: false, // Mantenido, pero no se usa en la lógica de paginación actual
      grafico: null, // Mantenido, pero no se usa aquí
      photoCache: {}, // 🆕 Cache para almacenar URLs de fotos si es necesario
      debouncedFilter: debounce(this.filterAndFetch, 500),
      selectedCarrera: 'Todos', // Valor inicial para seleccionar todas las carreras
      carrerasList: [], // Lista de carreras únicas para el combobox
    };
  },
  async mounted() {
    const ruta = useRoute();
    // const usuario = await getMe(); // Solo si es necesario para autenticación
    //this.idus = ruta.params.id; // Asumiendo que `id` es relevante
    this.getAdministrativosD(1, this.searchQuery, this.selectedCarrera);
    this.loadCarrerasList();
  },
  methods: {
    // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
    getPhotoUrl(ci) {
      const baseURL2 = API.defaults.baseURL;
      return `${baseURL2}/biometrico/fotografia/${ci}`;
    },
    getPhotoUrl2(ci) {
      //const baseURL2 = API.defaults.baseURL
      return `${__API_BOLSA__}/b_e/vin/fotografia/${ci}`;
    },
    async loadCarrerasList() {
      this.cargando = true;
      try {
        const response = await API.get(`${this.baseUrl}/carrerasList`);

        this.carrerasList = (response.data?.data || [])
          .map(c => c.NombCarr) // Solo el nombre
          .filter(c => c)        // Evita nulls
          .sort();               // Ordenar A-Z

      } catch (error) {
        console.error("❌ Error al obtener carreras:", error);
        this.carrerasList = [];
      }
    },
    async isDifente(post) {
      try {
        const resp = await API.get(`/biometrico/comparar-foto/${post.CIInfPer}`);
        return resp.data.different === true;
      } catch (error) {
        console.warn("Error comparando fotos:", error);
        return true; // ante error considerar diferente

      }
    },

    // 🆕 Maneja el error de carga de imagen (ej: si el CI no tiene foto a pesar del filtro)
    handleImageError(event) {
      // Reemplaza la imagen con el ícono de usuario por defecto
      event.target.src =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
    },

    async getAdministrativosD(page = 1, searchQuery = "", carreraName = "Todos") {
      this.cargando = true;
      try {
        const params = {
          page: page,
          search_query: searchQuery, // Parámetro para búsqueda de CI/Nombres
          carrera_name: carreraName === 'Todos' ? '' : carreraName, // Parámetro para carrera
        };

        // Petición al backend CON filtros incluidos
        const response = await API.get(`${this.baseUrl}/estudiantesfoto`, { params });

        const data = response.data?.data || [];
        const pagination = response.data?.pagination || {};

        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;

        this.filteredpostulaciones = data;

        // 2. Procesar la diferencia de fotos
        for (const post of this.filteredpostulaciones) { 
          this.$nextTick(async () => { 
            post.different = await this.isDifente(post); 
          });
         }

        // 3. Actualizar la tabla con los datos filtrados y paginados


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
      this.getAdministrativosD(this.currentPage, this.searchQuery, this.selectedCarrera);
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
        this.getAdministrativosD(this.currentPage + 1, this.searchQuery, this.selectedCarrera);
      }
    },

    previousPage() {
      if (this.currentPage > 1 && !this.cargando) {
        this.getAdministrativosD(this.currentPage - 1, this.searchQuery, this.selectedCarrera);
      }
    },

    actualizar() {
      // Simplemente recarga la página actual de datos
      this.getAdministrativosD(this.currentPage, this.searchQuery, this.selectedCarrera);
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
        alert(
          "Ocurrió un error al descargar la foto. Es posible que el estudiante no tenga una fotografía."
        );
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
