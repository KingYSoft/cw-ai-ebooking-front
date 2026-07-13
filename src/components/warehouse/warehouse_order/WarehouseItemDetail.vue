<template>
  <v-card-text class="py-2">
    <v-btn color="primary" prepend-icon="mdi-upload" size="small" variant="flat"> Upload </v-btn>

    <v-text-field
      id="2@container_rows_required"
      class="d-none"
      density="compact"
      hide-details
      :model-value="itemList.length"
      :rules="[v => Number(v || 0) > 0 || 'Requires at least one line.']"
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

    <template #item.woi_invoice_no="{ item }">
      <v-text-field
        v-model="item.woi_invoice_no"
        density="compact"
        hide-details
        variant="outlined"
      />
    </template>

    <template #item.woi_packlist_no="{ item }">
      <v-text-field
        v-model="item.woi_packlist_no"
        density="compact"
        hide-details
        variant="outlined"
      />
    </template>

    <template #item.woi_desc="{ item }">
      <v-text-field v-model="item.woi_desc" density="compact" hide-details variant="outlined" />
    </template>

    <template #item.woi_item="{ item }">
      <v-text-field v-model="item.woi_item" density="compact" hide-details variant="outlined" />
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
          variant="outlined"
        />

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
          variant="outlined"
        />

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
          variant="outlined"
        />

        <v-select
          v-model="item.woi_vol_unit"
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
          variant="outlined"
        />

        <FRemoteTableMenu
          v-model="item.woi_outpack_unit"
          display-key="code"
          :fetch-method="fetchPackageTypes"
          :headers="packageTypeTableHeaders"
          item-value="code"
          :text-field-props="{
            variant: 'underlined',
            width: '70',
          }"
          virtual
          @row-select="row => assignPackageTypeFromRow(row, item, 'woi_outpack_unit')"
        />
      </div>
    </template>

    <template #item.woi_pieces="{ item }">
      <v-number-input
        v-model="item.woi_pieces"
        control-variant="hidden"
        density="compact"
        hide-details
        :precision="WAREHOUSE_MEASURE_DECIMALS"
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
      <v-checkbox-btn
        v-model="item.woi_is_battery_included"
        color="primary"
        density="compact"
        :false-value="0"
        hide-details
        :true-value="1"
      />
    </template>

    <template #body.append="{ columns }">
      <tr v-if="itemList.length > 0">
        <td v-for="column in columns" :key="column.key">
          <v-row class="ref-form-pre" dense>
            <template v-if="column.key === 'woi_invoice_no'">
              <span class="font-weight-bold">Total :</span>
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

                <v-text-field
                  density="compact"
                  hide-details
                  :model-value="totalWeightUnit"
                  readonly
                  variant="underlined"
                  width="50px"
                />
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

                <v-text-field
                  density="compact"
                  hide-details
                  :model-value="totalWeightUnit"
                  readonly
                  variant="underlined"
                  width="50px"
                />
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

                <v-text-field
                  density="compact"
                  hide-details
                  :model-value="totalVolumeUnit"
                  readonly
                  variant="underlined"
                  width="50px"
                />
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

                <v-text-field
                  density="compact"
                  hide-details
                  :model-value="totalPackageType"
                  readonly
                  variant="underlined"
                  width="70px"
                />
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
          </v-row>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
  import Decimal from 'decimal.js'
  import { computed, watch } from 'vue'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useAppStore } from '@/stores/app'
  import {
    formatWarehouseMeasureNumber,
    WAREHOUSE_MEASURE_DECIMALS,
  } from '@/utils/formatWarehouseMeasureNumber'

  defineOptions({
    name: 'WarehouseItemDetail',
  })

  const appStore = useAppStore()

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const itemList = computed(() => inputData.value?.item_list ?? [])

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
    const sum = key => rows.reduce((total, row) => total.plus(toDecimal(row?.[key])), new Decimal(0))

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
    const fromRow = itemList.value.find(row => String(row?.woi_outpack_unit ?? '').trim())
      ?.woi_outpack_unit
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
      woi_invoice_no: '',
      woi_packlist_no: '',
      woi_desc: '',
      woi_item: '',
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

  const tblContainerHeaders = [
    { title: '', key: 'actions', width: '50px', align: 'center' },
    { title: 'Invoice No.', key: 'woi_invoice_no', minWidth: '150px' },
    { title: 'Packing List No.', key: 'woi_packlist_no', minWidth: '150px' },
    { title: 'Description', key: 'woi_desc', minWidth: '200px' },
    { title: 'Item Code', key: 'woi_item', minWidth: '120px' },
    { title: 'Gross Weight', key: 'woi_gross_wt', minWidth: '180px' },
    { title: 'Net Weight', key: 'woi_net_wt', minWidth: '180px' },
    { title: 'Volume', key: 'woi_volume', minWidth: '180px' },
    { title: 'No. of Package', key: 'woi_outer_pack', minWidth: '180px' },
    { title: 'Pieces', key: 'woi_pieces', minWidth: '100px' },
    { title: 'Palletization?', key: 'woi_is_palletization', minWidth: '100px', align: 'center' },
    {
      title: 'Battery included?',
      key: 'woi_is_battery_included',
      minWidth: '150px',
      align: 'center',
    },
  ]
</script>
