<template>
  <v-card border class="dashboard-monthly" elevation="0" rounded="xl">
    <div class="dashboard-monthly__header">
      <div>
        <div class="dashboard-monthly__title">{{ title }}</div>
        <div class="dashboard-monthly__subtitle">{{ subtitle }}</div>
      </div>

      <div class="dashboard-monthly__legend">
        <span class="dashboard-monthly__swatch" />
        <span>{{ legend }}</span>
      </div>
    </div>

    <div class="dashboard-monthly__chart">
      <VueApexCharts height="320" :options="chartOptions" :series="chartSeries" type="bar" />
    </div>

    <div class="dashboard-monthly__metrics">
      <div v-for="item in metrics" :key="item.label" class="dashboard-monthly__metric">
        <div class="dashboard-monthly__metric-label">{{ item.label }}</div>

        <div
          class="dashboard-monthly__metric-value"
          :class="{ 'dashboard-monthly__metric-value--accent': item.accent }"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  import { DASHBOARD_MOCK_MONTHLY } from '@/constants/dashboardMock'

  defineOptions({
    name: 'DashboardMonthlyVolume',
  })

  defineProps({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    legend: {
      type: String,
      default: '',
    },
    metrics: {
      type: Array,
      default: () => [],
    },
  })

  const chartSeries = computed(() => [
    {
      name: 'Bookings (TEU)',
      data: DASHBOARD_MOCK_MONTHLY.values,
    },
  ])

  const chartOptions = computed(() => ({
    chart: {
      type: 'bar',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
    },
    colors: ['#0f766e'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: '28px',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 0,
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories: DASHBOARD_MOCK_MONTHLY.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '11px',
          colors: '#64748b',
        },
      },
    },
    yaxis: {
      min: 0,
      max: DASHBOARD_MOCK_MONTHLY.max,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '11px',
          colors: '#64748b',
        },
      },
    },
    legend: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: value => `${value} TEU`,
      },
    },
  }))
</script>

<style lang="scss" scoped>
  .dashboard-monthly {
    display: flex !important;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 24px;
  }

  .dashboard-monthly__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .dashboard-monthly__title {
    color: #0f172a;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .dashboard-monthly__subtitle {
    color: #94a3b8;
    font-size: 0.75rem;
    margin-top: 2px;
  }

  .dashboard-monthly__legend {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #475569;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .dashboard-monthly__swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: #0f766e;
  }

  .dashboard-monthly__chart {
    width: 100%;
    min-height: 320px;
  }

  .dashboard-monthly__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }

  .dashboard-monthly__metric {
    padding: 10px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    text-align: center;
  }

  .dashboard-monthly__metric-label {
    color: #94a3b8;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .dashboard-monthly__metric-value {
    color: #1e293b;
    font-size: 0.875rem;
    font-weight: 800;
    margin-top: 2px;
  }

  .dashboard-monthly__metric-value--accent {
    color: #0e7490;
  }
</style>
