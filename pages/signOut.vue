<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.signOut()
})
</script>

<template>
  <div class="card bg-base-300 container mt-4 min-h-72 mx-auto flex flex-col justify-center items-center gaap-4">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>

<style scoped>

</style>
