<script>
import { ref, computed, toRefs, toValue } from 'vue';
import { genFileId } from 'element-plus';
import md5 from 'js-md5';
import { uploadFileAPI } from '@/api/operationJobMgmt';
import { uploadFileValidation } from '@/utils/common';
import { useI18n } from 'vue-i18n';
import { get } from 'lodash';

export function useUploadHelper({ props, emit, uploadRef }) {
  const { maxSize } = toRefs(props);
  const waiting = ref(false);
  const upload = ref(uploadRef);

  const { t } = useI18n();

  const type = computed(() => {
    return 'file';
  });

  const tip = computed(() => {
    const max = toValue(maxSize);
    let value = '';
    if (max > 1000000) {
      value = t('common.uploadTip', [Math.trunc(max / 1000000) + 'MB']);
    } else if (max > 0) {
      value = t('common.uploadTip', [Math.trunc(max / 1000) + 'KB']);
    }
    return value;
  });

  function handleUpload(file) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file.file);
    fileReader.onload = (e) => handleOnLoad(e, file);
  }

  function handleExceed(files) {
    upload.value.clearFiles();
    const file = files[0];
    file.uid = genFileId();
    upload.value.handleStart(file);
    handleUpload({ file });
  }

  async function handleOnLoad(e, file) {
    const formData = new FormData();
    const bodyData = e.target.result;
    const checksum = md5(bodyData);
    formData.append('file', file.file);
    const data = {
      file: formData,
      checksum: checksum,
    };

    try {
      if (!uploadFileValidation(file.file, props.maxSize, [])) {
        throw new Error('upload file invalid');
      }

      waiting.value = true;
      const result = await props.api(data);
      triggerUpdate([
        {
          md5: data.checksum,
          file: data.file,
          fileInfo: file.file,
          fileKey: get(result.data, 'data.fileKey'),
          data: get(result.data, 'data'),
        },
      ]);
    } catch (e) {
      triggerUpdate([]);
      upload.value.clearFiles();
    } finally {
      waiting.value = false;
    }

    return false; // Disable default upload action
  }

  function handleRemove() {
    triggerUpdate([]);
  }

  function triggerUpdate(fileList) {
    emit('change', fileList);
  }

  return {
    waiting,
    upload,
    type,
    tip,
    handleUpload,
    handleExceed,
    handleRemove,
  };
}

function setup(props, { emit }) {
  return useUploadHelper({ props, emit });
}

export default {
  name: 'FieldUpload',
  props: {
    field: {
      type: Object,
      default() {
        return {};
      },
    },
    maxSize: {
      type: Number,
      default: Infinity,
    },
    api: {
      type: Function,
      default: uploadFileAPI,
    },
  },
  emits: ['change'],
  setup,
};
</script>

<template>
  <el-upload
    ref="upload"
    class="field-upload"
    :class="{ 'field-upload--disabled': waiting }"
    :http-request="handleUpload"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :limit="1"
    action="/"
  >
    <el-button :loading="waiting" :disabled="waiting" size="small" type="primary">
      {{ $t('common.upload') }}
    </el-button>
    <template #tip>
      <div class="el-upload__tip">
        {{ tip }}
      </div>
    </template>
  </el-upload>
</template>

<style lang="less" scoped>
.field-upload {
  .el-button--small {
    padding: 16px 20px;
  }
}
</style>

<style lang="less" scoped>
.field-upload {
  &--disabled {
    cursor: not-allowed;
    :deep(.el-upload) {
      pointer-events: none;
    }
  }
}
</style>
