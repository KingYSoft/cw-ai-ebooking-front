<template>
  <div class="ref-form-pre mt-2">
    <v-row dense>
      <v-col class="d-flex flex-column" cols="12" md="6">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              density="compact"
              hide-details
              min-width="100%"
              :model-value="inputData.bkg_house_bill"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('hblNo') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col class="d-flex align-center" cols="12" sm="6">
            <v-checkbox
              color="primary"
              density="compact"
              false-value="N"
              hide-details
              :model-value="shipperLoadAndCount"
              true-value="Y"
            >
              <template #label>
                <div class="text-caption">{{ detailField('shipperLoadAndCount') }}</div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>

        <v-row v-for="(row, rowIndex) in portRows" :key="rowIndex" dense>
          <v-col v-for="port in row" :key="port.codeKey" cols="12" sm="6">
            <div class="d-flex align-center ga-1 w-100">
              <div class="text-caption text-end w-label-100">
                {{ detailField(port.labelKey) }}<span class="text-red">*</span>:
              </div>

              <v-text-field
                density="compact"
                hide-details
                max-width="90px"
                :model-value="inputData[port.codeKey]"
                variant="outlined"
              />

              <v-text-field
                class="flex-1-1"
                density="compact"
                hide-details
                min-width="auto"
                :model-value="inputData[port.nameKey]"
                variant="outlined"
              />
            </div>
          </v-col>
        </v-row>

        <div class="d-flex align-center ga-1 w-100 mt-1">
          <div class="text-caption text-end w-label-100">{{ detailField('freightTerms') }}:</div>

          <v-select
            density="compact"
            hide-details
            :items="freightTermItems"
            max-width="54px"
            :model-value="inputData.bkg_freight_terms"
            variant="outlined"
          />

          <div class="text-caption text-end">{{ detailField('deliveryMode') }}:</div>

          <v-select
            class="flex-1-1"
            density="compact"
            hide-details
            :items="deliveryModeItems"
            min-width="auto"
            :model-value="inputData.bkg_delivery_mode"
            variant="outlined"
          />

          <div class="text-caption text-end">{{ detailField('payAt') }}:</div>

          <v-select
            class="flex-1-1"
            density="compact"
            hide-details
            :items="payAtItems"
            min-width="auto"
            :model-value="payAt"
            variant="outlined"
          />
        </div>

        <v-row class="si-hbl-textarea-row mt-1" dense>
          <v-col cols="12" sm="6">
            <v-textarea
              :auto-grow="false"
              class="si-hbl-textarea"
              density="compact"
              hide-details
              :model-value="inputData.bkg_marks_nos"
              no-resize
              rows="9"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('marksNos') }}:</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12" sm="6">
            <v-textarea
              :auto-grow="false"
              class="si-hbl-textarea"
              density="compact"
              hide-details
              :model-value="inputData.bkg_goods_description"
              no-resize
              rows="9"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('goodDesc') }}:</div>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-select
              density="compact"
              hide-details
              :items="asAgentOptionItems"
              min-width="100%"
              :model-value="asAgentOption"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  {{ detailField('asAgentOption') }}:
                </div>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              density="compact"
              hide-details
              min-width="100%"
              :model-value="asAgentDetail"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  {{ detailField('asAgentDetail') }}:
                </div>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="d-flex align-start flex-column flex-wrap ga-1">
              <v-text-field
                density="compact"
                hide-details
                min-width="100%"
                :model-value="inputData.bkg_intended_vessel"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('vessel') }}<span class="text-red">*</span>:
                  </div>
                </template>
              </v-text-field>

              <v-text-field
                density="compact"
                hide-details
                min-width="100%"
                :model-value="inputData.bkg_voyage"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('voyage') }}<span class="text-red">*</span>:
                  </div>
                </template>
              </v-text-field>
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="d-flex align-start flex-column flex-wrap ga-1">
              <FDatePicker
                :date-value="inputData.bkg_etd"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('etd') }}<span class="text-red">*</span>:
                  </div>
                </template>
              </FDatePicker>

              <FDatePicker
                :date-value="inputData.bkg_eta"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('eta') }}<span class="text-red">*</span>:
                  </div>
                </template>
              </FDatePicker>
            </div>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              density="compact"
              hide-details
              :label="detailField('noOfPackage')"
              :model-value="packageDesc"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
              density="compact"
              hide-details
              :label="detailField('grossWeight')"
              :model-value="weightDesc"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
              density="compact"
              hide-details
              :label="detailField('cbm')"
              :model-value="cbmDesc"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-text-field
          class="mt-1"
          density="compact"
          hide-details
          :model-value="sayTotal"
          variant="outlined"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">{{ detailField('sayTotal') }}:</div>
          </template>
        </v-text-field>

        <v-row class="mt-1" dense>
          <v-col cols="12" sm="8">
            <div class="d-flex align-center ga-1 w-100">
              <v-checkbox
                color="primary"
                density="compact"
                false-value="N"
                hide-details
                model-value="N"
                true-value="Y"
              >
                <template #label>
                  <div class="text-caption">{{ detailField('wooden') }}:</div>
                </template>
              </v-checkbox>

              <v-text-field
                class="flex-1-1"
                density="compact"
                hide-details
                model-value="NO WOODEN PRODUCE HAS BEEN USED IN PACKING"
                variant="outlined"
              />
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <FDatePicker
              :date-value="inputData.bkg_shipped_on_board_date"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end">{{ detailField('onBoard') }}:</div>
              </template>
            </FDatePicker>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="d-flex align-center ga-1 w-100">
              <div class="text-caption text-end w-label-110">{{ detailField('cargoValue') }}:</div>

              <v-select
                auto-select-first
                autocomplete="off"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="currencyItems"
                :list-props="{ density: 'compact' }"
                max-width="60px"
                :model-value="inputData.bkg_goods_value_currency"
                no-filter
                variant="underlined"
              />

              <v-text-field
                class="flex-1-1"
                density="compact"
                hide-details
                :model-value="inputData.bkg_goods_value"
                variant="outlined"
              />
            </div>
          </v-col>

          <v-col class="d-flex align-center" cols="12" sm="8">
            <div class="d-flex align-center ga-1 w-100">
              <div class="text-caption text-end">{{ detailField('additionalCharges') }}:</div>

              <v-select
                auto-select-first
                autocomplete="off"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="currencyItems"
                :list-props="{ density: 'compact' }"
                max-width="60px"
                no-filter
                variant="underlined"
              />

              <v-text-field
                class="flex-1-1"
                density="compact"
                hide-details
                variant="outlined"
              />

              <v-checkbox
                color="primary"
                density="compact"
                false-value="N"
                hide-details
                model-value="N"
                true-value="Y"
              >
                <template #label>
                  <div class="text-caption">{{ detailField('asArgd') }}</div>
                </template>
              </v-checkbox>
            </div>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="4">
            <FDatePicker max="2099-12-31" min="2000-01-01">
              <template #prepend>
                <div class="text-caption text-end w-label-110">{{ detailField('issueDate') }}:</div>
              </template>
            </FDatePicker>
          </v-col>

          <v-col cols="12" sm="5">
            <div class="d-flex align-center ga-1 w-100">
              <div class="text-caption text-end">{{ detailField('issuedPlace') }}:</div>

              <v-text-field
                density="compact"
                hide-details
                max-width="90px"
                variant="outlined"
              />

              <v-text-field
                class="flex-1-1"
                density="compact"
                hide-details
                min-width="auto"
                variant="outlined"
              />
            </div>
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              density="compact"
              hide-details
              min-width="100%"
              model-value="1"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end">{{ detailField('noOfBl') }}:</div>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'BookingShippingInstructionRoute',
  })

  defineProps({
    inputDataRules: {
      type: Object,
      default: () => ({}),
    },
    queryPortList: {
      type: Array,
      default: () => [],
    },
  })

  const inputData = defineModel('input-data', { type: Object, required: true })
  const { detailField } = useBookingPageI18n()
  const appStore = useAppStore()

  const portRows = [
    [
      { labelKey: 'origin', codeKey: 'bkg_origin', nameKey: 'bkg_origin_name' },
      { labelKey: 'polLoad', codeKey: 'bkg_load_port', nameKey: 'bkg_load_port_name' },
    ],
    [
      { labelKey: 'destination', codeKey: 'bkg_destination', nameKey: 'bkg_destination_name' },
      { labelKey: 'podDischarge', codeKey: 'bkg_discharge_port', nameKey: 'bkg_discharge_port_name' },
    ],
  ]

  const deliveryModeItems = ['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']
  const payAtItems = ['ORIGIN', 'DESTINATION']
  const asAgentOptionItems = ['AS CARRIER', 'AS AGENT', 'AS AGENT FOR CARRIER', 'AS AGENT FOR']
  const asAgentOption = ''
  const asAgentDetail = ''

  const freightTermItems = ['PP', 'CC']
  const currencyItems = computed(() => appStore.appCombobox.getCombobox('currency') || [])

  const shipperLoadAndCount = computed(() =>
    String(inputData.value.bkg_packing_mode ?? '').toUpperCase() === 'FCL' ? 'Y' : 'N',
  )

  const payAt = computed(() => {
    const terms = String(inputData.value.bkg_freight_terms ?? '').toUpperCase()
    if (terms === 'PP') {
      return 'ORIGIN'
    }
    if (terms === 'CC') {
      return 'DESTINATION'
    }
    return ''
  })

  const joinValueUnit = (value, unit) => {
    if (value === undefined || value === null || value === '') {
      return ''
    }
    return [value, unit].filter(item => item !== undefined && item !== null && item !== '').join(' ')
  }

  const packageDesc = computed(() =>
    joinValueUnit(inputData.value.bkg_total_package_count, inputData.value.bkg_pack_type),
  )
  const weightDesc = computed(() =>
    joinValueUnit(inputData.value.bkg_actual_weight, inputData.value.bkg_unit_of_weight),
  )
  const cbmDesc = computed(() =>
    joinValueUnit(inputData.value.bkg_actual_volume, inputData.value.bkg_unit_of_volume),
  )

  const containerCount = computed(() =>
    (inputData.value.pac_list || []).reduce(
      (sum, row) => sum + Number(row.pac_container_count || 0),
      0,
    ),
  )

  const sayTotal = computed(() => {
    const count = containerCount.value
    if (!count) {
      return ''
    }
    const words = [
      'ZERO',
      'ONE',
      'TWO',
      'THREE',
      'FOUR',
      'FIVE',
      'SIX',
      'SEVEN',
      'EIGHT',
      'NINE',
      'TEN',
    ]
    const word = words[count] ?? String(count)
    return `${word} CONTAINER(S) ONLY.`
  })
</script>

<style scoped lang="scss">
  .si-hbl-textarea-row {
    flex: 1 1 auto;
    min-height: 146px;

    :deep(> .v-col) {
      display: flex;
    }
  }

  .si-hbl-textarea {
    flex: 1 1 auto;
    height: 100%;
    min-height: 146px;

    :deep(.v-input__prepend) {
      align-self: flex-start;
      margin-top: 6px;
    }

    :deep(.v-input__control),
    :deep(.v-field),
    :deep(.v-field__field) {
      height: 100%;
    }

    :deep(textarea) {
      min-height: 176px;
    }
  }
</style>
