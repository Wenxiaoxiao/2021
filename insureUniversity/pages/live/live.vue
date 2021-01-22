<!-- 直播课堂 -->
<template>
	<view class="view">
		<scroll-view scroll-y="true" :style="{ height: totalHeight + 'px' }">
			<block v-if="!liveInfo.banner"></block>
			<block v-else>
				<image class="live_banner" mode="widthFix" :src="liveInfo.banner" />
				<view class="live_info">{{liveInfo.name}}</view>
				<view class="live_time">{{liveInfo.startTime}}开始</view>
				<view class="live_main">
					<view class="live_title">
						<view class="live_text">详情介绍</view>
						<text class="line"></text>
					</view>
					<view v-if="liveInfo.introduce.length" class="class-detail-msg">{{liveInfo.introduce}}</view>
				</view>
				<view v-if="liveInfo&&liveInfo.descriptions" class="rich-box">
					<parser :html="liveInfo.descriptions" :tag-style="tagStyle"></parser>
				</view>
				<block v-if="liveInfo.startStatus == 0">
					<block v-if="liveInfo.subscribeStatus==0">
						<form :report-submit="true" @submit="signUpEvent">
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
				<block v-else-if="liveInfo.startStatus == 2">
					<button class="tolive" @click="toUrl">进入回看</button>
				</block>
				<view class="blank"></view>
			</block>
		</scroll-view>
		<my-nav :navbar="'live'"></my-nav>
	</view>
</template>

<script>
	import myNav from '../../components/nav.vue'
	import tool from '../../tool/tools.js'
	import store from '../../store.js'
	import parser from "@/components/jyf-parser/jyf-parser.vue"

	export default {
		data() {
			return {
				//窗口总高度
				totalHeight: 0,
				//用户信息
				liveInfo: '',
				timer: null,
				roomId: 0,
				courseId: 0,
				tagStyle:{
				    img: 'width:100% !important;height:auto !important;'
				  }
			}
		},
		methods: {
			// 直播信息
			getClass() {
				var that = this;
				this.$http({
					name: "getClassDetail",
					data: {
						roomId: this.roomId
					}
				}).then(function(res) {
					var startTimes = res.data.startTime;
					res.data.startTime = tool.formatTime(startTimes);
					that.liveInfo = res.data;
					uni.hideLoading();
					store.courseId= that.liveInfo.id;
					clearInterval(that.timer);
					if (res.data.startStatus != 2) {
						that.timer = setInterval(() => {
							that.getClass();
						}, 5000);
					}
				});
			},
			// 预约直播
			signUpEvent() {
				var _self = this;
				var tmplIds = store.tmplIds;
				var courseId = this.liveInfo.id;
				uni.requestSubscribeMessage({
					tmplIds: tmplIds,
					success(res) {
						if (res[tmplIds[0]] == "accept" || res[tmplIds[1]] == "accept") {
							_self.$http({
								name: "subscribeClass",
								data: {
									courseId
								}
							}).then(function(res) {
								uni.showToast({
									title: res.data.message,
									icon: 'none',
									duration: 2000
								})
								_self.getClass();
							});
						} else if (res[tmplIds[0]] == "reject" || res[tmplIds[1]] == "reject") {
							// #ifdef  MP-WEIXIN
							wx.getSetting({
								withSubscriptions:true,
								success(data) {
									if(data.subscriptionsSetting){
										var set = data.subscriptionsSetting;
										if (set[tmplIds[0]] == "reject" && set[tmplIds[1]] == "reject"){
											uni.showToast({
												title: "您取消了消息授权如需开启请前往'设置'界面打开!",
												icon: 'none',
												duration: 4000
											})
										}
									}
								}
							})
							// #endif
						}
					},
					fail(res) {
						// 20004:用户关闭了主开关，无法进行订阅,引导开启
						if (res.errCode == 20004) {
							cons.log(res);
						}
					}
				})
			},
			toUrl() {
				clearInterval(this.timer);
				uni.navigateTo({
					url: "/pages/liveDetail/liveDetail"
				});
			}
		},
		components: {
			'my-nav': myNav,
			parser
		},
		onLoad(e) {
			this.totalHeight= getApp().globalData.windowHeight;
			this.roomId = store.roomId || "1249985627554844673";
			this.courseId = e.courseId || 86;
			store.roomId = this.roomId;
			store.courseId = this.courseId;
			uni.showLoading({
			    title: '加载中'
			});
		},
		onShow() {
			this.getClass();
      		tool.getRecentVersion();
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
	.view {

		// view,
		// image,
		// img {
		// 	display: flex;
		// 	flex-direction: column;
		// 	width: 100%;
		// 	box-sizing: border-box;
		// }

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
			padding-bottom:100rpx;
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
			bottom: 127rpx;
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
			z-index: 3;
		}

		.appointlive {
			background-color: #ffa200;
		}

		.blank {
			height: 120rpx;
			background: #fff;
		}
	}
</style>
