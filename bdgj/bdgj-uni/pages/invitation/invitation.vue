<template>
	<div>
		<block v-if="!isLogin">
			<div class="nonebox"></div>
			<my-login :isFull="true" :tourl="loginUrl" :myheight="totalHeight"></my-login>
		</block>
		<div class="body-container invitation" :style="{height:totalHeight+'px'}">
			<image src="https://bx.wts999.com/m/lib/images/invitation-bac.png" class="bac"></image>
			<div class="top">
				<image :src="img || imgsrc" class="auther"></image>
				<div class="name">{{ name }}</div>
				<div class="text">邀请你加入Ta的共享保单</div>
				<div class="text">一起管理保单</div>
			</div>
			<form report-submit="true" @submit="submits">
				<button form-type="submit" class="btn" id="receive">接受邀请</button>
			</form>
		</div>
	</div>
</template>

<script>
import store from '../../store/state';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import tools from '../../api/tools.js';
import login from '../../components/login.vue';

const TIMERSIZE = 120; // 倒计时总时长 秒

export default {
	data() {
		return {
			name: '',
			checkKey: '',
			img: '',
			inviteId: '',
			user: {},
			totalHeight: -1,
			testName: '',
			isLogin: false,   // 是否登录
			loginHeight: -1,
			loginUrl: '',
			imgsrc: require('../../assets/images/person-center-03.jpg')
		}
	},
	methods: {
		submits(event) {
			var vm = this;
			console.log('submits112',event);
			if (this.user.id == this.inviteId) {
				notice.alert('您已加入家庭保单管理，不能重复加入哦！','我知道了',function() {
					return uni.redirectTo({
						url: '/pages/policyList/policyList'
					});
				})
			}
			this.$http({
				name: 'acceptPolicyShare',
				data: {
					inviteId: this.inviteId,
					checkKey: this.checkKey
				}
			})
			.then(function(data) {
				console.log("iviteData:",data)
				if (data.data.code == 1) {
					return uni.redirectTo({
						url: '/pages/policyList/policyList'
					});
				}
				notice.alert('加入成功,进入我的保单','我知道了',function() {
					uni.redirectTo({
						url: '/pages/policyList/policyList'
					});
				});
			})
			.catch(error => {
				console.log("inviteErr",JSON.stringify(error));
			});
		}
	},
	onLoad(query) {// url编码 
		this.loginUrl= '/pages/invitation/invitation?name='+query.name+"&img="+query.img+"&inviteId="+query.inviteId+"&checkKey="+query.checkKey;
		console.log("_invite1:",this.loginUrl);
		
		var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				console.log('windowHeight:',info)
				// #ifdef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight) - 88;
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight);
				// #endif
			}
		})
		notice.showloading('加载中...');
		// this.isLogin= store.login;
		
		tools.login()
		.then(res => {
		console.log("_invite2:",this.loginUrl);
			this.name = decodeURIComponent(query.name);
			this.checkKey = query.checkKey;
			this.img = query.img;
			this.inviteId = query.inviteId;
			this.user = store.WTS_USER_XCX;
			
			notice.hideloading();
			// this.isLogin= store.login;
			// 未登录去登录
			if(!store.login) return;
			if (!res.id) {
				this.isLogin= false;
				return;
			}
			this.isLogin= true;
		})
		.catch(err => {
			console.log(err);
		});
	},
	components: {
		'my-login': login
	}
}
</script>
<style lang="less" scoped>
.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
	background: #fff;
}
.invitation {
	height: 100%;
	position: relative;
	background-color: transparent;
	.bac {
		position: fixed;
		bottom: 0;
		left: 50%;
		margin-left: -375rpx;
		width: 750rpx;
		height: 1195rpx;
	}
	.top {
		padding-top: 100rpx;
		position: relative;
		z-index: 98;
		.auther {
			display: block;
			width: 175rpx;
			height: 175rpx;
			border-radius: 50%;
			border: 3px solid #0084ff;
			margin: 0 auto 5px;
		}
		.name {
			font-size: 30rpx;
			line-height: 1.5;
			margin-bottom: 10px;
			text-align: center;
			color: #000;
		}
		.text {
			color: #0084ff;
			text-align: center;
			font-size: 36rpx;
			line-height: 1.6;
		}
	}
	.btn {
		position: fixed;
		bottom: 50rpx;
		left: 50%;
		width: 700rpx;
		margin-left: -350rpx;
		font-size: 34rpx;
		line-height: 90rpx;
		text-align: center;
		color: #fff;
		background: #0084ff;
		border-radius: 90rpx;
	}
}
</style>