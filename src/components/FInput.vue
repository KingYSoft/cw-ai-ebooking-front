<template>
  <component :is="getComponent" v-model="model" v-model:date-value="model" v-bind="getProps">
    <template #prepend>
      <div class="d-flex align-center ga-1">
        <slot name="prepend" />

        <v-select
          v-if="componentType !== 'v-checkbox'"
          v-model="modelOp"
          auto-select-first
          autocomplete="off"
          density="compact"
          hide-details
          :items="opItems ?? ['=', '>=', '<=', 'Contain', 'Not Contain']"
          :list-props="{
            density: 'compact',
          }"
          :menu-props="{
            'max-width': 'auto',
          }"
          min-width="60"
          no-data-text="$vuetify.custom.app.searchMore"
          no-filter
          variant="outlined"
          width="auto"
        >
          <template #item="scope">
            <v-list-item v-bind="scope.props">
              <template #title>
                <div class="text-body-2">{{ scope.item.raw }}</div>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </div>
    </template>
  </component>
</template>

<script setup>
  import { VCheckbox, VSelect, VTextField } from 'vuetify/components'
  import FDatePicker from './FDatePicker.vue'

  defineOptions({
    name: 'FInput',
  })

  const model = defineModel()
  const modelOp = defineModel('op', {
    type: String,
    default: () => '=',
  })

  const props = defineProps({
    componentType: {
      type: String,
      defalut: () => {
        return 'v-text-field'
      },
    },
    componentProps: {
      type: Object,
      defalut: () => {
        return {}
      },
    },
    opItems: {
      type: Array,
      defalut: () => {
        return []
      },
    },
  })

  const { componentType, componentProps, opItems } = toRefs(props)
  const getComponent = computed(() => {
    switch (componentType.value) {
      case 'v-select': {
        return VSelect
      }
      case 'f-date-picker': {
        return FDatePicker
      }
      case 'v-checkbox': {
        return VCheckbox
      }
      case 'v-text-field': {
        return VTextField
      }
      default: {
        return VTextField
      }
    }
  })
  const defaultProps = {
    color: 'primary',
    density: 'compact',
    'hide-details': true,
    'min-width': '100%',
    type: 'input',
    variant: 'outlined',
  }
  const getProps = computed(() => {
    const merged = Object.assign({}, defaultProps, componentProps.value)
    if (String(merged.type ?? '').toLowerCase() === 'number') {
      merged.class = [merged.class, 'input-numeric'].filter(Boolean).join(' ')
    }
    return merged
  })
</script>
