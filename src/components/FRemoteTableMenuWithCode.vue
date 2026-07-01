<template>
  <div class="f-remote-table-menu-with-code d-flex align-center ga-1">
    <slot name="prepend" />

    <v-text-field
      class="f-remote-table-menu-with-code__code"
      density="compact"
      hide-details
      :model-value="codeDisplay"
      readonly
      variant="outlined"
      v-bind="codeFieldProps"
    />

    <FRemoteTableMenu
      v-if="hasOnNewHandle"
      v-model="model"
      class="f-remote-table-menu-with-code__menu flex-1-1-0"
      v-bind="remoteMenuAttrs"
      @click-clear="onClickClear"
      @on-new-handle="emit('on-new-handle')"
      @row-select="onRowSelect"
    >
      <template v-for="(_, name) in forwardedSlots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </FRemoteTableMenu>

    <FRemoteTableMenu
      v-else
      v-model="model"
      class="f-remote-table-menu-with-code__menu flex-1-1-0"
      v-bind="remoteMenuAttrs"
      @click-clear="onClickClear"
      @row-select="onRowSelect"
    >
      <template v-for="(_, name) in forwardedSlots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </FRemoteTableMenu>
  </div>
</template>

<script setup>
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'

  defineOptions({
    name: 'FRemoteTableMenuWithCode',
    inheritAttrs: false,
  })

  const model = defineModel({
    type: String,
    default: '',
  })

  const props = defineProps({
    bindKey: {
      type: String,
      default: 'code',
    },
    bindValue: {
      type: String,
      default: '',
    },
    codeFieldProps: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['row-select', 'on-new-handle', 'click-clear'])

  const hasOnNewHandle = computed(() => {
    const internal = getCurrentInstance()
    const propsV = internal?.vnode?.props || {}

    // Vue 会将事件名转为 onXxx 格式
    return typeof propsV.onOnNewHandle === 'function'
  })

  const attrs = useAttrs()
  const slots = useSlots()

  const forwardedSlots = computed(() => {
    const slotNames = { ...slots }
    delete slotNames.prepend
    return slotNames
  })

  const remoteMenuAttrs = computed(() => {
    const raw = { ...attrs }
    const textFieldProps = { ...raw['text-field-props'] }
    const restTextFieldProps = { ...textFieldProps }
    delete restTextFieldProps.minWidth
    delete restTextFieldProps['min-width']

    const style = restTextFieldProps.style
    const mergedStyle =
      typeof style === 'object' && style != null
        ? { ...style, minWidth: 0, width: '100%' }
        : { minWidth: 0, width: '100%' }

    return {
      ...raw,
      textFieldProps: {
        ...restTextFieldProps,
        style: mergedStyle,
      },
    }
  })

  const normalizeText = value => {
    if (value == null) return ''
    return typeof value === 'string' ? value : String(value)
  }

  const codeDisplay = computed(() => normalizeText(props.bindValue))

  const onRowSelect = row => {
    emit('row-select', row)
  }

  const onClickClear = () => {
    emit('click-clear')
  }
</script>

<style lang="scss" scoped>
  .f-remote-table-menu-with-code {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .f-remote-table-menu-with-code__code {
    flex: 0 1 100px;
    min-width: 72px;
    max-width: 100px;
  }

  .f-remote-table-menu-with-code__code :deep(.v-input),
  .f-remote-table-menu-with-code__code :deep(.v-field) {
    width: 100%;
  }

  .f-remote-table-menu-with-code__menu {
    flex: 1 1 0;
    min-width: 0;
    width: 0;
  }

  .f-remote-table-menu-with-code__menu :deep(.v-input),
  .f-remote-table-menu-with-code__menu :deep(.v-text-field) {
    width: 100%;
  }
</style>
