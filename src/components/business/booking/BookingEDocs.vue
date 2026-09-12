<template>
  <FTableLayout
    ref="refTblDataEDoc"
    v-model="tblSelectedEDoc"
    :headers="tblEDocHeaders"
    item-value="id"
    :items="edocList"
    :items-per-page="itemsPerPage"
    :max-height="maxHeight"
    :show-select="true"
    striped="even"
    :title="eDocs('title')"
    @row-dblclick="onRowDblClick"
    @update:items-per-page="handleItemsPerPageChange"
    @update:page="handlePageChange"
  >
    <template #actions>
      <div class="d-flex ga-2">
        <v-btn
          color="primary"
          density="default"
          :disabled="readonly"
          prepend-icon="mdi-upload"
          size="small"
          variant="flat"
          @click="openShowUpload"
        >
          {{ eDocs('upload') }}
        </v-btn>
      </div>
    </template>

    <template #item-actions="{ item }">
      <v-menu>
        <template #activator="ssss">
          <v-btn
            v-bind="ssss.props"
            density="comfortable"
            icon="mdi-dots-vertical"
            size="small"
            variant="text"
          />
        </template>

        <v-list
          density="compact"
          item-props
          item-value="code"
          :items="getRowMenuItems()"
          slim
          @click:select="handleRowMenuSelect($event, item)"
        />
      </v-menu>
    </template>

    <template #item.received_time="{ item }">
      {{ appStore.utils.formatUTCTime(item.received_time) }}
    </template>
  </FTableLayout>

  <v-dialog v-model="showUpload" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ eDocs('uploadDialogTitle') }}</span>

        <v-btn icon size="small" variant="text" @click="showUpload = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <FUpload
          v-if="showUpload"
          cols="c12m6"
          :job-number="inputData.bkg_consign_no"
          job-type="BKG"
          :max-files="1"
          :readonly="true"
          show-ebooking-visible
          :upload-button-text="eDocs('uploadButtonText')"
          @clear="handleClear"
          @upload="handleUpload"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="pdfDiaVis" height="800" max-width="800" persistent>
    <FPdfPreview :pdf-url="pdfUrl || ''" :template-name="pdfTemplateName">
      <template #tools-btn>
        <v-btn color="red" density="comfortable" icon="$close" @click="closePreview" />
      </template>
    </FPdfPreview>
  </v-dialog>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
  import { edocSave, edocSearch } from '@/api/edoc'
  import { downloadFile, FILE_DOCUMENT_SOURCE, previewFile } from '@/api/files'
  import FPdfPreview from '@/components/FPdfPreview.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import FUpload from '@/components/FUpload.vue'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useAppStore } from '@/stores/app'

  const { t, eDocs } = useBookingPageI18n()

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  })
  const { activedTab } = toRefs(props)
  const appStore = useAppStore()

  const refTblDataEDoc = ref(null)
  const tblSelectedEDoc = ref([])
  const edocList = ref([])
  const showUpload = ref(false)
  const pdfUrl = ref('')
  const pdfDiaVis = ref(false)
  const pdfTemplateName = ref('eDoc')
  const currentPage = ref(1)
  const itemsPerPage = ref(100)
  let downloadController = null
  let previewObjectUrl = null

  const maxHeight = computed(() => document.documentElement.clientHeight - 272)
  const tblEDocHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', sortable: false, width: '36px' },
    { title: eDocs('fileName'), key: 'file_name', align: 'start', minWidth: '140' },
    { title: eDocs('filePath'), key: 'file_path', align: 'start', minWidth: '200' },
    { title: eDocs('refNo'), key: 'ref_no', align: 'start', minWidth: '140' },
    { title: eDocs('receivedTime'), key: 'received_time', align: 'start', minWidth: '140' },
  ])

  const checkBookingLocked = () => {
    if (inputData.value.bkg_is_forward_registered === 1) {
      appStore.openMessage({
        content: `Booking ${inputData.value.bkg_consign_no} is locked.`,
        color: 'error',
      })
      return true
    }
    return false
  }

  const openShowUpload = () => {
    if (props.readonly || checkBookingLocked()) {
      return
    }
    showUpload.value = true
  }

  const revokePreviewUrl = () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
      previewObjectUrl = null
    }
    pdfUrl.value = ''
  }

  const closePreview = () => {
    pdfDiaVis.value = false
    revokePreviewUrl()
  }

  const getRowMenuItems = () => [
    { title: eDocs('download'), prependIcon: 'mdi-download', code: 'download' },
    { title: eDocs('preview'), prependIcon: 'mdi-eye', code: 'preview' },
  ]

  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'download': {
        return onDownloadFile(item)
      }
      case 'preview': {
        return handlePreview(item)
      }
    }
  }

  const edocFetchData = async () => {
    if (!inputData.value.pk) {
      edocList.value = []
      return
    }

    try {
      const response = await edocSearch({
        parent_table: 'BKG',
        related_key: inputData.value.pk,
      })
      if (response?.success) {
        edocList.value = response.data?.list ?? []
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePreview = async item => {
    if (!item?.pk) {
      appStore.openMessage({
        content: 'No document reference available for preview.',
        color: 'warning',
      })
      return
    }

    try {
      appStore.openGlobalLoadingWithIcon('Loading preview...', 'mdi-eye', 'info')
      const blob = await previewFile({
        document_source: FILE_DOCUMENT_SOURCE.job,
        document_pk: item.pk,
      })
      revokePreviewUrl()
      previewObjectUrl = URL.createObjectURL(blob)
      pdfUrl.value = previewObjectUrl
      pdfTemplateName.value = item.file_name || item.file_type || 'eDoc'
      pdfDiaVis.value = true
    } catch (error) {
      console.log(error)
      appStore.openMessage({
        content: 'Failed to preview document.',
        color: 'error',
      })
    } finally {
      appStore.closeGlobalLoading()
    }
  }

  const handleClear = () => undefined

  const handleUpload = async uploadData => {
    const { files, docType, jobNumber: relatedKey, is_ebooking_visible } = uploadData

    if (!files?.length) {
      appStore.openMessage({
        content: 'please upload edoc excel.',
        color: 'error',
      })
      return
    }

    if (!docType) {
      appStore.openMessage({
        content: 'please select doc type.',
        color: 'error',
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', files[0].file)
      formData.append('parent_table', 'BKG')
      formData.append('file_type', docType)
      formData.append('ref_no', relatedKey || inputData.value.pk)
      formData.append('is_ebooking_visible', String(Boolean(is_ebooking_visible)))

      const result = await edocSave(formData)
      if (result?.success) {
        appStore.openMessage({
          content: 'Upload successful',
          color: 'success',
        })
        await edocFetchData()
        showUpload.value = false
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      appStore.openMessage({
        content: `Upload failed: ${message}`,
        color: 'error',
      })
    }
  }

  const onDownloadFile = async item => {
    if (!item?.pk) {
      return
    }

    downloadController?.abort()
    const controller = new AbortController()
    downloadController = controller
    try {
      appStore.openGlobalLoadingWithIcon('Downloading file...', 'mdi-cloud-download', 'info')
      const blob = await downloadFile(
        {
          document_source: FILE_DOCUMENT_SOURCE.job,
          document_pk: item.pk,
        },
        controller.signal,
      )
      if (controller.signal.aborted) {
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = item.file_name || 'edoc'
      document.body.append(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      appStore.openMessage({
        content: t('$vuetify.custom.app.downloadSnackText', link.download),
        color: 'success',
      })
    } catch (error) {
      if (!controller.signal.aborted) {
        console.log(error)
      }
    } finally {
      if (downloadController === controller) {
        downloadController = null
        appStore.closeGlobalLoading()
      }
    }
  }

  const handlePageChange = page => {
    currentPage.value = page
  }

  const handleItemsPerPageChange = value => {
    itemsPerPage.value = value
    currentPage.value = 1
  }

  const onRowDblClick = (event, { item }) => {
    const target = event?.target
    if (
      target instanceof Element &&
      target.closest('.v-selection-control, button, a, input, textarea, [role="button"]')
    ) {
      return
    }
    handlePreview(item)
  }

  onMounted(() => {
    refTblDataEDoc.value?.initHeaders()
    refTblDataEDoc.value?.initScrollListener()
  })

  watch(
    [activedTab, () => inputData.value.pk],
    ([tab]) => {
      if (tab === 3) {
        edocFetchData()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    downloadController?.abort()
    revokePreviewUrl()
  })
</script>
