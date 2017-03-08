try {

    var STR_ACCOUNT_EMPTY = tools.getString("STR_ACCOUNT_EMPTY");
    var STR_PASSWORD_EMPTY = tools.getString("STR_PASSWORD_EMPTY");
    var STR_COMPANY_EMPTY = tools.getString("STR_COMPANY_EMPTY");

    var loginModel = Backbone.Model.extend({
        initialize: function () {
            var upwd = appcan.getLocVal("loginPass");
            var uname = appcan.getLocVal("loginName");
            // var serverConfig = getServerConfig();
            var initData = {"domainName": domainName};
            if (uname) {
                initData.loginName = uname;
                if (isDefine(upwd)) {
                    initData.loginPass = upwd;
                    $(".check2").removeClass("uhide");
                    $(".check1").addClass("uhide");
                    //login();
                } else {
                    initData.loginPass = '';
                    $(".check1").removeClass("uhide");
                    $(".check2").addClass("uhide");
                }
            }
            this.set(initData);
        },
        parse: function (resp) {
            return resp;
        },
        validate: function (attrs, options) {
            if (!attrs.loginName) {
                return STR_ACCOUNT_EMPTY;
            }
            if (!attrs.loginPass) {
                return STR_PASSWORD_EMPTY;
            }
        },
        sync: function (method, model, options) {
            switch (method) {
                case "create":
                case "update":
                case "patch":
                    break;
                case "read":
                    break;
                case "delete":
                    break;
                default:
                    break;
            }
        }
    });

    

} catch (e) {
    errorDetail(e);
}