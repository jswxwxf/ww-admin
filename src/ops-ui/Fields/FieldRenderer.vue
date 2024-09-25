<script>
import { computed, toRefs } from 'vue';
import { kebabCase, keyBy, isEmpty } from 'lodash';

function setup(props) {
  const { field } = toRefs(props);

  const dict = computed(() => keyBy(props.options, 'enumCode'));

  const renderType = computed(() => {
    if (props.type) {
      return props.type;
    }
    if (props.options) {
      return 'dict';
    }
    return kebabCase(field.value.type);
  });

  return {
    renderType,
    dict,
    isEmpty,
  };
}

export default {
  inheritAttrs: false,
  name: 'FieldRenderer',
  props: {
    value: {
      type: [String, Number, Array, Boolean],
    },
    field: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
    },
    options: {
      type: Array,
    },
  },
  setup,
};
</script>

<template>
  <div v-if="renderType === 'template'" class="field--template" v-html="value" />
  <span v-else-if="renderType === 'wrap-array'" class="field__wrap-array" v-bind="$attrs">
    <template v-for="(item, index) in value" :key="index">
      {{ $filters.FormatField(item, field) }}
      {{ field.unit }}
      {{ '\n' }}
    </template>
  </span>
  <span v-else-if="renderType === 'array'" class="field__array" v-bind="$attrs">
    <el-tag type="info" v-for="(item, index) in value" :disable-transitions="true" :key="index" size="default">
      {{ item }}
    </el-tag>
  </span>
  <span v-else-if="renderType === 'dict'" class="field__dict" v-bind="$attrs">
    <template v-if="!isEmpty(dict)">
      <el-tag type="info" v-for="(item, index) in value" :disable-transitions="true" :key="index" size="default">
        {{ $getVal(dict[item], 'enumValue', 'N/A') }}
      </el-tag>
    </template>
  </span>
  <template v-else> {{ $filters.FormatField(value, field) }} {{ field.unit }} </template>
</template>

<style lang="less" scoped>
.field__wrap-array {
  white-space: pre-line;
}

.field__array,
.field__dict {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>

<style lang="less" scoped src="./FieldRenderer.less" />
