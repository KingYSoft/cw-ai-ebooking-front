<template>
  <v-row dense>
    <v-col :cols="rescols('c12m6')">
      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            {{ groupEdit('detail.section.groupDetail') }}
          </div>
        </v-divider>

        <v-row dense>
          <v-col :cols="rescols('c12m6')">
            <v-text-field
              id="1@code"
              v-model="inputData.group_detail.code"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :rules="inputDataRules.code"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{ groupField('code') }}
                  <span class="text-red">*</span>
                  :
                </div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-switch
              v-model="inputData.group_detail.is_active"
              color="success"
              density="compact"
              :false-value="0"
              hide-details
              :true-value="1"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120 mr-2">{{ groupField('isActive') }}:</div>
              </template>
            </v-switch>
          </v-col>

          <v-col :cols="rescols('c12')">
            <v-textarea
              v-model="inputData.group_detail.desc"
              auto-grow
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              rows="3"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ groupField('description') }}:</div>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script setup>
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'GroupDetail' })

  const { groupEdit, groupField } = useSystemPageI18n()
  const { rescols } = useLayoutCols()

  defineProps({
    inputDataRules: {
      type: Object,
      default: () => ({}),
    },
  })

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
</script>
