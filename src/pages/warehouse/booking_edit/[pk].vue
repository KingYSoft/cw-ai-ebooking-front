<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true">
        <template #title>
          <div class="d-flex align-center ga-2">
            <div class="d-flex flex-column ga-0">
              <span class="font-weight-bold text-body-2">Warehouse</span>

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
        <v-form ref="refDataForm" class="ref-form-pre" color="background">
          <PagesWarehouseOrderEdit v-model:input-data="inputData" :actived-tab="activedTab" />
        </v-form>
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
          <v-btn color="primary" text="New Order" variant="tonal" @click="newOrderHandle" />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import { whsOrderDetail, whsOrderSave } from '@/api/whs-order'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { useEditLockGuard } from '@/composables/useEditLockGuard'
  import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
  import {
    formatWhsTabTitle,
    resolveWhsConsignNo,
    scheduleWhsBookingTabSync,
  } from '@/composables/useWarehouseBookingTab'
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

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { t } = useLocale()

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const activedTab = ref(1)
  const bookingEmptyVis = ref(false)

  const defaultData = () => ({
    id: 0,
    pk: '',
    wso_transport_mode: 'SEA',
    wso_packing_mode: 'FCL',
    shipper: {},
    consignee: {},
    notify_party: {
      add_address_name: 'SAME AS CONSIGNEE',
    },
    item_list: [],
    inbound_list: [],
    outbound_list: [],
    e_docs_list: [],
    wso_unit_of_weight: 'KG',
    wso_actual_chargeable_unit: 'KG',
    wso_volume_weight_unit: 'KG',
    wso_unit_of_volume: 'M3',
    wso_pack_type: 'CTN',
    wso_pack_type_desc: 'Carton',
    notify_party_same_as_consignee: 'Y',
    wso_so_number: '',
    wso_po_number: '',
    wso_actual_chargeable: null,
    wso_volume_weight: null,
  })

  const applyBookingInput = el => {
    if (!el || typeof el !== 'object') {
      inputData.value = defaultData()
      return
    }

    inputData.value = Object.assign({}, defaultData(), el, {
      pk: el.pk ?? '',
      shipper: el.shipper || {},
      consignee: el.consignee || {},
      notify_party: el.notify_party || {},
      pickup: el.pickup || {}, // address
      delivery: el.delivery || {}, // address
      item_list: el.item_list || [],
      inbound_list: el.inbound_list || [],
      outbound_list: el.outbound_list || [],
      e_docs_list: el.e_docs_list || [],
      wso_unit_of_weight: el.wso_unit_of_weight || 'KG',
      wso_unit_of_volume: el.wso_unit_of_volume || 'M3',
      wso_actual_chargeable_unit: el.wso_actual_chargeable_unit || 'KG',
      wso_volume_weight_unit: el.wso_volume_weight_unit || 'KG',
      wso_pack_type: el.wso_pack_type || 'CTN',
      wso_pack_type_desc: el.wso_pack_type_desc || 'Carton',
    })
    if (inputData.value.notify_party.add_address_name === 'SAME AS CONSIGNEE') {
      inputData.value.notify_party_same_as_consignee = 'Y'
    } else {
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

  const inputData = ref(defaultData())

  const editLockGuard = useEditLockGuard({
    businessType: 'warehouse_order',
    pk: route.params.pk?.toString() || '',
  })
  const isEditLockedByOther = computed(() => editLockGuard.isSaveBlocked.value)
  const editLockWarningText = computed(() => editLockGuard.lockWarningText.value)

  // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)

  const queryData = async pk => {
    try {
      cardLoading.value = true
      const { success, data } = await whsOrderDetail(pk)
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
  }

  const refDataForm = ref(null)

  const onSaveHandle = async () => {
    if (checkBookingLocked()) {
      return
    }
    const { valid, errors } = await refDataForm.value.validate()
    if (valid) {
      try {
        cardLoading.value = true
        switch (activedTab.value) {
          case 1:
          case 2:
          case 3:
          case 5: {
            await saveBookingTab()
            break
          }
          case 4: {
            break
          }
          default: {
            appStore.openMessage({
              content: 'Unknown tab.',
              color: 'warning',
            })
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        cardLoading.value = false
      }
    } else {
      let errList = []
      if (errors && errors.length > 0) {
        const err = []
        for (let i = 0; i < errors.length; i++) {
          const e = errors[i]
          const msg =
            e.errorMessages && e.errorMessages.length > 0 ? e.errorMessages[0] : 'data valid fail.'

          if (e.id.indexOf('@') >= 0) {
            const tab = e.id.split('@')[0]
            if (!Number.isNaN(Number(tab)) && Number(tab) > 0) {
              err.push({ tab: Number(tab), msg })
            }
          } else {
            err.push({ tab: 1, msg })
          }
        }
        if (err.length > 0) {
          errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
        }
      }
      if (errList.length > 0) {
        activedTab.value = errList[0].tab
        appStore.openMessage({
          content: errList[0].msg,
          color: 'error',
        })
      } else {
        appStore.openMessage({
          content: 'data valid fail.',
          color: 'error',
        })
      }
    }
  }

  const saveBookingTab = async () => {
    const { success, data } = await whsOrderSave(inputData.value)

    if (success && data) {
      appStore.openMessage({
        content: t('$vuetify.custom.app.saveSuccess'),
        color: 'success',
      })

      inputData.value.id = data.id ?? 0
      inputData.value.pk = data.pk
      markInputDataSaved()
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
