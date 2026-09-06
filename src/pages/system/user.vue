<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesSystemUserFilter
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
      :title="userList('title')"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="$plus" size="small" variant="flat" @click="onNewUser">
          {{ common('new') }}
        </v-btn>
      </template>

      <template #item.can_login="{ item }">
        <v-chip
          :color="item.can_login === 1 ? 'success' : 'error'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.can_login === 1 ? common('yes') : common('no') }}
        </v-chip>
      </template>

      <template #item.is_admin="{ item }">
        <v-chip
          :color="item.is_admin === 1 ? 'success' : 'default'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.is_admin === 1 ? common('yes') : common('no') }}
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
  import { queryUserPage } from '@/api/user'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PagesSystemUserFilter from '@/components/system/PagesSystemUserFilter.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  const { common, userList } = useSystemPageI18n()

  defineOptions({ name: 'SystemUser' })
  definePage({
    name: 'system_user',
    icon: 'mdi-account',
    menu: true,
    order: 1,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_USER',
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
      key: 'login_name',
      title: userList('filter.loginName'),
      keyItems: [
        { key: 'login_name', title: userList('filter.loginName') },
        { key: 'full_name', title: userList('filter.fullName') },
        { key: 'email_address', title: userList('filter.email') },
        { key: 'mobile_phone', title: userList('filter.mobilePhone') },
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
    { title: userList('headers.loginName'), key: 'login_name', align: 'start', minWidth: '160px' },
    { title: userList('headers.fullName'), key: 'full_name', align: 'start', minWidth: '160px' },
    { title: userList('headers.email'), key: 'email_address', align: 'start', minWidth: '220px' },
    {
      title: userList('headers.mobilePhone'),
      key: 'mobile_phone',
      align: 'start',
      minWidth: '150px',
    },
    { title: userList('headers.canLogin'), key: 'can_login', align: 'center', minWidth: '120px' },
    { title: userList('headers.admin'), key: 'is_admin', align: 'center', minWidth: '100px' },
    { title: userList('headers.status'), key: 'is_active', align: 'center', minWidth: '110px' },
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
      const { data } = await queryUserPage({
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
      console.error('Query users failed:', error)
    } finally {
      cardLoading.value = false
    }
  }

  queryData()

  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    router.push({
      name: 'system_user_edit-pk',
      params: { pk: item.pk },
      query: { login_name: item.login_name },
    })
  }
  const onNewUser = () => {
    router.push({ name: 'system_user_new' })
  }
</script>
