<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-3/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estudiante</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Carrera</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Correo</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
            </th>
            <th class="px-5 py-3 text-left w-2/11 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Carrera</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr class="border-t border-gray-100 dark:border-gray-800" v-if="this.cargando">
            <td class="px-5 py-4 sm:px-6" colspan="9">
              <h3 class="text-center">Cargando....</h3>
            </td>
          </tr>
          <tr v-else v-for="post,  in this.filteredpostulaciones" :key="post.CIInfPer"
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
                    {{ post.NombInfPer + ' ' + post.ApellInfPer + ' ' + post.ApellMatInfPer }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ post.NombCarr }}</p>
            </td>

            
          </tr>
        </tbody>
      </table>
    </div>
    
    <br><br>
    <div class="d-flex justify-content-center mb-4">
      <button @click="previousPage" :disabled="currentPage === 1 || buscando" class="btn btn-primary text-white">
        <i class='fas fa-angle-left'></i>
      </button>&nbsp;
      <span class="text-dark">Página {{ currentPage }} de {{ lastPage }}</span>&nbsp;
      <button @click="nextPage" :disabled="currentPage === lastPage || buscando" class="btn btn-primary text-white">
        <i class='fas fa-angle-right'></i>
      </button>
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <div class="d-flex justify-content-center mb-4" v-if="!this.cargando">
      <button class="btn btn-primary text-white" @click="actualizar">Actualizar Datos</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-primary text-white" @click="descargarDatosMasiva">Descargar en formato ZIP</button>
    </div>
  </div>
</template>

<script>
import API from '@/assets/js/services/axios';
import { useRoute } from 'vue-router';
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      idus: 0,
      baseUrl: "/biometrico", // Ajustado para usar la base
      postulacionespr: [],
      filteredpostulaciones: [],
      searchQuery: '',
      cargando: false,
      currentPage: 1,
      lastPage: 1,
      buscando: false, // Mantenido, pero no se usa en la lógica de paginación actual
      grafico: null, // Mantenido, pero no se usa aquí
      photoCache: {}, // 🆕 Cache para almacenar URLs de fotos si es necesario
    }
  },
  async mounted() {
    const ruta = useRoute();
    // const usuario = await getMe(); // Solo si es necesario para autenticación
    this.idus = ruta.params.id; // Asumiendo que `id` es relevante
    this.getAdministrativosD();
  },
  methods: {
    // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
    getPhotoUrl(ci) {
      const baseURL2 = API.defaults.baseURL
      return `${baseURL2}/biometrico/fotografia/${ci}`;
    },

    // 🆕 Maneja el error de carga de imagen (ej: si el CI no tiene foto a pesar del filtro)
    handleImageError(event) {
      // Reemplaza la imagen con el ícono de usuario por defecto
      event.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
      event.target.style.width = '100px';
      event.target.style.height = '100px';
    },

    async getAdministrativosD(page = 1) {
      this.cargando = true;
      try {
        // Petición para obtener METADATOS (sin datos binarios de foto)
        const response = await API.get(`${this.baseUrl}/estudiantesfoto?page=${page}`); // No es necesario el withPhotos=true/false
        // ya que el backend lo filtra y no envía la columna `fotografia`

        this.postulacionespr = response.data?.data || [];
        const pagination = response.data?.pagination || {};
        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;

        // Limpiar el filtro al cargar una nueva página
        this.searchQuery = '';
        this.filteredpostulaciones = this.postulacionespr;
      } catch (error) {
        console.warn("⚠️ Error al obtener datos:", error?.response?.data || error);
        this.filteredpostulaciones = [];
      } finally {
        this.cargando = false;
      }
    },

    // ⛔ Se elimina `updateFilteredData` y `filtrarOfertas` porque la paginación es del backend

    async filterResults() {
      // 📝 La búsqueda local se mantiene, solo se busca entre los datos de la página actual.
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        this.filteredpostulaciones = this.postulacionespr;
        return;
      }

      this.filteredpostulaciones = this.postulacionespr.filter(inves =>
        inves.CIInfPer.toLowerCase().includes(query) ||
        (inves.NombInfPer && inves.NombInfPer.toLowerCase().includes(query)) ||
        (inves.ApellInfPer && inves.ApellInfPer.toLowerCase().includes(query)) ||
        (inves.ApellMatInfPer && inves.ApellMatInfPer.toLowerCase().includes(query))
      );
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
        this.getAdministrativosD(this.currentPage + 1);
      }
    },

    previousPage() {
      if (this.currentPage > 1 && !this.cargando) {
        this.getAdministrativosD(this.currentPage - 1);
      }
    },

    actualizar() {
      // Simplemente recarga la página actual de datos
      this.getAdministrativosD(this.currentPage);
    },

    // 🆕 Descarga de una sola foto
    async descargarFoto(ci, nombre, apellido1, apellido2) {
      try {
        // Llama al endpoint que devuelve la foto binaria
        const response = await API.get(`${this.baseUrl}/fotografia/${ci}`, {
          responseType: 'blob' // Importante para manejar datos binarios
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';

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
        alert("Ocurrió un error al descargar la foto. Es posible que el estudiante no tenga una fotografía.");
      }
    },

    // 🆕 Descarga Masiva (Similar al original, pero adaptado a la nueva API)
    async descargarDatosMasiva() {
      this.cargando = true;
      try {
        const zip = new JSZip();

        console.log("⏱️ Iniciando la obtención masiva de metadatos y fotos (una sola petición)... Esto puede tardar varios minutos.");

        // 1. PETICIÓN ÚNICA AL NUEVO ENDPOINT
        const response = await API.get(`${this.baseUrl}/descargarfotosmasiva`, {
          // Aumentar el timeout del cliente para esta petición masiva
          timeout: 600000 // 10 minutos (600,000 ms). Ajusta si es necesario.
        });

        const registros = response.data?.data || [];
        const totalRegistros = registros.length;

        if (totalRegistros === 0) {
          alert("No se encontraron estudiantes con foto para descargar.");
          return;
        }

        console.log(`✅ Datos recibidos. Procesando ${totalRegistros} registros para generar el ZIP.`);

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
            const apellido = (post.ApellInfPer || "sinApellido1").replace(/\s+/g, " ").trim();
            const apellido2 = (post.ApellMatInfPer || "sinApellido2").replace(/\s+/g, " ").trim();
            const cedula = post.CIInfPer || "sinCedula";
            const fileName = `${nombre}_${apellido}_${apellido2}_${cedula}.${extension}`;

            // Añadir la foto (ArrayBuffer) al ZIP
            folder.file(fileName, byteArray, { binary: true });

          } catch (processingError) {
            console.warn(`No se pudo procesar la foto para CI: ${post.CIInfPer}. Omitting.`, processingError);
          }

          contadorProcesado++;
          // Mostrar progreso en consola
          const progreso = ((contadorProcesado / totalRegistros) * 100).toFixed(2);
          console.log(`⏳ Procesado: ${contadorProcesado} / ${totalRegistros} (${progreso}%)`);
        }

        console.log("💾 Generando archivo ZIP final... (Puede tardar)");

        // 3. GENERAR Y DESCARGAR EL ZIP
        const content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9
          }
        });
        saveAs(content, "Estudiantes_con_Foto_por_Carrera.zip");
        alert("Descarga completada con éxito!");

      } catch (error) {
        console.error("❌ Error al generar ZIP:", error.response?.status, error);
        if (error.response?.status === 429) {
          alert("El servidor reportó 'Too Many Requests' (429). Por favor, inténtelo de nuevo en un momento.");
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          alert("La conexión expiró al intentar descargar todos los datos. El proceso es muy pesado. Inténtelo de nuevo o contacte a soporte.");
        } else {
          alert("Ocurrió un error general al descargar los datos. Revise la consola para más detalles.");
        }
      } finally {
        this.cargando = false;
      }
    }
  },
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
