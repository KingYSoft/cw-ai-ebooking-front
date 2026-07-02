<template>
  <div>
    <v-card-text class="py-2">
      <v-divider class="mt-2">
        <div class="mt-2 text-center text-caption text-uppercase text-on-surface opacity-70">
          Party Detail
        </div>
      </v-divider>

      <v-row class="mt-2" dense>
        <v-col v-for="block in partyBlocks" :key="block.key" cols="12" md="3" xl="3">
          <FPartyDetailCard
            v-model:party="inputData[block.key]"
            :address-type="block.addressType"
            :same-as-consignee-flag="
              block.sameAsConsignee ? inputData.notify_party_same_as_consignee : 'N'
            "
            :show-same-as-consignee="block.sameAsConsignee"
            @update:same-as-consignee-flag="
              val => {
                if (block.sameAsConsignee) inputData.notify_party_same_as_consignee = val
              }
            "
          />

          <v-text-field
            v-if="block.required"
            v-model="inputData[block.key].add_address_name"
            class="d-none"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>
      </v-row>

      <v-row align="start" class="mt-4 booking-date-row" dense>
        <v-col cols="12" lg="9">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              Date
            </div>
          </v-divider>

          <v-row dense>
            <v-col cols="12" md="4">
              <div class="d-flex flex-column ga-2">
                <v-select
                  v-model="inputData.bkg_transport_mode"
                  density="compact"
                  hide-details
                  item-title="code"
                  item-value="code"
                  :items="transportModes"
                  variant="outlined"
                  @update:model-value="onTransportChange"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      Transport<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-select>

                <v-select
                  v-model="inputData.bkg_packing_mode"
                  density="compact"
                  hide-details
                  item-title="code"
                  item-value="code"
                  :items="containerModes"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      Container<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-select>

                <v-text-field
                  v-model="inputData.bkg_origin"
                  density="compact"
                  hide-details
                  min-width="100%"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      Origin<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="inputData.bkg_destination"
                  density="compact"
                  hide-details
                  min-width="100%"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      Destination<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-text-field>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="d-flex flex-column ga-2">
                <FDatePicker
                  v-model:date-value="inputData.bkg_etd"
                  max="2099-12-31"
                  min="2000-01-01"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      ETD<span class="text-red">*</span>:
                    </div>
                  </template>
                </FDatePicker>

                <FDatePicker
                  v-model:date-value="inputData.bkg_eta"
                  max="2099-12-31"
                  min="2000-01-01"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">ETA:</div>
                  </template>
                </FDatePicker>

                <FDatePicker
                  v-model:date-value="inputData.bkg_cargo_ready"
                  max="2099-12-31"
                  min="2000-01-01"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-100">
                      Cargo Ready Date<span class="text-red">*</span>:
                    </div>
                  </template>
                </FDatePicker>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="d-flex flex-column ga-2">
                <v-select
                  v-model="inputData.bkg_inco"
                  density="compact"
                  hide-details
                  :items="incoItems"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      Inco Term<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-select>

                <v-select
                  v-model="inputData.bkg_freight_terms"
                  density="compact"
                  hide-details
                  :items="freightTermItems"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      Freight Terms<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-select>

                <v-number-input
                  v-model="inputData.bkg_goods_value"
                  class="hide-step"
                  control-variant="hidden"
                  density="compact"
                  hide-details
                  :min="0"
                  min-width="100%"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">Cargo Value:</div>
                  </template>

                  <template #append>
                    <v-select
                      v-model="inputData.bkg_goods_value_currency"
                      density="compact"
                      hide-details
                      :items="['USD', 'CNY', 'HKD']"
                      variant="underlined"
                      width="60px"
                    />
                  </template>
                </v-number-input>

                <v-number-input
                  v-model="inputData.bkg_insurance_value"
                  class="hide-step"
                  control-variant="hidden"
                  density="compact"
                  hide-details
                  :min="0"
                  min-width="100%"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">Ins. Value:</div>
                  </template>

                  <template #append>
                    <v-select
                      v-model="inputData.bkg_insurance_value_currency"
                      density="compact"
                      hide-details
                      :items="['USD', 'CNY', 'HKD']"
                      variant="underlined"
                      width="60px"
                    />
                  </template>
                </v-number-input>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="d-none d-lg-flex justify-center px-0" cols="auto">
          <v-divider vertical />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <div class="booking-cutoff-panel">
            <div class="d-flex align-center ga-1 mb-2">
              <v-icon color="primary" icon="mdi-calendar-clock" size="18" />
              <span class="text-caption text-uppercase">Cut-off Dates</span>
            </div>

            <div
              v-for="item in cutOffFields"
              :key="item.key"
              class="d-flex align-center justify-space-between booking-cutoff-row"
            >
              <span class="text-caption">{{ item.label }}</span>

              <span class="text-caption text-medium-emphasis">{{
                inputData[item.key] || '-'
              }}</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="mt-2">
        <div class="mt-2 text-center text-caption text-uppercase text-on-surface opacity-70">
          Cargo Detail
        </div>
      </v-divider>

      <v-row class="mt-2" dense>
        <v-col cols="12" md="3">
          <div class="d-flex flex-column ga-2">
            <v-number-input
              v-model="inputData.bkg_actual_weight"
              class="hide-step"
              control-variant="hidden"
              density="compact"
              hide-details
              :min="0"
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  Gross Weight<span class="text-red">*</span>:
                </div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_unit_of_weight"
                  density="compact"
                  hide-details
                  :items="['KG', 'LB']"
                  variant="underlined"
                  width="50px"
                />
              </template>
            </v-number-input>

            <v-number-input
              v-model="inputData.bkg_actual_volume"
              class="hide-step"
              control-variant="hidden"
              density="compact"
              hide-details
              :min="0"
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  CBM<span class="text-red">*</span>:
                </div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_unit_of_volume"
                  density="compact"
                  hide-details
                  :items="['M3', 'CBF']"
                  variant="underlined"
                  width="50px"
                />
              </template>
            </v-number-input>

            <v-text-field
              v-model="inputData.bkg_volume_weight"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Volume Weight:</div>
              </template>

              <template #append>
                <span class="text-caption px-2">{{ inputData.bkg_volume_weight_unit }}</span>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.bkg_actual_chargeable"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Chargeable Weight:</div>
              </template>

              <template #append>
                <span class="text-caption px-2">{{ inputData.bkg_actual_chargeable_unit }}</span>
              </template>
            </v-text-field>

            <div class="d-flex align-center ga-0 w-100">
              <v-number-input
                v-model="inputData.bkg_total_package_count"
                class="hide-step flex-1-1"
                control-variant="hidden"
                density="compact"
                hide-details
                :min="0"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    No. of Package<span class="text-red">*</span>:
                  </div>
                </template>
              </v-number-input>

              <v-text-field
                v-model="inputData.bkg_pack_type"
                density="compact"
                hide-details
                max-width="78"
                min-width="78"
                variant="underlined"
              />
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="d-flex flex-column ga-2">
            <v-select
              v-model="inputData.bkg_release_type"
              density="compact"
              hide-details
              :items="releaseTypes"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Release Type<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>

            <v-text-field
              v-model="inputData.bkg_service_level"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Service Level:</div>
              </template>
            </v-text-field>

            <v-select
              v-model="inputData.bkg_delivery_mode"
              density="compact"
              hide-details
              :items="deliveryModes"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Delivery Mode:</div>
              </template>
            </v-select>

            <v-text-field
              v-model="inputData.bkg_commodity"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Commodity<span class="text-red">*</span>:
                </div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="d-flex flex-column ga-2">
            <FTextInput
              v-model:text-value="inputData.bkg_goods_description"
              min-width="100%"
              :textarea-props="{ rows: 2 }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Good Desc.<span class="text-red">*</span>:
                </div>
              </template>
            </FTextInput>

            <FTextInput
              v-model:text-value="inputData.bkg_marks_nos"
              min-width="100%"
              :textarea-props="{ rows: 2 }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Marks & No.<span class="text-red">*</span>:
                </div>
              </template>
            </FTextInput>

            <v-text-field
              v-model="inputData.bkg_booking_reference"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Shipper Ref.:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.bkg_additional_terms"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Additional Terms:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <template v-if="showContainerTable">
      <v-divider />

      <v-card-text class="py-2">
        <v-btn color="primary" size="small" variant="flat" @click="emit('add-container')">
          Container
        </v-btn>
      </v-card-text>

      <v-data-table
        class="table-filter"
        disable-sort
        :headers="containerHeaders"
        hide-default-footer
        item-value="id"
        :items="inputData.pac_list"
        :items-per-page="-1"
      >
        <template #header.actions>
          <v-btn
            color="primary"
            density="comfortable"
            icon="mdi-plus-circle"
            size="small"
            variant="text"
            @click="emit('add-container')"
          />
        </template>

        <template #item.actions="{ index }">
          <v-btn
            color="red"
            density="comfortable"
            icon="mdi-minus-circle"
            size="small"
            variant="text"
            @click="emit('remove-container', index)"
          />
        </template>

        <template #item.pac_container_type="{ item }">
          <FRemoteTableMenu
            :id="'1@pac_container_type' + item.id"
            v-model="item.pac_container_type"
            display-key="code"
            :fetch-method="fetchContainerTypes"
            :headers="containerTypeTableHeaders"
            item-value="code"
            :text-field-props="{
              'min-width': '100%',
              rules: inputDataRules.pac_container_type,
            }"
            virtual
            @row-select="row => assignContainerTypeFromRow(row, item, 'pac_container_type')"
          />
        </template>

        <template #item.pac_container_count="{ item }">
          <v-number-input
            :id="'1@pac_container_count' + item.id"
            v-model="item.pac_container_count"
            color="primary"
            control-variant="hidden"
            density="compact"
            hide-details
            :max="999999999"
            :min="0"
            :min-fraction-digits="0"
            min-width="80px"
            :precision="0"
            :rules="inputDataRules.pac_container_count"
            type="input"
            variant="outlined"
            width="80px"
          />
        </template>

        <template #item.pac_container_num="{ item }">
          <v-text-field
            v-model="item.pac_container_num"
            color="primary"
            density="compact"
            :disabled="!item.pac_is_soc"
            hide-details
            min-width="100%"
            type="input"
            variant="outlined"
          />
        </template>

        <template #item.pac_seal_num="{ item }">
          <v-text-field
            v-model="item.pac_seal_num"
            color="primary"
            density="compact"
            :disabled="!item.pac_is_soc"
            hide-details
            min-width="100%"
            type="input"
            variant="outlined"
          />
        </template>

        <template #item.pac_is_soc="{ item }">
          <v-checkbox-btn
            v-model="item.pac_is_soc"
            class="d-flex justify-center align-center"
            density="compact"
            :false-value="0"
            hide-details
            :true-value="1"
          />
        </template>

        <template #item.pac_commodity="{ item }">
          <v-text-field
            v-model="item.pac_commodity"
            color="primary"
            density="compact"
            hide-details
            min-width="100%"
            type="input"
            variant="outlined"
          />
        </template>

        <template #item.pac_gross_weight="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.pac_gross_weight"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :max="999999999.99999"
              :min="0"
              :min-fraction-digits="0"
              min-width="auto"
              :precision="5"
              type="input"
              variant="outlined"
              @update:model-value="jsPackingW(item)"
            />

            <v-select
              v-model="item.pac_weight_unit"
              auto-select-first
              autocomplete="off"
              color="primary"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('weightUnit')"
              :list-props="{
                density: 'compact',
              }"
              max-width="50px"
              no-filter
              variant="underlined"
              width="50px"
            />
          </div>
        </template>

        <template #item.pac_actual_volume="{ item }">
          <v-number-input
            v-model="item.pac_actual_volume"
            class="has-append"
            color="primary"
            control-variant="hidden"
            density="compact"
            hide-details
            :max="999999999.99999"
            :min="0"
            :min-fraction-digits="0"
            min-width="100%"
            :precision="5"
            type="input"
            variant="outlined"
            @update:model-value="jsPackingW(item)"
          >
            <template #append>
              <v-select
                v-model="item.pac_actual_volume_uom"
                auto-select-first
                autocomplete="off"
                color="primary"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="appStore.appCombobox.getCombobox('cbmUnit')"
                :list-props="{
                  density: 'compact',
                }"
                no-filter
                variant="underlined"
                width="50px"
              />
            </template>
          </v-number-input>
        </template>

        <template #item.pac_package_count="{ item }">
          <div class="d-flex align-center ga-0 w-100">
            <v-number-input
              v-model="item.pac_package_count"
              class="flex-1-1"
              color="primary"
              control-variant="hidden"
              density="compact"
              hide-details
              :max="999999999"
              :min="0"
              :min-fraction-digits="0"
              min-width="auto"
              :precision="0"
              type="input"
              variant="outlined"
            />

            <FRemoteTableMenu
              v-model="item.pac_pack_type"
              display-key="code"
              :fetch-method="fetchPackageTypes"
              :headers="packageTypeTableHeaders"
              item-value="code"
              query-key="query"
              :text-field-props="{
                color: 'primary',
                minWidth: '78',
                maxWidth: '78',
                variant: 'underlined',
                clearable: true,
              }"
              virtual
              @row-select="
                row => assignPackageTypeFromRow(row, item, 'pac_pack_type', 'pac_pack_type_desc')
              "
            />
          </div>
        </template>

        <template #item.pac_harmonised_code="{ item }">
          <v-text-field
            v-model="item.pac_harmonised_code"
            color="primary"
            density="compact"
            hide-details
            min-width="100%"
            type="input"
            variant="outlined"
          />
        </template>

        <template #item.pac_description="{ item }">
          <FTextInput
            v-model:text-value="item.pac_description"
            min-width="100%"
            :textarea-props="{ label: 'Description' }"
          />
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, watch } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import FPartyDetailCard from '@/components/FPartyDetailCard.vue'
  import {
    assignContainerTypeFromRow,
    containerTypeTableHeaders,
    fetchContainerTypes,
  } from '@/composables/useContainerTypeRemoteMenu'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeMenuTextFieldProps,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { BOOKING_CUT_OFF_FIELDS, BOOKING_PARTY_BLOCKS } from '@/constants/bookingPartyFields'
  import { useAppStore } from '@/stores/app'

  const { t } = useLocale()
  const appStore = useAppStore()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
    },
  })
  const { inputDataRules } = toRefs(props)

  const inputData = defineModel('input-data', { type: Object, required: true })

  const emit = defineEmits(['add-container', 'remove-container'])

  const partyBlocks = BOOKING_PARTY_BLOCKS
  const cutOffFields = BOOKING_CUT_OFF_FIELDS

  const transportModes = [{ code: 'SEA' }, { code: 'AIR' }, { code: 'RAIL' }]
  const containerModes = [{ code: 'FCL' }, { code: 'LCL' }, { code: 'LSE' }]
  const incoItems = ['FOB', 'CIF', 'EXW', 'CFR', 'CPT']
  const freightTermItems = ['PP', 'CC', 'Prepaid', 'Collect']
  const releaseTypes = ['OBL', 'SWB', 'Telex']
  const deliveryModes = ['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']

  const showContainerTable = computed(
    () =>
      inputData.value.bkg_transport_mode === 'SEA' && inputData.value.bkg_packing_mode === 'FCL',
  )

  const onTransportChange = mode => {
    if (mode === 'AIR') {
      inputData.value.bkg_packing_mode = 'LSE'
    } else if (!inputData.value.bkg_packing_mode) {
      inputData.value.bkg_packing_mode = 'FCL'
    }
  }

  const containerHeaders = [
    { title: '', key: 'actions', width: '40px', align: 'center', sortable: false },
    { title: 'Container', key: 'pac_container_type', minWidth: '90px' },
    { title: 'Count', key: 'pac_container_count', minWidth: '80px' },
    { title: 'Container No', key: 'pac_container_num', minWidth: '120px' },
    { title: 'Seal No', key: 'pac_seal_num', minWidth: '120px' },
    { title: 'SOC', key: 'pac_is_soc', width: '50px', align: 'center' },
    { title: 'Commodity', key: 'pac_commodity', minWidth: '100px' },
    { title: 'Gross Weight', key: 'pac_gross_weight', minWidth: '120px' },
    { title: 'Volume', key: 'pac_actual_volume', minWidth: '100px' },
    { title: 'No. of Package', key: 'pac_package_count', minWidth: '120px' },
    { title: 'HS Code', key: 'pac_harmonised_code', minWidth: '100px' },
    { title: 'Description', key: 'pac_description', minWidth: '140px' },
  ]

  const jsPackingW = item => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!item) return

    const cbm_d = new Decimal(item.pac_actual_volume ?? 0)
    const cbm = cbm_d.isNaN() ? new Decimal(0) : cbm_d
    const vol_weight = cbm.times(new Decimal(166)).times(new Decimal(1000)).div(new Decimal(1000))
    const vw = vol_weight.toNumber()
    const newVolumeWeight = vw === 0 ? null : vw

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (item.pac_volume_weight !== newVolumeWeight) {
      item.pac_volume_weight = newVolumeWeight
    }

    const gw_d = new Decimal(item.pac_gross_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (item.pac_chargeable_weight !== newChargeableWeight) {
      item.pac_chargeable_weight = newChargeableWeight
    }
  }
</script>

<style lang="scss" scoped>
  .booking-cutoff-panel {
    padding-left: 12px;
    border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));

    @media (max-width: 1279px) {
      margin-top: 12px;
      padding-left: 0;
      border-left: none;
    }
  }

  .booking-cutoff-row + .booking-cutoff-row {
    margin-top: 8px;
  }
</style>
