# Biometrico

Aplicación web para la consulta y administración de información biométrica institucional. Incluye inicio de sesión, panel de estadísticas de HikCentral, registros y fotografías de estudiantes, estudiantes de pregrado, docentes e invitados, asistencia y dispositivos de control de acceso.

> **Frontend:** Vue 3 con Vue CLI. La aplicación consume servicios de un backend externo; este repositorio contiene el cliente web, no la API ni la base de datos.

## Contenido

- [Funciones principales](#funciones-principales)
- [Tecnologías](#tecnologías)
- [Requisitos e instalación](#requisitos-e-instalación)
- [Comandos disponibles](#comandos-disponibles)
- [Configuración del backend](#configuración-del-backend)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Estructura y catálogo de archivos](#estructura-y-catálogo-de-archivos)
- [Notas para contribuir](#notas-para-contribuir)

## Funciones principales

- Autenticación y estado de sesión con Vuex.
- Panel de inicio con estadísticas relacionadas con HikCentral.
- Consulta y registro de estudiantes, estudiantes de pregrado, docentes e invitados.
- Consulta de asistencia individual y reportes de asistencia masiva.
- Consulta de dispositivos y cámaras.
- Interfaz adaptable con barra lateral, modo claro/oscuro y componentes reutilizables.
- Comunicación HTTP con el backend mediante Axios.

## Tecnologías

- **Vue 3**, **Vue Router 4** y **Vuex 4** para la interfaz y navegación.
- **Vue CLI 5**, Babel y Webpack para desarrollo y compilación.
- **Axios** para solicitudes HTTP.
- **Tailwind CSS**, Bootstrap y estilos propios para la presentación.
- **ApexCharts**, Chart.js y bibliotecas complementarias para visualizaciones.
- Utilidades para PDF, Excel, códigos QR, calendarios, carruseles y alertas, detalladas en [`package.json`](./package.json).

## Requisitos e instalación

Se necesita Node.js y npm. Desde la raíz del proyecto:

```bash
npm install
npm run serve
```

El servidor de desarrollo imprime en la terminal la dirección local donde se puede abrir la aplicación. Para generar la versión de producción:

```bash
npm run build
```

El resultado compilado queda en `dist/` (no se incluye en Git).

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm install` | Instala las dependencias declaradas en `package.json`. |
| `npm run serve` | Inicia el servidor de desarrollo de Vue CLI con recarga en caliente. |
| `npm run build` | Compila y optimiza la aplicación para producción. |

## Configuración del backend

La URL de API se define en [`vue.config.js`](./vue.config.js) mediante la constante de compilación `__API_BIOMETRICO__`. Actualmente apunta a `http://biometricobackend.test/api` tanto en desarrollo como en producción. El servidor de desarrollo también configura un proxy `/api` hacia `http://biometricobackend.test`; para que las consultas funcionen, ese host debe resolver y el backend debe estar disponible.

El cliente de sesión de [`src/store/auth.js`](./src/store/auth.js) usa además la ruta `/biometrico` bajo la URL base de API. Antes de desplegar en otro entorno, revisa ambas URL y la ruta pública de producción (`/biometrico/`) configurada en `vue.config.js`.

## Rutas de la aplicación

| Ruta | Vista | Propósito |
| --- | --- | --- |
| `/` | Inicio de sesión | Acceso a la aplicación. |
| `/home` | Inicio | Estadísticas de HikCentral. |
| `/estudiantes_pre_pictures` | Fotografías de estudiantes de pregrado | Consulta de fotografías. |
| `/estudiantes_pre_registro` | Registro de estudiante de pregrado | Registro individual. |
| `/estudiantes_pictures` | Fotografías de estudiantes | Consulta de fotografías. |
| `/docentes_pictures` | Fotografías de docentes | Consulta de fotografías. |
| `/docentes_registro` | Registro de docente | Registro individual. |
| `/estudiantes_registro` | Registro de estudiante | Registro individual. |
| `/devices` | Dispositivos | Consulta de dispositivos de control de acceso. |
| `/camaras` | Cámaras | Consulta de cámaras. |
| `/invitados` | Invitados | Consulta y registro de invitados. |
| `/asistencia-masiva` | Asistencia masiva | Reporte de asistencia. |
| `/asistencia-beta` | Asistencia individual | Consulta individual de marcaciones. |
| `/about` | Acerca de | Vista informativa de ejemplo. |

La definición de rutas se encuentra en [`src/router/index.js`](./src/router/index.js).

## Estructura y catálogo de archivos

El catálogo cubre el código, la configuración y los recursos propios versionados de la aplicación. Se omiten `.git/`, `node_modules/` y `dist/`, porque son metadatos, dependencias instaladas y artefactos generados, respectivamente.

### Archivos de la raíz

| Archivo | Función |
| --- | --- |
| `.editorconfig` | Convenciones de formato compartidas: UTF-8, espacios, LF y salto de línea final. |
| `.gitignore` | Excluye dependencias, compilación, archivos locales de entorno y configuraciones/editoriales locales. |
| `babel.config.js` | Configura Babel con el preset de Vue CLI. |
| `jsconfig.json` | Configuración de resolución de módulos y alias `@/` hacia `src/` para el editor. |
| `package.json` | Metadatos, comandos y dependencias de la aplicación. |
| `package-lock.json` | Fija el árbol concreto de dependencias npm para instalaciones reproducibles. |
| `postcss.config.js` | Activa Tailwind CSS y Autoprefixer en el procesamiento CSS. |
| `vue.config.js` | Configura Vue CLI/Webpack: alias, división de paquetes, salida, base pública, variables y proxy de API. |
| `README.md` | Guía del proyecto, instalación, rutas y catálogo de archivos. |

### Arranque, navegación, estado y lógica compartida

| Archivo | Función |
| --- | --- |
| `src/main.js` | Punto de entrada; carga estilos globales y monta Vue con Vuex, Vue Router y ApexCharts. |
| `src/App.vue` | Raíz de la interfaz; establece proveedores de tema y barra lateral y muestra la vista de la ruta activa. |
| `src/router/index.js` | Declara las rutas y asocia cada URL con su vista. |
| `src/store/index.js` | Crea el store Vuex, conserva datos de sesión en `localStorage` y expone mutaciones de inicio/cierre de sesión. |
| `src/store/auth.js` | Gestiona la consulta de perfil y el cliente de autenticación, adjunta el token, solicita renovación y trata sesiones expiradas. |
| `src/composables/useSidebar.js` | Estado compartido y acciones de la barra lateral, incluido el comportamiento adaptable a pantallas pequeñas. |
| `src/composables/useUsuario.js` | Expone de forma reactiva rol, correo, identificador y nombre del usuario desde Vuex. |

### Vistas (`src/views/`)

Las vistas componen el diseño de página y conectan rutas con los componentes funcionales.

| Archivo | Función |
| --- | --- |
| `src/views/HomeView.vue` | Página de inicio; presenta los cuatro módulos de estadísticas de HikCentral. |
| `src/views/AboutView.vue` | Página informativa de ejemplo. |
| `src/views/Login/Signin.vue` | Pantalla de inicio de sesión y formulario de acceso. |
| `src/views/Asistencia/AsistenciaIndividualBetaViews.vue` | Página contenedora de la consulta de asistencia individual. |
| `src/views/Asistencia/AsistenciaMasiva_allViews.vue` | Página contenedora del reporte de asistencia masiva. |
| `src/views/Devices/Devices_allViews.vue` | Página de dispositivos de control de acceso. |
| `src/views/Devices/Devices_CamarasViews.vue` | Página de consulta de cámaras. |
| `src/views/FotosViews/Docentes_FotoViews.vue` | Página de fotografías de docentes. |
| `src/views/FotosViews/Estudiantes_FotoViews.vue` | Página de fotografías de estudiantes. |
| `src/views/FotosViews/Estudiantes_Pre_FotoViews.vue` | Página de fotografías de estudiantes de pregrado. |
| `src/views/FotosViews/InvitadosViews.vue` | Página de invitados. |
| `src/views/FotosViews/Registro_IndvDoc.vue` | Página de registro individual de docentes. |
| `src/views/FotosViews/Registro_IndvEst.vue` | Página de registro individual de estudiantes. |
| `src/views/FotosViews/Registro_IndvPreEst.vue` | Página de registro individual de estudiantes de pregrado. |

### Componentes funcionales (`src/components/`)

| Archivo | Función |
| --- | --- |
| `src/components/HelloWorld.vue` | Componente de demostración incluido como referencia de Vue CLI. |
| `src/components/Modal/Modal.vue` | Componente de ventana modal reutilizable. |
| `src/components/Registro/Invitados.vue` | Interfaz y lógica para gestionar el registro de invitados. |
| `src/components/Registro/RegistroIndivDoc.vue` | Formulario y operaciones de registro individual de docentes. |
| `src/components/Registro/RegistroIndivEst.vue` | Formulario y operaciones de registro individual de estudiantes. |
| `src/components/Registro/RegistroIndivPreEst.vue` | Formulario y operaciones de registro individual de estudiantes de pregrado. |
| `src/components/asistencia/AsistenciaIndividualBeta.vue` | Búsqueda de una persona y consulta de sus marcaciones individuales en HikCentral. |
| `src/components/asistencia/AsistenciaMasiva.vue` | Consulta y presentación del reporte de asistencia masiva. |
| `src/components/devices/devices_all.vue` | Consulta y presentación de dispositivos de control de acceso. |
| `src/components/devices/devices_camaras.vue` | Consulta y presentación de cámaras. |
| `src/components/estadisticas/StatsHikcentral.vue` | Panel general de estadísticas de HikCentral. |
| `src/components/estadisticas/StatsEstHikcentral.vue` | Estadísticas de estudiantes asociadas a HikCentral. |
| `src/components/estadisticas/StatsPersonHikcentral.vue` | Estadísticas de personas asociadas a HikCentral. |
| `src/components/estadisticas/StatsGymHikcentral.vue` | Estadísticas de gimnasio asociadas a HikCentral. |
| `src/components/fotos/docentes_foto.vue` | Consulta y administración de fotografías de docentes. |
| `src/components/fotos/estudiantes_foto.vue` | Consulta y administración de fotografías de estudiantes. |
| `src/components/fotos/estudiantes_pre_foto.vue` | Consulta y administración de fotografías de estudiantes de pregrado. |

### Componentes compartidos (`src/components/common/`)

| Archivo | Función |
| --- | --- |
| `src/components/common/CommonGridShape.vue` | Fondo decorativo de cuadrícula para pantallas. |
| `src/components/common/ComponentCard.vue` | Contenedor visual reutilizable para secciones o tarjetas. |
| `src/components/common/CountDown.vue` | Componente de cuenta regresiva. |
| `src/components/common/DropdownMenu.vue` | Menú desplegable reutilizable. |
| `src/components/common/PageBreadcrumb.vue` | Encabezado/ruta de navegación de página. |
| `src/components/common/ThemeToggler.vue` | Control de cambio entre tema claro y oscuro. |
| `src/components/common/v-click-outside.vue` | Directiva Vue para detectar clics fuera de un elemento. |

### Diseño y navegación (`src/components/layout/`)

| Archivo | Función |
| --- | --- |
| `src/components/layout/AdminLayout.vue` | Estructura de las páginas autenticadas: barra lateral, encabezado, contenido y pie. |
| `src/components/layout/AppHeader.vue` | Encabezado principal de la aplicación. |
| `src/components/layout/AppSidebar.vue` | Navegación lateral y accesos a las secciones. |
| `src/components/layout/Backdrop.vue` | Fondo superpuesto usado al abrir la navegación móvil. |
| `src/components/layout/FullScreenLayout.vue` | Diseño de página de pantalla completa, sin el marco administrativo. |
| `src/components/layout/SidebarProvider.vue` | Inicializa y proporciona el estado compartido de la barra lateral. |
| `src/components/layout/SidebarWidget.vue` | Widget auxiliar para el área de navegación lateral. |
| `src/components/layout/ThemeProvider.vue` | Provee el tema, guarda la preferencia y aplica la clase de modo oscuro. |
| `src/components/layout/header/HeaderLogo.vue` | Logotipo del encabezado. |
| `src/components/layout/header/NotificationMenu.vue` | Menú de notificaciones del encabezado. |
| `src/components/layout/header/SearchBar.vue` | Barra de búsqueda del encabezado. |
| `src/components/layout/header/UserMenu.vue` | Menú de usuario del encabezado. |

### Iconos (`src/icons/`)

Cada archivo `.vue` de esta carpeta dibuja un icono SVG reutilizable. `src/icons/index.js` importa y exporta el conjunto para facilitar su uso.

| Archivo | Icono / propósito |
| --- | --- |
| `src/icons/ArchiveIcon.vue` | Archivo/archivar. |
| `src/icons/BarChartIcon.vue` | Gráfico de barras. |
| `src/icons/BellIcon.vue` | Notificaciones. |
| `src/icons/BoxCubeIcon.vue` | Cubo/elemento tridimensional. |
| `src/icons/BoxIcon.vue` | Caja. |
| `src/icons/Calendar2Line.vue` | Calendario en estilo lineal. |
| `src/icons/CalenderIcon.vue` | Calendario. |
| `src/icons/ChatIcon.vue` | Chat. |
| `src/icons/CheckIcon.vue` | Confirmación/check. |
| `src/icons/ChevronDownIcon.vue` | Flecha desplegable hacia abajo. |
| `src/icons/ChevronRightIcon.vue` | Flecha hacia la derecha. |
| `src/icons/DocsIcon.vue` | Documentos. |
| `src/icons/DraftIcon.vue` | Borrador. |
| `src/icons/ErrorHexaIcon.vue` | Error en forma hexagonal. |
| `src/icons/ErrorIcon.vue` | Error. |
| `src/icons/FlagIcon.vue` | Bandera. |
| `src/icons/FolderIcon.vue` | Carpeta. |
| `src/icons/GridIcon.vue` | Cuadrícula. |
| `src/icons/HomeIcon.vue` | Inicio. |
| `src/icons/HorizontalDots.vue` | Más opciones (puntos horizontales). |
| `src/icons/InfoCircleIcon.vue` | Información en círculo. |
| `src/icons/InfoIcon.vue` | Información. |
| `src/icons/LayoutDashboardIcon.vue` | Panel/dashboard. |
| `src/icons/ListIcon.vue` | Lista. |
| `src/icons/LogoutIcon.vue` | Cerrar sesión. |
| `src/icons/MailBox.vue` | Buzón. |
| `src/icons/MailIcon.vue` | Correo. |
| `src/icons/MenuIcon.vue` | Menú. |
| `src/icons/Message2Line.vue` | Mensaje en estilo lineal. |
| `src/icons/PageIcon.vue` | Página. |
| `src/icons/PaperclipIcon.vue` | Adjunto. |
| `src/icons/PieChartIcon.vue` | Gráfico circular. |
| `src/icons/PlugInIcon.vue` | Complemento/conexión. |
| `src/icons/PlusIcon.vue` | Añadir. |
| `src/icons/RefreshIcon.vue` | Actualizar. |
| `src/icons/SendIcon.vue` | Enviar. |
| `src/icons/SettingsIcon.vue` | Configuración. |
| `src/icons/StaredIcon.vue` | Elemento destacado/favorito. |
| `src/icons/SuccessIcon.vue` | Éxito. |
| `src/icons/SupportIcon.vue` | Soporte. |
| `src/icons/TableIcon.vue` | Tabla. |
| `src/icons/TaskIcon.vue` | Tarea. |
| `src/icons/TrashIcon.vue` | Papelera. |
| `src/icons/TrashIconLg.vue` | Papelera grande. |
| `src/icons/UserCircleIcon.vue` | Usuario en círculo. |
| `src/icons/UserGroupIcon.vue` | Grupo de usuarios. |
| `src/icons/WarningIcon.vue` | Advertencia. |
| `src/icons/index.js` | Punto de exportación agrupada de los iconos. |

### Servicios, estilos y recursos importados (`src/assets/`)

| Archivo | Función |
| --- | --- |
| `src/assets/js/services/axios.js` | Instancia HTTP compartida: URL base, token de autorización y tratamiento de errores/respuestas 401. |
| `src/assets/js/function/funciones.js` | Alertas, confirmaciones de acciones y funciones comunes para solicitudes HTTP. |
| `src/assets/js/function/login_function.js` | Envía credenciales y almacena en Vuex los datos de sesión recibidos. |
| `src/assets/js/login.js` | Lógica del formulario de acceso y validación del rol devuelto por la API. |
| `src/assets/js/custom.js` | Lógica reutilizable ligada a roles/datos de usuario para la interfaz. |
| `src/assets/main.css` | Estilos globales de la aplicación y configuración visual compartida. |
| `src/assets/styles/bootstrap.min.css` | Hoja de estilos Bootstrap minificada incluida como recurso local. |

### Archivos públicos

Los archivos de `public/` se sirven directamente, sin importarse desde módulos de JavaScript.

| Archivo o grupo | Función |
| --- | --- |
| `public/index.html` | Plantilla HTML de Vue CLI; define el elemento `#app` donde se monta Vue. |
| `public/favicon.ico` | Icono de la pestaña del navegador. |
| `public/fondo.png` | Imagen de fondo disponible para las páginas. |
| `public/images/brand/brand-01.svg` a `brand-15.svg` | Quince recursos gráficos de marca (`brand-01.svg`, `brand-02.svg`, `brand-03.svg`, `brand-04.svg`, `brand-05.svg`, `brand-06.svg`, `brand-07.svg`, `brand-08.svg`, `brand-09.svg`, `brand-10.svg`, `brand-11.svg`, `brand-12.svg`, `brand-13.svg`, `brand-14.svg`, `brand-15.svg`). |
| `public/images/cards/card-01.jpg`, `card-01.png`, `card-02.jpg`, `card-02.png`, `card-03.jpg`, `card-03.png` | Imágenes de tarjetas de ejemplo. |
| `public/images/carousel/carousel-01.png` a `carousel-04.png` | Cuatro imágenes de carrusel: `carousel-01.png`, `carousel-02.png`, `carousel-03.png`, `carousel-04.png`. |
| `public/images/chat/chat.jpg` | Imagen de ejemplo para la interfaz de chat. |
| `public/images/country/country-01.svg` a `country-08.svg` | Ocho iconos/banderas de países: `country-01.svg`, `country-02.svg`, `country-03.svg`, `country-04.svg`, `country-05.svg`, `country-06.svg`, `country-07.svg`, `country-08.svg`. |
| `public/images/error/404.svg`, `404-dark.svg`, `500.svg`, `500-dark.svg`, `503.svg`, `503-dark.svg`, `maintenance.svg`, `maintenance-dark.svg`, `success.svg`, `success-dark.svg` | Ilustraciones de error, mantenimiento y éxito en variantes claras y oscuras. |
| `public/images/grid-image/image-01.png` a `image-06.png` | Seis imágenes para cuadrículas visuales: `image-01.png`, `image-02.png`, `image-03.png`, `image-04.png`, `image-05.png`, `image-06.png`. |
| `public/images/icons/file-image.svg`, `file-image-dark.svg`, `file-pdf.svg`, `file-pdf-dark.svg`, `file-video.svg`, `file-video-dark.svg` | Iconos de archivo de imagen, PDF y video en temas claro y oscuro. |
| `public/images/logo/auth-logo.svg`, `logo-dark.svg`, `logo-icon.svg`, `logo.svg`, `piso.svg` | Variantes de logotipo para autenticación, tema claro/oscuro, icono y marca. |
| `public/images/product/product-01.jpg` a `product-05.jpg` | Cinco imágenes de producto de ejemplo: `product-01.jpg`, `product-02.jpg`, `product-03.jpg`, `product-04.jpg`, `product-05.jpg`. |
| `public/images/shape/grid-01.svg` | Recurso SVG decorativo de cuadrícula. |
| `public/images/task/google-drive.svg`, `pdf.svg`, `task.jpg`, `task.png` | Iconos e imágenes ilustrativas para tareas/archivos. |
| `public/images/user/owner.jpg`, `user-01.jpg` a `user-37.jpg` | Imagen de propietario y 37 avatares/fotografías de ejemplo (`user-01.jpg`, `user-02.jpg`, `user-03.jpg`, `user-04.jpg`, `user-05.jpg`, `user-06.jpg`, `user-07.jpg`, `user-08.jpg`, `user-09.jpg`, `user-10.jpg`, `user-11.jpg`, `user-12.jpg`, `user-13.jpg`, `user-14.jpg`, `user-15.jpg`, `user-16.jpg`, `user-17.jpg`, `user-18.jpg`, `user-19.jpg`, `user-20.jpg`, `user-21.jpg`, `user-22.jpg`, `user-23.jpg`, `user-24.jpg`, `user-25.jpg`, `user-26.jpg`, `user-27.jpg`, `user-28.jpg`, `user-29.jpg`, `user-30.jpg`, `user-31.jpg`, `user-32.jpg`, `user-33.jpg`, `user-34.jpg`, `user-35.jpg`, `user-36.jpg`, `user-37.jpg`). |
| `public/images/video-thumb/thumb-16.png`, `video.mp4`, `youtube-icon-84.svg` | Miniatura, video de ejemplo e icono de YouTube. |

#### Copias disponibles en `src/assets/images/`

Los recursos gráficos anteriores también están versionados en `src/assets/images/` con los mismos subdirectorios y nombres. Es decir, cada archivo `public/images/<carpeta>/<archivo>` tiene su contraparte `src/assets/images/<carpeta>/<archivo>`: `brand` (15 SVG), `cards` (6 imágenes), `carousel` (4 PNG), `chat` (1 JPG), `country` (8 SVG), `error` (10 SVG), `grid-image` (6 PNG), `icons` (6 SVG), `logo` (5 SVG), `product` (5 JPG), `shape` (1 SVG), `task` (4 recursos), `user` (38 JPG) y `video-thumb` (PNG, MP4 y SVG). Se conservan ambas ubicaciones porque los recursos públicos se referencian por URL, mientras los de `src/assets/` pueden importarse desde los componentes.

## Notas para contribuir

- Las vistas deben permanecer conectadas desde `src/router/index.js`.
- Los componentes de página suelen usar `AdminLayout` y componentes funcionales separados para mantener la presentación modular.
- El estado de sesión y las credenciales se guardan en `localStorage`; evita registrar tokens o datos personales en logs.
- Revisa las URL del backend y `publicPath` en `vue.config.js` antes de desplegar en un entorno diferente.
