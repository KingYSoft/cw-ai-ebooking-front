<template>
  <div class="whs-order-detail" :class="{ 'whs-order-detail--readonly': readonly }">
    <fieldset class="whs-order-detail-fieldset" :disabled="readonly">
      <v-form :ref="setRef" class="ref-form-pre" color="background" :disabled="readonly">
        <v-card-text class="py-2">
          <v-row dense>
            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
                <WhsWarehouseSelectField
                  id="1@wso_warehouse_code"
                  v-model="inputData.wso_warehouse_code"
                  v-model:pk="inputData.wso_warehouse_pk"
                  :disabled="readonly"
                  :label="detailField('warehouse')"
                  label-class="w-label-110"
                  :readonly="readonly"
                  required
                  :rules="warehouseRules"
                  @update:model-value="onWarehouseCodeChange"
                />
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
                <v-autocomplete
                  id="1@market"
                  autocomplete="off"
                  clearable
                  color="primary"
                  density="compact"
                  hide-details="auto"
                  :items="uniqueMarketNames"
                  :menu-props="{ maxWidth: '320px' }"
                  min-width="100%"
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
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
                <v-select
                  id="1@plant_id"
                  clearable
                  color="primary"
                  density="compact"
                  :disabled="readonly || !selectedMarketName || plantIdOptionsLoading"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="plantIdOptionItems"
                  :loading="plantIdOptionsLoading"
                  :menu-props="{ maxWidth: '320px' }"
                  min-width="100%"
                  :model-value="selectedPlantId"
                  :rules="plantIdRules"
                  variant="outlined"
                  @update:model-value="onOrderPlantIdChange"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('plantId') }}<span class="text-error"> *</span>
                    </div>
                  </template>
                </v-select>
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
                <v-select
                  id="1@wso_trade_type"
                  v-model="inputData.wso_trade_type"
                  density="compact"
                  hide-details="auto"
                  :items="tradeTypeOptions"
                  min-width="100%"
                  :rules="tradeTypeRules"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('tradeType') }}<span class="text-error"> *</span>
                    </div>
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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address1') }}
                    </div>
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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address2') }}
                    </div>
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
                        <div class="text-caption text-end w-label-120">
                          {{ detailField('uscl') }}
                        </div>
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
                        <div class="text-caption text-end w-label">
                          {{ detailField('contact') }}
                        </div>
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
                        <div class="text-caption text-end w-label-120">
                          {{ detailField('tel') }}
                        </div>
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
                        <div class="text-caption text-end w-label-120">
                          {{ detailField('fax') }}
                        </div>
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
                <div class="address-name-readonly d-flex align-center ga-1">
                  <div class="text-caption text-end w-label-120">{{ detailField('name') }}</div>

                  <v-text-field
                    id="1@consignee_name_code"
                    class="address-name-readonly__code"
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.consignee_code"
                    readonly
                    variant="outlined"
                  />

                  <v-text-field
                    id="1@consignee_name"
                    class="address-name-readonly__name"
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.consignee.add_address_name"
                    readonly
                    variant="outlined"
                  />
                </div>

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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address1') }}
                    </div>
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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address2') }}
                    </div>
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
                <div class="address-name-readonly d-flex align-center ga-1">
                  <div class="text-caption text-end w-label-120">{{ detailField('name') }}</div>

                  <v-text-field
                    class="address-name-readonly__code"
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.notify_party_code"
                    readonly
                    variant="outlined"
                  />

                  <v-text-field
                    class="address-name-readonly__name"
                    color="primary"
                    density="compact"
                    hide-details
                    :model-value="inputData.notify_party.add_address_name"
                    readonly
                    variant="outlined"
                  />
                </div>

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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address1') }}
                    </div>
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
                    <div class="text-caption text-end w-label-120">
                      {{ detailField('address2') }}
                    </div>
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
                <!-- Original Carrier SO control retained for reference; this field is display-only.
                <v-text-field
                  v-model="inputData.wso_so_number"
                  color="primary"
                  density="compact"
                  hide-details
                  min-width="100%"
                  readonly
                  type="input"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('carrierSoNumber') }}:
                    </div>
                  </template>
                </v-text-field> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('carrierSoNumber') }}<span class="text-primary">^</span>:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_so_number) }}
                  </div>
                </div>

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
                <!-- Original POL control retained for reference; this field is display-only.
                <v-autocomplete
                  auto-select-first
                  autocomplete="off"
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
                  readonly
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
                </v-autocomplete> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('load') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_load_port) }}
                  </div>
                </div>

                <!-- Original POD control retained for reference; this field is display-only.
                <v-autocomplete
                  auto-select-first
                  autocomplete="off"
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
                  readonly
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
                </v-autocomplete> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('discharge') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_discharge_port) }}
                  </div>
                </div>

                <!-- Original ETD control retained for reference; this field is display-only.
                <FDatePicker
                  id="1@wso_etd"
                  v-model:date-value="inputData.wso_etd"
                  :date-props="{ clearable: false, readonly: true }"
                  disabled
                  max="2099-12-31"
                  min="2000-01-01"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">{{ detailField('etd') }}:</div>
                  </template>
                </FDatePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('etd') }}<span class="text-primary">^</span>:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_etd) }}
                  </div>
                </div>

                <!-- Original ETA control retained for reference; this field is display-only.
                <FDatePicker
                  id="1@wso_eta"
                  v-model:date-value="inputData.wso_eta"
                  :date-props="{ clearable: false, readonly: true }"
                  disabled
                  max="2099-12-31"
                  min="2000-01-01"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">{{ detailField('eta') }}:</div>
                  </template>
                </FDatePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('eta') }}<span class="text-primary">^</span>:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_eta) }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
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
                  :rules="estDeliveryRules"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('estDelivery') }}<span class="text-error"> *</span>
                    </div>
                  </template>
                </FDatePicker>

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

                <v-number-input
                  id="1@wso_volume_weight"
                  v-model="inputData.wso_volume_weight"
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
                      {{ detailField('volumeWeight') }}
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

                <v-number-input
                  id="1@order_line_qty_total"
                  class="hide-step"
                  color="primary"
                  control-variant="hidden"
                  density="compact"
                  hide-details
                  :min-fraction-digits="0"
                  min-width="100%"
                  :model-value="orderLineQtyTotal"
                  :precision="3"
                  readonly
                  type="input"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">{{ detailField('qty') }}</div>
                  </template>
                </v-number-input>

                <v-select
                  id="1@wso_delivery_mode"
                  v-model="inputData.wso_delivery_mode"
                  auto-select-first
                  autocomplete="off"
                  density="compact"
                  hide-details="auto"
                  :items="['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']"
                  :menu-props="{
                    'max-width': '100%',
                  }"
                  min-width="100%"
                  no-data-text="$vuetify.custom.app.searchMore"
                  no-filter
                  :rules="deliveryModeRules"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('deliveryMode') }}<span class="text-error"> *</span>
                    </div>
                  </template>
                </v-select>

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
              </div>
            </v-col>

            <v-col :cols="rescols('c12l3s6')">
              <div class="d-flex align-start flex-column flex-wrap ga-1">
                <!-- Original SI cut-off control retained for reference; this field is display-only.
                <FDateTimePicker
                  v-model:date-time-value="inputData.wso_si_cut_off"
                  :date-props="{ clearable: true }"
                  max="2099-12-31"
                  min="2000-01-01"
                  min-width="100%"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('siCutOff') }}
                    </div>
                  </template>
                </FDateTimePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('siCutOff') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_si_cut_off) }}
                  </div>
                </div>

                <!-- Original VGM cut-off control retained for reference; this field is display-only.
                <FDatePicker
                  v-model:date-value="inputData.wso_vgm_cut_off_date"
                  :date-props="{ clearable: false, readonly: true }"
                  max="2099-12-31"
                  min="2000-01-01"
                  min-width="100%"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('vgmCutOff') }}
                    </div>
                  </template>
                </FDatePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('vgmCutOff') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_vgm_cut_off_date) }}
                  </div>
                </div>

                <!-- Original document cut-off control retained for reference; this field is display-only.
                <FDatePicker
                  v-model:date-value="inputData.wso_doc_cut_off_date"
                  :date-props="{ clearable: false, readonly: true }"
                  max="2099-12-31"
                  min="2000-01-01"
                  min-width="100%"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('docCutOff') }}
                    </div>
                  </template>
                </FDatePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('docCutOff') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_doc_cut_off_date) }}
                  </div>
                </div>

                <!-- Original CY cut-off control retained for reference; this field is display-only.
                <FDatePicker
                  v-model:date-value="inputData.wso_port_cargo_cut_off_date"
                  :date-props="{ clearable: false, readonly: true }"
                  disabled
                  max="2099-12-31"
                  min="2000-01-01"
                  min-width="100%"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('cyCutOff') }}
                    </div>
                  </template>
                </FDatePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('cyCutOff') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_port_cargo_cut_off_date) }}
                  </div>
                </div>

                <!-- Original CFS cut-off control retained for reference; this field is display-only.
                <FDateTimePicker
                  v-model:date-time-value="inputData.wso_cfs_cut_off"
                  :date-props="{ clearable: true }"
                  max="2099-12-31"
                  min="2000-01-01"
                  min-width="100%"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('cfsCutOff') }}
                    </div>
                  </template>
                </FDateTimePicker> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('cfsCutOff') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_cfs_cut_off) }}
                  </div>
                </div>

                <!-- Original intended vessel control retained for reference; this field is display-only.
                <v-text-field
                  id="1@intended_vessel"
                  v-model="inputData.wso_intended_vessel"
                  color="primary"
                  density="compact"
                  hide-details
                  min-width="100%"
                  readonly
                  type="input"
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('intendedVessel') }}
                    </div>
                  </template>
                </v-text-field> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('intendedVessel') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_intended_vessel) }}
                  </div>
                </div>

                <!-- Original place of delivery control retained for reference; this field is display-only.
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
                  readonly
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
                    <div class="text-caption text-end w-label-110">
                      {{ detailField('placeOfDelivery') }}
                    </div>
                  </template>
                </v-autocomplete> -->

                <div class="warehouse-order-display-field">
                  <div class="text-caption text-end w-label-110">
                    {{ displayWarehouseLabel('placeOfDelivery') }}:
                  </div>

                  <div class="warehouse-order-display-value text-body-2">
                    {{ displayWarehouseValue(inputData.wso_place_of_delivery) }}
                  </div>
                </div>
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

      <v-card-text class="py-2">
        <v-row dense>
          <v-col class="min-width-0" :cols="rescols('c12l6')">
            <v-btn class="mb-2" color="primary" size="small" variant="flat">
              {{ detailField('container') }}
            </v-btn>

            <div class="ref-form-pre">
              <v-data-table
                class="table-filter"
                disable-sort
                :headers="containerTableHeaders"
                hide-default-footer
                item-value="rowKey"
                :items="containerList"
                :items-per-page="-1"
                striped="even"
              >
                <template #header.actions>
                  <span />
                </template>

                <template #item.actions>
                  <span />
                </template>

                <template #item.container_no="{ item }">
                  <v-text-field
                    v-model="item.container_no"
                    density="compact"
                    hide-details
                    readonly
                    variant="outlined"
                  />
                </template>

                <template #item.container_count="{ item }">
                  <v-number-input
                    v-model="item.container_count"
                    control-variant="hidden"
                    density="compact"
                    hide-details
                    :min="0"
                    :precision="0"
                    readonly
                    variant="outlined"
                  />
                </template>
              </v-data-table>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </fieldset>
  </div>
</template>
<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs, watch } from 'vue'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { getWhsMarket, getWhsMarketOptions, getWhsMarketPlantOptions } from '@/api/whs-market'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FDateTimePicker from '@/components/FDateTimePicker.vue'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import FRemoteTableMenuWithCode from '@/components/FRemoteTableMenuWithCode.vue'
  import WhsWarehouseSelectField from '@/components/warehouse/WhsWarehouseSelectField.vue'
  import { mapWarehouseAddrTableHeaders } from '@/composables/mapWarehouseOrderTableHeaders'
  import {
    defaultWhsMarketObject,
    mapWhsMarketPartyToAddress,
    normalizeWhsMarketObject,
    resolveWhsMarketNotifySameAsConsignee,
    syncMarketDerivedFields,
  } from '@/composables/mapWhsOrderDetail'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'WarehouseOrderDetail',
  })

  const appStore = useAppStore()
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
    readonly: {
      type: Boolean,
      default: false,
    },
  })
  const { queryPortList, readonly } = toRefs(props)

  const estDeliveryRules = computed(() => [requiredRule(validationField('estDelivery'))])
  const deliveryModeRules = [requiredRule(validationField('deliveryMode'))]
  const tradeTypeRules = [requiredRule(validationField('tradeType'))]

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const displayWarehouseValue = value => {
    const text = String(value ?? '').trim()
    return text || '-'
  }

  const displayWarehouseLabel = key => String(detailField(key) ?? '').replace(/\s*:$/, '')

  const emit = defineEmits(['query-port', 'on-select-addr', 'on-clear-addr', 'register-form-refs'])

  const setRef = el => {
    emit('register-form-refs', el)
  }

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
  const tradeTypeOptions = ['TRADE', 'DI']

  const containerList = computed(() => {
    if (!inputData.value) {
      return []
    }
    return Array.isArray(inputData.value.container_list) ? inputData.value.container_list : []
  })

  const containerTableHeaders = computed(() => [
    { key: 'actions', title: '', width: '50px', align: 'center' },
    {
      key: 'container_no',
      title: String(detailField('container')).replace(/:$/, ''),
      align: 'start',
      minWidth: '180px',
      width: '60%',
    },
    {
      key: 'container_count',
      title: detailField('containerCount'),
      align: 'start',
      minWidth: '120px',
      width: '40%',
    },
  ])

  if (inputData.value && !inputData.value.wso_trade_type) {
    inputData.value.wso_trade_type = 'TRADE'
  }

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

  // 详情回显：确保已保存的 Plant ID 存在于下拉选项中
const ensurePlantIdOptionVisible = (plantId, marketName = '') => {
  const pid = String(plantId ?? '').trim()

  if (!pid) {
    return
  }

  if (plantIdOptionItems.value.some(item => item.value === pid)) {
    return
  }

  plantIdOptionItems.value = [
    ...plantIdOptionItems.value,
    {
      title: pid,
      value: pid,
      raw: {
        pk: inputData.value?.wso_market_pk ?? '',
        market: marketName,
        plant_id: pid,
      },
    },
  ]
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
    const matched = marketOptions.value.some(opt => resolveMarketOptionMarket(opt) === marketName)
    return matched || validation('marketSelectFromList')
  }
  const marketRules = [marketRequiredRule]
  const plantIdRequiredRule = value => {
    const plantId = String(value ?? selectedPlantId.value ?? '').trim()
    if (!plantId) {
      return validation('plantIdRequired')
    }
    if (plantIdOptionItems.value.length > 0) {
      const matched = plantIdOptionItems.value.some(item => item.value === plantId)
      return matched || validation('plantIdSelectFromList')
    }
    return true
  }
  const plantIdRules = [plantIdRequiredRule]
  const warehouseRequiredRule = value => {
    const code = String(value ?? inputData.value?.wso_warehouse_code ?? '').trim()
    if (!code) {
      return validation('warehouseRequired')
    }
    return true
  }
  const warehouseRules = [warehouseRequiredRule]

  const onWarehouseCodeChange = value => {
    if (readonly.value) {
      return
    }
    if (!String(value ?? '').trim()) {
      return
    }
    inputData.value.wso_delivery_mode = 'CFS/CY'
    inputData.value.bkg_delivery_mode = 'CFS/CY'
  }

  const orderLineQtyTotal = computed(() => {
    let rows = []
    if (Array.isArray(inputData.value?.item_list)) {
      rows = inputData.value.item_list
    } else if (Array.isArray(inputData.value?.pac_list)) {
      rows = inputData.value.pac_list
    }
    return rows.reduce((sum, row) => sum + (Number(row?.woi_pieces ?? row?.pieces) || 0), 0)
  })

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

  const resolveGroupName = group =>
    String(group?.market_group ?? group?.market ?? '').trim()

  const findPlantOption = plantId => {
    const pid = String(plantId ?? '').trim()
    if (!pid) {
      return null
    }
    return (
      plantIdOptionItems.value.find(item => item.value === pid)?.raw ??
      findMarketOption(selectedMarketName.value, pid)
    )
  }

  const clearMarketParties = () => {
    if (!inputData.value) {
      return
    }
    inputData.value.consignee = {}
    inputData.value.notify_party = {}
    inputData.value.consignee_code = ''
    inputData.value.notify_party_code = ''
    inputData.value.notify_party_same_as_consignee = 'N'
  }

  const setWhsOrderMarketPk = pk => {
    if (!inputData.value) {
      return
    }
    const nextPk = String(pk ?? '').trim()
    inputData.value.wso_market_pk = nextPk
    if (inputData.value.market && typeof inputData.value.market === 'object') {
      inputData.value.market.pk = nextPk
    }
  }

  /** 选中 Plant ID 后按 market pk 拉 Market 明细，填充 Consignee / Notify */
  const loadMarketPartyDetailByPk = async marketPk => {
    const pk = String(marketPk ?? '').trim()
    if (!pk || !inputData.value) {
      return
    }
    try {
      const { data } = await getWhsMarket(pk)
      if (!data) {
        return
      }
      inputData.value.consignee_code = data.consignee_code ?? ''
      inputData.value.notify_party_code = data.notify_party_code ?? ''
      inputData.value.consignee = mapWhsMarketPartyToAddress(data.consignee, 'CONSIGNEE')
      const notifyParty = data.notify ?? data.notify_party
      inputData.value.notify_party = mapWhsMarketPartyToAddress(notifyParty, 'NOTIFY_PARTY')
      inputData.value.notify_party_same_as_consignee =
        resolveWhsMarketNotifySameAsConsignee(notifyParty)
      if (inputData.value.notify_party_same_as_consignee === 'Y') {
        const name = String(inputData.value.notify_party?.add_address_name ?? '').trim()
        if (!name) {
          inputData.value.notify_party = { add_address_name: 'SAME AS CONSIGNEE' }
        }
      }
    } catch (error) {
      console.error('loadMarketPartyDetailByPk failed:', error)
    }
  }

const loadPlantIdOptions = async marketName => {
  const name = String(marketName ?? '').trim()

  if (!name) {
    plantIdOptionItems.value = []
    return
  }

  plantIdOptionsLoading.value = true

  try {
    const { data } = await getWhsMarketPlantOptions({ query: name })
    const list = Array.isArray(data) ? data : []

    const group =
      list.find(item => resolveGroupName(item) === name) ??
      (list.length === 1 ? list[0] : null)

    plantIdOptionItems.value = buildPlantIdOptionItems(
      group?.plant_options ?? [],
      '',
      {
        matchMarket: false,
      },
    )

    if (plantIdOptionItems.value.length === 0) {
      const { data: optData } = await getWhsMarketOptions({ query: name })
      const optList = Array.isArray(optData) ? optData : []

      marketOptions.value = mergeMarketOptions(
        marketOptions.value,
        optList,
      )

      plantIdOptionItems.value = buildPlantIdOptionItems(
        optList,
        name,
        { matchMarket: false },
      )
    }
  } catch (error) {
    console.error('loadPlantIdOptions failed:', error)

    plantIdOptionItems.value = buildPlantIdOptionItems(
      marketOptions.value,
      name,
    )
  } finally {
    // 关键：保留当前订单已经保存的 Plant ID
    ensurePlantIdOptionVisible(selectedPlantId.value, name)

    plantIdOptionsLoading.value = false
  }
}

  const onOrderMarketNameChange = marketName => {
    if (!inputData.value) {
      return
    }
    const name = String(marketName ?? '').trim()
    const currentName = String(inputData.value?.market?.market ?? '').trim()
    if (name === currentName) {
      return
    }
    syncMarketDerivedFields(inputData.value, {
      ...defaultWhsMarketObject(),
      market: name,
      plant_id: '',
    })
    setWhsOrderMarketPk('')
    plantIdOptionItems.value = []
    clearMarketParties()
  }

  const onOrderPlantIdChange = async plantId => {
    if (!inputData.value) {
      return
    }
    const name =
      selectedMarketName.value ||
      String(inputData.value?.market?.market ?? inputData.value?.wso_market ?? '').trim()
    const pid = String(plantId ?? '').trim()
    if (!pid) {
      syncMarketDerivedFields(inputData.value, {
        market: name,
        plant_id: '',
      })
      setWhsOrderMarketPk('')
      clearMarketParties()
      return
    }
    const matched = findPlantOption(pid)
    const nextPk = String(matched?.pk ?? '').trim()
    syncMarketDerivedFields(inputData.value, {
      market: name,
      plant_id: pid,
      pk: nextPk,
    })
    setWhsOrderMarketPk(nextPk)
    if (matched?.pk) {
      await loadMarketPartyDetailByPk(matched.pk)
      return
    }
    clearMarketParties()
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

  // 兼容 market 对象和独立字段
  const current = normalizeWhsMarketObject({
    ...(inputData.value.market ?? {}),
    market: selectedMarketName.value,
    plant_id: selectedPlantId.value,
    pk: inputData.value.wso_market_pk ?? inputData.value.market?.pk ?? '',
  })

  const marketName = current?.market ?? ''
  const plantId = current?.plant_id ?? ''

  if (!marketName) {
    // 没有 Market Group，但已有 Plant ID 时，仍然保留显示值
    plantIdOptionItems.value = plantId
      ? [{
          title: plantId,
          value: plantId,
          raw: {
            pk: current?.pk ?? '',
            market: '',
            plant_id: plantId,
          },
        }]
      : []

    return
  }

  await loadPlantIdOptions(marketName)

  if (plantId) {
    // 优先匹配真实接口选项
    let matched =
      findPlantOption(plantId) ??
      findMarketOption(marketName, plantId)

    // 历史 Plant ID 不在接口选项中时，补充一个回显选项
    if (!plantIdOptionItems.value.some(item => item.value === plantId)) {
      plantIdOptionItems.value.push({
        title: plantId,
        value: plantId,
        raw: matched ?? {
          pk: current.pk ?? '',
          market: marketName,
          plant_id: plantId,
        },
      })
    }

    matched = findPlantOption(plantId) ?? matched

    syncMarketDerivedFields(inputData.value, {
      ...(matched ?? {}),
      market: marketName,
      plant_id: plantId,
    })

    if (matched?.pk) {
      setWhsOrderMarketPk(matched.pk)
    }

    return
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

    const gw_d = new Decimal(inputData.value.wso_actual_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.wso_actual_chargeable !== newChargeableWeight) {
      inputData.value.wso_actual_chargeable = newChargeableWeight
    }
  }

  let isSyncingFromLines = false
  const syncHeaderMeasuresFromOrderLines = () => {
    if (!inputData.value || isSyncingFromLines) {
      return
    }
    const rows = Array.isArray(inputData.value.item_list) ? inputData.value.item_list : []
    if (rows.length === 0) {
      return
    }
    const sumField = key =>
      rows.reduce((acc, row) => {
        const n = Number(row?.[key] ?? 0)
        return acc + (Number.isFinite(n) ? n : 0)
      }, 0)

    isSyncingFromLines = true
    try {
      inputData.value.wso_actual_weight = sumField('woi_gross_wt')
      inputData.value.wso_actual_volume = sumField('woi_volume')
      inputData.value.wso_volume_weight = sumField('woi_net_wt')
      inputData.value.wso_total_package_count = sumField('woi_outer_pack')
      js_w()
    } finally {
      isSyncingFromLines = false
    }
  }

  // 使用标志位防止循环更新
  let isCalculating = false
  watch(
    () => inputData.value.wso_actual_volume,
    () => {
      if (isCalculating || isSyncingFromLines) return
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
      if (isCalculating || isSyncingFromLines) return
      isCalculating = true
      js_w()
      setTimeout(() => {
        isCalculating = false
      }, 0)
    },
    { immediate: false },
  )

  watch(
    () => inputData.value?.item_list,
    () => {
      syncHeaderMeasuresFromOrderLines()
    },
    { deep: true },
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
  .warehouse-order-display-field {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    gap: 8px;
  }

  .warehouse-order-display-value {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    color: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .whs-order-detail--readonly {
    pointer-events: none;
    user-select: none;
  }

  .whs-order-detail--readonly :deep(.v-field),
  .whs-order-detail--readonly :deep(.v-selection-control),
  .whs-order-detail--readonly :deep(.v-btn) {
    opacity: 0.72;
  }

  .whs-order-detail-fieldset {
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  .address-fields-col,
  .address-pair-row {
    width: 100%;
  }

  .address-name-readonly {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .address-name-readonly__code {
    flex: 0 1 100px;
    min-width: 72px;
    max-width: 100px;
  }

  .address-name-readonly__name {
    flex: 1 1 0;
    min-width: 0;
    width: 0;
  }

  .address-name-readonly__code :deep(.v-input),
  .address-name-readonly__code :deep(.v-field),
  .address-name-readonly__name :deep(.v-input),
  .address-name-readonly__name :deep(.v-text-field) {
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
