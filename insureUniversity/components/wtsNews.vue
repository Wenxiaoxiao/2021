<template>
	<div>
		<div class="title">{{articleData.articleTitle}}</div>
		<div class="auther-box">
			<div class="auther-msg">
				<span v-show="articleData.updateTime" class="time">更新时间：{{articleData.updateTime}}</span>
				<span class="auther"> 来源：梧桐树保险网</span>
			</div>
			<image mode="widthFix" src="https://www.wts999.com/r/cms/www/mobile/images/article-mb-logo.jpg" class="article-logo"></image>
		</div>
		<parser :html="articleData.content"></parser>
	</div>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	
	export default {
		props: {
			newsId: null
		},
		data() {
			return {
				articleData: '' // 文章内容
			}
		},
		methods: {
			article(id) {
				var that= this;
				
				this.$http({
					name: 'nonebx',
					url: '/app/article/api/read/'+id+'?userId='
				})
				.then(function(res) {
					var d= res.data;
					d.updateTime= d.updateTime.slice(0,d.updateTime.indexOf(' '));
					that.articleData= d;
					uni.hideLoading();
				})
			}
		},
		watch: {
			newsId: function(newVal) {
				uni.showLoading({
					title: '加载中'
				});
				if(newVal) {
					this.article(newVal);
				}
			}
		},
		components: {
			parser
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		position: relative; 
		padding-top: 0.53333*75rpx;
		font-size: 0.50667*75rpx; 
		font-weight: 700; 
		line-height: 1.5; 
		margin-bottom: 0.26667*75rpx; 
	}
	.auther-box {
		font-size: 28rpx;
	}
	.auther-msg {
		display: flex;
		justify-content: space-between;
		color: #8f8f94;
		margin-bottom: 20rpx;
		.time {
			margin-right: 0.26667rem;
		}
	}
	.article-logo {
		width: 100%;
		margin-bottom: 0.13333rem;
	}
	.mytxt {
		img {
			width: 100% !important;
		}
	}
</style>
