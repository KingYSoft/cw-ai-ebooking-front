import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useLocale } from 'vuetify'
import {
  bookingConvertToShipment,
  bookingQueryPortCode,
  bookingSave,
  bookingTbl,
  userQueryAll,
} from '@/api/booking'
import { debounceFn } from '@/api/utils'
import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
import { useAppStore } from '@/stores/app'

export function useBookingForm(options = {}) {
  const { isEditMode = false, detailLoader = null, saveLoader = null } = options
  const OCR_BOOKING_STORAGE_KEY = 'booking_ocr_prefill'

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { t } = useLocale()
  const display = useDisplay()

  const contentHeight = computed(() => {
    return display.height.value - 65 - 35
  })
  const maxHeight = computed(() => {
    return contentHeight.value - 12 - 48 - 14
  })

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const activedTab = ref(1)
  const bookingEmptyVis = ref(false)

  const defaultData = () => ({
    id: 0,
    pk: '',
    bkg_transport_mode: 'SEA',
    bkg_packing_mode: 'FCL',
    shipper: {},
    consignee: {},
    notify_party: {
      add_address_name: 'SAME AS CONSIGNEE',
    },
    pickup: {},
    delivery: {},
    pac_list: [],
    inbound_list: [],
    outbound_list: [],
    eDocs_list: [],
    bkg_unit_of_weight: 'KG',
    bkg_actual_chargeable_unit: 'KG',
    bkg_volume_weight_unit: 'KG',
    bkg_unit_of_volume: 'M3',
    bkg_transit_time_unit: 'DAYS',
    bkg_pack_type: 'CTN',
    bkg_pack_type_desc: 'Carton',
    notify_party_same_as_consignee: 'Y',
    bkg_so_number: '',
    bkg_po_number: '',
    job: {},
    bkg_actual_chargeable: null,
    bkg_volume_weight: null,
  })

  const applyBookingInput = el => {
    if (!el || typeof el !== 'object') {
      inputData.value = defaultData()
      return
    }

    inputData.value = Object.assign({}, defaultData(), el, {
      pk: el.pk ?? '',
      shipper: el.shipper || {},
      consignee: el.consignee || {},
      notify_party: el.notify_party || {},
      pickup: el.pickup || {}, // address
      delivery: el.delivery || {}, // address
      pac_list: el.pac_list || [],
      inbound_list: el.inbound_list || [],
      outbound_list: el.outbound_list || [],
      eDocs_list: el.eDocs_list || [],
      bkg_delivery_mode: el.bkg_delivery_mode ?? el.bkg_delivery_model ?? '',
      bkg_unit_of_weight: el.bkg_unit_of_weight || 'KG',
      bkg_unit_of_volume: el.bkg_unit_of_volume || 'M3',
      bkg_actual_chargeable_unit: el.bkg_actual_chargeable_unit || 'KG',
      bkg_volume_weight_unit: el.bkg_volume_weight_unit || 'KG',
      bkg_pack_type: el.bkg_pack_type || 'CTN',
      bkg_pack_type_desc: el.bkg_pack_type_desc || 'Carton',
      bkg_transit_time_unit: el.bkg_transit_time_unit || 'DAYS',
      pickup_name: el.pickup_name ?? el.bkg_place_of_receipt_name ?? '',
      pickup_code: el.pickup_code ?? el.bkg_place_of_receipt ?? '',
      delivery_name: el.delivery_name ?? el.bkg_place_of_delivery_name ?? '',
      delivery_code: el.delivery_code ?? el.bkg_place_of_delivery ?? '',
      job: el.job || {},
    })
    if (inputData.value.notify_party.add_address_name === 'SAME AS CONSIGNEE') {
      inputData.value.notify_party_same_as_consignee = 'Y'
    } else {
      inputData.value.notify_party_same_as_consignee = 'N'
    }
  }

  const inputData = ref(defaultData())
  // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)
  const inputDataRules = {
    shipper_name: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.shipper_name.err')
        }
      },
    ],
    consignee_name: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.consignee_name.err')
        }
      },
    ],
    bkg_transport_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_transport_mode.err')
        }
      },
    ],
    bkg_packing_mode: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_packing_mode.err')
        }
      },
    ],
    bkg_origin: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_origin.err')
        }
      },
    ],
    bkg_destination: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_destination.err')
        }
      },
    ],
    bkg_load_port: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_load_port.err')
        }
      },
    ],
    bkg_etd: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_etd.err')
        }
      },
    ],
    bkg_cargo_ready: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_cargo_ready.err')
        }
      },
    ],
    bkg_actual_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_actual_weight.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_weight.err')
          }
        }
      },
    ],
    bkg_actual_volume: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_actual_volume.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_volume.err')
          }
        }
      },
    ],
    bkg_volume_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_volume_weight.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_volume_weight.err')
          }
        }
      },
    ],
    bkg_actual_chargeable: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_actual_chargeable.err')
        } else {
          if (value && appStore.utils.testFloat(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_actual_chargeable.err')
          }
        }
      },
    ],
    bkg_total_package_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_total_package_count.err')
        } else {
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.bkg_total_package_count.err')
          }
        }
      },
    ],
    bkg_inco: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_inco.err')
        }
      },
    ],
    bkg_transit_time: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_transit_time.err')
        } else {
          if (value) {
            if (appStore.utils.testInt(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_transit_time.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_goods_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_goods_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_insurance_value: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.bkg_insurance_value.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    bkg_freight_terms: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_freight_terms.err')
        }
      },
    ],
    bkg_release_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_release_type.err')
        }
      },
    ],
    bkg_commodity: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_commodity.err')
        }
      },
    ],
    bkg_goods_description: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_goods_description.err')
        }
      },
    ],
    bkg_marks_nos: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.bkg_marks_nos.err')
        }
      },
    ],
    pac_container_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.pac_container_type.err')
        }
      },
    ],
    pac_container_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_container_count.err')
        } else {
          // 必填
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.pac_container_count.err')
          }
        }
      },
    ],
    pac_package_count: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_package_count.err')
        } else {
          // 必填
          if (value && appStore.utils.testInt(value)) {
            return true
          } else {
            return t('$vuetify.custom.bookingPage.form.pac_package_count.err')
          }
        }
      },
    ],
    pac_pack_type: [
      value => {
        if (value) {
          return true
        } else {
          return t('$vuetify.custom.bookingPage.form.pac_pack_type.err')
        }
      },
    ],
    pac_gross_weight: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_gross_weight.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.pac_gross_weight.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
    pac_actual_volume: [
      value => {
        if (value === '0' || value === 0) {
          return t('$vuetify.custom.bookingPage.form.pac_actual_volume.err')
        } else {
          if (value) {
            if (appStore.utils.testFloat(value)) {
              return true
            } else {
              return t('$vuetify.custom.bookingPage.form.pac_actual_volume.err')
            }
          } else {
            // 非必填
            return true
          }
        }
      },
    ],
  }
  const formRefs = ref([])
  const registerFormRefs = el => {
    if (!el) {
      return
    }
    if (!formRefs.value.includes(el)) {
      formRefs.value.push(el)
    }
  }

  const validateAll = async () => {
    for (const refDataForm of formRefs.value) {
      const { valid, errors } = await refDataForm.validate()
      if (!valid) {
        let errList = []
        if (errors && errors.length > 0) {
          const err = []
          for (let i = 0; i < errors.length; i++) {
            const e = errors[i]
            const msg =
              e.errorMessages && e.errorMessages.length > 0
                ? e.errorMessages[0]
                : 'data valid fail.'

            if (e.id.indexOf('@') >= 0) {
              const tab = e.id.split('@')[0]
              if (!Number.isNaN(Number(tab)) && Number(tab) > 0) {
                err.push({ tab: Number(tab), msg })
              }
            } else {
              err.push({ tab: 1, msg })
            }
          }
          if (err.length > 0) {
            errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
          }
        }
        if (errList.length > 0) {
          activedTab.value = errList[0].tab
          appStore.openMessage({
            content: errList[0].msg,
            color: 'error',
          })
        } else {
          appStore.openMessage({
            content: 'data valid fail.',
            color: 'error',
          })
        }
        return false
      }
    }
    return true
  }

  const queryData = async (pk, id) => {
    try {
      cardLoading.value = true

      if (isEditMode && pk) {
        if (typeof detailLoader === 'function') {
          const { success, data } = await detailLoader(pk, id)
          skeletonLoading.value = false
          if (success && data) {
            applyBookingInput(data)
            if (String(route.query.copy ?? '') === '1') {
              inputData.value.id = 0
              inputData.value.pk = ''
              inputData.value.bkg_is_forward_registered = 0
            }
          } else {
            bookingEmptyVis.value = true
          }
        } else if (id) {
          const { success, data } = await bookingTbl({
            filters: [
              { key: 'id', op: '=', val: id },
              { key: 'pk', op: '=', val: pk },
            ],
          })
          skeletonLoading.value = false
          if (success) {
            if (data && data.items && data.items.length > 0) {
              applyBookingInput(data.items[0])
              if (String(route.query.copy ?? '') === '1') {
                inputData.value.id = 0
                inputData.value.pk = ''
                inputData.value.bkg_is_forward_registered = 0
              }
            } else {
              bookingEmptyVis.value = true
            }
          }
        } else {
          skeletonLoading.value = false
        }
      } else {
        skeletonLoading.value = false
        if (route.query.source === 'ocr') {
          const rawOcrBooking = sessionStorage.getItem(OCR_BOOKING_STORAGE_KEY)
          console.log('rawOcrBooking:', rawOcrBooking)

          if (rawOcrBooking) {
            try {
              applyBookingInput(JSON.parse(rawOcrBooking))
            } catch (error) {
              console.error('Failed to parse OCR booking data:', error)
            } finally {
              sessionStorage.removeItem(OCR_BOOKING_STORAGE_KEY)
            }
          }
        }
      }
      markInputDataSaved()
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const onSaveHandle = async () => {
    if (checkBookingLocked()) {
      return
    }
    convertToShipmentCheck.value = false
    if (await validateAll()) {
      try {
        cardLoading.value = true
        // 根据当前 tab 调用不同的保存逻辑
        const usesWhsSave = typeof saveLoader === 'function'
        switch (activedTab.value) {
          case 1: {
            await saveBookingTab()
            break
          }
          case 2: {
            if (usesWhsSave) {
              await saveBookingTab()
            } else {
              await saveAdditionalDetailsTab()
            }
            break
          }
          case 3: {
            await saveEDocsTab()
            break
          }
          case 4: {
            if (!usesWhsSave) {
              await saveNoteTab()
            }
            break
          }
          case 5: {
            await saveLogTab()
            break
          }
          default: {
            appStore.openMessage({
              content: 'Unknown tab.',
              color: 'warning',
            })
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        cardLoading.value = false
      }
    }
  }

  const resolveConsignNo = data =>
    data?.wso_consign_no ?? data?.bkg_consign_no ?? data?.shipment_no ?? ''

  const saveBookingTab = async () => {
    const isCopyAsNew = String(route.query.copy ?? '') === '1'
    const { success, data } =
      typeof saveLoader === 'function'
        ? await saveLoader(inputData.value, { isCopyAsNew })
        : await bookingSave(
            (() => {
              const payload = { ...inputData.value }
              if (isEditMode && isCopyAsNew) {
                delete payload.id
                delete payload.pk
              }
              return payload
            })(),
          )

    if (success && data) {
      markInputDataSaved()
      appStore.openMessage({
        content: t('$vuetify.custom.app.saveSuccess'),
        color: 'success',
      })

      const consignNo = resolveConsignNo(data)
      const usesWhsSave = typeof saveLoader === 'function'

      if (isEditMode && isCopyAsNew) {
        const oldPk = route.params.pk?.toString()
        const editRouteName = usesWhsSave ? 'warehouse_booking_edit-pk' : 'booking_edit-pk'
        const tabPrefix = usesWhsSave ? 'WHS-' : 'BK-'
        await router.replace({
          name: editRouteName,
          params: { pk: data.pk },
          query: { id: data.id, shipment_no: consignNo },
        })
        if (!usesWhsSave) {
          appStore.event.trigger('replaceBookingEditTab', {
            oldTabValue: `booking_edit-pk-${oldPk}`,
            newTabValue: `booking_edit-pk-${data.pk}`,
            title: `${tabPrefix}${consignNo}`,
            to: {
              name: editRouteName,
              params: { pk: data.pk },
              query: { id: data.id, shipment_no: consignNo },
            },
            params: { pk: data.pk },
            query: { id: data.id, shipment_no: consignNo },
          })
        }
        return
      }

      inputData.value.id = data.id ?? 0
      inputData.value.pk = data.pk
      markInputDataSaved()

      if (isEditMode) {
        await queryData(route.params.pk?.toString(), route.query.id)
      } else if (usesWhsSave) {
        await router.push({
          name: 'warehouse_booking_edit-pk',
          params: { pk: data.pk },
          query: { id: data.id, shipment_no: consignNo },
        })
      } else {
        inputData.value = defaultData()
        markInputDataSaved()
        await router.push({
          name: 'booking_edit-pk',
          params: { pk: data.pk },
          query: { id: data.id, shipment_no: consignNo },
        })
      }
    }
  }

  const saveAdditionalDetailsTab = async () => {
    await saveBookingTab()
  }

  const saveEDocsTab = async () => {
    await saveBookingTab()
  }

  const saveNoteTab = async () => {
    await saveBookingTab()
  }

  const saveLogTab = async () => {
    await saveBookingTab()
  }
  const checkBookingLocked = () => {
    if (String(route.query.copy ?? '') === '1') {
      return false
    }

    if (Number(inputData.value.bkg_is_forward_registered) === 1) {
      appStore.openMessage({
        content: `Booking ${inputData.value.bkg_consign_no} is locked.`,
        color: 'error',
      })
      return true
    } else {
      return false
    }
  }
  const convertToShipmentDiaVis = ref(false)
  const convertIsCreateConsol = ref('Y')
  const onConfirmConvertToShipmentHandle = async () => {
    convertToShipmentCheck.value = true
    if (!(await validateAll())) {
      return
    }
    cardLoading.value = true
    try {
      const res = await bookingSave({ ...inputData.value })
      if (res && res.success && res.data) {
        inputData.value.id = res.data.id ?? 0
        inputData.value.pk = res.data.pk
      }
      const { success, data } = await bookingConvertToShipment({
        id: inputData.value.id,
        pk: inputData.value.pk,
        is_create_consol: convertIsCreateConsol.value,
      })
      if (success && data) {
        appStore.openMessage({
          content: 'Convert to Shipment success.',
          color: 'success',
        })
        convertToShipmentDiaVis.value = false
        // 跳转到新页面，假设返回的数据中包含 shipmentId 和 shipmentPk
        const shipmentId = data.id
        const shipmentPk = data.pk
        const shp_consign_no = data.shp_consign_no
        if (shipmentId && shipmentPk) {
          router.push({
            name: 'shipment_edit-pk',
            params: { pk: shipmentPk },
            query: { id: shipmentId, shipment_no: shp_consign_no },
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }
  const onCloseConvertToShipmentDiaVis = () => {
    convertToShipmentDiaVis.value = false
  }
  const convertToShipmentCheck = ref(false)
  const onOpenConvertToShipmentHandle = async () => {
    try {
      if (checkBookingLocked()) {
        return
      }
      convertToShipmentCheck.value = true
      if (await validateAll()) {
        convertToShipmentDiaVis.value = true
      }
    } catch (error) {
      console.log(error)
    } finally {
      // convertToShipmentCheck.value = false
    }
  }

  const queryPortList = ref([])
  const queryPort = debounceFn(async (code, signal) => {
    try {
      const { data } = await bookingQueryPortCode(
        {
          query: code,
        },
        signal,
      )
      if (data) {
        queryPortList.value = data.list ?? []
      }
    } catch (error) {
      console.log(error)
    } finally {
      //
    }
  })
  const queryAllUserList = ref([])
  const queryAllUser = debounceFn(async (query, signal) => {
    try {
      const { data } = await userQueryAll(
        {
          query,
        },
        signal,
      )
      if (data) {
        queryAllUserList.value = data.list ?? []
      }
    } catch (error) {
      console.log(error)
    } finally {
      //
    }
  })

  const orgAddressDialog = ref(false)
  const orgAddressInput = ref({})
  const orgAddressType = ref('')
  const orgAddressSaving = ref(false)

  // const onNewHandle = addressType => {
  //   orgAddressInput.value = {
  //     code: '',
  //     short_code: '',
  //     company_name: '',
  //     address_type: addressType,
  //     address1: '',
  //     address2: '',
  //     address3: '',
  //     city: '',
  //     state: '',
  //     postal_code: '',
  //     country_code: '',
  //     contact: '',
  //     phone: '',
  //     fax: '',
  //     email: '',
  //   }
  //   orgAddressType.value = addressType
  //   orgAddressDialog.value = true
  // }

  // const onSelectAddr = (row, addressType) => {
  //   if (!row || typeof row !== 'object') {
  //     return
  //   }
  //   if (addressType === 'SHIPPER') {
  //     if (!inputData.value.shipper || typeof inputData.value.shipper !== 'object') {
  //       inputData.value.shipper = {}
  //     }
  //     inputData.value.shipper.add_address_type = row.address_type
  //     inputData.value.shipper.add_address_short_code = row.short_code
  //     inputData.value.shipper.add_address_code = row.code
  //     inputData.value.shipper.add_address_name = row.company_name
  //     inputData.value.shipper.add_address = row.pk
  //     inputData.value.shipper.add_address1 = row.address1
  //     inputData.value.shipper.add_address2 = row.address2
  //     inputData.value.shipper.add_address3 = row.address3
  //     inputData.value.shipper.add_contact = row.contact
  //     inputData.value.shipper.add_city = row.city
  //     inputData.value.shipper.add_state = row.state
  //     inputData.value.shipper.add_postal_code = row.postal_code
  //     inputData.value.shipper.add_country_code = row.country_code
  //     inputData.value.shipper.add_phone = row.phone
  //     inputData.value.shipper.add_mobile = row.mobile
  //     inputData.value.shipper.add_fax = row.fax
  //     inputData.value.shipper.add_email = row.email
  //     inputData.value.shipper.add_port_code = row.port_code
  //   } else if (addressType === 'CONSIGNEE') {
  //     if (!inputData.value.consignee || typeof inputData.value.consignee !== 'object') {
  //       inputData.value.consignee = {}
  //     }
  //     inputData.value.consignee.add_address_type = row.address_type
  //     inputData.value.consignee.add_address_short_code = row.short_code
  //     inputData.value.consignee.add_address_code = row.code
  //     inputData.value.consignee.add_address_name = row.company_name
  //     inputData.value.consignee.add_address = row.pk
  //     inputData.value.consignee.add_address1 = row.address1
  //     inputData.value.consignee.add_address2 = row.address2
  //     inputData.value.consignee.add_address3 = row.address3
  //     inputData.value.consignee.add_contact = row.contact
  //     inputData.value.consignee.add_city = row.city
  //     inputData.value.consignee.add_state = row.state
  //     inputData.value.consignee.add_postal_code = row.postal_code
  //     inputData.value.consignee.add_country_code = row.country_code
  //     inputData.value.consignee.add_phone = row.phone
  //     inputData.value.consignee.add_mobile = row.mobile
  //     inputData.value.consignee.add_fax = row.fax
  //     inputData.value.consignee.add_email = row.email
  //     inputData.value.consignee.add_port_code = row.port_code
  //   } else if (addressType === 'PICKUP') {
  //     if (!inputData.value.pickup || typeof inputData.value.pickup !== 'object') {
  //       inputData.value.pickup = {}
  //     }
  //     inputData.value.pickup.add_address_type = row.address_type
  //     inputData.value.pickup.add_address_short_code = row.short_code
  //     inputData.value.pickup.add_address_code = row.code
  //     inputData.value.pickup.add_address_name = row.company_name
  //     inputData.value.pickup.add_address = row.pk
  //     inputData.value.pickup.add_address1 = row.address1
  //     inputData.value.pickup.add_address2 = row.address2
  //     inputData.value.pickup.add_address3 = row.address3
  //     inputData.value.pickup.add_contact = row.contact
  //     inputData.value.pickup.add_city = row.city
  //     inputData.value.pickup.add_state = row.state
  //     inputData.value.pickup.add_postal_code = row.postal_code
  //     inputData.value.pickup.add_country_code = row.country_code
  //     inputData.value.pickup.add_phone = row.phone
  //     inputData.value.pickup.add_mobile = row.mobile
  //     inputData.value.pickup.add_fax = row.fax
  //     inputData.value.pickup.add_email = row.email
  //     inputData.value.pickup.add_port_code = row.port_code
  //   } else if (addressType === 'DELIVERY') {
  //     if (!inputData.value.delivery || typeof inputData.value.delivery !== 'object') {
  //       inputData.value.delivery = {}
  //     }
  //     inputData.value.delivery.add_address_type = row.address_type
  //     inputData.value.delivery.add_address_short_code = row.short_code
  //     inputData.value.delivery.add_address_code = row.code
  //     inputData.value.delivery.add_address_name = row.company_name
  //     inputData.value.delivery.add_address = row.pk
  //     inputData.value.delivery.add_address1 = row.address1
  //     inputData.value.delivery.add_address2 = row.address2
  //     inputData.value.delivery.add_address3 = row.address3
  //     inputData.value.delivery.add_contact = row.contact
  //     inputData.value.delivery.add_city = row.city
  //     inputData.value.delivery.add_state = row.state
  //     inputData.value.delivery.add_postal_code = row.postal_code
  //     inputData.value.delivery.add_country_code = row.country_code
  //     inputData.value.delivery.add_phone = row.phone
  //     inputData.value.delivery.add_mobile = row.mobile
  //     inputData.value.delivery.add_fax = row.fax
  //     inputData.value.delivery.add_email = row.email
  //     inputData.value.delivery.add_port_code = row.port_code
  //   }
  // }

  const addNewContainer = () => {
    if (!inputData.value) {
      return
    }
    const c = {
      id: Date.now(),
      pac_package_count: inputData.value.bkg_total_package_count,
      pac_pack_type: inputData.value.bkg_pack_type,
      pac_gross_weight: inputData.value.bkg_actual_weight,
      pac_weight_unit: inputData.value.bkg_unit_of_weight,
      pac_actual_volume: inputData.value.bkg_actual_volume,
      pac_actual_volume_uom: inputData.value.bkg_unit_of_volume,
      pac_volume_weight: inputData.value.bkg_volume_weight,
      pac_volume_weight_unit: inputData.value.bkg_volume_weight_unit,
      pac_chargeable_weight: inputData.value.bkg_actual_chargeable,
      pac_chargeable_weight_unit: inputData.value.bkg_actual_chargeable_unit,
      pac_pack_type_desc: inputData.value.bkg_pack_type_desc,
    }
    inputData.value.pac_list.push(c)
  }

  const removeNewContainer = index => {
    if (!inputData.value?.pac_list) {
      return
    }
    inputData.value.pac_list.splice(index, 1)
  }

  const addNewLoose = () => {
    if (!inputData.value) {
      return
    }
    const c = {
      id: Date.now(),
      pac_package_count: inputData.value.bkg_total_package_count,
      pac_pack_type: inputData.value.bkg_pack_type,
      pac_gross_weight: inputData.value.bkg_actual_weight,
      pac_weight_unit: inputData.value.bkg_unit_of_weight,
      pac_actual_volume: inputData.value.bkg_actual_volume,
      pac_actual_volume_uom: inputData.value.bkg_unit_of_volume,
      pac_volume_weight: inputData.value.bkg_volume_weight,
      pac_volume_weight_unit: inputData.value.bkg_volume_weight_unit,
      pac_chargeable_weight: inputData.value.bkg_actual_chargeable,
      pac_chargeable_weight_unit: inputData.value.bkg_actual_chargeable_unit,
      pac_pack_type_desc: inputData.value.bkg_pack_type_desc,
    }
    inputData.value.pac_list.push(c)
  }
  const removeNewLoose = index => {
    if (!inputData.value?.pac_list) {
      return
    }
    inputData.value.pac_list.splice(index, 1)
  }
  return {
    contentHeight,
    maxHeight,
    skeletonLoading,
    cardLoading,
    activedTab,
    bookingEmptyVis,
    inputData,
    orgAddressDialog,
    orgAddressInput,
    orgAddressType,
    orgAddressSaving,
    queryPortList,
    inputDataRules,
    queryAllUserList,
    convertToShipmentDiaVis,
    convertToShipmentCheck,
    convertIsCreateConsol,
    t,
    queryPort,
    queryData,
    // onNewHandle,
    // onSelectAddr,
    addNewContainer,
    removeNewContainer,
    onSaveHandle,
    saveBookingTab,
    saveAdditionalDetailsTab,
    saveEDocsTab,
    saveNoteTab,
    saveLogTab,
    onConfirmConvertToShipmentHandle,
    onCloseConvertToShipmentDiaVis,
    onOpenConvertToShipmentHandle,
    registerFormRefs,
    addNewLoose,
    removeNewLoose,
    queryAllUser,
  }
}
