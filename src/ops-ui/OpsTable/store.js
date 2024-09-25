import { computed, ref } from 'vue';
import { createLocalStore } from '@/utils/helpers';
import { fromPairs, omitBy, values } from 'lodash';

export const key = Symbol('ops-table');

export function store({ fields, allFields, fieldsDef }) {
  // custom fields
  const orderedFields = ref();

  const visibleFields = ref();

  const customedFields = computed(() => orderedFields.value.filter((field) => visibleFields.value[field]));

  function resetFields(ordered, visible) {
    ordered.value = [...allFields.value];
    const unchecked = fromPairs(allFields.value.map((field) => [field, false]));
    const checked = fromPairs(fields.value.map((field) => [field, true]));
    visible.value = { ...unchecked, ...checked };
  }

  resetFields(orderedFields, visibleFields);

  function applyFields(ordered, checked) {
    orderedFields.value = [...ordered];
    visibleFields.value = { ...checked };
  }

  // selectable
  const selected = ref({});

  const selectedValue = computed(() => {
    const result = omitBy(selected.value, (checked) => !checked);
    return values(result);
  });

  function clearSelected() {
    selected.value = {};
  }

  return {
    fields,
    allFields,
    fieldsDef,
    orderedFields,
    visibleFields,
    customedFields,
    selected,
    selectedValue,
    resetFields,
    applyFields,
    clearSelected,
  };
}

export const { useProvideStore, useStore } = createLocalStore(key, store);
