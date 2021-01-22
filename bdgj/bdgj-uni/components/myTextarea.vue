<template>
	<div class="top">
		<textarea
			class="myTextarea"
			maxlength="150"
			show-confirm-bar="false"
			v-model="mySubmitVal"
			placeholder="请输入评论内容..."
			id="text"
			@input="getValue"
		></textarea>
		<!-- #ifndef MP-ALIPAY -->
		<div class="number">
			<div :class="{'red':valueNum>150}">{{ valueNum }}</div>
			<div>/{{ totalNum }}字</div>
		</div>
		<!-- #endif -->
	</div>
</template>

<script>
export default {
	data() {
		return {
			mySubmitVal: '',
			valueNum: 0,
			totalNum: 150
		}
	},
	methods: {
		getValue() {
			this.valueNum = this.mySubmitVal.length;
			this.$emit('updatemsg', {
				value: this.mySubmitVal
			});
		}
	}
}

</script>

<style lang="less" scope>
.top {
	width: 100%;
	position: relative;
	.myTextarea {
		width: 100%;
		height:400rpx; 
		box-sizing: border-box;
		border: none;
		font-size: 30rpx; 
		line-height: 40rpx; 
		padding: 20rpx 30rpx;
	}
	#text {
		box-sizing: border-box;
		width: 100%;
		border: none;
		font-size: 30rpx;
		line-height: 40rpx;
		padding: 20rpx 30rpx;
		resize: none;
		vertical-align: middle;
	}
	.number {
		position: absolute;
		right: 30rpx;
		bottom: 20rpx;
		font-size: 28rpx;
		color: #999;
		flex-direction: row;
		display: flex;
		div {
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}
	.red {
		color: red;
	}
}
</style>

