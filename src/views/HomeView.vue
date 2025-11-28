<template>
  <admin-layout>
    <div class="relative w-full min-h-screen">
      <video autoplay loop muted class="absolute top-0 left-0 w-full h-full object-cover">
        <source src="/images/video-thumb/video.mp4" type="video/mp4">
      </video>
    </div>
  </admin-layout>
</template>

<script>
// @ is an alias to /src
import AdminLayout from '../components/layout/AdminLayout.vue'

export default {
  name: 'HomeView',
  components: {
    AdminLayout,
  },
}
</script>
