import { ref } from 'vue';
import { createLocalStore } from '@/utils/helpers';
import { getTableDataApi } from '@/api/table';
import { useListHelper } from '@/domain-ui/table/hooks/useListHelper';

export const key = Symbol('user');

export function store() {
  const loading = ref(false);

  const user = useListHelper(
    {
      query: {
        username: '',
        phone: '',
      },
      queryFn: getTableDataApi,
    },
    { loading },
  );

  return {
    loading,
    user,
  };
}

export const { useProvideStore, useStore } = createLocalStore(store);
