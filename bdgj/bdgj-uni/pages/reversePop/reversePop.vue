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

  import http from '../../api/http.js';
  import tools from '../../api/tools.js';
  import notice from '../../api/notice.js';

export default   {

  props: {
    isLayerHide: Boolean,
    agentId: String
  },
  data() {
	return {
	  imgSrc: "https://bx.wts999.com/m/resource/xcxStatic/bdgj/tan_bg.png",
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
        that.$emit("hidePop");
        that.isTagshow= true;
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

<style>
  @import './reversePop.css';
</style>

