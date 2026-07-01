<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true" title="New Warehouse">
        <template #actions>
          <v-btn
            color="primary"
            :disabled="cardLoading"
            size="small"
            variant="flat"
            @click.stop="onSaveHandle"
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
  </div>
</template>

<script setup>
  import { onActivated, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'

  import { organizationQueryOrgAddress } from '@/api/organization'
  import { whsOrderSave } from '@/api/whs-order'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'WarehouseBookingNew' })
  definePage({
    name: 'warehouse_booking_new',
    icon: 'mdi-clipboard-text-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'New Warehouse',
    },
  })

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { t } = useLocale()

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const activedTab = ref(1)

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

  const inputData = ref(defaultData())
  // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)
  const queryData = async () => {
    try {
      cardLoading.value = true
      skeletonLoading.value = false
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

      markInputDataSaved()
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }
  const refDataForm = ref(null)

  const onSaveHandle = async () => {
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
      markInputDataSaved()
      appStore.openMessage({
        content: t('$vuetify.custom.app.saveSuccess'),
        color: 'success',
      })

      const consignNo = data?.wso_consign_no
      inputData.value.id = data.id ?? 0
      inputData.value.pk = data.pk
      markInputDataSaved()

      await router.push({
        name: 'warehouse_booking_edit-pk',
        params: { pk: data.pk },
        query: { id: data.id, wso_consign_no: consignNo },
      })
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

  // /** 列表点 New 进入本页时：用 userSession.org_code 预填 Shipper（编辑页不经过此文件） */
  // const prefillShipperFromSession = async () => {
  //   const orgCode = appStore.userSession.session()?.org_header_code
  //   if (!orgCode) {
  //     return
  //   }
  //   if (inputData.value.shipper?.add_address_name) {
  //     return
  //   }

  //   try {
  //     const { success, data } = await organizationQueryOrgAddress({
  //       query: orgCode,
  //       address_type: 'SHIPPER',
  //     })
  //     const items = data?.items ?? []
  //     if (!success || items.length === 0) {
  //       return
  //     }

  //     if (!inputData.value.shipper || typeof inputData.value.shipper !== 'object') {
  //       inputData.value.shipper = {}
  //     }
  //     applyOrgRowToShipper(inputData.value.shipper, items[0])
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const initNewBookingPage = async () => {
    await queryData()
  }

  onMounted(initNewBookingPage)
  onActivated(initNewBookingPage)
</script>
