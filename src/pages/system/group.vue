<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesSystemGroupFilter
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="queryData"
      />
    </template>

    <FTableLayout
      ref="refTableLayout"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="maxHeight"
      striped="even"
      :title="groupList('title')"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="$plus" size="small" variant="flat" @click="onNewGroup">
          {{ common('new') }}
        </v-btn>
      </template>

      <template #item.is_admin="{ item }">
        <v-chip
          :color="item.is_admin === 'Y' ? 'success' : 'default'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.is_admin === 'Y' ? common('yes') : common('no') }}
        </v-chip>
      </template>

      <template #item.is_active="{ item }">
        <v-chip
          :color="item.is_active === 1 ? 'success' : 'error'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.is_active === 1 ? common('active') : common('inactive') }}
        </v-chip>
      </template>

      <template #bottom>
        <v-divider />

        <FDataTableFooter
          v-model:page-obj="pageObj"
          :total-count="totalCount"
          @query-tbl="queryData"
        />
      </template>
    </FTableLayout>
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { queryGroupPage } from '@/api/group'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PagesSystemGroupFilter from '@/components/system/PagesSystemGroupFilter.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  const { common, groupList } = useSystemPageI18n()

  defineOptions({ name: 'SystemGroup' })
  definePage({
    name: 'system_group',
    icon: 'mdi-account-multiple-outline',
    menu: true,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_GROUP',
    },
  })

  const display = useDisplay()
  const router = useRouter()

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const maxHeight = computed(() => contentHeight.value - 12 - 65 - 52 - 14)
  const skeletonLoading = ref(true)
  const cardLoading = ref(false)

  const defaultFilterData = () => ({
    field1: {
      key: 'code',
      title: groupList('filter.code'),
      keyItems: [
        { key: 'code', title: groupList('filter.code') },
        { key: 'desc', title: groupList('filter.description') },
      ],
      val: '',
      op: 'Contain',
      opItems: ['Equal', 'Not Equal', 'Contain', 'Not Contain'],
    },
  })

  const inputSearchData = ref(defaultFilterData())
  const onResetMore = () => {
    inputSearchData.value = defaultFilterData()
  }

  const refTableLayout = ref(null)
  const tblItems = ref([])
  const pageObj = ref({
    pageSize: 100,
    pageIndex: 1,
    items: [
      { value: 100, title: '100' },
      { value: 200, title: '200' },
      { value: 500, title: '500' },
      { value: 1000, title: '1000' },
    ],
  })
  const totalCount = ref(0)

  const tblHeaders = computed(() => [
    { title: '#', key: 'index', align: 'center', sortable: false, width: '50px' },
    { title: groupList('headers.code'), key: 'code', align: 'start', minWidth: '180px' },
    { title: groupList('headers.description'), key: 'desc', align: 'start', minWidth: '260px' },
    { title: groupList('headers.admin'), key: 'is_admin', align: 'center', minWidth: '100px' },
    { title: groupList('headers.status'), key: 'is_active', align: 'center', minWidth: '110px' },
  ])

  const buildFilter = () => {
    return Object.keys(inputSearchData.value).map(key => {
      const item = inputSearchData.value[key]
      return {
        key: item.key,
        op: item.op,
        val: item.val,
      }
    })
  }

  const queryData = async () => {
    cardLoading.value = true
    try {
      const { data } = await queryGroupPage({
        SkipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        MaxResultCount: pageObj.value.pageSize,
        filters: buildFilter(),
      })
      skeletonLoading.value = false
      if (data) {
        const items = data.items ?? []
        tblItems.value = items.map((item, index) => ({
          ...item,
          index: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1,
        }))
        totalCount.value = data.totalCount || 0
        nextTick(() => {
          refTableLayout.value?.initHeaders()
          refTableLayout.value?.initScrollListener()
        })
      }
    } catch (error) {
      console.error('Query groups failed:', error)
    } finally {
      cardLoading.value = false
    }
  }

  queryData()

  function onRowDblClick(event, { item }) {
    if (
      event?.target?.closest?.('.v-selection-control, button, a, input, textarea, [role="button"]')
    )
      return
    router.push({
      name: 'system_group_edit-pk',
      params: { pk: item.pk },
      query: { code: item.code },
    })
  }

  const onNewGroup = () => {
    router.push({ name: 'system_group_new' })
  }
</script>
