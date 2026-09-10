import { useLocale } from 'vuetify'

export function useBookingPageI18n() {
  const { t } = useLocale()
  const bp = path => t(`$vuetify.custom.bookingPage.${path}`)
  const list = key => bp(`list.${key}`)
  const tableHeader = key => bp(`list.tableHeaders.${key}`)
  const menu = key => bp(`list.menu.${key}`)
  const edit = key => bp(`edit.${key}`)
  const editButton = key => bp(`edit.button.${key}`)
  const editDialog = (name, key) => bp(`edit.dialog.${name}.${key}`)
  const editMessage = key => bp(`edit.message.${key}`)
  const editTab = key => bp(`edit.tab.${key}`)
  const detailSection = key => bp(`edit.detail.section.${key}`)
  const detailField = key => bp(`edit.detail.field.${key}`)
  const cutOffLabel = key => bp(`edit.detail.cutOff.${key}`)
  const containerHeader = key => bp(`edit.detail.containerHeaders.${key}`)
  const addrTable = key => bp(`edit.addrTable.${key}`)
  const eDocs = key => bp(`edit.shared.eDocs.${key}`)
  const logs = key => bp(`edit.shared.logs.${key}`)
  const freightStep = key => bp(`edit.freightSteps.${key}`)
  const listStatus = key => bp(`list.listStatus.${key}`)

  return {
    t,
    bp,
    list,
    tableHeader,
    menu,
    edit,
    editButton,
    editDialog,
    editMessage,
    editTab,
    detailSection,
    detailField,
    cutOffLabel,
    containerHeader,
    addrTable,
    eDocs,
    logs,
    freightStep,
    listStatus,
  }
}
