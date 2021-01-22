<template>
  <div class="reseve-popup">
      <div class="contact-layer-box" v-show="isLayerHide">
          <div class="showMask"  @click.stop="hidePop"></div>
            <div class="contact-layer" v-show="isLayerHide">
                <div class="title2">
                    - 服务预约 -
                </div>
                <div class="msg">
                    <div class="msg-box">
                        <text class="msg-key">您的姓名：</text>
                        <input placeholder="您的姓名" v-model="customerName" maxlength="20" @input="getName" class="msg-value msg-name"></input>
                    </div>
                    <div class="msg-box">
                        <text class="msg-key">您的手机：</text>
                        <input placeholder="您的手机" v-model="mobilePhone" type="number" @input="getTel" class="msg-value msg-phone"></input>
                    </div>
                </div>
                <div class="submit" @click="submitFn">提交预约</div>
            </div>
      </div>
      <div class="tagBox" v-show="isTagshow">
        <div class="tag-backdrop" @click.stop="hideTask"></div>
        <div class="tagBlock" v-show="isTagshow">
            <image :src="imgSrc"></image>  
        </div>
      </div>
  </div>
</template>

<script>

  import http from '../tool/http.js';
  import tools from '../tool/tools.js';
  import notice from '../tool/notice.js';

export default   {
  props: {
    isLayerHide: Boolean,
    agentId: String
  },
  data() {
	return {
	  imgSrc: "https://bx.wts999.com/m/xcxStatic/bdgj/tan_bg.png",
	  //成功弹窗隐藏
	  isTagshow:false,
	  //时间内容隐藏
	  isTimeBox:false,
	  //用户名称
	  customerName:'',
	  //用户手机
	  mobilePhone:'',
	  reVal1: ''
	}
  },
  methods: {
    submitFn() {
      if(!tools.trim(this.customerName)) {
        notice.msg("请输入您的姓名");
        return false;
      }
      if(!tools.isPhone(this.mobilePhone)) {
        notice.msg("请输入正确的手机号");
        return false;
      }
      var that= this;
      this.$http({
        name: "Exe_agentOrder",
        data: {
          agentId: that.agentId,
          name: that.customerName,
          mobile: that.mobilePhone
        }
      }).then(function(res) {
        if(res.httpCode==200) {
          that.$emit("hidePop");
          that.isTagshow= true;
        }else {
          notice.msg(res.msg);
        }
        that.customerName= "";
        that.mobilePhone= "";
      }).catch(function(res) {
      })
    },
    // 获取姓名
    getName(e) {
      this.customerName= e.detail.value;
    },
    // 号码
    getTel(e) {
      this.mobilePhone= e.detail.value;
    },
    // 隐藏弹窗
    hidePop() {
      this.$emit("hidePop")
    },
    // 隐藏预约成功图片
    hideTask() {
      this.isTagshow= false;
    }
  }
}

</script>

<style lang="scss" scoped>
	.contact-layer-box{
	    .showMask{
	        position: absolute;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        z-index: 998;
	        background-color: rgba(0,0,0,.5);
	    }
	    .contact-layer {
	        position: absolute;
	        top: 50%;
	        left: 50%;
	        transform: translate(0,-60%);
	        width: 603rpx;
	        height: 540rpx;
	        background-color: #fff;
	        border-radius: 8rpx !important;
	        margin-left: -301rpx;
	        z-index: 1000;
	        .title,
	        .title2 {
	            height: 140rpx;
	            line-height: 140rpx;
	            text-align: center;
	            font-size: 49rpx;
	            font-weight: 900;
	            border-top-left-radius: 8rpx !important;
	            border-top-right-radius: 8rpx !important;
	            color: #ff6000;
	            background: url('../assets/images/index/contact-bg.png') no-repeat center;
	            span {
	                font-weight: 100
	            }
	        }
	        .msg {
	            padding-top: 10rpx;
	            font-size: 32rpx;
	            .msg-box {
					display: flex;
	                flex-direction: row;
	                justify-content: center;
	                margin-top: 23rpx;
	                .msg-key {
	                    font-size: 30rpx;
	                    width: 164rpx;
	                    display: inline-block;
	                    text-align: right;
	                    padding-right: 8rpx;
	                    height: 80rpx;
	                    line-height: 80rpx;
	                }
	                .msg-value {
	                    display: inline-block;
	                    border: 2rpx solid #ccc;
						border-radius: 6rpx;
						height: 76rpx;
						line-height: 76rpx;
						width: 346rpx;
						padding-left: 15rpx;
						vertical-align: middle;
	                }
	            }
	            .msg-box-time {
	                position: relative;
	                .key-time {
	                    width: 356rpx;
	                    text-align: center;
	                    position: relative;
	                    padding: 0;
	                    .arrow {
	                        position: absolute;
	                        right: 8rpx;
	                        top: 50%;
	                        width: 25rpx;
	                        transform: translateY(-50%);
	                    }
	                }
	                .select-box {
	                    position: absolute;
	                    width: 356rpx;
	                    left: 2.5rem;
	                    border: 1rpx solid #ccc;
	                    background: #fff;
	                    .select-value {
	                        height: 45rpx;
	                        line-height: 45rpx;
	                        text-align: center;
	                    }
	                }
	            }
	        }
	        .submit {
	            margin: 38rpx auto;
	            width: 526rpx;
	            height: 80rpx;
	            background-color: #ff9c00;
	            border-radius: 8rpx;
	            color: #fff;
	            font-size: 36rpx;
	            line-height: 80rpx;
	            text-align: center;
	        }
	    }
	    .reseve-fade-enter-active {
	        transition: all .2s;
	        -webkit-transition: all .2s;
	        -moz-transition: all .2s;
	        -ms-transition: all .2s;
	        -o-transition: all .2s;
	    }
	    .reseve-fade-enter, .reseve-fade-leave-to{
	        transform: scale(0);
	        opacity: .3;
	    }
	}
	
	.tagBox{
	    .tag-backdrop{
	        position: fixed;
	        top: 0;
	        left: 0;
	        bottom: 0;
	        right: 0;
	        width: 100%;
	        height: 100%;
	        background-color: rgba(0,0,0,.5);
	        z-index: 999;
	    }
	    .tagBlock{
	        width: 100%;
	        position: fixed;
	        top: 20%;
	        z-index: 1001;
	        text-align: center;
	    }
	    .tag-enter-active {
	        transition: all .1s;
	        -webkit-transition: all .1s;
	        -moz-transition: all .1s;
	        -ms-transition: all .1s;
	        -o-transition: all .1s;
	    }
	    .tag-enter, .tag-leave-to
	        /* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
	        transform: scale(0);
	    }
	}
</style>

