<template>
  <a-modal v-model:visible="visible" title-align="start" :ok-text="okText" simple @before-ok="onSave" @close="onReset">
    <template #title>
      <div v-if="type === 'bind'">设置密码</div>
      <div v-if="type === 'rebind'">重置密码</div>
    </template>
    <!-- 验证表单 -->
    <template v-if="formStep === 1 && type !== 'bind'">
      <VerificationForm ref="VerificationFormRef" @success="onSuccess" />
    </template>
    <!-- 绑定/换绑表单 -->
    <div v-if="formStep === 2 || type === 'bind'" class="mt-4">
      <a-form ref="formRef" :model="formData" layout="vertical">
        <a-form-item label="新密码" field="password">
          <a-input-password v-model="formData.password" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认密码" field="password_confirmation">
          <a-input-password v-model="formData.password_confirmation" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue';
  import { useVisible } from '@/hooks';
  import VerificationForm from './VerificationForm.vue';

  const { visible, setVisible } = useVisible(false);

  const type = ref<'bind' | 'rebind'>();
  const formStep = ref(1);
  const formRef = ref<FormInstance>();
  const formData = ref({ password: '', password_confirmation: '' });
  const VerificationFormRef = ref();

  const okText = computed(() => (formStep.value === 1 ? '下一步' : '确定'));

  // 表单验证成功
  const onSuccess = () => {
    formStep.value = 2;
  };

  const onSave = async () => {
    try {
      // 验证表单
      if (type.value === 'rebind') {
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

  defineExpose({ onBind, onRebind });
</script>
