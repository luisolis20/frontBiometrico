<template>
    <div>
        <!-- BARRA DE BÚSQUEDA -->
        <form class="w-full max-w-2xl relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200"
                :class="cargando ? 'text-brand-500' : 'text-gray-400 group-focus-within:text-brand-500'">
                <svg v-if="cargando" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                </svg>
            </div>
            <input type="text" placeholder="Ingresa la cédula a buscar..." v-model="searchQuery"
                :disabled="cargando" @input="onInputValidador" @keypress="onlyNumbers" @keyup.enter="buscarEstudiante" maxlength="10"
                class="w-full h-12 pl-12 pr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-gray-800 dark:text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900/50" />
        </form>
        <br>
        <!-- SELECTOR DE PERIODO -->
        <div class="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-3xl">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Periodo Lectivo de Consulta</h3>
            <div class="flex flex-wrap gap-3">
                <label v-for="(periodo, index) in periodosList" :key="periodo.idper"
                    class="relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all duration-200 group"
                    :class="[
                        periodoSeleccionado === periodo.idper
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/50 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300',
                        cargando ? 'opacity-50 pointer-events-none' : ''
                    ]">
                    <div class="flex items-center gap-3">
                        <div class="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                            :class="periodoSeleccionado === periodo.idper ? 'border-brand-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'">
                            <div v-if="periodoSeleccionado === periodo.idper" class="w-2 h-2 rounded-full bg-brand-500"></div>
                        </div>
                        <span class="text-sm font-semibold">{{ periodo.DescPerLec }}</span>
                    </div>
                    <span v-if="index === 0" class="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        :class="periodoSeleccionado === periodo.idper ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'">
                        Vigente
                    </span>
                    <input type="radio" name="periodo-lectivo" :value="periodo.idper" v-model="periodoSeleccionado" :disabled="cargando" class="sr-only" />
                </label>
            </div>
        </div>
        <br>
        <!-- CONTENIDO DEL ESTUDIANTE -->
        <div v-if="estudianteData && estencontrado && !cargando" class="space-y-6">
            
            <!-- HEADER ESTUDIANTE -->
            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div class="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                    <img :src="getPhotoUrl(estudianteData.CIInfPer)" alt="Foto estudiante" class="w-full h-full object-cover" />
                </div>
                <div class="text-center sm:text-left flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ estudianteData.NombInfPer }} {{ estudianteData.ApellInfPer }} {{ estudianteData.ApellMatInfPer }}
                    </h2>
                    <div class="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
                            {{ estudianteData.CIInfPer }}
                        </span>
                        <div class="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ estudianteData.NombCarr }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- INFORMACIÓN PERSONAL -->
                <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
                    <div class="mb-5">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Información Personal</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Datos registrados en el sistema SIAD.</p>
                    </div>
                    <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nombres</p>
                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ estudianteData.NombInfPer }}</p>
                        </div>
                        <div>
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Apellidos</p>
                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ estudianteData.ApellInfPer }} {{ estudianteData.ApellMatInfPer }}</p>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Correo Institucional</p>
                            <p class="text-sm font-medium text-gray-800 dark:text-white break-all">{{ estudianteData.mailInst }}</p>
                        </div>
                        <div>
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nivel Actual</p>
                            <p class="text-sm font-medium text-gray-800 dark:text-white">Nivel {{ formatNivel(estudianteData.nivel) }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Facultad</p>
                            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ estudianteData.siglasFacultad }}</p>
                        </div>
                    </div>
                </div>

                <!-- HIKCENTRAL & FOTOS -->
                <div class="bg-white dark:bg-gray-900 flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div class="p-6 flex-1">
                        <div class="flex justify-between items-start mb-5">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Validación Biométrica</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Comparación facial con HikCentral.</p>
                            </div>
                            <!-- Status Badge -->
                            <span v-if="cargandoStatus" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold animate-pulse">
                                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Verificando...
                            </span>
                            <span v-else :class="estaRegistrado ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'" class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                                {{ estaRegistrado ? 'Registrado' : 'No Registrado' }}
                            </span>
                        </div>

                        <!-- Comparativa de Fotos -->
                        <div class="flex items-center justify-center gap-4 mb-4 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
                            <div class="relative group">
                                <img :src="getPhotoUrl(estudianteData.CIInfPer)" @error="handleImageError" class="h-32 w-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
                                <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md">SIAD</div>
                            </div>
                            
                            <div class="flex flex-col items-center justify-center w-12 shrink-0">
                                <svg class="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                            </div>

                            <div class="relative group">
                                <img :src="getPhotoUrl2(estudianteData.CIInfPer)" @error="handleImageError" class="h-32 w-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
                                <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-md">HIKCENTRAL</div>
                            </div>
                        </div>

                        <!-- Resultado Similitud -->
                        <div class="text-center">
                            <p v-if="comparando" class="text-sm text-brand-600 dark:text-brand-400 font-medium animate-pulse">Calculando similitud facial...</p>
                            <div v-else-if="comparacionResultado" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" :class="comparacionResultado.identicas ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'">
                                <svg v-if="comparacionResultado.identicas" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                                <span class="text-sm font-bold">Similitud: {{ comparacionResultado.similitud }}% ({{ comparacionResultado.identicas ? 'Coincide' : 'Requiere Actualización' }})</span>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de Acción HIK -->
                    <div class="bg-gray-50/80 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl">
                        <button v-if="!estaRegistrado && !cargandoStatus" :disabled="cargando" @click="registrarEnHikCentral(estudianteData.CIInfPer)" class="w-full flex justify-center items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 shadow-sm transition-all disabled:opacity-50">
                            Enviar Foto a HikCentral
                        </button>
                        <button v-else-if="estaRegistrado && comparacionResultado && !comparacionResultado.identicas" :disabled="cargando" @click="UpdateEnHikCentral(estudianteData.CIInfPer)" class="w-full flex justify-center items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 shadow-sm transition-all disabled:opacity-50">
                            Actualizar Foto en HikCentral
                        </button>
                        <div v-else-if="estaRegistrado && comparacionResultado && comparacionResultado.identicas" class="w-full flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Información Sincronizada
                        </div>
                    </div>
                </div>
            </div>

            <!-- GESTIÓN DE ACCESO AL GIMNASIO -->
            <div v-if="estaRegistrado" class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Gestión de Acceso Especial</h3>
                <div class="flex flex-col sm:flex-row items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
                    <div class="flex items-center gap-4 w-full sm:w-auto">
                        <div :class="tieneAccesoGym ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'" class="p-3.5 rounded-xl shrink-0 transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M5 6v12m14-12v12M8 8v8m8-8v8"/></svg>
                        </div>
                        <div>
                            <h4 class="text-base font-bold text-gray-900 dark:text-white">Gimnasio Institucional</h4>
                            <p class="text-sm mt-0.5" :class="tieneAccesoGym ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-gray-500 dark:text-gray-400'">
                                {{ tieneAccesoGym ? 'Acceso activo para el periodo actual.' : 'El estudiante no posee acceso habilitado.' }}
                            </p>
                        </div>
                    </div>
                    <button v-if="!tieneAccesoGym" @click="agregarAccesoGym" :disabled="cargandoAccesoGym" class="w-full sm:w-auto px-6 py-2.5 bg-gray-900 dark:bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-brand-500 transition-all shadow-sm disabled:opacity-50">
                        Habilitar Acceso
                    </button>
                    <button v-else @click="quitarAccesoGym" :disabled="cargandoAccesoGym" class="w-full sm:w-auto px-6 py-2.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50">
                        Revocar Acceso
                    </button>
                </div>
            </div>

            <!-- HISTORIAL DE ACCESOS -->
            <div v-if="estaRegistrado" class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-5">Historial de Accesos al Gimnasio</h3>
                
                <!-- Filtros -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Periodo Rápido</label>
                        <select v-model="filtroSeleccionado" @change="aplicarFiltroFecha" :disabled="cargandoEventos" class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white/90">
                            <option value="custom">Personalizado</option>
                            <option value="hoy">Hoy</option>
                            <option value="ayer">Ayer</option>
                            <option value="esta_semana">Esta semana</option>
                            <option value="mes_actual">Mes actual</option>
                            <option value="mes_anterior">Mes anterior</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Inicio</label>
                        <input type="date" v-model="fechaInicio" @change="filtroSeleccionado = 'custom'" :disabled="cargandoEventos" class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white/90" />
                    </div>
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fin</label>
                        <input type="date" v-model="fechaFin" @change="filtroSeleccionado = 'custom'" :disabled="cargandoEventos" class="w-full h-10 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white/90" />
                    </div>
                    <div class="flex items-end">
                        <button @click="obtenerEventosPuerta" :disabled="cargandoEventos" class="w-full h-10 flex items-center justify-center gap-2 bg-gray-900 dark:bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50">
                            <svg v-if="cargandoEventos" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>{{ cargandoEventos ? 'Buscando...' : 'Consultar' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Lista de Registros -->
                <div v-if="cargandoEventos" class="py-12 flex flex-col items-center justify-center text-gray-400">
                    <svg class="animate-spin h-8 w-8 text-brand-500 mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span class="text-sm font-medium">Recuperando marcaciones...</span>
                </div>
                <div v-else-if="!visitasProcesadas.length" class="py-10 text-center bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">No se encontraron accesos en las fechas seleccionadas.</p>
                </div>
                <div v-else class="space-y-3">
                    <div v-for="(visita, index) in visitasProcesadas" :key="index" class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
                        
                        <!-- Fecha y Estado -->
                        <div class="w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 pb-3 md:pb-0 md:pr-4">
                            <span :class="{
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': visita.estado === 'Completado' || visita.estado === 'En gimnasio',
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': visita.estado === 'Bloqueado (Anti-passback)',
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': visita.estado === 'Alerta: Doble Entrada'
                            }" class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                                {{ visita.estado }}
                            </span>
                            <p class="text-sm font-bold text-gray-800 dark:text-white">{{ visita.fecha }}</p>
                        </div>

                        <!-- Grid Entrada/Salida -->
                        <div class="flex-1 w-full grid grid-cols-2 gap-4">
                            <!-- Entrada -->
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                    <img v-if="visita.entrada?.foto" :src="getPhotoUrl23(visita.entrada.foto)" @error="$event.target.style.display='none'" class="w-full h-full object-cover" />
                                    <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entrada</p>
                                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ visita.entrada ? visita.entrada.hora : '--:--' }}</p>
                                </div>
                            </div>
                            <!-- Salida -->
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                    <img v-if="visita.salida?.foto" :src="getPhotoUrl23(visita.salida.foto)" @error="$event.target.style.display='none'" class="w-full h-full object-cover" />
                                    <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Salida</p>
                                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ visita.salida ? visita.salida.hora : '--:--' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!estudianteData" class="mt-6">
            <div v-if="cargando" class="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <div class="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-full mb-4">
                    <svg class="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">Consultando expediente</h4>
                <p class="text-sm text-gray-500 mt-1">Conectando con el sistema SIAD...</p>
            </div>

            <div v-else-if="errorValidacion" class="p-5 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 flex gap-4 items-start shadow-sm">
                <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div>
                    <h5 class="text-sm font-bold text-red-800 dark:text-red-400">Formato Inválido</h5>
                    <p class="text-sm text-red-700 dark:text-red-300 mt-1 opacity-90">{{ errorValidacionTexto }}</p>
                </div>
            </div>

            <div v-else-if="!estencontrado && searchQuery !== ''" class="p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 flex gap-4 items-start shadow-sm">
                <div class="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <h5 class="text-sm font-bold text-amber-800 dark:text-amber-400">Estudiante no localizado</h5>
                    <p class="text-sm text-amber-700 dark:text-amber-300 mt-1 mb-2 opacity-90">No se encontraron registros coincidentes. Verifica lo siguiente:</p>
                    <ul class="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1 opacity-80 pl-1">
                        <li>Cédula digitada correctamente.</li>
                        <li>Matrícula legal vigente en el periodo seleccionado.</li>
                        <li>Fotografía activa registrada en el SIAD.</li>
                        <li>Tiempo de graduación (no mayor a 1 año).</li>
                    </ul>
                </div>
            </div>

            <div v-else
                class="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/50 text-green-800 dark:text-green-400">
                <div class="flex gap-3 items-start">
                    <span class="text-lg">💡</span>
                    <div>
                        <h5 class="text-sm font-bold">Módulo de sincronización biométrica</h5>
                        <p class="text-xs mt-1 leading-relaxed opacity-90">
                            Ingrese la cédula de un estudiante para cargar sus datos desde el SIAD, realizar la
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
            periodosList: [],        // Para guardar los 2 periodos del backend
            periodoSeleccionado: null,
            comparacionResultado: null,
            personIdHC: null,
            errorValidacion: false,
            errorValidacionTexto: "",
            tieneAccesoGym: false,
            cargandoAccesoGym: false,
            eventosPuerta: [],
            cargandoEventos: false,
            filtroSeleccionado: 'hoy',
            fechaInicio: '',
            fechaFin: '',
            visitasProcesadas: []
        };
    },
    watch: {
        periodoSeleccionado(nuevoPeriodo, antiguoPeriodo) {
            // Evitamos que se ejecute en el primer montado cuando el antiguo es null
            if (antiguoPeriodo !== null && nuevoPeriodo !== antiguoPeriodo) {
                
                // 1. Limpiamos por completo estados, alertas y resultados anteriores
                this.estudianteData = null;
                this.comparacionResultado = null;
                this.estaRegistrado = false;
                this.personIdHC = null;
                this.errorValidacion = false;
                this.errorValidacionTexto = "";
                
                // 2. Comportamiento inteligente de búsqueda adaptativa
                if (this.searchQuery && this.searchQuery.trim() !== "") {
                    // Si ya tenía algo escrito, dispara la nueva consulta automáticamente
                    this.buscarEstudiante();
                } else {
                    // Si el buscador estaba vacío, resetea la alerta de "No localizado" para volver al estado inicial limpio
                    this.estencontrado = true;
                }
            }
        }
    },
    mounted() {
        this.cargarPeriodos();
        //this.obtenerNivelesdeAcceso();
    },
    methods: {
        async verificarAccesoGym() {
            if (!this.personIdHC) {
                this.tieneAccesoGym = false;
                return;
            }

            this.cargandoAccesoGym = true;
            this.tieneAccesoGym = false;

            const maxPages = 16;
            const pageSize = 500;

            try {
                for (let page = 1; page <= maxPages; page++) {
                    const response = await API.get(`${this.baseUrl}/get-access-person`, {
                        params: { pageNo: page }
                    });

                    const listaPersonas = response.data?.data?.list || response.data?.list || [];

                    // 1. Validar si la persona está en la página actual
                    const encontrado = listaPersonas.some(
                        item => String(item.id) === String(this.personIdHC)
                    );

                    if (encontrado) {
                        this.tieneAccesoGym = true;
                        break; // Se encontró la persona, detiene la búsqueda inmediatamente
                    }

                    // 2. Si la cantidad devuelta es menor al pageSize (500), ya no hay más páginas que consultar
                    if (listaPersonas.length < pageSize) {
                        break;
                    }
                }
            } catch (error) {
                console.error("❌ Error al verificar nivel de acceso Gimnasio:", error);
                this.tieneAccesoGym = false;
            } finally {
                this.cargandoAccesoGym = false;
            }
        },
        formatNivel(nivel) {
            const n = parseInt(nivel);
            if (isNaN(n)) return nivel;
            switch (n) {
                case 1: return '1er Ciclo';
                case 2: return '2do Ciclo';
                case 3: return '3er Ciclo';
                case 4: return '4to Ciclo';
                case 5: return '5to Ciclo';
                case 6: return '6to Ciclo';
                case 7: return '7mo Ciclo';
                case 8: return '8vo Ciclo';
                case 9: return '9no Ciclo';
                case 10: return '10mo Ciclo';
                case 'Egresado': return 'Egresado';
                case 'Graduado': return 'Graduado';
                default: return `${n}vo`;
            }
        },
        onlyNumbers(event) {
            const charCode = event.charCode ? event.charCode : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        onInputValidador(event) {
            // 1. Elimina cualquier caracter que no sea un número usando una expresión regular
            let valorLimpio = event.target.value.replace(/\D/g, '');
            
            // 2. Asegura que no pase de 10 dígitos (por si el pegado ignora el maxlength de alguna forma)
            if (valorLimpio.length > 10) {
                valorLimpio = valorLimpio.substring(0, 10);
            }

            // 3. Actualiza el valor visual del input y la variable v-model
            this.searchQuery = valorLimpio;
            event.target.value = valorLimpio;

            // 4. Llama a tu función original de debounce
            if (typeof this.debouncedFilter === 'function') {
                this.debouncedFilter();
            }
        },
        // 🆕 Genera la URL para cargar la foto directamente como imagen binaria
        getPhotoUrl(ci) {
            const baseURL2 = API.defaults.baseURL;
            return `${baseURL2}/biometrico/fotografia/${ci}?t=${new Date().getTime()}`;
        },
        getPhotoUrl2(ci) {
            const baseURL2 = API.defaults.baseURL;
            // Añadimos un timestamp para evitar que el navegador use la versión cacheada
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
            if (!this.estudianteData || !this.personIdHC) return;
            this.cargandoEventos = true;

            if (!this.fechaInicio) this.aplicarFiltroFecha();

            try {
                const payload = {
                    personCode: this.estudianteData.CIInfPer,
                    personID: this.personIdHC,
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
        // 1. Cargar los 2 periodos (activo y anterior)
        async cargarPeriodos() {
            try {
                const response = await API.get(`${this.baseUrl}/get-periodos-rec`);
                if (response.data.status) {
                    this.periodosList = response.data.data;
                    // Seleccionar automáticamente el primero (el activo)
                    if (this.periodosList.length > 0) {
                        this.periodoSeleccionado = this.periodosList[0].idper;
                    }
                }
            } catch (error) {
                console.error("Error al cargar periodos:", error);
            }
        },
        /*async obtenerNivelesdeAcceso() {
            try {
                const response = await API.get(`${this.baseUrl}/get-access-levels`);
                const response2 = await API.get(`${this.baseUrl}/get-access-person`);
                //console.log("✅ Niveles de acceso obtenidos:", response);
                //console.log("✅ Personas con acceso obtenidas:", response2);
            } catch (error) {
                console.error("❌ Error al obtener niveles de acceso:", error);
            }
        },*/
        async buscarEstudiante() {
            //if (this.searchQuery.length < 10) return;
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

            if (!this.periodoSeleccionado) {
                this.errorValidacion = true;
                this.errorValidacionTexto = "Atención: Debe seleccionar obligatoriamente un periodo lectivo antes de ejecutar la consulta.";
                return;
            }

            this.cargando = true;
            this.estudianteData = null;
            this.comparacionResultado = null;
            this.visitasProcesadas = [];

            try {
                // Enviamos el periodoSeleccionado como query parameter o en la URL
                // Ejemplo usando query param: ?periodo=126
                const response = await API.get(`/biometrico/getindivEst/${this.searchQuery}`, {
                    params: { idper: this.periodoSeleccionado }
                });

                if (!response.data || response.data.length === 0) {
                    this.estencontrado = false;
                } else {
                    this.estencontrado = true;
                    this.estudianteData = response.data;
                    await this.verificarRegistroHC(this.estudianteData.CIInfPer);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.estudianteData.CIInfPer);
                        await this.verificarAccesoGym();
                        await this.obtenerEventosPuerta();
                    }else {
                        this.tieneAccesoGym = false;
                        this.visitasProcesadas = [];
                    }
                }
            } catch (error) {
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
                const response = await API.get(`${this.baseUrl}/getperson-est/${ci}`);
                
                this.personIdHC = response.data.personId;
                //console.log(this.personIdHC);
                this.estaRegistrado = response.data.registrado;

            } catch (error) {
                this.estaRegistrado = false;
            } finally {
                this.cargandoStatus = false;
            }
        },
        async agregarAccesoGym() {
            if (!this.personIdHC) return;

            const result = await Swal.fire({
                title: '¿Asignar acceso al Gimnasio?',
                text: "Se otorgará el nivel de acceso en HikCentral.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6', // Color tipo brand
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Asignando nivel de acceso...',
                        allowOutsideClick: false,
                        didOpen: () => { Swal.showLoading(); }
                    });

                    const response = await API.post(`${this.baseUrl}/add_level_access_gym`, {
                        personID: this.personIdHC
                    });

                    if (response.data && response.data.code == "0") {
                        this.tieneAccesoGym = true; // Actualiza reactivamente la interfaz
                        Swal.fire({
                            title: '¡Acceso Otorgado!',
                            text: 'El estudiante ahora tiene acceso al gimnasio.',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    } else {
                        Swal.fire('Error', response.data.msg || 'No se pudo asignar el nivel.', 'error');
                    }
                } catch (error) {
                    console.error("Error al asignar acceso:", error);
                    Swal.fire('Error', 'Ocurrió un error en la comunicación con el servidor.', 'error');
                }
            }
        },

        async quitarAccesoGym() {
            if (!this.personIdHC) return;

            const result = await Swal.fire({
                title: '¿Remover acceso al Gimnasio?',
                text: "El estudiante perderá el acceso a esta área en HikCentral.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444', // Rojo para peligro
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, quitar acceso',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Removiendo nivel de acceso...',
                        allowOutsideClick: false,
                        didOpen: () => { Swal.showLoading(); }
                    });

                    const response = await API.post(`${this.baseUrl}/remove_level_access_gym`, {
                        personID: this.personIdHC
                    });

                    if (response.data && response.data.code == "0") {
                        this.tieneAccesoGym = false; // Actualiza reactivamente la interfaz
                        Swal.fire({
                            title: '¡Acceso Removido!',
                            text: 'Se ha quitado el acceso al gimnasio correctamente.',
                            icon: 'success',
                            confirmButtonColor: '#10b981'
                        });
                    } else {
                        Swal.fire('Error', response.data.msg || 'No se pudo remover el nivel.', 'error');
                    }
                } catch (error) {
                    console.error("Error al remover acceso:", error);
                    Swal.fire('Error', 'Ocurrió un error en la comunicación con el servidor.', 'error');
                }
            }
        },
        async ejecutarComparacion(ci) {
            this.comparando = true;
            try {

                const { data } = await API.get(`${this.baseUrl}/compare-hikdoc-est/${ci}`);
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
            const confirmacion = await Swal.fire({
                title: '¿Confirmar Registro?',
                text: `¿Deseas registrar a ${this.estudianteData?.NombInfPer || post} en HikCentral?`,
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
                const response = await API.post(`${this.baseUrl}/sync-hikdoc-est-id/${post}`, {}, {
                    params: { idper: this.periodoSeleccionado }
                });
                Swal.close();
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    mostraralertas2(`Registrado con éxito. ID en HC: ${response.data.data}`, "success");

                    // Actualizar el estado en la tabla localmente sin recargar
                    await this.verificarRegistroHC(this.estudianteData.CIInfPer);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.estudianteData.CIInfPer);
                    }
                } else if (response.data.code === "131") {
                    console.warn("Usuario ya registrado en HikCentral.");
                    mostraralertas2(`Usuario ya registrado en HikCentral.`, "warning");
                    this.estaRegistrado = true;
                    this.searchQuery = '';
                    this.estencontrado = true;
                } else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.estudianteData.CIInfPer + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.estudianteData.CIInfPer} no es compatible con HikCentral.`, "error");
                    this.searchQuery = '';
                    this.estencontrado = false;
                    this.estaRegistrado = false;
                }
                else {
                    mostraralertas2(`Respuesta del servidor: ${response.data.msg}`, "warning");
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
        async UpdateEnHikCentral(post) {
            // Confirmación simple
            if (!this.personIdHC) {
                mostraralertas2("No se puede actualizar: No se encontró el PersonId de HikCentral. Verifique el estado primero.", "error");
                return;
            }
            const confirmacion = await Swal.fire({
                title: '¿Actualizar Fotografía?',
                text: `¿Deseas reemplazar la foto actual de ${this.estudianteData?.NombInfPer || post} en HikCentral?`,
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
                const response = await API.post(`${this.baseUrl}/sync-hikdoc-update/${post}`, {
                    personaId: this.personIdHC // <--- Enviamos el UUID en el body
                }, {
                    params: { idper: this.periodoSeleccionado }
                });
                Swal.close();
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    mostraralertas2(`Actualizado con éxito. ID en HC: ${response.data.data}`, "success");

                    // Actualizar el estado en la tabla localmente sin recargar
                    await this.verificarRegistroHC(this.estudianteData.CIInfPer);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.estudianteData.CIInfPer);
                    }
                } else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.estudianteData.CIInfPer + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.estudianteData.CIInfPer} no es compatible con HikCentral.`, "error");
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
