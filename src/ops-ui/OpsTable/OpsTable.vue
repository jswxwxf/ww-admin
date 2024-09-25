<script>
import { nextTick, onUpdated, ref, toRefs, toValue, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProvideStore } from './store';
import OpsTableCustom from './OpsTableCustom.vue';
import { forEach, includes, isEmpty, some } from 'lodash';
import { globalQueryTriggered } from './helpers';

export function setup(props, { attrs, emit, expose }) {
  const defer = ref(true);

  setTimeout(() => (defer.value = false), 0);

  const route = useRoute();

  const table = ref();

  onUpdated(() => {
    nextTick(() => {
      reselectRows();
      if (table.value) {
        table.value.doLayout();
      }
    });
  });

  const { customedFields, selected, clearSelected, selectedValue } = useProvideStore(toRefs(props));

  watch(
    () => attrs.data,
    () => reselectRows(),
    { flush: 'post' },
  );

  // clear selection when route change
  watch(route, () => {
    if (props.autoClearSelection) {
      clearSelection();
    }
  });

  // select row when passed in selection changed
  watch(
    () => props.selection,
    () => {
      if (!props.selectable) {
        return;
      }
      selectRow(props.selection);
    },
    { immediate: true },
  );

  // clear selection when user query again
  watch(
    () => {
      return toValue(props.queryClearSelection) === null ? globalQueryTriggered.value : props.queryClearSelection;
    },
    () => {
      if (!props.selectable) {
        return;
      }
      clearSelection();
    },
  );

  function updateModel() {
    emit('update:selection', selectedValue.value);
  }

  function reselectRows() {
    forEach(attrs.data, (row) => {
      if (!selected.value[row[attrs['row-key']]]) {
        return;
      }
      table.value && table.value.toggleRowSelection(row, true);
    });
  }

  function needClearSelected() {
    return props.selectable && props.selectScope !== 'all';
  }

  function handlePage(e) {
    if (needClearSelected()) {
      clearSelection();
    }
    emit('page-changed', e);
  }

  function handlePageSize(e) {
    if (needClearSelected()) {
      clearSelection();
    }
    emit('size-changed', e);
  }

  function handleSelect(selection, row) {
    const checked = some(selection, [attrs['row-key'], row[attrs['row-key']]]);
    selected.value[row[attrs['row-key']]] = checked ? row : false;
    updateModel();
    emit('select', selection, row);
  }

  function handleSelectAll(selection) {
    emit('select-all', selection);
    // unselect all
    if (isEmpty(selection)) {
      forEach(attrs.data, (row) => {
        selected.value[row[attrs['row-key']]] = false;
      });
      updateModel();
      return;
    }
    // select all
    forEach(selection, (row) => {
      selected.value[row[attrs['row-key']]] = row;
    });
    updateModel();
  }

  function clearSelection() {
    clearSelected();
    table.value && table.value.clearSelection();
    updateModel();
  }

  const singleSelected = (row) => selected.value[row[attrs['row-key']]];

  function handleSingleSelected(row) {
    selectRow([row]);
    updateModel();
    emit('select', [row], row);
  }

  function selectRow(selection) {
    clearSelected();
    table.value && table.value.clearSelection();
    forEach(toValue(selection), (row) => {
      selected.value[row[attrs['row-key']]] = row;
    });
  }

  expose({
    clearSelection,
    selectRow,
  });

  return {
    defer,
    table,
    customedFields,
    selected,
    selectedValue,
    handlePage,
    handlePageSize,
    handleSelect,
    handleSelectAll,
    singleSelected,
    handleSingleSelected,
  };
}

export default {
  inheritAttrs: false,
  name: 'OpsTable',
  emits: ['page-changed', 'size-changed', 'select', 'select-all', 'update:selection'],
  components: {
    OpsTableCustom,
  },
  props: {
    loading: {
      type: [Boolean, String],
      default: false,
    },
    pagiable: {
      type: Boolean,
      default: true,
    },
    paging: {
      type: Object,
      default() {
        return {
          pageNumber: 1,
          pageSize: 1,
          total: 1,
        };
      },
    },
    customizable: {
      type: Boolean,
      default: true,
    },
    showNo: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selectScope: {
      type: String,
      default: 'page',
      validator(value) {
        return includes(['all', 'page', 'single'], value);
      },
    },
    selection: {
      type: Array,
      default: () => [],
    },
    widgetColumnProps: {
      type: Object,
      default() {
        return {};
      },
    },
    queryClearSelection: {
      type: [Boolean, Object],
      default: null,
    },
    autoClearSelection: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    allFields: {
      type: Array,
      default(props) {
        return [...props.fields];
      },
    },
    fieldsDef: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup,
};
</script>

<template>
  <div v-if="!defer" class="ops-table">
    <div class="ops-table__action" v-if="$slots.action || $slots['action-right'] || customizable">
      <div>
        <slot name="action" />
      </div>
      <div>
        <slot name="action-right" />
        <OpsTableCustom v-if="customizable" />
      </div>
    </div>
    <div v-if="loading" v-loading="loading" class="ops-table__table" />
    <div v-else class="ops-table__table">
      <el-table
        ref="table"
        border
        scrollbar-always-on
        height="100%"
        @select="handleSelect"
        @select-all="handleSelectAll"
        :tooltip-options="{
          popperClass: 'ops-table__overflow-tooltip',
        }"
        v-bind="$attrs"
      >
        <el-table-column
          v-if="selectable && selectScope === 'single'"
          class-name="widget-column"
          fixed="left"
          width="50"
          v-bind="widgetColumnProps"
        >
          <template #default="{ row }">
            <el-radio v-if="singleSelected(row)" size="small" @change="handleSingleSelected(row)" />
            <el-radio v-else size="small" :model-value="false" @change="handleSingleSelected(row)" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="selectable && selectScope !== 'single'"
          type="selection"
          reserve-selection
          width="50"
          fixed="left"
          v-bind="widgetColumnProps"
        />
        <el-table-column v-if="showNo" label="No" type="index" width="55" fixed="left" />
        <slot :customed-fields="customedFields" />
      </el-table>
    </div>
    <div v-if="pagiable" class="ops-table__pagination">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :current-page="paging.pageNumber"
        :page-size="paging.pageSize"
        :total="paging.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePage"
        @size-change="handlePageSize"
      />
      <div class="gap" />
      <el-text v-if="selectable && selectScope === 'all'" class="selection-count">
        {{ $t(`common.selected`, [selectedValue.length]) }}
      </el-text>
    </div>
  </div>
</template>

<style lang="less" scoped src="./OpsTable.less" />

<style lang="less">
.ops-table__overflow-tooltip {
  overflow-wrap: anywhere;
  max-width: 50%;
  white-space: pre-wrap;
}
</style>
