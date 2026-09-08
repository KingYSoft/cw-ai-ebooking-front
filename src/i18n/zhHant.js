import bookingPage from './blocks/bookingPage/zhHant'
import dashboardPage from './blocks/dashboardPage/zhHant'
import systemPage from './blocks/systemPage/zhHant'
import warehouseOrder from './blocks/warehouseOrder/zhHant'

export default {
  custom: {
    unsavedInputData: {
      title: '尚未儲存的變更',
      message: '此頁面有尚未儲存的變更。',
    },
    dataTable: {
      filter: '篩選',
      menus: {
        inputLabel: '搜尋項目',
        inputPlaceholder: '搜尋項目',
      },
      header: {
        dialog: {
          title: '隱藏欄位',
        },
      },
    },
    tableLayout: {
      headerSettings: '欄位顯示設定',
      availableFields: '可選欄位',
      selectedFields: '已顯示欄位',
    },
    branchFilter: {
      menus: {
        inputLabel: '搜尋項目',
        inputPlaceholder: '搜尋項目',
      },
      tab0: {
        title: '選擇分公司',
        subtitle: '選擇分公司以篩選資料。',
      },
      tab1: {
        title: '切換檢視類型',
        subtitle: '切換檢視類型以篩選資料。',
        own: {
          title: '僅自己的',
          subtitle: '只查看自己的資料。',
        },
      },
    },
    da: {
      demo: '示範',
    },
    op: {
      equal: '等於',
      notEqual: '不等於',
      contain: '包含',
      notContain: '不包含',
    },
    dialog: {
      btn: {
        new: '新建',
        add: '新增',
        edit: '編輯',
        close: '關閉',
        save: '儲存',
        cancel: '取消',
        clear: '清除',
        ok: '確定',
        reset: '重設',
        search: '搜尋',
        import: '匯入',
        confirm: '確認',
        reload: '重新整理',
        more: '更多',
      },
    },
    app: {
      title: 'SJ Clemenger EBooking',
      search: '搜尋',
      searchPlaceholder: '輸入搜尋關鍵字',
      action: '操作',
      loading: '正在重新整理應用程式...',
      http: {
        err_title: '網路請求錯誤',
        err_401msg: '登入已失效，請重新登入。',
        err_403msg: '沒有操作權限，請重新登入。',
        err_500msg: '伺服器內部錯誤，請聯絡管理員。',
        err_time_out_msg: '網路請求逾時，請稍後再試。',
        err_other_msg: '網路請求失敗，請重新載入頁面。',
        err_data_msg: '資料不正確，請重試。',
      },
      err401: {
        title: '您尚未獲授權！🔐',
        text: '您沒有權限存取此頁面。請返回首頁！',
        btnText: '返回首頁',
      },
      err404: {
        title: '找不到頁面',
        text: '找不到您要查看的頁面！',
        btnText: '返回首頁',
      },
      saveSuccess: '儲存成功。',
      searchMore: '搜尋關鍵字',
      updateTitle: '新版本已準備就緒。要立即更新嗎？',
      updateBtnText: '立即更新',
      updateRemindBtnText: '5 分鐘後提醒',
    },
    loginPage: {
      title: '登入',
      label: {
        email: '電子郵件',
        password: '密碼',
      },
      err: {
        email: '必須是有效的電子郵件。',
        password: '請輸入密碼。',
      },
      placeholder: {
        email: '輸入您的電子郵件',
        password: '輸入您的密碼',
      },
      forgotPassword: '忘記密碼？',
      submitBtn: '登入',
      logout: '登出',
      newMessage: '第一次使用我們的平台？',
      newBtn: '建立帳戶',
      ssoLogin: '單一登入...',
      ssoLoginText: '使用臨時 Token {0} 進行單一登入...',
      ssoLoginTitle: '單一登入',
      ssoLoginBtnText: '帳戶登入',
      p1: '登入平台即表示您同意我們的',
      p2: '隱私權政策',
      p3: '和',
      p4: '條款與條件',
      t1: '一站式',
      t2: '平台。',
      subTitle: '連結人員、貨物與技術',
      desc: 'OneStop Connections 致力於提供無縫、安全且即時的資料驅動連結，支援物流配送流程。我們透過一系列業界領先的軟體解決方案實現這一目標，並以即時資料提供全流程可視性與效率。',
      privacyPolicy: {
        p1: '本企業決定在旗下媒體資產及網際網路範圍內收集之個人資料的使用方式。我們可能會收集您直接提交給我們的資料，也可能透過自動方式收集資料，包括 Cookie 所取得的資料（例如裝置資訊或 IP 位址）。',
        p2: '請閱讀我們的',
        p3: '隱私權政策',
        p4: '繼續使用本網站，即表示您同意我們的隱私權政策。',
        btnText: '接受',
      },
    },
    privacyPage: {
      title: '隱私權政策',
      desc: '我們非常重視您的隱私保護。當您使用 SJ Clemenger（以下稱「本服務」）時，我們將依照以下政策收集、使用、揭露並保護您的個人資訊。請仔細閱讀並充分理解本隱私權政策。',
      p1: {
        title: '1. 資訊收集',
        d1: '我們會收集您在使用本服務時主動提供的資訊，包括但不限於姓名、電子郵件地址和電話號碼等個人資訊。',
        d2: '我們會收集您使用本服務期間產生的資訊，例如操作紀錄、存取 IP 位址和裝置型號。',
        d3: '我們可能會透過 Cookie 或其他技術收集並儲存您存取本服務的相關資訊，以提供更好的使用體驗。',
      },
      p2: {
        title: '2. 資訊使用',
        d1: '我們使用所收集的資訊來提供、維護和改善本服務、處理交易、傳送通知，並確保本服務安全。',
      },
      p3: {
        title: '3. 資訊分享',
        d1: '除非取得您的明確同意，或法律要求我們這樣做，否則我們不會與第三方分享您的個人資訊。',
      },
      p4: {
        title: '4. 資料安全',
        d1: '我們採用業界標準的安全措施來保護您的個人資訊，包括加密傳輸與儲存。',
      },
      p5: {
        title: '5. Cookie 使用',
        d1: '我們使用 Cookie 和類似技術來提升使用體驗、分析網站流量並提供個人化內容。',
      },
      p6: {
        title: '6. 您的權利',
        d1: '您有權存取、更正和刪除您的個人資訊，或限制我們處理該等資訊。',
      },
      date: '最後更新：2025 年 1 月',
    },
    menuPage: {
      dashboard: '儀表板',

      freight: '貨運',
      booking: '訂艙',

      warehouse: '倉庫',
      warehouse_booking: '訂艙',

      po_management: 'PO 管理',
      po_details: 'PO 明細',
      po_management_reports: 'PO 報表',

      system: '系統',
      system_user: '使用者',
      system_group: '群組',
      system_security: '安全性',
      system_logs: '記錄',
    },
    dashboardPage,
    poPage: {
      title: {
        list: 'PO 清單',
      },
      button: {
        new: '新建 PO',
      },
      filter: {
        exRequiredDate: '出庫要求日期',
        deliveryRequiredDate: '交付要求日期',
        dateFrom: '開始日期',
        dateTo: '結束日期',
        poNumber: 'PO 編號',
        buyerName: '買方名稱',
        sellerName: '賣方名稱',
        poController: 'PO 控制員',
        transportMode: '運輸方式',
        origin: '起運地',
        destination: '目的地',
      },
      table: {
        headers: {
          poNumber: 'PO 編號',
          buyerName: '買方名稱',
          sellerName: '賣方名稱',
          orderDate: '訂單日期',
          status: '狀態',
          origin: '起運地',
          destination: '目的地',
          totalAmount: '總金額',
        },
      },
      menu: {
        edit: '編輯',
        delete: '刪除',
      },
      deleteDialog: {
        title: '確認刪除',
        message: '確定要刪除 PO {0} 嗎？此操作無法復原。',
        cancel: '取消',
        delete: '刪除',
      },
      message: {
        searchFailed: '搜尋失敗：{0}',
        unknownError: '未知錯誤',
        deleteSuccess: '刪除成功',
        deleteFailed: '刪除失敗：{0}',
      },
    },
    poReportsPage: {
      title: 'PO 報表',
      button: {
        export: '匯出報表',
        reset: '重設',
        applyFilter: '套用篩選',
      },
      filter: {
        dateFrom: '開始日期',
        dateTo: '結束日期',
        orderStatus: '訂單狀態',
        transportMode: '運輸方式',
      },
      statistics: {
        totalPOs: 'PO 總數',
        completed: '已完成',
        inProgress: '進行中',
        totalAmount: '總金額',
      },
      section: {
        statusDistribution: 'PO 狀態分布',
        transportModeDistribution: '運輸方式分布',
        monthlyTrend: '月度 PO 趨勢',
        topBuyers: '主要買方',
        topSellers: '主要賣方',
      },
      table: {
        status: '狀態',
        count: '數量',
        percentage: '百分比',
        amount: '金額',
        transportMode: '運輸方式',
        month: '月份',
        poCount: 'PO 數量',
        totalAmount: '總金額',
        avgAmount: '平均金額',
        trend: '趨勢',
        rank: '#',
        buyerName: '買方名稱',
        sellerName: '賣方名稱',
      },
      message: {
        exportComingSoon: '匯出功能即將實作',
      },
    },
    bookingPage,
    upload: {
      dropZone: {
        title: '拖曳文件到此處',
        subtitle: '或點擊下方按鈕選取文件',
      },
      buttons: {
        browse: '瀏覽文件',
        clear: '清空清單',
        upload: '上傳文件',
        ocr: 'OCR識別',
      },
      fields: {
        docType: '單證類型',
        ebookingVisible: 'EBooking Visible',
      },
      fileCount: '已選文件',
      ocr: {
        title: 'OCR 委託',
        processing: '正在進行 OCR 識別...',
        success: 'OCR 識別成功',
        failed: 'OCR 識別失敗，請重試',
      },
      messages: {
        noFileSelected: '請選擇要上傳的文件',
        noJobNumber: '請輸入編號',
        noDocType: '請選擇文件類型',
      },
      success: {
        uploadSuccess: '{0} Doc is uploaded',
      },
      error: {
        uploadError: 'Upload error: {0}',
      },
    },
    systemPage,
    warehouseOrder,
  },
}
