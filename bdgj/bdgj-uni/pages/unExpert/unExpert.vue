<template>
	<div class="unExpert view-container">
		<div class="agent-card">
			<div class="agent-top"></div>
			<div class="card">
				<image :src="expertData.ico" class="card-pic"></image>
				<image :src="imgSrc" class="icon-card"></image>
				<div class="card-content">
					<div class="name break">
						{{ expertData.name }}
						<text class="tag">{{ expertData.sign }}</text>
					</div>
					<div class="content break">{{ expertData.desc }}</div>
				</div>
			</div>
		</div>
		<div class="content-box">
			<text class="content-title">专家介绍</text>
			<div class="content-detail">{{ expertData.content }}</div>
		</div>
	</div>
</template>

<script>
import http from '../../api/http.js';

export default {
	data() {
		return {
			id: '', // 顾问id
			inType: '',
			expertData: '', // 页面数据
			imgSrc: 'https://bx.wts999.com/m/resource/xcxStatic/bdgj/icon-cred-big.png'
		}
	},
	methods: {
		detailAjax() {
			var ajax,
				that = this;
			if (this.inType == '2') {
				ajax = 'Exe_expertsDetail';
			}
			this.$http({
				name: ajax,
				data: {
					id: that.id
				}
			})
			.then(function(res) {
				that.expertData = res.data;
			})
			.catch(function(res) {
				console.log(res);
			});
		}
	},
	onLoad(option) {
		this.id = option.agentId;
		this.inType = option.inType; //详情类型
		this.detailAjax();
	}
}
</script>

<style>
@import './unExpert.css';
</style>
