<template>
  <a-table ref="tableRef" row-key="id" v-bind="{ ...attrs }" :bordered="false">
    <template v-for="key in tableSlots" :key="key" #[key]="scoped">
      <slot :key="key" :name="key" v-bind="scoped" />
    </template>
    <template #action="{ record }">
      <a-space fill>
        <a-button size="small" type="text" @click="onEdit(record)">修改</a-button>
        <a-button :loading="record?.loading" size="small" type="text" @click="onDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { computed, ref, useAttrs, useSlots } from 'vue';
  import { TableData, TableInstance } from '@arco-design/web-vue';

  const attrs = useAttrs();
  const slots = useSlots();

  const tableRef = ref<TableInstance | null>(null);

  const tableSlots = computed(() => {
    return Object.keys(slots).filter((key) => key !== 'action');
  });

  const onEdit = (record: TableData) => {
    if (typeof attrs.onEdit === 'function') {
      attrs.onEdit(record);
    }
  };

  const onDelete = (record: TableData) => {
    if (typeof attrs.onDelete === 'function') {
      attrs.onDelete(record);
    }
  };

  defineExpose({ tableRef });
</script>
