<script>
import { ref, toRefs, watch } from 'vue';
import OpsCriteriaAdvanced from './OpsCriteriaAdvanced.vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { useProvideStore } from './store';

export function setup(props, { emit }) {
  const visible = ref(false);

  const { enterPressed } = useProvideStore(toRefs(props));

  watch(enterPressed, () => {
    emit('query');
  });

  return {
    visible,
    enterPressed,
  };
}

export default {
  name: 'OpsCriteria',
  components: {
    OpsCriteriaAdvanced,
    ArrowDown,
    ArrowUp,
  },
  props: {
    model: {
      type: Object,
      default() {
        return {
          advanced: [],
        };
      },
    },
    advanced: { type: Boolean, default: false },
    fields: { type: Array, default: () => [] },
    fieldsDef: { type: Object, default: () => {} },
  },
  emits: ['query'],
  setup,
};
</script>

<template>
  <div class="ops-criteria">
    <el-form :model="model" inline action="javascript:void(0)">
      <slot />
      <el-icon v-if="advanced" @click="visible = !visible" class="handle">
        <ArrowUp v-if="visible" />
        <ArrowDown v-else />
      </el-icon>
    </el-form>
    <template v-if="visible">
      <el-divider border-style="dashed" />
      <OpsCriteriaAdvanced>
        <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotProps">
          <slot :name="key" v-bind="slotProps" />
        </template>
      </OpsCriteriaAdvanced>
    </template>
  </div>
</template>

<style lang="less" scoped>
.ops-criteria {
  padding: 1rem;
  padding-bottom: 0;
  background-color: white;

  .el-form {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
    margin-bottom: 15px;
    .el-icon.handle {
      height: 38px;
    }
  }

  .el-divider--horizontal {
    margin: 0;
    border-color: gray;
  }

  .handle {
    cursor: pointer;
  }
}

.ops-criteria {
  :deep(.el-input.is-disabled) .el-input__inner {
    border: none !important;
  }

  :deep(.criteria-item) {
    flex-basis: 15rem;
  }
  :deep(.el-select),
  :deep(.el-input) {
    width: 100%;
  }
  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
  :deep(.gap) {
    flex: 1;
  }
  :deep(.el-button) {
    width: 7rem;
    &.is-plain {
      --el-button-hover-text-color: var(--el-color-primary);
      background-color: white;
    }
    .el-icon {
      margin-right: 0.5rem;
    }
    &.is-disabled {
      opacity: 0.5;
    }
  }
}
</style>
