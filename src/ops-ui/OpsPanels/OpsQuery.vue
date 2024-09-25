<script>
import { watch } from 'vue';

function setup(props, { emit }) {
  watch(
    () => props.show,
    (val) => {
      if (val === true) {
        emit('show');
      } else {
        emit('hide');
      }
    },
  );
}

export default {
  name: 'OpsQuery',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['show', 'hide'],
  setup,
};
</script>

<template>
  <div v-show="show" class="ops-query">
    <slot />
  </div>
</template>

<style lang="less" scoped src="./OpsQuery.less" />
