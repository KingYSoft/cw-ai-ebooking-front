<template>
  <v-sheet color="transparent">
    <v-card-text>
      <v-btn color="primary" size="small" variant="flat" @click="openWarehouseDialog">
        {{ userEdit('warehouse.selectWarehouses') }}
      </v-btn>
    </v-card-text>

    <v-data-table
      class="table-filter"
      :disable-sort="false"
      :fixed-header="false"
      :headers="selectedWarehouseHeaders"
      :height="maxHeight"
      item-value="pk"
      :items="selectedWarehouses"
      :show-select="false"
      striped="even"
    >
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="mScope">
            <v-btn
              v-bind="mScope.props"
              density="comfortable"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list activatable density="compact">
            <v-list-item prepend-icon="mdi-delete" @click.prevent="removeSelectedWarehouse(item)">
              <v-list-item-title>{{ common('delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template #item.is_active="{ item }">
        <v-chip
          :color="item.is_active === 1 ? 'success' : 'error'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.is_active === 1 ? common('yes') : common('no') }}
        </v-chip>
      </template>

      <template #bottom />
    </v-data-table>

    <v-dialog v-model="warehouseDialogVisible" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          {{ userEdit('warehouse.selectWarehouses') }}
          <v-spacer />

          <v-chip color="primary" size="small" variant="tonal">
            {{ common('selected', warehouseDialogSelected.length) }}
          </v-chip>
        </v-card-title>

        <v-card-text class="py-2">
          <v-form class="ref-form-pre">
            <v-row dense>
              <v-col :cols="rescols('c12m4')">
                <v-text-field
                  v-model="warehouseQuerySearch"
                  clearable
                  density="compact"
                  hide-details
                  :placeholder="common('queryKeywordsPlaceholder')"
                  single-line
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end">{{ userEdit('warehouse.queryWarehouse') }}</div>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-0">
          <v-data-table
            v-model="inputData.warehouse_list"
            class="table-filter"
            :disable-sort="false"
            :fixed-header="false"
            :headers="warehouseHeaders"
            :height="420"
            hover
            item-value="pk"
            :items="warehouseList"
            :loading="loading"
            :search="warehouseQuerySearch"
            :show-select="true"
            striped="even"
          >
            <template #item.is_active="{ item }">
              <v-chip
                :color="item.is_active === 1 ? 'success' : 'error'"
                density="comfortable"
                size="small"
                variant="tonal"
              >
                {{ item.is_active === 1 ? common('yes') : common('no') }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="warehouseDialogVisible = false">{{ common('cancel') }}</v-btn>

          <v-btn color="primary" variant="tonal" @click="warehouseDialogVisible = false">
            {{ common('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'
  import { queryWarehouseList } from '@/api/user'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'UserWarehouse' })

  const { common, userEdit } = useSystemPageI18n()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
  })
  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const display = useDisplay()
  const { rescols } = useLayoutCols()

  const maxHeight = computed(() => display.height.value - 320)
  const warehouseHeaders = computed(() => [
    { title: userEdit('warehouse.headers.code'), key: 'code', align: 'start', minWidth: '160px' },
    { title: userEdit('warehouse.headers.name'), key: 'name', align: 'start', minWidth: '220px' },
    { title: userEdit('warehouse.headers.active'), key: 'is_active', align: 'start', minWidth: '120px' },
  ])
  const selectedWarehouseHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', width: '60px', sortable: false },
    ...warehouseHeaders.value,
  ])
  const warehouseList = ref([])
  const loading = ref(false)
  const warehouseDialogVisible = ref(false)
  const warehouseQuerySearch = ref('')

  const ensureWarehouseList = () => {
    if (!Array.isArray(inputData.value.warehouse_list)) {
      inputData.value.warehouse_list = []
    }
  }

  const warehouseDialogSelected = computed(() => {
    ensureWarehouseList()
    return inputData.value.warehouse_list
  })

  const selectedWarehouses = computed(() => {
    ensureWarehouseList()
    const selected = new Set(inputData.value.warehouse_list)
    return warehouseList.value.filter(warehouse => selected.has(warehouse.pk))
  })

  const openWarehouseDialog = () => {
    ensureWarehouseList()
    warehouseQuerySearch.value = ''
    warehouseDialogVisible.value = true
  }

  const removeSelectedWarehouse = item => {
    ensureWarehouseList()
    inputData.value.warehouse_list = inputData.value.warehouse_list.filter(pk => pk !== item.pk)
  }

  const loadBaseOptions = async () => {
    loading.value = true
    try {
      const { data } = await queryWarehouseList()
      warehouseList.value = Array.isArray(data) ? data : []
    } finally {
      loading.value = false
    }
  }

  ensureWarehouseList()
  watch(
    () => props.activedTab,
    val => {
      if (val === 2) {
        loadBaseOptions()
      }
    },
  )
</script>
