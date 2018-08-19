// pages/index/zhuanji.js
import util from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zhuanji_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getZhuanji();
  },
  getZhuanji(pull) {
    if(!pull){
      wx.showLoading({
        title: 'loading...',
      })
    }
    let self = this;
    wx.request({
      url: 'https://neteasemusic.leanapp.cn/artist/album?id=3684',
      success: function (res) {
        console.log(res)
        if (pull) {
          wx.stopPullDownRefresh();
        }else{
          wx.hideLoading();
        }
        let arr = [];
        //zhuanji_list 所有专辑
        res.data.hotAlbums.map(val => {
          arr.push(
            {
              name: val.name,//专辑名
              id: val.id,//专辑id
              picurl: val.picUrl,
              time: util.formatTime(new Date(val.publishTime)).substring(0, 10),
              size: val.size
            }
          )
        })
        console.log(arr)
        self.setData(
          {
            zhuanji_list: arr
          }
        )
      }
    })
  },
  zhuanji_detail: function (val) {
    console.log(val)
    let content = val.target.dataset.zhuanji;
    console.log(content)
    let self = this;
    wx.request({
      url: 'https://neteasemusic.leanapp.cn/album?id=' + content.id,
      success: function (res) {
        console.log(res.data)
      }
    })
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
    this.getZhuanji(1);
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