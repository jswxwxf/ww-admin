<script>
import { ref, watchEffect } from 'vue';

function setup(props) {
  const enabled = ref(props.modelValue);

  watchEffect(() => (enabled.value = props.modelValue));

  return {
    enabled,
  };
}

export default {
  name: 'OpsEnabler',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  setup,
};
</script>

<template>
  <div class="ops-enabler">
    <div class="ops-enabler__content">
      <slot :enabled="enabled" />
      <div v-if="!enabled" class="ops-enabler__mask" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.ops-enabler {
  &__content {
    position: relative;
  }
  &__mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: white;
    opacity: 0.5;
  }
}
</style>
