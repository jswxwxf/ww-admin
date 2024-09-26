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

.field-labels {
  width: 100%;

  &__line {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.3rem;

    :deep(.el-form-item) {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      &__error {
        display: none;
      }
    }

    &.show-error {
      :deep(.el-form-item) {
        padding-top: 1px;
        &__error {
          display: block;
          position: unset;
        }
      }
    }

    .is-error {
      scroll-margin: 300px;
    }

    .field-labels__field {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &-key {
        flex: 0.4;
      }
      &-value {
        flex: 0.6;
      }
    }
  }

  &__header {
    height: 2rem;
    line-height: 2rem;
    .field-labels__field {
      text-align: center;
      font-weight: bold;
    }
    .el-button {
      visibility: hidden;
    }
  }

  &__line + &__line {
    margin-top: 0.3rem;
  }

  &__content.is-scrollable {
    height: 14rem;
    max-height: 14rem;
    overflow: auto;
  }

  .el-button.is-circle {
    width: 2.3rem;
    height: 2.3rem;
    margin-left: 0;
    padding: 0;
    .el-icon {
      margin-right: 0;
    }
    &.is-disabled {
      opacity: 0.5;
    }
  }
}

.field--template {
  white-space: pre-line;
  :deep(*) {
    margin: 0;
  }
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-bottom: 1rem;
  }
}

.field-renderer-labels {
  width: 100%;
  position: relative;
  top: 6px;

  :deep(.el-table) {
    .el-table__cell {
      padding: 5px 0;
    }
    th,
    td {
      vertical-align: top;
      height: 32px;
      .cell {
        word-break: initial;
      }
    }
  }
}
</style>
