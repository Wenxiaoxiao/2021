<template>
	<div class="views" :style="{height:totalHeight+'px'}">
		<p class="auth_title">梧桐树家庭保单<text class="auth_title_sub">智能管家</text></p>
		<p class="auth_info">帮您管理所有保单，明明白白买保险</p>
		<image class="auth_img" :src="img1"></image>
		<!-- #ifdef MP-ALIPAY -->
		<button v-if="!settingFlag" class="auth_btn" open-type="getAuthorize" @getAuthorize="aliAuthUser" onError="onAuthError" scope="userInfo">
			查看我的保单
		</button>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<button v-if="!settingFlag" class="auth_btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxAuthUser">
			查看我的保单
		</button>
		<!-- #endif -->
		<button class="auth_btn" v-else @click="phoneFlag= false">查看我的保单</button>
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
import store from '../../store/state';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import tools from '../../api/tools.js';
import util from '../../api/utils.js';
var vm;
export default {
	data() {
		return {
			settingFlag: false,
			phoneFlag: true,
			user: {},
			url: '',
			iv: '',
			img1: require('../../assets/images/authrize.jpg'),
			img2: require('../../assets/images/authrizeTel.png'),
			encryptedData: '',
			channel: '',
			totalHeight: -1
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
			console.log("111111111111");
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
		},
		aliAuthTel() {
			console.log("111111111111");
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
						uni.redirectTo({
							url: this.url
						});
					
				});
			});
		},
		// #endif
	},
	onLoad(query) {
		var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight) - uni.upx2px(88);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight);
				// #endif
			}
		})
		this.url = query&&query.path ? decodeURIComponent(query.path) : '/pages/policyList/policyList';
		this.query = query;
		this.channel = store.channel;
		console.log(this.channel);
	},
	mounted() {
		var vm= this;
		tools.getSetting().then(res => {
			console.log("getSetting:",res);
			vm.settingFlag = res;
			if (res) {
				tools.getPlatformUserInfo().then(userData => {
					console.log("getPlatformUserInfo");
					vm.user = userData;
					if (userData.id) {
						vm.phoneFlag = true;
						uni.redirectTo({
							url: vm.url
						});
					}
					// vm.phoneFlag = false;
				});
			}
		});
	}
}
</script>

<style lang="less" scoped>
	.views {
		padding-top: 98rpx;
		height: 100%;
		background: #fff;
		
		.auth_title {
			margin-bottom: 24rpx;
			line-height: 58rpx;
			font-size: 58rpx;
			color: #000;
			text-align: center;
			
			.auth_title_sub {
				color: #4580f6;
			}
		}
		.auth_info {
			margin-bottom: 60rpx;
			line-height: 30rpx;
			font-size: 30rpx;
			color: #666;
			text-align: center;
		}
		.auth_img {
			margin-bottom: 60rpx;
			width: 750rpx;
			height: 690rpx;
		}
		.auth_btn {
			margin: 0 auto;
			width: 540rpx;
			height: 90rpx;
			line-height: 90rpx;
			background: #4580f6;
			border-radius: 10rpx;
			font-size: 36rpx;
			color: #ffffff;
			text-align: center;
		}
		.pop {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(0,0,0,.5);
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
</style>
