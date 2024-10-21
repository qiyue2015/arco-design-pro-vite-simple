<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import axios from 'axios';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import Item from './item.vue';

  interface ImageItem {
    id: string;
    url: string;
  }

  const props = defineProps({
    modelValue: {
      type: [Array, String],
      default: () => [],
    },
    action: {
      type: String,
      required: true,
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
    mode: {
      type: String,
      default: 'square',
    },
  });

  const emits = defineEmits(['update:modelValue']);

  const fileLimit = ref(props.limit);
  const fileList = ref<FileItem[]>([]);
  const selectKey = ref<string>();
  const selectKeys = ref<string[]>([]);
  const checkboxDisabled = computed(() => selectKeys.value.length + fileList.value.length >= fileLimit.value);

  const show = ref(false);
  const loading = ref(false);
  const current = ref(1);
  const total = ref(0);
  const list = ref<ImageItem[]>([]);
  const isEmptyData = computed(() => list.value.length === 0 && !loading.value);

  const fetchData = async () => {
    try {
      loading.value = true;
      const { data } = await axios.get(props.action, {
        params: {
          page: current.value,
          page_size: 18,
        },
      });
      list.value = data.list;
      total.value = data.total;
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

  const onDeleteItem = async (data: ImageItem) => {
    try {
      loading.value = true;
      await axios.delete(props.action, {
        data: {
          id: data.id,
        },
      });
      onRefresh();
    } finally {
      loading.value = false;
    }
  };

  // 仅用于触发弹窗，它不做其它操作
  const handleButtonClick = () => {
    return new Promise<FileList>((resolve) => {
      show.value = true; // 显示弹窗
      fetchData(); // 获取数据
      // 返回一个空的 FileList
      resolve(new DataTransfer().files);
    });
  };

  const handleCancelModal = () => {
    show.value = false;
  };

  const handleConfirmModal = () => {
    show.value = false;
    if (fileLimit.value !== 1) {
      const newFiles = list.value
        .filter((item) => selectKeys.value.includes(item.id))
        .map((item) => ({
          uid: item.id,
          url: item.url,
        }));
      fileList.value = [...fileList.value, ...newFiles];
      emits('update:modelValue', fileList.value);
    } else {
      const newFile = list.value.find((item) => item.id === selectKey.value);
      if (newFile) {
        fileList.value = [
          {
            uid: newFile.id,
            url: newFile.url,
          },
        ];
        emits('update:modelValue', newFile?.url);
      }
    }
  };

  const closeModal = () => {
    selectKey.value = '';
    selectKeys.value = [];
  };

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

  onMounted(() => {
    // uid 是 <a-uploader /> 的 FileItem 的参数
    // 我用它来标识图片的唯一性，当初始化的时候，没有就构造了一个
    // item.key 是考虑到接口有可能会返回它，比如上传到云存储的也会返回一个key
    if (Array.isArray(props.modelValue)) {
      fileList.value = props.modelValue.map((item, index) => {
        return {
          uid: item.id || item.key || `uid-${index}-${Date.now()}`,
          url: item.url || item,
        };
      });
    } else {
      fileLimit.value = 1;
      fileList.value = [
        {
          uid: `uid-${Date.now()}`,
          url: props.modelValue,
        },
      ];
    }
  });
</script>

<template>
  <div class="uploader-container">
    <!--主要用于展示图片信息及上传按钮，并不太想去重写样式，就复用它了-->
    <!--还好它有个 button-click 可以阻止后续的动作-->
    <a-upload
      v-model:file-list="fileList"
      :action="action"
      :limit="fileLimit"
      :class="'m-' + mode"
      list-type="picture-card"
      image-loading="lazy"
      image-preview
      @button-click="handleButtonClick"
      @before-remove="beforeRemove"
    />

    <!--图片上传、选择弹窗-->
    <a-modal
      v-model:visible="show"
      :mask-closable="false"
      :modal-style="{ 'width': '100%', 'min-width': '360px', 'max-width': '820px' }"
      title="图片例表"
      title-align="start"
      @close="closeModal"
    >
      <div class="toolbar-container">
        <!--这个按钮才实现了上传功能-->
        <a-upload
          :show-file-list="false"
          :limit="limit"
          :name="name"
          accept="image/png, image/jpeg, image/gif"
          multiple
        />
        <a-button @click="onRefresh">
          <template #icon><icon-refresh /></template>
        </a-button>
      </div>
      <a-spin :loading="loading" class="gallery-container">
        <a-empty v-if="isEmptyData" style="margin: 0 auto" />
        <div class="gallery-image-container">
          <!--使用官方的组件来实现单选和多选-->
          <a-radio-group v-if="fileLimit === 1" v-model="selectKey">
            <a-row :gutter="[12, 12]">
              <a-col v-for="item in list" :key="item.id" :span="4">
                <a-radio :value="item.id">
                  <template #radio="{ checked }">
                    <Item :data="item" :checked="checked" @delete="onDeleteItem" />
                  </template>
                </a-radio>
              </a-col>
            </a-row>
          </a-radio-group>
          <a-checkbox-group v-else v-model="selectKeys" :disabled="checkboxDisabled">
            <a-row :gutter="[12, 12]">
              <a-col v-for="item in list" :key="item.id" :span="4">
                <a-checkbox :value="item.id">
                  <template #checkbox="{ checked }">
                    <Item :data="item" :checked="checked" @delete="onDeleteItem" />
                  </template>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </a-spin>

      <template #footer>
        <div class="footer-container">
          <a-pagination :total="total" :current="current" show-total simple @change="onChangePage" />
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
    align-items: center;
    min-height: 400px;

    .gallery-image-container {
      margin-top: 20px;
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
