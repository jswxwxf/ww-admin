<script>
export default {
  name: 'OpsDrawer',
  props: {
    loading: {
      type: [Boolean, String],
      default: false,
    },
    waiting: {
      type: [Boolean, String],
      default: false,
    },
  },
};
</script>

<template>
  <el-drawer class="ops-drawer" :class="{ 'ops-drawer--waiting': waiting }">
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot v-if="!loading" :name="key" />
    </template>
  </el-drawer>
</template>

<style lang="less">
.ops-drawer {
  .el-button {
    padding: 12px 25px;
  }

  .el-drawer {
    &__footer {
      --el-drawer-padding-primary: 10px;
      background: #f5f5f5;
      text-align: left;
    }
  }

  .el-select {
    width: 100%;
  }

  &.ops-drawer--waiting {
    &:before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  }
}
</style>
