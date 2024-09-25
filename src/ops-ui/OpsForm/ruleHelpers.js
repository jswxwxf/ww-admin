import i18n, { tfv } from '@/locale';
import { dayjs } from 'element-plus';
import { compact, each, flow, includes, isEmpty, map, partialRight, pick, trim } from 'lodash';

function t(key, args) {
  return i18n.global.t(`validate.${key}`, args);
}

export function checkIsEmpty(value) {
  return value === undefined || value === null || value === '' || value === 0;
}

export default function fieldRules(options = {}) {
  const opts = {
    whitespace: true,
    buildin: true,
    ...options,
  };
  const ruleOps = pick(opts, ['trigger']);
  return (field, model) => {
    const rules = [];
    if (opts.required) {
      rules.push(requiredRule(opts.whitespace, ruleOps)(field, model));
    }
    rules.push(typeRule()(field, model));
    if (opts.buildin) {
      rules.push(...buildinRules(ruleOps)(field, model));
    }
    if (field.pattern) {
      rules.push(patternRule(null, ruleOps)(field, model));
    }
    if (field.maxLength) {
      rules.push(maxLengthRule(field.maxLength, ruleOps)(field, model));
    }
    return rules;
  };
}

function buildinRules(options = {}) {
  return (field) => {
    const rules = [];
    if (field.fieldName === 'port') {
      rules.push(rangeRule(1, 65535)(field));
    }
    if (field.fieldName === 'timeLimit') {
      rules.push(rangeRule(1, 99999)(field));
    }
    return rules;
  };
}

export function requiredRule(whitespace = true, options = {}) {
  const opts = {
    byField: false,
    ...options,
  };
  return (field) => {
    let required = true;
    if (opts.byField) {
      required = field.required;
    }
    const rule = {
      ...typeRule(options)(field),
      required,
      message: t('required', [tfv(field, 'displayName')]),
      ...options,
    };
    if (includes(['Text'], field.type)) {
      rule.whitespace = whitespace;
    }
    return rule;
  };
}

export function requiredIfRule(condition = () => true, whitespace = true, options = {}) {
  return (field, model) => {
    if (condition(field, model)) {
      return requiredRule(whitespace, options)(field);
    }
    return { required: false };
  };
}

export function requiredAtLeastRule(targets = [], whitespace = true, options = {}) {
  return (field, model, fields) => {
    const msgArg = targets.map((item) => tfv(fields[item], 'displayName')).join(', ');
    return {
      message: t('requiredAtLeast', [msgArg]),
      validator(rule, value, cb) {
        const errors = [];
        const empty = flow(
          partialRight(map, (item) => (whitespace ? trim(model[item]) : model[item])),
          compact,
          isEmpty,
        )(targets);
        if (empty) {
          errors.push(new Error(rule.message));
        }
        return cb(errors);
      },
      ...options,
    };
  };
}

export function typeRule(options = {}) {
  return (field) => {
    let type = 'string';
    if (field.type === 'Number') {
      type = 'number';
    }
    if (includes(['WrapArray', 'Array'], field.type)) {
      type = 'array';
    }
    if (field.type === 'Date') {
      type = 'date';
    }
    if (field.type === 'Bool') {
      type = 'boolean';
    }
    return {
      type,
      message: t(`types.${type}`, [tfv(field, 'displayName')]),
      ...options,
    };
  };
}

export function rangeRule(min, max, options = {}) {
  return (field) => {
    const rule = {
      min,
      max,
      ...options,
    };
    if (field.type === 'Number') {
      return {
        ...rule,
        type: 'number',
        message: t('number.range', [tfv(field, 'displayName'), min, max]),
      };
    }
    return {
      ...rule,
      message: t('string.range', [tfv(field, 'displayName'), min, max]),
    };
  };
}

export function maxLengthRule(_max, options = {}) {
  return (field, model) => {
    if (includes(['WrapArray', 'Array'], field.type)) {
      return maxLengthArrayRule(_max, options)(field, model);
    }
    if (field.type === 'Date') {
      return undefined;
    }
    const max = _max || field.maxLength;
    if (max === -1) {
      return undefined;
    }
    return {
      max,
      message: t('maxLength', [tfv(field, 'displayName'), max]),
      validator(rule, value, cb) {
        const errors = [];
        if (value === undefined || value === null) {
          return cb(errors);
        }

        value = value + '';
        if (value.length > rule.max) {
          errors.push(new Error(rule.message));
        }
        return cb(errors);
      },
      ...options,
    };
  };
}

export function maxLengthArrayRule(_max, options = {}) {
  return (field) => {
    if (!includes(['WrapArray', 'Array'], field.type)) {
      return undefined;
    }
    const max = _max || field.maxLength;
    if (max === -1) {
      return undefined;
    }
    return {
      max,
      message: t('array.maxLength', [tfv(field, 'displayName'), max]),
      validator(rule, array, cb) {
        const errors = [];
        if (checkIsEmpty(array)) {
          return cb(errors);
        }

        each(array, (value) => {
          value = value + '';
          if (value.length > rule.max) {
            errors.push(new Error(rule.message));
          }
        });

        return cb(errors);
      },
      ...options,
    };
  };
}

export function patternRule(_pattern, options = {}) {
  return (field) => {
    if (includes(['WrapArray'], field.type)) {
      return undefined;
    }
    const pattern = _pattern || new RegExp(field.pattern);
    return {
      pattern,
      message: tfv(field, 'errMessage') || t('pattern.mismatch', [tfv(field, 'displayName'), pattern]),
      ...options,
    };
  };
}

export function beforeRule(target, options = {}) {
  return (field, model, fields) => {
    return {
      message: t('date.before', [tfv(field, 'displayName'), tfv(fields[target], 'displayName')]),
      validator(rule, value) {
        const errors = [];
        if (checkIsEmpty(value)) {
          return errors;
        }

        if (dayjs(value).isSameOrAfter(dayjs(model[target]))) {
          errors.push(new Error(rule.message));
        }
        return errors;
      },
      ...options,
    };
  };
}

export function afterRule(target, options = {}) {
  return (field, model, fields) => {
    return {
      message: t('date.after', [tfv(field, 'displayName'), tfv(fields[target], 'displayName')]),
      validator(rule, value) {
        const errors = [];
        if (checkIsEmpty(value)) {
          return errors;
        }

        if (dayjs(value).isSameOrBefore(dayjs(model[target]))) {
          errors.push(new Error(rule.message));
        }
        return errors;
      },
      ...options,
    };
  };
}
