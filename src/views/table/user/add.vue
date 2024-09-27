<script setup>
import DmPage from '@/domain-ui/panels/DmPage/DmPage.vue';
</script>

<template>
  <dm-page>
    <div class="panel-title">Add User</div>
    <div class="dm-page__wrapper">
      <div class="dm-page__content dm-page__content--padding">
        <div v-for="(_, i) in Array(100).fill(1)" :key="i">hello table {{ i + 1 }}</div>
      </div>
    </div>
    <div class="dm-page__action">
      <el-button type="primary"> Execute </el-button>
      <el-button plain> Back </el-button>
    </div>
  </dm-page>
</template>

<style lang="scss" scoped></style>
