<template>
	<div class="container" :style="{height:scrollHeight+'rpx'}">
		<scroll-view scroll-y="true" :style="{height:scrollHeight+'rpx'}" class="columnList">
			<div class="columnLi" v-for="(item,index) in columnName" @click.stop="changeColumn(item.code)" data-idx="{{index}}">
				<text class="column-text" :class="{'columnLi-active':showCode==item.code}">{{ item.name }}</text>
			</div>
		</scroll-view>
		<scroll-view scroll-y="true" lower-threshold="100" @scrolltolower="onBottom" :style="{height:scrollHeight+'rpx'}" class="productList">
			<cell v-for="(item,index) in productLists" data-idx="{{index}}" class="productLi">
				<text class="product-title">{{ item.insuranceTitle }}</text>
				<text class="product-desc">{{ item.designIdea }}</text>
				<div class="justify-between">
					<div class="text-left fl">
						<text class="price">{{ item.productPrice }}</text>
						<text class="price-desc">元</text>
					</div>
					<text class="product-button">查看详情</text>
				</div>
			</cell>
			<cell v-if="!canScroll"><text class="not-more">没有更多数据了...</text></cell>
		</scroll-view>
	</div>
</template>

<script>
var vm;
import tools from '../../api/tools.js';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
export default {
	data() {
		return {
			scrollHeight: 1100,
			showCode: '06', //默认显示栏目
			pageNum: 1, //页码
			pageSize: 20, //每页数量
			columnName: null, //全部列名称
			productLists: null, //产品列表
			canScroll: false //能否下拉
		}
	},
	methods: {
		changeColumn(id) {
			//切换左侧导航
			this.showCode = id;
			this.pageNum = 1;
			this.getColumns();
		},
		getColumns(type) {
			//获取列表数据
			http({
				name: 'product.list',
				data: {
					//产品code
					code: this.showCode,
					//当前页数
					pageNum: this.pageNum,
					//当前条数
					pageSize: this.pageSize,
					pageType: '1'
				}
			}).then(function(r, e) {
				console.log(r);
				if (type == 1) {
					vm.getColumnName(r.data);
				}
				let list;
				// 获取当前栏目数据
				for (var k in r.data) {
					if (r.data[k].code == vm.showCode) {
						list = r.data[k].productList;
						break;
					}
				}
				vm.productLists = vm.pageNum == 1 ? list : vm.productLists.concat(list);
				vm.canScroll = list.length < vm.pageSize ? false : true;
			});
		},
		getColumnName(data) {
			var names = [];
			for (var k in data) {
				names.push({
					name: data[k].name,
					code: data[k].code
				});
			}
			vm.columnName = names;
		},
		onBottom() {
			//上拉加载
			if (!vm.canScroll) return;
			vm.canScroll = false;
			this.pageNum++;
			this.getColumns();
		}
	},
	created() {
		vm = this;
		this.getColumns(1);
	},
	onLoad() {
		var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				vm.scrollHeight = Number(info.windowHeight);
			}
		})
	}
}
</script>
<style lang="less" scoped>
@import './index.css';
.apps {
	background: #eee;
	overflow: auto;
}
.footer-zhanwei {
	width: 750rpx;
	background: #fff;
	border-top: 1rpx solid #e6e6e6;
}
</style>
