<template>
  <v-sheet color="transparent">
    <FTableLayout
      ref="tableRef"
      disable-sort
      :headers="linkHeaders"
      hide-default-footer
      item-value="id"
      :items="inputData.link_list"
      :max-height="maxHeight"
      setting-name="system-party-role"
      striped="even"
      title="Group Relations"
    >
      <!-- <v-data-table
        class="table-filter"
        :disable-sort="false"
        :fixed-header="false"
        :headers="linkHeaders"
        hide-default-footer
        hover
        item-value="id"
        :items="inputData.link_list"
        :items-per-page="-1"
      > -->
      <template #header.actions>
        <v-btn
          color="primary"
          density="comfortable"
          icon="mdi-plus-circle"
          size="small"
          variant="text"
          @click.stop="addNewGroup"
        />
      </template>

      <template #item-actions="{ item }">
        <v-btn
          color="red"
          density="comfortable"
          icon="mdi-minus-circle"
          size="small"
          variant="text"
          @click.stop="removeNewGroup(item)"
        />
      </template>

      <template #item.agent_group_pk="{ item }">
        <div v-if="props.roleType === 'AGENT'">{{ item.agent_group_name }}</div>

        <FRemoteTableMenu
          v-else
          v-model="item.agent_group_name"
          bind-key="pk"
          :bind-value="item.agent_group_pk"
          display-key="agent_group_name"
          :fetch-method="queryPartyGroupOptions"
          :headers="groupTableHeaders"
          :query-extra="{ role_type: 'AGENT' }"
          :text-field-props="{
            'min-width': '100%',
            class: 'pr-8',
          }"
          virtual
          @click-clear="
            () => {
              item.agent_group_name = null
              item.agent_group_pk = null
            }
          "
          @row-select="
            $event => {
              if ($event) {
                item.agent_group_name = $event.code
                item.agent_group_pk = $event.pk
              }
            }
          "
        />
      </template>

      <template #item.consignee_group_pk="{ item }">
        <div v-if="props.roleType === 'CONSIGNEE'">{{ item.consignee_group_name }}</div>

        <FRemoteTableMenu
          v-else
          v-model="item.consignee_group_name"
          bind-key="pk"
          :bind-value="item.consignee_group_pk"
          display-key="agent_group_name"
          :fetch-method="queryPartyGroupOptions"
          :headers="groupTableHeaders"
          :query-extra="{ role_type: 'CONSIGNEE' }"
          :text-field-props="{
            'min-width': '100%',
            class: 'pr-8',
          }"
          virtual
          @click-clear="
            () => {
              item.consignee_group_name = null
              item.consignee_group_pk = null
            }
          "
          @row-select="
            $event => {
              if ($event) {
                item.consignee_group_name = $event.code
                item.consignee_group_pk = $event.pk
              }
            }
          "
        />
      </template>

      <template #item.shipper_group_pk="{ item }">
        <div v-if="props.roleType === 'SHIPPER'">{{ item.shipper_group_name }}</div>

        <FRemoteTableMenu
          v-else
          v-model="item.shipper_group_name"
          bind-key="pk"
          :bind-value="item.shipper_group_pk"
          display-key="agent_group_name"
          :fetch-method="queryPartyGroupOptions"
          :headers="groupTableHeaders"
          :query-extra="{ role_type: 'SHIPPER' }"
          :text-field-props="{
            'min-width': '100%',
            class: 'pr-8',
          }"
          virtual
          @click-clear="
            () => {
              item.shipper_group_name = null
              item.shipper_group_pk = null
            }
          "
          @row-select="
            $event => {
              if ($event) {
                item.shipper_group_name = $event.code
                item.shipper_group_pk = $event.pk
              }
            }
          "
        />
      </template>
      <!-- </v-data-table> -->
    </FTableLayout>
  </v-sheet>
</template>

<script setup>
  import { queryPartyGroupOptions } from '@/api/party-group'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'PartyGroupRelation' })

  const { t } = useSystemPageI18n()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    groupPk: {
      type: String,
      default: null,
    },
    roleType: {
      type: String,
      default: null,
    },
  })

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
  const linkHeaders = ref([
    { title: '', key: 'actions', align: 'center', sortable: false, width: '40' },
    {
      title: 'Agent Group',
      key: 'agent_group_pk',
      align: 'start',
      minWidth: '140px',
    },
    {
      title: 'Consignee Group',
      key: 'consignee_group_pk',
      align: 'start',
      minWidth: '140px',
    },
    {
      title: 'Shipper Group',
      key: 'shipper_group_pk',
      align: 'start',
      minWidth: '140px',
    },
  ])
  const generateNegativeId = list => {
    if (!Array.isArray(list) || list.length === 0) return -1

    const minId = list.reduce((min, item) => {
      const id = Number(item?.id)
      return !Number.isNaN(id) && id < min ? id : min
    }, 0)

    return minId > 0 ? -1 : minId - 1
  }

  const addNewGroup = () => {
    const newGroup = {
      id: generateNegativeId(inputData.value.link_list),
      pk: '',
      agent_group_pk: '',
      consignee_group_pk: '',
      shipper_group_pk: '',
    }
    if (props.roleType === 'AGENT') {
      newGroup.agent_group_name = inputData.value.code
    } else if (props.roleType === 'CONSIGNEE') {
      newGroup.consignee_group_name = inputData.value.code
    }
    if (props.roleType === 'SHIPPER') {
      newGroup.shipper_group_name = inputData.value.code
    }
    inputData.value.link_list.push(newGroup)
  }
  const removeNewGroup = item => {
    const linkList = inputData.value.link_list ?? []
    if (!Array.isArray(linkList)) {
      return
    }
    const index = linkList.findIndex(x => x.id == item.id)
    if (index >= 0) {
      linkList.splice(index, 1)
    }
  }

  const groupTableHeaders = ref([
    {
      title: 'Code',
      key: 'code',
      align: 'start',
      minWidth: '140px',
    },
    {
      title: 'Description',
      key: 'description',
      align: 'start',
    },
  ])
</script>
