<!-- <script>
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
</script> -->

<script setup>
defineOptions({
  name: 'DmCriteria',
});

defineProps({
  model: {
    type: Object,
    default() {
      return {
        advanced: [],
      };
    },
  },
});
</script>

<template>
  <div class="dm-criteria">
    <el-form :model="model" inline action="javascript:void(0)">
      <el-card body-class="flex flex-row">
        <slot />
      </el-card>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.dm-criteria {
  .el-card {
    :deep(.el-card__body) {
      @apply pb-2;
    }
  }
}
</style>
