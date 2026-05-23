<template>
  <v-dialog v-model="dialogVisible" max-width="650" persistent>
    <v-card
      :disabled="saveLoading"
      :loading="saveLoading"
      prepend-icon="mdi-city"
      :title="dialogTitle"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <template #append>
        <v-btn
          density="comfortable"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="userDiaPwdVis = false"
        />
      </template>

      <v-card-text class="pb-2">
        <v-form ref="refOrgAddressForm" class="ref-form-pre">
          <v-row dense>
            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="input.company_name"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                placeholder="Please enter a Full Name in English"
                :rules="rules.company_name"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">
                    Name<span class="text-red">*</span>:
                  </div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="input.address1"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                placeholder="Please enter an Address 1."
                :rules="rules.address1"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">
                    Address1<span class="text-red">*</span>:
                  </div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="input.address2"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Address2:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="input.address3"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Address3:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.city"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                :rules="rules.city"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">City<span class="text-red">*</span>:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.state"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">State:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.country_code"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Country:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.postal_code"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Postal:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.contact"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Contact:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.email"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Email:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.phone"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Phone:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.fax"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Fax:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.mobile"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">Mobile:</div>
                </template>
              </v-text-field>
            </v-col>

            <v-col :cols="rescols('c6')">
              <v-text-field
                v-model="input.port_code"
                color="primary"
                density="compact"
                hide-details
                min-width="100%"
                placeholder="Please enter an UNLOCO."
                :rules="rules.port_code"
                variant="outlined"
              >
                <template #prepend>
                  <div class="text-caption text-end w-label">UNLOCO<span class="text-red">*</span>:</div>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          size="small"
          :text="t('$vuetify.custom.dialog.btn.cancel')"
          @click="dialogVisible = false"
        />

        <v-btn
          color="primary"
          size="small"
          :text="t('$vuetify.custom.dialog.btn.save')"
          variant="flat"
          @click="handleSave"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  const { t } = useLocale()
  // 使用布局列数 composable
  const { rescols } = useLayoutCols()
  const appStore = useAppStore()

  defineOptions({
    name: 'NewOrgAddressDialog',
  })

  const dialogVisible = defineModel({
    type: Boolean,
    default: false,
  })
  const props = defineProps({
    addressType: {
      type: String,
      default: '',
    },
    saveLoading: {
      type: Boolean,
      default: false,
    },
  })

  const { addressType, saveLoading } = toRefs(props)
  const emit = defineEmits(['save'])

  const refOrgAddressForm = ref(null)

  const dialogTitle = computed(() => {
    console.log(addressType.value, 'addressType.value')

    if (addressType.value === 'SHIPPER') {
      return 'New Shipper'
    } else if (addressType.value === 'CONSIGNEE') {
      return 'New Consignee'
    } else {
      return 'New Company'
    }
  })

  const defaultInputData = () => ({
    id: 0,
    pk: '',
    address_type: '',
    company_name: '',
    address1: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postal_code: '',
    country_code: '',
    contact: '',
    phone: '',
    fax: '',
    email: '',
    mobile: '',
    port_code: '',
  })
  const input = ref(defaultInputData())

  watch(
    () => dialogVisible.value,
    val => {
      if (val) {
        input.value = defaultInputData()
      }
    },
    { immediate: true },
  )

  const rules = {
    company_name: [
      v => {
        if (v) {
          return true
        }
        return 'Name is required'
      },
    ],
    address1: [
      v => {
        if (v) {
          return true
        }
        return 'Address 1 is required'
      },
    ],
    city: [
      v => {
        if (v) {
          return true
        }
        return 'City is required'
      },
    ],
    port_code: [
      v => {
        if (v) {
          return true
        }
        return 'UNLOCO is required'
      },
    ],
  }

  const handleSave = async () => {
    if (refOrgAddressForm.value) {
      const { valid, errors } = await refOrgAddressForm.value.validate()
      if (valid) {
        emit('save', { ...input.value, address_type: addressType.value })
      } else {
        let errList = []
        if (errors && errors.length > 0) {
          const err = []
          for (let i = 0; i < errors.length; i++) {
            const e = errors[i]
            const msg =
              e.errorMessages && e.errorMessages.length > 0
                ? e.errorMessages[0]
                : 'data valid fail.'

            err.push({ tab: i, msg })
          }
          if (err.length > 0) {
            errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
          }
        }
        if (errList.length > 0) {
          appStore.openMessage({
            content: errList[0].msg,
            color: 'error',
          })
        } else {
          appStore.openMessage({
            content: 'data valid fail.',
            color: 'error',
          })
        }
        return false
      }
    }
  }
</script>
