<!-- 直播课堂详情 -->
<template>
	<view class="body-container live">
		<!--回复弹窗-->
		<view class="maskInfo" :class="[!showMask?'active':'']">
			<view class="maskContent">
				<view class="mask_title">
					评论区({{totalreply}})
					<view class="mask_close" @click="isShowMask(false)">×</view>
				</view>
				<view class="maskContent-box">
					<scroll-view class="chat-inner" scroll-y="true" :scroll-top="replyscrollHeight" @scroll="isScroll" lower-threshold="0"
					 @scrolltoupper="isScrollTop" @scrolltolower="isScrollBottom" :style="{height: replyChatHeight+'px'}">
						<block v-for="(message,idx) in replyInfo" :key="idx">
							<view class="chat-tpl-01" :class="[message.senderId == userInfo.id?'active':'']">
								<view class="time">{{message.createTime}}</view>
								<view class="messagecontent">
									<view class="left">
										<image mode="widthFix" :src="message.senderIco" />
									</view>
									<view class="right">
										<view class="top">
											<view class="labels" v-if="message.title">{{message.title}}</view>
											<view class="username">{{message.senderNick}}</view>
										</view>
										<view class="usermessage">
											<view class="usermessageDesc">{{message.msgStr}}</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</scroll-view>
				</view>
				<my-input class="my-input"></my-input>
			</view>
		</view>

		<!--最新三条数据-->
		<view class="newMessage" v-if="isOpen">
			<block v-for="(message,idx) in newMessage" :key="idx">
				<view class="newMessageContent">
					<view class="item">
						<view class="right">
							<image mode="widthFix" :src="message.senderIco" />
						</view>
						<view class="left">
							<view class="usermessage">
								<text class="usermessageDesc">{{message.msgStr}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

		<!-- 直播中 -->
		<block>
			<!-- 视频层  -->
			<view v-if="videoInfo.liveType==5" class="videoLayer">
				<image mode="widthFix" :src="courseInfo.banner"></image>
			</view>
			<view v-else ref="videoLayer" class="videoLayer">
				<!-- #ifdef MP-ALIPAY -->
				<video class="mylive" autoplay="true" controls="true" :src="videoInfo.videoSrc"></video>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<block v-if="videoInfo.videoType == 1">
					<video class="mylive" autoplay="true" controls="true" :src="videoInfo.videoSrc"></video>
				</block>
				<block v-else>
					<live-player class="mylive" id="player" :src="videoInfo.videoSrc"
					autoplay auto-pause-if-navigate auto-pause-if-open-native :orientation="orientation">
						<cover-view class="full_img_idv active" @click="fullScreen" v-if="fullScreenFlag">×</cover-view>
						<cover-view class="full_img_idv" @click="fullScreen" v-else>全屏</cover-view>
					</live-player>
				</block>
				<!-- #endif -->
			</view>
			<!-- 聊天层 -->
			<view class="chat-box">
				<scroll-view @click="showSendMessageBtnClick(false)" scroll-y="true" id="chat-id" class="chat-inner" :style="{height: chatHeight+'px'}"
				 :scroll-top="scrollHeight">
					<block v-for="(message,idx) in messageInfo" :key="idx">
						<view class="chat-tpl-01" v-if="message.msgType == 1">
							<view class="time">{{message.createTime}}</view>
							<view class="messagecontent">
								<view class="left">
									<image mode="widthFix" :src="message.senderIco" />
								</view>
								<view class="right">
									<view class="top">
										<view class="labels" v-if="message.title">{{message.title}}</view>
										<view class="username">{{message.senderNick}}</view>
									</view>
									<view class="usermessage">
										<view class="citeSender" v-if="message.quoteSenderNick && message.quoteContent">
											<view class="citeSenderName">{{message.quoteSenderNick}}:</view>
											<view class="citeSenderStr">
												<text>{{message.citeContent}}</text>
											</view>
										</view>
										<view class="usermessageDesc">
											<text v-bind:style="[message.msgStyle,styleObj]">{{message.msgStr}}</text>
											<block v-if="message.msgImg">
												<view v-for="(img,idx) in message.msgImg" :key="idx">
													<image @click="previewImg(img)" mode="widthFix" :src="img" />
												</view>
											</block>
											<view class="audiocontent" v-if="message.audio && message.audioLength && message.audioLength>0">
												<audio :src="message.audio" controls @play="editaudio(false)" @pause="editaudio(true)"></audio>
												<image mode="widthFix" v-if="stopAudio" :src="audio"></image>
												<image mode="widthFix" v-else :src="audio01"></image>
												<text>{{message.audioLength}}秒</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view v-if="!showSendMessageBtn" class="send-chat">
					<view @click="showSendMessageBtnClick(true)" class="send-chat-input">说点什么吧~</view>
					<view class="send-chat-btn">
						<image v-if="isOpen" @click="isOpenMessage(false)" mode="widthFix" class="danmu" src="https://bx.wts9999.net/m/lib/images/live/danmu.png" />
						<image v-else @click="isOpenMessage(true)" mode="widthFix" class="danmu" src="https://bx.wts9999.net/m/lib/images/live/danmu1.png" />
						<image @click="isShowMask(true)" mode="widthFix" class="sendmessage" src="https://bx.wts9999.net/m/lib/images/live/sendMessage.png" />
					</view>
				</view>
				<my-input :isfocus="showSendMessageBtn" v-if='showSendMessageBtn' class="my-input"></my-input>
			</view>
		</block>
	</view>
</template>

<script>
	var timer, self;
	import socket from "../../tool/socket.js";
	import tool from '../../tool/tools.js'
	import store from '../../store.js';
	import myInput from "@/components/myInput.vue";
	import parser from "@/components/jyf-parser/jyf-parser.vue"
	export default {
		data() {
			return {
				showSendMessageBtn: false,
				styleObj: {}, //stype 必须跟个空对象（我也不明白为什么不然不生效）
				videoInfo: {}, //视频信息
				messageInfo: [], //聊天信息
				classId: store.courseId, //直播id
				roomId: store.roomId || "1249985627554844673",
				userInfo: {}, //用户信息
				chatHeight: 0, //聊天框的内容高度
				scrollHeight: 0, //滚动高度
				fullScreenFlag: false,
				PlayerCtx:null,
				orientation:"vertical",
				
				//评论区相关
				replyscrollHeight: 0,
				replyChatHeight: 0,
				replyInfo: [],
				showMask: false, //是否显示评论区
				totalreply: 0, //评论区总数
				isBottom: true, //评论区滚动是不是触底
				replyload: false,
				isOpen: true,
				scrketToken: "",
				courseInfo: {}, //课程信息

				//最新三条评论
				newMessage: [],
				stompClient: null,
				stopAudio: true,
				audio: require('../../assets/images/learn/audio.png'),
				audio01: require('../../assets/images/learn/audio01.gif'),
				maxVideo: require('../../assets/images/learn/maxVideo.png'),
				minVideo: require('../../assets/images/learn/minVideo.png'),
				bottomNum: 0
			};
		},
		components: {
			myInput: myInput,
			parser: parser
		},
		onLoad(e) {
			self = this;
			// #ifdef MP-WEIXIN
			this.PlayerCtx = wx.createLivePlayerContext('player');
			// #endif
			uni.getSystemInfo({
				success: info => {
					this.chatHeight = this.scrollHeight =
						Number(info.windowHeight) - uni.upx2px(522);
					this.replyChatHeight = this.replyscrollHeight =
						Number(info.windowHeight) - uni.upx2px(600);
				}
			});
			this.undateUserInfo((res) => {
				this.userInfo = res;
				this.getCourseInfo();
				this.initVideoInfo();
				this.initMessageInfo(1);
				this.initMessageInfo(2);

			});
		},
		beforeMount() {
			self = this;
			//获取socket命令token
			this.undateUserInfo((res) => {
				this.userInfo = res;
				this.getminiWSToken(() => {
					this.listenSocket();
				});
			})
		},
		destroyed() {
			socket.close();
			clearTimeout(timer);
		},
		onShow(){
			tool.getRecentVersion();
		},
		methods: {
			fullScreen: function() {
				if(!this.PlayerCtx){
					return;
				}
				var that = this;
				//全屏
				var vidoHeight = wx.getSystemInfoSync().windowHeight;
				this.fullScreenFlag = !this.fullScreenFlag;
				if (this.fullScreenFlag) {
					that.orientation = "horizontal";
					//全屏
					that.PlayerCtx.requestFullScreen({
						success: res => {
							console.log('全屏');
						},
						fail: res => {
							console.log('fullscreen fail');
						}
					});

				} else {
					that.orientation = "vertical";
					//缩小
					that.PlayerCtx.exitFullScreen({
						success: res => {
							console.log('退出全屏');
						},
						fail: res => {
							console.log('exit fullscreen success');
						}
					});
				}

			},
			//语音操作
			editaudio(flag) {
				this.stopAudio = flag;
			},
			//评论区事件相关
			// 是否触底
			isScrollBottom() {
				this.isBottom = true;
			},
			isScroll() {
				this.isBottom = false;
			},
			isScrollTop() {
				if (this.replyload || this.replyInfo.length <= 0) {
					return;
				}
				this.replyload = true;
				var messageId = this.replyInfo[0].id;
				this.initMessageInfo(2, messageId);
			},
			isShowMask(flag) {
				this.showMask = flag;
			},

			showSendMessageBtnClick(flag) {
				this.showSendMessageBtn = flag;
			},

			isOpenMessage(flag) {
				this.isOpen = flag;
			},

			//查看图片
			previewImg(src) {
				var arr = [];
				arr.push(src);
				uni.previewImage({
					urls: arr
				});
			},
			//更新用户信息
			undateUserInfo(callback) {
				uni.getStorage({
					key: 'loginInfo',
					success: function(res) {
						if (callback) callback(res.data);
					}
				});
			},

			//通过token获取sockettoken
			getminiWSToken(callback) {
				this.$http({
					name: "getminiWSToken",
					intercept: true,
					data: {
						token: this.userInfo.token
					}
				}).then((res) => {
					this.scrketToken = res.data;
					callback();
				});
			},
			//初始化视频信息
			initVideoInfo() {
				this.$http({
					name: "getLiveRoomInfo",
					intercept: true,
					data: {
						roomId: this.roomId
					}
				}).then(function(res) {
					var data = res.data;
					// data.recordMobile = "http://samples.mplayerhq.hu/FLV/Enigma_Principles_of_Lust-part.flv";
					if(data.recordMobile.toLowerCase().indexOf(".mp4")>-1){
						self.videoInfo.videoType = 1;
					}else{
						self.videoInfo.videoType = 2;
					}
					self.videoInfo.videoSrc = data.recordMobile
					self.videoInfo.liveType = data.liveType;
					self.videoInfo.firstImg = data.firstImg;
				});
			},

			//初始化聊天信息
			initMessageInfo(type, maxId, pageSize, callback) {
				var params = {
					msgType: type,
					roomId: this.roomId,
					time: new Date().getTime(),
					pageSize: pageSize ? pageSize : 20
				};
				if (maxId) {
					params.maxId = maxId;
				}
				this.$http({
					name: "getMessages",
					data: params,
					intercept: true,
				}).then(function(res) {
					var data = res.data;
					var arr = [];
					data.map(item => {
						var obj = self.changeMessageInfo(item);
						arr.push(obj);
					});
					if (type == 1) {
						self.messageInfo = self.messageInfo.length ?
							arr.concat(self.messageInfo) :
							arr;
					} else {
						if(!maxId){
							self.replyInfo = arr;
						}else{
							self.replyInfo = arr.concat(self.replyInfo);
						}
						if (self.replyInfo.length <= 3) {
							self.newMessage = JSON.parse(JSON.stringify(self.replyInfo));
						} else {
							self.newMessage = self.replyInfo.slice(
								self.replyInfo.length - 3,
								self.replyInfo.length
							);
						}
						self.totalreply = res.total;
					}

					//更新消息滚动
					// setTimeout(function() {
						
					// }, 200)
					if (maxId) {
						self.updateTopScroll(arr);
					} else {
						self.updateScrollHeight(1);
					}

					if (callback) {
						callback();
					}

					if (data.length) {
						setTimeout(function() {
							self.replyload = false;
						}, 1000);
					}
				});
			},
			sendMessageEvent(e) {
				var msg = e;
				if (msg == "") {
					uni.showToast({
						title: "请输入您要发送的消息！",
						icon: 'none',
						duration: 2000
					})
					return;
				}
				uni.showLoading({
					title: "发送中...",
					mask: true
				});

				this.stompClient.send("/app/sendMsg", {}, JSON.stringify({
					content: msg,
					courseId: self.courseInfo.id
				}));
				//查询消息列表有最新的更新上去
				setTimeout(() => {
					var length = this.replyInfo.length * 1 + 1;
					// this.replyInfo = [];
					this.initMessageInfo(2, null, length, function() {
						uni.hideLoading();
						uni.showToast({
							title: "发送成功",
							icon: 'none',
							duration: 2000
						})
					});
				}, 1000)
			},
			// 开启聊天监听
			listenSocket() {
				self = this;
				socket.init({
						token: self.scrketToken,
						roomId: store.roomId,
						url: "/applet/socket"
					},
					function(stompClient) {
						self.socketCallback(stompClient);
					}
				);
			},
			socketCallback(stompClient) {
				self.stompClient = stompClient;
				stompClient.subscribe("/room/" + self.roomId, function(
					message,
					headers
				) {
					console.log("chat:", JSON.parse(message.body));
					// 通知服务端收到消息
					message.ack();
					//回调给调用方
					var chat = JSON.parse(message.body);
					//如果就同一个用户，就过滤掉这条消息
					if (chat.senderId == self.userInfo.id) return;
					var chat = self.changeMessageInfo(chat);
					if (chat.msgType == 1) {
						var messages = JSON.parse(JSON.stringify(self.messageInfo));
						messages.push(chat);
						self.messageInfo = messages;
					} else if (chat.msgType == 2) {
						var messages = JSON.parse(JSON.stringify(self.replyInfo));
						messages.push(chat);
						self.replyInfo = messages;
						self.totalreply = self.totalreply * 1 + 1;
						if (self.replyInfo.length <= 3) {
							self.newMessage = JSON.parse(JSON.stringify(self.replyInfo));
						} else {
							self.newMessage = self.replyInfo.slice(
								self.replyInfo.length - 3,
								self.replyInfo.length
							);
						}


					}
					// 更新消息滚动
					self.updateScrollHeight();
				});

				//房间配置信息更新
				// stompClient.subscribe(
				// 	"/room?" + self.roomId,
				// 	function(message) {
				// 		console.log("配置文件更新了");
				// 		var msgObj = JSON.parse(message.body);
				// 		var data = msgObj.data;
				// 		//有视频显示视频
				// 		if (data.isLock == 0) {
				// 			self.videoInfo.videoSrc = data.videoUrl;
				// 			self.videoInfo.isHiddenVideo = false;
				// 			return;
				// 		}
				// 		//无视频显示占位图片
				// 		self.videoInfo.videoSrc = themeContent.stopLockImg;
				// 		self.videoInfo.isHiddenVideo = true;
				// 	}
				// );
			},

			//初始化课程信息
			getCourseInfo() {
				this.$http({
					name: "getClassDetail",
					data: {
						roomId: this.roomId
					}
				}).then(function(res) {
					self.courseInfo = res.data;
				});
			},
			//消息数据处理
			changeMessageInfo(item) {
				var content = tool.strToJson(item.content);
				var createTime = item.createTime;
				item.createTime = tool.trustTime(createTime);
				item.msgStr = content.text;
				item.msgImg = content.imgs;
				var style = {};
				if (content.color) style.color = content.color;
				if (content.bold) style.fontWeight = "bold";
				item.msgStyle = style;
				if (content.audio && content.audioLength && content.audioLength > 0) {
					item.audio = content.audio;
					item.audioLength = content.audioLength;
				}
				if (item.quoteSenderNick && item.quoteContent) {
					item.citeContentImg = tool.strToJson(item.quoteContent).imgs;
					item.citeContent = tool.strToJson(item.quoteContent).text;
				}
				return item;
			},
			//更新聊天框高度
			updateScrollHeight(type) {
				var height = 0;
				var replysHeight = 0;
				self.messageInfo.map(item => {
					height += Math.ceil(item.msgStr.length / 12) * 48 + 100;
				});
				self.replyInfo.map(item => {
					replysHeight += Math.ceil(item.msgStr.length / 12) * 48 + 100;
				});
				this.scrollHeight = height;
				if (type) {
					this.replyscrollHeight = replysHeight;
				} else if (!this.showMask) {
					this.replyscrollHeight = replysHeight;
				} else if (this.showMask && this.isBottom) {
					this.replyscrollHeight = replysHeight;
				}
			},
			updateTopScroll(obj) {
				var height = 0;
				obj.map(item => {
					height += Math.ceil(item.msgStr.length / 12) * 48 + 100;
				});
				this.replyscrollHeight = height;
			}
		}
	};
</script>

<style scoped lang="scss">
	@import './liveDetail.scss';
</style>
