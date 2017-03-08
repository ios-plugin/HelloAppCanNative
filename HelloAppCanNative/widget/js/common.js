
/**
 * 4.50
 *
 1.启动上报接口 https://a.appcan.cn:20443/v4/
 2.推送绑定接口 https://a.appcan.cn:20443/gateway/
 3.Android推送接口 a.appcan.cn:21883
 4.统计接口  https://a.appcan.cn:20443/analyIn/4.0/service/
 *
 */
try{

    //判断平台类型
    var winPlat = window.navigator.platform;
    var isPhone = !(winPlat == 'Win32' || winPlat == 'Win64' || winPlat == 'MacIntel' || winPlat == 'Linux i686' || winPlat == 'Linux x86_64');
    var isSML = !isPhone;
    var isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0) || (window.navigator.userAgent.indexOf('Linux') >= 0);
    var isIOS = (winPlat == 'iPad' || winPlat == 'iPod' || winPlat == 'iPhone' || winPlat == 'iPod touch');
    /**
     * 常量
     */
    var CONSTANTS = {
        DOMAINNAME: 'domainName', //租户
    };
    var domainName = '企业移动门户统一认证';
    appcan.ready(function () {
        try {
            
            // 解决iOS 9下长按屏幕会出现放大镜的问题；每个页面都应该有
            uexWindow.disturbLongPressGesture && uexWindow.disturbLongPressGesture(1);
        } catch (e) {
            errorDetail(e);
        }
    });

    /**
     * 是否定义
     * @param para
     * @return {boolean}
     */
    function isDefine(para) {
        if (typeof para == 'undefined' || $.trim(para) == "" || para == "[]" || para == null || para == undefined || para == 'undefined' || para == '[]' || para == "null")
            return false;
        else
            return true;
    }


    /**
     * 获取年份//获取月份/获取日期
     * @param date
     * @param flag
     * @return {string}
     * @constructor
     */
    function NYR(date, flag) {
        // date = date.replace(/-/g,'/');
        if (date) {
            var da = new Date(date);
        } else {
            var da = new Date();
        }
        if (isDefine(flag)) {
            if (flag == 1) {
                return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
            } else {
                return ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
            }

        } else {
            var STR_YEAR = tools.getString("STR_YEAR");
            if (STR_YEAR != "年") {
                return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
            } else
                return da.getFullYear() + "年" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "月" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) + "日";
        }
    }

//获取小时//获取分
    function HM(date) {
        if (date) {
            var da = new Date(date);
        } else {
            var da = new Date();
        }
        var hour = da.getHours();
        if (hour < 10) {
            hour = "0" + hour;
        }
        var minutes = da.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hour + ":" + minutes;
    }


    function timeString2Timestamp(timeString) {
        return timestamp = Date.parse(new Date(timeString));
    }

    // 2015-02-06T19:28:14.815Z
    function toUTC(str) {
        str = str.replace(/-/g, "/");
        str = new Date(str);
        return str.getUTCFullYear() + "-" + formatNum(str.getUTCMonth() + 1) + '-' + formatNum(str.getUTCDate()) + 'T' + formatNum(str.getUTCHours()) + ":" + formatNum(str.getUTCMinutes()) + ":" + formatNum(str.getUTCSeconds()) + '.' + formatNum(str.getUTCMilliseconds()) + 'Z';
    }

    function formatNum(d) {
        if (Number(d) < 10) {
            return "0" + d;
        } else {
            return d;
        }
    }

    function zy_parse() {
        var params = {};
        var loc = String(document.location);
        if (loc.indexOf("?") > 0)
            loc = loc.substr(loc.indexOf('?') + 1);
        else
            loc = uexWindow.getUrlQuery();
        if (loc) {
            loc = String(loc);
            if (loc.indexOf("&") > 0) {
                var pieces = loc.split('&');
            } else {
                var pieces = [loc];
            }
            params.keys = [];
            for (var i = 0; i < pieces.length; i += 1) {
                var keyVal = pieces[i].split('=');

                params[keyVal[0]] = decodeURIComponent(keyVal[1]);
                params.keys.push(keyVal[0]);
            }
        }
        return params;
    }

    
    /**
     * 启动原生app，跟卡片所在的app没有关系的app
     *
     */
    function getNativeApp(param) {
        uexWidget.cbIsAppInstalled = function (info) {
            console.log('uexWidget.cbIsAppInstalled info = ' + info);
            var result = JSON.parse(info);
            if (!isIOS && result.installed == 0) {
                uexWidget.startApp(param.startMode, param.androidMainInfo, param.addInfo, param.androidOptInfo);
            } else if (isIOS && result.installed == 0) {
                uexWidget.loadApp(param.iosMainInfo + '://' + param.iosOptInfo);
            } else {
                if (!isIOS) {
                    uexWidget.startApp("1", "android.intent.action.VIEW", JSON.stringify({
                        "data": {
                            "scheme": param.androidPkgUrl
                        }
                    }));
                } else {
                    uexWidget.loadApp(decodeURIComponent(param.iosPkgUrl));
                }
            }
        };
        if (isIOS) {
            uexWidget.isAppInstalled(JSON.stringify({appData: param.iosMainInfo + '://'}));
        } else {
            var appdata = {appData: param.androidMainInfo};
            uexWidget.isAppInstalled(JSON.stringify(appdata));
        }
    }
 
    /**
     * em to px
     * @param em
     * @return {number}
     */
    function em2Px(em) {
        return parseInt($("body").css("font-size")) * em;
    }
}catch(e){
    errorDetail(e);
}
