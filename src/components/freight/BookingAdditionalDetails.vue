<template>
  <div>
    <v-card-text class="py-2">
      <v-row dense>
        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div
              class="text-center text-caption text-uppercase text-on-surface opacity-70"
              style="width: 120px"
            >
              {{ detailSection('pickup') }}
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
            <FRemoteTableMenu
              v-model="inputData.pickup.add_address_name"
              bind-key="org_code"
              :bind-value="inputData.pickup.add_address_code"
              display-key="company_name"
              :fetch-method="organizationQueryOrgAddress"
              :headers="addrTableHeaders"
              :query-extra="{ address_type: 'PICKUP' }"
              :text-field-props="{
                'min-width': '100%',
              }"
              virtual
              @click-clear="onClearAddr('PICKUP')"
              @row-select="onSelectAddr($event, 'PICKUP')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('name') }}:</div>
              </template>
            </FRemoteTableMenu>

            <v-text-field
              v-model="inputData.pickup.add_address1"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('address1') }}:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.pickup.add_address2"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('address2') }}:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.pickup.add_address3"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('address3') }}:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script setup>
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  const { detailSection, detailField } = useBookingPageI18n()
  const { rescols } = useLayoutCols()

  defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
    },
    addrTableHeaders: {
      type: Array,
      default: () => [],
    },
  })

  const inputData = defineModel('input-data', { type: Object, required: true })

  const emit = defineEmits(['on-select-addr', 'on-clear-addr'])

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const onClearAddr = type => {
    emit('on-clear-addr', type)
  }
</script>
