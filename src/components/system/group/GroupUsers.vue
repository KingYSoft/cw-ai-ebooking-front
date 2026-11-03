<template>
  <v-sheet color="transparent">
    <v-card-text>
      <v-btn color="primary" size="small" variant="flat" @click="openUserDialog">
        {{ groupEdit('users.selectUsers') }}
      </v-btn>
    </v-card-text>

    <v-data-table
      class="table-filter"
      :disable-sort="false"
      :fixed-header="false"
      :headers="selectedUserHeaders"
      :height="maxHeight"
      item-value="pk"
      :items="inputData.users"
      :items-per-page="-1"
      :show-select="false"
      striped="even"
    >
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="mScope">
            <v-btn
              v-bind="mScope.props"
              density="comfortable"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list activatable density="compact">
            <v-list-item prepend-icon="mdi-delete" @click.prevent="removeSelectedUser(item)">
              <v-list-item-title>{{ common('delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <v-dialog v-model="userDialogVisible" max-width="1100" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          {{ groupEdit('users.selectUsers') }}
          <v-spacer />

          <v-chip color="primary" size="small" variant="tonal">
            {{ common('selected', userDialogSelected.length) }}
          </v-chip>
        </v-card-title>

        <v-card-text class="py-2">
          <v-form class="ref-form-pre">
            <v-row dense>
              <v-col :cols="rescols('c12m4')">
                <v-text-field
                  v-model="userQuerySearch"
                  clearable
                  density="compact"
                  hide-details
                  :placeholder="common('queryKeywordsPlaceholder')"
                  single-line
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end">{{ groupEdit('users.queryUser') }}</div>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-0">
          <v-data-table
            v-model="inputData.users"
            class="table-filter"
            :disable-sort="false"
            :fixed-header="false"
            :headers="userHeaders"
            :height="420"
            hover
            item-value="pk"
            :items="userOptions"
            :items-per-page="-1"
            return-object
            :search="userQuerySearch"
            :show-select="true"
            striped="even"
          >
            <template #item.is_active="{ item }">
              <StatusBadge
                :text="item.is_active === 1 ? common('yes') : common('no')"
                :tone-key="item.is_active === 1 ? 'yes' : 'no'"
              />
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="userDialogVisible = false">{{ common('cancel') }}</v-btn>

          <v-btn color="primary" variant="tonal" @click="userDialogVisible = false">
            {{ common('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import { queryUserPage } from '@/api/user'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'GroupUsers' })

  const { common, groupEdit } = useSystemPageI18n()

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
  const display = useDisplay()
  const { rescols } = useLayoutCols()

  const maxHeight = computed(() => {
    return display.height.value - 320
  })
  const userHeaders = computed(() => [
    {
      title: groupEdit('users.headers.loginName'),
      key: 'login_name',
      align: 'start',
      minWidth: '160px',
    },
    {
      title: groupEdit('users.headers.fullName'),
      key: 'full_name',
      align: 'start',
      minWidth: '160px',
    },
    {
      title: groupEdit('users.headers.email'),
      key: 'email_address',
      align: 'start',
      minWidth: '220px',
    },
    {
      title: groupEdit('users.headers.short'),
      key: 'short_code',
      align: 'start',
      minWidth: '140px',
    },
    {
      title: groupEdit('users.headers.active'),
      key: 'is_active',
      align: 'start',
      minWidth: '140px',
    },
  ])
  const selectedUserHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', width: '60px', sortable: false },
    ...userHeaders.value,
  ])
  const userOptions = ref([])
  const userDialogVisible = ref(false)
  const userDialogSelected = computed(() => {
    return (inputData.value.users || []).map(a => a.pk)
  })

  const userQuerySearch = ref('')
  const openUserDialog = () => {
    userQuerySearch.value = ''
    userDialogVisible.value = true
  }

  const removeSelectedUser = item => {
    inputData.value.users = (inputData.value.users || []).filter(x => x.pk !== item.pk)
  }

  const loadBaseOptions = async () => {
    const { data } = await queryUserPage({ SkipCount: 0, MaxResultCount: 9999, filters: [] })

    userOptions.value = data?.items ?? []
  }
  loadBaseOptions()
</script>
