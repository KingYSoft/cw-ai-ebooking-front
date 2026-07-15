export default {
  common: {
    yes: '是',
    no: '否',
    active: '启用',
    inactive: '停用',
    new: '新建',
    save: '保存',
    delete: '删除',
    cancel: '取消',
    apply: '应用',
    preview: '预览',
    selected: '已选 {0} 项',
    queryKeywordsPlaceholder: '输入查询关键字',
  },
  user: {
    list: {
      title: '用户',
      new: '新建',
      headers: {
        loginName: '登录名',
        fullName: '姓名',
        email: '邮箱',
        mobilePhone: '手机号',
        canLogin: '可登录',
        admin: '管理员',
        status: '状态',
      },
      filter: {
        loginName: '登录名',
        fullName: '姓名',
        email: '邮箱',
        mobilePhone: '手机号',
      },
    },
    edit: {
      newTitle: '新建用户',
      tabTitle: 'USER-{login_name}',
      tabs: {
        detail: '详情',
        warehouse: '仓库',
      },
      dialog: {
        notExists: {
          title: '用户不存在。',
          message: '该用户不存在。您可以新建用户或关闭页面。',
          newUser: '新建用户',
        },
      },
      validation: {
        loginNameRequired: '登录名不能为空。',
        passwordRequired: '密码不能为空。',
        orgHeaderRequired: '组织抬头不能为空。',
      },
      detail: {
        section: {
          loginInfo: '登录信息',
          employeeDetails: '员工详情',
          employeeStatus: '员工状态',
        },
        field: {
          loginName: '登录名',
          password: '密码',
          fullName: '姓名',
          shortCode: '简称',
          emailAddress: '邮箱地址',
          mobilePhone: '手机号',
          canLogin: '可登录',
          lastLogonDate: '最后登录日期',
          orgHeader: '组织抬头',
          isActive: '是否启用',
        },
      },
      warehouse: {
        selectWarehouses: '选择仓库',
        queryWarehouse: '查询仓库：',
        headers: {
          code: '代码',
          name: '名称',
          active: '启用',
        },
      },
    },
  },
  group: {
    list: {
      title: '组',
      new: '新建',
      headers: {
        code: '代码',
        description: '描述',
        admin: '管理员',
        status: '状态',
      },
      filter: {
        code: '代码',
        description: '描述',
      },
    },
    edit: {
      newTitle: '新建组',
      tabTitle: 'GROUP-{code}',
      tabs: {
        groupDetail: '组详情',
        users: '用户',
        permission: '权限',
      },
      dialog: {
        notExists: {
          title: '组不存在。',
          message: '该组不存在。您可以新建组。',
          newGroup: '新建组',
        },
      },
      validation: {
        codeRequired: '代码不能为空。',
      },
      detail: {
        section: {
          groupDetail: '组详情',
        },
        field: {
          code: '代码',
          description: '描述',
          isActive: '是否启用',
        },
      },
      users: {
        selectUsers: '选择用户',
        queryUser: '查询用户：',
        headers: {
          loginName: '登录名',
          fullName: '姓名',
          email: '邮箱',
          short: '简称',
          active: '启用',
        },
      },
    },
  },
  logs: {
    list: {
      title: '审计日志',
      headers: {
        serviceName: '服务名称',
        methodName: '方法名称',
        clientIp: '客户端 IP',
        userName: '用户名',
        executionTime: '执行时间',
        durationMs: '耗时 (ms)',
      },
      filter: {
        executionTime: '执行时间',
        methodName: '方法名称',
        serviceName: '服务名称',
        clientIp: '客户端 IP',
        clientName: '客户端名称',
        executionDuration: '执行耗时',
      },
      menu: {
        preview: '预览',
      },
    },
    preview: {
      title: '审计日志预览',
      field: {
        id: 'ID',
        serviceName: '服务名称',
        userName: '用户名',
        methodName: '方法名称',
        executionTime: '执行时间',
        executionDuration: '执行耗时 (ms)',
        clientIpAddress: '客户端 IP 地址',
        browserInfo: '浏览器信息',
        parameters: '参数',
        returnValue: '返回值',
        exceptionMessage: '异常信息',
        exception: '异常',
      },
    },
  },
  security: {
    title: '清除系统缓存',
    description: '将清除系统中的所有缓存。',
    clearAllCache: '清除全部缓存',
    dialog: {
      title: '清除系统缓存',
      message: '确定要清除系统缓存吗？',
    },
  },
}
