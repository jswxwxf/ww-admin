<script>
export function setup(props, { emit }) {
  function handlePage(e) {
    emit('page-changed', e);
  }

  function handlePageSize(e) {
    emit('size-changed', e);
  }

  return {
    handlePage,
    handlePageSize,
  };
}

export default {
  inheritAttrs: false,
  name: 'OpsPageable',
  emits: ['page-changed', 'size-changed'],
  props: {
    loading: { type: Boolean, default: false },
    paging: {
      type: Object,
      default() {
        return {
          pageNumber: 1,
          pageSize: 1,
          total: 1,
        };
      },
    },
  },
  setup,
};
</script>

<template>
  <div class="ops-pageable">
    <div v-if="loading" v-loading="loading" class="ops-pageable__wrapper" />
    <div v-else class="ops-pageable__wrapper">
      <div class="ops-pageable__content">
        <slot />
      </div>
    </div>
    <div class="ops-pageable__pagination">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :current-page="paging.pageNumber"
        :page-size="paging.pageSize"
        :total="paging.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePage"
        @size-change="handlePageSize"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.ops-pageable {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  &__wrapper {
    flex: 1;
    position: relative;
  }

  &__content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }

  &__pagination {
    display: flex;
    align-items: center;
    font-weight: bold;
    padding-top: 1rem;
    border-top: 1px solid #f5f5f5;
  }
}
</style>

<style lang="less" scoped src="./OpsPageable.less" />
