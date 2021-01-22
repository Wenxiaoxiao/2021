<template>
	<div class="page-body"><web-view :src="url"></web-view></div>
</template>

<script>
import store from '../store/state';
export default {
	data() {
		return {
			url: ''
		}
	},
	onLoad(option) {
		console.log(decodeURIComponent(option.url));
		this.url = option.url ? decodeURIComponent(option.url) : store.PDFUrl;
	}
}
</script>
<style></style>
