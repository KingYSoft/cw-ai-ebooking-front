<template>
  <v-dialog v-model="dialogVisible" max-width="860" persistent>
    <v-card :disabled="cardLoading" :loading="cardLoading" prepend-icon="mdi-tune" :title="title">
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <template #append>
        <v-btn
          density="comfortable"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="closeDialog(false)"
        />
      </template>

      <v-divider />

      <v-card-text class="py-2">
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <span>{{ t('$vuetify.custom.tableLayout.availableFields') }}</span>
              <span> ({{ configurableHeaders.length }}) </span>
            </div>

            <v-list class="border rounded" density="comfortable" max-height="430">
              <v-list-item v-for="header in configurableHeaders" :key="header.key">
                <v-checkbox
                  density="compact"
                  hide-details
                  :model-value="isSelected(header.key)"
                  @update:model-value="toggleHeader(header.key, $event)"
                >
                  <template #label>
                    <div class="ml-2">
                      {{ header.title }}
                    </div>
                  </template>
                </v-checkbox>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-subtitle-2 mb-2">
              <span>{{ t('$vuetify.custom.tableLayout.selectedFields') }}</span>
              <span> ({{ selectedHeaderItems.length }}) </span>
            </div>

            <v-list class="border rounded" density="comfortable" max-height="430">
              <draggable v-model="selectedHeaderItems" handle=".drag-handle" item-key="key">
                <template #item="{ element, index }">
                  <v-list-item :key="element.key">
                    <v-icon class="drag-handle cursor-move" icon="mdi-drag" />
                    <span class="ml-2 drag-handle cursor-move">{{ element.title }}</span>

                    <template #append>
                      <v-btn
                        v-if="index > 0"
                        density="comfortable"
                        icon="mdi-arrow-up"
                        size="small"
                        variant="text"
                        @click="moveHeader(element.key, -1)"
                      />

                      <v-btn
                        v-if="index < selectedHeaderItems.length - 1"
                        density="comfortable"
                        icon="mdi-arrow-down"
                        size="small"
                        variant="text"
                        @click="moveHeader(element.key, 1)"
                      />
                    </template>
                  </v-list-item>
                </template>
              </draggable>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-4 py-3">
        <v-btn color="warning" size="small" variant="tonal" @click="resetHeaders">Reset</v-btn>
        <v-spacer />
        <v-btn size="small" variant="text" @click="closeDialog(false)">Cancel</v-btn>
        <v-btn color="primary" size="small" variant="flat" @click="confirmDialog">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import draggable from 'vuedraggable'
  import { useLocale } from 'vuetify'
  import { useAppStore } from '@/stores/app'
  import { useUserStore } from '@/stores/user'

  defineOptions({
    name: 'FTableSettingDialog',
  })

  const { t } = useLocale()
  const dialogVisible = defineModel({
    type: Boolean,
    default: false,
  })

  const props = defineProps({
    headers: {
      type: Array,
      default: () => [],
    },
    selectedKeys: {
      type: Array,
      default: () => [],
    },
    settingName: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Settings',
    },
  })

  const emit = defineEmits(['confirm', 'apply'])

  const fixedKeys = ['actions', 'data-table-select', 'data-table-expand']
  const appStore = useAppStore()
  const userStore = useUserStore()
  const localSelectedKeys = ref([])
  const appliedHeaderKeys = ref([])
  const sessionStoredHeaderSetting = ref(null)
  const cardLoading = ref(false)

  /**
   * 对 key 数组去重并过滤空值。
   * 组件内部所有 key 相关操作都先走这里，避免出现重复项和脏数据。
   */
  const normalizeKeyList = list => {
    return [
      ...new Set((Array.isArray(list) ? list : []).filter(key => typeof key === 'string' && key)),
    ]
  }

  /**
   * 固定列不参与设置，但仍要显示在表格中。
   */
  const fixedKeySet = computed(() => {
    return new Set(normalizeKeyList(fixedKeys))
  })

  /**
   * 可配置列只包含允许用户显示/隐藏和拖拽排序的部分。
   */
  const configurableHeaders = computed(() => {
    return props.headers.filter(header => !fixedKeySet.value.has(header.key))
  })

  /**
   * 按当前原始表头生成可配置列 key。
   */
  const sourceConfigurableKeys = computed(() => {
    return configurableHeaders.value.map(header => header.key)
  })

  /**
   * 读取用户设置。
   * 新格式：
   * {
   *   visibleKeys: [],
   *   knownKeys: []
   * }
   *
   * 旧格式仍兼容：
   * 1. 纯数组，视为仅有 visibleKeys
   * 2. 对象但没有 knownKeys，也按仅有 visibleKeys 处理
   */
  const parseStoredHeaderSetting = value => {
    if (!value || typeof value !== 'string') {
      return {
        visibleKeys: [],
        knownKeys: null,
      }
    }

    try {
      const parsed = JSON.parse(value)

      if (Array.isArray(parsed)) {
        return {
          visibleKeys: normalizeKeyList(parsed),
          knownKeys: null,
        }
      }

      if (parsed && typeof parsed === 'object') {
        return {
          visibleKeys: normalizeKeyList(parsed.visibleKeys),
          knownKeys: Array.isArray(parsed.knownKeys) ? normalizeKeyList(parsed.knownKeys) : null,
        }
      }

      return {
        visibleKeys: [],
        knownKeys: null,
      }
    } catch (error) {
      console.log(error)
      return {
        visibleKeys: [],
        knownKeys: null,
      }
    }
  }

  /**
   * 按存储设置和当前原始表头，生成最终真正显示的 key 顺序。
   *
   * 新格式规则：
   * 1. visibleKeys 中不存在于当前原始表头的 key，删除
   * 2. knownKeys 中存在但 visibleKeys 没有的，视为用户主动隐藏，不补回
   * 3. 当前原始表头中存在、但 knownKeys 中没有的，视为新增列，追加到末尾
   *
   * 旧格式规则：
   * 1. 纯数组无法区分“隐藏列”和“新增列”
   * 2. 因此仍按旧逻辑，把原始表头缺失项补回到末尾
   */
  const buildVisibleHeaderKeys = storedSetting => {
    const sourceKeySet = new Set(sourceConfigurableKeys.value)
    const visibleKeys = normalizeKeyList(storedSetting?.visibleKeys).filter(key =>
      sourceKeySet.has(key),
    )

    if (!Array.isArray(storedSetting?.knownKeys) || storedSetting.knownKeys.length === 0) {
      const missingKeys = sourceConfigurableKeys.value.filter(key => !visibleKeys.includes(key))
      return [...visibleKeys, ...missingKeys]
    }

    const knownKeySet = new Set(normalizeKeyList(storedSetting.knownKeys))
    const newKeys = sourceConfigurableKeys.value.filter(key => !knownKeySet.has(key))

    return [...visibleKeys, ...newKeys]
  }

  /**
   * 根据最终要显示的 key 顺序，组装可直接给 v-data-table 使用的 headers。
   * 固定列按原始位置插回。
   */
  const buildTableHeaders = keys => {
    const headerMap = new Map(props.headers.map(header => [header.key, header]))
    const orderedConfigurableHeaders = normalizeKeyList(keys)
      .map(key => headerMap.get(key))
      .filter(Boolean)
    const nextHeaders = []

    props.headers.forEach(header => {
      if (fixedKeySet.value.has(header.key)) {
        nextHeaders.push(header)
        return
      }

      const nextHeader = orderedConfigurableHeaders.shift()
      if (nextHeader) {
        nextHeaders.push(nextHeader)
      }
    })

    return nextHeaders
  }

  /**
   * 当前真正应用到表格的 headers。
   */
  const appliedHeaders = computed(() => {
    return buildTableHeaders(appliedHeaderKeys.value)
  })

  /**
   * 右侧拖拽区只显示当前勾选的列，并按 localSelectedKeys 的顺序展示。
   */
  const selectedHeaderItems = computed({
    get() {
      const headerMap = new Map(configurableHeaders.value.map(header => [header.key, header]))
      return normalizeKeyList(localSelectedKeys.value)
        .map(key => headerMap.get(key))
        .filter(Boolean)
    },
    set(value) {
      localSelectedKeys.value = value.map(header => header.key)
    },
  })
  /**
   * 通过上下按钮移动右侧已选列顺序。
   * direction:
   * -1 表示上移
   * 1 表示下移
   */
  const moveHeader = (key, direction) => {
    const currentIndex = localSelectedKeys.value.indexOf(key)
    if (currentIndex === -1) return

    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= localSelectedKeys.value.length) return

    const nextKeys = [...localSelectedKeys.value]
    const currentKey = nextKeys[currentIndex]
    nextKeys[currentIndex] = nextKeys[nextIndex]
    nextKeys[nextIndex] = currentKey
    localSelectedKeys.value = nextKeys
  }
  /**
   * 优先使用当前会话内刚保存过的设置，避免保存后马上被旧值覆盖。
   */
  const getStoredHeaderSetting = () => {
    if (sessionStoredHeaderSetting.value) {
      return sessionStoredHeaderSetting.value
    }

    if (!props.settingName) {
      return {
        visibleKeys: [],
        knownKeys: null,
      }
    }

    return parseStoredHeaderSetting(appStore.useSettings.get(props.settingName))
  }

  /**
   * 把最终结果通知父组件。
   * 父组件只需要接收 headers 和 visibleKeys，不需要知道内部是怎么算出来的。
   */
  const emitApply = () => {
    emit('apply', {
      visibleKeys: [...appliedHeaderKeys.value],
      headers: appliedHeaders.value,
    })
  }

  /**
   * 初始化表头设置：
   * 1. 读用户设置
   * 2. 和当前原始表头做同步
   * 3. 通知父组件刷新表格
   */
  const initHeaders = () => {
    const stored = getStoredHeaderSetting()
    const mergedKeys = buildVisibleHeaderKeys(stored)
    const sourceKeys = sourceConfigurableKeys.value
    const storedVisible = normalizeKeyList(stored?.visibleKeys).filter(key => sourceKeys.includes(key))
    const addedKeys = mergedKeys.filter(key => !storedVisible.includes(key))

    appliedHeaderKeys.value = mergedKeys

    // 代码新增列时合并进当前显示列表，便于用户在设置里调整顺序后再保存
    if (addedKeys.length > 0) {
      sessionStoredHeaderSetting.value = {
        visibleKeys: mergedKeys,
        knownKeys: normalizeKeyList([
          ...(Array.isArray(stored?.knownKeys) ? stored.knownKeys : storedVisible),
          ...sourceKeys,
        ]),
      }
    }

    emitApply()
  }

  /**
   * 每次打开弹框时，把当前已应用的结果同步到本地编辑态。
   * 这里不补全，只保留当前已显示的列，避免弹框右侧出现多余项。
   */
  const syncLocalState = () => {
    const sourceKeySet = new Set(sourceConfigurableKeys.value)
    localSelectedKeys.value = normalizeKeyList(props.selectedKeys).filter(key =>
      sourceKeySet.has(key),
    )
  }

  /**
   * 左侧复选框是否勾选。
   */
  const isSelected = key => {
    return localSelectedKeys.value.includes(key)
  }

  /**
   * 左侧显示/隐藏勾选逻辑。
   */
  const toggleHeader = (key, checked) => {
    if (checked) {
      if (!localSelectedKeys.value.includes(key)) {
        localSelectedKeys.value = [...localSelectedKeys.value, key]
      }
      return
    }

    localSelectedKeys.value = localSelectedKeys.value.filter(item => item !== key)
  }

  /**
   * 统一关闭弹框出口。
   */
  const closeDialog = value => {
    dialogVisible.value = Boolean(value)
  }

  /**
   * 重置到“当前原始表头”的状态：
   * 1. 所有可配置列全部显示
   * 2. 顺序按当前原始表头顺序恢复
   */
  const resetHeaders = () => {
    localSelectedKeys.value = [...sourceConfigurableKeys.value]
  }

  /**
   * 点击确认后：
   * 1. 保存 visibleKeys 到用户设置
   * 2. 更新内部已应用状态
   * 3. 通知父组件刷新表格
   */
  const confirmDialog = async () => {
    sessionStoredHeaderSetting.value = {
      visibleKeys: normalizeKeyList(localSelectedKeys.value),
      knownKeys: [...sourceConfigurableKeys.value],
    }
    appliedHeaderKeys.value = [...sessionStoredHeaderSetting.value.visibleKeys]

    if (props.settingName) {
      try {
        cardLoading.value = true
        await userStore.changeSetting(
          props.settingName,
          JSON.stringify(sessionStoredHeaderSetting.value),
        )
      } catch (error) {
        console.error('Failed to save user setting:', error)
        return
      } finally {
        cardLoading.value = false
      }
    }

    emit('confirm', [...appliedHeaderKeys.value])
    emitApply()
    dialogVisible.value = false
  }

  watch(
    () => dialogVisible.value,
    isOpen => {
      if (isOpen) {
        syncLocalState()
      }
    },
    { immediate: true },
  )

  watch(
    () => props.settingName,
    () => {
      sessionStoredHeaderSetting.value = null
    },
  )

  watch(
    () => [props.headers, props.settingName],
    () => {
      initHeaders()
    },
    {
      deep: true,
      immediate: true,
    },
  )

  watch(
    () => [props.headers, props.selectedKeys],
    () => {
      if (dialogVisible.value) {
        syncLocalState()
      }
    },
    { deep: true },
  )

  defineExpose({
    confirmDialog,
    initHeaders,
    localSelectedKeys,
    moveHeader,
    resetHeaders,
  })
</script>
<!--
<style lang="scss" scoped>
  .table-setting-dialog {
    border: 1px solid rgba(var(--v-border-color), 0.16);
  }

  .panel-box {
    border: 1px solid rgba(var(--v-border-color), 0.18);
    border-radius: 6px;
    min-height: 430px;
    overflow: hidden;
  }

  .panel-scroll {
    max-height: 430px;
    overflow-y: auto;
    padding: 8px 0;
  }

  .available-row,
  .selected-row {
    min-height: 42px;
    padding: 0 16px;
  }

  .available-row {
    display: flex;
    align-items: center;
  }

  .available-checkbox {
    width: 100%;
  }

  .selected-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .selected-title {
    color: rgba(var(--v-theme-on-surface), 0.82);
    font-size: 16px;
  }

  .drag-handle {
    cursor: move;
  }
</style> -->
