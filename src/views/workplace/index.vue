<template>
  <div class="container h-full">
    <Grid title="我的工作流">
      <!-- 工具条 -->
      <GridToolbar @refresh="onRefresh">
        <template #prepend>
          <a-button type="primary" @click="onImport">导入工作流</a-button>
          <a-upload action="/" :limit="1">
            <template #upload-button> 导入工作流 </template>
          </a-upload>
          <a-button type="primary" @click="onCreate">新建工作流</a-button>
        </template>
      </GridToolbar>

      <!-- 表格 -->
      <GridTable
        :loading="loading"
        :data="renderData"
        :columns="tableColumns"
        :pagination="pagination"
        size="large"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @delete="onDelete"
      >
        <template #name="{ record }">
          <a-link @click="onOpenWorkflow(record)">{{ record.name }}</a-link>
        </template>
        <template #status="{ record }">
          <a-badge v-if="record.status === 'online'" status="normal" text="下线" />
          <a-badge v-if="record.status === 'offline'" status="success" text="上线" />
        </template>
        <template #operate="{ record }">
          <a-space fill>
            <a-button type="text" @click="onRename(record)">重命名</a-button>
            <a-button type="text" @click="onCopy(record)">复制</a-button>
            <a-button type="text" @click="onDownload(record)">下载</a-button>
            <a-button type="text" @click="onDelete(record)">删除</a-button>
          </a-space>
        </template>
      </GridTable>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { PaginationProps } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { WorkflowParams, WorkflowRecord, queryWorkflowList, deleteWorkflow } from '@/api/workflow';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '工作流名称', slotName: 'name', width: 500 },
    { title: '状态', slotName: 'status', width: 120 },
    { title: '最后更新', dataIndex: 'updated_at', width: 180 },
    { title: '操作', slotName: 'operate', width: 180 },
  ]);

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<WorkflowRecord[]>([]);
  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<WorkflowParams>({ ...basePagination });

  const fetchData = async (params = queryParams) => {
    try {
      setLoading(true);
      const {
        data,
        meta: { total },
      } = await queryWorkflowList(params);
      renderData.value = data;
      pagination.total = total;
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

  // 导入
  const onImport = () => {
    //
  };

  const onCreate = () => {
    //
  };

  const onRename = (item: WorkflowRecord) => {
    console.log('重命名', item);
  };

  const onCopy = (item: WorkflowRecord) => {
    console.log('复制', item);
  };

  const onDownload = (item: WorkflowRecord) => {
    console.log('下载', item);
  };

  // 删除
  const onDelete = async (item: WorkflowRecord) => {
    setLoading(true);
    await deleteWorkflow(item.id);
    onRefresh();
  };

  // 打开工作流
  const onOpenWorkflow = (item: WorkflowRecord) => {
    console.log('打开', item);
    // 新窗口打开
    window.open(`/workflows/${item.id}`, '_blank');
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
