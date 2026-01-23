<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();
const route = useRoute();
</script>

<template>
  <div class="tooltip-right" :data-tip="showLabel ? '' : props.label" :class="{ tooltip: !showLabel }">
    <NuxtLink
        :to="props.href"
        class="flex gap-2 p-2 hover:bg-base-200 hover:cursor-pointer"
        :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
    >
      <Icon :name="props.icon" size="24" />
      <span v-if="showLabel">{{ props.label }}</span>
    </NuxtLink>
  </div>
</template>
