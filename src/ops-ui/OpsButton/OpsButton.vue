<script>
import { ref, computed } from 'vue';
import { allowClicking } from './store';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';

function setup(props, { emit }) {
  const btn = ref();
  const hint = ref();
  const disableTooltip = ref(false);
  const route = useRoute();

  const unavailable = computed(() => {
    const pageCode = route.meta.pageCode;
    if (!props.authCode) {
      return false;
    }
    return !allowClicking(pageCode, props.authCode);
  });

  const statusClass = computed(() => {
    if (unavailable.value) {
      return 'btn-unavailable';
    }
    if (props.disabled) {
      return 'btn-disabled';
    }
    return '';
  });

  function handleClick($event) {
    if (unavailable.value) {
      return;
    }
    if (props.disabled) {
      return;
    }
    disableTooltip.value = true;
    emit('click', $event);
    hint.value && hint.value.hide();
  }

  return {
    btn,
    hint,
    statusClass,
    unavailable,
    handleClick,
    isEmpty,
    disableTooltip,
  };
}

export default {
  name: 'OpsButton',
  props: {
    authCode: { type: String },
    icon: { type: String, default: '' },
    elIcon: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    iconClass: { type: String, default: 'icon' },
    disabled: { type: Boolean },
  },
  setup,
  emits: ['click'],
};
</script>

<template>
  <el-button v-if="!isEmpty($slots) && !unavailable" v-bind="$attrs" :class="[statusClass]" @click="handleClick">
    <slot />
  </el-button>
  <span class="svg-button" v-else>
    <el-tooltip
      ref="hint"
      :show-after="500"
      class="item"
      effect="dark"
      placement="top-start"
      :content="tooltip"
      :disabled="disableTooltip"
    >
      <svg v-if="icon" ref="btn" class="icon" :class="[iconClass, statusClass]" aria-hidden="true" @click="handleClick">
        <use :xlink:href="icon" />
      </svg>
      <component
        v-else
        ref="btn"
        class="is-el-icon"
        :class="[iconClass, elIcon, statusClass]"
        @click="handleClick"
        :is="elIcon"
      />
    </el-tooltip>
  </span>
</template>

<style lang="less" scoped>
.btn-unavailable {
  color: #c0c3cc;
  &:hover {
    cursor: not-allowed;
  }
}

.btn-disabled {
  opacity: 0.5;
  &:hover {
    cursor: not-allowed;
  }
}

.is-el-icon {
  height: 1.5rem;
  width: 1.5rem;
  vertical-align: -0.25rem;
  &:focus {
    outline: none;
  }
}

.el-button {
  :deep(.icon) {
    color: white;
    width: 1.4em;
    height: 1.4em;
    margin-right: 0.5em;
  }
  :deep(.el-icon) {
    margin-right: 0.5em;
  }
}
</style>
