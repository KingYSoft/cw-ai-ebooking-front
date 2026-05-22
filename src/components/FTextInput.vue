<template>
  <v-menu
    v-model="open"
    :close-delay="100"
    :close-on-content-click="false"
    location="center"
    :open-delay="0"
    :open-on-click="false"
    :open-on-focus="false"
    :open-on-hover="false"
    origin="overlap"
    :transition="false"
  >
    <template #activator="aaaa">
      <component
        :is="getComponent"
        v-model="textValue"
        v-bind="{ ...$attrs, ...getProps, ...aaaa.props }"
        :active="open"
        color="primary"
        density="compact"
        :focused="open"
        hide-details
        :label="label"
        :min-width="minWidth"
        :rules="rules"
        variant="outlined"
        :width="width"
        @click:control="open = true"
        @update:focused="
          $event => {
            if ($event) {
              open = true
            }
          }
        "
      >
        <!-- 透传所有插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </component>
    </template>

    <v-card>
      <v-card-text>
        <v-textarea
          v-model="textValue"
          color="primary"
          v-bind="getTextareaProps"
          counter
          density="compact"
          hint="Please input more text."
          min-width="100%"
          persistent-counter
          persistent-hint
          rows="10"
          variant="outlined"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup>
  import { toRefs } from 'vue'
  import { VTextarea, VTextField } from 'vuetify/components'
  //   import { useAppStore } from '@/stores/app'

  //   const appStore = useAppStore()

  defineOptions({
    name: 'FTextInput',
  })

  const props = defineProps({
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
    textarea: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    textProps: {
      type: Object,
      default: () => {
        return {}
      },
    },
    textareaProps: {
      type: Object,
      default: () => {
        return {}
      },
    },
  })
  const { textarea, textProps, textareaProps, label, minWidth, width } = toRefs(props)

  const textValue = defineModel('text-value', {
    type: String,
    default: () => null,
  })
  const getComponent = computed(() => {
    if (textarea.value) {
      return VTextarea
    } else {
      return VTextField
    }
  })

  const getProps = computed(() => {
    return Object.assign(
      {
        clearable: false,
        color: 'primary',
        density: 'compact',
        variant: 'outlined',
        'hide-details': true,
      },
      textProps.value,
      { label: label.value },
      { minWidth: minWidth.value },
    )
  })
  const getTextareaProps = computed(() => {
    return Object.assign(
      {
        'auto-grow': false,
        'no-resize': false,
        clearable: false,
        width: '420px',
      },
      textareaProps.value,
    )
  })
  const open = ref(false)
</script>
