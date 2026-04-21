<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'number';
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field :name="props.name" v-slot="{ field }">
      <!-- text / number -->
      <input
          v-if="props.type === 'text' || props.type === 'number'"
          :type="props.type"
          v-bind="field"
          :disabled="props.disabled"
          class="input w-full"
          :class="{ 'input-error': props.error }"
      />

      <!-- textarea -->
      <textarea
          v-else
          v-bind="field"
          :disabled="props.disabled"
          class="textarea w-full h-36"
          :class="{ 'textarea-error': props.error }"
      />
    </Field>
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
