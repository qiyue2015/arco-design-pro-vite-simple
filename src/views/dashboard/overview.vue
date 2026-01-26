<template>
  <div class="page-container">
    <a-card :loading="loading" class="general-card" title="登录信息">
      <a-descriptions :column="1" bordered size="middle">
        <a-descriptions-item label="用户">
          <span class="mr-4">{{ userInfo.nickname || userInfo.username || '用户' }}</span>
          <a-tag v-if="userInfo.role === 'admin'" color="green">管理员</a-tag>
          <a-tag v-else color="blue">收银员</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最后登录">{{ userInfo.updated_at }}</a-descriptions-item>
        <a-descriptions-item label="上次登录 IP">{{ userInfo.last_login_ip }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card :loading="loading" class="general-card h-full" title="能力配置">
      <a-descriptions v-if="overviewData && settingsData" :column="1" bordered size="middle">
        <a-descriptions-item label="商户名称">{{ overviewData.merchant?.name || '未设置' }}</a-descriptions-item>
        <a-descriptions-item label="商户编号">{{ overviewData.merchant?.id || '-' }}</a-descriptions-item>
        <a-descriptions-item label="当前能力">{{ overviewData.ability?.name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="App ID">{{ settingsData.app_id }}</a-descriptions-item>
        <a-descriptions-item label="Driver">{{ settingsData.driver }}</a-descriptions-item>
        <a-descriptions-item label="支付接口">
          <a-typography-paragraph class="!mb-0" copyable>{{ settingsData.driver_config.pay_url }}</a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="订单接口">
          <a-typography-paragraph class="!mb-0" copyable>{{ settingsData.driver_config.order_url }}</a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="退款接口">
          <a-typography-paragraph class="!mb-0" copyable>{{ settingsData.driver_config.refund_url }}</a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="会员接口">
          <a-typography-paragraph class="!mb-0" copyable>{{ settingsData.driver_config.member_url }}</a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="门店">
          <template v-if="overviewData.stores?.length">
            <span v-for="(item, index) in overviewData.stores" :key="item.id">
              {{ item.name }}<span v-if="index < overviewData.stores.length - 1">，</span>
            </span>
          </template>
          <span v-else>-</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { useUserStore } from '@/store';
  import { getDashboardOverview, getDevelopSettings, DashboardOverviewRes, DevelopSettingsRes } from '@/api/dashboard';

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);

  const loading = ref(false);
  const overviewData = ref<DashboardOverviewRes | null>(null);
  const settingsData = ref<DevelopSettingsRes | null>(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const [overviewRes, settingsRes] = await Promise.all([getDashboardOverview(), getDevelopSettings()]);
      overviewData.value = overviewRes.data;
      settingsData.value = settingsRes.data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>
