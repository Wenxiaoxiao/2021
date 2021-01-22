<!-- 超市攻略测评详情 -->
<template>
	<div class="view">
		<!-- #ifdef MP-TOUTIAO -->
		<video class="video" v-if="articleType==1||articleType==4" :controls="true" :poster="articleData.videoImg" :src="articleData.videoUrl"></video>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<video class="video" v-if="articleType==1" :controls="true" :poster="articleData.videoImg" :src="articleData.videoUrl"></video>
		<div class="audio" v-else-if="articleType==4">
			<audio :controls="true" :name="articleData.videoName" author="梧桐树保险网" :poster="articleData.videoImg" :src="articleData.videoUrl"></audio>
		</div>
		<!-- #endif -->
		<scroll-view class="content" scroll-y="true" :style="{height: mainHeight+'px'}">
			<div class="title">{{articleData.articleTitle}}</div>
			<div class="auther-box">
				<div class="auther-msg">
					<span class="time">更新时间：{{articleData.updateTime}}</span>
					<span class="auther"> 来源：梧桐树保险网</span>
				</div>
				<image mode="widthFix" src="https://www.wts999.com/r/cms/www/mobile/images/article-mb-logo.jpg" class="article-logo"></image>
			</div>
			<parser :html="articleData.content"></parser>
		</scroll-view>	
	</div>
</template>

<script>
	import http from '../../tool/http.js'
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	import tool from '../../tool/tools.js'
	
	export default {
		data() {
			return {
				mainHeight: 0,
				articleId: '',
				articleType: 5,
				articleData: '',
				articleTitle: ''
			}
		},
		onLoad(option) {
			this.articleId= option.id;
			this.articleType= option.articleType;
			// 高度
			var num= 0;
			// #ifdef MP-TOUTIAO
			if(this.articleType==1||this.articleType==4) {
				num= 440;
			}
			// #endif
			// #ifdef MP-WEIXIN
			if(this.articleType==1) {
				num= 440;
			}else if(this.articleType==4) {
				num= 200;
			}
			// #endif
			this.mainHeight= getApp().globalData.windowHeight - uni.upx2px(num);
		},
		onShow(){
			tool.getRecentVersion();
		},
		methods: {
			article() {
				var that= this;
				
				this.$http({
					name: 'nonebx',
					url: '/app/article/api/read/'+this.articleId+'?userId='
				})
				.then(function(res) {
					var d= res.data;
					that.articleType = res.data.articleType;
					// 设置页面标题
					that.articleTitle= d.articleTitle;
					uni.setNavigationBarTitle({
					    title: tool.subString(d.articleTitle,10)
					});
					d.updateTime= d.updateTime.slice(0,d.updateTime.indexOf(' '));
					// 处理视频url
					if(d.videoUrl) {
						var j= JSON.parse(d.videoUrl);
						d.videoUrl= j.url;
						if(d.articleType==4) {
							d.videoName= j.name
						}
					}
					that.articleData= d;
				})
			}
		},
		watch: {
			articleId(newVal) {
				this.article()
			}
		},
		components: {
		   parser
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
		.video {
			width: 100%;
			height: 400rpx;
			margin-bottom: 40rpx;
		}
		.audio {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 200rpx;
			audio {
				max-width: 100%;
			}
		}
		.content {
			padding: 0 30rpx 30rpx;
			font-size: 32rpx;
			box-sizing: border-box;
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
		}
		.mytxt {
			img {
				width: 100% !important;
			}
		}
	}
</style>
