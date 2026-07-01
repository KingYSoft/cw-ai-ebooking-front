<template>
  <v-row dense>
    <v-col :cols="rescols('c12m6')">
      <!-- Login Info -->
      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            Login Info
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
                  Login Name
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
                  Password
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
        </v-row>
      </v-card-text>
      <!-- Employee Details -->
      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            Employee Details
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
                <div class="text-caption text-end w-label-120">Full Name:</div>
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
                <div class="text-caption text-end w-label-120">Short Code:</div>
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
                <div class="text-caption text-end w-label-120">Email Address:</div>
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
                <div class="text-caption text-end w-label-120">Mobile Phone:</div>
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
                <div class="text-caption text-end w-label-120 mr-2">Can Login:</div>
              </template>
            </v-switch>
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
                <div class="text-caption text-end w-label-120">Last Logon Date:</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col :cols="rescols('c12')">
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
              @update:focused="
                $event => {
                  if ($event) {
                    loadOrgHeaderList(inputData.org_header_code)
                  }
                }
              "
              @update:model-value="
                $event => {
                  inputData.org_header_pk = $event?.pk ?? null
                  inputData.org_header_code = $event?.org_code ?? null
                  inputData.org_header_name = $event?.org_full_name ?? null
                }
              "
              @update:search="loadOrgHeaderList"
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
                  Org Header<span class="text-red">*</span>:
                </div>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="py-2">
        <v-divider>
          <div class="text-center text-caption text-uppercase text-on-surface opacity-70 mb-8">
            Employee Status
          </div>
        </v-divider>

        <v-row dense>
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
                <div class="text-caption text-end w-label-120 mr-2">Is Active:</div>
              </template>
            </v-switch>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { debounceFn } from '@/api/utils'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineOptions({ name: 'UserDetail' })

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
  const orgHeaderList = ref([])
  const orgHeaderLoading = ref(false)
  const loadOrgHeaderList = debounceFn(async (query, signal) => {
    if (!query) {
      return
    }
    orgHeaderLoading.value = true
    try {
      const { data } = await organizationQueryOrgAddress({ query }, signal)
      orgHeaderList.value = Array.isArray(data?.items) ? data.items : []
    } catch (error) {
      console.log(error)
    } finally {
      orgHeaderLoading.value = false
    }
  })
  onMounted(() => {})
</script>
