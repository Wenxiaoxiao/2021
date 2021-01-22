<template>
  <div class="inExpert">
    <scroll-view class="view-container" :style="{height:scrollHeight+'px'}" scroll-y="true" lower-threshold="50" @scrolltolower="onBottom">
      <div class="agent-card">
        <div class="agent-top"></div>
        <div class="card">
            <image :src="detailData.ico" class="card-pic" alt=""></image>
            <image :src="imgSrc" class="icon-card" alt=""></image>
            <div class="card-content">
                <div class="name">{{detailData.name}}</div>
                <div class="dest break">{{detailData.desc}}</div>
            </div>
            <div class="cred-num break">
                <text class="iconfont icon-laoshirenzheng1"></text><text class="bank_num">银保监会执业证：{{detailData.license}}</text>
            </div>
        </div>
      </div>
      <div class="comment-box">
          <text class="comment-title">客户评价</text>
          <div class="comment-list">
            <div class="comment-item" v-if="commentsList.length > 0&&val.commentName" v-for="(val,i) in commentsList">
                <div class="user-msg clearfix">
                    <image :src="val.commentIco?val.commentIco:imgSrc1" class="user-img"></image>
                    <text class="user-name">{{val.commentName}}</text>
                </div>
                <div class="user-content break">{{val.commentContent}}</div>
            </div>
          </div>
          <div id="emptyDom">
            <block v-if="hasMore">
                <image class="a1" :src="loadingImg"></image>
                <text class="a2">加载中...</text>
            </block>
            <block v-else>
                <text class="a3">没有更多评论了~</text>
            </block>
          </div>
      </div>
      <div class="bottom-blank"></div>
    </scroll-view>
    <div class="btn-bottom">
        <div class="btn btn1" @click="reversePop">我要预约</div>
        <div class="btn btn2" @click="showCommontBox">我要评价</div>
    </div>
    <!-- 预约弹窗 -->
    <reverse-pop :isLayerHide="isLayerHide" :agentId="agentId" @hidePop="hidePop"></reverse-pop>
    <!-- 评论弹窗 -->
    <div class="comment-input" v-show="showComment">
      <div class="comment-mask" @click="hideCom"></div>
        <div class="comment-content" v-if="showComment">
          <div class="inputAreas">
			  <!-- #ifndef MP-ALIPAY -->
			 <textarea show-confirm-bar="false" fixed="true" class="c_user_text" cursor-spacing="78"  @linechange="textInput" @blur="getComment" :focus="textFocus" placeholder="输入您的评论.."></textarea>
			  <!-- #endif -->
			 <!-- #ifdef MP-ALIPAY -->
			 <textarea  cursor-spacing="60"  @blur="getComment"  placeholder="输入您的评论...."></textarea>
			   <!-- #endif -->
          </div>
          <div class="right">
              <div id="sendMsg" @click="commentSubmit">发布</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

	import http from '../../api/http.js';
	import notice from '../../api/notice.js';
	import tools from '../../api/tools.js';
	import reversePop from '../reversePop/reversePop.vue';

export default   {

 data() {
	return		{
			cursorSpacing:"85",//键盘距离光标高度
			agentId: '',  // 顾问id
			inType: '',
			scrollHeight: -1,
			detailData: '', // 页面数据
			isLayerHide: false, // 预约弹窗
			pageNum: 1, // 当前页
			maxPage: 99, // 评论最大页
			hasMore: true, // 有更多数据
			loadingImg: "https://bx.wts999.com/m/resource/xcxStatic/bdgj/loading.gif",
			showComment: false,  // 评论框
			textFocus: false,  // focus textarea
			commentsList: [], // 评论列表
			commentMsg: '',   // 输入的评论内容
			imgSrc: "https://bx.wts999.com/m/resource/xcxStatic/bdgj/icon-cred-big.png",
			imgSrc1: "https://bx.wts999.com/m/resource/xcxStatic/person-center-03.jpg",
			timer: null,   // 触底加载节流
		}
  },
  methods: {
    // 顾问详情
    detailAjax() {
      var ajax,
          that= this;
      if(this.inType == "1"){
        ajax = "Exe_agentsDetail"
      }
      this.$http({
        name: ajax,
        data: {
            id: that.agentId
        }
      }).then(function(res) {
          console.log(res.data);
          that.detailData= res.data;
      }).catch(function(res) {
          console.log(res)
      })
    },
    // 评论列表
    commentDemand(){
      this.isTextLogin = true;

      var that= this;
      this.$http({
        name: "Exe_AgentShowComments",
        data: {
          agentId: that.agentId,
          status: "1",
          pageSize: 10,
          pageNum: that.pageNum
        }
      }).then(function(res) {
        that.maxPage= res.pages;
        if(that.pageNum==1) {
          that.commentsList= res.data;
        }else {
          that.commentsList= that.commentsList.concat(res.data);
        }
        if(that.maxPage== 0||that.pageNum==that.maxPage) {
          that.hasMore= false;
        }
      }).catch(function(res) {
        console.log(res)
      })
    },
    // 预约
    reversePop() {
      this.isLayerHide= true;
    },
    // 显示评论弹窗
    showCommontBox() {
      this.showComment= true;
      this.textFocus= true;
    },
    // 发布评论
    commentSubmit() {
      var that= this;
      //避免键盘收起时阻塞取值
      setTimeout(function(){
		  var msg= tools.trim(that.commentMsg);
		  if(!msg) {
			  return notice.msg("评论不能为空");
		  }
        that.$http({
          name: "Exe_agentComments",
          data: {
            agentId: that.agentId,
            commentContent: that.commentMsg
          }
        }).then((res) =>{
          that.textFocus= false;
          that.showComment= false;
          notice.alert("提交成功，请等待审核！");
        }).catch(function(res) {
          console.log(res)
        })
      },200);
    },
    // 隐藏预约弹窗
    hidePop() {
        this.isLayerHide= false;
    },
    // 输入的评论内容
    getComment(e) {
      this.commentMsg= e.detail.value;
    },
    // 隐藏评论框
    hideCom() {
      this.showComment= false;
      this.textFocus= false;
    },
    // 上拉加载
    onBottom(e) {
      if(this.timer) return false;
      var that= this;
      // 最大页就不加载
      if(that.pageNum==that.maxPage) {
          this.hasMore= false;
          return false;
      }
      that.pageNum++;
      that.commentDemand();
      // 1s只触发一次加载
      this.timer= setTimeout(function() {
          clearTimeout(that.timer);
          that.timer= null;
      }, 200);
    },
	textInput(e) {
		console.log(e);
	}
  },
  onLoad(option) {
	  console.log(option);
	var vm= this;
	uni.getSystemInfo({
		success: function(info) {
			// #ifdef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(176 + 60);
			// #endif
			// #ifndef APP-PLUS-NVUE
				vm.scrollHeight = Number(info.windowHeight) - uni.upx2px(60);
			// #endif
		}
	})
    this.agentId = option.agentId; 
    this.inType = option.inType; //详情类型
    this.detailAjax();
    this.commentDemand();
  },
  components: {
  	"reverse-pop": reversePop
  }
}

</script>

<style>
  @import './inExpert.css';
</style>
