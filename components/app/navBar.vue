<script setup lang="ts">

</script>

<template>
  <div class="navbar bg-primary text-white">
    <div class="navbar-start">
      <NuxtLink to="/" class="text-xl">
        Travel App
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <ClientOnly>
        <AuthButton />
      </ClientOnly>
    </div>
  </div>
</template>
