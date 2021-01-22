<script>
	import store from './store/state';
	import tools from './api/tools';
	export default {
		onLaunch: function() {
			
			// #ifdef MP-WEIXIN
			store.channel = "xcx_wx";
			store.version = store.versions[0];
			// #endif

			// #ifdef MP-ALIPAY
			store.channel = "xcx_alipay";
			store.version = store.versions[1];
			// #endif
			
		},
		onShow: function() {
			tools.getRecentVersion();
			console.log(store.env)
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './common/common.css';

	page,
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;

	}

	page {
		display: flex;
		min-height: 100%;
		background-color: #EFEFEF;
		box-sizing: border-box;
		flex-direction: column;
		width: 100%;

	}
	image{will-change: transform}

	template {
		display: flex;
		flex: 1;
		box-sizing: border-box;
		flex-direction: column;

	}
</style>
