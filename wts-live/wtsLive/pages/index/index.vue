<template>
  <view class="apps">
    <block v-if="classInfo.startStatus == 0">
      <!-- 课程未开始 -->
      <view class="class-info">
          <image class="banner-img" :src="classInfo.banner || imgSrc" style="height:422rpx;"></image>
          <text class="class-title">{{classInfo.name}}</text>
          <text class="class-time">直播时间：{{classInfo.startTimeStr}}</text>
      </view>
      <view class="class-detail">
        <text class="sub-title">课程简介</text>
        <text v-if="classInfo.introduce.length" class="class-detail-msg">{{classInfo.introduce}}</text>
        <rich-text class="class-detail-desc" :nodes="classInfo.description"></rich-text>
        <block v-if="classInfo.subscribeStatus == 1">
            <!-- 已预约 -->
            <button class="live-btn btn-signed">已报名</button>
        </block>
        <block v-else>
          <!-- 未预约 -->
          <form report-submit="true" @submit="signUpEvent" style="width:0;">
              <button form-type="submit" plain="true" class="live-btn btn-order">预约直播</button>
          </form>
         </block>
      </view>
    </block>
    <block v-else-if="classInfo.startStatus == 1">
      <!-- 直播中 -->
      <!-- 视频层  -->
      <view ref="videoLayer" class="videoLayer">
        <image v-show="isHiddenVideo" :src="roomIntroUrl"></image>
        <video class="mylive" autoplay="true" controls="true" :src="videoSrc"></video> 
      </view>
      <!-- 聊天层 -->
      <view class="chat-box" v-show="!chatStatus">
          <scroll-view scroll-y="true" id="chat-id" class="chat-inner" :style="{height: chatHeight+'px'}" :scroll-top="scrollHeight">
            <block v-for="(message,idx) in messages">
                <block v-if="message.messageType == 1 && message.citeSenderNickName">
                  <view class="chat-tpl-02" :id="'message'+idx+1">
                      <view class="chat-tpl-01">
                        <text class="t-date">{{msgTime[idx]}}</text>
                        <image :src="message.senderAvatarUrl"></image>
                        <text class="t-teachet">{{message.senderNickName}}</text>
                        <text class="t-dui">对</text>
                        <image :src="message.citeAvatarUrl"></image>
                        <text class="t-name">{{message.citeSenderNickName}}</text>
                      </view>
                      <view style="flex-direction:row;">
                        <text class="t-ct">{{msgStr[idx]}}</text>
                      </view>
                  </view>
                </block>
                <block v-else>
                    <view class="chat-tpl-01" :id="'message'+idx+1">
                        <text class="t-date">{{msgTime[idx]}}</text>
                        <image :src="message.senderAvatarUrl"></image>
                        <text class="t-name">{{message.senderNickName}}</text>
                        <text class="t-ct">{{msgStr[idx]}}</text>
                    </view>
                </block>
            </block>
          </scroll-view>
          <my-input class="my-input" @sendMsg="sendMessageEvent" @hasUserAva="getAvatarUrl"></my-input>
      </view>
    </block>
    
    <block v-else>
      <!-- 暂无课程 -->
      <!-- <view style="height: 100%;background: #f2f2f2;"> -->
      <view>
        <image :src="noClassImg" style="width: 750rpx;height: 1369rpx;"></image>
      </view>
    </block>
  </view>
</template>

<script>

import socket from '../../tool/socket.js'
import utils from '../../tool/utils.js'
import http from '../../tool/http.js'
import myInput from '../../components/myInput/myInput.vue'
import tools from '../../tool/tools.js'

var timer;

export default   {
  data() {
	  return {
		classInfo: {},
		classId: 0,
		loading: true,
		userInfo: {},
		avatarUrl: "",
		imgSrc: require("../../assets/images/liveBanner.jpg"),
		noClassImg: require("../../assets/images/noclass.jpg"),
		isHiddenVideo: false,
		videoSrc: "",
		roomIntroUrl:"",
		messages:"",
		videoHeight:0,
		subHeight: 0,
		chatHeight: 0,
		scrollHeight: 0,
		subject: null,
		isHiddenControls: true,
		liveMessage: [],
		messages: [],
		msg: '',
		msgTime: [],
		msgStr: [],
		scrollTop: 0,
		toLast: '',
		userInfo: {},
		hasUserInfo: false,
		isFull: false,
		roomIntroUrl: '',
		chatStatus: false,
		eventLock: true,
		inputBottom: 'bottom: 0px',
	}
  },
  methods: {
    getAvatarUrl(e) {
      // 获取缓存的用户信息和头像
      this.userInfo = Object.assign({}, uni.getStorageSync('loginInfo'), {avatarUrl: uni.getStorageSync('avatarUrl')});
      this.userInfo.avatarUrl= e.avatarUrl;
    },
    sendMessageEvent(e){
		console.log("emit:",e);
      var self = this;
      this.msg= e.chatMsg;
      setTimeout(function() {
        self.scrollHeight+= Math.ceil(e.chatMsg.length/12)*48+20;
      },500)
      //声明点击锁
      uni.showLoading({
		  title: '发送成功'
	  });
      var msg = this.msg || '';
      if(msg == '')
      {
        uni.showToast({
          title: '请输入您要发送的消息！',
          icon: 'none',
          duration: 2000
        });
        return;
      }
	  this.$http({
		  name: 'sendChat',
		  data: {
			messageContent: msg,
			userico: this.userInfo.avatarUrl
		  }
	  })
	  .then(function(res){
        var newMsg = {
            "messageId": new Date().getTime(),
            "messageType": "2",
            "content": '{"txt":"'+msg+'"}',
            "senderId": self.userInfo.data.id,
            "senderNickName": self.userInfo.data.nickName,
            "senderAvatarUrl": self.userInfo.avatarUrl,
            "sentTime": tools.formatTime(new Date()),
            "minLevel": "0",
            "citeContent": "",
            "citeSenderId": "",
            "citeSenderNickName": "",
            "citeAvatarUrl": "",
            "citeMessageType": "",
            "isBest": "0"
        };
		console.log(self.userInfo);
        var messages = self.messages.concat(newMsg);
        self.msgStr.push(self.strToJson(newMsg.content).txt);
        self.msgTime.push(self.isToday(newMsg.sentTime));

        self.messages= messages;
        self.msg= '';
        self.toLast= `message${messages.length}`;
        self.eventLock= false;

        uni.hideLoading();
      })
      
      setTimeout(function () {
        uni.hideLoading()
      }, 2000)
    },
    // 注册
    signUpEvent(e){
      var _self = this;
	  this.$http({
		  name: 'subscribeClass',
		  data: {
			  courseId: this.classInfo.id,
			  formid: e.detail.formId
		  }
	  })
	  .then(function(res){
        uni.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
        _self.queryClassDetail();
	  })
    },
    queryClassDetail(){
      var _self = this;
	  this.$http({
		  name: 'getClassDetail',
		  data: {
			id: _self.classId,
			roomId: 1
		  }
	  })
	  .then(function(data) {
        // 判断是否有直播数据
        if(JSON.stringify(data)!=="{}") {
          data.startTimeStr= _self.getFullTime(data.startTime);
        }
        _self.classInfo= data.data;
        _self.loading= false;
        //创建一个定时任务监听是否开课
        if(data.startStatus == 1)
        {
          _self.listenStatus(data.endTime - data.currentDate);
        }
        else if(data.startStatus == 0)
        {
          _self.listenStatus(data.startTime - data.currentDate);
        }
	  })
    },
    listenStatus(time){
      var _self = this;
      if(timer)
      {
        clearTimeout(timer);
      }
      timer = setTimeout(function(){
        _self.queryClassDetail();
      }, time);
    },
    // 直播时websocket
    listenSocket(){
      var self = this;
      socket.init({
        userid: this.userInfo.data.id,
        username: this.userInfo.data.nickName
      }, function(stompClient){
		console.log("listenSocketaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        stompClient.subscribe('/room/1/roomMsg', function(message, headers) {
          console.log('chat:',JSON.parse(message.body).data);
          // 通知服务端收到消息
          message.ack();
          //回调给调用方
          var chat = JSON.parse(message.body).data;
          //如果就同一个用户，就过滤掉这条消息
          if(chat.senderId == self.userInfo.id) return;
          chat.sentTime = chat.sentTime.replace(/-/g, '/');
          self.msgTime.push(self.isToday(chat.sentTime));
          self.msgStr.push(self.strToJson(chat.content).txt);
          // 收到消息滚动
          setTimeout(function() {
            self.scrollHeight+= Math.ceil(self.msgStr[self.msgStr.length-1].length/12)*48+20;
          },500)

          var messages = self.messages.concat(chat);
          self.messages = messages;
          self.msg= '';
          self.toLast= `message${messages.length}`;
        });
        //上线通知
        stompClient.subscribe('/room/1/connect', function(message) {
          console.log('我上线了'); 
        });

        // 下线通知
        stompClient.subscribe('/room/1/disconnect', function(message) {
          console.log('我下线了'); 
        });

        //房间配置信息更新
        stompClient.subscribe('/room/1/roomConfig', function(message) {
          console.log('配置文件更新了'); 
          var msgObj = JSON.parse(message.body);
          var data = msgObj.data;
          var themeContent = JSON.parse(data.roomTheme.themeContent);

          if(data.isLock == 0)
          {
            self.videoSrc= data.videoUrl;
            self.isHiddenVideo= false;
          }
          else
          {
            self.isHiddenVideo= true;
            self.roomIntroUrl= themeContent.stopLockImg;
          }
        });
      });
    },
    closeChat() {
      console.log("closeChat")
    },
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    getFullTime(timestamp) {
      var time = new Date(parseInt(timestamp));
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return this.add0(year)+'.'+this.add0(month)+'.'+this.add0(date)+' '+this.add0(hours) + ':' + this.add0(minutes);
    },
    getChatPos(e) {
      console.log(e);
      this.inputBottom= 'bottom: '+e.detail.inputBottom+'px';
    },
    getTime(timestamp) {
      var time = getDate(parseInt(timestamp) * 1000)
      // var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return this.add0(hours) + ':' + this.add0(minutes);
    },
    isToday(str){
      var d = new Date(str);
      var todaysDate = new Date();
      if(todaysDate.getTime() - d.getTime() < 86400000){
        return d.getHours() + ':' + this.add0(d.getMinutes()) + ':' + this.add0(d.getSeconds());
      } else {
        var mouth = d.getMonth() + 1;
        var day = d.getDate();
        return mouth + "月" + day;
      }
    },
    strToJson(str){
      return JSON.parse(str);
    }
  },
  created() {
	  console.log("created")
    var self = this;
    var userInfo = Object.assign({}, uni.getStorageSync('loginInfo'), {avatarUrl: uni.getStorageSync('avatarUrl')});
    // setTimeout(function() {
    //   self.userInfo= userInfo;
    // },1000);
    utils.getWxCode(self.queryClassDetail.bind(this));

    // 页面高-tabnav-livePlayer-chatBox-自身padding
    this.chatHeight= this.scrollHeight= uni.getSystemInfoSync().windowHeight- uni.upx2px(617);
    //初始化直播间播放信息
	this.$http({
		name: 'getLiveInfo',
		data: {
			roomId: 1
		}
	})
	.then(function(res) {
	  var data= res.data;
      var themeContent = JSON.parse(data.theme.themeContent);
      if(data.isLock == 0)
      { 
        self.videoSrc= data.videoUrl;
        self.isHiddenVideo= false;
      }
      else
      {
        self.isHiddenVideo= true;
        self.roomIntroUrl= themeContent.stopLockImg;
      }
	})
    //初始化获取聊天信息
	this.$http({
		name: 'getMessages',
		data: {
		  roomId: 1,
		  direction: 'DOWN',
		  count: 10
		}
	})
	.then(function(res) {
		var data= res.data;
		var messages = data.map(item => {
        var sentTime = item.sentTime;
        item.sentTime = sentTime.replace(/-/g, '/');
        return item;
      });
      messages.map(function(item) {
        self.msgTime.push(self.isToday(item.sentTime));
        self.msgStr.push(self.strToJson(item.content).txt);
      })
      self.messages= messages;
      self.toLast= `message${data.length}`;
	})
  },
  beforeMount() {
    var self= this;
	uni.getStorage({
		key: "loginInfo",
		success: function(res) {
		  self.userInfo= res.data;
		  self.listenSocket();
		}
	})
  },
  beforeDestroy() {
    this.noClassImg= '';
  },
  destroyed() {
    socket.close();
    clearTimeout(timer);
  },
  onShareAppMessage(res) {
      return {
        title: '直播小程序',
        path: '/pages/index/index',
		imageUrl: 'https://zb.wts999.com/static/system/images/live_banner.png',
		bgImgUrl: 'https://zb.wts999.com/static/system/images/live_banner.png'
      }
	},
	components: {
		'my-input': myInput
	}
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
