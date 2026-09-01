export default {
  common: {
    yes: 'Có',
    no: 'Không',
    active: 'Đang hoạt động',
    inactive: 'Không hoạt động',
    new: 'Mới',
    save: 'Lưu',
    delete: 'Xóa',
    cancel: 'Hủy',
    apply: 'Áp dụng',
    preview: 'Xem trước',
    selected: 'Đã chọn {0}',
    queryKeywordsPlaceholder: 'nhập từ khóa truy vấn',
  },
  user: {
    list: {
      title: 'Người dùng',
      new: 'Mới',
      headers: {
        loginName: 'Tên đăng nhập',
        fullName: 'Họ tên',
        email: 'Email',
        mobilePhone: 'Điện thoại',
        canLogin: 'Có thể đăng nhập',
        admin: 'Quản trị',
        status: 'Trạng thái',
      },
      filter: {
        loginName: 'Tên đăng nhập',
        fullName: 'Họ tên',
        email: 'Email',
        mobilePhone: 'Điện thoại',
      },
    },
    edit: {
      newTitle: 'Người dùng mới',
      tabTitle: 'USER-{login_name}',
      tabs: {
        detail: 'Chi tiết',
        warehouse: 'Kho',
      },
      dialog: {
        notExists: {
          title: 'Người dùng không tồn tại.',
          message: 'Người dùng này không tồn tại. Bạn có thể tạo người dùng mới hoặc đóng trang.',
          newUser: 'Người dùng mới',
        },
      },
      validation: {
        loginNameRequired: 'Tên đăng nhập là bắt buộc.',
        passwordRequired: 'Mật khẩu là bắt buộc.',
        orgHeaderRequired: 'Tổ chức đầu mối là bắt buộc.',
      },
      detail: {
        section: {
          loginInfo: 'Thông tin đăng nhập',
          employeeDetails: 'Chi tiết nhân viên',
          employeeStatus: 'Trạng thái nhân viên',
        },
        field: {
          loginName: 'Tên đăng nhập',
          password: 'Mật khẩu',
          fullName: 'Họ tên',
          shortCode: 'Mã ngắn',
          emailAddress: 'Địa chỉ email',
          mobilePhone: 'Điện thoại',
          canLogin: 'Có thể đăng nhập',
          lastLogonDate: 'Ngày đăng nhập cuối',
          country: 'Quốc gia',
          port: 'Cảng',
          orgHeader: 'Tổ chức đầu mối',
          isActive: 'Đang hoạt động',
        },
      },
      warehouse: {
        selectWarehouses: 'Chọn kho',
        queryWarehouse: 'Truy vấn kho:',
        headers: {
          code: 'Mã',
          name: 'Tên',
          active: 'Hoạt động',
        },
      },
    },
  },
  group: {
    list: {
      title: 'Nhóm',
      new: 'Mới',
      headers: {
        code: 'Mã',
        description: 'Mô tả',
        admin: 'Quản trị',
        status: 'Trạng thái',
      },
      filter: {
        code: 'Mã',
        description: 'Mô tả',
      },
    },
    edit: {
      newTitle: 'Nhóm mới',
      tabTitle: 'GROUP-{code}',
      tabs: {
        groupDetail: 'Chi tiết nhóm',
        users: 'Người dùng',
        permission: 'Quyền',
      },
      dialog: {
        notExists: {
          title: 'Nhóm không tồn tại.',
          message: 'Nhóm này không tồn tại. Bạn có thể tạo nhóm mới.',
          newGroup: 'Nhóm mới',
        },
      },
      validation: {
        codeRequired: 'Mã là bắt buộc.',
      },
      detail: {
        section: {
          groupDetail: 'Chi tiết nhóm',
        },
        field: {
          code: 'Mã',
          description: 'Mô tả',
          isActive: 'Đang hoạt động',
        },
      },
      users: {
        selectUsers: 'Chọn người dùng',
        queryUser: 'Truy vấn người dùng:',
        headers: {
          loginName: 'Tên đăng nhập',
          fullName: 'Họ tên',
          email: 'Email',
          short: 'Mã ngắn',
          active: 'Hoạt động',
        },
      },
    },
  },
  logs: {
    list: {
      title: 'Nhật ký kiểm toán',
      headers: {
        serviceName: 'Tên dịch vụ',
        methodName: 'Tên phương thức',
        clientIp: 'IP máy khách',
        userName: 'Tên người dùng',
        executionTime: 'Thời gian thực thi',
        durationMs: 'Thời lượng (ms)',
      },
      filter: {
        executionTime: 'Thời gian thực thi',
        methodName: 'Tên phương thức',
        serviceName: 'Tên dịch vụ',
        clientIp: 'IP máy khách',
        clientName: 'Tên máy khách',
        executionDuration: 'Thời lượng thực thi',
      },
      menu: {
        preview: 'Xem trước',
      },
    },
    preview: {
      title: 'Xem trước nhật ký kiểm toán',
      field: {
        id: 'ID',
        serviceName: 'Tên dịch vụ',
        userName: 'Tên người dùng',
        methodName: 'Tên phương thức',
        executionTime: 'Thời gian thực thi',
        executionDuration: 'Thời lượng thực thi (ms)',
        clientIpAddress: 'Địa chỉ IP máy khách',
        browserInfo: 'Thông tin trình duyệt',
        parameters: 'Tham số',
        returnValue: 'Giá trị trả về',
        exceptionMessage: 'Thông báo ngoại lệ',
        exception: 'Ngoại lệ',
      },
    },
  },
  security: {
    title: 'Xóa bộ nhớ đệm hệ thống',
    description: 'Tất cả bộ nhớ đệm trong hệ thống sẽ bị xóa.',
    clearAllCache: 'Xóa toàn bộ bộ nhớ đệm',
    dialog: {
      title: 'Xóa bộ nhớ đệm hệ thống',
      message: 'Bạn có chắc muốn xóa bộ nhớ đệm hệ thống?',
    },
  },
}
