<script>
import { computed, nextTick, ref } from 'vue';
import { useStore } from './store';
import OpsCriteriaAdvancedValue from './OpsCriteriaAdvancedValue.vue';
import { arrayInsertAfter, arrayRemove } from '@/utils/helpers';
import { useI18n } from 'vue-i18n';
import { compact, flatten, includes } from 'lodash';

function setup() {
  const { advanced, fields, fieldsDef } = useStore();

  const { t } = useI18n();

  const advancedDiv = ref();

  const op = (f) => {
    if (!f) {
      return '--';
    }
    const field = fieldsDef.value[f];
    if (includes(['Text', 'Date', 'Array', 'Option'], field.type)) {
      return t('common.contains');
    }
    return '=';
  };

  const selectedFields = computed(() => compact(flatten(advanced.value.map((item) => item[0]))));

  const fieldDisabled = (field) => {
    return includes(selectedFields.value, field);
  };

  function handleInsert(index) {
    arrayInsertAfter(advanced.value, index + 1, ['', '']);
    // scroll to bottom if append to end
    if (advanced.value.length === index + 2) {
      nextTick(() => {
        advancedDiv.value && advancedDiv.value.scrollTo({ top: advancedDiv.value.scrollHeight });
      });
    }
  }

  function handleRemove(index) {
    arrayRemove(advanced.value, index);
    if (advanced.value.length === 0) {
      advanced.value = [['', '']];
    }
  }

  return {
    advancedDiv,
    advanced,
    fields,
    fieldsDef,
    selectedFields,
    fieldDisabled,
    op,
    handleInsert,
    handleRemove,
  };
}

export default {
  name: 'OpsCriteriaAdvanced',
  components: {
    OpsCriteriaAdvancedValue,
  },
  props: {
    teleported: {
      type: Boolean,
      default: true,
    },
  },
  setup,
};
</script>

<template>
  <div ref="advancedDiv" class="ops-criteria-advanced">
    <div v-for="(item, index) in advanced" :key="index" class="advanced__line">
      <el-select
        v-model="item[0]"
        clearable
        class="advanced__item advanced__field"
        @change="item[1] = ''"
        :teleported="teleported"
      >
        <el-option
          v-for="field in fields"
          :key="field"
          :disabled="fieldDisabled(field)"
          :label="$tFieldVal(fieldsDef[field], 'displayName')"
          :value="field"
        />
      </el-select>
      <div class="advanced__item advanced__op">{{ op(item[0]) }}</div>
      <div v-if="$slots[item[0]]" class="advanced__item advanced__value">
        <slot :name="item[0]" :item="item" :field="$getVal(fieldsDef, item[0])" />
      </div>
      <OpsCriteriaAdvancedValue
        v-else
        v-model="item[1]"
        :field="$getVal(fieldsDef, item[0])"
        clearable
        class="advanced__item advanced__value"
      />
      <el-button circle :disabled="advanced.length === fields.length" @click="handleInsert(index)">
        <el-icon><Plus /></el-icon>
      </el-button>
      <el-button circle @click="handleRemove(index)">
        <el-icon><Minus /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ops-criteria-advanced {
  margin: 15px 0;
  max-height: 14.5rem;
  overflow: auto;

  .advanced__line {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0.5rem;
    max-width: 50rem;

    & + .advanced__line {
      margin-top: 0.5rem;
    }
    .advanced__field {
      flex: 0.45;
    }
    .advanced__op {
      flex: 0.15;
      width: 200px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      text-align: center;
      color: #c0c3cc;
      line-height: 35px;
    }
  }
  .el-button.is-circle {
    width: 2.3rem;
    height: 2.3rem;
    margin-left: 0;
    .el-icon {
      margin-right: 0;
    }
  }
}

.ops-criteria {
  :deep(.el-input.is-disabled) .el-input__inner {
    border: none !important;
  }

  :deep(.criteria-item) {
    flex-basis: 15rem;
  }
  :deep(.el-select),
  :deep(.el-input) {
    width: 100%;
  }
  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
  :deep(.gap) {
    flex: 1;
  }
  :deep(.el-button) {
    width: 7rem;
    &.is-plain {
      --el-button-hover-text-color: var(--el-color-primary);
      background-color: white;
    }
    .el-icon {
      margin-right: 0.5rem;
    }
    &.is-disabled {
      opacity: 0.5;
    }
  }
}
.ops-criteria-advanced {
  .advanced__line {
    :deep(.advanced__value) {
      flex: 0.7;
      :deep(> *) {
        width: 100%;
      }
    }
  }
}
</style>
