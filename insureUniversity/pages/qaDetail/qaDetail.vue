<template>
	<div class="body-container myZonedetails" style="font-family: arial;" :style="{minHeight: mainHeight+'px'}">
		<ul class="mainContent">
			<li class="mainList" id="dowebok">
				<dl class="dl">
					<dt class="dt">
						<img class="img-auther" :src="qaData.headimgurl">
						<div class="textBox fl">
							<div>
								<span>{{qaData.nickname}}</span>
							</div>
						</div>
					</dt>
					<dd class="problemBox">
						<div class="problem">
							<div style="display:none;" id="detailTitle"></div>
							<div class="text text2 " id="detailContent">{{qaData.content}}</div>
						</div> 
						<div class="stop">{{qaData.admin}}</div>
						<div v-if="qaData.imgUrls.length" class="imgBox clearfix">
							<span class="img-box-1" v-for="(item,index) in qaData.imgUrls" :key="index"><image mode="aspectFit" class="lazy" :src="item" @click="showImg(item)"></image></span>
						</div>
					</dd>
				</dl>
			</li>
		</ul>
		<dl class="detailsContent" v-if="qaData.replys.length">
			<dd id="detailsContent" class="ddBox">
				<div class="detailsContentBox" v-for="(value,replyIndex) in qaData.replys" :key="replyIndex">
					<image mode="widthFix" v-if="value.userId==0" :src="imgsrc1" class="avatar"></image>
					<image mode="widthFix" v-else-if="value.headimgurl=='' || value.headimgurl=='/0'" :src="imgsrc2" class="avatar"></image>
					<image mode="widthFix" v-else :src="value.headimgurl" class="avatar"></image>
					<div class="commentRight">
						<div class="name">{{value.nickname}}</div>
					</div>
					<div class="Answer">{{value.content}}</div>
				</div>
			</dd>
		</dl>
		<div class="wrapper" v-show="wrapperShow" @click="closeFull">
			<image :src="fullImgUrl" mode="aspectFit"></image>
		</div>
	</div>
</template>

<script>
	import http from '../../tool/http.js'
	import tool from '../../tool/tools.js'
	
	export default {
		data() {
			return {
				id: '',
				qaData: '',
				imgsrc1: require('../../assets/images/index/miniLogo.jpg'),
				imgsrc2: require('../../assets/images/index/default_auther.png'),
				wrapperShow: false,
				fullImgUrl: '',
				mainHeight: 0,
				articleTitle: '梧桐树保险大学'
			}
		},
		onLoad(option) {
			this.id= option.id;
			var vm= this;
			uni.getSystemInfo({
				success: function(info) {
					vm.mainHeight= Number(info.windowHeight);
				}
			})
		},
		onShow(){
			tool.getRecentVersion();
		},
		methods: {
			getDetail() {
				var vm= this;
				this.$http({
					name: 'answerDetail',
					data: {
						id: this.id
					}
				})
				.then(function(data) {
					var d= data.data;
					// 设置页面标题
					vm.articleTitle= d.content;
					uni.setNavigationBarTitle({
					    title: tool.subString(vm.articleTitle,10)
					});
					d.imgUrls= d.imgUrls.split(",");
					if(!d.imgUrls[0]) d.imgUrls= [];
					vm.qaData= d;
				})
				.catch(function(res) {
					console.log(res)
				})
			},
			showImg(url) {
				this.fullImgUrl= url;
				this.wrapperShow= true;
			},
			closeFull() {
				this.wrapperShow= false;
			}
		},
		watch: {
			id(newVal) {
				this.getDetail();
			}
		},
		onShareAppMessage() {
			return {
				title: this.qaData.content, 
				path: '/pages/qaDetail/qaDetail?id='+this.id,
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
.myZonedetails {
	background-color: #efeff4;
	.mainContent {
		width: 100%;
		height: auto;
		position: relative;
		background: #efeff4;
		overflow: hidden;
		.mainList {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin-bottom: 0.2*75rpx;
			background: #fff;
			border-top: 1px solid #e6e6e6;
			.dl {
				width: 100%;
				height: auto;
				overflow: hidden;
				padding-bottom: 0.2*75rpx;
				.dt {
					width: 100%;
					height: 1.6*75rpx;
					line-height: 1.2*75rpx;
					padding: 0 0.4*75rpx;
					box-sizing: border-box;
					position: relative;
					padding-top: 0.4*75rpx;
					.img-auther {
						width: 1.2*75rpx;
						height: 1.2*75rpx;
						border-radius: 0.06667*75rpx;
						position: absolute;
						left: 0.4*75rpx;
						top: 0.4*75rpx;
					}
					.textBox {
						width: 100%;
						height: 1.2*75rpx;
						padding-left: 1.33333*75rpx;
						position: relative;
						.p {
							line-height: 0.66667*75rpx;
							font-size: 0.4*75rpx;
							padding: 0;
							color: #000;
							position: relative;
							padding-top: 12px;
						}
					}
				}
				.problemBox {
					width: 100%;
					height: auto;
					padding-right: 0.4*75rpx;
					padding-left: 0.4*75rpx;
					position: relative;
					margin-top: 0.26667*75rpx;
					box-sizing: border-box;
					.problem {
						width: 100%;
						height: auto;
						font-size: 0.42667*75rpx;
						line-height: 0.56*75rpx;
						.text2 {
							height: auto;
							line-height: 0.69333*75rpx;
							color: #000;
						}
					}
					.imgBox {
						margin-top: 10rpx;
						image {
							width: 450rpx;
						}
					}
				}
			}
		}
	}
	.detailsContent {
		width: 100%;
		height: auto;
		position: relative;
		overflow: hidden;
		background: #fff;
		.ddBox {
			padding: 0.3*75rpx;
			background: #fff;
			.detailsContentBox {
				padding-bottom: 0.13333*75rpx;
				margin-top: 0.24*75rpx;
				position: relative;
				border-bottom: 1px solid #efeff4;
				.avatar {
					width: 0.96*75rpx;
					height: 0.96*75rpx;
					border-radius: 0.06667*75rpx;
					position: absolute;
					left: 0;
					top: 0;
				}
				.commentRight {
					width: 100%;
					height: 0.96*75rpx;
					padding-left: 1.2*75rpx;
					.name {
						line-height: 0.96*75rpx;
						padding: 0;
						color: #000;
						font-size: 0.4*75rpx;
					}
				}
				.Answer {
					padding-left: 1.28*75rpx;
					line-height: 0.64*75rpx;
					font-size: 0.4*75rpx;
					color: #000;
					word-break: break-all;
					margin: 0;
					margin-top: 0.13333*75rpx;
				}
			}
		}
	}
	.wrapper {
		position: fixed;
		top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.7);
		image {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			width: 100%;
		}
	}
}
</style>
