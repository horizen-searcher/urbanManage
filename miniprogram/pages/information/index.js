/* 新增待办页面 */

Page({
  data:{
    openid: "",
    Gen: 0,
    Age: 0,
    Duar: 0,
    Community: "",
    City: "",
    GenOptions: ["男","女","保密"],
    AgeOptions: ["14岁以下","14~20岁","20~30岁","30~40岁","40~50岁","50~60岁","60岁以上"],
    DuarOptions: ["1年以内","1~3年","3~5年","5~10年","10年以上"]
  },
  //选择性别
  onChooseGender(e){
    this.setData({
      Gen: e.detail.value
    })
  },
  //选择年龄段
  onChooseAge(e){
    this.setData({
      Age: e.detail.value
    })
  },
  //选择居住时间
  onChooseDuartion(e){
    this.setData({
      Duar: e.detail.value
    })
  },
  //输入小区名称
  onCommunityInput(e){
    this.setData({
      Community: e.detail.value
    })
  },
  // 输入所在城市
  onCityInput(e){
    this.setData({
      City: e.detail.value
    })
  },

  //保存用户信息
  async saveInfo(){
    if(this.data.Community===""){
      wx.showToast({
        title: '小区名称未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(this.data.City === ""){
      wx.showToast({
        title: '所在城市未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(this.data.Community.length>50){
      wx.showToast({
        title: '小区名称过长',
        icon: 'error',
        duration: 2000
      })
      return
    }

    const db = await getApp().database()
    //在数据库中更新用户信息
    //获取openid
    this.data.openid = getApp().globalData.openid
    //console.log(this.data.openid)
    db.collection('user').where({
      _openid: this.data.openid
    }).get({
      success: res=> {
        console.log(res.data)
        if(res.data.length==0){
          console.log('添加新纪录')
          db.collection('user').add({
            data: {
              Gender: this.data.Gen,
              Age: this.data.Age,
              Duartion: this.data.Duar,
              City: this.data.City,
              Community: this.data.Community
            }
          })
          wx.switchTab({
            url: '../user/user',
          })
        }
        else{
        let curId = res.data[0]._id
          console.log('修改当前记录')
          db.collection('user').doc(curId).update({
            data: {
              Gender: this.data.Gen,
              Age: this.data.Age,
              Duartion: this.data.Duar,
              City: this.data.City,
              Community: this.data.Community
            }  
          })
          wx.navigateBack({
            delta: 2
          })
        }
      },
      fail: err=>{
        console.log('查询失败')
      },
    })
    console.log('uplaod success')
  },

  resetTodo(){
    this.setData({
      Gen: 0,
      Age: 0,
      Duar: 0,
      City: "",
      Community: ''
    })
  }
})