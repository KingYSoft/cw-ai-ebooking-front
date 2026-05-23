<template>
  <PageFilterBar
    v-model:input-search-data="inputSearchData"
    @on-reset-more="onResetMore"
    @on-search="onSearch"
  >
    <template #default>
      <v-col :cols="rescols('c12m4s6')">
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
            :list-props="{
              density: 'compact',
            }"
            :menu-props="{
              'max-width': 'auto',
            }"
            no-data-text="$vuetify.custom.app.searchMore"
            no-filter
            variant="underlined"
            width="60"
          />

          <f-date-picker
            v-model:date-value="inputSearchData.field1.start"
            :date-props="{
              placeholder: 'Start Date',
              clearable: false,
            }"
            :max="inputSearchData.field1.end ?? '2099-12-31'"
            min="2000-01-01"
            min-width="auto"
            width="100"
          />
          -
          <f-date-picker
            v-model:date-value="inputSearchData.field1.end"
            :date-props="{
              placeholder: 'End Date',
              clearable: false,
            }"
            max="2099-12-31"
            :min="inputSearchData.field1.start ?? '2000-01-01'"
            min-width="auto"
            width="100"
          />
        </div>
      </v-col>

      <v-col :cols="rescols('c12m4s6')">
        <div class="d-flex align-center ga-1">
          <v-select
            v-model="inputSearchData.field2.key"
            auto-select-first
            autocomplete="off"
            density="compact"
            hide-details
            item-title="title"
            item-value="key"
            :items="inputSearchData.field2.keyItems"
            :list-props="{
              density: 'compact',
            }"
            max-width="120"
            :menu-props="{
              'max-width': 'auto',
            }"
            min-width="120"
            no-data-text="$vuetify.custom.app.searchMore"
            no-filter
            variant="underlined"
            width="120"
          />

          <v-text-field
            v-model="inputSearchData.field2.val"
            class="flex-1-0"
            clearable
            color="primary"
            density="compact"
            hide-details
            min-width="auto"
            placeholder="Shipper / Job Number"
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

  import PageFilterBar from '@/components/PageFilterBar.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  const { rescols } = useLayoutCols()

  defineOptions({
    name: 'PagesWarehouseBookingFilter',
  })

  const inputSearchData = defineModel('input-search-data', {
    type: Object,
    default: () => ({}),
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
    const aa = []
    Object.keys(items).forEach(key => {
      const ee = items[key]
      if (ee.more) {
        aa.push(ee)
      }
    })
    return aa
  })
</script>
