<script setup lang="ts">

</script>

<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="text-xl">
        Travel App
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <a href="" class="btn btn-accent">
        Sign In with
        <Icon name="tabler:brand-github" size="24" />
      </a>
    </div>
  </div>
</template>
