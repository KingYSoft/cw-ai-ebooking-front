<template>
  <v-responsive>
    <v-app>
      <v-navigation-drawer
        v-model="rightDrawerStore.diaVis"
        location="right"
        :persistent="rightDrawerStore.diaLoading"
        temporary
        width="800"
      >
        <!-- <BranchEditRightDrawer v-if="rightDrawerStore.drawerName === 'BRANCH_EDIT'" />
        <CompanyEditRightDrawer v-if="rightDrawerStore.drawerName === 'COMPANY_EDIT'" /> -->
      </v-navigation-drawer>

      <v-app-bar border="b-thin" :elevation="0">
        <v-progress-linear
          absolute
          :active="appStore.appLoading"
          bg-color="surface"
          bottom
          color="pink-lighten-1"
          :indeterminate="appStore.appLoading"
        />

        <template #prepend>
          <v-app-bar-nav-icon @click.stop="handleChangeDrawer" />
        </template>

        <v-sheet color="transparent" width="90">
          <v-img :lazy-src="logoSrc" :src="logoSrc" />
        </v-sheet>

        <v-app-bar-title>
          <span>{{ appStore.userSession.session().org_header_code }}</span>
          <span> - </span>
          <span>{{ appStore.userSession.session().org_header_name }}</span>
        </v-app-bar-title>

        <template #append>
          <!-- <FavoriteMenu v-if="showFavoriteMenu" /> -->
          <v-btn class="d-none d-sm-inline-block" icon="mdi-magnify" />
          <v-btn icon="mdi-reload" @click.stop="reloadPage" />

          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-translate" v-bind="props" />
            </template>

            <v-list min-width="120px">
              <v-list-item @click="changeAppLanguage('en')">English</v-list-item>
              <v-list-item @click="changeAppLanguage('zhHans')">中文简体</v-list-item>
              <v-list-item @click="changeAppLanguage('zhHant')">中文繁體</v-list-item>
              <v-list-item @click="changeAppLanguage('vi')">Tiếng Việt</v-list-item>
            </v-list>
          </v-menu>

          <v-btn class="d-none d-sm-inline-block" icon="mdi-bell" />

          <v-btn
            :icon="appThemeIcon === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click="changeAppTheme()"
          />

          <v-menu v-model="avatarMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <div v-bind="props" class="d-flex align-center ml-2">
                <v-avatar class="cursor-pointer" color="primary" size="default">
                  <span class="text-h6">
                    {{ appStore.userSession.nameInitials() }}
                  </span>
                </v-avatar>

                <v-list>
                  <v-list-item
                    :subtitle="appStore.userSession.session().org_header_code"
                    :title="appStore.userSession.session().full_name"
                  />
                </v-list>
              </div>
            </template>

            <v-card max-width="320px" min-width="260px">
              <v-list density="compact" lines="one">
                <v-list-item>
                  <v-list-item-title class="text-capitalize">
                    {{ appStore.userSession.session().full_name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <span>{{ appStore.userSession.session().org_header_code }}</span>
                    <span> - </span>
                    <span>{{ appStore.userSession.session().org_header_name }}</span>
                  </v-list-item-subtitle>

                  <template #prepend>
                    <v-avatar color="primary" size="default">
                      <span class="text-h6">
                        {{ appStore.userSession.nameInitials() }}
                      </span>
                    </v-avatar>
                  </template>
                </v-list-item>

                <v-divider inset />

                <v-list-item>
                  <template #prepend>
                    <v-avatar>
                      <v-icon icon="mdi-city" />
                    </v-avatar>
                  </template>

                  <v-list-item-title>
                    {{ appStore.userSession.session().org_header_name }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-avatar>
                      <v-icon icon="mdi-email" />
                    </v-avatar>
                  </template>

                  <v-list-item-title>
                    {{ appStore.userSession.session().email_address }}
                  </v-list-item-title>
                </v-list-item>
                <!-- <v-divider inset /> -->
                <!-- <v-list-item
                  append-icon="mdi-swap-horizontal"
                  title="Switch Branch"
                  @click="switchBranchVis = true"
                >
                  <template #prepend>
                    <v-avatar>
                      <v-icon icon="mdi-city" />
                    </v-avatar>
                  </template>
                </v-list-item> -->
              </v-list>

              <v-divider />

              <v-card-actions>
                <!-- <v-btn
                  color="on-surface"
                  prepend-icon="mdi-lock"
                  variant="text"
                  @click.prevent="
                    () => {
                      avatarMenu = false
                      changePasswordVis = true
                    }
                  "
                >
                  Change Password
                </v-btn> -->

                <v-spacer />

                <v-btn
                  color="on-surface"
                  prepend-icon="mdi-logout"
                  variant="text"
                  @click.prevent="
                    () => {
                      avatarMenu = false
                      logoutHandle()
                    }
                  "
                >
                  {{ t('$vuetify.custom.loginPage.logout') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
      </v-app-bar>

      <!-- <v-navigation-drawer
        v-if="!mobile"
        ref="refDrawer"
        :class="[fluid ? 'nav-collapse' : '', rail ? 'drawer-menu' : '']"
        expand-on-hover
        :model-value="drawer"
        :rail="rail"
        width="240"
        @mouseleave="onDrawerValSecLeave"
        @update:model-value="handleChangeDrawer"
      >
        <v-list
          v-model:selected="selected"
          class="pl-0 nav-list"
          :class="fluid ? 'pr-0' : 'pr-4'"
          color="primary"
          density="compact"
          lines="one"
          mandatory
          nav
          select-strategy="single-leaf"
          selectable
          slim
          variant="flat"
        >
          <template v-for="item in appStore.appMenus" :key="item.code">
            <v-list-item
              v-if="!hasChildren(item)"
              :fluid="fluid"
              :prepend-icon="item.icon"
              rounded="te-xl be-xl"
              :title="item.title"
              :value="item.code"
              @click="clickNavigateTo(item)"
            />

            <v-list-item
              v-else
              append-icon="$next"
              :class="{ 'active-parent': isActiveParent(item) }"
              :fluid="fluid"
              :prepend-icon="item.icon"
              rounded="te-xl be-xl"
              :title="item.title"
              :value="item.code"
              @mouseenter="onDrawerValSecEnter($event, item)"
            />
          </template>
        </v-list>

        <template #append>
          <app-footer v-if="!rail" />
        </template>
      </v-navigation-drawer> -->

      <!-- <v-navigation-drawer
        v-if="!mobile"
        v-model="drawerValSec"
        class="bg-background"
        style="min-width: 360px"
        temporary
        :width="drawerValSec ? 'auto' : 0"
        @mouseenter="onDrawerValSecEnter($event, null)"
        @mouseleave="onDrawerValSecLeave"
      >
        <v-sheet class="pa-4 w-100" color="transparent">
          <div class="text-uppercase text-caption text-on-surface opacity-40">Quick Access</div>
          <v-divider color="text-on-surface-light" opacity=".4" thickness="1" variant="dashed" />

          <div v-if="activeParent && hasChildren(activeParent)" class="py-4">
            <div class="text-h6 d-flex align-center">
              <v-icon :icon="activeParent.icon" size="x-small" />
              <span class="ml-2">{{ activeParent.title }}</span>
            </div>

            <div class="d-flex flex-row justify-space-between ga-2 mt-2">
              <div class="d-flex flex-column flex-nowrap align-start ga-2">
                <template v-for="(child, ii) in activeChildren" :key="child.code">
                  <div v-if="ii + 1 <= 15" class="d-flex align-center ga-2">
                    <v-btn
                      :color="child.code === resolveRouteParentName(route.name) ? 'primary' : ''"
                      :prepend-icon="child.icon"
                      :variant="
                        child.code === resolveRouteParentName(route.name) ? 'flat' : 'tonal'
                      "
                      @click="clickNavigateTo(child)"
                    >
                      {{ child.title }}
                    </v-btn>

                    <v-btn
                      color="warning"
                      density="comfortable"
                      :icon="
                        appStore.useSettings.checkMenuFav(child.code)
                          ? 'mdi-star'
                          : 'mdi-star-outline'
                      "
                      size="small"
                      variant="tonal"
                      @click="appStore.toggleMenuFav(child.code)"
                    />
                  </div>
                </template>
              </div>

              <div class="d-flex flex-column flex-nowrap align-start ga-2">
                <template v-for="(child, ii) in activeChildren" :key="child.code">
                  <div v-if="ii + 1 > 15" class="d-flex align-center ga-2">
                    <v-btn
                      :color="child.code === resolveRouteParentName(route.name) ? 'primary' : ''"
                      :prepend-icon="child.icon"
                      :variant="
                        child.code === resolveRouteParentName(route.name) ? 'flat' : 'tonal'
                      "
                      @click="clickNavigateTo(child)"
                    >
                      {{ child.title }}
                    </v-btn>

                    <v-btn
                      color="warning"
                      density="comfortable"
                      :icon="
                        appStore.useSettings.checkMenuFav(child.code)
                          ? 'mdi-star'
                          : 'mdi-star-outline'
                      "
                      size="small"
                      variant="tonal"
                      @click="appStore.toggleMenuFav(child.code)"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </v-sheet>
      </v-navigation-drawer> -->

      <v-navigation-drawer
        ref="refDrawer"
        :class="fluid ? 'nav-collapse' : ''"
        color="primary"
        expand-on-hover
        :model-value="drawer"
        :rail="rail"
        width="240"
        @update:model-value="handleChangeDrawer"
      >
        <v-list
          v-model:opened="menusOpened"
          v-model:selected="selected"
          base-color="transparent"
          class="pl-0 nav-list"
          :class="fluid ? 'pr-0' : 'pr-4'"
          density="compact"
          lines="one"
          mandatory
          nav
          open-strategy="multiple"
          select-strategy="single-leaf"
          selectable
          slim
          variant="flat"
        >
          <LayoutMenu
            v-for="item in appStore.appMenus"
            :key="item.code"
            :fluid="fluid"
            :menu-info="item"
          />
        </v-list>

        <template #append>
          <app-footer v-if="!rail" />
        </template>
      </v-navigation-drawer>

      <!-- color="surface" -->
      <v-main>
        <v-tabs
          bg-color="primary"
          class="border-b-thin border-e-thin"
          density="compact"
          mandatory
          :model-value="route.name"
          show-arrows
          @dragover="onDragOver($event)"
          @drop="onDropToEnd($event)"
        >
          <template v-for="(item, idx) in routerTabs" :key="item.value">
            <v-tab
              class="ff-tab text-none border-e-thin"
              :class="idx === 0 ? 'border-s-thin' : ''"
              draggable="true"
              :prepend-icon="item.prependIcon"
              :text="item.title"
              :to="item.to"
              :value="item.value"
              @contextmenu="openMenu($event, item)"
              @dragover="onDragOver($event)"
              @dragstart="onDragStart($event, item)"
              @drop="onDrop($event, item)"
            >
              <template #append>
                <v-btn
                  density="comfortable"
                  icon="$close"
                  size="x-small"
                  variant="text"
                  @click.stop.prevent="closeTab(item)"
                />
              </template>
            </v-tab>
          </template>
          <!-- menu -->
          <v-menu v-model="menuDia" :offset="[8, -8]" :target="[menuX, menuY]">
            <v-list activatable density="compact">
              <v-list-item color="primary" @click="closeTab(selectedTab)">
                <v-list-item-title>Close</v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item color="primary" @click="closeOtherTabs()">
                <v-list-item-title>Close Others</v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item color="primary" @click="closeAllTabs()">
                <v-list-item-title>Close All</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tabs>
        <!-- page content -->
        <!-- defineOptions({ name: 'MyComponent' }); -->
        <router-view v-slot="{ Component, route: routerRoute }">
          <keep-alive>
            <component
              :is="Component"
              v-if="routerRoute.meta?.keepAlive"
              :key="getCacheKey(routerRoute)"
            />
          </keep-alive>

          <component
            :is="Component"
            v-if="!routerRoute.meta?.keepAlive"
            :key="routerRoute.fullPath"
          />
        </router-view>
      </v-main>
    </v-app>

    <FLoadingDialog
      :color="appStore.globalLoadingColor"
      :dia-vis="appStore.globalLoading"
      :icon="appStore.globalLoadingIcon"
      :title="appStore.globalLoadingText"
    />

    <MessageSnack />

    <v-snackbar
      v-model="updateSystemFlag"
      color="#424242"
      location="right top"
      min-width="auto"
      :text="t('$vuetify.custom.app.updateTitle')"
      :timeout="-1"
      vertical
    >
      <template #actions>
        <v-btn color="blue" variant="text" @click="remindHandle">
          {{ t('$vuetify.custom.app.updateRemindBtnText') }}
        </v-btn>

        <v-btn color="red" variant="text" @click="updateHandle">
          {{ t('$vuetify.custom.app.updateBtnText') }}
        </v-btn>
      </template>
    </v-snackbar>

    <PrivacyPolicyDialog v-model:open-value="privacyPolicyValue" />
    <PagesLoginSwitchBranch v-model:dia-vis="switchBranchVis" />
    <PagesLoginChangePassword v-model:dia-vis="changePasswordVis" />
    <UnsavedChangesDialog />
  </v-responsive>
</template>

<script setup>
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDisplay, useLocale } from 'vuetify'
  import logoSrc from '@/assets/images/login/logo.png'
  import { useAppStore } from '@/stores/app'
  import { useRightDrawerStore } from '@/stores/right-drawer'
  import { useSignalrStore } from '@/stores/signalr'

  const signalrStore = useSignalrStore()
  const { mobile } = useDisplay()
  const { t } = useLocale()
  const appStore = useAppStore()
  const router = useRouter()
  const route = useRoute()
  const rightDrawerStore = useRightDrawerStore()

  const reload = inject('reload')
  const changeAppLanguage = inject('changeAppLanguage')
  const appThemeIcon = inject('appThemeIcon')
  const changeAppTheme = inject('changeAppTheme')

  const reloadPage = () => {
    reload()
  }
  const drawer = ref(true)
  const rail = ref(false)
  if (mobile.value) {
    drawer.value = false
    rail.value = false
  }
  watch(mobile, v => {
    rail.value = false
    if (v) {
      drawer.value = false
    } else {
      drawer.value = true
    }
  })
  const handleChangeDrawer = () => {
    if (mobile.value) {
      if (drawer.value) {
        drawer.value = false
      } else {
        drawer.value = true
      }
      rail.value = false
    } else {
      if (rail.value) {
        rail.value = false
      } else {
        rail.value = true
      }
      drawer.value = true
    }
  }
  const refDrawer = ref(null)
  const fluid = ref(false)
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.target.clientWidth < 150) {
        fluid.value = true
      } else {
        fluid.value = false
      }
    }
  })

  let checkeSessionTimerId = null
  let timerInit = false
  const checkeSessionTimer = () => {
    if (timerInit) {
      checkeSessionTimerId = setTimeout(checkeSession, 5000)
    }
  }
  const checkeSession = async () => {
    try {
      const res = await signalrStore.sendMessage('checkSession', 'xxx')
      console.log(res, 'checkSession')
      if (res !== '1') {
        // sessionStorage.removeItem('token')
      }
    } catch (error) {
      console.log(error)
    } finally {
      clearTimeout(checkeSessionTimerId)
      checkeSessionTimerId = null
      checkeSessionTimer()
    }
  }

  const updateSystemFlag = ref(false)
  const updateLastTimer = ref('')

  /**
   * web socket
   */
  const onAbpSignalrConnected = async () => {
    signalrStore.receiveMessage('updateSystem', args => {
      if (localStorage.getItem('update-last-timer') !== args) {
        updateLastTimer.value = args
        // 判断当前时间是否 超过 最后提醒时间
        const ttt = new Date().getTime()
        const aaa = localStorage.getItem('remind-last-timer')
        if (aaa && /^[1-9]\d*$/.test(aaa)) {
          updateSystemFlag.value = ttt > Number(aaa)
        } else {
          updateSystemFlag.value = true
        }
      }
    })
    signalrStore.receiveMessage('receiveMessage', args => {
      console.log(args, 'receiveMessage')
    })
    // checkeSession()
    try {
      const { success } = await signalrStore.sendMessage('sendMessage', {
        user: 'abby',
        message: 'hello',
      })
      console.log(success, 'sendMessage')
    } catch (error) {
      console.log(error)
    }
  }

  const onCloseTabPage = tabValue => {
    const tab = routerTabs.value.find(t => t.value === tabValue)
    if (tab) {
      closeTab(tab)
    }
  }

  const onReplaceBookingEditTab = payload => {
    const idx = routerTabs.value.findIndex(t => t.value === payload.oldTabValue)
    if (idx < 0) {
      return
    }
    const prev = routerTabs.value[idx]
    routerTabs.value.splice(idx, 1, {
      ...prev,
      value: payload.newTabValue,
      title: payload.title,
      to: payload.to,
      params: payload.params ?? payload.to?.params ?? {},
      query: payload.query ?? payload.to?.query ?? {},
    })
  }

  onMounted(() => {
    console.log('layout onMounted')
    timerInit = true
    const token = sessionStorage.getItem('token')
    const qs = token ? `enc_auth_token=${encodeURIComponent(token)}` : null
    signalrStore.connect(qs)
    appStore.event.on('abp.signalr.connected', onAbpSignalrConnected)

    // Listen for closeTab event
    appStore.event.on('closeTab', onCloseTabPage)
    appStore.event.on('replaceBookingEditTab', onReplaceBookingEditTab)

    nextTick(() => {
      if (refDrawer?.value?.$el?.nextSibling) {
        resizeObserver.unobserve(refDrawer.value.$el.nextSibling)
        resizeObserver.observe(refDrawer.value.$el.nextSibling)
      }
    })

    changeRouteName(route.name)
  })

  onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
    nextTick(() => {
      if (refDrawer?.value?.$el?.nextSibling) {
        resizeObserver.unobserve(refDrawer.value.$el.nextSibling)
      }
    })
    timerInit = false
    appStore.event.off('abp.signalr.connected', onAbpSignalrConnected)
    appStore.event.off('closeTab', onCloseTabPage)
    appStore.event.off('replaceBookingEditTab', onReplaceBookingEditTab)
    signalrStore.stop()
  })

  const routerTabs = ref([])
  // const cacheComp = ref([])
  // const cacheKey = ref('')
  const processingTabs = ref(new Set())

  const kebabToPascal = str => {
    return str
      .split('_') // 以 "_" 分割字符串
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 首字母大写
      .join('') // 连接成一个字符串
  }

  // 辅助函数：生成缓存 key，用于 keep-alive
  // 对于动态路由（如 [pk].vue），使用 route.name + params.pk 作为 key，确保不同参数的页面有独立的缓存
  const getCacheKey = routerRoute => {
    const params = routerRoute.params || {}
    if (params.pk) {
      return `${routerRoute.name}-${params.pk?.toString()}`
    }
    return routerRoute.name
  }

  const findParentByChild = (menus, code) => {
    let pp = null
    if (menus && menus.length > 0) {
      for (let i = 0; i < menus.length; i++) {
        const m = menus[i]
        const idx = (m.children ?? []).findIndex(a => a.code === code)
        if (idx >= 0) {
          pp = m.code
          break
        } else {
          pp = findParentByChild(m.children, code)
        }
      }
    }
    return pp
  }

  // 辅助函数：生成标签页的唯一值
  const getTabValue = (pageCode, params = {}) => {
    // 对于动态路由，使用 pageCode + params.pk 作为唯一值
    if (params && params.pk) {
      return `${pageCode}-${params.pk}`
    }
    return pageCode
  }

  // 辅助函数：替换标题中的占位符
  const replacePlaceholders = (title, data) => {
    return title.replace(/\{([^}]+)\}/g, (match, key) => {
      const value = data?.[key]
      if (value != null && value !== '') {
        return String(value)
      }
      return ''
    })
  }

  const resolveRouteParentName = currentRouteName => {
    return currentRouteName.replace('_new', '').replace('_edit-pk', '')
  }
  const menusOpened = ref([])
  const selected = ref([]) // 菜单选中
  const changeRouteName = currentRouteName => {
    const parent = findParentByChild(appStore.appMenus, resolveRouteParentName(currentRouteName))
    if (parent) {
      selected.value = [parent]
    } else {
      selected.value = [currentRouteName]
    }

    const params = route.params || {}
    const query = route.query || {}
    const tabValue = getTabValue(currentRouteName, params, query)

    // 防重复处理
    if (!processingTabs.value.has(tabValue)) {
      processingTabs.value.add(tabValue)
      addRouterTabs(currentRouteName, params, query)
      nextTick(() => {
        processingTabs.value.delete(tabValue)
      })
    }

    // cacheKey.value = tabValue
  }

  const addRouterTabs = (pageCode, params = {}, query = {}) => {
    const tabValue = getTabValue(pageCode, params, query)
    console.log(tabValue, 'tabValue')

    const idx = routerTabs.value.findIndex(item => item.value === tabValue)
    if (idx < 0) {
      const menuIdx = appStore.allMenus.findIndex(item => item.code === pageCode)

      if (menuIdx >= 0) {
        const menu = appStore.allMenus[menuIdx]
        let title = menu.title
        if (pageCode === 'booking_edit-pk' && String(query?.copy ?? '') === '1') {
          title = 'New Booking'
        } else if (route.meta?.tabTitle) {
          title = route.meta.tabTitle
          title = replacePlaceholders(title, { ...query, ...params })
        }
        routerTabs.value.push({
          value: tabValue,
          title: title,
          prependIcon: menu.icon,
          to: {
            path: menu.path,
            query: query,
            params: params,
          },
          name: kebabToPascal(pageCode),
          routeName: pageCode,
          params: params,
          query: query,
        })
      } else if (route.name === pageCode) {
        let title = t(`$vuetify.custom.menuPage.${pageCode}`)
        if (pageCode === 'booking_edit-pk' && String(query?.copy ?? '') === '1') {
          title = 'New Booking'
        } else if (route.meta?.tabTitle) {
          title = route.meta.tabTitle
          title = replacePlaceholders(title, { ...query, ...params })
        }
        routerTabs.value.push({
          value: tabValue,
          title: title,
          prependIcon: 'mdi-circle-medium',
          to: {
            path: route.path,
            query: query,
          },
          name: kebabToPascal(pageCode),
          routeName: pageCode,
          params: params,
          query: query,
        })
      }
    }
    // cacheComp.value = routerTabs.value.map(a => a.name)
  }

  watch(
    () => {
      return route.name
    },
    newName => {
      if (newName) {
        const currentRouteName = newName
        changeRouteName(currentRouteName)
      }
    },
  )
  const logoutHandle = () => {
    sessionStorage.removeItem('token')
    router.replace({ path: '/login' })
  }
  const updateHandle = () => {
    localStorage.removeItem('remind-last-timer')
    localStorage.setItem('update-last-timer', updateLastTimer.value)
    window.location.reload(true)
  }
  const remindHandle = () => {
    updateSystemFlag.value = false
    localStorage.setItem('remind-last-timer', appStore.utils.addMinutes(new Date(), 5).getTime())
  }

  const reloadComponent = () => {
    // 清空缓存，重新加载组件
    // cacheComp.value = cacheComp.value.filter(a => a !== kebabToPascal(route.name)) // 清空 key 让组件卸载
    // cacheKey.value = cacheKey.value + 'ad'
    // setTimeout(() => {
    //   cacheComp.value.push(kebabToPascal(route.name))
    //   cacheKey.value = route.name
    // }, 10)
  }
  // 注入
  provide('reloadComponent', reloadComponent)

  const menuDia = ref(false)
  const menuX = ref(0)
  const menuY = ref(0)
  const selectedTab = ref(null) // 右键选中的标签

  // 右键打开菜单
  const openMenu = (event, tab) => {
    event.preventDefault() // 阻止默认右键行为

    menuX.value = event.clientX
    menuY.value = event.clientY
    selectedTab.value = tab
    menuDia.value = true
  }

  const showUnsavedInputDataDialog = confirmAction => {
    appStore.openUnsavedInputDataDialog(confirmAction)
  }

  // 批量关闭时只检查即将被关闭的 tab，未被关闭的当前 tab 不阻止操作。
  const hasUnsavedInputDataBeforeClose = tabs => {
    return tabs.some(tab => appStore.hasUnsavedInputData(tab?.value))
  }

  // 关闭当前标签
  const closeTab = (tab, forceClose = false) => {
    if (!tab) {
      return
    }
    if (!forceClose && hasUnsavedInputDataBeforeClose([tab])) {
      showUnsavedInputDataDialog(() => closeTab(tab, true))
      return
    }
    // 点击弹框“好”后会触发路由跳转，需要跳过下一次路由守卫拦截。
    if (forceClose) {
      appStore.skipNextUnsavedInputDataCheck()
    }

    let m = true
    const f = appStore.firstMenuPath ?? '/'

    if (routerTabs.value.length > 1) {
      const last = routerTabs.value[routerTabs.value.length - 1]
      if (tab.value === last.value) {
        router.push(routerTabs.value[routerTabs.value.length - 2].to)
      } else {
        router.push(last.to)
      }
    } else if (routerTabs.value.length === 1) {
      if (routerTabs.value[0].to.path === f) {
        // 不移除
        m = false
      } else {
        router.push({ path: f })
      }
    } else {
      router.push({ path: f })
    }
    if (m) {
      routerTabs.value = routerTabs.value.filter(t => t.value !== tab.value)
    }
  }

  // 关闭其他标签
  const closeOtherTabs = (forceClose = false) => {
    if (!selectedTab.value) {
      return
    }
    // Close Others 只检查将被关闭的其他 tab，保留的 tab 不需要提示。
    const tabsToClose = routerTabs.value.filter(tab => tab.value !== selectedTab.value.value)
    if (!forceClose && hasUnsavedInputDataBeforeClose(tabsToClose)) {
      showUnsavedInputDataDialog(() => closeOtherTabs(true))
      return
    }
    // 用户确认后再次执行关闭，避免 router.push 被跳转守卫重复弹框。
    if (forceClose) {
      appStore.skipNextUnsavedInputDataCheck()
    }

    routerTabs.value = [selectedTab.value]
    router.push(selectedTab.value.to)
  }

  // 关闭所有标签
  const closeAllTabs = (forceClose = false) => {
    if (!selectedTab.value) {
      return
    }
    const f = appStore.firstMenuPath ?? '/'
    // Close All 实际会保留首页 tab，所以只检查非首页 tab 是否未保存。
    const tabsToClose = routerTabs.value.filter(t => t.to.path !== f)
    if (!forceClose && hasUnsavedInputDataBeforeClose(tabsToClose)) {
      showUnsavedInputDataDialog(() => closeAllTabs(true))
      return
    }
    // 用户确认后再次执行关闭，避免跳回首页时被路由守卫重复弹框。
    if (forceClose) {
      appStore.skipNextUnsavedInputDataCheck()
    }

    if (selectedTab.value.to.path === f) {
      routerTabs.value = routerTabs.value.filter(t => t.to.path === f)
      if (route.path === f) {
        // console.log(f)
      } else {
        router.push({ path: f })
      }
    } else {
      routerTabs.value = routerTabs.value.filter(t => t.to.path === f)
      router.push({ path: f })
    }
  }

  // right 抽屉
  const rightDrawerDia = ref(false)
  const rightDrawerName = ref('')
  const rightDrawerTitle = ref('')
  const rightDrawerGpType = ref('')
  const rightDrawerSaveType = ref('')
  const rightDrawerInputData = ref({
    id: 0,
  })
  // const rightDrawerLoading = ref(false)
  const rightDrawerQueryTbl = ref(() => {})
  const openRightDrawer = (name, inputData, gpType, saveType, callback) => {
    if (name === 'PO_DETAILS_LINE') {
      rightDrawerDia.value = true
      rightDrawerName.value = 'PO_DETAILS_LINE'
      rightDrawerTitle.value = 'Line# ' + inputData.line_item_number
      rightDrawerInputData.value = {
        ...inputData,
      }
      if (callback) {
        rightDrawerQueryTbl.value = callback
      }
    }
    if (name === 'CUSTOMER_EDIT_DRAWER') {
      rightDrawerInputData.value = {
        ...inputData,
        org_type_1: inputData.org_type ? inputData.org_type.toLowerCase() : '',
      }
      rightDrawerDia.value = true
      rightDrawerName.value = 'CUSTOMER_EDIT_DRAWER'
      rightDrawerGpType.value = gpType
      rightDrawerSaveType.value = saveType
      if (gpType === 'CUSTOMER') {
        if (saveType === 'ADD') {
          rightDrawerTitle.value = 'Add New Customer'
        } else {
          rightDrawerTitle.value = 'Edit Customer - ' + inputData.name
        }
      } else if (gpType === 'COMPANY') {
        if (saveType === 'ADD') {
          rightDrawerTitle.value = 'Add New Company'
        } else {
          rightDrawerTitle.value = 'Edit Company - ' + inputData.name
        }
      } else if (gpType === 'ORGANIZATION') {
        if (saveType === 'ADD') {
          rightDrawerTitle.value = 'Add New Organization'
        } else {
          rightDrawerTitle.value = 'Edit Organization - ' + inputData.name
        }
      }
      if (callback) {
        rightDrawerQueryTbl.value = callback
      }
    }
    if (name === 'INVENTORY_EDIT_DRAWER') {
      rightDrawerInputData.value = {
        ...inputData,
      }
      rightDrawerDia.value = true
      rightDrawerName.value = 'INVENTORY_EDIT_DRAWER'
      rightDrawerTitle.value = 'Job # ' + (inputData.job_no ?? '')

      if (callback) {
        rightDrawerQueryTbl.value = callback
      }
    }
    if (name === 'SUPPLIER_EDIT_DRAWER') {
      rightDrawerInputData.value = {
        ...inputData,
      }
      rightDrawerDia.value = true
      rightDrawerName.value = 'SUPPLIER_EDIT_DRAWER'
      if (saveType === 'ADD') {
        rightDrawerTitle.value = 'Add New Supplier'
      } else {
        rightDrawerTitle.value = 'Edit Supplier - ' + inputData.name
      }
      if (callback) {
        rightDrawerQueryTbl.value = callback
      }
    }
  }
  // 注入
  provide('openRightDrawer', openRightDrawer)

  const avatarMenu = ref(false)

  const privacyPolicyValue = ref(false)
  if (localStorage.getItem('privacy_policy_accepted') !== '1') {
    privacyPolicyValue.value = true
  }

  const drawerValSec = ref(false)

  const hasChildren = item => (item.children ?? []).length > 0
  const activeParent = ref({})
  const activeChildren = computed(() => {
    if (!activeParent.value) return []
    return (activeParent.value.children ?? []).filter(item => !!item?.path)
  })

  // 检查菜单项是否为当前展开的父菜单
  const isActiveParent = item => {
    return drawerValSec.value && activeParent.value && activeParent.value.code === item.code
  }

  let timerTemp = null
  const onDrawerValSecEnter = (e, item) => {
    clearTimeout(timerTemp)
    timerTemp = setTimeout(() => {
      drawerValSec.value = true
    }, 120)

    if (item) {
      if (!hasChildren(item)) {
        return
      }
      activeParent.value = item
    }
  }
  const onDrawerValSecLeave = () => {
    clearTimeout(timerTemp)
    timerTemp = setTimeout(() => {
      drawerValSec.value = false
    }, 120)
  }
  const clickNavigateTo = item => {
    if (item && item.path) {
      onDrawerValSecLeave()
      router.push(item.path)
    }
  }

  const switchBranchVis = ref(false)
  const changePasswordVis = ref(false)

  // 拖放相关
  const draggedTab = ref(null)

  // 开始拖动
  const onDragStart = (event, tab) => {
    draggedTab.value = tab
    event.dataTransfer.effectAllowed = 'move'
  }

  // 拖动经过
  const onDragOver = event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  // 放置
  const onDrop = (event, targetTab) => {
    event.preventDefault()
    if (draggedTab.value && draggedTab.value !== targetTab) {
      const draggedIndex = routerTabs.value.findIndex(tab => tab.value === draggedTab.value.value)
      const targetIndex = routerTabs.value.findIndex(tab => tab.value === targetTab.value)
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // 重新排序
        const newTabs = [...routerTabs.value]
        newTabs.splice(draggedIndex, 1)
        newTabs.splice(targetIndex, 0, draggedTab.value)
        routerTabs.value = newTabs
      }
    }
    draggedTab.value = null
  }

  // 放置到末尾
  const onDropToEnd = event => {
    event.preventDefault()
    if (draggedTab.value) {
      const draggedIndex = routerTabs.value.findIndex(tab => tab.value === draggedTab.value.value)
      if (draggedIndex !== -1) {
        // 移动到末尾
        const newTabs = [...routerTabs.value]
        newTabs.splice(draggedIndex, 1)
        newTabs.push(draggedTab.value)
        routerTabs.value = newTabs
      }
    }
    draggedTab.value = null
  }
</script>

<style scoped lang="scss">
  .nav-list {
    :deep(.v-list-item__prepend) {
      margin-left: 8px;
    }
    &.v-list--slim {
      :deep(.v-list-group) {
        --prepend-width: 8px;
        .v-list-group__items .v-list-item {
          transition: padding-inline-start 0.2s ease;
        }
      }
    }

    // :deep(.v-list-group) {
    // .v-list-item--active {
    // background-color: rgba(var(--v-theme-primary), 0.1) !important;
    // color: rgba(var(--v-theme-primary)) !important;
    // }
    // }
  }

  .nav-collapse {
    :deep(.v-navigation-drawer__content) {
      overflow-y: hidden;
    }
    &.drawer-menu {
      :deep(.v-list-item__content) {
        display: none;
      }
    }
  }
  .ff-tab {
    --v-btn-size: 0.8rem;
    :deep(.v-tab__slider) {
      bottom: 1px;
    }
  }

  /* 展开二级菜单时一级菜单的样式 */
  // .active-parent {
  //   background-color: rgba(var(--v-theme-primary), 0.1) !important;
  //   color: rgba(var(--v-theme-primary)) !important;
  // }
</style>
