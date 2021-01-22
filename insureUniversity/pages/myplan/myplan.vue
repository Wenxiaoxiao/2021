<template>
	<div class="view">
		<scroll-view scroll-y="true" :style="{height: mainHeight+'px'}">
			<!-- #ifdef MP-WEIXIN -->
			<div class="top">
				<image class="topbg" mode="widthFix" :src="topBg"></image>
				<div class="tomyplan" @click="toUrl"></div>
			</div>
			<!-- #endif -->
			<div class="content">
				<div class="plan_box" v-for="(item,planIndex) in planData" :key="planIndex">
					<div class="plan_title">{{item.name}}</div>
					<div class="plan_list" v-if="item.relationPlans.length">
						<div class="plan_item" @click="showPlan(j)" v-for="(j,relationIndex) in item.relationPlans" :key="relationIndex">
							<image class="plan_img" :src="j.pic"></image>
							<div class="plan_info">{{j.name}}</div>
						</div>
					</div>
				</div>
			</div>
		</scroll-view>
		<!-- #ifdef MP-TOUTIAO -->
		<my-nav :navbar="'myplan'"></my-nav>
		<!-- #endif -->
	</div>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	import myNav from '../../components/nav.vue'
	import tool from '../../tool/tools.js';
	
	export default {
		data() {
			return {
				topBg: require('../../assets/images/plan/topbg.png'),
				planData: [],
				mainHeight: 0 // 窗口高度
			}
		},
		onShow(){
			tool.getRecentVersion();
		},
		onLoad() {
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
					this.mainHeight= getApp().globalData.windowHeight;
				}
			})
			// #endif
		},
		created() {
			this.getCaseList();
		},
		methods: {
			toUrl() {
				// 私人订制小程序
				uni.navigateToMiniProgram({
					appId: 'wxe83820da834838c9',
					success(res) {
					  console.log('navigateToMiniProgram:',res);
					// 打开成功
					},
					fail(res) {
					  console.log('navigateToMiniProgram:',res);
					}
				})
			},
			// 方案设计详情
			showPlan(j) {
				uni.navigateTo({
					url: '/pages/planDetail/planDetail?newsId='+j.url
				});
			},
			// 方案设计列表
			getCaseList() {
				var that= this;
				this.$http({
					name: 'plan_list'
				})
				.then(function(res) {
					var d= res.data;
					// 顶部图标排序
					d.sort(function(a,b) {
						return a.sort - b.sort;
					})
					that.planData= d;
				})
			}
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
	.view {
		position: relative;
		background-color: #f5f8fa;
		.top {
			position: relative;
			.topbg {
				width: 100%;
			}
			.tomyplan {
				position: absolute;
				bottom: 10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 480rpx;
				height: 90rpx;
				background-color: transparent;
			}
		}
		.content {
			padding: 10rpx 20rpx 40rpx;
			.plan_box {
				.plan_title {
					margin: 30rpx 10rpx 20rpx;
					font-weight: bold;
					font-size: 32rpx;
				}
				.plan_list {
					padding: 0 16rpx;
					background-color: #ffffff;
					box-shadow: 0px 0px 15rpx 0px rgba(0, 0, 0, 0.2);
					border-radius: 8rpx;
					.plan_item {
						display: flex;
						flex-direction: row;
						align-items: center;
						height: 150rpx;
						border-bottom: 2rpx solid #f1f1f1;
						&:last-child {
						border-bottom: none;
						}
						.plan_img {
							margin: 0 22rpx;
							width: 106rpx;
							height: 106rpx;
						}
						.plan_info {
							font-size: 34rpx;
							.plan_amount {
								color: #ff6c00;
							}
						}
					}
				}
			}
		}
		.richtext {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			background-color: #fff;
			.richtop {
				display:  flex;
				justify-content: space-between;
				padding: 0 20rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 40rpx;
			}
			.richbox {
				padding: 10rpx 20rpx;
			}
		}
	}
</style>
