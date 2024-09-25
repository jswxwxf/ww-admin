<script>
import { computed, ref, toRefs } from 'vue';
import * as helpers from './helpers';
import { tfv } from '@/locale';
import { isEmpty, trim } from 'lodash';

function setup(props, { emit, attrs }) {
  const { field } = toRefs(props);
  const inputRef = ref();

  helpers.setupI18nAware();

  const widgetType = computed(() => {
    if (field.value.type === 'Number') {
      return 'number';
    }
    if (field.value.maxLength >= 200) {
      return 'text';
    }
    return 'input';
  });

  const hasWordLimitAttr = computed(() => 'show-word-limit' in attrs && attrs['show-word-limit'] !== false);

  const common = computed(() => {
    const classes = ['field-input'];
    if (hasWordLimitAttr.value) {
      classes.push('field-input--show-word-limit');
    }
    const commonAttrs = {
      ref: inputRef,
      maxlength: field.value.maxLength,
      placeholder: tfv(field.value, 'displayName'),
      class: classes,
    };
    if (field.value.maxLength === -1) {
      delete commonAttrs.maxlength;
    }
    return commonAttrs;
  });

  function handleNumberInput(value) {
    const max = Math.pow(10, parseInt(field.value.maxLength));
    if (isEmpty(value)) {
      triggerUpdate(value);
      return;
    }
    value = parseFloat(value);
    if (value >= max) {
      triggerUpdate(max - 1);
      return;
    }
    triggerUpdate(value);
  }

  function handleTextAreaInput(value) {
    if (hasWordLimitAttr.value) {
      const textAreaEl = inputRef.value.textarea;
      // textarea element can be null because type can be override by form.js
      if (textAreaEl) {
        textAreaEl.scrollTop = textAreaEl.scrollHeight;
      }
    }
    triggerUpdate(value);
  }

  function handleTrim(e) {
    triggerUpdate(trim(e.target.value));
  }

  function triggerUpdate(value) {
    emit('update:modelValue', value);
  }

  return {
    widgetType,
    common,
    handleNumberInput,
    handleTextAreaInput,
    handleTrim,
  };
}

export default {
  name: 'FieldInput',
  props: {
    modelValue: {
      type: [String, Number],
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
  <el-input
    v-if="widgetType === 'number'"
    type="number"
    :model-value="modelValue"
    :placeholder="$tFieldVal(field, 'displayName')"
    @input="handleNumberInput"
    v-bind="common"
  >
    <template v-if="field.unit" #suffix> {{ field.unit }} </template>
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template>
  </el-input>
  <el-input
    v-else-if="widgetType === 'text'"
    type="textarea"
    :model-value="modelValue"
    :placeholder="$tFieldVal(field, 'displayName')"
    @input="handleTextAreaInput"
    :rows="field.maxLength >= 500 ? '4' : ''"
    @blur="handleTrim"
    v-bind="common"
  >
    <template v-if="field.unit" #suffix> {{ field.unit }} </template>
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template>
  </el-input>
  <el-input
    v-else
    :model-value="modelValue"
    :placeholder="$tFieldVal(field, 'displayName')"
    @input="$emit('update:modelValue', $event)"
    @blur="handleTrim"
    v-bind="common"
  >
    <template v-if="field.unit" #suffix> {{ field.unit }} </template>
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template>
  </el-input>
</template>

<style lang="less" scoped src="./FieldInput.less" />
