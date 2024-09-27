<script setup>
defineOptions({
  name: 'DmPage',
});

defineProps({
  loading: {
    type: [Boolean, String],
    default: false,
  },
  waiting: {
    type: [Boolean, String],
    default: false,
  },
});
</script>

<template>
  <div v-loading="loading || waiting" class="dm-page">
    <slot v-if="!loading" />
  </div>
</template>

<style lang="scss" scoped>
.dm-page {
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.panel-header) {
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    margin: 1rem;
    display: flex;
    align-items: center;

    &:before {
      content: '|';
      margin-right: 0.5rem;
      position: relative;
      top: -1px;
    }

    > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .gap {
      flex: 1;
    }
  }

  :deep(.panel-header--large) {
    font-size: 16px;
  }

  :deep(.panel-title) {
    color: #303133;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    margin: 1rem;
  }

  :deep(.text-normal) {
    font-style: normal;
    font-weight: normal;
  }

  :deep(.panel-header + .panel-header) {
    margin-top: 20rem;
  }

  :deep(.dm-page__wrapper) {
    flex: 1;
    position: relative;
  }

  :deep(.dm-page__content) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }

  :deep(.dm-page__content--padding) {
    padding: 1rem 3rem;
  }

  :deep(.dm-page__action) {
    position: relative !important;
    padding: 1rem 0;
    margin: 0 1rem;
    border-top: 1px solid #ececec;
    .el-button {
      width: 7rem;
    }
  }

  :deep(.dm-page__form) {
    &.ops-form,
    &.ops-form--readonly {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .ops-form-item {
        flex-basis: 50%;
        width: 50%;
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

  // &.dm-page--waiting {
  //   :deep(.el-loading-mask) {
  //     opacity: 0;
  //   }
  // }
}
</style>
