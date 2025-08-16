<template>
  <a-modal v-model:visible="visible" title-align="start" :ok-text="okText" simple @before-ok="onSave" @close="onReset">
    <template #title>
      <div v-if="type === 'bind'">绑定手机号</div>
      <div v-if="type === 'rebind'">换绑手机号</div>
      <div v-if="type === 'unbind'">解绑手机号</div>
    </template>
    <!-- 验证表单 -->
    <template v-if="formStep === 1 && type !== 'bind'">
      <VerificationForm ref="VerificationFormRef" @success="onSuccess" />
    </template>
    <!-- 绑定/换绑表单 -->
    <div v-if="formStep === 2 || type === 'bind'" class="mt-4">
      <a-form ref="formRef" :model="formData" layout="vertical">
        <a-form-item label="手机号码" field="mobile" hide-label>
          <a-input v-model="formData.mobile" placeholder="请输入手机号码">
            <template #prefix>+86</template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" field="code" hide-label>
          <InputVerifyCode v-model="formData.code" :account="formData.mobile" type="mobile" @change="onMobileCode" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue';
  import { useVisible } from '@/hooks';
  import { sendMobileCode } from '@/api/app';
  import InputVerifyCode from '@/components/input-verify-code/index.vue';
  import VerificationForm from './VerificationForm.vue';

  const { visible, setVisible } = useVisible(false);

  const type = ref<'bind' | 'rebind' | 'unbind'>();
  const formStep = ref(1);
  const formRef = ref<FormInstance>();
  const formData = ref({ mobile: '', code: '' });
  const VerificationFormRef = ref();

  const okText = computed(() => {
    if (type.value === 'bind' && formStep.value === 2) return '绑定';
    if (type.value === 'rebind' && formStep.value === 2) return '换绑';
    if (type.value === 'unbind') return '确定';
    return '下一步';
  });

  // 表单验证成功
  const onSuccess = () => {
    formStep.value = 2;
  };

  const onSave = async () => {
    try {
      // 验证表单 & 解绑和绑定需要验证表单
      if (type.value === 'unbind' || type.value === 'rebind') {
        VerificationFormRef.value?.onSubmit();
        return false;
      }
      return false;

      // // 手机号解绑
      // if (type.value === 'unbind') {
      //   Message.success('手机号码已成功解除绑定');
      //   return true;
      // }

      // // 手机号换绑
      // if (type.value === 'rebind') {
      //   // 第2步
      //   if (formStep.value === 1) {
      //     formStep.value = 2;
      //     return false;
      //   }
      //   Message.success('手机号码已成功更换绑定');
      //   return true;
      // }
      // return false;
    } catch {
      return false;
    }
  };

  const onReset = () => {
    formStep.value = 1;
    formRef.value?.resetFields();
  };

  // 初次绑定手机
  const onBind = async () => {
    type.value = 'bind';
    setVisible(true);
  };

  // 换绑定手机
  const onRebind = async () => {
    type.value = 'rebind';
    setVisible(true);
  };

  // 解绑手机
  const onUnbind = async () => {
    type.value = 'unbind';
    setVisible(true);
  };

  // 发送手机验证码
  const onMobileCode = (mobile: string) => {
    sendMobileCode(mobile);
  };

  defineExpose({ onBind, onRebind, onUnbind });
</script>
