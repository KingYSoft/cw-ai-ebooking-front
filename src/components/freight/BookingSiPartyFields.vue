<template>
  <v-row class="ref-form-pre" dense>
    <v-col class="d-flex flex-column ga-1" :cols="rescols('c12l4s6')">
      <FRemoteTableMenu
        :id="`${fieldIdPrefix}@si_shipper_name`"
        v-model="inputData.shipper.add_address_name"
        bind-key="code"
        :bind-value="inputData.shipper.add_address_code"
        display-key="company_name"
        :fetch-method="organizationQueryOrgAddress"
        :headers="addrTableHeaders"
        :query-extra="{ address_type: 'SHIPPER' }"
        :text-field-props="{
          'min-width': '100%',
          rules: inputDataRules.shipper_name,
        }"
        virtual
        @click-clear="onClearAddr('SHIPPER')"
        @row-select="onSelectAddr($event, 'SHIPPER')"
      >
        <template #prepend>
          <div class="text-caption text-end w-label-100">{{ detailSection('shipper') }}:</div>
        </template>
      </FRemoteTableMenu>

      <div class="d-flex align-start ga-1 w-100">
        <div class="w-label-100 flex-grow-0" />

        <v-textarea
          class="si-party-textarea flex-1-1"
          :auto-grow="false"
          density="compact"
          hide-details
          :model-value="formatPartyAddressDesc(inputData.shipper)"
          no-resize
          rows="5"
          variant="outlined"
          @update:model-value="applyPartyAddressDesc('shipper', $event)"
        />
      </div>
    </v-col>

    <v-col class="d-flex flex-column ga-1" :cols="rescols('c12l4s6')">
      <FRemoteTableMenu
        :id="`${fieldIdPrefix}@si_consignee_name`"
        v-model="inputData.consignee.add_address_name"
        bind-key="code"
        :bind-value="inputData.consignee.add_address_code"
        display-key="company_name"
        :fetch-method="organizationQueryOrgAddress"
        :headers="addrTableHeaders"
        :query-extra="{ address_type: 'CONSIGNEE' }"
        :text-field-props="{
          'min-width': '100%',
          rules: inputDataRules.consignee_name,
        }"
        virtual
        @click-clear="onClearAddr('CONSIGNEE')"
        @row-select="onSelectAddr($event, 'CONSIGNEE')"
      >
        <template #prepend>
          <div class="text-caption text-end w-label-100">{{ detailSection('consignee') }}:</div>
        </template>
      </FRemoteTableMenu>

      <div class="d-flex align-start ga-1 w-100">
        <div class="w-label-100 flex-grow-0" />

        <v-textarea
          class="si-party-textarea flex-1-1"
          :auto-grow="false"
          density="compact"
          hide-details
          :model-value="formatPartyAddressDesc(inputData.consignee)"
          no-resize
          rows="5"
          variant="outlined"
          @update:model-value="applyPartyAddressDesc('consignee', $event)"
        />
      </div>
    </v-col>

    <v-col class="d-flex flex-column ga-1" :cols="rescols('c12l4s6')">
      <div class="d-flex align-center ga-1 w-100">
        <div class="text-caption text-end w-label-100">{{ detailField('notifyParty') }}:</div>

        <v-tabs
          v-model="notifierTab"
          class="flex-1-1"
          color="primary"
          density="compact"
          grow
        >
          <v-tab class="text-uppercase" size="small" value="np1">
            {{ detailField('notifyParty1') }}
          </v-tab>

          <v-tab class="text-uppercase" size="small" value="np2">
            {{ detailField('notifyParty2') }}
          </v-tab>
        </v-tabs>
      </div>

      <div class="d-flex align-start ga-1 w-100">
        <div class="w-label-100 flex-grow-0" />

        <v-tabs-window v-model="notifierTab" class="flex-1-1">
          <v-tabs-window-item value="np1">
            <v-textarea
              class="si-party-textarea"
              :auto-grow="false"
              density="compact"
              hide-details
              :model-value="notifyParty1Desc"
              no-resize
              rows="5"
              variant="outlined"
              @update:model-value="onNotifyParty1Input"
            />
          </v-tabs-window-item>

          <v-tabs-window-item value="np2">
            <v-textarea
              v-model="notifyParty2Desc"
              class="si-party-textarea"
              :auto-grow="false"
              density="compact"
              hide-details
              no-resize
              rows="5"
              variant="outlined"
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { organizationQueryOrgAddress } from '@/api/organization'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineOptions({
    name: 'BookingSiPartyFields',
  })

  defineProps({
    addrTableHeaders: {
      type: Array,
      default: () => [],
    },
    inputDataRules: {
      type: Object,
      default: () => ({}),
    },
    fieldIdPrefix: {
      type: [String, Number],
      default: '4',
    },
  })

  const inputData = defineModel('input-data', { type: Object, required: true })
  const emit = defineEmits(['on-select-addr', 'on-clear-addr'])
  const { detailSection, detailField } = useBookingPageI18n()
  const { rescols } = useLayoutCols()
  const notifierTab = ref('np1')
  const notifyParty2Desc = ref('')

  const formatPartyAddressDesc = party => {
    if (!party || typeof party !== 'object') {
      return ''
    }
    return [party.add_address_name, party.add_address1, party.add_address2, party.add_address3]
      .map(value => String(value ?? '').trim())
      .filter(Boolean)
      .join('\n')
  }

  const applyPartyAddressDesc = (partyKey, text) => {
    if (!inputData.value[partyKey] || typeof inputData.value[partyKey] !== 'object') {
      inputData.value[partyKey] = {}
    }
    const lines = String(text ?? '').split('\n')
    const target = inputData.value[partyKey]
    target.add_address_name = (lines[0] ?? '').trim()
    target.add_address1 = (lines[1] ?? '').trim()
    target.add_address2 = (lines[2] ?? '').trim()
    target.add_address3 = lines.slice(3).join('\n').trim()
  }

  const notifyParty1Desc = computed(() => {
    if (inputData.value.notify_party_same_as_consignee === 'Y') {
      return formatPartyAddressDesc(inputData.value.consignee)
    }
    return formatPartyAddressDesc(inputData.value.notify_party)
  })

  const onNotifyParty1Input = text => {
    inputData.value.notify_party_same_as_consignee = 'N'
    applyPartyAddressDesc('notify_party', text)
  }

  const onSelectAddr = (event, type) => {
    emit('on-select-addr', event, type)
  }

  const onClearAddr = type => {
    emit('on-clear-addr', type)
  }
</script>

<style scoped lang="scss">
  .si-party-textarea {
    flex: 1 1 auto;

    :deep(textarea) {
      min-height: 96px;
    }
  }
</style>
