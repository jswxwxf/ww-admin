<script>
import { computed, toRefs } from 'vue';
import { tfv } from '@/locale';
import * as helpers from './helpers';

function setup(props) {
  const { field } = toRefs(props);

  helpers.setupI18nAware();

  const widgetType = computed(() => {
    if (field.value.type === 'Date') {
      return 'datetime';
    }
    return 'date';
  });

  const common = computed(() => {
    return {
      placeholder: tfv(field.value, 'displayName'),
    };
  });

  return {
    widgetType,
    common,
  };
}

export default {
  name: 'FieldDate',
  props: {
    modelValue: {
      type: [Number, Date, Array],
      default: undefined,
    },
    field: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['update:modelValue'],
  setup,
};
</script>

<template>
  <el-date-picker
    v-if="widgetType === 'datetime'"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    type="datetime"
    style="width: 100%"
    v-bind="common"
  />
  <el-date-picker
    v-else
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    type="date"
    value-format="x"
    style="width: 100%"
    v-bind="common"
  />
</template>
