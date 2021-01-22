<template>
	<div>
		<div class="poilcy_mask" v-if="loadingMask" :style="{height:loadingMaskHeight+'px'}"></div>
		<block v-if="!isLogin">
			<!-- <div class="nonebox"></div> -->
			<my-login style="padding-top: 110rpx;" :isFull="false" :tourl="'/pages/insureAnalysis/insureAnalysis'" :myheight="totalHeight"></my-login>
		</block>
		<div class="views" :style="{height:totalHeight+'px'}" v-else>
			<block v-if="noneData">
				<div class="nonData">
					<image class="empty-icon" src="https://bx.wts999.com/m/resource/xcxStatic/noClaims.png"></image>
					<div class="empty-tip">您还没有在梧桐树保险网购买过保单!</div>
				</div>
			</block>
			<block v-else>
				<scroll-view class="insure_nav_box" scroll-x="true">
					<div
						:class="[currentFamilyIdx==i?'active insure_nav':'insure_nav']"
						:style="{width:relationsWidth}"
						v-for="(item,i) in myFamily"
						@click="toggleTab(i,$event)"
						:data-id="item.allId"
					>
						{{ item.shortName }}
					</div>
				</scroll-view>
				<div class="insure_box" :style="{height:insureHeight+'px'}">
					<!-- 保单信息 -->
					<div class="insure_box_1" v-if="myAjax1&&myAjax2">
						<div class="insure_msg">
							<div class="insure_name">{{ myFamily[currentFamilyIdx].realName }}</div>
							<div class="insure_a">
								<div class="insure_a_box">
									<text class="a1">保单数:</text>
									<text class="b1">{{ insureMsg.policyCount }}份</text>
								</div>
								<div class="insure_a_box">
									<text class="a1">总保障:</text>
									<text class="b1">{{ insureMsg.guaranteeAmount }}万</text>
								</div>
								<div class="insure_a_box">
									<text class="a1">总保费:</text>
									<text class="b1">{{ insureMsg.premium }}元</text>
								</div>
							</div>
						</div>
						<!-- 险种比率 -->
						<div class="insure_rate">
							<div class="insure_item" v-for="(item,i) in listArr">
								<div class="fr">
									<text class="insure_type">{{ item.typeName }}</text>
									<div class="rate_box">
										<div v-if="item.guaranteeRate==0" class="rate zero_rate" style="width: 0;"></div>
										<div v-else-if="item.guaranteeRate>0&&20>=item.guaranteeRate" class="rate" style="width: 20%;">{{ item.guaranteeRate }}%</div>
										<div v-else class="rate" :style="{width:item.guaranteeRate+'%'}">{{ item.guaranteeRate }}%</div>
									</div>
									<text class="insure_amount">{{ item.available }}</text>
								</div>
							</div>
						</div>
						<div style="position:relative;text-align: center;">
							<image class="to_prefessor" :src="imgSrc"></image>
							<!-- #ifdef MP-WEIXIN -->
							<button
								class="kefu"
								:session-from="'nickName='+userInfo.nick+'|avatarUrl='+userInfo.headImage+'|gender='+userInfo.sex+'|country='+'|province='+userInfo.province+'|city='+userInfo.city"
								open-type="contact"
							></button>
							<!-- #endif -->
							<!-- #ifdef MP-ALIPAY -->
							<button class="kefu" @click="makeTel"></button>
							<!-- #endif -->
						</div>
					</div>
					<div class="insure_loading" v-else>
						<div class="loading_box">
							<image class="loading_img" src="https://bx.wts999.com/m/resource/xcxStatic/reload.gif"></image>
							<span class="loading_text">加载中</span>
						</div>
					</div>
				</div>
			</block>
		</div>
		<my-nav class="mynav" :navbar="navbar"></my-nav>
	</div>
</template>
<script>
import tools from '../../api/tools.js';
import http from '../../api/http.js';
import notice from '../../api/notice.js';
import store from '../../store/state';
import myNav from '../../components/nav.vue';
import  login from '../../components/login.vue';

export default {
	data() {
		return {
			userInfo: '',
			hasData: false,
			noneData: false,
			navbar: 'analysis',
			totalHeight:-1, // 页面总高度
			loadingMaskHeight: -1,
			insureHeight: -1, // 保障详情dom高度
			insureMsg: '',
			loadingMask: true,
			myFamily: [], // 家庭成员信息
			listArr: [],
			currentFamilyIdx: 0, // 当前选中成员
			currentPerson: {},
			imgSrc: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/toprofessor.png',
			relationsWidth: '750rpx', // 每个名字宽度
			myAjax1: false, // 保单ajax请求是否完成
			myAjax2: false,  // 保额ajax请求是否完成
			isLogin: false,   // 是否登录
		}
	},
	methods: {
		toggleTab(i, e) {
			if(this.myAjax1 && this.myAjax2) {
				this.currentFamilyIdx= i;
				this.listArr= [];
				this.myAjax1= false;
				this.myAjax2= false;
				this.getDetail(e.target.dataset.id);
			}
		},
		getDetail(id) {
			var that = this;
			// 获取保单详情
			this.$http({
				name: 'i_insure',
				data: {
					insuredIdentifyNumber: id
				}
			})
			.then(function(res) {
				var d = res.data;
				// 单位替换成万
				d.guaranteeAmount = Math.ceil(d.guaranteeAmount / 1000) / 10;
				d.premium = parseFloat(d.premium).toFixed(2);
				that.insureMsg = d;
				that.myAjax1= true;
			})
			.catch(function(res) {});
			// 获取保额详情
			this.$http({
				name: 'i_detail',
				data: {
					insuredIdentifyNumber: id
				}
			})
			.then(function(res) {
				var arr = [];
				res.data.map(function(item) {
					// available>=0 才显示
					if (item.available >= 0) {
						if (item.available == 0) {
							if (item.guaranteeRate == 0) {
								item.available = '无';
							} else {
								item.guaranteeRate = 100;
								item.available = '有';
							}
						} else {
							if (item.guaranteeRate >= 1) {
								item.guaranteeRate = '100';
							} else {
								item.guaranteeRate = (item.guaranteeRate * 100).toFixed();
							}
							item.available = Math.ceil((item.available / 10000).toFixed(1)) + '万';
						}
						arr.push(item);
					}
				});
				that.listArr = arr;
				that.myAjax2= true;
			})
			.catch(function(res) {
				console.log(res);
			});
		},
		getMyfamily() {
			var that = this;
			// notice.showloading('加载中...');
			this.userInfo = store.WTS_USER_XCX.wxInfo;
			this.$http({
				name: 'i_Analysis'
			})
			.then(function(res) {
				that.hasData = true;
				if (!res.data.length) {
					that.noneData = true;
					// notice.hideloading();
					return false;
				}
				// 每个名字长度
				if (res.data.length <= 4) {
					that.relationsWidth = 750 / res.data.length + 'rpx';
				} else {
					that.relationsWidth = '220rpx';
				}
				// 截取过长名字
				res.data.map(function(item) {
					// 对应id
					if(item.cards.length>1) {
						// 多个id之间加逗号
						var s="";
						item.cards.map(function(j) {
							s+= j.cardNo+","
						})
						item.allId= s.substring(0,s.length-1);
					}else {
						// 单个card直接取id
						item.allId= item.cards[0].cardNo;
					}
					if (item.realName.length > 4) {
						item.shortName = item.realName.slice(0, 4) + '...';
					} else {
						item.shortName = item.realName;
					}
				});
				that.getDetail(res.data[0].allId);
				that.myFamily = res.data;
				// notice.hideloading();
			})
			.catch(function(res) {
				console.log(res);
			});
		},
		makeTel() {
			tools.makingCall('400-9955-788');
		}
	},
	onLoad(option) {
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
			this.getMyfamily();
		})
		.catch(err => {
			console.log(err);
		});
	},
	created() {
		var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
				vm.loadingMaskHeight = Number(info.windowHeight);
				vm.totalHeight = Number(info.windowHeight) - uni.upx2px(188);
				vm.insureHeight = Number(info.windowHeight) - uni.upx2px(88+214);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.loadingMaskHeight = Number(info.windowHeight);
				vm.totalHeight = Number(info.windowHeight)- uni.upx2px(100);
				vm.insureHeight = Number(info.windowHeight) - uni.upx2px(214);
				// #endif
			}
		})
	},
	components: {
		'my-nav': myNav,
		'my-login': login
	},
	onShareAppMessage() {
		return tools.myShare();
	}
}
</script>

<style lang="less">
@import './insureAnalysis.css';
</style>
