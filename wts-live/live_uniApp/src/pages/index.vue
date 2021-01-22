<template>
  <scroll-view scroll-y="true" :style="{ height: totalHeight + 'px' }" class="body-container index">
    <loading :loaded="loaded"></loading>
    <block v-if="liveInfo.startStatus || liveInfo.startStatus == 0">
      <image class="live_banner" mode="widthFix" :src="liveInfo.banner" />
      <view class="live_info">{{liveInfo.name}}</view>
      <view class="live_time">{{liveInfo.startTime}}</view>
      <view class="live_main">
        <view class="live_title">
          <view class="live_text">详情介绍</view>
          <text class="line"></text>
        </view>
        <view v-if="liveInfo.introduce.length" class="class-detail-msg">{{liveInfo.introduce}}</view>
      </view>
      <view class="rich-box">
        <parser lazy-load="true" :html="liveInfo.description"></parser>
      </view>
      <block v-if="liveInfo.startStatus == 0">
        <block v-if="liveInfo.subscribeStatus==0">
          <form :report-submit="true" @submit="signUpEvent" style="width:0;">
            <button form-type="submit" class="appointlive">预约直播</button>
          </form>
        </block>
        <block v-else>
          <button class="appointlive">已预约</button>
        </block>
      </block>
      <block v-else-if="liveInfo.startStatus == 1">
        <button class="tolive" @click="toUrl">立即观看</button>
      </block>
      <block v-else>
        <button class="tolive">已结束</button>
      </block>
      <view class="blank"></view>
    </block>
    <block v-else>
      <view>
        <image
          mode="widthFix"
          src="https://bx.wts9999.net/m/lib/images/live/noclass.jpg"
          style="width: 100%;"
        />
      </view>
    </block>
  </scroll-view>
</template>

<script>
import tools from "../api/tools";
import filter from "../api/filter";
import notice from "../api/notice.js";
import http from "../api/http.js";
import store from "../store/state";
import utils from "../api/utils";
import loading from "../components/loading.vue";
import parser from "../components/jyf-parser/jyf-parser";
export default {
  data() {
    return {
      //初始化加载动画
      loaded: false,
      //窗口总高度
      totalHeight: -1,
      //用户信息
      liveInfo: null,
      timer: null,
	  roomId: 0,
	  courseId: 0
    };
  },
  components: {
    loading: loading,
    parser: parser,
    
  },
  onLoad(e) {
    this.roomId = e.roomId || 1;
    this.courseId = e.courseId || 86;
    store.roomId = this.roomId;
    store.courseId = this.courseId;
    notice.alert(store.roomId);
    notice.alert(store.courseId);
  },
  onShow(e) {
    setTimeout(() => {
      this.loaded = true;
    }, 10000);
    uni.getSystemInfo({
      success: info => {
        this.totalHeight = Number(info.windowHeight);
      }
    });
    this.getuserToken(() => {
      this.getClass();
    });
  },
  methods: {
    //根据code获取临时用户的code(游客模式)
    getuserToken(callback) {
      var that = this;
      if (store.token) {
        return callback();
      }
      uni.login({
        success(res) {
          that
            .$http({
              name: "getLoginInfo",
              data: {
                code: res.code
              }
            })
            .then(res => {
              store.WTS_USER = res.data;
              store.token = res.data.token;
              callback();
            });
        }
      });
    },
    // 直播信息
    getClass() {
      var that = this;
      this.$http({
        name: "getClassDetail",
        data: {
          id: this.courseId,
          roomId: this.roomId
        }
      }).then(function(res) {
        setTimeout(function(){
          that.loaded = true;
        },1000);
        var startTimes = res.data.startTime;
        res.data.startTime = filter.formatTime(res.data.startTime);
        that.liveInfo = res.data;
        clearInterval(that.timer);
        if (res.data.startStatus != 2) {
          that.timer = setInterval(() => {
            that.getClass();
          }, 5000);
        }
      });
    },
    // 预约直播
    signUpEvent(e) {
      var _self = this;
      var courseId = this.liveInfo.id;
      var formid = e.detail.formId;
      this.$http({
        name: "subscribeClass",
        data: {
          courseId,
          formid
        }
      }).then(function(res) {
        notice.msg(res.data.message);
        _self.getClass();
      });
    },
    toUrl() {
      clearInterval(this.timer);
      uni.navigateTo({
        url: "/pages/live"
      });
    }
  },
  //分享相关
  onShareAppMessage(res) {
    return {
      path: "/pages/index",
      title: "保险方案专家1对1量身定制",
      desc: "【限时领取】1对1专家咨询，个人及家庭保险方案量身定制。",
      content: "【限时领取】1对1专家咨询，个人及家庭保险方案量身定制。",
      imageUrl: "https://bx.wts9999.net/m/lib/images/srdz/share.jpg"
    };
  }
};
</script>

<style scoped lang="less">
.index {
  view,
  image,
  img {
    flex-direction: column;
    width: 100%;
  }
  .live_banner {
    width: 100%;
  }
  .live_info {
    padding: 20rpx 30rpx;
    font-size: 34rpx;
    line-height: 42rpx;
    background-color: #fff;
  }
  .live_time {
    padding: 0 30rpx 30rpx;
    background-color: #fff;
    font-size: 26rpx;
    color: #666;
  }
  .live_main {
    background-color: #fff;
    margin-top: 16rpx;
    .live_title {
      position: relative;
      .live_text {
        margin: 0 auto;
        position: relative;
        z-index: 2;
        width: 184rpx;
        font-size: 36rpx;
        line-height: 96rpx;
        color: #000;
        font-weight: bold;
        text-align: center;
        background-color: #fff;
      }
      .line {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 360rpx;
        transform: translate(-50%, -50%);
        border-bottom: 2px solid #aabac5;
      }
    }
    .class-detail-msg {
      padding: 0 30rpx 30rpx;
      font-size: 32rpx;
    }
  }
  .rich-box {
    padding: 20rpx;
    background: #fff;
    .rich-text {
      font-size: 32rpx;
      p {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
  .tolive,
  .appointlive {
    position: fixed;
    left: 50%;
    bottom: 27rpx;
    transform: translateX(-50%);
    width: 650rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #0092ff;
    box-shadow: 0px 2rpx 8rpx 0px rgba(0, 0, 0, 0.32);
    border-radius: 40rpx;
    font-weight: bold;
    font-size: 38rpx;
    color: #ffffff;
  }
  .appointlive {
    background-color: #ffa200;
  }
  .blank {
    height: 110rpx;
    background: #fff;
  }
}
</style>


