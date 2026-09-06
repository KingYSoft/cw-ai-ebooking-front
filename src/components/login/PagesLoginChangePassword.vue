<template>
  <v-dialog v-model="diaVis" max-width="440" persistent>
    <v-card
      :disabled="appStore.appLoading"
      :loading="appStore.appLoading"
      prepend-icon="mdi-lock"
      title="Change Password"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <v-form ref="refDataForm" class="ref-form-pre">
        <v-card-text class="py-2">
          <v-row dense>
            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="inputPwd.pwd_old"
                :append-inner-icon="pwdOldVis ? 'mdi-eye-off' : 'mdi-eye'"
                color="primary"
                density="comfortable"
                hide-details
                label="Old Password"
                :rules="inputPwdRules.pwd_old"
                :type="pwdOldVis ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="pwdOldVis = !pwdOldVis"
              />
            </v-col>

            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="inputPwd.pwd_new"
                :append-inner-icon="pwdNewVis ? 'mdi-eye-off' : 'mdi-eye'"
                color="primary"
                density="comfortable"
                hide-details
                label="New Password"
                :rules="inputPwdRules.pwd_new"
                :type="pwdNewVis ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="pwdNewVis = !pwdNewVis"
              />
            </v-col>

            <v-col :cols="rescols('c12')">
              <v-text-field
                v-model="inputPwd.pwd_new2"
                :append-inner-icon="pwdNew2Vis ? 'mdi-eye-off' : 'mdi-eye'"
                color="primary"
                density="comfortable"
                hide-details
                label="Confirm New Password"
                :rules="inputPwdRules.pwd_new2"
                :type="pwdNew2Vis ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="pwdNew2Vis = !pwdNew2Vis"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>

      <template #actions>
        <v-spacer />
        <v-btn :text="t('$vuetify.custom.dialog.btn.close')" @click="diaVis = false" />

        <v-btn
          color="primary"
          :text="t('$vuetify.custom.dialog.btn.save')"
          variant="tonal"
          @click="confirm"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  import { userChangePassword } from '@/api/user'
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

  const pwdOldVis = ref(false)
  const pwdNewVis = ref(false)
  const pwdNew2Vis = ref(false)

  const inputPwd = ref({})
  const inputPwdRules = {
    pwd_old: [
      value => {
        if (value) return true
        return 'old password is required.'
      },
    ],
    pwd_new: [
      value => {
        if (value) return true
        return 'password is required.'
      },
    ],
    pwd_new2: [
      value => {
        if (value) {
          if (inputPwd.value.pwd_new === value) {
            return true
          } else {
            return 'two passwords are different.'
          }
        }
        return 'password is required.'
      },
    ],
  }

  const refDataForm = ref(null)
  const confirm = async () => {
    const { valid, errors } = await refDataForm.value?.validate()
    if (valid) {
      try {
        appStore.appLoading = true
        const { success } = await userChangePassword({
          ...inputPwd.value,
        })
        if (success) {
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
  watch(
    () => diaVis.value,
    () => {
      inputPwd.value = {}
    },
  )
</script>
