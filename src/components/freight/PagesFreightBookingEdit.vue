<template>
  <v-sheet color="transparent">
    <div v-show="activedTab === 1">
      <EbookingBookingGeneralInfo
        v-model:input-data="inputData"
        :input-data-rules="inputDataRules"
        @add-container="emit('add-container')"
        @remove-container="emit('remove-container')"
      />
    </div>

    <div v-show="activedTab === 2">
      <v-card-text class="text-medium-emphasis">Additional Details (coming soon)</v-card-text>
    </div>

    <div v-show="activedTab === 3">
      <v-card-text class="text-medium-emphasis">eDocs (coming soon)</v-card-text>
    </div>

    <div v-show="activedTab === 4">
      <v-card-text class="text-medium-emphasis">Log (coming soon)</v-card-text>
    </div>
  </v-sheet>
</template>

<script setup>
  import { useDisplay, useLocale } from 'vuetify'
  import { useAppStore } from '@/stores/app'
  defineOptions({
    name: 'PagesFreightBookingEdit',
  })
  const { t } = useLocale()
  const appStore = useAppStore()

  defineProps({
    activedTab: { type: Number, default: 1 },
  })

  const emit = defineEmits(['add-container', 'remove-container'])

  const inputData = defineModel('input-data', { type: Object, required: true })
  const inputDataRules = {
    shipper_name: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.shipper_name.err')
        }
      },
    ],
    consignee_name: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.consignee_name.err')
        }
      },
    ],
    bkg_transport_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_transport_mode.err')
        }
      },
    ],
    bkg_packing_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_packing_mode.err')
        }
      },
    ],
    bkg_origin: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_origin.err')
        }
      },
    ],
    bkg_destination: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_destination.err')
        }
      },
    ],
    bkg_load_port: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_load_port.err')
        }
      },
    ],
    bkg_etd: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_etd.err')
        }
      },
    ],
    bkg_cargo_ready: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_cargo_ready.err')
        }
      },
    ],
    bkg_actual_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_actual_weight.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_weight.err')
          }
        }
      },
    ],
    bkg_actual_volume: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_actual_volume.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_volume.err')
          }
        }
      },
    ],
    bkg_volume_weight: [
      value => {
        if (value === '0' || value === 0) {
          return true
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_volume_weight.err')
          }
        }
      },
    ],
    bkg_actual_chargeable: [
      value => {
        if (value === '0' || value === 0) {
          return true
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_chargeable.err')
          }
        }
      },
    ],
    bkg_total_package_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_total_package_count.err')
        } else {
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_total_package_count.err')
          }
        }
      },
    ],
    bkg_inco: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_inco.err')
        }
      },
    ],
    bkg_transit_time: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_transit_time.err')
        } else {
          if (value) {
            if (appStore.utils.testInt(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_transit_time.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_goods_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_goods_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_insurance_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_freight_terms: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_freight_terms.err')
        }
      },
    ],
    bkg_release_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_release_type.err')
        }
      },
    ],
    bkg_commodity: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_commodity.err')
        }
      },
    ],
    bkg_goods_description: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_goods_description.err')
        }
      },
    ],
    bkg_marks_nos: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_marks_nos.err')
        }
      },
    ],
    pac_container_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.pac_container_type.err')
        }
      },
    ],
    pac_container_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_container_count.err')
        } else {
          // 必填
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.pac_container_count.err')
          }
        }
      },
    ],
    pac_package_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_package_count.err')
        } else {
          // 必填
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.pac_package_count.err')
          }
        }
      },
    ],
    pac_pack_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.pac_pack_type.err')
        }
      },
    ],
    pac_gross_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_gross_weight.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.pac_gross_weight.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    pac_actual_volume: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_actual_volume.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.pac_actual_volume.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
  }
</script>
