<template>
  <v-card-text class="py-2">
    <v-btn color="primary" prepend-icon="mdi-upload" size="small" variant="flat"> Upload </v-btn>

    <v-text-field
      id="2@container_rows_required"
      class="d-none"
      density="compact"
      hide-details
      :model-value="inputData.item_list?.length ?? 0"
      :rules="[v => Number(v || 0) > 0 || 'Requires at least one line.']"
    />
  </v-card-text>

  <v-data-table
    class="table-filter"
    disable-sort
    :headers="tblContainerHeaders"
    hide-default-footer
    item-value="rowKey"
    :items="inputData.item_list"
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
    <template #item.woi_market="{ item }">
      <v-autocomplete
        v-model="item.woi_market"
        auto-select-first
        autocomplete="off"
        clearable
        :custom-filter="filterMarketOption"
        density="compact"
        hide-details
        item-title="market"
        item-value="market"
        :items="marketOptions"
        :menu-props="{ maxWidth: '320px' }"
        variant="outlined"
        @update:model-value="value => onMarketChange(item, value)"
      >
        <template #item="{ props: itemProps, item: option }">
          <v-list-item
            v-bind="itemProps"
            :subtitle="[option.raw.plant_id, option.raw.destination].filter(Boolean).join(' / ')"
            :title="option.raw.market"
          />
        </template>
      </v-autocomplete>
    </template>

    <!-- Plant ID -->
    <template #item.woi_plant_id="{ item }">
      <v-text-field
        v-model="item.woi_plant_id"
        density="compact"
        disabled
        hide-details
        variant="outlined"
      />
    </template>

    <!-- Packing List No. -->
    <template #item.woi_packlist_no="{ item }">
      <v-text-field
        v-model="item.woi_packlist_no"
        density="compact"
        hide-details
        variant="outlined"
      />
    </template>

    <!-- Description -->
    <template #item.woi_desc="{ item }">
      <v-text-field v-model="item.woi_desc" density="compact" hide-details variant="outlined" />
    </template>

    <!-- Item Code -->
    <template #item.woi_item="{ item }">
      <v-text-field v-model="item.woi_item" density="compact" hide-details variant="outlined" />
    </template>

    <!-- Gross Weight-->
    <template #item.woi_gross_wt="{ item }">
      <div class="d-flex align-center ga-0 w-100">
        <v-number-input
          v-model="item.woi_gross_wt"
          class="flex-1-1"
          color="primary"
          control-variant="hidden"
          density="compact"
          hide-details
          :precision="5"
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

    <!-- Net Weight -->
    <template #item.woi_net_wt="{ item }">
      <div class="d-flex align-center ga-0 w-100">
        <v-number-input
          v-model="item.woi_net_wt"
          class="flex-1-1"
          control-variant="hidden"
          density="compact"
          hide-details
          :precision="5"
          variant="outlined"
        />

        <div>
          <v-select
            v-model="item.woi_nw_unit"
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

    <!-- Volume (保留原单位选择逻辑) -->
    <template #item.woi_volume="{ item }">
      <div class="d-flex align-center ga-0 w-100">
        <v-number-input
          v-model="item.woi_volume"
          class="flex-1-1"
          control-variant="hidden"
          density="compact"
          hide-details
          :precision="5"
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
            width="50px"
          />
        </div>
      </div>
    </template>

    <!-- No. of Package -->
    <template #item.woi_outer_pack="{ item }">
      <div class="d-flex align-center ga-0 w-100">
        <v-number-input
          v-model="item.woi_outer_pack"
          class="flex-1-1"
          control-variant="hidden"
          density="compact"
          hide-details
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

    <!-- Pieces -->
    <template #item.woi_pieces="{ item }">
      <v-number-input
        v-model="item.woi_pieces"
        control-variant="hidden"
        density="compact"
        hide-details
        variant="outlined"
      />
    </template>

    <!-- Palletization? -->
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

    <!-- Battery included? -->
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
  </v-data-table>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import { useLocale } from 'vuetify'
  import { getWhsMarketOptions } from '@/api/whs-market'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'WarehouseItemDetail',
  })

  const appStore = useAppStore()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
    },
  })
  const {} = toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const emit = defineEmits([])

  const addNewContainer = () => {
    if (!inputData.value.item_list) {
      inputData.value.item_list = []
    }

    inputData.value.item_list.push({
      id: 0,
      pk: '',
      woi_market: null,
      woi_plant_id: '',
      woi_packlist_no: '',
      woi_desc: '',
      woi_item: '',
      woi_gross_wt: null,
      woi_gw_unit: 'KG',
      woi_net_wt: null,
      woi_nw_unit: 'KG',
      woi_volume: null,
      woi_vol_unit: 'M3',
      woi_outer_pack: null,
      woi_outpack_unit: 'PKG',
      woi_pieces: null,
      woi_is_palletization: 0,
      woi_is_battery_included: 0,
    })
  }

  const removeNewContainer = index => {
    inputData.value.item_list.splice(index, 1)
  }

  const marketOptions = ref([])

  const filterMarketOption = (_value, query, item) => {
    const q = String(query ?? '')
      .trim()
      .toLowerCase()
    if (!q) {
      return true
    }
    const raw = item?.raw ?? {}
    return [
      raw.market,
      raw.plant_id,
      raw.shipping_mode,
      raw.port_code,
      raw.port_of_discharge,
      raw.destination,
    ].some(field =>
      String(field ?? '')
        .toLowerCase()
        .includes(q),
    )
  }

  const onMarketChange = (row, market) => {
    const value = String(market ?? '').trim()
    row.market = value
    if (!value) {
      row.woi_plant_id = ''
      return
    }
    const matched = marketOptions.value.find(opt => String(opt.market ?? '').trim() === value)
    row.woi_plant_id = String(matched?.plant_id ?? '').trim()
  }

  const loadMarketOptions = async () => {
    try {
      const { data } = await getWhsMarketOptions()
      marketOptions.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('loadMarketOptions failed:', error)
      marketOptions.value = []
    }
  }
  loadMarketOptions()

  const tblContainerHeaders = [
    { title: '', key: 'actions', width: '50px', align: 'center' },
    { title: 'Market', key: 'woi_market', minWidth: '140px' },
    { title: 'Plant ID', key: 'woi_plant_id', minWidth: '120px' },
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
