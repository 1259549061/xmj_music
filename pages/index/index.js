//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isPlay: 0,
    indicatorDots: true,
    autoplay: true,
    interval: "3000",
    duration: "500",
    imgUrls: [{
        path: '/img/swiper1.png',
        index: 0
      },
      {
        path: '/img/swiper2.jpg',
        index: 1
      },
      {
        path: '/img/swiper3.jpg',
        index: 2
      }
    ],
    fenlei: [{
        path: '/img/xinge.jpg',
        name: "新歌榜",
        index: 0
      },
      {
        path: '/img/rege.jpg',
        name: "热歌榜",
        index: 1
      },
      {
        path: '/img/yuanchuang.jpg',
        name: "原创榜",
        index: 2
      },
      {
        path: '/img/biaoshen.png',
        name: "飙升榜",
        index: 3
      }
    ],
    bang_text: '新歌榜',
    bang_index: 0,
    gequ_lists: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ispull: 0
  },
  //   //事件处理函数
  //   bindViewTap: function() {
  //     wx.navigateTo({
  //       url: '../logs/logs'
  //     })
  //   },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getpaihang(0);
  },
  chooseTab: function(val) {
    this.getpaihang(val.target.dataset.index, val)
  },
  picplay:function(){
    console.log(this.data.isPlay)
    if(this.data.isPlay == 1){
      wx.navigateTo(
        {
          url:'/pages/index/songDetails'
        }
      )
    }
  },
  mysearch:function(event){
    console.log(event)
    let self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://neteasemusic.leanapp.cn/search?keywords='+event.detail.value,
      success:function(res){
        console.log(res)
        let arr = [];
        try{
          res.data.result.songs.map(val => {
            arr.push({
              id: val.id,
              name: ((arr.length + 1) > 9 ? (arr.length + 1) : ('0' + (arr.length + 1))) + '、' + val.name,
              author: val.artists[0].name,
              picurl: val.artists[0].picUrl,
              src: '/img/play.png'
            })
          })
          self.setData({
            gequ_lists:arr,
            bang_text:'搜索结果'
          })
          wx.hideLoading();
        }catch(err){
          console.log(err);
          wx.hideLoading();
          wx.showToast({
            title: 'sorry~搜索结果出错啦',
          })
        }
      }
    })
  },
  playMusic: function(val) {
    this.setData(
      {
        isPlay:1 
      }
    )
    let detail = val.currentTarget.dataset.itemdetail;
    wx.navigateTo({
      url: '/pages/index/songDetails?id=' + detail.id + '&name=' + detail.name + '&author=' + detail.author
    })
  },
  getpaihang: function(index, val) { //新歌0 热歌1  原创2 飙升3
    let self = this;
    if (self.data.ispull != 1){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    wx.request({
      url: 'https://neteasemusic.leanapp.cn/top/list?idx=' + index,
      success: function(res) {
        console.log(res)
        let arr = [];
        res.data.result.tracks.map(val => {
          arr.push({
            id: val.id,
            name: ((arr.length + 1) > 9 ? (arr.length + 1) : ('0' + (arr.length + 1))) + '、' + val.name,
            author: val.artists[0].name,
            picurl: val.artists[0].picUrl,
            src: '/img/play.png'
          })
        });
        if (arr.length !== 0) {
          self.setData({
            gequ_lists: arr
          })
        }
        if (val) {
          self.setData({
            bang_text: val.target.dataset.tab,
            bang_index: val.target.dataset.index
          })
        }
        if (self.data.ispull == 1) {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          self.setData({
            ispull: 0
          })
        }else{
          wx.hideLoading();
        }
      }
    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      ispull: 1
    })
    this.getpaihang(this.data.bang_index);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})