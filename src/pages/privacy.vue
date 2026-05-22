<template>
  <v-responsive>
    <v-app>
      <v-main>
        <v-container class="pa-4">
          <v-card color="transparent" elevation="0" rounded="0">
            <v-card-title class="text-h5">
              {{ t('$vuetify.custom.privacyPage.title') }}
            </v-card-title>

            <v-divider />

            <v-card-text>
              <div class="privacy-content">
                <div class="mb-4 text-body-1">
                  {{ t('$vuetify.custom.privacyPage.desc') }}
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p1.title') }}
                  </h6>

                  <ol class="pl-8 text-body-1">
                    <li>
                      {{ t('$vuetify.custom.privacyPage.p1.d1') }}
                    </li>

                    <li>
                      {{ t('$vuetify.custom.privacyPage.p1.d2') }}
                    </li>

                    <li>
                      {{ t('$vuetify.custom.privacyPage.p1.d3') }}
                    </li>
                  </ol>
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p2.title') }}
                  </h6>

                  <p class="text-body-1">
                    {{ t('$vuetify.custom.privacyPage.p2.d1') }}
                  </p>
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p3.title') }}
                  </h6>

                  <p class="text-body-1">
                    {{ t('$vuetify.custom.privacyPage.p3.d1') }}
                  </p>
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p4.title') }}
                  </h6>

                  <p class="text-body-1">
                    {{ t('$vuetify.custom.privacyPage.p4.d1') }}
                  </p>
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p5.title') }}
                  </h6>

                  <p class="text-body-1">
                    {{ t('$vuetify.custom.privacyPage.p5.d1') }}
                  </p>
                </div>

                <div class="mb-4">
                  <h6 class="text-h6 mb-2">
                    {{ t('$vuetify.custom.privacyPage.p6.title') }}
                  </h6>

                  <p class="text-body-1">
                    {{ t('$vuetify.custom.privacyPage.p6.d1') }}
                  </p>
                </div>

                <p class="text-subtitle-2 text-grey mt-4">
                  {{ t('$vuetify.custom.privacyPage.date') }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  defineOptions({
    name: 'PrivacyPolicy',
  })
  definePage({
    name: 'privacy',
    icon: '',
    menu: false,
    order: 1,
    meta: {
      requiresAuth: false,
      isLayout: false,
    },
  })

  const { t } = useLocale()
</script>
<style lang="scss" scoped>
  .privacy-content {
    line-height: 1.8;
  }
</style>
