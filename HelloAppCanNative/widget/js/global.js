try {

    var tplBaseUrl = "";

 
    function loadTemplate(tpl, cb) {
        var template = null;
        $.ajax({
            url: tplBaseUrl + tpl,
            type: 'GET',
            data: {}, //默认从参数获取
            timeout: 10000,
            async: false,
            success: function (data) {
                template = _.template(data);
                if (cb) cb(template);
            },
            error: function (e) {
                if (cb) cb(template);
            }
        });
        return template;
    }

    var toolsReg = {
        TEL_REG: /^((13[0-9])|(15([0-3]|[5-9]))|(17[6-8])|(18[0,3-9]))\d{8}$/,//手机
        EMAIL_REG: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        PHONE_REG: /^\+?\d{3,4}[ ,-]?\d{7,12}$/,//座机
    };

    function global_error(error) {
        appcan.window.openToast(error.msg.message, 1500, 5);
    }
  
} catch (e) {
    errorDetail(e);
}

