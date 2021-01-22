<template>
	<div>
		<!--主体部分-->
		<div class="w-body policyMyDetail policyDetail" v-show="policyDate.statusTitle" :class="{ bottom0: ishare || policyDate.status == 0 }">
			<div class="view-container">
				<div class="policyStatus">
					<div class="iconfont"><image v-if="policyDate.statusIcon" :src="policyDate.statusIcon" class="icon-status"></image></div>
					<div class="name">{{ policyDate.statusTitle }}</div>
					<div class="text">{{ policyDate.statusDesc }}</div>
				</div>
				<div class="listInfoBox">
					<div class="policy-04-list">
						<div class="dlBox">
							<div class="dlheader"><text class="item-title">保障详情</text></div>
							<div class="dd">
								<div class="ulListBox">
									<!-- 保单号 -->
									<div v-if="policyDate.policyNo && policyDate.policyNo.length > 5">
										保单号：
										<text>{{ policyDate.policyNo }}</text>
									</div>
									<!-- 产品名称 -->
									<div v-if="policyDate.policyName">
										产品名称：
										<text class="policyName">{{ policyDate.policyName }}</text>
									</div>
									<!-- 保障额度 -->
									<div v-if="policyDate.guaranteeQuota && policyDate.guaranteeQuota != 0 && policyDate.guaranteeQuota != '0.00' && policyDate.isPlat == 1">
										保障额度：
										<text class="total">{{ policyDate.policyLimit }}</text>
									</div>
									<div>
										缴费期限：
										<text class="total">{{ policyDate.paymentMyType }}</text>
									</div>
									<block v-if="policyDate.status != '-2' && policyDate.status != '-3'"></block>
									<div v-if="policyDate.guaranteeStartTime && policyDate.guaranteeEndTime">
										保障期限：
										<text class="timer">{{ policyDate.guaranteeStartTime }}至{{ policyDate.guarateeType == 1 ? '终身' : policyDate.guaranteeEndTime }}</text>
									</div>
								</div>
								<image
									mode="widthFix"
									v-if="policyDate.companyLogo && policyDate.companyLogo.length > 0"
									:src="policyDate.companyLogo[0].url"
									class="img-compangs"
								></image>
							</div>
						</div>
					</div>
					<div class="policy-04-list">
						<div class="dlBox">
							<div class="dlheader">
								<!-- 投保人信息 -->
								<text class="item-title">投保人信息</text>
							</div>
							<div class="dd">
								<div class="ulListBox ">
									<!-- 投保人姓名 -->
									<div v-if="policyDate.holderName">
										{{ policyDate.isGiftProduct ? '机构名称' : '投保人姓名' }} ：
										<text class="IDInfo">{{ policyDate.holderName }}</text>
									</div>
									<!-- 证件类型 -->
									<div v-if="policyDate.holderCardType && !policyDate.isGiftProduct">
										证件类型：
										<text class="IDType">{{ policyDate.holderCardType }}</text>
									</div>
									<!-- 证件号码 -->
									<div v-if="policyDate.holderIdcard1 && !policyDate.isGiftProduct">
										证件号码：
										<text class="IDNumber">{{ policyDate.holderIdcard1 }}</text>
									</div>
									<!-- <div v-if="policyDate.holderMobile1">
										手机号码：
										<text class="cellPhone">{{ policyDate.holderMobile1 }}</text>
									</div> -->
									<div v-if="policyDate.holderEmail">
										电子邮箱：
										<text class="Email">{{ policyDate.holderEmail }}</text>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- 被保险人信息 -->
					<div class=" policy-04-list" id="insures">
						<block v-if="insureder && insureder.length == 1">
							<!-- 单被保险人 -->
							<div class="dlBox dlBoxDown2">
								<div class="dlheader"><text class="item-title">被保险人信息</text></div>
								<div class="dd">
									<div class="ulListBox">
										<!-- 与投保人关系 -->
										<div v-if="!policyDate.isGiftProduct">
											与投保人关系：
											<text class="IDInfo">{{ insureder[0].insuranceRelationship }}</text>
										</div>
										<block v-if="insureder[0].relationship != 1">
											<!-- 被保险人姓名 -->
											<div>
												被保险人姓名：
												<text class="customerName">{{ insureder[0].insurederName }}</text>
											</div>
											<!-- 证件类型 -->
											<div>
												证件类型:
												<text class="IDType">{{ insureder[0].insurederCardType }}</text>
											</div>
											<!-- 证件号码 -->
											<div v-if="insureder[0].insurederIdcard1">
												证件号码：
												<text class="IDNumber">{{ insureder[0].insurederIdcard1 }}</text>
											</div>
											<!-- 电子邮箱 -->
											<div v-if="insureder[0].insurederEmail">
												电子邮箱：
												<text class="Email">{{ insureder[0].insurederEmail }}</text>
											</div>
											<!-- 手机号码 -->
											<div v-if="insureder[0].insurederMobile2 && insureder[0].insurederMobile2 != '111****1111'">
												手机号码：
												<text>{{ insureder[0].insurederMobile2 }}</text>
											</div>
										</block>

										<div v-if="insureder[0].BusinessSite">
											车牌号：
											<text>{{ insureder[0].BusinessSite }}</text>
										</div>
									</div>
								</div>
							</div>
						</block>

						<!-- 多被保险人 -->
						<block v-else-if="insureder.length > 1">
							<div class="dlBox dlBoxDown2">
								<div class="dlheader">
									<text class="item-title">被保险人信息（共{{ insureder.length }}人）</text>
								</div>
								<div v-for="(item, index) in insureder" class="dd">
									<div class="insurederNum">
										<text class="spans">{{ PrefixInteger(index + 1, 3) }}</text>
									</div>
									<div class="ulListBox ">
										<div v-if="item.relationship">
											与投保人关系：
											<text class="IDInfo">{{ item.insuranceRelationship }}</text>
										</div>
										<div>
											被保险人姓名：
											<text class="customerName">{{ item.insurederName }}</text>
										</div>
										<div v-if="item.insurederCardType">
											证件类型:
											<text class="IDType">{{ item.insurederCardType }}</text>
										</div>
										<div v-if="item.insurederIdcard1">
											证件号码：
											<text class="IDNumber">{{ item.insurederIdcard1 }}</text>
										</div>
									</div>
								</div>
							</div>
						</block>
					</div>
					<!-- 收益人信息 -->
					<div class=" policy-04-list" id="beneficiarys">
						<block v-if="beneficiaryType == 1">
							<div class="dlBox dlBoxDown3">
								<div class="dlheader"><text class="item-title">受益人信息</text></div>

								<div class="dd">
									<div class="ulListBox ">
										<div>
											受益人：
											<text class="IDInfo">法定受益人</text>
										</div>
									</div>
								</div>
							</div>
						</block>

						<block v-if="beneficiaryType == 2">
							<div class="dlBox dlBoxDown3">
								<div class="dlheader">
									<text class="item-title">受益人信息（共{{ beneficiary.length }}人）</text>
								</div>
								<div v-for="(item, index) in beneficiary" class="dd" style="padding-top: 18px;">
									<div class="insurederNum">
										<text class="spans">{{ PrefixInteger(index + 1, 3) }}</text>
									</div>
									<div class="ulListBox ">
										<div>
											受益人：
											<text class="IDInfo">指定受益人</text>
										</div>
										<div>
											受益人姓名：
											<text class="IDInfo">{{ item.beneficiaryName }}</text>
										</div>
										<div>
											与被保险人关系：
											<text class="IDInfo">{{ item.insuranceRelationship }}</text>
										</div>
										<div>
											受益比例：
											<text class="IDInfo">{{ item.beneficiaryScale }}%</text>
										</div>
										<div>
											证件号码：
											<text class="IDInfo">{{ item.beneficiaryIdcard1 }}</text>
										</div>
									</div>
								</div>
							</div>
						</block>
					</div>
					<!-- 加保信息 -->
					<div class="policy-04-list" id="addpolicyinfos" v-if="addPolicyGuaratees && addPolicyGuaratees.length > 0">
						<dl class="dlBox dlBoxDown3">
							<dt class="dlheader"><span class="item-title">加保信息</span></dt>
							<dd>
								<ul class="ulListBox dd" v-for="(item, i) in addPolicyGuaratees" >
									<li>
										加保时间：
										<span class="IDInfo">{{ item.addpolicyTime }}</span>
									</li>
									<li>
										保障额度：
										<span class="IDInfo">{{ item.premiseAttribute }}</span>
									</li>
								</ul>
							</dd>
						</dl>
					</div>
					<!-- 附加险 -->
					<div v-if="additionalList && additionalList.length > 0" class="policy-04-list" id="additionalList">
						<div class="dlBox dlBoxDown3">
							<div class="dlheader"><text class="item-title">可选责任信息</text></div>
							<div class="dd">
								<div class="ulListBox">
									<div v-for="(item, index) in additionalList">
										{{ item.attr }}：
										<text class="IDInfo">{{ item.amount }}</text>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="policyComment" class=" policy-04-list market-comment">
						<div class="dlBox dlBoxDown3 commentList">
							<div class="dlheader">
								<text class="item-title margin-right-10">我的评论</text>
								<div></div>
							</div>
							<div class="break" style="line-height:1.2;padding:8px 15px;color:#666;">{{ policyComment.comment }}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom-btns" id="btnId" v-if="!ishare && policyDate.status != -1 && policyDate.status != -2">
				<div class="btn wts-btn-free" :class="[bdStatus, isPdfUrl]" @click.stop="checkPDF(policyDate)">电子保单</div>
				<div class="btn wts-btn-free" :class="{ 'btn-disable': !interestHide }" @click.stop="policyRight()">保障权益</div>
				<div class="btn wts-btn-free" :class="{ 'btn-disable': policyDate.status != 1 }" @click.stop="makingCall()">申请退保</div>
				<div v-show="showAccountVal" @click.stop="toAccountVal" class="btn wts-btn-free">账户价值</div>
				<!--<div class="btn wts-btn-free {{policyDate.isResearched==0 || policyDate.isResearched == 2?'':'btn-disable'}}" @click.stop="backOnline()">在线回访</div>-->
			</div>
		</div>
	</div>
</template>

<script>
import notice from '../../api/notice.js';
import http from '../../api/http.js';
import store from '../../store/state';
import filter from '../../api/filter';
import tools from '../../api/tools';
import util from '../../api/utils.js';

var vm;
export default {
	data() {
		return {
			//加保信息
			addPolicyGuaratees: null,
			beneficiaryType: '', //判断受益人类型 1：法定受益人  2：指定受益人
			//保单数据
			policyDate: {},
			//产品评论
			policyComment: null,
			//保单号
			policyNo: '',
			//被保险人
			insureder: [],
			// 受益人
			beneficiary: null,
			// 附加险
			additionalList: null,
			// 账户价值
			policyValue: null,
			//模板数据
			startPolicyJson: null,
			// 流程
			productProcess: null,
			//支付信息
			payDatas: null,
			//保障权益显示开关
			interestHide: false,
			ishare: false,
			//系统信息
			os: '',
			showAccountVal: false // 账户价值
		};
	},
	computed: {
		bdStatus() {
			return this.policyDate.status == 1 ? '' : 'btn-disable';
		},

		isPdfUrl() {
			// if (this.policyDate.isPlat == 0) {
			// 	return this.policyDate.bdUrl ? '' : 'btn-disable';
			// }
			return '';
		}
	},
	beforeCreate() {
		util.hideShareMenu();
	},
	methods: {
		PrefixInteger(num, length) {
			return (Array(length).join('0') + num).slice(-length);
		},
		//查看电子保单
		checkPDF(item) {
			// if (item.status != 1) {
			// 	return;
			// }
			// if (item.isPlat == 0) {
			// 	//#ifdef MP-WEIXIN
			// 	item.bdUrl && vm.showPdf(item.bdUrl);
			// 	//#endif
			// 	//#ifdef MP-ALIPAY
			// 	if(item.bdUrl)
			// 	{
			// 	    store.PDFUrl = item.bdUrl;
			// 	    uni.navigateTo({
			// 	        url: "/pages/webView"
			// 	    });
			// 	}
			// 	//#endif
			// }
			notice.showloading('加载中');
			this.$http({
				name: 'P_verifyBdurlExist',
				data: { policyNo: item.policyNo }
			})
				.then(data => {
					notice.hideloading();
					var url = store.domain[store.dev] + '/tools/bdurl/api/downloadPolicy?policyNo=' + item.policyNo + '&WTS_TOKEN_A=' + store.token;
					store.PDFUrl = url;
					// vm.showPdf(url, item);
					if (store.platform == 'ios') {
						uni.navigateTo({
							url: '/pages/webView'
						});
					} else {
						vm.showPdf(url, item);
					}
				})
				.catch(err => {
					notice.hideloading();
				});
		},

		//显示电子保单
		showPdf(url, item) {
			notice.showloading('加载中');
			tools.downloadFile(url).then(path => {
				vm.policyDate.PdfPath = path;
				console.log(path);
				tools
					.openDocument(vm.policyDate.PdfPath)
					.then(res => {
						notice.hideloading();
					})
					.catch(err => {
						notice.hideloading();
						console.log(err);
					});
			});
		},
		//保障权益
		policyRight() {
			if (!this.interestHide) {
				return;
			}
			uni.navigateTo({
				url: '/pages/protectRight/protectRight?id=' + this.policyDate.policyNo + '&policy=' + this.policyDate.policy + '&isPlat=' + this.policyDate.isPlat
			});
		},
		policyDetail() {
			const that = this;
			this.$http({
				name: 'P_wtPolicyDetail',
				header: 'application/x-www-form-urlencoded',
				data: {
					pid: this.pid
				}
			})
				.then(function(data, e) {
					notice.hideloading();
					if (!vm.ishare && data.data.policysDetail.bdUrl) {
					}
					// 保单信息
					//订单数据处理
					//受益人类型判断  1：法定受益人  2：指定受益人
					that.beneficiaryType = data.data.policysDetail.beneficiaryType;
					//data.data.policysDetail.statusIcon = filter.statusIcon(data.data.policysDetail.status);
					data.data.policysDetail.statusIcon = filter.newStatusIcon(data.data.policysDetail.status);
					data.data.policysDetail.statusTitle = filter.policyMyStatus(data.data.policysDetail.status);
					data.data.policysDetail.statusDesc = filter.policyMyStatusDesc(data.data.policysDetail.status);
					data.data.policysDetail.policyLimit = filter.policyLimit(data.data.policysDetail);
					data.data.policysDetail.paymentMyType = filter.paymentMyType(data.data.policysDetail);
					if (data.data.policysDetail.guaranteeStartTime && data.data.policysDetail.guaranteeEndTime) {
						data.data.policysDetail.guaranteeStartTime = filter.timeNum(data.data.policysDetail.guaranteeStartTime, 10);
						data.data.policysDetail.guaranteeEndTime = filter.timeNum(data.data.policysDetail.guaranteeEndTime, 10);
					}

					if (data.data.policysDetail.holderCardType) {
						data.data.policysDetail.holderCardType = filter.holderIdentifyType(data.data.policysDetail.holderCardType);
					}

					if (data.data.wtPolicysPlatInsureds) {
						for (var i = 0; i < data.data.wtPolicysPlatInsureds.length; i++) {
							var item = data.data.wtPolicysPlatInsureds[i];
							if (item.relationship) {
								item.insuranceRelationship = filter.insuranceRelationship(item.relationship);
							}
							if (item.insurederCardType) {
								item.insurederCardType = filter.holderIdentifyType(+item.insurederCardType);
							}
						}
					}

					vm.policyDate = data.data.policysDetail;
					if (vm.policyDate.holderName.indexOf('梧桐树') > -1) vm.policyDate.isGiftProduct = true;
					// 产品评论
					vm.policyComment = data.data.policyComment;
					// //判断保障权益是否存在
					if (data.data.wtPolicysPlatGuaratees instanceof Array && data.data.wtPolicysPlatGuaratees.length > 0) {
						vm.interestHide = true;
						vm.wtPolicysPlatGuaratees = data.data.wtPolicysPlatGuaratees;
					}
					// 账户价值按钮
					if (vm.policyDate.isShowAmount && vm.policyDate.isShowAmount != 0) {
						vm.showAccountVal = true;
					}
					// // 更多数据信息处理
					vm.insureChange(data);
				})
				.catch(error => {
					notice.hideloading();
					console.log(error);
				});
		},

		/**更多数据信息处理 */
		insureChange(data) {
			//银行数据
			this.bankCard = data.data.bankCard;
			//账户价值
			if (data.data.policyValue) this.policyValue = data.data.policyValue;
			//被保人信息
			this.insureder = data.data.wtPolicysPlatInsureds;
			//是否有收益人
			if (data.data.wtPolicysPlatBeneficiaries && data.data.wtPolicysPlatBeneficiaries.length > 0) {
				for (var i = 0; data.data.wtPolicysPlatBeneficiaries.length; i++) {
					var item = data.data.wtPolicysPlatBeneficiaries[i];
					if (!item) {
						break;
					} else if (item.relationship) {
						item.insuranceRelationship = filter.insuranceRelationship(item.relationship);
					}
				}
				this.beneficiary = data.data.wtPolicysPlatBeneficiaries;
			}
			this.addPolicyGuaratees = data.data.addPolicyGuaratees;
			//是否存在附加险
			if (data.data.wtPolicysPlatAdditions instanceof Array && data.data.wtPolicysPlatAdditions.length > 0) this.additionalList = data.data.wtPolicysPlatAdditions;
		},

		//拨打电话
		makingCall() {
			if (this.policyDate.status != 1) {
				return;
			}
			uni.getSystemInfo().then(info => {
				if (info.os == 'ios') {
					tools.makingCall(store.KFPhoneNumber);
				} else {
					util.showModal({
						content: '如您退保，将失去现有的保障，请您慎重考虑，如需退保，请拨打24小时客服热线400-9955-788',
						success: function(res) {
							if (res.confirm) {
								tools.makingCall(store.KFPhoneNumber);
							}
						}
					});
				}
			});
		},
		//在线回访
		backOnline() {
			var process = this.policyDate.startPolicyJson.process,
				pid = this.policyDate.pid,
				policyVisitUrl = this.policyDate.policyVisitUrl || '',
				policy = true;
			if (process && process.payReturn > 0 && this.policyDate.status != 0) {
				if (process.payReturn == 1 || process.payReturn == 3) {
					util.showToast({
						title: '为了更好维护您的保障权益，本产品有《在线回访》流程，将在3秒钟后跳转至在线回访页面...',
						duration: 3000
					});
				} else if (process.payReturn == 2) {
					util.showToast({
						title: '即将进入温馨提示,将在3秒后跳转...',
						duration: 3000
					});
				} else if (process.payReturn == 4) {
					var name = this.policyDate.company ? this.policyDate.company + '客服' : '我司';
					util.showModal({
						content: '是否继续完成电子回访问卷?如果您希望接受电话回访，可点击取消，"' + name + '"会在3-5个工作日内通过电话给您回访，请您注意接听。',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: `/pages/webView?url=${store.domain[store.dev]}/m/market/inline-visit.html?id=${pid}&policy=${policy}`
								});
							} else {
								uni.navigateTo({
									url: '/pages/minePolicy/minePolicy'
								});
							}
						}
					});
					//util.showToast("是否继续完成电子回访问卷?如果您希望接受电话回访，可点击取消，"+name+"会在3-5个工作日内通过"+phone+"电话回访您，请您注意接听。",['继续','取消'],function(){
					return;
				} else {
					uni.navigateTo({
						url: '/pages/minePolicy/minePolicy'
					});
					return;
				}
				setTimeout(function() {
					var url = store.domain[store.dev];
					if (process.payReturn == 1) {
						url = url + '/m/market/inline-visit.html?id=' + pid + '&policy=' + policy + '';
					} else if (process.payReturn == 2) {
						url = url + '/m/market/inline-visit2.html?id=' + pid + '&policy=' + policy + '';
					} else if (process.payReturn == 3 && policyVisitUrl) {
						//保险公司提供的在线回访
						url = url + '/m/jump.html?url=' + encodeURIComponent(policyVisitUrl);
					}
					uni.navigateTo({
						url: '/pages/webView?url=' + url
					});
				}, 3000);
			}
		},
		toAccountVal() {
			var url = '/personal/cashValue?policyNo=' + vm.policyDate.policyNo+'&login=2';
			uni.navigateTo({
				url: '/pages/webView?url=' + encodeURIComponent(store.domain[store.dev] + url)
			});
		}
	},
	onLoad(option) {
		vm = this;
		let { pid, ishare } = option;
		this.pid = pid;
		// var share = false;
		// if(option.ishare){
		// 	share = JSON.parse(option.ishare);
		// }
		this.ishare = ishare && JSON.parse(ishare);
		uni.getSystemInfo().then(info => {
			this.os = info.os;
		});
	},
	mounted() {
		notice.showloading('加载中...');
		this.policyDetail();
	}
};
</script>

<style lang="less" scoped>
@import './policyDetail.css';
.policyMyDetail {
	height: 100%;
	padding-bottom: 49px;
	&.bottom0 {
		padding-bottom: 0;
	}
	.bottom-btns {
		// height: 50px;
	}
}
</style>
