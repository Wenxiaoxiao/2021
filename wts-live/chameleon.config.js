// 设置静态资源的线上路径
const publicPath = '/';
// 设置api请求前缀
//dev环境
// const devHttpUrl = 'https://bx.wts9999.net';
const devHttpUrl = 'https://bx.wts999.com';
//build环境
// const buildHttpUrl = 'https://bx.wts9999.net';
const buildHttpUrl = 'https://bx.wts999.com';

cml.config.merge({
    templateLang: "cml",
    templateType: "html",
    platforms: ["wx"],
    check: {
        enable: false,
    },
    buildInfo: {
        // wxAppId: 'wxcf6de2f6fc4c5fd7' //测试
        wxAppId: 'wxe83820da834838c9' //正式
    },
    wx: {
        dev: {
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