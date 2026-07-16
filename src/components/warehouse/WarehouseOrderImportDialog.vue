<template>
  <ShipmentUploadDialog
    v-model="open"
    :accept="accept"
    :label="importI18n('selectFile')"
    :loading="loading"
    :title="importI18n('title')"
    @upload="payload => emit('upload', payload)"
  />
</template>

<script setup>
  import ShipmentUploadDialog from '@/components/business/shipment/ShipmentUploadDialog.vue'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'

  defineOptions({ name: 'WarehouseOrderImportDialog' })

  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['upload'])

  const open = defineModel({ type: Boolean, default: false })
  const { import: importI18n } = useWarehouseOrderPageI18n()
  const accept =
    '.pdf,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
</script>
