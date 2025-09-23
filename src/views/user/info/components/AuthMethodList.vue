<template>
  <a-card v-bind="{ ...attrs }">
    <a-space direction="vertical" fill>
      <template v-for="(item, index) in loginTypes" :key="index">
        <a-divider v-if="index" />
        <auth-method-item :item="item">
          <!-- 账号密码 -->
          <template v-if="item.type === 'password'">
            <a-button v-if="item.status === 0" class="w-28" type="outline" @click="EditPasswordModalRef.onBind()">
              设置密码
            </a-button>
            <a-button v-if="item.status === 1" class="w-28" long type="outline" @click="EditPasswordModalRef.onRebind()">
              重置密码
            </a-button>
          </template>

          <!-- 手机号 -->
          <template v-if="item.type === 'mobile'">
            <!-- 没有绑定手机号 -->
            <a-button v-if="item.status === 0" class="w-28" type="outline" @click="EditPhoneModalRef.onBind()"> 绑定 </a-button>

            <!-- 已绑定过手机号 -->
            <a-dropdown v-if="item.status">
              <a-button type="outline" class="w-28"> 编辑 </a-button>
              <template #content>
                <a-doption @click="EditPhoneModalRef.onRebind()">更换绑定</a-doption>
                <a-doption @click="EditPhoneModalRef.onUnbind()">解除绑定</a-doption>
              </template>
            </a-dropdown>
          </template>

          <!-- 电子邮箱 -->
          <template v-if="item.type === 'email'">
            <!-- 没有绑定电子邮箱 -->
            <a-button v-if="item.status === 0" type="outline" class="w-28" @click="EditPasswordModalRef.onBind()">
              绑定
            </a-button>

            <!-- 已绑定过电子邮箱 -->
            <a-dropdown v-if="item.status">
              <a-button type="outline" class="w-28"> 编辑 </a-button>
              <template #content>
                <a-doption @click="EditEmailModalRef.onRebind()">更换绑定</a-doption>
                <a-doption @click="EditEmailModalRef.onUnbind()">解除绑定</a-doption>
              </template>
            </a-dropdown>
          </template>

          <!-- Google -->
          <template v-if="item.type === 'google'">
            <a-button v-if="item.status === 0" type="outline" class="w-28" @click="onGoogleBind">绑定</a-button>
            <a-button v-if="item.status === 1" type="outline" class="w-28" @click="onGoogleUnbind">解绑</a-button>
          </template>

          <!-- 微信登录 -->
          <template v-if="item.type === 'wechat'">
            <a-button v-if="item.status === 0" type="outline" class="w-28" @click="onWechatBind">绑定</a-button>
            <a-button v-if="item.status === 1" type="outline" class="w-28" @click="onWechatUnbind">解绑</a-button>
          </template>
        </auth-method-item>
      </template>
    </a-space>

    <EditPasswordModal ref="EditPasswordModalRef" />
    <EditPhoneModal ref="EditPhoneModalRef" @success="getUserinfo" />
    <EditEmailModal ref="EditEmailModalRef" @success="getUserinfo" />
  </a-card>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue';
  import { useUserStore } from '@/store';
  import AuthMethodItem from './AuthMethodItem.vue';
  import EditPasswordModal from './EditPasswordModal.vue';
  import EditPhoneModal from './EditPhoneModal.vue';
  import EditEmailModal from './EditEmailModal.vue';
  // import UserIcon from '../icons/user.svg?url';
  // import UnbindUserIcon from '../icons/user-unbind.svg?url';
  import MailIcon from '../icons/mail.svg?url';
  import MailIconUnbind from '../icons/mail-unbind.svg?url';
  // import PhoneIcon from '../icons/tel.svg?url';
  // import PhoneIconUnbind from '../icons/tel-unbind.svg?url';
  // import WechatIcon from '../icons/wechat.svg?url';
  // import WechatIconUnbind from '../icons/wechat-unbind.svg?url';
  import GoogleIcon from '../icons/google.svg?url';
  import GoogleIconUnbind from '../icons/google-unbind.svg?url';

  const attrs = useAttrs();
  const userStore = useUserStore();

  const userInfo = computed(() => userStore.userInfo);

  const EditPasswordModalRef = ref();
  const EditPhoneModalRef = ref();
  const EditEmailModalRef = ref();

  const loginTypes = ref([
    // {
    //   type: 'password',
    //   name: '密码',
    //   description: '******',
    //   status: 1,
    //   icon: UserIcon,
    //   unbind_icon: UnbindUserIcon,
    // },
    // {
    //   type: 'mobile',
    //   name: '手机号登录',
    //   description: '绑定手机号后，可通方便的登录管理账号',
    //   status: userInfo.value.mobile_verified ? 1 : 0,
    //   icon: PhoneIcon,
    //   unbind_icon: PhoneIconUnbind,
    //   actions: [
    //     {
    //       label: userInfo.value.mobile_verified ? '修改' : '绑定',
    //       onClick: () => {
    //         EditPhoneModalRef.value.onEdit();
    //       },
    //     },
    //   ],
    // },
    {
      type: 'email',
      name: '电子邮箱登录',
      description: userInfo.value.email_verified ? userInfo.value.email : '绑定电子邮箱后，可通方便的登录管理账号',
      status: userInfo.value.email_verified ? 1 : 0,
      action_label: '修改',
      icon: MailIcon,
      unbind_icon: MailIconUnbind,
    },
    {
      type: 'google',
      name: 'Google 登录',
      description: '绑定后，可通过 Google 授权账号登录账号',
      status: userInfo.value.google_auth_enabled ? 1 : 0,
      action_label: '解绑',
      icon: GoogleIcon,
      unbind_icon: GoogleIconUnbind,
    },
    // {
    //   type: 'wechat',
    //   name: '微信登录',
    //   description: '绑定后，可通过微信授权登录账号',
    //   status: 0,
    //   action_label: '绑定',
    //   icon: WechatIcon,
    //   unbind_icon: WechatIconUnbind,
    // },
  ]);

  // 获取用户信息
  const getUserinfo = () => {
    userStore.info();
  };

  // Google 绑定
  const onGoogleBind = () => {
    //
  };

  // 解除 Google 绑定
  const onGoogleUnbind = () => {
    //
  };

  // 微信绑定
  const onWechatBind = () => {
    //
  };

  // 解除 微信 绑定
  const onWechatUnbind = () => {
    //
  };
</script>
