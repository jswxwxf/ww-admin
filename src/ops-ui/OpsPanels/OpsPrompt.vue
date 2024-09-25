<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import OpsDialog from './OpsDialog.vue';
import OpsForm from '../OpsForm/OpsForm.vue';
import OpsFormItem from '../OpsForm/OpsFormItem.vue';
import OpsButton from '../OpsButton/OpsButton.vue';
import { tfv } from '@/locale';
import { lowerCase } from 'lodash';

function setup(props, { expose }) {
  const dialogVisible = ref(false);
  const title = ref();
  const form = ref();
  const model = ref({});
  const mode = ref();
  const showLabel = ref(false);
  const field = ref();
  const fields = ref();

  const { t } = useI18n();

  let resolve;
  let reject;

  async function handleConfirm() {
    await form.value.validate();
    dialogVisible.value = false;
    resolve(model.value);
  }

  function handleCancel() {
    dialogVisible.value = false;
    reject(model.value);
  }

  function showField(fieldDef = {}, opts = {}) {
    if (opts.title) {
      showLabel.value = true;
    }
    const options = {
      title: t('common.promptTitle', [lowerCase(tfv(fieldDef, 'displayName'))]),
      model: {},
      ...opts,
    };
    field.value = fieldDef.fieldName;
    title.value = options.title;
    model.value = options.model;
    fields.value = { [fieldDef.fieldName]: fieldDef };
    return _show();
  }

  function show(_mode, ...args) {
    mode.value = _mode;
    if (_mode === 'field') {
      return showField(...args);
    }
    return _show();
  }

  function _show() {
    dialogVisible.value = true;
    return new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
  }

  expose({
    show,
  });

  return {
    dialogVisible,
    title,
    form,
    model,
    mode,
    showLabel,
    field,
    fields,
    handleConfirm,
    handleCancel,
  };
}

export default {
  name: 'OpsPrompt',
  components: {
    OpsDialog,
    OpsForm,
    OpsFormItem,
    OpsButton,
  },
  setup,
};
</script>

<template>
  <div class="prompt">
    <OpsDialog
      :model-value="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      :title="title"
      destroy-on-close
    >
      <OpsForm ref="form" :model="model" :fields-def="fields">
        <OpsFormItem
          v-model="model[$getVal(fields[field], 'fieldName')]"
          :show-label="showLabel"
          :field="field"
          :rules="['field']"
          :required="true"
        />
      </OpsForm>
      <template #footer>
        <OpsButton @click="handleCancel">
          {{ $t('actions.cancel') }}
        </OpsButton>
        <OpsButton type="primary" @click="handleConfirm">
          {{ $t('actions.confirm') }}
        </OpsButton>
      </template>
    </OpsDialog>
  </div>
</template>

<style lang="less" scoped src="./OpsPrompt.less" />
