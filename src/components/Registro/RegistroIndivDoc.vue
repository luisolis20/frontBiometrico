<template>
    <div>
        <!-- Buscador -->
        <form class="flex-grow">
            <div class="relative group">
                <button type="submit" :disabled="cargando"
                    class="absolute -translate-y-1/2 left-4 top-1/2 transition-opacity disabled:opacity-50">
                    <svg v-if="cargando" class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="fill-gray-400 group-focus-within:fill-brand-500 transition-colors" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                    </svg>
                </button>
                <input type="text" placeholder="Ingresa la cédula a buscar..." v-model="searchQuery" 
                    :disabled="cargando" @input="onInputValidador" @keypress="onlyNumbers" @keyup.enter="buscarDocente" maxlength="10"  
                    class="h-12 w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white/90 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed xl:w-[480px]" />
            </div>
        </form>
        <br>
        <!-- Resultados del Docente -->
        <div v-if="docenteData && estencontrado && !cargando" class="space-y-6">
            
            <!-- Tarjeta Perfil Principal -->
            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div class="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-800 shadow-md">
                    <img :src="getPhotoUrl(docenteData.CIInfPer)" class="w-full h-full object-cover" alt="Perfil" />
                </div>
                <div class="text-center md:text-left">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                        {{ docenteData.NombInfPer }} {{ docenteData.ApellInfPer }} {{ docenteData.ApellMatInfPer }}
                    </h3>
                    <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-medium font-mono bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">
                            {{ docenteData.CIInfPer }}
                        </span>
                        <span class="hidden md:inline-block h-4 w-px bg-gray-300 dark:bg-gray-700"></span>
                        <span class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                            <span v-if="docenteData.TipoInfPer === 'D'">Docente</span>
                            <span v-else-if="docenteData.TipoInfPer === 'A'">Administrativo</span>
                            <span v-else-if="docenteData.TipoInfPer === 'T'">Trabajador</span>
                            <span v-else-if="docenteData.TipoInfPer === 'TDO'">Técnico Docente</span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Información Personal SIAD -->
                <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full">
                    <div class="mb-5">
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white">Información SIAD</h4>
                        <p class="text-xs text-gray-500 mt-1.5 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
                            <strong class="font-semibold">Nota:</strong> Datos oficiales de SIAD. Verifica y sincroniza para enviar al reconocimiento facial.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 flex-grow">
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Nombres</span>
                            <p class="mt-1 font-medium text-gray-900 dark:text-gray-100">{{ docenteData.NombInfPer }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Apellidos</span>
                            <p class="mt-1 font-medium text-gray-900 dark:text-gray-100">{{ docenteData.ApellInfPer }} {{ docenteData.ApellMatInfPer }}</p>
                        </div>
                        <div class="sm:col-span-2">
                            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Correo Institucional</span>
                            <p class="mt-1 font-medium text-gray-900 dark:text-gray-100 break-all">{{ docenteData.mailInst }}</p>
                        </div>
                    </div>
                </div>

                <!-- Información HikCentral & Sincronización -->
                <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full">
                    <div class="mb-5 flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-bold text-gray-900 dark:text-white">Validación HikCentral</h4>
                            <div class="mt-2">
                                <span v-if="cargandoStatus" class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                                    Verificando...
                                </span>
                                <span v-else :class="estaRegistrado ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'" class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                    {{ estaRegistrado ? 'Registrado en HC' : 'No Registrado en HC' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Comparador de Fotos -->
                    <div class="flex flex-wrap gap-6 justify-center mt-2 mb-6">
                        <div class="relative group">
                            <img :src="getPhotoUrl(docenteData.CIInfPer)" @error="handleImageError"
                                class="h-32 w-32 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105" />
                            <span class="absolute -top-2.5 -right-2.5 bg-brand-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md border-2 border-white dark:border-gray-900">SIAD</span>
                        </div>
                        
                        <div class="flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>

                        <div class="relative group">
                            <img :src="getPhotoUrl2(docenteData.CIInfPer)" @error="handleImageError"
                                class="h-32 w-32 object-cover rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105" />
                            <span class="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md border-2 border-white dark:border-gray-900">HIK</span>
                        </div>
                    </div>

                    <!-- Estado de Similitud -->
                    <div v-if="comparando" class="text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse text-center mb-4">
                        Calculando similitud facial...
                    </div>
                    <div v-if="comparacionResultado && !comparando" class="text-center mb-4">
                        <span :class="comparacionResultado.identicas ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'"
                            class="px-3 py-1.5 rounded-lg text-sm font-bold inline-block">
                            Similitud: {{ comparacionResultado.similitud }}% 
                            <span class="font-medium opacity-80">({{ comparacionResultado.identicas ? 'Coincide' : 'No coincide' }})</span>
                        </span>
                    </div>

                    <!-- Botones de Acción -->
                    <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button v-if="!estaRegistrado && !cargandoStatus" type="button" :disabled="cargando"
                            @click="registrarEnHikCentral(docenteData.CIInfPer)"
                            class="w-full flex justify-center items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 shadow-md transition-all disabled:opacity-50">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Sincronizar hacia HikCentral
                        </button>
                        <button v-else-if="estaRegistrado && comparacionResultado && !comparacionResultado.identicas"
                            type="button" :disabled="cargando" @click="UpdateEnHikCentral(docenteData.CIInfPer)"
                            class="w-full flex justify-center items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 shadow-md transition-all disabled:opacity-50">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Actualizar Foto (Baja Similitud)
                        </button>
                        <div v-else-if="estaRegistrado && comparacionResultado && comparacionResultado.identicas"
                            class="w-full flex justify-center items-center gap-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 py-3 rounded-xl font-medium text-sm border border-green-200 dark:border-green-800/30">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Información 100% Sincronizada
                        </div>
                    </div>
                </div>
            </div>

            <!-- Registro de Accesos -->
            <div v-if="estaRegistrado" class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white">Registro de Accesos GYM</h4>
                    
                    <!-- Filtros -->
                    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <select v-model="filtroSeleccionado" @change="aplicarFiltroFecha" :disabled="cargandoEventos"
                            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <option value="custom">Personalizado</option>
                            <option value="hoy">Hoy</option>
                            <option value="ayer">Ayer</option>
                            <option value="esta_semana">Esta semana</option>
                            <option value="mes_actual">Mes actual</option>
                            <option value="mes_anterior">Mes anterior</option>
                        </select>
                        <input type="date" v-model="fechaInicio" @change="filtroSeleccionado = 'custom'" :disabled="cargandoEventos"
                            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" />
                        <span class="text-gray-400">-</span>
                        <input type="date" v-model="fechaFin" @change="filtroSeleccionado = 'custom'" :disabled="cargandoEventos"
                            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" />
                        
                        <button @click="obtenerEventosPuerta" :disabled="cargandoEventos"
                            class="h-10 px-4 rounded-lg flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
                            <svg v-if="cargandoEventos" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                            <span>{{ cargandoEventos ? 'Buscando...' : 'Filtrar' }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="cargandoEventos" class="py-12 text-center">
                    <svg class="animate-spin h-8 w-8 text-brand-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                    <p class="text-sm text-gray-500">Consultando marcaciones...</p>
                </div>
                
                <div v-else-if="!visitasProcesadas.length" class="py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <span class="text-3xl mb-2 block">📭</span>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">No se registran accesos en este periodo.</p>
                </div>

                <!-- Lista de Accesos -->
                <div v-else class="space-y-4">
                    <div v-for="(visita, index) in visitasProcesadas" :key="index"
                        class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        
                        <!-- Estado -->
                        <div class="md:col-span-4 lg:col-span-3">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-2 h-2 rounded-full" :class="{'bg-green-500': visita.estado === 'Completado' || visita.estado === 'En gimnasio', 'bg-red-500': visita.estado === 'Bloqueado (Anti-passback)', 'bg-yellow-500': visita.estado === 'Alerta: Doble Entrada'}"></div>
                                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ visita.estado }}</span>
                            </div>
                            <p class="text-xs text-gray-500 font-medium pl-4">{{ visita.fecha }}</p>
                        </div>

                        <!-- Marcaciones (Entrada / Salida) -->
                        <div class="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Entrada -->
                            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                <img v-if="visita.entrada?.foto" :src="getPhotoUrl23(visita.entrada.foto)" @error="$event.target.style.display = 'none'" class="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marcación Entrada</p>
                                    <p class="text-base font-bold text-gray-900 dark:text-white">{{ visita.entrada ? visita.entrada.hora : '--:--' }}</p>
                                </div>
                            </div>
                            <!-- Salida -->
                            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800" :class="!visita.salida ? 'opacity-60' : ''">
                                <img v-if="visita.salida?.foto" :src="getPhotoUrl23(visita.salida.foto)" @error="$event.target.style.display = 'none'" class="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marcación Salida</p>
                                    <p class="text-base font-bold text-gray-900 dark:text-white">{{ visita.salida ? visita.salida.hora : '--:--' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estados de Respuesta Globales (Alertas) -->
        <div v-if="!docenteData" class="mt-8">
            <div v-if="cargando" class="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-brand-200 bg-brand-50/50 dark:border-brand-900/30 dark:bg-brand-900/10 rounded-2xl">
                <svg class="animate-spin h-10 w-10 text-brand-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Buscando expediente en el SIAD...</h3>
                <p class="text-sm text-gray-500 text-center">Conectando con la base de datos institucional, por favor espera.</p>
            </div>

            <div v-else-if="errorValidacion" class="p-5 rounded-xl bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 flex gap-4 items-start shadow-sm">
                <div class="text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded-full shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <div>
                    <h5 class="text-base font-bold text-red-800 dark:text-red-400">Formato de Identificación Inválido</h5>
                    <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ errorValidacionTexto }}</p>
                </div>
            </div>

            <div v-else-if="!estencontrado" class="p-5 rounded-xl bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30 flex gap-4 items-start shadow-sm">
                <div class="text-amber-500 bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h5 class="text-base font-bold text-amber-800 dark:text-amber-400">Personal no localizado u omitido</h5>
                    <p class="text-sm text-amber-700 dark:text-amber-300 mt-1 mb-3">No se ha encontrado ningún registro que coincida. Por favor, verifica:</p>
                    <ul class="list-disc list-inside text-sm text-amber-700/80 dark:text-amber-300/80 space-y-1.5 ml-1">
                        <li>Que el número de cédula esté escrito correctamente.</li>
                        <li>Que el personal se encuentre <strong>habilitado</strong> en el sistema.</li>
                        <li>Que disponga de una <strong>fotografía activa</strong> cargada en el SIAD.</li>
                    </ul>
                </div>
            </div>

            <div v-else class="p-6 rounded-2xl bg-green-to-r from-green-50 to-green-50 border border-green-100 dark:from-green-900/10 dark:to-green-900/10 dark:border-green-900/30 text-center shadow-sm">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-green-900 dark:text-green-300 mb-2">Módulo de Sincronización Biométrica</h3>
                <p class="text-sm text-green-700/80 dark:text-green-400/80 max-w-xl mx-auto leading-relaxed">
                    Ingresa la cédula en la parte superior para consultar el expediente en el SIAD, comparar la similitud facial y mantener sincronizado el acceso en HikCentral.
                </p>
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
