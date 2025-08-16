<template>
  <div class="page-container">
    <AccountInfoCard title="账号信息" class="general-card" />
    <IdentityVerifiedCard v-if="isVerified" title="实名认证" class="general-card" />
    <AuthMethodList title="登录方式" class="general-card flex-1" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store';
  import AccountInfoCard from './components/AccountInfoCard.vue';
  import AuthMethodList from './components/AuthMethodList.vue';
  import IdentityVerifiedCard from './components/IdentityVerifiedCard.vue';

  defineOptions({ name: 'UserInfo' });

  const userStore = useUserStore();
  const isVerified = computed(() => userStore.userInfo?.identity_verified);
</script>

<style scoped lang="less"></style>
