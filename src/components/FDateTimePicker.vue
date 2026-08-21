<template>
  <v-text-field
    v-model="displayValue"
    v-click-outside="{
      handler: () => {
        open = false
      },
      include: includeHandle,
    }"
    :active="open"
    append-inner-icon="mdi-calendar-clock"
    class="date-time-picker"
    clearable
    color="primary"
    density="compact"
    :focused="open"
    hide-details
    :label="label"
    :min-width="minWidth"
    placeholder="yyyy-MM-dd HH:mm:ss"
    :rules="rules"
    variant="outlined"
    v-bind="getProps"
    :width="width"
    @click:clear="onClear"
    @click:control="open = true"
    @keydown.enter="open = true"
    @update:focused="onFocused"
  >
    <v-menu
      v-model="open"
      activator="parent"
      class="date-time-picker_menu"
      :close-on-content-click="false"
      :open-on-click="false"
      :open-on-focus="false"
      :transition="false"
    >
      <v-card class="date-time-picker-panel included">
        <v-date-picker
          hide-header
          :max="maxDate"
          :min="minDate"
          :model-value="pickerDate"
          show-adjacent-months
          @update:model-value="onDatePick"
        />

        <v-divider />

        <div class="time-row d-flex align-center ga-2 pa-2 px-3">
          <select v-model="hh" class="time-select" @change="commitDateTime">
            <option v-for="item in hourItems" :key="`h-${item}`" :value="item">{{ item }}</option>
          </select>

          <span class="time-sep">:</span>

          <select v-model="mm" class="time-select" @change="commitDateTime">
            <option v-for="item in minuteItems" :key="`m-${item}`" :value="item">{{ item }}</option>
          </select>

          <span class="time-sep">:</span>

          <select v-model="ss" class="time-select" @change="commitDateTime">
            <option v-for="item in secondItems" :key="`s-${item}`" :value="item">{{ item }}</option>
          </select>

          <v-spacer />

          <v-btn color="primary" size="small" variant="flat" @click="open = false">OK</v-btn>
        </div>
      </v-card>
    </v-menu>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </v-text-field>
</template>

<script setup>
  import { computed, ref, toRefs, watch } from 'vue'

  import { useAppStore } from '@/stores/app'
  import { ensureDateTimeSeconds } from '@/utils/dateTime'

  defineOptions({
    name: 'FDateTimePicker',
  })

  const appStore = useAppStore()

  const props = defineProps({
    min: {
      type: String,
      default: '2000-01-01',
    },
    max: {
      type: String,
      default: '2099-12-31',
    },
    width: {
      type: String,
      default: null,
    },
    minWidth: {
      type: String,
      default: '100%',
    },
    label: {
      type: String,
      default: null,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    dateProps: {
      type: Object,
      default: () => ({}),
    },
  })

  const { dateProps, min, max, label, minWidth, width } = toRefs(props)

  const dateTimeValue = defineModel('date-time-value', {
    type: String,
    default: '',
  })

  const open = ref(false)
  const pickerDate = ref(new Date())
  const hh = ref('00')
  const mm = ref('00')
  const ss = ref('00')

  const hourItems = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minuteItems = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
  const secondItems = minuteItems

  const pad2 = n => String(n).padStart(2, '0')

  const formatDateTime = (date, hour = '00', minute = '00', second = '00') => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return ''
    }
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${hour}:${minute}:${second}`
  }

  const parseDateTime = raw => {
    const text = String(raw ?? '').trim()
    if (!text) {
      return null
    }
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/)
    if (match) {
      const year = Number(match[1])
      const month = Number(match[2])
      const day = Number(match[3])
      const hour = Number(match[4] ?? 0)
      const minute = Number(match[5] ?? 0)
      const second = Number(match[6] ?? 0)
      const date = new Date(year, month - 1, day, hour, minute, second)
      if (Number.isNaN(date.getTime())) {
        return null
      }
      return { date, hour: pad2(hour), minute: pad2(minute), second: pad2(second) }
    }
    if (appStore.utils.isValidDate(text)) {
      const date = new Date(`${text}T00:00:00`)
      if (Number.isNaN(date.getTime())) {
        return null
      }
      return { date, hour: '00', minute: '00', second: '00' }
    }
    const fallback = new Date(text)
    if (Number.isNaN(fallback.getTime())) {
      return null
    }
    return {
      date: fallback,
      hour: pad2(fallback.getHours()),
      minute: pad2(fallback.getMinutes()),
      second: pad2(fallback.getSeconds()),
    }
  }

  const normalizeDateTimeText = raw => {
    const parsed = parseDateTime(raw)
    if (!parsed) {
      return ''
    }
    return formatDateTime(parsed.date, parsed.hour, parsed.minute, parsed.second)
  }

  const displayValue = computed({
    get() {
      return normalizeDateTimeText(dateTimeValue.value) || null
    },
    set(val) {
      dateTimeValue.value = normalizeDateTimeText(val)
    },
  })

  const defProps = {
    clearable: true,
    color: 'primary',
    density: 'compact',
    placeholder: 'yyyy-MM-dd HH:mm:ss',
    variant: 'outlined',
    'hide-details': true,
  }

  const getProps = computed(() =>
    Object.assign(defProps, dateProps.value, { label: label.value }, { minWidth: minWidth.value }),
  )

  const minDate = computed(() => String(min.value ?? '').slice(0, 10) || '2000-01-01')
  const maxDate = computed(() => String(max.value ?? '').slice(0, 10) || '2099-12-31')

  const syncFromModel = () => {
    const parsed = parseDateTime(dateTimeValue.value)
    if (!parsed) {
      pickerDate.value = new Date()
      hh.value = '00'
      mm.value = '00'
      ss.value = '00'
      return
    }
    pickerDate.value = parsed.date
    hh.value = parsed.hour
    mm.value = parsed.minute
    ss.value = parsed.second
  }

  const writeBackNormalizedModel = () => {
    const current = String(dateTimeValue.value ?? '').trim()
    if (!current) {
      return
    }
    const normalized = ensureDateTimeSeconds(normalizeDateTimeText(current) || current)
    if (normalized && normalized !== current) {
      dateTimeValue.value = normalized
    }
  }

  watch(
    () => dateTimeValue.value,
    () => {
      syncFromModel()
      writeBackNormalizedModel()
    },
    { immediate: true },
  )

  watch(open, value => {
    if (value) {
      syncFromModel()
    }
  })

  const commitDateTime = () => {
    const base = pickerDate.value instanceof Date ? pickerDate.value : new Date()
    dateTimeValue.value = formatDateTime(base, hh.value, mm.value, ss.value)
  }

  const onDatePick = value => {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
      return
    }
    pickerDate.value = date
    commitDateTime()
  }

  const onFocused = focused => {
    if (!focused) {
      dateTimeValue.value = normalizeDateTimeText(dateTimeValue.value)
    }
  }

  const onClear = () => {
    dateTimeValue.value = ''
  }

  const includeHandle = () => [document.querySelector('.date-time-picker-panel.included')]
</script>

<style lang="scss" scoped>
  .date-time-picker {
    :deep(.v-field) {
      .v-field__append-inner {
        .mdi-calendar-clock {
          margin-inline-end: 4px !important;
        }
      }
    }
  }

  .date-time-picker_menu {
    :deep(.v-overlay__content) {
      min-width: auto !important;
      width: auto !important;
    }
  }

  .time-row {
    min-height: 40px;
  }

  .time-sep {
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-size: 14px;
    line-height: 1;
  }

  .time-select {
    appearance: auto;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 4px;
    color: inherit;
    font-size: 13px;
    height: 28px;
    line-height: 28px;
    min-width: 52px;
    padding: 0 4px;
  }
</style>
