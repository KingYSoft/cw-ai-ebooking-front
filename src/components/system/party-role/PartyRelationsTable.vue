<template>
  <v-sheet class="overflow-y-auto" color="transparent" :height="maxDisplayHeight">
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      {{ t('relations') }}
      <v-chip size="small">{{ relations.length }}</v-chip>
      <v-spacer />

      <v-btn
        color="primary"
        :disabled="disabled"
        prepend-icon="mdi-plus"
        size="small"
        @click="openBatch(0)"
      >
        {{ t('batchAdd') }}
      </v-btn>

      <v-btn
        color="error"
        :disabled="disabled || selected.length === 0"
        size="small"
        variant="tonal"
        @click="deleteKeys = [...selected]"
      >
        {{ t('deleteSelected') }}
      </v-btn>
    </v-card-title>

    <v-card-text class="py-1 text-caption">{{ t('relationHint') }}</v-card-text>

    <v-data-table
      class="party-relations-table"
      density="comfortable"
      disable-sort
      fixed-header
      :headers="headers"
      :height="maxDisplayHeight - 88"
      hide-default-footer
      :items="relations"
      :items-per-page="-1"
    >
      <template #header.selection>
        <v-checkbox-btn
          :aria-label="t('selectAll')"
          :disabled="disabled || relations.length === 0"
          :indeterminate="selected.length > 0 && selected.length < relations.length"
          :model-value="relations.length > 0 && selected.length === relations.length"
          @update:model-value="toggleAll"
        />
      </template>

      <template #body>
        <tr v-if="mergedRows.length === 0">
          <td class="text-center" colspan="5">{{ t('noRelations') }}</td>
        </tr>

        <tr
          v-for="{ relation, spans } in mergedRows"
          :key="relationRowKey(relation)"
          :data-relation-key="relationRowKey(relation)"
        >
          <td class="index-cell">
            <v-checkbox-btn
              v-model="selected"
              :aria-label="t('selectRelation')"
              :disabled="disabled"
              :value="relationRowKey(relation)"
            />
          </td>

          <template v-for="(column, index) in partyColumns" :key="column">
            <td v-if="spans[index]" class="party-cell" :rowspan="spans[index]">
              <div>
                {{ relation[`${column}_org_code`] || relation[`${column}_org_header_pk`] }}
              </div>

              <div
                v-if="relation[`${column}_org_header_pk`]"
                class="text-caption text-medium-emphasis"
              >
                {{ relation[`${column}_org_name`] }}
              </div>

              <div v-if="index < 2" class="d-flex flex-wrap ga-1 mt-1">
                <v-btn
                  v-if="index === 0"
                  color="primary"
                  :disabled="disabled"
                  size="x-small"
                  variant="outlined"
                  @click="openBatch(1, relation)"
                >
                  + {{ t('consignee') }}
                </v-btn>

                <v-btn
                  color="primary"
                  :disabled="disabled"
                  size="x-small"
                  variant="outlined"
                  @click="openBatch(2, relation, index === 0)"
                >
                  + {{ t('shipper') }}
                </v-btn>
              </div>
            </td>
          </template>

          <td class="text-no-wrap action-cell">
            <v-btn
              :aria-label="t('edit')"
              color="info"
              density="comfortable"
              :disabled="disabled"
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="openEdit(relation)"
            />

            <v-btn
              :aria-label="t('delete')"
              color="red"
              density="comfortable"
              :disabled="disabled"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="deleteKeys = [relationRowKey(relation)]"
            />
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="batchVisible" max-width="750" persistent>
      <v-form class="ref-form-pre" color="background">
        <v-card>
          <v-card-title>{{ t('batchAdd') }}</v-card-title>

          <v-card-text class="pa-4">
            <v-select
              v-model="batchLevel"
              class="mb-2"
              density="compact"
              hide-details
              :items="levelOptions"
              variant="outlined"
              @update:model-value="resetBatch"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ t('addLevel') }}:</div>
              </template>
            </v-select>

            <div v-for="(column, index) in partyColumns" :key="column" class="mb-2">
              <PartyOrganizationField
                v-if="index < batchLevel"
                v-model="parents[column]"
                :label="t(column)"
              />

              <PartyOrganizationField
                v-if="index === batchLevel"
                v-model="batchSelection"
                :label="t(column)"
                multiple
              />
            </div>

            <v-alert class="mt-2" density="compact" icon-size="small" type="info" variant="tonal">
              <div class="text-caption">{{ t('batchHint') }}</div>
            </v-alert>

            <div class="mt-2 text-caption" role="status ">
              {{
                t(
                  'batchSummary',
                  batchPreview.addedCount,
                  batchPreview.replacedCount,
                  batchPreview.duplicateCount,
                )
              }}
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn @click="batchVisible = false">{{ t('cancel') }}</v-btn>

            <v-btn color="primary" :disabled="batchSelection.length === 0" @click="applyBatch">
              {{ t('apply') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="editVisible" max-width="700" persistent>
      <v-form class="ref-form-pre" color="background">
        <v-card>
          <v-card-title>{{ t('editRelation') }}</v-card-title>

          <v-card-text>
            <PartyOrganizationField
              v-for="column in partyColumns"
              :key="column"
              v-model="editParties[column]"
              class="mb-2"
              :label="t(column)"
            />

            <v-alert v-if="editError" density="compact" type="error">{{ t(editError) }}</v-alert>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="editVisible = false">{{ t('cancel') }}</v-btn>
            <v-btn color="primary" @click="applyEdit">{{ t('apply') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog max-width="450" :model-value="deleteKeys.length > 0" persistent>
      <v-card>
        <v-card-title>{{ t('delete') }}</v-card-title>
        <v-card-text>{{ t('deleteRelationsMessage', deleteKeys.length) }}</v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteKeys = []">{{ t('cancel') }}</v-btn>
          <v-btn color="error" @click="applyDelete">{{ t('confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import {
    addRelationBatch,
    buildMergedRelationRows,
    hasParty,
    partyColumns,
    relationKey,
    relationRowKey,
  } from '@/composables/partyRoleRelations'
  import { usePartyRoleI18n } from '@/composables/usePartyRoleI18n'
  import PartyOrganizationField from './PartyOrganizationField.vue'

  defineProps({
    disabled: Boolean,
    maxDisplayHeight: {
      type: Number,
      default: 0,
    },
  })
  const relations = defineModel('relations', { type: Array, default: () => [] })
  const { t } = usePartyRoleI18n()
  const selected = ref([])
  const deleteKeys = ref([])
  const mergedRows = computed(() => buildMergedRelationRows(relations.value))
  const headers = computed(() => [
    { title: '', key: 'selection', align: 'center', width: 40 },
    ...partyColumns.map(column => ({ title: t(column), key: column, minWidth: 180 })),
    { title: t('actions'), key: 'actions', width: 100 },
  ])
  watch(relations, rows => {
    const keys = new Set(rows.map(relationRowKey))
    selected.value = selected.value.filter(key => keys.has(key))
  })
  function toggleAll(value) {
    selected.value = value ? relations.value.map(relationRowKey) : []
  }
  function applyDelete() {
    const keys = new Set(deleteKeys.value)
    relations.value = relations.value.filter(row => !keys.has(relationRowKey(row)))
    deleteKeys.value = []
  }

  const batchVisible = ref(false)
  const batchLevel = ref(0)
  const parents = ref({})
  const batchSelection = ref([])
  const levelOptions = computed(() =>
    partyColumns.map((column, value) => ({ title: t(column), value })),
  )
  const toOrganization = (row, column) =>
    row[`${column}_org_header_pk`]
      ? {
          pk: row[`${column}_org_header_pk`],
          org_code: row[`${column}_org_code`],
          org_full_name: row[`${column}_org_name`],
        }
      : null
  const fromParties = parties =>
    Object.fromEntries(
      partyColumns.flatMap(column => [
        [`${column}_org_header_pk`, parties[column]?.pk || null],
        [`${column}_org_code`, parties[column]?.org_code || null],
        [`${column}_org_name`, parties[column]?.org_full_name || null],
      ]),
    )

  function resetBatch() {
    batchSelection.value = []
    for (let index = batchLevel.value; index < partyColumns.length; index++) {
      parents.value[partyColumns[index]] = null
    }
  }
  function openBatch(level, row = {}, skipConsignee = false) {
    batchLevel.value = level
    parents.value = Object.fromEntries(
      partyColumns.map((column, index) => [
        column,
        index < level && !(skipConsignee && index === 1) ? toOrganization(row, column) : null,
      ]),
    )
    batchSelection.value = []
    batchVisible.value = true
  }
  const batchPreview = computed(() =>
    addRelationBatch(
      relations.value,
      batchSelection.value.map(item => {
        const parties = Object.fromEntries(
          partyColumns.map((column, index) => [
            column,
            index < batchLevel.value
              ? parents.value[column]
              : index === batchLevel.value
                ? item
                : null,
          ]),
        )
        return fromParties(parties)
      }),
    ),
  )
  function applyBatch() {
    relations.value = batchPreview.value.relations
    batchVisible.value = false
  }

  const editVisible = ref(false)
  const editingKey = ref(null)
  const editParties = ref({})
  const editError = ref('')
  function openEdit(row) {
    editingKey.value = relationRowKey(row)
    editParties.value = Object.fromEntries(
      partyColumns.map(column => [column, toOrganization(row, column)]),
    )
    editError.value = ''
    editVisible.value = true
  }
  function applyEdit() {
    const edited = fromParties(editParties.value)
    if (!hasParty(edited)) {
      editError.value = 'partyRequired'
      return
    }
    if (
      relations.value.some(
        row => relationRowKey(row) !== editingKey.value && relationKey(row) === relationKey(edited),
      )
    ) {
      editError.value = 'duplicateRelation'
      return
    }
    const original = relations.value.find(row => relationRowKey(row) === editingKey.value)
    if (original.pk) {
      relations.value = relations.value.map(row => (row === original ? { ...row, ...edited } : row))
    } else {
      // A local row will be an insertion on Save; apply the same ancestor cleanup now.
      relations.value = addRelationBatch(
        relations.value.filter(row => row !== original),
        [{ ...original, ...edited }],
      ).relations
    }
    editVisible.value = false
  }
</script>

<style scoped>
  .party-relations-table :deep(.party-cell) {
    vertical-align: top;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    padding-left: 8px;
    border-inline-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .party-relations-table :deep(.action-cell) {
    border-inline-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
  .party-relations-table :deep(.index-cell) {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
</style>
