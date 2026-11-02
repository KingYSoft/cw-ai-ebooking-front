<template>
  <div class="ref-form-pre mt-2">
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-100">{{ detailField('hblNo') }}:</div>

          <v-text-field
            v-model="doc.housebill_number"
            class="flex-1-1"
            density="compact"
            disabled
            hide-details
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col class="d-flex align-center" cols="12" sm="6" md="3">
        <v-checkbox
          v-model="doc.shipper_load_and_count"
          color="primary"
          density="compact"
          false-value="N"
          hide-details
          true-value="Y"
        >
          <template #label>
            <div class="text-caption">{{ detailField('shipperLoadAndCount') }}</div>
          </template>
        </v-checkbox>
      </v-col>

      <v-col class="d-none d-md-block" md="3" />
      <v-col class="d-none d-md-block" md="3" />
    </v-row>

    <v-row dense>
      <v-col v-for="port in portRows[0]" :key="port.codeKey" cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-100">
            {{ detailField(port.labelKey) }}<span class="text-red">*</span>:
          </div>

          <v-text-field
            v-model="doc[port.codeKey]"
            density="compact"
            disabled
            hide-details
            max-width="90px"
            variant="outlined"
          />

          <v-text-field
            v-model="doc[port.nameKey]"
            class="flex-1-1"
            density="compact"
            disabled
            hide-details
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-110">
            {{ detailField('vessel') }}<span class="text-red">*</span>:
          </div>

          <v-text-field
            v-model="doc.vessel_name"
            class="flex-1-1"
            density="compact"
            disabled
            hide-details
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-110">
            {{ detailField('etd') }}<span class="text-red">*</span>:
          </div>

          <FDatePicker
            v-model:date-value="doc.etd"
            class="flex-1-1"
            :date-props="siDisabledDateProps"
            max="2099-12-31"
            min="2000-01-01"
            min-width="auto"
          />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="port in portRows[1]" :key="port.codeKey" cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-100">
            {{ detailField(port.labelKey) }}<span class="text-red">*</span>:
          </div>

          <v-text-field
            v-model="doc[port.codeKey]"
            density="compact"
            disabled
            hide-details
            max-width="90px"
            variant="outlined"
          />

          <v-text-field
            v-model="doc[port.nameKey]"
            class="flex-1-1"
            density="compact"
            disabled
            hide-details
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-110">
            {{ detailField('voyage') }}<span class="text-red">*</span>:
          </div>

          <v-text-field
            v-model="doc.voyage_number"
            class="flex-1-1"
            density="compact"
            disabled
            hide-details
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-110">
            {{ detailField('eta') }}<span class="text-red">*</span>:
          </div>

          <FDatePicker
            v-model:date-value="doc.eta"
            class="flex-1-1"
            :date-props="siDisabledDateProps"
            max="2099-12-31"
            min="2000-01-01"
            min-width="auto"
          />
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col class="d-flex align-center" cols="12" md="6">
        <div class="d-flex align-center ga-1 w-100">
          <div class="text-caption text-end w-label-100">{{ detailField('freightTerms') }}:</div>

          <v-select
            v-model="doc.freight_terms"
            density="compact"
            hide-details
            :items="freightTermItems"
            max-width="54px"
            variant="outlined"
          />

          <div class="text-caption text-end">{{ detailField('deliveryMode') }}:</div>

          <v-select
            v-model="doc.delivery_mode"
            class="flex-1-1"
            density="compact"
            hide-details
            :items="deliveryModeItems"
            min-width="auto"
            variant="outlined"
          />

          <div class="text-caption text-end">{{ detailField('payAt') }}:</div>

          <v-select
            v-model="doc.pay_at"
            class="flex-1-1"
            density="compact"
            hide-details
            :items="payAtItems"
            min-width="auto"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="4" md="2">
        <v-text-field
          v-model="doc.no_of_package_desc"
          density="compact"
          hide-details
          :label="detailField('noOfPackage')"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" sm="4" md="2">
        <v-text-field
          v-model="doc.gross_weight_desc"
          density="compact"
          hide-details
          :label="detailField('grossWeight')"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" sm="4" md="2">
        <v-text-field
          v-model="doc.cbm_desc"
          density="compact"
          hide-details
          :label="detailField('cbm')"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col class="d-flex flex-column" cols="12" md="6">
        <v-row class="si-hbl-textarea-row" dense>
          <v-col cols="12" sm="6">
            <v-textarea
              v-model="doc.marks_nos"
              :auto-grow="false"
              class="si-hbl-textarea"
              density="compact"
              hide-details
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
              v-model="doc.goods_description"
              :auto-grow="false"
              class="si-hbl-textarea"
              density="compact"
              hide-details
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
        <v-text-field
          v-model="doc.say_total"
          density="compact"
          hide-details
          variant="outlined"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">{{ detailField('sayTotal') }}:</div>
          </template>
        </v-text-field>

        <v-row class="mt-1" dense>
          <v-col cols="12">
            <div class="d-flex align-center ga-1 w-100">
              <v-checkbox
                v-model="doc.wooden"
                color="primary"
                density="compact"
                false-value="N"
                hide-details
                true-value="Y"
              >
                <template #label>
                  <div class="text-caption">{{ detailField('wooden') }}:</div>
                </template>
              </v-checkbox>

              <v-text-field
                v-model="doc.wooden_desc"
                class="flex-1-1"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="doc.number_of_original"
              density="compact"
              hide-details
              min-width="100%"
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
  const doc = computed(() => {
    return inputData.value.doc_data ? inputData.value.doc_data : {}
  })

  const portRows = [
    [
      { labelKey: 'origin', codeKey: 'origin_code', nameKey: 'origin_name' },
      { labelKey: 'polLoad', codeKey: 'port_of_loading', nameKey: 'port_of_loading_name' },
    ],
    [
      { labelKey: 'destination', codeKey: 'destination_code', nameKey: 'destination_name' },
      { labelKey: 'podDischarge', codeKey: 'port_of_discharge', nameKey: 'port_of_discharge_name' },
    ],
  ]

  const deliveryModeItems = ['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']
  const payAtItems = ['ORIGIN', 'DESTINATION']
  const siDisabledDateProps = { disabled: true, clearable: false }
  const freightTermItems = ['PP', 'CC']
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
