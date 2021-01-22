<template>
	<div class="index-view">
		<scroll-view scroll-y="true" class="content" :style="{height: mainHeight + 'px'}">
			<block v-if="!liveInfo"></block>
			<block v-else>
				<!-- 头图 -->
				<image class='topbg' mode="widthFix" :src="topBg" @click="toUrl1(topUrl)"></image>
				<!-- 顶部按钮 -->
				<div class="top" v-if="showTopList">
					<div class="part" v-show="item.showItem" v-for="(item,dataIndex) in topListData" @click="toUrl(item.url)" :key="dataIndex">
						<image :src="item.pic"></image>
						<p class="part_title">{{item.name}}</p>
					</div>
				</div>
				<!-- 支付按钮 -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- <button class="mini-btn" type="warn" size="mini" @click="createPay">支付0.01元</button> -->
				<!-- #endif -->
				<!-- 直播课堂 -->
				<div v-if="isWx" class="sec_live">
					<div class="live_title"><div class="live_text">直播课堂</div><span class="line"></span></div>
					<image mode="widthFix" class="live_img" :src="liveInfo.banner"></image>
					<div class="live_bottom">
						<p class="live_info">{{liveInfo.name}}</p>
						<block v-if="liveInfo.startStatus == 0">
							<block v-if="liveInfo.subscribeStatus==0">
								<form :report-submit="true" @submit="signUpEvent">
									<button form-type="submit" class="live_to appointlive">预约直播</button>
								</form>
							</block>
							<block v-else>
								<button class="live_to appointlive">已预约</button>
							</block>
						</block>
						<block v-else-if="liveInfo.startStatus == 1">
							<button class="live_to" @click="toUrl('/pages/liveDetail/liveDetail')">立即观看</button>
						</block>
						<block v-else-if="liveInfo.startStatus == 2">
							<button class="live_to" @click="toUrl('/pages/liveDetail/liveDetail')">进入回看</button>
						</block>
					</div>
				</div>
				<!-- 课程学习 -->
				<div class="sec_learn">
					<div class="learn_title">
						<p class="learn_maintitle">课程学习</p>
						<div class="learn_more" @click="toUrl('/pages/learn/learn?index=0')">更多课程<i class="iconfont icon-gengduo"></i></div>
					</div>
					<div class="learn_main">
						<div class="learn_item" v-for="(item,index) in classListData" :key="index">
							<div class="learn_img" @click="toUrl('/pages/learn/learn?index='+index)">
								<image :src="item.banner"></image>
								<p class="learn_amount"><image class="learn_play" :src="learnPlayImg" alt="">{{item.count}}次</p>
							</div>
							<p class="learn_title">{{item.title}}</p>
						</div>
					</div>
				</div>
				<!-- 方案设计 -->
				<div v-if="isWx" class="sec_plan">
					<p class="plan_title">方案设计</p>
					<div class="plan_img">
						<image v-for="(item,caseIndex) in caseList" :src="item.pic" @click="toUrl('/pages/myplan/myplan')" :key="caseIndex"></image>
					</div>
				</div>
				<!-- 底部 -->
				<div class="common-bottom">
					<!-- <div class="tel-box" @click="tel">
						<div class="d1">7*24小时<br>客户热线</div>
						<div class="d2">400-9955-788<image :src="img4" mode="widthFix"></image></div>
					</div> -->
					<div class="freeConsult">
						<div class="des">保险相关任何疑问，欢迎咨询梧桐树保险网</div>
						<div class="btn" @click="footUrl('https://www.wts999.com/theme/m/wtsbxdx.html')"><image :src="touxiang"/><span>预约免费咨询</span></div>
					</div>
					<div class="externalpages">
						<div>
							<div @click="footUrl('https://www.wts999.com/gywm/gywm.html?comeFrom=xcx')">关于梧桐树</div>
							<div @click="footUrl('https://www.wts999.com/theme/m/bxyjy.html?comeFrom=xcx')">保险研究院</div>
							<div  @click="footUrl('https://bx.wts999.com/m/exercise/usersLoves.html?comeFrom=xcx')" class="d3">梧桐树大数据</div>
						</div>
						<div>
							<div @click="footUrl('https://bx.wts999.com/m/exercise/wylpldfw.html')">六大保单服务</div>
							<div @click="footUrl('https://bx.wts999.com/exercise/wylphow.html')">梧优理赔</div>
							<div @click="footUrl('https://bx.wts999.com/m/exercise/wylpxp.html')" class="d3">理赔承诺书</div>
						</div>
					</div>
					<div class="certifi-box">
						<div>
							<image class="certifi-img" :src="img1" mode="widthFix"></image>
							<span>双保险资质</span>
						</div>
						<div>
							<image class="certifi-img" :src="img2" mode="widthFix"></image>
							<span>银保监会网销许可</span>
						</div>
						<div>
							<image class="certifi-img" :src="img3" mode="widthFix"></image>
							<span>13年家庭保险配置</span>
						</div>
					</div>
					<!-- <div class="externalpages">
						<view class="foot_link" @click="footUrl('https://bx.wts999.com/m/exercise/wylpldfw.html')">六大保单服务</view>
						<view class="foot_link" @click="footUrl('https://bx.wts999.com/exercise/wylphow.html')">梧优理赔</view>
						<view class="foot_link" @click="footUrl('https://bx.wts999.com/m/exercise/wylpxp.html')">理赔承诺书</view>
						<view class="foot_link" @click="footUrl('https://www.wts999.com/gywm/gywm.html?comeFrom=xcx')">关于梧桐树</view>
					</div> -->
					<!-- <div class="space"></div> -->
				</div>
				<!-- <div class="bottom-space"></div> -->
			</block>
		</scroll-view>
		<my-nav :navbar="'index'"></my-nav>
	</div>
</template>

<script>
	import myNav from '../../components/nav.vue'
	import tool from '../../tool/tools.js'
	import store from '../../store.js'
	
	export default {
		data() {
			return {
				mainHeight: 0,
				topListData: [],
				showTopList: true, // 是否显示顶部按钮
				topBg: '', // 顶部banner
				topUrl:'',
				caseList: [], // 方案设计列表
				learnPlayImg: require('../../assets/images/index/learn_play.png'),
				liveInfo: '', // 直播课堂
				classListData: [], // 课程学习
				isWx: true, // 是否是微信小程序
				img1: require("../../assets/images/index/foot1.png"),
				img2: require("../../assets/images/index/foot2.png"),
				img3: require("../../assets/images/index/foot3.png"),
				img4: require("../../assets/images/index/foot_tel.png"),
				touxiang:require("../../assets/images/index/touxiang.png"),
			}
		},
		onLoad() {
		},
		methods: {
			//banner图跳转
			toUrl1(url){
				console.log(url);
				var isShow= tool.queryString(url,"isShow");
				if(isShow) {
					if(isShow==1) {//在微信跳转
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: url
						})
						// #endif
					}
				}
			},
			// 顶部按钮跳转
			toUrl(url) {
				console.log("url",url);
				if(url.indexOf('wts_xcx')>-1) {
					// wts_xcx 跳转到其他小程序
					var appId= tool.queryString(url,"appId");
					var data= tool.queryString(url,"data");
					var path= url.slice(0,url.indexOf("?"));
					uni.navigateToMiniProgram({
					  appId: appId,
					  // path: path,
					  extraData: {
					    'data': data
					  },
					  success(res) {
						  console.log('navigateToMiniProgram:',res);
					    // 打开成功
					  },
					  fail(res) {
						  console.log('navigateToMiniProgram:',res);
					  }
					})
				}else if (url.indexOf('wts_webview')>-1) {
					// web_view外链
					uni.navigateTo({
						url: '/pages/webView?url='+encodeURIComponent(url)
					});
				}else {
					// 当前小程序其他页面
					uni.navigateTo({
						url: url
					})
				}
			},
			// 底部链接跳转
			footUrl(url) {
				// web_view外链
				uni.navigateTo({
					url: '/pages/webView?url='+encodeURIComponent(url)
				});
			},
			// 拨打电话
			tel() {
				uni.makePhoneCall({
				    phoneNumber: '400-9955-788'
				});
			},
			// 顶部按钮
			topList() {
				var that=this;
				this.$http({
					name: 'index_topList'
				})
				.then(function(res) {
					// 不显示顶部
					if(!res.data.length) { return that.showTopList= false; }
					var d= res.data;
					// 顶部图标排序
					d.sort(function(a,b) {
						return a.sort - b.sort;
					})
					res.data.map(function(item,index) {
						// isShow   空: 所有平台小程序都显示 1: wx显示  2: tt显示 3: 都不显示
						var isShow= tool.queryString(item.url,"isShow");
						item.showItem= true;
						if(isShow) {
							if(isShow==1) {
								// #ifdef MP-TOUTIAO
								item.showItem= false;
								// #endif
							}else if(isShow==2) {
								// #ifdef MP-WEIXIN
								item.showItem= false;
								// #endif
							}else {
								item.showItem= false;
							}
						}
					})
					that.topListData= res.data;
				})
			},
			// banner和守护平凡链接
			getBanner() {
				var that= this;
				this.$http({
					name: 'index_banner'
				})
				.then(function(res) {
					that.topBg= res.data.bannerPic;
					that.topUrl = res.data.url
					// store.gaurdId= res.data.url;
				})
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
					that.caseList= d;
				})
			},
			// 预约直播
			signUpEvent(){
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
			// 课程学习 
			getVideo() {
				var that= this;
				this.$http({
					name: 'getVideoList',
					data: {
					  offset: 0,
					  pageSize: 99,
				    }
				})
				.then(function(res) {
					that.classListData= res.data.slice(0,4);
				})
			},
			// 直播信息
			getClass() {
				var that= this;
				this.$http({
					name: 'getClassDetail',
					data: {
						roomId: store.roomId
					}
				})
				.then(function(res) {
					res.data.introduce= tool.subString(res.data.introduce,15);
					that.liveInfo= res.data;
					store.courseId= that.liveInfo.id;
					uni.hideLoading();
				})
			},
			// 初始化
			initData() {
				this.getVideo();
				this.getCaseList();
				this.topList();
				this.getClass();
				this.getBanner();
			}
		},
		onShow() {
			tool.getRecentVersion();
			this.getVideo();
			this.getCaseList();
		},
		beforeCreate() {
		},
		created() {
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
			// #ifdef MP-TOUTIAO
			this.isWx= false;
			// #endif
			tool.login(this.initData);
			store.roomId= "1249985627554844673"; // 从首页直接进入直播间需要
		},
		components: {
			'my-nav': myNav
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

<style lang="scss" scoped="scoped">
	@import './index.scss';
</style>
