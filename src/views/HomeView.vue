<template>
  <admin-layout>
    <div class="relative w-full min-h-screen">
      <!-- Dispositivos Online Estadisticas -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div>
          <StatsHikcentral />
        </div>
        <div>
          <StatsEstHikcentral />
        </div>
        <div>
          <StatsPersonHikcentral />
        </div>
        <div>
          <StatsGymHikcentral />
        </div>

      </div>
      
    </div>
  </admin-layout>
</template>

<script>
// @ is an alias to /src
import AdminLayout from '../components/layout/AdminLayout.vue'
import StatsHikcentral from '../components/estadisticas/StatsHikcentral.vue'
import StatsEstHikcentral from '../components/estadisticas/StatsEstHikcentral.vue'
import StatsPersonHikcentral from '../components/estadisticas/StatsPersonHikcentral.vue'
import StatsGymHikcentral from '../components/estadisticas/StatsGymHikcentral.vue'

export default {
  name: 'HomeView',
  components: {
    AdminLayout,
    StatsHikcentral,
    StatsEstHikcentral,
    StatsPersonHikcentral,
    StatsGymHikcentral
  },
}
</script>
