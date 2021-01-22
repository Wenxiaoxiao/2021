<!-- 课程学习 -->
<template>
  <view class="apps">
	  <scroll-view scroll-y="true" :style="{height: mainHeight+'px'}">
		<block v-if="!videoList.length"></block>
		<block v-else>
			<view class="class-info">
				<!-- #ifdef MP-TOUTIAO -->
				<video id="myVideo" class="class-video" :autoplay="true" :controls="true" :loop="true" :src="showVideoMsg.url" :bindplay="myLearn()" style="width:100%;height:422rpx;"></video>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<video id="myVideo" class="class-video" :autoplay="true" :controls="true" :src="showVideoMsg.url" @play="myLearn" style="width:100%;height:422rpx;"></video>
				<!-- #endif -->
			  <view class="class-title">{{showVideoMsg.briefTitle}}</view>
			  <view class="class-learn-amount">学习人数：{{showVideoMsg.count}}</view>
			</view>
			<view class="class-scroll">
			  <div class="sub-title">听课列表</div>
				<scroll-view class="scroller" scroll-x="true" :scroll-left="scrollLeft">
				  <view :id="'item'+index" class="class-box" :class="{'active':currentIndex == index}" v-for="(item,index) in videoList" :key="index" style="height: 164rpx;" @click="toggleClass(index)">
					<view class="class-box-name">{{item.title.length>25?item.title.substring(0,24)+'...':item.title}}</view>
				  </view>
				</scroll-view>
			</view>
			<view class="class-detail" v-if="showVideoMsg.introduce.length">
			  <div class="sub-title">课程介绍</div>
			  <parser :html="showVideoMsg.introduce" class="courseIntroduce"></parser>
			</view>
			<!-- <div class="bottom-space"></div> -->
		</block>
	  </scroll-view>
	  <my-nav :navbar="'learn'"></my-nav>
  </view>
</template>

<script>
var vm;

import http from '../../tool/http.js'
import tool from '../../tool/tools.js'
import myNav from '../../components/nav.vue'
import parser from "@/components/jyf-parser/jyf-parser.vue"

export default  {
  data() {
	  return {
		imgSrc: require("../../assets/images/learn/liveBanner.jpg"),
		videoList: [],
		showVideoMsg: Object,
		currentIndex: 0,
		isNewLearner: true,
		mainHeight: 0,
		scrollLeft: ''
	  }
  },
  onLoad(option) {
	vm= this;
	// 跳转进来选择的视频index
	this.currentIndex= option.index?option.index:0;
	// #ifdef MP-TOUTIAO
	uni.getSystemInfo({
		success: res => {
			getApp().globalData.windowHeight= res.windowHeight
			this.mainHeight= getApp().globalData.windowHeight- uni.upx2px(120);
		}
	})
	// #endif
	// #ifdef MP-WEIXIN
	uni.getSystemInfo({
		success: res => {
			getApp().globalData.windowHeight= res.windowHeight
			this.mainHeight= getApp().globalData.windowHeight- uni.upx2px(120);
		}
	})
	// #endif
  },
  onShow(){
      tool.getRecentVersion();
  },
  methods: {
    toggleClass(i) {
      this.currentIndex= i;
      this.showVideoMsg= this.videoList[i];
	},
    myLearn() {
		var that=this;
		console.log("this.videoList[this.currentIndex]",this.videoList[this.currentIndex]);
      if(this.videoList[this.currentIndex]&&this.videoList[this.currentIndex].isNewLearner) {
        this.videoList[this.currentIndex].isNewLearner= false;
        // 开始播放学习人数+1
        this.videoList[this.currentIndex].count= this.showVideoMsg.count = this.showVideoMsg.count+1;
		this.$http({
			name: 'nonezb',
			url: '/video/playVideo/'+this.showVideoMsg.id
		})
		.then(function(res) {
			console.log(res)
		})
      }
    }
  },
  created() {
    var _that= this;
    // 获取课程列表
	this.$http({
		name: 'getVideoList',
		data: {
		  offset: 0,
		  pageSize: 5
		}
	})
	.then(function(res) {
		  var data= res.data;
		  data.map(function(item) {
			  item.isNewLearner= true;
			item.briefTitle= item.title.length>20?item.title.slice(0,19)+'...':item.title
		  })
		  _that.videoList= data;
		  _that.showVideoMsg= data[_that.currentIndex];
			uni.hideLoading();
	  })
    },
	mounted() {
		var that= this;
		this.$nextTick(function(){
			that.scrollLeft= that.currentIndex*(uni.upx2px(312)+uni.upx2px(20));
		}) 
	},
    components: {
	    'my-nav': myNav,
	    parser
    },
	onShareAppMessage() {
			return {
				title: "买保险，你想了解的都在这里！", 
				path: "/pages/index/index",
				// #ifdef MP-TOUTIAO
				templateId: "57cla42fgafmap6jc9",
				desc: "名师解惑，让你成为朋友中的保险专家！",
				// #endif
				imageUrl: require('@/assets/images/index/share.jpg')
			}
	}
}
</script>

<style lang="scss" scoped>
  .apps {
      background: #f2f2f2;
      font-family: SourceHanSansCN-Regular;
      .class-info {
          background: #fff;
          .class-video {
              width: 100%;
              height: 422rpx;
          }
          .class-title {
              margin-top: 40rpx;
              padding-left: 30rpx;
              font-size: 34rpx;
              line-height: 34rpx;
              color: #000000;
          }
          .class-learn-amount {
			  padding: 20rpx 0 30rpx 30rpx;
              font-size: 26rpx;
              color: #0084ff;
          }
      }
      .class-scroll {
          padding: 25rpx 0 25rpx 30rpx;
          margin-top: 16rpx;
          background: #fff;
		  
              .scroller {
				  display: flex;
				  flex-wrap: nowrap;
				  white-space: nowrap;
				  padding-right: 30rpx;
				  align-items: flex-start;
                  width: 720rpx;
				  height: 164rpx;
                  .class-box {
					  display: inline-block;
                      margin-right: 20rpx;
                      //padding: 30rpx 22rpx;
					  padding:20rpx 22rpx;
                      vertical-align: top;
                      display: inline-block;
                      width: 312rpx;
                      height: 164rpx;
					  // line-height: 104rpx;
                      background-color: #f8f8f8;
                      border-radius: 8rpx;
                      font-size: 30rpx;
                      color: #666666;
                      border: 2rpx solid transparent;
					  box-sizing: border-box;
					  position:relative;
                      &.last-child {
                          margin-right: 0;
                      }
                      &.active {
                          background-color: #e3f1ff;
                          border: solid 2rpx #90c9ff;
                          color: #0084ff;
                      }
					  .class-box-name {
						  // overflow: hidden;
						  // text-overflow: ellipsis;
						  // white-space: nowrap;
						  width:268rpx;
						  white-space: normal;
						  position:absolute;
						  left:50%;
						  top:50%;
						  transform: translateX(-50%) translateY(-50%);
					  }
                  }
              }
      }
      .class-detail {
          padding: 25rpx 50rpx 25rpx 30rpx;
          margin-top: 16rpx;
          background: #fff;
          .class-text {
              font-size: 30rpx;
              color: #444444;
          }
	  }
  }
  .sub-title {
      margin-bottom: 28rpx;
      padding-left: 10rpx;
      font-size: 30rpx;
      height: 30rpx;
      line-height: 30rpx;
      border-left: 6rpx solid #0084ff;
  }
</style>
