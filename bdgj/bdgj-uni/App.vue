<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onReady:function(){
			console.log('App onReady')
			uni.getSystemInfo({
				success:function (res) {
					console.log(res.model);
					console.log(res.pixelRatio);
					console.log(res.windowWidth);
					console.log(res.windowHeight);
					console.log(res.language);
					console.log(res.version);
					console.log(res.platform);
					getApp().globalData.systemInfo={
						platform: res.platform
					};
				}
			});
		},
		globalData: {  
			QUES_ILLS: Array,
			SURE_QUES_ILLS:Array,
			systemInfo:Object
        }
	}
</script>

<style>
	@import "./iconfont/iconfont.css";
	my-nav{
/* 		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		height: 100rpx;
		overflow: hidden; */
	}
</style>
