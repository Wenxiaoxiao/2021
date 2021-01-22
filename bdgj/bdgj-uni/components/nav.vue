<template>
	<div class="nav">
		<div class="nav-item" @click="skip(policyList.url)">
			<div class="nav_img"><image mode="widthFix" :src="policyList.img"></image></div>
			<div class="nav_title" :class="{active:policyList.active}">{{ policyList.title }}</div>
		</div>
		<div class="nav-item" @click="skip(service.url)">
			<div class="nav_img"><image mode="widthFix" :src="service.img"></image></div>
			<div class="nav_title" :class="{active:service.active}">{{ service.title }}</div>
		</div>
		<div class="nav-item" @click="skip(analysis.url)">
			<div class="nav_img"><image mode="widthFix" :src="analysis.img"></image></div>
			<div class="nav_title" :class="{active:analysis.active}">{{ analysis.title }}</div>
		</div>
		<div class="nav-item" @click="skip(progress.url)">
			<div class="nav_img"><image mode="widthFix" :src="progress.img"></image></div>
			<div class="nav_title" :class="{active:progress.active}">{{ progress.title }}</div>
		</div>
	</div>
</template>
<script>
import notice from '../api/notice.js';
import http from '../api/http.js';
import store from '../store/state';
import filter from '../api/filter';
import tools from '../api/tools';
export default {
	props: {
		navbar: {
			type: String,
			default: 'policyList'
		}
	},
	data() {
		return {
			policyList: {
				img: 'https://bx.wts999.com/m/resource/xcxStatic/policys/policy1.png',
				url: '/pages/policyList/policyList',
				title: '保单管理',
				active: false
			},
			service: {
				img: 'https://bx.wts999.com/m/resource/xcxStatic/nav/service1.png',
				url: '/pages/minePolicy/minePolicy',
				title: '保单服务',
				active: false
			},
			analysis: {
				img: 'https://bx.wts999.com/m/resource/xcxStatic/nav/analysis1.png',
				url: '/pages/insureAnalysis/insureAnalysis',
				title: '保障分析',
				active: false
			},
			progress: {
				img: 'https://bx.wts999.com/m/resource/xcxStatic/nav/progress1.png',
				url: '/pages/claimProgress/claimProgress',
				title: '理赔管理',
				active: false
			}
		}
	},
	methods: {
		skip(url) {
			uni.redirectTo({
				url: url
			});
		}
	},
	created() {
		if (this.navbar == 'policyList') {
			this.policyList.img = 'https://bx.wts999.com/m/resource/xcxStatic/policys/policy2.png';
			this.policyList.active = true;
		}

		if (this.navbar == 'service') {
			this.service.img = 'https://bx.wts999.com/m/resource/xcxStatic/nav/service2.png';
			this.service.active = true;
		}

		if (this.navbar == 'analysis') {
			this.analysis.img = 'https://bx.wts999.com/m/resource/xcxStatic/nav/analysis2.png';
			this.analysis.active = true;
		}

		if (this.navbar == 'progress') {
			this.progress.img = 'https://bx.wts999.com/m/resource/xcxStatic/nav/progress2.png';
			this.progress.active = true;
		}
	}
}
</script>

<style lang="less">
.nav {
	// position: absolute;
	width: 100%;
	// left: 0;
	// bottom: 0;
	display: flex;
	height: 100rpx;
	overflow: hidden;
	border-top: 1px solid #ddd;
	flex-direction: row;
	background: #fff;
	box-sizing: border-box;
	.nav-item {
		display: flex;
		width: 25%;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
	.nav_img {
		height: 36rpx;
	}
	.nav_img image {
		width: 36rpx;
		height: 36rpx;
	}
	.nav_title {
		margin-top: 7rpx;
		font-size: 24rpx;
		color: #575757;
		&.active {
			color: #00a2ff;
		}
	}
}
</style>
