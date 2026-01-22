<template>
  <div class="page-container">
    <a-card title="交易账单导出" class="general-card h-full">
      <div class="flex justify-center py-10">
        <a-form :model="formData" class="w-full max-w-xl">
          <a-form-item field="store_id" label="对账单归属">
            <a-select v-model="formData.store_id" placeholder="全部门店" allow-clear>
              <a-option :value="undefined">全部门店</a-option>
              <a-option v-for="item in storeList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="date_range" label="时间范围">
            <a-range-picker v-model="formData.date_range" :shortcuts="shortcuts" class="w-full" @change="onDateChange" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" :loading="loading" class="w-40" @click="onDownload">
              <template #icon><icon-download /></template>
              打包下载
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { useLoading } from '@/hooks';
  import { queryShopList, ShopRecord } from '@/api/shop';
  import { exportBills } from '@/api/bill';

  const { loading, setLoading } = useLoading(false);
  const storeList = ref<ShopRecord[]>([]);

  // 默认时间规律：每日 10:00 前，由于数据可能未出，默认结束日期为前天 (T-2)；10:00 后为昨天 (T-1)
  const getLatestAvailableDay = () => (dayjs().hour() < 10 ? 2 : 1);
  const offset = getLatestAvailableDay();

  const defaultRange = [
    dayjs()
      .subtract(offset + 6, 'd')
      .format('YYYY-MM-DD'),
    dayjs().subtract(offset, 'd').format('YYYY-MM-DD'),
  ];

  const formData = reactive({
    store_id: undefined as number | undefined,
    date_range: defaultRange,
    start_time: defaultRange[0] as string | undefined,
    end_time: defaultRange[1] as string | undefined,
  });

  const shortcuts = [
    {
      label: '最近可用日',
      value: () => {
        const d = dayjs().subtract(getLatestAvailableDay(), 'd');
        return [d.startOf('d'), d.endOf('d')];
      },
    },
    {
      label: '上周',
      value: () => [dayjs().subtract(1, 'w').startOf('w'), dayjs().subtract(1, 'w').endOf('w')],
    },
    {
      label: '上个月',
      value: () => [dayjs().subtract(1, 'm').startOf('m'), dayjs().subtract(1, 'm').endOf('m')],
    },
    {
      label: '最近 7 天',
      value: () => {
        const off = getLatestAvailableDay();
        return [
          dayjs()
            .subtract(off + 6, 'd')
            .startOf('d'),
          dayjs().subtract(off, 'd').endOf('d'),
        ];
      },
    },
  ];

  const fetchStores = async () => {
    try {
      const { data } = await queryShopList({ current: 1, pageSize: 1000 });
      storeList.value = data;
    } catch (e) {
      //
    }
  };

  const onDateChange = (val: any) => {
    if (val && val.length === 2) {
      [formData.start_time, formData.end_time] = val;
    } else {
      formData.start_time = undefined;
      formData.end_time = undefined;
    }
  };

  const onDownload = async () => {
    if (!formData.start_time || !formData.end_time) {
      Message.warning('请选择时间范围');
      return;
    }
    try {
      setLoading(true);

      const { data } = await exportBills({
        store_id: formData.store_id,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      // 使用浏览器原生下载
      window.open(data.url, '_blank');

      Message.success('账单下载成功');
    } catch (error: any) {
      Message.error(error?.message || '下载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  onMounted(() => {
    fetchStores();
  });
</script>

<style scoped lang="less">
  .page-container {
    padding: 20px;
  }

  .general-card {
    min-height: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgb(0 0 0 / 5%);
  }

  :deep(.arco-form-item-label) {
    font-weight: 500;
  }
</style>
