<template>
  <a-tabs class="register-tab" :active-key="registerType" @change="onTabChange">
    <a-tab-pane key="mobile" title="手机号注册">
      <MobileRegisterForm />
    </a-tab-pane>
    <a-tab-pane key="email" title="邮箱注册">
      <EmailRegisterForm />
    </a-tab-pane>
    <a-tab-pane key="password" title="账号注册">
      <PasswordRegisterForm />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import MobileRegisterForm from './components/MobileRegisterForm.vue';
  import EmailRegisterForm from './components/EmailRegisterForm.vue';
  import PasswordRegisterForm from './components/PasswordRegisterForm.vue';

  const props = defineProps<{ registerType: 'mobile' | 'password' }>();
  const emits = defineEmits(['update:registerType']);

  const registerType = computed(() => props.registerType);

  function onTabChange(key: string) {
    emits('update:registerType', key as 'mobile' | 'password');
  }
</script>

<style lang="less" scoped>
  .register-tab {
    flex: 1;

    :deep(.arco-tabs-nav) {
      &::before {
        display: none;
      }
    }

    :deep(.arco-tabs-tab) {
      margin: 0;

      + .arco-tabs-tab {
        margin-left: 32px;
      }

      &:hover {
        .arco-tabs-tab-title::before {
          background: none;
        }
      }
    }
  }
</style>
