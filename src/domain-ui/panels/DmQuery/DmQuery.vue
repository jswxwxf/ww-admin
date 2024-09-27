<script setup>
defineOptions({
  name: 'DmQuery',
});

defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});
// import { watch } from 'vue';

// function setup(props, { emit }) {
//   watch(
//     () => props.show,
//     (val) => {
//       if (val === true) {
//         emit('show');
//       } else {
//         emit('hide');
//       }
//     },
//   );
// }

// export default {
//   name: 'OpsQuery',
//   props: {
//     show: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   emits: ['show', 'hide'],
//   setup,
// };
</script>

<template>
  <div v-show="show" class="dm-query">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.dm-query {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;

  :deep(.table) {
    flex: 1;
    padding: 1rem;
    background-color: white;
    position: relative;
  }

  :deep(.dm-table__table) {
    position: relative;
    .el-table {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
    }
  }

  // :deep(.panel-header) {
  //   font-weight: bold;
  //   font-size: 14px;
  //   line-height: 20px;
  //   margin: 1rem;
  //   display: flex;
  //   align-items: center;

  //   &:before {
  //     content: '|';
  //     margin-right: 0.5rem;
  //     position: relative;
  //     top: -1px;
  //   }

  //   > div {
  //     overflow: hidden;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //   }

  //   .gap {
  //     flex: 1;
  //   }
  // }

  // :deep(.panel-header--large) {
  //   font-size: 16px;
  // }

  // :deep(.panel-title) {
  //   color: #303133;
  //   font-weight: bold;
  //   font-size: 16px;
  //   line-height: 20px;
  //   margin: 1rem;
  // }

  // :deep(.text-normal) {
  //   font-style: normal;
  //   font-weight: normal;
  // }

  // :deep(.panel-header + .panel-header) {
  //   margin-top: 20rem;
  // }

  // :deep(.ops-table__table) {
  //   position: relative;
  //   .el-table {
  //     position: absolute;
  //     left: 0;
  //     top: 0;
  //     right: 0;
  //     bottom: 0;
  //     overflow-y: auto;
  //   }
  // }
}
</style>
