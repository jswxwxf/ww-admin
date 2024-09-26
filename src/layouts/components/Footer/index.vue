<script lang="ts" setup>
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE;
</script>

<template>
  <footer class="layout-footer">MIT © 2021-PRESENT {{ VITE_APP_TITLE }}</footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  width: 100%;
  min-height: var(--v3-footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--el-text-color-placeholder);
  font-size: 0.8rem;
}
</style>
