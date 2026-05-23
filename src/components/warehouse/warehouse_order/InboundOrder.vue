<template>
  <v-data-table
    class="table-filter"
    disable-sort
    :headers="headers"
    hide-default-footer
    item-value="rowKey"
    :items="inboundList"
    :items-per-page="-1"
    striped="even"
  >
    <template #header.actions>
      <v-btn
        color="primary"
        density="comfortable"
        icon="mdi-plus-circle"
        size="small"
        variant="text"
        @click.stop="addRow"
      />
    </template>

    <template #item.actions="{ index }">
      <v-btn
        color="red"
        density="comfortable"
        icon="mdi-minus-circle"
        size="small"
        variant="text"
        @click.stop="removeRow(index)"
      />
    </template>

    <template #item.date_of_receipt="{ item }">
      <FDatePicker
        v-model:date-value="item.date_of_receipt"
        max="2099-12-31"
        min="2000-01-01"
      />
    </template>

    <template #item.inbound_ref_no="{ item }">
      <v-text-field v-model="item.inbound_ref_no" density="compact" hide-details variant="outlined" />
    </template>

    <template #item.truck_no="{ item }">
      <v-text-field v-model="item.truck_no" density="compact" hide-details variant="outlined" />
    </template>

    <template #item.market="{ item }">
      <v-select
        v-model="item.market"
        density="compact"
        hide-details
        :items="['Market A', 'Market B']"
        variant="outlined"
      />
    </template>

    <template #item.declaration_no="{ item }">
      <v-text-field v-model="item.declaration_no" density="compact" hide-details variant="outlined" />
    </template>

    <template #item.gross_weight="{ item }">
      <v-number-input
        v-model="item.gross_weight"
        control-variant="hidden"
        density="compact"
        hide-details
        :precision="3"
        variant="outlined"
      />
    </template>

    <template #item.cbm="{ item }">
      <v-number-input
        v-model="item.cbm"
        control-variant="hidden"
        density="compact"
        hide-details
        :precision="3"
        variant="outlined"
      />
    </template>

    <template #item.qty="{ item }">
      <v-number-input
        v-model="item.qty"
        control-variant="hidden"
        density="compact"
        hide-details
        :min-fraction-digits="0"
        :precision="0"
        variant="outlined"
      />
    </template>

    <template #item.remarks="{ item }">
      <v-text-field v-model="item.remarks" density="compact" hide-details variant="outlined" />
    </template>
  </v-data-table>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import FDatePicker from '@/components/FDatePicker.vue'

  defineOptions({ name: 'InboundOrder' })

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const headers = [
    { title: '', key: 'actions', width: '40px', align: 'center', sortable: false },
    { title: 'Date of Receipt', key: 'date_of_receipt', align: 'start', minWidth: '140px' },
    { title: 'Inbound Ref No.', key: 'inbound_ref_no', align: 'start', minWidth: '140px' },
    { title: 'Truck No.', key: 'truck_no', align: 'start', minWidth: '120px' },
    { title: 'Market', key: 'market', align: 'start', minWidth: '120px' },
    { title: 'Declaration No.', key: 'declaration_no', align: 'start', minWidth: '140px' },
    { title: 'GW', key: 'gross_weight', align: 'start', minWidth: '100px' },
    { title: 'CBM', key: 'cbm', align: 'start', minWidth: '100px' },
    { title: 'Qty', key: 'qty', align: 'start', minWidth: '80px' },
    { title: 'Remarks', key: 'remarks', align: 'start', minWidth: '160px' },
  ]

  watch(
    () => inputData.value,
    val => {
      if (val && !Array.isArray(val.inbound_list)) {
        val.inbound_list = []
      }
    },
    { immediate: true },
  )

  const inboundList = computed(() => inputData.value?.inbound_list ?? [])

  const defaultRow = () => ({
    id: 0,
    rowKey: `inbound-new-${Date.now()}`,
    date_of_receipt: '',
    inbound_ref_no: '',
    truck_no: '',
    market: '',
    declaration_no: '',
    gross_weight: 0,
    cbm: 0,
    qty: 0,
    remarks: '',
  })

  const addRow = () => {
    if (!inputData.value) return
    if (!Array.isArray(inputData.value.inbound_list)) {
      inputData.value.inbound_list = []
    }
    inputData.value.inbound_list.push(defaultRow())
  }

  const removeRow = index => {
    inputData.value?.inbound_list?.splice(index, 1)
  }
</script>
