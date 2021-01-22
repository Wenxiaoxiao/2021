<template>
	<div class="views" :class="{'full_views':isFull, 'active': !phoneFlag}" :style="{height: myheight+'px'}">
		<image v-if="!isFull" class="bg" :src="imgSrc"></image>
		<p v-if="!isFull" class="bg_info">您还没有登录</p>
		<block>
			<!-- #ifdef MP-ALIPAY -->
			<button v-if="!settingFlag" :class="isFull?'auth_full_btn':'auth_btn'" open-type="getAuthorize" @getAuthorize="aliAuthUser" onError="onAuthError" scope="userInfo">
				{{isFull?'':'登录后查看家庭保障'}}
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button v-if="!settingFlag" :class="isFull?'auth_full_btn':'auth_btn'" open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxAuthUser">
				{{isFull?'':'登录后查看家庭保障'}}
			</button>
			<!-- #endif -->
			<button :class="isFull?'auth_full_btn':'auth_btn'" v-else @click="phoneFlag= false">{{isFull?'':'登录后查看家庭保障'}}</button>
		</block>
		<div class="pop" v-show="!phoneFlag">
			<div class="popbox">
				<image class="authtel_img" :src="img2"></image>
				<p class="authtel_title">绑定手机号</p>
				<p class="authtel_info">使用家庭保单管家前，请先绑定您的手机号！</p>
				<div class="authtel_btn">
					<button class="authtel_button" @click="phoneFlag= true">暂不绑定</button>
					<!-- #ifdef MP-ALIPAY -->
					<button class="authtel_button authtel_ok" open-type="getAuthorize" @getAuthorize="aliAuthTel" onError="onPhoneError" scope="phoneNumber">
						确认绑定
					</button>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<button class="authtel_button authtel_ok" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="wxAuthTel">
						确认绑定
					</button>
					<!-- #endif -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '../store/state';
	import notice from '../api/notice.js';
	import http from '../api/http.js';
	import tools from '../api/tools.js';
	import util from '../api/utils.js';
	export default {
		props: ['tourl','myheight','isFull'],
		data() {
			return {
				imgSrc: require('../assets/images/login_bg.png'),
				img2: require('../assets/images/authrizeTel.png'),
				settingFlag: false,
				phoneFlag: true,
				user: {},
				url: '/pages/policyList/policyList',
				iv: '',
				encryptedData: '',
				channel: ''
			}
		},
		watch: {
			tourl: function(newV,oldV) {
				this.url= newV;
				console.log("tourl2:",this.url);
			}
		},
		methods: {
			// #ifdef MP-WEIXIN
			wxAuthUser(e) {
				console.log(e);
				if (e.detail.errMsg.indexOf('ok') > -1) {
					notice.showloading('加载中');
					tools.getPlatformUserInfo().then(userData => {
						this.user = userData;
						notice.hideloading();
						if (userData.id) {
							uni.redirectTo({
								url: this.url
							});
						} else {
							notice.msg("获取用户信息成功")
							this.settingFlag = true;
							this.phoneFlag = false;
						}
					});
				}
			},
			wxAuthTel(e) {
				if (e.detail.errMsg.indexOf('ok') > -1) {
					this.iv = e.detail.iv;
					this.encryptedData = e.detail.encryptedData;
					notice.showloading('加载中');
					this.$http({
						name: 'minplatRegister',
						data: { iv: this.iv, encryptedData: this.encryptedData, serverCode: 'wxmini' }
					})
					.then(res => {
						notice.hideloading();
						
							store.WTS_USER_XCX = res.data;
							store.token = res.token;
							store.login= true;
							uni.redirectTo({
								url: this.url
							});
						
					})
					.catch(err => {
						notice.hideloading();
					});
				}
			},
			// #endif
			// #ifdef MP-ALIPAY
			aliAuthUser(res) {
				notice.showloading('加载中');
				tools.getPlatformUserInfo().then(userData => {
					this.user = userData;
					notice.hideloading();
					if (userData&&userData.id) {
						uni.redirectTo({
							url: this.url
						});
					} else {
						notice.msg("获取用户信息成功")
						this.settingFlag = true;
						this.phoneFlag = false;
					}
				});
			},
			aliAuthTel() {
				console.log("_login123:",this.url);
				notice.showloading('加载中');
				util.getAliPhoneNumber().then(res => {
					let phone = JSON.parse(res).response;
					this.$http({
						name: 'ali_minplatRegister',
						data: {
							phone,
							serverCode: 'alpmini'
						}
					}).then(res => {
						notice.hideloading();
					
							store.WTS_USER_XCX = res.data;
							store.token = res.token;
							store.login= true;
							uni.redirectTo({
								url: this.url
							});
						
					});
				});
			},
			// #endif
		},
		created(query) {
			// var vm= this;
			// uni.getSystemInfo({
			// 	success: function(info) {
			// 		// #ifdef APP-PLUS-NVUE
			// 		vm.totalHeight = Number(info.windowHeight) - uni.upx2px(88);
			// 		// #endif
			// 		// #ifndef APP-PLUS-NVUE
			// 		vm.totalHeight = Number(info.windowHeight);
			// 		// #endif
			// 	}
			// })
			// this.url = query&&query.path ? decodeURIComponent(query.path) : '/pages/policyList/policyList';
			// this.query = query;
			// this.channel = store.channel;
			// console.log(this.channel);
		},
		mounted() {
			var vm= this;
			tools.getSetting().then(res => {
				console.log("loginsettingFlag:",res);
				vm.settingFlag = res;
				// if (res) {
				// 	tools.getPlatformUserInfo().then(userData => {
				// 		console.log("getPlatformUserInfo");
				// 		vm.user = userData;
				// 		if (userData.id) {
				// 			vm.phoneFlag = true;
				// 			store.login= true;
				// 			uni.redirectTo({
				// 				url: vm
				// 			});
				// 		}
				// 	});
				// }
			});
		}
	}
</script>

<style lang="less" scoped>
	.views {
		position: relative;
		height: 100%;
		background: #F5F5F5;
		text-align: center;
		.bg {
			margin-top: 220rpx;
			margin-bottom: 50rpx;
			width: 208rpx;
			height: 298rpx;
		}
		.bg_info {
			margin-bottom: 40rpx;
			font-size: 30rpx;
			line-height: 36rpx;
			color: #999999;
		}
		.auth_btn {
			margin: 0 auto;
			width: 450rpx;
			height: 90rpx;
			line-height: 90rpx;
			background-color: #4580f6;
			border-radius: 10rpx;
			font-size: 32rpx;
			color: #ffffff;
			text-align: center;
		}
		.pop {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(0,0,0,.5);
			z-index: 101;
			.popbox {
				padding-top: 94rpx;
				position: relative;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-56%);
				width: 540rpx;
				height: 356rpx;
				background: #fff;
				border-radius: 10rpx;
				box-sizing: border-box;
			}
			.authtel_img {
				position: absolute;
				left: 50%;
				top: -70rpx;
				transform: translateX(-50%);
				width: 140rpx;
				height: 140rpx;
			}
			.authtel_title {
				margin-bottom: 24rpx;
				font-size: 36rpx;
				line-height: 36rpx;
				color: #000;
				text-align: center;
				font-weight: bold;
			}
			.authtel_info {
				margin: 0 auto 36rpx;
				width: 450rpx;
				font-size: 30rpx;
				line-height: 36rpx;
				text-align: left;
			}
			.authtel_btn {
				display: flex;
				flex-direction: row;
				border-top: 1px solid #DCDCDC;
				.authtel_button {
					width: 50%;
					height: 100rpx;
					line-height: 100rpx;
					box-sizing: border-box;
					background: #fff;
					font-size: 32rpx;
					color: #999999;
					border: none;
					border-radius: 0 0 0 10rpx;
					&::after {
						border: none;
						border-radius: 0;
					}
				}
				.authtel_ok {
					color: #4580f6;
					border-left: 1px solid #DCDCDC;
					border-radius: 0 0 10rpx 0;
				}
			}
		}
	}
	.full_views {
		position: absolute;
		width: 100%;
		z-index: 99;
		opacity: 0;
		&.active {
			opacity: 1;
			background: transparent;
		}
		.auth_full_btn {
			position: relative;
			width: 100%;
			height: 100%;
			background: transparent;
			border-radius: 0;
			z-index: 100;
			&:after {
				border-right: 0;
				border: none;
			}
		}
	}
</style>
