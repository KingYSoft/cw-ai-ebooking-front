<template>
  <FPageLayout :card-loading="loading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesPartyGroupFilter
        ref="refFilter"
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="onFilterSearch"
      />
    </template>

    <FTableLayout
      :headers="headers"
      :items="items"
      :max-height="maxHeight"
      :setting-name="`system-${role.toLowerCase()}-group`"
      striped="even"
      :title="t(role)"
      virtual
      @row-dblclick="(_, value) => edit(value.item)"
    >
      <template #actions>
        <v-btn
          v-if="canEdit"
          color="primary"
          prepend-icon="$plus"
          size="small"
          variant="flat"
          @click="router.push({ name: 'system_party_group_new', query: { role_type: role } })"
        >
          {{ t('new') }}
        </v-btn>
      </template>

      <template #item-actions="{ item }">
        <v-menu>
          <template #activator="{ props: ddProps }">
            <v-btn
              v-bind="ddProps"
              density="comfortable"
              :disabled="loading"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list
            density="compact"
            :disabled="loading"
            item-props
            item-value="code"
            :items="getRowMenuItems(item)"
            slim
            @click:select="handleRowMenuSelect($event, item)"
          />
        </v-menu>
      </template>

      <template #item.is_active="{ item }">
        <v-chip
          :color="item.is_active === 1 ? 'success' : 'warning'"
          density="comfortable"
          size="small"
        >
          {{ t(item.is_active === 1 ? 'active' : 'inactive') }}
        </v-chip>
      </template>

      <template #bottom>
        <FDataTableFooter v-model:page-obj="pageObj" :total-count="total" @query-tbl="queryData" />
      </template>
    </FTableLayout>
  </FPageLayout>
</template>
<script setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { queryPartyGroupPage } from '@/api/party-group'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import { usePartyGroupI18n } from '@/composables/usePartyGroupI18n'
  import { useAppStore } from '@/stores/app'

  const props = defineProps({ role: { type: String, required: true } })
  const { t } = usePartyGroupI18n()
  const router = useRouter()
  const app = useAppStore()
  const display = useDisplay()

  const canEdit = computed(() => app.auth.isGranted('PERMISSION_SYSTEM_PARTY_GROUP_EDIT'))
  const query = ref('')
  const active = ref(null)
  const items = ref([])
  const total = ref(0)
  const loading = ref(false)
  const skeletonLoading = ref(true)
  const pageObj = ref({
    pageSize: 20,
    pageIndex: 1,
    items: [20, 50, 100, 200].map(value => ({ value, title: String(value) })),
  })

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const refFilter = ref(null)
  const maxHeight = computed(() => {
    return contentHeight.value - (refFilter.value?.$el?.clientHeight ?? 0) - 12 - 52 - 14
  })

  const defaultFilters = () => ({
    field1: {
      key: 'code',
      title: 'Code',
      keyItems: [
        { key: 'code', title: 'Code' },
        { key: 'description', title: 'Description' },
      ],
      val: '',
      op: 'Contain',
      opItems: ['Equal', 'Not Equal', 'Contain', 'Not Contain'],
    },
    is_active: {
      key: 'is_active',
      title: 'Is Active',
      val: '',
      op: '=',
      opItems: ['='],
      componentProps: {
        density: 'compact',
        'hide-details': true,
        items: [
          { title: t('all'), value: '' },
          { title: t('active'), value: 1 },
          { title: t('inactive'), value: 0 },
        ],
      },
      componentType: 'v-select',
      more: true,
    },
  })

  const inputSearchData = ref(defaultFilters())

  const headers = computed(() => [
    { title: '', key: 'actions', align: 'center', sortable: false, width: '36px' },
    { title: '#', key: 'index', align: 'center', sortable: false, width: '36px' },
    ...['code', 'description', 'is_active', 'org_count', 'link_count'].map((key, index) => ({
      key,
      title: t(['code', 'description', 'status', 'orgCount', 'linkCount'][index]),
      sortable: false,
      width: key === 'description' ? 'auto' : '120px',
    })),
  ])

  const buildFilters = () => {
    const filters = [
      {
        key: 'role_type',
        op: '=',
        val: props.role,
      },
      {
        key: inputSearchData.value.field1.key,
        op: inputSearchData.value.field1.op,
        val: inputSearchData.value.field1.val,
      },
    ]

    Object.keys(inputSearchData).forEach(key => {
      const field = inputSearchData[key]
      if (field?.more) {
        filters.push({ key: field.key, op: field.op, val: field.val })
      }
    })

    return filters
  }

  let sequence = 0
  async function queryData() {
    const request = ++sequence
    loading.value = true
    try {
      const { success, data } = await queryPartyGroupPage({
        filters: buildFilters(),
        // role_type: props.role,
        // query: query.value,
        // is_active: active.value,
        SkipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        MaxResultCount: pageObj.value.pageSize,
      })
      if (request !== sequence) return
      if (success) {
        skeletonLoading.value = false
        const aaa = data.items ?? []
        items.value = aaa.map((item, index) => ({
          ...item,
          index: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1,
        }))
        total.value = data.totalCount || 0
      }
    } catch (error) {
      console.error(error)
      if (request === sequence) {
        items.value = []
      }
    } finally {
      if (request === sequence) loading.value = false
    }
  }

  const onResetMore = () => {
    inputSearchData.value = defaultFilters()
  }
  const onFilterSearch = () => {
    pageObj.value.pageIndex = 1
    return queryData()
  }
  function edit(item) {
    router.push({
      name: 'system_party_group_edit-pk',
      params: { pk: item.pk },
      query: { role_type: props.role },
    })
  }
  queryData()

  const getRowMenuItems = () => [
    { title: t('edit'), prependIcon: 'mdi-pencil', code: 'edit' },
    { type: 'divider' },
    // {
    //   title: t('delete'),
    //   prependIcon: 'mdi-delete',
    //   code: 'delete',
    //   color: 'red',
    //   baseColor: 'red',
    // },
  ]

  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'edit': {
        edit(item)
        return
      }
      default: {
        break
      }
    }
  }
</script>
