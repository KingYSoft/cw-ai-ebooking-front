<template>
  <v-card-text class="py-2">
    <v-row dense>
      <v-col
        v-for="section in relationSections"
        :key="section.key"
        class="min-width-0"
        :cols="rescols('c12l6')"
      >
        <v-btn class="mb-2" color="primary" size="small" variant="flat">
          {{ section.title }}
        </v-btn>

        <v-data-table
          class="table-filter"
          disable-sort
          :headers="section.headers"
          hide-default-footer
          item-value="rowKey"
          :items="section.items"
          :items-per-page="-1"
          striped="even"
        >
          <template #item.sys_number="{ item }">
            <span>{{ displayValue(item.sys_number) }}</span>
          </template>

          <template #item.order_no="{ item }">
            {{ displayValue(item.order_no) }}
          </template>

          <template #item.status="{ item }">
            {{ displayValue(item.status) }}
          </template>

          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.truck_number="{ item }">
            {{ displayValue(item.truck_number) }}
          </template>

          <template #item.container_number="{ item }">
            {{ displayValue(item.container_number) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup>
  import { computed } from 'vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import {
    WHS_ORDER_RELATION_ORDER_COLUMNS,
    WHS_ORDER_RELATION_OUTBOUND_COLUMNS,
  } from '@/constants/warehouseOrderRelationColumns'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'WarehouseOrderRelationTables' })

  const props = defineProps({
    relation: {
      type: Object,
      default: () => ({}),
    },
  })

  const appStore = useAppStore()
  const { rescols } = useLayoutCols()
  const { relation: relationLabel } = useWarehouseOrderPageI18n()

  const INBOUND_HEADER_KEYS = {
    sys_number: 'inboundNo',
    order_no: 'goodsReceiptNumber',
    status: 'status',
    date: 'receiveDate',
    truck_number: 'truckNo',
    container_number: 'containerNumber',
  }

  const OUTBOUND_HEADER_KEYS = {
    sys_number: 'outboundNo',
    order_no: 'goodsOutboundNumber',
    status: 'status',
    date: 'outboundDate',
    truck_number: 'truckNo',
    container_number: 'containerNumber',
  }

  const mapRelationHeaders = (columns, headerKeys) =>
    columns.map(col => ({
      ...col,
      title: relationLabel(headerKeys[col.key]),
    }))

  const mapRelationRows = rows =>
    (Array.isArray(rows) ? rows : []).map((row, index) => ({
      ...row,
      rowKey: row.pk || row.id || `relation-row-${index}`,
    }))

  const inboundOrders = computed(() => mapRelationRows(props.relation?.inbound_orders))
  const outboundOrders = computed(() => mapRelationRows(props.relation?.outbound_orders))

  const relationSections = computed(() => [
    {
      key: 'inbound',
      title: relationLabel('inbound'),
      headers: mapRelationHeaders(WHS_ORDER_RELATION_ORDER_COLUMNS, INBOUND_HEADER_KEYS),
      items: inboundOrders.value,
    },
    {
      key: 'outbound',
      title: relationLabel('outbound'),
      headers: mapRelationHeaders(WHS_ORDER_RELATION_OUTBOUND_COLUMNS, OUTBOUND_HEADER_KEYS),
      items: outboundOrders.value,
    },
  ])

  const displayValue = value => {
    const text = String(value ?? '').trim()
    return text || '-'
  }

  const formatDate = value => {
    if (value == null || value === '') {
      return '-'
    }
    const text = String(value).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
      return text.slice(0, 10)
    }
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
      return text
    }
    return appStore.utils.formatDate(date)
  }
</script>

<style scoped>
  .min-width-0 {
    min-width: 0;
  }
</style>
