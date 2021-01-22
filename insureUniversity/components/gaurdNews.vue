<template>
	<div>
		<video class="video" v-if="articleData.articleType==1" :poster="articleData.videoImg" :controls="true" :src="articleData.videoUrl"></video>
		<scroll-view class="content" scroll-y="true" :style="{height: mainHeight+'px'}">
			<div class="title">{{articleData.articleTitle}}</div>
			<div class="auther-box">
				<div class="auther-msg">
					<span v-show="articleData.updateTime" class="time">更新时间：{{articleData.updateTime}}</span>
					<span class="auther"> 来源：梧桐树保险网</span>
				</div>
				<image mode="widthFix" src="https://www.wts999.com/r/cms/www/mobile/images/article-mb-logo.jpg" class="article-logo"></image>
			</div>
			<parser class="parser" :html="articleData.content"></parser>
		</scroll-view>
	</div>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	import store from "@/store.js"
	
	export default {
		data() {
			return {
				articleData: '', // 文章内容
				mainHeight: ""
			}
		},
		created() {
			uni.showLoading({
				title: '加载中'
			});
			this.gaurdId= store.gaurdId;
			this.article(this.gaurdId);
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
					// 处理视频url
					if(d.videoUrl) {
						d.videoUrl= JSON.parse(d.videoUrl).url;
					}
					that.articleData= d;
					var num= 0;
					if(that.articleData.articleType==1) {
						num= 440;
					}
					that.mainHeight= getApp().globalData.windowHeight- uni.upx2px(num);;
					uni.hideLoading();
				})
			}
		},
		components: {
			parser
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 30rpx 30rpx;
		width: 100%;
		box-sizing: border-box;
	}
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
	.video {
		width: 100%;
		height: 400rpx;
		margin-bottom: 40rpx;
	}
	.parser {
		font-size: 32rpx;
	}
</style>
