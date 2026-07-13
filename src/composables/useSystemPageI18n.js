import { useLocale } from 'vuetify'

export function useSystemPageI18n() {
  const { t } = useLocale()
  const sp = path => t(`$vuetify.custom.systemPage.${path}`)
  const common = (key, ...args) => t(`$vuetify.custom.systemPage.common.${key}`, args)
  const userList = key => sp(`user.list.${key}`)
  const userEdit = key => sp(`user.edit.${key}`)
  const userEditTab = key => sp(`user.edit.tabs.${key}`)
  const userDialog = (group, key) => sp(`user.edit.dialog.${group}.${key}`)
  const userField = key => sp(`user.edit.detail.field.${key}`)
  const userSection = key => sp(`user.edit.detail.section.${key}`)
  const groupList = key => sp(`group.list.${key}`)
  const groupEdit = key => sp(`group.edit.${key}`)
  const groupEditTab = key => sp(`group.edit.tabs.${key}`)
  const groupDialog = (group, key) => sp(`group.edit.dialog.${group}.${key}`)
  const groupField = key => sp(`group.edit.detail.field.${key}`)
  const logsList = key => sp(`logs.list.${key}`)
  const logsPreview = key => sp(`logs.preview.${key}`)
  const security = key => sp(`security.${key}`)

  return {
    t,
    sp,
    common,
    userList,
    userEdit,
    userEditTab,
    userDialog,
    userField,
    userSection,
    groupList,
    groupEdit,
    groupEditTab,
    groupDialog,
    groupField,
    logsList,
    logsPreview,
    security,
  }
}
