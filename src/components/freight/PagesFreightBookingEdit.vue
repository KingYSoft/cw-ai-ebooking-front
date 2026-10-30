<template>
  <v-sheet color="transparent">
    <div v-if="activedTab !== 4" v-show="activedTab === 1">
      <fieldset
        class="booking-lock-fieldset"
        :class="{ 'is-locked': lockNonSiFields }"
        :disabled="lockNonSiFields"
        :inert="lockNonSiFields"
      >
        <EbookingBookingGeneralInfo
          v-model:input-data="inputData"
          :addr-table-headers="addrTableHeaders"
          :input-data-rules="inputDataRules"
          :query-port-list="queryPortList"
          @add-container="emit('add-container')"
          @on-clear-addr="onClearAddr"
          @on-select-addr="onSelectAddr"
          @query-port="queryPort"
          @remove-container="emit('remove-container')"
        />
      </fieldset>
    </div>

    <div v-show="activedTab === 2">
      <fieldset
        class="booking-lock-fieldset"
        :class="{ 'is-locked': lockNonSiFields }"
        :disabled="lockNonSiFields"
        :inert="lockNonSiFields"
      >
        <BookingAdditionalDetails
          v-model:input-data="inputData"
          :addr-table-headers="addrTableHeaders"
          :input-data-rules="inputDataRules"
          @on-clear-addr="onClearAddr"
          @on-select-addr="onSelectAddr"
        />
      </fieldset>
    </div>

    <div v-show="activedTab === 3">
      <fieldset
        class="booking-lock-fieldset"
        :class="{ 'is-locked': lockNonSiFields }"
        :disabled="lockNonSiFields"
        :inert="lockNonSiFields"
      >
        <BookingEDocs
          v-model:input-data="inputData"
          :actived-tab="activedTab"
          :readonly="lockNonSiFields"
        />
      </fieldset>
    </div>

    <div v-if="activedTab === 4">
      <fieldset
        class="booking-lock-fieldset"
        :class="{ 'is-locked': lockSiFields }"
        :disabled="lockSiFields"
        :inert="lockSiFields"
      >
        <EbookingBookingGeneralInfo
          v-model:input-data="inputData"
          :addr-table-headers="addrTableHeaders"
          field-id-prefix="4"
          :input-data-rules="inputDataRules"
          :query-port-list="queryPortList"
          :show-cargo-fields="true"
          show-si-route-fields
          @add-container="emit('add-container')"
          @on-clear-addr="onClearAddr"
          @on-select-addr="onSelectAddr"
          @query-port="queryPort"
          @remove-container="emit('remove-container')"
        />
      </fieldset>
    </div>
  </v-sheet>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  import { portCodeQueryOptions } from '@/api/port_code'
  import { debounceFn } from '@/api/utils'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'PagesFreightBookingEdit',
  })
  const { t } = useLocale()
  const { addrTable } = useBookingPageI18n()
  const appStore = useAppStore()

  defineProps({
    activedTab: { type: Number, default: 1 },
    lockNonSiFields: { type: Boolean, default: false },
    lockSiFields: { type: Boolean, default: false },
  })

  const emit = defineEmits(['add-container', 'remove-container'])

  const inputData = defineModel('input-data', { type: Object, required: true })

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

  const addrTableHeaders = computed(() => [
    {
      title: addrTable('code'),
      key: 'code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: addrTable('companyName'),
      key: 'company_name',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: addrTable('addressCode'),
      key: 'address_code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: addrTable('address1'),
      key: 'address1',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    { title: addrTable('city'), key: 'city', align: 'start', minWidth: '140' },
    { title: addrTable('country'), key: 'country_code', align: 'start', minWidth: '140' },
  ])

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
  const onClearAddr = type => {
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

  /** ETD 须严格晚于 Cargo Ready（yyyy-MM-dd：es > cs，不可同日） */
  const validateBookingEtdNotBeforeCargoReady = () => {
    const es = String(inputData.value.bkg_etd ?? '').trim()
    const cs = String(inputData.value.bkg_cargo_ready ?? '').trim()
    if (!es || !cs) return true
    if (es > cs) return true
    return t('$vuetify.custom.bookingPage.form.etd_must_be_before_cargo_ready.err')
  }

  /** SEA: ETA > ETD；AIR: ETA >= ETD */
  const validateBookingEtaVsEtd = () => {
    const mode = String(inputData.value.bkg_transport_mode ?? '').toUpperCase()
    const etd = String(inputData.value.bkg_etd ?? '').trim()
    const eta = String(inputData.value.bkg_eta ?? '').trim()
    if (!etd || !eta) return true
    if (mode === 'SEA') {
      if (eta > etd) return true
      return t('$vuetify.custom.bookingPage.form.eta_vs_etd_sea.err')
    }
    if (mode === 'AIR') {
      if (eta >= etd) return true
      return t('$vuetify.custom.bookingPage.form.eta_vs_etd_air.err')
    }
    return true
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
    bkg_discharge_port: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_discharge_port.err')
        }
      },
    ],
    bkg_intended_vessel: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_intended_vessel.err')
        }
      },
    ],
    bkg_voyage: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_voyage.err')
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
      validateBookingEtdNotBeforeCargoReady,
      validateBookingEtaVsEtd,
    ],
    bkg_eta: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_eta.err')
        }
      },
      validateBookingEtaVsEtd,
    ],
    bkg_cargo_ready: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_cargo_ready.err')
        }
      },
      validateBookingEtdNotBeforeCargoReady,
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
