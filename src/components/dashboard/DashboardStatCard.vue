<template>
  <v-card
    class="dashboard-stat-card"
    elevation="2"
    rounded="lg"
    @click="$emit('click')"
  >
    <div class="text-body-1 text-medium-emphasis text-center">{{ title }}</div>

    <div class="dashboard-stat-card__value text-primary">{{ value }}</div>
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
    min-height: 168px;
    padding: 28px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .dashboard-stat-card__value {
    margin-top: 12px;
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
</style>
