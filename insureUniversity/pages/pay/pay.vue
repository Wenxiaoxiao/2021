<template>
	<div class="mypay">
		<button class="mini-btn" type="warn" size="mini" @click="createPay">支付0.01元</button>
	</div>
</template>

<script>
	
	export default {
		data() {
			return {
				planData: [],
				mainHeight: 0 // 窗口高度
			}
		},
		onLoad() {
		
		},
		created() {
			
		},
		methods: {
            getParams(str,name){
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = str.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
			//支付
			createPay(){
                let loginInfo = uni.getStorageSync("loginInfo");
                let that = this;
                that.$http({
                    name: 'index_wxpay',
                    data:{
                        openid:loginInfo.openid
                    }
				})
				.then(function(res) {
                    let strlist = '?'+res.data;
                    wx.requestPayment({
                        timeStamp:that.getParams(strlist,'timeStamp'),
                        nonceStr:that.getParams(strlist,'nonceStr'),
                        package:that.getParams(strlist,'package'),
                        signType:that.getParams(strlist,'signType'),
                        paySign:that.getParams(strlist,'paySign'),
                        success (res) {
                            console.log("支付成功！");
                        },
                        fail (res) {
                            console.log("支付失败！");
                        }
                    })
                })
			},
		},
		components: {
			
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
.mypay{
    min-height:100vh;
    position:relative;
    .mini-btn{
        margin: 10rpx auto;
        display: block;
        width: 200rpx;
        position:absolute;
        left:50%;
        top:50%;
        transform: translateX(-50%) translateY(-50%);
    }
}
</style>
