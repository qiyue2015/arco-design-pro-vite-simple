<template>
  <div class="container">
    <Grid title="门店例表">
      <!-- 表格 -->
      <GridTable
        :loading="loading"
        :data="renderData"
        :columns="tableColumns"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #status="{ record }">
          <a-badge v-if="!record.status" status="normal" text="下线" />
          <a-badge v-else status="success" text="上线" />
        </template>
      </GridTable>
    </Grid>

    <ShopAddModal ref="ShopAddModalRef" @on-save-success="onRefresh" />

    <ShopDetailDrawer ref="ShopDetailDrawerRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { PaginationProps } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { ShopParams, ShopRecord, queryShopList } from '@/api/shop';
  import ShopAddModal from './components/ShopAddModal.vue';
  import ShopDetailDrawer from './components/ShopDetailDrawer.vue';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '门店名称', dataIndex: 'name', width: 160, fixed: 'left' },
    { title: '门店地址', dataIndex: 'address', width: 200, tooltip: true, ellipsis: true },
    { title: '联系人', dataIndex: 'contact_name', width: 120 },
    { title: '联系电话', dataIndex: 'contact_phone', width: 160 },
    { title: '状态', dataIndex: 'status', slotName: 'status', width: 100 },
    { title: '添加时间', dataIndex: 'created_at', width: 200, fixed: 'right' },
  ]);

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<ShopRecord[]>([]);
  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<ShopParams>({ ...basePagination });

  const fetchData = async (params = queryParams) => {
    try {
      setLoading(true);
      const { data, meta } = await queryShopList(params);
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

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .container {
    padding: 20px;
  }
</style>
