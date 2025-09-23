<template>
  <div>
    <MailLoginForm />
    <!-- <a-tabs class="login-tab" :active-key="loginType" @change="onTabChange">
      <a-tab-pane key="mobile" title="手机号登录">
        <MobileLoginForm />
      </a-tab-pane>
      <a-tab-pane key="mail" title="邮箱登录">
        <MailLoginForm />
      </a-tab-pane>
      <a-tab-pane key="password" title="账号登录">
        <PasswordLoginForm />
      </a-tab-pane>
    </a-tabs> -->
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  // import MobileLoginForm from './components/MobileLoginForm.vue';
  // import PasswordLoginForm from './components/PasswordLoginForm.vue';
  import MailLoginForm from './components/MailLoginForm.vue';

  const props = defineProps<{ loginType: 'mobile' | 'password' }>();
  const emits = defineEmits(['update:loginType']);

  // const loginType = computed(() => props.loginType);

  function onTabChange(key: string) {
    emits('update:loginType', key as 'mobile' | 'password');
  }
</script>

<style lang="less" scoped>
  .login-tab {
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
