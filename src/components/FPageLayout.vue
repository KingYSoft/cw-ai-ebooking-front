<template>
  <div>
    <!-- skeleton -->
    <template v-if="skeletonLoading">
      <v-row class="ma-0">
        <v-col :cols="rescols('c12')">
          <v-card>
            <v-card-text>
              <v-skeleton-loader type="table-heading, heading" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="pt-0" :cols="rescols('c12')">
          <v-card>
            <v-card-text>
              <v-skeleton-loader type="table-heading, heading, table-tbody, table-tfoot" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <!-- filled content -->
    <template v-else>
      <v-sheet :class="inner ? '' : 'pa-3'" color="transparent" :height="inner ? '' : contentHeight">
        <v-card :disabled="cardLoading" height="100%" :loading="cardLoading" style="display: flex; flex-direction: column;">
          <template #loader="{ isActive }">
            <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
          </template>

          <slot name="filter" />
          <v-divider v-if="showDivider" />
          <slot />
        </v-card>
      </v-sheet>
    </template>
  </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineProps({
    skeletonLoading: {
      type: Boolean,
      default: true
    },
    cardLoading: {
      type: Boolean,
      default: false
    },
    showDivider: {
      type: Boolean,
      default: true
    },
    inner: {
      type: Boolean,
      default: false
    }
  })

  const { rescols } = useLayoutCols()
  const display = useDisplay()

  const contentHeight = computed(() => display.height.value - 65 - 35)
</script>
