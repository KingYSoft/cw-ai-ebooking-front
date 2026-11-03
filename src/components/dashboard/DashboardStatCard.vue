<template>
  <v-card
    border
    class="dashboard-stat-card"
    elevation="0"
    rounded="lg"
    @click="$emit('click')"
  >
    <div class="dashboard-stat-card__title">{{ title }}</div>

    <div class="dashboard-stat-card__value">{{ value }}</div>
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
  })

  defineEmits(['click'])
</script>

<style lang="scss" scoped>
  .dashboard-stat-card {
    min-height: 144px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
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
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }
</style>
