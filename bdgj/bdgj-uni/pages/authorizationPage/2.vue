<template>
	<div class="apps">
		<div class="top-panel center">
			<div class="logo"><div class="logo-img"></div></div>
			<div class="logo-text">梧桐树保险网</div>
		</div>
		<div class="text-panel">
			<div class="text-panel-content">
				<text>您已同意</text>
				<text class="desc">梧桐树保险网</text>
				<text>获取以下权限为您服务:</text>
			</div>
			<div class="text-panel-desc">获取您的公开信息 (昵称、头像、手机号等)</div>
		</div>
		<!-- #ifdef MP-ALIPAY -->
		<div class="logo-panel">
			<button v-if="!settingFlag" class="settingBtn" style="background:#0084ff;" open-type="getAuthorize" @getAuthorize="aliAuthUser" onError="onAuthError" scope="userInfo">
				授权获取您的用户信息
			</button>
			<button v-if="!phoneFlag" style="background:#0084ff;" class="settingBtn" open-type="getAuthorize" @getAuthorize="aliAuthTel" onError="onPhoneError" scope="phoneNumber">
				授权获取您的手机号
			</button>
		</div>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<div class="logo-panel">
			<button v-if="!settingFlag" class="settingBtn" style="background:#0084ff;" open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxAuthUser">
				授权获取您的用户信息
			</button>
			<button v-if="!phoneFlag" style="background:#0084ff;" class="settingBtn" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="wxAuthTel">
				授权获取您的手机号
			</button>
		</div>
		<!-- #endif -->
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
			encryptedData: '',
			channel: '',
			canIUseAuthButton: false
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
		console.log("authorized:",this.query);
		this.url = query&&query.path ? decodeURIComponent(query.path) : '/pages/policyList/policyList';
		this.query = query;
		vm = this;
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
					vm.phoneFlag = false;
				});
			}
		});
	}
}
</script>
<style lang="less" scoped>
@import '../../less/main';
.apps {
	background-color: #fff;
	height: 100vh;
}
.center {
	justify-content: center;
	align-items: center;
}
.inline-box {
	flex-direction: initial;
}
.top-panel {
	width: 100%;
	height: 420rpx;
	background: #fff;
	background-size: 100% 100%;
	justify-content: flex-start;
	padding-top: 50rpx;
}
.text-panel {
	padding: 40rpx;
	.text-panel-content {
		font-size: 32rpx;
		flex-direction: row;
		.desc {
			font-size: 32rpx;
			color: #0084ff;
		}
	}
	.text-panel-desc {
		font-size: 25rpx;
		line-height: 60rpx;
		color: #666;
	}
}
.logo {
	margin: 0 auto;
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	padding: 10rpx;
	background-color: #fff;
}
.logo-img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: url('https://bx.wts999.com/m/resource/xcxStatic/icons.png') no-repeat;
	background-size: 100% 100%;
}
.logo-text {
	width: 100%;
	text-align: center;
	color: #f66d05;
	font-size: 57rpx;
	font-weight: 900;
}
.logo-panel {
	padding: 40rpx;
	.settingBtn {
		width: 100%;
		margin-top: 40rpx;
		text-align: center;
		background: #0084ff;
		color: #fff;
	}
}
</style>
