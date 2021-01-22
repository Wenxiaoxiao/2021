<template>
	<div class="view">
		<!-- <scroll-view :style="{height: mainHeight+ 'px'}" class="scroll" scroll-y="true" @scrolltolower="getArticle"> -->
		<my-article :listType="articletype" :listCode="articlecode" :type="1"></my-article>
		<!-- </scroll-view> -->
	</div>
</template>

<script>
	import myArticle from '../../components/articleList.vue';
	import tools from '../../tool/tools.js';
	
	export default {
		data() {
			return {
				articletype: '',
				articlecode: ''
			}
		},
		onLoad(option) {
			// 获取文章参数
			this.articletype= option.type;
			this.articlecode= option.code;
		},
		onShow(){
			tools.getRecentVersion();
		},
		components: {
			'my-article': myArticle
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
		height: 100%;
	}
</style>
