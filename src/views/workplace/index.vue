<template>
  <div class="page-container">
    <Grid title="我的工作流">
      <!-- 工具条 -->
      <GridToolbar @refresh="onRefresh">
        <template #prepend>
          <a-upload :action="action" :limit="1" accept="application/json" @before-upload="onImport">
            <template #upload-button>
              <a-button :loading="importLoading" type="primary">
                <template #icon><icon-paste /></template>
                导入工作流
              </a-button>
            </template>
          </a-upload>
          <a-button :loading="createLoading" type="primary" @click="onCreate">
            <template #icon><icon-plus /></template>
            新建工作流
          </a-button>
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
        <template #operate="{ record }">
          <a-space fill>
            <a-link @click="onRename(record)">重命名</a-link>
            <a-link @click="onCopy(record)">复制</a-link>
            <a-link @click="onDownload(record)">下载</a-link>
            <a-popconfirm content="确认删除此工作流？删除后不可恢复！" position="left" @ok="onDelete(record)">
              <a-link status="danger">删除</a-link>
            </a-popconfirm>
          </a-space>
        </template>
      </GridTable>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { Message, PaginationProps } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { WorkflowParams, WorkflowRecord, queryWorkflowList, deleteWorkflow, postWorkflow } from '@/api/workflow';

  const action = '/api/user/workflow';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '工作流名称', slotName: 'name', width: 500 },
    { title: '最后更新', dataIndex: 'updated_at', width: 180 },
    { title: '操作', slotName: 'operate', width: 220, fixed: 'right' },
  ]);

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<WorkflowRecord[]>([]);
  const basePagination = { current: 1, pageSize: 20 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<WorkflowParams>({ ...basePagination });

  const importLoading = ref(false);
  const createLoading = ref(false);

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

  // 打开工作流
  const onOpenWorkflow = (item: WorkflowRecord) => {
    window.open(`/workflows/${item.id}`, '_blank');
  };

  const onCreate = async () => {
    try {
      createLoading.value = true;
      const uuid = URL.createObjectURL(new Blob()).split('/').pop();
      const { data } = await postWorkflow({
        name: '空白工作流',
        content: `{"id":"${uuid}","revision":0,"last_node_id":0,"last_link_id":0,"nodes":[],"links":[],"groups":[],"config":{},"extra":{"links_added_by_ue":[],"ue_links":[],"0246.VERSION":[0,0,4],"ds":{"scale":1,"offset":[0.08203125,0.0390625]},"frontendVersion":"1.23.0","VHS_latentpreview":false,"VHS_latentpreviewrate":0,"VHS_MetadataImage":true,"VHS_KeepIntermediate":true},"version":0.4}`,
      });
      Message.success({
        content: '工作流已创建，您可立即开始编辑！',
        duration: 1200,
        onClose: () => {
          onRefresh();
          onOpenWorkflow(data);
        },
      });
    } finally {
      createLoading.value = false;
    }
  };

  const onImport = (file: File) => {
    importLoading.value = true;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      try {
        const name = file.name.replace(/\.[^/.]+$/, '');
        const content = reader.result as string;
        const postData = { name, content };
        const { data } = await postWorkflow(postData);
        Message.success({
          content: '导入成功，即将为您打开工作流。',
          duration: 1200,
          onClose: () => {
            onRefresh();
            onOpenWorkflow(data);
          },
        });
      } finally {
        importLoading.value = false;
      }
    };
    reader.onerror = () => {
      importLoading.value = false;
    };
  };

  const onRename = (item: WorkflowRecord) => {
    console.log('重命名', item);
  };

  const onCopy = async (item: WorkflowRecord) => {
    try {
      setLoading(true);
      const name = `${item.name} - 副本`;
      const content = JSON.stringify(item.content);
      const { data } = await postWorkflow({ name, content });
      Message.success({
        content: '工作流副本已创建，您可立即开始编辑！',
        duration: 1200,
        onClose: () => {
          onRefresh();
          onOpenWorkflow(data);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onDownload = (item: WorkflowRecord) => {
    const content = JSON.stringify(item.content);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 删除
  const onDelete = async (item: WorkflowRecord) => {
    setLoading(true);
    await deleteWorkflow(item.id);
    Message.success({
      content: '工作流已删除',
      duration: 1200,
    });
    onRefresh();
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  //
</style>
