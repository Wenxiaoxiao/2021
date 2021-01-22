const Stomp = require('./stomp.js').Stomp;
const domain = 'wss://livef.wts999.com';
// const domain = 'ws://livef.wts9999.net';    
// const domain = 'wss://livef.wts9999.net';
import store from '../store.js';
var Socket = {
    // socket是否连接
    socketConnected: false,
    // 待发送的消息队列
    messageQueue: [],
    // 是否断线重连
    reconnect: true,
    // 是否是手动关闭
    autoClose: true,
    ws: {},
    wsUrl: '',
    create: function(){
        var _self = this;
        console.log(_self.wsUrl);
        uni.connectSocket({
            url: _self.wsUrl
        })
    },
    connect: function(){
        var _self = this;
        _self.ws = {
            send: _self.sendSocketMessage,
            close: _self.close
        }
        
        _self.create();

        uni.onSocketOpen(function(res) {
            console.log("WebSocket 连接成功")
            _self.socketConnected = true;
            _self.ws.onopen && _self.ws.onopen();
            // 连接成功后，将队列中的消息发送出去
            let queueLength = _self.messageQueue.length
            for (let i = 0; i < queueLength; i++) {
                sendSocketMessage(_self.messageQueue.shift())
            }
        })
      
        // 监听 WebSocket 接受到服务器的消息事件
        uni.onSocketMessage(function(res) {
            console.log("onmessage",res);
            _self.ws.onmessage(res);
        })
      
        // 监听 WebSocket 错误事件
        uni.onSocketError(function(res) {
            console.log("WebSocket 错误事件", res)
            if (!_self.socketConnected) {
                // 断线重连
                if (_self.reconnect) {
                    _self.create();
                }
            }
        })
      
        // 监听 WebSocket 连接关闭事件
        uni.onSocketClose(function(res) {
            console.log("WebSocket 连接关闭,autoClose:",_self.autoClose);
            _self.socketConnected = false;
            //断线重连
            if (_self.reconnect && _self.autoClose) {
                _self.create();
            }
        })
    },
    sendSocketMessage: function(msg){
        console.log(Socket);
        // 如果socket已连接则发送消息
        if (Socket.socketConnected) {
            uni.sendSocketMessage({
                data: msg
            })
        } else {
            // socket没有连接将消息放入队列中
            Socket.messageQueue.push(msg);
        }
    },
    close: function(){
        var _self = Socket;
        if (_self.socketConnected) {
            uni.closeSocket()
            _self.socketConnected = false;
            _self.autoClose = false;
        }
    },
    init: function(param = {}, cb){
        var _self = this;
        // 初始化重置autoClose
        _self.autoClose = true;
        let {
            token=param.token,
            roomid = param.roomId,
			requrl = param.url
        } = param;
        _self.wsUrl = `${domain+requrl}?roomid=${roomid}&token=${token}`;
        _self.connect();
        Stomp.setInterval = function(interval, f) {
            return setInterval(f, interval);
        };
        // 结束定时器的循环调用
        Stomp.clearInterval = function(id) {
            return clearInterval(id);
        };
    
        const stompClient = Stomp.over(_self.ws);
        console.log("beforeconnect");
        stompClient.connect({}, function() {
            console.log("inconnect");
            typeof cb == 'function' && cb(stompClient);
        },function(err) {
            console.log("stompErr",err);
        })
    },
    onmessage: function(data) {
        console.log(data);
    }
}

module.exports = Socket;
    
