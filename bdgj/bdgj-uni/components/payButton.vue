<template>
	<div>
		<form report-submit="true" @submit="payAjax"><button form-type="submit" class="pay-button">立即支付</button></form>
	</div>
</template>

<script>
import myApi from '../api/utils.js';
import tools from '../api/tools.js';
import http from '../api/http.js';

export default {
	props: {
		tradeNo: String
	};
	data() {
		return {
			loading: false
		}
	};
	methods: {
		payAjax(event) {
			console.log(this.tradeNo);
			console.log('form', event);
			tools.getAppUserinfo().then(data => {
				const params = {
					tradeNo: this.tradeNo,
					openid: data.openid,
					orderType: 'fsServer'
				};
				if (this.loading) {
					return;
				}
				this.loading = true;
				myApi.showLoading();
				console.log(params);
				this.$http({
					url: '/pay/wechat/minijsapi',
					contentType: 'form',
					data: params
				})
					.then(res => {
						myApi.hideLoading();
						this.loading = false;
						console.log(res);
						res.data.success = res => {
							this.$emit('ok');
							// 发送模板消息
							this.sendMsg(event);
						};
						res.data.fail = res => {
							console.log('支付已取消', res);
						};
						console.log(res.data);
						wx.requestPayment(res.data);
					})
					.catch(e => {
						myApi.hideLoading();
						this.loading = false;
					});
			});
		},
		sendMsg(event) {
			if (event.detail.formId && event.detail.formId.indexOf(' ') < 0) {
				this.sendMsg(event.detail.formId);
			}
			this.$http({
				name: 'login.wxminiSendMessage',
				data: {
					formId: event.detail.formId,
					orderId: this.tradeNo
				}
			})
				.then(res => {
					console.log('模板消息发送成功!', res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	};
}

</script>

<style scoped="scoped">
	.pay-button {
		width: 100%;
		height: 100%;
		color: inherit;
		border: 0;
		justify-content: center;
		align-items: center;
		background: transparent;
		&:after{
			display: none;
		}
	}
</style>
