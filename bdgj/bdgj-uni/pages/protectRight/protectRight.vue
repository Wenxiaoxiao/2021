<template>
	<div title="保障权益">
		<div class="body-container cp-details view-container">
			<div class="w cp-details-01">
				<div class="w-box-c">
					<div class="cp-title-01">保障权益/金额</div>
					<div class="main-uls">
						<div class="ul-content">
							<div class="ul-contents active">
								<div class="contents-btn" :class="{ 'add-title-class': value.isShow }" v-for="(value, i) in mainDatas" @click.stop="showDetail(i)">
									<div class="li-title clearfix">
										<div class="clearfix line-class li-title-div">
											<text class="line-class-text">{{ value.attr }}</text>
											<text class="line-class-text-active">{{ value.amount }}</text>
										</div>
										<div class="lz-fs-26 lz-col-666 content-des">{{ value.detail }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-show="addpolicyDatas.length > 0" v-for="(addpolicyitem, index) in addpolicyDatas" :key="index">
					<div class="cp-title-01" v-if="index === 0">首次投保保障权益/金额</div>
					<div class="cp-title-01" v-else>加保保障权益/金额</div>
					<div class="main-uls">
						<div class="ul-content">
							<ul class="ul-contents active">
								<li
									class="contents-btn"
									v-for="(value, i) in addpolicyitem"
									:key="i"
									:class="!value.isShow ? '' : 'add-title-class'"
									@click="showDetail1(index, i)"
								>
									<div class="li-title clearfix">
										<div class="clearfix line-class" :class="value.describe == '' ? '' : 'li-title-div'">
											
											<span class="line-class-text">{{ value.premiseAttribute }}</span>
											<span class="line-class-text-active">{{ value.guaranteeMoney }}</span>
										</div>
										<p class="lz-fs-26 lz-col-666 content-des">{{ value.describe }}</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '../../api/http.js';
import store from '../../store/state';
import tools from '../../api/tools';
import util from '../../api/utils.js';

var vm;
export default {
	data() {
		return {
			addpolicyDatas: [], //加保数据
			mainDatas: [], //主数据
			id: '',
			isPlat: '',
			policy: null
		};
	},
	beforeCreate() {
		util.hideShareMenu();
	},
	methods: {
		   getAddpolicydata() {
		      //P_addPolicyGuaratees
		   const  param = {
		    	policyNo: this.id,
		    	isPlat: this.isPlat
		    };
		      this.$http({
		        name:'P_addPolicy',
		        data: param
		      })
		        .then(r => {
		          if (r.data) {
		            var tmp = [];
		            Object.keys(r.data).forEach(function(key) {
		              tmp.push(r.data[key]);
		            });
		           vm.addpolicyDatas = tmp;
     
		          }
				  // vm.addpolicyDatas = [  [
				  //     {
				  //         "guaranteeMoney":"合同约定",
				  //         "premiseAttribute":"身故保险金",
				  //         "describe":"被保险人在保险合同保险期间内身故，我们按被保险人身故时保险合同累计已交纳保险费（不计利息）与被保险人身故时保险合同现金价值的较大者向身故保险金受益人给付身故保险金，保险合同终止。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"0.2 * 4次",
				  //         "premiseAttribute":"生存保险金",
				  //         "describe":"若被保险人在年满18周岁后的每个保单周年日零时仍生存，我们按保险合同基本保险金额的9%给付生存保险金，直至被保险人年满21周岁后首个保单周年日止，共给付四次。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"1.41元",
				  //         "premiseAttribute":"满期保险金",
				  //         "describe":"被保险人在保险合同保险期间届满时生存，我们按保险合同基本保险金额的64%向满期保险金受益人给付满期保险金，保险合同终止。"
				  //     }
				  // ],[
				  //     {
				  //         "guaranteeMoney":"合同约定",
				  //         "premiseAttribute":"身故保险金",
				  //         "describe":"被保险人在保险合同保险期间内身故，我们按被保险人身故时保险合同累计已交纳保险费（不计利息）与被保险人身故时保险合同现金价值的较大者向身故保险金受益人给付身故保险金，保险合同终止。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"0.2 * 4次",
				  //         "premiseAttribute":"生存保险金",
				  //         "describe":"若被保险人在年满18周岁后的每个保单周年日零时仍生存，我们按保险合同基本保险金额的9%给付生存保险金，直至被保险人年满21周岁后首个保单周年日止，共给付四次。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"1.41元",
				  //         "premiseAttribute":"满期保险金",
				  //         "describe":"被保险人在保险合同保险期间届满时生存，我们按保险合同基本保险金额的64%向满期保险金受益人给付满期保险金，保险合同终止。"
				  //     }
				  // ],[
				  //     {
				  //         "guaranteeMoney":"合同约定",
				  //         "premiseAttribute":"身故保险金",
				  //         "describe":"被保险人在保险合同保险期间内身故，我们按被保险人身故时保险合同累计已交纳保险费（不计利息）与被保险人身故时保险合同现金价值的较大者向身故保险金受益人给付身故保险金，保险合同终止。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"0.2 * 4次",
				  //         "premiseAttribute":"生存保险金",
				  //         "describe":"若被保险人在年满18周岁后的每个保单周年日零时仍生存，我们按保险合同基本保险金额的9%给付生存保险金，直至被保险人年满21周岁后首个保单周年日止，共给付四次。"
				  //     },
				  //     {
				  //         "guaranteeMoney":"1.41元",
				  //         "premiseAttribute":"满期保险金",
				  //         "describe":"被保险人在保险合同保险期间届满时生存，我们按保险合同基本保险金额的64%向满期保险金受益人给付满期保险金，保险合同终止。"
				  //     }
				  // ]]
		        })
		        .catch(err => {});
		    },
		showDetail(i) {
			if (!this.mainDatas[i].detail) return;
			// tools.setData(this,{"this.mainDatas[i].isShow":!this.mainDatas[i].isShow})
			this.mainDatas[i].isShow = !this.mainDatas[i].isShow;
		},
		 showDetail1(index, i) {
		      if (!this.addpolicyDatas[index][i].describe) return;
		      var item = this.addpolicyDatas[index][i];
		      item.isShow = !item.isShow;
		      this.$set(this.addpolicyDatas[index], i, item);
		      //console.log(this.addpolicyDatas);
		    },
		getDatas() {
			//获取页面数据
			var name, param;
			if (this.policy) {
				name = 'P_policyInterest';
				param = {
					policyNo: this.id,
					isPlat: this.isPlat
				};
			} else {
				name = 'P_orderInterest';
				param = {
					orderId: this.id,
					asc: true,
					pageSize: 50
				};
			}

			this.$http({
				name: name,
				data: param
			})
				.then(function(data, e) {
					for (var i = 0; i < data.data.length; i++) {
						data.data[i].isShow = false;
					}
					vm.mainDatas = data.data;
				})
				.catch(error => {
					console.log(error);
				});
		}
	},
	onLoad(option) {
		vm = this;
		this.isPlat = option.isPlat;
		this.id = option.id;
		this.policy = option.policy;
	},
	mounted() {
		vm.getDatas();
		vm.getAddpolicydata();
	}
};
</script>
<style lang="less" scoped>
@import './protectRight.css';
</style>
