var STR_APPS_OPEN = tools.getString("STR_APPS_OPEN");
var STR_APPS_DOWNLOAD = tools.getString("STR_APPS_DOWNLOAD");
var STR_APPS_DELETE = tools.getString("STR_APPS_DELETE");
var TIP_NOTICE = tools.getString("TIP_NOTICE");
var BTN_OK = tools.getString("BTN_OK");
var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");

//加载并初始化模板对象
var appTemplate = loadTemplate("assets/templates/appitem.tpl");
var curChatTarget = null;
var appView = Backbone.View.extend({//options...
    initialize: function (option) {
        this.model.view = this;
        this.render();
    },
    template: appTemplate, //VIEW对应的模板
    render: function () {
        var self = this;
        this.$el = $(this.template({
            data: this.model.attributes,
            setState: this.setState,
            removeTip: this.removeTip
        }));
        this.bindingEvents();
        return this;
    },
    removeTip: function () {
        return STR_APPS_DELETE;
    },
    setState: function (state, type) {
        var appState = '';
        if (type == "AppCanWgt" || type == "Web" || type == "Native" || type == "AppCanNative") {
            if (parseInt(state) || type == "Web") {
                appState = '<div class="all-padd7 border-radius uc-a1">' +
                    '<div class="ulev-1 color-primary">' + STR_APPS_OPEN + '</div>' +
                    '</div>';
            } else {
                appState = '<div class="all-padd7 border-radius uc-a1">' +
                    '<div class="ulev-1 color-primary">' + STR_APPS_DOWNLOAD + '</div>' +
                    '</div>';
            }
        }
        return appState;
    },
    bindingEvents: function () {
        var self = this;
        appcan.button($(".scroll-bar", this.$el), "", function () {
            self.conver();
        });
        appcan.button($(".scroll-right", this.$el), "", function () {
            uexAppStoreMgr.cbDeleteMyApps = function (opId, dataType, data) {
                //appcan.window.publish("YGET_APPLIST",'');
                self.model.set("state", 0);
                var width = $(".scroll-right", this.$el).width();
                $(".scroll-bar", self.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
            };
            var appinfo = [];
            var info = self.model.toJSON();
            appinfo.push(info);
            uexAppStoreMgr.deleteMyApps(JSON.stringify(appinfo));
        });
        $(this.$el).on("touchstart", function () {
            curChatTarget = self;
        });
    },
    // 向左滑动
    swipeLeft: function () {
        if (this.isCanSwipe()) {
            var width = $(".scroll-right", this.$el).width();
            $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(-" + width + "px)");
        }
    },
    // 向右滑动
    swipeRight: function () {
        if (this.isCanSwipe()) {
            var width = $(".scroll-right", this.$el).width();
            $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
        }
    },
    // 是否可以滑动
    isCanSwipe: function () {
        var state = this.model.get("state");
        var appCategory = this.model.get("appCategoryName") || this.model.get("appCategory");
        if ((appCategory) == "AppCanWgt" && parseInt(state) == 1) {
            return true;
        }
        return false;
    },
    updateView: function (model) {
        var self = this;
        if (this.model.hasChanged("iconLoc")) {
            var imgIcon = this.model.get("iconLoc");
            if (imgIcon) {
                $("div.lazy", self.el).data("original", imgIcon)
                $("div.lazy", self.el).lazyload({
                    cache: true
                });
            }
        }
        if (this.model.hasChanged("name")) {
            var name = this.model.get("name");
            $(".name", this.$el).html(name);
        }
        if (this.model.hasChanged("curVersion")) {
            var curVersion = this.model.get("curVersion");
            $(".curVersion", this.$el).html(curVersion);
        }
        if (this.model.hasChanged("state")) {
            var state = this.model.get("state");
            var appCategory = this.model.get("appCategoryName") || this.model.get("appCategory");
            $(".state", this.$el).html(this.setState(state, appCategory));
        }
    },
    conver: function () {
        var data = this.model.toJSON();
        appcan.window.publish("START_WGT", JSON.stringify(data));
    }
});

//列表容器VIEW
var appManageView = Backbone.View.extend({//options...

    initialize: function () {
        this.collection = new appCollection();
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
        // this.showView();
    },
    el: '#applist ul', //VIEW 对应 HTML 元素CSS选择器
    load: function () {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        this.collection.fetch({
            success: function (cols, resp, options) {
                endPullDownRefreshLately();
                log('【appManage_content.js】load fetch success');
                if (self.collection.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }
            },
            error: function (cols, error, options) {
                endPullDownRefreshLately();
                //TODO 在这里将uexAppStoreMgr.cbGetAppList返回的错误信息打出来
                log('alert', '【appManage_content.js】load fetch error');
            },
            add: true,
            remove: true,
            merge: true
        });
    },
    add: function (model) {
        try {
            var view = new appView({
                model: model
            });
            this.$el.append(view.$el);
            $(".lazy", view.$el).lazyload({
                cache: true
            });

        } catch (e) {
        }
    },
    updateView: function (model, a) {
        var view = model.view;
        if (view) {
            //this.$el.append(view.$el);
            view.updateView(model);
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    },
    showView: function () {
        var apps = appcan.getLocVal("CACHE_APPS_LIST") || '[]';
        if (apps != '[]') {
            try {
                apps = JSON.parse(apps);
                this.collection.set(apps);

            } catch (e) {

            }
        }
    }
});

var appManageViewInstance = new appManageView();

appcan.ready(function () {

    appManageViewInstance.showView();

    try {
        var param = {
            isSupport: true
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
    } catch (e) {
    }

    /**
     *  初始化下拉刷新
     */
    initPullDownRefresh(
        //下拉刷新的回调
        function () {
            log("下拉刷新");
            appManageViewInstance.load();
        }
        //上拉到底部的回调
        , function () {
            log("上拉加载");
        }
        //是否显示提示语
        , true
    );

    pullDownRefresh();//手动调用下拉刷新

    appcan.window.swipeLeft(function () {
        curChatTarget && curChatTarget.swipeLeft();
        curChatTarget = null;
    });

    appcan.window.swipeRight(function () {
        curChatTarget && curChatTarget.swipeRight();
        curChatTarget = null;
    });

    /**
     * 接收更新子应用状态广播
     */
    appcan.window.subscribe("UPDATE_CHILD_APP_STATUS", function (m) {
        log("【appManage_content.js】 接收更新子应用状态广播 UPDATE_CHILD_APP_STATUS");
        if(m){
            var cur = appManageViewInstance.collection.get(m);
            cur.set({"state": 1})
        }else{
            appManageViewInstance.load();  
        }
        
    });

});

