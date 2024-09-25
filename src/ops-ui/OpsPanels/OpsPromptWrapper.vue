<script>
import OpsDestroyable from './OpsPromptWrapper.vue';
import OpsPrompt from './OpsPanels/OpsPrompt.vue';
import { setPromptRef } from '@/utils/helpers';

function setup() {
  return {
    setPromptRef,
  };
}

export default {
  name: 'OpsPromptWrapper',
  components: {
    OpsDestroyable,
    OpsPrompt,
  },
  setup,
};
</script>

<template>
  <OpsDestroyable :ref="setPromptRef" v-slot="{ setRef }">
    <OpsPrompt :ref="setRef" />
  </OpsDestroyable>
</template>
