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
      class="flex gap-2 p-2 hover:bg-base-200 hover:cursor-pointer flex-nowrap"
      :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
    >
      <Icon :name="props.icon" size="24" />
      <Transition name="grow">
        <span class="text-md" v-if="showLabel">{{ props.label }}</span>
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
