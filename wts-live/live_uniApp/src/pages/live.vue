<template>
  <view class="body-container live">
    <loading :loaded="loaded"></loading>

    <!--回复弹窗-->
    <view class="maskInfo" :class="[!showMask?'active':'']">
      <view class="maskContent">
        <view class="mask_title">
          评论区({{totalreply}})
          <view class="mask_close" @click="isShowMask(false)">×</view>
        </view>
        <view class="maskContent-box">
          <scroll-view
            class="chat-inner"
            scroll-y="true"
            :scroll-top="replyscrollHeight"
            @scroll="isScroll"
            lower-threshold="0"
            @scrolltoupper="isScrollTop"
            @scrolltolower="isScrollBottom"
            :style="{height: replyChatHeight+'px'}"
          >
            <block v-for="(message,idx) in replyInfo" :key="idx">
              <view class="chat-tpl-01" :class="[message.senderId == userInfo.id?'active':'']">
                <view class="time">{{message.sentTime}}</view>
                <view class="messagecontent">
                  <view class="left">
                    <image mode="widthFix" :src="message.senderAvatarUrl" />
                  </view>
                  <view class="right">
                    <view class="top">
                      <view class="labels" v-if="message.title">{{message.title}}</view>
                      <view class="username">{{message.senderNickName}}</view>
                    </view>
                    <view class="usermessage">
                      <view class="usermessageDesc">{{message.msgStr}}</view>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
        <my-input class="my-input"></my-input>
      </view>
    </view>

    <!--最新三条数据-->
    <view class="newMessage" v-show="isOpen">
      <block v-for="(message,idx) in newMessage" :key="idx">
        <view class="newMessageContent">
          <view class="item">
          <view class="right">
            <image mode="widthFix" :src="message.senderAvatarUrl" />
          </view>
          <view class="left">
            <view class="usermessage">
              <view class="usermessageDesc">{{message.msgStr}}</view>
            </view>
          </view>
        </view>
        </view>
      </block>
    </view>

    <!-- 直播中 -->
    <block>
      <!-- 视频层  -->
      <view ref="videoLayer" class="videoLayer">
        <video
          ref="videoDom"
          class="mylive"
          autoplay="true"
          controls="true"
          :src="videoInfo.videoSrc"
        ></video>
      </view>
      <!-- 聊天层 -->
      <view class="chat-box">
        <scroll-view
          scroll-y="true"
          id="chat-id"
          class="chat-inner"
          :style="{height: chatHeight+'px'}"
          :scroll-top="scrollHeight"
        >
          <block v-for="(message,idx) in messageInfo" :key="idx">
            <view class="chat-tpl-01" v-if="message.messageType == 1">
              <view class="time">{{message.sentTime}}</view>
              <view class="messagecontent">
                <view class="left">
                  <image mode="widthFix" :src="message.senderAvatarUrl" />
                </view>
                <view class="right">
                  <view class="top">
                    <view class="labels" v-if="message.title">{{message.title}}</view>
                    <view class="username">{{message.senderNickName}}</view>
                  </view>
                  <view class="usermessage">
                    <view
                      class="citeSender"
                      v-if="message.citeSenderNickName && message.citeContent"
                    >
                      <view class="citeSenderName">{{message.citeSenderNickName}}:</view>
                      <view class="citeSenderStr">
                        <text>{{message.citeContent}}</text>
                        <view v-if="message.citeContentImg">
                          <image
                            @click="previewImg(message.citeContentImg)"
                            mode="widthFix"
                            :src="message.citeContentImg"
                          />
                        </view>
                      </view>
                    </view>
                    <view class="usermessageDesc">
                      <text v-bind:style="[message.msgStyle,styleObj]">{{message.msgStr}}</text>
                      <view v-if="message.msgImg">
                        <image
                          @click="previewImg(message.msgImg)"
                          mode="widthFix"
                          :src="message.msgImg"
                        />
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </scroll-view>
        <view class="send-chat">
          <view @click="isShowMask(true)" class="send-chat-input">说点什么吧~</view>
          <view class="send-chat-btn">
            <image
              v-if="isOpen"
              @click="isOpenMessage(false)"
              mode="widthFix"
              class="danmu"
              src="https://bx.wts9999.net/m/lib/images/live/danmu1.png"
            />
            <image
              v-else
              @click="isOpenMessage(true)"
              mode="widthFix"
              class="danmu"
              src="https://bx.wts9999.net/m/lib/images/live/danmu.png"
            />
            <image
              @click="isShowMask(true)"
              mode="widthFix"
              class="sendmessage"
              src="https://bx.wts9999.net/m/lib/images/live/sendMessage.png"
            />
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
var timer, self;
import socket from "../api/socket.js";
import tools from "../api/tools";
import notice from "../api/notice.js";
import http from "../api/http.js";
import store from "../store/state";
import utils from "../api/utils";
import filter from "../api/filter";
import loading from "../components/loading.vue";
import myInput from "../components/myInput.vue";
import parser from "../components/jyf-parser/jyf-parser";
export default {
  data() {
    return {
      styleObj: {}, //stype 必须跟个空对象（我也不明白为什么不然不生效）
      classInfo: {}, //课程信息
      videoInfo: {}, //视频信息
      messageInfo: [], //聊天信息
      classId: store.courseId, //直播id
      roomId: store.roomId,
      userInfo: {}, //用户信息
      chatHeight: 0, //聊天框的内容高度
      scrollHeight: 0, //滚动高度
      //初始化加载动画
      loaded: false,
      //评论区相关
      replyscrollHeight: 0,
      replyChatHeight: 0,
      replyInfo: [],
      showMask: false, //是否显示评论区
      totalreply: 0, //评论区总数
      isBottom: true, //评论区滚动是不是触底
      replyload: false,
      isOpen:true,

      //最新三条评论
      newMessage: []
    };
  },
  components: {
    loading: loading,
    myInput: myInput,
    parser: parser
  },
  onLoad(e) {
    self = this;
    this.undateUserInfo();
    uni.getSystemInfo({
      success: info => {
        this.chatHeight = this.scrollHeight =
          Number(info.windowHeight) - uni.upx2px(522);
        this.replyChatHeight = this.replyscrollHeight =
          Number(info.windowHeight) - uni.upx2px(600);
      }
    });
    setTimeout(() => {
      this.loaded = true;
    }, 2000);
    this.initVideoInfo();
    this.initMessageInfo();
    this.queryClassDetail();
  },
  beforeMount() {
    self = this;
    this.undateUserInfo();
    this.listenSocket();
  },
  destroyed() {
    socket.close();
    clearTimeout(timer);
  },
  methods: {
    //评论区事件相关
    // 是否触底
    isScrollBottom() {
      this.isBottom = true;
    },
    isScroll() {
      this.isBottom = false;
    },
    isScrollTop() {
      if (this.replyload) {
        return;
      }
      this.replyload = true;
      var messageId = this.replyInfo[0].messageId;
      this.initMessageInfo(1, "DOWN", messageId);
    },
    isShowMask(flag) {
      this.showMask = flag;
    },

    isOpenMessage(flag){
      this.isOpen = flag;
    },

    //查看图片
    previewImg(src) {
      var arr = [];
      arr.push(src);
      uni.previewImage({
        urls: arr
      });
    },
    //更新用户信息
    undateUserInfo() {
      this.userInfo = store.WTS_USER;
    },
    //初始化视频信息
    initVideoInfo() {
      this.$http({
        name: "getLiveInfo",
        data: {
          roomId: this.roomId
        }
      }).then(function(res) {
        var data = res.data;
        var themeContent = JSON.parse(data.theme.themeContent);
        self.videoInfo.videoSrc = data.videoUrl;
      });
    },

    //初始化聊天信息
    initMessageInfo(type, direction, messageId) {
      var params = {
        roomId: this.roomId,
        courseId: this.classId,
        direction: "DOWN",
        count: 50
      };
      if (direction) {
        params.direction = direction;
      }
      if (messageId) {
        params.startId = messageId;
      }
      this.$http({
        name: "getMessages",
        data: params
      }).then(function(res) {
        var data = res.data.msgList;
        self.totalreply = res.data.viewerMsgNum;
        var arr1 = [];
        var arr2 = [];
        data.map(item => {
          var obj = self.changeMessageInfo(item);
          if (obj.messageType == 1) {
            arr1.push(obj);
          } else if (obj.messageType == 2) {
            arr2.push(obj);
          }
        });
        if (!type) {
          self.messageInfo = self.messageInfo.length
            ? arr1.concat(self.messageInfo)
            : arr1;
        }
        self.replyInfo = self.replyInfo.length
          ? arr2.concat(self.replyInfo)
          : arr2;
        self.newMessage = self.replyInfo.slice(
          self.replyInfo.length - 3,
          self.replyInfo.length
        );
        //更新消息滚动
        if (type) {
          self.updateTopScroll(arr2);
        } else {
          self.updateScrollHeight(1);
        }

        if(data.length){
          setTimeout(function() {
            self.replyload = false;
          }, 1000);
        }
      });
    },

    // 获取直播相关信息
    queryClassDetail() {
      this.$http({
        name: "getClassDetail",
        data: {
          id: self.classId,
          roomId: self.roomId
        }
      }).then(function(res) {
        var data = res.data;
        self.classInfo = data;
      });
    },
    sendMessageEvent(e) {
      var msg = e;
      if (msg == "") {
        notice.msg("请输入您要发送的消息！");
        return;
      }
      uni.showLoading({
        title: "发送中...",
        mask: true
      });
      this.$http({
        name: "sendChat",
        url:
          "/api/message/applet/send.do?messageContent=" +
          msg +
          "&userico=" +
          this.userInfo.avatarUrl +
          "&nickName=" +
          this.userInfo.nickName +
          "&roomId=" +
          this.roomId +
          "&courseId=" +
          this.classId,
        data: {
          messageContent: msg,
          userico: this.userInfo.avatarUrl,
          nickName: this.userInfo.nickName,
          roomId: this.roomId,
          courseId: this.classId
        }
      }).then(function(res) {
        var newMsg = {
          messageId: new Date().getTime(),
          messageType: "2",
          content: '{"txt":"' + msg + '"}',
          msgStr: msg,
          senderId: self.userInfo.id,
          senderNickName: self.userInfo.nickName,
          senderAvatarUrl: self.userInfo.avatarUrl,
          sentTime: filter.isToday(
            filter.formatTime(new Date()).replace(/\-/g, "/")
          ),
          minLevel: "0",
          citeContent: "",
          citeSenderId: "",
          citeSenderNickName: "",
          citeAvatarUrl: "",
          citeMessageType: "",
          isBest: "0"
        };
        var messages = JSON.parse(JSON.stringify(self.replyInfo));
        messages.push(newMsg);
        self.replyInfo = messages;
        self.newMessage = self.replyInfo.slice(
          self.replyInfo.length - 3,
          self.replyInfo.length
        );
        uni.hideLoading();
        notice.msg("发送成功");
        // 更新消息滚动
        self.updateScrollHeight(1);
      });
    },
    // 开启聊天监听
    listenSocket() {
      self = this;
      socket.init(
        {
          userid: self.userInfo.id,
          username: self.userInfo.nickName
        },
        function(stompClient) {
          stompClient.subscribe("/room/" + self.roomId + "/roomMsg", function(
            message,
            headers
          ) {
            console.log("chat:", JSON.parse(message.body).data);
            // 通知服务端收到消息
            message.ack();
            //回调给调用方
            var chat = JSON.parse(message.body).data;
            //如果就同一个用户，就过滤掉这条消息
            if (chat.senderId == self.userInfo.id) return;
            var chat = self.changeMessageInfo(chat);
            if (chat.messageType == 1) {
              var messages = JSON.parse(JSON.stringify(self.messageInfo));
              messages.push(chat);
              self.messageInfo = messages;
            } else if (chat.messageType == 2) {
              var messages = JSON.parse(JSON.stringify(self.replyInfo));
              messages.push(chat);
              self.replyInfo = messages;
              self.newMessage = self.replyInfo.slice(
                self.replyInfo.length - 3,
                self.replyInfo.length
              );
            }
            // 更新消息滚动
            self.updateScrollHeight();
          });

          //房间配置信息更新
          stompClient.subscribe(
            "/room/" + self.roomId + "/roomConfig",
            function(message) {
              console.log("配置文件更新了");
              var msgObj = JSON.parse(message.body);
              var data = msgObj.data;
              var themeContent = JSON.parse(data.roomTheme.themeContent);
              //有视频显示视频
              if (data.isLock == 0) {
                self.videoInfo.videoSrc = data.videoUrl;
                self.videoInfo.isHiddenVideo = false;
                return;
              }
              //无视频显示占位图片
              self.videoInfo.videoSrc = themeContent.stopLockImg;
              self.videoInfo.isHiddenVideo = true;
            }
          );
        }
      );
    },
    //消息数据处理
    changeMessageInfo(item) {
      var sentTime = item.sentTime;
      item.sentTime = filter.isToday(sentTime.replace(/\-/g, "/"));
      item.msgStr = filter.strToJson(item.content).txt;
      item.msgImg = filter.strToJson(item.content).img;
      item.msgStyle = filter.strToJson(item.content).style || "";
      if (item.citeSenderNickName && item.citeContent) {
        item.citeContentImg = filter.strToJson(item.citeContent).img;
        item.citeContent = filter.strToJson(item.citeContent).txt;
      }
      return item;
    },
    //更新聊天框高度
    updateScrollHeight(type) {
      var height = 0;
      var replysHeight = 0;
      self.messageInfo.map(item => {
        height += Math.ceil(item.msgStr.length / 12) * 48 + 100;
      });
      self.replyInfo.map(item => {
        replysHeight += Math.ceil(item.msgStr.length / 12) * 48 + 100;
      });
      this.scrollHeight = height;
      if (type) {
        this.replyscrollHeight = replysHeight;
      } else if (!this.showMask) {
        this.replyscrollHeight = replysHeight;
      } else if (this.showMask && this.isBottom) {
        this.replyscrollHeight = replysHeight;
      }
    },
    updateTopScroll(obj) {
      var height = 0;
      obj.map(item => {
        height += Math.ceil(item.msgStr.length / 12) * 48 + 100;
      });
      this.replyscrollHeight = height;
    }
  }
};
</script>

<style scoped lang="less">
@import "../less/live.less";
</style>


