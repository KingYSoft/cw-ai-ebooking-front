<template>
  <component :is="getComponent" v-model="model" v-model:date-value="model" v-bind="getProps">
    <template #prepend>
      <div class="d-flex align-center ga-1">
        <slot name="prepend" />

        <v-select
          v-model="modelOp"
          auto-select-first
          autocomplete="off"
          density="compact"
          hide-details
          :items="['=', '>=', '<=', 'Contain', 'Not Contain']"
          :list-props="{
            density: 'compact',
          }"
          :menu-props="{
            'max-width': 'auto',
          }"
          no-data-text="$vuetify.custom.app.searchMore"
          no-filter
          variant="outlined"
          width="60"
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
  import { VSelect, VTextField } from 'vuetify/components'
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
  })

  const { componentType, componentProps } = toRefs(props)
  const getComponent = computed(() => {
    switch (componentType.value) {
      case 'v-select': {
        return VSelect
      }
      case 'f-date-picker': {
        return FDatePicker
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
    return Object.assign(defaultProps, componentProps.value)
  })
</script>
