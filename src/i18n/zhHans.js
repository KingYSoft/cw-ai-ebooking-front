import bookingPageEdit from './blocks/bookingPage/editZhHans'
import dashboardPage from './blocks/dashboardPage/zhHans'
import partyGroup from './blocks/partyGroup/zhHans'
import partyRole from './blocks/partyRole/zhHans'
import systemPage from './blocks/systemPage/zhHans'
import warehouseOrder from './blocks/warehouseOrder/zhHans'

export default {
  custom: {
    unsavedInputData: {
      title: '页面未保存更新',
      message: '页面未保存更新。',
    },
    dataTable: {
      filter: '筛选',
      menus: {
        inputLabel: '搜索项',
        inputPlaceholder: '搜索项',
      },
      header: {
        dialog: {
          title: '隐藏列',
        },
      },
    },
    tableLayout: {
      headerSettings: '表头显示设置',
      availableFields: '可选择字段',
      selectedFields: '已展示字段',
    },
    branchFilter: {
      menus: {
        inputLabel: '搜索项',
        inputPlaceholder: '搜索项',
      },
      tab0: {
        title: '筛选分公司',
        subtitle: '筛选分公司过滤数据',
      },
      tab1: {
        title: '切换数据',
        subtitle: '切换视图类型过滤数据',
        own: {
          title: '自己的',
          subtitle: '只查看自己的数据',
        },
      },
    },
    da: {
      demo: '德莫',
    },
    op: {
      equal: '等于',
      notEqual: '不等于',
      contain: '包含',
      notContain: '不包含',
    },
    dialog: {
      btn: {
        new: '新建',
        add: '新增',
        edit: '编辑',
        close: '关闭',
        save: '保存',
        cancel: '取消',
        clear: '清空',
        ok: '好',
        reset: '重置',
        search: '搜索',
        import: '导入',
        confirm: '确认',
        reload: '刷新',
        more: '更多',
      },
    },
    app: {
      title: 'SJ Clemenger Booking Portal',
      search: '搜索',
      searchPlaceholder: '输入搜索关键词',
      action: '操作',
      loading: '启动应用程序...',
      http: {
        err_title: '网络请求错误',
        err_401msg: '登入失效，请重新登入。',
        err_403msg: '无操作权限，请重新登入。',
        err_500msg: '内部服务器错误，请联系管理员。',
        err_time_out_msg: '网络请求超时，请刷新页面。',
        err_other_msg: '网络请求失败，请刷新页面。',
        err_data_msg: '数据错误，请重试。',
      },
      err401: {
        title: '未授权！🔐',
        text: `没有权限访问，请返回首页！`,
        btnText: '首页',
      },
      err404: {
        title: '页面不存在',
        text: '我们找不到您要找的页面！',
        btnText: '首页',
      },
      saveSuccess: '保存成功',
      searchMore: '关键字搜索',
      updateTitle: '新版本已经准备好，是否立即更新？',
      updateBtnText: '立即更新',
      updateRemindBtnText: '稍后5分钟提醒',
    },
    loginPage: {
      title: '登入',
      label: {
        email: '邮箱',
        password: '密码',
      },
      err: {
        email: '必须是有效的电子邮件。',
        password: '需要输入密码。',
      },
      placeholder: {
        email: '输入你的邮箱地址',
        password: '输入你的密码',
      },
      forgotPassword: '忘记密码？',
      submitBtn: '登入',
      logout: '退出',
      newMessage: '在我们平台上注册？',
      newBtn: '创建账号',
      ssoLogin: '单点登入...',
      ssoLoginText: '使用临时 Token {0} 进行单点登入...',
      ssoLoginTitle: '单点登入',
      ssoLoginBtnText: '账号登入',
      p1: '登录平台，您即表示同意我们的',
      p2: '隐私政策',
      p3: '和',
      p4: '条款与条件',
      t1: '一站式',
      t2: '平台.',
      subTitle: '连接人、货物与技术',
      desc: '一站式连接，致力于提供无缝、安全且实时的数据驱动型连接服务，以支持物流配送流程。我们通过一系列行业领先的软件解决方案来实现这一目标，这些解决方案由实时数据驱动，能够实现全程的可见性和高效性。',
      privacyPolicy: {
        p1: '本企业全权决定在旗下媒体平台及互联网全域收集的个人数据的使用方式。我们可能收集你直接向我方提交的数据，也可能通过自动方式收集数据，包括借助 Cookie 获取的相关信息（如设备信息、IP 地址等）。',
        p2: '请查阅我们的',
        p3: '隐私政策',
        p4: '继续使用本网站，即表示你同意接受本《隐私政策》的约束。',
        btnText: '接受',
      },
    },
    privacyPage: {
      title: '隐私政策',
      desc: '我们非常重视您的隐私保护，在您使用 SJ Clemenger 时(以下简称为“本服务”)，我们将按照以下政策收集、使用、披露和保护您的个人信息。请您仔细阅读并充分理解本隐私政策。',
      p1: {
        title: '1. 信息收集',
        d1: '我们收集您在使用服务过程中主动提供的信息，包括但不限于姓名、电子邮件地址、电话号码等个人信息。',
        d2: '在您使用本服务过程中产生的信息，如操作日志、访问IP地址、设备型号等。',
        d3: '我们可能会通过 Cookies 或其他技术收集和存储您访问本服务的相关信息，以便为您提供更好的用户体验。',
      },
      p2: {
        title: '2. 信息使用',
        d1: '我们使用收集的信息来提供、维护和改进我们的服务，处理交易，发送通知，以及确保服务的安全性。',
      },
      p3: {
        title: '3. 信息共享',
        d1: '除非获得您的明确同意，或在法律要求的情况下，我们不会与第三方共享您的个人信息。',
      },
      p4: {
        title: '4. 数据安全',
        d1: '我们采用行业标准的安全措施来保护您的个人信息，包括加密传输和存储。',
      },
      p5: {
        title: '5. Cookie 使用',
        d1: '我们使用 Cookie 和类似技术来改善用户体验，分析网站流量，并提供个性化内容。',
      },
      p6: {
        title: '6. 您的权利',
        d1: '您有权访问、更正、删除您的个人信息，或限制我们对其的处理。',
      },
      date: '最后更新日期：2025年1月',
    },
    menuPage: {
      dashboard: '仪表盘',

      freight: '货运',
      booking: '订舱',

      warehouse: '仓库',
      warehouse_booking: '订舱',

      po_management: 'PO 管理',
      po_details: 'PO 明细',
      po_management_reports: 'PO 报表',

      system: '系统',
      system_user: '用户',
      system_group: '组',
      system_agent_group: 'Agent 组',
      system_consignee_group: 'Consignee 组',
      system_shipper_group: 'Shipper 组',
      system_party_role: '参与方角色',
      system_security: '权限',
      system_logs: '日志',
    },
    dashboardPage,
    poPage: {
      title: {
        list: 'PO 列表',
      },
      button: {
        new: '新建 PO',
      },
      filter: {
        exRequiredDate: '出库要求日期',
        deliveryRequiredDate: '交付要求日期',
        dateFrom: '开始日期',
        dateTo: '结束日期',
        poNumber: 'PO 编号',
        buyerName: '买方名称',
        sellerName: '卖方名称',
        poController: 'PO 控制员',
        transportMode: '运输方式',
        origin: '起运地',
        destination: '目的地',
      },
      table: {
        headers: {
          poNumber: 'PO 编号',
          buyerName: '买方名称',
          sellerName: '卖方名称',
          orderDate: '订单日期',
          status: '状态',
          origin: '起运地',
          destination: '目的地',
          totalAmount: '总金额',
        },
      },
      menu: {
        edit: '编辑',
        delete: '删除',
      },
      deleteDialog: {
        title: '确认删除',
        message: '确定要删除 PO {0} 吗？此操作无法撤销。',
        cancel: '取消',
        delete: '删除',
      },
      message: {
        searchFailed: '搜索失败：{0}',
        unknownError: '未知错误',
        deleteSuccess: '删除成功',
        deleteFailed: '删除失败：{0}',
      },
    },
    poReportsPage: {
      title: 'PO 报表',
      button: {
        export: '导出报表',
        reset: '重置',
        applyFilter: '应用筛选',
      },
      filter: {
        dateFrom: '开始日期',
        dateTo: '结束日期',
        orderStatus: '订单状态',
        transportMode: '运输方式',
      },
      statistics: {
        totalPOs: 'PO 总数',
        completed: '已完成',
        inProgress: '进行中',
        totalAmount: '总金额',
      },
      section: {
        statusDistribution: 'PO 状态分布',
        transportModeDistribution: '运输方式分布',
        monthlyTrend: '月度 PO 趋势',
        topBuyers: '主要买方',
        topSellers: '主要卖方',
      },
      table: {
        status: '状态',
        count: '数量',
        percentage: '占比',
        amount: '金额',
        transportMode: '运输方式',
        month: '月份',
        poCount: 'PO 数量',
        totalAmount: '总金额',
        avgAmount: '平均金额',
        trend: '趋势',
        rank: '#',
        buyerName: '买方名称',
        sellerName: '卖方名称',
      },
      message: {
        exportComingSoon: '导出功能即将实现',
      },
    },
    bookingPage: {
      form: {
        shipper_name: {
          err: 'Shipper Name 不能为空。',
        },
        consignee_name: {
          err: 'Consignee Name 不能为空。',
        },
        bkg_transport_mode: {
          err: 'Transport Mode 不能为空。',
        },
        bkg_origin: {
          err: 'Origin 不能为空。',
        },
        bkg_destination: {
          err: 'Destination 不能为空。',
        },
        bkg_load_port: {
          err: 'Load 不能为空。',
        },
        bkg_discharge_port: {
          err: 'POD (Discharge) 不能为空。',
        },
        bkg_intended_vessel: {
          err: 'Vessel 不能为空。',
        },
        bkg_voyage: {
          err: 'Voyage 不能为空。',
        },
        bkg_etd: {
          err: 'ETD 不能为空。',
        },
        bkg_eta: {
          err: 'ETA 不能为空。',
        },
        bkg_cargo_ready: {
          err: 'Cargo Ready Date 不能为空。',
        },
        etd_must_be_before_cargo_ready: {
          err: 'ETD 必须晚于 Cargo Ready Date。',
        },
        eta_vs_etd_sea: {
          err: '海运 (SEA) 下，ETA 须晚于 ETD（不可同日）。',
        },
        eta_vs_etd_air: {
          err: '空运 (AIR) 下，ETA 不可早于 ETD。',
        },
        bkg_packing_mode: {
          err: 'Container 不能为空。',
        },
        bkg_inco: {
          err: 'Inco Term 不能为空。',
        },
        bkg_service_level: {
          err: 'Service Level 不能为空。',
        },
        bkg_actual_volume: {
          err: 'CBM 必须大于 0。',
        },
        bkg_actual_weight: {
          err: 'Gross Weight 必须大于 0。',
        },
        bkg_actual_chargeable: {
          err: 'Chargeable Weight 必须大于 0。',
        },
        bkg_volume_weight: {
          err: 'Volume Weight 必须大于 0。',
        },
        bkg_total_package_count: {
          err: 'No. of Package 必须大于 0。',
        },
        bkg_transit_time: {
          err: 'Transit Time 必须大于 0。',
        },
        bkg_goods_value: {
          err: 'Cargo Value 必须大于 0。',
        },
        bkg_goods_value_currency: {
          err: 'Cargo Value Currency 不能为空。',
        },
        bkg_insurance_value: {
          err: 'Ins. Value 必须大于 0。',
        },
        bkg_insurance_currency: {
          err: 'Ins. Value Currency 不能为空。',
        },
        bkg_freight_terms: {
          err: 'Freight Terms 不能为空。',
        },
        bkg_release_type: {
          err: 'Release Type 不能为空。',
        },
        bkg_commodity: {
          err: 'Commodity 不能为空。',
        },
        bkg_goods_description: {
          err: 'Good Desc. 不能为空。',
        },
        bkg_marks_nos: {
          err: 'Marks & No. 不能为空。',
        },
        pac_container_type: {
          err: 'Container Type 不能为空。',
        },
        pac_list: {
          err: 'Container 必须至少有一条数据。',
        },
        pac_container_count: {
          err: 'Container Count 必须大于 0。',
        },
        pac_package_count: {
          err: 'Pieces 必须大于 0。',
        },
        pac_pack_type: {
          err: 'Pack Type 不能为空。',
        },
        pac_gross_weight: {
          err: 'Gross Wt 必须大于 0。',
        },
        pac_actual_volume: {
          err: 'Volume 必须大于 0。',
        },
        wso_transport_mode: {
          err: 'Transport Mode 不能为空。',
        },
        wso_packing_mode: {
          err: 'Container 不能为空。',
        },
        wso_load_port: {
          err: 'Load 不能为空。',
        },
        wso_etd: {
          err: 'ETD 不能为空。',
        },
        wso_cargo_ready: {
          err: 'Cargo Ready Date 不能为空。',
        },
        wso_actual_weight: {
          err: 'Gross Weight 必须大于 0。',
        },
        wso_actual_volume: {
          err: 'CBM 必须大于 0。',
        },
        wso_volume_weight: {
          err: 'Volume Weight 必须大于 0。',
        },
        wso_actual_chargeable: {
          err: 'Chargeable Weight 必须大于 0。',
        },
        wso_total_package_count: {
          err: 'No. of Package 必须大于 0。',
        },
        wso_inco: {
          err: 'Inco Term 不能为空。',
        },
        wso_transit_time: {
          err: 'Transit Time 必须大于 0。',
        },
        wso_goods_value: {
          err: 'Cargo Value 必须大于 0。',
        },
        wso_insurance_value: {
          err: 'Ins. Value 必须大于 0。',
        },
        wso_freight_terms: {
          err: 'Freight Terms 不能为空。',
        },
        wso_release_type: {
          err: 'Release Type 不能为空。',
        },
        wso_commodity: {
          err: 'Commodity 不能为空。',
        },
        wso_goods_description: {
          err: 'Good Desc. 不能为空。',
        },
        wso_marks_nos: {
          err: 'Marks & No. 不能为空。',
        },
      },
      edit: bookingPageEdit,
      list: {
        pageTitle: '订舱明细',
        new: '新建',
        status: '状态：',
        startDate: '开始日期',
        endDate: '结束日期',
        jobNumber: '工作号',
        tableHeaders: {
          bookingNo: '订舱号',
          status: '状态',
          transMode: '运输方式',
          containerMode: '装箱方式',
          houseBill: '分单号',
          shipperName: '发货人名称',
          consigneeName: '收货人名称',
          origin: '起运地',
          destination: '目的地',
          crd: 'CRD',
          etd: 'ETD',
          eta: 'ETA',
          grossWeight: '毛重',
          cbm: 'CBM',
          freightTerm: '运费条款',
          inco: 'Inco',
        },
        menu: {
          copy: '复制',
          deactivate: '停用',
          newBooking: '新建委托',
          ocrBooking: 'OCR 委托',
        },
        listStatus: {
          saved: 'Saved',
          waiting_approve: 'Waiting for Approve',
          pending_si: 'Pending for Submit SI',
          deactive: 'Deactive',
        },
      },
      ocr: {
        recognition: 'OCR 识别',
        inProgress: '正在进行 OCR 识别…',
        uploadPdfFirst: '请先上传 PDF 文件。',
        success: 'OCR 识别成功。',
        failed: 'OCR 识别失败，请重试。',
        missingData: 'OCR 返回数据缺少委托信息',
      },
    },
    upload: {
      dropZone: {
        title: '拖拽文件到此处',
        subtitle: '或点击下方按钮选取文件',
      },
      buttons: {
        browse: '浏览文件',
        clear: '清空列表',
        upload: '上传文件',
        ocr: 'OCR识别',
      },
      fields: {
        docType: '单证类型',
        ebookingVisible: 'EBooking Visible',
      },
      fileCount: '已选文件',
      ocr: {
        title: 'OCR 委托',
        processing: '正在进行 OCR 识别...',
        success: 'OCR 识别成功',
        failed: 'OCR 识别失败，请重试',
      },
      messages: {
        noFileSelected: '请选择要上传的文件',
        noJobNumber: '请输入编号',
        noDocType: '请选择文件类型',
      },
      success: {
        uploadSuccess: '{0} Doc is uploaded',
      },
      error: {
        uploadError: 'Upload error: {0}',
      },
    },
    partyRole,
    partyGroup,
    systemPage,
    warehouseOrder,
  },
}
