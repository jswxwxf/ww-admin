<script>
import { toValue } from 'vue';
import { useEnumsStore } from '@/store/enums';
import { useI18n } from 'vue-i18n';
import * as helpers from './helpers';
import { noop } from 'lodash';

export function setup(props, { emit }) {
  const enums = useEnumsStore();

  helpers.setupI18nAware();

  const { t } = useI18n();

  let refresh = noop;

  function resolveOptions() {
    refresh = noop;
    if (props.options) {
      return toValue(props.options);
    }
    if (props.field.type === 'Bool') {
      return [
        { enumValue: t('common.no'), enumCode: false },
        { enumValue: t('common.yes'), enumCode: true },
      ];
    }
    if (props.field.type === 'BoolParam') {
      return [
        { enumValue: t('common.no'), enumCode: 'No' },
        { enumValue: t('common.yes'), enumCode: 'Yes' },
      ];
    }
    const optionKey = props.optionKey || props.field.fieldName;
    const result = enums[optionKey];
    if (result) {
      refresh = result[1];
      return result[0].value;
    }
    return props.field.enumPOS;
  }

  function handleChange(e) {
    emit('update:modelValue', e);
    emit('change', e);
  }

  function handleVisibleChange(visible) {
    if (visible) {
      refresh();
    }
    emit('visible-change', visible);
  }

  return {
    resolveOptions,
    handleChange,
    handleVisibleChange,
  };
}

export default {
  name: 'FieldSelect',
  props: {
    modelValue: {
      type: [String, Number, Array, Boolean],
      default: undefined,
    },
    field: {
      type: Object,
      default() {
        return {
          fieldName: 'not-defined',
          enumPOS: [],
        };
      },
    },
    optionKey: {
      type: String,
    },
    options: {
      type: Array,
    },
  },
  emits: ['update:modelValue', 'change', 'visible-change'],
  setup,
};
</script>

<template>
  <el-select
    :model-value="modelValue"
    :placeholder="$tFieldVal(field, 'displayName')"
    :reserve-keyword="false"
    @change="handleChange"
    @visible-change="handleVisibleChange"
  >
    <el-option v-for="item in resolveOptions()" :key="item.enumCode" :label="item.enumValue" :value="item.enumCode" />
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template>
  </el-select>
</template>
