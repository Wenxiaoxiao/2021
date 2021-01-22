const filter = {
    // 字符串截取
    subString(value, length) {
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
    // 数字处理
    numberFormat(value) {
        value = parseInt(value);
        if (isNaN(value)) {
            return 0;
        }

        if (value >= 10000) {
            value = value + "";
            var len = value.length;
            value = value.slice(0, len - 3);
            return parseFloat(value / 10) + "万";
        } else {
            return value
        }
    },
    add0(m) {
        return m < 10 ? '0' + m : m
    },
    isToday(str) {
        var d = new Date(str);
        var todaysDate = new Date();
        if (todaysDate.getTime() - d.getTime() < 86400000) {
            return d.getHours() + ':' + this.add0(d.getMinutes()) + ':' + this.add0(d.getSeconds());
        } else {
            var mouth = d.getMonth() + 1;
            var day = d.getDate();
            return mouth + "月" + day;
        }
    },
    strToJson(str) {
        return JSON.parse(str);
    },
    getFullTime(timestamp) {
        var time = new Date(parseInt(timestamp));
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        return this.add0(year)+'.'+this.add0(month)+'.'+this.add0(date)+' '+this.add0(hours) + ':' + this.add0(minutes);
      },
    // 时间处理
    formatTime: function (time) {
        if (!time) {
            return;
        }
        var date = new Date(Number(time));

        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hours = date.getHours(),
            minute = date.getMinutes();
        var minuteTime = (hours < 10 ? "0" + hours : hours) + ":" + (minute < 10 ? "0" + minute : minute),
            monthTime = (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

        return year + "-" + monthTime + " " + minuteTime;
    },

    trustTime(inHisTime, pattern) {
        if (!inHisTime) {
            return;
        }
        inHisTime =
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
        } else if (pattern && pattern.toLowerCase() === "date") {
            //日期单独处理 显示 月-日
            return monthTime
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
    }
}
module.exports = filter