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
       findNearBikes(  that,that.data.latitude,that.data.longitude  );
     }

    }),
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
              left:width/15,
              top:height-70,
              width:width/8,
              height:height/8
            },
            iconPath:"../images/img1.png",
            clickable:true
          },
          {
            id:3,
            position:{
              left:width/2.8,
              top:height-70,
              width:width/3,
              height:height/8
            },
            iconPath:"../images/qrcode.png",
            clickable:true
          },
          {
            id:4,
            position:{
              left:width/1.2,
              top:height-70,
              width:width/8,
              height:height/8
            },
            iconPath:"../images/pay.png",
            clickable:true
          },{ //报修
            id: 5,
            iconPath: "../images/repair.png",
            position: {
              width: 45,
              height: 45,
              left: width - 42,
              top: height - 303.
            },
            //是否可点击
            clickable: true
          }

        ]
           
          
        })
      }
    });
   
  },

  controltap(e){
    var that=this;
       if(e.controlId==2){
      //地图复位
      that.mapCtx.moveToLocation();
     }else if(e.controlId==4){
      wx.navigateTo({
        url: '../pay/pay',
      });
     }else if(e.controlId==5){
      wx.navigateTo({
        url: '../repair/repair',
      });
     }else if(e.controlId==3){
       //获取全局变量status,根据它的值进行页面跳转
      // var status=getApp().globalData.status;
      var status=wx.getStorageSync('status');
       console.log("用户状态："+status);
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
          url: '../identity/identity',
        });
      } else if (status == 3) {
        that.scanCode()
      }else if(status==4){
        wx.navigateTo({
          url: '../billing/billing',
        })
      }

     }
  },

  scanCode:function(){
    var that=this;
       //扫码
       wx.scanCode({
        success:function(res){
          
          //车的编号
          var bid= res.result;
          wx.request({
            url: wx.getStorageSync('url')+'/open',
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
              //console.log(  res );
              if(  res.data.code==0){
                wx.showToast({
                  title: '开锁失败,原因:'+res.data.msg,
                  icon: "none"

                });
                return;
              }
              //TODO: 计费,计时
              if( res.data.code==1){
                //在本地存一下正在骑行的单车号
                wx.setStorageSync('bid', bid);
                wx.setStorageSync('status', 4);   //表示当前用户正在骑行中...
                getApp().globalData.status = 4;  //当前骑行中.
                wx.navigateTo({
                  url: '../billing/billing'
               });
              }
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
         url: wx.getStorageSync('url')+'/log/savelog',
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

  regionchange:function( e ){
    var that =this;
   // e的事件type也两种值  begin，和 end
   if(  e.type=='end'){
    //要取出当前的位置，但请注意，这里不能用 wx.getLocation,因为它取的是设备的位置，这里要是移动后的地图位置. 
    that.mapCtx.getCenterLocation({
      success:function( res ){
        //这时的经纬度为地图新位置的中心点的经纬度
        findNearBikes(that,res.latitude, res.longitude);
      }
    });
  }
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
function findNearBikes(that,latitude,longitude){
  console.log(that.data.latitude+"=="+that.data.longitude+"--"+latitude+longitude);
  //加载所有的可用的附近的前10台车
      //获取附近的车，并显示
      wx.request({
        url:wx.getStorageSync('url')+"/findNearAll",
        method:"POST",
        data:{
          latitude:latitude,
          longitude:longitude,
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
}
