<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true">
        <template #title>
          <div class="d-flex align-center ga-2">
            <div class="d-flex flex-column ga-0">
              <span class="font-weight-bold text-body-2">CFS Order</span>

              <div class="d-flex align-center ga-1">
                <span class="font-weight-bold text-body-2">{{ tabTitle.replace('WHS-', '') }}</span>
                <v-icon icon="mdi-content-copy" size="14" @click="handleCopyOrderNo" />
              </div>
            </div>

            <v-chip
              v-if="isEditLockedByOther"
              color="red"
              density="comfortable"
              size="small"
              variant="tonal"
            >
              <v-icon start>mdi-account-lock</v-icon>
              {{ editLockWarningText }}
            </v-chip>
          </div>
        </template>

        <template v-if="activedTab === 1 || activedTab === 2" #actions>
          <v-btn
            color="primary"
            :disabled="cardLoading || isEditLockedByOther"
            size="small"
            variant="flat"
            @click.stop="onSaveWithLockCheck"
          >
            Save
          </v-btn>
        </template>
      </LayoutWithToolbar>

      <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
        <v-tab :value="1">Order Detail</v-tab>
        <v-tab :value="2">Item Detail</v-tab>
        <v-tab :value="3">eDocs</v-tab>
        <v-tab :value="5">Logs</v-tab>
      </v-tabs>

      <v-divider />

      <v-sheet class="overflow-y-auto" style="flex: 1">
        <PagesWarehouseOrderEdit
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :convert-to-shipment-check="convertToShipmentCheck"
          :input-data-rules="inputDataRules"
          :query-all-user-list="queryAllUserList"
          :query-port-list="queryPortList"
          @add-container="addNewContainer"
          @add-new-loose="addNewLoose"
          @query-all-user="queryAllUser"
          @query-port="queryPort"
          @register-form-refs="registerFormRefs"
          @remove-container="removeNewContainer"
          @remove-new-loose="removeNewLoose"
        />
      </v-sheet>
    </FPageLayout>

    <v-dialog v-model="bookingEmptyVis" max-width="400" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        title="Warehouse Order Not Exists."
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">
          This warehouse order does not exist. You can create a new order or close the page.
        </v-card-text>

        <template #actions>
          <v-spacer />
          <v-btn :text="t('$vuetify.custom.dialog.btn.close')" @click="closeOrderPageHandle" />
          <v-btn color="primary" text="New Order" variant="tonal" @click="newOrderHandle" />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, onActivated, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'

  import { whsOrderGetById } from '@/api/whs-order'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { saveWhsOrderFromForm } from '@/composables/mapWhsOrderDetail'
  import { useBookingForm } from '@/composables/useBookingForm'
  import { useEditLockGuard } from '@/composables/useEditLockGuard'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'WarehouseBookingEdit' })
  definePage({
    name: 'warehouse_booking_edit-pk',
    icon: 'mdi-clipboard-text-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'WHS-{shipment_no}',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()
  const { t } = useLocale()

  const loadWhsOrderDetail = async pkid => {
    if (!pkid) {
      return { success: false, data: null }
    }
    try {
      const { success, data } = await whsOrderGetById(pkid)
      if (success && data) {
        return { success: true, data }
      }
      return { success: false, data: null }
    } catch (error) {
      console.error(error)
      return { success: false, data: null }
    }
  }

  const {
    skeletonLoading,
    cardLoading,
    activedTab,
    bookingEmptyVis,
    inputData,
    inputDataRules,
    convertToShipmentCheck,
    queryPortList,
    queryAllUserList,
    queryPort,
    queryAllUser,
    queryData,
    addNewContainer,
    removeNewContainer,
    onSaveHandle,
    registerFormRefs,
    addNewLoose,
    removeNewLoose,
  } = useBookingForm({
    isEditMode: true,
    detailLoader: loadWhsOrderDetail,
    saveLoader: saveWhsOrderFromForm,
  })

  const isCopyAsNew = computed(() => String(route.query.copy ?? '') === '1')
  const editLockGuard = useEditLockGuard({
    businessType: 'warehouse_order',
    pk: isCopyAsNew.value ? '' : route.params.pk?.toString() || '',
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)

  const tabTitle = computed(() => {
    if (isCopyAsNew.value) {
      return 'New Warehouse Order'
    }
    const tabTitleTemplate = route.meta.tabTitle || 'Edit Warehouse Order'
    const orderNo =
      route.query.shipment_no || inputData.value.bkg_consign_no || inputData.value.wso_consign_no || ''
    return tabTitleTemplate.replace('{shipment_no}', orderNo)
  })

  const handleCopyOrderNo = () => {
    const orderNo = inputData.value.bkg_consign_no || inputData.value.wso_consign_no || ''
    navigator.clipboard.writeText(orderNo)
    appStore.openMessage({
      content: 'Order No. copied to clipboard.',
      color: 'success',
    })
  }

  const onSaveWithLockCheck = async () => {
    if (!editLockGuard.ensureCanSave()) {
      return
    }
    await onSaveHandle()
  }

  const loadedPk = ref(null)

  const loadData = async (forceReload = false) => {
    const pk = route.params.pk?.toString()
    const id = route.query.id

    if (!forceReload && loadedPk.value === pk) {
      if (isCopyAsNew.value) {
        return
      }
      if (inputData.value.id > 0) {
        return
      }
    }

    loadedPk.value = pk
    await queryData(pk, id)
    await editLockGuard.acquireLock()
  }

  loadData()

  onActivated(() => {
    const currentPk = route.params.pk?.toString()
    if (loadedPk.value !== currentPk) {
      loadData()
    }
  })

  const closeOrderPageHandle = () => {
    const currentTabValue = `warehouse_booking_edit-pk-${route.params.pk}`
    setTimeout(() => {
      appStore.event.trigger('closeTab', currentTabValue)
    }, 100)
    bookingEmptyVis.value = false
    router.replace({ name: 'warehouse_booking' })
  }

  const newOrderHandle = () => {
    const currentTabValue = `warehouse_booking_edit-pk-${route.params.pk}`
    setTimeout(() => {
      appStore.event.trigger('closeTab', currentTabValue)
    }, 100)
    bookingEmptyVis.value = false
    router.push({ name: 'warehouse_booking_new' })
  }
</script>
