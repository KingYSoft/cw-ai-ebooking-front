<template>
  <div class="f-party-detail-card">
    <v-btn
      class="f-party-detail-card__settings"
      color="primary"
      density="compact"
      size="x-small"
      :variant="null"
      @click="openEditDialog"
    >
      <v-icon icon="mdi-cog-outline" size="14" />
    </v-btn>

    <div class="f-party-detail-card__body">
      <div
        v-if="showSameAsConsigneeView"
        class="f-party-detail-card__line f-party-detail-card__name text-body-2"
      >
        SAME AS CONSIGNEE
      </div>

      <template v-else>
        <div class="f-party-detail-card__line f-party-detail-card__name text-body-2">
          <span v-if="party?.add_address_code" class="f-party-detail-card__code">
            {{ party.add_address_code }}
          </span>

          <span v-if="party?.add_address_name">{{ party.add_address_name }}</span>
        </div>

        <div
          v-if="addressLine"
          class="f-party-detail-card__line f-party-detail-card__address text-caption text-medium-emphasis"
        >
          {{ addressLine }}
        </div>
      </template>

      <v-checkbox
        v-if="showSameAsConsignee"
        v-model="sameAsConsignee"
        class="f-party-detail-card__same-as mt-1"
        color="primary"
        density="compact"
        hide-details
      >
        <template #label>
          <span class="text-caption text-no-wrap">Same as Consignee</span>
        </template>
      </v-checkbox>
    </div>

    <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
      <span style="flex: 1">Tel: {{ displayPhone }}</span>
      <span style="flex: 1">Fax: {{ displayFax }}</span>
    </div>

    <NewOrgAddressDialog
      v-model="dialogOpen"
      :address-type="addressType"
      :initial-data="dialogInitialData"
      :save-loading="saveLoading"
      @save="onSaveAddress"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'

  import { organizationSaveOrgAddress } from '@/api/organization'
  import NewOrgAddressDialog from '@/components/business/NewOrgAddressDialog.vue'
  import {
    formatPartyAddressLine,
    hasPartyAddressData,
    mapDialogToParty,
    mapPartyToDialogInput,
  } from '@/constants/partyAddressFields'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'FPartyDetailCard',
  })

  const party = defineModel('party', { type: Object, required: true })

  const props = defineProps({
    addressType: {
      type: String,
      required: true,
    },
    showSameAsConsignee: {
      type: Boolean,
      default: false,
    },
    sameAsConsigneeFlag: {
      type: String,
      default: 'N',
    },
  })

  const emit = defineEmits(['update:sameAsConsigneeFlag'])

  const appStore = useAppStore()
  const dialogOpen = ref(false)
  const saveLoading = ref(false)
  const dialogInitialData = ref({})

  const showSameAsConsigneeView = computed(
    () => props.showSameAsConsignee && props.sameAsConsigneeFlag === 'Y',
  )

  const sameAsConsignee = computed({
    get: () => props.sameAsConsigneeFlag === 'Y',
    set: val => {
      emit('update:sameAsConsigneeFlag', val ? 'Y' : 'N')
      if (val) {
        party.value.add_address_name = 'SAME AS CONSIGNEE'
      }
    },
  })

  const addressLine = computed(() => formatPartyAddressLine(party.value))

  const displayPhone = computed(() => party.value?.add_phone || '-')

  const displayFax = computed(() => party.value?.add_fax || '-')

  const openEditDialog = () => {
    if (hasPartyAddressData(party.value)) {
      dialogInitialData.value = mapPartyToDialogInput(party.value)
    } else {
      dialogInitialData.value = {}
    }
    dialogOpen.value = true
  }

  const onSaveAddress = async formData => {
    if (!formData) return
    mapDialogToParty(party.value, formData)
    dialogOpen.value = false
    // try {
    //   saveLoading.value = true
    //   const { success, data } = await organizationSaveOrgAddress({
    //     ...formData,
    //     address_type: props.addressType,
    //   })
    //   if (success) {
    //     const row = data?.address || formData
    //     mapDialogToParty(party.value, row)
    //     if (props.showSameAsConsignee) {
    //       emit('update:sameAsConsigneeFlag', 'N')
    //     }
    //     appStore.openMessage({
    //       color: 'success',
    //       content: 'Save success.',
    //     })
    //     dialogOpen.value = false
    //   }
    // } catch (error) {
    //   console.log('saveOrgAddress error:', error)
    // } finally {
    //   saveLoading.value = false
    // }
  }
</script>

<style lang="scss" scoped>
  .f-party-detail-card {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 120px;
    padding: 8px 36px 8px 10px;
    border: 1px solid rgb(var(--v-theme-primary));
    border-radius: 4px;
    overflow: hidden;
  }

  .f-party-detail-card__body {
    flex: 1 1 auto;
    min-width: 0;
  }

  .f-party-detail-card__contact {
    margin-top: auto;
    padding-top: 4px;
  }

  .f-party-detail-card__settings {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 24px;
    width: 24px;
    height: 24px;
  }

  .f-party-detail-card__line + .f-party-detail-card__line {
    margin-top: 4px;
  }

  .f-party-detail-card__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .f-party-detail-card__code {
    margin-right: 6px;
    font-weight: 600;
  }

  .f-party-detail-card__address {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    word-break: break-word;
  }

  .f-party-detail-card__same-as {
    :deep(.v-selection-control) {
      min-height: 24px;
    }
  }
</style>
