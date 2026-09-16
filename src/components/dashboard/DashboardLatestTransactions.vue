<template>
  <v-card class="dashboard-panel" elevation="2" rounded="lg">
    <div class="dashboard-panel__header d-flex align-center px-5 pt-5 pb-2">
      <div class="dashboard-panel__title text-h6 font-weight-bold">{{ title }}</div>
    </div>

    <v-card-text class="dashboard-panel__body pt-2 pb-4 px-4">
      <div v-if="items.length === 0" class="text-medium-emphasis text-center py-10">
        {{ emptyText }}
      </div>

      <div v-else class="dashboard-txn-list">
        <button
          v-for="item in items"
          :key="item.pk || item.id"
          class="dashboard-txn-list__item"
          type="button"
          @click="$emit('select', item)"
        >
          <span class="dashboard-txn-list__date text-medium-emphasis">{{ item.dateLabel }}</span>

          <span class="dashboard-txn-list__main">
            <span class="dashboard-txn-list__name text-primary">{{ item.title }}</span>
          </span>

          <span class="dashboard-txn-list__container font-weight-medium">{{ item.container }}</span>

          <span class="dashboard-txn-list__cbm font-weight-medium">{{ item.cbm }}</span>
        </button>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  defineOptions({
    name: 'DashboardLatestTransactions',
  })

  defineProps({
    title: {
      type: String,
      required: true,
    },
    emptyText: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  })

  defineEmits(['select'])
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

  .dashboard-txn-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dashboard-txn-list__item {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) minmax(88px, 120px) 72px;
    align-items: center;
    column-gap: 16px;
    width: 100%;
    padding: 10px 8px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .dashboard-txn-list__item:hover {
    background: rgba(var(--v-theme-on-surface), 0.04);
  }

  .dashboard-txn-list__date {
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .dashboard-txn-list__main {
    min-width: 0;
  }

  .dashboard-txn-list__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashboard-txn-list__container,
  .dashboard-txn-list__cbm {
    min-width: 0;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
</style>
