<template>
	<div>
		<div class="myclaims-box" v-show="mainDate.insuranceProductName">
			<div class="box box1">
				<div class="top-title">
					<div v-if="mainDate.id" class="text marb-cecece">保单号:{{mainDate.policyNo}}</div>
					<div class="text">险种名称: {{mainDate.insuranceProductName}}</div>
				</div>
			</div>
			<div class="main-tit"><text class="main-titles">出险人信息</text></div>
			<div class="box">
				<div v-if="!insureder.length" class="list-form">
					<text class="list-left">出险人姓名:</text>
					<text class="list-right">{{mainDate.insurederName}}</text>
				</div>

                <div v-else class="list-form">
					<text class="list-left">出险人姓名:</text>
					<div class="select-box select-right" >
                        <div>
						<div class="select_title" @click.stop="checkNameTap()">{{checkName}}</div>
						<div class="select_option" v-show="isCheckName">
							<div @click.stop="changeName(item.insurederName,index)" class="option_item" :class="{active:item.insurederName == checkName}" v-for="(item,index) in insureder">{{item.insurederName}}</div>
						</div>
                        </div>
                    </div>
				</div>

				<div class="list-form radio-height noBorder" id="dangerType">
					<text class="list-left">出险类型:</text>
					<div class="list-radios clearfix">
						<div v-for="(value,i) in typeTxt" class="radios-box" @click.stop="inputClick(i)">
						
								<!-- <radio :value="value.type" color="#0084ff" :checked="value.check" />{{value.text}} -->
							
							 <radio-group @change="radioChange">
							               <view>
							                   <radio :value="value.type" :checked="i === current" color="#0084ff"/>
							               	<span>{{value.text}}</span>
							               </view>
							</radio-group>
						</div>
					</div>
				</div>
			</div>
			<div class="box">
				<div class="list-form noBorder">
					<text class="list-left">出险经过描述:</text>
					<textarea v-model="claimPass" class="textarea dangerRemark needsclick" placeholder="请描述出险经过"></textarea>
				</div>
			</div>
			<div class="main-tit"><text class="main-titles">联系人</text></div>
			<div class="box">
				<div class="list-form left-baodan" v-if="!mainDate.isGiftProduct">
					<text class="list-left">您是保单的:</text>
					<div @tap="changeradio(1)" class="lz-radio call-radio" :class="{'active': contantType == 1}"><div class="select_readio_icon"><image src="https://bx.wts999.com/m/resource/xcxStatic/active-chackbox.png" v-if="contantType == 1"></image></div><div class="select_readio_title">投保人</div></div>
					<div @tap="changeradio(2)" class="lz-radio call-radio" :class="{'active': contantType == 2}"><div class="select_readio_icon"><image src="https://bx.wts999.com/m/resource/xcxStatic/active-chackbox.png" v-if="contantType == 2"></image></div><div class="select_readio_title">其他</div></div>
				</div>
				<div class="list-form left-baodan" v-if="mainDate.isGiftProduct">
					<text class="list-left">您的信息:</text>
					<div @tap="changeradio(1)" class="lz-radio call-radio" :class="{'active': contantType == 1}"><div class="select_readio_icon"><image src="https://bx.wts999.com/m/resource/xcxStatic/active-chackbox.png" v-if="contantType == 1"></image></div><div class="select_readio_title">默认</div></div>
					<div @tap="changeradio(2)" class="lz-radio call-radio" :class="{'active': contantType == 2}"><div class="select_readio_icon"><image src="https://bx.wts999.com/m/resource/xcxStatic/active-chackbox.png" v-if="contantType == 2"></image></div><div class="select_readio_title">其他</div></div>
				</div>
				<div class="policy-call call-box" v-if="mainDate.isGiftProduct && contantType==1">
					<div class="list-form">
						<text class="list-left">姓名:</text>
						<text class="list-right">{{mainDate.insurederName}}</text>
					</div>
					<div class="list-form">
						<text class="list-left">手机号码:</text>
						<text class="list-right">{{mainDate.insurederMobile}}</text>
					</div>
				</div>

                <div class="policy-call call-box" v-if="!mainDate.isGiftProduct && contantType==1">
					<div class="list-form">
						<text class="list-left">姓名:</text>
						<text class="list-right">{{mainDate.policyholderName}}</text>
					</div>
					<div class="list-form">
						<text class="list-left">手机号码:</text>
						<text class="list-right">{{mainDate.policyholderMobile}}</text>
					</div>
				</div>
				<div class="notAll-call call-box" v-if="contantType==2">
					<div class="list-form">
						<text class="list-left">姓名:</text>
						<input v-model="contantName" style="height: 90rpx;border: none;" type="text" class="list-input input-less contactName" placeholder="请填写姓名"></input>
					</div>
					<div class="list-form">
						<text class="list-left">手机号码:</text>
						<input v-model="mobile" style="height: 90rpx;border: none;" type="text" class="list-input input-less contactMobile" placeholder="请填写电话"></input>
					</div>
				</div>

			</div>

			<!-- 联系人 end -->
			<!--顶部提示-->
			<div class="main-tit margin-template" v-show="hasClaimType"><text class="main-titles">理赔提示</text><text class="main-titles-desc">(请您保管好下列资料)</text></div>
			<div class="box margin-none" v-show="hasClaimType">
				<div class=" promp-common" v-show="typeTxt[0].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【医疗】</text>
					</div>
					<div class="left-yuan">正式收据，门诊/住院费用清单，社保结算单</div>

					<div class="left-yuan">相关检查及检验报告</div>

					<div class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</div>
				</div>
				<div class=" promp-common" v-show="typeTxt[1].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【重疾】</text>
					</div>
					<div class="left-yuan">（门诊，住院）病例</div>

					<div class="left-yuan">相关检查及检验报告 </div>

					<div class="left-yuan">病理组织检验报告（恶性肿瘤理赔），相关检查及检验报告</div>

					<div class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</div>
				</div>
				<div class=" promp-common" v-show="typeTxt[2].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【残疾】</text>
					</div>
					<div class="left-yuan">（门诊，住院）病例</div>

					<div class="left-yuan">相关检查及检验报告 </div>

					<div class="left-yuan">意外事故证明（公安等机构出具的资料）等</div>

					<div class="left-yuan">鉴定报告（如有）等</div>
				</div>
				<div class=" promp-common"  v-show="typeTxt[3].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【身故】</text>
					</div>
					<div class="left-yuan">（门诊，住院）病例</div>

					<div class="left-yuan">相关检查及检验报告</div>

					<div class="left-yuan">意外事故证明（公安机关等机构出具的资料）等</div>

					<div class="left-yuan">鉴定报告（如有）等</div>

					<div class="left-yuan">死亡证明，户口注销证明，殡葬/火化证明</div>
				</div>
				<div class="promp-common" v-show="typeTxt[4].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【家财损失】</text>
					</div>
					<div class="left-yuan">公安机关开具的保安证明，金额超过5000需提供立案证明</div>

					<div class="left-yuan">房产证复印件、出险照片、房产原装修合同、发票</div>

					<div class="left-yuan">出险后维修合同、发票</div>

					<div class="left-yuan">家电、家具原购买合同、发票</div>
				</div>
				<div class="promp-common" v-show="typeTxt[5].check">
					<div class="list-form marb-e3e3e3">
						<text style="text-align:center;display:block;">【其他】</text>
					</div>
					<div class="left-yuan">依照具体赔案情况由保险人要求提供的证明材料</div>
				</div>
				<div class="bottom-btn-div">
				<form report-submit="true" @submit="submitBtn">
					<button form-type="submit" class="wts-btn-big bottom-fixed">提交</button>
				</form>
				</div>
			</div>
		</div>
		<!-- 提示框 -->
		<div v-show="showClaimPop" class="claimpop">
			<div class="pop">{{claimPopMsg}}</div>
		</div>
	</div>
</template>

<script>
    import tools from '../../api/tools.js';
	import notice from '../../api/notice.js';
	import http from '../../api/http.js';
	import util from '../../api/utils.js';
	var vm = null;
	export default {
		data() {
			return {
				current:0,
				isCheckName:false,
				indexNa:0,
				// name: "", //出险人姓名
				typeTxt: [{
						text: "医疗",
						type: "1",
						check: true
					},
					{
						text: "重疾",
						type: "2",
						check: false
					},
					{
						text: "残疾",
						type: "3",
						check: false
					},
					{
						text: "身故",
						type: "4",
						check: false
					},
					{
						text: "家财损失",
						type: "5",
						check: false
					},
					{
						text: "其他",
						type: "6",
						check: false
					}
				], //出险类型
				mainDate: {}, //主数据
				insureder: [], //多被保险人数据
				hasClaimType: true, //是否选择类型
				checkName: 0, //选择多被保险人姓名
				claimPass: "", //出险经过
				mobile: "", //联系人手机号
				contantName: "", //联系人姓名
				contantType: "1", //联系人类型 1投保人 2其他
				clickFlag: true,
				policyNo:"",
				claimPopMsg: "您的理赔申请已提交，理赔专员会尽快与您联系。", // 提示框文案
				showClaimPop: false // 显示提示框
			}
		},
		beforeCreate() {
			util.hideShareMenu();
		},
		methods: {
			  radioChange(evt) {
			            for (let i = 0; i < this.typeTxt.length; i++) {
			                if (this.typeTxt[i].type === evt.target.value) {
			                    this.current = i;
			                    break;
			                }
			            }
						console.log(this.current)
			},
			//显示隐藏成员信息
			checkNameTap(){
				this.isCheckName = !this.isCheckName;
			},

			//修改成员
			changeName(name,i){
				this.checkName = name;
				this.indexNa = i;
				this.checkNameTap();
			},

			//单选相关事件
			changeradio(type){
				this.contantType = type;
			},
			policyDetail() {
				// 取到路由带过来的参数
				this.$http({
					name:'P_claimsDetail',
					data: {
						policyNo: this.policyNo,
					},
					header:"application/x-www-form-urlencoded"
				})
				.then(data => {
					vm.mainDate = data.data.data;
					if(vm.mainDate.policyholderName.indexOf("梧桐树") > -1) vm.mainDate.isGiftProduct = true;
					vm.insureder = data.data.insureder;
					vm.addInsureder(data.data.insureder);
				})
				.catch(error => {
					notice.hideloading();
					console.log(error);
				});
			},
			addInsureder(insureders) {
				//处理多被保险人数据
				var insureder = insureders;
				var mainDate = vm.mainDate;
				if(insureder && insureder.length > 0) {
					var newDatr = {
						insurederName: mainDate.insurederName,
						insurederMobile: mainDate.insurederMobile,
					}
					insureder.unshift(newDatr);
					vm.insureder = insureder;
					vm.checkName = insureder[0].insurederName;
				}
				notice.hideloading();
			},
			inputClick(i) {
				for (var k=0;k<this.typeTxt.length;k++) {
					this.typeTxt[k].check = false;
				}
				this.typeTxt[i].check = !this.typeTxt[i].check;
				this.checkType();
			},
			checkType() {
				var typeTxt = this.typeTxt;
				var type = false;
				for(var k=0; k<typeTxt.length;k++) {
					if(typeTxt[k].check) {
						type = true;
						break;
					}
				}
				this.hasClaimType = type;
			},
			submitBtn(event) {
				console.log(event);
				var  isGiftProduct = this.mainDate.isGiftProduct;
				if(!this.checkVal()) return;
				var insureder = this.insureder;
				var mainDate = this.mainDate;
				var dangerType = this.getDangerType();
				let obj = {
					insuranceProductName: mainDate.insuranceProductName, //产品名称
					insuranceProductId: mainDate.insuranceProductId, //产品id
					policyNo: mainDate.policyNo, //保单id
					dangerName: this.insureder && this.insureder.length > 0 ? this.insureder[this.indexNa].insurederName : this.mainDate.insurederName, //出险人姓名
					dangerType: dangerType, //出险类型
					dangerRemark: this.claimPass, //出险描述
					contactMobile: this.contantType == 1 ? (!isGiftProduct ? mainDate.policyholderMobile : mainDate.insurederMobile) : this.mobile, //联系人手机
					contactName: this.contantType == 1 ? (!isGiftProduct ? mainDate.policyholderName : mainDate.insurederName) : this.contantName, //联系人姓名
					relationship: this.contantType == 1 ? (!isGiftProduct ? '投保人' : '默认') : '其他', //联系人姓名
				};
				console.log(obj);
				if(this.clickFlag) {
					this.clickFlag = false;
					this.$http({
					name:'P_addClaim',
					data: obj
					})
                    .then(data => {
						if(event.detail.formId && event.detail.formId.indexOf(" ")<0){
							var httpName= '';
							// #ifdef MP-WEIXIN
							httpName= 'wxminiSendMessage';
							// #endif
							// #ifdef MP-ALIPAY
							httpName= 'aliminiSendMessage';
							// #endif
							this.$http({
								name: httpName,
								data:{
									formId:event.detail.formId,
									orderId:"claimSettle"+vm.policyNo
								}
							}).then(res =>{
								if(data.data) {
									vm.claimPopMsg= data.data;
									vm.showClaimPop= true;
									setTimeout(function() {
										vm.clickFlag = true;
										vm.showClaimPop = false;
										uni.navigateBack(-1);
									}, 3000);
								}else {
									vm.claimPopMsg= "您的理赔申请已提交，理赔专员会尽快与您联系。";
									vm.showClaimPop= true;
									setTimeout(function() {
										vm.clickFlag = true;
										vm.showClaimPop = false;
										uni.navigateBack(-1);
									}, 2000);
								}
							}).catch(err =>{
								vm.claimPopMsg= "您的理赔申请已提交，理赔专员会尽快与您联系。";
								vm.showClaimPop= true;
								setTimeout(function() {
									vm.clickFlag = true;
									vm.showClaimPop = false;
									uni.navigateBack(-1);
								}, 2000);
							})
						}else{
							if(data.data) {
								vm.claimPopMsg= data.data;
								vm.showClaimPop= true;
								setTimeout(function() {
									vm.clickFlag = true;
									vm.showClaimPop = false;
									uni.navigateBack(-1);
								}, 3000);
							}else {
								vm.claimPopMsg= "您的理赔申请已提交，理赔专员会尽快与您联系。";
								vm.showClaimPop= true;
								setTimeout(function() {
									vm.clickFlag = true;
									vm.showClaimPop = false;
									uni.navigateBack(-1);
								}, 2000);
							}
						}
                    })
                    .catch(error => {
                        console.log(error);
                    });
				}
			},
			getDangerType() {
				var datas = this.typeTxt;
				var type = '[';
				for(var k=0; k<datas.length;k++) {
					if(datas[k].check) {
						type += datas[k].type + ','
					}
				}
				type = type.slice(0, type.length - 1) + ']';
				return type;
			},
			checkVal() {
				console.log(this.mobile);
				if(this.claimPass == "") {
                    uni.showToast({
                            title: "请填写出险描述",
							icon: 'none',
                            duration: 1000
                        })
					return false;
				}

				if(this.contantType == 2) {
					if(this.contantName == "") {
                        uni.showToast({
                            title: "请填写联系人姓名",
							icon: 'none',
                            duration: 1000
                        })
						return false;
					}
					if(this.mobile == "" || !tools.isPhone(this.mobile)) {
                        uni.showToast({
                            title: "请正确填写联系人手机号",
							icon: 'none',
                            duration: 1000
                        })
						return false;
					}
				}
				return true;
			}
		},
		onLoad(option) {
			vm = this;
			this.policyNo = option.orderNo;
		},
		mounted() {
			notice.showloading("加载中");
			this.policyDetail();
		}
	}
</script>
<style lang="less" scoped>
	@import "../../iconfont/iconfont";
	@import "./onlineClaims.css";
	.cml-checkbox-checked{
		border-radius: 50%;
		overflow: hidden;
	}
	.inner-icon{
      border-radius: 50%;
    }
</style>