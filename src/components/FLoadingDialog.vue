<template>
  <v-dialog max-width="280" :model-value="diaVis" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item :prepend-icon="icon" :title="title">
        <template #prepend>
          <div class="pe-2">
            <v-icon :color="color" size="24" />
          </div>
        </template>

        <template #append>
          <v-progress-circular color="primary" indeterminate="disable-shrink" size="18" width="2" />
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup>
  defineOptions({
    name: 'FLoadingDialog',
  })
  const props = defineProps({
    diaVis: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Loading...',
    },
    icon: {
      type: String,
      default: '$vuetify-outline',
    },
    color: {
      type: String,
      default: 'primary',
    },
  })
  const { diaVis, title, icon, color } = toRefs(props)
</script>
