// pages/index/songDetails.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    isplaying:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    let self = this;
    if (options.id){
      if (app.globalData.innerAudioContext.destroy) {
        app.globalData.innerAudioContext.destroy();
      }
      wx.request({
        url: 'https://neteasemusic.leanapp.cn/music/url?id=' + options.id,
        success: function (res) {
          if (res.data.data[0].url != null){
            app.globalData.innerAudioContext = wx.createInnerAudioContext();
            app.globalData.innerAudioContext.autoplay = true;
            app.globalData.innerAudioContext.src = res.data.data[0].url;
          }else{
            wx.showToast({
              title: '暂无版权，不支持播放',
              icon:'none',
              duration:3000
            })
          }
          self.setData(
            {
              isplaying: 1
            }
          )
        }
      });
      wx.request({
        url: 'https://neteasemusic.leanapp.cn/lyric?id=' + options.id,
        success: function (res) {
          try{
            let arr = res.data.lrc.lyric.split('[');
            let arrres = [{text:options.name.split('、')[1],time:-1},{text:options.author,time:-1}];
            arr.map((val, ind) => {
              arrres.push({
                text: val.split(']')[1],
                time: val.split(']')[0]
              });
            });
            console.log(arrres)
            arrres = arrres.filter(val=>{
              return val.text != undefined && val.text.replace(/\s|\n|\r/g, '') !== ''
            });
            self.setData(
              {
                lists: arrres
              }
            );
            app.globalData.geci = arrres;
          }catch(err){
            console.log(err)
            self.setData(
              {
                lists: [{text:'歌词加载出错啦~'}]
              }
            )
          }
        }
      })
    }else{
      self.setData(
        {
          lists: app.globalData.geci
        }
      );
    }
  },
  playOrzt:function(){ //播放或暂停
    if(this.data.isplaying == 1){
      this.setData(
        {
          isplaying:0
        }
      );
      if (app.globalData.innerAudioContext.pause){
        app.globalData.innerAudioContext.pause();
      }
    }else{
      this.setData(
        {
          isplaying: 1
        }
      );
      if (app.globalData.innerAudioContext.play){
        app.globalData.innerAudioContext.play();
      }
    }
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
    wx.stopPullDownRefresh();
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