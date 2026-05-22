<template>
  <v-text-field
    v-model="dateValue"
    v-click-outside="{
      handler: clickOutsideHandle,
      include: includeHandle,
    }"
    :active="open"
    append-inner-icon="mdi-calendar-month"
    class="date-picker"
    clearable
    color="primary"
    density="compact"
    :focused="open"
    hide-details
    :label="label"
    :min-width="minWidth"
    placeholder="yyyy-MM-dd"
    :rules="rules"
    variant="outlined"
    v-bind="getProps"
    :width="width"
    @click:control="open = true"
    @keydown.enter="open = true"
    @update:focused="inputBlurredHandle"
  >
    <v-menu
      v-model="open"
      activator="parent"
      class="date-picker_menu"
      :close-delay="100"
      :close-on-content-click="false"
      :open-delay="0"
      :open-on-click="false"
      :open-on-focus="false"
      :open-on-hover="false"
      :transition="false"
    >
      <v-card class="aaa included">
        <v-date-picker
          bg-color="date-picker-background"
          color="red"
          hide-header
          :max="max"
          :min="min"
          :model-value="newDate"
          show-adjacent-months
          @update:model-value="
            $event => {
              newDate = $event
              dateValue = appStore.utils.formatDate($event)
              open = false
            }
          "
        />
      </v-card>
    </v-menu>

    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </v-text-field>
</template>
<script setup>
  import { toRefs, watch } from 'vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  defineOptions({
    name: 'FDatePicker',
  })

  const props = defineProps({
    min: {
      type: String,
      default: () => {
        return '2000-01-01'
      },
    },
    max: {
      type: String,
      default: () => {
        return '2099-12-31'
      },
    },
    width: {
      type: String,
      default: () => {
        return null
      },
    },
    minWidth: {
      type: String,
      default: () => {
        return '100%'
      },
    },
    label: {
      type: String,
      default: () => {
        return null
      },
    },
    rules: {
      type: Array,
      default: () => {
        return []
      },
    },
    dateProps: {
      type: Object,
      default: () => {
        return {}
      },
    },
  })
  const { dateProps, min, max, label, minWidth, width } = toRefs(props)

  const dateValue = defineModel('date-value', {
    type: String,
    default: () => null,
  })
  const defProps = {
    clearable: true,
    color: 'primary',
    density: 'compact',
    placeholder: 'yyyy-MM-dd',
    variant: 'outlined',
    'hide-details': true,
  }
  const getProps = computed(() => {
    return Object.assign(
      defProps,
      dateProps.value,
      { label: label.value },
      { minWidth: minWidth.value },
    )
  })

  const open = ref(false)
  const newDate = ref(new Date())
  const inputBlurredHandle = focused => {
    if (focused) {
      // open.value = true
    }
    // else {
    //   open.value = false
    // }
    updateVal()
  }
  const updateVal = () => {
    const newVal = dateValue.value
    if (newVal) {
      if (appStore.utils.isValidDate(newVal)) {
        newDate.value = new Date(newVal)
      } else {
        dateValue.value = appStore.utils.formatDate(newDate.value)
      }
    }
  }

  watch(
    () => open.value,
    () => {
      updateVal()
    },
  )
  const clickOutsideHandle = () => {
    open.value = false
  }
  const includeHandle = () => {
    return [document.querySelector('.aaa.included')]
  }
</script>
<style lang="scss" scoped>
  .date-picker {
    :deep(.v-field) {
      .v-field__append-inner {
        .mdi-calendar-month {
          margin-inline-end: 4px !important;
          // &.v-icon {
          //   --v-icon-size-multiplier: 0.8 !important;
          // }
        }
      }
    }
  }
  .date-picker_menu {
    :deep(.v-overlay__content) {
      min-width: auto !important;
      width: auto !important;
    }
  }
</style>
