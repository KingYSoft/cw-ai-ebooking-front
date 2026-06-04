<template>
  <v-form ref="refForm" class="ref-form-pre" color="background">
    <v-card-text class="py-2">
      <v-row align="start" dense>
        <!-- 左栏：Shipper / Consignee / Notify Party 纵向排列 -->
        <v-col :cols="rescols('c12l4s6')">
          <div
            v-for="(party, partyIndex) in partyBlocks"
            :key="party.key"
            :class="{ 'mt-7': partyIndex > 0 }"
          >
            <v-divider>
              <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
                {{ party.title }}
              </div>
            </v-divider>

            <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
              <FRemoteTableMenuWithCode
                v-model="inputData[party.key].add_address_name"
                bind-key="code"
                :bind-value="inputData[party.key].add_address_code"
                display-key="company_name"
                :fetch-method="queryMockOrgAddress"
                :headers="addrTableHeaders"
                :query-extra="{ address_type: party.addressType }"
                :text-field-props="{
                  'min-width': '100%',
                  rules: party.required ? [v => !!v || 'Required'] : [],
                }"
                virtual
                @click-clear="onClearAddr(party.addressType)"
                @row-select="onSelectAddr($event, party.addressType)"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-100">
                    Name<span v-if="party.required" class="text-red">*</span>:
                  </div>
                </template>

                <template v-if="party.key === 'notify_party'" #append>
                  <v-checkbox
                    v-model="notifySameAsConsignee"
                    color="primary"
                    density="compact"
                    hide-details
                  >
                    <template #label>
                      <span class="text-caption text-no-wrap">Same as Consignee</span>
                    </template>
                  </v-checkbox>
                </template>
              </FRemoteTableMenuWithCode>

              <v-text-field
                v-model="inputData[party.key].add_address1"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-100">Address1:</div>
                </template>
              </v-text-field>

              <v-text-field
                v-model="inputData[party.key].add_address2"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-100">Address2:</div>
                </template>
              </v-text-field>

              <v-text-field
                v-model="inputData[party.key].add_address3"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-100">Address3:</div>
                </template>
              </v-text-field>
            </div>
          </div>
        </v-col>

        <!-- 中栏：运输 / 日期 / 重量 -->
        <v-col :cols="rescols('c12l4s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-2">
            <v-select
              v-model="inputData.bkg_transport_mode"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="transportModes"
              style="width: 100%;"
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
              style="width: 100%;"
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

            <FDatePicker v-model:date-value="inputData.bkg_etd" max="2099-12-31" min="2000-01-01">
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  ETD<span class="text-red">*</span>:
                </div>
              </template>
            </FDatePicker>

            <FDatePicker v-model:date-value="inputData.bkg_eta" max="2099-12-31" min="2000-01-01">
              <template #prepend>
                <div class="text-caption text-end w-label-100">ETA:</div>
              </template>
            </FDatePicker>

            <FDatePicker v-model:date-value="inputData.bkg_cargo_ready" max="2099-12-31" min="2000-01-01">
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Cargo Ready Date<span class="text-red">*</span>:
                </div>
              </template>
            </FDatePicker>

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

            <v-select
              v-model="inputData.bkg_inco"
              density="compact"
              hide-details
              :items="incoItems"
              style="width: 100%;"
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
              style="width: 100%;"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  Freight Terms<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>
          </div>
        </v-col>

        <!-- 右栏：承运人 / 货物 -->
        <v-col :cols="rescols('c12l4s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-2">
            <v-text-field
              v-model="inputData.bkg_preferred_carrier"
              density="compact"
              hide-details
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  Carrier<span class="text-red">*</span>:
                </div>
              </template>
            </v-text-field>

            <v-select
              v-model="inputData.bkg_release_type"
              density="compact"
              hide-details
              :items="releaseTypes"
              style="width: 100%;"
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
              style="width: 100%;"
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

            <v-number-input
              v-model="inputData.bkg_goods_value"
              class="hide-step"
              density="compact"
              hide-details
              :min="0"
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Cargo Value:</div>
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
              density="compact"
              hide-details
              :min="0"
              min-width="100%"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">Ins. Value:</div>
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
        <v-btn color="primary" size="small" variant="flat" @click="emit('add-container')">Container</v-btn>
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
          <v-text-field v-model="item.pac_container_type" density="compact" hide-details variant="outlined" />
        </template>

        <template #item.pac_container_count="{ item }">
          <v-number-input
            v-model="item.pac_container_count"
            control-variant="hidden"
            density="compact"
            hide-details
            :min="0"
          />
        </template>

        <template #item.pac_container_num="{ item }">
          <v-text-field v-model="item.pac_container_num" density="compact" hide-details variant="outlined" />
        </template>

        <template #item.pac_seal_num="{ item }">
          <v-text-field v-model="item.pac_seal_num" density="compact" hide-details variant="outlined" />
        </template>

        <template #item.pac_is_soc="{ item }">
          <v-checkbox v-model="item.pac_is_soc" density="compact" hide-details />
        </template>

        <template #item.pac_commodity="{ item }">
          <v-text-field v-model="item.pac_commodity" density="compact" hide-details variant="outlined" />
        </template>

        <template #item.pac_gross_weight="{ item }">
          <v-number-input
            v-model="item.pac_gross_weight"
            control-variant="hidden"
            density="compact"
            hide-details
            :min="0"
          />
        </template>

        <template #item.pac_actual_volume="{ item }">
          <v-number-input
            v-model="item.pac_actual_volume"
            control-variant="hidden"
            density="compact"
            hide-details
            :min="0"
          />
        </template>

        <template #item.pac_package_count="{ item }">
          <v-number-input
            v-model="item.pac_package_count"
            control-variant="hidden"
            density="compact"
            hide-details
            :min="0"
          />
        </template>

        <template #item.pac_harmonised_code="{ item }">
          <v-text-field v-model="item.pac_harmonised_code" density="compact" hide-details variant="outlined" />
        </template>

        <template #item.pac_goods_description="{ item }">
          <v-text-field v-model="item.pac_goods_description" density="compact" hide-details variant="outlined" />
        </template>
      </v-data-table>
    </template>
  </v-form>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'

  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { queryMockOrgAddress } from '@/mock/orgAddress'

  const inputData = defineModel('input-data', { type: Object, required: true })

  const emit = defineEmits(['add-container', 'remove-container', 'register-form-ref'])

  const { rescols } = useLayoutCols()
  const refForm = ref(null)

  defineExpose({ validate: () => refForm.value?.validate() })

  watch(refForm, el => emit('register-form-ref', el), { immediate: true })

  const partyBlocks = [
    { key: 'shipper', title: 'Shipper', required: true, addressType: 'SHIPPER' },
    { key: 'consignee', title: 'Consignee', required: true, addressType: 'CONSIGNEE' },
    { key: 'notify_party', title: 'Notify Party', required: false, addressType: 'NOTIFY_PARTY' },
  ]

  const addrTableHeaders = [
    { title: 'Code', key: 'code', align: 'start', minWidth: '100px', cellProps: { class: 'text-truncate' } },
    {
      title: 'Company Name',
      key: 'company_name',
      align: 'start',
      minWidth: '140px',
      cellProps: { class: 'text-truncate' },
    },
    { title: 'Address1', key: 'address1', align: 'start', minWidth: '140px', cellProps: { class: 'text-truncate' } },
    { title: 'City', key: 'city', align: 'start', minWidth: '100px' },
    { title: 'Country', key: 'country_code', align: 'start', minWidth: '80px' },
  ]

  const applyAddrRow = (row, addressType) => {
    if (!row || typeof row !== 'object') return
    const target =
      addressType === 'SHIPPER'
        ? 'shipper'
        : (addressType === 'CONSIGNEE'
          ? 'consignee'
          : 'notify_party')
    const party = inputData.value[target]
    party.add_address_code = row.code ?? ''
    party.add_address_name = row.company_name ?? ''
    party.add_address = row.pk ?? ''
    party.add_address1 = row.address1 ?? ''
    party.add_address2 = row.address2 ?? ''
    party.add_address3 = row.address3 ?? ''
    if (addressType === 'NOTIFY_PARTY') {
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

  const onSelectAddr = (row, addressType) => {
    applyAddrRow(row, addressType)
  }

  const onClearAddr = addressType => {
    const target =
      addressType === 'SHIPPER'
        ? 'shipper'
        : (addressType === 'CONSIGNEE'
          ? 'consignee'
          : 'notify_party')
    inputData.value[target] = {
      add_address_name: '',
      add_address_code: '',
      add_address1: '',
      add_address2: '',
      add_address3: '',
    }
    if (addressType === 'NOTIFY_PARTY') {
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

  const transportModes = [{ code: 'SEA' }, { code: 'AIR' }, { code: 'RAIL' }]
  const containerModes = [{ code: 'FCL' }, { code: 'LCL' }, { code: 'LSE' }]
  const incoItems = ['FOB', 'CIF', 'EXW', 'CFR', 'CPT']
  const freightTermItems = ['PP', 'CC', 'Prepaid', 'Collect']
  const releaseTypes = ['OBL', 'SWB', 'Telex']
  const deliveryModes = ['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']

  const notifySameAsConsignee = computed({
    get: () => inputData.value.notify_party_same_as_consignee === 'Y',
    set: val => {
      inputData.value.notify_party_same_as_consignee = val ? 'Y' : 'N'
      if (val) {
        inputData.value.notify_party.add_address_name = 'SAME AS CONSIGNEE'
      }
    },
  })

  const showContainerTable = computed(
    () => inputData.value.bkg_transport_mode === 'SEA' && inputData.value.bkg_packing_mode === 'FCL',
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
    { title: 'Description', key: 'pac_goods_description', minWidth: '140px' },
  ]
</script>
