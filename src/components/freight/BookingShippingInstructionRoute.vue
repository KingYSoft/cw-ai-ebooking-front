<template>
  <v-row class="mt-2" dense>
    <v-col :cols="rescols('c12l3s6')">
      <div class="d-flex align-start flex-column flex-wrap ga-1">
        <v-autocomplete
          id="4@si_bkg_origin"
          auto-select-first
          autocomplete="off"
          clearable
          color="primary"
          density="compact"
          hide-details
          item-title="rl_code"
          item-value="rl_code"
          :items="originPortItems(inputData.bkg_origin, inputData.bkg_origin_name)"
          :menu-props="{
            'max-width': '100%',
          }"
          min-width="100%"
          :model-value="inputData.bkg_origin"
          return-object
          :rules="inputDataRules.bkg_origin"
          variant="outlined"
          @update:model-value="onSelectPort($event, 'bkg_origin', 'bkg_origin_name')"
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
              {{ detailField('origin') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-autocomplete>

        <v-autocomplete
          id="4@si_bkg_destination"
          auto-select-first
          autocomplete="off"
          clearable
          color="primary"
          density="compact"
          hide-details
          item-title="rl_code"
          item-value="rl_code"
          :items="portItems('bkg_destination', 'bkg_destination_name')"
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
          @update:model-value="onSelectPort($event, 'bkg_destination', 'bkg_destination_name')"
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
              {{ detailField('destination') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-autocomplete>
      </div>
    </v-col>

    <v-col :cols="rescols('c12l3s6')">
      <div class="d-flex align-start flex-column flex-wrap ga-1">
        <v-autocomplete
          id="4@bkg_load_port"
          auto-select-first
          autocomplete="off"
          clearable
          color="primary"
          density="compact"
          hide-details
          item-title="rl_code"
          item-value="rl_code"
          :items="portItems('bkg_load_port', 'bkg_load_port_name')"
          :menu-props="{
            'max-width': '100%',
          }"
          min-width="100%"
          :model-value="inputData.bkg_load_port"
          no-data-text="$vuetify.custom.app.searchMore"
          no-filter
          return-object
          :rules="inputDataRules.bkg_load_port"
          variant="outlined"
          @update:focused="
            $event => {
              if ($event) {
                queryPort(inputData.bkg_load_port)
              }
            }
          "
          @update:model-value="onSelectPort($event, 'bkg_load_port', 'bkg_load_port_name')"
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
              {{ detailField('polLoad') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-autocomplete>

        <v-autocomplete
          id="4@bkg_discharge_port"
          auto-select-first
          autocomplete="off"
          clearable
          color="primary"
          density="compact"
          hide-details
          item-title="rl_code"
          item-value="rl_code"
          :items="portItems('bkg_discharge_port', 'bkg_discharge_port_name')"
          :menu-props="{
            'max-width': '100%',
          }"
          min-width="100%"
          :model-value="inputData.bkg_discharge_port"
          no-data-text="$vuetify.custom.app.searchMore"
          no-filter
          return-object
          :rules="inputDataRules.bkg_discharge_port"
          variant="outlined"
          @update:focused="
            $event => {
              if ($event) {
                queryPort(inputData.bkg_discharge_port)
              }
            }
          "
          @update:model-value="onSelectPort($event, 'bkg_discharge_port', 'bkg_discharge_port_name')"
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
              {{ detailField('podDischarge') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-autocomplete>
      </div>
    </v-col>

    <v-col :cols="rescols('c12l3s6')">
      <div class="d-flex align-start flex-column flex-wrap ga-1">
        <v-text-field
          id="4@bkg_intended_vessel"
          v-model="inputData.bkg_intended_vessel"
          color="primary"
          density="compact"
          hide-details
          min-width="100%"
          :rules="inputDataRules.bkg_intended_vessel"
          variant="outlined"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">
              {{ detailField('vessel') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-text-field>

        <v-text-field
          id="4@bkg_voyage"
          v-model="inputData.bkg_voyage"
          color="primary"
          density="compact"
          hide-details
          min-width="100%"
          :rules="inputDataRules.bkg_voyage"
          variant="outlined"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">
              {{ detailField('voyage') }}<span class="text-red">*</span>:
            </div>
          </template>
        </v-text-field>
      </div>
    </v-col>

    <v-col :cols="rescols('c12l3s6')">
      <div class="d-flex align-start flex-column flex-wrap ga-1">
        <FDatePicker
          id="4@si_bkg_etd"
          v-model:date-value="inputData.bkg_etd"
          max="2099-12-31"
          min="2000-01-01"
          :rules="inputDataRules.bkg_etd"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">
              {{ detailField('etd') }}<span class="text-red">*</span>:
            </div>
          </template>
        </FDatePicker>

        <FDatePicker
          id="4@si_bkg_eta"
          v-model:date-value="inputData.bkg_eta"
          max="2099-12-31"
          min="2000-01-01"
          :rules="inputDataRules.bkg_eta"
        >
          <template #prepend>
            <div class="text-caption text-end w-label-110">
              {{ detailField('eta') }}<span class="text-red">*</span>:
            </div>
          </template>
        </FDatePicker>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { originPortItems } from '@/constants/bookingOriginPorts'

  defineOptions({
    name: 'BookingShippingInstructionRoute',
  })

  const props = defineProps({
    inputDataRules: {
      type: Object,
      default: () => ({}),
    },
    queryPortList: {
      type: Array,
      default: () => [],
    },
  })

  const inputData = defineModel('input-data', { type: Object, required: true })
  const emit = defineEmits(['query-port'])
  const { detailField } = useBookingPageI18n()
  const { rescols } = useLayoutCols()

  const portItems = (codeKey, nameKey) => {
    const items = [...(props.queryPortList || [])]
    const code = inputData.value[codeKey]
    if (code && !items.some(item => item.rl_code === code)) {
      items.unshift({
        rl_code: code,
        rl_port_name: inputData.value[nameKey],
      })
    }
    return items
  }

  const onSelectPort = (event, codeKey, nameKey) => {
    inputData.value[codeKey] = event?.rl_code ?? null
    inputData.value[nameKey] = event?.rl_port_name ?? null
  }

  const queryPort = value => {
    emit('query-port', value)
  }
</script>
