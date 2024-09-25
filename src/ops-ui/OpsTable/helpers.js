import { reactive, ref } from 'vue';
import { assign, fromPairs, get } from 'lodash';
import { purify, debounce } from '@/utils/helpers';

export const globalQueryTriggered = ref(false);

export function useListHelper({ query, queryFn, pageSize = 10 }, store) {
  const { loading } = store;

  const queryForm = reactive({ ...query });
  const tableData = ref([]);
  const queryTriggered = ref(false);

  const initialPaging = {
    pageSize,
    pageNumber: 1,
    total: 0,
  };

  const paging = ref({
    ...initialPaging,
  });

  const activeQuery = ref();

  function setActiveQuery() {
    activeQuery.value = resolvedAdvanced();
  }

  function resolvedAdvanced() {
    const result = { ...queryForm };
    if (result.advanced) {
      assign(result, fromPairs(result.advanced));
      delete result.advanced;
      delete result[''];
    }
    return result;
  }

  setActiveQuery();

  function resetQuery() {
    assign(queryForm, { ...query });
  }

  function setQuery(query) {
    assign(queryForm, { ...query });
    setActiveQuery();
  }

  function setPage(newPaging) {
    paging.value = {
      ...paging.value,
      ...newPaging,
    };
  }

  function resetPage() {
    paging.value = {
      ...initialPaging,
    };
  }

  function gotoLastPage() {
    const lastPage = Math.ceil(paging.value.total / paging.value.pageSize);
    paging.value.pageNumber = lastPage;
  }

  async function queryData() {
    loading.value = true;
    try {
      return await refreshData();
    } finally {
      loading.value = false;
    }
  }

  async function refreshData() {
    const payload = purify({
      ...activeQuery.value,
      ...paging.value,
    });

    const result = await queryFn(payload);
    const data = get(result, 'data.data', { list: [] });
    tableData.value = data.list;
    paging.value = {
      pageNumber: data.pageNum,
      pageSize: paging.value.pageSize,
      total: data.total,
    };
  }

  function handleQuery() {
    globalQueryTriggered.value = !globalQueryTriggered.value;
    queryTriggered.value = !queryTriggered.value;
    resetPage();
    setActiveQuery();
    queryData();
  }

  function handlePage(page) {
    paging.value.pageNumber = page;
    queryData();
  }

  function handlePageSize(pageSize) {
    paging.value.pageSize = pageSize;
    queryData();
  }

  return {
    queryForm,
    activeQuery,
    tableData,
    queryTriggered,
    paging,
    queryData: debounce(queryData),
    refreshData: debounce(refreshData),
    setActiveQuery,
    setQuery,
    resetQuery,
    setPage,
    resetPage,
    gotoLastPage,
    handlePage,
    handlePageSize,
    handleQuery,
  };
}
