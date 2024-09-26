<script setup>
import { ref } from 'vue';
import DmQuery from '@/domain-ui/panels/DmQuery/DmQuery.vue';
import DmCriteria from '@/domain-ui/criteria/DmCriteria.vue';

defineOptions({
  name: 'User',
});

const searchData = ref({
  username: '',
  phone: '',
});
</script>

<template>
  <dm-query>
    <dm-criteria>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="searchData.username" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="searchData.phone" placeholder="请输入" />
      </el-form-item>
      <div class="flex-1" />
      <el-form-item>
        <el-button type="primary" :icon="Search">查询</el-button>
        <el-button :icon="Refresh">重置</el-button>
      </el-form-item>
    </dm-criteria>
    <div class="table">
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
      <div>Hello Table</div>
    </div>
  </dm-query>
</template>

<style lang="sass" scoped></style>
