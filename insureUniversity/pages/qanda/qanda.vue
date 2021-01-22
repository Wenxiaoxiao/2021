<!-- 保险问答 -->
<template>
 <div class="community view-container" ref="community">
     <div class="content">
          <!-- 帖子分类 -->
		  <div class="lz-tab">
			  <scroll-view class="scroll" scroll-x="true" @scroll="lzScroll" :scroll-left="scrollLeft" scroll-with-animation="true" lower-threshold="0">
				  <div v-for="(value,i) in topList" class="swiper-slide" :class="value.code==postType?'active':''" @click="tabs(value.code)">
					  <span>{{value.text}}</span>
				  </div>
			  </scroll-view>
			  <div class="button-prev" @click="myscroll(0)"><i class="iconfont icon-jiantouzuo"></i></div><!--左箭头-->
			  <div class="button-next" @click="myscroll(1)"><i class="iconfont icon-gengduo"></i></div><!--右箭头-->
		  </div>
			<qalist :mainData="mainList" :type="postType" :isNoMore="isNoMore" @showFullImg="showFull" @getMore="getMoreData"></qalist>
      </div>
	  <div class="wrapper" v-show="wrapperShow" @click="closeFull">
		  <image :src="fullImgUrl" mode="aspectFit"></image>
	  </div>
 </div>
</template>
 
<script>
import qalist from '../../components/qalist.vue'	
import http from '../../tool/http.js'
import tools from '../../tool/tools.js'

export default {
  data: () => ({
    topList: [], //顶部列表
    mainList: [], //主列表数据
    // loaded: false,
    postType:0,//类型
    pageNum:1,//页数
    pageSize:20,//每页个数
	maxPage:99, // 最大页数
	isNoMore: false, // 没有更多数据
	scrollLeft: 0, // 顶部nav滚动位置
	wrapperShow: false,
	fullImgUrl: '',
	scrollWidth: '', // 顶部滚动条宽度
	maxScrollLeft: '' // 想右滚动最大距离
  }),
  components: {
    "qalist":qalist
  },
  created() {
    var self=this;
    this.getTopList();
	  this.getMainList();
  },
  onShow(){
      tools.getRecentVersion();
  },
  onLoad(option) {
	  var vm= this;
	  if(option.tab) {
		  this.postType = tab
	  }
		uni.getSystemInfo({
			success: function(info) {
				vm.scrollWidth= Number(info.windowWidth) - 100/750 * info.windowWidth;
			}
		})
  },
  methods: {
	  // 顶部tab滚动距离
	  lzScroll(e) {
		  this.maxScrollLeft= e.detail.scrollWidth- this.scrollWidth;
		  console.log(this.maxScrollLeft);
	  },
	// 左右箭头切换
	myscroll(i) {
		if(i) {
			this.scrollLeft+= 200;
			if(this.scrollLeft> this.maxScrollLeft) {
				this.scrollLeft= this.maxScrollLeft;
			}
		}else {
			if(this.scrollLeft<=0) return;
			this.scrollLeft-= 200;
		}
	},
    tabs(code){
      //顶部导航事件
      if(this.postType==code)return;
      this.mainList = [];
      this.postType=code;
      this.pageNum=1;
	  this.maxPage= 99;
	  this.isNoMore= false;
	  this.getMainList();
    },
	showFull(e) {
		this.fullImgUrl= e.url;
		this.wrapperShow= true;
	},
	closeFull() {
		this.wrapperShow= false;
	},
    getTopList() {
      //初始化mescroll+顶部tab栏内容获取
      var self=this;
      //获取顶部推荐栏数据 
	  this.$http({
		  name: 'C_topList',
		  data: {}
	  })
	  .then(function(data) {
        self.topList = data.data;
	  })
	  .catch(function(err) {
		  console.log(err)
	  })
    },
	getMoreData() {
		this.getMainList(true);
	},
    getMainList() {
	  if(this.pageNum>=this.maxPage+1) {
		return this.isNoMore= true;  
	  }
      var self=this;
      //获取社区列表数据
	  this.$http({
		  name: 'C_mainpost',
		  data: {
			  postType: Number(self.postType),
			  pageSize: self.pageSize,
			  pageNum: self.pageNum
		  }
	  })
	  .then(function(data) {
		  self.maxPage= data.pages;
		  var data= data.data;
		  data.map(function(item) {
			  item.createTime= tools.trustTime(item.createTime);
			  item.content= tools.subString(tools.fmtContent(item.content));
			  
		  })
        if(self.pageNum ==1){//tab点击事件加载
          self.mainList = data;
        }else{
			//普通滑动加载
          self.mainList=self.mainList.concat(data)
        }
		self.pageNum++;
	  })
	  .catch(function(err) {
		  console.log(err)
	  })
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
	}
};
</script>

<style lang="scss" scoped>
	.community {
	    width: 100%;
	    position: relative;
	    .wrapper{
	      width: 100%;
	      height: 100%;
	      overflow: hidden;
	    }
	    .loading-wrapper{
	      width: 100%;
	      height: 55px;
	      line-height: 55px;
	      font-size: 30rpx;
	      text-align: center;
	    }
	  
	    .dlList {
	      width: 100%;
	      position: relative;
	      overflow: hidden;
	      // margin-top: 15rpx);
	      background: #fff;
	      padding: 0 28rpx;
	      padding-top: 8rpx;
	      padding-bottom: 10rpx;
	      box-sizing: border-box;
	      border-bottom: 1px solid #e6e6e6;
	      .dlList_img{
	        width: 100%;
	      }
	  
	      .iconfont {
	        font-size: 52rpx;
	        color: #999999;
	        position: absolute;
	        margin-left: 28rpx;
	      }
	  
	      .myPhoto {
	        width: 80rpx;
	        height: 80rpx;
	        margin-top: 10rpx;
	        border-radius: 50%;
	        -webkit-border-radius: 50%;
	        -moz-border-radius: 50%;
	        -ms-border-radius: 50%;
	        -o-border-radius: 50%;
	}
	    }
	  
	    .lz-tab-box {
	      width: 100%;
	      padding: 0 25px;
	      height: 80rpx;
	      position: relative;
	    }
	  
	    .lz-tab {
	      position: relative;
	      position: -webkit-sticky;
	      position: sticky;
	      top: -1px;
	      left: 0;
	      width: 100%;
	      height: 80rpx;
	      background-color: #fff;
	      padding: 0 50rpx;
	      overflow: hidden;
	      z-index: 99;
	      border-bottom: 1px solid #e6e6e6;
		  white-space: nowrap;
		  box-sizing: border-box;
	      .swiper-slide {
			display: inline-block;
			padding: 0 20rpx;
	        font-size: 30rpx;
	        text-align: center;
			height: 80rpx;
	        line-height: 80rpx;
			box-sizing: border-box;
	        z-index: 2;
	        font-weight: 900;
	      }
	  
	      .button-prev,
	      .button-next {
	        position: absolute;
	        top: 0;
	        width: 50rpx;
	        height: 100%;
	        background-color: #fff;
	        z-index: 10;
	        overflow: hidden;
	  
	        .iconfont {
	          font-size: 50rpx;
	          color: #000;
	          position: absolute;
	          top: 50%;
			  transform: translateY(-50%);
	        }
	      }
	  
	      .swiper-button-disabled {
	        .iconfont {
	          color: #ccc;
	  
	        }
	      }
	  
	      .button-prev {
			left: 0;
	  
	        .iconfont {
	          left: 0;
	        }
	      }
	  
	      .button-next {
	        right: 0;
	  
	        .iconfont {
	          right: 10rpx;
	        }
	      }
	  
	      .active {
	        border-bottom: 8rpx solid #0084ff;
	        color: #0084ff;
	      }
	  
	      .next-btn {
	        width: 50rpx;
	        height: 100%;
	        position: absolute;
	        right: 0;
	        top: 0;
	        text-align: center;
	        color: #c5c5c5;
	        background-color: #fff;
	        z-index: 10;
	        box-shadow: -3px 0 5px rgb(255, 203, 177);
	  
	        .iconfont {
	          font-size: 36rpx;
	          position: absolute;
	          top: 50%;
	          right: 1px;
	          margin-top: -30rpx;
	        }
	      }
	    }
	    a.publication {
	      position: fixed;
	      right: 10px;
	      top: 80%;
		  width: 100rpx;
		  height: 100rpx;
	      // background: url("~@/publication.png") no-repeat;
	      background-size: cover;
	      z-index: 999;
	    }
	  
	    .footer {
	      margin-top: 0;
	    }
	  }
	  
	  .mescroll-totop {
	    bottom: 30% !important;
	  }
	  
	  .myZone {
	    .claimsLine2 {
	      width: 100%;
	      background-color: #fff;
		  height: 90rpx;
	  
	      li {
	        width: 50%;
	        height: 100%;
	        float: left;
	        text-align: center;
	        line-height: 90rpx;
			font-size: 34rpx;
	        border-bottom: 1px solid #f1f1f1;
	      }
	  
	      .active {
	        color: #ff6e00;
	        border-bottom: 2px solid #ff6e00;
	  
	      }
	    }
	  
	    .contents {
	      >ul {
	        width: 100%;
	        display: none;
	      }
	  
	      .icon-fabiaowenzhang {
	        display: block;
	        color: #ff6e00;
	        margin: 50px auto 10px;
			font-size: 80rpx;
	        text-align: center;
	      }
	  
	      .active {
	        display: block;
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
</style>
