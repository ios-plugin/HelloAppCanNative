/**
 * Created by waka on 2016/10/28.
 */

/**
 * 提示语字符串
 */
var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");//服务器返回数据异常，请联系管理员
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");//网络异常，请检查网络
var STR_LOGINING = tools.getString("STR_LOGINING");//登录中，请稍候
var STR_ACCESS_TO_INFOR = tools.getString("STR_ACCESS_TO_INFOR");//获取信息中
var STR_LOADING = tools.getString("STR_LOADING");//数据加载中，请稍后

/**
 * EMM登录锁
 *
 * @type {boolean}
 */
var lockEMMLogin = false;

/**
 * 前台登录
 *
 * @param loginData 登录时需要的数据：1.帐号；2.密码
 */
function loginEMMForeground(loginData) {
    try {

        if (lockEMMLogin) {
            return;
        }
        lockEMMLogin = true;

        log("【login.js】 loginEMMForeground 前台登录 loginData = " + JSON.stringify(loginData) + " typeof:" + typeof loginData);
        /**
         * 插件:调用EMM登录
         */
        appcan.setLocVal("IS_LOGIN_BACKGROUND", false);//是否后台登录标识，置为false
        appcan.window.openToast(STR_LOGINING);//登录中，请稍候
        uexEMM.cbLogin = function (opId, dataType, data) {
            try {
                log("【login.js】前台登录 uexEMM.cbLogin data = " + data + " type of = " + typeof data);
                appcan.window.closeToast();
                data = data.replace(/\r\n/g, '<br/>');//原因：返回数据中有子应用描述；里面的特殊字符会导致JSON.parse解析出错；所以做一个转换操作；将回车符替换为<br/>标签
                var dataObj = JSON.parse(data);
                //登录失败
                if (dataObj.status == 'fail') {
                    //TODO EMM登录失败
                    var error = {
                        status: dataObj.status,
                        msg: {
                            message: dataObj.info
                        }
                    };
                    log("loginEMMForeground uexEMM.cbLogin 失败 = " + JSON.stringify(error));
                    lockEMMLogin = false;
                    global_error(error);
                    return;
                }

                /*-------------------------登录成功-------------------------*/

                /**
                 * 保存用户名和密码
                 */
                var loginDataObj = JSON.parse(loginData);
                appcan.setLocVal("loginName", loginDataObj.loginName);
                if ($(".check1").hasClass("uhide")) {
                    appcan.setLocVal("loginPass", loginDataObj.loginPass);
                } else {
                    appcan.setLocVal("loginPass", '');
                }
                if(uexMDM){
                    uexMDM.login();
                }
                /**
                 * 缓存数据
                 */
                appcan.setLocVal("emmToken", JSON.stringify(dataObj));//写入或更新locStorage中的数据
                appcan.setLocVal("userId", dataObj.info.uniqueField);
                appcan.window.open("index", "index.html", 10);//打开主页

            } catch (e) {
                errorDetail(e);
                appcan.window.openToast(STR_NETWORDERROR, 1500, 5);
            }
        };
        uexEMM.login(loginData);
    } catch (e) {
        errorDetail(e);
    }
}
