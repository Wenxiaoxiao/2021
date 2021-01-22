
const store = {
	tmplIds:['q--n1F8IbdTenuCKtsGDtdk5nVO0wYasduzkylx8BQM', 'PxZbuAvFdDgCrHXuoL6byyCOLSLtmj6nubWEi_Ydtgw'],
    WTS_USER_XCX:null,
    token:"",
    env:"1",
    // domain:["https://bx.wts9999.net","https://bx.wts999.com"],
    domain:["https://bx.wts9999.net","https://bx.wts999.com"],
    share:{},
	platform: '', // ios/andriod平台
	login: false,  // 是否登录
	token: ''
    // token:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3dCIsImlhdCI6MTU1ODkyNzM1NywidWlkIjoxMTI2MzY3MjYyNDAyMzE4MzM3LCJvaWQiOiJvYzd4RXYwV1hqcU44SFVWeW84NEY4VVVQTXBZIiwiaXNzIjoid3MiLCJ1c2VyIjp7ImlkIjoxMTI2MzY3MjYyNDAyMzE4MzM3LCJlbmFibGUiOm51bGwsInJlbWFyayI6bnVsbCwiY3JlYXRlQnkiOm51bGwsImNyZWF0ZVRpbWUiOm51bGwsInVwZGF0ZUJ5IjpudWxsLCJ1cGRhdGVUaW1lIjpudWxsLCJrZXl3b3JkIjpudWxsLCJuaWNrbmFtZSI6IuetseiqnidcdUQ4M0RcdURFMDciLCJoZWFkaW1ndXJsIjoiaHR0cHM6Ly9zdGF0aWMud3RzOTk5OS5uZXQvaGVhZEltYWdlL28tV1JLd1ZGbUhfYjNDN3VaTjQtb2ZzSVl1OG8uanBnIiwic2V4IjoiMiIsImJpcnRoZGF5IjpudWxsLCJwcm92aW5jZSI6Ium7kem-meaxnyIsImNpdHkiOiLlk4jlsJTmu6giLCJlbWFpbCI6bnVsbCwibW9iaWxlMSI6InYyXzMwNWUzNzRhYzcwMmU1ZjlmMGRhN2I2MjMzODYwZjUwIiwibW9iaWxlMiI6IlltSXlNell6WVRNdE5UVXhOeTAwTURKaUxUazFNVE10WkRreU5UQTBPRGc1TlRkbVNrRlFVV0Y1VWpoRWFXTlZVMDVSVFhFelFuYzJVakp3YkhweWFraDRVbVpCUVVGQlFVRkJRVUZCUkZCMVJXMUNaMHBCWTJwWWExVXdLMFJZZDAxV2IyOTRkMDlrV1RSdmRreFRiMnBxVkUxREwyZEdTRVZqT0c5dE5WTkJXbmRRQGpQQTdJMkdFaDJYWjU3OHZwS2ROY3E9PSIsIm1vYmlsZSI6IjE1NSoqKiowMjE3IiwidW5pb25pZCI6Im9jN3hFdjBXWGpxTjhIVVZ5bzg0RjhVVVBNcFkiLCJvcGVuaWQiOiJvLVdSS3dWRm1IX2IzQzd1Wk40LW9mc0lZdThvIiwic2VydmVyQ29kZSI6Ind4IiwiaW1laSI6IkVEMDI2NDZCLTg2RUEtNENDNi05OUQyLTA1QzM1RDk0QUIyQiIsImRldmljZU5vIjpudWxsLCJkZXZpY2VUeXBlIjoyLCJkZXZpY2VCcmFuZCI6IkFwcGxlIiwiYXBwVmVyc2lvbiI6IjQuMS4xIiwiY3VycmVudENsaWVudEZsYWciOiJvYzd4RXYwV1hqcU44SFVWeW84NEY4VVVQTXBZIiwiYXBwSW5mbyI6eyJpbWVpIjoiRUQwMjY0NkItODZFQS00Q0M2LTk5RDItMDVDMzVEOTRBQjJCIiwiZGV2aWNlTm8iOm51bGwsImRldmljZVR5cGUiOjIsImRldmljZUJyYW5kIjoiQXBwbGUiLCJhcHBWZXJzaW9uIjoiNC4xLjEifSwid3hJbmZvIjp7Im5pY2siOiLnrbHoqp4nXHVEODNEXHVERTA3IiwiaGVhZEltYWdlIjoiaHR0cHM6Ly9zdGF0aWMud3RzOTk5OS5uZXQvaGVhZEltYWdlL28tV1JLd1ZGbUhfYjNDN3VaTjQtb2ZzSVl1OG8uanBnIiwib3BlbmlkIjoiby1XUkt3VkZtSF9iM0M3dVpONC1vZnNJWXU4byIsInVuaW9uaWQiOiJvYzd4RXYwV1hqcU44SFVWeW84NEY4VVVQTXBZIiwic2V4IjoiMiIsInByb3ZpbmNlIjoi6buR6b6Z5rGfIiwiY2l0eSI6IuWTiOWwlOa7qCJ9fX0.s8Z9VNG8Q5LZ0etdXideenRitx5XNbxEcvocqdHBOfumL8224bwnBRabNVSR-uY3dXoop88JX5-fwcYBU7WNqA",
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
    //   id: "1126367262402318337",
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

export default store
