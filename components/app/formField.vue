<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'number';
  error?: string;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :type="props.type"
      :name="props.name"
      class="w-full"
      :class="{ 'input-error': props.error, 'input': props.type === 'text' || props.type === 'number', 'textarea': props.type === 'textarea' }"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
