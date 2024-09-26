<script>
import { ref, computed, toValue, watch } from 'vue';
import FieldSelect from '../Fields/FieldSelect.vue';
import FieldDate from '../Fields/FieldDate.vue';
import FieldInput from '../Fields/FieldInput.vue';
import FieldRenderer from '../Fields/FieldRenderer.vue';
import { useStore } from './store';
import { tfv } from '@/locale';
import { kebabCase, partialRight } from 'lodash';

function setup(props, { attrs }) {
  const { model, fieldsDef, readonly, resolveRules, resolveAttrs } = useStore();
  const resolvedWidgetType = computed(() => {
    if (props.widgetType) {
      return props.widgetType;
    }
    const field = fieldsDef.value[props.field];
    if (!field) {
      return 'input';
    }
    return (
      {
        Enum: 'select',
        Option: 'select',
        WrapArray: 'array',
        Array: 'array',
        Date: 'date',
        File: 'file',
        Bool: 'select',
        BoolParam: 'select',
      }[field.type] || 'input'
    );
  });

  const options = ref();

  if (props.optionsLoader) {
    // loader with dependency watcher
    if (props.optionsLoader.watcher) {
      watch(
        () => props.optionsLoader.watcher(toValue(model)),
        () => props.optionsLoader.loader(options, toValue(model)),
        { immediate: true },
      );
    } else {
      // direct loader
      props.optionsLoader.loader(options, toValue(model));
    }
  }

  const placeholder = computed(() => {
    const field = fieldsDef.value[props.field];
    if (!field) {
      return '';
    }
    return tfv(field, 'tips') || tfv(field, 'displayName');
  });

  return {
    model,
    fieldsDef,
    readonly,
    resolveRules: partialRight(resolveRules, fieldsDef.value[props.field], attrs),
    resolveAttrs: partialRight(resolveAttrs, fieldsDef.value[props.field]),
    resolvedWidgetType,
    placeholder,
    options,
    kebabCase,
  };
}

export default {
  inheritAttrs: false,
  name: 'OpsFormItem',
  components: {
    FieldSelect,
    FieldInput,
    FieldDate,
    FieldRenderer,
  },
  props: {
    rules: {
      type: [Array, String],
      default() {
        return [];
      },
    },
    field: {
      type: String,
      default: '',
    },
    optionsLoader: {
      type: Object,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    widgetType: {
      type: String,
    },
  },
  setup,
};
</script>

<template>
  <template v-if="$slots[field]">
    <slot
      :name="field"
      :label="$tFieldVal(fieldsDef[field], 'displayName')"
      :prop="$getVal(fieldsDef[field], 'fieldName')"
      :readonly="readonly"
      :attrs="resolveAttrs($attrs)"
      :rules="resolveRules(rules)"
      :resolveRules="resolveRules"
      :resolveAttrs="resolveAttrs"
    />
  </template>
  <template v-else-if="$slots.default">
    <slot
      :label="$tFieldVal(fieldsDef[field], 'displayName')"
      :prop="$getVal(fieldsDef[field], 'fieldName')"
      :readonly="readonly"
      :attrs="resolveAttrs($attrs)"
      :rules="resolveRules(rules)"
      :resolveRules="resolveRules"
      :resolveAttrs="resolveAttrs"
    />
  </template>
  <el-form-item
    v-else
    :label="$tFieldVal(fieldsDef[field], 'displayName', ' ')"
    :prop="$getVal(fieldsDef[field], 'fieldName')"
    :class="[
      `ops-form-item ops-form-item--${kebabCase($getVal(fieldsDef[field], 'fieldName'))}`,
      { 'ops-form-item--hide-label': !showLabel },
    ]"
    :rules="resolveRules(rules)"
    v-label
  >
    <!-- <pre>{{ resolveRules(rules) }}</pre> -->
    <template #label="{ label }">
      <template v-if="$slots[`${field}-label`]">
        <slot :name="`${field}-label`" :label="label" />
      </template>
      <template v-else>{{ label }}</template>
    </template>
    <template v-if="readonly">
      <template v-if="$slots[`${field}-render`]">
        <slot
          :name="`${field}-render`"
          :placeholder="placeholder"
          :options="options"
          :attrs="resolveAttrs($attrs)"
          :resolveAttrs="resolveAttrs"
        />
      </template>
      <FieldRenderer v-else :value="model[field]" :field="fieldsDef[field]" :options="options" context="form" />
    </template>
    <template v-else-if="$slots[`${field}-widget`]">
      <slot
        :name="`${field}-widget`"
        :readonly="readonly"
        :placeholder="placeholder"
        :options="options"
        :attrs="resolveAttrs($attrs)"
        :resolveAttrs="resolveAttrs"
      />
    </template>
    <template v-else>
      <FieldSelect
        v-if="resolvedWidgetType === 'select'"
        :field="fieldsDef[field]"
        :placeholder="placeholder"
        :options="options"
        clearable
        v-bind="resolveAttrs($attrs)"
      />
      <FieldSelect
        v-else-if="resolvedWidgetType === 'array'"
        :field="fieldsDef[field]"
        :placeholder="placeholder"
        :options="options"
        filterable
        multiple
        clearable
        v-bind="resolveAttrs($attrs)"
      />
      <FieldDate
        v-else-if="resolvedWidgetType === 'date'"
        :field="fieldsDef[field]"
        :placeholder="placeholder"
        value-format="x"
        clearable
        v-bind="resolveAttrs($attrs)"
      />
      <FieldInput
        v-else-if="resolvedWidgetType === 'file'"
        :field="fieldsDef[field]"
        disabled
        v-bind="resolveAttrs($attrs)"
      />
      <FieldInput
        v-else
        :field="fieldsDef[field]"
        :placeholder="placeholder"
        show-word-limit
        clearable
        v-bind="resolveAttrs($attrs)"
      >
        <template v-if="$attrs.suffix" #suffix> {{ $attrs.suffix }} </template>
      </FieldInput>
    </template>
  </el-form-item>
</template>

<style lang="less" scoped>
:deep(.ops-form-item--hide-label) {
  .el-form-item__label {
    display: none !important;
  }
}
:deep(.el-upload__tip) {
  margin-top: -3px;
  margin-bottom: -10px;
}
</style>
