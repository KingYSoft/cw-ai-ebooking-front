<template>
  <FPageLayout :skeleton-loading="false">
    <template #filter>
      <PageFilterBar
        v-model:input-search-data="inputSearchData"
        :search-cols="rescols('c12l2m2')"
        @on-search="search"
      >
        <v-col :cols="rescols('c12l6m6')">
          <div class="d-flex align-center ga-1">
            <v-select
              v-model="inputSearchData.field1.key"
              auto-select-first
              density="compact"
              hide-details
              item-title="title"
              item-value="key"
              :items="inputSearchData.field1.keyItems"
              max-width="120"
              variant="underlined"
            />

            <FDatePicker
              v-model:date-value="inputSearchData.field1.start"
              :date-props="{ placeholder: emailText('startDate'), clearable: true }"
              :max="inputSearchData.field1.end || '2099-12-31'"
              min="2000-01-01"
              min-width="auto"
              width="120"
            />
            -
            <FDatePicker
              v-model:date-value="inputSearchData.field1.end"
              :date-props="{ placeholder: emailText('endDate'), clearable: true }"
              max="2099-12-31"
              :min="inputSearchData.field1.start || '2000-01-01'"
              min-width="auto"
              width="120"
            />
          </div>
        </v-col>
      </PageFilterBar>
    </template>

    <FTableLayout
      :headers="headers"
      item-value="id"
      :items="filteredEmails"
      :max-height="maxHeight"
      striped="even"
      :title="emailText('title')"
      @row-click="onRowClick"
    >
      <template #item.subject="{ item }">
        <v-btn
          class="email-subject"
          color="primary"
          variant="text"
          @click="openDetail(item)"
        >
          {{ item.subject }}
        </v-btn>
      </template>
    </FTableLayout>

    <v-navigation-drawer
      v-model="detailVisible"
      location="right"
      temporary
      width="680"
    >
      <v-card v-if="selectedEmail" class="email-detail-card" rounded="0">
        <v-card-title class="d-flex align-center justify-space-between py-3">
          <span class="text-subtitle-1 font-weight-bold">{{ emailText('detailTitle') }}</span>

          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="detailVisible = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <h2 class="text-h6 mb-2">{{ selectedEmail.subject }}</h2>

          <div class="text-body-2 text-medium-emphasis">
            {{ emailText('sender') }}: {{ selectedEmail.sender }}
          </div>

          <div class="text-body-2 text-medium-emphasis">
            {{ emailText('date') }}: {{ selectedEmail.date }}
          </div>

          <div class="text-body-2 text-medium-emphasis">
            {{ emailText('size') }}: {{ selectedEmail.size }}
          </div>

          <v-divider class="my-5" />

          <!-- Mock content is controlled locally; API HTML must be sanitized before rendering. -->
          <div class="email-body" v-html="selectedEmail.bodyHtml" />
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </FPageLayout>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PageFilterBar from '@/components/PageFilterBar.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  defineOptions({ name: 'Email' })
  definePage({
    name: 'email',
    icon: 'mdi-email-outline',
    menu: true,
    order: 2.5,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const { height } = useDisplay()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()
  const emailText = key => t(`$vuetify.custom.emailPage.${key}`)

  const maxHeight = computed(() => height.value - 65 - 35 - 12 - 65 - 65)
  const headers = computed(() => [
    { title: emailText('sender'), key: 'sender', align: 'start', minWidth: '220px' },
    { title: emailText('subject'), key: 'subject', align: 'start', minWidth: '320px' },
    { title: emailText('date'), key: 'date', align: 'start', minWidth: '180px' },
    { title: emailText('size'), key: 'size', align: 'end', minWidth: '100px' },
  ])

  const emails = ref([
    {
      id: 1,
      sender: 'alex.johnson@hotmail.com',
      subject: 'Meeting confirmation',
      date: '2026-11-19 15:30',
      size: '24 KB',
      bodyHtml: `
        <p>Hi,</p>
        <p>Our meeting has been confirmed for <strong>Friday at 10:00 AM</strong>.</p>
        <p>Please let me know if you need to change the time.</p>
        <p>Best regards,<br>Alex</p>
      `,
    },
    {
      id: 2,
      sender: 'emily.williams@hotmail.com',
      subject: 'Project notes updated',
      date: '2026-11-19 10:12',
      size: '18 KB',
      bodyHtml: `
        <p>Hello Team,</p>
        <p>The project notes have been updated with the following items:</p>
        <ul>
          <li>Updated delivery timeline</li>
          <li>Revised task assignments</li>
          <li>Added meeting summary</li>
        </ul>
        <p>Thanks,<br>Emily</p>
      `,
    },
    {
      id: 3,
      sender: 'michael.brown@hotmail.com',
      subject: 'Welcome to the team',
      date: '2026-11-18 09:00',
      size: '32 KB',
      bodyHtml: `
        <h3>Welcome!</h3>
        <p>We are happy to have you on the team.</p>
        <div class="email-notice">
          Your orientation starts on <strong>Monday at 9:00 AM</strong>.
        </div>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Regards,<br>Michael</p>
      `,
    },
  ])

  const inputSearchData = ref({
    field1: {
      key: 'date',
      keyItems: [{ key: 'date', title: emailText('date') }],
      start: '',
      end: '',
    },
  })
  const appliedDateFilter = ref({ start: '', end: '' })
  const filteredEmails = computed(() => {
    const { start, end } = appliedDateFilter.value
    return emails.value.filter(email => {
      const emailDate = email.date.slice(0, 10)
      return (!start || emailDate >= start) && (!end || emailDate <= end)
    })
  })

  const detailVisible = ref(false)
  const selectedEmail = ref(null)

  function search() {
    appliedDateFilter.value = {
      start: inputSearchData.value.field1.start || '',
      end: inputSearchData.value.field1.end || '',
    }
  }

  function openDetail(email) {
    selectedEmail.value = email
    detailVisible.value = true
  }

  function onRowClick(event, { item }) {
    if (event?.target?.closest('button, a, input, textarea, [role="button"]')) {
      return
    }
    openDetail(item)
  }
</script>

<style scoped>
  .email-subject {
    justify-content: flex-start;
    max-width: 100%;
    padding-inline: 0;
    text-transform: none;
  }

  .email-body {
    min-height: 120px;
    line-height: 1.7;
  }

  .email-body :deep(p) {
    margin-bottom: 16px;
  }

  .email-body :deep(h3) {
    margin-bottom: 12px;
  }

  .email-body :deep(ul) {
    margin: 0 0 16px 24px;
  }

  .email-body :deep(.email-notice) {
    margin-bottom: 16px;
    padding: 12px;
    border-left: 4px solid rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.08);
  }

  .email-detail-card {
    height: 100%;
  }
</style>
