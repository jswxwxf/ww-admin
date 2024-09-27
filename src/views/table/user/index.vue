<script setup>
import { ref } from 'vue';
import DmQuery from '@/domain-ui/panels/DmQuery/DmQuery.vue';
import DmCriteria from '@/domain-ui/criteria/DmCriteria.vue';
import DmTable from '@/domain-ui/table/DmTable.vue';
import DmTableColumn from '@/domain-ui/table/DmTableColumn.vue';
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from '@element-plus/icons-vue';
import { useProvideStore } from './store';
import { userDomain } from '@/domain/user';

const { loading, user } = useProvideStore();

const queryForm = user.queryForm;

const waiting = ref(false);

user.queryData();
</script>

<template>
  <div class="app-container">
    <transition name="fade-transform" mode="out-in">
      <dm-query :show="$isMatch('/table/user')">
        <dm-criteria :model="queryForm">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="queryForm.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="queryForm.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search">查询</el-button>
            <el-button :icon="Refresh">重置</el-button>
          </el-form-item>
        </dm-criteria>
        <!-- <div class="table">
          <div class="dm-table__table">
            <div class="el-table">
              <pre>{{ user.tableData }}</pre>
            </div>
          </div>
        </div> -->
        <div v-loading="waiting" class="table">
          <dm-table
            :loading="loading"
            :data="user.tableData"
            :paging="user.paging"
            :fields="Object.keys(userDomain)"
            :domain="userDomain"
            @page-changed="user.handlePage"
            @size-changed="user.handlePageSize"
            stripe
          >
            <template #action>
              <el-button type="primary" :icon="CirclePlus">新增用户</el-button>
              <el-button type="danger" :icon="Delete">批量删除</el-button>
            </template>
            <template #action-right>
              <el-tooltip content="下载">
                <el-button type="primary" :icon="Download" circle />
              </el-tooltip>
              <el-tooltip content="刷新当前页">
                <el-button type="primary" :icon="RefreshRight" circle />
              </el-tooltip>
            </template>
            <template #default="{ customedFields }">
              <dm-table-column v-for="field in customedFields" :key="field" :field="field" />
              <!-- <el-table-column :label="$t(`common.action`)" width="120" align="center" fixed="right" v-slot="{ row }">
                <OpsButton
                  authCode="customerMgmtUpdate"
                  icon="#icon-edit"
                  :tooltip="$t('actions.edit')"
                  @click="handleEdit(row)"
                />
                <OpsButton
                  authCode="customerMgmtRead"
                  icon="#icon-history"
                  :tooltip="$t('actions.changeHistory')"
                  @click="handleHistory(row)"
                />
                <OpsButton
                  authCode="customerMgmtDelete"
                  icon="#icon-delete"
                  :tooltip="$t('actions.delete')"
                  icon-class="icon-danger"
                  @click="handleDelete(row)"
                />
              </el-table-column> -->
            </template>
          </dm-table>
        </div>
        <!-- <OpsDestroyable ref="drawer" v-slot="{ setRef }">
          <CMDrawer :ref="setRef" />
        </OpsDestroyable> -->
      </dm-query>
    </transition>
    <router-view />
  </div>
</template>

<script>
// import { ref } from 'vue';
// import { useI18n } from 'vue-i18n';
// import OpsQuery from '@/components/OpsPanels/OpsQuery.vue';
// import dm-table from '@/components/dm-table/dm-table.vue';
// import dm-tableColumn from '@/components/dm-table/dm-tableColumn.vue';
// import OpsCriteria from '@/components/OpsCriteria/OpsCriteria.vue';
// import OpsDestroyable from '@/components/OpsPanels/OpsDestroyable.vue';
// import OpsButton from '@/components/OpsButton/OpsButton.vue';
// import FieldInput from '@/components/Fields/FieldInput.vue';
// import CMDrawer from './CMDrawer.vue';
// import { confirm } from '@/utils/helpers';
// import { useFieldsStore } from '@/store/fields';
// import { useProvideStore } from './store';
// import { deleteCM } from './service';
// import { getFormatter } from './format';
// import { useRouter } from 'vue-router';

// function newCM() {
//   return {
//     customerIca: '',
//     customerCnName: '',
//     customerEnName: '',
//     customerType: '',
//   };
// }

// export function setup() {
//   const { loading: loadingFields, customerFields } = useFieldsStore();
//   const { loading, cm } = useProvideStore();
//   const { t } = useI18n();

//   const drawer = ref();
//   const waiting = ref(false);
//   const router = useRouter();

//   cm.queryData();

//   async function handleCreate() {
//     await drawer.value.show(newCM(), { mode: 'create' });
//     cm.resetPage();
//     cm.queryData();
//   }

//   async function handleEdit(row) {
//     await drawer.value.show({ ...row }, { mode: 'edit' });
//     cm.resetPage();
//     cm.queryData();
//   }

//   function handleHistory(row) {
//     router.push({
//       name: 'customerChangeHistory',
//       params: { resource: 'customer', dataId: row.customerId },
//     });
//   }

//   async function handleDelete(row) {
//     await confirm(t('common.deleteThisMsg'));
//     try {
//       waiting.value = true;
//       const result = await deleteCM({ customerIdList: [row.customerId] });
//       if (result === false) {
//         return;
//       }
//       cm.queryData();
//     } finally {
//       waiting.value = false;
//     }
//   }

//   return {
//     waiting,
//     loading,
//     loadingFields,
//     fields: customerFields,
//     ...cm,
//     getFormatter,
//     drawer,
//     handleCreate,
//     handleEdit,
//     handleDelete,
//     handleHistory,
//   };
// }

// export default {
//   components: {
//     OpsQuery,
//     OpsCriteria,
//     dm-table,
//     dm-tableColumn,
//     OpsDestroyable,
//     OpsButton,
//     FieldInput,
//     CMDrawer,
//   },
//   setup,
// };
</script>

<style lang="scss" scoped>
// .customer-mgmt {
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   gap: 0.5rem;

//   .table {
//     flex: 1;
//     padding: 1rem;
//     background-color: white;
//   }

//   :deep(.ops-table__table) {
//     position: relative;

//     .el-table {
//       position: absolute;
//       left: 0;
//       top: 0;
//       right: 0;
//       bottom: 0;
//       overflow-y: auto;
//     }
//   }
// }
</style>
