<template>
  <v-row dense>
    <v-col :cols="rescols('c12m6')">
      <v-card-text class="user-role-options py-2 pb-0">
        <div class="user-role-options__row">
          <v-checkbox
            v-for="(item, idx) in groupList"
            :key="idx"
            v-model="inputData.group_list"
            class="ma-0"
            color="primary"
            density="compact"
            hide-details
            :value="item.pk"
          >
            <template #label>
              <span class="text-caption text-no-wrap">{{ item.code }}</span>
            </template>
          </v-checkbox>

          <!-- <v-checkbox
            v-model="inputData.is_warehouse"
            class="ma-0"
            color="primary"
            density="compact"
            :false-value="0"
            hide-details
            :true-value="1"
          >
            <template #label>
              <span class="text-caption text-no-wrap">{{ userField('moduleWarehouse') }}</span>
            </template>
          </v-checkbox> -->
        </div>

        <v-radio-group
          v-model="inputData.role_type"
          class="user-role-options__radios ma-0 pa-0"
          color="primary"
          density="compact"
          hide-details
        >
          <v-radio v-for="option in userTypeOptions" :key="option.value" :value="option.value">
            <template #label>
              <span class="text-caption text-no-wrap">{{ option.title }}</span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <!-- Login Info -->
      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            {{ userSection('loginInfo') }}
          </div>
        </v-divider>

        <v-row dense>
          <v-col :cols="rescols('c12m6')">
            <v-text-field
              id="1@login_name"
              v-model="inputData.login_name"
              color="primary"
              density="compact"
              :disabled="isEdit"
              hide-details
              min-width="100%"
              :rules="inputDataRules.login_name"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{ userField('loginName') }}
                  <span class="text-red">*</span>
                  :
                </div>
              </template>
            </v-text-field>
          </v-col>

          <v-col v-if="!isEdit" :cols="rescols('c12m6')">
            <v-text-field
              id="1@password_hash"
              v-model="inputData.password_hash"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              :rules="inputDataRules.password_hash"
              :type="pwdVis ? 'text' : 'password'"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{ userField('password') }}
                  <span class="text-red">*</span>
                  :
                </div>
              </template>

              <template #append-inner>
                <v-btn
                  density="compact"
                  icon="mdi-eye-off"
                  size="small"
                  variant="text"
                  @click="pwdVis = !pwdVis"
                />
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-switch
              v-model="inputData.can_login"
              color="primary"
              density="compact"
              :false-value="0"
              hide-details
              :true-value="1"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120 mr-2">
                  {{ userField('canLogin') }}:
                </div>
              </template>
            </v-switch>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-switch
              v-model="inputData.is_active"
              color="success"
              density="compact"
              :false-value="0"
              hide-details
              :true-value="1"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120 mr-2">
                  {{ userField('isActive') }}:
                </div>
              </template>
            </v-switch>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Employee Details -->
      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            {{ userSection('employeeDetails') }}
          </div>
        </v-divider>

        <v-row dense>
          <v-col :cols="rescols('c12m6')">
            <v-text-field
              v-model="inputData.full_name"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('fullName') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-text-field
              v-model="inputData.short_code"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('shortCode') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-text-field
              v-model="inputData.email_address"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{ userField('emailAddress') }}:
                </div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-text-field
              v-model="inputData.mobile_phone"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('mobilePhone') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-autocomplete
              auto-select-first
              autocomplete="off"
              clearable
              color="primary"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="countryOptions"
              :loading="countryLoading"
              :menu-props="{ maxWidth: '100%' }"
              min-width="100%"
              :model-value="inputData.country_code"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
              @update:focused="onCountryFocused"
              @update:model-value="onCountryModelValue"
              @update:search="onCountrySearch"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item
                  v-bind="itemProps"
                  :subtitle="item.raw?.desc || ''"
                  :title="item.raw?.code"
                />
              </template>

              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('country') }}:</div>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-text-field
              v-model="inputData.last_logon_date"
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
                  {{ userField('lastLogonDate') }}:
                </div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <FRemoteTableMenu
              id="1@org_header"
              v-model="inputData.org_header_code"
              bind-key="code"
              :bind-value="inputData.org_header_code"
              display-key="code"
              :fetch-method="organizationQueryOrgAddress"
              :headers="addrTableHeaders"
              :text-field-props="{
                'min-width': '100%',
                rules: inputDataRules.org_header,
              }"
              virtual
              @click-clear="onClearOrgHeader"
              @row-select="onSelectOrgHeader"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{
                    inputData.role_type === 'SHIPPER'
                      ? userField('roleTypeShipper')
                      : inputData.role_type === 'CONSIGNEE'
                        ? userField('roleTypeConsignee')
                        : inputData.role_type === 'AGENT'
                          ? userField('roleTypeAgent')
                          : ''
                  }}
                  <span class="text-red">*</span>:
                </div>
              </template>
            </FRemoteTableMenu>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-autocomplete
              auto-select-first
              autocomplete="off"
              clearable
              color="primary"
              density="compact"
              hide-details
              item-title="code"
              item-value="code"
              :items="portOptions"
              :loading="portLoading"
              :menu-props="{ maxWidth: '100%' }"
              min-width="100%"
              :model-value="inputData.home_port"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              variant="outlined"
              @update:focused="onPortFocused"
              @update:model-value="onPortModelValue"
              @update:search="onPortSearch"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item
                  v-bind="itemProps"
                  :subtitle="item.raw?.rl_port_name || ''"
                  :title="item.raw?.code"
                />
              </template>

              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('port') }}:</div>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="inputData.org_header_name"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('companyName') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="inputData.address1"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('address1') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="inputData.address2"
              color="primary"
              density="compact"
              hide-details
              min-width="100%"
              readonly
              type="input"
              variant="outlined"
            >
              <template #prepend>
                <div class="text-caption text-end w-label-120">{{ userField('address2') }}:</div>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { queryCountryList } from '@/api/dict'
  import { queryGroupPage } from '@/api/group'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { portCodeQueryOptions } from '@/api/port_code'
  import { debounceFn } from '@/api/utils'
  import FRemoteTableMenu from '@/components/FRemoteTableMenu.vue'
  import { mapWarehouseAddrTableHeaders } from '@/composables/mapWarehouseOrderTableHeaders'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'

  defineOptions({ name: 'UserDetail' })

  const { userField, userSection } = useSystemPageI18n()
  const { addrTable } = useWarehouseOrderPageI18n()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  })

  const pwdVis = ref(false)
  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  if (!props.isEdit && !inputData.value.role_type) {
    inputData.value.role_type = 'SHIPPER'
  }
  /**
   * Vuetify autocomplete emits update:search with '' (or selected title) on select/blur.
   * Only query while focused; after select, suppress sync search until user types again.
   */
  const createRemoteSearchControl = ({ getSelected, load, onSelect }) => {
    const focused = ref(false)
    let suppressSearch = false

    const onFocused = isFocused => {
      focused.value = !!isFocused
      if (isFocused) {
        suppressSearch = false
        load(getSelected())
      }
    }

    const onModelValue = value => {
      onSelect?.(value)
      // Selected: ignore following search sync. Cleared: allow next search.
      suppressSearch = value != null && value !== ''
    }

    const onSearch = query => {
      if (!focused.value) {
        return
      }
      const q = String(query ?? '')
      const selected = String(getSelected() ?? '')
      if (suppressSearch) {
        if (q === '' || q === selected) {
          return
        }
        suppressSearch = false
      }
      if (q === selected) {
        return
      }
      load(query)
    }

    return { onFocused, onModelValue, onSearch }
  }

  const userTypeOptions = computed(() => [
    { value: 'SHIPPER', title: userField('roleTypeShipper') },
    { value: 'CONSIGNEE', title: userField('roleTypeConsignee') },
    { value: 'AGENT', title: userField('roleTypeAgent') },
  ])

  const applyOrgAddressToUser = row => {
    if (!row) {
      inputData.value.org_header_pk = null
      inputData.value.org_header_code = null
      inputData.value.org_header_name = null
      inputData.value.address1 = null
      inputData.value.address2 = null
      inputData.value.country_code = null
      return
    }

    inputData.value.org_header_pk = row.org_header ?? null
    inputData.value.org_header_code = row.org_code ?? null
    inputData.value.org_header_name = row.org_full_name ?? null
    inputData.value.address1 = row.address1 ?? null
    inputData.value.address2 = row.address2 ?? null
    inputData.value.country_code = row.country_code ?? null
  }

  const onSelectOrgHeader = row => {
    applyOrgAddressToUser(row)
  }

  const onClearOrgHeader = () => {
    applyOrgAddressToUser(null)
  }

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

  const ensureSelectedOption = (options, selectedCode) => {
    const code = String(selectedCode ?? '').trim()
    if (!code || options.some(item => item.code === code)) {
      return options
    }
    return [{ code, desc: '', rl_port_name: '' }, ...options]
  }

  const countryOptions = ref([])
  const countryLoading = ref(false)
  const loadCountryOptions = debounceFn(async (query, signal) => {
    countryLoading.value = true
    try {
      const { data } = await queryCountryList({ query }, signal)
      const list = Array.isArray(data?.list) ? data.list : []
      const options = list
        .map(item => ({
          ...item,
          code: String(item?.code ?? '').trim(),
          desc: item?.desc ?? '',
        }))
        .filter(item => item.code)
      countryOptions.value = ensureSelectedOption(options, inputData.value?.country_code)
    } catch (error) {
      console.log(error)
    } finally {
      countryLoading.value = false
    }
  })
  const {
    onFocused: onCountryFocused,
    onModelValue: onCountryModelValue,
    onSearch: onCountrySearch,
  } = createRemoteSearchControl({
    getSelected: () => inputData.value?.country_code,
    load: loadCountryOptions,
    onSelect: value => {
      inputData.value.country_code = value || null
    },
  })

  const portOptions = ref([])
  const portLoading = ref(false)
  const loadPortOptions = debounceFn(async (query, signal) => {
    portLoading.value = true
    try {
      const { data } = await portCodeQueryOptions({ query }, signal)
      const list = Array.isArray(data?.list) ? data.list : []
      const options = list
        .map(item => ({
          ...item,
          code: String(item?.rl_code ?? '').trim(),
          rl_port_name: item?.rl_port_name ?? '',
        }))
        .filter(item => item.code)
      portOptions.value = ensureSelectedOption(options, inputData.value?.home_port)
    } catch (error) {
      console.log(error)
    } finally {
      portLoading.value = false
    }
  })
  const {
    onFocused: onPortFocused,
    onModelValue: onPortModelValue,
    onSearch: onPortSearch,
  } = createRemoteSearchControl({
    getSelected: () => inputData.value?.home_port,
    load: loadPortOptions,
    onSelect: value => {
      inputData.value.home_port = value || null
    },
  })
  const groupList = ref([])
  const loadGroupList = async () => {
    try {
      const { data } = await queryGroupPage({
        filters: [
          {
            key: 'is_admin',
            op: '=',
            val: 'N',
          },
        ],
      })
      groupList.value = data.items ?? []
    } catch (error) {
      console.log(error)
    }
  }
  loadGroupList()
</script>

<style lang="scss" scoped>
  .user-role-options {
    display: flex;
    flex-direction: column;
    padding-left: 32px;

    :deep(.v-selection-control) {
      --v-selection-control-size: 28px;
    }

    :deep(.v-selection-control__input .v-icon) {
      font-size: 18px;
    }
  }

  .user-role-options__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    :deep(.v-checkbox) {
      flex: 0 0 7.5rem;
      width: 7.5rem;
      max-width: 7.5rem;
    }
  }

  .user-role-options__radios {
    display: flex !important;
    flex: none;
    flex-direction: column;
    width: 100%;

    :deep(.v-input__control),
    :deep(.v-selection-control-group) {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
    }

    :deep(.v-selection-control) {
      flex: 0 0 7.5rem;
      width: 7.5rem;
      max-width: 7.5rem;
    }
  }
</style>
