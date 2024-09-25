import { dayjs } from 'element-plus';
import { get, isObject } from 'lodash';

export function formatDate(datetime) {
  if (!datetime) {
    return '';
  }
  const parsedDate = dayjs(datetime);
  if (!parsedDate.isValid()) {
    return datetime;
  }
  return parsedDate.format('YYYY-MM-DD HH:mm:ss');
}

export function formatEnum(value, field) {
  return get(field, `_enumDict[${value}].enumValue`, value);
}

export function formatField(value, field) {
  if (!field) {
    if (isObject(value)) {
      return '';
    }
    return value;
  }
  if (field.type === 'Date') {
    return formatDate(value);
  }
  if (field.type === 'Bool') {
    return {
      true: 'Yes',
      false: 'No',
    }[value];
  }
  if (field.type === 'BoolParam') {
    return {
      Yes: 'Yes',
      No: 'No',
    }[value];
  }
  if (field.enumPOS) {
    return formatEnum(value, field);
  }
  return value;
}

export default {
  install: (app) => {
    const $filters = app.config.globalProperties.$filters || {};

    $filters.FormatDateEx = formatDate;

    $filters.FormatEnum = formatEnum;

    $filters.FormatField = formatField;

    app.config.globalProperties.$filters = $filters;
  },
};
