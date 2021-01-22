<template>
	<div class="poilcy_mask" v-if="loadingMask" :style="{ height: totalHeight + 'rpx' }"></div>
</template>
<script>
export default {
    props = {
        loadingMask: {
            type: Boolean,
            default: false
        },
        totalHeight: {
            type: Number,
            default: -1
        }
    }
}
</script>

<style lang="less" scoped="scoped">
.poilcy_mask {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	position: fixed;
	background: #fff;
}
</style>
