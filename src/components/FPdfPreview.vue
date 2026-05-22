<template>
  <v-card :disabled="diaLoading" :loading="diaLoading">
    <template #loader="{ isActive }">
      <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
    </template>

    <v-toolbar color="transparent">
      <template #prepend>
        <!-- <v-btn color="warning" density="comfortable" icon="mdi-file-excel" />
        <v-btn color="primary" density="comfortable" icon="mdi-file" /> -->
        <!-- <v-btn color="info" density="comfortable" icon="mdi-printer" @click="printPdf" /> -->
        <slot name="tools-btn-prepend" />
      </template>

      <v-toolbar-title class="text-h6" :text="templateName" />

      <template #append>
        <slot name="tools-btn" />
      </template>
    </v-toolbar>

    <iframe ref="iframeRef" frameborder="0" height="100%" :src="pdfUrl" width="100%" />
  </v-card>
</template>
<script setup>
  import { ref } from 'vue'
  // import { useLocale } from 'vuetify'

  // const { t } = useLocale()

  const props = defineProps({
    pdfUrl: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      default: '',
    },
  })
  const { pdfUrl, templateName } = toRefs(props)

  // const emit = defineEmits(['send-email'])

  const diaLoading = ref(false)
  const iframeRef = ref(null)
  // const printPdf = () => {
  //   if (iframeRef.value) {
  //     iframeRef.value.contentWindow.print()
  //   }
  // }
  // const downloadPdf = () => {}
</script>
