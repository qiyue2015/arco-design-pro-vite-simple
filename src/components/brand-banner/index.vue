<template>
  <div class="brand-banner-container">
    <div class="brand-banner-inner">
      <div class="brand-banner-inner-content">
        <div class="brand-banner-inner-content-title">{{ title }}</div>
        <div class="brand-banner-inner-content-description">
          <template v-if="description">{{ description }}</template>
          <slot v-else />
        </div>
      </div>
      <div v-if="thumb" class="brand-banner-inner-thumb">
        <img :src="thumb" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    thumb: {
      type: String,
      default: '',
    },
  });
</script>

<style lang="less" scoped>
  .brand-banner {
    &-container {
      width: 100%;
      min-height: 220px;
    }
    &-inner {
      display: flex;
      align-items: flex-start;
      position: relative;

      &-content {
        flex: 1;
        overflow: hidden;
        margin-right: 540px;
        padding-top: 16px;

        &-title {
          font-weight: 500;
          font-size: 30px;
          line-height: 38px;
          color: var(--color-text-1);
        }

        &-description {
          margin-top: 16px;
          font-size: 13px;
          line-height: 22px;
          color: var(--color-text-2);
        }

        &-operation {
          margin-top: 24px;
        }
      }

      &-thumb {
        height: 220px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;

        img {
          height: 220px;
          width: 480px;
        }
      }
    }
  }
</style>
