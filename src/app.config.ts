export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/me/index',
    'pages/org/index',
    'pages/orders/index',
    'pages/voucher/index',
    'pages/chooseLogin/index',
    'pages/node/index',
    'pages/node/policy',
    'pages/product/index',
    'pages/productNew/index',
    'pages/orgNew/index',
    'pages/dineNew/index',
    'pages/withdrawNew/index',
    'pages/orgDetail/index',
    'pages/orderDetail/index',
    'pages/returnDetail/index',
    'pages/retailDetail/index',
    'pages/withdrawDetail/index',
    'pages/dineDetail/index',
    'pages/productDetail/index',
    'pages/qr/index',
    'pages/customerInfo/index',
    'pages/about/index',
    'pages/orgEdit/index',
    'pages/referral/index',
    'pages/poster/index',
    'pages/search/index',
    'pages/reg/index',
    'pages/orgSignUp/index',
    'pages/stock/index',
    'pages/orgReferral/index',
    'pages/share/index',
    'pages/transComplete/index',
    'pages/myReg/index',
    'pages/scan/index',
    'pages/scan/storeman',
    'pages/scan/box',
    'pages/scan/bottle',
    'pages/myClaim/index',
    'pages/orgClaim/index',
    'pages/claim/index',
    'pages/claim/salesman',
    'pages/waiterSignUp/index',
    'pages/bindOrgAdmin/index',
    'pages/addStaff/index',
    'pages/claimQr/index',
    'pages/claimSettle/index',
    'pages/collect/index',
    'pages/scan/ret',
    'pages/settle/index',
    'pages/settle/qr',
    'pages/settle/settle',
    'pages/wallet/index',
    'pages/borrow/index',
    'pages/borrow/new',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // custom: true,
    selectedColor: '#000000',
    list: [
      { // 0
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": './icon/home.png',
        "selectedIconPath": './icon/home-fill.png'
      },
      { // 1
        "pagePath": "pages/org/index",
        "text": "门店",
        "iconPath": './icon/company.png',
        "selectedIconPath": './icon/company-fill.png'
      },
      { // 3
        "pagePath": "pages/orders/index",
        "text": "订单",
        "iconPath": './icon/order.png',
        "selectedIconPath": './icon/order-fill.png'
      },
      { // 9
        "pagePath": "pages/me/index",
        "text": "我",
        "iconPath": './icon/account.png',
        "selectedIconPath": './icon/account-fill.png'
      },
    ]
  },
 requiredPrivateInfos: [
   "getLocation",
 ],
 permission: {
   'scope.userLocation': {
     desc: "你的位置信息将用于定位门店"
   }
 },
 lazyCodeLoading: 'requiredComponents',
})
