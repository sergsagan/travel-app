<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <button :disabled="authStore.loading" @click="authStore.signIn" class="btn btn-accent">
    Sign In with
    <span v-if="authStore.loading" class="loading loading-spinner loading-md"></span>
    <Icon v-else name="tabler:brand-github" size="24" />
  </button>
</template>
