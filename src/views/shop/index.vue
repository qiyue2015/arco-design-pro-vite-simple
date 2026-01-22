<template>
  <div class="container">
    <Grid title="测试">
      <!-- 工具条 -->
      <GridToolbar @create="onCreate" @refresh="onRefresh" />

      <!-- 表格 -->
      <GridTable
        :loading="loading"
        :data="renderData"
        :columns="tableColumns"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @edit="onEdit"
        @delete="onDelete"
      >
        <template #thumb="{ record }">
          <a-image :src="record.thumb" width="120" fit="cover" />
        </template>
        <template #title="{ record }">
          <a-link @click="onDetail(record)"></a-link>
        </template>
        <template #status="{ record }">
          <a-badge v-if="record.status === 'online'" status="normal" text="下线" />
          <a-badge v-if="record.status === 'offline'" status="success" text="上线" />
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
  import { ShopParams, ShopRecord, queryShopList, deleteShop } from '@/api/shop';
  import ShopAddModal from './components/ShopAddModal.vue';
  import ShopDetailDrawer from './components/ShopDetailDrawer.vue';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '封面', slotName: 'thumb' },
    { title: '标题', slotName: 'title' },
    { title: '摘要', dataIndex: 'description' },
    { title: '状态', slotName: 'status' },
    { title: '操作', slotName: 'action', width: 200, align: 'center' },
  ]);

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<ShopRecord[]>([]);
  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<ShopParams>({ ...basePagination });

  const fetchData = async (params = queryParams) => {
    try {
      setLoading(true);
      const { data } = await queryShopList(params);
      renderData.value = data.list;
      pagination.total = data.total;
      pagination.current = params.current;
      pagination.pageSize = params.pageSize;
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

  const ShopAddModalRef = ref<InstanceType<typeof ShopAddModal>>();

  // 新增
  const onCreate = () => {
    ShopAddModalRef.value?.onAdd();
  };

  // 修改
  const onEdit = (item: ShopRecord) => {
    ShopAddModalRef.value?.onEdit(item.id);
  };

  // 删除
  const onDelete = async (item: ShopRecord) => {
    setLoading(true);
    await deleteShop(item.id);
    onRefresh();
  };

  const ShopDetailDrawerRef = ref<InstanceType<typeof ShopDetailDrawer>>();

  const onDetail = (item: ShopRecord) => {
    ShopDetailDrawerRef.value?.onDetail(item.id);
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
