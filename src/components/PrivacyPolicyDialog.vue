<template>
  <v-bottom-sheet v-model="openValue" :inset="isInset" persistent>
    <v-sheet class="pa-6">
      <div class="d-flex align-end ga-4" :class="classV">
        <div class="d-flex flex-column ga-4">
          <p>
            {{ t('$vuetify.custom.loginPage.privacyPolicy.p1') }}
          </p>

          <p>
            {{ t('$vuetify.custom.loginPage.privacyPolicy.p2') }}
            <a class="text-red-accent-2" href="/privacy" rel="noopener noreferrer" target="_blank">
              {{ t('$vuetify.custom.loginPage.privacyPolicy.p3') }}
            </a>
            {{ t('$vuetify.custom.loginPage.privacyPolicy.p4') }}
          </p>
        </div>

        <v-btn
          class="text-none"
          color="red-accent-2"
          size="x-large"
          variant="flat"
          @click="acceptHandle"
        >
          {{ t('$vuetify.custom.loginPage.privacyPolicy.btnText') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script setup>
  import { useDisplay, useLocale } from 'vuetify'

  defineOptions({
    name: 'PrivacyPolicyDialog',
  })
  const { t } = useLocale()
  const aaa = useDisplay()

  const classV = computed(() => {
    const { lg, md, sm, xl, xxl, xs } = aaa
    if (lg.value || xl.value || xxl.value) {
      return ''
    } else if (md.value) {
      return ''
    } else if (sm.value) {
      return 'flex-column'
    } else if (xs.value) {
      return 'flex-column'
    } else {
      return 'flex-column'
    }
  })
  const isInset = computed(() => {
    const { lg, md, sm, xl, xxl, xs } = aaa
    if (lg.value || xl.value || xxl.value) {
      return true
    } else if (md.value) {
      return true
    } else if (sm.value) {
      return true
    } else if (xs.value) {
      return false
    } else {
      return false
    }
  })

  const openValue = defineModel('open-value', {
    type: Boolean,
    default: () => false,
  })

  const acceptHandle = () => {
    localStorage.setItem('privacy_policy_accepted', '1')
    openValue.value = false
  }
</script>
