<template>
  <div class="layout-with-sider">
    <div class="layout-sider" :style="{ width: computedSiderWidth }">
      <slot name="sider" />
    </div>

    <div class="layout-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    siderWidth: {
      type: [Number, String],
      default: 256
    }
  })

  const computedSiderWidth = computed(() => {
    const width = props.siderWidth
    if (typeof width === 'number') {
      return `${width}px`
    }
    // 如果是字符串，检查是否已经包含单位
    if (typeof width === 'string') {
      // 如果已经包含 px, rem, em, %, vw, vh 等单位，直接返回
      if (/^\d+(px|rem|em|%|vw|vh|ex|ch|cm|mm|in|pt|pc)$/.test(width)) {
        return width
      }
      // 如果是纯数字字符串，添加 px
      if (/^\d+$/.test(width)) {
        return `${width}px`
      }
    }
    return width
  })
</script>

<style lang="scss" scoped>
.layout-with-sider {
  display: flex;
  height: 100%;
  gap: var(--global-padding-small);
  background: rgb(var(--v-theme-background));
}

.layout-sider {
  flex-shrink: 0;
  background-color: rgb(var(--v-theme-surface));
}

.layout-container {
  flex: 1;
  overflow: auto;
  padding: var(--global-padding-small);
  background-color: rgb(var(--v-theme-surface));
}
</style>
