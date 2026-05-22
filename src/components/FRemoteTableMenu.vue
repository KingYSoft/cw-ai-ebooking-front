<template>
  <v-text-field
    ref="textFieldRef"
    :model-value="inputText"
    v-bind="mergedTextFieldProps"
    @click:clear.stop.prevent="
      () => {
        isClear = true
        clickClear()
      }
    "
    @focus="onFieldFocus"
    @update:model-value="onInputValueUpdate"
  >
    <!-- <template #prepend>
      <slot name="prepend" />
    </template> -->
    <template #append-inner>
      <v-icon class="dropdown-icon" :class="isOpen ? 'open' : ''" icon="$dropdown" />
    </template>
    <!-- 透传所有插槽，包括 item.[列名] 和 header.[列名] 插槽 -->
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot v-if="name !== 'append-inner'" :name="name" v-bind="slotProps" />
    </template>

    <v-menu
      v-model="isOpen"
      activator="parent"
      :capture-focus="false"
      :close-on-content-click="false"
      :open-on-click="false"
      :open-on-focus="false"
      :open-on-hover="false"
      :retain-focus="false"
      :transition="false"
    >
      <v-card :disabled="isLoading" :loading="isLoading" :style="menuContentStyle" width="620">
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <template v-if="virtual">
          <v-data-table-virtual
            class="table-filter"
            v-bind="mergedTableProps"
            fixed-footer
            fixed-header
            :headers="headers"
            height="280"
            hover
            item-height="32"
            :item-value="itemValue"
            :items="items"
            striped="even"
          >
            <template #item="scope">
              <v-data-table-row
                v-bind="scope.props"
                :class="{ 'active-row': isRowActive(scope.item) }"
                @click.prevent.stop="onRowClick($event, scope)"
              />
            </template>

            <template #bottom>
              <v-divider />

              <FDataTableFooter
                v-model:page-obj="pageObj"
                :total-count="totalCount"
                @query-tbl="scheduleQuery"
              >
                <template #footer.prepend>
                  <div class="d-flex flex-1-0 ga-2 pl-2">
                    <v-btn
                      v-if="hasOnNewHandle"
                      color="primary"
                      size="small"
                      variant="flat"
                      @click="emit('on-new-handle')"
                    >
                      New
                    </v-btn>

                    <v-btn color="red" size="small" variant="tonal" @click.stop="isOpen = false">
                      Cancel
                    </v-btn>
                  </div>
                </template>
              </FDataTableFooter>
            </template>
          </v-data-table-virtual>
        </template>

        <template v-else>
          <v-data-table
            class="table-filter"
            v-bind="mergedTableProps"
            fixed-footer
            fixed-header
            :headers="headers"
            height="280"
            hover
            :item-value="itemValue"
            :items="items"
            striped="even"
          >
            <template #item="scope">
              <v-data-table-row
                v-bind="scope.props"
                :class="{ 'active-row': isRowActive(scope.item) }"
                @click.prevent.stop="onRowClick($event, scope)"
              />
            </template>

            <template #footer.prepend>
              <div class="d-flex flex-1-0 ga-2 pl-2">
                <v-btn
                  v-if="hasOnNewHandle"
                  color="primary"
                  size="small"
                  variant="flat"
                  @click="emit('on-new-handle')"
                >
                  New
                </v-btn>

                <v-btn color="red" size="small" variant="tonal" @click.stop="isOpen = false">
                  Cancel
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </v-menu>
  </v-text-field>
</template>

<script setup>
  import { debounceFn } from '@/api/utils'
  /**
   * Simple remote table picker:
   * 1) Focus input -> open menu + query
   * 2) Input change -> debounce query
   * 3) Single-click row -> fill input + close menu
   */
  defineOptions({
    name: 'FRemoteTableMenu',
  })

  const model = defineModel({
    type: String,
    default: () => '',
  })

  const props = defineProps({
    // Required remote query function: fetchMethod(payload) => Promise
    fetchMethod: {
      type: Function,
      default: () => null,
    },
    // v-data-table headers
    headers: {
      type: Array,
      default: () => [],
    },
    // Request field name for input query
    queryKey: {
      type: String,
      default: () => 'query',
    },
    // Extra request params
    queryExtra: {
      type: Object,
      default: () => ({}),
    },
    // Field name to write back into input after row click
    displayKey: {
      type: String,
      default: () => 'name',
    },
    // 绑定列表的 key
    bindKey: {
      type: String,
      default: () => 'code',
    },
    // 绑定列表时，用来判断的值
    bindValue: {
      type: String,
      default: () => '',
    },
    itemValue: {
      type: String,
      default: () => 'id',
    },
    virtual: {
      type: Boolean,
      default: () => false,
    },
    // Pass-through props
    textFieldProps: {
      type: Object,
      default: () => ({}),
    },
    tableProps: {
      type: Object,
      default: () => ({}),
    },
  })

  // Keep emits minimal for easier usage.
  const emit = defineEmits(['row-select', 'on-new-handle', 'click-clear'])

  const clickClear = () => {
    emit('click-clear')
  }

  const hasOnNewHandle = computed(() => {
    const internal = getCurrentInstance()
    const props = internal?.vnode?.props || {}
    // Vue 会将事件名转为 onXxx 格式
    return typeof props.onOnNewHandle === 'function'
  })

  // const onNewHandle = addressType => {
  //   emit('on-new-handle', addressType)
  // }
  const normalizeText = value => {
    if (value == null) return ''
    return typeof value === 'string' ? value : String(value)
  }
  const isClear = ref(false)
  const inputText = ref(normalizeText(model.value))
  const isOpen = ref(false)
  const isLoading = ref(false)
  const items = ref([])
  const textFieldRef = ref(null)
  const requestId = ref(0)
  const openSnapshot = ref(normalizeText(model.value))
  const hasBoundRowOnOpen = ref(false)
  let queryTimer = null

  const pageObj = ref({
    pageSize: 50,
    pageIndex: 1,
    items: [
      { value: 50, title: '50' },
      { value: 100, title: '100' },
      { value: 200, title: '200' },
      { value: 500, title: '500' },
    ],
  })
  const totalCount = ref(0)

  const focusTextField = () => {
    const field = textFieldRef.value
    if (!field) return

    if (typeof field.focus === 'function') {
      field.focus()
      return
    }

    const input = field.$el?.querySelector('input')
    if (typeof input?.focus === 'function') {
      input.focus()
    }
  }

  const mergedTextFieldProps = computed(() => {
    return {
      clearable: true,
      color: 'primary',
      density: 'compact',
      'hide-details': true,
      variant: 'outlined',
      ...props.textFieldProps,
    }
  })

  const mergedTableProps = computed(() => {
    return {
      density: 'compact',
      hover: true,
      ...props.tableProps,
    }
  })

  const menuContentStyle = computed(() => {
    const style = {
      overflow: 'auto',
    }

    // const maxHeight = normalizeCssSize(props.menuMaxHeight)
    // if (maxHeight) {
    //   style.maxHeight = maxHeight
    // }

    return style
  })

  const onFieldFocus = () => {
    // Focus always opens menu and runs query with empty search to get all options.
    isOpen.value = true
    // Temporarily clear input text for query, then restore
    const originalText = inputText.value
    inputText.value = ''
    runQuery()
    // Restore original text after query
    inputText.value = originalText
  }

  const onInputValueUpdate = value => {
    // Sync model first, then debounce query.
    const nextVal = normalizeText(value)
    inputText.value = nextVal
    syncModelValue(nextVal)
    scheduleQuery()
  }

  const onRowClick = (_event, scope) => {
    // Normalize row shape across Vuetify table versions.
    const row = unwrapRow(scope?.item)
    emit('row-select', row)

    if (!row || typeof row !== 'object') {
      isOpen.value = false
      return
    }

    const nextVal = normalizeText(row[props.displayKey])
    hasBoundRowOnOpen.value = true
    inputText.value = nextVal
    syncModelValue(nextVal)
    openSnapshot.value = nextVal
    isOpen.value = false
  }

  const scheduleQuery = () => {
    clearQueryTimer()
    // queryTimer = setTimeout(() => {
    runQuery()
    // }, props.debounceMs)
  }

  const runQuery = debounceFn(async signal => {
    if (typeof props.fetchMethod !== 'function') return

    // Skip request if input length is below limit.
    // if (inputText.value.trim().length < props.minChars) {
    //   items.value = []
    //   return
    // }

    // Request id prevents stale response overwrite.
    const currentRequestId = ++requestId.value
    const payload = {
      ...props.queryExtra,
      [props.queryKey]: inputText.value,
      skipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
      maxResultCount: pageObj.value.pageSize,
    }

    isLoading.value = true

    try {
      const response = await props.fetchMethod(payload, signal)
      if (currentRequestId !== requestId.value) return

      const list = resolveList(response)
      items.value = Array.isArray(list) ? list : []
    } catch (error) {
      if (currentRequestId !== requestId.value) return
      console.log(error)
    } finally {
      if (currentRequestId === requestId.value) {
        isLoading.value = false
      }
    }
  })

  const resolveList = response => {
    totalCount.value = response?.data?.totalCount || 0

    // Default response shape: data.list, fallback to list.
    if (Array.isArray(response?.data?.list)) {
      return response.data.list
    }

    if (Array.isArray(response?.list)) {
      return response.list
    }
    // Default response shape: data.items, fallback to items.
    if (Array.isArray(response?.data?.items)) {
      return response.data.items
    }

    if (Array.isArray(response?.items)) {
      return response.items
    }

    return []
  }

  const syncModelValue = value => {
    if (model.value !== value) {
      model.value = value
    }
  }

  const clearQueryTimer = () => {
    if (queryTimer) {
      clearTimeout(queryTimer)
      queryTimer = null
    }
  }

  // const normalizeCssSize = value => {
  //   if (value == null || value === '') return null
  //   return typeof value === 'number' ? `${value}px` : value
  // }

  const unwrapRow = item => {
    if (!item) return item
    if (Object.prototype.hasOwnProperty.call(item, 'raw')) return item.raw
    return item
  }

  const isRowActive = item => {
    if (!item || !props.bindValue) return false
    const row = unwrapRow(item)
    return normalizeText(row[props.bindKey]) === normalizeText(props.bindValue)
  }

  watch(
    () => model.value,
    value => {
      const nextVal = normalizeText(value)
      if (nextVal !== inputText.value) {
        inputText.value = nextVal
        runQuery()
      }
    },
  )

  watch(
    () => isOpen.value,
    (nextVal, prevVal) => {
      if (nextVal && !prevVal) {
        openSnapshot.value = normalizeText(model.value)
        hasBoundRowOnOpen.value = false
        nextTick(() => {
          focusTextField()
        })
        return
      }

      if (!nextVal && prevVal && !hasBoundRowOnOpen.value) {
        if (isClear.value) {
          isClear.value = false
        } else {
          const restoreText = openSnapshot.value
          inputText.value = restoreText
          syncModelValue(restoreText)
          return
        }
      }

      if (!nextVal && prevVal && hasBoundRowOnOpen.value) {
        openSnapshot.value = normalizeText(model.value)
      }
    },
  )

  onBeforeUnmount(() => {
    clearQueryTimer()
    requestId.value++
  })
</script>

<style lang="scss" scoped>
  /* 基础状态 */
  .dropdown-icon {
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(0deg);
  }

  /* 打开时：顺时针旋转 180° */
  .dropdown-icon.open {
    transform: rotate(180deg);
  }

  /* 选中行样式 */
  .active-row {
    background-color: rgba(var(--v-theme-primary), 0.3);
    border-left: 4px solid var(--v-theme-primary);
  }
</style>
