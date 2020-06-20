//index.js
//获取应用实例
const app = getApp()

Page({
 /**
   * 页面的初始数据
   */
  data: {
    latitude:0,
    longitude:0,
    controlls:[],
    markers:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.获取当前对象的拷贝
    var that=this;
    //2.创建一个地图的上下文，对地图中的控件进行事件操作
    that.mapCtx=wx.createMapContext('map');
    //3.获取当前手机的所在位置
    wx.getLocation({
     type:"wgs84",
     isHighAccuracy:true,
     success:function(res){
       console.log(res);
       that.setData({
         latitude:res.latitude,
         longitude:res.longitude
       })
     }

    })
//加载所有的可用的附近的前10台车
      //获取附近的车，并显示
      wx.request({
        url:"http://localhost:8080/mybike/findNearAll",
        method:"POST",
        data:{
          latitude:that.data.latitude,
          longitude:that.data.longitude,
          status:1
        },
        success:function(res){
          console.log( res );
           const bikes=res.data.obj.map( item=>{
             return {
               bid: item.bid,
               iconPath:"../images/bike.png",
               width:35,
               height:35,
               latitude:item.latitude,
               longitude:item.longitude
             }
           });
           console.log(    bikes );
           that.setData({
            markers:bikes
          });
        }
     });



    //4.在地图上加入按钮
    //先获取当前设备信息，窗口的宽高
    wx.getSystemInfo({
      success: function(res)  {
        //获取宽高
        var height=res.windowHeight;
        var width=res.windowWidth;
        //添加控件，图片
        that.setData({
          controlls:[{
            id:1,
            position:{
              left:width/2-10,
              top:height/2-10,
              width:20,
              height:35
            },
            iconPath:"../images/location.png",
            clickable:true
          },
          {
            id:2,
            position:{
              left:20,
              top:height-50,
              width:40,
              height:40
            },
            iconPath:"../images/img1.png",
            clickable:true
          },
          {
            id:3,
            position:{
              left:100,
              top:height-50,
              width:110,
              height:40
            },
            iconPath:"../images/qrcode.png",
            clickable:true
          },
          {
            id:4,
            position:{
              left:250,
              top:height-50,
              width:40,
              height:40
            },
            iconPath:"../images/pay.png",
            clickable:true
          }
        ]
           
          
        })
      }
    })

  },

  controltap(e){
    var that=this;
       if(e.controlId==2){
      //地图复位
      that.mapCtx.moveToLocation();
     }else if(e.controlId==3){
       //获取全局变量status,根据它的值进行页面跳转
       var status=getApp().globalData.status;
       if( status==0){
        //跳到注册页面
        wx.navigateTo({
          url: '../register/register',
        });
      }else if (status == 1) {
        wx.navigateTo({
          url: '../deposit/deposit',
        });
      } else if (status == 2) {
        wx.navigateTo({
          url: '../identify/identify',
        });
      } else if (status == 3) {
        scanCode()
      }

     }
  },

  scanCode:function(){
       //扫码
       wx.scanCode({
        success:function(res){
          //车的编号
          var bid= res.result;
          wx.request({
            url: 'http://localhost:8080/mybike/open',
            method:"POST",
           // data:"bid="+bid+"&latitude="+that.data.latitude+"&longitude="+that.data.longitude,
           data:{
             bid:bid,
             latitude:that.data.latitude,
             longitude:that.data.longitude
           },
           dataType:"json",
           header:{
             "content-type":"application/json"
           },
           success:function(res){
             console.log(res);
           }
          })

        }
       })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //数据埋点，获取用户的poenid,经度纬度
    wx.getLocation({
     success:function(res){
       var latitude=res.latitude;
        var longitude=res.longitude;
        //用户id
        var openid=wx.getStorageSync("openid");
       wx.request({
         url: 'http://localhost:8080/mybike/log/savelog',
         data:{
           time:new Date(),
           openid:openid,
           latitude:latitude,
           longitude:longitude,
           url:'index'
         },
         method:"POST"
       }) 
     }
    })

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

