import { ref } from 'vue';
import { purify, debounce } from '@/utils/helpers';

// export const globalQueryTriggered = ref(false);

export function useListHelper({ query, queryFn, pageSize: size = 10 }, store) {
  const { loading } = store;

  const queryForm = ref({ ...query });
  const tableData = ref([]);
  // const queryTriggered = ref(false);

  const initialPaging = {
    size,
    currentPage: 1,
    total: 0,
  };

  const paging = ref({
    ...initialPaging,
  });

  const activeQuery = ref({});

  function setActiveQuery() {
    // activeQuery.value = resolvedAdvanced();
    activeQuery.value = { ...queryForm.value };
  }

  // function resolvedAdvanced() {
  //   const result = { ...queryForm };
  //   if (result.advanced) {
  //     assign(result, fromPairs(result.advanced));
  //     delete result.advanced;
  //     delete result[''];
  //   }
  //   return result;
  // }

  setActiveQuery();

  function resetQuery() {
    // assign(queryForm, { ...query });
    queryForm.value = { ...query };
  }

  function setQuery(query) {
    queryForm.value = { ...query };
    // assign(queryForm, { ...query });
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
    paging.value.currentPage = lastPage;
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
    const data = result?.data ?? { total: 0, list: [] };
    tableData.value = data.list;
    paging.value.total = data.total;
    paging.value = {
      ...paging.value,
      total: data.total,
    };
  }

  function handleQuery() {
    // globalQueryTriggered.value = !globalQueryTriggered.value;
    // queryTriggered.value = !queryTriggered.value;
    resetPage();
    setActiveQuery();
    queryData();
  }

  function handlePage(page) {
    paging.value.currentPage = page;
    queryData();
  }

  function handlePageSize(pageSize) {
    paging.value.size = pageSize;
    queryData();
  }

  return {
    queryForm,
    activeQuery,
    tableData,
    // queryTriggered,
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
