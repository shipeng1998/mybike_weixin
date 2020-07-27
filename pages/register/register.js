// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["86", "80", "84", "87"], //手机号码的国家编码
    countryCodeIndex: 0,
    phoneNum: ""     //手机号
  },
  bindCountryCodeChange:function(e){
             this.setData({
              countryCodeIndex:e.detail.value
             })
  },
  inputPhoneNum:function(e){
           this.setData({
             phoneNum:e.detail.value
           })
  },
  genVerifyCode:function(e){
    //国家编码
    var index=this.data.countryCodeIndex;
    var countryCode=this.data.countryCodes[index];
    //电话号码
    var phoneNum=this.data.phoneNum;
    //请求后台，发送一个验证码短信
    wx.request({
      url: wx.getStorageSync('url')+'/genCode',
      //以表单方式传参到后台
      header:{'content-type':'application/x-www-form-urlencoded'},
      data:{
        nationCode: countryCode,
        phoneNum:phoneNum
      },
      method:'POST',
      success:function(e){
        if(e.data.code==1){
          wx.showToast({
            title: '验证码已发出',
            icon:'success'
          });

        }
     
      }
    });


  },

  formSubmit:function(e){
        var phoneNum=e.detail.value.phoneNum;
       
        var verifyCode=e.detail.value.verifyCode;
        var openId=wx.getStorageSync('openId');

        wx.request({
          url: wx.getStorageSync('url')+"/verify",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            phoneNum: phoneNum,
            verifyCode: verifyCode,
            status: 1,
            openId: openId
          },
          method: "POST",
          success: function (res) {
            console.log("手机验证码校验结果:"+res);
            if (res.data&& res.data.code==0) {
              wx.showModal({          //模式对话框
                title: '提示',
                content: '注册用户失败,原因:'+ res.data.msg +'！',
                showCancel: false
              })
              return;
            }
            var globalData = getApp().globalData
            globalData.phoneNum = phoneNum     //在全局变量保存当前注册的号码
    
            getApp().globalData.status=1;
            wx.setStorageSync('phoneNum', phoneNum);
            wx.setStorageSync('status',1);
            //到充值页
             wx.navigateTo({
                    url: '../deposit/deposit'
              })  
          }
        });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})