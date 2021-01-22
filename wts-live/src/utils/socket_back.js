var ws = function(){
    // socket是否连接
    this.socketConnected = false;
    // 待发送的消息队列
    this.messageQueue = []; 
    // 是否断线重连
    this.reconnect = true;
    this.connectSocket(url, params);
}

function connect(url){
    wx.connectSocket({
        url: url,
        header:{
            'content-type': 'application/json'
        },
        success: function(){
            console.log('socket连接成功...');
        }
    });
}

//手动发送消息
ws.prototype.sendSocketMessage = function(msg) {
    // 如果socket已连接则发送消息
    if (this.socketConnected) {
        wx.sendSocketMessage({
            data: msg
        })
    } 
    else {
        // socket没有连接将消息放入队列中
        this.messageQueue.push(msg);
    }
}

//手动关闭连接
ws.prototype.close = function(){
    if (this.socketConnected) {
        wx.closeSocket()
    }
}

//初始化一个socket链接
ws.prototype.initSocket = function(url, params, cb){
    connect(url);
    // 监听 WebSocket 连接打开事件
    wx.onSocketOpen(function(res) {
        console.log("WebSocket 连接成功")
        this.socketConnected = true;
        // 连接成功后，将队列中的消息发送出去
        let queueLength = this.messageQueue.length
        if(queueLength > 0)
        {
            for (let i = 0; i < queueLength; i++) {
                const messageQueueElement = messageQueue.shift();
                wx.sendSocketMessage({
                    data: messageQueueElement
                })
            }
        }
    });

    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function(res) {
        console.log(res);
        //ws.onmessage(res);
    });

    // 监听 WebSocket 错误事件
    wx.onSocketError(function(res) {
        console.log("WebSocket 错误事件")
    });

    wx.onSocketClose(function(res) {
        console.log("WebSocket 连接关闭")
        this.socketConnected = false;
        // 断线重连
        if (this.reconnect) {
          connect();
        }
    })
}

module.exports = new ws();