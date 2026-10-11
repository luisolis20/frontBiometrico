<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="@/assets/images/logo/logo-icon.svg" alt="User" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ nombreUsuario }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="transition-transform duration-200" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50"
    >
      <div class="mb-2">
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ nombreUsuario }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ emailUsuario }}
        </span>
      </div>

      <!-- Botón de Cerrar Sesión Animado -->
      <button
        ref="logoutBtnRef"
        @click="animarYCerrarSesion" :disabled="isAnimating"
        class="logout-btn relative flex items-center justify-between px-4 py-2.5 mt-2 font-medium text-black bg-gray-900 rounded-lg group text-theme-sm overflow-hidden"
      >
        <span class="z-10 transition-opacity" :class="{'opacity-50': isAnimating}">Cerrar Sesión -</span>
        
        <!-- Contenedor de la Animación -->
        <div class="animation-wrapper relative w-12 h-6 flex items-center justify-end">
          <!-- Stickman -->
          <div class="stickman absolute right-5 bottom-0" :class="{ 'walking': isWalking, 'falling': isFalling }">
            <div class="head"></div>
            <div class="torso"></div>
            <div class="arm arm-left"></div>
            <div class="arm arm-right"></div>
            <div class="leg leg-left">
              <div class="calf calf-left"></div>
            </div>
            <div class="leg leg-right">
              <div class="calf calf-right"></div>
            </div>
          </div>
          <!-- Puerta -->
          <div class="door absolute right-0 bottom-0 w-4 h-6 bg-green-500 rounded-sm border border-blue-600 flex items-center">
            <div class="doorknob w-1 h-1 bg-white rounded-full ml-0.5"></div>
          </div>
        </div>
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { ChevronDownIcon } from '@/icons'
import { onMounted, onUnmounted, ref } from 'vue'
import { useUsuario } from "@/composables/useUsuario"
import API from "@/assets/js/services/axios"

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const logoutBtnRef = ref(null)

// Estados de la animación
const isAnimating = ref(false)
const isWalking = ref(false)
const isFalling = ref(false)
let walkInterval = null
let pose = false

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const {
  nombreUsuario,
  emailUsuario
} = useUsuario()

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// Resetear las variables CSS del stickman
const resetPose = () => {
  if (!logoutBtnRef.value) return;
  const btn = logoutBtnRef.value;
  btn.style.setProperty("--arm1", "rotate(0deg)");
  btn.style.setProperty("--wrist1", "rotate(0deg)");
  btn.style.setProperty("--arm2", "rotate(0deg)");
  btn.style.setProperty("--wrist2", "rotate(0deg)");
  btn.style.setProperty("--leg1", "rotate(0deg)");
  btn.style.setProperty("--calf1", "rotate(0deg)");
  btn.style.setProperty("--leg2", "rotate(0deg)");
  btn.style.setProperty("--calf2", "rotate(0deg)");
}

// Alternar pasos
const walkStep = () => {
  if (!logoutBtnRef.value) return;
  const btn = logoutBtnRef.value;
  pose = !pose;

  if (pose) {
    btn.style.setProperty("--arm1", "rotate(18deg)");
    btn.style.setProperty("--wrist1", "rotate(-12deg)");
    btn.style.setProperty("--arm2", "rotate(-18deg)");
    btn.style.setProperty("--wrist2", "rotate(12deg)");
    btn.style.setProperty("--leg1", "rotate(16deg)");
    btn.style.setProperty("--calf1", "rotate(-10deg)");
    btn.style.setProperty("--leg2", "rotate(-16deg)");
    btn.style.setProperty("--calf2", "rotate(10deg)");
  } else {
    btn.style.setProperty("--arm1", "rotate(-18deg)");
    btn.style.setProperty("--wrist1", "rotate(12deg)");
    btn.style.setProperty("--arm2", "rotate(18deg)");
    btn.style.setProperty("--wrist2", "rotate(-12deg)");
    btn.style.setProperty("--leg1", "rotate(-16deg)");
    btn.style.setProperty("--calf1", "rotate(10deg)");
    btn.style.setProperty("--leg2", "rotate(16deg)");
    btn.style.setProperty("--calf2", "rotate(-10deg)");
  }
}

const animarYCerrarSesion = async () => {
  if (isAnimating.value) return; // Evitar doble clic

  isAnimating.value = true;
  isWalking.value = true;

  // Iniciar caminata
  walkInterval = setInterval(walkStep, 170);

  // Detener caminata y resetear pose cerca de la puerta
  setTimeout(() => {
    clearInterval(walkInterval);
    isWalking.value = false;
    resetPose();
  }, 900);

  // Simular la caída
  setTimeout(() => {
    isFalling.value = true;
  }, 1050);

  // Ejecutar el cierre de sesión real después de la animación
  setTimeout(async () => {
    await cerrarsesion();
  }, 2000);
}

const cerrarsesion = async () => {
  try {
    const token = localStorage.getItem("token_bio")

    if (!token) {
      console.warn("⚠️ No hay token, cerrando sesión localmente...")
      limpiarYRedirigir()
      return
    }

    const response = await API.get(
      "/biometrico/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    console.log("✅ Sesión cerrada:", response.data)

  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error.response?.data || error)
  } finally {
    limpiarYRedirigir()
  }
}

const limpiarYRedirigir = () => {
  localStorage.clear()
  window.location.href = "/biometrico"
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  resetPose()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (walkInterval) clearInterval(walkInterval)
})
</script>

<style scoped>
/* Contenedor principal del botón */
.logout-btn {
  background-color: #ffffff; /* Tono oscuro de la imagen */
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background-color: #ffffff;
}

/* Base del Stickman */
.stickman {
  --stick-color: #080808; /* Color azul del stickman */
  width: 12px;
  height: 20px;
  transform-origin: bottom center;
  transition: transform 0.5s ease;
  will-change: transform;
}

.stickman div {
  position: absolute;
  background-color: var(--stick-color);
  border-radius: 4px;
}

.head {
  width: 5px;
  height: 5px;
  border-radius: 50% !important;
  top: 0;
  left: 3.5px;
}

.torso {
  width: 2px;
  height: 8px;
  top: 5px;
  left: 5px;
}

.arm, .leg {
  width: 2px;
  height: 6px;
  transform-origin: top center;
  transition: transform 0.15s linear;
}

.arm { top: 6px; }
.leg { top: 12px; }

.arm-left { left: 5px; transform: var(--arm1); }
.arm-right { left: 5px; transform: var(--arm2); }
.leg-left { left: 5px; transform: var(--leg1); }
.leg-right { left: 5px; transform: var(--leg2); }

.calf {
  width: 2px;
  height: 6px;
  top: 5px;
  left: 0;
  transform-origin: top center;
  transition: transform 0.15s linear;
}

.calf-left { transform: var(--calf1); }
.calf-right { transform: var(--calf2); }

/* Clases dinámicas de animación añadidas por Vue */
.stickman.walking {
  animation: moveRight 0.9s linear forwards;
}

.stickman.falling {
  transform: translateX(18px) rotate(90deg);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.3s ease 0.1s;
}

@keyframes moveRight {
  from { transform: translateX(0); }
  to { transform: translateX(18px); } /* Se mueve hacia la puerta */
}

/* Efecto opcional de apertura en la puerta */
.door {
  transition: transform 0.3s ease;
  transform-origin: right center;
}
.stickman.falling ~ .door {
  transform: scaleX(0.2); /* Simula que la puerta se abre */
}
</style>