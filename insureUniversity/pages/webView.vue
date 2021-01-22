<template>
	<div class="page-body"><web-view :src="url"></web-view></div>
</template>

<script>
import store from '../store.js';
export default {
	data() {
		return {
			url: ''
		}
	},
	onLoad(option) {
		this.url = option.url ? decodeURIComponent(option.url) : store.PDFUrl;
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
<style></style>
