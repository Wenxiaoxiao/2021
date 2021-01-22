<template>
	<div class="myclaims policyDetail" :style="{ height: totalHeight + 'px' }">
		<div class="view-container box">
			<div class="policyStatus">
				<i class="iconfont" :class="data.settleStatus == 4 ? 'icon-duigouzhuanhuan' : 'icon-shijian'"></i>
				<p class="name">{{ data.selfname }}</p>
				<p class="text">{{ data.selftext }}</p>
			</div>
			<div class="listInfoBox">
				<div v-if="data.policyNo" class="policy-04-list">
					<dl class="dlBox">
						<dd>
							<ul class="ulListBox">
								<!-- 报案号 -->
								<!-- <li>报案号：<span>{{data.reportNo}}</span></li> -->
								<li>
									申请时间：
									<span>{{ data.createTime }}</span>
								</li>
							</ul>
						</dd>
						<dd>
							<ul class="ulListBox">
								<!-- 报案号 -->
								<li>{{ data.insuranceProductName }}</li>
								<li>保单号：{{ data.policyNo }}</li>
								<li>被保险人：{{ data.dangerName }}</li>
								<li>保障额度：{{data.selfguaranteeLimit}}</li>
							</ul>
						</dd>
					</dl>
				</div>
				<div class="policy-04-list">
					<dl class="dlBox">
						<dt class="dlheader"><span class="item-title">出险信息</span></dt>
						<dd>
							<ul class="ulListBox">
								<!-- 报案号 -->
								<li>出险经过描述：{{ data.dangerRemark }}</li>
							</ul>
						</dd>
					</dl>
				</div>
				<div class="policy-04-list" v-if="data.settleResult">
					<dl class="dlBox">
						<dt class="dlheader"><span class="item-title">理赔反馈</span></dt>
						<dd class="break">{{ data.settleResult }}</dd>
					</dl>
				</div>
				<div class="policy-04-list" v-if="!completedOrder && data.dangerType">
					<dl class="dlBox">
						<dt class="dlheader">
							<span class="item-title">
								理赔提示
								<span style="font-size:14px;">（请您保管好下列资料）</span>
							</span>
						</dt>
						<div class="prompt" v-if="claimList[1]">
							<div class="list-form">【医疗】</div>
							<p class="left-yuan">正式收据，门诊/住院费用清单，社保结算单</p>

							<p class="left-yuan">相关检查及检验报告</p>

							<p class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</p>
						</div>
						<div class="prompt" v-if="claimList[2]">
							<div class="list-form">【重疾】</div>
							<p class="left-yuan">（门诊，住院）病例</p>

							<p class="left-yuan">相关检查及检验报告</p>

							<p class="left-yuan">病理组织检验报告（恶性肿瘤理赔），相关检查及检验报告</p>

							<p class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</p>
						</div>
						<div class="prompt" v-if="claimList[3]">
							<div class="list-form">【残疾】</div>
							<p class="left-yuan">（门诊，住院）病例</p>

							<p class="left-yuan">相关检查及检验报告</p>

							<p class="left-yuan">意外事故证明（公安等机构出具的资料）等</p>

							<p class="left-yuan">鉴定报告（如有）等</p>
						</div>
						<div class="prompt" v-if="claimList[4]">
							<div class="list-form">【身故】</div>
							<p class="left-yuan">（门诊，住院）病例</p>

							<p class="left-yuan">相关检查及检验报告</p>

							<p class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</p>

							<p class="left-yuan">鉴定报告（如有）等</p>

							<p class="left-yuan">死亡证明，户口注销证明，殡葬/火化证明</p>
						</div>
						<div class="prompt" v-if="claimList[5]">
							<div class="list-form">【家财损失】</div>
							<p class="left-yuan">公安机关开具的保安证明，金额超过5000需提供立案证明</p>

							<p class="left-yuan">房产证复印件、出险照片、房产原装修合同、发票</p>

							<p class="left-yuan">出险后维修合同、发票</p>

							<p class="left-yuan">家电、家具原购买合同、发票</p>
						</div>
						<div class="prompt" v-if="claimList[6]">
							<div class="list-form">【其他】</div>
							<p class="left-yuan">依照具体赔案情况由保险人要求提供的证明材料</p>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import http from '../../api/http.js';
import notice from '../../api/notice.js';
import filters from '../../api/filter';
export default {
	name: 'indexBox',
	data() {
		return {
			title: '',
			loaded: false, //页面加载完成
			showContact: true, // 底部联系方式组件显示
			nav: 0, //底部导航
			data: {}, //当前数据
			claimList: [0, false, false, false, false, false, false], //理赔资料列表
			completedOrder: false, // 是已完成订单
			totalHeight: -1
		};
	},
	onLoad(option) {
		var vm = this;
		uni.getSystemInfo({
			success: function(info) {
				// #ifdef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight) - uni.upx2px(88);
				// #endif
				// #ifndef APP-PLUS-NVUE
				vm.totalHeight = Number(info.windowHeight);
				// #endif
			}
		});
		notice.showloading('加载中...');
		var id = option.id;
		this.indexList(id);
	},
	methods: {
		policyLimit(data){
			 return filters.policyLimit(data)
		},
		//首页列表请求
		indexList(id) {
			var self = this;
			this.$http({
				name: 'P_claimDetail',
				header: 'application/x-www-form-urlencoded',
				data: {
					id: id
				}
			}).then((r, er) => {

				if (r.data.settleStatus == 4) {
					self.completedOrder = true;
				}
				self.data = self.dataUpdate(r.data);
				notice.hideloading();
			});
		},
		dataUpdate(data) {
			//处理数据
			var dangerType = data.dangerType;
			data.dangerType = dangerType
				.replace('[', '')
				.replace(']', '')
				.replace('1', '医疗')
				.replace('2', '重疾')
				.replace('3', '残疾')
				.replace('4', '身故')
				.replace('5', '家财损失')
				.replace('6', '其他');
			var dangerTypeArr = JSON.parse(dangerType);
			for (var k in dangerTypeArr) {
				this.claimList[dangerTypeArr[k]] = true;
			}
			data.selfname = this.settleStatus(data.settleStatus);
			data.selftext = this.settleStatusDesc(data.settleStatus);
			data.selfguaranteeLimit = this.guaranteeLimit2(data);
			return data;
		},
		settleStatusDesc(value) {
			if (value == 0) {
				return '您的理赔申请正在受理中！';
			} else if (value == 1) {
				return '您的理赔申请正在审核中！';
			} else if (value == 2) {
				return '您的理赔申请已审核通过！';
			} else if (value == 3) {
				return '您的理赔申请正在打款中！';
			} else {
				return '您的理赔申请已完成！';
			}
		},
		//理赔状态
		settleStatus(value) {
			if (value < 4) {
				return '受理中';
			} else {
				return '已完成';
			}
		},
		guaranteeLimit2(content) {
			//根据产品类型判断是否显示保障金额
			var val = '';
			if (!content) return;
			if ((content.typeCode && content.typeCode.indexOf('0202') > -1) || (content.insuranceProductName && content.insuranceProductName.indexOf('重疾') > -1)) {
				val = content.policy.guaranteeLimit + '元';
			} else {
				val = '详见保障权益';
			}
			return val;
		}
	}
};
</script>

<style lang="less">
@import './claimDetail.css';
.myclaims {
	background: #f5f5f5;
	position: relative;
}
</style>
