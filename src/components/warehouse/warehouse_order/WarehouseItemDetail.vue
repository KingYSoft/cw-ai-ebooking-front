<template>
  <v-card-text class="py-2">
    <v-btn color="primary" prepend-icon="mdi-upload" size="small" variant="flat"> Upload </v-btn>
  </v-card-text>

  <v-form :ref="setRef" class="ref-form-pre" color="background">
    <v-card-text class="py-2">
      <!-- <v-btn color="primary" size="small" variant="flat">Item Detail</v-btn> -->

      <v-text-field
        id="1@container_rows_required"
        class="d-none"
        density="compact"
        hide-details
        :model-value="inputData.pac_list?.length ?? 0"
        :rules="[v => Number(v || 0) > 0 || 'Requires at least one line.']"
      />
    </v-card-text>

    <v-data-table
      class="table-filter"
      disable-sort
      :headers="tblContainerHeaders"
      hide-default-footer
      item-value="rowKey"
      :items="inputData.pac_list"
      :items-per-page="-1"
      :show-select="false"
      striped="even"
    >
      <!-- 表头新增按钮 -->
      <template #header.actions>
        <v-btn
          color="primary"
          density="comfortable"
          icon="mdi-plus-circle"
          size="small"
          variant="text"
          @click.stop="addNewContainer"
        />
      </template>

      <!-- 行内删除按钮 -->
      <template #item.actions="{ index }">
        <v-btn
          color="red"
          density="comfortable"
          icon="mdi-minus-circle"
          size="small"
          variant="text"
          @click.stop="removeNewContainer(index)"
        />
      </template>

      <!-- Market -->
      <template #item.market="{ item }">
        <v-select
          v-model="item.market"
          density="compact"
          hide-details
          :items="['Market A', 'Market B']"
          variant="outlined"
        />
      </template>

      <!-- Plant ID -->
      <template #item.plant_id="{ item }">
        <v-text-field v-model="item.plant_id" density="compact" hide-details variant="outlined" />
      </template>

      <!-- Packing List No. -->
      <template #item.packing_list_no="{ item }">
        <v-text-field
          v-model="item.packing_list_no"
          density="compact"
          hide-details
          variant="outlined"
        />
      </template>

      <!-- Description -->
      <template #item.description="{ item }">
        <v-text-field
          v-model="item.description"
          density="compact"
          hide-details
          variant="outlined"
        />
      </template>

      <!-- Item Code -->
      <template #item.item_code="{ item }">
        <v-text-field v-model="item.item_code" density="compact" hide-details variant="outlined" />
      </template>

      <!-- Gross Weight-->
      <template #item.gross_weight="{ item }">
        <div class="d-flex align-center ga-0 w-100">
          <v-number-input
            v-model="item.gross_weight"
            class="flex-1-1"
            color="primary"
            control-variant="hidden"
            density="compact"
            hide-details
            :precision="5"
            variant="outlined"
            @update:model-value="jsPackingW(item)"
          />

          <v-select
            v-model="item.pac_weight_unit"
            density="compact"
            hide-details
            item-title="code"
            item-value="code"
            :items="appStore.appCombobox.getCombobox('weightUnit')"
            variant="underlined"
            width="50px"
          />
        </div>
      </template>

      <!-- Net Weight -->
      <template #item.net_weight="{ item }">
        <div class="d-flex align-center ga-0 w-100">
          <v-number-input
            v-model="item.net_weight"
            class="flex-1-1"
            control-variant="hidden"
            density="compact"
            hide-details
            :precision="5"
            variant="outlined"
          />

          <v-select
            v-model="item.pac_weight_unit"
            density="compact"
            hide-details
            item-title="code"
            item-value="code"
            :items="appStore.appCombobox.getCombobox('weightUnit')"
            variant="underlined"
            width="50px"
          />
        </div>
      </template>

      <!-- Volume (保留原单位选择逻辑) -->
      <template #item.volume="{ item }">
        <div class="d-flex align-center ga-0 w-100">
          <v-number-input
            v-model="item.volume"
            class="flex-1-1"
            control-variant="hidden"
            density="compact"
            hide-details
            :precision="5"
            variant="outlined"
            @update:model-value="jsPackingW(item)"
          />

          <v-select
            v-model="item.pac_actual_volume_uom"
            density="compact"
            hide-details
            item-title="code"
            item-value="code"
            :items="appStore.appCombobox.getCombobox('cbmUnit')"
            variant="underlined"
            width="50px"
          />
        </div>
      </template>

      <!-- No. of Package -->
      <template #item.package_count="{ item }">
        <div class="d-flex align-center ga-0 w-100">
          <v-number-input
            v-model="item.package_count"
            class="flex-1-1"
            control-variant="hidden"
            density="compact"
            hide-details
            variant="outlined"
          />

          <FRemoteTableMenu
            v-model="item.pac_pack_type"
            display-key="code"
            :fetch-method="fetchPackageTypes"
            :headers="packageTypeTableHeaders"
            item-value="code"
            :text-field-props="{
              variant: 'underlined',
              width: '70',
            }"
            virtual
            @row-select="row => assignPackageTypeFromRow(row, item, 'pac_pack_type')"
          />
        </div>
      </template>

      <!-- Pieces -->
      <template #item.pieces="{ item }">
        <v-number-input
          v-model="item.pieces"
          control-variant="hidden"
          density="compact"
          hide-details
          variant="outlined"
        />
      </template>

      <!-- Palletization? -->
      <template #item.is_palletization="{ item }">
        <v-checkbox-btn
          v-model="item.is_palletization"
          color="primary"
          density="compact"
          :false-value="0"
          hide-details
          :true-value="1"
        />
      </template>

      <!-- Battery included? -->
      <template #item.is_battery="{ item }">
        <v-checkbox-btn
          v-model="item.is_battery"
          color="primary"
          density="compact"
          :false-value="0"
          hide-details
          :true-value="1"
        />
      </template>
    </v-data-table>
  </v-form>
</template>

<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import { organizationQueryOrgAddress, organizationQueryOrgCarrier } from '@/api/organization'
  import { queryServiceLevelPage } from '@/api/service_level'
  import { debounceFn } from '@/api/utils'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import {
    assignContainerTypeFromRow,
    containerTypeTableHeaders,
    fetchContainerTypes,
  } from '@/composables/useContainerTypeRemoteMenu'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeMenuTextFieldProps,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'WarehouseItemDetail',
  })

  const appStore = useAppStore()
  const display = useDisplay()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
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
      default: true,
    },
  })
  const { inputDataRules, queryPortList, queryAllUserList, convertToShipmentCheck } = toRefs(props)
  const convertRequiredRule = fieldLabel => {
    return value => {
      return String(value ?? '').trim() !== '' || `${fieldLabel} is required.`
    }
  }

  const convertRequiredRules = computed(() => {
    if (!convertToShipmentCheck.value) {
      return {
        etd: [],
        eta: [],
        cargoReadyDate: [],
        carrier: [],
        contractNo: [],
        releaseType: [],
        soNumber: [],
        poNumber: [],
      }
    }
    return {
      etd: [convertRequiredRule('ETD')],
      eta: [convertRequiredRule('ETA')],
      cargoReadyDate: [convertRequiredRule('Cargo Ready Date')],
      carrier: [convertRequiredRule('Carrier')],
      contractNo: [convertRequiredRule('Contract No')],
      releaseType: [convertRequiredRule('Release Type')],
      soNumber: [convertRequiredRule('SO Number')],
      poNumber: [convertRequiredRule('PO Number')],
    }
  })

  /** ETD 须严格晚于 Cargo Ready（yyyy-MM-dd：es > cs，不可同日） */
  function validateBookingEtdNotBeforeCargoReady() {
    return () => {
      const es = String(inputData.value.bkg_etd ?? '').trim()
      const cs = String(inputData.value.bkg_cargo_ready ?? '').trim()
      if (!es || !cs) return true
      if (es > cs) return true
      return t('$vuetify.custom.bookingPage.form.etd_must_be_before_cargo_ready.err')
    }
  }

  /** SEA: ETA > ETD；AIR: ETA >= ETD */
  function validateBookingEtaVsEtd() {
    return () => {
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
  }

  const bkgEtdRules = computed(() => [
    ...convertRequiredRules.value.etd,
    validateBookingEtdNotBeforeCargoReady(),
    validateBookingEtaVsEtd(),
  ])

  const bkgEtaRules = computed(() => [...convertRequiredRules.value.eta, validateBookingEtaVsEtd()])

  const bkgCargoReadyRulesWithOrder = computed(() => [
    ...(inputDataRules.value.bkg_cargo_ready ?? []),
    validateBookingEtdNotBeforeCargoReady(),
  ])

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const emit = defineEmits([
    'add-container',
    'add-new-loose',
    'on-new-handle',
    'query-port',
    'remove-container',
    'remove-new-loose',
    'on-select-addr',
    'query-all-user',
    'register-form-refs',
    'on-clear-addr',
  ])

  const addNewContainer = () => {
    if (!inputData.value.pac_list) {
      inputData.value.pac_list = []
    }

    inputData.value.pac_list.push({
      id: 0,
      pk: '',
      rowKey: `new-${Date.now()}`,
      market: '',
      plant_id: '',
      packing_list_no: '',
      description: '',
      item_code: '',
      gross_weight: 0,
      net_weight: 0,
      volume: 0,
      package_count: 0,
      pieces: 0,
      is_palletization: 0,
      is_battery: 0,
      // 保留一些原有的单位字段，防止计算逻辑报错
      pac_weight_unit: 'KG',
      pac_actual_volume_uom: 'CBM',
      pac_pack_type: '',
    })

    emit('add-container')
  }

  const removeNewContainer = index => {
    // 直接在子组件删除，确保 UI 立即反应
    inputData.value.pac_list.splice(index, 1)
    emit('remove-container', index)
  }

  const addNewLoose = () => {
    emit('add-new-loose')
  }

  const onNewHandle = type => {
    emit('on-new-handle', type)
  }

  const queryPort = value => {
    emit('query-port', value)
  }

  const queryCarrierList = ref([])
  const queryCarrier = debounceFn(async (inputStr, signal) => {
    try {
      const { data } = await organizationQueryOrgCarrier(
        {
          inputStr: String(inputStr ?? ''),
        },
        signal,
      )
      queryCarrierList.value = Array.isArray(data?.list) ? data.list : []
    } catch (error) {
      console.log(error)
    }
  })

  //   const removeNewContainer = index => {
  //     emit('remove-container', index)
  //   }

  const removeNewLoose = index => {
    emit('remove-new-loose', index)
  }

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const OnClearAddr = type => {
    emit('on-clear-addr', type)
  }
  const queryAllUser = event => {
    emit('query-all-user', event)
  }

  const setRef = el => {
    emit('register-form-refs', el)
  }

  const serviceLevelCodeItems = ref([])

  const loadServiceLevelCodes = async () => {
    try {
      const res = await queryServiceLevelPage({
        SkipCount: 0,
        MaxResultCount: 9999,
        filters: [],
      })
      const items = res?.data?.items ?? []
      serviceLevelCodeItems.value = items.map(item => item?.code).filter(code => Boolean(code))
    } catch (error) {
      console.error('loadServiceLevelCodes failed:', error)
      serviceLevelCodeItems.value = []
    }
  }
  loadServiceLevelCodes()

  const addrTableHeaders = [
    {
      title: 'Code',
      key: 'code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Company Name',
      key: 'company_name',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Address Code',
      key: 'address_code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Address1',
      key: 'address1',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    { title: 'City', key: 'city', align: 'start', minWidth: '140' },
    { title: 'Country', key: 'country_code', align: 'start', minWidth: '140' },
  ]

  const tblContainerHeaders = [
    { title: '', key: 'actions', width: '50px', align: 'center' },
    { title: 'Market', key: 'market', width: '120px' },
    { title: 'Plant ID', key: 'plant_id', width: '100px' },
    { title: 'Packing List No.', key: 'packing_list_no', width: '150px' },
    { title: 'Description', key: 'description', width: '200px' },
    { title: 'Item Code', key: 'item_code', width: '120px' },
    { title: 'Gross Weight', key: 'gross_weight', width: '180px' },
    { title: 'Net Weight', key: 'net_weight', width: '180px' },
    { title: 'Volume', key: 'volume', width: '180px' },
    { title: 'No. of Package', key: 'package_count', width: '180px' },
    { title: 'Pieces', key: 'pieces', width: '100px' },
    { title: 'Palletization?', key: 'is_palletization', width: '100px', align: 'center' },
    { title: 'Battery included?', key: 'is_battery', width: '120px', align: 'center' },
  ]
  const tblLooseHeaders = [
    {
      title: 'Actions',
      key: 'actions',
      width: '40px',
    },
    {
      title: 'No. of Package',
      key: 'pac_package_count',
      align: 'start',
      minWidth: '160px',
      width: '160px',
    },
    {
      title: 'Gross Weight',
      key: 'pac_gross_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Volume',
      key: 'pac_actual_volume',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Volume Weight',
      key: 'pac_volume_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Chargeable Weight',
      key: 'pac_chargeable_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Length',
      key: 'pac_length',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Width',
      key: 'pac_width',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Height',
      key: 'pac_height',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Description',
      key: 'pac_description',
      align: 'start',
      minWidth: '100',
    },
  ]

  const js_w = () => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!inputData.value) return

    const cbm_d = new Decimal(inputData.value.bkg_actual_volume ?? 0)
    const cbm = cbm_d.isNaN() ? new Decimal(0) : cbm_d
    const vol_weight = cbm.times(new Decimal(166)).times(new Decimal(1000)).div(new Decimal(1000))
    const vw = vol_weight.toNumber()
    const newVolumeWeight = vw === 0 ? null : vw

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.bkg_volume_weight !== newVolumeWeight) {
      inputData.value.bkg_volume_weight = newVolumeWeight
    }

    const gw_d = new Decimal(inputData.value.bkg_actual_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.bkg_actual_chargeable !== newChargeableWeight) {
      inputData.value.bkg_actual_chargeable = newChargeableWeight
    }
  }

  // 使用标志位防止循环更新
  let isCalculating = false
  watch(
    () => inputData.value.bkg_actual_volume,
    () => {
      if (isCalculating) return
      isCalculating = true
      js_w()
      setTimeout(() => {
        isCalculating = false
      }, 0)
    },
    // 首次加载不根据体积重算抬头计费重/体积重，保留接口返回的数据
    { immediate: false },
  )
  watch(
    () => inputData.value.bkg_actual_weight,
    () => {
      if (isCalculating) return
      isCalculating = true
      js_w()
      setTimeout(() => {
        isCalculating = false
      }, 0)
    },
    { immediate: false },
  )

  const jsPackingW = item => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!item) return

    const cbm_d = new Decimal(item.pac_actual_volume ?? 0)
    const cbm = cbm_d.isNaN() ? new Decimal(0) : cbm_d
    const vol_weight = cbm.times(new Decimal(166)).times(new Decimal(1000)).div(new Decimal(1000))
    const vw = vol_weight.toNumber()
    const newVolumeWeight = vw === 0 ? null : vw

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (item.pac_volume_weight !== newVolumeWeight) {
      item.pac_volume_weight = newVolumeWeight
    }

    const gw_d = new Decimal(item.pac_gross_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (item.pac_chargeable_weight !== newChargeableWeight) {
      item.pac_chargeable_weight = newChargeableWeight
    }
  }

  const syncTopMetricsToRows = (options = {}) => {
    const skipPackage = options.skipPackage === true
    const gross = inputData.value?.bkg_actual_weight ?? null
    const volume = inputData.value?.bkg_actual_volume ?? null
    const packageCount = inputData.value?.bkg_total_package_count ?? null
    const packageType = inputData.value?.bkg_pack_type ?? null
    const weightUom = inputData.value?.bkg_unit_of_weight ?? null
    const volumeUom = inputData.value?.bkg_unit_of_volume ?? null
    const volumeWeight = inputData.value?.bkg_volume_weight ?? null
    const chargeable = inputData.value?.bkg_actual_chargeable ?? null

    for (const row of inputData.value?.pac_list ?? []) {
      row.pac_gross_weight = gross
      row.pac_actual_volume = volume
      if (!skipPackage) {
        row.pac_package_count = packageCount
        row.pac_pack_type = packageType
      }
      row.pac_unit_of_weight = weightUom
      row.pac_unit_of_volume = volumeUom
      row.pac_volume_weight = volumeWeight
      row.pac_chargeable_weight = chargeable
      jsPackingW(row)
    }
  }

  const topMetricsWatchDeps = () => [
    inputData.value?.bkg_actual_weight,
    inputData.value?.bkg_actual_volume,
    inputData.value?.bkg_total_package_count,
    inputData.value?.bkg_pack_type,
    inputData.value?.bkg_unit_of_weight,
    inputData.value?.bkg_unit_of_volume,
    inputData.value?.bkg_volume_weight,
    inputData.value?.bkg_actual_chargeable,
  ]

  watch(
    topMetricsWatchDeps,
    (newVals, oldVals) => {
      const skipPackage =
        oldVals === undefined ||
        (Array.isArray(oldVals) &&
          Array.isArray(newVals) &&
          newVals[2] === oldVals[2] &&
          newVals[3] === oldVals[3])
      syncTopMetricsToRows({ skipPackage })
    },
    // 首次加载不把抬头字段灌入 pac_list 每一行，避免覆盖接口明细；用户改抬头后再同步各行
    { immediate: false },
  )
</script>
