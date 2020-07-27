// pages/deposit/deposit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  deposit: function(){
    var that=this;
    wx.showModal({
     title:'提示',
     content:'是否要充值押金',
     confirmText:'确认',
     success:function(res){
        //模拟加载动画
        wx.showLoading({
          title: '充值中...',
        })
      //  var phoneNum=getApp().globaData.phoneNum;
        var phoneNum = getApp().globalData.phoneNum;    //电话
        wx.request({
          url: wx.getStorageSync('url')+'/deposit',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            phoneNum: phoneNum,
          },
          method: "POST",
          success:function(res){
            if(res.data.code==1){
              wx.hideLoading(); //隐藏加载条
              getApp().globalData.status=2;    //修改用户的状态
              wx.setStorageSync('status',2);
              wx.navigateTo({
                url: '../identity/identity',
              });
            }else{
              wx.showModal({
               title:'提示',
               content:'押金充值失败',
               showCancel:false
              })
            }
          }
        })
     }
    })
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