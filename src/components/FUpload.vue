<template>
  <div class="f-upload ref-form-pre">
    <!-- 顶部输入区域 -->
    <v-row v-if="showConfig" dense>
      <v-col :cols="rescols(cols)">
        <div class="d-flex align-center ga-1">
          <v-select
            v-model="selectedJobType"
            auto-select-first
            autocomplete="off"
            density="compact"
            :disabled="!!jobType"
            hide-details
            item-title="title"
            item-value="value"
            :items="jobTypes"
            :list-props="{
              density: 'compact',
            }"
            max-width="120"
            :menu-props="{
              'max-width': 'auto',
            }"
            min-width="120"
            no-filter
            variant="underlined"
            width="120"
          />

          <v-text-field
            v-model="jobNumber"
            density="compact"
            :disabled="readonly"
            hide-details
            :label="jobNumberLabel"
            style="min-width: 150px"
            variant="outlined"
          />
        </div>
      </v-col>

      <v-col :cols="rescols(cols)">
        <v-select
          v-model="docType"
          class="doc-type-select"
          density="compact"
          hide-details
          :items="docTypes"
          :placeholder="t('$vuetify.custom.upload.fields.docType')"
          variant="outlined"
        >
          <template #prepend>
            <div class="text-caption text-end w-label">
              {{ t('$vuetify.custom.upload.fields.docType') }}:
            </div>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row v-if="showConfig && showEbookingVisible" dense>
      <v-col cols="12">
        <v-checkbox
          v-model="isEbookingVisible"
          color="primary"
          density="compact"
          hide-details
          :label="t('$vuetify.custom.upload.fields.ebookingVisible')"
        />
      </v-col>
    </v-row>

    <!-- 拖拽上传区域 -->
    <div
      class="upload-dropzone"
      :class="{ dragover: isDragover }"
      @dragleave.prevent="onDragLeave"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
    >
      <div class="dropzone-content">
        <v-icon color="primary" size="48">mdi-arrow-right-box</v-icon>
        <h3 class="dropzone-title">{{ t('$vuetify.custom.upload.dropZone.title') }}</h3>
        <p class="dropzone-subtitle">{{ t('$vuetify.custom.upload.dropZone.subtitle') }}</p>

        <v-btn class="browse-button" color="primary" variant="outlined" @click="triggerFileInput">
          <v-icon left>mdi-folder-open</v-icon>
          {{ t('$vuetify.custom.upload.buttons.browse') }}
        </v-btn>
      </div>

      <input
        ref="fileInput"
        :accept="accept"
        class="file-input"
        :multiple="maxFiles > 1"
        title=""
        type="file"
        @change="onFileChange"
      >
    </div>

    <!-- 已选文件列表 -->
    <div v-if="files.length > 0" class="selected-files-list">
      <v-list class="files-list" density="compact">
        <v-list-item
          v-for="(file, index) in files"
          :key="file.id"
          class="file-item"
          density="comfortable"
        >
          <template #prepend>
            <v-icon :color="getFileIconColor(file.name)" size="20">
              {{ getFileIcon(file.name) }}
            </v-icon>
          </template>

          <v-list-item-title class="file-name">{{ file.name }}</v-list-item-title>

          <v-list-item-subtitle class="file-size">{{
            formatFileSize(file.size)
          }}</v-list-item-subtitle>

          <template #append>
            <v-btn density="compact" icon size="small" variant="text" @click="removeFile(index)">
              <v-icon color="error" size="16">mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- 底部操作栏 -->
    <div class="upload-footer">
      <div class="file-count">
        <div v-if="maxFiles > 1">
          <v-icon size="16">mdi-file-document</v-icon>

          <span>
            {{ t('$vuetify.custom.upload.fileCount') }} {{ files.length }} / {{ maxFiles }}
          </span>
        </div>
      </div>

      <div class="upload-actions">
        <v-btn
          class="clear-button"
          :disabled="files.length === 0"
          variant="text"
          @click="clearFiles"
        >
          <v-icon left>mdi-trash-can</v-icon>
          {{ t('$vuetify.custom.upload.buttons.clear') }}
        </v-btn>

        <v-btn
          class="upload-button"
          color="primary"
          :disabled="files.length === 0"
          variant="flat"
          @click="handleUpload"
        >
          <v-icon left>mdi-upload</v-icon>
          {{ uploadButtonText }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useLocale } from 'vuetify'
  import { useLayoutCols } from '@/composables/useLayoutCols'

  const { t } = useLocale()
  const { rescols } = useLayoutCols()

  const props = defineProps({
    maxFiles: {
      type: Number,
      default: 20,
    },
    accept: {
      type: String,
      default: '*',
    },
    uploadButtonText: {
      type: String,
      default: '模拟上传',
    },
    jobTypes: {
      type: Array,
      default: () => [],
    },
    docTypes: {
      type: Array,
      default: () => [
        { title: 'PKL', value: 'PKL' },
        { title: 'CIV', value: 'CIV' },
        { title: 'INV', value: 'INV' },
        { title: 'HBL', value: 'HBL' },
        { title: 'MBL', value: 'MBL' },
        { title: 'SOC', value: 'SOC' },
      ],
    },
    jobType: {
      type: String,
      default: '',
    },
    jobNumber: {
      type: String,
      default: '',
    },
    readonly: { type: Boolean, default: false },
    cols: {
      type: String,
      default: 'c12m4',
    },
    showConfig: {
      type: Boolean,
      default: true,
    },
    showEbookingVisible: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['upload', 'clear', 'file-added', 'file-removed'])

  const fileInput = ref(null)
  const isDragover = ref(false)
  const files = ref([])
  const docType = ref('')
  const isEbookingVisible = ref(false)
  const selectedJobType = ref(props.jobType || 'BKG')
  const jobNumber = ref(props.jobNumber || '')

  // 监听 props 变化，更新固定值
  watch(
    () => props.jobType,
    val => {
      if (val) selectedJobType.value = val
    },
    { immediate: true },
  )

  watch(
    () => props.jobNumber,
    val => {
      if (val) jobNumber.value = val
    },
    { immediate: true },
  )

  const jobTypes = computed(() => {
    if (props.jobTypes && props.jobTypes.length > 0) {
      return props.jobTypes
    }
    return [
      { title: 'Booking', value: 'BKG' },
      { title: 'Shipment', value: 'SHP' },
      { title: 'Consolidation', value: 'CON' },
    ]
  })

  const jobNumberLabel = computed(() => {
    switch (selectedJobType.value) {
      case 'BKG': {
        return 'Booking Number'
      }
      case 'SHP': {
        return 'Shipment Number'
      }
      case 'CON': {
        return 'Consolidation Number'
      }
      default: {
        return 'Job Number'
      }
    }
  })

  const onDragOver = () => {
    isDragover.value = true
  }

  const onDragLeave = () => {
    isDragover.value = false
  }

  const onDrop = event => {
    isDragover.value = false
    const droppedFiles = Array.from(event.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const onFileChange = event => {
    const selectedFiles = Array.from(event.target.files)
    addFiles(selectedFiles)
    // 重置 input 以允许选择相同的文件
    event.target.value = ''
  }

  const addFiles = newFiles => {
    const acceptedFiles = newFiles.filter(file => isAcceptedFile(file))

    if (acceptedFiles.length === 0) {
      return
    }

    const filesToAdd =
      props.maxFiles === 1
        ? acceptedFiles.slice(0, 1)
        : acceptedFiles.slice(0, props.maxFiles - files.value.length)

    if (props.maxFiles === 1) {
      files.value = []
    }

    filesToAdd.forEach(file => {
      files.value.push({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        file: file,
      })
      emit('file-added', file)
    })
  }

  const clearFiles = () => {
    files.value = []
    docType.value = ''
    selectedJobType.value = props.jobType || 'BKG'
    jobNumber.value = ''
    emit('clear')
  }

  const removeFile = index => {
    const removedFile = files.value[index]
    files.value.splice(index, 1)
    emit('file-removed', removedFile)
  }

  const getFileIcon = fileName => {
    const ext = fileName.split('.').pop().toLowerCase()
    const iconMap = {
      pdf: 'mdi-file-pdf-box',
      doc: 'mdi-file-word-box',
      docx: 'mdi-file-word-box',
      xls: 'mdi-file-excel-box',
      xlsx: 'mdi-file-excel-box',
      ppt: 'mdi-file-powerpoint-box',
      pptx: 'mdi-file-powerpoint-box',
      jpg: 'mdi-file-image-box',
      jpeg: 'mdi-file-image-box',
      png: 'mdi-file-image-box',
      gif: 'mdi-file-image-box',
      zip: 'mdi-file-archive-box',
      rar: 'mdi-file-archive-box',
      txt: 'mdi-file-document-box',
    }
    return iconMap[ext] || 'mdi-file-box'
  }

  const getFileIconColor = fileName => {
    const ext = fileName.split('.').pop().toLowerCase()
    const colorMap = {
      pdf: 'red',
      doc: 'blue',
      docx: 'blue',
      xls: 'green',
      xlsx: 'green',
      ppt: 'orange',
      pptx: 'orange',
      jpg: 'purple',
      jpeg: 'purple',
      png: 'purple',
      gif: 'purple',
      zip: 'brown',
      rar: 'brown',
    }
    return colorMap[ext] || 'grey'
  }

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isAcceptedFile = file => {
    if (!props.accept || props.accept === '*') {
      return true
    }

    const acceptedTypes = props.accept
      .split(',')
      .map(item => item.trim().toLowerCase())
      .filter(Boolean)

    if (acceptedTypes.length === 0) {
      return true
    }

    const fileName = file.name.toLowerCase()
    const fileType = (file.type || '').toLowerCase()

    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type)
      }

      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -1)
        return fileType.startsWith(prefix)
      }

      return fileType === type
    })
  }

  const handleUpload = () => {
    if (files.value.length === 0) return

    emit('upload', {
      files: files.value,
      docType: docType.value,
      jobType: selectedJobType.value,
      jobNumber: jobNumber.value,
      is_ebooking_visible: Boolean(isEbookingVisible.value),
    })
  }

  defineExpose({
    clearFiles,
    addFiles,
    files,
  })
</script>

<style lang="scss" scoped>
  .f-upload {
    border: 1px dashed #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
  }

  .upload-dropzone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin-top: 12px;
    padding: 40px 20px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    background-color: white;

    &.dragover {
      border-color: #1976d2;
      background-color: rgba(25, 118, 210, 0.05);
    }

    .dropzone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .dropzone-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }

    .dropzone-subtitle {
      color: #666;
      margin: 0;
    }

    .browse-button {
      margin-top: 8px;
    }

    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }

  .upload-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    flex-wrap: wrap;
    gap: 10px;

    .file-count {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .upload-actions {
      display: flex;
      gap: 10px;
    }
  }

  .selected-files-list {
    margin-top: 16px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;

    .files-list {
      padding: 0;
    }

    .file-item {
      border-bottom: 1px solid #f0f0f0;
      min-height: 48px;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #fafafa;
      }

      .file-name {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 300px;
      }

      .file-size {
        font-size: 12px;
        color: #999;
      }

      .v-list-item__append {
        margin-left: auto;
      }
    }
  }

  @media (max-width: 768px) {
    .upload-footer {
      flex-direction: column;
      align-items: stretch;

      .upload-actions {
        justify-content: center;
      }
    }
  }
</style>
