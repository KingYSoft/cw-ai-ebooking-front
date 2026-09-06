<template>
  <v-dialog v-model="diaVis" max-width="440" persistent>
    <v-card
      :disabled="appStore.appLoading"
      :loading="appStore.appLoading"
      prepend-icon="mdi-city"
      title="Company, Branch and Department"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <v-form ref="refDataForm" class="ref-form-pre">
        <v-card-text class="py-2">
          <v-row no-gutters>
            <v-col :cols="rescols('c12')">
              <div class="d-flex align-start flex-column flex-wrap ga-3">
                <div class="d-flex align-start flex-column ga-1 w-100">
                  <div class="text-caption">Company:</div>

                  <v-select
                    v-model="selectCompanyPK"
                    auto-select-first
                    autocomplete="off"
                    density="compact"
                    hide-details
                    item-title="company_title"
                    item-value="company_pk"
                    :items="companyItems"
                    :menu-props="{
                      'max-width': '100%',
                    }"
                    min-width="100%"
                    no-data-text="$vuetify.custom.app.searchMore"
                    no-filter
                    :rules="[v => (v ? true : 'please select company.')]"
                    variant="outlined"
                    @update:model-value="onSelectedCompany"
                  >
                    <template #item="scope">
                      <v-list-item
                        v-bind="scope.props"
                        :subtitle="`${scope.item.raw.company_name}`"
                        :title="`${scope.item.raw.company_code}`"
                      />
                    </template>
                  </v-select>
                </div>

                <div class="d-flex align-start flex-column ga-1 w-100">
                  <div class="text-caption">Branch:</div>

                  <v-select
                    v-model="selectBranchPK"
                    auto-select-first
                    autocomplete="off"
                    density="compact"
                    :disabled="!selectCompanyPK"
                    hide-details
                    item-title="branch_title"
                    item-value="branch_pk"
                    :items="branchItems"
                    :menu-props="{
                      'max-width': '100%',
                    }"
                    min-width="100%"
                    no-data-text="$vuetify.custom.app.searchMore"
                    no-filter
                    :rules="[v => (v ? true : 'please select branch.')]"
                    variant="outlined"
                  >
                    <template #item="scope">
                      <v-list-item
                        v-bind="scope.props"
                        :subtitle="`${scope.item.raw.branch_name}`"
                        :title="`${scope.item.raw.branch_code}`"
                      />
                    </template>
                  </v-select>
                </div>

                <div class="d-flex align-start flex-column ga-1 w-100">
                  <div class="text-caption">Department:</div>

                  <v-select
                    v-model="selectDeptPK"
                    auto-select-first
                    autocomplete="off"
                    density="compact"
                    :disabled="!selectBranchPK"
                    hide-details
                    item-title="dept_title"
                    item-value="dept_pk"
                    :items="deptItems"
                    :menu-props="{
                      'max-width': '100%',
                    }"
                    min-width="100%"
                    no-data-text="$vuetify.custom.app.searchMore"
                    no-filter
                    variant="outlined"
                  >
                    <template #item="scope">
                      <v-list-item
                        v-bind="scope.props"
                        :subtitle="`${scope.item.raw.dept_name}`"
                        :title="`${scope.item.raw.dept_code}`"
                      />
                    </template>
                  </v-select>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>

      <template #actions>
        <v-spacer />
        <v-btn :text="t('$vuetify.custom.dialog.btn.close')" @click="diaVis = false" />

        <v-btn
          color="primary"
          :text="t('$vuetify.custom.dialog.btn.ok')"
          variant="tonal"
          @click="confirm"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  import { userQuerySwitchTbl, userSwitchBranch } from '@/api/user'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  const { rescols } = useLayoutCols()

  const appStore = useAppStore()
  const { t } = useLocale()
  //   const props = defineProps({})

  const diaVis = defineModel('dia-vis', {
    type: Boolean,
    default: false,
  })
  // const emit = defineEmits([])

  const selectCompanyPK = ref(null)
  const selectBranchPK = ref(null)
  const selectDeptPK = ref(null)

  const companyItems = ref([])
  const branchItems = ref([])
  const deptItems = ref([])

  const querySwitchTbl = async () => {
    try {
      appStore.appLoading = true
      const { success, data } = await userQuerySwitchTbl()
      if (success) {
        companyItems.value = data.company_list ?? []
        selectCompanyPK.value = null
        selectBranchPK.value = null
        selectDeptPK.value = null
        const currentCompanyPK = appStore.userSession.currentCompanyPK()
        const idx = companyItems.value.findIndex(a => a.company_pk === currentCompanyPK)
        if (idx >= 0) {
          selectCompanyPK.value = currentCompanyPK
          branchItems.value = companyItems.value[idx].branch_list ?? []
          const currentBranchPK = appStore.userSession.currentBranchPK()
          const idx2 = branchItems.value.findIndex(x => x.branch_pk === currentBranchPK)
          console.log('bbbb')
          if (idx2 >= 0) {
            selectBranchPK.value = currentBranchPK
          }
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      appStore.appLoading = false
    }
  }

  const onSelectedCompany = val => {
    branchItems.value = []
    selectBranchPK.value = null
    const cc = companyItems.value ?? []
    if (val && cc.length > 0) {
      const idx = cc.findIndex(a => a.company_pk === val)
      if (idx >= 0) {
        branchItems.value = cc[idx].branch_list ?? []
      }
    }
  }

  watch(
    () => diaVis.value,
    val => {
      if (val) {
        querySwitchTbl()
      }
    },
  )
  const refDataForm = ref(null)
  const confirm = async () => {
    const { valid, errors } = await refDataForm.value?.validate()
    if (valid) {
      try {
        appStore.appLoading = true
        const { success, data } = await userSwitchBranch({
          company_pk: selectCompanyPK.value,
          branch_pk: selectBranchPK.value,
          dept_pk: selectDeptPK.value,
        })
        if (success && data) {
          sessionStorage.setItem('token', data.access_token)
          appStore.fetchAppConfig()
          appStore.openMessage({
            content: t('$vuetify.custom.app.saveSuccess'),
            color: 'success',
          })
          diaVis.value = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        appStore.appLoading = false
      }
    } else {
      let errList = []
      if (errors && errors.length > 0) {
        const err = []
        for (let i = 0; i < errors.length; i++) {
          const e = errors[i]
          const msg =
            e.errorMessages && e.errorMessages.length > 0 ? e.errorMessages[0] : 'data valid fail.'

          if (e.id.indexOf('@') >= 0) {
            const tab = e.id.split('@', 1)[0]
            if (!Number.isNaN(Number(tab)) && Number(tab) > 0) {
              err.push({ tab: Number(tab), msg })
            }
          } else {
            err.push({ tab: 1, msg })
          }
        }
        if (err.length > 0) {
          errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
        }
      }
      if (errList.length > 0) {
        // activedTab.value = errList[0].tab
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
    }
  }
</script>
