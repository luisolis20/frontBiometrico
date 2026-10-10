<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

      <InvitadosViews />

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
//import ComponentCard from "@/components/common/ComponentCard.vue";
import InvitadosViews from "@/components/Registro/Invitados.vue";
const currentPageTitle = ref("Registro Individual de Invitados");
</script>
