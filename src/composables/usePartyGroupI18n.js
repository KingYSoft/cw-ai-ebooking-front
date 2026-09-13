import { useLocale } from 'vuetify'
export function usePartyGroupI18n() {
  const { t } = useLocale()
  return { t: (key, ...args) => t(`$vuetify.custom.partyGroup.${key}`, ...args) }
}
