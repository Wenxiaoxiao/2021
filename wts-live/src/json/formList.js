const ageList = [];
for (let i = 0; i <= 106; i++) {
    ageList.push(i + "岁");
};
// showType 1 按钮列表 2 下拉列表 3 城市选择列表
// radio 是否单选
export default [{
        "value": [],
        "valueObjet": { "key": "性别", "value": [] },
        "title": "1.您的性别",
        "info": "性别差异,风险不同",
        "showType": "1",
        "radio": true,
        "showButton": false,
        "list": [
            { "text": "男", "value": 1 },
            { "text": "女", "value": 2 },
        ]
    },
    {
        "value": [],
        "valueObjet": { "key": "地址", "value": [] },
        "title": "2.选择居住地",
        "info": "填好居住地也很重要哦",
        "showButton": true,
        "showType": "3",
    },
    {
        "value": [],
        "valueObjet": { "key": "家庭年收入", "value": [] },
        "title": "3.设置家庭收入",
        "info": "准确选择年收入,有助于精确的设计保障额度",
        "showButton": true,
        "showType": "2",
        "list": [
            "10万以下",
            "10-20万",
            "20-50万",
            "50-80万",
            "80万以上",
        ]

    },
    {
        "value": [],
        "title": "4.选择为谁投保",
        "valueObjet": { "key": "被保险人", "value": [] },
        "showType": "1",
        "showButton": true,
        "radio": false,
        "maxlength": 4,
        "list": [
            { "text": "本人", "value": 1 },
            { "text": "配偶", "value": 4 },
            { "text": "父亲", "value": 5 },
            { "text": "母亲", "value": 6 },
            { "text": "儿子", "value": 9 },
            { "text": "女儿", "value": 10 },
            { "text": "配偶父亲", "value": 7 },
            { "text": "配偶母亲", "value": 8 },
        ]
    },
    {
        "value": [],
        "title": "5.被保险人年龄",
        "info": "年龄是保费多少的先决条件",
        "showButton": true,
        "showType": "2",
        "ageList": ageList,
        "list": []
    },
    {
        "value": [],
        "title": "6.是否有社保",
        "info": "农村医保也算社保",
        "showButton": false,
        "radio": true,
        "showType": "1",
        "list": [
            { "text": "有", "value": 1 },
            { "text": "无", "value": 0 },
        ]
    },
    {
        "value": [],
        "title": "7.被保险人是否有既往病史",
        "info": "选择既往病史,可以淘汰掉不合适的投保产品",
        "showButton": true,
        "showType": "1",
        "list": [
            { "text": "无" },
            { "text": "家族遗传病" },
            { "text": "2年内住院" },
            { "text": "三高" },
            { "text": "甲状腺疾病" },
            { "text": "乳房肿块" },
            { "text": "妇科相关疾病" },
            { "text": "心脏病" },
            { "text": "乙肝" },
            { "text": "脂肪肝" },
            { "text": "糖尿病" },
            { "text": "良性肿瘤" },
            { "text": "任意部位结节" },
            { "text": "任意部位结石" },
            { "text": "任意部位囊肿" },
            { "text": "任意部位息肉" },
            { "text": "其他" },
        ]
    },
    {
        "value": [],
        "title": "8.设置您的职业",
        "info": "准确选择职业,将为您淘汰掉不合适的投保产品",
        "showType": "2",
        "showButton": true,
        "listObj": [
            { "text": "室内轻体力（行政、管理人员）", "value": "001" },
            { "text": "室内重体力（程序员）", "value": "002" },
            { "text": "户外简单工作（导游、司机）", "value": "003" },
            { "text": "户外复杂工作（工程师、建筑工人）", "value": "004" },
            { "text": "室内制造业（装修、流水线）", "value": "005" },
            { "text": "家庭主妇", "value": "006" },
            { "text": "学生及学龄前儿童", "value": "007" },
            { "text": "其他", "value": "008" },
        ],
        "list": [
            "室内轻体力（行政、管理人员）",
            "室内重体力（程序员）",
            "户外简单工作（导游、司机）",
            "户外复杂工作（工程师、建筑工人）",
            "室内制造业（装修、流水线）",
            "家庭主妇",
            "学生及学龄前儿童",
            "其他",
        ]
    },
    {
        "value": [],
        "title": "9.您的生活状况",
        "info": "小习惯里也有大隐患",
        "showType": "1",
        "showButton": true,
        "list": [
            { "text": "经常出差" },
            { "text": "忙于应酬" },
            { "text": "过度加班" },
            { "text": "久坐不动" },
            { "text": "经常抽烟" },
            { "text": "经常喝酒" },
            { "text": "自驾出行" },
            { "text": "喜欢旅游" },
            { "text": "过度肥胖" },
            { "text": "其他" },
        ]
    },

]