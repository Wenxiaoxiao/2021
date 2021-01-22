var tools = {
	subString: function(value, length) {
	    if (!value) {
	      return "";
	    }
	    value = value.trim();
	    if (value.length > length) {
	      var first = value.toString().substring(0, length);
	      value = first + "...";
	    }
	    return value;
	},
	// 时间处理
	trustTime: function(inHisTime, pattern) {
	    if (!inHisTime) {
	      return;
	    }
	    inHisTime = inHisTime.toString().trim().replace(/-/gm, "/");
	    var date = null,
	      now = new Date();
	    if (inHisTime.indexOf("/") != -1) { //yyyy-mm-dd HH:mm:ss
	      date = new Date(inHisTime);
	    } else {
	      date = new Date(Number(inHisTime)); // long 整型
	    }
	    var year = date.getFullYear(),
	      month = date.getMonth() + 1,
	      day = date.getDate(),
	      hours = date.getHours(),
	      minute = date.getMinutes();
	    var minuteTime = (hours < 10 ? "0" + hours : hours) + ":" + (minute < 10 ? "0" + minute : minute),
	      monthTime = (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
	    if (pattern && pattern.toLowerCase() === "time") {
	      return minuteTime;
	    } else if (now.toLocaleDateString() === date.toLocaleDateString()) {
	      //当天 只显示时间
	      return minuteTime;
	    } else if (year === now.getFullYear()) {
	      //当年 显示 月-日 时间
	      return monthTime + " " + minuteTime;
	    } else {
	      //不是当年
	      return year + "-" + monthTime + " " + minuteTime;
	    }
	},
	/*内容\n换成回车*/
	fmtContent: function(value) {
	    if (!value) return;
	    value = value.split("\n").join("<br/>");
	    return value;
	},
	formatNumber: function(n) {
	  n = n.toString()
	  return n[1] ? n : '0' + n
	},
	formatTime: function(date) {
	  const year = date.getFullYear()
	  const month = date.getMonth() + 1
	  const day = date.getDate()
	  const hour = date.getHours()
	  const minute = date.getMinutes()
	  const second = date.getSeconds()
	
	  return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
	}
}

export default tools;