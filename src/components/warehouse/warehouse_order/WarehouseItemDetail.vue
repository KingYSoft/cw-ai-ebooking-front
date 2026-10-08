<template>
  <div :inert="readonly">
    <v-card-text class="py-2">
      <v-btn
        v-if="!readonly"
        color="primary"
        :disabled="importLoading || downloadLoading"
        :loading="importLoading"
        prepend-icon="mdi-upload"
        size="small"
        variant="flat"
        @click="openOrderLineImport"
      >
        {{ itemDetailLabel('upload') }}
      </v-btn>

      <v-btn
        v-if="!readonly"
        class="ml-2"
        color="primary"
        :disabled="importLoading || downloadLoading"
        :loading="downloadLoading"
        prepend-icon="mdi-download"
        size="small"
        variant="flat"
        @click="downloadOrderLineTemplate"
      >
        {{ itemDetailLabel('download') }}
      </v-btn>
    </v-card-text>

    <v-form :ref="setRef" class="ref-form-pre" color="background">
      <v-card-text class="py-2">
        <v-text-field
          id="2@container_rows_required"
          class="d-none"
          density="compact"
          hide-details
          :model-value="itemList.length"
          :rules="[v => Number(v || 0) > 0 || validation('atLeastOneLine')]"
        />
      </v-card-text>

      <v-data-table
        class="table-filter"
        disable-sort
        :headers="tblContainerHeaders"
        hide-default-footer
        item-value="rowKey"
        :items="itemList"
        :items-per-page="-1"
        :show-select="false"
        striped="even"
      >
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

        <!-- Market：选项来自 Order Header 所选 Market Group -->
        <template #item.woi_market="{ item }">
          <v-autocomplete
            v-model="item.woi_market"
            density="compact"
            hide-details="auto"
            :items="orderLineMarketItems"
            :menu-props="{ maxWidth: '240px' }"
            :rules="lineTextRules.woi_market"
            variant="outlined"
          />
        </template>

        <template #item.woi_invoice_no="{ item }">
          <v-text-field
            v-model="item.woi_invoice_no"
            density="compact"
            hide-details
            :rules="lineTextRules.woi_invoice_no"
            variant="outlined"
          />
        </template>

        <template #item.woi_packlist_no="{ item }">
          <v-text-field
            v-model="item.woi_packlist_no"
            density="compact"
            hide-details
            :rules="lineTextRules.woi_packlist_no"
            variant="outlined"
          />
        </template>

        <template #item.woi_desc="{ item }">
          <v-text-field
            v-model="item.woi_desc"
            density="compact"
            hide-details
            :rules="lineTextRules.woi_desc"
            variant="outlined"
          />
        </template>

        <template #item.woi_item="{ item }">
          <v-text-field
            v-model="item.woi_item"
            density="compact"
            hide-details
            :rules="lineTextRules.woi_item"
            variant="outlined"
          />
        </template>

        <template #item.woi_hs_code="{ item }">
          <v-text-field
            v-model="item.woi_hs_code"
            density="compact"
            hide-details
            variant="outlined"
          />
        </template>

        <template #item.woi_gross_wt="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.woi_gross_wt"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :precision="WAREHOUSE_MEASURE_DECIMALS"
              :rules="lineMeasureRules.woi_gross_wt"
              variant="outlined"
            />

            <div>
              <v-select
                v-model="item.woi_gw_unit"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="appStore.appCombobox.getCombobox('weightUnit')"
                variant="underlined"
                width="50px"
                @update:model-value="item.woi_nw_unit = item.woi_gw_unit"
              />
            </div>
          </div>
        </template>

        <template #item.woi_net_wt="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.woi_net_wt"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :precision="WAREHOUSE_MEASURE_DECIMALS"
              :rules="lineMeasureRules.woi_net_wt"
              variant="outlined"
            />

            <div>
              <v-select
                v-model="item.woi_gw_unit"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="appStore.appCombobox.getCombobox('weightUnit')"
                variant="underlined"
                width="50px"
              />
            </div>
          </div>
        </template>

        <template #item.woi_volume="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.woi_volume"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :precision="WAREHOUSE_MEASURE_DECIMALS"
              :rules="lineMeasureRules.woi_volume"
              variant="outlined"
            />

            <div>
              <v-select
                v-model="item.woi_vol_unit"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="appStore.appCombobox.getCombobox('cbmUnit')"
                variant="underlined"
                width="70px"
              />
            </div>
          </div>
        </template>

        <template #item.woi_outer_pack="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.woi_outer_pack"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :min-fraction-digits="0"
              :precision="0"
              :rules="lineMeasureRules.woi_outer_pack"
              variant="outlined"
            />

            <div>
              <FRemoteTableMenu
                v-model="item.woi_outpack_unit"
                display-key="code"
                :fetch-method="fetchPackageTypes"
                :headers="packageTypeTableHeaders"
                item-value="code"
                :text-field-props="{
                  variant: 'underlined',
                  width: '78',
                }"
                virtual
                @row-select="row => assignPackageTypeFromRow(row, item, 'woi_outpack_unit')"
              />
            </div>
          </div>
        </template>

        <template #item.woi_pieces="{ item }">
          <v-number-input
            v-model="item.woi_pieces"
            control-variant="hidden"
            density="compact"
            hide-details
            :precision="WAREHOUSE_MEASURE_DECIMALS"
            :rules="lineMeasureRules.woi_pieces"
            variant="outlined"
          />
        </template>

        <template #item.woi_is_palletization="{ item }">
          <v-checkbox-btn
            v-model="item.woi_is_palletization"
            color="primary"
            density="compact"
            :false-value="0"
            hide-details
            :true-value="1"
          />
        </template>

        <template #item.woi_is_battery_included="{ item }">
          <div class="d-flex flex-column align-center ga-1 py-1">
            <v-checkbox-btn
              v-model="item.woi_is_battery_included"
              color="primary"
              density="compact"
              :false-value="0"
              hide-details
              :true-value="1"
            />

            <template v-if="Number(item.woi_is_battery_included) === 1">
              <div
                v-if="hasBatteryFile(item)"
                class="d-flex flex-wrap justify-center ga-1"
              >
                <v-chip
                  v-for="(fileItem, fileIndex) in batteryFileItems(item)"
                  :key="`${fileItem.pk || fileItem.name || fileItem.file_name}-${fileIndex}`"
                  :closable="isLocalBatteryFile(fileItem)"
                  density="compact"
                  size="small"
                  @click:close="removeBatteryFile(item, fileIndex)"
                >
                  {{ fileItem.name || fileItem.file_name }}
                </v-chip>
              </div>

              <v-btn
                v-if="!hasBatteryFile(item)"
                color="primary"
                density="comfortable"
                prepend-icon="mdi-upload"
                size="x-small"
                variant="tonal"
                @click.stop="triggerBatteryUpload(item)"
              >
                {{ itemDetailLabel('upload') }}
              </v-btn>
            </template>
          </div>
        </template>

        <template #body.append="{ columns }">
          <tr v-if="itemList.length > 0" class="v-data-table__tr">
            <td
              v-for="column in columns"
              :key="column.key"
              class="v-data-table__td v-data-table-column--align-start"
            >
              <template v-if="column.key === 'woi_invoice_no'">
                <span class="font-weight-bold">{{ itemDetailLabel('total') }} :</span>
              </template>

              <template v-else-if="column.key === 'woi_gross_wt'">
                <div class="d-flex align-center ga-0 w-100">
                  <v-text-field
                    class="flex-1-1 input-numeric"
                    density="compact"
                    hide-details
                    :model-value="itemTotals.gross_weight"
                    readonly
                    variant="outlined"
                  />

                  <div>
                    <v-text-field
                      class="flex-1-1 input-numeric"
                      density="compact"
                      hide-details
                      :model-value="totalWeightUnit"
                      readonly
                      variant="underlined"
                      width="50"
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'woi_net_wt'">
                <div class="d-flex align-center ga-0 w-100">
                  <v-text-field
                    class="flex-1-1 input-numeric"
                    density="compact"
                    hide-details
                    :model-value="itemTotals.net_weight"
                    readonly
                    variant="outlined"
                  />

                  <div>
                    <v-text-field
                      density="compact"
                      hide-details
                      :model-value="totalWeightUnit"
                      readonly
                      variant="underlined"
                      width="50px"
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'woi_volume'">
                <div class="d-flex align-center ga-0 w-100">
                  <v-text-field
                    class="flex-1-1 input-numeric"
                    density="compact"
                    hide-details
                    :model-value="itemTotals.volume"
                    readonly
                    variant="outlined"
                  />

                  <div>
                    <v-text-field
                      density="compact"
                      hide-details
                      :model-value="totalVolumeUnit"
                      readonly
                      variant="underlined"
                      width="70px"
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'woi_outer_pack'">
                <div class="d-flex align-center ga-0 w-100">
                  <v-text-field
                    class="flex-1-1 input-numeric"
                    density="compact"
                    hide-details
                    :model-value="itemTotals.package_count"
                    readonly
                    variant="outlined"
                  />

                  <div>
                    <v-text-field
                      density="compact"
                      hide-details
                      :model-value="totalPackageType"
                      readonly
                      variant="underlined"
                      width="78px"
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'woi_pieces'">
                <v-text-field
                  class="input-numeric"
                  density="compact"
                  hide-details
                  :model-value="itemTotals.pieces"
                  readonly
                  variant="outlined"
                />
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-form>

    <input
      ref="batteryFileInput"
      accept="*/*"
      class="d-none"
      type="file"
      @change="onBatteryFilesSelected"
    >

    <WarehouseOrderImportDialog
      v-model="importDialogOpen"
      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      :loading="importLoading"
      @upload="onOrderLineImportUpload"
    />
  </div>
</template>

<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs, watch } from 'vue'
  import { getWhsMarketPlantOptions } from '@/api/whs-market'
  import {
    downloadWhsOrderLineTemplate,
    parseEbookingWhsOrderItemsExcel,
  } from '@/api/whs-order'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import WarehouseOrderImportDialog from '@/components/warehouse/WarehouseOrderImportDialog.vue'
  import { hasWhsOrderItemBatteryFile, mapWhsOrderItemListFromRecognize } from '@/composables/mapWhsOrderDetail'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import { useAppStore } from '@/stores/app'
  import {
    formatWarehouseMeasureNumber,
    WAREHOUSE_MEASURE_DECIMALS,
  } from '@/utils/formatWarehouseMeasureNumber'

  defineOptions({
    name: 'WarehouseItemDetail',
  })

  const appStore = useAppStore()
  const { itemHeader, itemDetailLabel, validation, requiredRule, import: importI18n } =
    useWarehouseOrderPageI18n()

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const props = defineProps({
    readonly: {
      type: Boolean,
      default: false,
    },
  })
  const { readonly } = toRefs(props)

  const emit = defineEmits(['register-form-refs'])

  const setRef = el => {
    emit('register-form-refs', el)
  }

  const itemList = computed(() => inputData.value?.item_list ?? [])

  const importDialogOpen = ref(false)
  const importLoading = ref(false)
  const downloadLoading = ref(false)

  const selectedMarketGroup = computed(() =>
    String(inputData.value?.wso_market || inputData.value?.market?.market || '').trim(),
  )

  const selectedPlantId = computed(() =>
    String(inputData.value?.wso_plant_id || inputData.value?.market?.plant_id || '').trim(),
  )

  const selectedMarketPk = computed(() =>
    String(inputData.value?.wso_market_pk || inputData.value?.market?.pk || '').trim(),
  )

  const resolveOrderLineUploadParams = () => {
    const form = inputData.value ?? {}
    const whs_market = String(form.wso_market || form.market?.market || '').trim()
    const plantId = String(form.wso_plant_id || form.market?.plant_id || '').trim()
    const whs_market_pk = String(form.wso_market_pk || form.market?.pk || '').trim()
    if (!whs_market) {
      return { error: validation('marketRequired') }
    }
    if (!plantId) {
      return { error: validation('plantIdRequired') }
    }
    if (!whs_market_pk) {
      return { error: validation('plantIdSelectFromList') }
    }
    const params = { whs_market_pk, whs_market }
    const orderPk = String(inputData.value?.pk ?? '').trim()
    if (orderPk) {
      params.ebooking_whs_order_pk = orderPk
    }
    return { params }
  }

  const openOrderLineImport = () => {
    const { error } = resolveOrderLineUploadParams()
    if (error) {
      appStore.openMessage({
        content: error,
        color: 'warning',
      })
      return
    }
    importDialogOpen.value = true
  }

  const downloadOrderLineTemplate = async () => {
    downloadLoading.value = true
    try {
      appStore.openGlobalLoadingWithIcon(
        itemDetailLabel('downloadLoading'),
        'mdi-cloud-download',
        'info',
      )
      const blob = await downloadWhsOrderLineTemplate()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Order_Line_Template.xlsx'
      document.body.append(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      appStore.openMessage({ content: itemDetailLabel('downloadSuccess'), color: 'success' })
    } catch (error) {
      console.error(error)
      appStore.openMessage({ content: itemDetailLabel('downloadFailed'), color: 'error' })
    } finally {
      downloadLoading.value = false
      appStore.closeGlobalLoading()
    }
  }

  const onOrderLineImportUpload = async ({ files }) => {
    if (!files?.length) {
      appStore.openMessage({
        content: importI18n('noFile'),
        color: 'warning',
      })
      return
    }

    const { error, params } = resolveOrderLineUploadParams()
    if (error) {
      appStore.openMessage({
        content: error,
        color: 'warning',
      })
      return
    }

    importLoading.value = true
    try {
      appStore.openGlobalLoadingWithIcon(importI18n('uploading'), '$upload', 'info')
      const formData = new FormData()
      formData.append('file', files[0])
      const { success, data, msg, errCode } = await parseEbookingWhsOrderItemsExcel(formData, params)
      if (!success || !data || typeof data !== 'object') {
        const apiMsg = String(msg ?? '').trim()
        if (apiMsg) {
          if (errCode !== -1) {
            appStore.openMessage({ content: apiMsg, color: 'error' })
          }
          return
        }
        throw new Error(importI18n('missingData'))
      }

      const mappedItems = mapWhsOrderItemListFromRecognize(data)
      if (!Array.isArray(mappedItems) || mappedItems.length === 0) {
        throw new Error(itemDetailLabel('uploadEmptyLines'))
      }

      inputData.value.item_list = mappedItems
      inputData.value.pac_list = mappedItems
      importDialogOpen.value = false
      appStore.openMessage({
        content: itemDetailLabel('uploadSuccess'),
        color: 'success',
      })
    } catch (error) {
      console.error(error)
      appStore.openMessage({
        content: error.message || importI18n('failed'),
        color: 'error',
      })
    } finally {
      importLoading.value = false
      appStore.closeGlobalLoading()
    }
  }

  const measureRequiredRule = fieldLabel => value =>
    (value != null && value !== '') || validation('required', fieldLabel)

  const lineTextRules = computed(() => ({
    woi_market: [requiredRule(itemHeader('market'))],
    woi_invoice_no: [requiredRule(itemHeader('invoiceNo'))],
    woi_packlist_no: [requiredRule(itemHeader('packingListNo'))],
    woi_desc: [requiredRule(itemHeader('description'))],
    woi_item: [requiredRule(itemHeader('itemCode'))],
  }))

  const lineMeasureRules = computed(() => ({
    woi_gross_wt: [measureRequiredRule(itemHeader('grossWeight'))],
    woi_net_wt: [measureRequiredRule(itemHeader('netWeight'))],
    woi_volume: [measureRequiredRule(itemHeader('volume'))],
    woi_outer_pack: [measureRequiredRule(itemHeader('noOfPackage'))],
    woi_pieces: [measureRequiredRule(itemHeader('pieces'))],
  }))

  const batteryFileInput = ref(null)
  const batteryUploadTarget = ref(null)

  const batteryFileItems = item => {
    if (Array.isArray(item?.battery_files) && item.battery_files.length > 0) {
      return item.battery_files
    }
    if (Array.isArray(item?.file_list) && item.file_list.length > 0) {
      return item.file_list.map(file => ({
        pk: file?.pk,
        name: file?.file_name ?? file?.name ?? '',
        file_name: file?.file_name ?? file?.name ?? '',
      }))
    }
    return []
  }

  const hasBatteryFile = item => hasWhsOrderItemBatteryFile(item)

  /** 仅本地新上传的 File 可删；详情 item_list/file_list 回显不可删 */
  const isLocalBatteryFile = fileItem => fileItem?.file instanceof File

  const triggerBatteryUpload = item => {
    if (hasBatteryFile(item)) {
      return
    }
    batteryUploadTarget.value = item
    batteryFileInput.value?.click()
  }

  const onBatteryFilesSelected = event => {
    const files = Array.from(event?.target?.files ?? [])
    const row = batteryUploadTarget.value
    const file = files[0]
    if (row && file) {
      // 仅支持 1 个文件
      row.battery_files = [{ name: file.name, file }]
      row.file_list = []
    }
    if (event?.target) {
      event.target.value = ''
    }
    batteryUploadTarget.value = null
  }

  const removeBatteryFile = (item, index) => {
    const files = batteryFileItems(item)
    const target = files[index]
    if (!isLocalBatteryFile(target)) {
      return
    }
    if (Array.isArray(item?.battery_files) && item.battery_files.length > 0) {
      item.battery_files.splice(index, 1)
    }
    if (!hasBatteryFile(item)) {
      item.battery_files = []
    }
  }

  const orderLineMarketItems = ref([])

  const syncOrderLineMarketsWithGroup = allowedMarkets => {
    const rows = itemList.value
    if (rows.length === 0) {
      return
    }
    const allowed = new Set((allowedMarkets ?? []).map(m => String(m ?? '').trim()).filter(Boolean))
    for (const row of rows) {
      const current = String(row?.woi_market ?? '').trim()
      if (!current || allowed.has(current)) {
        continue
      }
      row.woi_market = ''
    }
  }

  const loadOrderLineMarketItems = async marketGroup => {
    const name = String(marketGroup ?? '').trim()
    if (!name) {
      orderLineMarketItems.value = []
      syncOrderLineMarketsWithGroup([])
      return
    }
    try {
      const { data } = await getWhsMarketPlantOptions({ query: name })
      const list = Array.isArray(data) ? data : []
      const group =
        list.find(item => String(item?.market_group ?? '').trim() === name) ??
        (list.length === 1 ? list[0] : null)
      const markets = Array.isArray(group?.market_list) ? group.market_list : []
      const seen = new Set()
      const items = []
      for (const market of markets) {
        const value = String(market ?? '').trim()
        if (!value || seen.has(value)) {
          continue
        }
        seen.add(value)
        items.push(value)
      }
      orderLineMarketItems.value = items
      syncOrderLineMarketsWithGroup(items)
    } catch (error) {
      console.error('loadOrderLineMarketItems failed:', error)
      orderLineMarketItems.value = []
    }
  }

  watch(
    selectedMarketGroup,
    marketGroup => {
      loadOrderLineMarketItems(marketGroup)
    },
    { immediate: true },
  )

  const toDecimal = value => {
    const text = String(value ?? '')
      .trim()
      .replace(/,/g, '')
    if (text === '') {
      return new Decimal(0)
    }
    try {
      return new Decimal(text)
    } catch {
      return new Decimal(0)
    }
  }

  const itemTotals = computed(() => {
    const rows = itemList.value
    const sum = key =>
      rows.reduce((total, row) => total.plus(toDecimal(row?.[key])), new Decimal(0))

    return {
      gross_weight: formatWarehouseMeasureNumber(sum('woi_gross_wt')),
      net_weight: formatWarehouseMeasureNumber(sum('woi_net_wt')),
      volume: formatWarehouseMeasureNumber(sum('woi_volume')),
      package_count: formatWarehouseMeasureNumber(sum('woi_outer_pack'), 0),
      pieces: formatWarehouseMeasureNumber(sum('woi_pieces')),
    }
  })

  const totalWeightUnit = computed(
    () => String(itemList.value[0]?.woi_gw_unit ?? 'KG').trim() || 'KG',
  )

  const totalVolumeUnit = computed(
    () => String(itemList.value[0]?.woi_vol_unit ?? 'CBM').trim() || 'CBM',
  )

  const totalPackageType = computed(() => {
    const fromRow = itemList.value.find(row =>
      String(row?.woi_outpack_unit ?? '').trim(),
    )?.woi_outpack_unit
    return String(fromRow ?? inputData.value?.wso_pack_type ?? '').trim()
  })

  watch(
    () => String(itemList.value[0]?.woi_outpack_unit ?? '').trim(),
    packType => {
      if (!packType) {
        return
      }
      for (const row of itemList.value.slice(1)) {
        if (!String(row?.woi_outpack_unit ?? '').trim()) {
          row.woi_outpack_unit = packType
        }
      }
    },
    { immediate: true },
  )

  const defaultRow = () => {
    const templateRow = itemList.value[0]
    return {
      id: 0,
      pk: '',
      rowKey: `new-${Date.now()}`,
      woi_market: '',
      woi_plant_id:
        inputData.value?.market?.plant_id ?? inputData.value?.wso_plant_id ?? '',
      woi_invoice_no: '',
      woi_packlist_no: '',
      woi_desc: '',
      woi_item: '',
      woi_hs_code: '',
      woi_gross_wt: null,
      woi_gw_unit: templateRow?.woi_gw_unit ?? 'KG',
      woi_net_wt: null,
      woi_nw_unit: templateRow?.woi_nw_unit ?? templateRow?.woi_gw_unit ?? 'KG',
      woi_volume: null,
      woi_vol_unit: templateRow?.woi_vol_unit ?? 'CBM',
      woi_outer_pack: null,
      woi_outpack_unit: templateRow?.woi_outpack_unit ?? inputData.value?.wso_pack_type ?? 'CTN',
      woi_pieces: null,
      woi_is_palletization: 0,
      woi_is_battery_included: 0,
      battery_files: [],
    }
  }

  const addNewContainer = () => {
    if (!Array.isArray(inputData.value.item_list)) {
      inputData.value.item_list = []
    }
    inputData.value.item_list.push(defaultRow())
  }

  const removeNewContainer = index => {
    inputData.value.item_list.splice(index, 1)
  }

  const tblContainerHeaders = computed(() => [
    { title: '', key: 'actions', width: '50px', align: 'center' },
    { title: itemHeader('market'), key: 'woi_market', minWidth: '140px' },
    { title: itemHeader('invoiceNo'), key: 'woi_invoice_no', minWidth: '150px' },
    { title: itemHeader('packingListNo'), key: 'woi_packlist_no', minWidth: '150px' },
    { title: itemHeader('description'), key: 'woi_desc', minWidth: '200px' },
    { title: itemHeader('itemCode'), key: 'woi_item', minWidth: '120px' },
    { title: itemHeader('hsCode'), key: 'woi_hs_code', minWidth: '120px' },
    { title: itemHeader('grossWeight'), key: 'woi_gross_wt', minWidth: '180px' },
    { title: itemHeader('netWeight'), key: 'woi_net_wt', minWidth: '180px' },
    { title: itemHeader('volume'), key: 'woi_volume', minWidth: '180px' },
    { title: itemHeader('noOfPackage'), key: 'woi_outer_pack', minWidth: '180px' },
    { title: itemHeader('pieces'), key: 'woi_pieces', minWidth: '100px' },
    {
      title: itemHeader('palletization'),
      key: 'woi_is_palletization',
      minWidth: '100px',
      align: 'center',
    },
    {
      title: itemHeader('batteryIncluded'),
      key: 'woi_is_battery_included',
      minWidth: '160px',
      align: 'center',
    },
  ])
</script>
