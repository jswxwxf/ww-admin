<script>
export default {
  name: 'OpsPage',
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
  components: {},
};
</script>

<template>
  <div v-loading="loading || waiting" class="ops-page" :class="{ 'ops-page--waiting': waiting }">
    <slot v-if="!loading" />
  </div>
</template>

<style lang="less" scoped src="./OpsPage.less" />
