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
                    @input="debouncedFilter" @keypress="onlyNumbers" @keyup.enter="buscar"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]" />
            </div>

        </form>
        <br>
        <div v-if="personaData && estencontrado">
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img :src="getPhotoUrl(personaData.CIInfPer)" alt="user" />
                        </div>
                        <div class="order-3 xl:order-2">
                            <h4
                                class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {{ personaData.NombInfPer + " " + personaData.ApellInfPer + " " +
                                    personaData.ApellMatInfPer }}
                            </h4>
                            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ personaData.CIInfPer }}</p>
                                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="personaData.TipoInfPer === 'D'">Docente</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="personaData.TipoInfPer === 'A'">Administrativo</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="personaData.TipoInfPer === 'T'">Trabajador</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400"
                                    v-if="personaData.TipoInfPer === 'TDO'">Tecnico Docente</p>
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
                                    {{ personaData.NombInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ personaData.ApellInfPer + " " + personaData.ApellMatInfPer }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Correo Institucional
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ personaData.mailInst }}
                                </p>
                            </div>



                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tipo de personal
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'D'">
                                    Docente
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'A'">
                                    Administrativo
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'T'">
                                    Trabajador
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'TDO'">
                                    Tecnico Docente
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
                            Nota: Los datos obtenidos aquí son los datos que el docente tiene registrados en HikCentral.
                            Luego que verifiques la información debes dar clic en "Sincronizar HK"
                        </p>
                        <br>

                        <div class="mt-2">
                            <span v-if="cargandoStatus" class="text-xs text-gray-400">Verificando en
                                HikCentral...</span>
                            <span v-else
                                :class="estaRegistrado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                                class="px-2 py-1 rounded-md text-xs font-bold uppercase">
                                {{ estaRegistrado ? 'Registrado en HC' : 'No Registrado en HC' }}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div v-if="estaRegistrado" class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Reporte de Asistencia
                </h4>

                <div class="flex flex-col gap-4 mt-4 mb-6 md:flex-row md:items-end">
                    <div class="flex-1">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rango Rápido
                        </label>
                        <select v-model="rangoSeleccionado" @change="aplicarRangoFecha"
                            class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-800 dark:text-white/90">
                            <option value="custom">Personalizado</option>
                            <option value="hoy">Hoy</option>
                            <option value="esta_semana">Esta semana (Lun - Vie)</option>
                            <option value="mes_actual">Mes actual</option>
                            <option value="mes_anterior">Mes anterior</option>
                        </select>
                    </div>

                    <div class="flex-1">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de
                            Inicio</label>
                        <input type="date" v-model="beginTime" @change="rangoSeleccionado = 'custom'"
                            class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-800 dark:text-white/90" />
                    </div>

                    <div class="flex-1">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de
                            Fin</label>
                        <input type="date" v-model="endTime" @change="rangoSeleccionado = 'custom'"
                            class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden dark:border-gray-800 dark:text-white/90" />
                    </div>

                    <button @click="buscarAsistencia" :disabled="cargandoAsistencia"
                        class="h-11 px-6 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600">
                        <span v-if="cargandoAsistencia">Buscando...</span>
                        <span v-else>Buscar Reporte</span>
                    </button>
                </div>

                <div v-if="attendanceData && attendanceData.length > 0" class="mt-6 overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr
                                class="border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <th class="py-3 px-4">Fecha</th>
                                <th class="py-3 px-4">Departamento</th>
                                <th class="py-3 px-4 text-center text-green-600 dark:text-green-400">Entrada</th>
                                <th class="py-3 px-4 text-center text-amber-600 dark:text-amber-400">Salida Break</th>
                                <th class="py-3 px-4 text-center text-brand-600 dark:text-brand-400">Entrada Break</th>
                                <th class="py-3 px-4 text-center text-red-600 dark:text-red-400">Salida</th>
                                <th class="py-3 px-4 text-center">Estado</th>
                                <th class="py-3 px-4 text-center text-indigo-600 dark:text-indigo-400">Horas Trab.</th>
                                <th class="py-3 px-4 text-center text-teal-600 dark:text-teal-400">Break</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(record, index) in attendanceData" :key="index"
                                class="border-b border-gray-100 dark:border-gray-800/50 text-sm text-gray-800 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                <td class="py-3 px-4 font-medium">{{ formatOnlyDate(record.date) }}</td>

                                <td class="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-[200px] truncate"
                                    :title="record.personInfo?.orgName">
                                    {{ formatDept(record.personInfo?.orgName) }}
                                </td>

                                <td
                                    class="py-3 px-4 text-center font-mono font-semibold text-green-600 dark:text-green-400">
                                    {{ formatTimeOnly(record.attendanceBaseInfo?.beginTime) }}
                                </td>
                                <td class="py-3 px-4 text-center font-mono text-amber-600 dark:text-amber-400">
                                    {{ calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime,
                                        record.restInfo?.durationTime) }}
                                </td>
                                <td class="py-3 px-4 text-center font-mono text-brand-600 dark:text-brand-400">
                                    {{ formatTimeOnly(record.attendanceDetailInfo?.recordTime?.[0]?.endTime) }}
                                </td>
                                <td
                                    class="py-3 px-4 text-center font-mono font-semibold text-red-600 dark:text-red-400">
                                    {{ formatTimeOnly(record.attendanceBaseInfo?.endTime) }}
                                </td>

                                <td class="py-3 px-4 text-center whitespace-nowrap">
                                    <span
                                        :class="['px-2.5 py-1 text-xs font-semibold rounded-full', obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).class]">
                                        {{ obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label }}
                                    </span>
                                </td>

                                <td
                                    class="py-3 px-4 text-center font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                    {{ formatearSegundos(record.normalInfo?.durationTime) }}
                                </td>

                                <td class="py-3 px-4 text-center font-mono text-teal-600 dark:text-teal-400">
                                    {{ formatearSegundos(record.restInfo?.durationTime) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else-if="attendanceData && attendanceData.length === 0"
                    class="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-lg text-center">
                    No se encontraron registros de asistencia en el rango de fechas seleccionado.
                </div>
            </div>

        </div>
        <div v-if="!estencontrado">
            <span class="text-gray-500 danger:text-gray-400">No se ha encontrado ningún registro. Verifique si el
                docente posee una foto o está habilitado</span>
        </div>
        <div v-else>
            <span class="text-gray-500 danger:text-gray-400">Ingrese la cédula de un docente para ver su información y
                cargarla en HikCentral.</span>
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
            personaData: null,
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
            beginTime: "",
            endTime: "",
            attendanceData: null,
            cargandoAsistencia: false,
            rangoSeleccionado: "custom"
        };
    },
    methods: {
        onlyNumbers(event) {
            const charCode = event.charCode ? event.charCode : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        obtenerEstiloEstado(status) {
            const estados = {
                "1": { label: "Normal", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
                "2": { label: "Tarde", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
                "3": { label: "Salida Anticipada", class: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
                "4": { label: "Ausente", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
                "5": { label: "Tarde y Salida Ant.", class: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
                "6": { label: "Día Festivo", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
                "7": { label: "No Programado", class: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400" },
                "8": { label: "Permiso", class: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" }
            };

            return estados[status] || { label: "Desconocido", class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
        },
        formatearSegundos(segundosTotales) {
            if (!segundosTotales || isNaN(segundosTotales) || parseInt(segundosTotales) === 0) {
                return "00:00 h";
            }

            const secs = parseInt(segundosTotales, 10);
            const horas = Math.floor(secs / 3600);
            const minutos = Math.floor((secs % 3600) / 60);

            const horasStr = horas.toString().padStart(2, '0');
            const minutosStr = minutos.toString().padStart(2, '0');

            return `${horasStr}:${minutosStr} h`;
        },
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
        // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
        getPhotoUrl(ci) {
            const baseURL2 = API.defaults.baseURL;
            return `${baseURL2}/biometrico/fotografiadoc/${ci}?t=${new Date().getTime()}`;
        },
        async buscar() {
            if (this.searchQuery.length < 10) return;

            this.cargando = true;
            this.personaData = null;
            this.comparacionResultado = null; // Limpiar previo
            this.attendanceData = null;
            this.beginTime = "";
            this.endTime = "";

            try {
                // Llamada al método individual con caché que creamos en Laravel
                const response = await API.get(`/biometrico/getindivDocUTLVTE/${this.searchQuery}`);
                if (!response.data || response.data.length === 0) {
                    this.estencontrado = false;
                } else {
                    this.estencontrado = true;
                    this.personaData = response.data;
                    await this.verificarRegistroHC(this.personaData.CIInfPer);
                    if (this.estaRegistrado) {

                    }
                }


            } catch (error) {
                console.error("❌ Error al buscar:", error);
                this.estencontrado = false;
            } finally {
                this.cargando = false;
            }
        },
        async verificarRegistroHC(ci) {
            this.cargandoStatus = true;
            try {
                const response = await API.get(`${this.baseUrl}/getperson/${ci}`);
                console.log("Respuesta de existencia:", response);
                this.personIdHC = response.data.personId;
                this.estaRegistrado = response.data.registrado;
                console.log("PersonaID:", this.personIdHC);
            } catch (error) {
                this.estaRegistrado = false;
            } finally {
                this.cargandoStatus = false;
            }
        },
        handleImageError(event) {
            event.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
        },
        async buscarAsistencia() {
            if (!this.beginTime || !this.endTime) {
                alert("Por favor seleccione la fecha de inicio y fin.");
                return;
            }
            if (new Date(this.beginTime) > new Date(this.endTime)) {
                alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
                return;
            }

            this.cargandoAsistencia = true;
            this.attendanceData = null;

            try {
                // Modifica esta ruta según el nombre que le hayas dado a tu endpoint en routes/api.php
                const response = await API.post('/biometrico/attendance-report', {
                    personCode: this.personaData.CIInfPer,
                    personID: this.personIdHC,
                    beginTime: this.beginTime,
                    endTime: this.endTime
                });
                console.log("Respuesta de asistencia:", response);

                // HikCentral normalmente devuelve la lista de registros dentro de data.data.list
                if (response.data && response.data.data && response.data.data.record) {
                    this.attendanceData = response.data.data.record;
                } else {
                    this.attendanceData = [];
                }
            } catch (error) {
                console.error("❌ Error al obtener la asistencia:", error);
                alert("Ocurrió un problema al obtener el reporte de asistencia.");
                this.attendanceData = [];
            } finally {
                this.cargandoAsistencia = false;
            }
        },
        formatDept(orgName) {
            if (!orgName) return 'N/A';
            const partes = orgName.split('>');
            return partes[partes.length - 1];
        },
        formatTimeOnly(dateTimeString) {
            if (!dateTimeString || dateTimeString.startsWith('0000-00-00')) return '—';
            try {
                const date = new Date(dateTimeString);
                if (isNaN(date.getTime())) return '—';
                return date.toLocaleTimeString('es-EC', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
            } catch (e) {
                return '—';
            }
        },

        // 🆕 NUEVO: Limpia la fecha para que no muestre la hora si viene en formato plano
        formatOnlyDate(dateString) {
            if (!dateString) return '';
            const [anio, mes, dia] = dateString.split('-');
            return `${dia}/${mes}/${anio}`;
        },

        // 🆕 NUEVO MÉTODO: Formateo de fecha para la tabla
        formatDateTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        },
        calcularSalidaBreak(entradaBreak, duracionSegundos) {
            // Si no hay hora de entrada o la duración no es válida, retornamos un guion
            if (!entradaBreak || entradaBreak.startsWith('0000-00-00') || !duracionSegundos || isNaN(duracionSegundos) || parseInt(duracionSegundos) === 0) {
                return '—';
            }

            try {
                const date = new Date(entradaBreak);
                if (isNaN(date.getTime())) return '—';

                // Restamos la duración del break (en segundos) a la hora de entrada del break
                date.setSeconds(date.getSeconds() - parseInt(duracionSegundos, 10));

                // Formateamos la nueva hora de salida
                return date.toLocaleTimeString('es-EC', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
            } catch (e) {
                return '—';
            }
        },

    }
};
</script>
