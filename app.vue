<script setup lang="ts">
  useSeoMeta({
    title: 'Travel App',
    description: 'Travel app with maps and saved locations',
  })

  useHead({
    htmlAttrs: {
      lang: 'en',
    },
  })
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
