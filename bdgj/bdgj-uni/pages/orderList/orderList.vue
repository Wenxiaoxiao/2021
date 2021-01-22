<template>
	<div class="policyList" v-show="loadingState">
		<scroll-view scroll-y="true" :style="{height:scrollHeight+'px'}" lower-threshold="100" @scrolltolower="getOrderListData">
			<block v-if="orders.length>0">
				<block v-for="(itemdata,index) in orders">
					<policylistitem
						@actiondetail="actionDetail"
						@changerelations="changeMemberRelations"
						:hidesort="true"
						:itemdata="itemdata"
						:issort="isSort"
					></policylistitem>
				</block>

				<block v-if="orders.length>=total"><div class="noData">--暂无更多数据--</div></block>
			</block>
			<block v-else>
				<div id="emptyDom">
					<div class="mescroll-empty">
						<image mode="widthFix" class="empty-icon" src="https://bx.wts999.com/m/resource/xcxStatic/noClaims.png"></image>
						<div v-if="insuranceType == 'inputPolicy'" class="empty-tip">请联系您的专属客服，帮您录入其他平台保单！</div>
						<div v-else class="empty-tip">您还没有在梧桐树保险网购买过保单！</div>
					</div>
				</div>
			</block>
		</scroll-view>
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
	data () {
		return {
			userId: '',
			isSort: '1',
			effectiveStatus: '',
			insuranceType: '',
			scrollHeight: -1,
			orders: [], //保单列表初始化
			page: {
				size: 20, //页容量
				num: 0 //页码(从1开始)
			},
			total: 0, //总个数
			maxPage: 99, // 总页数
			loadingState: false
		}
	},
	beforeCreate() {
		util.hideShareMenu();
	},
	onLoad(option) {
		vm = this;
		//userId
		var status = '';
		if (option.status) {
			status = option.status.replace(/\.+/g, ',');
		}
		var type = '';
		if (option.type) {
			type = option.type.replace(/\.+/g, ',');
		}
		this.effectiveStatus = status;
		this.insuranceType = type;
	},
	mounted() {
		var that= this;
		uni.getSystemInfo({
			success: function(info) {
				//#ifdef APP-PLUS-NVUE
				that.scrollHeight = Number(info.windowHeight) - uni.upx2px(88);
				//#endif
				//#ifndef APP-PLUS-NVUE
				that.scrollHeight = Number(info.windowHeight);
				//#endif
			}
		});
		this.getOrderListData();
	},
	methods: {
		//查看保单详情的点击事件
		actionDetail(e) {
			if (e.item.policyNo == 0) return notice.msg('您的保单正在生成中，如有疑问，请联系你的专属顾问！');
			uni.navigateTo({
				url: '/pages/policyDetail/policyDetail?pid='+e.item.pid,
			});
		},
		//获取订单列表数据
		getOrderListData(e) {
			if (this.orders.length && this.orders.length >= this.total) {
				return;
			}
			// 发送请求后页码++
			this.page.num++;
			// 最大页不请求
			if (this.maxPage == 0 || this.page.num > this.maxPage) return false;
			notice.showloading('加载中');

			var params = {
				effectiveStatus: this.effectiveStatus,
				insuranceType: this.insuranceType,
				pageSize: this.page.size,
				pageNum: this.page.num
			};
			this.$http({
				name: 'P_classifyPolicy',
				data: params
			})
				.then(data => {
					notice.hideloading();
					vm.loadingState = true;
					vm.total = data.data.total;
					// 总页数
					vm.maxPage = Math.ceil(vm.total / vm.page.size);
					if (data.data.total > 1000) {
						vm.total = 0;
						data.data.data = [];
					}
					if (this.page.num == 1) {
						vm.orders = data.data.data;
					} else {
						vm.orders = vm.orders.concat(data.data.data);
					}
				})
				.catch(error => {
					notice.hideloading();
					console.log(error);
				});
		}
	},
	components: {
		'policylistitem': policylistitem
	}
}
</script>
<style lang="less" scoped>
@import './orderList.css';
.noData {
	width: 100%;
	text-align: center;
	padding: 30rpx 0;
	color: #333;
}
</style>
