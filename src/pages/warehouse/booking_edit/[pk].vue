<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true">
        <template #title>
          <div class="d-flex align-center ga-2">
            <div class="d-flex flex-column ga-0">
              <span class="font-weight-bold text-body-2">{{ edit('warehouseTitle') }}</span>

              <div class="d-flex align-center ga-1">
                <span class="font-weight-bold text-body-2">
                  {{ tabTitle.replace('WHS-', '') }}
                </span>

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
            :disabled="cardLoading || isEditLockedByOther || isOrderReceived || (isOrderSubmitted && activedTab === 1)"
            size="small"
            variant="flat"
            @click.stop="onSaveHandle"
          >
            {{ editButton('save') }}
          </v-btn>

          <v-btn
            color="primary"
            :disabled="cardLoading || isEditLockedByOther || isOrderReceived || isOrderSubmitted"
            size="small"
            variant="tonal"
            @click.stop="onSubmitClick"
          >
            {{ editButton('submit') }}
          </v-btn>
        </template>
      </LayoutWithToolbar>

      <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
        <v-tab :value="1">{{ editTab('orderDetail') }}</v-tab>
        <v-tab :value="2">{{ editTab('itemDetail') }}</v-tab>
        <v-tab :value="3">{{ editTab('docs') }}</v-tab>
        <v-tab :value="5">{{ editTab('logs') }}</v-tab>
      </v-tabs>

      <v-divider />

      <v-sheet class="overflow-y-auto" style="flex: 1">
        <PagesWarehouseOrderEdit
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :readonly="isOrderSubmitted || isOrderReceived"
          @register-form-refs="registerFormRefs"
        />
      </v-sheet>
    </FPageLayout>

    <v-dialog v-model="bookingEmptyVis" max-width="400" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        :title="editDialog('orderNotExists', 'title')"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">
          {{ editDialog('orderNotExists', 'message') }}
        </v-card-text>

        <template #actions>
          <v-spacer />

          <v-btn
            color="primary"
            :text="editDialog('orderNotExists', 'newOrder')"
            variant="tonal"
            @click="newOrderHandle"
          />
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="submitConfirmVis" max-width="420" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-send-check-outline"
        :title="editDialog('submitConfirm', 'title')"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">
          {{ editDialog('submitConfirm', 'message') }}
        </v-card-text>

        <template #actions>
          <v-spacer />
          <v-btn :text="editButton('cancel')" variant="text" @click="submitConfirmVis = false" />

          <v-btn
            color="primary"
            :text="editButton('submit')"
            variant="flat"
            @click="onSubmitConfirm"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { whsOrderSubmit } from '@/api/whs-order'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { hasWhsOrderItemBatteryFile } from '@/composables/mapWhsOrderDetail'
  import { useEditLockGuard } from '@/composables/useEditLockGuard'
  import { useWarehouseBookingForm } from '@/composables/useWarehouseBookingForm'
  import {
    formatWhsTabTitle,
    resolveWhsConsignNo,
    scheduleWhsBookingTabSync,
  } from '@/composables/useWarehouseBookingTab'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
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

  const {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    whsOrderSaveHandle,
    queryWhsOrderDetailHandle,
    handleValidationErrors,
    markInputDataSaved,
    registerFormRefs,
    validateAll,
  } = useWarehouseBookingForm()

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { edit, editButton, editTab, editMessage, editDialog } = useWarehouseOrderPageI18n()

  // const skeletonLoading = ref(true)
  // const cardLoading = ref(false)
  // const activedTab = ref(1)
  const bookingEmptyVis = ref(false)
  const submitConfirmVis = ref(false)

  const queryData = async pk => {
    try {
      cardLoading.value = true
      const refreshed = await queryWhsOrderDetailHandle(pk)
      skeletonLoading.value = false
      if (!refreshed) {
        bookingEmptyVis.value = true
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const editLockGuard = useEditLockGuard({
    businessType: 'warehouse_order',
    pk: route.params.pk?.toString() || '',
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)
  const resolveOrderStatus = () =>
    String(inputData.value?.wso_status ?? inputData.value?.wso_shipment_status ?? '')
      .trim()
      .toLowerCase()
  const isOrderSubmitted = computed(() => {
    const status = resolveOrderStatus()
    // API may return "Submitted" or misspelled "Submited"
    return status === 'submitted' || status === 'submited'
  })
  const isOrderReceived = computed(() => resolveOrderStatus() === 'received')

  const onSaveHandle = async () => {
    if (isOrderReceived.value) {
      return
    }
    if (isOrderSubmitted.value && activedTab.value === 1) {
      return
    }
    if (!editLockGuard.ensureCanSave()) {
      return
    }
    if (checkBookingLocked()) {
      return
    }
    const rows = Array.isArray(inputData.value?.item_list) ? inputData.value.item_list : []
    const missingBatteryFile = rows.some(
      row => Number(row?.woi_is_battery_included) === 1 && !hasWhsOrderItemBatteryFile(row),
    )
    if (missingBatteryFile) {
      appStore.openMessage({
        color: 'warning',
        content: edit('validation.batteryFileRequired'),
      })
      return
    }
    if (!(await validateAll())) {
      return
    }
    try {
      cardLoading.value = true
      switch (activedTab.value) {
        case 1:
        case 2: {
          await whsOrderSaveHandle()
          break
        }
        default: {
          appStore.openMessage({
            content: editMessage('unknownTab'),
            color: 'warning',
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const checkBookingLocked = () => {
    return false
  }

  const tabTitle = computed(() => {
    return formatWhsTabTitle(resolveWhsConsignNo({ route, inputData: inputData.value }))
  })

  const syncEditTabTitle = () => {
    scheduleWhsBookingTabSync(appStore, {
      tabValue: `warehouse_booking_edit-pk-${route.params.pk}`,
      route,
      router,
      inputData: inputData.value,
    })
  }

  const handleCopyOrderNo = () => {
    const orderNo = inputData.value.wso_consign_no || inputData.value.wso_consign_no || ''
    navigator.clipboard.writeText(orderNo)
    appStore.openMessage({
      content: editMessage('copySuccess'),
      color: 'success',
    })
  }

  const onSubmitClick = () => {
    if (isOrderSubmitted.value || isOrderReceived.value) {
      return
    }
    if (!editLockGuard.ensureCanSave()) {
      return
    }
    if (checkBookingLocked()) {
      return
    }
    submitConfirmVis.value = true
  }

  const onSubmitConfirm = async () => {
    submitConfirmVis.value = false
    if (isOrderSubmitted.value || isOrderReceived.value) {
      return
    }

    if (!(await validateAll())) {
      return
    }

    try {
      cardLoading.value = true
      const saved = await whsOrderSaveHandle({ showMessage: false })
      if (!saved) {
        return
      }
      const pk = inputData.value.pk || route.params.pk?.toString()
      const { success } = await whsOrderSubmit(pk)
      if (success) {
        appStore.openMessage({
          content: editMessage('submitted'),
          color: 'success',
        })
        if (inputData.value) {
          inputData.value.wso_status = 'Submited'
          if (Object.prototype.hasOwnProperty.call(inputData.value, 'wso_shipment_status')) {
            inputData.value.wso_shipment_status = 'Submited'
          }
        }
        await queryData(pk)
        markInputDataSaved()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const loadData = async () => {
    const pk = route.params.pk?.toString()

    await queryData(pk)
    await editLockGuard.acquireLock()
    syncEditTabTitle()
  }

  loadData()

  watch(
    () => resolveWhsConsignNo({ route, inputData: inputData.value }),
    () => syncEditTabTitle(),
  )

  const newOrderHandle = () => {
    bookingEmptyVis.value = false
    router.push({ name: 'warehouse_booking_new' })
  }
</script>
