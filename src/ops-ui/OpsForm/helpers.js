import { nextTick, ref, toRaw, watch } from 'vue';
import { cloneDeep, includes, isEqual, noop } from 'lodash';
import * as thisModule from './helpers';

export function useFormHelper() {
  const originalModel = ref();
  const mode = ref();
  const model = ref({});
  const form = ref();
  const visible = ref(false);
  const p = { resolve: noop, reject: noop };

  // use for normal page with form
  function setup(data, options) {
    originalModel.value = cloneDeep(data);
    model.value = data;
    mode.value = options.mode;
    hasError.value = true;
    validateResult.value = {};
    watchChange();
    if (options.preValidate === false) {
      return;
    }
    watch(
      () => form.value,
      (val) => {
        if (!val) {
          return;
        }
        nextTick(() => form.value.validate());
      },
      { immediate: true },
    );
  }

  // use for popup window like drawer/dialog
  function show(data, options) {
    setup(data, options);
    visible.value = true;
    return new Promise((_resolve, _reject) => {
      p.resolve = _resolve;
      p.reject = _reject;
    });
  }

  function hide() {
    visible.value = false;
    p.resolve(true);
  }

  function cancel() {
    visible.value = false;
    p.reject('cancelled');
  }

  // handle submit button disabled

  const hasError = ref(true);
  const validateResult = ref({});

  const noneChanged = ref(true);

  let unwatchChange;
  function watchChange() {
    unwatchChange && unwatchChange();
    unwatchChange = watch(
      () => model.value,
      () => (noneChanged.value = isEqual(toRaw(originalModel.value), toRaw(model.value))),
      {
        deep: true,
      },
    );
  }

  async function handleValidated(prop, isValid) {
    validateResult.value[prop] = isValid;
    hasError.value = includes(validateResult.value, false);
  }

  return {
    originalModel,
    mode,
    model,
    form,
    visible,
    p,
    noneChanged,
    validateResult,
    hasError,
    setup,
    show,
    hide,
    cancel,
    handleValidated,
  };
}

export function elementIsVisibleInViewport(el) {
  const { top, bottom } = el.getBoundingClientRect();
  return top > 100 && bottom <= window.innerHeight - 100;
}

export async function getErrorEls(fnEls = () => document.getElementsByClassName('el-form-item__error')) {
  return new Promise((resolve, reject) => {
    let errEls = fnEls();
    if (errEls && errEls.length > 0) {
      resolve(errEls);
      return;
    }
    // try again after 600 ms
    setTimeout(() => {
      errEls = fnEls();
      if (errEls && errEls.length > 0) {
        resolve(errEls);
        return;
      }
      reject('not-found');
    }, 600);
  });
}

export async function scrollToErrorEl() {
  const errEls = await getErrorEls();
  if (errEls) {
    if (thisModule.elementIsVisibleInViewport(errEls[0])) {
      return;
    }
    errEls[0].scrollIntoView({
      block: 'end',
      inline: 'nearest',
    });
  }
}
