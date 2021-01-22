
const state = {
    WTS_USER_XCX:null,
    token:"",
    dev:"1",
    // domain:["https://bx.wts9999.net","https://bx.wts999.com"],
    domain:["https://bx.wts9999.net","https://bx.wts999.com"],
    share:{},
	platform: '', // ios/andriod平台
	login: false,  // 是否登录
	//token:'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3dCIsImlhdCI6MTU5MDcxNzk4NiwidWlkIjoxMjU1NDEwMjczNDI2MjY4MTYxLCJvaWQiOiJvTmlIajBYYTVYRGNDZk1lTS1hbjhnUXBBNW9FIiwiaXNzIjoid3MiLCJ1c2VyIjp7ImlkIjoxMjU1NDEwMjczNDI2MjY4MTYxLCJlbmFibGUiOm51bGwsInJlbWFyayI6bnVsbCwiY3JlYXRlQnkiOm51bGwsImNyZWF0ZVRpbWUiOm51bGwsInVwZGF0ZUJ5IjpudWxsLCJ1cGRhdGVUaW1lIjpudWxsLCJrZXl3b3JkIjpudWxsLCJuaWNrbmFtZSI6IueOi-S6rCIsImhlYWRpbWd1cmwiOiJodHRwczovL3N0YXRpYy53dHM5OTkuY29tLy9oZWFkSW1hZ2Uvb1RqVkkwdXkzM0ZqOVRuTUx0UUtfdlBhaTJkay5qcGciLCJzZXgiOm51bGwsImJpcnRoZGF5IjpudWxsLCJwcm92aW5jZSI6bnVsbCwiY2l0eSI6bnVsbCwiZW1haWwiOm51bGwsIm1vYmlsZTEiOm51bGwsIm1vYmlsZTIiOm51bGwsIm1vYmlsZSI6bnVsbCwidW5pb25pZCI6Im9OaUhqMFhhNVhEY0NmTWVNLWFuOGdRcEE1b0UiLCJvcGVuaWQiOm51bGwsInNlcnZlckNvZGUiOiJ3eCIsImltZWkiOm51bGwsImRldmljZU5vIjpudWxsLCJkZXZpY2VUeXBlIjpudWxsLCJkZXZpY2VCcmFuZCI6bnVsbCwiYXBwVmVyc2lvbiI6bnVsbCwiY3VycmVudENsaWVudEZsYWciOiJvVGpWSTB1eTMzRmo5VG5NTHRRS192UGFpMmRrIiwiYXBwSW5mbyI6eyJpbWVpIjpudWxsLCJkZXZpY2VObyI6bnVsbCwiZGV2aWNlVHlwZSI6bnVsbCwiZGV2aWNlQnJhbmQiOm51bGwsImFwcFZlcnNpb24iOm51bGx9LCJ3eEluZm8iOnsibmljayI6IueOi-S6rCIsImhlYWRJbWFnZSI6Imh0dHBzOi8vc3RhdGljLnd0czk5OS5jb20vL2hlYWRJbWFnZS9vVGpWSTB1eTMzRmo5VG5NTHRRS192UGFpMmRrLmpwZyIsIm9wZW5pZCI6bnVsbCwidW5pb25pZCI6Im9OaUhqMFhhNVhEY0NmTWVNLWFuOGdRcEE1b0UiLCJzZXgiOm51bGwsInByb3ZpbmNlIjpudWxsLCJjaXR5IjpudWxsfX19.FFmz_aTSZD7op63LUVk1b_Or-_ysrHBkXY4ToToE6Pywb1X8fqDRSRMb6SAV-4B76FKOcwN876ZaZrSPa-hqJw',
    // WTS_USER_XCX: {
    //   appInfo: {
    //     "appVersion": "4.1.1",
    //     "deviceBrand": "Apple",
    //     "deviceNo": "",
    //     "deviceType": "2",
    //     "imei": "E09E613F-4689-484F-8365-4781076D8E9E"
    //   },
    //   appVersion: "4.1.1",
    //   birthday: null,
    //   city: "随州",
    //   createBy: null,
    //   createTime: null,
    //   currentClientFlag: "oc7xEvzmZVpE4Eci1NdLcZTEZh0k",
    //   deviceBrand: "Apple",
    //   deviceNo: "",
    //   deviceType: "2",
    //   email: "",
    //   enable: null,
    //   headimgurl: "https://static.wts9999.net/headImage/o-WRKwSLbNnwjJzJQ6ycwiecA0wE.jpg",
    //   id: "1255410273426268161",
    //   imei: "E09E613F-4689-484F-8365-4781076D8E9E",
    //   keyword: "",
    //   mobile: "156****2305",
    //   mobile1: "v2_35a14847050fdb2cb314bc59995198f0",
    //   mobile2: "DEV.NDcyOTdkOGQtZmJmNS00NTc4LWJlY2UtMzMwNjNkZTBmMTc4TW5YN1JsM0RFM2RvUWNiTVBzVldIcDQ3d0xmaStaWmxBQUFBQUFBQUFBQTd3SVY4WndtYnlidnc4WFh1ZE4yWlppZkpkRkpNUzNmS0o3bjBiWmJjOEo1dU1IN1BTUjBH@Z6yGF59MNFGUQ9+82BIOz7==",
    //   nickname: "凡。",
    //   openid: "o-WRKwSLbNnwjJzJQ6ycwiecA0wE",
    //   province: "湖北",
    //   remark: "",
    //   serverCode: "wx",
    //   sex: "1",
    //   unionid: "oc7xEvzmZVpE4Eci1NdLcZTEZh0k",
    //   updateBy: null,
    //   updateTime: null,
    //   wxInfo: {
    //     "city": "随州",
    //     "headImage": "https://static.wts9999.net/headImage/o-WRKwSLbNnwjJzJQ6ycwiecA0wE.jpg",
    //     "nick": "凡。",
    //     "openid": "o-WRKwSLbNnwjJzJQ6ycwiecA0wE",
    //     "province": "湖北",
    //     "sex": "1",
    //     "unionid": "oc7xEvzmZVpE4Eci1NdLcZTEZh0k"
    //   }
    // }
    
}

export default state
