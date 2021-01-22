<!-- 守护平凡 -->
<template>
	<div class="guard-view">
		<my-article :listType="2" :listCode="20" :type="2"></my-article>
		<my-nav :navbar="'gaurd'"></my-nav>
	</div>
</template>

<script>
	import myNav from '../../components/nav.vue';
	import myArticle from '../../components/articleList.vue';
	import tool from '../../tool/tools.js';
	
	export default {
		data() {
			return {
				// articletype: 2,
				// articlecode: 40
			}
		},
		components: {
			'my-nav': myNav,
			'my-article': myArticle
		},
		onShow(){
			tool.getRecentVersion();
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
	.guard-view {
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
</style>
