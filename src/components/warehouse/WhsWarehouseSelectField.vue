<template>
  <v-autocomplete
    v-model="model"
    :clearable="!readonly && !disabled"
    color="primary"
    density="compact"
    :disabled="disabled"
    :hide-details="hideDetails"
    item-title="label"
    :item-value="itemValue"
    :items="warehouseOptionItems"
    :loading="loading"
    :menu-props="{ maxWidth: '360px' }"
    min-width="100%"
    :readonly="readonly"
    :rules="rules"
    variant="outlined"
  >
    <template #prepend>
      <div :class="['text-caption text-end', labelClass]">
        <slot name="label">
          {{ label }}<span v-if="required" class="text-error"> *</span>

          <span v-if="showColon">:</span>
        </slot>
      </div>
    </template>
  </v-autocomplete>
</template>

<script setup>
  import { selectWhsWarehouse } from '@/api/whs-warehouse'

  defineOptions({ name: 'WhsWarehouseSelectField' })

  const model = defineModel({ type: String, default: '' })
  /** 选中仓库时同步 pk（Shipping Order 传 wso_warehouse_pk） */
  const modelPk = defineModel('pk', { type: String, default: '' })

  const props = defineProps({
    label: {
      type: String,
      default: 'Warehouse',
    },
    labelClass: {
      type: String,
      default: 'w-label-110',
    },
    /** 绑定值字段：表单用 warehouse_code；导入等场景用 pk */
    itemValue: {
      type: String,
      default: 'warehouse_code',
    },
    required: {
      type: Boolean,
      default: false,
    },
    showColon: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: [Boolean, String],
      default: 'auto',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  })

  const warehouseOptions = ref([])
  const loading = ref(false)

  const buildLabel = item => {
    const code = String(item?.warehouse_code ?? '').trim()
    const name = String(item?.warehouse_name ?? item?.short_name ?? '').trim()
    if (code && name) return `${code} / ${name}`
    return code || name
  }

  const warehouseOptionItems = computed(() => {
    const valueKey = props.itemValue || 'warehouse_code'
    const items = (Array.isArray(warehouseOptions.value) ? warehouseOptions.value : [])
      .map(item => {
        const warehouse_code = String(item?.warehouse_code ?? '').trim()
        const value = String(item?.[valueKey] ?? '').trim()
        if (!value) return null
        return {
          ...item,
          warehouse_code,
          pk: String(item?.pk ?? '').trim(),
          [valueKey]: value,
          label: buildLabel({ ...item, warehouse_code }) || value,
        }
      })
      .filter(Boolean)

    const current = String(model.value ?? '').trim()
    if (current && !items.some(item => String(item?.[valueKey] ?? '') === current)) {
      items.unshift({
        [valueKey]: current,
        warehouse_code: valueKey === 'warehouse_code' ? current : '',
        pk: valueKey === 'pk' ? current : String(modelPk.value ?? '').trim(),
        label: current,
      })
    }
    return items
  })

  const syncPkFromCode = () => {
    if (props.itemValue !== 'warehouse_code') return
    const code = String(model.value ?? '').trim()
    if (!code) {
      modelPk.value = ''
      return
    }
    const matched = warehouseOptionItems.value.find(item => item.warehouse_code === code)
    const pk = String(matched?.pk ?? '').trim()
    if (pk) {
      modelPk.value = pk
    }
  }

  watch([model, warehouseOptions], () => {
    syncPkFromCode()
  })

  const loadOptions = async () => {
    if (props.readonly) return
    loading.value = true
    try {
      const { success, data } = await selectWhsWarehouse({})
      warehouseOptions.value = success && Array.isArray(data) ? data : []
    } catch (error) {
      console.error('whs-warehouse/select failed:', error)
      warehouseOptions.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadOptions()
  })
</script>
