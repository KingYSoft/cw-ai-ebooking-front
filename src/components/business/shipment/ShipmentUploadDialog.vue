<template>
  <v-dialog v-model="dialogVisible" max-width="500" persistent>
    <v-card :disabled="loading" :loading="loading" prepend-icon="mdi-alert-circle" :title="title">
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <template #append>
        <v-btn
          color="red"
          density="comfortable"
          icon="mdi-close"
          size="small"
          variant="tonal"
          @click="closeDialog"
        />
      </template>

      <v-form class="ref-form-pre">
        <v-card-text class="pb-2">
          <div class="mt-1 d-flex flex-column flex-wrap ga-1">
            <v-file-input
              v-model="selectedFiles"
              :accept="accept"
              clearable
              density="comfortable"
              hide-details
              :label="label"
              show-size
              :truncate-length="40"
              variant="underlined"
              @click:clear="handleClear"
              @update:model-value="handleUpdateModelValue"
            />

            <slot />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn :text="t('$vuetify.custom.dialog.btn.cancel')" @click="closeDialog" />

          <v-btn
            color="primary"
            :disabled="!hasSelectedFiles"
            :text="t('$vuetify.custom.dialog.btn.ok')"
            variant="tonal"
            @click="handleUpload"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useLocale } from 'vuetify'

  /** v-file-input 单文件时可能是 File，多选时为 File[] */
  function normalizeSelectedFiles(value) {
    if (!value) {
      return []
    }
    return Array.isArray(value) ? value.filter(Boolean) : [value]
  }

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Upload Po Excel',
    },
    label: {
      type: String,
      default: 'Select Po Excel',
    },
    accept: {
      type: String,
      default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'upload'])

  const { t } = useLocale()
  const dialogVisible = ref(props.modelValue)

  watch(
    () => props.modelValue,
    newValue => {
      dialogVisible.value = newValue
      if (newValue) {
        selectedFiles.value = null
        selectedFilesOld.value = null
      }
    },
  )

  watch(dialogVisible, newValue => {
    emit('update:modelValue', newValue)
  })

  const selectedFiles = ref(null)
  const selectedFilesOld = ref(null)

  const hasSelectedFiles = computed(() => normalizeSelectedFiles(selectedFiles.value).length > 0)

  const closeDialog = () => {
    dialogVisible.value = false
  }

  const handleClear = () => {
    selectedFilesOld.value = null
    selectedFiles.value = null
  }

  const handleUpdateModelValue = newValue => {
    if (newValue) {
      selectedFilesOld.value = selectedFiles.value
    } else if (selectedFilesOld.value) {
      selectedFiles.value = selectedFilesOld.value
    }
  }

  const handleUpload = () => {
    const files = normalizeSelectedFiles(selectedFiles.value)
    if (files.length === 0) {
      return
    }
    emit('upload', { files })
    closeDialog()
  }
</script>
