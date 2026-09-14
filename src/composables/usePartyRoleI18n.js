import { useLocale } from 'vuetify'

export function usePartyRoleI18n() {
  const { t } = useLocale()
  return { t: (key, ...args) => t(`$vuetify.custom.partyRole.${key}`, ...args) }
}
