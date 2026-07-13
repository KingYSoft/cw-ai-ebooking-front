import bookingPageEdit from './blocks/bookingPage/editEn'
import systemPage from './blocks/systemPage/en'
import warehouseOrder from './blocks/warehouseOrder/en'

export default {
  custom: {
    unsavedInputData: {
      title: 'Unsaved changes',
      message: 'This page has unsaved changes.',
    },
    dataTable: {
      filter: 'FILTER',
      menus: {
        inputLabel: 'Search Items',
        inputPlaceholder: 'Search items',
      },
      header: {
        dialog: {
          title: 'Columns of Hidden',
        },
      },
    },
    tableLayout: {
      headerSettings: 'Settings',
      availableFields: 'Available',
      selectedFields: 'Selected',
    },
    branchFilter: {
      menus: {
        inputLabel: 'Search Items',
        inputPlaceholder: 'Search items',
      },
      tab0: {
        title: 'Select branches',
        subtitle: 'Select branches to filter data.',
      },
      tab1: {
        title: 'Switch view type',
        subtitle: 'Switch view type to filter data.',
        own: {
          title: 'Own only',
          subtitle: 'View own to filter data.',
        },
      },
    },
    da: {
      demo: 'demo',
    },
    op: {
      equal: 'Equal',
      notEqual: 'Not Equal',
      contain: 'Contain',
      notContain: 'Not Contain',
    },
    dialog: {
      btn: {
        new: 'New',
        add: 'Add',
        edit: 'Edit',
        close: 'Close',
        save: 'Save',
        cancel: 'Cancel',
        clear: 'Clear',
        ok: 'Ok',
        reset: 'Reset',
        search: 'Search',
        import: 'Improt',
        confirm: 'Confirm',
        reload: 'Reload',
        more: 'More',
      },
    },
    app: {
      title: 'SJ Clemenger EBooking',
      search: 'Search',
      searchPlaceholder: 'Enter search keyword',
      action: 'Action',
      loading: 'Refreshing Application...',
      http: {
        err_title: 'Network Request Error',
        err_401msg: 'Login is invalid, please login again.',
        err_403msg: 'No operation permission, please login again',
        err_500msg: 'Internal server exception, contact administrator',
        err_time_out_msg: 'Network request timeout, please try again.',
        err_other_msg: 'Network request failed, reload page again.',
        err_data_msg: 'Data incorrect, please try again.',
      },
      err401: {
        title: 'You are not authorized! 🔐',
        text: 'You do not have permission to access this page. Go Home!',
        btnText: 'Go Home',
      },
      err404: {
        title: 'Page Not Found',
        text: 'We could not find the page you are looking for!',
        btnText: 'Go Home',
      },
      saveSuccess: 'Saved successfully.',
      searchMore: 'keywords of search',
      updateTitle: 'New version is ready. Update now ?',
      updateBtnText: 'Update Now',
      updateRemindBtnText: 'Remind 5 minutes later',
    },
    loginPage: {
      title: 'Sign in',
      label: {
        email: 'Email',
        password: 'Password',
      },
      err: {
        email: 'Must be a valid e-mail.',
        password: 'Password is required.',
      },
      placeholder: {
        email: 'Enter your email',
        password: 'Enter your password',
      },
      forgotPassword: 'Forgot password?',
      submitBtn: 'Login',
      logout: 'Logout',
      newMessage: 'New on our platform?',
      newBtn: 'Create an account',
      ssoLogin: 'SSO Login...',
      ssoLoginText: 'Use temp token {0} for sso login...',
      ssoLoginTitle: 'SSO Login',
      ssoLoginBtnText: 'Account Login',
      p1: 'By logging into the Platform you are hereby agreeing to our',
      p2: 'Privacy Policy',
      p3: 'and',
      p4: 'Terms and Conditions',
      t1: 'One',
      t2: 'Stop.',
      subTitle: 'Connecting people, goods & technology',
      desc: 'OneStop Connections, is on a mission is to deliver seamless, secure, real-time data fuelled connections that power the logistics of delivery. We do this via our suite of industry leading software solutions, powered by real time data for through-the-line visibility & efficiency.',
      privacyPolicy: {
        p1: 'This business determines the use of personal data collected on our media properties and across the internet. We may collect data that you submit to us directly or data that we collect automatically including from cookies (such as device information or IP address).',
        p2: 'Please read our',
        p3: 'Privacy Policy',
        p4: 'By continuing to use the site, you agree to our Privacy Policy.',
        btnText: 'Accept',
      },
    },
    privacyPage: {
      title: 'Privacy Policy',
      desc: 'We take the protection of your privacy extremely seriously. When you use the SJ Clemenger (hereinafter referred to as "this Service"), we will collect, use, disclose and protect your personal information in accordance with the following policy. Please read and fully understand this Privacy Policy carefully.',
      p1: {
        title: '1. Information Collection',
        d1: 'We collect information you voluntarily provide when using the Service, including but not limited to personal information such as your name, email address and phone number.',
        d2: 'We collect information generated during your use of the Service, such as operation logs, access IP addresses and device models.',
        d3: 'We may collect and store information related to your access to the Service through Cookies or other technologies to provide you with a better user experience.',
      },
      p2: {
        title: '2. Information Use',
        d1: 'We use the collected information to provide, maintain and improve our Service, process transactions, send notifications and ensure the security of the Service.',
      },
      p3: {
        title: '3. Information Sharing',
        d1: 'We will not share your personal information with third parties unless we obtain your explicit consent or are required to do so by law.',
      },
      p4: {
        title: '4. Data Security',
        d1: 'We adopt industry-standard security measures to protect your personal information, including encrypted transmission and storage.',
      },
      p5: {
        title: '5. Cookie Usage',
        d1: 'We use Cookies and similar technologies to enhance user experience, analyze website traffic and provide personalized content.',
      },
      p6: {
        title: '6. Your Rights',
        d1: 'You have the right to access, correct and delete your personal information, or restrict our processing of such information.',
      },
      date: 'Last Updated: January 2025',
    },
    menuPage: {
      dashboard: 'Dashboard',

      freight: 'Freight',
      booking: 'Booking',

      warehouse: 'Warehouse',
      warehouse_booking: 'Booking',

      po_management: 'PO Management',
      po_details: 'PO Details',
      po_management_reports: 'PO Reports',

      system: 'System',
      system_user: 'User',
      system_group: 'Group',
      system_security: 'Security',
      system_logs: 'Logs',
    },
    poPage: {
      title: {
        list: 'PO List',
      },
      button: {
        new: 'New PO',
      },
      filter: {
        exRequiredDate: 'Ex Required Date',
        deliveryRequiredDate: 'Delivery Required Date',
        dateFrom: 'Date From',
        dateTo: 'Date To',
        poNumber: 'PO Number',
        buyerName: 'Buyer Name',
        sellerName: 'Seller Name',
        poController: 'PO Controller',
        transportMode: 'Transport Mode',
        origin: 'Origin',
        destination: 'Destination',
      },
      table: {
        headers: {
          poNumber: 'PO Number',
          buyerName: 'Buyer Name',
          sellerName: 'Seller Name',
          orderDate: 'Order Date',
          status: 'Status',
          origin: 'Origin',
          destination: 'Destination',
          totalAmount: 'Total Amount',
        },
      },
      menu: {
        edit: 'Edit',
        delete: 'Delete',
      },
      deleteDialog: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete PO {0}? This action cannot be undone.',
        cancel: 'Cancel',
        delete: 'Delete',
      },
      message: {
        searchFailed: 'Search failed: {0}',
        unknownError: 'Unknown error',
        deleteSuccess: 'Delete successful',
        deleteFailed: 'Delete failed: {0}',
      },
    },
    poReportsPage: {
      title: 'PO Reports',
      button: {
        export: 'Export Report',
        reset: 'Reset',
        applyFilter: 'Apply Filter',
      },
      filter: {
        dateFrom: 'Date From',
        dateTo: 'Date To',
        orderStatus: 'Order Status',
        transportMode: 'Transport Mode',
      },
      statistics: {
        totalPOs: 'Total POs',
        completed: 'Completed',
        inProgress: 'In Progress',
        totalAmount: 'Total Amount',
      },
      section: {
        statusDistribution: 'PO Status Distribution',
        transportModeDistribution: 'Transport Mode Distribution',
        monthlyTrend: 'Monthly PO Trend',
        topBuyers: 'Top Buyers',
        topSellers: 'Top Sellers',
      },
      table: {
        status: 'Status',
        count: 'Count',
        percentage: 'Percentage',
        amount: 'Amount',
        transportMode: 'Transport Mode',
        month: 'Month',
        poCount: 'PO Count',
        totalAmount: 'Total Amount',
        avgAmount: 'Avg. Amount',
        trend: 'Trend',
        rank: '#',
        buyerName: 'Buyer Name',
        sellerName: 'Seller Name',
      },
      message: {
        exportComingSoon: 'Export functionality will be implemented',
      },
    },
    bookingPage: {
      form: {
        shipper_name: {
          err: 'Shipper Name not null.',
        },
        consignee_name: {
          err: 'Consignee Name not null.',
        },
        bkg_transport_mode: {
          err: 'Transport Mode not null.',
        },
        bkg_origin: {
          err: 'Origin not null.',
        },
        bkg_destination: {
          err: 'Destination not null.',
        },
        bkg_load_port: {
          err: 'Load not null.',
        },
        bkg_etd: {
          err: 'ETD not null.',
        },
        bkg_eta: {
          err: 'ETA not null.',
        },
        bkg_cargo_ready: {
          err: 'Cargo Ready Date not null.',
        },
        etd_must_be_before_cargo_ready: {
          err: 'Cargo Ready date must be earlier than ETD.',
        },
        eta_vs_etd_sea: {
          err: 'For ocean (SEA), ETA must be later than ETD (same calendar day is not allowed).',
        },
        eta_vs_etd_air: {
          err: 'For air (AIR), ETA cannot be earlier than ETD.',
        },
        bkg_packing_mode: {
          err: 'Container not null.',
        },
        bkg_inco: {
          err: 'Inco Term not null.',
        },
        bkg_service_level: {
          err: 'Service Level not null.',
        },
        bkg_actual_volume: {
          err: 'CBM must be greater than 0.',
        },
        bkg_actual_weight: {
          err: 'Gross Weight must be greater than 0.',
        },
        bkg_actual_chargeable: {
          err: 'Chargeable Weight must be greater than 0.',
        },
        bkg_volume_weight: {
          err: 'Volume Weight must be greater than 0.',
        },
        bkg_total_package_count: {
          err: 'No. of Package must be greater than 0.',
        },
        bkg_transit_time: {
          err: 'Transit Time must be greater than 0.',
        },
        bkg_goods_value: {
          err: 'Cargo Value must be greater than 0.',
        },
        bkg_goods_value_currency: {
          err: 'Cargo Value Currency not null.',
        },
        bkg_insurance_value: {
          err: 'Ins. Value must be greater than 0.',
        },
        bkg_insurance_currency: {
          err: 'Ins. Value Currency not null.',
        },
        bkg_freight_terms: {
          err: 'Freight Terms not null.',
        },
        bkg_release_type: {
          err: 'Release Type not null.',
        },
        bkg_commodity: {
          err: 'Commodity not null.',
        },
        bkg_goods_description: {
          err: 'Good Desc. not null.',
        },
        bkg_marks_nos: {
          err: 'Marks & No. not null.',
        },
        pac_container_type: {
          err: 'Container Type not null.',
        },
        pac_container_count: {
          err: 'Container Count must be greater than 0.',
        },
        pac_package_count: {
          err: 'Pieces must be greater than 0.',
        },
        pac_pack_type: {
          err: 'Pack Type not null.',
        },
        pac_gross_weight: {
          err: 'Gross Wt must be greater than 0.',
        },
        pac_actual_volume: {
          err: 'Volume must be greater than 0.',
        },
        wso_transport_mode: {
          err: 'Transport Mode not null.',
        },
        wso_packing_mode: {
          err: 'Container not null.',
        },
        wso_load_port: {
          err: 'Load not null.',
        },
        wso_etd: {
          err: 'ETD not null.',
        },
        wso_cargo_ready: {
          err: 'Cargo Ready Date not null.',
        },
        wso_actual_weight: {
          err: 'Gross Weight must be greater than 0.',
        },
        wso_actual_volume: {
          err: 'CBM must be greater than 0.',
        },
        wso_volume_weight: {
          err: 'Volume Weight must be greater than 0.',
        },
        wso_actual_chargeable: {
          err: 'Chargeable Weight must be greater than 0.',
        },
        wso_total_package_count: {
          err: 'No. of Package must be greater than 0.',
        },
        wso_inco: {
          err: 'Inco Term not null.',
        },
        wso_transit_time: {
          err: 'Transit Time must be greater than 0.',
        },
        wso_goods_value: {
          err: 'Cargo Value must be greater than 0.',
        },
        wso_insurance_value: {
          err: 'Ins. Value must be greater than 0.',
        },
        wso_freight_terms: {
          err: 'Freight Terms not null.',
        },
        wso_release_type: {
          err: 'Release Type not null.',
        },
        wso_commodity: {
          err: 'Commodity not null.',
        },
        wso_goods_description: {
          err: 'Good Desc. not null.',
        },
        wso_marks_nos: {
          err: 'Marks & No. not null.',
        },
      },
      edit: bookingPageEdit,
      list: {
        pageTitle: 'Booking Details',
        new: 'New',
        status: 'Status:',
        startDate: 'Start Date',
        endDate: 'End Date',
        jobNumber: 'Job Number',
        tableHeaders: {
          bookingNo: 'Booking No.',
          status: 'Status',
          transMode: 'Trans Mode',
          containerMode: 'Container Mode',
          houseBill: 'House Bill',
          shipperName: 'Shipper Name',
          consigneeName: 'Consignee Name',
          origin: 'Origin',
          destination: 'Destination',
          crd: 'CRD',
          etd: 'ETD',
          eta: 'ETA',
          grossWeight: 'Gross Weight',
          cbm: 'CBM',
          freightTerm: 'Freight Term',
          inco: 'Inco',
        },
        menu: {
          copy: 'Copy',
          deactivate: 'Deactivate',
        },
        listStatus: {
          submitted: 'Submitted',
          under_review: 'Under review',
          confirmed: 'Confirmed',
          cancelled: 'Cancelled',
          rejected: 'Rejected',
        },
      },
    },
    systemPage,
    warehouseOrder,
  },
}
