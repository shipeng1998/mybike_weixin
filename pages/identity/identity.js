// pages/identity/identity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit:function(e){
    //获取全局变量的数据
    var phoneNum=getApp().globalData.phoneNum;
    var name=e.detail.value.name;
    var idNum=e.detail.value.idNum;

    wx.request({
      url: wx.getStorageSync('url')+'/identity',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        phoneNum: phoneNum,
        name:name,
        idNum:idNum
      },
      method: "POST",
      success:function(res){
        wx.hideLoading();
        if(res.data.code==1){
          getApp().globalData.status=3;  
          wx.setStorageSync('status',3);  //修改用户的状态
          wx.navigateTo({
            url: '../index/index',
          });
        }else if(res.data.code==0){
          wx.showModal({
            title:'提示',
            content:res.data.msg,
            showCancel:false
           })
           wx.navigateTo({
            url: '../index/index',
          });
        }
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