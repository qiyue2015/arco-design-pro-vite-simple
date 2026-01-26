<template>
  <div class="page-container">
    <Grid title="订单列表">
      <!-- 工具条 -->
      <GridToolbar @refresh="onRefresh">
        <template #prepend>
          <a-space>
            <a-input-group>
              <a-select v-model="searchKey" :options="searchOptions" class="w-36" @change="onRefresh" />
              <a-input
                v-model="queryParams[searchKey as keyof OrderParams]"
                class="w-72"
                :placeholder="searchKey === 'store_trade_no' ? '请输入门店订单号' : '请输入订单号'"
                allow-clear
                @clear="onRefresh"
                @press-enter="onRefresh"
              />
            </a-input-group>
            <a-button type="primary" @click="onRefresh">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
          </a-space>
        </template>
      </GridToolbar>

      <!-- 表格 -->
      <GridTable
        :loading="loading"
        :data="renderData"
        :columns="tableColumns"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #amount="{ record }"> {{ record.amount }} 元 </template>
        <template #status="{ record }">
          <a-tag v-if="statusMap[record.status]" :color="statusMap[record.status].color">
            {{ statusMap[record.status].label }}
          </a-tag>
          <a-tag v-else color="gray">未知状态 ({{ record.status }})</a-tag>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="onDetail(record)"> 查看 </a-button>
        </template>
      </GridTable>
    </Grid>

    <OrderDetailDrawer ref="OrderDetailDrawerRef" @refresh="onRefresh" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { PaginationProps } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { OrderParams, OrderRecord, queryOrderList } from '@/api/order';
  import OrderDetailDrawer from './components/OrderDetailDrawer.vue';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    { title: '订单号', dataIndex: 'order_no', width: 260 },
    { title: '门店订单号', dataIndex: 'store_trade_no', width: 280 },
    { title: '交易金额', slotName: 'amount', width: 100 },
    { title: '交易状态', slotName: 'status', width: 100 },
    { title: '交易时间', dataIndex: 'pay_time', width: 180 },
    { title: '门店', dataIndex: 'store.name', width: 150 },
    { title: '操作', slotName: 'operations', fixed: 'right', width: 100 },
  ]);

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: '待支付', color: 'orange' },
    1: { label: '已支付', color: 'green' },
    2: { label: '已取消', color: 'gray' },
    3: { label: '退款中', color: 'arcoblue' },
    4: { label: '已退款', color: 'red' },
    5: { label: '部分退款', color: 'cyan' },
    6: { label: '支付失败', color: 'red' },
  };

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<OrderRecord[]>([]);
  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<OrderParams>({ ...basePagination });
  const searchKey = ref('store_trade_no');
  const searchOptions = [
    { label: '门店订单号', value: 'store_trade_no' },
    { label: '订单号', value: 'order_no' },
  ];

  const fetchData = async (params = queryParams) => {
    try {
      setLoading(true);
      const { data, meta } = await queryOrderList(params);
      renderData.value = data;
      pagination.total = meta.total;
      pagination.current = meta.page;
      pagination.pageSize = meta.page_size;
    } finally {
      setLoading(false);
    }
  };

  // 刷新
  const onRefresh = () => {
    queryParams.current = 1;
    // 确保只保留当前选中的搜索字段，清除另一个
    if (searchKey.value === 'store_trade_no') {
      delete queryParams.order_no;
    } else {
      delete queryParams.store_trade_no;
    }
    fetchData();
  };

  // 翻页
  const onPageChange = (current: number) => {
    queryParams.current = current;
    fetchData();
  };

  // 每页数量变化
  const onPageSizeChange = (pageSize: number) => {
    queryParams.current = 1;
    queryParams.pageSize = pageSize;
    fetchData();
  };

  const OrderDetailDrawerRef = ref<InstanceType<typeof OrderDetailDrawer>>();

  const onDetail = (item: OrderRecord) => {
    OrderDetailDrawerRef.value?.onDetail(item);
  };

  onMounted(() => {
    fetchData();
  });
</script>
