<template>
	<div>
		<block v-if="!isLogin">
			<my-login :isFull="true" :tourl="'/pages/claimProgress/claimProgress'" :myheight="loginHeight"></my-login>
		</block>
		<div class="views">
			<div class="title_box">
				<div :class="[currentIdx==0?'active title':'title']" @click="toggleIdx(0)">进行中</div>
				<div :class="[currentIdx==1?'active title':'title']" @click="toggleIdx(1)">已完成</div>
			</div>
			<scroll-view :style="{height:scrollHeight+'px'}" scroll-y="true">
				<!-- 无数据 -->
				<div v-if="!claimData.length" class="none">
					<image class="none_face" :src="imgSrc1"></image>
					<p class="none_text">{{ noneStr }}</p>
					<p class="tips">温馨提示：<br>1.专人全程帮您理赔，享VIP理赔绿色通道<br>2.提供理赔法律援助<br>24小时客服热线：400-9955-788</p>
					<image class="fixed_icon" :src="imgSrc3" @click="goClaim"></image>
				</div>
				<!-- 有数据 -->
				<div v-else>
					<div v-for="(item,i) in claimData" class="item" :data-id="item.id" @click="claimDetail">
						<div class="item_title">
							<image class="a1" :src="imgSrc2"></image>
							<text class="a2">申请时间：{{item.createTime }}</text>
							<text class="a3">{{ claimStatus[item.settleStatus] }}</text>
						</div>
						<div class="item_content">
							<div class="b1">{{ item.insuranceProductName }}</div>
							<div class="b1">保单号：{{item.policyNo }}</div>
							<div class="b1">被保险人：{{item.dangerName }}</div>
						</div>
						<div v-if="item.settleResult" class="claim-return">
							<div class="name">
								理赔反馈：
								<text class="reason">{{ item.settleResult }}</text>
							</div>
						</div>
					</div>
					<!-- <div id="emptyDom">
						<block v-if="{{hasMore}}">
							<image class="a1" src="{{loadingImg}}"></image>
							<text class="a2">加载中...</text>
						</block>
						<block v-else>
							<text class="a3">-- 暂无更多数据 --</text>
						</block>
					</div> -->
				</div>
			</scroll-view>
		</div>
		<my-nav :navbar="navbar"></my-nav>
	</div>
</template>
<script>
import http from '../../api/http.js';
import tools from '../../api/tools.js';
import notice from '../../api/notice.js';
import myNav from '../../components/nav.vue';
import login from '../../components/login.vue';
import store from '../../store/state';

export default {
	data() {
		return {
			hasData: false,
			scrollHeight: -1,
			navbar: 'progress',
			currentIdx: 0, // 进行中0   已完成1
			imgSrc1: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/none_face.png',
			imgSrc2: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/icon_time.png',
			imgSrc3: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/icon_claim.png',
			loadingImg: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/loading.gif',
			noneStr: '您还没有理赔中的保单',
			claimStatus: ['受理中', '审核中', '审核通过', '打款中', '已完成'],
			claimData: [], // 显示的数据
			claiming: [], // 理赔中数据
			claimed: [], // 理赔完成数据
			currentNum: 1,
			isLogin: false,  // 是否登录
			loginHeight: ''
		}
	},
	methods: {
		getData() {
			var that = this;
			this.$http({
				name: 'c_progress',
				data: {
					pageNum: that.currentNum,
					pageSize: 99
				}
			})
				.then(function(res) {
					that.maxPage = res.pages;
					res.data.map(function(item) {
						// 进行(0,1,2,3)/已完成(4)状态分类
						if (item.settleStatus == 4) {
							that.claimed.push(item);
						} else {
							that.claiming.push(item);
						}
					});
					that.claimData = that.claiming;
					that.hasData = true;
					notice.hideloading();
					// if(that.currentNum==that.maxPage) {
					// 	that.hasMore= false;
					// }
				})
				.catch(function(res) {
					that.hasData = true;
					notice.hideloading();
				});
		},
		toggleIdx(i) {
			// 数据切换
			this.claimData = i ? this.claimed : this.claiming;
			// 无数据时提示切换
			this.noneStr = i ? '您还没有已完成理赔的保单' : '您还没有理赔中的保单';
			this.currentIdx = i;
		},
		// guaranteeLimit2(content) {
		// 	//根据产品类型判断是否显示保障金额
		// 	var val = '';
		// 	if (!content) return;
		// 	if ((content.typeCode && content.typeCode.indexOf('03') > -1) || (content.insuranceProductName && content.insuranceProductName.indexOf('重疾') > -1)) {
		// 		val = content.policy.guaranteeLimit + '元';
		// 	} else {
		// 		val = '详见保障权益';
		// 	}
		// 	return val;
		// },
		// 去保单页面
		goClaim() {
			uni.redirectTo({
				url: '/pages/policyList/policyList'
			});
		},
		claimDetail(e) {
			uni.navigateTo({
				url: '/pages/claimDetail/claimDetail?id='+e.currentTarget.dataset.id
			});
		}
	},
	onLoad() {
		notice.showloading('加载中...');
		// this.isLogin= store.login;
		
		tools.login()
		.then(res => {
			notice.hideloading();
			// this.isLogin= store.login;
			// 未登录去登录
			if(!store.login) return;
			if (!res.id) {
				this.isLogin= false;
				return;
			}
			this.isLogin= true;
			this.getData();
		})
		.catch(err => {
			console.log(err);
		});
	},
	onShow() {
		var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(88 + 192);
				vm.loginHeight = Number(info.windowHeight) - uni.upx2px(88 + 100);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(192);
				vm.loginHeight = Number(info.windowHeight) - uni.upx2px(100);
				// #endif
			}
		})
		// tools.hideMenu();
	},
	components: {
		"my-nav": myNav,
		'my-login': login
	},
	onShareAppMessage() {
		return tools.myShare();
	}
}
</script>

<style lang="less">
	@import './claimProgress.css';
</style>
