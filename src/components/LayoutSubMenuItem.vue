<template>
  <v-list-group class="portal-nav-group" color="transparent" :fluid="fluid" :value="menuInfo.code">
    <template #activator="{ props }">
      <v-list-item v-bind="props" class="portal-nav-category" rounded="lg" :title="menuInfo.title">
        <template #prepend>
          <v-icon :icon="menuInfo.icon" size="20" />
        </template>
      </v-list-item>
    </template>

    <slot />
  </v-list-group>
</template>

<script setup>
  defineOptions({
    name: 'LayoutSubMenuItem',
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
