<template>
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
              readonly: true,
              rules: inputDataRules.shipper_name,
            }"
            virtual
            @click-clear="OnClearAddr('SHIPPER')"
            @row-select="onSelectAddr($event, 'SHIPPER')"
          >
            <template #prepend>
              <div class="text-caption text-end w-label">Name<span class="text-red">*</span>:</div>
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
              rules: inputDataRules.shipper_name,
            }"
            virtual
            @click-clear="OnClearAddr('CONSIGNEE')"
            @row-select="onSelectAddr($event, 'CONSIGNEE')"
          >
            <template #prepend>
              <div class="text-caption text-end w-label">Name<span class="text-red">*</span>:</div>
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
                  v-model:date-value="inputData.wso_so_confirm_date"
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
                  v-model:date-value="inputData.wso_vgm_cut_off_date"
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
                  v-model:date-value="inputData.wso_doc_cut_off_date"
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
                  v-model:date-value="inputData.wso_port_cargo_cut_off_date"
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
                    <div class="text-caption text-end w-label-100">
                      SO Number<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="inputData.wso_po_number"
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
                      PO Number<span class="text-red">*</span>:
                    </div>
                  </template>
                </v-text-field>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-2" />

    <v-row dense>
      <v-col :cols="rescols('c12l3s6')">
        <div class="d-flex align-start flex-column flex-wrap ga-1">
          <v-select
            id="1@wso_transport_mode"
            v-model="inputData.wso_transport_mode"
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
            :rules="inputDataRules.wso_transport_mode"
            variant="outlined"
            @update:model-value="
              $event => {
                if ($event === 'AIR') {
                  inputData.wso_packing_mode = 'LSE'
                } else {
                  inputData.wso_packing_mode = 'FCL'
                }
              }
            "
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Transport<span class="text-red">*</span>:
              </div>
            </template>
          </v-select>

          <v-select
            id="1@wso_packing_mode"
            v-model="inputData.wso_packing_mode"
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
            :rules="inputDataRules.wso_packing_mode"
            variant="outlined"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Container<span class="text-red">*</span>:
              </div>
            </template>
          </v-select>

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
            :rules="inputDataRules.wso_load_port"
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
              <div class="text-caption text-end w-label-110">Discharge:</div>
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
                ETD<span class="text-red">*</span>:
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
                ETA<span class="text-red">*</span>:
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
              <div class="text-caption text-end w-label-110">Cargo Ready Date:</div>
            </template>
          </FDatePicker>

          <FDatePicker
            id="1@wso_est_pickup"
            v-model:date-value="inputData.wso_est_pickup"
            max="2099-12-31"
            min="2000-01-01"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">Est. Pickup:</div>
            </template>
          </FDatePicker>

          <FDatePicker
            id="1@wso_est_delivery"
            v-model:date-value="inputData.wso_est_delivery"
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
            :rules="inputDataRules.wso_actual_weight"
            type="input"
            variant="outlined"
            @update:model-value="js_w"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Gross Weight<span class="text-red">*</span>:
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
            :rules="inputDataRules.wso_actual_volume"
            type="input"
            variant="outlined"
            @update:model-value="js_w"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                CBM<span class="text-red">*</span>:
              </div>
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
            :rules="inputDataRules.wso_volume_weight"
            type="input"
            variant="outlined"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Volume Weight<span class="text-red">*</span>:
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
            v-model="inputData.wso_actual_chargeable"
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
            :rules="inputDataRules.wso_actual_chargeable"
            type="input"
            variant="outlined"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Chargeable Weight<span class="text-red">*</span>:
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
              :rules="inputDataRules.wso_total_package_count"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-110">
                  No. of Package<span class="text-red">*</span>:
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
                row => assignPackageTypeFromRow(row, inputData, 'wso_pack_type', 'wso_pack_type')
              "
            />
          </div>

          <v-select
            id="1@wso_inco"
            v-model="inputData.wso_inco"
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
            v-model="inputData.wso_freight_terms"
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
              <div class="text-caption text-end w-label-110">Delivery Mode:</div>
            </template>
          </v-select>

          <v-autocomplete
            auto-select-first
            autocomplete="off"
            clearable
            :custom-filter="filterMarketOption"
            density="compact"
            hide-details
            item-title="market"
            item-value="pk"
            :items="marketOptions"
            :menu-props="{ maxWidth: '320px' }"
            min-width="100%"
            :model-value="inputData.wso_market"
            return-object
            variant="outlined"
            @update:model-value="
              $event => {
                inputData.wso_market_pk = $event?.pk ?? null
                inputData.wso_market = $event?.market ?? null
                if (Array.isArray(inputData.item_list)) {
                  inputData.item_list.forEach(row => {
                    row.woi_market_pk = $event?.pk ?? null
                    row.woi_market = $event?.market ?? null
                    row.woi_plant_id = $event?.plant_id ?? null
                  })
                }
              }
            "
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">Market:</div>
            </template>

            <template #item="{ props: itemProps, item: option }">
              <v-list-item
                v-bind="itemProps"
                :subtitle="
                  [option.raw.plant_id, option.raw.destination].filter(Boolean).join(' / ')
                "
                :title="option.raw.market"
              />
            </template>
          </v-autocomplete>
        </div>
      </v-col>

      <v-col :cols="rescols('c12l3s6')">
        <div class="d-flex align-start flex-column flex-wrap ga-1">
          <v-text-field
            v-model="inputData.wso_booking_reference"
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
            v-model="inputData.wso_additional_terms"
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
            id="1@wso_release_type"
            v-model="inputData.wso_release_type"
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
                Release Type<span class="text-red">*</span>:
              </div>
            </template>
          </v-select>

          <v-select
            id="1@wso_warehouse_pk"
            v-model="inputData.wso_warehouse_pk"
            auto-select-first
            autocomplete="off"
            density="compact"
            hide-details
            item-title="code"
            item-value="pk"
            :items="appStore.appCombobox.getCombobox('userWarehouse')"
            :menu-props="{
              'max-width': '100%',
            }"
            min-width="100%"
            no-data-text="$vuetify.custom.app.searchMore"
            no-filter
            :rules="convertRequiredRules.wso_warehouse_pk"
            variant="outlined"
          >
            <template #prepend>
              <div class="text-caption text-end w-label-110">
                Warehouse<span class="text-red">*</span>:
              </div>
            </template>
          </v-select>
        </div>
      </v-col>

      <v-col :cols="rescols('c12l3s6')">
        <div class="d-flex align-start flex-column flex-wrap ga-1" />
      </v-col>
    </v-row>
  </v-card-text>

  <!-- <v-divider />

  <v-tabs v-model="tab" color="indigo" density="compact">
    <v-tab :value="1">Inbound Order</v-tab>
    <v-tab :value="2">Outbound Order</v-tab>
    <v-tab :value="3">Transportation</v-tab>
    <v-tab :value="4">Others</v-tab>
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
  </v-tabs-window> -->
</template>
<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref, toRefs } from 'vue'
  import { useLocale } from 'vuetify'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { getWhsMarketOptions } from '@/api/whs-market'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { useAppStore } from '@/stores/app'

  import InboundOrder from './InboundOrder.vue'

  defineOptions({
    name: 'WarehouseOrderDetail',
  })

  const appStore = useAppStore()
  // const display = useDisplay()
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
  })
  const { inputDataRules, queryPortList } = toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => {
      return {}
    },
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

  const loadMarketOptions = async () => {
    try {
      const { data } = await getWhsMarketOptions()
      marketOptions.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('loadMarketOptions failed:', error)
      marketOptions.value = []
    }
  }
  loadMarketOptions()

  const ensureUserWarehouse = () => {
    if (!inputData.value.wso_warehouse_pk) {
      const aa = appStore.appCombobox.getCombobox('userWarehouse')
      if (aa && aa.length > 0) {
        inputData.value.wso_warehouse_pk = aa[0].pk
      }
    }
  }
  onMounted(() => {
    nextTick(() => {
      ensureUserWarehouse()
    })
  })

  const convertRequiredRule = fieldLabel => {
    return value => {
      return String(value ?? '').trim() !== '' || `${fieldLabel} is required.`
    }
  }
  const convertRequiredRules = computed(() => {
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

  const js_w = () => {
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

  const tab = ref(1)
</script>
