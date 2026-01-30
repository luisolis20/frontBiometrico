<template>
    <div>
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
                <input type="text" placeholder="Ingresa la cédula a buscar..." v-model="searchQuery"
                    @input="debouncedFilter" @keypress="onlyNumbers" @keyup.enter="buscarEstudiante"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]" />
            </div>

        </form>
        <br>
        <div v-if="estudianteData && estencontrado">
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img :src="getPhotoUrl(estudianteData.CIInfPer)" alt="user" />
                        </div>
                        <div class="order-3 xl:order-2">
                            <h4
                                class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {{ estudianteData.NombInfPer + " " + estudianteData.ApellInfPer }}
                            </h4>
                            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ estudianteData.CIInfPer }}</p>
                                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p class="text-sm text-gray-500 dark:text-gray-400"> {{ estudianteData.NombCarr }}</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Información Personal
                        </h4>
                        <p class="text-[11px] text-gray-400 italic">
                            Nota: Los datos obtenidos aquí son los que el estudiante tiene registrados en el SIAD. Luego
                            que
                            verifiques la información debes dar clic en "Sincronizar HK"
                            para que estos datos se envíen al sistema de reconocimiento facial.
                        </p>
                        <br>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombres</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ estudianteData.NombInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ estudianteData.ApellInfPer + " " + estudianteData.ApellMatInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Correo Institucional
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ estudianteData.mailInst }}
                                </p>
                            </div>



                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Carrera
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ estudianteData.NombCarr }}
                                </p>
                               

                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Información HikCentral
                        </h4>
                        <p class="text-[11px] text-gray-400 italic">
                            Nota: Los datos obtenidos aquí son los datos que el estudiante tiene registrados en HikCentral.
                            Luego que verifiques la información debes dar clic en "Sincronizar HK"
                        </p>
                        <br>
                        <div class="file-uploader mt-5 pb-6">
                            <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-400">Foto</label>

                            <div class="mb-4 flex justify-center">
                                <div class="relative">
                                    <img :src="getPhotoUrl(estudianteData.CIInfPer)"
                                        class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                                        @error="handleImageError" />
                                    <span
                                        class="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">SIAD</span>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div class="relative">
                                    <img :src="getPhotoUrl2(estudianteData.CIInfPer)" loading="lazy"
                                        class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                                        @error="handleImageError" />
                                    <span
                                        class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">HIKCENTRAL</span>
                                </div>
                            </div>


                        </div>
                        <div class="mt-2">
                            <span v-if="cargandoStatus" class="text-xs text-gray-400">Verificando en
                                HikCentral...</span>
                            <span v-else
                                :class="estaRegistrado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                                class="px-2 py-1 rounded-md text-xs font-bold uppercase">
                                {{ estaRegistrado ? 'Registrado en HC' : 'No Registrado en HC' }}
                            </span>
                        </div>

                        <div class="flex items-center gap-3 ...">
                            <button @click="ejecutarComparacion(estudianteData.CIInfPer)" type="button" :disabled="comparando || !estaRegistrado"
                                class="flex w-full justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-gray-400 shadow-lg transition-all">
                                {{ comparando ? 'Comparando...' : 'Comparar Fotos' }}
                            </button>
                        </div>

                    </div>
                    <div
                        class="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-white/[0.02] lg:justify-end lg:px-11">

                        <button type="button" @click="registrarEnHikCentral(estudianteData.CIInfPer)"
                            class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto shadow-lg transition-all">
                            Enviar Foto a HIK
                        </button>
                        <!-- Modal de Edición de Usuario 
              <p v-else class="text-[11px] text-gray-400 italic">Complete todos los campos para editar.</p>-->
                    </div>


                </div>
            </div>
        </div>
        <div v-if="!estencontrado">
            <span class="text-gray-500 dark:text-red-400">No se ha encontrado ningún registro. Verifique si el estudiante posee una foto</span>
        </div>
        <div v-else>
            <span class="text-gray-500 dark:text-gray-400">Ingrese la cédula de un estudiante para ver su información y cargarla en HikCentral.</span>
        </div>

    </div>
</template>

<script>
import API from "@/assets/js/services/axios";
import { useRoute } from "vue-router";
import { saveAs } from "file-saver";
import debounce from 'lodash.debounce';
export default {
    data() {
        return {
            baseUrl: "/biometrico",
            estudianteData: null,
            searchQuery: "",
            cargando: false,
            estencontrado: true,
            estaRegistrado: false,
            cargandoStatus: false,
            comparando: false,
            syncMode: false,
            syncIndex: 0,
            currentSyncName: '',
        };
    },
    methods: {
        onlyNumbers(event) {
            const charCode = event.charCode ? event.charCode : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
        getPhotoUrl(ci) {
            const baseURL2 = API.defaults.baseURL;
            return `${baseURL2}/biometrico/fotografia/${ci}`;
        },
        getPhotoUrl2(ci) {
            const baseURL2 = API.defaults.baseURL
            return `${baseURL2}/biometrico/gethick/${ci}`;
        },
        async buscarEstudiante() {
            if (this.searchQuery.length < 10) return;

            this.cargando = true;
            this.estudianteData = null; // Limpiar previo

            try {
                // Llamada al método individual con caché que creamos en Laravel
                const response = await API.get(`/biometrico/getindivEst/${this.searchQuery}`);
                if (response.data.length === 0) {
                    this.estencontrado = false;
                    return;
                }else{
                    this.estencontrado = true;
                    this.estudianteData = response.data;
                    await this.verificarRegistroHC(this.estudianteData.CIInfPer);
                }

               

            } catch (error) {
                console.error("❌ Error al buscar estudiante:", error);
                this.estudianteData = null;
                this.estencontrado = false;
                // Aquí podrías disparar una alerta de "No encontrado"
            } finally {
                this.cargando = false;
            }
        },
        async verificarRegistroHC(ci) {
            this.cargandoStatus = true;
            try {
                const response = await API.get(`${this.baseUrl}/getperson-est/${ci}`);
                this.estaRegistrado = response.data.registrado;
            } catch (error) {
                this.estaRegistrado = false;
            } finally {
                this.cargandoStatus = false;
            }
        },
        async ejecutarComparacion(ci) {
            this.comparando = true;
            try {
                
                const { data } = await API.get(`${this.baseUrl}/compare-hikdoc-est/${ci}`);

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
        handleImageError(event) {
            event.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
        },
        async registrarEnHikCentral(post) {
            // Confirmación simple
            if (!confirm(`¿Deseas registrar a ${post} en HikCentral?`)) return;

            this.cargando = true; // Bloquear UI para evitar clics repetidos
            try {
                const response = await API.post(`${this.baseUrl}/sync-hikdoc/${post}`);
                console.log("Respuesta de sincronización:", response);
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    alert(`✅ Registrado con éxito. ID en HC: ${response.data.data}`);

                    // Actualizar el estado en la tabla localmente sin recargar
                    post.estaRegistradoHC = true;
                    this.searchQuery = '';
                } else {
                    alert(`⚠️ Respuesta del servidor: ${response.data.msg}`);
                }
            } catch (error) {
                /*console.error("Error al sincronizar:", error);
                const mensaje = error.response?.data?.details?.msg || "Error desconocido al conectar con el Biométrico";
                alert(`❌ Error: ${mensaje}`);*/
                this.searchQuery = '';
                this.estencontrado = false;
            } finally {
                this.cargando = false;
                this.searchQuery = '';
            }
        },
        
    }
};
</script>
