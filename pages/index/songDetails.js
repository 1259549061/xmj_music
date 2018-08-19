// pages/index/songDetails.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[], //歌词
    isplaying: 1,
    allInfo:[], //所有歌曲列表信息
    playId:'' //正在播放的歌曲id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.isplaying)
    console.log(options)
    console.log(app.globalData)
    this.setData({
      allInfo:app.globalData.allInfo
    });
    if (options.id){
      this.playit(options.id);
      this.getGeci(options.id, options.name,options.author);
    }else{
      this.setData(
        {
          playId: app.globalData.playId,
          lists: app.globalData.geci,
          isplaying: app.globalData.isplaying
        }
      );
    }
  },
  beforeOne:function(){ //上一首
    for(let i=0;i<this.data.allInfo.length;i++){
      if(this.data.allInfo[i].id == this.data.playId){
        if(i!==0){
          this.playit(this.data.allInfo[i - 1].id);
          this.getGeci(this.data.allInfo[i - 1].id, this.data.allInfo[i - 1].name, this.data.allInfo[i - 1].author);
        }else{
          this.playit(this.data.allInfo[0].id);
          this.getGeci(this.data.allInfo[0].id, this.data.allInfo[0].name, this.data.allInfo[0].author);
        }
        break;
      }
    }
  },
  nextOne:function(){ //下一首
    console.log(this.data.allInfo);
    console.log(this.data.playId)
    for (let i = 0; i < this.data.allInfo.length; i++) {
      if (this.data.allInfo[i].id == this.data.playId) {
        if (i + 1 < this.data.allInfo.length) {
          this.playit(this.data.allInfo[i + 1].id);
          this.getGeci(this.data.allInfo[i + 1].id, this.data.allInfo[i + 1].name, this.data.allInfo[i + 1].author);
        } else {
          this.playit(this.data.allInfo[0].id);
          this.getGeci(this.data.allInfo[0].id, this.data.allInfo[0].name, this.data.allInfo[0].author);
        }
        break;
      }
    }
  },
  playit: function (id){
    wx.showLoading({
      title: 'music loading...',
    })
    this.setData({
      playId: id
    })
    app.globalData.playId = id;
    if (app.globalData.innerAudioContext.destroy) {
      app.globalData.innerAudioContext.destroy();
    }
    app.globalData.innerAudioContext = wx.createInnerAudioContext();
    app.globalData.innerAudioContext.autoplay = true;
    app.globalData.innerAudioContext.obeyMuteSwitch = false;
    app.globalData.innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id=' + id + '.mp3';
    app.globalData.innerAudioContext.onError((err)=>{
      wx.hideLoading();
      wx.showToast({
        title: '版权原因，播放失败',
        icon:'none'
      });
    })
    app.globalData.innerAudioContext.onPlay(()=>{
      wx.hideLoading();
    })
    app.globalData.innerAudioContext.onEnded(() => {
      if (this.data.allInfo.length !== 0) {
        for (let i=0;i<this.data.allInfo.length;i++) {
          if (this.data.allInfo[i].id == id){
            if (i + 1 < this.data.allInfo.length){
              this.playit(this.data.allInfo[i + 1].id);
              this.playit(this.data.allInfo[i + 1].id, this.data.allInfo[i + 1].name, this.data.allInfo[i + 1].author);
            }else{
              this.playit(this.data.allInfo[0].id);
              this.playit(this.data.allInfo[0].id, this.data.allInfo[0].name, this.data.allInfo[0].author);
            }
            break;
          }
        }
      }
    })
  },
  getGeci: function (id,name,author){
    let self = this;
    wx.request({
      url: 'https://neteasemusic.leanapp.cn/lyric?id=' + id,
      success: function (res) {
        try {
          let arr = res.data.lrc.lyric.split('[');
          let arrres = [{ text: name.split('、')[1], time: -1 }, { text: author, time: -1 }];
          arr.map((val, ind) => {
            arrres.push({
              text: val.split(']')[1],
              time: val.split(']')[0]
            });
          });
          console.log(arrres)
          arrres = arrres.filter(val => {
            return val.text != undefined && val.text.replace(/\s|\n|\r/g, '') !== ''
          });
          self.setData(
            {
              lists: arrres
            }
          );
          app.globalData.geci = arrres;
        } catch (err) {
          console.log(err)
          self.setData(
            {
              lists: [{ text: '歌词加载出错啦~' }]
            }
          )
        }
      }
    })
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
    console.log(this.data.isplaying)
    app.globalData.isplaying = this.data.isplaying;
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