<template>
	<div class="personalMy">
		<div class="poilcy_mask" v-if="loadingMask" :style="{height:totalHeight+'px'}"></div>
		<block v-if="!isLogin">
			<my-login :isFull="true" :tourl="'/pages/minePolicy/minePolicy'" :myheight="scrollHeight"></my-login>
		</block>
		<!-- 保单统计 -->
		<scroll-view scroll-y="true" class="person-center-top" :style="{height:scrollHeight+'px'}">
			<div class="person-title">
				<div class="person-title-desc">
					我的家庭
				</div>
			</div>
			<scroll-view scroll-x="true" class="person-list">
				<div class="person-li">
					<image
						mode="aspectFit"
						class="person-li-img"
						:src="user.headimgurl?user.headimgurl:imgsrc"
					></image>
					<div class="name line-one">{{ user.nickname || user.mobile }}</div>
				</div>
				<block v-if="shareUser">
					<div @click.stop="displayPloicyList('/pages/policyList/policyList',val.id)" class="person-li" v-for="(val,i) in shareUser">
						<image
							mode="aspectFit"
							class="person-li-img"
							:src="val.headimgurl?val.headimgurl:imgsrc"
						></image>
						<div class="name line-one">{{ val.nickname || val.mobile }}</div>
					</div> 
				</block>

				<div v-if="!shareFlag" class="person-li" @click.stop="noshare">
					<image mode="aspectFit" class="person-li-img addImg" src="https://bx.wts999.com/m/resource/xcxStatic/add.png"></image>
					<div class="name line-one">让家人知道</div>
				</div>

				<div v-else class="person-li sharePerson">
					<image mode="aspectFit" class="person-li-img addImg" src="https://bx.wts999.com/m/resource/xcxStatic/add.png"></image>
					<div class="name line-one">让家人知道</div>
					<button class="shareBtn" style="opacity: 0;height:190rpx;" open-type="share"></button>
				</div>
			</scroll-view>
			<!-- 尊享服务 -->
			<div class="vip_service">
				<div class="person-title"><div class="person-title-desc">尊享服务</div></div>
				<div class="vip_service_content">
					<div @click="navigateTo('/pages/bindPolicy/bindPolicy')" class="vip_service_box">
						<image class="vip_service_img" :src="imgSrc1"></image>
						<text>保单绑定</text>
					</div>
					<div @click="navigateTo('/pages/vertifyPolicy/vertifyPolicy')" class="vip_service_box">
						<image class="vip_service_img" :src="imgSrc2"></image>
						<text>保单验真</text>
					</div>
					<div @click="navigateTo('/pages/appointAdviser/appointAdviser')" class="vip_service_box">
						<image class="vip_service_img" :src="imgSrc3"></image>
						<text>顾问预约</text>
					</div>
				</div>
			</div>
			<div class="title">
				我的家庭保单汇总
			</div>
			<div class="box clearfix padd0">
				<div @click.stop="displayOrderList('/pages/orderList/orderList','1')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-1.png" class="icons-left"></image>
					<div class="item-e-title">全部有效保单（{{ insuranceCount.validCount || 0 }}）</div>
				</div>
				<div @click.stop="displayOrderList('/pages/orderList/orderList','-6.-7')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-2.png" class="icons-left"></image>
					<div class="item-e-title">已经失效保单（{{ insuranceCount.invalidCount || 0 }}）</div>
				</div>
				<div @click.stop="displayOrderList('/pages/orderList/orderList','1','0202')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-3.png" class="icons-left"></image>
					<div class="item-e-title">重疾保险保单（{{ insuranceCount['重疾'] || 0 }}）</div>
				</div>
				<div @click.stop="displayOrderList('/pages/orderList/orderList','1','0201')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-4.png" class="icons-left"></image>
					<div class="item-e-title">医疗保险保单（{{ insuranceCount['医疗'] || 0 }}）</div>
				</div>
				<div @click.stop="displayOrderList('/pages/orderList/orderList','1','03')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-5.png" class="icons-left"></image>
					<div class="item-e-title">意外保险保单（{{ insuranceCount['意外'] || 0 }}）</div>
				</div>
				<div @click.stop="displayOrderList('/pages/orderList/orderList','1','0102,0103')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-6.png" class="icons-left"></image>
					<div class="item-e-title">寿险及理财险保单（{{ insuranceCount['寿险'] || 0 }}）</div>
				</div>

				<div @click.stop="displayOrderList('/pages/orderList/orderList','1','inputPolicy')" class="li-vertical click-weixin">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/img-7.png" class="icons-left"></image>
					<div class="item-e-title">管理其他平台保单（{{ insuranceCount.inputCount || 0 }}）</div>
				</div>
			</div>

			<div class="kf-layer" v-show="isEttle">
				<div class="kf-box">
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/kf-auther.png" class="auther"></image>
					<image mode="aspectFit" src="https://bx.wts999.com/m/resource/xcxStatic/personal-my/kf-bac.png" class="bac"></image>
					<div class="text">
						<div class="text-content">联系客服电话</div>
						<div class="text-content">可录入外来保单，对家庭保单</div>
						<div class="text-content">进行统一管理</div>
					</div>
					<div class="btns">
						<div class="btn cancle" @click.stop="showOrHidePolicy(false)">取消</div>
						<button
							class="btn call"
							style="background: none;height: 100rpx;line-height: 100rpx;color:#000;font-size:34rpx;"
							open-type="contact"
							bindcontact="handleContact"
						>
							在线客服
						</button>
					</div>
				</div>
			</div>
		</scroll-view>
		<my-nav :navbar="navbar"></my-nav>
	</div>
</template>

<script>
import tools from '../../api/tools.js';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
// import lifecycleInterface from '../../components/lifecycleInterface/lifecycleInterface';
import util from '../../api/utils.js';
import myNav from '../../components/nav';
import login from '../../components/login.vue';

export default {
	data() {
		return {
			scrollHeight: -1,
			totalHeight: -1, //总高度
			loadingMask: true,
			navbar: 'service',
			shareFlag: false,
			user: {},
			params: {}, // 分享的参数
			showAppDown: false, //是否显示app下载
			isNavHide: true,
			isEttle: false, //一键理赔
			shareUser: [], //接收邀请用户
			shareUserId: '', //share分享ID
			insuranceCount: {
				validCount: 0, //全部有效保单
				invalidCount: 0, //已失效保单
				inputCount: 0, //录入保单
				重疾: 0, //重疾
				医疗: 0, //医疗
				意外: 0, //意外
				寿险: 0 //寿险及理财
			},
			imgsrc: require('../../assets/images/person-center-03.jpg'),
			imgSrc1: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/vip_service1.png',
			imgSrc2: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/vip_service2.png',
			imgSrc3: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/vip_service3.png',
			sharePath: "",
			isLogin: false,  // 是否登录
			loginHeight: ''
		}
	},
	methods: {
		// ...lifecycleInterface,
		navigateTo(url) {
			uni.navigateTo({
				url: url
			});
		},
		//客服回调
		handleContact() {},
		//跳转
		displayOrderList(url, status, type) {
			var status= status || '';
			var type= type || '';
			uni.navigateTo({
				url: url+'?status='+status+'&type='+type
			});
		},

		//跳转
		displayPloicyList(url, userId) {
			var userId= userId|| '';
			uni.navigateTo({
				url: url+'?userId='+userId+'&currentCom=policyList'
			});
		},

		//显示或隐藏录入外来保单
		showOrHidePolicy(flag) {
			this.isEttle = flag;
		},
		/**查询被邀请用户 */
		shareUserQuery() {
			var vm = this;
			this.$http({
				name: 'P_policyQuery',
				data: {}
			})
			.then(function(data, e) {
				vm.shareUser = data.data ? data.data : [];
			})
			.catch(error => {
				console.log(error);
			});
		},
		/**保险种类保单统计 */
		getIfyPolicy() {
			var vm = this;
			this.$http({
				name: 'P_classifyPolicyCount',
				data: {
					userId: this.user.id
				}
			})
			.then(function(data, e) {
				vm.insuranceCount = data.data;
				vm.loadingMask = false;
				notice.hideloading();
			})
			.catch(error => {
				console.log(error);
			});
		},
		showBack(s) {
			//监听弹出框关闭
			this.showAppDown = s;
		},
		noshare() {
			return notice.msg('您的保单还未分类，请给保单分类后再分享');
		},
		//拨打电话
		makingCall() {
			this.showOrHidePolicy(false);
			tools.makingCall(store.KFPhoneNumber);
		},

		/**邀请用户进入保单 */
		sharePolicyAdd() {
			var vm = this;
			this.$http({
				name: 'P_bind_newRelations',
				data: { userId: this.user.id }
			}).then(data => {
				if (!data.data.relations || data.data.relations.length == 0) {
					return (vm.shareFlag = false);
				}
				vm.getRelations();
			});
		},
		getRelations() {
			var vm = this;
			this.$http({
				name: 'P_policyShare'
			}).then(data => {
				let datas = data.data;
				vm.shareFlag = true;
				vm.params = "?name="+encodeURIComponent(vm.user.nickname||vm.user.mobile)+"&img="+vm.user.headimgurl+"&inviteId="+datas.userid+"&checkKey="+datas.checkKey;
				// vm.sharePath= escape("/pages/invitation/invitation"+vm.params);
			});
		}
	},
	onShareAppMessage(res) {
		var vm= this;
	    if (res.from === 'button') {// 来自页面内分享按钮
		console.log("share:",vm.params);
			return {
				title: vm.user.nickname + '分享了TA的家庭保单',
				// path: vm.params,
				path: '/pages/invitation/invitation'+vm.params,
				// #ifdef MP-WEIXIN
				imageUrl: 'https://bx.wts999.com/m/resource/xcxStatic/shrepolicy.jpg',
				// #endif
				// #ifdef MP-ALIPAY
				content: "理赔专人服务，保单一键分享，便捷分类管理，快来邀请家人一起管理保单吧！",
				bgImgUrl: 'https://bx.wts999.com/m/resource/xcxStatic/shrepolicyZfb.jpg',
				// #endif
			}
	    }else {
			return tools.myShare();
		}
	},
	created() {
		var that= this;
		notice.showloading('加载中...');
		uni.getSystemInfo({
			success: function(info) {
				//#ifdef APP-PLUS-NVUE
				that.scrollHeight = Number(info.windowHeight) - uni.upx2px(188);
				that.totalHeight = Number(info.windowHeight) - uni.upx2px(88);
				//#endif
				//#ifndef APP-PLUS-NVUE
				that.scrollHeight = Number(info.windowHeight) - uni.upx2px(100);
				that.totalHeight = Number(info.windowHeight);
				//#endif
			}
		});
		// tools.hideMenu();
	},
	onLoad() {
		notice.showloading('加载中...');
		// this.isLogin= store.login;
		
		tools.login()
		.then(res => {
			notice.hideloading();
			this.loadingMask= false;
			// this.isLogin= store.login;
			// 未登录去登录
			if(!store.login) return;
			if (!res.id) {
				this.isLogin= false;
				return;
			}
			this.isLogin= true;
			this.user = store.WTS_USER_XCX;
			this.getIfyPolicy(); //保险种类保单统计
			this.shareUserQuery();
			this.sharePolicyAdd();
		})
		.catch(err => {
			console.log(err);
		});
	},
	components: {
		'my-nav': myNav,
		'my-login': login
	}
}
</script>
<style lang="less" scoped>
@import './minePolicy.css';
.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
	background: #fff;
}
</style>
