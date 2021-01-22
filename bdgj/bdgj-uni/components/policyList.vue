<template>
	<div class="order-ul-li" v-show="order.policyNo">
		<div class="poilcy_mask" v-if="loading" :style="{ height: totalHeight + 'rpx' }"></div>
		<div class="head" @click.stop="actiondetail($event)">
			<div class="title line-one">{{ order.insuranceProductName }}</div>
		</div>
		<div class="center" @click.stop="actiondetail($event)">
			<div class="txt line-one">保单号：{{ order.policyNo }}</div>
			<div class="txt" v-if="order.insuranceRelationship == 1">被保险人:{{ order.policyholderName }}</div>
			<div class="txt" v-else>被保险人:{{ order.insurederName }}</div>
			<div class="txt">
				保障期限：{{ order.guaranteeStartTime || '' }}至
				<block v-if="order.guarateeType == 1">终身</block>
				<block v-else>{{ order.guaranteeEndTime }}</block>
			</div>
			<image mode="aspectFit" v-if="order.logo && order.logo.length > 0" :src="order.logo[0].url" class="img-compangs"></image>
		</div>
		<div class="order-other-btn">
			<!--<div class="order-item-btn" v-if="{{order.isSort != 1 && !hidesort && order.policyNo!=0 && !iconishide}}" @click.stop="showMember(true,$event)">成员分类</div>-->
			<div class="order-item-btn" :class="isSortAndShow" @click.stop="checkPDF(order, $event)">电子保单</div>
			<form report-submit="true" class="order-item-btn" :class="{ 'btn-disable': order.forbidden }" @submit="formSubmit">
				<button style="border:none;" form-type="submit" type="default" class="origin-button">在线理赔</button>
			</form>
			<!--<div class="order-item-btn {{order.forbidden?'btn-disable':''}}" @click.stop="onlineClaims(order.policyNo,$event,$event)">快速理赔</div>-->
			<div class="order-item-btn" :class="{ 'btn-disable':order.forbidden || order.hasComment || order.overdue }" @click.stop="commentPro(order)">评价商品</div>
		</div>
	</div>
</template>
<script>
import moment from '../api/moment.min.js';
import notice from '../api/notice.js';
import http from '../api/http.js';
import store from '../store/state';
import filter from '../api/filter';
import tools from '../api/tools';
export default {
	props: {
		itemdata: {
			type: Object,
			default: {}
		},
		issort: {
			type: String,
			default: '1'
		},
		hidesort: {
			type: Boolean,
			default: false
		},
		iconishide: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			order: {
				insureders: []
			},
			ishowmember: false,
			members: filter.memberList(),
			member: '1',
			totalHeight: -1, //总高度
			pdfBtn: false // 电子保单样式
		};
	},
	computed: {
		isSortAndShow: function() {
			if (this.iconishide) {
				return 'btn-disable';
			}
			if (this.itemdata.policyNo == 0 || !this.itemdata.policyNo || this.itemdata.policyNo.length < 5) {
				return 'btn-disable';
			}
			if (this.itemdata.status != '1') {
				return 'btn-disable';
			}
			// if(this.itemdata.isPlat == 0)
			// {
			//     return this.itemdata.bdUrl ? '' : 'btn-disable'
			// }
			return '';
		}
	},
	methods: {
		//查看电子保单
		checkPDF(item) {
			var vm = this;
			if (item.pdfBtn) {
				return;
			}
			vm.loading = true;
			notice.showloading('加载中');
			this.$http({
				name: 'P_verifyBdurlExist',
				data: {
					policyNo: item.policyNo
				}
			})
				.then(data => {
					vm.loading = false;
					console.log('下载电子保单:', data);
					notice.hideloading();
					var url = store.domain[store.dev] + '/tools/bdurl/api/downloadPolicy?policyNo=' + item.policyNo + '&WTS_TOKEN_A=' + store.token;
					store.PDFUrl = url;
					console.log('pdfurl:', store.platform);
					// vm.showPdf(url, item);
					if (store.platform == 'ios') {
						uni.navigateTo({
							url: '/pages/webView'
						});
					} else {
						vm.showPdf(url, item);
					}
				})
				.catch(e => {
					vm.loading = false;
					notice.hideloading();
					console.log(e);
				});
		},

		//显示电子保单
		showPdf(url, item) {
			var vm = this;
			// if(vm.order.PdfPath){
			// 	return tools.openDocument(vm.order.PdfPath);
			// }
			vm.loading = true;
			notice.showloading('加载中');
			console.log('显示电子保单:', url);
			tools
				.downloadFile(url)
				.then(path => {
					vm.order.PdfPath = path;
					console.log(path);
					tools
						.openDocument(vm.order.PdfPath)
						.then(res => {
							vm.loading = false;
							notice.hideloading();
						})
						.catch(err => {
							vm.loading = false;
							console.log(err);
							notice.hideloading();
						});
				})
				.catch(err => {
					vm.loading = false;
					console.log(err);
				});
		},
		/**是否禁用按钮 */
		btnIsDisabled(order) {
			if (this.iconishide) return true;
			if (order.policyNo == 0 || !order.policyNo || order.policyNo.length < 5) return true;
			// if (order.isPlat != 1) return true; //不是平台出单的
			if (order.status != '1' || order.isPlat != 1) return true; //不是保障中的
			return false;
		},
		/**是否电子保单禁用按钮 */
		btnIsDisabled01(item) {
			if (this.iconIsHide) return true; //是否禁用按钮 true 是 false否
			if (item.policyNo == 0 || !item.policyNo || item.policyNo.length < 5) return true;
			if (item.status != '1') return true; //不是保障中的
			return false;
		},
		// 评价时间计算
		isCommentTime(createTime) {
			var _thisTime = moment()
				.subtract(30, 'days')
				.format('YYYY-MM-DD');
			var policyTime = moment(createTime).format('YYYY-MM-DD');
			return _thisTime > policyTime;
		},

		// showMember(flag) {
		//     if (!this.order.insureders || this.order.insureders.length == 0) return notice.msg("暂无成员分类信息");
		//     this.ishowmember = flag;
		//     this.initData();
		// },

		showList(index) {
			var arr = JSON.parse(JSON.stringify(this.order.insureders));
			for (var i = 0; i < arr.length; i++) {
				if (index != i) {
					arr[i].isShow = false;
				}
			}
			arr[index].isShow = !arr[index].isShow;
			this.order.insureders = arr;
		},

		initData() {
			this.order = this.itemdata;
			// var that = this;
			// this.getInsureders(this.order.pid, function(listData) {
			//     that.order.insureders = listData;
			//     if (that.order.insureders && that.order.insureders.length > 0) {
			//         for (var i = 0; i < that.order.insureders.length; i++) {
			//             that.order.insureders[i].isShow = false;
			//             that.order.insureders[i].insuredRelationshipVal = filter.insuranceRelationship(that.order.insureders[i].insuredRelationship);
			//         }
			//     }
			// })

			this.order.overdue = this.isCommentTime(this.order.createTime);
			this.order.forbidden = this.btnIsDisabled(this.order);
			this.order.pdfBtn = this.btnIsDisabled01(this.order);
		},

		changeINType(index, type) {
			this.order.insureders[index].insuredRelationship = type;
			this.order.insureders[index].insuredRelationshipVal = filter.insuranceRelationship(type);
			this.showList(index);
		},

		actiondetail() {
			this.$emit('actiondetail', {
				item: this.order
			});
		},

		//提交绑定的点击事件
		save() {
			var that = this;
			this.showMember(false);
			this.$http({
				name: 'P_buildMember',
				data: {
					policyNo: this.order.policyNo,
					insureders: this.order.insureders
				}
			}).then(function(data, e) {
				notice.msg('分类成功!', 1000);
				setTimeout(() => {
					uni.$emit('changerelations');
				}, 1000);
			});
		},
		formSubmit(event) {
			if (this.btnIsDisabled(this.order)) {
				return;
			}
			if (event.detail.formId && event.detail.formId.indexOf(' ') < 0) {
				var httpName = '';
				// #ifdef MP-WEIXIN
				httpName = 'wxminiSendMessage';
				// #endif
				// #ifndef MP-WEIXIN
				httpName = 'aliminiSendMessage';
				// #endif
				this.$http({
					name: httpName,
					data: {
						formId: event.detail.formId,
						orderId: this.order.policyNo
					}
				})
					.then(res => {
						uni.navigateTo({
							url: '/pages/onlineClaims/onlineClaims?orderNo=' + this.order.policyNo
						});
					})
					.catch(err => {
						uni.navigateTo({
							url: '/pages/onlineClaims/onlineClaims?orderNo=' + this.order.policyNo
						});
					});
			} else {
				uni.navigateTo({
					url: '/pages/onlineClaims/onlineClaims?orderNo=' + this.order.policyNo
				});
			}
		},

		//评价商品
		commentPro(order) {
			if (this.btnIsDisabled(this.order) || this.order.hasComment || this.order.overdue) {
				return;
			}
			var policyNo = order.policyNo;
			var productId = order.insuranceProductId;
			var productName = order.insuranceProductName;
			uni.navigateTo({
				url: '/pages/sendComment/sendComment?policyNo=' + policyNo + '&productId=' + productId + '&productName=' + productName
			});
		}
	},
	beforeCreate() {
		// var that= this;
		//       uni.getSystemInfoSync({
		// 	success: function(info) {
		// 		console.log("info:",info);
		// 		//#ifdef MP-WEIXIN
		// 		that.totalHeight = Number(info.viewportHeight) - 88;
		// 		// #endif
		// 		//#ifndef MP-WEIXIN
		// 		that.totalHeight = Number(info.viewportHeight);
		// 		// #endif
		// 	}
		// })
	},
	mounted() {
		//console.log(this.itemdata);
		this.initData();
	}
};
</script>

<style lang="less">
@import '../iconfont/iconfont';

.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
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
	position: relative;
	border-top: 1px dashed #dcdcdc;
	border-bottom: 1px dashed #dcdcdc;
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

.order-other-btn {
	display: flex;
	padding: 15rpx 0;
	flex-direction: row;

	.order-item-btn {
		flex-grow: 1;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
		background: #fff;
		border: 1px solid #0382ff;
		font-size: 28rpx;
		color: #0382ff;
		border-radius: 8rpx;
		margin: 0 10rpx;
		overflow: hidden;
		.origin-button {
			padding: 0;
			height: 55rpx;
			box-sizing: border-box;
			line-height: 55rpx;
			text-align: center;
			background: #fff;
			font-size: 28rpx;
			color: #0382ff;
			border-radius: 0rpx;
			border: none;
			&::after {
				border: none;
			}
		}
		&.btn-disable {
			pointer-events: none;
			color: #888;
			border-color: #888;
			.origin-button {
				color: #888;
			}
		}
	}
}

.member-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	z-index: 998;
}

.member-content {
	z-index: 999;
	width: 525rpx;
	border-radius: 12rpx;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #fff;
	padding: 30rpx;

	.member-info {
		width: 100%;
	}

	.item-input {
		width: 100%;
		border-radius: 7rpx;
		line-height: 75rpx;
		font-size: 29rpx;
		margin-bottom: 20rpx;
		position: relative;
		flex-direction: row;

		.item-name {
			width: 37%;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
			white-space: nowrap;
		}

		.icon-jiantou_xia {
			color: #999;
			position: absolute;
			right: 15rpx;
			top: 0;
			font-size: 24rpx;
			z-index: 12;
		}

		.selsectList {
			width: 63%;
			height: 100%;
			height: 75rpx;
			box-sizing: border-box;
			border: 1px solid #999;
			color: #999;
			background: #fff;
			padding-right: 30rpx;
			padding-left: 10rpx;
			position: relative;

			.selsectListInfo {
				width: 100%;
				position: absolute;
				top: 75rpx;
				left: 0;
				z-index: 14;
				background: #fff;
				border: 1px solid #ccc;
				text-align: center;
				max-height: 400rpx;
				overflow: auto;

				.li {
					width: 100%;
					padding: 0 10rpx;
				}
			}
		}
	}

	.member-btn {
		text-align: center;
		color: #fff;
		bottom: 0;
		left: 0;
		background: #fff;
		width: 100%;
		padding-top: 20rpx;

		.save {
			text-align: center;
			display: block;
			width: 100%;
			background: #0084ff;
			line-height: 80rpx;
			font-size: 33rpx;
			letter-spacing: 1rpx;
			border-radius: 12rpx;
		}
	}
}
</style>
