<template>
	<div height="100%">
		<div class="policyList">
			<div class="policyNumbers">
				<div class="iconfont icon-baodanyangben"></div>
				<div class="policyNumbers_info">{{ pageInfo.name }}({{ total }}张)</div>
			</div>
			<!--订单列表-->
			<div class="policyList" v-show=" loadingState ">
				<scroll-view scroll-y="true" :style="{height:scrollHeight+'px'}">
					<block v-if="total>0">
						<block v-for="(itemdata,index) in orders">
							<policylistitem
								@actiondetail="actionDetail"
								@changerelations="changeMemberRelations"
								:hidesort="true"
								:itemdata="itemdata"
								:issort="isSort"
								:iconishide="iconIsHide"
							></policylistitem>
						</block>
						<block v-if="orders.length>=total"><div v-show="noData" class="noData">--暂无更多数据--</div></block>
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
		</div>
	</div>
</template>

<script>
// import _ from 'lodash';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
import filter from '../../api/filter';
import tools from '../../api/tools';
import util from '../../api/utils.js';
import policylistitem from '../../components/policyList.vue';

var vm = null;
export default {
	data() {
		return {
			scrollHeight: -1,
			userId: '',
			pageInfo: {},
			orders: [], //保单列表初始化
			total: 0, //总个数
			loadingState: false,
			iconIsHide: false,
			noData: false
		}
	},
	beforeCreate() {
		util.hideShareMenu();
	},
	onLoad(query) {
		vm = this;
		this.pageInfo = query;
		this.pageInfo.name = decodeURI(query.name);
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(90+88);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(90);
				// #endif
			}
		})
		vm.getOrderListData();
	},
	onShow() {
		if (store.hasComMit) {
			store.hasComMit = false;
			this.orders = [];
			vm.getOrderListData();
		}
	},
	methods: {
		//查看保单详情的点击事件
		actionDetail(e) {
			if (e.item.policyNo == 0) return notice.msg('您的保单正在生成中，如有疑问，请联系你的专属顾问！');
			uni.navigateTo({
				url: '/pages/policyDetail/policyDetail?pid='+e.item.pid+'&ishare='+this.iconIsHide
			});
		},
		//修改成员分信息
		changeMemberRelations() {
			this.page.num = 1;
			this.orders = [];
			vm.getOrderListData();
		},
		//获取订单列表数据
		getOrderListData() {
			var name = 'p_validPolicy';
			if (this.pageInfo.type == 2) {
				name = 'p_needPayPolicy';
			}
			notice.showloading('加载中...');
			this.$http({
				name: name,
				data: {
					
				}
			})
				.then(data => {
					notice.hideloading();
					vm.loadingState = true;
					vm.total = data.total || 0;
					if (data.total > 1000) {
						vm.total = 0;
						data.data = [];
					}
					vm.orders = data.data || [];
					setTimeout(function() {
						vm.noData= true;
					},1000)
				})
				.catch(error => {
					notice.hideloading();
					notice.alert('请求超时!');
					console.log(error);
				});
		}
	},
	components: {
		'policylistitem': policylistitem
	},
}
</script>
<style lang="less" scoped>
@import '../../iconfont/iconfont';
@import './policyNumber.css';

.policyNumbers {
	display: flex;
	background: #0084ff;

	padding: 0 22rpx;
	flex-direction: row;
	align-items: center;
	height: 90rpx;

	.policyNumbers_info {
		margin-left: 15rpx;
		line-height: 90rpx;
		color: #fff;
		font-size: 30rpx;
	}

	.icon-baodanyangben {
		color: #fff;
		font-size: 23px;
	}
}

.noData {
	width: 100%;
	text-align: center;
	padding: 30rpx 0;
	color: #333;
}
</style>
