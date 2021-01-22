<template>
	<div class="views" v-if="hasData">
		<scroll-view :style="{height:scrollHeight+'px'}" style="font-size: 0;" scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="domId" scroll-with-animation="true" @scroll="scrollPos">
			<image :src="imgSrc" class="title"></image>
			<div v-for="(l,i) in policyData" class="item_box">
				<text :id="'to'+initials[i]" class="item_szm">{{ initials[i] }}</text>
				<div v-for="(j,index) in l" class="item">
					<div class="item_content">
						<div style="display: flex;flex-direction:row;">
							<div class="item_msg">
								<view class="item_name">{{ j.shortName }}</view>
								<view class="item_num">{{ j.tellPhone }}</view>
							</div>
							<image class="item_img" :src="j.logoImg"></image>
						</div>
						<text class="item_call iconfont icon-callout" @click="makingCall(j.tellPhone)"></text>
					</div>
				</div>
			</div>
		</scroll-view>
		<div class="right_box">
			<div v-for="(item,i) in initials" :data-id="'to'+item" @click="toPos(i,$event)" class="right_item" :class="{'active':currentIndex==i}">{{item}}</div>
		</div>
	</div>
</template>

<script>
import http from '../../api/http.js';
import tools from '../../api/tools';
import notice from '../../api/notice.js';

export default {
	data() {
		return {
			// 保险公司数据
			imgSrc: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/vertify_banner.jpg',
			policyData: [],
			initials: [], // 首字母
			posArr: [75], // 每个字母起始位置
			currentIndex: 0, // 当前区间
			scrollHeight: 0,
			scrollTo: 0,
			domId: null, // 锚点id
			hasData: false
		}
	},
	methods: {
		toPos(i, e) {
			this.domId= e.target.dataset.id;
			this.currentIndex = i;
		},
		scrollPos(e) {
			console.log(e.detail.scrollTop);
			var _p = e.detail.scrollTop;
			for (var i = 0; i < this.posArr.length; i++) {
				if (this.posArr[i] <= _p && _p < this.posArr[i + 1]) {
					this.currentIndex = i;
				}
			}
		},
		makingCall(tel) {
			tools.makingCall(tel);
		}
	},
	onLoad(query) {
		var that = this;
		notice.showloading('加载中...');
		this.$http({
			name: 'v_policy',
			data: {
				pageNum: 1,
				pageSize: 999
			}
		})
			.then(function(res) {
				// 公司数据
				var sortData = {};
				// 公司首字母
				var _initials = [];
				// 提出logo的url地址
				res.data.map(function(item) {
					if (JSON.parse(item.logo).length) {
						item.logoImg = JSON.parse(item.logo)[0]['url'];
					}
					if (item.initials) {
						// 首次添加该首字母
						if (sortData[item.initials]) {
							sortData[item.initials].push(item);
						} else {
							_initials.push(item.initials);
							sortData[item.initials] = [item];
						}
					}
				});
				// 首字母排序
				_initials.sort();
				_initials.map(function(item, i) {
					that.policyData.push(sortData[item]);
					// 每个字母起始位置
					that.posArr.push(sortData[item].length * 75 + 24 + that.posArr[i]);
				});
				that.initials = _initials;
				notice.hideloading();
				that.hasData = true;
			})
			.catch(function(res) {
				console.log(res);
			});
	},
	created() {
	  var vm= this;
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
					vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(176);
				// #endif
				// #ifndef APP-PLUS-NVUE
					vm.scrollHeight = Number(info.windowHeight);
				// #endif
			}
		})
	}
}

</script>

<style lang="less">
@import './vertifyPolicy.css';
</style>