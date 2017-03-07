/**
 * 应用商店相关
 */
var store = (function() {

    var _store = {
        default : {
            widgetParam : null,
            isIOS : isIOS, //common.js文件中已有声明
            opening : 0,
        },
        /**
         * 初始化应用商店
         */
        init : function() {
            var self = this;
            appcan.window.subscribe("GET_STORE_APP_TILES", function(m) {
                uexAppStoreMgr.getTiles();
            });

            appcan.window.subscribe("GET_STORE_APP_VERSION_INFO", function(m) {
                uexAppStoreMgr.getAppVersionInfo(m);
            });
            appcan.window.subscribe("EPORTAL_LOAD_APP", function(m) {
                if (m) {
                    var appInfo = JSON.parse(m);
                    var action = m.action ? m.action : null;
                    self.startAppFromStore(appInfo.appId, appInfo.param, action);
                }
            });
            appcan.window.subscribe("EPORTAL_LOAD_APP_EX", function(m) {
                if (m) {
                    self.gotoApp(m);
                }
            });

            appcan.window.subscribe("YGET_APPLIST", function() {
                var dataJson = {
                    "type" : "searchAppList",
                    "key" : ""
                };
                uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
            });
            appcan.window.subscribe("START_WGT", function(data) {
                var data = JSON.parse(decodeURIComponent(data));
                var appCategory = data.appCategoryName ? data.appCategoryName : data.appCategory;
                switch (appCategory) {
                case  "AppCanNative":
                    self.startWgt(data);
                    break;
                case  "AppCanWgt":
                    self.default.widgetParam = '';
                    self.startWgt(data);
                    break;
                case  "Web":
                    var json = {
                        name : data.name,
                        url : data.pkgUrl,
                        "extraInfo" : {
                            "opaque" : "true",
                            "bgColor" : "#ecf3f7",
                            "delayTime" : "250"
                        }
                    }
                    appcan.setLocVal("CARD_PARAM", json);
                    appcan.window.open("webWind", "webWind.html", 10)
                    break;
                case  "Native":
                    self.startWgt(data);
                    break;

                }
            })
            self.initDownloadWidget();
            uexAppStoreMgr.cbGetAppList = function(mid, type, data) {
                log("【store.js】uexAppStoreMgr.cbGetAppList mid = " + mid + " type = " + type + " data = " + data);
                data = data.replace(/\r\n/g, '<br>');
                appcan.window.publish("YGET_APPLIST_CB", data);
            };

            uexAppStoreMgr.cbGetTiles = function(a, b, c) {
                log("【store.jss】uexAppStoreMgr.cbGetAppList");
                c = c.replace(/\r\n/g, '<br>');
                appcan.window.publish("CB_GET_STORE_APP_TILES", c)
            };

            uexAppStoreMgr.cbGetAppVersionInfo = function(opId, dataType, data) {
                log("【store.jss】uexAppStoreMgr.cbGetAppList");
                data = data.replace(/\r\n/g, '<br>');
                appcan.window.publishForJson("CB_GET_STORE_APP_VERSION_INFO", data)
            };
            uexAppStoreMgr.cbGetAppStoreHost = function(a,b,c){
                uexAppStoreMgr.open(c);
            }
            uexAppStoreMgr.getAppStoreHost();
        },
        /**
         * 初始下载子应用
         */
        initDownloadWidget : function() {
            var self = this;
            var percents = -1;
            uexAppStoreMgr.cbLoadWidget = function(a, b, c) {
                log("uexAppStoreMgr.cbLoadWidget a = " + a + " b = " + b + " c = " + c);
                percents = -1;
                var obj = JSON.parse(c);
                var status = obj.status;
                if (status == 0) {
                    uexToast.close();
                } else if (status == 1) {
                    uexToast.close();

                    appcan.window.publish("UPDATE_CHILD_APP_STATUS", obj.data.appId);
                    if (self.default.opening == 1)
                        return;
                    var STR_WIDGET_OPENING = tools.getString("STR_WIDGET_OPENING");
                    appcan.window.openToast(STR_WIDGET_OPENING);
                    self.default.opening = 1;
                    if ( typeof (self.default.widgetParam) != "string") {
                        self.default.widgetParam = JSON.stringify(self.default.widgetParam);
                    }
                    uexWidget.cbStartWidget = function(opId, dataType, data) {
                        self.default.opening = 0;
                        appcan.window.closeToast();
                    };
                    uexWidget.startWidget(obj.data.appId, '10', '', self.default.widgetParam, '250', obj.data.appKey);
                } else if (status == 2) {
                    uexToast.close();
                    self.default.opening = 0;
                    self.startWgt(obj.data);
                }else if(status == 4){//原生app取消安装
                    uexToast.close();
                    var STR_APPS_NOT_INSTALLED = tools.getString("STR_APPS_NOT_INSTALLED");
                    appcan.window.openToast(STR_APPS_NOT_INSTALLED,1500);
                }
            };
            //退出按钮点击状态回调
            uexToast.cbExitBtnOnClick = function() {
            };
            uexToast.onOutOfViewTouch = function() {
            };
            uexAppStoreMgr.onStartDownload = function() {
                percents = -1;
                uexToast.open("loading...", "#25a1fc", "#ffffff", "", "3", "", "1");
                uexAppStoreMgr.cbGetProgress = function(a, b, c) {
                    if (c - percents >= 2) {
                        uexToast.updateLoading(c);
                        percents = c;
                    }

                    if (c >= 100) {
                        uexToast.close();
                        percents = -1;
                        //发送更新子应用状态广播
                        appcan.window.publish("UPDATE_CHILD_APP_STATUS", '');
                    }
                }
            };
        },
        /**
         * 启动子应用
         * @param appInfo
         */
        startWgt : function(appInfo) {
            var self = this;
            log("startWgt appInfo = " + JSON.stringify(appInfo));
            var json = JSON.stringify(appInfo);
            if (!isDefine(appInfo.serviceStatus) || appInfo.serviceStatus == 2) {
                uexAppStoreMgr.loadWidget(json);
            } else {
                var TIP_NOTICE = tools.getString("TIP_NOTICE");
                var BTN_OK = tools.getString("BTN_OK");
                var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");
                appcan.window.alert({
                    title : TIP_NOTICE,
                    content : STR_STORE_NORIGHT + "：400-040-1766",
                    buttons : [BTN_OK],
                    callback : function(err, data1, dataType, optId) {

                    }
                });
            }
        },
        /**
         * 提醒、推送等跳转
         */
        gotoApp : function(info) {
            if ( typeof (info) == "string") {
                info = JSON.parse(info);
            }

            if (info.action.type) {
                switch (info.action.type) {
                case 'openWindow':
                case 'openwindow':
                    appcan.window.open(info.param.name, info.param.data, info.param.aniId, info.param.type);
                    break;
                case 'openWEB':
                    appcan.setLocVal("CARD_PARAM", info.param);
                    appcan.window.open("webWind", "webWind.html", 10);
                    break;
                case 'startWgt':
                    self.startAppFromStore(info.action.widget.appId, info.param);
                    break;
                case 'openNative':
                    self.startAppFromStore(info.action.appId, info.param);
                    break;
                case 'openNativeOther':
                    getNativeApp(info.param);
                    break;
                default:
                    break;
                }
            }

        },
        /**
         * 提醒等跳转进入子应用
         * @param appId
         * @param param
         * @param action
         */
        startAppFromStore : function(appId, param, action) {
            var self = this;
            log("startAppFromStore appId = " + appId + " param = " + param + " action = " + action);
            var data = appcan.getLocVal("CACHE_APPS_LIST") || appcan.locStorage.val("STORE_APP_INFO");
            log("startAppFromStore data = " + data);
            data = JSON.parse(data);
            self.default.widgetParam = param;
            for (var i in data) {
                if (data[i].appId == appId) {
                    if (!isDefine(data[i].serviceStatus) || data[i].serviceStatus == 2) {
                        if (action == "Web" || action == "openWEB") {
                            var json = {
                                name : data[i].name,
                                url : data[i].pkgUrl,
                                "extraInfo" : {
                                    "opaque" : "true",
                                    "bgColor" : "#ecf3f7",
                                    "delayTime" : "250"
                                }
                            };
                            appcan.setLocVal("CARD_PARAM", json);
                            appcan.window.open("webWind", "webWind.html", 10)
                        } else
                            self.startWgt(data[i]);
                        break;
                    } else {
                        var TIP_NOTICE = tools.getString("TIP_NOTICE");
                        var BTN_OK = tools.getString("BTN_OK");
                        var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");
                        appcan.window.alert({
                            title : TIP_NOTICE,
                            content : STR_STORE_NORIGHT + "：400-040-1766",
                            buttons : [BTN_OK],
                            callback : function(err, data1, dataType, optId) {
                            }
                        });
                    }
                }
            }
        }
    }
    return {
        init : _store.init.bind(_store),
    }
})();
appcan.ready(function() {
    store.init();
})

