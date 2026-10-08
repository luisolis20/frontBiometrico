<template>
    <div>
        <!-- Search Form -->
        <form class="flex-grow">
            <div class="relative">
                <button type="submit" :disabled="cargando"
                    class="absolute -translate-y-1/2 left-4 top-1/2 transition-opacity disabled:opacity-50">
                    <svg v-if="cargando" class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <svg v-else class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20"
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                    </svg>
                </button>
                <input type="text" placeholder="Ingresa la cédula a buscar..." v-model="searchQuery"
                    :disabled="cargando" @input="debouncedFilter" @keypress="onlyNumbers"
                    @keyup.enter="buscarDocente"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px] disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
        </form>
        <br>
        <div v-if="docenteData && estencontrado && !cargando">
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img :src="getPhotoUrl(docenteData.CIInfPer)" alt="user" />
                        </div>
                        <div class="order-3 xl:order-2">
                            <h4
                                class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {{ docenteData.NombInfPer + " " + docenteData.ApellInfPer + " " +
                                    docenteData.ApellMatInfPer }}
                            </h4>
                            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ docenteData.CIInfPer }}</p>
                                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="docenteData.TipoInfPer === 'D'">Docente</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="docenteData.TipoInfPer === 'A'">Administrativo</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="docenteData.TipoInfPer === 'T'">Trabajador</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="docenteData.TipoInfPer === 'TDO'">Tecnico Docente</p>
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
                            Nota: Los datos obtenidos aquí son los que el docente tiene registrados en el SIAD. Luego
                            que
                            verifiques la información debes dar clic en "Sincronizar HK"
                            para que estos datos se envíen al sistema de reconocimiento facial.
                        </p>
                        <br>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombres</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ docenteData.NombInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ docenteData.ApellInfPer + " " + docenteData.ApellMatInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Correo Institucional
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ docenteData.mailInst }}
                                </p>
                            </div>



                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tipo de personal
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="docenteData.TipoInfPer === 'D'">
                                    Docente
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="docenteData.TipoInfPer === 'A'">
                                    Administrativo
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="docenteData.TipoInfPer === 'T'">
                                    Trabajador
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="docenteData.TipoInfPer === 'TDO'">
                                    Tecnico Docente
                                </p>

                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div class="w-full">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Información
                            HikCentral</h4>
                        <p class="text-[11px] text-gray-400 italic">
                            Nota: Los datos obtenidos aquí son los datos que el estudiante tiene registrados en
                            HikCentral. Luego que verifiques la información debes dar clic en "Sincronizar HK"
                        </p>
                        <br>
                        <div class="file-uploader mt-5 pb-6">
                            <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-400">Foto</label>
                            <div class="mb-4 flex justify-center">
                                <div class="relative">
                                    <img :src="getPhotoUrl(docenteData.CIInfPer)"
                                        class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                                        @error="handleImageError" />
                                    <span
                                        class="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">SIAD</span>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div class="relative">
                                    <img :src="getPhotoUrl2(docenteData.CIInfPer)"
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
                        <div v-if="comparando" class="text-xs text-blue-500 animate-pulse mt-2">
                            Calculando similitud facial...
                        </div>
                        <div v-if="comparacionResultado && !comparando" class="mt-2">
                            <span :class="comparacionResultado.identicas ? 'text-green-600' : 'text-red-600'"
                                class="text-sm font-bold">
                                Similitud: {{ comparacionResultado.similitud }}% ({{ comparacionResultado.identicas ?
                                'Coincide' : 'No coincide' }})
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    class="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-white/[0.02] lg:justify-end lg:px-11 mt-4">
                    <button v-if="!estaRegistrado && !cargandoStatus" type="button" :disabled="cargando"
                        @click="registrarEnHikCentral(docenteData.CIInfPer)"
                        class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto shadow-lg transition-all disabled:opacity-50">
                        Enviar Foto a HIK
                    </button>
                    <button v-else-if="estaRegistrado && comparacionResultado && !comparacionResultado.identicas"
                        type="button" :disabled="cargando" @click="UpdateEnHikCentral(docenteData.CIInfPer)"
                        class="flex w-full justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 sm:w-auto shadow-lg transition-all disabled:opacity-50">
                        Actualizar Foto en HIK (Baja Similitud)
                    </button>
                    <div v-else-if="estaRegistrado && comparacionResultado && comparacionResultado.identicas"
                        class="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        Información Sincronizada y Validada
                    </div>
                </div>
                <div v-if="estaRegistrado" class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div class="w-full">
                            <!-- Filtros de Fecha -->
                            <div
                                class="flex flex-col md:flex-row items-end gap-4 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <div class="flex-1 w-full">
                                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rango
                                        Rápido</label>
                                    <select v-model="filtroSeleccionado" @change="aplicarFiltroFecha"
                                        :disabled="cargandoEventos"
                                        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90">
                                        <option value="custom">Personalizado</option>
                                        <option value="hoy">Hoy</option>
                                        <option value="ayer">Ayer</option>
                                        <option value="esta_semana">Esta semana (Lun - Vie)</option>
                                        <option value="mes_actual">Mes actual</option>
                                        <option value="mes_anterior">Mes anterior</option>
                                    </select>
                                </div>

                                <div class="flex-1 w-full">
                                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha
                                        de Inicio</label>
                                    <input type="date" v-model="fechaInicio" @change="filtroSeleccionado = 'custom'"
                                        :disabled="cargandoEventos"
                                        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90" />
                                </div>

                                <div class="flex-1 w-full">
                                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha
                                        de Fin</label>
                                    <input type="date" v-model="fechaFin" @change="filtroSeleccionado = 'custom'"
                                        :disabled="cargandoEventos"
                                        class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90" />
                                </div>

                                <button @click="obtenerEventosPuerta" :disabled="cargandoEventos"
                                    class="h-11 px-6 rounded-lg flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600 w-full md:w-auto">
                                    <svg v-if="cargandoEventos" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    <span>{{ cargandoEventos ? 'Consultando...' : 'Consultar' }}</span>
                                </button>
                            </div>

                            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Registro de Accesos GYM
                            </h4>

                            <div v-if="cargandoEventos" class="text-sm text-gray-500 py-4 text-center">Consultando
                                marcaciones...</div>
                            <div v-else-if="!visitasProcesadas.length"
                                class="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">No se registran
                                accesos en este periodo.</div>

                            <!-- Visitas Agrupadas -->
                            <div v-else class="grid grid-cols-1 gap-4">
                                <div v-for="(visita, index) in visitasProcesadas" :key="index"
                                    class="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm gap-4">

                                    <!-- Estado / Alertas -->
                                    <div class="w-full sm:w-1/4">
                                        <span :class="{
                                            'bg-green-100 text-green-700': visita.estado === 'Completado' || visita.estado === 'En gimnasio',
                                            'bg-red-100 text-red-700': visita.estado === 'Bloqueado (Anti-passback)',
                                            'bg-yellow-100 text-yellow-700': visita.estado === 'Alerta: Doble Entrada'
                                        }" class="px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                                            {{ visita.estado }}
                                        </span>
                                        <p class="text-xs text-gray-500">{{ visita.fecha }}</p>
                                    </div>

                                    <!-- Datos de Entrada -->
                                    <div
                                        class="w-full sm:w-1/3 flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                        <div class="flex-shrink-0">
                                            <img v-if="visita.entrada?.foto" :src="getPhotoUrl23(visita.entrada.foto)"
                                                @error="$event.target.style.display = 'none'"
                                                class="w-12 h-12 rounded-lg object-cover border" title="Foto Entrada" />
                                            <div v-else
                                                class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                N/A</div>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 uppercase">Entrada</p>
                                            <p class="text-sm font-bold text-gray-800 dark:text-white">{{ visita.entrada
                                                ? visita.entrada.hora : '--:--' }}</p>
                                        </div>
                                    </div>

                                    <!-- Datos de Salida -->
                                    <div
                                        class="w-full sm:w-1/3 flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                        <div class="flex-shrink-0">
                                            <img v-if="visita.salida?.foto" :src="getPhotoUrl23(visita.salida.foto)"
                                                @error="$event.target.style.display = 'none'"
                                                class="w-12 h-12 rounded-lg object-cover border" title="Foto Salida" />
                                            <div v-else
                                                class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                N/A</div>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 uppercase">Salida</p>
                                            <p class="text-sm font-bold text-gray-800 dark:text-white">{{ visita.salida
                                                ? visita.salida.hora : '--:--' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!docenteData" class="mt-4">
            <div v-if="cargando"
                class="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 rounded-2xl dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.01]">
                <svg class="animate-spin h-9 w-9 text-brand-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Consultando expediente en el SIAD...</p>
                <p class="text-xs text-gray-400 mt-1">Por favor espere un momento.</p>
            </div>

            <div v-else-if="errorValidacion"
                class="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50 text-red-800 dark:text-red-400">
                <div class="flex gap-3 items-start">
                    <span class="text-lg">🛑</span>
                    <div>
                        <h5 class="text-sm font-bold">Formato de Identificación Inválido</h5>
                        <p class="text-xs mt-1 leading-relaxed opacity-90">{{ errorValidacionTexto }}</p>
                    </div>
                </div>
            </div>

            <div v-else-if="!estencontrado"
                class="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-400">
                <div class="flex gap-3 items-start">
                    <span class="text-lg">⚠️</span>
                    <div>
                        <h5 class="text-sm font-bold">Personal no localizado u omitido</h5>
                        <p class="text-xs mt-1 leading-relaxed opacity-90">
                            No se ha encontrado ningún registro que coincida exactamente con los parámetros ingresados.
                            Por favor, realice las siguientes verificaciones:
                        </p>
                        <ul class="list-disc list-inside text-xs mt-2 space-y-1 opacity-95 pl-1">
                            <li>Confirme que el número de cédula esté digitado correctamente.</li>
                            <li>Asegúrese de que el personal se encuentre <strong>habilitado</strong>.</li>
                            <li>Verifique si el personal dispone de una <strong>fotografía activa</strong> cargada en el
                                SIAD.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div v-else
                class="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/50 text-green-800 dark:text-green-400">
                <div class="flex gap-3 items-start">
                    <span class="text-lg">💡</span>
                    <div>
                        <h5 class="text-sm font-bold">Módulo de sincronización biométrica</h5>
                        <p class="text-xs mt-1 leading-relaxed opacity-90">
                            Ingrese la cédula de un personal para cargar sus datos desde el SIAD, realizar la
                            comparación de vectores faciales y sincronizar su estatus con las bases de datos de
                            HikCentral.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import API from "@/assets/js/services/axios";
import { useRoute } from "vue-router";
import { saveAs } from "file-saver";
import debounce from 'lodash.debounce';
import { mostraralertas2 } from "@/assets/js/function/funciones";
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            baseUrl: "/biometrico",
            docenteData: null,
            searchQuery: "",
            cargando: false,
            estaRegistrado: false,
            cargandoStatus: false,
            estencontrado: true,
            comparando: false,
            syncMode: false,
            syncIndex: 0,
            currentSyncName: '',
            comparacionResultado: null,
            personIdHC: null,
            errorValidacion: false,
            errorValidacionTexto: "",
            eventosPuerta: [],
            cargandoEventos: false,
            filtroSeleccionado: 'hoy',
            fechaInicio: '',
            fechaFin: '',
            visitasProcesadas: []
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
            return `${baseURL2}/biometrico/fotografiadoc/${ci}?t=${new Date().getTime()}`;
        },
        getPhotoUrl2(ci) {
            const baseURL2 = API.defaults.baseURL
            return `${baseURL2}/biometrico/gethick/${ci}?t=${new Date().getTime()}`;
        },
        getPhotoUrl23(picUri) {
            if (!picUri) return '';
            const baseURL2 = API.defaults.baseURL;
           return `${baseURL2}/biometrico/gethickVer?picUri=${encodeURIComponent(picUri)}`;
        },
        aplicarFiltroFecha() {
            if (this.filtroSeleccionado === 'custom') return;

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

            if (this.filtroSeleccionado === 'hoy') {
                this.fechaInicio = formatoFecha(hoy);
                this.fechaFin = formatoFecha(hoy);

            } else if (this.filtroSeleccionado === 'ayer') {
                const ayer = new Date(hoy);
                ayer.setDate(hoy.getDate() - 1);
                this.fechaInicio = formatoFecha(ayer);
                this.fechaFin = formatoFecha(ayer);

            } else if (this.filtroSeleccionado === 'esta_semana') {
                const diaSemana = hoy.getDay();
                const distanciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
                const lunes = new Date(hoy);
                lunes.setDate(hoy.getDate() + distanciaLunes);

                const distanciaViernes = diaSemana === 0 ? -2 : 5 - diaSemana;
                const viernes = new Date(hoy);
                viernes.setDate(hoy.getDate() + distanciaViernes);

                this.fechaInicio = formatoFecha(lunes);
                this.fechaFin = formatoFecha(viernes);

            } else if (this.filtroSeleccionado === 'mes_actual') {
                const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
                this.fechaInicio = formatoFecha(primerDiaMes);
                this.fechaFin = formatoFecha(ultimoDiaMes);

            } else if (this.filtroSeleccionado === 'mes_anterior') {
                const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
                const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
                this.fechaInicio = formatoFecha(primerDiaMesAnterior);
                this.fechaFin = formatoFecha(ultimoDiaMesAnterior);
            }
        },
        procesarMarcacionesAgrupadas(eventosCrudos) {
            // Ordenar cronológicamente
            let eventos = [...eventosCrudos].sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));

            // Paso 1: Agrupar el Facial con su Controladora respectiva
            let intentos = [];
            eventos.forEach(ev => {
                if (ev.doorName.includes('FACIAL')) {
                    intentos.push({
                        facial: ev,
                        controladora: null,
                        tipo: ev.doorName.includes('E-D') ? 'Entrada' : 'Salida',
                        fechaBase: ev.eventTime.split('T')[0]
                    });
                } else if (ev.doorName.includes('CONTROLADORA')) {
                    let ultimoIntento = intentos[intentos.length - 1];
                    // Si hay un evento facial previo sin controladora asignada, se lo asignamos
                    if (ultimoIntento && !ultimoIntento.controladora) {
                        ultimoIntento.controladora = ev;
                    }
                }
            });

            // Paso 2: Crear las "Visitas" (Entrada + Salida) y aplicar reglas
            let visitas = [];
            let visitaActual = null;

            intentos.forEach(intento => {
                let horaExacta = this.formatearHora(intento.controladora ? intento.controladora.eventTime : intento.facial.eventTime);
                let accesoPermitido = !!intento.controladora; // Si hay controladora, entró. Si no, anti-passback.

                if (intento.tipo === 'Entrada') {
                    if (visitaActual && !visitaActual.salida && accesoPermitido) {
                        visitaActual.estado = 'Alerta: Doble Entrada'; // Entró de nuevo sin haber salido antes
                        visitas.push(visitaActual);
                    }
                    if (visitaActual && visitaActual.salida) visitas.push(visitaActual);

                    visitaActual = {
                        fecha: intento.fechaBase,
                        entrada: { hora: horaExacta, foto: intento.facial.picUri },
                        salida: null,
                        estado: accesoPermitido ? 'En gimnasio' : 'Bloqueado (Anti-passback)'
                    };

                    // Si fue bloqueado, cerramos la visita de inmediato
                    if (!accesoPermitido) {
                        visitas.push(visitaActual);
                        visitaActual = null;
                    }
                } else if (intento.tipo === 'Salida') {
                    if (visitaActual) {
                        visitaActual.salida = { hora: horaExacta, foto: intento.facial.picUri };
                        visitaActual.estado = 'Completado';
                        visitas.push(visitaActual);
                        visitaActual = null;
                    }
                }
            });

            if (visitaActual) visitas.push(visitaActual);
            this.visitasProcesadas = visitas.reverse(); // Mostrar los más recientes arriba
            //console.log("✅ Visitas procesadas:", this.visitasProcesadas);
        },
        async obtenerEventosPuerta() {
            if (!this.docenteData || !this.personIdHC) return;
            this.cargandoEventos = true;

            if (!this.fechaInicio) this.aplicarFiltroFecha();

            try {
                const payload = {
                    personCode: this.docenteData.CIInfPer,
                    startTime: this.fechaInicio, 
                    endTime: this.fechaFin
                };
                const response = await API.post(`${this.baseUrl}/eventos-puerta-asistencia`, payload);
                //console.log("✅ Eventos obtenidos:", response);
                if (response.data?.data?.list) {
                    // En vez de mostrar la lista cruda, la procesamos
                    this.procesarMarcacionesAgrupadas(response.data.data.list);
                } else {
                    this.visitasProcesadas = [];
                }
            } catch (error) {
                console.error("Error consultando HikCentral:", error);
            } finally {
                this.cargandoEventos = false;
            }
        },
        async buscarDocente() {
            this.errorValidacion = false;
            this.errorValidacionTexto = "";
            this.estencontrado = true;
            if (!this.searchQuery || this.searchQuery.trim() === "") {
                this.errorValidacion = true;
                this.errorValidacionTexto = "El campo de búsqueda no puede estar vacío. Por favor ingrese una cédula.";
                return;
            }

            if (this.searchQuery.length < 10) {
                this.errorValidacion = true;
                this.errorValidacionTexto = `La cédula ingresada tiene solo ${this.searchQuery.length} dígitos. Verifique el número e intente de nuevo (Debe tener 10 dígitos).`;
                return;
            }

            this.cargando = true;
            this.docenteData = null;
            this.comparacionResultado = null; // Limpiar previo
            this.visitasProcesadas = [];

            try {
                // Llamada al método individual con caché que creamos en Laravel
                const response = await API.get(`/biometrico/getindivDoc/${this.searchQuery}`);
                if (!response.data || response.data.length === 0) {
                    this.estencontrado = false;
                } else {
                    this.estencontrado = true;
                    this.docenteData = response.data;
                    await this.verificarRegistroHC(this.docenteData.CIInfPer);
                    
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.docenteData.CIInfPer);
                        await this.obtenerEventosPuerta();
                    }else{
                        this.visitasProcesadas = [];
                    }
                }


            }catch (error) {
                console.error("❌ Error al buscar:", error);
                this.estencontrado = false;
            } finally {
                this.cargando = false;
            }
        },
        formatearHora(fechaIso) {
            if (!fechaIso) return '-';
            const fecha = new Date(fechaIso);
            
            // Retorna Hora:Minuto:Segundo (ej: 02:07:43 PM)
            return fecha.toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        },
        async verificarRegistroHC(ci) {
            this.cargandoStatus = true;
            try {
                const response = await API.get(`${this.baseUrl}/getperson/${ci}`);
                //console.log("✅ Estado de registro en HikCentral:", response);
                 this.personIdHC = response.data.personId;
                this.estaRegistrado = response.data.registrado;
            } catch (error) {
                this.estaRegistrado = false;
            } finally {
                this.cargandoStatus = false;
            }
        },
        async eliminarRegistroHC(ci) {
            this.cargandoStatus = true;
            try {
                const response = await API.get(`${this.baseUrl}/delete-hikdoc/${ci}`);
                //console.log("✅ Eliminado de HikCentral:", response);
                this.estaRegistrado = false;
            } catch (error) {
                this.estaRegistrado = false;
            } finally {
                this.cargandoStatus = false;
            }
        },
        async ejecutarComparacion(ci) {
            this.comparando = true;
            try {

                const { data } = await API.get(`${this.baseUrl}/compare-hikdoc/${ci}`);

               this.comparacionResultado = data;
                if (data.identicas) {
                    // Usar un alert o notificación con el porcentaje
                    //console.log(`✅ Match: ${data.similitud}%`);
                } else {
                    //console.log(`❌ Diferentes: Solo ${data.similitud} de parecido.`);
                }
            } catch (error) {
                mostraralertas2("Error en la comparación", "error");
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
            const confirmacion = await Swal.fire({
                title: '¿Confirmar Registro?',
                text: `¿Deseas registrar a ${this.docenteData?.NombInfPer || post} en HikCentral?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#126E1B',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, registrar',
                cancelButtonText: 'Cancelar'
            });

            if (!confirmacion.isConfirmed) return;

            this.cargando = true; // Bloquear UI para evitar clics repetidos
            Swal.fire({
                title: 'Sincronizando...',
                text: 'Enviando vectores faciales a HikCentral.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });
            try {
                const response = await API.post(`${this.baseUrl}/sync-hikcentral/${post}`);
                Swal.close();
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    mostraralertas2(`✅ Registrado con éxito. ID en HC: ${response.data.data}`, "success");

                    // Actualizar el estado en la tabla localmente sin recargar
                    await this.verificarRegistroHC(this.docenteData.CIInfPer);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.docenteData.CIInfPer);
                    }
                } else if (response.data.code === "131") {
                    console.warn("⚠️ Usuario ya registrado en HikCentral.");
                    mostraralertas2(`⚠️ Usuario ya registrado en HikCentral.`, "warning");
                    this.estaRegistrado = true;
                    this.searchQuery = '';
                    this.estencontrado = true;
                } else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.docenteData.CIInfPer + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.docenteData.CIInfPer} no es compatible con HikCentral.`, "error");
                    this.searchQuery = '';
                    this.estencontrado = false;
                    this.estaRegistrado = false;
                }
                else {
                    mostraralertas2(`⚠️ Respuesta del servidor: ${response.data.msg}`, "warning");
                }
            } catch (error) {
                this.searchQuery = '';
                this.estencontrado = false;
            } finally {
               this.cargando = false;
                this.searchQuery = '';
                this.estencontrado = true;
            }
        },
        async UpdateEnHikCentral(post) {
            // Confirmación simple
            if (!this.personIdHC) {
                mostraralertas2("❌ No se puede actualizar: No se encontró el PersonId de HikCentral. Verifique el estado primero.", "error");
                return;
            }
           const confirmacion = await Swal.fire({
                title: '¿Actualizar Fotografía?',
                text: `¿Deseas reemplazar la foto actual de ${this.docenteData?.NombInfPer || post} en HikCentral?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#126E1B',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar'
            });
            if (!confirmacion.isConfirmed) return;
            Swal.fire({
                title: 'Actualizando Base Biométrica...',
                text: 'Reemplazando registro de imagen anterior...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            this.cargando = true; // Bloquear UI para evitar clics repetidos
            try {
                const response = await API.post(`${this.baseUrl}/sync-hikdupdatedoce/${post}`, {
                    personaId: this.personIdHC // <--- Enviamos el UUID en el body
                });
                Swal.close();
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    mostraralertas2(`✅ Actualizado con éxito. ID en HC: ${response.data.data}`, "success");

                    // Actualizar el estado en la tabla localmente sin recargar
                    await this.verificarRegistroHC(this.docenteData.CIInfPer);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.docenteData.CIInfPer);
                    }
                }else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.docenteData.CIInfPer + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.docenteData.CIInfPer} no es compatible con HikCentral.`, "error");
                    this.searchQuery = '';
                    this.estencontrado = false;
                    this.estaRegistrado = false;
                } else {
                    mostraralertas2(`⚠️ Respuesta del servidor: ${response.data.msg}`, "warning");
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
                this.estencontrado = true;
            }
        },

    }
};
</script>
