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
                    @input="debouncedFilter" @keypress="onlyNumbers" @keyup.enter="buscarInvitado" :disabled="cargando"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]" />
            </div>
            <p v-if="errorValidacion" class="text-red-500 text-xs mt-1">{{ errorValidacionTexto }}</p>
        </form>
        <br>
        <!-- RESULTADOS DE BÚSQUEDA (CUANDO YA EXISTE EN BD) -->
        <div v-if="estencontrado && personaData && !mostrarWizard" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            
            <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img :src="getPhotoUrlInvitado(personaData.cedula, personaData.foto)" @error="handleImageError" alt="user" />
                        </div>
                        <div class="order-3 xl:order-2">
                            <h4
                                class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {{ personaData.nombres + " " + personaData.apellidos }}
                            </h4>
                            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ personaData.cedula }}</p>
                                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                               <button @click="abrirWizardEdicion(invitado)" class="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    Editar Invitado
                                </button>
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
                            Nota: Los datos obtenidos aquí son los que el invitado tiene registrados en el SIAD. Luego
                            que
                            verifiques la información debes dar clic en "Sincronizar HK"
                            para que estos datos se envíen al sistema de reconocimiento facial.
                        </p>
                        <br>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombres</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ personaData.nombres }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ personaData.apellidos }}</p>
                            </div>

                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Correo
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ personaData.correo }}
                                </p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Sexo</p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {{ formatSexo(personaData.genero) }}
                                </p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Departamento asignado en Hikcentral
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    <span v-if="cargandoDepartamento" class="text-xs text-gray-400 animate-pulse">Obteniendo departamento...</span>
                                    <span v-else>{{ nombreDepartamento || personaData.codigo_departamento || 'Sin asignar' }}</span>
                                </p>
                            </div>
                            <div>
                                <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Vigencia en el acceso facial
                                </p>
                                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                                    Desde: {{ personaData.begin_time }} hasta: {{ personaData.end_time }}
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div v-if="personaData.evidencia || personaData.documento || personaData.archivo" 
                class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Documento de Respaldo / Evidencia (PDF)
                </h4>
                <div class="w-full h-[550px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-900">
                    <iframe 
                        :src="getPdfUrlInvitado(personaData.cedula, personaData.evidencia)" 
                        class="w-full h-full border-0"
                        type="application/pdf">
                    </iframe>
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
                                    <img :src="getPhotoUrlInvitado(personaData.cedula, personaData.foto)" @error="handleImageError"
                                        class="h-32 w-48 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-md"
                                        />
                                    <span
                                        class="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">SIAD</span>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div class="relative">
                                    <img :src="getPhotoUrHIk(personaData.cedula)"
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
                        @click="registrarEnHikCentral(personaData.cedula)"
                        class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto shadow-lg transition-all disabled:opacity-50">
                        Enviar Foto a HIK
                    </button>
                    <button v-else-if="estaRegistrado && comparacionResultado && !comparacionResultado.identicas"
                        type="button" :disabled="cargando" @click="UpdateEnHikCentral(personaData.cedula)"
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
            </div>

        </div>
        <!-- WIZARD DE REGISTRO PASO A PASO -->
        <transition name="fade">
            <div v-if="mostrarWizard" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-4">
                
                <!-- Progreso del Wizard -->
                <div class="flex items-center justify-center mb-8">
                    <div class="flex items-center w-full max-w-2xl">
                        <div class="flex flex-col items-center relative z-10">
                            <div :class="pasoActual >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors">1</div>
                            <span class="text-xs mt-2 font-medium" :class="pasoActual >= 1 ? 'text-brand-600' : 'text-gray-500'">Datos Local</span>
                        </div>
                        <div class="flex-auto border-t-2 transition-colors" :class="pasoActual >= 2 ? 'border-brand-600' : 'border-gray-200'"></div>
                        <div class="flex flex-col items-center relative z-10">
                            <div :class="pasoActual >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors">2</div>
                            <span class="text-xs mt-2 font-medium" :class="pasoActual >= 2 ? 'text-brand-600' : 'text-gray-500'">HikCentral</span>
                        </div>
                        <div class="flex-auto border-t-2 transition-colors" :class="pasoActual >= 3 ? 'border-brand-600' : 'border-gray-200'"></div>
                        <div class="flex flex-col items-center relative z-10">
                            <div :class="pasoActual >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors">3</div>
                            <span class="text-xs mt-2 font-medium" :class="pasoActual >= 3 ? 'text-green-500' : 'text-gray-500'">Completado</span>
                        </div>
                    </div>
                </div>

                <!-- PASO 1: DATOS Y ARCHIVOS -->
                <div v-if="pasoActual === 1">
                    <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">Registro de Nuevo Invitado</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Cédula -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Cédula</label>
                            <input type="text" v-model="formWizard.cedula" disabled class="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 rounded-lg p-2 text-sm cursor-not-allowed"/>
                        </div>
                        <!-- Nombres -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Nombres *</label>
                            <input type="text" v-model="formWizard.nombres" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600" placeholder="Ej. Juan Carlos"/>
                        </div>
                        <!-- Apellidos -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Apellidos *</label>
                            <input type="text" v-model="formWizard.apellidos" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600" placeholder="Ej. Pérez Silva"/>
                        </div>
                        <!-- Género -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Género *</label>
                            <select v-model="formWizard.genero" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600">
                                <option :value="1">Masculino</option>
                                <option :value="2">Femenino</option>
                            </select>
                        </div>
                        <!-- Correo -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                            <input type="email" v-model="formWizard.correo" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600" placeholder="ejemplo@correo.com"/>
                        </div>
                        <!-- Código Departamento -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">
                                Departamento HC *
                            </label>
                            <div class="flex gap-2 items-center">
                                <!-- Selector Custom (Árbol) -->
                                <div class="relative flex-grow" id="dropdown-depto-container">
                                    <div @click="toggleDropdown" 
                                         class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm flex justify-between items-center cursor-pointer bg-white dark:bg-gray-900"
                                         :class="{'opacity-50 pointer-events-none': cargandoDepartamentos}">
                                        <span class="truncate pr-2 dark:text-gray-200">
                                            {{ cargandoDepartamentos ? 'Cargando...' : (nombreDeptoSeleccionado || 'Seleccione un departamento') }}
                                        </span>
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                    
                                    <!-- Menú Desplegable -->
                                    <div v-if="dropdownAbierto" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        <div v-if="departamentosJerarquicos.length === 0" class="p-3 text-sm text-gray-500 text-center">
                                            No hay departamentos disponibles
                                        </div>
                                        <div v-for="dep in departamentosJerarquicos" :key="dep.orgIndexCode" 
                                             class="flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                                             :class="{'bg-brand-50 dark:bg-brand-900/20': formWizard.codigo_departamento === dep.orgIndexCode}">
                                            
                                            <!-- Espaciado y Botón de Toggle -->
                                            <div class="flex items-center py-2" :style="{ paddingLeft: `${dep.nivel * 1.5 + 0.5}rem` }">
                                                <button v-if="dep.tieneHijos" @click.stop="toggleNodo(dep.orgIndexCode)" class="mr-2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-brand-600 bg-gray-100 dark:bg-gray-700 rounded">
                                                    <span v-if="nodosExpandidos.includes(dep.orgIndexCode)">-</span>
                                                    <span v-else>+</span>
                                                </button>
                                                <div v-else class="w-5 mr-2 inline-block"></div>
                                            </div>
                                            
                                            <!-- Nombre seleccionable -->
                                            <div @click="seleccionarDepartamento(dep)" class="flex-grow py-2 pr-3 cursor-pointer text-sm dark:text-gray-200">
                                                {{ dep.orgName }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Botón Agregar -->
                                <button type="button" @click="abrirModalCrearDepto" class="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm" title="Crear Departamento">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                </button>
                            </div>
                        </div>
                        <!-- Vigente Desde -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Vigente Desde *</label>
                            <input type="datetime-local" v-model="formWizard.begin_time" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600"/>
                        </div>
                        <!-- Vigente Hasta -->
                        <div>
                            <label class="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Vigente Hasta *</label>
                            <input type="datetime-local" v-model="formWizard.end_time" class="w-full border-gray-300 rounded-lg p-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600"/>
                        </div>
                    </div>

                    <!-- ZONA DE CARGA DE ARCHIVOS -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <!-- UPLOADER PDF -->
                        <div>
                            <label class="block text-[10px] font-bold mb-1 text-gray-700 dark:text-gray-300">Documento de respaldo (PDF)</label>
                            <div @click="$refs.filePdf.click()" class="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all" :class="archivoPdfName ? 'border-brand-500 bg-brand-50/20' : 'border-gray-300 hover:border-brand-400 bg-gray-50 dark:bg-gray-800/50'">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg v-if="!archivoPdfName" class="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <svg v-else class="w-8 h-8 mb-3 text-brand-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                                    <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-semibold" v-if="!archivoPdfName">Haga clic para cargar</span>
                                        <span class="font-semibold text-brand-600 text-center px-2 truncate w-full" v-else>{{ archivoPdfName }}</span>
                                    </p>
                                    <p class="text-xs text-gray-400" v-if="!archivoPdfName">PDF (Máx. 10MB)</p>
                                </div>
                                <input type="file" ref="filePdf" class="hidden" accept="application/pdf" @change="handlePdfChange" />
                            </div>
                        </div>

                        <!-- UPLOADER IMAGEN (FOTO) -->
                        <div>
                            <label class="block text-[10px] font-bold mb-1 text-gray-700 dark:text-gray-300">Fotografía del Invitado (Obligatorio para HC)</label>
                            <div @click="$refs.fileFoto.click()" class="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all" :class="archivoFotoName ? 'border-brand-500 bg-brand-50/20' : 'border-gray-300 hover:border-brand-400 bg-gray-50 dark:bg-gray-800/50'">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg v-if="!archivoFotoName" class="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <svg v-else class="w-8 h-8 mb-3 text-brand-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                                    <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-semibold" v-if="!archivoFotoName">Haga clic para cargar foto</span>
                                        <span class="font-semibold text-brand-600 text-center px-2 truncate w-full" v-else>{{ archivoFotoName }}</span>
                                    </p>
                                    <p class="text-xs text-gray-400" v-if="!archivoFotoName">JPG, PNG (Máx. 5MB)</p>
                                </div>
                                <input type="file" ref="fileFoto" class="hidden" accept="image/jpeg, image/png, image/webp" @change="handleFotoChange" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6 space-x-3">
                        <button @click="cerrarWizard" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                        <button @click="guardarPaso1" :disabled="uploading" class="flex items-center px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-all">
                            <span v-if="uploading" class="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Siguiente Paso
                        </button>
                    </div>
                </div>

                <!-- PASO 2: VERIFICACIÓN Y ENVÍO A HIKCENTRAL -->
                <div v-if="pasoActual === 2" class="text-center py-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">Registro Local Exitoso</h3>
                    <p class="text-gray-500 mb-6 text-sm">El invitado fue guardado en la base de datos local. Ahora procedemos a sincronizar la foto con HikCentral.</p>
                    
                    <div class="inline-block p-4 border border-gray-200 rounded-xl mb-6 shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-left">
                        <div class="flex items-center gap-4">
                            <img :src="getPhotoUrlInvitado(personaData.cedula, personaData.foto)" @error="handleImageError" class="w-20 h-20 rounded-xl object-cover border-2 border-brand-200 shadow-sm" />
                            <div>
                                <h4 class="font-bold text-gray-800 dark:text-white">{{ personaData.nombres }} {{ personaData.apellidos }}</h4>
                                <p class="text-xs text-gray-500">Cédula: {{ personaData.cedula }}</p>
                                <div class="mt-2 flex items-center gap-2 text-xs">
                                    <span v-if="cargandoStatus" class="text-gray-500 animate-pulse">Verificando estado HC...</span>
                                    <span v-else-if="!estaRegistrado" class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-semibold border border-yellow-200">Pendiente de Sincronización</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Selección de Nivel de Acceso -->
                   <div class="mb-6 text-left">
                        <h4 class="text-sm font-bold text-gray-800 dark:text-white mb-3">Nivel de Acceso (HikCentral) *
                        </h4>

                        <div v-if="loadingAccessLevels"
                            class="flex justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <span
                                class="inline-block w-6 h-6 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin"></span>
                            <span class="ml-3 text-sm text-gray-500">Cargando niveles de acceso...</span>
                        </div>

                        <div v-else-if="nivelesAccesoFiltrados.length === 0"
                            class="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                            No se encontraron niveles de acceso disponibles o todos están restringidos.
                        </div>

                        <!-- Tarjetas de selección única -->
                        <div v-else
                            class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                            <label v-for="nivel in nivelesAccesoFiltrados" :key="nivel.privilegeGroupId"
                                class="flex items-start p-3 border rounded-xl cursor-pointer transition-all duration-200 ease-in-out"
                                :class="formWizard.privilegeGroupId === nivel.privilegeGroupId
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'">
                                <div class="flex items-center h-5 mt-0.5">
                                    <input type="radio" v-model="formWizard.privilegeGroupId"
                                        :value="nivel.privilegeGroupId"
                                        class="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 bg-white">
                                </div>
                                <div class="ml-3 text-sm flex-grow">
                                    <span class="font-bold block"
                                        :class="formWizard.privilegeGroupId === nivel.privilegeGroupId ? 'text-brand-700 dark:text-brand-400' : 'text-gray-800 dark:text-gray-200'">
                                        {{ nivel.privilegeGroupName }}
                                    </span>
                                    <span v-if="nivel.description"
                                        class="text-xs text-gray-500 block mt-1 line-clamp-2">
                                        {{ nivel.description }}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-center space-x-4">
                        <button @click="cerrarWizard" class="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Dejar para más tarde</button>
                        <button @click="registrarEnHikCentralWizard" :disabled="cargando" class="flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-lg disabled:opacity-50 transition-all">
                            Sincronizar con HikCentral
                        </button>
                    </div>
                </div>

                <!-- PASO 3: COMPLETADO -->
                <div v-if="pasoActual === 3" class="text-center py-10">
                    <div class="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Todo Listo!</h3>
                    <p class="text-gray-500 text-sm mb-8">El invitado fue guardado localmente y sincronizado con HikCentral exitosamente.</p>
                    
                    <button @click="cerrarWizard" class="px-8 py-3 text-sm font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 shadow-lg transition-all">
                        Finalizar
                    </button>
                </div>
            </div>
        </transition>
        <!-- MODAL CREAR DEPARTAMENTO -->
        <div v-if="mostrarModalDepto" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 transform transition-all">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Nuevo Departamento</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tipo de Departamento</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer text-sm dark:text-gray-200">
                                <input type="radio" v-model="formDepto.esPrincipal" :value="true" class="text-brand-600 focus:ring-brand-500">
                                Principal (Nivel 1)
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer text-sm dark:text-gray-200">
                                <input type="radio" v-model="formDepto.esPrincipal" :value="false" class="text-brand-600 focus:ring-brand-500">
                                Subdepartamento
                            </label>
                        </div>
                    </div>

                    <div v-if="!formDepto.esPrincipal">
                        <label class="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Depende de (Departamento Padre) *</label>
                        <!-- Selector plano para el modal para evitar complejidad recursiva -->
                        <select v-model="formDepto.parentIndexCode" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                            <option value="" disabled>Seleccione departamento padre</option>
                            <option v-for="dep in departamentosPlanos" :key="dep.orgIndexCode" :value="dep.orgIndexCode">
                                {{ dep.prefijo }}{{ dep.orgName }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Nombre del Departamento *</label>
                        <input type="text" v-model="formDepto.orgName" placeholder="Ej. Ventas" class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-8">
                    <button @click="mostrarModalDepto = false" type="button" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Cancelar
                    </button>
                    <button @click="guardarNuevoDepartamento" :disabled="guardandoDepto" type="button" class="flex items-center px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow disabled:opacity-50">
                        <span v-if="guardandoDepto" class="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Crear en HikCentral
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "@/assets/js/services/axios";
import { useRoute } from "vue-router";
import debounce from 'lodash.debounce';
import Swal from 'sweetalert2';
import { mostraralertas2, enviarsolig, eliminacion, confimarhabi, elimnarpermanente } from '@/assets/js/function/funciones';
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
            errorValidacion: false,
            errorValidacionTexto: "",
            // Variables del Wizard
            mostrarWizard: false,
            pasoActual: 1,
            uploading: false,
            
            // Archivos Step 1
            archivoPdf: null,
            archivoPdfName: '',
            archivoFoto: null,
            archivoFotoName: '',
            departamentos: [],
            cargandoDepartamentos: false,
            dropdownAbierto: false,
            nodosExpandidos: [],
            mostrarModalDepto: false,
            guardandoDepto: false,
            formDepto: {
                esPrincipal: true,
                parentIndexCode: '',
                orgName: ''
            },
            // Formulario Step 1
            formWizard: {
                cedula: '',
                nombres: '',
                apellidos: '',
                genero: 1,
                correo: '',
                codigo_departamento: '',
                begin_time: '',
                end_time: '',
                estado: 1,
                privilegeGroupId: '',
            },
            accessLevels: [],
            loadingAccessLevels: false,
            nombreDepartamento: '',
            cargandoDepartamento: false,
        };
    },
    watch: {
        // Al detectar que personaData se carga o cambia, obtenemos el nombre del departamento
        'personaData.codigo_departamento': {
            immediate: true,
            handler(nuevoCodigo) {
                if (nuevoCodigo) {
                    this.obtenerNombreDepartamento(nuevoCodigo);
                }
            }
        }
    },
    computed: {
        nombreDeptoSeleccionado() {
            if (!this.formWizard.codigo_departamento) return '';
            const depto = this.departamentos.find(d => d.orgIndexCode === this.formWizard.codigo_departamento);
            return depto ? depto.orgName : '';
        },

        // --- LÓGICA DE FILTRADO Y ÁRBOL ---
        departamentosFiltrados() {
            const palabrasExcluidas = ['docente', 'estudiante', 'administrativo', 'otros', 'trabajador'];
            
            const normalizar = (texto) => String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            const tieneNombreExcluido = (nombre) => palabrasExcluidas.some(palabra => normalizar(nombre).includes(palabra));

            // Mapa para búsquedas rápidas
            const mapa = new Map(this.departamentos.map(d => [d.orgIndexCode, d]));

            // Determinar si hereda de un excluido
            const estaBloqueado = (departamento) => {
                let parentCode = departamento.parentOrgIndexCode;
                const visitados = new Set();
                while (parentCode) {
                    if (visitados.has(parentCode)) break;
                    visitados.add(parentCode);
                    const padre = mapa.get(parentCode);
                    if (!padre) break;
                    if (tieneNombreExcluido(padre.orgName)) return true;
                    parentCode = padre.parentOrgIndexCode;
                }
                return false;
            };

            // Retornar solo válidos
            return this.departamentos.filter(d => 
                d.orgIndexCode && 
                d.orgName && 
                !tieneNombreExcluido(d.orgName) && 
                !estaBloqueado(d)
            );
        },

        // Genera la lista plana con indentación tradicional (útil para selects nativos)
        departamentosPlanos() {
            const mapa = new Map(this.departamentosFiltrados.map(d => [d.orgIndexCode, d]));
            return this.departamentosFiltrados.map(d => {
                let nivel = 0;
                let parentCode = d.parentOrgIndexCode;
                const visitados = new Set();
                while (parentCode) {
                    if (visitados.has(parentCode)) break;
                    visitados.add(parentCode);
                    const padre = mapa.get(parentCode);
                    if (!padre) break;
                    nivel++;
                    parentCode = padre.parentOrgIndexCode;
                }
                return { ...d, nivel, prefijo: nivel > 0 ? '— '.repeat(nivel) : '' };
            });
        },

        // Genera la estructura visible en base a los nodos expandidos (Tree interactivo)
        departamentosJerarquicos() {
            const validos = this.departamentosFiltrados;
            const validIds = new Set(validos.map(d => d.orgIndexCode));
            
            // Construir lista de adyacencia (hijos)
            const hijosDe = {};
            validos.forEach(d => { hijosDe[d.orgIndexCode] = []; });
            validos.forEach(d => {
                if (d.parentOrgIndexCode && hijosDe[d.parentOrgIndexCode]) {
                    hijosDe[d.parentOrgIndexCode].push(d);
                }
            });

            const resultado = [];
            const visitados = new Set();

            // Función recursiva para aplanar respetando el estado "expandido"
            const traverse = (nodo, nivel) => {
                if(visitados.has(nodo.orgIndexCode)) return;
                visitados.add(nodo.orgIndexCode);

                const hijos = hijosDe[nodo.orgIndexCode] || [];
                const tieneHijos = hijos.length > 0;

                resultado.push({
                    ...nodo,
                    nivel,
                    tieneHijos
                });

                // Solo agrega los hijos a la lista visible si el nodo está expandido
                if (tieneHijos && this.nodosExpandidos.includes(nodo.orgIndexCode)) {
                    hijos.forEach(h => traverse(h, nivel + 1));
                }
            };

            // Las raíces son aquellos nodos cuyo padre NO está en la lista de válidos
            const raices = validos.filter(d => !validIds.has(d.parentOrgIndexCode));
            raices.forEach(r => traverse(r, 0));

            return resultado;
        },
        nivelesAccesoFiltrados() {
            const excluidos = ['docente', 'estudiante', 'administrativo','gym'];
            
            const normalizar = (texto) => String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            
            return this.accessLevels.filter(nivel => {
                const nombreNormalizado = normalizar(nivel.privilegeGroupName);
                // Si el nombre contiene alguna de las palabras excluidas, lo sacamos de la lista
                return !excluidos.some(palabra => nombreNormalizado.includes(palabra));
            });
        }
    },
    async mounted() {
        // Cierra el dropdown si se hace clic fuera del componente
        document.addEventListener('click', this.handleClickOutside);
    },
    methods: {
        formatSexo(val) {
            if (!val && val !== 0) return 'No registrado';
            const strVal = String(val).trim().toUpperCase();
            
            if (['1', 'M', 'MASCULINO'].includes(strVal)) return 'Masculino';
            if (['2', 'F', 'FEMENINO'].includes(strVal)) return 'Femenino';
            
            return val; // Si ya viene texto diferente, lo retorna intacto
        },
        async obtenerNombreDepartamento(orgIndexCode) {
            if (!orgIndexCode) return;
            this.cargandoDepartamento = true;
            try {
                const response = await API.get('/biometrico/getiddepartamento', {
                    params: { orgIndexCode: orgIndexCode }
                });

                // Ajusta según la estructura exacta que retorna HikCentral en tu backend
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    this.nombreDepartamento = data.orgName || data.name || data.orgIndexName || orgIndexCode;
                } else {
                    this.nombreDepartamento = orgIndexCode;
                }
            } catch (error) {
                console.error('Error al obtener departamento:', error);
                this.nombreDepartamento = orgIndexCode; // Muestra el código como respaldo
            } finally {
                this.cargandoDepartamento = false;
            }
        },
        getPdfUrlInvitado(ci, pdfName) {
            if (!pdfName || !ci) return null;

            // Si ya es una URL completa
            if (pdfName.startsWith('http://') || pdfName.startsWith('https://')) {
                return pdfName;
            }

            // Remueve '/api' o '/api/' al final de baseURL para ir a la raíz de public
            const rootURL = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');
            return `${rootURL}/Documentos/Biometrico/Invitados/Evidencia/${ci}/${pdfName}`;
        },
        toggleDropdown() {
            this.dropdownAbierto = !this.dropdownAbierto;
        },
        toggleNodo(orgIndexCode) {
            const index = this.nodosExpandidos.indexOf(orgIndexCode);
            if (index > -1) {
                this.nodosExpandidos.splice(index, 1);
            } else {
                this.nodosExpandidos.push(orgIndexCode);
            }
        },
        seleccionarDepartamento(dep) {
            this.formWizard.codigo_departamento = dep.orgIndexCode;
            this.dropdownAbierto = false;
        },
        handleClickOutside(event) {
            const container = document.getElementById('dropdown-depto-container');
            if (this.dropdownAbierto && container && !container.contains(event.target)) {
                this.dropdownAbierto = false;
            }
        },
        async cargarDepartamentos() {
            if (this.departamentos.length > 0) return;
            this.cargandoDepartamentos = true;
            try {
                const response = await API.get('/biometrico/getdepartamento');
                const lista = response.data?.data?.list || [];
                this.departamentos = lista;
                if (!this.departamentos.length) {
                    mostraralertas2('HikCentral no devolvió departamentos disponibles.', 'warning');
                }
            } catch (error) {
                console.error('Error cargando departamentos:', error);
                this.departamentos = [];
                mostraralertas2('No se pudieron cargar los departamentos.', 'error');
            } finally {
                this.cargandoDepartamentos = false;
            }
        },
        abrirModalCrearDepto() {
            this.formDepto = { esPrincipal: true, parentIndexCode: '', orgName: '' };
            this.mostrarModalDepto = true;
            this.dropdownAbierto = false; // Cerramos el selector si estaba abierto
        },
        async guardarNuevoDepartamento() {
            if (!this.formDepto.orgName) {
                return mostraralertas2('El nombre del departamento es obligatorio', 'warning');
            }
            if (!this.formDepto.esPrincipal && !this.formDepto.parentIndexCode) {
                return mostraralertas2('Debe seleccionar el departamento padre', 'warning');
            }

            this.guardandoDepto = true;
            try {
                const payload = {
                    orgName: this.formDepto.orgName,
                    parentIndexCode: this.formDepto.esPrincipal ? "1" : this.formDepto.parentIndexCode
                };

                const response = await API.post('/biometrico/adddepartamento', payload);

                if (response.data.code === "0") {
                    mostraralertas2('Departamento creado exitosamente', 'success');
                    
                    // Incorporar a la data local para que reactivamente se actualice el árbol
                    const nuevoDepto = response.data.data;
                    this.departamentos.push(nuevoDepto);
                    
                    // Si se creó dentro de un padre, expandimos automáticamente el padre para que sea visible
                    if (!this.formDepto.esPrincipal && !this.nodosExpandidos.includes(this.formDepto.parentIndexCode)) {
                        this.nodosExpandidos.push(this.formDepto.parentIndexCode);
                    }
                    
                    // Auto-seleccionar el recién creado
                    this.formWizard.codigo_departamento = nuevoDepto.orgIndexCode;
                    this.mostrarModalDepto = false;

                } else {
                    mostraralertas2(response.data.msg || 'Error al crear en HikCentral', 'error');
                }
            } catch (error) {
                console.error(error);
                mostraralertas2('Ocurrió un error en la solicitud', 'error');
            } finally {
                this.guardandoDepto = false;
            }
        },
        async cargarNivelesAcceso() {
            if (this.accessLevels.length > 0) return;

            this.loadingAccessLevels = true;
            try {
                const response = await API.get('/biometrico/get-access-levels');

                if (response.data && response.data.code === "0" && response.data.data) {
                    const list = response.data.data.list || response.data.data || [];
                    let grupos = [];

                    list.forEach(item => {
                        if (item.PrivilegeGroupInfo) {
                            grupos = grupos.concat(item.PrivilegeGroupInfo);
                        } else if (item.privilegeGroupId) {
                            grupos.push(item);
                        }
                    });

                    // Si la estructura no tenía PrivilegeGroupInfo, se asigna la lista completa
                    this.accessLevels = grupos.length > 0 ? grupos : list;
                    console.log("Niveles de acceso cargados desde API:", this.accessLevels);
                } else {
                    mostraralertas2('No se pudieron obtener los niveles de acceso', 'warning');
                }
            } catch (error) {
                console.error('Error cargando niveles de acceso:', error);
                mostraralertas2('Error de conexión al obtener niveles', 'error');
            } finally {
                this.loadingAccessLevels = false;
            }
        },
        async asignarNivelAcceso(personId) {
            try {
                const payload = {
                    personID: personId,
                    privilegeGroupId: this.formWizard.privilegeGroupId
                };
                
                const response = await API.post('/biometrico/addaccess', payload);
                
                if (response.data && response.data.code === "0") {
                    return true;
                } else {
                    console.error("Error asignando nivel HC:", response.data);
                    return false;
                }
            } catch (error) {
                console.error('Excepción al asignar nivel de acceso:', error);
                return false;
            }
        },
        onlyNumbers(event) {
            const charCode = event.charCode ? event.charCode : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        getPhotoUrlInvitado(ci, fotoName) {
            if (!fotoName || !ci) return '/img/default-avatar.png'; // Ruta a tu placeholder por defecto

            // Si la foto ya viene como una URL completa
            if (fotoName.startsWith('http://') || fotoName.startsWith('https://')) {
                return `${fotoName}?t=${new Date().getTime()}`;
            }

            // Remueve '/api' o '/api/' al final de la baseURL para apuntar a la raíz del servidor
            const rootURL = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');

            return `${rootURL}/Documentos/Biometrico/Invitados/Fotos/${ci}/${fotoName}?t=${new Date().getTime()}`;
        },
        getPhotoUrHIk(ci) {
            if (!ci) return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png";
            const baseURL2 = API.defaults.baseURL;
            // Usamos la ruta pública directa basada en tu lógica de backend
            return `${baseURL2}/biometrico/gethick/${ci}?t=${new Date().getTime()}`;
        },
        handlePdfChange(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                mostraralertas2("El PDF supera los 10MB permitidos", "error");
                return;
            }
            this.archivoPdf = file;
            this.archivoPdfName = file.name;
        },

        handleFotoChange(event) {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                mostraralertas2("La imagen supera los 5MB permitidos", "error");
                return;
            }
            this.archivoFoto = file;
            this.archivoFotoName = file.name;
        },
        async buscarInvitado() {
            this.errorValidacion = false;
            this.errorValidacionTexto = "";
            this.estencontrado = true;
            this.mostrarWizard = false; // Ocultar wizard si está abierto
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
            this.personaData = null;
            this.comparacionResultado = null;

            try {
                // Llamada al método individual con caché que creamos en Laravel
                const response = await API.get(`/biometrico/hikcentral_invitados/${this.searchQuery}`);
                if (!response.data || response.data.length === 0) {
                    this.estencontrado = false;
                } else {
                    this.estencontrado = true;
                    this.personaData = response.data.data;
                    await this.verificarRegistroHC(this.personaData.cedula);

                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.personaData.cedula);
                    }
                }

            } catch (error) {
                // NO LO ENCUENTRA - ABRIR SWAL
                this.estencontrado = false;
                
                const result = await Swal.fire({
                    title: 'Invitado no encontrado',
                    text: `La cédula ${this.searchQuery} no está registrada. ¿Deseas registrar un nuevo invitado?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#126E1B',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Sí, registrar',
                    cancelButtonText: 'Cancelar'
                });

                if (result.isConfirmed) {
                    this.iniciarWizard();
                } else {
                    this.searchQuery = "";
                }
            } finally {
                this.cargando = false;
            }
        },
        iniciarWizard() {
            this.mostrarWizard = true;
            this.pasoActual = 1;
            // Limpiar form y setear cedula
            this.formWizard = {
                cedula: this.searchQuery, nombres: '', apellidos: '', genero: 1, correo: '',
                codigo_departamento: '', begin_time: '', end_time: '', estado: 1
            };
            this.archivoPdf = null;
            this.archivoPdfName = '';
            this.archivoFoto = null;
            this.archivoFotoName = '';
            this.nodosExpandidos = [];
            this.cargarDepartamentos();
        },
        cerrarWizard() {
            this.mostrarWizard = false;
            this.searchQuery = "";
            this.personaData = null;
            this.estencontrado = true;
        },
        formatDateForApi(datetimeLocalStr) {
            if (!datetimeLocalStr) return "";
            // datetime-local formato: "YYYY-MM-DDTHH:mm" -> API necesita "YYYY-MM-DD HH:mm:ss"
            return datetimeLocalStr.replace('T', ' ') + ':00';
        },
        async guardarPaso1() {
            // Validaciones básicas
            if (!this.formWizard.nombres || !this.formWizard.apellidos || !this.formWizard.codigo_departamento || !this.formWizard.begin_time || !this.formWizard.end_time) {
                mostraralertas2("Llene todos los campos obligatorios (*)", "warning");
                return;
            }
            if (!this.archivoFoto) {
                mostraralertas2("La fotografía es obligatoria para HikCentral", "warning");
                return;
            }

            this.uploading = true;
            try {
                let evidenciaPath = null;
                let fotoPath = null;

                // 1. Subir PDF si hay
                if (this.archivoPdf) {
                    const formPdf = new FormData();
                    formPdf.append('file', this.archivoPdf);
                    formPdf.append('ci', this.formWizard.cedula);
                    const respPdf = await API.post(`${this.baseUrl}/subirevidencia`, formPdf);
                    if (respPdf.data.status) evidenciaPath = respPdf.data.filename;
                }

                // 2. Subir Foto
                if (this.archivoFoto) {
                    const formFoto = new FormData();
                    formFoto.append('file', this.archivoFoto);
                    formFoto.append('ci', this.formWizard.cedula);
                    const respFoto = await API.post(`${this.baseUrl}/subirfoto`, formFoto);
                    if (respFoto.data.status) fotoPath = respFoto.data.filename;
                }

                // 3. Preparar JSON y guardar en BD local
                const dataToSave = {
                    ...this.formWizard,
                    begin_time: this.formatDateForApi(this.formWizard.begin_time),
                    end_time: this.formatDateForApi(this.formWizard.end_time),
                    evidencia: evidenciaPath,
                    foto: fotoPath
                };

                const resDB = await API.post(`${this.baseUrl}/hikcentral_invitados`, dataToSave);
                
                // Si guardó bien, cargamos los datos y pasamos al Step 2
                this.personaData = resDB.data.data;
                this.pasoActual = 2;
                this.cargarNivelesAcceso();
                await this.verificarRegistroHC(this.personaData.cedula);

            } catch (error) {
                console.error(error);
                let msj = "Error al guardar localmente.";
                if(error.response && error.response.data && error.response.data.errores) {
                    // Mostrar primer error de validación de Laravel
                    msj = Object.values(error.response.data.errores)[0][0]; 
                }
                mostraralertas2(msj, "error");
            } finally {
                this.uploading = false;
            }
        },
        async registrarEnHikCentralWizard() {
            if (!this.formWizard.privilegeGroupId) {
                return mostraralertas2("Debes seleccionar un nivel de acceso antes de sincronizar.", "warning");
            }

            // 2. Ejecutar la sincronización indicando que viene desde el Wizard
            await this.registrarEnHikCentral(this.personaData.cedula, true);
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
        async ejecutarComparacion(ci) {
            this.comparando = true;
            try {

                const { data } = await API.get(`${this.baseUrl}/compare-hikdoc-inv/${ci}`);

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
        async registrarEnHikCentral(post, isFromWizard = false) {
            // Confirmación simple
            const confirmacion = await Swal.fire({
                title: '¿Confirmar Registro?',
                text: `¿Deseas registrar a ${this.personaData?.nombres || post} en HikCentral?`,
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
                const response = await API.post(`${this.baseUrl}/sync-invitado-hikcentral/${post}`);
                Swal.close();
                // Si el código que retorna Artemis es "0" es éxito
                if (response.data.code === "0" || response.data.msg === "Success") {
                    const personID = response.data.data; // ID asignado en HikCentral
                    let detalleAcceso = "";
                    // Paso 2: Asignar nivel de acceso si viene del Wizard y se seleccionó un grupo
                    if (isFromWizard && this.formWizard.privilegeGroupId && personID) {
                        try {
                            const accessResponse = await API.post('/biometrico/addaccess', {
                                personID: personID,
                                privilegeGroupId: this.formWizard.privilegeGroupId
                            });

                            if (accessResponse.data.code === "0") {
                                detalleAcceso = " y nivel de acceso asignado correctamente.";
                            } else {
                                console.warn("Advertencia al asignar nivel de acceso:", accessResponse.data);
                                detalleAcceso = `. Sin embargo, hubo un problema asignando el acceso: ${accessResponse.data.msg || 'Error'}`;
                            }
                        } catch (errAccess) {
                            console.error("Error asignando nivel de acceso:", errAccess);
                            detalleAcceso = ". Ocurrió un error al intentar asignar el nivel de acceso.";
                        }
                    }
                    Swal.close();
                    mostraralertas2(`✅ Registrado con éxito (ID HC: ${personID})${detalleAcceso}`, "success");

                    // Actualizar el estado en la tabla localmente sin recargar
                    await this.verificarRegistroHC(this.personaData.cedula);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.personaData.cedula);
                    }
                    if (isFromWizard) {
                        this.pasoActual = 3; // Avanzar al paso final del Wizard
                    }

                } else if (response.data.code === "131") {
                    console.warn("⚠️ Usuario ya registrado en HikCentral.");
                    mostraralertas2(`⚠️ Usuario ya registrado en HikCentral.`, "warning");
                    this.estaRegistrado = true;
                    this.searchQuery = '';
                    this.estencontrado = true;
                } else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.personaData.cedula + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.personaData.cedula} no es compatible con HikCentral.`, "error");
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
                text: `¿Deseas reemplazar la foto actual de ${this.personaData?.nombres || post} en HikCentral?`,
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
                    await this.verificarRegistroHC(this.personaData.cedula);
                    if (this.estaRegistrado) {
                        await this.ejecutarComparacion(this.personaData.cedula);
                    }
                } else if (response.data.code === "128") {
                    console.warn("La foto de: " + this.personaData.cedula + " no es compatible con HikCentral.");
                    mostraralertas2(`La foto de: ${this.personaData.cedula} no es compatible con HikCentral.`, "error");
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
        async uploadarchivo(ci, oldFilename = null) {
            if (!this.archivoSeleccionado) return null; // nada que subir
            try {
                this.uploading = true;
                const form = new FormData();
                form.append('file', this.archivoSeleccionado);
                form.append('ci', ci);
                if (oldFilename) {
                    form.append('old_filename', oldFilename); // Enviamos el nombre del archivo viejo
                }

                // Si tu backend exige otros campos (ej: tipo), añade aquí
                const resp = await API.post(`${this.baseUrl}/subirevidencia`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (resp && resp.data && resp.data.filename) {
                    this.archivoSeleccionado = null;
                    this.archivoPreviewName = '';
                    this.$refs.fileFoto.value = null;
                    return resp.data; // { filename, url }
                } else {
                    mostraralertas2('Error subiendo archivo', 'danger');
                    return null;
                }
            } catch (error) {
                mostraralertas2('Error subiendo archivo', 'danger');
                return null;
            } finally {
                this.uploading = false;
            }
        },

    }
};
</script>
<style scoped>
/* Clases para el desvanecimiento de Vue */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
