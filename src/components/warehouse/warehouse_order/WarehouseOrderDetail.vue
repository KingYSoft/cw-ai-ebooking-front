<template>
  <v-form :ref="setRef" class="ref-form-pre" color="background">
    <v-card-text class="py-2">
      <v-row dense>
        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              Shipper
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
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
              @on-new-handle="onNewHandle('SHIPPER')"
              @row-select="onSelectAddr($event, 'SHIPPER')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Name:</div>
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
                <div class="text-caption text-end w-label">Address1:</div>
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
                <div class="text-caption text-end w-label">Address2:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.shipper.add_address3"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Address3:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              Consignee
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
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
              @on-new-handle="onNewHandle('CONSIGNEE')"
              @row-select="onSelectAddr($event, 'CONSIGNEE')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Name:</div>
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
                <div class="text-caption text-end w-label">Address1:</div>
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
                <div class="text-caption text-end w-label">Address2:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.consignee.add_address3"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Address3:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              Others
            </div>
          </v-divider>

          <div class="mt-1">
            <v-row no-gutters>
              <v-col cols="6">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <FDatePicker
                    v-model:date-value="inputData.bkg_so_confirm_date"
                    :date-props="{ clearable: true }"
                    max="2099-12-31"
                    min="2000-01-01"
                    min-width="100%"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">SO Confirm:</div>
                    </template>
                  </FDatePicker>

                  <FDatePicker
                    v-model:date-value="inputData.bkg_vgm_cut_off_date"
                    :date-props="{ clearable: true }"
                    max="2099-12-31"
                    min="2000-01-01"
                    min-width="100%"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">VGM Cut-Off:</div>
                    </template>
                  </FDatePicker>

                  <FDatePicker
                    v-model:date-value="inputData.bkg_doc_cut_off_date"
                    :date-props="{ clearable: true }"
                    max="2099-12-31"
                    min="2000-01-01"
                    min-width="100%"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">Doc Cut-Off:</div>
                    </template>
                  </FDatePicker>

                  <FDatePicker
                    v-model:date-value="inputData.bkg_port_cargo_cut_off_date"
                    :date-props="{ clearable: true }"
                    max="2099-12-31"
                    min="2000-01-01"
                    min-width="100%"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">Port Cargo Cut-Off:</div>
                    </template>
                  </FDatePicker>
                </div>
              </v-col>

              <v-col cols="6">
                <div class="d-flex align-start flex-column flex-wrap ga-1">
                  <v-text-field
                    v-model="inputData.bkg_so_number"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    :rules="convertRequiredRules.soNumber"
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">
                        SO Number<span class="text-primary">^</span>:
                      </div>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="inputData.bkg_po_number"
                    color="primary"
                    density="compact"
                    hide-details
                    min-width="100%"
                    :rules="convertRequiredRules.poNumber"
                    type="input"
                    variant="outlined"
                  >
                    <template #prepend>
                      <div class="text-caption text-end w-label-100">
                        PO Number<span class="text-primary">^</span>:
                      </div>
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <!-- <v-row class="mt-2" dense>
        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              Notify Party
            </div>
          </v-divider>
          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
            <FRemoteTableMenuWithCode
              v-model="inputData.notify_party.add_address_name"
              bind-key="code"
              :bind-value="inputData.notify_party.add_address_code"
              display-key="company_name"
              :fetch-method="organizationQueryOrgAddress"
              :headers="addrTableHeaders"
              :query-extra="{ address_type: 'WHS' }"
              :text-field-props="{ 'min-width': '100%' }"
              virtual
              @click-clear="OnClearAddr('NOTIFY_PARTY')"
              @on-new-handle="onNewHandle('NOTIFY_PARTY')"
              @row-select="onSelectAddr($event, 'NOTIFY_PARTY')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Name:</div>
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
                  <span>SAME AS CONSIGNEE</span>
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
                <div class="text-caption text-end w-label">Address1:</div>
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
                <div class="text-caption text-end w-label">Address2:</div>
              </template>
            </v-text-field>
            <v-text-field
              v-model="inputData.notify_party.add_address3"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">Address3:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>
      </v-row> -->
      <v-divider class="my-2" />

      <v-row dense>
        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-select
              id="1@bkg_transport_mode"
              v-model="inputData.bkg_transport_mode"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('transportMode')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
              @update:model-value="
                $event => {
                  if ($event === 'AIR') {
                    inputData.bkg_packing_mode = 'LSE'
                  } else {
                    inputData.bkg_packing_mode = 'FCL'
                  }
                }
              "
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Transport:</div>
              </template>
            </v-select>

            <v-select
              id="1@bkg_packing_mode"
              v-model="inputData.bkg_packing_mode"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('containerMode')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Container:</div>
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
              :model-value="inputData.bkg_load_port"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              variant="outlined"
              @update:focused="
                $event => {
                  if ($event) {
                    queryPort(inputData.bkg_load_port)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.bkg_load_port = $event?.rl_code ?? null
                  inputData.bkg_load_port_name = $event?.rl_port_name ?? null
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
                <div class="text-caption text-end w-label-110">Load:</div>
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
              :model-value="inputData.bkg_discharge_port"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              variant="outlined"
              @update:focused="
                $event => {
                  if ($event) {
                    queryPort(inputData.bkg_discharge_port)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.bkg_discharge_port = $event?.rl_code ?? null
                  inputData.bkg_discharge_port_name = $event?.rl_port_name ?? null
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
                <div class="text-caption text-end w-label-110">Discharge:</div>
              </template>
            </v-autocomplete>

            <FDatePicker
              id="1@bkg_etd"
              v-model:date-value="inputData.bkg_etd"
              max="2099-12-31"
              min="2000-01-01"
              :rules="bkgEtdRules"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  ETD<span class="text-primary">^</span>:
                </div>
              </template>
            </FDatePicker>

            <FDatePicker
              id="1@bkg_eta"
              v-model:date-value="inputData.bkg_eta"
              max="2099-12-31"
              min="2000-01-01"
              :rules="bkgEtaRules"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  ETA<span class="text-primary">^</span>:
                </div>
              </template>
            </FDatePicker>

            <FDatePicker
              id="1@bkg_cargo_ready"
              v-model:date-value="inputData.bkg_cargo_ready"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Cargo Ready Date:</div>
              </template>
            </FDatePicker>

            <FDatePicker
              id="1@bkg_est_pickup"
              v-model:date-value="inputData.bkg_est_pickup"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Est. Pickup:</div>
              </template>
            </FDatePicker>

            <FDatePicker
              id="1@bkg_est_delivery"
              v-model:date-value="inputData.bkg_est_delivery"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Est. Delivery:</div>
              </template>
            </FDatePicker>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-number-input
              id="1@bkg_actual_weight"
              v-model="inputData.bkg_actual_weight"
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
                <div class="text-caption text-end w-label-110">Gross Weight:</div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_unit_of_weight"
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
              id="1@bkg_actual_volume"
              v-model="inputData.bkg_actual_volume"
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
                <div class="text-caption text-end w-label-110">CBM:</div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_unit_of_volume"
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
              id="1@bkg_volume_weight"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :model-value="inputData.bkg_volume_weight"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Volume Weight:</div>
              </template>

              <template #append>
                <v-text-field
                  color="primary"
                  density="compact"
                  hide-details
                  :model-value="inputData.bkg_unit_of_weight"
                  readonly
                  type="input"
                  variant="underlined"
                  width="50px"
                />
              </template>
            </v-text-field>

            <v-text-field
              id="1@bkg_actual_chargeable"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :model-value="inputData.bkg_actual_chargeable"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Chargeable Weight:</div>
              </template>

              <template #append>
                <v-text-field
                  color="primary"
                  density="compact"
                  hide-details
                  :model-value="inputData.bkg_unit_of_volume"
                  readonly
                  type="input"
                  variant="underlined"
                  width="50px"
                />
              </template>
            </v-text-field>

            <div class="d-flex align-center ga-0 w-100">
              <v-number-input
                id="1@bkg_total_package_count"
                v-model="inputData.bkg_total_package_count"
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
                  <div class="text-caption text-end w-label-110">No. of Package:</div>
                </template>
              </v-number-input>

              <FRemoteTableMenu
                v-model="inputData.bkg_pack_type"
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
                  row => assignPackageTypeFromRow(row, inputData, 'bkg_pack_type', 'bkg_pack_type')
                "
              />
            </div>

            <v-select
              id="1@bkg_inco"
              v-model="inputData.bkg_inco"
              auto-select-first
              autocomplete="off"
              class="flex-1-1"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('incoTerm')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Inco Term:</div>
              </template>
            </v-select>

            <v-select
              id="1@bkg_freight_terms"
              v-model="inputData.bkg_freight_terms"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('freightTerms')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Freight Terms:</div>
              </template>
            </v-select>

            <v-select
              id="1@bkg_freight_terms"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('freightTerms')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Local Charge:</div>
              </template>
            </v-select>

            <v-select
              id="1@bkg_delivery_mode"
              v-model="inputData.bkg_delivery_mode"
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
                <div class="text-caption text-end w-label-110">Delivery Mode:</div>
              </template>
            </v-select>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-text-field
              v-model="inputData.bkg_booking_reference"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Shipper Ref.:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.bkg_additional_terms"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Additional Terms:</div>
              </template>
            </v-text-field>

            <v-select
              id="1@bkg_release_type"
              v-model="inputData.bkg_release_type"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="appStore.appCombobox.getCombobox('releaseType')"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              :rules="convertRequiredRules.releaseType"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  Release Type<span class="text-primary">^</span>:
                </div>
              </template>
            </v-select>
            <!-- <v-text-field
              v-model="inputData.bkg_commodity"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  Commodity:
                </div>
              </template>
            </v-text-field>
            <v-number-input
              id="1@bkg_goods_value"
              v-model="inputData.bkg_goods_value"
              class="hide-step"
              color="primary"
              density="compact"
              hide-details
              :max="999999999.99999"
              :min="0"
              :min-fraction-digits="0"
              min-width="100%"
              :precision="5"
              :rules="inputDataRules.bkg_goods_value"
              type="input"
              variant="outlined"
              @update:model-value="
                () => {
                  if (inputData.bkg_goods_value === null) {
                    inputData.bkg_goods_value_currency = null
                  } else {
                    if (inputData.bkg_goods_value_currency) {
                      //
                    } else {
                      inputData.bkg_goods_value_currency = 'USD'
                    }
                  }
                }
              "
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Cargo Value:</div>
              </template>
              <template #append>
                <v-select
                  id="1@bkg_goods_value_currency"
                  v-model="inputData.bkg_goods_value_currency"
                  auto-select-first
                  autocomplete="off"
                  color="primary"
                  density="compact"
                  hide-details
                  item-title="code"
                  item-value="code"
                  :items="appStore.appCombobox.getCombobox('currency')"
                  :list-props="{
                    density: 'compact',
                  }"
                  no-filter
                  variant="underlined"
                  width="60px"
                />
              </template>
            </v-number-input>
            <v-number-input
              id="1@bkg_insurance_value"
              v-model="inputData.bkg_insurance_value"
              class="hide-step"
              color="primary"
              density="compact"
              hide-details
              :max="999999999.99999"
              :min="0"
              :min-fraction-digits="0"
              min-width="100%"
              :precision="5"
              :rules="inputDataRules.bkg_insurance_value"
              type="input"
              variant="outlined"
              @update:model-value="
                () => {
                  if (inputData.bkg_insurance_value === null) {
                    inputData.bkg_insurance_currency = null
                  } else {
                    if (inputData.bkg_insurance_currency) {
                      //
                    } else {
                      inputData.bkg_insurance_currency = 'USD'
                    }
                  }
                }
              "
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Ins. Value:</div>
              </template>
              <template #append>
                <v-select
                  id="1@bkg_insurance_currency"
                  v-model="inputData.bkg_insurance_currency"
                  auto-select-first
                  autocomplete="off"
                  color="primary"
                  density="compact"
                  hide-details
                  item-title="code"
                  item-value="code"
                  :items="appStore.appCombobox.getCombobox('currency')"
                  :list-props="{
                    density: 'compact',
                  }"
                  no-filter
                  variant="underlined"
                  width="60px"
                />
              </template>
            </v-number-input>
            <FTextInput
              v-model:text-value="inputData.bkg_goods_description"
              min-width="100%"
              :rules="inputDataRules.bkg_goods_description"
              :textarea-props="{ label: 'Good Desc.' }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Good Desc.:</div>
              </template>
            </FTextInput>
            <FTextInput
              v-model:text-value="inputData.bkg_marks_nos"
              min-width="100%"
              :rules="inputDataRules.bkg_marks_nos"
              :textarea-props="{ label: 'Marks & No.' }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">Marks & No.:</div>
              </template>
            </FTextInput> -->
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
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
                <div class="text-caption text-end w-label-110">Job Direction:</div>
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
                <div class="text-caption text-end w-label-110">Sales Rep:</div>
              </template>
            </v-autocomplete> -->
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />
  </v-form>

  <v-tabs v-model="tab" color="primary" density="compact">
    <v-tab class="erp-tab" :value="1">Inbound Order</v-tab>
    <v-tab class="erp-tab" :value="2">Outbound Order</v-tab>
    <v-tab class="erp-tab" :value="3">Transportation</v-tab>
    <v-tab class="erp-tab" :value="4">Others</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab" class="custom-window">
    <v-tabs-window-item :value="1">
      <v-sheet class="border-content">
        <InboundOrder v-model:input-data="inputData" />
      </v-sheet>
    </v-tabs-window-item>

    <v-tabs-window-item :value="2">
      <v-sheet class="pa-4 border-content" min-height="400">Outbound Order</v-sheet>
    </v-tabs-window-item>

    <v-tabs-window-item :value="3">
      <v-sheet class="pa-4 border-content" min-height="400">Transportation</v-sheet>
    </v-tabs-window-item>

    <v-tabs-window-item :value="4">
      <v-sheet class="pa-4 border-content" min-height="400">Others</v-sheet>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import { organizationQueryOrgAddress, organizationQueryOrgCarrier } from '@/api/organization'
  import { queryServiceLevelPage } from '@/api/service_level'
  import { debounceFn } from '@/api/utils'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import FTextInput from '@/components/FTextInput.vue'
  import {
    assignContainerTypeFromRow,
    containerTypeTableHeaders,
    fetchContainerTypes,
  } from '@/composables/useContainerTypeRemoteMenu'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeMenuTextFieldProps,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useAppStore } from '@/stores/app'

  import InboundOrder from './InboundOrder.vue'

  defineOptions({
    name: 'WarehouseOrderDetail',
  })

  const appStore = useAppStore()
  const display = useDisplay()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => {},
    },
    queryPortList: {
      type: Array,
      default: () => [],
    },
    queryAllUserList: {
      type: Array,
      default: () => [],
    },
    convertToShipmentCheck: {
      type: Boolean,
      default: true,
    },
  })
  const { inputDataRules, queryPortList, queryAllUserList, convertToShipmentCheck } = toRefs(props)
  const convertRequiredRule = fieldLabel => {
    return value => {
      return String(value ?? '').trim() !== '' || `${fieldLabel} is required.`
    }
  }
  const convertRequiredRules = computed(() => {
    if (!convertToShipmentCheck.value) {
      return {
        etd: [],
        eta: [],
        cargoReadyDate: [],
        carrier: [],
        contractNo: [],
        releaseType: [],
        soNumber: [],
        poNumber: [],
      }
    }
    return {
      etd: [convertRequiredRule('ETD')],
      eta: [convertRequiredRule('ETA')],
      cargoReadyDate: [convertRequiredRule('Cargo Ready Date')],
      carrier: [convertRequiredRule('Carrier')],
      contractNo: [convertRequiredRule('Contract No')],
      releaseType: [convertRequiredRule('Release Type')],
      soNumber: [convertRequiredRule('SO Number')],
      poNumber: [convertRequiredRule('PO Number')],
    }
  })

  /** ETD 须严格晚于 Cargo Ready（yyyy-MM-dd：es > cs，不可同日） */
  function validateBookingEtdNotBeforeCargoReady() {
    return () => {
      const es = String(inputData.value.bkg_etd ?? '').trim()
      const cs = String(inputData.value.bkg_cargo_ready ?? '').trim()
      if (!es || !cs) return true
      if (es > cs) return true
      return t('$vuetify.custom.bookingPage.form.etd_must_be_before_cargo_ready.err')
    }
  }

  /** SEA: ETA > ETD；AIR: ETA >= ETD */
  function validateBookingEtaVsEtd() {
    return () => {
      const mode = String(inputData.value.bkg_transport_mode ?? '').toUpperCase()
      const etd = String(inputData.value.bkg_etd ?? '').trim()
      const eta = String(inputData.value.bkg_eta ?? '').trim()
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

  const bkgCargoReadyRulesWithOrder = computed(() => [
    ...(inputDataRules.value.bkg_cargo_ready ?? []),
    validateBookingEtdNotBeforeCargoReady(),
  ])

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
  })

  const emit = defineEmits([
    'add-container',
    'add-new-loose',
    'on-new-handle',
    'query-port',
    'remove-container',
    'remove-new-loose',
    'on-select-addr',
    'query-all-user',
    'register-form-refs',
    'on-clear-addr',
  ])

  const addNewContainer = () => {
    emit('add-container')
  }

  const addNewLoose = () => {
    emit('add-new-loose')
  }

  const onNewHandle = type => {
    emit('on-new-handle', type)
  }

  const queryPort = value => {
    emit('query-port', value)
  }

  const queryCarrierList = ref([])
  const queryCarrier = debounceFn(async (inputStr, signal) => {
    try {
      const { data } = await organizationQueryOrgCarrier(
        {
          inputStr: String(inputStr ?? ''),
        },
        signal,
      )
      queryCarrierList.value = Array.isArray(data?.list) ? data.list : []
    } catch (error) {
      console.log(error)
    }
  })

  const removeNewContainer = index => {
    emit('remove-container', index)
  }

  const removeNewLoose = index => {
    emit('remove-new-loose', index)
  }

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const OnClearAddr = type => {
    emit('on-clear-addr', type)
  }
  const queryAllUser = event => {
    emit('query-all-user', event)
  }

  const setRef = el => {
    emit('register-form-refs', el)
  }

  const serviceLevelCodeItems = ref([])

  const loadServiceLevelCodes = async () => {
    try {
      const res = await queryServiceLevelPage({
        SkipCount: 0,
        MaxResultCount: 9999,
        filters: [],
      })
      const items = res?.data?.items ?? []
      serviceLevelCodeItems.value = items.map(item => item?.code).filter(code => Boolean(code))
    } catch (error) {
      console.error('loadServiceLevelCodes failed:', error)
      serviceLevelCodeItems.value = []
    }
  }
  loadServiceLevelCodes()

  const addrTableHeaders = [
    {
      title: 'Code',
      key: 'code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Company Name',
      key: 'company_name',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Address Code',
      key: 'address_code',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    {
      title: 'Address1',
      key: 'address1',
      align: 'start',
      maxWidth: '200',
      cellProps: {
        class: 'text-truncate',
      },
      minWidth: '140',
    },
    { title: 'City', key: 'city', align: 'start', minWidth: '140' },
    { title: 'Country', key: 'country_code', align: 'start', minWidth: '140' },
  ]

  const tblContainerHeaders = [
    {
      title: 'Actions',
      key: 'actions',
      width: '40px',
      align: 'center',
    },
    {
      title: 'Container',
      key: 'pac_container_type',
      align: 'start',
      minWidth: '90px',
      width: '90px',
    },
    {
      title: 'Count',
      key: 'pac_container_count',
      align: 'start',
      minWidth: '80px',
      width: '80px',
    },
    {
      title: 'Container No',
      key: 'pac_container_num',
      align: 'start',
      minWidth: '140px',
      width: '140px',
    },
    {
      title: 'Seal No',
      key: 'pac_seal_num',
      align: 'start',
      minWidth: '140px',
      width: '140px',
    },
    {
      title: 'SOC',
      key: 'pac_is_soc',
      width: '40px',
      align: 'center',
    },
    {
      title: 'Commodity',
      key: 'pac_commodity',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Gross Weight',
      key: 'pac_gross_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Volume',
      key: 'pac_actual_volume',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'No. of Package',
      key: 'pac_package_count',
      align: 'start',
      minWidth: '160px',
      width: '160px',
    },
    {
      title: 'HS Code',
      key: 'pac_harmonised_code',
      align: 'start',
      minWidth: '120px',
      width: '120px',
    },
    {
      title: 'Description',
      key: 'pac_description',
      align: 'start',
      minWidth: '120',
    },
  ]

  const tblLooseHeaders = [
    {
      title: 'Actions',
      key: 'actions',
      width: '40px',
    },
    {
      title: 'No. of Package',
      key: 'pac_package_count',
      align: 'start',
      minWidth: '160px',
      width: '160px',
    },
    {
      title: 'Gross Weight',
      key: 'pac_gross_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Volume',
      key: 'pac_actual_volume',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Volume Weight',
      key: 'pac_volume_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Chargeable Weight',
      key: 'pac_chargeable_weight',
      align: 'start',
      minWidth: '150px',
      width: '150px',
    },
    {
      title: 'Length',
      key: 'pac_length',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Width',
      key: 'pac_width',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Height',
      key: 'pac_height',
      align: 'start',
      minWidth: '100px',
      width: '100px',
    },
    {
      title: 'Description',
      key: 'pac_description',
      align: 'start',
      minWidth: '100',
    },
  ]

  /** Volume Weight 单位跟 Gross Weight；Chargeable Weight 单位跟 CBM */
  const syncDerivedWeightUnits = () => {
    if (!inputData.value) return
    const weightUom = inputData.value.bkg_unit_of_weight ?? 'KG'
    const volumeUom = inputData.value.bkg_unit_of_volume ?? 'M3'
    if (inputData.value.bkg_volume_weight_unit !== weightUom) {
      inputData.value.bkg_volume_weight_unit = weightUom
    }
    if (inputData.value.bkg_actual_chargeable_unit !== volumeUom) {
      inputData.value.bkg_actual_chargeable_unit = volumeUom
    }
  }

  const js_w = () => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!inputData.value) return
    syncDerivedWeightUnits()

    const cbm_d = new Decimal(inputData.value.bkg_actual_volume ?? 0)
    const cbm = cbm_d.isNaN() ? new Decimal(0) : cbm_d
    const vol_weight = cbm.times(new Decimal(166)).times(new Decimal(1000)).div(new Decimal(1000))
    const vw = vol_weight.toNumber()
    const newVolumeWeight = vw === 0 ? null : vw

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.bkg_volume_weight !== newVolumeWeight) {
      inputData.value.bkg_volume_weight = newVolumeWeight
    }

    const gw_d = new Decimal(inputData.value.bkg_actual_weight ?? 0)
    const gw = gw_d.isNaN() ? new Decimal(0) : gw_d
    const cg = gw.lessThan(vol_weight) ? vol_weight.toNumber() : gw.toNumber()
    const newChargeableWeight = cg === 0 ? null : cg

    // 只在值真正改变时才更新，避免触发不必要的响应式更新
    if (inputData.value.bkg_actual_chargeable !== newChargeableWeight) {
      inputData.value.bkg_actual_chargeable = newChargeableWeight
    }
  }

  // 使用标志位防止循环更新
  let isCalculating = false
  watch(
    () => inputData.value.bkg_actual_volume,
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
    () => inputData.value.bkg_actual_weight,
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
    () => inputData.value?.bkg_unit_of_weight,
    () => syncDerivedWeightUnits(),
    { immediate: true },
  )
  watch(
    () => inputData.value?.bkg_unit_of_volume,
    () => syncDerivedWeightUnits(),
    { immediate: true },
  )

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

  const syncTopMetricsToRows = (options = {}) => {
    const skipPackage = options.skipPackage === true
    const gross = inputData.value?.bkg_actual_weight ?? null
    const volume = inputData.value?.bkg_actual_volume ?? null
    const packageCount = inputData.value?.bkg_total_package_count ?? null
    const packageType = inputData.value?.bkg_pack_type ?? null
    const weightUom = inputData.value?.bkg_unit_of_weight ?? null
    const volumeUom = inputData.value?.bkg_unit_of_volume ?? null
    const volumeWeight = inputData.value?.bkg_volume_weight ?? null
    const chargeable = inputData.value?.bkg_actual_chargeable ?? null

    for (const row of inputData.value?.pac_list ?? []) {
      row.pac_gross_weight = gross
      row.pac_actual_volume = volume
      if (!skipPackage) {
        row.pac_package_count = packageCount
        row.pac_pack_type = packageType
      }
      row.pac_unit_of_weight = weightUom
      row.pac_unit_of_volume = volumeUom
      row.pac_volume_weight = volumeWeight
      row.pac_chargeable_weight = chargeable
      jsPackingW(row)
    }
  }

  const topMetricsWatchDeps = () => [
    inputData.value?.bkg_actual_weight,
    inputData.value?.bkg_actual_volume,
    inputData.value?.bkg_total_package_count,
    inputData.value?.bkg_pack_type,
    inputData.value?.bkg_unit_of_weight,
    inputData.value?.bkg_unit_of_volume,
    inputData.value?.bkg_volume_weight,
    inputData.value?.bkg_actual_chargeable,
  ]

  const tab = ref('one')
  watch(
    topMetricsWatchDeps,
    (newVals, oldVals) => {
      const skipPackage =
        oldVals === undefined ||
        (Array.isArray(oldVals) &&
          Array.isArray(newVals) &&
          newVals[2] === oldVals[2] &&
          newVals[3] === oldVals[3])
      syncTopMetricsToRows({ skipPackage })
    },
    // 首次加载不把抬头字段灌入 pac_list 每一行，避免覆盖接口明细；用户改抬头后再同步各行
    { immediate: false },
  )
</script>
