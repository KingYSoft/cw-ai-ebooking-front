<template>
  <FPageLayout :card-loading="loading || deleting" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesSystemPartyRoleFilter
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="onFilterSearch"
      />
    </template>

    <FTableLayout
      ref="tableRef"
      disable-sort
      :headers="headers"
      :items="items"
      :max-height="maxHeight"
      setting-name="system-party-role"
      striped="even"
      :title="t('title')"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #actions>
        <v-btn
          color="primary"
          :disabled="loading || deleting"
          prepend-icon="$plus"
          size="small"
          variant="flat"
          @click="router.push({ name: 'system_party_role_new' })"
        >
          {{ t('new') }}
        </v-btn>
      </template>

      <template #item-actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              :disabled="loading || deleting"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list
            density="compact"
            :disabled="loading || deleting"
            item-props
            item-value="code"
            :items="getRowMenuItems(item)"
            slim
            @click:select="handleRowMenuSelect($event, item)"
          />
        </v-menu>
      </template>

      <template #item.is_active="{ item }">
        <v-chip :color="item.is_active === 1 ? 'success' : 'error'" size="small" variant="tonal">
          {{ t(item.is_active === 1 ? 'active' : 'inactive') }}
        </v-chip>
      </template>

      <!-- <template #item-actions="{ item }">
        <div class="d-flex ga-1">
          <v-btn
            color="primary"
            :disabled="loading || deleting"
            size="small"
            variant="text"
            @click.stop="editRole(item)"
          >
            {{ t('edit') }}
          </v-btn>

          <v-btn
            color="error"
            :disabled="loading || deleting"
            size="small"
            variant="text"
            @click.stop="openDelete(item)"
          >
            {{ t('delete') }}
          </v-btn>
        </div>
      </template> -->

      <template #bottom>
        <v-divider />

        <FDataTableFooter
          v-model:page-obj="pageObj"
          :total-count="totalCount"
          @query-tbl="queryData"
        />
      </template>
    </FTableLayout>

    <v-dialog v-model="deleteDialog" max-width="480" :persistent="deleting">
      <v-card :title="t('deleteRoleTitle')">
        <v-card-text>
          {{ t('deleteRoleMessage', deleteTarget?.code || '', deleteTarget?.relation_count ?? 0) }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="deleting" @click="deleteDialog = false">{{ t('cancel') }}</v-btn>

          <v-btn
            color="error"
            :disabled="deleting"
            :loading="deleting"
            variant="flat"
            @click="confirmDelete"
          >
            {{ t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { deletePartyRole, queryPartyRolePage } from '@/api/party-role'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PagesSystemPartyRoleFilter from '@/components/system/PagesSystemPartyRoleFilter.vue'
  import { usePartyRoleI18n } from '@/composables/usePartyRoleI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'SystemPartyRole' })
  definePage({
    name: 'system_party_role',
    icon: 'mdi-account-switch-outline',
    menu: true,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_ROLE',
    },
  })

  const { t } = usePartyRoleI18n()
  const router = useRouter()
  const appStore = useAppStore()
  const display = useDisplay()
  const maxHeight = computed(() => Math.max(180, display.height.value - 300))

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
    { title: '#', key: 'index', width: '50px', align: 'center' },
    { title: t('code'), key: 'code', minWidth: '180px' },
    { title: t('description'), key: 'description', minWidth: '260px' },
    { title: t('status'), key: 'is_active', width: '110px', align: 'center' },
    { title: t('relationCount'), key: 'relation_count', width: '120px', align: 'center' },
  ])
  const tableRef = ref(null)
  const items = ref([])
  const totalCount = ref(0)
  const pageObj = ref({
    pageSize: 100,
    pageIndex: 1,
    items: [100, 200, 500, 1000].map(value => ({ value, title: String(value) })),
  })
  watch(
    () => pageObj.value.pageSize,
    () => {
      pageObj.value.pageIndex = 1
    },
    { flush: 'sync' },
  )
  const loading = ref(false)
  const skeletonLoading = ref(true)
  const deleting = ref(false)
  const deleteDialog = ref(false)
  const deleteTarget = ref(null)

  const buildFilters = () => {
    const filters = [
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

  const queryData = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const offset = (pageObj.value.pageIndex - 1) * pageObj.value.pageSize
      const { success, data } = await queryPartyRolePage({
        filters: buildFilters(),
        SkipCount: offset,
        MaxResultCount: pageObj.value.pageSize,
      })
      if (!success || !Array.isArray(data?.items)) throw new Error('List request failed')
      items.value = data.items.map((item, index) => ({ ...item, index: offset + index + 1 }))
      totalCount.value = data.totalCount ?? 0
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      skeletonLoading.value = false
      await nextTick()
      tableRef.value?.initHeaders()
      tableRef.value?.initScrollListener()
    }
  }

  const onResetMore = () => {
    inputSearchData.value = defaultFilters()
  }
  const onFilterSearch = () => {
    pageObj.value.pageIndex = 1
    return queryData()
  }
  const editRole = item =>
    router.push({
      name: 'system_party_role_edit-pk',
      params: { pk: item.pk },
      query: { code: item.code },
    })
  const onRowDblClick = (event, { item }) => {
    if (event?.target?.closest?.('button, a, input, textarea, [role="button"]')) return
    if (!loading.value && !deleting.value) editRole(item)
  }
  const openDelete = item => {
    deleteTarget.value = item
    deleteDialog.value = true
  }
  const confirmDelete = async () => {
    if (deleting.value || !deleteTarget.value?.pk) return
    deleting.value = true
    try {
      const { success } = await deletePartyRole(deleteTarget.value.pk)
      if (!success) return
      deleteDialog.value = false
      appStore.openMessage({ content: t('deleted'), color: 'success' })
      if (items.value.length === 1 && pageObj.value.pageIndex > 1) pageObj.value.pageIndex -= 1
      await queryData()
    } catch {
      // The API interceptor displays request errors; keep the dialog open for retry.
    } finally {
      deleting.value = false
    }
  }

  queryData()

  const getRowMenuItems = () => [
    { title: t('edit'), prependIcon: 'mdi-pencil', code: 'edit' },
    { type: 'divider' },
    {
      title: t('delete'),
      prependIcon: 'mdi-delete',
      code: 'delete',
      color: 'red',
      baseColor: 'red',
    },
  ]

  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'edit': {
        editRole(item)
        return
      }
      case 'delete': {
        openDelete(item)
        return
      }
      default: {
        break
      }
    }
  }
</script>
