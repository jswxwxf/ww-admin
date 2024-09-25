<script>
export default {
  name: 'OpsDialog',
  props: {
    waiting: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <el-dialog class="ops-dialog" :class="{ 'ops-dialog--waiting': waiting }">
    <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]>
      <slot :name="key" />
    </template>
  </el-dialog>
</template>

<style lang="less">
.ops-dialog {
  .el-button {
    padding: 12px 25px;
  }

  .ops-dialog__form {
    &.ops-form,
    &.ops-form--readonly {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .ops-form-item {
        flex-basis: 50%;
        width: 50%;
        padding: 0 2rem;
        .el-select {
          width: 100%;
        }
      }
    }
    &.ops-form--readonly {
      .ops-form-item {
        margin-bottom: 25px;
      }
    }
  }

  &.ops-dialog--waiting {
    .el-dialog__body::before,
    .el-dialog__footer::before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
    }
  }

  .el-dialog {
    &__body {
      max-height: 600px;
      --el-dialog-padding-primary: 10px;
      overflow: auto;
      position: relative;
    }

    &__footer {
      --el-dialog-padding-primary: 10px;
      background: #f5f5f5;
      min-height: 60px;
      position: relative;
    }
  }

  .el-select {
    width: 100%;
  }
}
</style>
