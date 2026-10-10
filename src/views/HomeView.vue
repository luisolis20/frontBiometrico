<template>
  <admin-layout>
    <div class="relative w-full min-h-screen">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <ecommerce-metrics />
      </div>
    </div>
  </admin-layout>
</template>

<script>
// @ is an alias to /src
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/estadisticas/StatsHikcentral.vue'

export default {
  name: 'HomeView',
  components: {
    AdminLayout,
    EcommerceMetrics
  },
}
</script>
