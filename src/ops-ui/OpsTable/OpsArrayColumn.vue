<script>
export default {
  name: 'OpsArrayColumn',
  props: {
    overflowed: {
      type: Boolean,
    },
    setRef: {
      type: Function,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    index: { type: Number },
    field: {
      type: String,
    },
    fields: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<template>
  <el-tooltip effect="light" placement="top" popper-class="ops-array-column" :show-after="500" :disabled="!overflowed">
    <div class="ops-table-column__array" :ref="setRef">
      <el-tag type="info" v-for="(item, index) in value" :disable-transitions="true" :key="index" size="default">
        {{ item }}
      </el-tag>
    </div>
    <template #content>
      <el-table :data="value" size="default" height="250">
        <el-table-column :label="$tFieldVal(fields[field], 'displayName')" width="250" v-slot="{ row }">
          {{ row }}
        </el-table-column>
      </el-table>
    </template>
  </el-tooltip>
</template>

<style lang="less" scoped>
.ops-table-column__array {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-tag {
    margin-right: 5px;
  }
}
</style>

<style lang="less">
.ops-array-column {
  .el-table {
    margin: 0.5rem 0;
  }
}
</style>
