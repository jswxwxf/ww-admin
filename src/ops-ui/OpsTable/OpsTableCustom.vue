<script>
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useStore } from './store';

export function setup() {
  const { allFields, fieldsDef, visibleFields, orderedFields, resetFields, applyFields } = useStore();

  const orderingFields = ref([]);
  const checkingFields = ref([]);
  const visible = ref(false);

  function init() {
    orderingFields.value = [...orderedFields.value];
    checkingFields.value = { ...visibleFields.value };
  }

  function handleConfirm() {
    applyFields(orderingFields.value, checkingFields.value);
    visible.value = false;
  }

  function handleReset() {
    resetFields(orderingFields, checkingFields);
  }

  return {
    allFields,
    fieldsDef,
    orderingFields,
    checkingFields,
    visible,
    init,
    handleConfirm,
    handleReset,
  };
}
export default {
  inheritAttrs: false,
  name: 'OpsTableCustom',
  components: {
    VueDraggable,
  },
  setup,
};
</script>

<template>
  <span class="ops-table__custom">
    <el-popover
      v-model:visible="visible"
      placement="bottom"
      width="400"
      trigger="click"
      popper-class="ops-table__custom__popover"
      @show="init"
      :title="$t('common.tableColCustom')"
      v-bind="$attrs"
    >
      <template #reference>
        <el-button type="primary">
          <svg class="icon filter" aria-hidden="true">
            <use xlink:href="#icon-filter" />
          </svg>
        </el-button>
      </template>
      <div class="category">
        <div class="category__title">
          <div>{{ $t('common.customCol') }}</div>
          <el-link type="primary" @click="handleReset">
            {{ $t('actions.reset') }}
          </el-link>
        </div>
        <VueDraggable v-model="orderingFields" animation="150" class="check-item">
          <div v-for="(field, index) in orderingFields" :key="index" class="check-field">
            <el-checkbox v-model="checkingFields[field]" :label="$tFieldVal(fieldsDef[field], 'displayName')" />
            <div class="gap" />
            <el-icon><Rank /></el-icon>
          </div>
        </VueDraggable>
      </div>
      <div class="footer">
        <el-button type="primary" @click="handleConfirm" role="confirm">
          {{ $t('actions.confirm') }}
        </el-button>
        <el-button @click="visible = false" role="cancel">
          {{ $t('actions.cancel') }}
        </el-button>
      </div>
    </el-popover>
  </span>
</template>

<style lang="less" scoped>
.ops-table__custom {
  .filter {
    color: white;
    width: 1.2em;
    height: 1.2em;
    margin: -2px 0;
  }
}
</style>

<style lang="less">
.ops-table__custom__popover {
  .el-popover__title {
    color: white;
    background-color: #0081ff;
    line-height: 38px;
    height: 38px;
    margin: -12px -12px 12px;
    padding: 0 8px;
    font-weight: 500;
    font-size: 16px;
  }

  .el-popper__arrow {
    &::before {
      background-color: #0081ff !important;
    }
  }

  .category {
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 16px;
    &__title {
      display: flex;
      justify-content: space-between;
    }
  }

  .check-item {
    margin-top: 8px;
    padding: 0 8px;
    max-height: 400px;
    overflow-y: auto;
    .gap {
      flex: 1;
    }
  }
  // .check-field + .check-field {
  //   color: #303133;
  // }

  .check-field {
    display: flex;
    height: 30px;
    align-items: center;
    background-color: white;
    padding: 0 0.5rem;
    .el-checkbox {
      color: #303133;
    }
    .el-icon {
      cursor: pointer;
    }
  }

  .footer {
    background: #f5f5f5;
    height: 52px;
    line-height: 52px;
    padding-left: 16px;
    box-sizing: border-box;
    margin: 0px -12px -12px;
  }
}
</style>
