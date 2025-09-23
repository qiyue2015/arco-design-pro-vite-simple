<template>
  <div class="auth-container">
    <div class="logo">
      <div class="logo-text">{{ appStore?.app_name }}</div>
      <!-- <a-divider direction="vertical" /> -->
      <!-- <div v-if="$route.name === 'login'" class="login-text">登录/注册</div> -->
      <!-- <div v-if="$route.name === 'register'" class="login-text">注册</div> -->
    </div>
    <div class="content">
      <div class="content-inner flex flex-col gap-4">
        <div class="auth-title text-2xl font-brand mb-4">欢迎使用 ComfyUI.AI</div>
        <!-- 登录 -->
        <template v-if="$route.name === 'login'">
          <a-button type="outline" size="large" long @click="onGoogleLogin">
            <template #icon>
              <icon-google color="#ea4335" />
            </template>
            Login with Google
          </a-button>

          <a-divider> OR </a-divider>

          <Login v-model:login-type="loginType" />
          <!-- <div class="text-center text-sm">
            <a-divider> 其他登录方式 </a-divider>
            <a-space size="large" class="mt-4">
              <icon-wechat size="32px" style="color: #1aad19" />
              <icon-github size="26px" />
               <a-button type="primary" shape="circle" @click="onGoogleLogin">
                  <template #icon>
                    <icon-google size="24px" />
                  </template>
                </a-button>
            </a-space>
            <div v-if="loginType === 'password'" class="mt-10">
              没有账号？ <a-link class="text-sm" @click="onRegister">现在就注册</a-link>
              <a-divider direction="vertical" />
              <a-link class="text-sm" @click="onRegister">忘记密码</a-link>
            </div>
          </div> -->
          <AgreementNotice type="login" />
        </template>

        <!-- 注册 -->
        <template v-else-if="$route.name === 'register'">
          <Register v-model:register-type="registerType" />
          <div class="text-center text-sm mt-8"> 已有账号？ <a-link class="text-sm" @click="onLogin">立即登录</a-link> </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useAppStore } from '@/store';
  import { useDark } from '@vueuse/core';
  import Footer from '@/components/footer/index.vue';
  import { useRouter } from 'vue-router';
  import Login from './login.vue';
  import Register from './register.vue';
  import AgreementNotice from './components/AgreementNotice.vue';

  const appStore = useAppStore();
  const router = useRouter();

  useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    },
  });

  // 登录方式
  const loginType = ref<'password' | 'mobile'>('mail');

  // 注册方式
  const registerType = ref<'password' | 'mobile'>('mail');

  const onLogin = () => {
    loginType.value = 'mobile';
    router.push({ name: 'login' });
  };

  const onRegister = () => {
    registerType.value = 'password';
    router.push({ name: 'register' });
  };

  // Google登录
  const onGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_GOOGLE_LOGIN_URL}`;
  };
</script>

<style lang="less" scoped>
  .auth-container {
    @apply ~"flex flex-col justify-between w-full h-screen p-4 gap-4";

    background-image: url('assets/images/login-bg.png');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;

    .logo {
      @apply ~"flex items-center gap-2 mb-4 hidden sm:flex";

      &-text {
        margin-right: 4px;
        margin-left: 4px;
        // color: var(--color-fill-1);
        color: var(--color-text-1);
        font-size: 20px;
        font-family: '钉钉进步体 Regular', sans-serif;
      }
    }

    .content {
      @apply ~"relative flex flex-1 items-center justify-center";

      &-inner {
        @apply w-full max-w-md p-6 lg:p-10;

        overflow: hidden;
        background: var(--color-bg-4);
        border-radius: 12px;
      }
    }

    .footer {
      width: 100%;
    }
  }

  body[arco-theme='dark'] {
    .auth-container {
      background: var(--color-bg-1);
    }
  }

  .auth-title {
    color: var(--color-text-1);
  }
</style>
