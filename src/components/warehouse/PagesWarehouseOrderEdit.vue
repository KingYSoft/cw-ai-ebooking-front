<template>
  <v-sheet color="transparent">
    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 1">
        <WarehouseOrderDetail
          v-model:input-data="inputData"
          :input-data-rules="inputDataRules"
          :query-port-list="queryPortList"
          :readonly="readonly"
          @on-clear-addr="OnClearAddr"
          @on-select-addr="onSelectAddr"
          @query-port="queryPort"
          @register-form-refs="registerFormRefs"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 2">
        <WarehouseItemDetail
          v-model:input-data="inputData"
          :input-data-rules="inputDataRules"
          :readonly="readonly"
          @register-form-refs="registerFormRefs"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 3">
        <WarehouseOrderEDocs
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :readonly="readonly"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 5">
        <BookingLogs
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :entity-id="inputData.id"
        />
      </div>
    </v-scroll-x-transition>
  </v-sheet>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import { useLocale } from 'vuetify'
  import { portCodeQueryOptions } from '@/api/port_code'
  import { debounceFn } from '@/api/utils'
  import BookingLogs from '@/components/business/booking/BookingLogs.vue'
  import { useAppStore } from '@/stores/app'
  import WarehouseItemDetail from './warehouse_order/WarehouseItemDetail.vue'
  import WarehouseOrderDetail from './warehouse_order/WarehouseOrderDetail.vue'
  import WarehouseOrderEDocs from './warehouse_order/WarehouseOrderEDocs.vue'

  const appStore = useAppStore()
  const { t } = useLocale()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['register-form-refs'])

  const { activedTab, readonly } = toRefs(props)

  const registerFormRefs = el => {
    emit('register-form-refs', el)
  }

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const queryPortList = ref([])
  const queryPort = debounceFn(async (code, signal) => {
    try {
      const { data } = await portCodeQueryOptions(
        {
          query: code,
        },
        signal,
      )
      if (data) {
        queryPortList.value = data.list ?? []
      }
    } catch (error) {
      console.log(error)
    } finally {
      //
    }
  })

  const onSelectAddr = (row, addressType) => {
    if (!row || typeof row !== 'object') {
      return
    }
    if (addressType === 'SHIPPER') {
      if (!inputData.value.shipper || typeof inputData.value.shipper !== 'object') {
        inputData.value.shipper = {}
      }
      inputData.value.shipper.add_address_type = row.address_type
      inputData.value.shipper.add_address_short_code = row.short_code
      inputData.value.shipper.add_address_code = row.code
      inputData.value.shipper.add_address_name = row.company_name
      inputData.value.shipper.add_address = row.pk
      inputData.value.shipper.add_address1 = row.address1
      inputData.value.shipper.add_address2 = row.address2
      inputData.value.shipper.add_address3 = row.address3
      inputData.value.shipper.add_contact = row.contact
      inputData.value.shipper.add_city = row.city
      inputData.value.shipper.add_state = row.state
      inputData.value.shipper.add_postal_code = row.postal_code
      inputData.value.shipper.add_country_code = row.country_code
      inputData.value.shipper.add_phone = row.phone
      inputData.value.shipper.add_mobile = row.mobile
      inputData.value.shipper.add_fax = row.fax
      inputData.value.shipper.add_email = row.email
      inputData.value.shipper.add_port_code = row.port_code
      inputData.value.shipper.add_uscl = row.uscl ?? row.add_uscl ?? ''
    } else if (addressType === 'CONSIGNEE') {
      if (!inputData.value.consignee || typeof inputData.value.consignee !== 'object') {
        inputData.value.consignee = {}
      }
      inputData.value.consignee.add_address_type = row.address_type
      inputData.value.consignee.add_address_short_code = row.short_code
      inputData.value.consignee.add_address_code = row.code
      inputData.value.consignee.add_address_name = row.company_name
      inputData.value.consignee.add_address = row.pk
      inputData.value.consignee.add_address1 = row.address1
      inputData.value.consignee.add_address2 = row.address2
      inputData.value.consignee.add_address3 = row.address3
      inputData.value.consignee.add_contact = row.contact
      inputData.value.consignee.add_city = row.city
      inputData.value.consignee.add_state = row.state
      inputData.value.consignee.add_postal_code = row.postal_code
      inputData.value.consignee.add_country_code = row.country_code
      inputData.value.consignee.add_phone = row.phone
      inputData.value.consignee.add_mobile = row.mobile
      inputData.value.consignee.add_fax = row.fax
      inputData.value.consignee.add_email = row.email
      inputData.value.consignee.add_port_code = row.port_code
      inputData.value.consignee.add_switchboard = row.switchboard ?? row.add_switchboard ?? ''
      inputData.value.consignee.add_taxId = row.taxId ?? row.add_taxId ?? ''
    } else if (addressType === 'PICKUP') {
      if (!inputData.value.pickup || typeof inputData.value.pickup !== 'object') {
        inputData.value.pickup = {}
      }
      inputData.value.pickup.add_address_type = row.address_type
      inputData.value.pickup.add_address_short_code = row.short_code
      inputData.value.pickup.add_address_code = row.code
      inputData.value.pickup.add_address_name = row.company_name
      inputData.value.pickup.add_address = row.pk
      inputData.value.pickup.add_address1 = row.address1
      inputData.value.pickup.add_address2 = row.address2
      inputData.value.pickup.add_address3 = row.address3
      inputData.value.pickup.add_contact = row.contact
      inputData.value.pickup.add_city = row.city
      inputData.value.pickup.add_state = row.state
      inputData.value.pickup.add_postal_code = row.postal_code
      inputData.value.pickup.add_country_code = row.country_code
      inputData.value.pickup.add_phone = row.phone
      inputData.value.pickup.add_mobile = row.mobile
      inputData.value.pickup.add_fax = row.fax
      inputData.value.pickup.add_email = row.email
      inputData.value.pickup.add_port_code = row.port_code
    } else if (addressType === 'DELIVERY') {
      if (!inputData.value.delivery || typeof inputData.value.delivery !== 'object') {
        inputData.value.delivery = {}
      }
      inputData.value.delivery.add_address_type = row.address_type
      inputData.value.delivery.add_address_short_code = row.short_code
      inputData.value.delivery.add_address_code = row.code
      inputData.value.delivery.add_address_name = row.company_name
      inputData.value.delivery.add_address = row.pk
      inputData.value.delivery.add_address1 = row.address1
      inputData.value.delivery.add_address2 = row.address2
      inputData.value.delivery.add_address3 = row.address3
      inputData.value.delivery.add_contact = row.contact
      inputData.value.delivery.add_city = row.city
      inputData.value.delivery.add_state = row.state
      inputData.value.delivery.add_postal_code = row.postal_code
      inputData.value.delivery.add_country_code = row.country_code
      inputData.value.delivery.add_phone = row.phone
      inputData.value.delivery.add_mobile = row.mobile
      inputData.value.delivery.add_fax = row.fax
      inputData.value.delivery.add_email = row.email
      inputData.value.delivery.add_port_code = row.port_code
    } else if (addressType === 'NOTIFY_PARTY') {
      if (!inputData.value.notify_party || typeof inputData.value.notify_party !== 'object') {
        inputData.value.notify_party = {}
      }
      inputData.value.notify_party.add_address_type = row.address_type
      inputData.value.notify_party.add_address_short_code = row.short_code
      inputData.value.notify_party.add_address_code = row.code
      inputData.value.notify_party.add_address_name = row.company_name
      inputData.value.notify_party.add_address = row.pk
      inputData.value.notify_party.add_address1 = row.address1
      inputData.value.notify_party.add_address2 = row.address2
      inputData.value.notify_party.add_address3 = row.address3
      inputData.value.notify_party.add_contact = row.contact
      inputData.value.notify_party.add_city = row.city
      inputData.value.notify_party.add_state = row.state
      inputData.value.notify_party.add_postal_code = row.postal_code
      inputData.value.notify_party.add_country_code = row.country_code
      inputData.value.notify_party.add_phone = row.phone
      inputData.value.notify_party.add_mobile = row.mobile
      inputData.value.notify_party.add_fax = row.fax
      inputData.value.notify_party.add_email = row.email
      inputData.value.notify_party.add_port_code = row.port_code

      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }
  const OnClearAddr = type => {
    if (type === 'SHIPPER') {
      inputData.value.shipper = {}
    } else if (type === 'CONSIGNEE') {
      inputData.value.consignee = {}
    } else if (type === 'PICKUP') {
      inputData.value.pickup = {}
    } else if (type === 'DELIVERY') {
      inputData.value.delivery = {}
    } else if (type === 'NOTIFY_PARTY') {
      inputData.value.notify_party = {}
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

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
    wso_transport_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_transport_mode.err')
        }
      },
    ],
    wso_packing_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_packing_mode.err')
        }
      },
    ],
    wso_load_port: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_load_port.err')
        }
      },
    ],
    wso_etd: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_etd.err')
        }
      },
    ],
    wso_cargo_ready: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_cargo_ready.err')
        }
      },
    ],
    wso_actual_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_actual_weight.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.wso_actual_weight.err')
          }
        }
      },
    ],
    wso_actual_volume: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_actual_volume.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.wso_actual_volume.err')
          }
        }
      },
    ],
    wso_volume_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_volume_weight.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.wso_volume_weight.err')
          }
        }
      },
    ],
    wso_actual_chargeable: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_actual_chargeable.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.wso_actual_chargeable.err')
          }
        }
      },
    ],
    wso_total_package_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_total_package_count.err')
        } else {
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.wso_total_package_count.err')
          }
        }
      },
    ],
    wso_inco: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_inco.err')
        }
      },
    ],
    wso_transit_time: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_transit_time.err')
        } else {
          if (value) {
            if (appStore.utils.testInt(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.wso_transit_time.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    wso_goods_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.wso_goods_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    wso_insurance_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.wso_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.wso_insurance_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    wso_freight_terms: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_freight_terms.err')
        }
      },
    ],
    wso_release_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_release_type.err')
        }
      },
    ],
    wso_commodity: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_commodity.err')
        }
      },
    ],
    wso_goods_description: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_goods_description.err')
        }
      },
    ],
    wso_marks_nos: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.wso_marks_nos.err')
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

<style scoped>
  .ref-form-pre {
    min-width: 100%;
  }
</style>
