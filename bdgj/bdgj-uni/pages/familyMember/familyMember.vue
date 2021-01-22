<template>
	<div class="policyShare view-container">
		<div class="share-list">
			<div class="list-line clearfix">
				<image mode="widthFix" class="fl images" :src="user.headimgurl?user.headimgurl:'https://bx.wts999.com/m/resource/xcxStatic/person-center-03.jpg'"></image>
				<div class="name fl">{{ user.nickname }}</div>
			</div>
		</div>
		<div class="share-list">
			<div v-for="(val,i) in shareUser" class="list-line clearfix">
				<image
					mode="widthFix"
					class="iconfont icon-lajitong"
					src="https://bx.wts999.com/m/resource/xcxStatic/lajitong.png"
					@click.stop="removeUserShare(val.nickname,val.id,i)"
				></image>
				<image mode="widthFix" :src="val.headimgurl?val.headimgurl:'https://bx.wts999.com/m/resource/xcxStatic/person-center-03.jpg'" class="fl images" alt></image>
				<div class="name fl">{{ val.nickname }}</div>
			</div>
		</div>
	</div>
</template>

<script>
// import _ from 'lodash';
import tools from '../../api/tools.js';
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
var vm = null;
export default {
	data() {
		return {
			shareUser: [],
			user: {}
		}
	},
	methods: {
		/**查询被邀请用户 */
		shareUserQuery() {
			http({
				name: 'P_policyIsSared',
				data: {}
			})
				.then(function(data, e) {
					vm.shareUser = data.data;
				})
				.catch(error => {
					console.log(error);
				});
		},
		/** 删除被邀请用户 */
		removeUserShare(name, id, i) {
			notice.confirm('确认要删除 (' + name + ') 吗？', (btn = ['删除', '我再想想']))
				.then(function(value) {
					http({
						name: 'P_removePolicyShare',
						data: {
							accepterId: id
						}
					})
						.then(function(data, e) {
							vm.shareUser.splice(i, 1);
						})
						.catch(error => {
							console.log(error);
						});
				})
				.catch(error => {
					console.log(error);
				});
		}
	},
	created() {
		vm = this;
		this.user = store.WTS_USER_XCX;
	},
	mounted() {
		this.shareUserQuery();
	}
}
</script>
<style lang="less" scoped>
	@import './familyMember.css';
</style>
