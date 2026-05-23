<template>
  <div>
    <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
      <LayoutWithToolbar :divider="false" :height="68" :spacer="true">
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
        title="Booking Not Exists."
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">
          booking not exists. you can new booking or close page.
        </v-card-text>

        <template #actions>
          <v-spacer />
          <v-btn :text="t('$vuetify.custom.dialog.btn.close')" @click="closeBookingPageHandle" />
          <v-btn color="primary" text="New Booking" variant="tonal" @click="newBookingHandle" />
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="convertToShipmentDiaVis" max-width="520" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        title="Convert to Shipment"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="py-2">
          <div>Are you sure to convert the booking to shipment?</div>

          <div class="mt-2 d-flex align-center ga-1">
            <div class="text-body-1">Create Auto Consol:</div>

            <v-radio-group
              v-model="convertIsCreateConsol"
              density="comfortable"
              hide-details
              inline
            >
              <v-radio color="info" label="YES" value="Y" />
              <v-radio class="ml-4" color="warning" label="No" value="N" />
            </v-radio-group>
          </div>
        </v-card-text>

        <template #actions>
          <v-spacer />

          <v-btn
            :text="t('$vuetify.custom.dialog.btn.close')"
            @click="onCloseConvertToShipmentDiaVis"
          />

          <v-btn
            color="primary"
            :text="t('$vuetify.custom.dialog.btn.confirm')"
            variant="tonal"
            @click="onConfirmConvertToShipmentWithLockCheck"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'

  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesWarehouseOrderEdit from '@/components/warehouse/PagesWarehouseOrderEdit.vue'
  import { saveWhsOrderFromForm } from '@/composables/mapWhsOrderDetail'
  import { useBookingForm } from '@/composables/useBookingForm'
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
      tabTitle: 'New Warehouse Booking',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()
  const { t } = useLocale()

  const {
    skeletonLoading,
    cardLoading,
    activedTab,
    bookingEmptyVis,
    convertToShipmentDiaVis,
    inputData,
    inputDataRules,
    convertToShipmentCheck,
    convertIsCreateConsol,
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
    onConfirmConvertToShipmentHandle,
    onCloseConvertToShipmentDiaVis,
  } = useBookingForm({ isEditMode: false, saveLoader: saveWhsOrderFromForm })

  const onConfirmConvertToShipmentWithLockCheck = async () => {
    await onConfirmConvertToShipmentHandle()
  }

  const closeBookingPageHandle = () => {
    setTimeout(() => {
      appStore.event.trigger('closeTab', route.fullPath)
    }, 100)
    bookingEmptyVis.value = false
    router.replace({ name: 'warehouse_booking' })
  }

  const newBookingHandle = () => {
    setTimeout(() => {
      appStore.event.trigger('closeTab', route.fullPath)
    }, 100)
    bookingEmptyVis.value = false
    router.push({ name: 'warehouse_booking_new' })
  }

  queryData()
</script>
