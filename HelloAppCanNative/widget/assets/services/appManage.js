var appViewService = {
    lock: false,
    request: function (data, options) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        appcan.window.publish("YGET_APPLIST", "");
        self.lock = false;
    }
};
_.extend(appViewService, Backbone.Events);

appcan.ready(function () {
    appcan.window.subscribe("YGET_APPLIST_CB", function (list) {
        appViewService.trigger("YGET_APPLIST_CB", list);
    });

});
