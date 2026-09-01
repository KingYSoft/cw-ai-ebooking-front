export default {
  common: {
    yes: 'Yes',
    no: 'No',
    active: 'Active',
    inactive: 'Inactive',
    new: 'New',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    apply: 'Apply',
    preview: 'Preview',
    selected: '{0} selected',
    queryKeywordsPlaceholder: 'input query keywords',
  },
  user: {
    list: {
      title: 'Users',
      new: 'New',
      headers: {
        loginName: 'Login Name',
        fullName: 'Full Name',
        email: 'Email',
        mobilePhone: 'Mobile Phone',
        canLogin: 'Can Login',
        admin: 'Admin',
        status: 'Status',
      },
      filter: {
        loginName: 'Login Name',
        fullName: 'Full Name',
        email: 'Email',
        mobilePhone: 'Mobile Phone',
      },
    },
    edit: {
      newTitle: 'New User',
      tabTitle: 'USER-{login_name}',
      tabs: {
        detail: 'Detail',
        warehouse: 'Warehouse',
      },
      dialog: {
        notExists: {
          title: 'User Not Exists.',
          message: 'This user not exists. You can new user or close page.',
          newUser: 'New User',
        },
      },
      validation: {
        loginNameRequired: 'Login Name is required.',
        passwordRequired: 'Password is required.',
        orgHeaderRequired: 'Org Header is required.',
      },
      detail: {
        section: {
          loginInfo: 'Login Info',
          employeeDetails: 'Employee Details',
          employeeStatus: 'Employee Status',
        },
        field: {
          loginName: 'Login Name',
          password: 'Password',
          fullName: 'Full Name',
          shortCode: 'Short Code',
          emailAddress: 'Email Address',
          mobilePhone: 'Mobile Phone',
          canLogin: 'Can Login',
          lastLogonDate: 'Last Logon Date',
          country: 'Country',
          port: 'Port',
          orgHeader: 'Org Header',
          isActive: 'Is Active',
        },
      },
      warehouse: {
        selectWarehouses: 'Select Warehouses',
        queryWarehouse: 'Query Warehouse:',
        headers: {
          code: 'Code',
          name: 'Name',
          active: 'Active',
        },
      },
    },
  },
  group: {
    list: {
      title: 'Groups',
      new: 'New',
      headers: {
        code: 'Code',
        description: 'Description',
        admin: 'Admin',
        status: 'Status',
      },
      filter: {
        code: 'Code',
        description: 'Description',
      },
    },
    edit: {
      newTitle: 'New Group',
      tabTitle: 'GROUP-{code}',
      tabs: {
        groupDetail: 'Group Detail',
        users: 'Users',
        permission: 'Permission',
      },
      dialog: {
        notExists: {
          title: 'Group Not Exists.',
          message: 'This group not exists. You can new group.',
          newGroup: 'New Group',
        },
      },
      validation: {
        codeRequired: 'Code is required.',
      },
      detail: {
        section: {
          groupDetail: 'Group Detail',
        },
        field: {
          code: 'Code',
          description: 'Description',
          isActive: 'Is Active',
        },
      },
      users: {
        selectUsers: 'Select Users',
        queryUser: 'Query User:',
        headers: {
          loginName: 'Login Name',
          fullName: 'Full Name',
          email: 'Email',
          short: 'Short',
          active: 'Active',
        },
      },
    },
  },
  logs: {
    list: {
      title: 'Audit Logs',
      headers: {
        serviceName: 'Service Name',
        methodName: 'Method Name',
        clientIp: 'Client IP',
        userName: 'User Name',
        executionTime: 'Execution Time',
        durationMs: 'Duration (ms)',
      },
      filter: {
        executionTime: 'Execution Time',
        methodName: 'Method Name',
        serviceName: 'Service Name',
        clientIp: 'Client IP',
        clientName: 'Client Name',
        executionDuration: 'Execution Duration',
      },
      menu: {
        preview: 'Preview',
      },
    },
    preview: {
      title: 'Audit Log Preview',
      field: {
        id: 'ID',
        serviceName: 'Service Name',
        userName: 'User Name',
        methodName: 'Method Name',
        executionTime: 'Execution Time',
        executionDuration: 'Execution Duration (ms)',
        clientIpAddress: 'Client IP Address',
        browserInfo: 'Browser Info',
        parameters: 'Parameters',
        returnValue: 'Return Value',
        exceptionMessage: 'Exception Message',
        exception: 'Exception',
      },
    },
  },
  security: {
    title: 'Clear System Cache',
    description: 'All caches in the system will be cleared.',
    clearAllCache: 'Clear All Cache',
    dialog: {
      title: 'Clear System Cache',
      message: 'Are you sure want to clear system cache?',
    },
  },
}
