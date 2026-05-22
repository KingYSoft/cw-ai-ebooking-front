<template>
  <div class="v-data-table-footer">
    <slot name="footer.prepend" />

    <div class="v-data-table-footer__items-per-page">
      <span>{{ t('$vuetify.dataFooter.itemsPerPageText') }}</span>

      <v-select
        v-model="pageObj.pageSize"
        auto-select-first
        autocomplete="off"
        density="compact"
        hide-details
        item-title="title"
        item-value="value"
        :items="
          pageObj.items ?? [
            { value: 500, title: '500' },
            { value: 1000, title: '1000' },
            { value: 2000, title: '2000' },
            { value: 5000, title: '5000' },
            { value: 10000, title: '10000' },
            { value: 1000000, title: t('$vuetify.dataFooter.itemsPerPageAll') },
          ]
        "
        :list-props="{
          density: 'compact',
        }"
        :menu-props="{
          'max-width': 'auto',
        }"
        no-filter
        variant="outlined"
        width="auto"
        @update:model-value="queryTbl"
      />
    </div>

    <div class="v-data-table-footer__info">{{ pageFirst }}-{{ pageLast }} of {{ totalCount }}</div>

    <div class="v-data-table-footer__pagination">
      <div>
        <v-pagination
          v-model="pageObj.pageIndex"
          :length="pageCount"
          rounded="circle"
          show-first-last-page
          size="x-small"
          :total-visible="0"
          @update:model-value="queryTbl"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useLocale } from 'vuetify'

  /** 与 settlement 等列表请求一致：选「全部」时前端按批 100_000 拉取 */
  const PAGE_SIZE_ALL_SENTINEL = 1_000_000
  const PAGE_SIZE_ALL_EFFECTIVE = 100_000

  defineOptions({
    name: 'FDataTableFooter',
  })
  const { t } = useLocale()

  const props = defineProps({
    totalCount: {
      type: Number,
      default: () => 0,
    },
  })
  const { totalCount } = toRefs(props)

  const pageObj = defineModel('page-obj', {
    type: Object,
    default: () => {
      return {
        pageSize: 2000,
        pageIndex: 1,
      }
    },
  })
  const emit = defineEmits(['query-tbl'])
  const queryTbl = () => {
    emit('query-tbl')
  }

  const effectivePageSize = computed(() => {
    const ps = Number(pageObj.value.pageSize) || 0
    return ps >= PAGE_SIZE_ALL_SENTINEL ? PAGE_SIZE_ALL_EFFECTIVE : ps
  })

  const pageCount = computed(() => {
    const size = effectivePageSize.value
    if (!size) return 0
    return Math.ceil(totalCount.value / size)
  })
  const pageFirst = computed(() => {
    const offset = (pageObj.value.pageIndex - 1) * effectivePageSize.value
    return totalCount.value === 0 ? 0 : offset + 1
  })
  const pageLast = computed(() => {
    if (totalCount.value === 0) return 0
    const offset = (pageObj.value.pageIndex - 1) * effectivePageSize.value
    let last = offset + effectivePageSize.value
    if (totalCount.value < last) {
      last = totalCount.value
    }
    return last
  })
</script>
