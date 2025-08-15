<template>
  <div class="login-container">
    <a-form ref="loginForm" :model="userInfo" :rules="rules" layout="vertical" size="large" @submit-success="handleSubmit">
      <a-form-item field="email" :validate-trigger="['change', 'blur']" hide-label>
        <a-input v-model="userInfo.email" type="email" placeholder="请输入邮箱地址" allow-clear />
      </a-form-item>
      <a-form-item field="code" :validate-trigger="['change', 'blur']" hide-label>
        <InputVerifyCode v-model="userInfo.code" :account="userInfo.email" type="email" @change="onSendVerifyCode" />
      </a-form-item>
      <a-form-item field="invite_code" :validate-trigger="['change', 'blur']" hide-label>
        <a-input v-model="userInfo.invite_code" placeholder="邀请码（可注册后补填）" allow-clear />
      </a-form-item>
      <a-form-item hide-label>
        <AgreementNotice v-model="agreed" type="register" />
      </a-form-item>
      <a-button type="primary" size="large" html-type="submit" long :loading="loading" :disabled="!agreed"> 开始体验 </a-button>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useLoading } from '@/hooks';
  import { useUserStore } from '@/store';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { DEFAULT_ROUTE_NAME } from '@/router/constants';
  import { sendEmailCode } from '@/api/app';
  import InputVerifyCode from '@/components/input-verify-code/index.vue';
  import AgreementNotice from './AgreementNotice.vue';

  const { t } = useI18n();
  const userStore = useUserStore();
  const router = useRouter();
  const agreed = ref(false);

  const userInfo = reactive({
    type: 'email',
    email: '',
    code: '',
    invite_code: '',
  });

  const rules = {
    email: [
      { required: true, message: '请输入邮箱地址' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的邮箱地址' },
    ],
    code: [
      { required: true, message: '请输入验证码' },
      { len: 6, message: '验证码长度为6位' },
    ],
  };

  const { loading, setLoading } = useLoading();
  const loginForm = ref();
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      await userStore.login(values as any, 'email');
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || DEFAULT_ROUTE_NAME,
        query: { ...othersQuery },
      });
      Message.success(t('login.form.register.success'));
    } catch (err) {
      loginForm.value.setFields({
        password: {
          status: 'error',
          message: (err as Error).message,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSendVerifyCode = (account: string) => {
    sendEmailCode(account);
  };
</script>

<style lang="less" scoped></style>
