// 设置静态资源的线上路径
const publicPath = '/';
// 设置api请求前缀
//dev环境
// const devHttpUrl = 'https://bx.wts9999.net';
//const devHttpUrl = 'https://bx.wts999.com';
//const devHttpUrl = 'http://192.168.32.246:8091';//https://ai-test.wts9999.net
const devHttpUrl = 'https://ai-test.wts9999.net';
//build环境
// const buildHttpUrl = 'https://bx.wts9999.net';
//const buildHttpUrl = 'https://bx.wts999.com';
//const buildHttpUrl = 'http://192.168.32.246:8091';
const buildHttpUrl = 'https://ai-test.wts9999.net';

cml.config.merge({
    templateLang: "cml",
    templateType: "html",
    platforms: ["wx","alipay"],
    check: {
        enable: false,
    },
    buildInfo: {
        // wxAppId: 'wxcf6de2f6fc4c5fd7' //测试
        wxAppId: 'wx10d94d10a4b81869' //正式
    },
    wx: {
        dev: {
            publicPath: publicPath,
            apiPrefix: devHttpUrl
        },
        build: {
            publicPath: publicPath,
            apiPrefix: buildHttpUrl
        }
    },
    alipay: {
        dev: {
            apiPrefix: devHttpUrl
        },
        build: {
            publicPath: publicPath,
            apiPrefix: buildHttpUrl
        }
    },
    web: {
        dev: {
            analysis: false,
            console: false,
            apiPrefix: devHttpUrl
        },
        build: {
            analysis: false,
            // publicPath: `${publicPath}/web/`, 
            apiPrefix: buildHttpUrl
        }
    },
    weex: {
        dev: {
            apiPrefix: devHttpUrl
        },
        build: {
            // publicPath: `${publicPath}/weex/`,
            apiPrefix: buildHttpUrl
        },
        custom: {
            // publicPath: `${publicPath}/wx/`,
            apiPrefix: buildHttpUrl
        }
    }
})