<template>
  <v-list-item
    class="portal-nav-item"
    rounded="lg"
    :title="menuInfo.title"
    :to="menuInfo.path"
    :value="menuInfo.code"
  >
    <template #prepend>
      <v-icon :icon="menuInfo.icon" size="20" />
    </template>

    <template #append>
      <span class="portal-nav-dot" />
    </template>
  </v-list-item>
</template>

<script setup>
  defineOptions({
    name: 'LayoutMenuItem',
  })

  defineProps({
    menuInfo: {
      type: Object,
      default: () => null,
    },
    fluid: {
      type: Boolean,
      default: () => false,
    },
  })
</script>
