<template>
  <v-list-group color="transparent" :fluid="fluid" :value="menuInfo.code">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="menuInfo.icon"
        rounded="te-xl be-xl"
        :title="menuInfo.title"
      />
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
