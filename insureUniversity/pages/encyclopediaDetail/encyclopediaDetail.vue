<!-- 保险百科详情 -->
<template>
	<div class="view">
		<p class="title">{{keyword}}</p>
		<parser class="rich-text" :html="details"></parser>
	</div>
</template>

<script>
	import http from '../../tool/http.js'
	import tool from '../../tool/tools.js';
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	
	export default {
		data() {
			return {
				keyword: '',
				id:'',
				details: ''
			}
		},
		onLoad(option) {
			this.id= option.id;
			console.log("load:",this.id);
		},
		onShow(){
			tool.getRecentVersion();
		},
		methods: {
			getInfo() {
				var vm= this;
				this.$http({
					name: 'getInfoByKeyword',
					data: {
						id: this.id
					}
				})
				.then(function(data) {
					vm.details = data.data.content;
					vm.keyword = data.data.keyWord;
				})
			}
		},
		watch: {
			id(newVal) {
				this.getInfo();
			}
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
		},
		components: {
			parser
		}
	}
</script>

<style lang="scss" scoped>
	.view {
		padding: 30rpx;
		.title {
			font-size: 40rpx;
			margin-bottom: 20rpx;
		}
	}
</style>
