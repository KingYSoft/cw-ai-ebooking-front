<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="pageTitle">
      <template v-if="isEditMode" #title>
        <div class="d-flex align-center ga-2">
          <div class="d-flex flex-column ga-0">
            <span class="font-weight-bold text-body-2">{{ edit('bookingTitle') }}</span>

            <div class="d-flex align-center ga-1">
              <span class="font-weight-bold text-body-2">
                {{ tabTitle.replace('BKG-', '') }}
              </span>

              <v-icon icon="mdi-content-copy" size="14" @click="handleCopyBookingNo" />
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
          v-if="showSaveButton"
          color="primary"
          :disabled="cardLoading || isEditLockedByOther || isBookingCancelled"
          size="small"
          variant="flat"
          @click="onSaveHandle"
        >
          {{ editButton('save') }}
        </v-btn>

        <v-btn
          v-if="showSubmitButton"
          color="primary"
          :disabled="actionDisabled"
          size="small"
          variant="tonal"
          @click="onSubmitClick"
        >
          {{ editButton('submit') }}
        </v-btn>

        <v-btn
          v-if="showSiSubmitButton"
          color="primary"
          :disabled="actionDisabled"
          size="small"
          variant="tonal"
          @click="onSiSubmitClick"
        >
          {{ editButton('siSubmit') }}
        </v-btn>

        <v-btn
          v-if="showCancelButton"
          color="red"
          :disabled="actionDisabled"
          size="small"
          variant="flat"
          @click="onCancelClick"
        >
          {{ editButton('cancelBooking') }}
        </v-btn>

        <v-btn
          v-if="showRequestModificationButton"
          color="primary"
          :disabled="actionDisabled"
          size="small"
          variant="tonal"
          @click="onRequestModification"
        >
          {{ editButton('requestModification') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <BookingFreightStepper v-model:status="inputData.active_status" />
    <v-divider />

    <v-tabs v-model="activedTab" color="primary" density="comfortable">
      <v-tab :value="1">{{ editTab('booking') }}</v-tab>
      <v-tab :value="2">{{ editTab('additionalDetails') }}</v-tab>
      <v-tab :value="3">{{ editTab('docs') }}</v-tab>
      <v-tab v-if="showShippingInstructionTab" :value="4">{{ editTab('shippingInstruction') }}</v-tab>
    </v-tabs>

    <v-divider />

    <v-sheet class="overflow-y-auto" style="flex: 1">
      <v-form ref="refDataForm" class="ref-form-pre" color="background">
        <PagesFreightBookingEdit
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :lock-non-si-fields="isStatusLocked"
          :lock-si-fields="isSiSubmittedOrLater(activeStatusTitle)"
          @add-container="addNewContainer"
          @remove-container="removeNewContainer"
        />
      </v-form>
    </v-sheet>
  </FPageLayout>

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

        <v-btn color="primary" :text="editButton('submit')" variant="flat" @click="onSubmitConfirm" />
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="siSubmitConfirmVis" max-width="420" persistent>
    <v-card
      :disabled="cardLoading"
      :loading="cardLoading"
      prepend-icon="mdi-file-send-outline"
      :title="editDialog('siSubmitConfirm', 'title')"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <v-card-text class="pb-2">
        {{ editDialog('siSubmitConfirm', 'message') }}
      </v-card-text>

      <template #actions>
        <v-spacer />

        <v-btn :text="editButton('cancel')" variant="text" @click="siSubmitConfirmVis = false" />

        <v-btn
          color="primary"
          :text="editButton('siSubmit')"
          variant="flat"
          @click="onSiSubmitConfirm"
        />
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="cancelConfirmVis" max-width="420" persistent>
    <v-card
      :disabled="cardLoading"
      :loading="cardLoading"
      prepend-icon="mdi-close-circle-outline"
      :title="editDialog('cancelConfirm', 'title')"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="red" height="4" indeterminate />
      </template>

      <v-card-text class="pb-2">
        {{ editDialog('cancelConfirm', 'message') }}
      </v-card-text>

      <template #actions>
        <v-spacer />

        <v-btn :text="editButton('cancel')" variant="text" @click="cancelConfirmVis = false" />

        <v-btn
          color="red"
          :text="editButton('confirm')"
          variant="flat"
          @click="onCancelFirstConfirm"
        />
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="cancelReasonVis" max-width="480" persistent>
    <v-card
      :disabled="cardLoading"
      :loading="cardLoading"
      prepend-icon="mdi-text-box-outline"
      :title="editDialog('cancelReason', 'title')"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="red" height="4" indeterminate />
      </template>

      <v-card-text class="pb-2">
        <div class="mb-3">{{ editDialog('cancelReason', 'message') }}</div>

        <v-textarea
          v-model="cancelReason"
          auto-grow
          density="compact"
          :label="editDialog('cancelReason', 'reason')"
          rows="3"
          :rules="cancelReasonRules"
          variant="outlined"
        />
      </v-card-text>

      <template #actions>
        <v-spacer />

        <v-btn :text="editButton('back')" variant="text" @click="onCancelReasonBack" />

        <v-btn
          color="red"
          :disabled="!String(cancelReason || '').trim()"
          :text="editButton('cancelBooking')"
          variant="flat"
          @click="onCancelConfirm"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    bookingCancel,
    bookingDetail,
    bookingRequestModification,
    bookingSiSubmit,
    bookingSubmit,
  } from '@/api/booking'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import FPageLayout from '@/components/FPageLayout.vue'
  import BookingFreightStepper from '@/components/freight/BookingFreightStepper.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useEditLockGuard } from '@/composables/useEditLockGuard'
  import { useFreightBookingForm } from '@/composables/useFreightBookingForm'
  import { isBookingReleasedOrLater, isSiSubmittedOrLater } from '@/constants/bookingFreightSteps'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'PagesFreightBookingFormPage',
  })

  const props = defineProps({
    isEditMode: { type: Boolean, default: false },
    pageTitle: { type: String, default: undefined },
  })
  const { isEditMode, pageTitle } = toRefs(props)

  const { t, edit, editButton, editDialog, editMessage, editTab } = useBookingPageI18n()

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const isCopyAsNew = computed(() => String(route.query.copy ?? '') === '1')
  const OCR_BOOKING_STORAGE_KEY = 'booking_ocr_prefill'

  const {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    bookingSaveHandle,
    handleValidationErrors,
    markInputDataSaved,
    addNewContainer,
    removeNewContainer,
  } = useFreightBookingForm()

  // // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  // const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)

  const editLockGuard = useEditLockGuard({
    businessType: 'ebooking_booking',
    pk: computed(() => (isCopyAsNew.value ? '' : String(route.params.pk || ''))),
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)

  const bookingEmptyVis = ref(false)
  const submitConfirmVis = ref(false)
  const siSubmitConfirmVis = ref(false)
  const cancelConfirmVis = ref(false)
  const cancelReasonVis = ref(false)
  const cancelReason = ref('')
  const cancelReasonRules = [v => Boolean(String(v ?? '').trim()) || editDialog('cancelReason', 'reasonRequired')]

  const freightStatus = computed(() =>
    String(inputData.value?.freight_status || inputData.value?.bkg_status || '').toLowerCase(),
  )
  const isBookingCancelled = computed(
    () => freightStatus.value === 'cancelled' || Boolean(inputData.value?.bkg_is_cancelled),
  )
  const activeStatusTitle = computed(() => String(inputData.value?.active_status ?? '').trim())
  const canSave = computed(() => inputData.value?.can_save === true)
  const canSubmit = computed(() => inputData.value?.can_submit === true)
  const isStatusLocked = computed(() => !canSubmit.value)
  const showShippingInstructionTab = computed(() => isBookingReleasedOrLater(activeStatusTitle.value))
  watch(showShippingInstructionTab, show => {
    if (!show && activedTab.value === 4) {
      activedTab.value = 1
    }
  })
  const showSaveButton = computed(() => {
    return canSave.value && (activedTab.value === 1 || activedTab.value === 2 || activedTab.value === 4)
  })
  const showBookingActionButtons = computed(
    () =>
      isEditMode.value &&
      !isCopyAsNew.value &&
      Boolean(String(inputData.value?.pk || route.params.pk || '').trim()),
  )
  const showSubmitButton = computed(
    () =>
      showBookingActionButtons.value &&
      canSubmit.value,
  )
  const showSiSubmitButton = computed(
    () => showBookingActionButtons.value && activeStatusTitle.value === 'Booking Released',
  )
  const showCancelButton = computed(
    () =>
      showBookingActionButtons.value &&
      Boolean(activeStatusTitle.value) &&
      !isBookingCancelled.value &&
      !isSiSubmittedOrLater(activeStatusTitle.value),
  )
  const showRequestModificationButton = computed(() => {
    if (
      !showBookingActionButtons.value
      || isBookingCancelled.value
      || Number(inputData.value?.bkg_is_forward_registered) === 1
    ) {
      return false
    }
    return activeStatusTitle.value === 'Submitted' || activeStatusTitle.value === 'Processing'
  })
  const showToolbarActions = computed(
    () => showSaveButton.value || showBookingActionButtons.value,
  )
  const actionDisabled = computed(
    () => cardLoading.value || isEditLockedByOther.value || isBookingCancelled.value,
  )

  const applyBookingInput = el => {
    if (!el || typeof el !== 'object') {
      return
    }

    inputData.value = Object.assign({}, el, {
      pk: el.pk ?? '',
      can_save: el.can_save !== false,
      can_submit: el.can_submit !== false,
      shipper: el.shipper || {},
      consignee: el.consignee || {},
      notify_party: el.notify_party || {},
      pickup: el.pickup || {}, // address
      delivery: el.delivery || {}, // address
      pac_list: el.pac_list || [],
      e_docs_list: el.e_docs_list || [],
      bkg_unit_of_weight: el.bkg_unit_of_weight || 'KG',
      bkg_unit_of_volume: el.bkg_unit_of_volume || 'M3',
      bkg_actual_chargeable_unit: el.bkg_actual_chargeable_unit || 'KG',
      bkg_volume_weight_unit: el.bkg_volume_weight_unit || 'KG',
      bkg_pack_type: el.bkg_pack_type || 'CTN',
      bkg_pack_type_desc: el.bkg_pack_type_desc || 'Carton',
      doc_data: el.doc_data && typeof el.doc_data === 'object' ? el.doc_data : {},
    })
    if (inputData.value.notify_party.add_address_name === 'SAME AS CONSIGNEE') {
      inputData.value.notify_party_same_as_consignee = 'Y'
    } else {
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

  const stripCopiedIdentity = data => {
    const pacList = Array.isArray(data.pac_list) ? data.pac_list : []
    return {
      ...data,
      id: 0,
      pk: '',
      bkg_consign_no: '',
      bkg_house_bill: '',
      active_status: '',
      freight_status: 'draft',
      bkg_status: '',
      bkg_shipment_status: '',
      bkg_phase: '',
      bkg_is_cancelled: 0,
      bkg_is_forward_registered: 0,
      e_docs_list: [],
      pac_list: pacList.map((row, index) => ({
        ...row,
        id: index + 1,
        pk: '',
      })),
      shipper: {},
      can_save: true,
      can_submit: true,
    }
  }

  const loadData = async () => {
    if (isEditMode.value) {
      // 编辑
      try {
        cardLoading.value = true
        const { success, data } = await bookingDetail(route.params.pk)
        skeletonLoading.value = false
        if (success && data) {
          applyBookingInput(isCopyAsNew.value ? stripCopiedIdentity(data) : data)
          if (isCopyAsNew.value) {
            await fillShipperFromSession()
          }
        } else {
          bookingEmptyVis.value = true
        }
        markInputDataSaved()
      } catch (error) {
        console.log(error)
      } finally {
        cardLoading.value = false
      }
    } else {
      try {
        cardLoading.value = true
        if (route.query.source === 'ocr') {
          const rawOcrBooking = sessionStorage.getItem(OCR_BOOKING_STORAGE_KEY)
          if (rawOcrBooking) {
            try {
              applyBookingInput(JSON.parse(rawOcrBooking))
            } catch (error) {
              console.log(error)
              await fillShipperFromSession()
            } finally {
              sessionStorage.removeItem(OCR_BOOKING_STORAGE_KEY)
            }
          } else {
            await fillShipperFromSession()
          }
        } else {
          await fillShipperFromSession()
        }
        skeletonLoading.value = false
        markInputDataSaved()
      } catch (error) {
        console.log(error)
      } finally {
        cardLoading.value = false
      }
    }
  }

  const applyOrgRowToShipper = (shipper, row) => {
    shipper.add_address_type = row.address_type
    shipper.add_address_short_code = row.short_code
    shipper.add_address_code = row.code ?? row.org_code
    shipper.add_address_name = row.company_name ?? row.address_name
    shipper.add_address = row.pk
    shipper.add_address1 = row.address1
    shipper.add_address2 = row.address2
    shipper.add_address3 = row.address3
    shipper.add_contact = row.contact
    shipper.add_city = row.city
    shipper.add_state = row.state
    shipper.add_postal_code = row.postal_code
    shipper.add_country_code = row.country_code
    shipper.add_phone = row.phone
    shipper.add_mobile = row.mobile
    shipper.add_fax = row.fax
    shipper.add_email = row.email
    shipper.add_port_code = row.port_code
  }

  const fillShipperFromSession = async () => {
    const orgCode = appStore.userSession.session()?.org_header_code
    if (!orgCode) {
      return
    }
    const { success, data } = await organizationQueryOrgAddress({
      query: orgCode,
      address_type: 'SHIPPER',
    })
    if (!success) {
      return
    }
    const items = data?.items ?? []
    if (items.length === 0) {
      return
    }
    if (!inputData.value.shipper || typeof inputData.value.shipper !== 'object') {
      inputData.value.shipper = {}
    }
    applyOrgRowToShipper(inputData.value.shipper, items[0])
  }

  const refDataForm = ref(null)

  const isContainerRequired = () => true

  const ensureContainerRows = () => {
    if (!isContainerRequired()) {
      return true
    }
    const rows = Array.isArray(inputData.value?.pac_list) ? inputData.value.pac_list : []
    if (rows.length > 0) {
      return true
    }
    activedTab.value = 1
    appStore.openMessage({
      content: t('$vuetify.custom.bookingPage.form.pac_list.err'),
      color: 'error',
    })
    return false
  }

  const persistBooking = async ({ showMessage = true } = {}) => {
    if (!ensureContainerRows()) {
      return false
    }
    const { valid, errors } = await refDataForm.value.validate()
    if (!valid) {
      handleValidationErrors(errors)
      return false
    }
    return bookingSaveHandle({ showMessage })
  }

  const onSaveHandle = async () => {
    if (!canSave.value) {
      return
    }
    if (!editLockGuard.ensureCanSave()) {
      return
    }
    if (checkBookingLocked()) {
      return
    }
    try {
      cardLoading.value = true
      switch (activedTab.value) {
        case 1:
        case 2:
        case 4: {
          const saved = await persistBooking()
          if (saved && (!isEditMode.value || isCopyAsNew.value)) {
            router.push({
              name: 'booking_edit-pk',
              params: { pk: inputData.value.pk },
              query: { id: inputData.value.id, shipment_no: inputData.value.bkg_consign_no },
            })
          }
          break
        }
        default: {
          appStore.openMessage({
            content: edit('unknownTab'),
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

  const bookingIdentity = () => ({
    id: inputData.value?.id || 0,
    pk: String(inputData.value?.pk || route.params.pk || '').trim(),
  })

  const bookingSubmitPayload = () => ({
    ...inputData.value,
    ...bookingIdentity(),
  })

  const canRunBookingAction = () => {
    if (!showBookingActionButtons.value || isBookingCancelled.value) {
      return false
    }
    if (!editLockGuard.ensureCanSave()) {
      return false
    }
    if (checkBookingLocked()) {
      return false
    }
    return Boolean(bookingIdentity().pk)
  }

  const reloadBookingDetail = async () => {
    const { pk } = bookingIdentity()
    if (!pk) {
      return
    }
    const { success, data } = await bookingDetail(pk)
    if (success && data) {
      applyBookingInput(data)
      markInputDataSaved()
    }
  }

  const saveThenRun = async run => {
    if (!ensureContainerRows()) {
      return false
    }
    if (canSave.value) {
      const saved = await bookingSaveHandle({ showMessage: false })
      if (!saved) {
        return false
      }
    }
    const { success, data } = await run(bookingIdentity())
    if (success && data && typeof data === 'object') {
      if (typeof data.can_save === 'boolean') {
        inputData.value.can_save = data.can_save
      }
      if (typeof data.can_submit === 'boolean') {
        inputData.value.can_submit = data.can_submit
      }
    }
    return Boolean(success)
  }

  const onSubmitClick = () => {
    if (!canRunBookingAction() || !showSubmitButton.value) {
      return
    }
    submitConfirmVis.value = true
  }

  const onSubmitConfirm = async () => {
    submitConfirmVis.value = false
    if (!canRunBookingAction() || !showSubmitButton.value) {
      return
    }
    try {
      cardLoading.value = true
      const ok = await saveThenRun(() => bookingSubmit(bookingSubmitPayload()))
      if (ok) {
        appStore.openMessage({
          content: editMessage('submitted'),
          color: 'success',
        })
        await reloadBookingDetail()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const onSiSubmitClick = () => {
    if (!canRunBookingAction() || !showSiSubmitButton.value) {
      return
    }
    siSubmitConfirmVis.value = true
  }

  const onSiSubmitConfirm = async () => {
    siSubmitConfirmVis.value = false
    if (!canRunBookingAction() || !showSiSubmitButton.value) {
      return
    }
    try {
      cardLoading.value = true
      const ok = await saveThenRun(payload =>
        bookingSiSubmit({
          ...payload,
          pac_list: inputData.value.pac_list,
          doc_data: inputData.value.doc_data,
        }),
      )
      if (ok) {
        appStore.openMessage({
          content: editMessage('siSubmitted'),
          color: 'success',
        })
        await reloadBookingDetail()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const onCancelClick = () => {
    if (!canRunBookingAction() || !showCancelButton.value) {
      return
    }
    cancelReason.value = ''
    cancelConfirmVis.value = true
  }

  const onRequestModification = async () => {
    if (!canRunBookingAction() || !showRequestModificationButton.value) {
      return
    }
    try {
      cardLoading.value = true
      const { success } = await bookingRequestModification(bookingIdentity())
      if (success) {
        appStore.openMessage({
          content: editMessage('modificationRequested'),
          color: 'success',
        })
        await reloadBookingDetail()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const onCancelFirstConfirm = () => {
    cancelConfirmVis.value = false
    cancelReasonVis.value = true
  }

  const onCancelReasonBack = () => {
    cancelReasonVis.value = false
    cancelConfirmVis.value = true
  }

  const onCancelConfirm = async () => {
    const reason = String(cancelReason.value ?? '').trim()
    if (!reason) {
      return
    }
    if (!canRunBookingAction() || !showCancelButton.value) {
      return
    }
    cancelReasonVis.value = false
    try {
      cardLoading.value = true
      const { success } = await bookingCancel({
        ...bookingIdentity(),
        cancel_reason: reason,
      })
      if (success) {
        appStore.openMessage({
          content: editMessage('cancelled'),
          color: 'success',
        })
        await reloadBookingDetail()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const tabTitle = computed(() => {
    return inputData.value.bkg_consign_no ? `BKG-${inputData.value.bkg_consign_no}` : edit('bookingTitle')
  })
  const handleCopyBookingNo = () => {
    const bookingNo = inputData.value.bkg_consign_no || ''
    if (!bookingNo) {
      return
    }
    navigator.clipboard.writeText(bookingNo)
    appStore.openMessage({
      content: edit('copySuccess'),
      color: 'success',
    })
  }

  loadData()
</script>
