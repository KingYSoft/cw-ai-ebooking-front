export default {
  common: {
    yes: '是',
    no: '否',
    active: '啟用',
    inactive: '停用',
    new: '新建',
    save: '儲存',
    delete: '刪除',
    cancel: '取消',
    apply: '套用',
    preview: '預覽',
    selected: '已選 {0} 項',
    queryKeywordsPlaceholder: '輸入查詢關鍵字',
  },
  user: {
    list: {
      title: '使用者',
      new: '新建',
      headers: {
        loginName: '登入名稱',
        fullName: '姓名',
        email: '電子郵件',
        mobilePhone: '手機號碼',
        canLogin: '可登入',
        admin: '管理員',
        status: '狀態',
      },
      filter: {
        loginName: '登入名稱',
        fullName: '姓名',
        email: '電子郵件',
        mobilePhone: '手機號碼',
      },
    },
    edit: {
      newTitle: '新建使用者',
      tabTitle: 'USER-{login_name}',
      tabs: {
        detail: '詳情',
        warehouse: '倉庫',
      },
      dialog: {
        notExists: {
          title: '使用者不存在。',
          message: '此使用者不存在。您可以新建使用者或關閉頁面。',
          newUser: '新建使用者',
        },
      },
      validation: {
        loginNameRequired: '登入名稱不能為空。',
        passwordRequired: '密碼不能為空。',
        orgHeaderRequired: '組織抬頭不能為空。',
      },
      detail: {
        section: {
          loginInfo: '登入資訊',
          employeeDetails: '員工詳情',
          employeeStatus: '員工狀態',
        },
        field: {
          loginName: '登入名稱',
          password: '密碼',
          fullName: '姓名',
          shortCode: '簡稱',
          emailAddress: '電子郵件地址',
          mobilePhone: '手機號碼',
          canLogin: '可登入',
          lastLogonDate: '最後登入日期',
          orgHeader: '組織抬頭',
          isActive: '是否啟用',
        },
      },
      warehouse: {
        selectWarehouses: '選擇倉庫',
        queryWarehouse: '查詢倉庫：',
        headers: {
          code: '代碼',
          name: '名稱',
          active: '啟用',
        },
      },
    },
  },
  group: {
    list: {
      title: '群組',
      new: '新建',
      headers: {
        code: '代碼',
        description: '描述',
        admin: '管理員',
        status: '狀態',
      },
      filter: {
        code: '代碼',
        description: '描述',
      },
    },
    edit: {
      newTitle: '新建群組',
      tabTitle: 'GROUP-{code}',
      tabs: {
        groupDetail: '群組詳情',
        users: '使用者',
        permission: '權限',
      },
      dialog: {
        notExists: {
          title: '群組不存在。',
          message: '此群組不存在。您可以新建群組。',
          newGroup: '新建群組',
        },
      },
      validation: {
        codeRequired: '代碼不能為空。',
      },
      detail: {
        section: {
          groupDetail: '群組詳情',
        },
        field: {
          code: '代碼',
          description: '描述',
          isActive: '是否啟用',
        },
      },
      users: {
        selectUsers: '選擇使用者',
        queryUser: '查詢使用者：',
        headers: {
          loginName: '登入名稱',
          fullName: '姓名',
          email: '電子郵件',
          short: '簡稱',
          active: '啟用',
        },
      },
    },
  },
  logs: {
    list: {
      title: '稽核記錄',
      headers: {
        serviceName: '服務名稱',
        methodName: '方法名稱',
        clientIp: '用戶端 IP',
        userName: '使用者名稱',
        executionTime: '執行時間',
        durationMs: '耗時 (ms)',
      },
      filter: {
        executionTime: '執行時間',
        methodName: '方法名稱',
        serviceName: '服務名稱',
        clientIp: '用戶端 IP',
        clientName: '用戶端名稱',
        executionDuration: '執行耗時',
      },
      menu: {
        preview: '預覽',
      },
    },
    preview: {
      title: '稽核記錄預覽',
      field: {
        id: 'ID',
        serviceName: '服務名稱',
        userName: '使用者名稱',
        methodName: '方法名稱',
        executionTime: '執行時間',
        executionDuration: '執行耗時 (ms)',
        clientIpAddress: '用戶端 IP 位址',
        browserInfo: '瀏覽器資訊',
        parameters: '參數',
        returnValue: '回傳值',
        exceptionMessage: '例外訊息',
        exception: '例外',
      },
    },
  },
  security: {
    title: '清除系統快取',
    description: '將清除系統中的所有快取。',
    clearAllCache: '清除全部快取',
    dialog: {
      title: '清除系統快取',
      message: '確定要清除系統快取嗎？',
    },
  },
}
