<template>
  <a-drawer v-model:visible="visible" title="订单详情" :width="700" :footer="false" @cancel="onCancel">
    <div>
      <a-descriptions title="基础信息" :column="2" size="large" bordered class="mb-4">
        <a-descriptions-item label="交易状态">
          <a-tag v-if="item.status !== undefined && statusMap[item.status]" :color="statusMap[item.status].color">
            {{ statusMap[item.status].label }}
          </a-tag>
          <a-tag v-else-if="item.status !== undefined" color="gray">未知状态 ({{ item.status }})</a-tag>
          <a-tag v-else color="gray">加载中...</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="订单号" :span="2">{{ item.order_no }}</a-descriptions-item>
        <a-descriptions-item label="门店订单号" :span="2">{{ item.store_trade_no }}</a-descriptions-item>
        <a-descriptions-item label="商户订单号" :span="2">{{ item.merchant_trade_no }}</a-descriptions-item>
        <a-descriptions-item label="交易金额">{{ item.amount }} 元</a-descriptions-item>
        <a-descriptions-item label="所在门店">{{ item.store?.name }}</a-descriptions-item>
        <a-descriptions-item label="交易时间">{{ item.pay_time || '-' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ item.created_at }}</a-descriptions-item>
      </a-descriptions>

      <template v-if="item.status === 4 || item.status === 5">
        <div class="section-title">退款记录</div>
        <a-skeleton v-if="refundLoading" :animation="true">
          <a-skeleton-line :rows="3" />
        </a-skeleton>
        <a-table v-else :data="refundList" :pagination="false" size="small" stripe>
          <template #columns>
            <a-table-column title="退款单号" data-index="refund_no" :width="240" />
            <a-table-column title="退款金额" data-index="amount" :width="100">
              <template #cell="{ record }">{{ record.amount }} 元</template>
            </a-table-column>
            <a-table-column title="状态" data-index="status">
              <template #cell="{ record }">
                <a-tag v-if="record.status === 0" size="small" color="blue">申请中</a-tag>
                <a-tag v-else-if="record.status === 1" size="small" color="orange">处理中</a-tag>
                <a-tag v-else-if="record.status === 2" size="small" color="green">退款成功</a-tag>
                <a-tag v-else-if="record.status === 3" size="small" color="red">退款失败</a-tag>
                <a-tag v-else-if="record.status === 4" size="small" color="gray">已拒绝</a-tag>
                <a-tag v-else size="small" color="gray">未知状态 ({{ record.status }})</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="退款时间" data-index="refund_time" :width="200" />
          </template>
        </a-table>
      </template>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useVisible, useLoading } from '@/hooks';
  import { OrderRecord, queryOrderRefundList } from '@/api/order';

  const { visible, setVisible } = useVisible(false);
  const { loading: refundLoading, setLoading: setRefundLoading } = useLoading(false);

  const item = ref<Partial<OrderRecord>>({});
  const refundList = ref<OrderRecord[]>([]);

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: '待支付', color: 'orange' },
    1: { label: '已支付', color: 'green' },
    2: { label: '已取消', color: 'gray' },
    3: { label: '退款中', color: 'arcoblue' },
    4: { label: '已退款', color: 'red' },
    5: { label: '部分退款', color: 'cyan' },
    6: { label: '支付失败', color: 'red' },
  };

  // 打开详情
  const onDetail = async (record: OrderRecord) => {
    setVisible(true);
    item.value = record;
    refundList.value = [];

    // 如果已退款 (4) 或 部分退款 (5)，查询退款列表
    if (record.status === 4 || record.status === 5) {
      try {
        setRefundLoading(true);
        const { data } = await queryOrderRefundList({
          store_order_id: record.id,
          current: 1,
          pageSize: 100,
        } as any);
        refundList.value = data;
      } finally {
        setRefundLoading(false);
      }
    }
  };

  const emit = defineEmits(['refresh']);

  const onCancel = () => {
    setVisible(false);
    emit('refresh');
  };

  defineExpose({ onDetail });
</script>

<style scoped>
  .section-title {
    margin: 20px 0 12px;
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
</style>
