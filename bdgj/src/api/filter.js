const filter = {
  // 字符串截取
  subString (value, length) {
    if (!value) {
      return '';
    }
    value = value.trim ();
    if (value.length > length) {
      var first = value.toString ().substring (0, length);
      value = first + '...';
    }
    return value;
  },
  // 数字处理
  numberFormat (value) {
    value = parseInt (value);
    if (isNaN (value)) {
      return 0;
    }

    if (value >= 10000) {
      value = value + '';
      var len = value.length;
      value = value.slice (0, len - 3);
      return parseFloat (value / 10) + '万';
    } else {
      return value;
    }
  },

  //保单状态图标
  statusIcon (value) {
    if (value == '0' || value == '-2' || value == '3' || value == '99') {
      return 'icon-shijian1';
    } else if (
      value == '-4' ||
      value == '-3' ||
      value == '-1' ||
      value == '-6' ||
      value == '-7'
    ) {
      return 'icon-gantanhao11-copy';
    } else if (value == '1' || value == '4') {
      return 'icon-baocun';
    }
  },
  //新的保单状态图标
  newStatusIcon(value){
    if(typeof value !== "number") value = Number(value);
    let imgUrl;
    switch(value){
      case -1:
        imgUrl = 'ysx@2x';
        break;
      case 0:
        imgUrl = 'dfk@2x';
        break;
      case 1:
        imgUrl = 'bzz@2x';
        break;
      case -2:
        imgUrl = 'ytb@2x';
        break;
    }
    return imgUrl ? `${process.env.STATIC}personal-0812/${imgUrl}.png` : ''; 
  },
  //保单状态
  policyMyStatus (value) {
    if (value == '-1') {
      return '已终止';
    } else if (value == '0') {
      return '待保障';
    } else if (value == '1') {
      return '保障中';
    } else if (value == '-2') {
      return '已退保';
    }
  },
  // -1：失效（保单过期） 0：待保障 1：保障中 ,-2 :退保
  policyMyStatusDesc (status) {
    if (status == '-1') {
      return '您的保单已终止，您可重新投保';
    } else if (status == '0') {
      return '您有待支付订单，请继续支付';
    } else if (status == '1') {
      return '恭喜您成功获得保障';
    } else if (status == '-2') {
      return '您的保单已退保，请悉知';
    }
  },
  /**保单中心相关过滤 start */
  //根据产品类型判断是否显示保障金额
  policyLimit (content) {
    var val = '';
    if (
      (content.typeCode && content.typeCode.indexOf ('03') > -1) ||
      content.policyName.indexOf ('重疾') > -1
    ) {
      val = content.guaranteeQuota + '元';
    } else {
      val = '详见保障权益';
    }
    return val;
  },
  //受益人与被保险人关系
  paymentMyType (data) {
    var val = '';
    var method = {
      '2': '年缴',
      '4': '月缴',
      '3': '季缴',
      '6': '半年缴',
    };
    if (data.paymentType == '1') {
      val = '趸交';
    } else if (data.paymentType == '5') {
      val = '几日缴';
    } else if (
      data.paymentType == '2' ||
      data.paymentType == '3' ||
      data.paymentType == '4' ||
      data.paymentType == '6'
    ) {
      val = data.paymentPeriod + '年，' + method[data.paymentType];
    } else if (data.paymentType == '7') {
      val = '缴至' + data.paymentPeriod + '岁，年缴';
    } else if (data.paymentType == '8') {
      val = '缴至' + data.paymentPeriod + '岁';
    }
    return val;
  },
  // 日期字数控制
  timeNum (content, num) {
    if (!content) return;
    if (num < content.length) return content;
    return content.slice (0, num);
  },

  /**证件类型 */
  holderIdentifyType (content) {
    var val = '';
    switch (content) {
      case 1:
        val = '身份证';
        break;
      case 2:
        val = '护照';
        break;
      case 3:
        val = '军人证';
        break;
      case 4:
        val = '出生证';
        break;
      case 5:
        val = '港澳台同胞证';
        break;
      case 6:
        val = '户口本';
        break;
      case 7:
        val = '港澳居民来往内地通行证';
        break;
      case 8:
        val = '港澳台通行证';
        break;
      case 9:
        val = '出生证明';
        break;
      case 10:
        val = '企业三合一证';
        break;
      case 99:
        val = '其它';
        break;
    }
    return val;
  },
  memberList () {
    return [
      {
        type: '1',
        value: '本人',
      },
      {
        type: '2',
        value: '父母',
      },
      {
        type: '3',
        value: '儿女',
      },
      {
        type: '4',
        value: '配偶',
      },

      {
        type: '5',
        value: '兄弟姐妹',
      },
      {
        type: '6',
        value: '祖父母，外祖父母',
      },
      {
        type: '7',
        value: '祖孙，外祖孙',
      },
      {
        type: '8',
        value: '其它',
      },
      {
        type: '9',
        value: '丈夫',
      },
      {
        type: '10',
        value: '妻子',
      },
      {
        type: '11',
        value: '父亲',
      },
      {
        type: '12',
        value: '母亲',
      },
      {
        type: '13',
        value: '儿子',
      },
      {
        type: '14',
        value: '女儿',
      },
      {
        type: '15',
        value: '孙子',
      },
      {
        type: '16',
        value: '孙女',
      },
      {
        type: '17',
        value: '外孙',
      },
      {
        type: '18',
        value: '外孙女',
      },
    ];
  },
  insuranceRelationship (content) {
    //受益人与被保险人关系
    var val = '';
    content = Number (content);
    switch (content) {
      case 1:
        val = '本人';
        break;
      case 2:
        val = '父母';
        break;
      case 3:
        val = '子女';
        break;
      case 4:
        val = '配偶';
        break;
      case 5:
        val = '兄弟姐妹';
        break;
      case 6:
        val = '祖父母，外祖父母';
        break;
      case 7:
        val = '祖孙，外祖孙';
        break;
      case 8:
        val = '其他';
        break;
      case 9:
        val = '丈夫';
        break;
      case 10:
        val = '妻子';
        break;
      case 11:
        val = '父亲';
        break;
      case 12:
        val = '母亲';
        break;
      case 13:
        val = '儿子';
        break;
      case 14:
        val = '女儿';
        break;
      case 15:
        val = '孙子';
        break;
      case 16:
        val = '孙女';
        break;
      case 17:
        val = '外孙';
        break;
      case 18:
        val = '外孙女';
        break;
    }
    return val;
  },
  //评论等级
  levels (level) {
    if (!level) return;
    var l = '<span class="xx"></span>';
    var html = '';
    for (var i = 0; i < Number (level); i++) {
      html += l;
    }
    return html;
  },
};
module.exports = filter;
