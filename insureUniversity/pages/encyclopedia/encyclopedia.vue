<template>
  <div class="view">
	<scroll-view class="bxbk-container" scroll-y="true" :style="{height: mainHeight+'px'}">
		<div class="item" v-for="item in dataInfo" v-show="item.keyWords.length>0">
		  <div class="title">{{item.text}}</div>
		  <ul class="ul">
			<li class="li" @click="showDetail(k)" v-for="k in item.keyWords">
			  <span class="span">{{k.keyWord}}</span>
			</li>
		  </ul>
		</div>
	</scroll-view>
	<!-- #ifdef MP-TOUTIAO -->
	<my-nav :navbar="'encyclopedia'"></my-nav>
	<!-- #endif -->
  </div>
</template>
<script>
  import http from '../../tool/http.js'
  import tool from '../../tool/tools.js';
	import myNav from '../../components/nav.vue'
	
export default {
  data() {
    return {
      dataInfo: [],
	  mainHeight: "",
	  windowHeight: ""
    };
  },
  onLoad() {
	  // #ifdef MP-TOUTIAO
			uni.getSystemInfo({
				success: res => {
					getApp().globalData.windowHeight= res.windowHeight
					this.mainHeight= getApp().globalData.windowHeight- uni.upx2px(120);
				}
			})
			// #endif
			// #ifdef MP-WEIXIN
			uni.getSystemInfo({
				success: res => {
					getApp().globalData.windowHeight= res.windowHeight
					this.mainHeight= getApp().globalData.windowHeight;
				}
			})
			// #endif
  },
  onShow(){
      tool.getRecentVersion();
  },
  methods: {
    //文章列表数据请求
    bxbkData() {
		var vm= this;
		this.$http({
			name: "bk_typeList",
			data: {}
		})
		.then(function(data) {
          vm.dataInfo = data.data;
		})
		.catch(function(err) {
			console.log(err)
		})
    },
    showDetail(k) {
      console.log("k",k);
      uni.navigateTo({
        url: '/pages/encyclopediaDetail/encyclopediaDetail?id='+k.id
      })
    }
  },
    components: {
	    'my-nav': myNav
    },
  mounted() {
    this.bxbkData();
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
};
</script>
<style lang="scss" scoped>
.bxbk-container {
  padding: 0 20rpx;
  padding-bottom: 30rpx;
  box-sizing: border-box;
  background:#fff;
  .item {
    .title {
      font-size: 32rpx;
      font-weight: 900;
      padding: 0 20rpx;
      padding-top: 30rpx;
      line-height: 1;
    }
	.ul {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		.li {
		  width: 33.333333%;
		  text-align: center;
		  margin-top: 20rpx;
		  .span {
			display: inline-block;
			width: 210rpx;
			line-height: 50rpx;
			border-radius: 25rpx;
			background: #f5f5f5;
			font-size: 24rpx;
		  }
		}
	}
  }
  .mask_bg{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        z-index: 1000;
        top: 0;
        left: 0;
    }
    .mask_info{
        background: #fff;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1001;
        img{
          max-width: 100%;
        }
        .mask_title{
            line-height: 90rpx;
            background: #f2f2f2;
            padding: 0 37rpx;
            font-size: 32rpx;
            position: relative;
            .icon-cha{
                width: 90rpx;
                text-align: center;
                display: block;
                font-size: 32rpx;
                position: absolute;
                top: 0;
                right: 0;
                font-size: 38rpx;
            }
        }
        .mask_content{
            max-height: 800rpx;
            overflow: auto;
            width: 100%;
            font-size: 28rpx !important;
            line-height: 45rpx !important;
            padding: 20rpx 37rpx;
            text-indent: 60rpx;
        }

    }
}
</style>