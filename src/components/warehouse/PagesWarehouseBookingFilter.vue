<template>
  <PageFilterBar
    v-model:input-search-data="inputSearchData"
    @on-reset-more="onResetMore"
    @on-search="onSearch"
  >
    <template #default>
      <v-col cols="auto">
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
            no-data-text="$vuetify.custom.app.searchMore"
            no-filter
            variant="underlined"
            width="60"
          />

          <f-date-picker
            v-model:date-value="inputSearchData.field1.start"
            :date-props="{
              placeholder: filter('startDate'),
              clearable: true,
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
              placeholder: filter('endDate'),
              clearable: true,
            }"
            max="2099-12-31"
            :min="inputSearchData.field1.start ?? '2000-01-01'"
            min-width="auto"
            width="100"
          />
        </div>
      </v-col>

      <v-col cols="auto">
        <div class="d-flex align-center ga-1 filter-field-compact">
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
            no-data-text="$vuetify.custom.app.searchMore"
            no-filter
            variant="underlined"
            width="88"
          />

          <v-text-field
            v-model="inputSearchData.field2.val"
            clearable
            color="primary"
            density="compact"
            hide-details
            :placeholder="filter('searchPlaceholder')"
            type="input"
            variant="outlined"
            width="168"
          />
        </div>
      </v-col>

      <v-col cols="auto">
        <div class="d-flex align-center ga-1 filter-field-compact">
          <div class="text-caption text-end filter-label">{{ filter('marketId') }}:</div>

          <v-select
            v-model="inputSearchData.wso_market.val"
            auto-select-first
            autocomplete="off"
            clearable
            density="compact"
            hide-details
            item-title="market"
            item-value="market"
            :items="marketOptions"
            :menu-props="{ maxWidth: '280px' }"
            no-filter
            variant="outlined"
            width="160"
          />
        </div>
      </v-col>
    </template>
  </PageFilterBar>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getWhsMarketOptions } from '@/api/whs-market'
  import PageFilterBar from '@/components/PageFilterBar.vue'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'

  const { filter } = useWarehouseOrderPageI18n()

  defineOptions({
    name: 'PagesWarehouseBookingFilter',
  })

  const inputSearchData = defineModel('input-search-data', {
    type: Object,
    default: () => ({}),
  })

  const emit = defineEmits(['on-search', 'on-reset-more'])
  const marketOptions = ref([])

  const loadMarketOptions = async () => {
    try {
      const { data } = await getWhsMarketOptions()
      marketOptions.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error(error)
      marketOptions.value = []
    }
  }

  onMounted(() => {
    loadMarketOptions()
  })

  const onResetMore = () => {
    emit('on-reset-more')
  }

  const onSearch = () => {
    emit('on-search')
  }
</script>

<style lang="scss" scoped>
  .filter-field-compact {
    flex-wrap: nowrap;
  }

  .filter-label {
    min-width: 64px;
  }
</style>
