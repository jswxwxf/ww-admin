<script lang="ts" setup>
import { computed } from 'vue';

// import { computed, watchEffect } from 'vue';
// import { storeToRefs } from 'pinia';
// import { useSettingsStore } from '@/store/modules/settings';
// import useResize from './hooks/useResize';
// import { useWatermark } from '@/hooks/useWatermark';
// import { useDevice } from '@/hooks/useDevice';
// import { useLayoutMode } from '@/hooks/useLayoutMode';
import Layout from './Layout.vue';
// import TopMode from './TopMode.vue';
// import LeftTopMode from './LeftTopMode.vue';
// import { Settings, RightPanel } from './components';
// import { getCssVariableValue, setCssVariableValue } from '@/utils';

// /** Layout 布局响应式 */
// useResize();

// const { setWatermark, clearWatermark } = useWatermark();
// const { isMobile } = useDevice();
// const { isLeft, isTop, isLeftTop } = useLayoutMode();
// const settingsStore = useSettingsStore();
// const { showSettings, showTagsView, showWatermark, showGreyMode, showColorWeakness } = storeToRefs(settingsStore);

const classes = computed(() => {
  return {
    // showGreyMode: showGreyMode.value,
    // showColorWeakness: showColorWeakness.value,
  };
});

// //#region 隐藏标签栏时删除其高度，是为了让 Logo 组件高度和 Header 区域高度始终一致
// const cssVariableName = '--v3-tagsview-height';
// const v3TagsviewHeight = getCssVariableValue(cssVariableName);
// watchEffect(() => {
//   showTagsView.value
//     ? setCssVariableValue(cssVariableName, v3TagsviewHeight)
//     : setCssVariableValue(cssVariableName, '0px');
// });
// //#endregion

// /** 开启或关闭系统水印 */
// watchEffect(() => {
//   showWatermark.value ? setWatermark(import.meta.env.VITE_APP_TITLE) : clearWatermark();
// });
</script>

<template>
  <div :class="classes">
    <Layout />
  </div>
</template>

<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>
