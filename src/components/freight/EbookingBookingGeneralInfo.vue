<template>
  <div>
    <v-card-text class="py-2">
      <v-row>
        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              {{ detailSection('shipper') }}
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
            <FRemoteTableMenu
              :id="`${fieldIdPrefix}@shipper_name`"
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
              @click-clear="onClearAddr('SHIPPER')"
              @row-select="onSelectAddr($event, 'SHIPPER')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">
                  {{ detailField('name') }}<span class="text-red">*</span>:
                </div>
              </template>
            </FRemoteTableMenu>

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
                <div class="text-caption text-end w-label">{{ detailField('address1') }}:</div>
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
                <div class="text-caption text-end w-label">{{ detailField('address2') }}:</div>
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
                <div class="text-caption text-end w-label">{{ detailField('address3') }}:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
              {{ detailSection('consignee') }}
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
            <FRemoteTableMenu
              :id="`${fieldIdPrefix}@consignee_name`"
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
              @click-clear="onClearAddr('CONSIGNEE')"
              @row-select="onSelectAddr($event, 'CONSIGNEE')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">
                  {{ detailField('name') }}<span class="text-red">*</span>:
                </div>
              </template>
            </FRemoteTableMenu>

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
                <div class="text-caption text-end w-label">{{ detailField('address1') }}:</div>
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
                <div class="text-caption text-end w-label">{{ detailField('address2') }}:</div>
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
                <div class="text-caption text-end w-label">{{ detailField('address3') }}:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l4s6')">
          <v-divider>
            <div
              class="text-center text-caption text-uppercase text-on-surface opacity-70"
              style="width: 120px"
            >
              {{ detailSection('notifyParty') }}
            </div>
          </v-divider>

          <div class="mt-1 d-flex align-start flex-column flex-wrap ga-1">
            <FRemoteTableMenu
              v-model="inputData.notify_party.add_address_name"
              bind-key="org_code"
              :bind-value="inputData.notify_party.add_address_code"
              display-key="company_name"
              :fetch-method="organizationQueryOrgAddress"
              :headers="addrTableHeaders"
              :query-extra="{ address_type: 'NOTIFY_PARTY' }"
              :text-field-props="{
                'min-width': '100%',
              }"
              virtual
              @click-clear="onClearAddr('NOTIFY_PARTY')"
              @row-select="onSelectAddr($event, 'NOTIFY_PARTY')"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('name') }}:</div>
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
                            inputData.notify_party = {
                              add_address_name: 'SAME AS CONSIGNEE',
                            }
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
            </FRemoteTableMenu>

            <v-text-field
              v-model="inputData.notify_party.add_address1"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :readonly="inputData.notify_party_same_as_consignee === 'Y'"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('address1') }}:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.notify_party.add_address2"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :readonly="inputData.notify_party_same_as_consignee === 'Y'"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label">{{ detailField('address2') }}:</div>
              </template>
            </v-text-field>

            <v-text-field
              v-model="inputData.notify_party.add_address3"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :readonly="inputData.notify_party_same_as_consignee === 'Y'"
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

      <!--  <v-divider>
        <div class="my-1 text-center text-caption text-uppercase text-on-surface opacity-70">
          SHIPPER / CONSIGNEE / NOTIFY PARTY / PICKUP
        </div>
      </v-divider>
     <v-row dense>
        <v-col v-for="block in partyBlocks" :key="block.key" :cols="rescols('c12l3s6')">
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
      </v-row> -->

      <v-row v-if="showCargoFields" dense>
        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-select
              :id="`${fieldIdPrefix}@bkg_transport_mode`"
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
              :rules="inputDataRules.bkg_transport_mode"
              variant="outlined"
              @update:model-value="onTransportChange"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('transport') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>

            <v-select
              :id="`${fieldIdPrefix}@bkg_packing_mode`"
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
              :rules="inputDataRules.bkg_packing_mode"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('container') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>

            <v-autocomplete
              :id="`${fieldIdPrefix}@bkg_origin`"
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
              :model-value="inputData.bkg_origin"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              :rules="inputDataRules.bkg_origin"
              variant="outlined"
              @update:focused="
                $event => {
                  if ($event) {
                    queryPort(inputData.bkg_origin)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.bkg_origin = $event?.rl_code ?? null
                  inputData.bkg_origin_name = $event?.rl_port_name ?? null
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
                <div class="text-caption text-end w-label-100">
                  {{ detailField('origin') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-autocomplete>

            <v-autocomplete
              :id="`${fieldIdPrefix}@bkg_destination`"
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
              :rules="inputDataRules.bkg_destination"
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
                <div class="text-caption text-end w-label-100">
                  {{ detailField('destination') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-autocomplete>

            <v-number-input
              :id="`${fieldIdPrefix}@bkg_actual_weight`"
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
              :rules="inputDataRules.bkg_actual_weight"
              type="input"
              variant="outlined"
              @update:model-value="js_w"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('grossWeight') }}<span class="text-red">*</span>:
                </div>
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
              :id="`${fieldIdPrefix}@bkg_actual_volume`"
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
              :rules="inputDataRules.bkg_actual_volume"
              type="input"
              variant="outlined"
              @update:model-value="js_w"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('cbm') }}<span class="text-red">*</span>:
                </div>
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

            <v-number-input
              v-model="inputData.bkg_volume_weight"
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
                <div class="text-caption text-end w-label-100">{{ detailField('volumeWeight') }}:</div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_volume_weight_unit"
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
              v-model="inputData.bkg_actual_chargeable"
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
                <div class="text-caption text-end w-label-100">{{ detailField('chargeableWeight') }}:</div>
              </template>

              <template #append>
                <v-select
                  v-model="inputData.bkg_actual_chargeable_unit"
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
                :id="`${fieldIdPrefix}@bkg_total_package_count`"
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
                :rules="inputDataRules.bkg_total_package_count"
                type="input"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label-100">
                    {{ detailField('noOfPackage') }}<span class="text-red">*</span>:
                  </div>
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
                  row =>
                    assignPackageTypeFromRow(row, inputData, 'bkg_pack_type', 'bkg_pack_type_desc')
                "
              />
            </div>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <FDatePicker
              :id="`${fieldIdPrefix}@bkg_etd`"
              v-model:date-value="inputData.bkg_etd"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('etd') }}:</div>
              </template>
            </FDatePicker>

            <FDatePicker
              :id="`${fieldIdPrefix}@bkg_eta`"
              v-model:date-value="inputData.bkg_eta"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('eta') }}:</div>
              </template>
            </FDatePicker>

            <FDatePicker
              :id="`${fieldIdPrefix}@bkg_cargo_ready`"
              v-model:date-value="inputData.bkg_cargo_ready"
              max="2099-12-31"
              min="2000-01-01"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('cargoReadyDate') }}:</div>
              </template>
            </FDatePicker>

            <v-select
              :id="`${fieldIdPrefix}@bkg_release_type`"
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
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('releaseType') }}:</div>
              </template>
            </v-select>

            <v-select
              :id="`${fieldIdPrefix}@bkg_service_level`"
              v-model="inputData.bkg_service_level"
              auto-select-first
              autocomplete="off"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="serviceLevelOptions"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('serviceLevel') }}:</div>
              </template>
            </v-select>

            <v-select
              :id="`${fieldIdPrefix}@bkg_delivery_mode`"
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
                <div class="text-caption text-end w-label-100">{{ detailField('deliveryMode') }}:</div>
              </template>
            </v-select>

            <v-text-field
              v-model="inputData.bkg_commodity"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :rules="inputDataRules.bkg_commodity"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('commodity') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-select
              :id="`${fieldIdPrefix}@bkg_inco`"
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
              :rules="inputDataRules.bkg_inco"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('incoTerm') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>

            <v-select
              :id="`${fieldIdPrefix}@bkg_freight_terms`"
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
              :rules="inputDataRules.bkg_freight_terms"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">
                  {{ detailField('freightTerms') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-select>

            <v-number-input
              :id="`${fieldIdPrefix}@bkg_goods_value`"
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
                <div class="text-caption text-end w-label-100">{{ detailField('cargoValue') }}:</div>
              </template>

              <template #append>
                <v-select
                  :id="`${fieldIdPrefix}@bkg_goods_value_currency`"
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
              :id="`${fieldIdPrefix}@bkg_insurance_value`"
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
                <div class="text-caption text-end w-label-100">{{ detailField('insValue') }}:</div>
              </template>

              <template #append>
                <v-select
                  :id="`${fieldIdPrefix}@bkg_insurance_currency`"
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
              :textarea-props="{ label: detailField('goodDesc') }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('goodDesc') }}:</div>
              </template>
            </FTextInput>

            <FTextInput
              v-model:text-value="inputData.bkg_marks_nos"
              min-width="100%"
              :textarea-props="{ label: detailField('marksNos') }"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ detailField('marksNos') }}:</div>
              </template>
            </FTextInput>

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
                <div class="text-caption text-end w-label-100">{{ detailField('shipperRef') }}:</div>
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
                <div class="text-caption text-end w-label-100">{{ detailField('additionalTerms') }}:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col :cols="rescols('c12l3s6')">
          <v-divider>
            <div class="my-1 text-center text-caption text-uppercase text-on-surface opacity-70">
              <v-icon color="primary" icon="mdi-calendar-clock" size="18" />
              <span class="ml-2">{{ detailSection('cutOffDates') }}</span>
            </div>
          </v-divider>

          <div class="d-flex align-start flex-column flex-wrap ga-1">
            <v-text-field
              v-for="item in cutOffFields"
              :key="item.key"
              v-model="inputData[item.key]"
              color="primary"
              density="compact"
              :disabled="!item.pac_is_soc"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-100">{{ item.label }}:</div>
              </template>
            </v-text-field>
          </div>
        </v-col>
      </v-row>

      <BookingShippingInstructionRoute
        v-if="showSiRouteFields"
        v-model:input-data="inputData"
        :input-data-rules="inputDataRules"
        :query-port-list="queryPortList"
        @query-port="queryPort"
      />
    </v-card-text>

    <template v-if="showContainerTable">
      <v-divider />

      <v-card-text class="py-2">
        <v-btn color="primary" size="small" variant="flat" @click="emit('add-container')">
          {{ detailSection('container') }}
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
            :id="`${fieldIdPrefix}@pac_container_type${item.id}`"
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
            :id="`${fieldIdPrefix}@pac_container_count${item.id}`"
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
            :textarea-props="{ label: containerHeader('description') }"
          />
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script setup>
  import Decimal from 'decimal.js'
  import { computed, ref } from 'vue'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { queryServiceLevelOptions } from '@/api/service_level'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import {
    assignContainerTypeFromRow,
    containerTypeTableHeaders,
    fetchContainerTypes,
  } from '@/composables/useContainerTypeRemoteMenu'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    assignPackageTypeFromRow,
    fetchPackageTypes,
    packageTypeTableHeaders,
  } from '@/composables/usePackageTypeRemoteMenu'
  import { BOOKING_CUT_OFF_FIELDS } from '@/constants/bookingPartyFields'
  import { useAppStore } from '@/stores/app'

  const {
    detailSection,
    detailField,
    cutOffLabel,
    containerHeader,
  } = useBookingPageI18n()
  const appStore = useAppStore()
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
    addrTableHeaders: {
      type: Array,
      default: () => [],
    },
    fieldIdPrefix: {
      type: [String, Number],
      default: '1',
    },
    showSiRouteFields: {
      type: Boolean,
      default: false,
    },
    showCargoFields: {
      type: Boolean,
      default: true,
    },
  })
  const { inputDataRules, queryPortList } = toRefs(props)

  const inputData = defineModel('input-data', { type: Object, required: true })

  const emit = defineEmits([
    'add-container',
    'remove-container',
    'query-port',
    'on-select-addr',
    'on-clear-addr',
  ])

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const onClearAddr = type => {
    emit('on-clear-addr', type)
  }
  const queryPort = value => {
    emit('query-port', value)
  }
  // const partyBlocks = BOOKING_PARTY_BLOCKS
  const CUT_OFF_I18N_KEYS = {
    bkg_fcl_cut_off_date: 'fcl',
    bkg_oog_cut_off_date: 'oog',
    bkg_reefer_cut_off_date: 'reefer',
    bkg_dg_cut_off_date: 'dg',
    bkg_vgm_cut_off_date: 'vgm',
    bkg_doc_cut_off_date: 'documentClosure',
  }

  const cutOffFields = computed(() =>
    BOOKING_CUT_OFF_FIELDS.map(item => ({
      ...item,
      label: cutOffLabel(CUT_OFF_I18N_KEYS[item.key]),
    })),
  )

  // const transportModes = [{ code: 'SEA' }, { code: 'AIR' }, { code: 'RAIL' }]
  // const containerModes = [{ code: 'FCL' }, { code: 'LCL' }, { code: 'LSE' }]
  // const incoItems = ['FOB', 'CIF', 'EXW', 'CFR', 'CPT']
  // const freightTermItems = ['PP', 'CC', 'Prepaid', 'Collect']
  // const releaseTypes = ['OBL', 'SWB', 'Telex']
  // const deliveryModes = ['CFS/CFS', 'CY/CY', 'CFS/CY', 'CY/CFS']

  const showContainerTable = computed(
    () =>
      props.showCargoFields &&
      inputData.value.bkg_transport_mode === 'SEA' &&
      inputData.value.bkg_packing_mode === 'FCL',
  )

  const onTransportChange = mode => {
    if (mode === 'AIR') {
      inputData.value.bkg_packing_mode = 'LSE'
    } else if (!inputData.value.bkg_packing_mode) {
      inputData.value.bkg_packing_mode = 'FCL'
    }
  }

  const containerHeaders = computed(() => [
    { title: '', key: 'actions', width: '40px', align: 'center', sortable: false },
    { title: containerHeader('container'), key: 'pac_container_type', minWidth: '90px' },
    { title: containerHeader('count'), key: 'pac_container_count', minWidth: '80px' },
    { title: containerHeader('containerNo'), key: 'pac_container_num', minWidth: '120px' },
    { title: containerHeader('sealNo'), key: 'pac_seal_num', minWidth: '120px' },
    { title: containerHeader('soc'), key: 'pac_is_soc', width: '50px', align: 'center' },
    { title: containerHeader('commodity'), key: 'pac_commodity', minWidth: '100px' },
    { title: containerHeader('grossWeight'), key: 'pac_gross_weight', minWidth: '120px' },
    { title: containerHeader('volume'), key: 'pac_actual_volume', minWidth: '100px' },
    { title: containerHeader('noOfPackage'), key: 'pac_package_count', minWidth: '120px' },
    { title: containerHeader('hsCode'), key: 'pac_harmonised_code', minWidth: '100px' },
    { title: containerHeader('description'), key: 'pac_description', minWidth: '140px' },
  ])

  const js_w = () => {
    // 避免在 inputData 未完全初始化时调用，防止递归更新
    if (!inputData.value) return

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

  // Service Level options
  const serviceLevelOptions = ref([])
  const fetchServiceLevelOptions = async query => {
    try {
      const response = await queryServiceLevelOptions({ query })
      serviceLevelOptions.value = response.data || []
    } catch (error) {
      console.error('Error fetching service level options:', error)
      serviceLevelOptions.value = []
    }
  }

  // Fetch service level options on component mount
  fetchServiceLevelOptions()
</script>

<style lang="scss" scoped>
  // .booking-cutoff-panel {
  //   padding-left: 12px;
  //   border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));

  //   @media (max-width: 1279px) {
  //     margin-top: 12px;
  //     padding-left: 0;
  //     border-left: none;
  //   }
  // }

  // .booking-cutoff-row + .booking-cutoff-row {
  //   margin-top: 8px;
  // }
</style>
