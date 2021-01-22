<template>
	<div class="policyList">
		<div class="poilcy_mask" v-if="loading" :style="{height:totalHeight+'px'}"></div>
		<div class="policyNumbers">
			<div class="iconfont icon-baodanyangben"></div>
			<div class="policyNumbers_info">{{ pageInfo.name }}({{ pageInfo.type }}元)</div>
		</div>
		<!--订单列表-->
		<div class="policyList" v-show="loadingState">
			<scroll-view scroll-y="true":style="{height:scrollHeight+'px'}">
				<block v-if="total>0">
					<block v-for="(order,index) in orders">
						<div class="order-ul-li">
							<div class="head">
								<div class="title">{{ order.policyName }}</div>
							</div>
							<div class="center">
								<div class="txt" style="color:#ff7204;">应交保费：{{ order.policyFee }}元</div>
								<div class="txt">交费日期：{{ order.payTime }}</div>
							</div>
						</div>
					</block>
					<block v-if="orders.length>=total"><div class="noData">--暂无更多数据--</div></block>
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
</template>

<script>
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
import filter from '../../api/filter';
import tools from '../../api/tools';
import util from '../../api/utils.js';
var vm = null;
export default {
	data() {
		return {
			relationsWidth: '750rpx',
			scrollHeight: -1,
			relationsClass: '',
			userId: '',
			isSort: '0',
			insurederId: '', //当前请求分类的列表
			relations: [], //成员列表初始化
			pageInfo: {},
			orders: [], //保单列表初始化
			total: 20, //总个数
			loadingState: false
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
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(90 + 88);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(90);
				// #endif
			}
		})

		vm.getOrderListData();
		// this.getRelations(function(){
		//     vm.getOrderListData()
		// });
	},
	methods: {
		timeString(content, length) {
			//截取时间
			if (!content) {
				return '';
			}
			content = content.trim();
			if (content.length > length) {
				var first = content.toString().substring(0, length);
				content = first;
			}
			return content;
		},
		//获取订单列表数据
		getOrderListData() {
			var name = 'p_yearPayPolicy';
			notice.showloading('加载中...');
			this.$http({
				name: name,
				data: {}
			})
			.then(data => {
				notice.hideloading();
				vm.loadingState = true;
				vm.orders = [];
				vm.total = data.total;
				if (data.total > 1000) {
					vm.total = 0;
					data.data = [];
				}
				for (var i = 0; i < data.data.length; i++) {
					var item = data.data[i];
					item.payTime = vm.timeString(item.payTime, 10);
				}
				vm.orders = data.data;
			})
			.catch(error => {
				notice.hideloading();
				notice.alert('请求超时!');
				console.log(error);
			});
		}
	}
}
</script>
<style lang="less" scoped>
@import '../../iconfont/iconfont';
@import './familyTotalPremium.css';
.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
}
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

.order-ul-li {
	background: #fff;
	margin-bottom: 10rpx;
	border-bottom: 1px solid #dcdcdc;
}

.head {
	position: relative;
	.title {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
		font-weight: 900;
		lines: 1;
		padding: 0 20rpx;
	}
}

.buyToo {
	position: absolute;
	font-size: 28rpx;
	color: #fff;
	padding: 12rpx 24rpx;
	background: #0084fd;
	top: 15rpx;
	right: 20rpx;
	border-radius: 8rpx;
}

.center {
	border-top: 1px dashed #dcdcdc;
	padding: 20rpx;
	.txt {
		line-height: 50rpx;
		font-size: 32rpx;
		position: relative;
		z-index: 2;
	}
	.img-compangs {
		position: absolute;
		right: 10rpx;
		top: 50rpx;
		width: 170rpx;
		height: 80rpx;
		z-index: 1;
		opacity: 0.4;
	}
}
</style>
