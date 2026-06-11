<template>
    <div>
        <form class="flex-grow">
            <div class="relative">
                <div class="absolute -translate-y-1/2 left-4 top-1/2 flex items-center justify-center">
                    <svg v-if="!cargando" class="fill-gray-500 dark:fill-gray-400" width="20" height="20"
                        viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                            fill="" />
                    </svg>
                    <span v-else
                        class="inline-block w-5 h-5 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin"></span>
                </div>

                <input type="text" placeholder="Ingresa la cédula a buscar..." v-model="searchQuery"
                    @input="debouncedFilter" @keypress="onlyNumbers" @keyup.enter="buscar" :disabled="cargando"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]" />
            </div>
        </form>
        <br>

        <div v-if="!estencontrado"
            class="p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50 dark:bg-gray-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span class="font-bold">¡Atención!</span> No se ha encontrado ningún registro. Verifique si el personal
            posee una foto o está habilitado.
        </div>
        <div v-else-if="!personaData && !cargando" class="text-sm text-gray-500 dark:text-gray-400">
            Ingrese la cédula del personal para ver su información y su regsitro en HikCentral.
        </div>

        <div v-if="personaData && estencontrado">
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div
                            class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-100 flex items-center justify-center">
                            <img :src="getPhotoUrl(personaData.CIInfPer)" @error="handleImageError" alt="user"
                                class="object-cover w-full h-full" />
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
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
                            Información Personal
                        </h4>
                        <p class="text-[11px] text-gray-400 italic mb-6">
                            Nota: Los datos obtenidos aquí son los que el personal tiene registrados en el SIAD.
                        </p>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombres</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                    personaData.NombInfPer }}</p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{
                                    personaData.ApellInfPer + " " + personaData.ApellMatInfPer }}</p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Correo
                                    Institucional</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ personaData.mailInst
                                    }}</p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tipo de personal
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'D'">Docente</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'A'">Administrativo</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'T'">Trabajador</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90"
                                    v-if="personaData.TipoInfPer === 'TDO'">Tecnico Docente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
                            Información HikCentral
                        </h4>
                        <p class="text-[11px] text-gray-400 italic mb-4">
                            Nota: Aquí se va a verificar si el personal está registrado en HikCentral.
                        </p>
                        <div class="mt-2 flex items-center gap-2">
                            <span v-if="cargandoStatus" class="flex items-center gap-2 text-xs text-gray-500">
                                <span
                                    class="inline-block w-4 h-4 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin"></span>
                                Verificando en HikCentral...
                            </span>
                            <span v-else
                                :class="estaRegistrado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'"
                                class="px-2.5 py-1 border rounded-md text-xs font-bold uppercase tracking-wide">
                                {{ estaRegistrado ? 'Registrado en HIKCENTRAL' : 'No Registrado en HIKCENTRAL' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="estaRegistrado" class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Reporte de Asistencia
                </h4>
                <div
                    class="p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50 dark:bg-gray-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <span class="font-bold">¡Atención!</span> Si la hora de entrada dice 08:05 significa que el personal
                    llegó tarde y superó el límite de asistencia.
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
                        <input type="date" v-model="beginTime" @change="rangoSeleccionado = 'custom'"
                            :disabled="cargandoAsistencia"
                            class="w-full h-11 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:text-white/90" />
                    </div>

                    <div class="flex-1">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de
                            Fin</label>
                        <input type="date" v-model="endTime" @change="rangoSeleccionado = 'custom'"
                            :disabled="cargandoAsistencia"
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
                </div>


                <div v-if="attendanceData && attendanceData.length > 0" class="mt-6 overflow-x-auto">

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr
                                    class="border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <th class="py-3 px-4">Fecha</th>
                                    <th class="py-3 px-4">Departamento</th>
                                    <th class="py-3 px-4 text-center text-green-600 dark:text-green-400">Entrada</th>
                                    <th class="py-3 px-4 text-center text-amber-600 dark:text-amber-400">Salida Break
                                    </th>
                                    <th class="py-3 px-4 text-center text-brand-600 dark:text-brand-400">Entrada Break
                                    </th>
                                    <th class="py-3 px-4 text-center text-red-600 dark:text-red-400">Salida</th>
                                    <th class="py-3 px-4 text-center">Estado</th>
                                    <th class="py-3 px-4 text-center text-indigo-600 dark:text-indigo-400">Horas Trab.
                                    </th>
                                    <th class="py-3 px-4 text-center text-teal-600 dark:text-teal-400">Break</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template
                                    v-for="(record, index) in attendanceData.filter(r => String(r.attendanceBaseInfo?.attendanceStatus) !== '7')"
                                    :key="index">
                                    <tr :class="[
                                        'border-b border-gray-100 dark:border-gray-800/50 text-sm transition-colors',
                                        esMarcacionProblematica(record) ? 'text-gray-400 dark:text-gray-500 bg-amber-50/10 dark:bg-amber-950/5' : 'text-gray-800 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-gray-800/20'
                                    ]">
                                        <td class="py-3 px-4 font-medium">{{ formatOnlyDate(record.date) }}</td>
                                        <td class="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-[200px] truncate"
                                            :title="record.personInfo?.orgName">
                                            {{ formatDept(record.personInfo?.orgName) }}
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono font-semibold text-green-600 dark:text-green-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500 font-normal' : '']">
                                            {{ formatTimeOnly(record.attendanceBaseInfo?.beginTime) }}
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono text-amber-600 dark:text-amber-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500' : '']">
                                            {{
                                                calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime,
                                                    record.restInfo?.durationTime) }}
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono text-brand-600 dark:text-brand-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500' : '']">
                                            {{ formatTimeOnly(record.attendanceDetailInfo?.recordTime?.[0]?.endTime) }}
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono font-semibold text-red-600 dark:text-red-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500 font-normal' : '']">
                                            {{ formatTimeOnly(record.attendanceBaseInfo?.endTime) }}
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <span
                                                v-if="esMarcacionProblematica(record) && record.attendanceBaseInfo?.attendanceStatus === '4'"
                                                class="px-2.5 py-1 text-xs font-semibold rounded-full border bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                                                Problema de Registro
                                            </span>
                                            <span v-else
                                                :class="['px-2.5 py-1 text-xs font-semibold rounded-full border', obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).class]">
                                                {{
                                                    obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label
                                                }}
                                            </span>
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono font-semibold text-indigo-600 dark:text-indigo-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500 font-normal' : '']">
                                            {{ formatearSegundos(record.normalInfo?.durationTime) }}
                                        </td>
                                        <td
                                            :class="['py-3 px-4 text-center font-mono text-teal-600 dark:text-teal-400', esMarcacionProblematica(record) ? 'line-through !text-gray-400 dark:!text-gray-500' : '']">
                                            {{ formatearSegundos(record.restInfo?.durationTime) }}
                                        </td>
                                    </tr>

                                    <tr v-if="esMarcacionProblematica(record) && record.attendanceBaseInfo?.attendanceStatus === '4'"
                                        class="bg-amber-50/40 dark:bg-amber-950/10 border-b border-gray-100 dark:border-gray-800/50">
                                        <td colspan="9"
                                            class="py-2.5 px-4 text-xs text-amber-800 dark:text-amber-400 font-medium">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                                    </path>
                                                </svg>
                                                <span>
                                                    <strong>¡Advertencia!</strong> La asistencia no se guardó, verifique
                                                    si es problema de conexión con el dispositivo o si el personal vino
                                                    a la institución.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="attendanceData && attendanceData.length > 0"
                    class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div v-if="existeEnDB"
                        class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex justify-between items-center">
                        <div>
                            <span class="font-bold">Información Local:</span> Se encontraron marcaciones en la base de
                            datos de la
                            institución de la app de FACE ID SIAD.
                        </div>
                    </div>
                    <div v-else
                        class="p-4 mb-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        <span class="font-bold">Información Local:</span> No hay marcaciones previas en la base de datos
                        local para este
                        periodo. Las de HikCentral serán registradas como nuevas.
                    </div>

                    <button @click="compararYRegistrar" :disabled="sincronizando"
                        class="h-11 px-6 w-full rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="sincronizando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                            </path>
                        </svg>
                        <span>{{ sincronizando ? 'Procesando Sincronización...' : 'Comparar marcaciones y registrar'
                        }}</span>
                    </button>
                </div>

                <div v-if="datosFinales && datosFinales.length > 0" class="mt-8">
                    <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                        Resultado Final Base de Datos (SIAD)
                    </h4>
                    <div class="overflow-x-auto border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <table class="w-full text-left border-collapse min-w-[800px]">
                            <thead class="bg-emerald-50 dark:bg-emerald-900/20">
                                <tr class="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                                    <th class="py-3 px-4">Fecha</th>
                                    <th class="py-3 px-4 text-center">Hora Entrada</th>
                                    <th class="py-3 px-4 text-center">Almuerzo Salida</th>
                                    <th class="py-3 px-4 text-center">Almuerzo Entrada</th>
                                    <th class="py-3 px-4 text-center">Hora Salida</th>
                                    <th class="py-3 px-4 text-center">Estado</th>
                                    <th class="py-3 px-4 text-center">Horas Trab.</th>
                                    <th class="py-3 px-4 text-center">Tiempo Break</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(record, index) in datosFinales" :key="index"
                                    class="border-b border-gray-100 dark:border-gray-800/50 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors text-gray-800 dark:text-white/90">

                                    <td class="py-3 px-4 font-medium">{{ record.fecha }}</td>

                                    <td
                                        class="py-3 px-4 text-center font-mono font-semibold text-green-600 dark:text-green-400">
                                        {{ formatTimeFromDB(record.hora_entrada) }}
                                    </td>

                                    <td class="py-3 px-4 text-center font-mono text-amber-600 dark:text-amber-400">
                                        {{ formatTimeFromDB(record.hora_almuerzo_salida) }}
                                    </td>

                                    <td class="py-3 px-4 text-center font-mono text-brand-600 dark:text-brand-400">
                                        {{ formatTimeFromDB(record.hora_almuerzo_entrada) }}
                                    </td>

                                    <td
                                        class="py-3 px-4 text-center font-mono font-semibold text-red-600 dark:text-red-400">
                                        {{ formatTimeFromDB(record.hora_salida) }}
                                    </td>

                                    <td class="py-3 px-4 text-center whitespace-nowrap">
                                        <span
                                            :class="['px-2.5 py-1 text-xs font-semibold rounded-full border', obtenerClasePorEstadoDB(record.estado_asistencia)]">
                                            {{ record.estado_asistencia || 'Desconocido' }}
                                        </span>
                                    </td>

                                    <td
                                        class="py-3 px-4 text-center font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                        {{ calcularHorasTrabajadasDB(record.hora_entrada, record.hora_salida) }}
                                    </td>

                                    <td class="py-3 px-4 text-center font-mono text-teal-600 dark:text-teal-400">
                                        {{ calcularTiempoBreakDB(record.hora_almuerzo_salida,
                                            record.hora_almuerzo_entrada) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="attendanceData && attendanceData.length > 0" class="flex justify-end mb-4">
                    <button @click="generarPDF" :disabled="generandoPDF"
                        class="h-11 px-6 rounded-lg flex items-center justify-center gap-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                        <svg v-if="generandoPDF" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 5a1 1 0 011-1h3a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H9z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>{{ generandoPDF ? 'Generando PDF...' : 'Generar PDF' }}</span>
                    </button>
                </div>

                <div v-else-if="attendanceData && attendanceData.length === 0"
                    class="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-800">
                    No se encontraron registros de asistencia en el rango de fechas seleccionado.
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
import { mostraralertas2, enviarsolig, eliminacion, confimarhabi, elimnarpermanente } from '@/assets/js/function/funciones';
import { jsPDF } from "jspdf";
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
            rangoSeleccionado: "custom",
            generandoPDF: false,
            existeEnDB: false,
            sincronizando: false,
            datosFinales: null,
        };
    },
    methods: {
        onlyNumbers(event) {
            const charCode = event.charCode ? event.charCode : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        esMarcacionProblematica(record) {
            if (!record) return false;

            const detailInfo = record.attendanceDetailInfo;
            // 1. Validar si el campo recordTime NO existe o si su longitud es menor o igual a 0
            const sinRecordTime = !detailInfo || !detailInfo.recordTime || detailInfo.recordTime.length === 0;

            return sinRecordTime;
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

            // Buscamos la clase por el texto exacto, si no existe usamos un color gris por defecto
            return clases[estadoTexto] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
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
            this.rangoSeleccionado = "custom";

            try {
                // Llamada al método individual con caché que creamos en Laravel
                const response = await API.get(`/biometrico/getindivDocUTLVTE/${this.searchQuery}`);
                if (!response.data || response.data.length === 0) {
                    this.estencontrado = false;
                } else {
                    this.estencontrado = true;
                    this.personaData = response.data;
                    await this.verificarRegistroHC(this.personaData.CIInfPer);

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
                this.personIdHC = response.data.personId;
                this.estaRegistrado = response.data.registrado;
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
                mostraralertas2("Por favor seleccione la fecha de inicio y fin.", "warning");
                return;
            }
            if (new Date(this.beginTime) > new Date(this.endTime)) {
                mostraralertas2("La fecha de inicio no puede ser mayor que la fecha de fin.", "warning");
                return;
            }

            this.cargandoAsistencia = true;
            this.attendanceData = null;
            this.datosFinales = null;

            try {
                // Modifica esta ruta según el nombre que le hayas dado a tu endpoint en routes/api.php
                const response = await API.post('/biometrico/attendance-report', {
                    personCode: this.personaData.CIInfPer,
                    personID: this.personIdHC,
                    beginTime: this.beginTime,
                    endTime: this.endTime
                });
                // HikCentral normalmente devuelve la lista de registros dentro de data.data.list
                if (response.data && response.data.data && response.data.data.record) {
                    this.attendanceData = response.data.data.record;
                    await this.verificarAsistenciaLocal();
                } else {
                    this.attendanceData = [];
                }
            } catch (error) {
                console.error("❌ Error al obtener la asistencia:", error);
                mostraralertas2("Ocurrió un problema al obtener el reporte de asistencia.", "error");
                this.attendanceData = [];
            } finally {
                this.cargandoAsistencia = false;
            }
        },
        async verificarAsistenciaLocal() {
            try {
                const res = await API.post('/biometrico/check-local-attendance', {
                    ci_empleado: this.personaData.CIInfPer,
                    beginTime: this.beginTime,
                    endTime: this.endTime
                });
                this.existeEnDB = res.data.exists;
            } catch (error) {
                console.error("Error al verificar DB local:", error);
            }
        },
        async compararYRegistrar() {
            this.sincronizando = true;

            // 1. Filtramos los registros que sean estado 7 (No programado/Fin de semana)
            const marcacionesValidas = this.attendanceData.filter(
                record => String(record.attendanceBaseInfo?.attendanceStatus) !== '7'
            );

            // 2. Mapeamos los datos válidos incluyendo el estado
            const marcacionesFormateadas = marcacionesValidas.map(record => {
                return {
                    // Se envía YYYY-MM-DD directo a Laravel para evitar errores de MySQL
                    fecha: record.date,
                    hora_entrada: record.attendanceBaseInfo?.beginTime || null,
                    hora_almuerzo_salida: this.calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime, record.restInfo?.durationTime) || null,
                    hora_almuerzo_entrada: record.attendanceDetailInfo?.recordTime?.[0]?.endTime || null,
                    hora_salida: record.attendanceBaseInfo?.endTime || null,
                    estado_asistencia: this.obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label || null // Enviamos el estado a Laravel
                };
            });

            try {
                const response = await API.post('/biometrico/attendance-sync', {
                    ci_empleado: this.personaData.CIInfPer,
                    beginTime: this.beginTime,
                    endTime: this.endTime,
                    marcaciones: marcacionesFormateadas
                });

                // Guardamos los datos de la base de datos ya actualizados
                this.datosFinales = response.data;
                console.log("Datos finales:", this.datosFinales);
                mostraralertas2("Marcaciones comparadas y sincronizadas con éxito.", "success");
                this.existeEnDB = true;

            } catch (error) {
                console.error("Error al sincronizar marcaciones:", error);
                mostraralertas2("Ocurrió un error al procesar las marcaciones.", "error");
            } finally {
                this.sincronizando = false;
            }
        },
        formatTimeFromDB(dateTimeString) {
            if (!dateTimeString) return '—';
            // Reemplazamos espacio por T para evitar errores en Safari/Firefox con fechas MySQL
            const dt = new Date(dateTimeString.replace(' ', 'T'));
            if (isNaN(dt.getTime())) return '—';
            return dt.toLocaleTimeString('es-EC', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            });
        },

        calcularHorasTrabajadasDB(entrada, salida) {
            if (!entrada || !salida) return "00:00 h";

            let dtEntrada = new Date(entrada.replace(' ', 'T'));
            let dtSalida = new Date(salida.replace(' ', 'T'));

            if (isNaN(dtEntrada) || isNaN(dtSalida)) return "00:00 h";

            // Si marcó entrada antes de las 8 AM, el cálculo asume las 8 AM en punto
            if (dtEntrada.getHours() < 8) {
                dtEntrada.setHours(8, 0, 0, 0);
            }

            const diffMs = dtSalida - dtEntrada;
            if (diffMs <= 0) return "00:00 h";

            // Reutilizamos tu propio formateador
            return this.formatearSegundos(Math.floor(diffMs / 1000));
        },

        calcularTiempoBreakDB(salidaBreak, entradaBreak) {
            if (!salidaBreak || !entradaBreak) return "00:00 h";

            let dtSalida = new Date(salidaBreak.replace(' ', 'T'));
            let dtEntrada = new Date(entradaBreak.replace(' ', 'T'));

            if (isNaN(dtSalida) || isNaN(dtEntrada)) return "00:00 h";

            const diffMs = dtEntrada - dtSalida;
            if (diffMs <= 0) return "00:00 h";

            return this.formatearSegundos(Math.floor(diffMs / 1000));
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
        async generarPDF() {
            this.generandoPDF = true;
            try {
                // Auxiliar para pre-cargar las imágenes en promesas distribuidas
                const cargarImagen = (src) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'Anonymous';
                        img.src = src;
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(null); // Evita romper todo el flujo si falla
                    });
                };

                // REEMPLAZA '/fondo.png' por el nombre real de tu archivo en la carpeta public
                const fondoImgUrl = '/fondo.png';
                const fotoPerfilUrl = this.getPhotoUrl(this.personaData.CIInfPer);
                const fotoFallbackUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";

                const [imgFondo, imgPerfil] = await Promise.all([
                    cargarImagen(fondoImgUrl),
                    cargarImagen(fotoPerfilUrl).then(img => img ? img : cargarImagen(fotoFallbackUrl))
                ]);

                // Instanciar jsPDF (A4 vertical -> 210mm x 297mm)
                const doc = new jsPDF('p', 'mm', 'a4');

                // Función repetitiva para pintar el fondo en cada página
                const aplicarFondo = () => {
                    if (imgFondo) {
                        doc.addImage(imgFondo, 'PNG', 0, 0, 210, 297);
                    }
                };

                // Primera página
                aplicarFondo();

                // 1. SECCIÓN DE DATOS PERSONALES
                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.setTextColor(30, 41, 59); // Color Pizarra Oscuro

                // CAMBIO: Título bajado a Y=35 y centrado en X=105
                doc.text("REPORTE DE ASISTENCIA INDIVIDUAL", 105, 35, { align: "center" });

                // CAMBIO: Todos los elementos siguientes bajan +10mm en su coordenada Y

                // Dibujar foto de perfil con un marco elegante
                if (imgPerfil) {
                    doc.setDrawColor(226, 232, 240); // Borde gris claro
                    doc.setLineWidth(0.5);
                    doc.rect(14.75, 43.75, 26.5, 26.5); // Y bajó a 43.75
                    doc.addImage(imgPerfil, 'JPEG', 15, 44, 26, 26);    // Y bajó a 44
                }

                // Escribir datos a un lado de la imagen (Color de etiquetas secundario #475569)
                doc.setFontSize(10);

                doc.setFont("helvetica", "bold");
                doc.setTextColor(71, 85, 105);
                doc.text("Nombres y Apellidos:", 46, 48); // Y bajó a 48
                doc.setFont("helvetica", "normal");
                doc.setTextColor(15, 23, 42);
                doc.text(`${this.personaData.NombInfPer} ${this.personaData.ApellInfPer} ${this.personaData.ApellMatInfPer}`, 85, 48);

                doc.setFont("helvetica", "bold");
                doc.setTextColor(71, 85, 105);
                doc.text("Cédula de Identidad:", 46, 54); // Y bajó a 54
                doc.setFont("helvetica", "normal");
                doc.setTextColor(15, 23, 42);
                doc.text(this.personaData.CIInfPer, 85, 54);

                doc.setFont("helvetica", "bold");
                doc.setTextColor(71, 85, 105);
                doc.text("Tipo de Personal:", 46, 60); // Y bajó a 60
                doc.setFont("helvetica", "normal");
                doc.setTextColor(15, 23, 42);
                let tipo = "Desconocido";
                if (this.personaData.TipoInfPer === 'D') tipo = 'Docente';
                else if (this.personaData.TipoInfPer === 'A') tipo = 'Administrativo';
                else if (this.personaData.TipoInfPer === 'T') tipo = 'Trabajador';
                else if (this.personaData.TipoInfPer === 'TDO') tipo = 'Técnico Docente';
                doc.text(tipo, 85, 60);

                doc.setFont("helvetica", "bold");
                doc.setTextColor(71, 85, 105);
                doc.text("Correo Institucional:", 46, 66); // Y bajó a 66
                doc.setFont("helvetica", "normal");
                doc.setTextColor(15, 23, 42);
                doc.text(this.personaData.mailInst || 'N/A', 85, 66);

                // NUEVO: El Departamento ahora se incluye aquí como información de la persona
                doc.setFont("helvetica", "bold");
                doc.setTextColor(71, 85, 105);
                doc.text("Departamento:", 46, 72); // Y bajó a 72
                doc.setFont("helvetica", "normal");
                doc.setTextColor(15, 23, 42);
                const deptoPersona = this.attendanceData.length > 0
                    ? this.formatDept(this.attendanceData[0].personInfo?.orgName)
                    : 'N/A';
                doc.text(deptoPersona, 85, 72);


                // 2. SECCIÓN TABLA DE ASISTENCIA (Renderizado Manual Adaptativo)
                // CAMBIO: La tabla ahora inicia en Y=84 para respetar el espacio nuevo
                let y = 84;

                // Encabezados de la tabla rediseñados (Sin Departamento)
                const cabeceras = ['Fecha', 'Entrada', 'Sal. Brk', 'Ent. Brk', 'Salida', 'Estado', 'H. Trab.', 'Break'];
                // Distribución optimizada de anchos de columna (Sumatoria = 186mm exactos)
                const anchosCol = [24, 21, 21, 21, 21, 30, 24, 24];
                const xInicial = 12;

                // Función reutilizable para renderizar cabeceras con estilo corporativo oscuro
                const dibujarCabeceras = (yPos) => {
                    doc.setFillColor(30, 41, 59); // Fondo Azul Pizarra Oscuro
                    doc.rect(xInicial, yPos, 186, 9, 'F');
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8.5);
                    doc.setTextColor(255, 255, 255); // Texto blanco

                    let xActual = xInicial;
                    cabeceras.forEach((cabecera, i) => {
                        const align = (i === 0) ? 'left' : 'center';
                        const xTexto = align === 'center' ? xActual + (anchosCol[i] / 2) : xActual + 3;
                        doc.text(cabecera, xTexto, yPos + 6, { align: align });
                        xActual += anchosCol[i];
                    });
                };

                // Dibujar Cabeceras iniciales
                dibujarCabeceras(y);
                y += 9; // Bajar posición para las filas
                const registrosFiltrados = this.attendanceData.filter(record => String(record.attendanceBaseInfo?.attendanceStatus) !== '7');
                // Iterar los registros de asistencia
                registrosFiltrados.forEach((record, index) => {

                    // Extraer y procesar los valores textualmente
                    const celdaFecha = this.formatOnlyDate(record.date);
                    const celdaEntrada = this.formatTimeOnly(record.attendanceBaseInfo?.beginTime);
                    const celdaSalidaBrk = this.calcularSalidaBreak(record.attendanceDetailInfo?.recordTime?.[0]?.endTime, record.restInfo?.durationTime);
                    const celdaEntradaBrk = this.formatTimeOnly(record.attendanceDetailInfo?.recordTime?.[0]?.endTime);
                    const celdaSalida = this.formatTimeOnly(record.attendanceBaseInfo?.endTime);
                    const celdaEstado = this.obtenerEstiloEstado(record.attendanceBaseInfo?.attendanceStatus).label;
                    const celdaHTrab = this.formatearSegundos(record.normalInfo?.durationTime);
                    const celdaBreak = this.formatearSegundos(record.restInfo?.durationTime);

                    const arrayFila = [celdaFecha, celdaEntrada, celdaSalidaBrk, celdaEntradaBrk, celdaSalida, celdaEstado, celdaHTrab, celdaBreak];

                    // Configurar fuente de celdas temporalmente para calcular saltos de línea exactos
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);

                    // Mapear cada texto a un arreglo de líneas si desborda el ancho asignado a su celda
                    // Restamos 4mm al ancho de columna para dejar márgenes internos (padding) de seguridad
                    const lineasFila = arrayFila.map((texto, i) => {
                        return doc.splitTextToSize(String(texto || ''), anchosCol[i] - 4);
                    });

                    // Determinar cuántas líneas ocupa la celda más larga de esta fila
                    const maxLineas = Math.max(...lineasFila.map(l => l.length));
                    // Calcular el alto proporcional de la fila (mínimo de 8mm, o 4.5mm por línea de texto)
                    const altoFila = Math.max(8, maxLineas * 4.5);

                    // Validar si la fila desborda la página actual (Límite inferior seguro: 275mm)
                    if (y + altoFila > 275) {
                        doc.addPage();
                        aplicarFondo();
                        y = 20; // Reiniciar Y en la nueva página

                        // Reimprimir cabecera estilizada en la nueva página
                        dibujarCabeceras(y);
                        y += 9;

                        // Restablecer estilos de fuente tras redibujar cabecera
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(8);
                    }

                    // Aplicar fondo intercalado (Zebra striping) para mayor legibilidad
                    if (index % 2 === 0) {
                        doc.setFillColor(248, 250, 252); // Gris azulado ultra claro (#f8fafc)
                        doc.rect(xInicial, y, 186, altoFila, 'F');
                    }

                    // Dibujar línea inferior delgada separadora de fila
                    doc.setDrawColor(226, 232, 240); // Gris claro slate-200
                    doc.setLineWidth(0.2);
                    doc.line(xInicial, y + altoFila, xInicial + 186, y + altoFila);

                    // Escribir los valores de las celdas considerando multi-líneas distribuidas
                    let xFila = xInicial;
                    lineasFila.forEach((lineas, i) => {
                        doc.setTextColor(51, 65, 85); // Color de fuente Slate-700
                        const align = (i === 0) ? 'left' : 'center';
                        const xTexto = align === 'center' ? xFila + (anchosCol[i] / 2) : xFila + 2;

                        // Centrado vertical básico dentro de la celda según el número de líneas
                        const altoTexto = lineas.length * 3.5;
                        const yTexto = y + 4.5 + ((altoFila - 4.5 - altoTexto) / 2);

                        doc.text(lineas, xTexto, yTexto, { align: align });
                        xFila += anchosCol[i];
                    });

                    y += altoFila; // Desplazar coordenada Y al final de la fila renderizada
                });

                // Descargar el documento PDF finalizado
                doc.save(`Reporte_Asistencia_${this.personaData.CIInfPer}.pdf`);

            } catch (error) {
                console.error("Error generando PDF:", error);
                mostraralertas2("No se pudo estructurar el archivo PDF correctamente.", "error");
            } finally {
                this.generandoPDF = false;
            }
        }

    }
};
</script>
