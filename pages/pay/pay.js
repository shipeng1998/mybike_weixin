// pages/pay/pay.js
var QQMapWX=require('../../libs/qqmap-wx-jssdk.min');
var qqmapsdk;
Page({

 /**
   * 页面的初始数据
   */
  data: {
    money: 0, //余额
    currentTab: 3, //默认选中标签
    payMoney: 10
  },
  onLoad:function(e){
        //实例化map核心类
        qqmapsdk=new QQMapWX({key:'K4HBZ-ZS5CP-24MDH-LBMDK-LF2KH-H3FJO'});
  },
//tab的切换,   因为界面   bindtap="switchNav"    switchNav事件是  Page的一个成员
  switchNav: function (e) {
    var that = this;
    //  e.target.dataset.current   ->  dataset:  事件源组件上由data-开头的自定义属性组成的集合
    // 界面:   data-current="0"
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        //tab
        currentTab: e.target.dataset.current,
        payMoney: e.target.dataset.money
      });
    }
  },
  recharge: function () { 
    //var phoneNum=getApp().globalData.phoneNum;
    var phoneNum=wx.getStorageSync('phoneNum');
    
    if(  phoneNum==null|| phoneNum==''){
      wx.showToast({
        title: '您还没有登录',
        icon:'loading'
      })
      return;
    }
    var that = this;
    //充值提示框:模式对话框
    wx.showModal({
      title: '充值',
      content: '您是否进行充值' + that.data.payMoney + '元?',
      success: function (res) {    //   res有两个属性:  confirm   cancel
        console.log(res)
        //确认充值
        if (res.confirm) {
          //发送充值请求    
          var phoneNum = wx.getStorageSync('phoneNum');
          var openid = wx.getStorageSync('openId');   //在  app.js中存的
          var amount =  that.data.payMoney;
          wx.request({
            url: wx.getStorageSync('url')+'/recharge',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              balance: amount,
              phoneNum: phoneNum
            },
            success: function (res) {
              if(res.data.code==1) {
                addLog(phoneNum,openid,amount);
                wx.showModal({
                  title: '提示',
                  content: '充值成功！',
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})

function addLog(phoneNum,openid,amount){
  //充值数据的埋点
  wx.getLocation({
   success:function(res){
    var lat=res.latitude;
    var log=res.longitude;
    console.log(lat+"--"+log);
    qqmapsdk.reverseGeocoder({
      location:{
        latitude:lat,
        longitude:log
      },
      success:function(res){
        console.log('腾讯位置结果：'+res);
        var address=res.result.address_component;
        var province=address.province;
        var city=address.city;
        var district=address.district;
        var street=address.street;
        var street_number=address.street_number;
        
        var dt=new Date();
        var payTime=Date.parse(dt);
        wx.request({
          url: wx.getStorageSync('url')+'/log/addPayLog',
          data:{
                 openid:openid,
                 phoneNum:phoneNum,
                 amount:amount,
                 lat:lat,
                 log:log,
                 province:province,
                 city:city,
                 district:district,
                 street:street,
                 street_number:street_number,
                 payDate:payTime
          },
          method:'POST'
        })
      }
    });
   }
  });
}