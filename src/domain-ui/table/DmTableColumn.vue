<script setup>
import { computed } from 'vue';
import { useStore } from './store';
import { kebabCase } from 'lodash-es';

defineOptions({
  name: 'DmTableColumn',
});

const props = defineProps({
  field: {
    type: String,
    default: '',
  },
});

const { domain } = useStore();

console.log(domain.value.username.field);

const minWidth = computed(() => {
  const field = domain.value[props.field];
  let len = 6;
  if (field) {
    len = field.label?.length ?? 0;
    // len = Math.max(get(field.displayNameEn, 'length', 0), get(field.displayNameCn, 'length', 0));
  }
  return len * 13 + 20;
});
</script>

<!-- <script>
import { computed } from 'vue';
import OpsOverflow from '../OpsPanels/OpsOverflow.vue';
import OpsArrayColumn from './OpsArrayColumn.vue';
import OpsLengthColumn from './OpsLengthColumn.vue';
import FieldRenderer from '../Fields/FieldRenderer.vue';
import { useStore } from './store';
import { get, kebabCase } from 'lodash';

function setup(props) {
  const { fieldsDef } = useStore();

  const minWidth = computed(() => {
    const field = fieldsDef.value[props.field];
    let len = 6;
    if (field) {
      len = Math.max(get(field.displayNameEn, 'length', 0), get(field.displayNameCn, 'length', 0));
    }
    return len * 13 + 20;
  });

  return {
    fields: fieldsDef,
    minWidth,
    kebabCase,
  };
}

export default {
  name: 'OpsTableColumn',
  components: {
    OpsOverflow,
    OpsArrayColumn,
    OpsLengthColumn,
    FieldRenderer,
  },
  props: {
    field: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: 1,
    },
  },
  setup,
};
</script> -->

<template>
  <el-table-column
    :prop="domain[field]?.field"
    :label="domain[field]?.label"
    :min-width="minWidth"
    :class-name="`dm-table-column--${kebabCase(domain[field]?.field)}`"
    show-overflow-tooltip
  />
  <!-- <template #default="slotProps">
      <template v-if="$slots[field]">
        <slot :name="field" v-bind="slotProps" />
      </template>
      <template v-else-if="$slots.default">
        <slot v-bind="slotProps" />
      </template>
      <template v-else>
        <OpsOverflow v-if="$getVal(fields[field], 'type') === 'Array'" v-slot="overflowProps">
          <OpsArrayColumn
            :value="slotProps.row[field]"
            :index="slotProps.$index"
            :field="field"
            :fields="fields"
            v-bind="overflowProps"
          />
        </OpsOverflow>
        <OpsOverflow v-else-if="maxLength > 1" v-slot="overflowProps">
          <OpsLengthColumn :value="slotProps.row[field]" :max-length="maxLength" v-bind="overflowProps" />
        </OpsOverflow>
        <field-renderer :value="slotProps.row[field]" :field="fields[field]" />
      </template>
    </template>
  </el-table-column> -->
</template>
