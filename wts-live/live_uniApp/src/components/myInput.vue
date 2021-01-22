<template>
  <view class="send-chat" :style="[inputBottom,inputBottomObj]">
    <input
      :adjust-position="flag"
      type="text"
      placeholder="说点什么吧~"
      @focus="focusEvent"
      @blur="blurEvent"
      @input="adInputChange"
      :value="msg"
    />
    <block v-if="!avatarUrl">
      <!-- #ifdef MP-ALIPAY -->
      <button open-type="getAuthorize" @getAuthorize="aliAuthUser" scope="userInfo">发送</button>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxAuthUser">发送</button>
      <!-- #endif -->
    </block>
    <block v-else>
      <button @click="sendMessageEvent">发送</button>
    </block>
  </view>
</template>
<script>
import store from "../store/state";
export default {
  props: {
    chatPlaceholder: String
  },
  data() {
    return {
      flag:false,
      msg: "",
      inputBottom:{"bottom":"0px"},
      inputBottomObj:{},
      avatarUrl: "",
    };
  },
  methods: {
    adInputChange(e) {
      this.msg = e.target.value;
    },
    focusEvent(e) {
      var num = e.detail.height + "px";
      this.inputBottom = {"bottom":num};
    },
    blurEvent(e) {
      this.inputBottom = {"bottom":"0px"};
    },
    sendMessageEvent() {
      this.$parent.sendMessageEvent(this.msg);
      this.msg= "";
    },
    aliAuthUser(e) {
      console.log(e);
    },
    wxAuthUser(e) {
      if(!this.avatarUrl){
        store.WTS_USER = Object.assign(store.WTS_USER, e.detail.userInfo);
        this.avatarUrl = store.WTS_USER.avatarUrl;
        this.$parent.undateUserInfo();
        this.$parent.listenSocket()
      }
      this.$parent.sendMessageEvent(this.msg);
      this.msg= "";
    }
  },
  mounted() {
    this.avatarUrl = store.WTS_USER.avatarUrl;
  },
  destroyed() {
    this.msg= "";
  }
};
</script>

<style lang="scss" scoped>
.send-chat {
  position: fixed;
  padding: 16rpx 30rpx 16rpx;
  height: 100rpx;
  background: #fff;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  bottom: 0;
  border-top: 1rpx solid #e5e5e5;

  input {
    padding-left: 30rpx;
    flex: 1;
    height: 72rpx;
    border: none;
    background: #f9f9f9;
    border-radius: 36rpx;
    color: #333;
  }

  button {
    width: 130rpx;
    height: 72rpx;
    background-color: #fff;
    border-radius: 8rpx;
    font-family: SourceHanSansCN-Regular;
    font-size: 34rpx;
    line-height: 72rpx;
    text-align: center;
    color: #08bb07;
    &::after {
      border: none;
    }
  }
}
</style>