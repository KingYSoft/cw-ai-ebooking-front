<template>
  <FPageLayout :card-loading="loading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="tabTitle">
      <template #actions>
        <v-btn
          color="primary"
          :disabled="loading"
          size="small"
          variant="flat"
          @click.stop="onExport"
        >
          <v-icon start>mdi-download</v-icon>
          {{ t('$vuetify.custom.poReportsPage.button.export') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <v-sheet class="overflow-y-auto pa-3" style="flex: 1">
      <!-- 筛选条件 -->
      <v-card class="mb-3">
        <v-card-text>
          <v-row dense>
            <v-col :cols="rescols('c12l4m4')">
              <div class="d-flex align-center ga-1">
                <f-date-picker
                  v-model="filterParams.date_from"
                  density="compact"
                  hide-details
                  :label="t('$vuetify.custom.poReportsPage.filter.dateFrom')"
                  variant="outlined"
                />
                -
                <f-date-picker
                  v-model="filterParams.date_to"
                  density="compact"
                  hide-details
                  :label="t('$vuetify.custom.poReportsPage.filter.dateTo')"
                  variant="outlined"
                />
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3m3s6')">
              <v-select
                v-model="filterParams.order_status"
                clearable
                density="compact"
                hide-details
                :items="orderStatusList"
                :label="t('$vuetify.custom.poReportsPage.filter.orderStatus')"
                variant="outlined"
              />
            </v-col>

            <v-col :cols="rescols('c12l3m3s6')">
              <v-select
                v-model="filterParams.transport_mode"
                clearable
                density="compact"
                hide-details
                :items="transportModeList"
                :label="t('$vuetify.custom.poReportsPage.filter.transportMode')"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center" :cols="rescols('c12l2m2')">
              <v-btn size="small" variant="outlined" @click="onReset">
                <v-icon start>mdi-refresh</v-icon>
                {{ t('$vuetify.custom.poReportsPage.button.reset') }}
              </v-btn>

              <v-btn class="ml-2" color="primary" size="small" variant="flat" @click="onFilter">
                <v-icon start>mdi-filter</v-icon>
                {{ t('$vuetify.custom.poReportsPage.button.applyFilter') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 统计卡片 -->
      <v-row class="mb-3">
        <v-col :cols="rescols('c12l3m6')">
          <v-card color="primary" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('$vuetify.custom.poReportsPage.statistics.totalPOs') }}
                  </div>

                  <div class="text-h4 font-weight-bold">{{ statistics.total_count }}</div>
                </div>

                <v-icon color="primary" size="48">mdi-clipboard-list</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="rescols('c12l3m6')">
          <v-card color="success" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('$vuetify.custom.poReportsPage.statistics.completed') }}
                  </div>

                  <div class="text-h4 font-weight-bold">{{ statistics.completed_count }}</div>
                </div>

                <v-icon color="success" size="48">mdi-check-circle</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="rescols('c12l3m6')">
          <v-card color="warning" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('$vuetify.custom.poReportsPage.statistics.inProgress') }}
                  </div>

                  <div class="text-h4 font-weight-bold">{{ statistics.in_progress_count }}</div>
                </div>

                <v-icon color="warning" size="48">mdi-progress-clock</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="rescols('c12l3m6')">
          <v-card color="info" variant="tonal">
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('$vuetify.custom.poReportsPage.statistics.totalAmount') }}
                  </div>

                  <div class="text-h5 font-weight-bold">
                    {{ formatCurrency(statistics.total_amount) }}
                  </div>
                </div>

                <v-icon color="info" size="48">mdi-currency-usd</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- 按状态分布 -->
        <v-col :cols="rescols('c12m6')">
          <v-card :loading="loading">
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-chart-pie</v-icon>
              {{ t('$vuetify.custom.poReportsPage.section.statusDistribution') }}
            </v-card-title>

            <v-divider />

            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.status') }}</th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.count') }}
                    </th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.percentage') }}
                    </th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.amount') }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in statusDistribution" :key="item.status">
                    <td>
                      <StatusBadge :text="item.status" />
                    </td>

                    <td class="text-right">{{ item.count }}</td>
                    <td class="text-right">{{ item.percentage }}%</td>
                    <td class="text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 按运输方式分布 -->
        <v-col :cols="rescols('c12m6')">
          <v-card :loading="loading">
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-truck</v-icon>
              {{ t('$vuetify.custom.poReportsPage.section.transportModeDistribution') }}
            </v-card-title>

            <v-divider />

            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.transportMode') }}</th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.count') }}
                    </th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.percentage') }}
                    </th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.amount') }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in transportDistribution" :key="item.mode">
                    <td>
                      <v-chip color="primary" density="compact" size="small" variant="tonal">
                        {{ item.mode }}
                      </v-chip>
                    </td>

                    <td class="text-right">{{ item.count }}</td>
                    <td class="text-right">{{ item.percentage }}%</td>
                    <td class="text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 月度趋势 -->
      <v-card class="mt-3" :loading="loading">
        <v-card-title class="d-flex align-center">
          <v-icon start>mdi-chart-line</v-icon>
          {{ t('$vuetify.custom.poReportsPage.section.monthlyTrend') }}
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-table density="compact">
            <thead>
              <tr>
                <th>{{ t('$vuetify.custom.poReportsPage.table.month') }}</th>
                <th class="text-right">{{ t('$vuetify.custom.poReportsPage.table.poCount') }}</th>

                <th class="text-right">
                  {{ t('$vuetify.custom.poReportsPage.table.totalAmount') }}
                </th>

                <th class="text-right">{{ t('$vuetify.custom.poReportsPage.table.avgAmount') }}</th>
                <th>{{ t('$vuetify.custom.poReportsPage.table.trend') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in monthlyTrend" :key="item.month">
                <td class="font-weight-medium">{{ item.month }}</td>
                <td class="text-right">{{ item.count }}</td>
                <td class="text-right">{{ formatCurrency(item.amount) }}</td>
                <td class="text-right">{{ formatCurrency(item.avg_amount) }}</td>

                <td>
                  <v-icon
                    v-if="index > 0 && item.amount > monthlyTrend[index - 1].amount"
                    color="success"
                    size="small"
                  >
                    mdi-trending-up
                  </v-icon>

                  <v-icon
                    v-else-if="index > 0 && item.amount < monthlyTrend[index - 1].amount"
                    color="error"
                    size="small"
                  >
                    mdi-trending-down
                  </v-icon>

                  <v-icon v-else color="grey" size="small"> mdi-minus </v-icon>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Top Buyers/Sellers -->
      <v-row class="mt-3">
        <v-col :cols="rescols('c12m6')">
          <v-card :loading="loading">
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-account-group</v-icon>
              {{ t('$vuetify.custom.poReportsPage.section.topBuyers') }}
            </v-card-title>

            <v-divider />

            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.rank') }}</th>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.buyerName') }}</th>
                    <th class="text-right">{{ t('$vuetify.custom.poReportsPage.table.poCount') }}</th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.totalAmount') }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in topBuyers" :key="item.name">
                    <td>{{ index + 1 }}</td>
                    <td class="font-weight-medium">{{ item.name }}</td>
                    <td class="text-right">{{ item.count }}</td>
                    <td class="text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="rescols('c12m6')">
          <v-card :loading="loading">
            <v-card-title class="d-flex align-center">
              <v-icon start>mdi-store</v-icon>
              {{ t('$vuetify.custom.poReportsPage.section.topSellers') }}
            </v-card-title>

            <v-divider />

            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.rank') }}</th>
                    <th>{{ t('$vuetify.custom.poReportsPage.table.sellerName') }}</th>
                    <th class="text-right">{{ t('$vuetify.custom.poReportsPage.table.poCount') }}</th>

                    <th class="text-right">
                      {{ t('$vuetify.custom.poReportsPage.table.totalAmount') }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in topSellers" :key="item.name">
                    <td>{{ index + 1 }}</td>
                    <td class="font-weight-medium">{{ item.name }}</td>
                    <td class="text-right">{{ item.count }}</td>
                    <td class="text-right">{{ formatCurrency(item.amount) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </FPageLayout>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useLocale } from 'vuetify'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  const { rescols } = useLayoutCols()
  const { t } = useLocale()

  defineOptions({ name: 'PoManagementReports' })
  definePage({
    name: 'po_management_reports',
    icon: 'mdi-chart-box-outline',
    menu: true,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'PO Reports',
      //   permissions: 'PERMISSION_PO_REPORTS',
    },
  })

  const appStore = useAppStore()

  const tabTitle = computed(() => {
    return t('$vuetify.custom.poReportsPage.title')
  })

  // 下拉选项
  const orderStatusList = ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']
  const transportModeList = ['SEA', 'AIR', 'ROAD', 'RAIL', 'MULTIMODAL']

  // 筛选参数
  const defaultFilterParams = () => ({
    date_from: '',
    date_to: '',
    order_status: null,
    transport_mode: null,
  })

  const filterParams = ref(defaultFilterParams())
  const loading = ref(false)
  const skeletonLoading = ref(true)

  // 统计数据
  const statistics = ref({
    total_count: 0,
    completed_count: 0,
    in_progress_count: 0,
    total_amount: 0,
  })

  // 状态分布
  const statusDistribution = ref([])

  // 运输方式分布
  const transportDistribution = ref([])

  // 月度趋势
  const monthlyTrend = ref([])

  // Top Buyers
  const topBuyers = ref([])

  // Top Sellers
  const topSellers = ref([])

  // 格式化货币
  const formatCurrency = num => {
    if (num === null || num === undefined) return 'USD 0.00'
    return (
      'USD ' +
      Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  // 加载报表数据
  const loadReportData = async () => {
    try {
      loading.value = true

      // 模拟数据 - 实际项目中应调用API
      // const { success, data } = await poReportStatistics(filterParams.value)

      // 模拟统计数据
      statistics.value = {
        total_count: 156,
        completed_count: 89,
        in_progress_count: 42,
        total_amount: 1_250_680.5,
      }

      // 模拟状态分布
      statusDistribution.value = [
        { status: 'Draft', count: 15, percentage: 9.6, amount: 125_000 },
        { status: 'Confirmed', count: 10, percentage: 6.4, amount: 98_500 },
        { status: 'In Progress', count: 42, percentage: 26.9, amount: 385_600 },
        { status: 'Completed', count: 89, percentage: 57.1, amount: 641_580.5 },
      ]

      // 模拟运输方式分布
      transportDistribution.value = [
        { mode: 'SEA', count: 85, percentage: 54.5, amount: 680_500 },
        { mode: 'AIR', count: 45, percentage: 28.8, amount: 425_180.5 },
        { mode: 'ROAD', count: 18, percentage: 11.5, amount: 98_500 },
        { mode: 'RAIL', count: 8, percentage: 5.2, amount: 46_500 },
      ]

      // 模拟月度趋势
      monthlyTrend.value = [
        { month: '2024-07', count: 22, amount: 185_600, avg_amount: 8436.36 },
        { month: '2024-08', count: 28, amount: 215_800, avg_amount: 7707.14 },
        { month: '2024-09', count: 25, amount: 198_500, avg_amount: 7940 },
        { month: '2024-10', count: 32, amount: 265_300, avg_amount: 8290.63 },
        { month: '2024-11', count: 26, amount: 198_480.5, avg_amount: 7634.17 },
        { month: '2024-12', count: 23, amount: 187_000, avg_amount: 8130.43 },
      ]

      // 模拟Top Buyers
      topBuyers.value = [
        { name: 'ABC Corporation', count: 25, amount: 285_600 },
        { name: 'XYZ Trading Co.', count: 18, amount: 198_500 },
        { name: 'Global Imports Ltd', count: 15, amount: 165_800 },
        { name: 'Pacific Traders', count: 12, amount: 125_000 },
        { name: 'Eastern Supplies', count: 10, amount: 98_500 },
      ]

      // 模拟Top Sellers
      topSellers.value = [
        { name: 'China Manufacturing Co.', count: 35, amount: 385_600 },
        { name: 'Vietnam Exports Ltd', count: 28, amount: 298_500 },
        { name: 'India Suppliers Inc', count: 22, amount: 215_800 },
        { name: 'Thailand Trading', count: 18, amount: 185_600 },
        { name: 'Malaysia Products', count: 15, amount: 165_180.5 },
      ]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      skeletonLoading.value = false
    }
  }

  // 应用筛选
  const onFilter = () => {
    loadReportData()
  }

  // 重置筛选
  const onReset = () => {
    filterParams.value = defaultFilterParams()
    loadReportData()
  }

  // 导出报表
  const onExport = () => {
    appStore.openMessage({
      content: t('$vuetify.custom.poReportsPage.message.exportComingSoon'),
      color: 'info',
    })
  }

  // 初始化
  onMounted(() => {
    loadReportData()
  })
</script>

<style scoped>
  .v-table th {
    font-weight: 600 !important;
  }
</style>
