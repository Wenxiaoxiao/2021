<template>
	<div title="评价商品">
		<div class="all-container">
			<div class="body-container market-comment">
				<my-textarea @updatemsg="getContent"></my-textarea>
				<div class="middle">
					星级评价：
					<div class="xxs">
						<div @click.stop="changelevel(1)" class="xx" :class="{'active': level>0}"></div>
						<div @click.stop="changelevel(2)" class="xx" :class="{'active': level>1}"></div>
						<div @click.stop="changelevel(3)" class="xx" :class="{'active': level>2}"></div>
						<div @click.stop="changelevel(4)" class="xx" :class="{'active': level>3}"></div>
						<div @click.stop="changelevel(5)" class="xx" :class="{'active': level>4}"></div>
					</div>
				</div>
				<div id="send" @click.stop="submit()">提交评价</div>
			</div>
		</div>
	</div>
</template>

<script>
import tools from '../../api/tools.js';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
import util from '../../api/utils.js';
import myTextarea from '../../components/myTextarea.vue';

export default {
	data() {
		return {
			policyNo: '',
			productId: '',
			productName: '',
			submitVal: '',
			level: 5
		}
		
	},
	methods: {
		getContent(res) {
			this.submitVal = res.value;
		},
		//选择评论等级
		changelevel(num) {
			this.level = num;
		},
		submit() {
			console.log(this.submitVal);
			if (!tools.trim(this.submitVal)) return notice.msg('请输入评论内容');
			if (this.submitVal.length > 150) return notice.msg('评论内容仅支持150字以内');
			var params = {
				policyNo: this.policyNo, //保单号
				insuranceProductId: this.productId, //产品ID
				insuranceProductName: this.productName, //产品名称
				starLevel: this.level, //评论星级
				comment: this.submitVal //评论内容
			};

			this.$http({
				name: 'P_addComment',
				data: params
			})
				.then(function(data, e) {
					store.hasComMit = true;
					notice.msg('提交评论成功！3秒后返回上一页', 3000, 'none');
					setTimeout(() => {
						uni.navigateBack();
					}, 3000);
				})
				.catch(error => {
					notice.hideloading();
					console.log(error);
				});
		}
	},
	onLoad(option) {
		this.policyNo = option.policyNo;
		this.productId = option.productId;
		this.productName = option.productName;
		util.hideShareMenu();
	},
	components: {
		'my-textarea': myTextarea
	}
}
</script>
<style lang="less" scoped>
@import './sendcomment.css';
</style>
