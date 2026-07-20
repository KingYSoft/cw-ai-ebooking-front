import { useLocale } from 'vuetify'

export function useWarehouseOrderPageI18n() {
  const { t } = useLocale()
  const wo = path => t(`$vuetify.custom.warehouseOrder.${path}`)
  const edit = key => wo(`edit.${key}`)
  const editButton = key => wo(`edit.button.${key}`)
  const editTab = key => wo(`edit.tab.${key}`)
  const editMessage = key => wo(`edit.message.${key}`)
  const editDialog = (group, key) => wo(`edit.dialog.${group}.${key}`)
  const detailSection = key => wo(`edit.detail.section.${key}`)
  const detailField = key => wo(`edit.detail.field.${key}`)
  const filter = key => wo(`filter.${key}`)
  const header = key => wo(`headers.${key}`)
  const list = key => wo(`list.${key}`)
  const relation = key => wo(`relation.${key}`)
  const addrTable = key => wo(`addrTable.${key}`)
  const itemHeader = key => wo(`itemDetail.headers.${key}`)
  const itemDetailLabel = key => wo(`edit.itemDetail.${key}`)
  const inboundHeader = key => wo(`inboundOrder.${key}`)
  const importI18n = key => wo(`import.${key}`)
  const validation = (key, ...args) =>
    t(`$vuetify.custom.warehouseOrder.edit.validation.${key}`, ...args)
  const validationField = key => wo(`edit.validationFields.${key}`)
  const requiredRule = fieldLabel => value =>
    String(value ?? '').trim() !== '' || validation('required', fieldLabel)

  return {
    t,
    wo,
    edit,
    editButton,
    editTab,
    editMessage,
    editDialog,
    detailSection,
    detailField,
    filter,
    header,
    list,
    relation,
    addrTable,
    itemHeader,
    itemDetailLabel,
    inboundHeader,
    import: importI18n,
    validation,
    validationField,
    requiredRule,
  }
}
