<script>
import { nextTick, ref } from 'vue';

export function setup(props, { expose }) {
  const panel = ref();
  const visible = ref(false);

  function setRef(ref) {
    panel.value = ref;
  }

  async function show(...args) {
    visible.value = true;
    await nextTick();
    try {
      return await panel.value.show(...args);
    } catch (e) {
      throw new Error('cancel', { cause: e });
    } finally {
      // leave time to let animation finish
      setTimeout(() => {
        visible.value = false;
      }, 300);
    }
  }

  expose({
    show,
  });

  return {
    panel,
    visible,
    setRef,
  };
}

export default {
  name: 'OpsDestroyable',
  setup,
};
</script>

<template>
  <slot v-if="visible" :setRef="setRef" />
</template>
