<script>
import { computed } from 'vue';
import { isEqual } from 'lodash';

function setup(props) {
  const hasDiff = computed(() => {
    if (props.value === null && props.beforeValue === '') {
      return false;
    }
    if (props.value === '' && props.beforeValue === null) {
      return false;
    }
    return !isEqual(props.value, props.beforeValue);
  });

  return { hasDiff };
}

export default {
  name: 'DiffValue',
  props: {
    value: {
      type: [String, Number, Date, Boolean],
      default: '',
    },
    beforeValue: {
      type: [String, Number, Date, Boolean],
      default: '',
    },
    field: {
      type: Object,
    },
  },
  setup,
};
</script>

<template>
  <div class="diff-value">
    <template v-if="hasDiff">
      <span class="text-old">
        {{ $filters.FormatField(beforeValue, field) }}
      </span>
      <span class="text-new">&#8594;</span>
      <span class="text-new">{{ $filters.FormatField(value, field) }}</span>
    </template>
    <template v-else>
      <span>{{ $filters.FormatField(value, field) }}</span>
    </template>
  </div>
</template>

<style lang="less" scoped>
.diff-value {
  span {
    margin-right: 0.5rem;
    display: inline-block;
    overflow-wrap: anywhere;
  }
  .text-old {
    color: #c0c3cc;
    text-decoration: line-through;
  }
  .text-new {
    color: #36a9f8;
    font-weight: bold;
  }
}
</style>
