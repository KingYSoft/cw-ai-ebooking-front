<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true" :title="edit('newPageTitle')">
        <template v-if="activedTab === 1 || activedTab === 2" #actions>
          <v-btn
            color="primary"
            :disabled="cardLoading"
            size="small"
            variant="flat"
            @click.stop="onSaveHandle"
          >
            {{ editButton('save') }}
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
  import { organizationQueryOrgAddress } from '@/api/organization'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { useWarehouseBookingForm } from '@/composables/useWarehouseBookingForm'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
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

  const {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    whsOrderSaveHandle,
    handleValidationErrors,
    markInputDataSaved,
  } = useWarehouseBookingForm()

  const appStore = useAppStore()
  const router = useRouter()
  const route = useRoute()
  const { edit, editButton, editTab, editMessage } = useWarehouseOrderPageI18n()

  // // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  // const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)

  const queryData = async () => {
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
  const refDataForm = ref(null)

  const onSaveHandle = async () => {
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
          await whsOrderSaveHandle()
          router.push({
            name: 'warehouse_booking_edit-pk',
            params: { pk: inputData.value.pk },
            query: { id: inputData.value.id, shipment_no: inputData.value.wso_consign_no },
          })
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

  const initNewBookingPage = async () => {
    await queryData()
  }

  onMounted(initNewBookingPage)
  onActivated(initNewBookingPage)
</script>
