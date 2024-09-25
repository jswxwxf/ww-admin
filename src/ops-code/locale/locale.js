import { computed, toValue } from 'vue';
import { createI18n } from 'vue-i18n';
import customZHCN from './lang/zh-CN';
import customENUS from './lang/en-US';
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
import Cookies from 'js-cookie';

const messages = {
  'zh-CN': customZHCN,
  'en-US': customENUS,
};

const lang = Cookies.get('lang') || 'en-US';

const i18n = createI18n({
  allowComposition: true,
  locale: lang,
  fallbackLocale: 'en-US',
  messages,
});

// translate Field properly, default to En
export function tf(field, prop, defVal) {
  return computed(() => {
    if (!field) {
      return defVal;
    }
    const locale = toValue(i18n.global.locale);
    const suffix = locale === 'zh-CN' ? 'Cn' : 'En';
    const _prop = prop + suffix;
    return field[_prop] || field[prop + 'En'];
  });
}

// translate Field property to value
export function tfv(...args) {
  return toValue(tf(...args));
}

export default i18n;
