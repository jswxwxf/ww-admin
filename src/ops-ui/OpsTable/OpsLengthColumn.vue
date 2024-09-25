<script>
export default {
  name: 'OpsLengthColumn',
  props: {
    overflowed: {
      type: Boolean,
    },
    setRef: {
      type: Function,
    },
    value: {
      type: String,
      default() {
        return '';
      },
    },
    maxLength: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<template>
  <el-tooltip effect="dark" placement="top" popper-class="ops-wrap-column" :disabled="!overflowed">
    <div class="ops-table-column__wrap" :ref="setRef" :style="{ '-webkit-line-clamp': maxLength }">
      {{ value }}
    </div>
    <template #content>
      {{ value }}
    </template>
  </el-tooltip>
</template>

<style lang="less" scoped>
.ops-table-column__wrap {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>

<style lang="less">
.ops-wrap-column {
  overflow-wrap: anywhere;
  max-width: 50%;
  white-space: pre-wrap;
}
</style>
