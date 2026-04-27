<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { hasValidTo } from '~/utils/link';

const props = defineProps<{
  label?: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: 'text-primary' | 'text-secondary' | 'text-accent';
}>();
const route = useRoute();

const isActive = computed(() => {
  if (props.href) {
    return route.path === props.href
  }

  if (props.to) {
    if (typeof props.to === 'string') {
      return route.path === props.to
    }

    if ('name' in props.to && props.to.name) {
      return route.name === props.to.name
    }

    if ('path' in props.to && props.to.path) {
      return route.path === props.to.path
    }
  }

  return false
})
</script>

<template>
  <div
    class="tooltip-right"
    :data-tip="showLabel ? '' : props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
        v-if="props.to && props.label && hasValidTo(props.to)"
        :to="props.to"
        class="flex gap-2 p-2 hover:bg-base-200 flex-nowrap"
        :class="{
          'bg-base-200': isActive,
          'justify-center': !showLabel,
          'justify-start': showLabel
        }"
    >
      <Icon :name="props.icon" size="24" :class="props.iconColor" />
      <Transition name="grow">
        <span v-if="showLabel" class="truncate">{{ props.label || '' }}</span>
      </Transition>
    </NuxtLink>
    <NuxtLink
        v-else-if="props.href && props.label"
        :to="props.href"
        class="flex gap-2 p-2 hover:bg-base-200 flex-nowrap"
        :class="{
          'bg-base-200': isActive,
          'justify-center': !showLabel,
          'justify-start': showLabel
        }"
    >
      <Icon :name="props.icon" size="24" :class="props.iconColor" />
      <Transition name="grow">
        <span v-if="showLabel">{{ props.label }}</span>
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
