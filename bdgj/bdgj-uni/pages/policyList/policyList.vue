<template>
	<div class="views">
		<div class="policyList">
			<div class="poilcy_mask" v-if="loadingMask" :style="{ height: totalHeight + 'px' }"></div>
			<!-- 保单统计 -->
			<div class="policy-count" v-if="!iconIsHide">
				<!-- 未登录不允许点击 -->
				<div v-if="!isLogin" class="nonebox"></div>
				<div class="count-item" @click.stop="routerUrl('/pages/policyNumbers/policyNumber', '有效保单总数', '1')">
					<div class="p1">{{ policyCount.validPoliycNum || 0 }}</div>
					<div class="p2">有效保单总数</div>
				</div>
				<div class="count-item" @click.stop="routerUrl('/pages/policyNumbers/policyNumber', '近3月续费保单数', '2')">
					<div class="p1">{{ policyCount.needPay || 0 }}</div>
					<div class="p2">近3月续费保单数</div>
				</div>
				<div class="count-item" @click.stop="routerUrl('/pages/familyTotalPremium/familyTotalPremium', '今年家庭总保费', policyCount.totalFee)">
					<div class="p1">￥{{ policyCount.totalFee || 0 }}</div>
					<div class="p2">今年家庭总保费</div>
				</div>
			</div>
			<block v-if="!isLogin"><my-login :isFull="false" :tourl="'/pages/policyList/policyList'" :myheight="loginHeight"></my-login></block>
			<block v-else>
				<!-- 成员列表 -->
				<div class="issort-content" :class="[relationsClass]">
					<scroll-view class="carousel_content" scroll-x="true">
						<block v-for="(item, index) in relations">
							<div
								v-if="item.id"
								:style="{ width: relationsWidth }"
								@click.stop="isSortClick('1', item)"
								class="carousel_item"
								:class="{ active: insurederId == item.id }"
							>
								<text>{{ item.realName }}</text>
							</div>
							<div v-else :style="{ width: relationsWidth }" @click.stop="isSortClick('0', item)" class="carousel_item" :class="{ active: insurederId == item.id }">
								<text>{{ item.realName }}</text>
							</div>
						</block>
					</scroll-view>
				</div>

				<!--订单列表-->
				<div class="policyList">
					<!--<v-loading tip="加载中..." loading="{{loading}}"></v-loading>-->
					<scroll-view scroll-y="true" lower-threshold="100" @scrolltolower="getOrderListData" :style="{ height: scrollHeight + 'px' }">
						<block v-if="total > 0">
							<div class="cell" v-for="(itemdata, index) in orders">
								<policylistitem
									@actiondetail="actionDetail"
									@changerelations="changeMemberRelations"
									:itemdata="itemdata"
									:issort="isSort"
									:iconishide="iconIsHide"
								></policylistitem>
							</div>
							<div>
								<div class="noData">{{ showBottom }}</div>
							</div>
						</block>
						<block v-else>
							<div id="emptyDom">
								<div class="mescroll-empty">
									<image mode="widthFix" class="empty-icon" src="https://bx.wts999.com/m/resource/xcxStatic/noClaims.png"></image>
									<div class="empty-tip">您还没有在梧桐树保险网购买过保单!</div>
								</div>
							</div>
						</block>
					</scroll-view>
				</div>
			</block>
			<my-nav v-if="!shareid" :navbar="navbar"></my-nav>
		</div>
	</div>
</template>

<script>
import findIndex from 'lodash/findIndex';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
import filter from '../../api/filter';
import tools from '../../api/tools';
import util from '../../api/utils.js';
import myNav from '../../components/nav.vue';
import policylistitem from '../../components/policyList.vue';
import myLogin from '../../components/login.vue';

var vm = null;
export default {
	data() {
		return {
			showBottom: '',
			relationsWidth: '750rpx',
			navbar: 'policyList',
			shareid: '',
			userId: '',
			isSort: '0',
			totalHeight: -1, //总高度
			getDataFlag: true,
			scrollHeight: -1,
			iconIsHide: false, //被邀请人页面
			loading: false,
			loadingMask: true,
			relationsClass: '',
			relations: [], //成员列表初始化
			orders: [], //保单列表初始化
			page: {
				size: 20, //页容量
				num: 1 //页码(从1开始)
			},
			total: 0, //总个数
			insurederId: '', //当前请求分类的列表
			_index: 0,
			//保单统计
			policyCount: {
				// 有效保单数
				validPoliycNum: 0,
				//近3月保单数
				needPay: 0,
				//总保费
				totalFee: 0
			},
			isLogin: false, // 是否登录
			loginHeight: ''
		};
	},
	beforeCreate() {
		// util.hideShareMenu();
	},
	onLoad(option) {
		// console.log('$$$$$$$$')
		// console.log(this.orders.length)
		// console.log(this.total)
		// console.log(this.orders.length >= this.total)
		this.versionFn();
		notice.showloading('加载中...');
		vm = this;
		this.shareid = option.userId;
	
		this.iconIsHide = this.shareid ? true : false;
		tools
			.login()
			.then(res => {
				console.log('login:', res);
				notice.hideloading();
				this.loadingMask = false;
				this.isLogin = store.login;
				// 未登录去登录
				if (!store.login) return;
				if (!res.id) {
					this.isLogin = false;
					return;
				}
				this.userId = this.shareid || '';
				this.getPolicyCount();
				this.getRelations(function() {
					vm.getOrderListData();
				});
			})
			.catch(err => {
				console.log(err);
			});
	},
	onReady(){
		uni.getSystemInfo({
			success: function(info) {
				console.log('onload:', Number(info.windowHeight));
				store.platform = info.platform; // 客户端平台
				var number = vm.shareid ? 100 : 310;
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(number);
				vm.loginHeight = Number(info.windowHeight) - uni.upx2px(number - 100);
				vm.totalHeight = Number(info.windowHeight);
			}
		});
	},
	onShow() {
		//模拟数据
		// const arr = [{
		// 	"realName":"111",
		// 	id:'1',
		// },{
		// 	"realName":"222",
		// 		id:'2',
		// },{
		// 	"realName":"333",
		// 		id:'3',
		// }
		// ]
		vm.relations.push.apply(vm.relations, arr);
		if (store.hasComMit) {
			store.hasComMit = false;
			this.page.num = 1;
			vm.orders = [];
			this.getOrderListData();
		}
	},
	methods: {
		versionFn() {
			const updateManager = util.getUpdateManager();
			console.log('updateManager', updateManager);
			updateManager.onCheckForUpdate(res => {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
				if (res.hasUpdate) {
					util.showLoading({
						title: '正在更新小程序'
					});
				}
			});
			updateManager.onUpdateReady(() => {
				util.hideLoading();
				// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				updateManager.applyUpdate();
			});
			updateManager.onUpdateFailed(() => {
				// 新的版本下载失败
				notice.alert('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~');
			});
		},
		//查看保单详情的点击事件
		actionDetail(e) {
			if (e.item.policyNo == 0) return notice.msg('您的保单正在生成中，如有疑问，请联系你的专属顾问！');
			uni.navigateTo({
				url: '/pages/policyDetail/policyDetail?pid=' + e.item.pid + '&ishare=' + this.iconIsHide
			});
		},
		//修改成员分信息
		changeMemberRelations() {
			console.log('$$$$$$$$');
			console.log(this.orders.length);
			console.log(this.total);
			this.page.num = 1;
			this.orders = [];
			this.getRelations(function() {
				vm.getOrderListData();
			});
		},
		// 查看统计数据
		routerUrl(path, name, type) {
			var type = type || '';
			uni.navigateTo({
				url: path + '?name=' + name + '&type=' + type
			});
		},
		//获取成员分类数据
		getRelations(callback) {
			this.$http({
				name: 'P_bind_newRelations',
				data: {
					userId: this.userId
				}
			})
				.then(data => {
					vm.relationsClass = '';
					vm.changeRelationsText(data.data.relations);
					if (data.data.relations && data.data.relations.length > 0) {
						vm.relations = [
							{
								birthday: '',
								cards: [],
								id: '',
								realName: '全部',
								relationType: '',
								sex: null,
								userId: ''
							}
						];
						// //模拟数据
						//                   const arr = [{
						// 	"realName":"111",
						// 	id:'1',
						// },{
						// 	"realName":"222",
						// 		id:'2',
						// },{
						// 	"realName":"333",
						// 		id:'3',
						// }
						// ]
						vm.relations.push.apply(vm.relations, data.data.relations);
						//vm.relations.push.apply(vm.relations,arr);
					}

					if (vm.relations.length <= 4 && vm.relations.length != 0) {
						vm.relationsWidth = 750 / vm.relations.length + 'rpx';
					} else {
						vm.relationsWidth = '220rpx';
					}
					if (vm.relations.length) vm.relationsClass = 'borderNone';

					//处理字数

					callback();
				})
				.catch(error => {
					notice.alert('请求超时!');
					console.log(error);
				});
		},

		//处理relations字数
		changeRelationsText(relations) {
			for (var i = 0; i < relations.length; i++) {
				if (relations[i].realName.length > 5) {
					relations[i].realName = relations[i].realName.substring(0, 5) + '...';
				}
			}
			// console.log('****')
			// console.log(relations.length)
			// return
			// for (var i = 0; i < relations.length; i++) {
			// 	if (relations.length < 5) {
			// 		var size = 20 / relations.length;
			// 		relations[i].realName = relations[i].realName.length > size ? relations[i].realName.substring(0, size - 1) + '...' : relations[i].realName;
			// 	} else {
			// 		relations[i].realName = relations[i].realName.length > 3 ? relations[i].realName.substring(0, 3) + '...' : relations[i].realName;
			// 	}
			// }
		},
		//获取保单统计
		getPolicyCount() {
			this.$http({
				name: 'P_policyCount',
				data: {
					userId: this.userId
				}
			})
				.then(data => {
					console.log(data.data);
					vm.policyCount = data.data;
				})
				.catch(error => {
					notice.alert('请求超时!');
					console.log(error);
				});
		},

		//获取订单列表数据
		getOrderListData() {
			if ((this.orders && this.orders.length && this.orders.length >= this.total) || !vm.getDataFlag) {
				return;
			}
			vm.loading = true;
			notice.showloading('加载中...');
			vm.getDataFlag = false;
			var params = this.policyParams();
			var url = 'P_policyList';
			if (vm.isSort == 0) {
				url = 'get_allPolicy';
			}
			this.$http({
				name: url,
				data: params
			})
				.then(data => {
					vm.total = data.data.total;
					if (data.data.total > 1000) {
						vm.total = 0;
						data.data.data = [];
					}

					if (this.page.num == 1) {
						if (data.data.data && data.data.data.length && !vm.relations.length) {
							vm.relations = [
								{
									birthday: '',
									cards: [],
									id: '',
									realName: '全部',
									relationType: '',
									sex: null,
									userId: ''
								}
							];
							vm.relationsClass = 'borderNone';
						}
						vm.orders = data.data.data;
					} else {
						vm.orders = vm.orders.concat(data.data.data);
					}

					setTimeout(() => {
						vm.getDataFlag = true;
						vm.loading = false;
						vm.loadingMask = false;
						notice.hideloading();
						if (vm.orders && vm.orders.length > 0) {
							vm.showBottom = '--暂无更多数据--';
						} else {
							vm.showBottom = '';
						}
					}, 200);
					this.page.num++;
				})
				.catch(error => {
					vm.loading = false;
					vm.loadingMask = false;
					notice.hideloading();
					vm.getDataFlag = true;
					notice.alert('请求超时!');
					console.log(error);
				});
		},

		//查询保单参数处理
		policyParams() {
			var params = {
				pageSize: this.page.size,
				pageNum: this.page.num,
				effectiveStatus: '1', //保障中/未保障
				userId: this.userId
			};
			if (this.insurederId) {
				this._index = findIndex(this.relations, ['id', this.insurederId]);
				if (this.relations[this._index].cards && this.relations[this._index].cards.length > 0) {
					this.isSort = '1';
					params.insurederIdentifyNumbers = '';
					for (var j = 0; j < this.relations[this._index].cards.length; j++) {
						if (j == 0) {
							params.insurederIdentifyNumbers = this.relations[this._index].cards[j].cardNo;
						} else {
							params.insurederIdentifyNumbers += ',' + this.relations[this._index].cards[j].cardNo;
						}
					}
				}
				params.isSort = this.isSort;
				params.insurederId = this.insurederId;
			}
			return params;
		},

		//成员分类切换的点击事件
		isSortClick(para1, para2) {
			vm.showBottom = '';
			if (vm.loading) {
				return;
			}
			if (vm.insurederId == para2.id) return;
			vm.isSort = para1;
			vm.insurederId = para2.id;
			this.page.num = 1;
			vm.orders = [];
			this.total = 0;
			this.getOrderListData();
		}
	},
	components: {
		policylistitem: policylistitem,
		'my-nav': myNav,
		'my-login': myLogin
	},
	onShareAppMessage(res) {
		return tools.myShare();
	}
};
</script>
<style lang="less" scoped>
@import './policyList.css';
[v-cloak] {
	display: none !important;
}
.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
	background: #fff;
}
.noData {
	width: 100%;
	text-align: center;
	padding: 30rpx 0;
	color: #333;
}
</style>
