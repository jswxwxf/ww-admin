<script>
import { ref, toRefs } from 'vue';
import { useProvideStore } from './store';
import { scrollToErrorEl } from './helpers';
import { each } from 'lodash';

export function setup(props, { expose }) {
  useProvideStore(toRefs(props));

  const form = ref();

  async function validate() {
    try {
      return await form.value.validate();
    } catch (e) {
      if (props.scrollToError) {
        scrollToErrorEl();
      }
      throw new Error('validate failed', { cause: e });
    }
  }

  function clearValidate(...args) {
    return form.value.clearValidate(...args);
  }

  function validateField(...args) {
    return form.value.validateField(...args);
  }

  function clearValidates(fields, ...args) {
    return each(fields, (item) => {
      return clearValidate(item, ...args);
    });
  }

  expose({
    validate,
    clearValidate,
    clearValidates,
    validateField,
  });

  return {
    form,
  };
}

export default {
  name: 'OpsForm',
  props: {
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    fieldsDef: {
      type: Object,
      default: () => {},
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    scrollToError: {
      type: Boolean,
      default: true,
    },
    noform: {
      type: Boolean,
      default: false,
    },
  },
  setup,
};
</script>

<template>
  <div v-if="noform" class="ops-form">
    <slot />
  </div>
  <el-form
    v-else
    ref="form"
    :model="model"
    :label-suffix="readonly ? ':' : ''"
    :label-position="readonly ? 'right' : 'top'"
    action="javascript:void(0)"
    novalidate
    class="ops-form"
    :class="{ 'ops-form--readonly': readonly }"
  >
    <slot />
  </el-form>
</template>

<style lang="less" scoped>
:deep(.el-form) {
  &-item {
    margin-bottom: 25px;
    .el-input.is-disabled .el-input__inner {
      border: none !important;
    }

    &__content {
      align-items: flex-start;
    }
  }
}
.ops-form--readonly {
  :deep(.el-form-item) {
    align-items: baseline;
    margin-bottom: 0;
    &__label {
      &::before {
        display: none;
      }
      line-height: 1.5;
    }
    &__content {
      line-height: 2rem;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  }
}
</style>

<style lang="less">
.ops-form {
  .el-loading-mask {
    opacity: 0;
  }
}
</style>
