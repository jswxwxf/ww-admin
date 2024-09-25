<script>
import { computed } from 'vue';
import FieldSelect from '../Fields/FieldSelect.vue';
import FieldInput from '../Fields/FieldInput.vue';
import FieldDate from '../Fields/FieldDate.vue';
import { isEmpty } from 'lodash';
import { useStore } from './store';

function setup(props) {
  const { enterPressed } = useStore();

  const widgetType = computed(() => {
    if (props.field.type === 'Option') {
      return 'option';
    }
    if (props.field.enumPOS && !isEmpty(props.field.enumPOS)) {
      return 'select';
    }
    return (
      {
        Text: 'text',
        Date: 'date',
        Bool: 'bool',
      }[props.field.type] || 'input'
    );
  });

  return {
    widgetType,
    enterPressed,
  };
}

export default {
  name: 'OpsCriteriaAdvancedValue',
  components: {
    FieldSelect,
    FieldInput,
    FieldDate,
  },
  props: {
    modelValue: {
      type: [Number, Date, Array, String, Boolean],
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
  <FieldSelect
    v-if="widgetType === 'select'"
    :field="field"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    filterable
    clearable
  />
  <FieldSelect
    v-else-if="widgetType === 'bool'"
    :field="field"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    clearable
  />
  <FieldSelect
    v-else-if="widgetType === 'option'"
    :field="field"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    multiple
    filterable
    clearable
  />
  <div v-else-if="widgetType === 'date'">
    <FieldDate
      :field="field"
      :modelValue="[modelValue.startTime, modelValue.endTime]"
      @update:model-value="
        $emit('update:model-value', $event === null ? '' : { startTime: $event[0], endTime: $event[1] })
      "
      :start-placeholder="$t('common.startTime')"
      :end-placeholder="$t('common.endTime')"
      :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
      type="datetimerange"
      clearable
      unlink-panels
    />
  </div>
  <FieldInput
    v-else-if="widgetType === 'text'"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :field="field"
    type="text"
    :placeholder="$t('common.value')"
    @keyup.enter="enterPressed = !enterPressed"
  />
  <FieldInput
    v-else
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :field="field"
    :placeholder="$t('common.value')"
    @keyup.enter="enterPressed = !enterPressed"
  />
</template>
