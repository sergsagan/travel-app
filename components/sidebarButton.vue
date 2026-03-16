<script setup lang="ts">
import type {RouteLocationRaw} from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: 'text-primary' | 'text-secondary' | 'text-accent';
}>();
const route = useRoute();
</script>

<template>
  <div
    class="tooltip-right"
    :data-tip="showLabel ? '' : props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
      :to="props.href || props.to"
      class="flex gap-2 p-2 hover:bg-base-200 hover:cursor-pointer flex-nowrap"
      :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
    >
      <Icon :name="props.icon" size="24" :class="props.iconColor" />
      <Transition name="grow">
        <span v-if="showLabel" class="text-md">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.3s;
}
.grow-leave-active {
  animation: grow 0.4s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
