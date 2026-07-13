<template>
  <div>
    <v-form class="ref-form-pre" color="background">
      <v-card-text class="py-2">
        <v-row dense>
          <v-col :cols="rescols('c12l4s6')">
            <v-divider>
              <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
                {{ detailSection('shipper') }}
              </div>
            </v-divider>

            <div class="address-fields-col mt-1 d-flex align-start flex-column flex-wrap ga-1">
              <FRemoteTableMenuWithCode
                id="1@shipper_name"
                v-model="inputData.shipper.add_address_name"
                bind-key="code"
                :bind-value="inputData.shipper.add_address_code"
                display-key="company_name"
                :fetch-method="organizationQueryOrgAddress"
                :headers="addrTableHeaders"
                :query-extra="{ address_type: 'SHIPPER' }"
                :text-field-props="{
                  'min-width': '100%',
                }"
                virtual
                @click-clear="OnClearAddr('SHIPPER')"
                @row-select="onSelectAddr($event, 'SHIPPER')"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('name') }}</div>
                </template>
              </FRemoteTableMenuWithCode>

              <v-text-field
                v-model="inputData.shipper.add_address1"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address1') }}</div>
                </template>
              </v-text-field>

              <v-text-field
                v-model="inputData.shipper.add_address2"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address2') }}</div>
                </template>
              </v-text-field>
            </div>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.shipper.add_uscl"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('uscl') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.shipper.add_contact"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label">{{ detailField('contact') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.shipper.add_mobile"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('tel') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col :cols="rescols('c6')">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.shipper.add_email"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label">{{ detailField('email') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.shipper.add_fax"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('fax') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col :cols="rescols('c12l4s6')">
            <v-divider>
              <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
                {{ detailSection('consignee') }}
              </div>
            </v-divider>

            <div class="address-fields-col mt-1 d-flex align-start flex-column flex-wrap ga-1">
              <FRemoteTableMenuWithCode
                id="1@consignee_name"
                v-model="inputData.consignee.add_address_name"
                bind-key="code"
                :bind-value="inputData.consignee.add_address_code"
                display-key="company_name"
                :fetch-method="organizationQueryOrgAddress"
                :headers="addrTableHeaders"
                :query-extra="{ address_type: 'CONSIGNEE' }"
                :text-field-props="{
                  'min-width': '100%',
                }"
                virtual
                @click-clear="OnClearAddr('CONSIGNEE')"
                @row-select="onSelectAddr($event, 'CONSIGNEE')"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('name') }}</div>
                </template>
              </FRemoteTableMenuWithCode>

              <v-text-field
                v-model="inputData.consignee.add_address1"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address1') }}</div>
                </template>
              </v-text-field>

              <v-text-field
                v-model="inputData.consignee.add_address2"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address2') }}</div>
                </template>
              </v-text-field>
            </div>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.consignee.add_switchboard"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('switchboard') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.consignee.add_taxId"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label">{{ detailField('taxId') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.consignee.add_contact"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('contact') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col :cols="rescols('c6')">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.consignee.add_mobile"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label">{{ detailField('tel') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col :cols="rescols('c12l4s6')">
            <v-divider>
              <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
                {{ detailSection('notifyParty') }}
              </div>
            </v-divider>

            <div class="address-fields-col mt-1 d-flex align-start flex-column flex-wrap ga-1">
              <FRemoteTableMenuWithCode
                v-model="inputData.notify_party.add_address_name"
                bind-key="code"
                :bind-value="inputData.notify_party.add_address_code"
                display-key="company_name"
                :fetch-method="organizationQueryOrgAddress"
                :headers="addrTableHeaders"
                :query-extra="{ address_type: 'NOTIFY_PARTY' }"
                :text-field-props="{ 'min-width': '100%' }"
                virtual
                @click-clear="OnClearAddr('NOTIFY_PARTY')"
                @row-select="onSelectAddr($event, 'NOTIFY_PARTY')"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('name') }}</div>
                </template>

                <template #append>
                  <v-tooltip location="bottom">
                    <template #activator="ssss">
                      <v-checkbox-btn
                        v-bind="ssss.props"
                        v-model="inputData.notify_party_same_as_consignee"
                        color="primary"
                        density="compact"
                        hide-details
                        value="Y"
                        @update:model-value="
                          $event => {
                            if ($event === 'Y') {
                              inputData.notify_party = { add_address_name: 'SAME AS CONSIGNEE' }
                            } else {
                              inputData.notify_party = {}
                            }
                          }
                        "
                      />
                    </template>

                    <span>{{ detailField('sameAsConsignee') }}</span>
                  </v-tooltip>
                </template>
              </FRemoteTableMenuWithCode>

              <v-text-field
                v-model="inputData.notify_party.add_address1"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address1') }}</div>
                </template>
              </v-text-field>

              <v-text-field
                v-model="inputData.notify_party.add_address2"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-120">{{ detailField('address2') }}</div>
                </template>
              </v-text-field>
            </div>

            <v-row class="address-pair-row" dense>
              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.notify_party.add_contact"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-120">{{ detailField('contact') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col :cols="rescols('c6')">
                <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.notify_party.add_mobile"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    readonly
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label">{{ detailField('tel') }}</div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- <v-row class="mt-2" dense> -->
        <!-- </v-row> -->
        <v-divider class="my-2" />

        <v-row dense>
          <v-col :cols="rescols('c12l3s6')">
            <div class="d-flex align-start flex-column flex-wrap ga-1">
              <v-select
                id="1@wso_packing_mode"
                v-model="inputData.wso_packing_mode"
                auto-select-first
                autocomplete="off"
                density="compact"
                hide-details
                item-title="code"
                item-value="code"
                :items="WHS_ORDER_CONTAINER_OPTIONS"
                :menu-props="{
                  'max-width': '100%',
                }"
                min-width="100%"
                no-data-text="$vuetify.custom.app.searchMore"
                no-filter
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('container') }}</div>
                </template>
              </v-select>

              <!-- <v-autocomplete
              id="1@bkg_destination"
              auto-select-first
              autocomplete="off"
              clearable
              color="primary"
              density="compact"
              hide-details
              item-title="rl_code"
              item-value="rl_code"
              :items="queryPortList"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              :model-value="inputData.bkg_destination"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              variant="outlined"
              @update:focused="
                $event => {
                  if ($event) {
                    queryPort(inputData.bkg_destination)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.bkg_destination = $event?.rl_code ?? null
                  inputData.bkg_destination_name = $event?.rl_port_name ?? null
                }
              "
              @update:search="queryPort"
            >
              <template #item="scope">
                <v-list-item
                  v-bind="scope.props"
                  :subtitle="scope.item.raw.rl_port_name"
                  :title="scope.item.raw.rl_code"
                />
              </template>
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  Destination:
                </div>
              </template>
            </v-autocomplete> -->
              <v-autocomplete
                auto-select-first
                autocomplete="off"
                clearable
                color="primary"
                density="compact"
                hide-details
                item-title="rl_code"
                item-value="rl_code"
                :items="queryPortList"
                :menu-props="{
                  'max-width': '100%',
                }"
                min-width="100%"
                :model-value="inputData.wso_load_port"
                no-data-text="$vuetify.custom.app.searchMore"
                no-filter
                return-object
                variant="outlined"
                @update:focused="
                  $event => {
                    if ($event) {
                      queryPort(inputData.wso_load_port)
                    }
                  }
                "
                @update:model-value="
                  $event => {
                    inputData.wso_load_port = $event?.rl_code ?? null
                    inputData.wso_load_port_name = $event?.rl_port_name ?? null
                  }
                "
                @update:search="queryPort"
              >
                <template #item="scope">
                  <v-list-item
                    v-bind="scope.props"
                    :subtitle="scope.item.raw.rl_port_name"
                    :title="scope.item.raw.rl_code"
                  />
                </template>

                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('load') }}</div>
                </template>
              </v-autocomplete>

              <v-autocomplete
                auto-select-first
                autocomplete="off"
                clearable
                color="primary"
                density="compact"
                hide-details
                item-title="rl_code"
                item-value="rl_code"
                :items="queryPortList"
                :menu-props="{
                  'max-width': '100%',
                }"
                min-width="100%"
                :model-value="inputData.wso_discharge_port"
                no-data-text="$vuetify.custom.app.searchMore"
                no-filter
                return-object
                variant="outlined"
                @update:focused="
                  $event => {
                    if ($event) {
                      queryPort(inputData.wso_discharge_port)
                    }
                  }
                "
                @update:model-value="
                  $event => {
                    inputData.wso_discharge_port = $event?.rl_code ?? null
                    inputData.wso_discharge_port_name = $event?.rl_port_name ?? null
                  }
                "
                @update:search="queryPort"
              >
                <template #item="scope">
                  <v-list-item
                    v-bind="scope.props"
                    :subtitle="scope.item.raw.rl_port_name"
                    :title="scope.item.raw.rl_code"
                  />
                </template>

                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('discharge') }}</div>
                </template>
              </v-autocomplete>

              <FDatePicker
                id="1@wso_etd"
                v-model:date-value="inputData.wso_etd"
                max="2099-12-31"
                min="2000-01-01"
                :rules="bkgEtdRules"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('etd') }}<span class="text-primary">^</span>:
                  </div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_eta"
                v-model:date-value="inputData.wso_eta"
                max="2099-12-31"
                min="2000-01-01"
                :rules="bkgEtaRules"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('eta') }}<span class="text-primary">^</span>:
                  </div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_cargo_ready"
                v-model:date-value="inputData.wso_cargo_ready"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('cargoReadyDate') }}</div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_est_pickup"
                v-model:date-value="inputData.wso_est_pickup"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('estPickup') }}</div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_est_delivery"
                v-model:date-value="inputData.wso_est_delivery"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('estDelivery') }}</div>
                </template>
              </FDatePicker>
            </div>
          </v-col>

          <v-col :cols="rescols('c12l3s6')">
            <div class="d-flex align-start flex-column flex-wrap ga-1">
              <v-number-input
                id="1@wso_actual_weight"
                v-model="inputData.wso_actual_weight"
                class="hide-step"
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
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('grossWeight') }}</div>
                </template>

                <template #append>
                  <v-select
                    v-model="inputData.wso_unit_of_weight"
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
                    no-filter
                    variant="underlined"
                    width="50px"
                  />
                </template>
              </v-number-input>

              <v-number-input
                id="1@wso_actual_volume"
                v-model="inputData.wso_actual_volume"
                class="hide-step"
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
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('cbm') }}</div>
                </template>

                <template #append>
                  <v-select
                    v-model="inputData.wso_unit_of_volume"
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

              <v-text-field
                id="1@wso_volume_weight"
                class="input-numeric"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                :model-value="inputData.wso_volume_weight"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('volumeWeight') }}</div>
                </template>

                <template #append>
                  <v-text-field
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.wso_unit_of_weight"
                    readonly
                    type="input"
                    variant="underlined"
                    width="50px"
                  />
                </template>
              </v-text-field>

              <v-text-field
                id="1@wso_actual_chargeable"
                class="input-numeric"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                :model-value="inputData.wso_actual_chargeable"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('chargeable') }}</div>
                </template>

                <template #append>
                  <v-text-field
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.wso_unit_of_volume"
                    readonly
                    type="input"
                    variant="underlined"
                    width="50px"
                  />
                </template>
              </v-text-field>

              <div class="d-flex align-center ga-0 w-100">
                <v-number-input
                  id="1@wso_total_package_count"
                  v-model="inputData.wso_total_package_count"
                  class="hide-step flex-1-1"
                  color="primary"
                  control-variant="hidden"
                  density="compact"
                  hide-details
                  :max="999999999"
                  :min="0"
                  :min-fraction-digits="0"
                  :precision="0"
                  type="input"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">{{ detailField('noOfPackage') }}</div>
                  </template>
                </v-number-input>

                <FRemoteTableMenuWithCode
                  v-model="inputData.wso_pack_type"
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
                    row =>
                      assignPackageTypeFromRow(row, inputData.value, 'wso_pack_type', 'wso_pack_type')
                  "
                />
              </div>

              <v-select
                id="1@wso_delivery_mode"
                v-model="inputData.wso_delivery_mode"
                auto-select-first
                autocomplete="off"
                density="compact"
                hide-details
                :items="['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']"
                :menu-props="{
                  'max-width': '100%',
                }"
                min-width="100%"
                no-data-text="$vuetify.custom.app.searchMore"
                no-filter
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('deliveryMode') }}</div>
                </template>
              </v-select>

              <v-autocomplete
                id="1@market"
                auto-select-first
                autocomplete="off"
                clearable
                color="primary"
                :custom-filter="filterMarketOption"
                density="compact"
                hide-details="auto"
                item-title="market"
                item-value="pk"
                :items="marketOptions"
                :menu-props="{ maxWidth: '320px' }"
                min-width="100%"
                :model-value="inputData.market"
                return-object
                :rules="marketRules"
                variant="outlined"
                @update:model-value="onOrderMarketChange"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('market') }}<span class="text-error"> *</span>:
                  </div>
                </template>

                <template #item="{ props: itemProps, item: option }">
                  <v-list-item
                    v-bind="itemProps"
                    :subtitle="[option.raw.plant_id, option.raw.destination].filter(Boolean).join(' / ')"
                    :title="option.raw.market"
                  />
                </template>
              </v-autocomplete>

              <v-text-field
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                :model-value="orderPlantId"
                readonly
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('plantId') }}</div>
                </template>
              </v-text-field>
            </div>
          </v-col>

          <v-col :cols="rescols('c12l3s6')">
            <div class="d-flex align-start flex-column flex-wrap ga-1">
              <FDatePicker
                v-model:date-value="inputData.wso_so_confirm_date"
                :date-props="{ clearable: true }"
                max="2099-12-31"
                min="2000-01-01"
                min-width="100%"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('soConfirm') }}</div>
                </template>
              </FDatePicker>

              <FDatePicker
                v-model:date-value="inputData.wso_vgm_cut_off_date"
                :date-props="{ clearable: true }"
                max="2099-12-31"
                min="2000-01-01"
                min-width="100%"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('vgmCutOff') }}</div>
                </template>
              </FDatePicker>

              <FDatePicker
                v-model:date-value="inputData.wso_doc_cut_off_date"
                :date-props="{ clearable: true }"
                max="2099-12-31"
                min="2000-01-01"
                min-width="100%"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('docCutOff') }}</div>
                </template>
              </FDatePicker>

              <FDatePicker
                v-model:date-value="inputData.wso_port_cargo_cut_off_date"
                :date-props="{ clearable: true }"
                max="2099-12-31"
                min="2000-01-01"
                min-width="100%"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('cyCutOff') }}</div>
                </template>
              </FDatePicker>

              <v-text-field
                v-model="inputData.wso_so_number"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                :rules="convertRequiredRules.soNumber"
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('carrierSoNumber') }}<span class="text-primary">^</span>:
                  </div>
                </template>
              </v-text-field>
              <!-- <v-select
              v-model="inputData.job.job_direction"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="[{ code: 'EXP' }, { code: 'IMP' }, { code: 'CRT' }]"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">jobDirection</div>
              </template>
            </v-select>

            <v-autocomplete
              auto-select-first
              autocomplete="off"
              clearable
              color="primary"
              density="compact"
              hide-details
              item-title="full_name"
              item-value="pk"
              :items="queryAllUserList"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              :model-value="inputData.bkg_job_rep_sales_name"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              variant="outlined"
              @update:focused="
                $event => {
                  if ($event) {
                    queryAllUser(inputData.bkg_job_rep_sales_name)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.bkg_job_rep_sales = $event?.pk ?? null
                  inputData.bkg_job_rep_sales_name = $event?.full_name ?? null
                }
              "
              @update:search="queryAllUser"
            >
              <template #item="scope">
                <v-list-item
                  v-bind="scope.props"
                  :subtitle="scope.item.raw.email_address"
                  :title="scope.item.raw.full_name"
                />
              </template>
              <template #prepend>
                <div class="text-caption text-end w-label-110">salesRep</div>
              </template>
            </v-autocomplete> -->
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>

    <WarehouseOrderRelationTables :relation="inputData.whsOrderRelationOutput" />
  </div>
</template>
<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs, watch } from 'vue'
  import { useLocale } from 'vuetify'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { getWhsMarketOptions } from '@/api/whs-market'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FRemoteTableMenuWithCode from '@/components/FRemoteTableMenuWithCode.vue'
  import WarehouseOrderRelationTables from '@/components/warehouse/warehouse_order/WarehouseOrderRelationTables.vue'
  import {
    defaultWhsMarketObject,
    normalizeWhsMarketObject,
    syncMarketDerivedFields,
  } from '@/composables/mapWhsOrderDetail'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import { WHS_ORDER_CONTAINER_OPTIONS } from '@/constants/warehouseOrderContainerOptions'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'WarehouseOrderDetail',
  })

  const appStore = useAppStore()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()
  const {
    detailSection,
    detailField,
    addrTable,
    validation,
    validationField,
    requiredRule,
  } = useWarehouseOrderPageI18n()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
    },
    queryPortList: {
      type: Array,
      default: () => [],
    },
  })
  const { inputDataRules, queryPortList } = toRefs(props)

  const convertRequiredRules = computed(() => ({
    etd: [requiredRule(validationField('etd'))],
    eta: [requiredRule(validationField('eta'))],
    soNumber: [requiredRule(validationField('carrierSoNumber'))],
  }))

  /** ETD 须严格晚于 Cargo Ready（yyyy-MM-dd：es > cs，不可同日） */
  function validateBookingEtdNotBeforeCargoReady() {
    return () => {
      const es = String(inputData.value.wso_etd ?? '').trim()
      const cs = String(inputData.value.wso_cargo_ready ?? '').trim()
      if (!es || !cs) return true
      if (es > cs) return true
      return t('$vuetify.custom.bookingPage.form.etd_must_be_before_cargo_ready.err')
    }
  }

  /** SEA: ETA > ETD；AIR: ETA >= ETD */
  function validateBookingEtaVsEtd() {
    return () => {
      const mode = String(inputData.value.wso_transport_mode ?? '').toUpperCase()
      const etd = String(inputData.value.wso_etd ?? '').trim()
      const eta = String(inputData.value.wso_eta ?? '').trim()
      if (!etd || !eta) return true
      if (mode === 'SEA') {
        if (eta > etd) return true
        return t('$vuetify.custom.bookingPage.form.eta_vs_etd_sea.err')
      }
      if (mode === 'AIR') {
        if (eta >= etd) return true
        return t('$vuetify.custom.bookingPage.form.eta_vs_etd_air.err')
      }
      return true
    }
  }

  const bkgEtdRules = computed(() => [
    ...convertRequiredRules.value.etd,
    validateBookingEtdNotBeforeCargoReady(),
    validateBookingEtaVsEtd(),
  ])

  const bkgEtaRules = computed(() => [...convertRequiredRules.value.eta, validateBookingEtaVsEtd()])

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const emit = defineEmits(['query-port', 'on-select-addr', 'on-clear-addr'])

  const queryPort = value => {
    emit('query-port', value)
  }

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const OnClearAddr = type => {
    emit('on-clear-addr', type)
  }

  const marketOptions = ref([])

  const marketRequiredRule = value => {
    const normalized = normalizeWhsMarketObject(value)
    const marketName = String(normalized?.market ?? '').trim()
    if (!marketName) {
      return validation('marketRequired')
    }
    const matched = marketOptions.value.some(opt => {
      if (normalized?.pk && String(opt.pk ?? '').trim() === String(normalized.pk).trim()) {
        return true
      }
      return String(opt.market ?? '').trim() === marketName
    })
    return matched || validation('marketSelectFromList')
  }
  const marketRules = [marketRequiredRule]

  const filterMarketOption = (_value, query, item) => {
    const q = String(query ?? '')
      .trim()
      .toLowerCase()
    if (!q) {
      return true
    }
    const raw = item?.raw ?? {}
    return [
      raw.market,
      raw.plant_id,
      raw.shipping_mode,
      raw.port_code,
      raw.port_of_discharge,
      raw.destination,
    ].some(field =>
      String(field ?? '')
        .toLowerCase()
        .includes(q),
    )
  }

  const onOrderMarketChange = market => {
    if (!inputData.value) {
      return
    }
    syncMarketDerivedFields(inputData.value, market ?? defaultWhsMarketObject())
  }

  const reconcileMarketSelection = () => {
    if (!inputData.value) {
      return
    }
    const current = normalizeWhsMarketObject(inputData.value.market)
    if (!current?.market) {
      return
    }
    const matched = marketOptions.value.find(opt => {
      if (current.pk && String(opt.pk ?? '').trim() === current.pk) {
        return true
      }
      return String(opt.market ?? '').trim() === current.market
    })
    if (matched) {
      syncMarketDerivedFields(inputData.value, matched)
    }
  }

  const loadMarketOptions = async () => {
    try {
      const { data } = await getWhsMarketOptions()
      marketOptions.value = Array.isArray(data) ? data : []
      reconcileMarketSelection()
    } catch (error) {
      console.error('loadMarketOptions failed:', error)
      marketOptions.value = []
    }
  }
  loadMarketOptions()

  watch(
    () => inputData.value?.market,
    () => reconcileMarketSelection(),
    { deep: true },
  )

  const orderPlantId = computed(() =>
    String(inputData.value?.wso_plant_id ?? inputData.value?.market?.plant_id ?? '').trim(),
  )

  const addrTableHeaders = computed(() => [
    { title: addrTable('code'), key: 'code', align: 'start', maxWidth: '200', cellProps: { class: 'text-truncate' }, minWidth: '140' },
    { title: addrTable('companyName'), key: 'company_name', align: 'start', maxWidth: '200', cellProps: { class: 'text-truncate' }, minWidth: '140' },
    { title: addrTable('addressCode'), key: 'address_code', align: 'start', maxWidth: '200', cellProps: { class: 'text-truncate' }, minWidth: '140' },
    { title: addrTable('address1'), key: 'address1', align: 'start', maxWidth: '200', cellProps: { class: 'text-truncate' }, minWidth: '140' },
    { title: addrTable('city'), key: 'city', align: 'start', minWidth: '140' },
    { title: addrTable('country'), key: 'country_code', align: 'start', minWidth: '140' },
  ])


  /** Volume Weight 单位跟 Gross Weight；Chargeable Weight 单位跟 CBM */
  const syncDerivedWeightUnits = () => {
    if (!inputData.value) return
    const weightUom = inputData.value.wso_unit_of_weight ?? 'KG'
    const volumeUom = inputData.value.wso_unit_of_volume ?? 'M3'
    if (inputData.value.wso_volume_weight_unit !== weightUom) {
      inputData.value.wso_volume_weight_unit = weightUom
    }
    if (inputData.value.wso_actual_chargeable_unit !== volumeUom) {
      inputData.value.wso_actual_chargeable_unit = volumeUom
    }
  }

  const js_w = () => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!inputData.value) return
    syncDerivedWeightUnits()

    const cbm_d = new Decimal(inputData.value.wso_actual_volume ?? 0)
    const cbm = cbm_d.isNaN() ? new Decimal(0) : cbm_d
    const vol_weight = cbm.times(new Decimal(166)).times(new Decimal(1000)).div(new Decimal(1000))
    const vw = vol_weight.toNumber()
    const newVolumeWeight = vw === 0 ? null : vw

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.wso_volume_weight !== newVolumeWeight) {
      inputData.value.wso_volume_weight = newVolumeWeight
    }

    const gw_d = new Decimal(inputData.value.wso_actual_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.wso_actual_chargeable !== newChargeableWeight) {
      inputData.value.wso_actual_chargeable = newChargeableWeight
    }
  }

  // 使用标志位防止循环更新
  let isCalculating = false
  watch(
    () => inputData.value.wso_actual_volume,
    () => {
      if (isCalculating) return
      isCalculating = true
      js_w()
      setTimeout(() => {
        isCalculating = false
      }, 0)
    },
    // 首次加载不根据体积重算抬头计费重/体积重，保留接口返回的数据
    { immediate: false },
  )
  watch(
    () => inputData.value.wso_actual_weight,
    () => {
      if (isCalculating) return
      isCalculating = true
      js_w()
      setTimeout(() => {
        isCalculating = false
      }, 0)
    },
    { immediate: false },
  )
  watch(
    () => inputData.value?.wso_unit_of_weight,
    () => syncDerivedWeightUnits(),
    { immediate: true },
  )
  watch(
    () => inputData.value?.wso_unit_of_volume,
    () => syncDerivedWeightUnits(),
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .address-fields-col,
  .address-pair-row {
    width: 100%;
  }

  .address-fields-col :deep(.v-input.v-input--horizontal),
  .address-pair-row :deep(.v-input.v-input--horizontal) {
    width: 100%;
    max-width: 100%;

    .v-input__control {
      flex: 1 1 0;
      min-width: 0;
    }
  }
</style>
