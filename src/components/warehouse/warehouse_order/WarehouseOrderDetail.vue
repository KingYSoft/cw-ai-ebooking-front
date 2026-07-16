<template>
  <div>
    <v-form class="ref-form-pre" color="background">
      <v-card-text class="py-2">
        <v-row dense>
          <v-col cols="12">
            <div class="market-plant-row d-flex align-start ga-2">
              <v-autocomplete
                id="1@market"
                autocomplete="off"
                class="market-plant-row__field"
                clearable
                color="primary"
                density="compact"
                hide-details="auto"
                :items="uniqueMarketNames"
                :menu-props="{ maxWidth: '320px' }"
                min-width="0"
                :model-value="selectedMarketName"
                :rules="marketRules"
                variant="outlined"
                @update:model-value="onOrderMarketNameChange"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('market') }}<span class="text-error"> *</span>:
                  </div>
                </template>
              </v-autocomplete>

              <v-select
                id="1@plant_id"
                class="market-plant-row__field"
                clearable
                color="primary"
                density="compact"
                :disabled="!selectedMarketName || plantIdOptionsLoading"
                hide-details="auto"
                item-title="title"
                item-value="value"
                :items="plantIdOptionItems"
                :loading="plantIdOptionsLoading"
                :menu-props="{ maxWidth: '320px' }"
                min-width="0"
                :model-value="selectedPlantId"
                :rules="plantIdRules"
                variant="outlined"
                @update:model-value="onOrderPlantIdChange"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('plantId') }}</div>
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>

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
                      <div class="text-caption text-end w-label-120">
                        {{ detailField('switchboard') }}
                      </div>
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
                      <div class="text-caption text-end w-label-120">
                        {{ detailField('contact') }}
                      </div>
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
                      <div class="text-caption text-end w-label-120">
                        {{ detailField('contact') }}
                      </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('container') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('discharge') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('cargoReadyDate') }}
                  </div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_est_pickup"
                v-model:date-value="inputData.wso_est_pickup"
                max="2099-12-31"
                min="2000-01-01"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('estPickup') }}
                  </div>
                </template>
              </FDatePicker>

              <FDatePicker
                id="1@wso_est_delivery"
                v-model:date-value="inputData.wso_est_delivery"
                max="2099-12-31"
                min="2000-01-01"
                :rules="convertRequiredRules.estDelivery"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('estDelivery') }}<span class="text-primary">^</span>:
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('grossWeight') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('volumeWeight') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('chargeable') }}
                  </div>
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
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('noOfPackage') }}
                    </div>
                  </template>
                </v-number-input>

                <FRemoteTableMenu
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
                      assignPackageTypeFromRow(
                        row,
                        inputData,
                        'wso_pack_type',
                        'wso_pack_type_desc',
                      )
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('deliveryMode') }}
                  </div>
                </template>
              </v-select>

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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('soConfirm') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('vgmCutOff') }}
                  </div>
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
                  <div class="text-caption text-end w-label-110">
                    {{ detailField('docCutOff') }}
                  </div>
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

              <v-text-field
                id="1@intended_vessel"
                v-model="inputData.wso_intended_vessel"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-110">{{ detailField('intendedVessel') }}</div>
                </template>
              </v-text-field>

              <v-autocomplete
                id="1@place_of_delivery"
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
                :model-value="inputData.wso_place_of_delivery"
                no-data-text="$vuetify.custom.app.searchMore"
                no-filter
                return-object
                variant="outlined"
                @update:focused="
                  $event => {
                    if ($event) {
                      queryPort(inputData.wso_place_of_delivery)
                    }
                  }
                "
                @update:model-value="
                  $event => {
                    inputData.wso_place_of_delivery = $event?.rl_code ?? null
                    inputData.wso_place_of_delivery_name = $event?.rl_port_name ?? null
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
                  <div class="text-caption text-end w-label-110">{{ detailField('placeOfDelivery') }}</div>
                </template>
              </v-autocomplete>
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
  import { mapWarehouseAddrTableHeaders } from '@/composables/mapWarehouseOrderTableHeaders'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import { WHS_ORDER_CONTAINER_OPTIONS } from '@/constants/warehouseOrderContainerOptions'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'WarehouseOrderDetail',
  })

  const appStore = useAppStore()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()
  const { detailSection, detailField, addrTable, validation, validationField, requiredRule } =
    useWarehouseOrderPageI18n()

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
  const { queryPortList } = toRefs(props)

  const convertRequiredRules = computed(() => ({
    etd: [requiredRule(validationField('etd'))],
    eta: [requiredRule(validationField('eta'))],
    estDelivery: [requiredRule(validationField('estDelivery'))],
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
  const plantIdOptionItems = ref([])
  const plantIdOptionsLoading = ref(false)

  const selectedMarketName = computed(() => {
    return String(inputData.value?.market?.market ?? inputData.value?.wso_market ?? '').trim()
  })

  const selectedPlantId = computed(() => {
    return String(inputData.value?.market?.plant_id ?? inputData.value?.wso_plant_id ?? '').trim()
  })

  const resolveMarketOptionMarket = opt => String(opt?.market ?? opt?.Market ?? '').trim()

  const resolveMarketOptionPlantId = opt =>
    String(opt?.plant_id ?? opt?.PlantId ?? opt?.plantId ?? '').trim()

  const mergeMarketOptions = (existing, incoming) => {
    const keyOf = opt =>
      [
        String(opt?.pk ?? '').trim(),
        resolveMarketOptionMarket(opt),
        resolveMarketOptionPlantId(opt),
      ].join('|')
    const map = new Map((existing ?? []).map(opt => [keyOf(opt), opt]))
    for (const opt of incoming ?? []) {
      map.set(keyOf(opt), opt)
    }
    return [...map.values()]
  }

  const buildPlantIdOptionItems = (options, marketName = '', { matchMarket = true } = {}) => {
    const market = String(marketName ?? '').trim()
    const seen = new Set()
    const items = []
    for (const opt of options ?? []) {
      const optionMarket = resolveMarketOptionMarket(opt)
      if (matchMarket && market && optionMarket && optionMarket !== market) {
        continue
      }
      const plantId = resolveMarketOptionPlantId(opt)
      if (!plantId || seen.has(plantId)) {
        continue
      }
      seen.add(plantId)
      items.push({
        title: plantId,
        value: plantId,
        raw: opt,
      })
    }
    return items
  }

  const uniqueMarketNames = computed(() => {
    const seen = new Set()
    const names = []
    for (const opt of marketOptions.value) {
      const name = resolveMarketOptionMarket(opt)
      if (!name || seen.has(name)) {
        continue
      }
      seen.add(name)
      names.push(name)
    }
    return names
  })

  const marketRequiredRule = value => {
    const marketName = String(value ?? selectedMarketName.value ?? '').trim()
    if (!marketName) {
      return validation('marketRequired')
    }
    const matched = marketOptions.value.some(
      opt => resolveMarketOptionMarket(opt) === marketName,
    )
    return matched || validation('marketSelectFromList')
  }
  const marketRules = [marketRequiredRule]
  const plantIdRules = []

  const findMarketOption = (marketName, plantId) => {
    const name = String(marketName ?? '').trim()
    const pid = String(plantId ?? '').trim()
    if (!name || !pid) {
      return null
    }
    const fromDropdown = plantIdOptionItems.value.find(item => item.value === pid)?.raw
    if (fromDropdown) {
      return fromDropdown
    }
    return (
      marketOptions.value.find(opt => {
        if (resolveMarketOptionPlantId(opt) !== pid) {
          return false
        }
        const optionMarket = resolveMarketOptionMarket(opt)
        return !optionMarket || optionMarket === name
      }) ?? null
    )
  }

  const loadPlantIdOptions = async marketName => {
    const name = String(marketName ?? '').trim()
    if (!name) {
      plantIdOptionItems.value = []
      return
    }

    plantIdOptionsLoading.value = true
    try {
      const { data } = await getWhsMarketOptions({ query: name })
      const list = Array.isArray(data) ? data : []
      marketOptions.value = mergeMarketOptions(marketOptions.value, list)
      plantIdOptionItems.value = buildPlantIdOptionItems(list, name, { matchMarket: false })
    } catch (error) {
      console.error('loadPlantIdOptions failed:', error)
      plantIdOptionItems.value = buildPlantIdOptionItems(marketOptions.value, name)
    } finally {
      plantIdOptionsLoading.value = false
    }
  }

  const onOrderMarketNameChange = marketName => {
    if (!inputData.value) {
      return
    }
    const name = String(marketName ?? '').trim()
    syncMarketDerivedFields(inputData.value, {
      ...defaultWhsMarketObject(),
      market: name,
      plant_id: '',
    })
  }

  const onOrderPlantIdChange = plantId => {
    if (!inputData.value) {
      return
    }
    const name = selectedMarketName.value
    const pid = String(plantId ?? '').trim()
    const matched = findMarketOption(name, pid)
    if (matched) {
      syncMarketDerivedFields(inputData.value, matched)
      return
    }
    syncMarketDerivedFields(inputData.value, {
      ...defaultWhsMarketObject(),
      market: name,
      plant_id: pid,
    })
  }

  const ensureMarketOptionVisible = () => {
    const current = normalizeWhsMarketObject(inputData.value?.market)
    if (!current?.market) {
      return
    }
    const exists = marketOptions.value.some(opt => {
      if (current.pk && String(opt.pk ?? '').trim() === current.pk) {
        return true
      }
      if (current.plant_id) {
        return (
          resolveMarketOptionMarket(opt) === current.market &&
          resolveMarketOptionPlantId(opt) === current.plant_id
        )
      }
      return resolveMarketOptionMarket(opt) === current.market
    })
    if (!exists) {
      marketOptions.value = [...marketOptions.value, current]
    }
  }

  const reconcileMarketSelection = async () => {
    if (!inputData.value) {
      return
    }
    const current = normalizeWhsMarketObject(inputData.value.market)
    if (!current?.market) {
      plantIdOptionItems.value = []
      return
    }
    await loadPlantIdOptions(current.market)
    if (current.plant_id) {
      const matched = findMarketOption(current.market, current.plant_id)
      if (matched) {
        syncMarketDerivedFields(inputData.value, matched)
        return
      }
    }
    ensureMarketOptionVisible()
  }

  const loadMarketOptions = async () => {
    try {
      const { data } = await getWhsMarketOptions()
      marketOptions.value = Array.isArray(data) ? data : []
      await reconcileMarketSelection()
    } catch (error) {
      console.error('loadMarketOptions failed:', error)
      marketOptions.value = []
      plantIdOptionItems.value = []
    }
  }
  loadMarketOptions()

  watch(
    () => selectedMarketName.value,
    async (marketName, previousMarketName) => {
      if (!marketName) {
        plantIdOptionItems.value = []
        return
      }
      if (marketName === previousMarketName) {
        return
      }
      await loadPlantIdOptions(marketName)
    },
  )

  watch(
    () => inputData.value?.market?.plant_id,
    () => {
      if (!inputData.value) {
        return
      }
      const current = normalizeWhsMarketObject(inputData.value.market)
      if (!current?.market || !current.plant_id) {
        return
      }
      const matched = findMarketOption(current.market, current.plant_id)
      if (matched) {
        syncMarketDerivedFields(inputData.value, matched)
      }
    },
  )

  const addrTableHeaders = computed(() =>
    mapWarehouseAddrTableHeaders(
      [
        {
          key: 'code',
          align: 'start',
          maxWidth: '200',
          cellProps: { class: 'text-truncate' },
          minWidth: '140',
        },
        {
          key: 'company_name',
          align: 'start',
          maxWidth: '200',
          cellProps: { class: 'text-truncate' },
          minWidth: '140',
        },
        {
          key: 'address_code',
          align: 'start',
          maxWidth: '200',
          cellProps: { class: 'text-truncate' },
          minWidth: '140',
        },
        {
          key: 'address1',
          align: 'start',
          maxWidth: '200',
          cellProps: { class: 'text-truncate' },
          minWidth: '140',
        },
        { key: 'city', align: 'start', minWidth: '140' },
        { key: 'country_code', align: 'start', minWidth: '140' },
      ],
      addrTable,
    ),
  )

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
  .market-plant-row {
    width: 100%;
  }

  .market-plant-row__field {
    flex: 0 0 25%;
    max-width: 25%;
    min-width: 0;
  }

  .market-plant-row :deep(.v-input.v-input--horizontal) {
    width: 100%;
    max-width: 100%;

    .v-input__control {
      flex: 1 1 0;
      min-width: 0;
    }
  }

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
