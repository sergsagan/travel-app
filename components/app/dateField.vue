<script setup lang="ts">
import { Field } from 'vee-validate';
import { toDateTimeLocal, fromDateTimeLocal } from '~/utils/date';

const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, handleChange } = useField<number>(props.name, { initialValue: props.value });

defineOptions({
  inheritAttrs: false
});
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>

    <Field :name="props.name" v-slot="{ field, value }">
      <input
          type="datetime-local"
          :name="field.name"
          :value="toDateTimeLocal(value)"
          @input="e => field.onChange(fromDateTimeLocal((e.target as HTMLInputElement).value))"
          @blur="handleBlur"
          :disabled="props.disabled"
          class="input w-full"
          :class="{ 'input-error': props.error }"
      />
    </Field>

    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
