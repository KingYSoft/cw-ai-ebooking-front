<template>
  <div>
    <LayoutWithToolbar :title="title">
      <template #actions>
        <div class="d-flex align-center ga-2">
          <slot name="actions" />

          <v-btn
            color="primary"
            density="comfortable"
            icon="mdi-tune"
            :ripple="false"
            size="small"
            variant="text"
            @click="openHeaderSetting"
          />
        </div>
      </template>
      <!-- 虚拟滚动表格 -->
      <template v-if="virtual">
        <v-data-table-virtual
          ref="refTblData"
          :class="['table-filter', computedTableClass]"
          :disable-sort="disableSort"
          :fixed-header="fixedHeader"
          :headers="computedHeaders"
          :hover="hover"
          :item-height="itemHeight"
          :item-value="itemValue"
          :items="items"
          :show-select="showSelect"
          :striped="striped"
          :style="{ minHeight: maxHeight + 'px', maxHeight: maxHeight + 'px', overflowY: 'auto' }"
          @click:row="handleRowClick"
          @dblclick:row="handleRowDblClick"
          @update:model-value="emit('update:modelValue', $event)"
        >
          <!-- 操作列插槽 -->
          <template #item.actions="{ item }">
            <slot :item="item" name="item-actions" />
          </template>
          <!-- 表头操作列插槽 -->
          <template #header.actions>
            <slot name="header-actions" />
          </template>

          <template
            v-for="header in autoStatusHeaders"
            :key="`status-${header.key}`"
            #[`item.${header.key}`]="{ item }"
          >
            <StatusBadge :text="item?.[header.key]" />
          </template>
          <!-- 透传所有插槽，包括 item.[列名] 和 header.[列名] 插槽 -->
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </v-data-table-virtual>
      </template>
      <!-- 普通表格 -->
      <template v-else>
        <v-data-table
          ref="refTblData"
          :class="['table-filter', computedTableClass]"
          :disable-sort="disableSort"
          :fixed-header="fixedHeader"
          :headers="computedHeaders"
          :height="maxHeight > 0 ? maxHeight : undefined"
          :hide-default-footer="hideFooter"
          :hover="hover"
          :item-value="itemValue"
          :items="items"
          :items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :model-value="modelValue"
          :server-items-length="serverItemsLength"
          :show-select="showSelect"
          :striped="striped"
          @click:row="handleRowClick"
          @dblclick:row="handleRowDblClick"
          @update:items-per-page="emit('update:items-per-page', $event)"
          @update:model-value="emit('update:modelValue', $event)"
          @update:page="emit('update:page', $event)"
        >
          <!-- 操作列插槽 -->
          <template #item.actions="{ item }">
            <slot :item="item" name="item-actions" />
          </template>
          <!-- 表头操作列插槽 -->
          <template #header.actions>
            <slot name="header-actions" />
          </template>

          <template
            v-for="header in autoStatusHeaders"
            :key="`status-${header.key}`"
            #[`item.${header.key}`]="{ item }"
          >
            <StatusBadge :text="item?.[header.key]" />
          </template>
          <!-- 透传所有插槽，包括 item.[列名] 和 header.[列名] 插槽 -->
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </v-data-table>
      </template>
    </LayoutWithToolbar>

    <FTableSettingDialog
      ref="refTableSettingDialog"
      v-model="showHeaderSetting"
      :headers="headers"
      :selected-keys="visibleHeaderKeys"
      :setting-name="settingName"
      @apply="applyHeaderSetting"
    />
  </div>
</template>

<script setup>
  import { computed, onBeforeUnmount, ref, useSlots } from 'vue'
  import FTableSettingDialog from '@/components/FTableSettingDialog.vue'
  import StatusBadge from '@/components/StatusBadge.vue'
  import { ensureDateColumnMinWidth } from '@/composables/ensureDateColumnMinWidth'

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemValue: {
      type: String,
      default: 'pk',
    },
    itemsPerPage: {
      type: Number,
      default: 100,
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [10, 25, 50, 100, -1],
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: true,
    },
    striped: {
      type: [String, Boolean],
      default: 'even',
    },
    fixedHeader: {
      type: Boolean,
      default: true,
    },
    disableSort: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Number,
      default: 0,
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    serverItemsLength: {
      type: Number,
      default: -1,
    },
    itemHeight: {
      type: Number,
      default: 48,
    },
    tableClass: {
      type: [String, Array, Object],
      default: '',
    },
    settingName: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits([
    'update:modelValue',
    'row-click',
    'row-dblclick',
    'update:headers',
    'update:page',
    'update:items-per-page',
  ])

  const refTblData = ref(null)
  const refTableSettingDialog = ref(null)
  const scrollClass = ref(null)
  const showHeaderSetting = ref(false)
  const visibleHeaderKeys = ref([])
  const tableHeaders = ref([...props.headers])

  // /**
  //  * 固定列规则仍然由表格组件定义，再传给弹框组件使用。
  //  */
  // const fixedHeaderKeys = computed(() => {
  //   return [...new Set(props.fixedKeys)]
  // })

  /**
   * 计算最终传给 v-data-table 的 headers。
   */
  const computedHeaders = computed(() => {
    return ensureDateColumnMinWidth(tableHeaders.value)
  })

  const slots = useSlots()
  const autoStatusHeaders = computed(() =>
    (props.headers || []).filter(header => {
      const key = String(header?.key ?? '')
      return /status/i.test(key) && !slots[`item.${key}`]
    }),
  )

  const computedTableClass = computed(() => {
    return scrollClass.value || props.tableClass
  })

  /**
   * 打开设置弹框。
   */
  const openHeaderSetting = () => {
    showHeaderSetting.value = true
  }

  /**
   * 弹框组件内部会独立完成读取设置、同步表头、保存设置。
   * 这里仅接收它算好的最终结果。
   */
  const applyHeaderSetting = payload => {
    visibleHeaderKeys.value = payload?.visibleKeys ?? []
    tableHeaders.value = payload?.headers ?? [...props.headers]
    emit('update:headers', tableHeaders.value)
  }

  const handleRowDblClick = (event, scope) => {
    if (event && typeof event === 'object' && event.item) {
      emit('row-dblclick', null, { item: event.item })
      return
    }

    emit('row-dblclick', event, scope)
  }

  const handleRowClick = (event, scope) => {
    if (event && typeof event === 'object' && event.item) {
      emit('row-click', null, { item: event.item })
      return
    }

    emit('row-click', event, scope)
  }

  /**
   * 横向滚动后切换 class，用于处理固定列样式。
   */
  const onScroll = e => {
    scrollClass.value = e.target.scrollLeft > 0 ? 'fixed-table-cc' : null
  }

  /**
   * 组件销毁时移除滚动监听，避免重复绑定。
   */
  onBeforeUnmount(() => {
    const wrapper = refTblData.value?.$el?.querySelector('.v-table__wrapper')
    if (wrapper) {
      wrapper.removeEventListener('scroll', onScroll)
    }
  })

  /**
   * 由外部页面在表格渲染完成后调用，给表格滚动容器补上监听。
   */
  const initScrollListener = () => {
    const wrapper = refTblData.value?.$el?.querySelector('.v-table__wrapper')
    if (wrapper) {
      wrapper.addEventListener('scroll', onScroll)
    }
  }
  const initHeaders = () => {
    refTableSettingDialog.value?.initHeaders?.()
  }

  defineExpose({
    initScrollListener,
    initHeaders,
    refTblData,
  })
</script>
