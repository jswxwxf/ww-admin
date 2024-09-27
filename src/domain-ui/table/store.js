import { computed, ref } from 'vue';
import { createLocalStore } from '@/utils/helpers';
import { fromPairs, omitBy, values } from 'lodash-es';

export function store({ fields, allFields, domain }) {
  /** 用户可以对表格列重新排序 */
  const orderedFields = ref();

  /** 用户可以选择只显示部分列 */
  const visibleFields = ref();

  /** 过滤出来要显示的列 */
  const customedFields = computed(() => orderedFields.value.filter((field) => visibleFields.value[field]));

  /** 恢复初始状态 */
  function resetFields(ordered, visible) {
    ordered.value = [...allFields.value];
    const unchecked = fromPairs(allFields.value.map((field) => [field, false]));
    const checked = fromPairs(fields.value.map((field) => [field, true]));
    visible.value = { ...unchecked, ...checked };
  }

  resetFields(orderedFields, visibleFields);

  /** 应用用户的定制状态 */
  function applyFields(ordered, checked) {
    orderedFields.value = [...ordered];
    visibleFields.value = { ...checked };
  }

  /** 用户选择的行 */
  const selected = ref({});

  const selectedValue = computed(() => {
    const result = omitBy(selected.value, (checked) => !checked);
    return values(result);
  });

  /** 清除用户选择的行 */
  function clearSelected() {
    selected.value = {};
  }

  return {
    fields,
    allFields,
    domain,
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

export const { useProvideStore, useStore } = createLocalStore(store);
