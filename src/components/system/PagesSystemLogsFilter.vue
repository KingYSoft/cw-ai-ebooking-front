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
            density="compact"
            hide-details
            item-title="title"
            item-value="key"
            :items="inputSearchData.field1.keyItems"
            :list-props="{ density: 'compact' }"
            :menu-props="{ 'max-width': 'auto' }"
            no-filter
            variant="underlined"
            width="90"
          />

          <f-date-picker
            v-model:date-value="inputSearchData.field1.start"
            :date-props="{ placeholder: 'Start Date', clearable: false }"
            :max="inputSearchData.field1.end ?? '2099-12-31'"
            min="2000-01-01"
            min-width="auto"
            width="120"
          />
          -
          <f-date-picker
            v-model:date-value="inputSearchData.field1.end"
            :date-props="{ placeholder: 'End Date', clearable: false }"
            max="2099-12-31"
            :min="inputSearchData.field1.start ?? '2000-01-01'"
            min-width="auto"
            width="120"
          />
        </div>
      </v-col>

      <v-col :cols="rescols('c12l6m6s6')">
        <div class="d-flex align-center ga-1">
          <div>
            <v-select
              v-model="inputSearchData.field2.key"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="title"
              item-value="key"
              :items="inputSearchData.field2.keyItems"
              :list-props="{ density: 'compact' }"
              :menu-props="{ 'max-width': 'auto' }"
              min-width="120"
              no-filter
              variant="underlined"
              width="120"
            />
          </div>

          <v-text-field
            v-model="inputSearchData.field2.val"
            clearable
            color="primary"
            density="compact"
            hide-details
            min-width="auto"
            placeholder="Service / Method"
            type="input"
            variant="outlined"
            width="auto"
          />
        </div>
      </v-col>
    </template>

    <template #more>
      <v-col v-for="ii in getMoreItems" :key="ii.key" :cols="rescols('c12m6l4')">
        <f-input
          v-model="inputSearchData[ii.key].val"
          v-model:op="inputSearchData[ii.key].op"
          :component-props="inputSearchData[ii.key].componentProps"
          :component-type="inputSearchData[ii.key].componentType"
        >
          <template #prepend>
            <div class="text-caption text-end w-label">{{ inputSearchData[ii.key].title }}:</div>
          </template>
        </f-input>
      </v-col>
    </template>
  </PageFilterBar>
</template>

<script setup>
  import { computed } from 'vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  const { rescols } = useLayoutCols()

  defineOptions({
    name: 'PagesSystemLogsFilter',
  })

  const inputSearchData = defineModel('input-search-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const emit = defineEmits(['on-search', 'on-reset-more'])

  const onResetMore = () => {
    emit('on-reset-more')
  }

  const onSearch = () => {
    emit('on-search')
  }

  const getMoreItems = computed(() => {
    const items = inputSearchData.value
    const moreItems = []
    Object.keys(items).forEach(key => {
      const current = items[key]
      if (current.more) {
        moreItems.push(current)
      }
    })
    return moreItems
  })
</script>
