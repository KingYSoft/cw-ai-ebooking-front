<template>
  <v-sheet color="transparent">
    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 1">
        <WarehouseOrderDetail
          v-model:input-data="inputData"
          :convert-to-shipment-check="convertToShipmentCheck"
          :input-data-rules="inputDataRules"
          :query-all-user-list="queryAllUserList"
          :query-port-list="queryPortList"
          @add-container="addNewContainer"
          @add-new-loose="addNewLoose"
          @on-clear-addr="OnClearAddr"
          @on-new-handle="onNewHandle"
          @on-select-addr="onSelectAddr"
          @query-all-user="queryAllUser"
          @query-port="queryPort"
          @register-form-refs="registerFormRefs"
          @remove-container="removeNewContainer"
          @remove-new-loose="removeNewLoose"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 2">
        <WarehouseItemDetail
          v-model:input-data="inputData"
          @on-clear-addr="OnClearAddr"
          @on-new-handle="onNewHandle"
          @on-select-addr="onSelectAddr"
          @register-form-refs="registerFormRefs"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 3">
        <BookingEDocs v-model:input-data="inputData" :actived-tab="activedTab" />
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

    <!-- Organization Address Dialog -->
    <NewOrgAddressDialog
      v-model="orgAddressDialog"
      :address-type="orgAddressType"
      :save-loading="orgAddressLoading"
      @save="saveOrgAddress"
    />
  </v-sheet>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import { organizationSaveOrgAddress } from '@/api/organization'
  import BookingEDocs from '@/components/business/booking/BookingEDocs.vue'
  import BookingLogs from '@/components/business/booking/BookingLogs.vue'
  import NewOrgAddressDialog from '@/components/business/NewOrgAddressDialog.vue'
  import { useAppStore } from '@/stores/app'
  import WarehouseItemDetail from './warehouse_order/WarehouseItemDetail.vue'
  import WarehouseOrderDetail from './warehouse_order/WarehouseOrderDetail.vue'

  const appStore = useAppStore()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    inputDataRules: {
      type: Object,
      default: () => {
        return {}
      },
    },
    queryPortList: {
      type: Array,
      default: () => [],
    },
    queryAllUserList: {
      type: Array,
      default: () => [],
    },
    convertToShipmentCheck: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits([
    'add-container',
    'add-new-loose',
    'input-data:update',
    'query-port',
    'remove-container',
    'remove-new-loose',
    'query-all-user',
    'register-form-refs',
  ])

  const { activedTab, inputDataRules, queryPortList, queryAllUserList, convertToShipmentCheck } =
    toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const addNewContainer = () => {
    emit('add-container')
  }
  const removeNewContainer = index => {
    emit('remove-container', index)
  }
  const addNewLoose = () => {
    emit('add-new-loose')
  }
  const removeNewLoose = index => {
    emit('remove-new-loose', index)
  }
  const queryPort = event => {
    emit('query-port', event)
  }
  const queryAllUser = event => {
    emit('query-all-user', event)
  }

  const registerFormRefs = el => {
    emit('register-form-refs', el)
  }

  // 对话框相关状态
  const orgAddressDialog = ref(false)
  const orgAddressLoading = ref(false)
  const orgAddressType = ref('')

  // 处理新建地址
  const onNewHandle = addressType => {
    orgAddressType.value = addressType
    orgAddressDialog.value = true
  }

  const saveOrgAddress = async formData => {
    if (!formData) return

    try {
      orgAddressLoading.value = true
      const { success, data } = await organizationSaveOrgAddress({
        ...formData,
        address_type: 'WHS',
      })
      if (success) {
        const row = data?.address
        if (row) {
          onSelectAddr(row, orgAddressType.value)
        }
        appStore.openMessage({
          color: 'success',
          content: 'Save success.',
        })
      }
    } catch (error) {
      console.log('saveOrgAddress error:', error)
    } finally {
      orgAddressLoading.value = false
      orgAddressDialog.value = false
    }
  }

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
</script>

<style scoped>
  .ref-form-pre {
    min-width: 100%;
  }
</style>
