<template>
	<view class="send-chat" :style="[inputBottom,inputBottomObj]">
		<input :focus="isfocus" :adjust-position="flag" type="text" placeholder="说点什么吧~" @focus="focusEvent" @blur="blurEvent" @input="adInputChange"
		 :value="msg" />
		<block v-if="!userInfos.nick">
			<!-- #ifdef MP-ALIPAY -->
			<button open-type="getAuthorize" @getAuthorize="aliAuthUser" scope="userInfo">发送</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxAuthUser">发送</button>
			<!-- #endif -->
		</block>
		<block v-else>
			<button @click="sendMessageEvent">发送</button>
		</block>
	</view>
</template>
<script>
	export default {
		props: {
			chatPlaceholder: String
		},
		data() {
			return {
				flag: false,
				msg: "",
				inputBottom: {
					"bottom": "0px"
				},
				inputBottomObj: {},
				userInfos: {},
				isfocus:false,
			};
		},
		methods: {
			adInputChange(e) {
				this.msg = e.target.value;
			},
			focusEvent(e) {
				var num = e.detail.height;
				if(num>this.$parent.bottomNum){
					this.$parent.bottomNum = num;
				}else{
					num = this.$parent.bottomNum;
				}
				num+="px";
				console.log("num++++"+num);
				this.inputBottom = {
					"bottom": num
				};
			},
			blurEvent(e) {
				this.inputBottom = {
					"bottom": "0px"
				};
			},
			sendMessageEvent() {
				this.$parent.sendMessageEvent(this.msg);
				this.msg = "";
			},
			aliAuthUser(e) {
				console.log(e);
			},
			wxAuthUser(e) {
				if (!this.userInfos.nick) {
					this.$http({
						name: "miniRegister",
						intercept:true,
						data: {
							name: e.detail.userInfo.nickName,
							ico:e.detail.userInfo.avatarUrl
						}
					}).then((res)=> {
						var obj = Object.assign(this.userInfos, res.data);
						this.$parent.userInfo = obj;
						this.userInfos = obj;
						uni.setStorageSync("loginInfo",obj);
						console.log(this.$parent.userInfo);
						this.$parent.sendMessageEvent(this.msg);
						this.msg = "";
					});
					
				}else{
					this.$parent.sendMessageEvent(this.msg);
					this.msg = "";
				}
				
			}
		},
		mounted() {
			this.isfocus = this.$parent.showSendMessageBtn;
			console.log(this.isfocus);
			uni.getStorage({
				key: 'loginInfo',
				success: (res) => {
					this.userInfos = res.data;
				}
			});
		},
		destroyed() {
			this.msg = "";
		}
	};
</script>

<style lang="scss" scoped>
	view,
	image {
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
	}

	.send-chat {
		position: fixed;
		padding: 16rpx 30rpx 16rpx;
		height: 100rpx;
		background: #fff;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		bottom: 0;
		border-top: 1rpx solid #e5e5e5;

		input {
			padding-left: 30rpx;
			flex: 1;
			height: 72rpx;
			border: none;
			background: #f9f9f9;
			border-radius: 36rpx;
			color: #333;
		}

		button {
			width: 130rpx;
			height: 72rpx;
			background-color: #fff;
			border-radius: 8rpx;
			font-family: SourceHanSansCN-Regular;
			font-size: 34rpx;
			line-height: 72rpx;
			text-align: center;
			color: #08bb07;

			&::after {
				border: none;
			}
		}
	}
</style>
