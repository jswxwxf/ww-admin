<script>
import { onMounted, onUpdated, ref } from 'vue';

function setup() {
  const content = ref();
  const overflowed = ref(false);

  function setRef(ref) {
    content.value = ref;
  }

  function setOverflowed() {
    const el = content.value;
    const value = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
    overflowed.value = value;
  }

  onUpdated(() => {
    setOverflowed();
  });

  onMounted(() => {
    setOverflowed();
  });

  return {
    setRef,
    overflowed,
  };
}

export default {
  name: 'OpsOverflow',
  setup,
};
</script>

<template>
  <slot :overflowed="overflowed" :setRef="setRef" />
</template>
