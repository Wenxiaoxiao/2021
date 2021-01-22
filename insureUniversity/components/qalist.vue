<template>
	<scroll-view scroll-y="true" :style="{height: mainHeight+'px'}" @scrolltolower="getData">
<ul class="mainContent">
      <li class="mainList"
      v-for="(value,i) in mainList">
       <dl class="dl">
        <dt class="dt">
          <div @click="getUrl(value.id)">
            <div class="textBox">
              <image mode="widthFix" v-if="value.userId==0" :src="imgsrc1" class="img-auther"></image>
              <image mode="widthFix" v-else-if="value.headimgurl=='' || value.headimgurl=='/0'" :src="imgsrc2" class="img-auther"></image>
              <image mode="widthFix" v-else :src="value.headimgurl" class="img-auther"></image>
              <div class="top_box">
                <span class="name">{{value.nickname}}</span>
                <image mode="widthFix" v-if="value.userId==0" :src="imgsrc3" class="level"></image>
              </div>
              <div class="time">{{value.createTime}}</div>
            </div>
          </div>
        </dt>
        <dd class="problemBox">
          <div class="problem">
            <div @click="getUrl(value.id)">
              <p v-if="value.userId == 0" class="text text3 emojiCheck">{{value.intro}}<span class="click-more">点击阅读全文&gt;</span></p>
              <p v-else class="text text2">{{value.content}}</p>
            </div>
            <div class="stop">{{value.admin}}</div>
			<div v-if="value.imgUrls" class="imgBox clearfix">
				<span class="img-box-1" v-for="(item,index) in value.imgUrls"><image mode="aspectFill" class="lazy" :src="item" @click="showFullImg(item)"></image></span>
			</div>
          </div>
        </dd>
        <div @click="getUrl(value.id)" v-show="value.replys && value.replys.length!=0">
          <dd class="answer">
            <ul class="answerList" id="answerList">
              <li class="answer_li" v-for="(values) in value.replys">
					  <div class="answerText emojiCheck"><span class=".span">{{values.nickname}}</span>{{values.content}}</div>
				  </li>
              <span v-show="value.commentNum>2" class="more-a">查看更多回复 &gt;</span>
            </ul>
          </dd>
        </div>
		</dl>
      </li>
    </ul>
	<div class="nomore" v-if="isNoMore">没有更多数据了~</div>
	</scroll-view>
</template>

<script>
import store from '../store.js'  //全局变量
import tool from '../tool/tools.js'

export default {
  props: ["mainData",'type','isNoMore'],
  data() {
    return {
      mainList: [],
	  mainHeight: 0,
	  imgsrc1: require('../assets/images/index/miniLogo.jpg'),
	  imgsrc2: require('../assets/images/index/default_auther.png'),
	  imgsrc3: require('../assets/images/index/manage.png'),
    };
  },
  methods: {
    getUrl(id){
		uni.navigateTo({
			url: '/pages/qaDetail/qaDetail?id='+id
		})
    },
	showFullImg(url) {
		this.$emit('showFullImg',{
			url: url
		})
	},
	getData() {
		this.$emit('getMore')
	}
  },
  created() {
	var vm= this;
	uni.getSystemInfo({
		success: function(info) {
			vm.mainHeight= Number(info.windowHeight) - uni.upx2px(80);
		}
	})
  },
  watch: {
    mainData(newVal) {
        this.mainList = newVal;
	    if(this.mainList.length) {
		    this.mainList.map(function(item) {
				if(item.imgUrls) {
					item.imgUrls= item.imgUrls.split(",");
				}
			    item.replys.map(function(a) {
				    // 回复显示150字
				    a.content= tool.subString(a.content,150);
			    })
		    })
	    }
    },
  }
};
</script>

<style lang="scss">
.mainContent {
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  .postID {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
  }
  .problemTip {
    display: block;
    height: 50rpx;
    line-height: 50rpx;
    position: absolute;
    top: 10rpx;
    right: 0;
    text-align: right;
    z-index: 9;
    .problemTip-lib {
      display: inline-block;
	  height: 50rpx;
      color: #9d9d9d;
      font-size: 26rpx;
      padding-right: 15rpx;
      text-align: left;

      i {
        font-size: 32rpx;
        float: right;
      }

      .problemname {
        float: right;
        right: 16rpx;
        margin-left: 10rpx;
        top: -2rpx;
        display: inline-block;
        height: 50rpx;
      }

      .dianzan {
        float: right;
        display: inline-block;
		width: 40rpx;
		height: 50rpx;
        // background: url("~@/dianzan.png") no-repeat;
        background-size: contain;
        position: relative;
        top: 2px;
      }

      .hasdianzan {
        float: right;
        display: inline-block;
		width: 40rpx;
		height: 50rpx;
        // background: url("~@/dianzan-02.png") no-repeat;
        background-size: contain;
        position: relative;
        top: 2px;
      }

      .dianzan.active {
        // background: url("~@/dianzan-02.png") no-repeat;
        background-size: contain;
        animation: dianzanActive 0.5s ease forwards;
      }

      @keyframes dianzanActive {
        0% {
          transform: scale(1);
        }

        50% {
          transform: scale(1.5);
        }

        100% {
          transform: scale(1);
        }
      }
    }
  }
  .mainList {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-top: 15rpx;
    position: relative;
    background: #fff;

    > .dl {
      width: 100%;
      height: auto;
      overflow: hidden;

      > .dt {
        width: 100%;
        height: 120rpx;
        padding: 0 30rpx;
        box-sizing: border-box;
        position: relative;
        padding-top: 20rpx;

        .img-auther {
          width: 70rpx;
          height: 70rpx;
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 35rpx;
        }

        .textBox {
          position: relative;
          width: 100%;
          height: 70rpx;
          padding-left: 85rpx;

          .top_box {
            width: 50%;
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .name {
            height: 40rpx;
            font-size: 30rpx;
            color: #000;
            position: relative;
            //top: -2px;
          }

          .level {
			  width: 100rpx;
            display: inline-block;
          }

          .time {
            width: 100%;
            height: 34rpx;
            line-height: 36rpx;
            font-size: 28rpx;
            color: #949494;
          }
        }
      }

      .problemBox {
        height: auto;
        padding-right: 30rpx;
        padding-left: 30rpx;
        padding-bottom: 10rpx;

        .problem {
          font-size: 28rpx;
          line-height: 38rpx;

          .stop {
            color: #ff6e06;
          }

          .stop-after {
            position: relative;
          }

          .stop-after:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 80rpx;
            margin-top: -14rpx;
            width: 18rpx;
            height: 18rpx;
            transform: rotate(45deg);
            border-right: 1px solid #ff6e06;
            border-bottom: 1px solid #ff6e06;
          }

          .stop-active:after {
            margin-top: -5rpx;
            transform: rotate(-135deg);
          }

          .textMore {
            display: block;
            text-align: right;
			color: #ff6e06;
			font-size: 28rpx;
          }

          .imgBtn {
            display: inline-block;
            height: 174px;
            width: 248px;
            left: 0;
          }

          .text2 {
            height: auto;
            line-height: 25px;
            color: #000;
            overflow: hidden;
            font-size: 32rpx;
          }

          .text3 {
            height: auto;
            line-height: 46rpx;
            color: #000;
            font-size: 32rpx;
            word-break: break-all;
            word-wrap: break-word;

            .click-more {
              margin-left: 20rpx;
              color: #ff6e06;
            }
          }

          .more-color {
            color: #ff6e07;
          }

          .active {
            max-height: 75px;
          }

          .imgBox {
			display: flex;
			flex-direction: row;
            margin-top: 5px;
            padding-bottom: 10rpx;
			flex-wrap: wrap;

            .img-box-1 {
				margin-right: 16rpx;
              max-width: 200rpx;
              height: 300rpx;
              overflow: hidden;
              text-align: center;

              image {
				max-width: 200rpx;
                height: 100%;
              }
            }

            .img-box-2 {
				margin-right: 16rpx;
              max-width: 230rpx;
              height: 180rpx;
              overflow: hidden;
              text-align: center;

              image {
               max-width: 230rpx;
                height: 100%;
              }
            }

            .imgOne {
              width: 450rpx;
              height: 450rpx;
              margin-right: 8rpx;
              display: block;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              position: relative;
              overflow: hidden;
            }

            .imgTwo {
              display: inline-block;
              margin-right: 10rpx;
              width: 250rpx;
              height: 200rpx;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              position: relative;
              overflow: hidden;
            }

            .img-hidden {
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0;
            }
          }

          .videoBox {
            height: auto;
            width: 100%;
            overflow: hidden;

            .video-js {
              width: 690rpx;
              height: auto;
              max-height: 388rpx;
              max-width: 690rpx;

              .vjs-tech {
                width: 690rpx;
                height: 388rpx;
              }

              .vjs-big-play-button {
                width: 102rpx;
                height: 102rpx;
                text-align: center;
                line-height: 102rpx;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                margin-left: -51rpx;
                margin-top: -51rpx;
              }
            }

            .imgTwo {
              width: 226rpx;
              height: 226rpx;
              margin-right: 8rpx;
            }
          }
        }
      }
    }

    .answer {
      width: 100%;
      height: auto;
      overflow: hidden;
      box-sizing: border-box;
      padding: 20rpx 30rpx;
      border-top: 1px solid #e6e6e6;

      .answerList {
        width: 100%;
        height: auto;
        position: relative;
        background: #f7f7f7;
        padding: 5px 0;

        .more-a {
          font-size: 28rpx;
          line-height: 46rpx;
          color: #4a7caf;
          padding: 0 5px;
        }

        .answer_li {
          width: 100%;
          height: auto;
          overflow: hidden;
          font-size: 30rpx;
          line-height: 46rpx;
          color: #4a7caf;
          padding: 0 5px;
			box-sizing: border-box;
          .span {
            float: left;
            margin-right: 12rpx;
			color: #4a7caf;
          }

          .answerText {
            color: #000;
          }
        }
      }
    }
  }
}
	  .nomore {
		  padding: 20rpx 0;
		  text-align: center;
		  color: #666;
		  background: #fff;
	  }
</style>