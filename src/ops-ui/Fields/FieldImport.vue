<script>
import { computed, ref } from 'vue';
import { uploadFileAPI } from '@/api/operationJobMgmt';
import OpsButton from '../OpsButton/OpsButton.vue';
import { useUploadHelper } from './FieldUpload.vue';

function setup(props, { emit }) {
  const store = useUploadHelper({ props, emit });
  const container = ref();

  const isWaiting = computed(() => store.waiting.value || props.waiting);

  async function handleClick(e) {
    const cont = await props.beforeChooseFile(e);
    if (cont === false) {
      return;
    }
    const inputEl = container.value.querySelector(`input[type='file']`);
    inputEl && inputEl.click();
  }

  return {
    ...store,
    container,
    isWaiting,
    handleClick,
  };
}

export default {
  inheritAttrs: false,
  name: 'FieldImport',
  props: {
    maxSize: {
      type: Number,
      default: Infinity,
    },
    api: {
      type: Function,
      default: uploadFileAPI,
    },
    waiting: {
      type: Boolean,
    },
    waitingFullscreen: {
      type: Boolean,
    },
    beforeChooseFile: {
      type: Function,
      default() {
        return true;
      },
    },
  },
  components: {
    OpsButton,
  },
  emits: ['change'],
  setup,
};
</script>

<template>
  <div class="field-import" ref="container">
    <el-upload
      ref="upload"
      :class="{ 'field-import--disabled': isWaiting }"
      :http-request="handleUpload"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :limit="1"
      action="/"
      :show-file-list="false"
      v-bind="$attrs"
    >
      <div v-if="waitingFullscreen" v-loading.fullscreen.lock="isWaiting" element-loading-text="File Uploading.">
        <OpsButton type="primary" :loading="isWaiting" :disabled="isWaiting" @click.stop="handleClick">
          <el-icon><Upload /></el-icon>
          {{ $t('actions.import') }}
        </OpsButton>
      </div>
      <template v-else>
        <OpsButton type="primary" :loading="isWaiting" :disabled="isWaiting" @click.stop="handleClick">
          <el-icon><Upload /></el-icon>
          {{ $t('actions.import') }}
        </OpsButton>
      </template>
    </el-upload>
  </div>
</template>

<style lang="less" scoped src="./FieldImport.less" />
