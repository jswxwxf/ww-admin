<script setup>
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

// defineOptions({
//   name: 'OpsQuery',
// });

// const props = defineProps({
//   show: {
//     type: Boolean,
//     default: true,
//   },
// });

// const emits = defineEmits(['show', 'hide']);
</script>

<template>
  <div class="dm-query app-container flex flex-col">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.dm-query {
  height: calc(100vh - var(var(--v3-navigationbar-height)));
  display: flex;

  :deep(.dm-criteria) {
    @apply mb-5;
  }

  :deep(.table) {
    @apply relative;
    @apply flex-1;
  }
}
</style>
