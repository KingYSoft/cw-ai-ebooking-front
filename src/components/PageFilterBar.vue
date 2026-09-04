<template>
  <v-form ref="refFilterForm" class="ref-form-pre">
    <!-- 基础筛选 -->
    <v-card-text
      ref="wrapperRef"
      class="page-filter-bar--included"
      :class="['position-relative', inner ? 'position-inner' : '']"
    >
      <v-row dense>
        <slot />

        <v-col class="d-flex align-center" cols="auto">
          <v-btn color="primary" size="small" @click="onSearch">
            {{ t('$vuetify.custom.dialog.btn.search') }}
          </v-btn>

          <v-badge
            v-if="moreKeys > 0"
            color="primary"
            :content="moreCount"
            :model-value="moreCount > 0"
          >
            <v-btn
              class="ml-2"
              :color="moreCount > 0 ? 'primary' : ''"
              size="small"
              variant="outlined"
              @click="toggleMore"
            >
              {{ t('$vuetify.custom.dialog.btn.more') }}
              <v-icon end>
                {{ showMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </v-badge>
        </v-col>
      </v-row>
    </v-card-text>

    <transition name="dropdown">
      <v-card-text
        v-show="showMore"
        v-click-outside="{
          handler: onClickOutside,
          include,
        }"
        class="bg-surface pt-0"
        :style="panelStyle"
      >
        <v-row dense>
          <slot name="more" />
        </v-row>

        <div class="d-flex justify-start mt-2">
          <v-btn color="primary" size="small" variant="tonal" @click="onResetMore">
            {{ t('$vuetify.custom.dialog.btn.clear') }}
          </v-btn>
        </div>
      </v-card-text>
    </transition>
  </v-form>
</template>

<script setup>
  import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
  import { useLocale } from 'vuetify'

  defineOptions({
    name: 'PageFilterBar',
  })

  defineProps({
    inner: {
      type: Boolean,
      default: false,
    },
  })

  const { t } = useLocale()
  // const display = useDisplay()

  const inputSearchData = defineModel('input-search-data', {
    type: Object,
    default: () => {
      return {}
    },
  })
  const emit = defineEmits(['on-search', 'on-reset-more'])
  const onResetMore = () => {
    emit('on-reset-more')
  }

  const wrapperRef = ref(null)
  // const panelRef = ref(null)

  const showMore = ref(false)
  const panelStyle = ref({})

  /* ---------------- schema ---------------- */
  // const baseSchemas = computed(() => props.schemas.filter(s => s.base))
  // const moreSchemas = computed(() => props.schemas.filter(s => !s.base))

  // const getComponent = item => {
  //   switch (item.type) {
  //     case 'select': {
  //       return VSelect
  //     }
  //     case 'date': {
  //       return VTextField
  //     } // 可替换为 v-date-picker
  //     default: {
  //       return VTextField
  //     }
  //   }
  // }

  // const getProps = item => {
  //   const map = {
  //     color: 'primary',
  //     density: 'compact',
  //     'hide-details': true,
  //     'min-width': '100%',
  //     variant: 'outlined',
  //   }
  //   if (item.type === 'select') {
  //     map.items = item.items || []
  //   } else {
  //     map.type = 'input'
  //   }

  //   return map
  // }

  /* ---------------- 定位 ---------------- */
  const updatePosition = () => {
    nextTick(() => {
      if (wrapperRef.value) {
        const rect = wrapperRef.value.$el.getBoundingClientRect()

        panelStyle.value = {
          position: 'fixed',
          left: rect.left + 'px',
          top: rect.bottom + 'px',
          width: rect.width + 'px',
          zIndex: 3,
          boxShadow: '0 4px 4px rgba(0,0,0,0.12)',
        }
      }
    })
  }

  /* ---------------- 打开关闭 ---------------- */
  const toggleMore = async () => {
    showMore.value = !showMore.value
    if (showMore.value) {
      await nextTick()
      updatePosition()
      bindEvents()
    } else {
      unbindEvents()
    }
  }

  /* ---------------- 外部点击关闭 ---------------- */
  // const handleClickOutside = e => {
  //   if (!panelRef.value || !wrapperRef.value) return
  //   if (!panelRef.value.contains(e.target) && !wrapperRef.value.contains(e.target)) {
  //     showMore.value = false
  //     unbindEvents()
  //   }
  // }

  // /* ESC关闭 */
  // const handleKeydown = e => {
  //   if (e.key === 'Escape') {
  //     showMore.value = false
  //     unbindEvents()
  //   }
  // }

  const bindEvents = () => {
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    // document.addEventListener('mousedown', handleClickOutside)
    // document.addEventListener('keydown', handleKeydown)
  }

  const unbindEvents = () => {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
    // document.removeEventListener('mousedown', handleClickOutside)
    // document.removeEventListener('keydown', handleKeydown)
  }

  onBeforeUnmount(() => {
    unbindEvents()
  })

  /* ---------------- 查询逻辑 ---------------- */
  const onSearch = () => {
    emit('on-search')
  }

  // const resetMore = () => {
  //   moreSchemas.value.forEach(s => (innerQuery.value[s.key] = ''))
  // }

  /* ---------------- 统计 ---------------- */
  const isValid = v => {
    if (v == null) return false
    if (typeof v === 'string') return v.trim() !== ''
    if (Array.isArray(v)) return v.length > 0
    return true
  }

  const moreCount = computed(() => {
    let ii = 0
    Object.keys(inputSearchData.value).forEach(key => {
      const ee = inputSearchData.value[key]
      if (ee.more && isValid(ee.val)) {
        ii++
      }
    })
    return ii
  })
  const moreKeys = computed(() => {
    let ii = 0
    Object.keys(inputSearchData.value).forEach(key => {
      const ee = inputSearchData.value[key]
      if (ee.more) {
        ii++
      }
    })
    return ii
  })
  const onClickOutside = () => {
    showMore.value = false
  }
  function include() {
    return [document.querySelector('.page-filter-bar--included')]
  }
</script>

<style scoped>
  .position-inner {
    &.v-card-text {
      padding: 8px;
    }
  }
  /* GPU动画 */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.16s ease;
    will-change: transform, opacity;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .dropdown-enter-to,
  .dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
