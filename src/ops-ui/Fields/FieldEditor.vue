<script>
import { nextTick, onBeforeUnmount, ref, shallowRef, watchEffect, computed } from 'vue';
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
import { i18nChangeLanguage } from '@wangeditor/editor';
import { useFormItem } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { tfv } from '@/locale';

function setup(props, { emit }) {
  const { formItem } = useFormItem();

  const { locale } = useI18n();

  const editor = shallowRef();
  const value = ref();

  watchEffect(() => (value.value = props.modelValue));

  watchEffect(() => {
    i18nChangeLanguage(locale.value);
  });

  const toolbarConfig = {
    toolbarKeys: [
      'headerSelect',
      'fontSize',
      'fontFamily',
      '|',
      'bold',
      'underline',
      'italic',
      'through',
      'sup',
      'sub',
      'color',
      'bgColor',
      'clearStyle',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'justifyLeft',
      'justifyRight',
      'justifyCenter',
    ],
  };

  const editorConfig = computed(() => ({
    placeholder: tfv(props.field, 'displayName'),
    MENU_CONF: {
      fontFamily: {
        fontFamilyList: ['Arial', 'Tahoma', 'Verdana', 'Times New Roman', 'Courier New'],
      },
    },
  }));

  onBeforeUnmount(() => {
    editor.value && editor.value.destroy();
  });

  function handleCreated(instance) {
    editor.value = instance;
  }

  function handleChange(e) {
    let html = e.getHtml();
    if (e.isEmpty()) {
      html = '';
    }
    value.value = html;
    emit('update:modelValue', html);
    nextTick(() => {
      // formItem.validate('blur')
      formItem.validate('change');
    });
  }

  return {
    locale,
    value,
    editor,
    toolbarConfig,
    editorConfig,
    handleCreated,
    handleChange,
  };
}

export default {
  name: 'FieldEditor',
  props: {
    modelValue: {
      type: [String],
      default: undefined,
    },
    field: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    Toolbar,
    Editor,
  },
  emits: ['update:modelValue'],
  setup,
};
</script>

<template>
  <div class="field-editor" :key="locale">
    <Toolbar class="field-editor__toolbar" :editor="editor" :default-config="toolbarConfig" mode="simple" />
    <Editor
      :model-value="value"
      class="field-editor__editor"
      :default-config="editorConfig"
      @onCreated="handleCreated"
      @onChange="handleChange"
      mode="simple"
    />
  </div>
</template>

<style lang="less" scoped>
.field-editor {
  border: 1px solid #ccc;
  min-height: 36px;
  width: 100%;

  &__toolbar {
    border-bottom: 1px solid #ccc;
  }
  &__editor {
    height: 300px !important;
    overflow-y: hidden;
  }
}
</style>

<style lang="less">
.field-editor {
  z-index: 100;
  .w-e-text-placeholder {
    top: 3px;
    font-style: normal;
  }
  .w-e-text-container {
    // padding-top: 5px;
    [data-slate-editor] {
      overflow-wrap: anywhere;
      padding: 5px 10px;
      * {
        line-height: 2;
        margin: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>

<style src="@wangeditor/editor/dist/css/style.css" />
