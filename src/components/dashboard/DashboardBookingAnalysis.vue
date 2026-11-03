<template>
  <v-card border class="dashboard-panel" elevation="0" rounded="xl">
    <div class="dashboard-panel__header">
      <div class="dashboard-panel__title">{{ title }}</div>
      <div v-if="subtitle" class="dashboard-panel__subtitle">{{ subtitle }}</div>
    </div>

    <div v-if="segments.length === 0" class="dashboard-panel__empty">
      {{ emptyText }}
    </div>

    <template v-else>
      <div class="dashboard-donut">
        <VueApexCharts height="240" :options="chartOptions" :series="chartSeries" type="donut" />
      </div>

      <div class="dashboard-legend">
        <div v-for="seg in segments" :key="seg.key" class="dashboard-legend__item">
          <span class="dashboard-legend__swatch" :style="{ background: seg.color }" />
          <span class="dashboard-legend__label">{{ seg.label }}</span>
          <span class="dashboard-legend__value">({{ seg.value }})</span>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'

  defineOptions({
    name: 'DashboardBookingAnalysis',
  })

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    emptyText: {
      type: String,
      default: '',
    },
    totalLabel: {
      type: String,
      default: '',
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

  const chartSeries = computed(() => props.segments.map(item => item.value))

  const chartOptions = computed(() => ({
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
    },
    labels: props.segments.map(item => item.label),
    colors: props.segments.map(item => item.color),
    stroke: {
      width: 3,
      colors: ['#ffffff'],
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      y: {
        formatter: value => String(value),
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 600,
              color: '#94a3b8',
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: '30px',
              fontWeight: 800,
              color: '#0f172a',
              offsetY: 4,
              formatter: () => String(props.total),
            },
            total: {
              show: true,
              showAlways: true,
              label: props.totalLabel,
              fontSize: '12px',
              fontWeight: 600,
              color: '#94a3b8',
              formatter: () => String(props.total),
            },
          },
        },
      },
    },
  }))
</script>

<style lang="scss" scoped>
  .dashboard-panel {
    display: flex !important;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 24px;
  }

  .dashboard-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .dashboard-panel__title {
    color: #0f172a;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .dashboard-panel__subtitle {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .dashboard-panel__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    min-height: 240px;
  }

  .dashboard-donut {
    width: 100%;
    height: 240px;
    flex-shrink: 0;
  }

  .dashboard-legend {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
    max-height: 180px;
    overflow-y: auto;
  }

  .dashboard-legend__item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 8px;
    border-radius: 8px;
  }

  .dashboard-legend__item:hover {
    background: #f8fafc;
  }

  .dashboard-legend__label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #334155;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .dashboard-legend__value {
    flex-shrink: 0;
    color: #0f172a;
    font-size: 0.75rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .dashboard-legend__swatch {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }
</style>
