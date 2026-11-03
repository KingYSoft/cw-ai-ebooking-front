<template>
  <v-card border class="dashboard-stat-card" elevation="0" rounded="xl">
    <div class="dashboard-stat-card__title">{{ title }}</div>

    <div class="dashboard-stat-card__value">
      {{ value }}
      <span v-if="unit" class="dashboard-stat-card__unit">{{ unit }}</span>
    </div>

    <div class="dashboard-stat-card__footer">
      <button class="dashboard-stat-card__more" type="button" @click="$emit('click')">
        {{ moreLabel }}
      </button>
    </div>
  </v-card>
</template>

<script setup>
  defineOptions({
    name: 'DashboardStatCard',
  })

  defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    unit: {
      type: String,
      default: '',
    },
    moreLabel: {
      type: String,
      default: 'More Details',
    },
  })

  defineEmits(['click'])
</script>

<style lang="scss" scoped>
  .dashboard-stat-card {
    min-height: 144px;
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .dashboard-stat-card__title {
    color: #334155;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .dashboard-stat-card__value {
    color: #0f172a;
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 12px 0;
  }

  .dashboard-stat-card__unit {
    color: #64748b;
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: 4px;
  }

  .dashboard-stat-card__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
  }

  .dashboard-stat-card__more {
    padding: 0;
    border: 0;
    background: transparent;
    color: #0e7490;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .dashboard-stat-card__more:hover {
    text-decoration: underline;
  }
</style>
