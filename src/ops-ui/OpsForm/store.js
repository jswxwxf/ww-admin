import { toRaw, toValue } from 'vue';
import { createLocalStore } from '@/utils/helpers';
import fieldRules, { requiredRule } from './ruleHelpers';
import { compact, endsWith, flatMap, forEach, isArray, trimEnd } from 'lodash';

export const key = Symbol('ops-form');

export function store({ model, fieldsDef, readonly }) {
  function resolveRules(_ruleDefs, _field, _attrs) {
    const field = toRaw(_field);
    const attrs = toRaw(_attrs);
    const ruleDefs = isArray(_ruleDefs) ? _ruleDefs : [_ruleDefs];
    if (!field) {
      return [];
    }
    const rules = ruleDefs.map((def) => {
      if (def === 'required') {
        return requiredRule(true, attrs)(field, toValue(model), toValue(fieldsDef));
      }
      if (def === 'required-by-field') {
        return requiredRule(true, { ...attrs, byField: true })(field, toValue(model), toValue(fieldsDef));
      }
      if (def === 'field') {
        return fieldRules(attrs)(field, toValue(model), toValue(fieldsDef));
      }
      return def(field, toValue(model), toValue(fieldsDef));
    });
    return compact(flatMap(rules));
  }

  function resolveAttrs(_attrs, _field) {
    const attrs = toRaw(_attrs);
    delete attrs.required; // remove html native validate tooltip
    const field = toRaw(_field);
    let hasFn = false;
    forEach(attrs, (value, key) => {
      if (!endsWith(key, 'Fn')) {
        return;
      }
      hasFn = true;
      const newKey = trimEnd(key, 'Fn');
      attrs[newKey] = value(field, toValue(model), toValue(fieldsDef));
    });
    return hasFn ? attrs : _attrs;
  }

  return {
    model,
    fieldsDef,
    readonly,
    resolveRules,
    resolveAttrs,
  };
}

export const { useProvideStore, useStore } = createLocalStore(key, store);
