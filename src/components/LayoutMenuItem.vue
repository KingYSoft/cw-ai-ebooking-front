<template>
  <v-list-item
    :prepend-icon="menuInfo.icon"
    rounded="te-xl be-xl"
    :title="menuInfo.title"
    :to="menuInfo.path"
    :value="menuInfo.code"
  />
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
