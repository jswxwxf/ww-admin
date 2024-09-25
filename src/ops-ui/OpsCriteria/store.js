import { ref, watch } from 'vue';
import { createLocalStore } from '@/utils/helpers';
import { isEmpty } from 'lodash';

export const key = Symbol('ops-criteria');

export function store({ advanced: _advanced, model, fields, fieldsDef }) {
  const advanced = ref([['', '']]);

  // connect model advanced
  if (_advanced.value) {
    model.value.advanced = advanced;
  }

  // advanced must have one slot when reset
  watch(
    () => model.value.advanced,
    (value) => {
      if (isEmpty(value)) {
        model.value.advanced = [['', '']];
      }
    },
  );

  // signal to trigger ops critria query event
  const enterPressed = ref(false);

  return {
    advanced,
    enterPressed,
    fields,
    fieldsDef,
  };
}

export const { useProvideStore, useStore } = createLocalStore(key, store);
