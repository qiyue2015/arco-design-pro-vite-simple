<script setup lang="ts">
  import { PropType } from 'vue';

  interface ImageItem {
    id: string;
    url: string;
  }

  defineProps({
    data: {
      type: Object as PropType<ImageItem>,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['delete']);

  const handleDelete = (data: ImageItem) => {
    emit('delete', data);
  };
</script>

<template>
  <div class="item-wrapper" :class="{ checked }">
    <a-image :src="data.url" :preview="false" width="100%" footer-position="outer" fit="contain" show-loader>
      <template #extra>
        <div class="f-icon">
          <icon-check-circle-fill v-if="checked" />
          <icon-check-circle v-else />
        </div>
        <div v-show="!checked" class="f-icon">
          <a-popconfirm content="不可恢复，确定删除?" type="warning" @ok="handleDelete(data)">
            <icon-delete />
          </a-popconfirm>
        </div>
      </template>
    </a-image>
  </div>
</template>

<style scoped lang="less">
  .item-wrapper {
    width: 120px;
    min-height: 118px;
    overflow: hidden;
    border: 1px solid var(--color-fill-3);
    cursor: pointer;

    :deep(.arco-image) {
      .arco-image-img {
        width: 100%;
        height: 90px;
        background: #1d2129;
      }
    }

    &.checked {
      box-sizing: border-box;
      border-color: rgb(var(--green-6));

      .arco-icon-check-circle-fill {
        color: rgb(var(--green-6));
      }
    }
  }

  :deep(.arco-image-footer-extra) {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 0;

    .f-icon {
      flex: 0.5;
      padding: 0 12px;

      ~ .f-icon {
        text-align: right;
      }
    }
  }
</style>
