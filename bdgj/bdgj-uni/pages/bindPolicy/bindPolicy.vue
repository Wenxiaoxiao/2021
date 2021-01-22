<template>
  <div class="views" :style="{height:totalHeight+'px'}">
    <div class="item_box">
      <text class="item_type">投保人证件号:</text>
      <input type="text" class="item_content item_id" adjust-position="false" style="width:500rpx;margin: 21rpx 0;height: 60rpx;line-height: 60rpx;border: none;" placeholder="请输入投保人证件号" @input="getId"></input>
    </div>
    <div class="item_box">
      <text class="item_type">投保人手机号:</text>
      <input type="number" class="item_content item_phone" adjust-position="false" style="width:500rpx;margin: 21rpx 0;height: 60rpx;line-height: 60rpx;border: none;" placeholder="请输入投保人手机号" @input="getTel"></input>
    </div>
    <div class="item_box">
      <text class="item_type">验证码:</text>
      <input class="item_content item_code" adjust-position="false" style="width:302rpx;margin: 21rpx 0;height: 60rpx;line-height: 60rpx;border: none;" placeholder="请输入验证码" @blur="getCode"></input>
      <button class="get_code" plain="true" @click="getMyCode" :class="[gotCode?'got_code':'ungot_code']">{{getCodeStr}}</button>
    </div>
    <text class="bindInfo">{{info}}</text>
    <div class="bottom_box">
      <button class="btn_bind" @click="bindPolicy" style="margin:0 auto;width: 690rpx;height: 90rpx;background-color: #4580f6;border-radius: 10rpx;font-size:34rpx;color:#fff;">绑定保单</button>
      <text class="tips">温馨提示：\n1.您只能绑定在梧桐树保险网购买的保单\n2.请您在点击绑定前，确认您所填信息正确无误\n3.如遇到保单无法绑定的情况，请拨打客服电话：\n400-9955-788</text>
    </div>
    <div class="my_loading" v-show="!canBind">
        <div class="loading_box">
            <img class="loading_img" src="https://bx.wts999.com/m/resource/xcxStatic/reload.gif">
            <span class="loading_text">保单查询中</span>
        </div>
    </div>
  </div>
</template>

<script>
  import http from '../../api/http.js';
  import tools from '../../api/tools.js';
  import notice from '../../api/notice.js';

export default  {
  data() {
	return {
		getCodeStr: "获取验证码",
		info: '',  // input校验
		canGetCode: false, // 能否获取验证码
		gotCode: false,   // 是否获取验证码
		totalHeight: -1,
		id: '',  // 证件号
		phone: '',  // 手机号
		code: '',  // 验证码
		isId: false,
		isPhone: false,
		isCode: false,
		canBind: true
	}
  },
  onLoad() {
	  var vm= this;
	uni.getSystemInfo({
		success: function(info) {
			// #ifdef APP-PLUS-NVUE
			vm.totalHeight = Number(info.windowHeight) - uni.upx2px(176);
			// #endif
			// #ifndef APP-PLUS-NVUE
			vm.totalHeight = Number(info.windowHeight);
			// #endif
		}
	})
  },
  methods: {
    getMyCode() {
      // 未输入手机号
      if(!this.canGetCode) {
        notice.msg("请输入正确的手机号");
        return false;
      }
      // 60s倒计时
      if(this.gotCode) return false;
      var that= this;
      var t= 60;
      this.$http({
        name: 'none',
        url: '/captcha/send/captext?phone='+that.phone
      }).then(function(res) {
          that.gotCode= true;
          // 获取过验证码样式
          that.getCodeStr= '(60s)';
          var timer= setInterval(function() {
            if(t>0) {
              t--;
              that.getCodeStr= '('+t+'s)';
            }else {
              clearInterval(timer);
              that.gotCode= false;
              that.getCodeStr= '获取验证码';
            }
          },1000)
        console.log(res)
      }).catch(function(res) {
        console.log(res)
      })
    },
    getId(e) {
      this.id= e.detail.value;
      if(this.id) {
        this.isId= true;
        this.info= "";
      }else {
        this.info= "请输入正确的证件号";
        this.isId= false;
      }
    },
    getTel(e) {
      if(tools.isPhone(e.detail.value)) {
        this.phone= e.detail.value;
        this.isPhone= true; 
        this.info= "";
        this.canGetCode= true;
      }else {
        this.info= "请输入正确的手机号";
        this.isPhone= false; 
        this.canGetCode= false;
      }
    },
    getCode(e) {
      this.code= e.detail.value;
      if(!this.code) {
        this.info= "请输入验证码";
        this.isCode= false;
      }else {
        this.info= "";
        this.isCode= true;
      }
    },
    bindPolicy() {
      var that= this;
      if(!this.canBind) {
        return false;
      }
      if(!this.isId) {
        this.info= "请输入正确的证件号";
        return false;
      }else if(!this.isPhone){
        this.info= "请输入正确的手机号";
        return false;
      }else if(!this.isCode) {
        this.info= "请输入验证码";
        return false;
      }else {
        this.info= "";
      }
      this.canBind= false;
      this.$http({
        name: 'b_bindPolicy',
        data: {
          identifyNumber: that.id,
          phone: that.phone,
          captcha: that.code
        }
      }).then(function(res) {
        that.canBind= true;
       notice.alert(res.data,'我知道了',function() {
         uni.redirectTo ({
           url: "/pages/minePolicy/minePolicy",
         });
       });
      }).catch(function(res) {
        // notice.alert(res.data);
      }).finally(function(){
          that.canBind= true;
     });
    }
  }
}
</script>

<style lang="less">
    @import './bindPolicy.css';
</style>
