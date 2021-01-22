<template>
	<div>
		<scroll-view :style="{height: mainHeight+ 'px'}" class="scroll" scroll-y="true" @scrolltolower="getArticle">
			<ul class="ul-js">
				<li v-for="(value,i) in articleData" v-if="value.articleType!= 4" class="tab_list_1i ck_event" :class="value.articleType == '2' || value.articleType == '5'?'tab_list_1i1':''">
					<div class="itembox" @click="toArticle(value.id,value.articleType)">
						<block v-if="value.articleType && (value.articleType == '5' || value.articleType == '2')">
							<img v-if="value.imgUrl" :src="value.imgUrl[0]" alt="" class="img-right lazy"> 
							<div class="type-text-l">
								<p class="lis-title">{{value.articleTitle}}</p>
								<div class="list-module clearfix" style="width:110%;">
									<div class="fl span">
										<span class="sub_span" v-for="item in value.tag">{{item}}</span>
									</div> 
								</div>
							</div>
						</block>
						<block v-else>
							<div class="type-text-l">
								<block v-if="value.articleType && value.articleType == '3'" >
									<p class="lis-title">{{value.articleTitle}}</p>
									<div class="img-center-box">
										<img v-for="(img,n) in value.imgUrl" :src="img" alt="" class="img-right lazy"> 
									</div>
								</block>
								<block v-else>
									<p class="lis-title">{{value.articleTitle}}</p>
									<div class="img-center-box">
										<img v-if="value.videoImg" :src="value.videoImg" alt="" class="img-big lazy"> 
										<img :src="value.articleType=='1'?imgsrc1:imgsrc2" alt="" class="btn-start"> 
										<span v-if="value.videoTime && value.videoTime!='null'" class="pay-time">{{value.videoTime}}</span>
									</div>
								</block>
								<div class="list-module clearfix">
									<div class="fl span">
										<span class="sub_span" v-for="item in value.tag">{{item}}</span>
									</div> 
									<p class="fr">{{value.readTimes}}阅读</p>
								</div>
							</div>
						</block>
					</div>
				</li>
			</ul>
			<div class="nomore" v-if="pageNum==maxPage+1">没有更多数据了~</div>
			<!-- <div class="blank" v-show="showBlank"></div> -->
		</scroll-view>
	</div>
</template>

<script>
	import store from '../store.js'
	import http from '../tool/http.js';
	import tools from '../tool/tools.js';
	
export default {
  props: {
	  listType: Number,
	  listCode:Number,
	  type: Number
  },
  data() {
	return {
		ajaxName: "",
		imgsrc1: require('../assets/images/index/start.png'),
		imgsrc2: require('../assets/images/index/audio.png'),
		mainHeight: 0,
		pageSize: 20,
		pageNum: 1,
		maxPage: 99,
		articleData: [],
		articleBaseUrl: store.env == "0"?'https://www.wts9999.net/article/':'https://www.wts999.com/article/',
		showBlank: false // 显示底部占位
	};
  },
  beforeCreate() {
  },
  created() {
	// uni.getSystemInfo({
	// 	success: res => {
	// 		getApp().globalData.windowHeight= res.windowHeight
	// 		this.mainHeight= getApp().globalData.windowHeight;
	// 	}
	// })
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
			this.mainHeight= getApp().globalData.windowHeight- uni.upx2px(120);
		}
	})
	// #endif
	if(this.type==2) {
		this.showBlank= true;
		this.getArticle();
	}
  },
  methods: {
	getArticle() {
		if(this.type==1) {
			this.ajaxName= "Share_bodyList"
		}else {
			this.ajaxName= "gaurd_list"
		}
		if(this.pageNum>=this.maxPage+1) return ;
		var vm= this;
		this.$http({
			name: this.ajaxName,
			data: {
				code: this.listCode, //文章code
				pageSize: this.pageSize,
				pageNum: this.pageNum,
				type: this.listType
			}
		})
		.then(function(data) {
			vm.maxPage= Math.ceil(data.data.total/data.data.pageSize);
			var list= data.data.list;
			list.map(function(item) {
				// 处理标签
				item.tag= vm.tagText(item.tag);
				// 时间
				if(item.updateTime) {
					item.updateTime= vm.formatTime(item.updateTime);
				}
				// 简介28个字
				item.articleTitle= tools.subString(item.articleTitle,26);
			})
			if (vm.pageNum == 1) {
				//当页数为1时 重置数据
				vm.articleData = list;
			} else {
				//下拉树数据拼接
				vm.articleData = vm.articleData.concat(list);
			}
			console.log(vm.articleData);
			vm.pageNum++;
		})
		.catch(error => {
			console.log(error);
		});
	},
	// 处理文本
	tagText(text) {
		if (!text || text.trim() == "" || text == "null") return;
		text = text.replace(/\,/g, "，")
		var arr = text.split("，");
		return arr;
	},
	// 格式化时间
	formatTime(time) {
		if (!time) {
		  return;
		}
		time = time.toString().trim().replace(/-/gm, "/");
		var date = null,
		  now = new Date();
		if (time.indexOf("/") != -1) { //yyyy-mm-dd HH:mm:ss
		  date = new Date(time);
		} else {
		  date = new Date(Number(time)); // long 整型
		}
		var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		monthTime =year+"年"+(month < 10 ? "0" + month : month) + "月" + (day < 10 ? "0" + day : day)+"日";
		return monthTime;
	},
	toArticle(id,type) {
		//console.log("k",k);
		console.log("type",type);
		var pages = getCurrentPages();
		var currentPage = pages[pages.length-1];
		var url = currentPage.route;
		var options = currentPage.options;
		console.log("url",url);
		console.log("options",options);
		uni.navigateTo({
			// url: '/pages/glcpDetail/glcpDetail?id='+id+'&articleType='+type
			url: '/pages/glcpDetail/glcpDetail?id='+id
		});
		// if(url == 'pages/gaurd/gaurd'){ 
		// 	uni.navigateTo({
		// 		// url: '/pages/glcpDetail/glcpDetail?id='+id+'&articleType='+type
		// 		url: '/pages/shpfDetail/shpfDetail?id='+id
		// 	});
		// }
		// if(url == 'pages/article/article' && options.code == '10'){
		// 	uni.navigateTo({
		// 		// url: '/pages/glcpDetail/glcpDetail?id='+id+'&articleType='+type
		// 		url: '/pages/glcpDetail/glcpDetail?id='+id
		// 	});
		// }
		// if(url == 'pages/article/article' && options.code == '40'){
		// 	uni.navigateTo({
		// 		// url: '/pages/glcpDetail/glcpDetail?id='+id+'&articleType='+type
		// 		url: '/pages/cpcpDetail/cpcpDetail?id='+id
		// 	});
		// }
		//守护平凡：pages/gaurd/gaurd
		//投保攻略：pages/article/article {code: "10", type: "2"}
		//产品测评：pages/article/article {code: "40", type: "2"}
		// return
		// uni.navigateTo({
		// 	// url: '/pages/glcpDetail/glcpDetail?id='+id+'&articleType='+type
		// 	url: '/pages/glcpDetail/glcpDetail?id='+id
		// });
	}
	// toWebview(url) {
	// 	uni.navigateTo({
	// 		url: '/pages/webView?url='+encodeURIComponent(url)
	// 	});
	// }
  },
  watch:{
	  listType(newVal) {
		  this.getArticle();
	  },
	  listCode(newVal) {
		  var str= '';
		  if(newVal==10) {
			  str= '投保攻略'
		  }else {
			  str= "产品测评"
		  }
		  uni.setNavigationBarTitle({
		      title: str
		  });
	  }
  }
};
</script>

<style lang="scss" scoped>
    .ul-js{
      width: 100%;
      position: relative;
      display: block;
      background-color: #fff;
      .tab_list_1i{
		  box-sizing: border-box;
        position: relative;
        word-wrap: break-word; 
        word-break: normal; 
        padding:30rpx 20rpx 0;
        width: 100%;
        >div{
          width: 100%;
          border-bottom: 1px solid #ececec;
          height: 100%;
          display: block;
          padding-bottom: 10rpx;
        }
        .img-center-box{
          padding: 10rpx 0 20rpx;
          position: relative;
          display: flex;
          justify-content:space-between;
          display: -webkit-flex;
          -webkit-justify-content:space-between;
          .timg{
            width: 100%;
          }
          .btn-start{
            position: absolute;
            width: 105rpx;
            height: 105rpx;
            top: 50%;
            left: 50%;
            transform:translate(-50%,-50%)
          }
          .pay-time{
            position: absolute;
            right: 15rpx;
            bottom: 35rpx;
            text-align: center;
            padding: 0 30rpx;
            height: 40rpx;
            line-height: 40rpx;
            background-color: rgba(0,0,0,.6);
            color: #fff;
            border-radius:20rpx
          }
        }
        .block{
          width: 100%;
          height: 400rpx;
          background-color: #000;
        }
        .img-right{
			width: 230rpx;
			height: 153rpx;
        }
        .img-big{
			width: 710rpx;
			height: 400rpx;
        }
        &.tab_list_1i1{
          height: 196rpx;
          .itembox{
			  padding-right: 250rpx;
          }
          .img-right{
            position: absolute;
            right: 20rpx;
            top:50%;
            transform:translateY(-50%);
          }
          .type-text-l{
            .lis-title{
				width: 470rpx;
              height: 82rpx;
              margin-bottom: 18rpx;
              word-break: break-all;
              line-clamp: 2;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              text-overflow: -o-ellipsis-lastline;
              -webkit-box-orient: vertical;
            }
          }
        }
       
        .type-text-l{
          height: 100%;
          position: relative;
          font-size: 26rpx;
          .lis-title{
			  font-size: 34rpx;
            color: #000;
            line-height: 42rpx;
            word-break: break-all;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .list-module {
				display: flex;
				justify-content: space-between;
				width: 100%;
            .span {
              text-align: center;
			  font-size: 26rpx;
              .sub_span{
                display: inline-block;
				border-radius: 5rpx;
                padding: 0 10rpx;
                height: 40rpx;
                line-height: 40rpx;
                color: #0084ff;
                border: 1px solid #0084ff;
                margin-right: 10rpx;
                box-sizing: content-box;
                &:last-child{
                  margin: 0;
                }
              }
            }
            p{
              color: #666;
              font-size:26rpx;   
              .iconfont{
                vertical-align: middle;
                margin-right: 8rpx;
              }
            }
          }
        }
      }
      li.li-img{
        padding-right: 0;
        border-top: none;
        .top-img{
          width: 100%;
        }
      }
      
      .lis-text{
		  font-size: 28rpx;
        color: #666;
        line-height: 36rpx;
      }
      
      .sp{
        padding: 0 6px;
		font-size: 24rpx;
        color: #ff6e06;
        display: inline-block;
        border-radius:8px;
        border: 1px solid #ff6e06;
        margin-right: 5px;
      }
      &.active{
        display: block;
      }
      .list-more{
        display: block;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        font-size: 28rpx;
        color: #676767;
        span{
          font:400 13px/13px simsun;
        }
      }
    }
	.blank {
		height: 120rpx;
	}
	  .nomore {
		  padding: 20rpx 0;
		  text-align: center;
		  color: #666;
		  background: #fff;
	  }
</style>