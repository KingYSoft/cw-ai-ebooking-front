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

      <template v-if="activedTab === 1 || activedTab === 2" #actions>
        <v-btn
          color="primary"
          :disabled="cardLoading || isEditLockedByOther"
          size="small"
          variant="flat"
          @click="onSaveHandle"
        >
          {{ editButton('save') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <BookingFreightStepper v-model:status="inputData.freight_status" />
    <v-divider />

    <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
      <v-tab :value="1">{{ editTab('booking') }}</v-tab>
      <v-tab :value="2">{{ editTab('additionalDetails') }}</v-tab>
      <v-tab :value="3">{{ editTab('docs') }}</v-tab>
      <v-tab :value="4">{{ editTab('log') }}</v-tab>
    </v-tabs>

    <v-divider />

    <v-sheet class="overflow-y-auto" style="flex: 1">
      <v-form ref="refDataForm" class="ref-form-pre" color="background">
        <PagesFreightBookingEdit
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          @add-container="addNewContainer"
          @remove-container="removeNewContainer"
        />
      </v-form>
    </v-sheet>
  </FPageLayout>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { bookingDetail } from '@/api/booking'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import FPageLayout from '@/components/FPageLayout.vue'
  import BookingFreightStepper from '@/components/freight/BookingFreightStepper.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useEditLockGuard } from '@/composables/useEditLockGuard'
  import { useFreightBookingForm } from '@/composables/useFreightBookingForm'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'PagesFreightBookingFormPage',
  })

  const props = defineProps({
    isEditMode: { type: Boolean, default: false },
    pageTitle: { type: String, default: undefined },
  })
  const { isEditMode, pageTitle } = toRefs(props)

  const { edit, editButton, editTab } = useBookingPageI18n()

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()

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
    pk: route.params.pk?.toString() || '',
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)

  const bookingEmptyVis = ref(false)

  const applyBookingInput = el => {
    if (!el || typeof el !== 'object') {
      return
    }

    inputData.value = Object.assign({}, el, {
      pk: el.pk ?? '',
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
    })
    if (inputData.value.notify_party.add_address_name === 'SAME AS CONSIGNEE') {
      inputData.value.notify_party_same_as_consignee = 'Y'
    } else {
      inputData.value.notify_party_same_as_consignee = 'N'
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
          applyBookingInput(data)
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
        const orgCode = appStore.userSession.session()?.org_header_code
        if (orgCode) {
          const { success, data } = await organizationQueryOrgAddress({
            query: orgCode,
            address_type: 'SHIPPER',
          })
          if (success) {
            const items = data?.items ?? []
            if (items.length > 0) {
              applyOrgRowToShipper(inputData.value.shipper, items[0])
            }
          }
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

  const refDataForm = ref(null)
  const onSaveHandle = async () => {
    if (!editLockGuard.ensureCanSave()) {
      return
    }
    if (checkBookingLocked()) {
      return
    }
    const { valid, errors } = await refDataForm.value.validate()
    if (!valid) {
      handleValidationErrors(errors)
      return
    }
    try {
      cardLoading.value = true
      switch (activedTab.value) {
        case 1:
        case 2: {
          await bookingSaveHandle()
          if (!isEditMode.value) {
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
