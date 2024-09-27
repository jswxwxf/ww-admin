import { ref } from 'vue';
import { createInjectionState } from '@vueuse/core';
import { debounce as _debounce, omitBy } from 'lodash-es';
// import sanitizeHtml from 'sanitize-html';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
// import i18n from '@/locale';

const promptRef = ref();

export function setPromptRef(ref) {
  promptRef.value = ref;
}

export function generateId() {
  const crypto = window.crypto || window.msCrypto;
  var array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
}

export function debounce(fn, opts = {}) {
  return _debounce(fn, 600, {
    leading: true,
    trailing: false,
    ...opts,
  });
}

export function purify(obj) {
  return omitBy(obj, (val) => val === '' || val === undefined || val === null);
}

export const createLocalStore = (store) => {
  const [useProvideStore, useStore] = createInjectionState(store);
  return { useProvideStore, useStore };
};

// // doesn't work with pinia
// export function computedLazy(name, evalFn, defVal, options = {}) {
//   const opts = {
//     evaluating: ref(false),
//     eager: true,
//     ...options,
//   };
//   const lazyRef = ref(defVal);
//   let evaluated = false;

//   const lazyEval = async () => {
//     if (evaluated) {
//       return;
//     }
//     opts.evaluating.value = name;
//     try {
//       lazyRef.value = await evalFn();
//       evaluated = true;
//     } finally {
//       opts.evaluating.value = false;
//     }
//   };

//   function refresh() {
//     evaluated = false;
//     lazyEval();
//   }

//   return [
//     computed(() => {
//       if (opts.eager) {
//         lazyEval();
//       }
//       return lazyRef.value;
//     }),
//     refresh,
//   ];
// }

export function confirm(msg, opts = {}) {
  const options = {
    // title: i18n.global.t('status.warning'),
    // confirmButtonText: i18n.global.t('actions.confirm'),
    // cancelButtonText: i18n.global.t('actions.cancel'),
    type: 'warning',
    customClass: 'dm-confirm',
    confirmButtonClass: 'el-button--danger',
    ...opts,
  };
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(msg, options.title, options)
      .then(() => resolve('confirmed'))
      .catch(() => {
        reject('cancelled');
      });
  });
}

export function message(msg, opts = {}) {
  const options = {
    message: msg,
    type: 'success',
    grouping: true,
    customClass: 'dm-message',
    ...opts,
  };
  ElMessage(options);
}

// export function promptField(field, opts = {}) {
//   const options = {
//     remember: false,
//     ...opts,
//   };
//   let _model = options.model;

//   return async (model = {}) => {
//     options.model = _model || model;
//     if (!options.remember) {
//       options.model = model;
//     }
//     try {
//       _model = await promptRef.value.show('field', field, options);
//     } catch (e) {
//       _model = e.cause;
//       throw e;
//     }
//     return _model;
//   };
// }

export function loading(opts = {}) {
  const options = {
    lock: true,
    background: 'rgba(0, 0, 0, 0.5)',
    ...opts,
  };
  return ElLoading.service(options);
}

export function arrayMoveItem(array, from, to) {
  [array[from], array[to]] = [array[to], array[from]];
  return array;
}

export function arrayInsertAfter(array, index, ...elements) {
  array.splice(index, 0, ...elements);
  return array;
}

export function arrayRemove(array, index) {
  array.splice(index, 1);
  return array;
}

// export function paramToField(params) {
//   return keyBy(
//     map(params, (p) => ({
//       fieldName: camelCase(p.paramName),
//       displayNameEn: p.paramName,
//       type: p.paramType === 'Bool' ? 'BoolParam' : p.paramType,
//       required: true,
//       tipsEn: ' ',
//       ...p,
//       _def: p,
//       enumPOS: p.paramEnum,
//     })),
//     'fieldName',
//   );
// }

export async function namedPromise(name, p, res = false) {
  try {
    const result = await p;
    return { isError: false, result };
  } catch (e) {
    if (res) {
      return { isError: true, name, e };
    }
    const error = new Error();
    error.isError = true;
    error.name = name;
    error.e = e;
    throw error;
  }
}

// export function sanitize(html, options) {
//   const opts = {
//     ...options,
//   };
//   return sanitizeHtml(html, opts);
// }

export function setHistoryState(state, unused = '', url = undefined) {
  history.replaceState({ ...history.state, ['_dm-state']: JSON.stringify(state) }, unused, url);
}

export function getHistoryState(def) {
  const state = history.state['_dm-state'];
  if (state === undefined) {
    return def;
  }
  return JSON.parse(state);
}

// export function popupWindow(url, target, options = {}) {
//   const opts = {
//     width: 920,
//     height: 750,
//     ...options,
//   };
//   let top = window.outerHeight / 2 + window.screenY - opts.height / 2;
//   if (opts.top !== undefined) {
//     top = screen.availTop + opts.top;
//   }
//   let left = window.outerWidth / 2 + window.screenX - opts.width / 2;
//   if (opts.left !== undefined) {
//     left = screen.availLeft + opts.left;
//   }
//   const features = `
//         top=${top},
//         left=${left},
//         height=${opts.height},
//         width=${opts.width},
//         popup=yes,
//       `;
//   return window.open(url, target, features);
// }

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
