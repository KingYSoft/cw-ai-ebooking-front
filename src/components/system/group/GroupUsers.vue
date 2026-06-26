<template>
  <v-sheet color="transparent">
    <v-card-text>
      <v-btn color="primary" size="small" variant="flat" @click="openUserDialog">
        Select Users
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
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template #bottom />
    </v-data-table>

    <v-dialog v-model="userDialogVisible" max-width="1100" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          Select Users
          <v-spacer />

          <v-chip color="primary" size="small" variant="tonal">
            {{ userDialogSelected.length }} selected
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
                  placeholder="input query keywords"
                  single-line
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end">Query User:</div>
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
            :items="userList"
            return-object
            :search="userQuerySearch"
            :show-select="true"
            striped="even"
          >
            <template #item.is_active="{ item }">
              <v-chip
                :color="item.is_active === 1 ? 'success' : 'error'"
                density="comfortable"
                size="small"
                variant="tonal"
              >
                {{ item.is_active === 1 ? 'Yes' : 'No' }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="userDialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="userDialogVisible = false">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import { queryUserPage } from '@/api/user'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineOptions({ name: 'GroupUsers' })

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
  const { t } = useLocale()
  const display = useDisplay()
  const { rescols } = useLayoutCols()

  const maxHeight = computed(() => {
    return display.height.value - 320
  })
  const userHeaders = [
    { title: 'Login Name', key: 'login_name', align: 'start', minWidth: '160px' },
    { title: 'Full Name', key: 'full_name', align: 'start', minWidth: '160px' },
    { title: 'Email', key: 'email_address', align: 'start', minWidth: '220px' },
    { title: 'Short', key: 'short_code', align: 'start', minWidth: '140px' },
    { title: 'Active', key: 'is_active', align: 'start', minWidth: '140px' },
  ]
  const selectedUserHeaders = [
    { title: '', key: 'actions', align: 'center', width: '60px', sortable: false },
    ...userHeaders,
  ]
  const userList = ref([])
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

    userList.value = data?.items ?? []
  }
  loadBaseOptions()
</script>
