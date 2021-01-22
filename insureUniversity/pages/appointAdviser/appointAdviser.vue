<!-- 顾问预约页面 -->
<template>
  <div class="counselorPage">
      <div class="counselor-bottom" :class="{'active':inType == 1}">
          <div class="nav2-top">
              <div class="column-tap fl" :class="{active:inType == 1}" @click="switchType(1)"><text class="a1">保险顾问</text></div>
              <div class="column-tap fl" :class="{active:inType == 2}" @click="switchType(2)"><text class="a1">保险专家</text></div>
          </div>
          <div class="search" v-show="inType == 1">
              <div class="search-chunk clearfix">
                  <text class="iconfont icon-fangdajing fl"></text>
                  <input type="text" class="search_ipt" v-model="searchName" placeholder="输入姓名、执业证号搜索顾问" id="searchWords" @input="searchInput">
                  <text v-if="searchName" class="iconfont icon-guanbi fr" @click="resultInit"></text>
              </div>
          </div>
          <scroll-view v-if="showScroll" :style="{height:scrollHeight+'px'}" scroll-y="true" @scroll="toTopFn" :scroll-top="scrollTop" lower-threshold="50" @scrolltolower="onBottom" class="view-container">
              <div class="teacher-box">
                  <!-- 经纪人 -->
                  <div class="teacher-list agent" v-show="inType == 1">
                      <div v-for="(list,n) in personList" class="list-li">
                          <div class="teacher-top">
                              <div @click="urlTo('/pages/inExpert/inExpert',list.id,1)">
                                  <image :src="list.ico" class="t_pic"></image>
                              </div>
                              <div class="t_msg">
                                  <div @click="urlTo('/pages/inExpert/inExpert',list.id,1)">
                                      <div class="name">{{list.name}}</div>
                                      <div class="des">{{list.desc}}</div>
                                  </div>
                                  <div class="nav2-teach-btn" :id="list.id" @click="reversePop">预约</div>
                              </div>
                          </div> 
						  <div class="teacher-card">银保监会执业证：{{list.license}}</div>
                          <div class="teacher-bottom">
                              <div class="p2 fl">
                                  <text class="iconfont icon-dianzan"></text>好评率：<text style="font-size:28rpx;">{{list.favorableRate?list.favorableRate:100}}%</text>
                              </div>
                              <div @click="urlTo('/pages/inExpert/inExpert',list.id,1)" class="p3 fr">
                                  详情<text class="iconfont icon-gengduo"></text>
                              </div>
                          </div>
                      </div>
                  </div>
                  <!-- 保险专家/核保专家-->
                  <div class="teacher-list in-expert" v-show="inType == 2">
                      <div v-for="(list,n) in personList" class="list-li">
                          <div class="list-box" @click="urlTo('/pages/unExpert/unExpert',list.id,2)">
                              <image :src="list.ico" class="t_pic"></image>
                              <div class="t_msg">
                                  <div class="name">{{list.name}}
                                    <text class="tag">{{list.sign}}</text>
                                  </div>
                                  <div class="dest">{{list.desc}}</div>
                                  <div class="detail fr">详情<text class="iconfont icon-gengduo"></text></div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div id="emptyDom">
                    <block v-if="hasMore">
                        <image class="a1" :src="loadingImg"></image>
                        <text class="a2">加载中...</text>
                    </block>
                    <block v-else>
                        <text class="a3">-- 暂无更多数据 --</text>
                    </block>
                  </div>
              </div>   
          </scroll-view>
          <image class="toTop" v-if="toTop" :src="imgSrc" @click="goTop"></image>
      </div>
      <!-- 预约弹窗 -->
      <reverse-pop :isLayerHide="isLayerHide" :agentId="agentId" @hidePop="hidePop"></reverse-pop>
  </div>
</template>

<script>
    import http from '../../tool/http.js';
    import tools from '../../tool/tools.js';
	import reversePop from '../../components/reversePop.vue';

export default {
  data() {
	  return {
		  imgSrc: "https://bx.wts999.com/m/xcxStatic/bdgj/sq_go_top.png",
		  hasMore: true,
		  loadingImg: "https://bx.wts999.com/m/xcxStatic/bdgj/loading.gif",
		  toTop: false,
		  scrollHeight: -1,
		  inExpertHeight: -1,
		  nowTop: 0,  // 当前滚动的高度
		  inType:1, //1 经纪人 2保险专家
		  personList:[],  //经纪人列表
		  isLayerHide:false,  //预约弹窗隐藏
		  agentId:'',
		  searchName:"",    //搜索内容
		  size: 20,      // 每页数据条数
		  currentPage: 1, //当前页
		  maxPage: 99,    // 最大页
		  scrollTop: 0,    // 滚动到的位置
		  showScroll: true, //重置scroll高度
		  timer: null   // 触底加载节流
	  }
  },
  methods: {
    // 获取数据
    getData(inType) {
        var ajax= "",
            that= this;
        if(this.inType == 1){ //经纪人查询
            ajax= "Exe_agentsList";
        }else if(this.inType == 2){ //保险专家
            ajax= "Exe_expertsList";
        }
        this.$http({
            name: ajax,
            data: {
                pageSize: that.size,
                pageNum: that.currentPage,
                searchStr: that.searchName
            }
        }).then(function(res) {
            that.showScroll= true;
            that.maxPage= res.pages;
            // 标签截取10个字
            // res.data.map(function(item) {
            //     if(item.sign>10) {
            //     item.sign= item.sign.slice(0,10)+'...';
            //     }
            // })
            if(that.maxPage== 0||that.currentPage== that.maxPage) {
                that.hasMore= false;
            }
			// 保险专家-截取过长标签
			res.data.map(function(item) {
				if(item.sign&&item.sign.length>9) {
					item.sign= item.sign.slice(0,10)+'...';
				}
			})
            // 分页就加载，否则重置
            if(that.currentPage>1) {
                that.personList= that.personList.concat(res.data);
            }else {
                that.personList= res.data;
            }
        }).catch(function(res) {
            console.log(res)
        })
    },
    /**
     * 经纪人类型切换
     * @param {*}type 当前切换类型
     */
    switchType(type){
        var that= this;
        if(this.inType == type) return false;
        setTimeout(function() {
            // 切换类型
            that.inType = type;
            // 重置状态
            that.showScroll= false;
			// 重置列表高度
			that.scrollHeight= that.inType==1? that.inExpertHeight:that.inExpertHeight + 40;
            that.personList = [];
            that.scrollTop = 0;
            that.currentPage = 1;
            that.hasMore= true;
            that.searchName = "";
            // 请求数据
            that.getData(that.inType);
        },100)
    },
    // 关键字搜索
    searchInput: tools.debounce(function(e) {
        this.currentPage= 1;
        this.hasMore= true;
        this.searchName= e[0].detail.value;
        this.getData(this.inType);
    },500),
    // 滚动大于1000显示totop图标
    toTopFn(e) {
        this.nowTop= e.detail.scrollTop;
        if(e.detail.scrollTop>1000) {
            this.toTop= true;
        }else {
            this.toTop= false;
        }
    },
    // 返回顶部
    goTop() {
        var that= this;
        this.scrollTop= this.nowTop;
        setTimeout(function(){
            that.scrollTop= 0;
        },200)
    },
    resultInit(){
		var that= this;
        if(tools.trim(this.searchName)=='') return false;
        setTimeout(function() {
            that.resultHide = true;
            that.searchName = "";
            that.personList = [];
            that.scrollTop = 0;
            that.getData(that.inType);
        },100);
    },
    urlTo(url,id,inType) {
        uni.navigateTo({
            url: url+'?agentId='+id.toString()+'&inType='+inType
        })
    },
    // 滚动到底部
    onBottom(e) {
        if(this.timer) return false;
        var that= this;
        // 最大页就不加载
        if(that.currentPage==that.maxPage) {
            this.hasMore= false;
            return false;
        }
        that.currentPage++;
        that.getData(that.inType);
        // 1s只触发一次加载
        this.timer= setTimeout(function() {
            clearTimeout(that.timer);
            that.timer= null;
        }, 200);
    },
    // 预约
    reversePop(e) {
        this.isLayerHide= true;
        this.agentId= e.target.id.toString();
    },
    // 隐藏预约弹窗
    hidePop() {
        console.log("hidepop")
        this.isLayerHide= false;
    }
  },
  onShow(){
      tools.getRecentVersion();
  },
  onLoad() {
	var vm= this;
	uni.getSystemInfo({
		success: function(info) {
			// #ifdef APP-PLUS-NVUE
			vm.inExpertHeight = Number(info.windowHeight) - uni.upx2px(44 + 83);
			// #endif
			// #ifndef APP-PLUS-NVUE
			vm.inExpertHeight = Number(info.windowHeight) - uni.upx2px(83);
			// #endif
			vm.scrollHeight= vm.inExpertHeight;
		}
	})
    this.getData(this.inType);
  },
  components: {
  	'reverse-pop': reversePop
  },
	onShareAppMessage() {
		return {
			title: "买保险，你想了解的都在这里！", 
			path: "/pages/index/index",
			// #ifdef MP-TOUTIAO
			templateId: "57cla42fgafmap6jc9",
			desc: "名师解惑，让你成为朋友中的保险专家！",
			// #endif
			imageUrl: require('@/assets/images/index/share.jpg')
		}
	}
}
</script>

<style>
  @import './appointAdviser.css';
</style>
