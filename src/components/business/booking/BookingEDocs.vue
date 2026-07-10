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
    title="Docs"
    @row-dblclick="onRowDblClick"
    @update:items-per-page="handleItemsPerPageChange"
    @update:page="handlePageChange"
  >
    <template #actions>
      <div class="d-flex ga-2">
        <v-btn
          color="primary"
          density="default"
          prepend-icon="mdi-upload"
          size="small"
          variant="flat"
          @click="openShowUpload"
        >
          Upload
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
          :items="getRowMenuItems(item)"
          slim
          @click:select="handleRowMenuSelect($event, item)"
        />
      </v-menu>
    </template>

    <template #item.received_time="{ item }">
      {{ appStore.utils.formatUTCTime(item.received_time) }}
    </template>
  </FTableLayout>

  <!-- Upload Dialog -->
  <v-dialog v-model="showUpload" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Upload eDoc</span>

        <v-btn icon size="small" variant="text" @click="showUpload = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <FUpload
          v-if="showUpload"
          cols="c12m6"
          :job-number="inputData.bkg_consign_no"
          :job-type="'BKG'"
          :max-files="1"
          :readonly="true"
          upload-button-text="Upload Files"
          @clear="handleClear"
          @upload="handleUpload"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="pdfDiaVis" height="800" max-width="800" persistent>
    <FPdfPreview :pdf-url="pdfUrl || ''" :template-name="pdfTemplateName">
      <template #tools-btn>
        <v-btn color="red" density="comfortable" icon="$close" @click="pdfDiaVis = false" />
      </template>
    </FPdfPreview>
  </v-dialog>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { edocDownloadFiles, edocSave, edocSearch } from '@/api/edoc'
  import FTableLayout from '@/components/FTableLayout.vue'
  import FUpload from '@/components/FUpload.vue'
  import { useAppStore } from '@/stores/app'

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })
  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
  })
  const { activedTab } = toRefs(props)

  const appStore = useAppStore()
  const refTblDataEDoc = ref(null)
  const tblSelectedEDoc = ref([])
  const edocTableLoading = ref(false)
  const edocList = ref([])
  const showUpload = ref(false)
  const checkBookingLocked = () => {
    if (inputData.value.bkg_is_forward_registered === 1) {
      appStore.openMessage({
        content: `Booking ${inputData.value.bkg_consign_no} is locked.`,
        color: 'error',
      })
      return true
    } else {
      return false
    }
  }
  const openShowUpload = () => {
    if (checkBookingLocked()) {
      return
    }
    showUpload.value = true
  }

  const pdfUrl = ref(null)
  const pdfDiaVis = ref(false)
  const pdfTemplateName = ref('eDoc')

  const resolveEdocFileUrl = item => {
    if (!item || typeof item !== 'object') {
      return ''
    }
    const path = item.file_url ?? item.file_path ?? item.url ?? item.path ?? ''
    if (!path) {
      return ''
    }
    if (/^https?:\/\//i.test(path)) {
      return path
    }
    const base = import.meta.env.VITE_APP_BASE_API || ''
    return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
  }

  const handlePreview = item => {
    const url = resolveEdocFileUrl(item)
    if (!url) {
      appStore.openMessage({
        content: 'No file URL available for preview.',
        color: 'warning',
      })
      return
    }
    pdfTemplateName.value = item.file_name || item.file_type || 'eDoc'
    pdfUrl.value = url
    pdfDiaVis.value = true
  }

  const handleDownload = (item = null) => {
    const rows = item ? [item] : tblSelectedEDoc.value || []
    if (rows.length === 0) {
      appStore.openMessage({
        content: 'Please select at least one file.',
        color: 'warning',
      })
      return
    }
    for (const row of rows) {
      const url = resolveEdocFileUrl(row)
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  const currentPage = ref(1)
  const itemsPerPage = ref(100)
  const maxHeight = computed(() => {
    const clientHeight = document.documentElement.clientHeight
    return clientHeight - 272
  })

  const initTable = () => {
    if (refTblDataEDoc.value) {
      refTblDataEDoc.value.initHeaders()
      refTblDataEDoc.value.initScrollListener()
    }
  }

  onMounted(() => {
    initTable()
  })

  const tblEDocHeaders = ref([
    { title: '', key: 'actions', align: 'center', sortable: false, width: '36px' },
    {
      title: 'File Name',
      key: 'file_name',
      align: 'start',
      minWidth: '140',
    },
    {
      title: 'File Path',
      key: 'file_path',
      align: 'start',
      minWidth: '200',
    },
    {
      title: 'Ref No.',
      key: 'ref_no',
      align: 'start',
      minWidth: '140',
    },
    {
      title: 'Received Time',
      key: 'received_time',
      align: 'start',
      minWidth: '140',
    },
  ])

  // #region Row Actions Menu
  const getRowMenuItems = () => [
    { title: 'download', prependIcon: 'mdi-download', code: 'download' },
    { title: 'preview', prependIcon: 'mdi-eye', code: 'preview' },
  ]
  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'download': {
        console.log('download', item)
        return onDownloadFile(item)
      }
      case 'preview': {
        console.log('preview', item)
        return openInNewTab(item.file_path)
      }
    }
  }

  const edocFetchData = async () => {
    if (!inputData.value.pk) return

    const edocSearchInput = {
      parent_table: 'BKG',
      related_key: inputData.value.pk,
    }

    edocTableLoading.value = true
    try {
      const response = await edocSearch(edocSearchInput)
      if (response && response.success) {
        edocList.value = response.data.list ?? []
      }
    } catch (error) {
      console.log(error)
    } finally {
      edocTableLoading.value = false
    }
  }

  const handlePageChange = page => {
    currentPage.value = page
  }

  const handleItemsPerPageChange = itemsPerPageValue => {
    itemsPerPage.value = itemsPerPageValue
    currentPage.value = 1
  }

  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    console.log('EDoc details:', item)
  }

  const handleClear = () => {
    console.log('Clearing files')
  }

  const handleUpload = async uploadData => {
    const { files, docType, jobNumber: relatedKey } = uploadData

    if (!files || files.length === 0) {
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
      // 构建 FormData
      const formData = new FormData()
      formData.append('file', files[0].file)
      formData.append('parent_table', 'BKG')
      formData.append('file_type', docType)
      formData.append('ref_no', relatedKey || inputData.value.pk)

      const result = await edocSave(formData)

      if (result && result.success) {
        appStore.openMessage({
          content: 'Upload successful',
          color: 'success',
        })
        // 查询数据
        await edocFetchData()
        showUpload.value = false
      }
    } catch (error) {
      console.error('Upload error:', error)
      appStore.openMessage({
        content: `Upload failed: ${error.message || error}`,
        color: 'error',
      })
    }
  }

  // Watch for inputData.pk changes and fetch data
  watch(
    () => activedTab.value,
    newVal => {
      if (newVal === 3) {
        edocFetchData()
      }
    },
    { immediate: true },
  )

  const onDownloadFile = async item => {
    try {
      const blob = await edocDownloadFiles({
        ...item,
      })
      const url = window.URL.createObjectURL(blob) // 创建一个对象 URL
      const a = document.createElement('a') // 创建一个链接元素
      a.style.display = 'none' // 隐藏链接
      a.href = url // 设置链接的 href 属性
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.download = item.file_name
      document.body.append(a) // 将链接添加到 DOM 中
      a.click() // 模拟点击链接
      window.URL.revokeObjectURL(url) // 释放对象 URL
      a.remove() //
      appStore.openMessage({
        content: t('$vuetify.custom.app.downloadSnackText', item.file_name),
        color: 'success',
      })
    } catch (error) {
      console.log(error)
    } finally {
      //
    }
  }
  const openInNewTab = url => {
    const a = document.createElement('a')
    a.href = import.meta.env.VITE_APP_BASE_API + url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.append(a)
    a.click()
    a.remove()
  }
</script>
