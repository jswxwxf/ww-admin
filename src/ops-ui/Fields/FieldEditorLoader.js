import { defineAsyncComponent } from 'vue';
import Loading from '../Loading.vue';

export default defineAsyncComponent({
  loader: () => import('./FieldEditor.vue'),
  loadingComponent: Loading,
});
