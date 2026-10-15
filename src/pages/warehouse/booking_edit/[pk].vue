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

                <v-chip
                  v-if="ebookingStatus"
                  color="primary"
                  density="comfortable"
                  size="small"
                  variant="tonal"
                >
                  {{ ebookingStatus }}
                </v-chip>
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

        <template v-if="showToolbarActions" #actions>
          <v-btn
            v-if="showRequestUnlockButton"
            color="primary"
            :disabled="cardLoading || unlockLoading"
            prepend-icon="mdi-lock-open-outline"
            size="small"
            variant="flat"
            @click.stop="onRequestUnlock"
          >
            {{ editButton('edit') }}
          </v-btn>

          <v-btn
            v-if="showEnterEditButton"
            color="primary"
            :disabled="cardLoading"
            prepend-icon="mdi-pencil"
            size="small"
            variant="flat"
            @click.stop="onEnterEditMode"
          >
            {{ editButton('enterEdit') }}
          </v-btn>

          <v-btn
            v-if="showPrintButton"
            color="secondary"
            :disabled="cardLoading"
            size="small"
            variant="flat"
            @click.stop="onPrintHandle"
          >
            {{ editButton('print') }}
          </v-btn>

          <v-btn
            v-if="isEditing && (activedTab === 1 || activedTab === 2)"
            color="primary"
            :disabled="cardLoading || isEditLockedByOther || isOrderReceived || (isOrderSubmitted && activedTab === 1)"
            size="small"
            variant="flat"
            @click.stop="onSaveHandle"
          >
            {{ editButton('save') }}
          </v-btn>

          <v-btn
            v-if="isEditing && (activedTab === 1 || activedTab === 2)"
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
          :readonly="!isFormEditable"
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

    <v-dialog v-model="pdfDiaVis" height="900" persistent width="1200">
      <FPdfPreview :pdf-url="pdfUrl || ''" :template-name="pdfTitle">
        <template #tools-btn>
          <v-btn color="red" density="comfortable" icon="$close" @click="closePdfPreview" />
        </template>
      </FPdfPreview>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { whsOrderRequestUnlock, whsOrderSubmit } from '@/api/whs-order'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FPdfPreview from '@/components/FPdfPreview.vue'
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
  import { useWhsOrderPrint } from '@/composables/useWhsOrderPrint'
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
  const unlockLoading = ref(false)
  const isEditMode = ref(false)
  const { pdfTitle, pdfUrl, pdfDiaVis, closePdfPreview, onPrintWhsOrder } = useWhsOrderPrint()

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

  const resolveShipmentStatus = () =>
    String(inputData.value?.wso_shipment_status ?? inputData.value?.wso_status ?? '')
      .trim()
      .toLowerCase()
  const resolveEbookingStatus = () =>
    String(inputData.value?.wso_status ?? '').trim()
  const ebookingStatus = computed(resolveEbookingStatus)
  const isOrderedStatus = computed(() => resolveShipmentStatus() === 'ordered')
  const isOrderSubmitted = computed(() => ebookingStatus.value === 'Submited')
  const isDraftStatus = computed(() => ebookingStatus.value === 'Draft')
  const isOrderReceived = computed(() => resolveShipmentStatus() === 'received')
  const isEditing = computed(
    () => isEditMode.value && isOrderedStatus.value && isDraftStatus.value,
  )
  const editLockGuard = useEditLockGuard({
    businessType: 'warehouse_order',
    pk: computed(() => (isEditing.value ? route.params.pk?.toString() || '' : '')),
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const isFormEditable = computed(() => isEditing.value && !isEditLockedByOther.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)
  const showRequestUnlockButton = computed(
    () =>
      isOrderSubmitted.value &&
      isOrderedStatus.value &&
      !isEditing.value &&
      !unlockLoading.value,
  )
  const showEnterEditButton = computed(
    () => isDraftStatus.value && isOrderedStatus.value && !isEditing.value,
  )
  const showPrintButton = computed(() => isOrderSubmitted.value)
  const showToolbarActions = computed(
    () =>
      showPrintButton.value ||
      showRequestUnlockButton.value ||
      showEnterEditButton.value ||
      (isEditing.value && (activedTab.value === 1 || activedTab.value === 2)),
  )

  const onEnterEditMode = async () => {
    if (!showEnterEditButton.value) {
      return
    }

    isEditMode.value = true
    const acquired = await editLockGuard.acquireLock()
    if (!acquired) {
      isEditMode.value = false
    }
  }

  const onRequestUnlock = async () => {
    if (!showRequestUnlockButton.value) {
      return
    }

    const pk = inputData.value.pk || route.params.pk?.toString()
    if (!pk) {
      return
    }

    try {
      unlockLoading.value = true
      cardLoading.value = true
      const response = await whsOrderRequestUnlock(pk)
      if (response?.success === false) {
        return
      }
      appStore.openMessage({
        content: editMessage('unlockRequested'),
        color: 'success',
      })
      await queryData(pk)
    } catch (error) {
      console.log(error)
    } finally {
      unlockLoading.value = false
      cardLoading.value = false
    }
  }

  const onPrintHandle = async () => {
    try {
      cardLoading.value = true
      await onPrintWhsOrder(inputData.value)
    } finally {
      cardLoading.value = false
    }
  }

  const onSaveHandle = async () => {
    if (!isEditing.value || !isOrderedStatus.value || isOrderReceived.value) {
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
    const orderNo = resolveWhsConsignNo({ route, inputData: inputData.value })
    if (!orderNo) {
      return
    }
    navigator.clipboard.writeText(orderNo)
    appStore.openMessage({
      content: editMessage('copySuccess'),
      color: 'success',
    })
  }

  const onSubmitClick = () => {
    if (!isEditing.value || !isOrderedStatus.value || isOrderSubmitted.value || isOrderReceived.value) {
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
    if (!isEditing.value || !isOrderedStatus.value || isOrderSubmitted.value || isOrderReceived.value) {
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
          if (Object.prototype.hasOwnProperty.call(inputData.value, 'wso_status')) {
            inputData.value.wso_status = 'Submited'
          }
        }
        await editLockGuard.releaseLock()
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
    if (isEditing.value) {
      await editLockGuard.acquireLock()
    }
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
