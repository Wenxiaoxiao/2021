<template>
  <view class="send-chat" :style="{inputBottom}">
      <input adjust-position="false" type="text" placeholder="请输入" @focus="focusEvent" @blur="blurEvent" @input="adInputChange" :value="msg"></input>
      <button v-show="!avatar" open-type="getUserInfo" @getuserinfo="getInfoCallback">发送</button>
      <button v-show="avatar" @click="sendMessageEvent">发送</button>
  </view>
</template>
<script>

export default {
  props: {
    chatPlaceholder: String
  },
  data() {
	  return {
		msg: '',
		inputBottom: 'bottom: 0px',
		avatar: ''
	  }
  },
  methods: {
    adInputChange(e){
		this.msg= e.target.value;
    },
    focusEvent(e){
      this.inputBottom= 'bottom:'+e.detail.height+'px';
    },
    blurEvent(e){
      this.inputBottom= 'bottom: 0px';
    },
    sendMessageEvent() {
      var self= this;
      this.$emit("sendMsg",{
        chatMsg: self.msg
      })
      self.msg= '';
    },
    getInfoCallback(e) {
      var self = this;
      this.avatar= e.detail.userInfo.avatarUrl;
      uni.setStorageSync('avatarUrl', this.avatar);
      this.$emit("hasUserAva",{
        avatarUrl: self.avatar,
        chatMsg: self.msg
      })
    }
  },
  beforeCreate() { 
    this.avatar= uni.getStorageSync('avatarUrl');
	console.log("aaaaaaaaaaaaaaaaaa:",this.avatar);
  }
}
</script>

<style lang="scss" scoped>
	.send-chat{
	    position: fixed;
	    padding: 16rpx 30rpx 16rpx;
	    height: 105rpx;
	    background: #fff;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	    bottom: 0;
	
	    input{
	        padding-left: 20rpx;
	        flex: 1;
	        height: 72rpx;
	        border: none;
	        background: #eee;
	        border-radius: 8rpx;
	    }
	
	    button{
	        margin-left: 18rpx;
	        width: 130rpx;
	        height: 72rpx;
	        background-color: #0084ff;
	        border-radius: 8rpx;
	        font-family: SourceHanSansCN-Regular;
	        font-size: 34rpx;
	        line-height: 72rpx;
	        text-align: center;
	        color: #ffffff;
	    }
	}
</style>