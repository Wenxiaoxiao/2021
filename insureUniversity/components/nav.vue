<template>
	<div class="nav">
		<div class="nav-item" @click="skip(index.url)">
			<div class="nav_img"><image mode="widthFix" :src="index.img" class="img"></image></div>
			<div class="nav_title" :class="{active:index.active}">{{ index.title }}</div>
		</div>
		<!-- #ifdef MP-WEIXIN -->
		<div class="nav-item" @click="skip(live.url)">
			<div class="nav_img"><image mode="widthFix" :src="live.img" class="img"></image></div>
			<div class="nav_title" :class="{active:live.active}">{{ live.title }}</div>
		</div>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<div class="nav-item" @click="skip(myplan.url)">
			<div class="nav_img"><image mode="widthFix" :src="myplan.img" class="img"></image></div>
			<div class="nav_title" :class="{active:myplan.active}">{{ myplan.title }}</div>
		</div>
		<div class="nav-item" @click="skip(encyclopedia.url)">
			<div class="nav_img"><image mode="widthFix" :src="encyclopedia.img" class="img"></image></div>
			<div class="nav_title" :class="{active:encyclopedia.active}">{{ encyclopedia.title }}</div>
		</div>
		<!-- #endif -->
		<div class="nav-item" @click="skip(learn.url)">
			<div class="nav_img"><image mode="widthFix" :src="learn.img" class="img"></image></div>
			<div class="nav_title" :class="{active:learn.active}">{{ learn.title }}</div>
		</div>
		<div class="nav-item" @click="skip(gaurd.url)">
			<div class="nav_img"><image mode="widthFix" :src="gaurd.img" class="img"></image></div>
			<div class="nav_title" :class="{active:gaurd.active}">{{ gaurd.title }}</div>
		</div>
	</div>
</template>
<script>
// import notice from '../api/notice.js';
// import http from '../api/http.js';
// import store from '../store/state';
// import filter from '../api/filter';
// import tools from '../api/tools';
export default {
	props: {
		navbar: {
			type: String,
			default: 'index'
		},
		gaurdurl: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			index: {
				img: require('../assets/images/index/unnav1.png'),
				url: '/pages/index/index',
				title: '首页',
				active: false
			},
			live: {
				img: require('../assets/images/index/unnav2.png'),
				url: '/pages/live/live',
				title: '直播课堂',
				active: false
			},
			myplan: {
				img:  require('../assets/images/index/unnav5.png'),
				url: '/pages/myplan/myplan',
				title: '方案设计',
				active: false
			},
			encyclopedia: {
				img:  require('../assets/images/index/unnav6.png'),
				url: '/pages/encyclopedia/encyclopedia',
				title: '保险百科',
				active: false
			},
			learn: {
				img:  require('../assets/images/index/unnav3.png'),
				url: '/pages/learn/learn',
				title: '课程学习',
				active: false
			},
			gaurd: {
				img: require('../assets/images/index/unnav4.png'),
				url: '/pages/gaurd/gaurd',
				title: '守护平凡',
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
	beforeCreate() {
	},
	created() {
		if (this.navbar == 'index') {
			this.index.img = require('../assets/images/index/nav1.png');
			this.index.active = true;
		}

		if (this.navbar == 'live') {
			this.live.img = require('../assets/images/index/nav2.png');
			this.live.active = true;
		}

		if (this.navbar == 'myplan') {
			this.myplan.img = require('../assets/images/index/nav5.png');
			this.myplan.active = true;
		}

		if (this.navbar == 'encyclopedia') {
			this.encyclopedia.img = require('../assets/images/index/nav6.png');
			this.encyclopedia.active = true;
		}

		if (this.navbar == 'learn') {
			this.learn.img = require('../assets/images/index/nav3.png');
			this.learn.active = true;
		}

		if (this.navbar == 'gaurd') {
			this.gaurd.img = require('../assets/images/index/nav4.png');
			this.gaurd.active = true;
		}
	}
}
</script>

<style lang="less">
.nav {
	position: fixed;
	bottom: 0;
	display: flex;
	width: 100%;
	height: 120rpx;
	// border-top: 1px solid #ddd;
	flex-direction: row;
	// background: #fff;
	background:#0092FF;
	box-sizing: border-box;
	justify-content: space-around;
	.nav-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		min-width: 96rpx;
	}
	.nav_img {
		margin-top: 8rpx;
		height: 50rpx;
	}
	.nav_img{
		.img{
			width: 50rpx;
			height: 50rpx;
		}
	}
	.nav_title {
		margin-top: 7rpx;
		font-size: 28rpx;
		// color: #999;
		color:#fff;
		opacity: 0.7;
		&.active {
			color: #fff;
			opacity: 1;
			font-weight: bold;
		}
	}
}
</style>
