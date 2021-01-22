<template>
    <div class="apps">
      <div class="top-panel center">
        <div class="logo">
          <div class="logo-img"></div>
        </div>
        <div class="logo-text">梧桐树保险网</div>
      </div>
      <div class="logo-panel">
        <div class="input-item inline-box">
          <div class="input-img input-img1"></div>
          <input placeholder="请输入手机号" type="text" style="border:0;font-size:28rpx" placeholder-style="#999" v-model="phone" >
        </div>
        <div class="input-item inline-box">
          <div class="input-img input-img2"></div>
          <input placeholder="请输入验证码" type="text" style="border:0;font-size:28rpx" placeholder-style="#999" v-model="code" >
          <div class="text-btn" @click="getCode" v-if="timerIndex == timerSize">获取验证码</div>
          <div class="text-btn active" v-if="timerIndex != timerSize">{{timerIndex}}s后重新发送</div>
        </div>
        <button style="height: 90rpx;background-color: #4581f6;border-radius: 20rpx;margin-top:100rpx;color:#fff;" @click="submit()">登录</button>
      </div>
		<loading :loaded="loaded"></loading>
    </div>
</template>

<script>
  import store from '../../store/state';
  import notice from '../../api/notice.js';
  import http from '../../api/http.js';
  import tools from '../../api/tools.js';
  import loading from '../../components/loading.vue';
  
  const TIMERSIZE = 120;// 倒计时总时长 秒
export default {
    data() {
		return {
			loading:false,
			phone:"",
			code:"",
			backUrl:"",
			isOk:false,
			timerIndex: TIMERSIZE, //倒计时当前计数
			timerSize: TIMERSIZE//倒计时总时长
		}
    },
    watch: {
      phone(){
        this.checkSubmit(false);
      },
      code(){
        this.checkSubmit(false);
      }
    },
    methods: {
      //验证提交状态
      checkSubmit(showError){
        this.isOk = true;
        if(!this.phone){
          this.isOk = false;
          showError && notice.msg("请输入手机号");
          return;
        }
        if(!tools.isPhone(this.phone)){
          this.isOk = false;
          showError && notice.msg("请输入正确格式的手机号");
          return;
        }
        if(!this.code){
          this.isOk = false;
          showError && notice.msg("请输入验证码");
          return;
        }
      },
      // 获取验证码
      getCode(){
        if(!this.phone){
          notice.msg("请输入手机号");
          return;
        } 
        if(!tools.isPhone(this.phone)){
          notice.msg("请输入正确格式的手机号");
          return;
        }
        if(this.timerIndex != TIMERSIZE){
          return;
        }
        this.timerIndex--;
        this.timer = setInterval(_=>{
          this.timerIndex--;
        },1000);

        http({
          name:'getPhoneCode',
          url:"/captcha/send/captext?phone="+this.phone,
        }).then(res=>{
          
        }).catch(e=>{
          notice.msg("验证码发送失败");
          this.clearTimer();
        })
        
      },
      // 清除倒计时
      clearTimer(){
        clearInterval(this.timer);
        this.timerIndex = TIMERSIZE;
      },
      
      submit(){
        this.checkSubmit(true);
        if(!this.isOk){
          return;
        }
        const params = {
          captch:this.code,
          phone:this.phone
        }
        this.loading = true;
        http({
					name:'p_xcx_BDMobile',
					data: params
					})
          .then(data => {
             
              store.WTS_USER_XCX = data.data;
              store.token = data.token;
              uni.redirectTo ({
                url: "/pages/policyList/policyList",
              });
          })
          .catch(error => {
              console.log(error);
          });
      }
      
    },
    destroyed() {
      this.clearTimer();
    },
	components: {
		"loading": loading
	}
  }
</script>
<style lang="less" scoped>
  @import "BDmobile.css";
</style>
