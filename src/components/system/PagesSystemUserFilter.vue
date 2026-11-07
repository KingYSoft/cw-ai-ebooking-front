<template>
  <PageFilterBar
    v-model:input-search-data="inputSearchData"
    @on-reset-more="onResetMore"
    @on-search="onSearch"
  >
    <template #default>
      <v-col :cols="rescols('c12l4m4')">
        <div class="d-flex align-center ga-1">
          <v-select
            v-model="inputSearchData.field1.key"
            auto-select-first
            autocomplete="off"
            class="flex-0-0"
            density="compact"
            hide-details
            item-title="title"
            item-value="key"
            :items="inputSearchData.field1.keyItems"
            :list-props="{ density: 'compact' }"
            max-width="120"
            :menu-props="{ 'max-width': 'auto' }"
            min-width="120"
            no-filter
            variant="underlined"
            width="120"
          />

          <v-select
            v-model="inputSearchData.field1.op"
            auto-select-first
            autocomplete="off"
            class="flex-0-0"
            density="compact"
            hide-details
            :items="inputSearchData.field1.opItems"
            :list-props="{ density: 'compact' }"
            max-width="120"
            :menu-props="{ 'max-width': 'auto' }"
            min-width="120"
            no-filter
            variant="outlined"
            width="120"
          />

          <v-text-field
            v-model="inputSearchData.field1.val"
            class="flex-1-1"
            clearable
            color="primary"
            density="compact"
            hide-details
            min-width="auto"
            type="input"
            variant="outlined"
            width="auto"
          />
        </div>
      </v-col>
    </template>
  </PageFilterBar>
</template>

<script setup>
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineOptions({ name: 'PagesSystemUserFilter' })

  const { rescols } = useLayoutCols()

  const inputSearchData = defineModel('input-search-data', {
    type: Object,
    default: () => ({}),
  })

  const emit = defineEmits(['on-search', 'on-reset-more'])
  const onResetMore = () => emit('on-reset-more')
  const onSearch = () => emit('on-search')
</script>
