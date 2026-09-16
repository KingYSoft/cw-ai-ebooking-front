<template>
  <v-row class="si-party-row ref-form-pre" dense>
    <v-col
      v-for="col in partyCols"
      :key="col.prefix"
      class="si-party-col d-flex flex-column ga-1"
      :cols="rescols('c12l3s6')"
    >
      <v-divider>
        <div class="text-center text-caption text-uppercase text-on-surface opacity-70">
          {{ col.title }}
        </div>
      </v-divider>

      <div class="si-party-head">
        <FRemoteTableMenu
          :id="`${fieldIdPrefix}@si_${col.prefix}_name`"
          v-model="doc[`${col.prefix}_name`]"
          display-key="company_name"
          :fetch-method="organizationQueryOrgAddress"
          :headers="addrTableHeaders"
          :query-extra="{ address_type: col.addressType }"
          :text-field-props="{
            readonly: isSameAsConsignee(col.prefix),
          }"
          virtual
          @click-clear="clearParty(col.prefix)"
          @row-select="onSelectParty($event, col.prefix)"
        />

        <v-tooltip v-if="col.sameAsConsignee" location="bottom">
          <template #activator="ssss">
            <v-checkbox-btn
              v-bind="ssss.props"
              class="si-np-same-btn"
              color="primary"
              density="compact"
              false-value="N"
              hide-details
              :model-value="isSameAsConsignee(col.prefix) ? 'Y' : 'N'"
              true-value="Y"
              @update:model-value="setSameAsConsignee(col.prefix, $event)"
            />
          </template>

          <span>{{ detailField('sameAsConsignee') }}</span>
        </v-tooltip>
      </div>

      <v-textarea
        class="si-party-addr"
        :auto-grow="false"
        density="compact"
        hide-details
        :model-value="formatPartyAddr(col.prefix)"
        no-resize
        :readonly="isSameAsConsignee(col.prefix)"
        rows="5"
        variant="outlined"
        @update:model-value="applyPartyAddr(col.prefix, $event)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
  import { computed } from 'vue'
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
  const { detailSection, detailField } = useBookingPageI18n()
  const { rescols } = useLayoutCols()

  const doc = computed(() => {
    if (!inputData.value.doc_data) {
      inputData.value.doc_data = {}
    }
    return inputData.value.doc_data
  })

  const partyCols = computed(() => [
    {
      prefix: 'shipper',
      title: detailSection('shipper'),
      addressType: 'SHIPPER',
    },
    {
      prefix: 'consignee',
      title: detailSection('consignee'),
      addressType: 'CONSIGNEE',
    },
    {
      prefix: 'np1',
      title: detailField('notifyParty1'),
      addressType: 'NOTIFY_PARTY',
      sameAsConsignee: true,
    },
    {
      prefix: 'np2',
      title: detailField('notifyParty2'),
      addressType: 'NOTIFY_PARTY',
      sameAsConsignee: true,
    },
  ])

  const formatPartyAddr = prefix =>
    [
      doc.value[`${prefix}_address1`],
      doc.value[`${prefix}_address2`],
      doc.value[`${prefix}_address3`],
    ]
      .map(value => String(value ?? ''))
      .join('\n')
      .replace(/\n+$/, '')

  const SAME_AS_CONSIGNEE = 'SAME AS CONSIGNEE'

  const isSameAsConsignee = prefix =>
    String(doc.value[`${prefix}_name`] ?? '') === SAME_AS_CONSIGNEE

  const setSameAsConsignee = (prefix, checked) => {
    if (checked === 'Y') {
      doc.value[`${prefix}_name`] = SAME_AS_CONSIGNEE
      doc.value[`${prefix}_address1`] = ''
      doc.value[`${prefix}_address2`] = ''
      doc.value[`${prefix}_address3`] = ''
      return
    }
    if (doc.value[`${prefix}_name`] === SAME_AS_CONSIGNEE) {
      doc.value[`${prefix}_name`] = ''
    }
  }

  const applyPartyAddr = (prefix, text) => {
    if (isSameAsConsignee(prefix)) {
      return
    }
    const lines = String(text ?? '').split('\n')
    doc.value[`${prefix}_address1`] = (lines[0] ?? '').trim()
    doc.value[`${prefix}_address2`] = (lines[1] ?? '').trim()
    doc.value[`${prefix}_address3`] = lines.slice(2).join('\n').trim()
  }

  const onSelectParty = (row, prefix) => {
    if (isSameAsConsignee(prefix)) {
      return
    }
    doc.value[`${prefix}_name`] = row.company_name ?? ''
    doc.value[`${prefix}_address1`] = row.address1 ?? ''
    doc.value[`${prefix}_address2`] = row.address2 ?? ''
    doc.value[`${prefix}_address3`] = row.address3 ?? ''
  }

  const clearParty = prefix => {
    if (isSameAsConsignee(prefix)) {
      return
    }
    doc.value[`${prefix}_name`] = ''
    doc.value[`${prefix}_address1`] = ''
    doc.value[`${prefix}_address2`] = ''
    doc.value[`${prefix}_address3`] = ''
  }
</script>

<style scoped lang="scss">
  .si-party-col {
    min-width: 0;
  }

  .si-party-head {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    width: 100%;
    min-width: 0;
    height: 40px;
    overflow: hidden;

    :deep(.v-input) {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  .si-np-same-btn {
    flex: 0 0 28px;
    height: 28px;
    width: 28px;
    margin-inline-start: 4px;

    :deep(.v-selection-control) {
      --v-selection-control-size: 24px;
      min-height: 24px;
    }
  }

  .si-party-addr {
    flex: none;

    :deep(.v-input__control),
    :deep(.v-field),
    :deep(.v-field__field),
    :deep(.v-field__input) {
      height: 100%;
    }

    :deep(textarea) {
      min-height: 96px;
    }
  }
</style>
