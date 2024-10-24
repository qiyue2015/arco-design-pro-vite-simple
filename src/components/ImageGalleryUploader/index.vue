<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { getToken } from '@/utils/auth';
  import { FileRecord, deleteFiles, queryFiles } from '@/api/file';

  const props = defineProps({
    modelValue: {
      type: [Array, String],
      default: () => [],
    },
    limit: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: 'file',
    },
    /**
     *  square (1:1)：正方形
     *  widescreen (16:9)：宽屏
     *  standard (4:3)：标准屏
     *  photo (3:2)：照片比例
     */
    ratio: {
      type: String,
      default: 'square',
    },
  });

  const emits = defineEmits(['update:modelValue']);

  const token = getToken();
  const action = `${import.meta.env.VITE_API_BASE_URL}/api/upload/image`;

  const fileLimit = ref(props.limit);
  const fileList = ref<FileItem[]>([]);
  const selectKeys = ref<string[]>([]);
  const selectCount = computed(() => selectKeys.value.length);

  const show = ref(false);
  const loading = ref(false);
  const current = ref(1);
  const pageSize = ref(24);
  const total = ref(0);
  const list = ref<FileRecord[]>([]);
  const isEmptyData = computed(() => list.value.length === 0 && !loading.value);

  const deleteLoading = ref(false);
  const uploadFiles = ref<string[]>([]);
  const uploadLoading = computed(() => uploadFiles.value.length > 0);

  const fetchData = async () => {
    try {
      loading.value = true;
      const response = await queryFiles({
        page: current.value,
      });
      list.value = response.data;
      total.value = response.meta.total;
      pageSize.value = response.meta.page_size;
    } finally {
      loading.value = false;
    }
  };

  const onRefresh = () => {
    current.value = 1;
    fetchData();
  };

  const onChangePage = (page: number) => {
    current.value = page;
    fetchData();
  };

  const onDeleteItems = async () => {
    try {
      deleteLoading.value = true;
      await deleteFiles(selectKeys.value);
      selectKeys.value = [];
      onRefresh();
    } finally {
      deleteLoading.value = false;
    }
  };

  // 仅用于触发弹窗，它不做其它操作
  const handleButtonClick = () => {
    return new Promise<FileList>((resolve) => {
      show.value = true;

      onRefresh();

      // 返回一个空的 FileList 以阻止后续的上传动作
      resolve(new DataTransfer().files);
    });
  };

  // 取消弹窗
  const handleCancelModal = () => {
    show.value = false;
    selectKeys.value = [];
  };

  // 确认弹窗，返回图片给父组件
  const handleConfirmModal = () => {
    show.value = false;

    // 全部返回
    const filterFiles = list.value.filter((item) => selectKeys.value.includes(item.id));
    const newFiles = filterFiles.map((item) => ({ uid: item.id, url: item.url }));
    const allFiles = [...fileList.value, ...newFiles];

    if (fileLimit.value === 1) {
      // 返回最后 1 张选中的图片
      const file = allFiles[allFiles.length - 1];
      fileList.value = [file]; // 为了更改视图
      emits('update:modelValue', file?.url || '');
    } else if (fileLimit.value > 1) {
      // 返回张选中的图片里最后的 fileLimit.value 张
      const files = allFiles.slice(-fileLimit.value);
      fileList.value = files; // 为了更改视图
      emits('update:modelValue', files);
    } else {
      // 全部返回
      fileList.value = allFiles; // 为了更改视图
      emits('update:modelValue', allFiles);
    }
  };

  // 关闭弹窗
  const closeModal = () => {
    selectKeys.value = [];
  };

  // 移除图片
  const beforeRemove = (fileItem: FileItem) => {
    return new Promise<boolean>((resolve) => {
      if (fileLimit.value === 1) {
        emits('update:modelValue', '');
      } else {
        const newFiles = fileList.value.filter((item) => item.uid !== fileItem.uid);
        emits('update:modelValue', newFiles);
      }
      resolve(true);
    });
  };

  // 上传前
  const beforeUpload = (file: File) => {
    return new Promise<File>((resolve) => {
      uploadFiles.value.push(file.name);
      resolve(file);
    });
  };

  // 上传成功
  const uploadSuccess = (response?: any) => {
    const { code, message } = response.response;

    // 移除上传中的文件
    uploadFiles.value = uploadFiles.value.filter((item) => item !== response.file.name);

    if (code !== 0) {
      Message.error(message);
    }
  };

  // 上传失败
  const uploadError = (error: Error) => {
    uploadFiles.value = uploadFiles.value.filter((item) => item !== error.name);
    Message.error(error.message);
  };

  // 监控待上传文件列表，当全部上传完成时，刷新列表
  watch(uploadFiles, (files: string[]) => {
    if (files.length === 0) {
      onRefresh();
    }
  });

  onMounted(() => {
    // 构造 fileList 的目的是为了给组件展示图片例表使用 <a-uploader />
    if (Array.isArray(props.modelValue)) {
      fileList.value = props.modelValue.map((item, index) => {
        return {
          uid: item.id || `uid-${index}-${Date.now()}`,
          url: item.url,
        };
      });
    } else if (props.modelValue) {
      // 传入字符串时，表示只能 1 张图
      fileLimit.value = 1;
      fileList.value = [
        // 构造组件需要的数据结构 FileItem
        { uid: `uid-${Date.now()}`, url: props.modelValue },
      ];
    } else {
      fileList.value = [];
    }
  });
</script>

<template>
  <div class="uploader-container">
    <!--主要用于展示图片信息及上传按钮，并不太想去重写样式，就复用它了-->
    <!--还好它有个 button-click 可以阻止后续的动作-->
    <a-upload
      v-model:file-list="fileList"
      :limit="fileLimit"
      :class="'m-' + ratio"
      :image-preview="true"
      list-type="picture-card"
      image-loading="lazy"
      @before-remove="beforeRemove"
      @button-click="handleButtonClick"
    />

    <!--图片上传、选择弹窗-->
    <a-modal v-model:visible="show" :mask-closable="false" width="810px" title-align="start" @close="closeModal">
      <template #title> 图片例表 </template>
      <a-space direction="vertical" size="medium" fill>
        <div class="toolbar-container">
          <a-space>
            <!--这个按钮才实现了上传功能-->
            <a-upload
              :multiple="true"
              :show-file-list="false"
              :limit="limit"
              :action="action"
              :headers="{ Authorization: `Bearer ${token}` }"
              name="image"
              accept="image/png, image/jpeg, image/gif"
              @success="uploadSuccess"
              @error="uploadError"
              @before-upload="beforeUpload"
            >
              <template #upload-button>
                <a-button :loading="uploadLoading" type="primary">
                  <template #icon><icon-upload /></template>
                  上传图片
                </a-button>
              </template>
            </a-upload>
            <a-button v-if="selectCount" :loading="deleteLoading" type="primary" status="danger" @click="onDeleteItems">
              删除（{{ selectCount }}）
            </a-button>
          </a-space>
          <a-button @click="onRefresh">
            <template #icon><icon-refresh /></template>
          </a-button>
        </div>
        <a-spin :loading="loading" :class="{ 'gallery-container-empty': isEmptyData }" class="gallery-container">
          <a-empty v-if="isEmptyData" />
          <a-checkbox-group v-model="selectKeys" type="button">
            <div class="gallery-image-container">
              <a-checkbox v-for="item in list" :key="item.id" :value="item.id">
                <template #checkbox>
                  <a-image :src="item.url" :preview="false" width="120" height="90" fit="cover" show-loader />
                </template>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </a-spin>
      </a-space>
      <template #footer>
        <div class="footer-container">
          <a-pagination :total="total" :current="current" :page-size="pageSize" show-total @change="onChangePage" />
          <div class="footer-button">
            <a-button @click="handleCancelModal">取消</a-button>
            <a-button type="primary" @click="handleConfirmModal">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  .toolbar-container,
  .footer-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .gallery-container {
    display: flex;
    min-height: 390px;

    &-empty {
      align-items: center;
    }

    .gallery-image-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-content: flex-start;
      width: 100%;
      min-height: 390px;

      .arco-radio,
      .arco-checkbox {
        margin-right: 0;
        padding-left: 0;
      }

      .arco-image {
        overflow: hidden;
        border: 2px solid var(--color-neutral-1);
      }

      .arco-checkbox-checked {
        .arco-image {
          border-color: rgb(var(--primary-6));
        }
      }
    }
  }

  .footer-container {
    .footer-button {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  //square (1:1)：正方形

  //standard (4:3)：标准屏
  :deep(.m-standard) {
    .arco-upload-picture-card {
      min-width: 106px;
    }

    .arco-upload-list-picture {
      width: 106px;
    }
  }

  //portrait (3:4)：照片比例
  :deep(.m-portrait) {
    .arco-upload-picture-card {
      min-width: 60px;
    }

    .arco-upload-list-picture {
      width: 60px;
    }
  }

  //widescreen (16:9)：宽屏
  :deep(.m-widescreen) {
    .arco-upload-picture-card {
      min-width: 142px;
    }

    .arco-upload-list-picture {
      width: 142px;
    }
  }

  :deep(.arco-upload-list-picture) {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
