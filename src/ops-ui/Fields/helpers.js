import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormItem } from 'element-plus';

export function setupI18nAware() {
  const { formItem } = useFormItem();

  const { locale } = useI18n();

  watch(
    locale,
    () => {
      if (formItem && formItem.validateState === 'error') {
        formItem.validate('');
      }
    },
    {
      flush: 'post',
    },
  );
}
