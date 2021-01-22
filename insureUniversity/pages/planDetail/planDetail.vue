<!-- 方案设计详情 -->
<template>
	<div class="view">
		<scroll-view class="content" scroll-y="true" :style="{height: mainHeight+'px'}">
			<wtsNews :newsId="newsId"></wtsNews>
		</scroll-view>
	</div>
</template>

<script>
	import wtsNews from '../../components/wtsNews.vue'
	import tool from '../../tool/tools.js';
	
	export default {
		data() {
			return {
				mainHeight: 0,
				newsId: "" // 守护平凡文章id
			}
		},
		onLoad(o) {
			var vm= this;
			this.newsId= o.newsId;
			uni.getSystemInfo({
				success: function(info) {
					vm.mainHeight= Number(info.windowHeight);
				}
			})
		},
		onShow(){
			tool.getRecentVersion();
		},
		components: {
			wtsNews
			
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

<style lang="scss" scoped>
	.view {
		font-size: 0;
		.content {
			padding: 0 30rpx 30rpx;
			font-size: 32rpx;
			box-sizing: border-box;
		}
	}
</style>
