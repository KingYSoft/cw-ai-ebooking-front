<template>
  <v-divider v-if="menuInfo && menuInfo.code === 'system'" class="my-2" />

  <component :is="menuComponent" :fluid="fluid" :menu-info="menuInfo">
    <template v-if="menuInfo && menuInfo.children && menuInfo.children.length > 0">
      <LayoutMenu
        v-for="item in menuInfo.children"
        :key="item.code"
        :fluid="fluid"
        :menu-info="item"
      />
    </template>
  </component>
</template>

<script setup>
  import { computed } from 'vue'
  import LayoutMenuItem from './LayoutMenuItem.vue'
  import LayoutSubMenuItem from './LayoutSubMenuItem.vue'

  defineOptions({
    name: 'LayoutMenu',
  })
  const props = defineProps({
    menuInfo: {
      type: Object,
      default: () => null,
    },
    fluid: {
      type: Boolean,
      default: () => false,
    },
  })

  const menuComponent = computed(() => {
    if (props.menuInfo && props.menuInfo.children && props.menuInfo.children.length > 0) {
      return LayoutSubMenuItem
    } else {
      return LayoutMenuItem
    }
  })
</script>
