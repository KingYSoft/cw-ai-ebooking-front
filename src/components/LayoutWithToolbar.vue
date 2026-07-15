<template>
  <div>
    <v-toolbar
      color="transparent"
      density="compact"
      :style="{ backgroundColor: bgColor }"
      :title="title"
    >
      <v-toolbar-title>
        <slot name="title" />
      </v-toolbar-title>

      <v-spacer v-if="spacer" />

      <template #append>
        <div class="d-flex algin-center ga-1">
          <slot name="actions" />
        </div>
      </template>

      <slot name="extension" />
    </v-toolbar>

    <v-divider v-if="divider" />
    <slot />
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
    height: {
      type: [Number, String],
      default: 48,
    },
    bgColor: {
      type: String,
      default: '',
    },
    spacer: {
      type: Boolean,
      default: false,
    },
    divider: {
      type: Boolean,
      default: true,
    },
  })
</script>

<!-- <style lang="scss" scoped>
  :deep(.v-toolbar) {
    padding: 0 var(--global-padding-small);
    background-color: rgba(var(--v-theme-surface));
    height: v-bind(computedHeight) !important;
  }
  :deep(.v-toolbar__content) {
    height: v-bind(computedHeight) !important;
  }

  :deep(.v-toolbar-title) {
    margin: 0;
  }

  :deep(.v-btn--size-small) {
    padding: 0 var(--global-padding-small);
  }
</style> -->
