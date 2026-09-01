<template>
  <v-row dense>
    <v-col :cols="rescols('c12m6')">
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
                <div class="text-caption text-end w-label-120 mr-2">{{ userField('canLogin') }}:</div>
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
                <div class="text-caption text-end w-label-120 mr-2">{{ userField('isActive') }}:</div>
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
                <div class="text-caption text-end w-label-120">{{ userField('emailAddress') }}:</div>
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
                <div class="text-caption text-end w-label-120">{{ userField('lastLogonDate') }}:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12m6')">
            <v-autocomplete
              id="1@org_header"
              auto-select-first
              autocomplete="off"
              clearable
              color="primary"
              density="compact"
              hide-details
              item-title="org_code"
              item-value="org_code"
              :items="orgHeaderList"
              :loading="orgHeaderLoading"
              :menu-props="{
                'max-width': '100%',
              }"
              min-width="100%"
              :model-value="inputData.org_header_code"
              no-data-text="$vuetify.custom.app.searchMore"
              no-filter
              return-object
              :rules="inputDataRules.org_header"
              variant="outlined"
              @update:focused="onOrgHeaderFocused"
              @update:model-value="onOrgHeaderModelValue"
              @update:search="onOrgHeaderSearch"
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw?.org_full_name || ''"
                  :title="item.raw?.org_code"
                />
              </template>

              <template #prepend>
                <div class="text-caption text-end w-label-120">
                  {{ userField('orgHeader') }}<span class="text-red">*</span>:
                </div>
              </template>
            </v-autocomplete>
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
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script setup>
  import { ref } from 'vue'
  import { queryCountryList } from '@/api/dict'
  import { portCodeQueryOptions } from '@/api/port_code'
  import { userQueryOrgHeader } from '@/api/user'
  import { debounceFn } from '@/api/utils'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'UserDetail' })

  const { userField, userSection } = useSystemPageI18n()
  const { rescols } = useLayoutCols()

  defineProps({
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

  const orgHeaderList = ref([])
  const orgHeaderLoading = ref(false)
  const loadOrgHeaderList = debounceFn(async (query, signal) => {
    orgHeaderLoading.value = true
    try {
      const { data } = await userQueryOrgHeader({ query, skipCount: 0, maxResultCount: 50 }, signal)
      orgHeaderList.value = Array.isArray(data?.items) ? data.items : []
    } catch (error) {
      console.log(error)
    } finally {
      orgHeaderLoading.value = false
    }
  })
  const {
    onFocused: onOrgHeaderFocused,
    onModelValue: onOrgHeaderModelValue,
    onSearch: onOrgHeaderSearch,
  } = createRemoteSearchControl({
    getSelected: () => inputData.value?.org_header_code,
    load: loadOrgHeaderList,
    onSelect: value => {
      inputData.value.org_header_pk = value?.pk ?? null
      inputData.value.org_header_code = value?.org_code ?? null
      inputData.value.org_header_name = value?.org_full_name ?? null
    },
  })

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
</script>
