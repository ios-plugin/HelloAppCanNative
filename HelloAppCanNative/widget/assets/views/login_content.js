try {
    var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");//网络不可用，请检查网络设置
    var loginView = Backbone.View.extend({//options...
        initialize: function () {
            this.stickit();
            var self = this;
            //登录点击事件
            appcan.button("#btn", "btn-act", function () {
                self.submitLogin();
            });
            //记住密码事件
            appcan.button(".pswCheck", "btn-act", function () {
                var isTure = $(".check2").hasClass("uhide");
                if (isTure) {
                    $(".check2").removeClass("uhide");
                    $(".check1").addClass("uhide");
                } else {
                    $(".check1").removeClass("uhide");
                    $(".check2").addClass("uhide");
                }
            });
            
        },
        model: new loginModel(),
        el: '#login',
        events: {
            'submit': 'submitLogin'
        },
        bindings: {
            "#username": {
                observe: 'loginName',
                updateModel: 'validUname'
            },
            "#password": "loginPass",
            "#domainName": {
                observe: "domainName",
            }
        },
        validUname: function (val, event, options) {
            return true;
        },
        lock: false,
        //登录
        submitLogin: function () {
            //取消焦点
            $("#username")[0].blur();//blur方法取消焦点
            $("#password")[0].blur();
            //校验输入
            if (!this.model.isValid()) {
                appcan.window.openToast(this.model.validationError, 1500, 5);
                return false;
            }
            
            //前台登录
            loginEMMForeground(JSON.stringify(this.model));
            return false;
        },
        getProperty: function () {
            var self = this;
            //获取认证字段以及用户域接口回调
            self.model.set("domainName", domainName);
        }
    });

    var loginViewInstance = new loginView();


} catch (e) {
    errorDetail(e);
}