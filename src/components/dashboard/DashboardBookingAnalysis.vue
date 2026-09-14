<template>
  <v-card class="dashboard-panel" elevation="2" rounded="lg">
    <div class="dashboard-panel__header d-flex align-center px-5 pt-5 pb-2">
      <div class="dashboard-panel__title text-h6 font-weight-bold">{{ title }}</div>
    </div>

    <v-card-text class="dashboard-panel__body px-5 pb-5">
      <div class="d-flex justify-space-between mb-6">
        <div v-for="item in summaries" :key="item.key" class="text-center flex-grow-1">
          <div class="text-caption text-medium-emphasis text-lowercase">{{ item.label }}</div>

          <div class="text-h6 font-weight-bold">{{ item.value }}</div>
        </div>
      </div>

      <div class="d-flex justify-end mb-2">
        <v-select
          density="compact"
          hide-details
          item-title="title"
          item-value="value"
          :items="periodItems"
          max-width="160"
          :model-value="period"
          variant="plain"
          @update:model-value="$emit('update:period', $event)"
        />
      </div>

      <div v-if="segments.length === 0" class="text-medium-emphasis text-center py-10">
        {{ emptyText }}
      </div>

      <div v-else class="d-flex align-center ga-6 flex-wrap">
        <div class="dashboard-donut">
          <svg class="dashboard-donut__svg" viewBox="0 0 120 120">
            <g transform="rotate(-90 60 60)">
              <circle
                cx="60"
                cy="60"
                fill="none"
                r="42"
                stroke="rgba(var(--v-theme-on-surface), 0.08)"
                stroke-width="16"
              />

              <circle
                v-for="seg in donutSegments"
                :key="seg.key"
                cx="60"
                cy="60"
                fill="none"
                r="42"
                :stroke="seg.color"
                :stroke-dasharray="seg.dashArray"
                :stroke-dashoffset="seg.dashOffset"
                stroke-linecap="butt"
                stroke-width="16"
              />
            </g>
          </svg>

          <div class="dashboard-donut__center">
            <div class="text-caption text-medium-emphasis">{{ totalLabel }}</div>

            <div class="text-h5 font-weight-bold">{{ total }}</div>
          </div>
        </div>

        <div class="dashboard-legend flex-grow-1">
          <div v-for="seg in segments" :key="seg.key" class="dashboard-legend__item">
            <span class="dashboard-legend__swatch" :style="{ background: seg.color }" />

            <span class="dashboard-legend__label text-body-2 text-medium-emphasis">{{ seg.label }}</span>

            <span class="dashboard-legend__value text-body-2 font-weight-medium">{{ seg.value }}</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  defineOptions({
    name: 'DashboardBookingAnalysis',
  })

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    emptyText: {
      type: String,
      default: '',
    },
    totalLabel: {
      type: String,
      default: '',
    },
    summaries: {
      type: Array,
      default: () => [],
    },
    period: {
      type: String,
      default: 'lastMonth',
    },
    periodItems: {
      type: Array,
      default: () => [],
    },
    segments: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
  })

  defineEmits(['update:period'])

  const RADIUS = 42
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const donutSegments = computed(() => {
    const total = props.segments.reduce((sum, item) => sum + item.value, 0) || 1
    let offset = 0
    return props.segments.map(item => {
      const length = (item.value / total) * CIRCUMFERENCE
      const seg = {
        ...item,
        dashArray: `${length} ${CIRCUMFERENCE}`,
        dashOffset: -offset,
      }
      offset += length
      return seg
    })
  })
</script>

<style lang="scss" scoped>
  .dashboard-panel {
    display: flex !important;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .dashboard-panel__title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashboard-panel__header {
    flex: 0 0 auto;
  }

  .dashboard-panel__body {
    flex: 1 1 0%;
    min-height: 0;
    overflow-y: auto;
  }

  .dashboard-donut {
    position: relative;
    width: 180px;
    height: 180px;
    flex-shrink: 0;
  }

  .dashboard-donut__svg {
    width: 100%;
    height: 100%;
  }

  .dashboard-donut__center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
    padding: 0 24px;
  }

  .dashboard-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 120px;
  }

  .dashboard-legend__item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .dashboard-legend__label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashboard-legend__value {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  .dashboard-legend__swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }
</style>
