(function ($) {
    function isWindows() {
        if (!('ontouchstart' in window))
            return true;
    }

    //是否是android
    var isAndroid = window.navigator.userAgent.indexOf('Android') >= 0;
    //获得标题栏高度
    var headerHeight = getHeaderHeight() || 0;
    //上拉到底部的容错阈值
    var DIFF_THRESHOLD = 10;
    var touchEnd = isWindows() ? 'MSPointerUp pointerup mouseup' : 'touchend MSPointerUp pointerup';
    var touchCancel = 'touchcancel MSPointerCancel pointercancel';
    var scrollBox = $("[data-control='ScrollBOX']");
    var scrollBoxConfig = Backbone.Model.extend({
        defaults: {
            "bounce": 1,
        }
    });
    var scrollView = Backbone.View.extend({//options...
        initialize: function (option) {
            var $el = this.$el = option.$el;
            var self = this;
            this.bounceBox = $("[data-control='BounceBox']", this.$el);
            this.bounceHeight = $(".box_bounce", this.bounceBox).height();
            this.bounceStatus = $(".bounce_status", this.bounceBox);
            $el.scrollView = this;
            this.render();
            this.listenTo(this.model, "change:bounce", function (data) {
                data.changed.bounce && !this.bounceStatus.hasClass("active") && this.bounceStatus.addClass("active");
                !data.changed.bounce && this.bounceStatus.hasClass("active") && this.bounceStatus.removeClass("active");
            });
            this.listenTo(this.model, "change:percent", function (data) {
                var switchBounce = this.model.get("bounce");
                var bounceStatus = this.model.get("bounceStatus");
                var percent = data.changed.percent;
                switchBounce == 1 && percent > 50 && bounceStatus != 1 && this.model.set("bounceStatus", 1);
                switchBounce == 1 && percent <= 50 && bounceStatus != 0 && this.model.set("bounceStatus", 0);
            });
            this.listenTo(this.model, "change:bounceStatus", function (data) {
                if (this.model.get("bounce") == 1) {
                    if (data.changed.bounceStatus == 1)
                        (this.bounceStatus.removeClass("active"), $(this.bounceStatus[1]).addClass("active"), this.trigger("dragToReload"));
                    else if (data.changed.bounceStatus == 0) {
                        (this.bounceStatus.removeClass("active"), $(this.bounceStatus[0]).addClass("active"));
                    }
                    else if (data.changed.bounceStatus == 2) {
                        (this.bounceStatus.removeClass("active"), $(this.bounceStatus[2]).addClass("active"));
                        this.bounceBox.css("-webkit-transform", "translate3d(0px," + (this.bounceHeight) + "px,0px)");
                        this.trigger("releaseToReload");
                    }
                }
            })
        },
        reset: function () {
            var self = this;
            if (this.bounceBox) {
                var switchBounce = this.model.get("bounce");
                this.bounceBox.css("-webkit-transform", "translate3d(0px," + (-1) + "px,0px)");
                setTimeout(function () {
                    self.model.set("bounceStatus", "0");
                }, 500);
            }
        },
        hide: function () {
            this.model.set("bounce", 0);
            this.bounceStatus.removeClass("active")
        },
        show: function () {
            this.model.set("bounce", 1);
            $(this.bounceStatus[0]).addClass("active");
        },
        reload: function () {
            if (this.bounceBox) {
                !this.bounceBox.hasClass("utra") && this.bounceBox.addClass("utra");
                var switchBounce = this.model.get("bounce");
                var bounceStatus = this.model.get("bounceStatus");
                this.model.set("bounceStatus", "2");
            }
        },
        render: function () {
            var self = this;
            var $el = this.$el;
            if (this.model.get("bounce") != 1) {
                this.bounceStatus.removeClass("active");
            }
            $el.off("swipeMoveDown").on("swipeMoveDown", function (e) {
                var ev = e._args.e;
                if (!isAndroid) {
                    ev = !isWindows() ? (ev.touches[0] || ev.changedTouches[0]) : ev;
                    if ($el.height() - ev.screenY < 10) {
                        $el.css("height", $el.height() + 100 + 'px')
                    }
                }

                if ($el.scrollTop() == 0) {
                    self.bounceBox.hasClass("utra") && self.bounceBox.removeClass("utra");
                    var bounceStatus = self.model.get("bounceStatus");
                    if (bounceStatus == 2) {
                        self.trigger("onReloading", bounceStatus);
                        return;
                    }
                    var percent = parseInt(e._args.dy / 6 * 100 / self.bounceHeight);
                    self.bounceBox.css("-webkit-transform", "translate3d(0px," + e._args.dy / 3 + "px,0px)");
                    e._args.e.preventDefault();
                    self.trigger("draging", {
                        percent: percent
                    });
                    self.model.set("percent", percent);
                }
            });
            $el.off("swipeMoveUp").on("swipeMoveUp", function (e) {
                if (!isAndroid) {
                    var ev = e._args.e;
                    ev = !isWindows() ? (ev.touches[0] || ev.changedTouches[0]) : ev;
                    if ($el.height() - ev.screenY > 0) {
                        $el.css("height", "100%");
                    }
                }


            });
            $el.off(touchEnd).on(touchEnd, function (e) {
                !isAndroid && $el.css("height", "100%");
                if ($el.scrollTop() == 0) {
                    if (self.bounceBox) {
                        !self.bounceBox.hasClass("utra") && self.bounceBox.addClass("utra");
                        var status = self.model.get("bounceStatus");
                        if (!status || status == 0) {
                            self.reset();
                        } else if (status == 1) {
                            self.reload();
                        }
                    }
                }
            });
            //swipeDown scroll touchcancel MSPointerCancel pointercancel
            $el.off("swipeDown scroll touchcancel MSPointerCancel pointercancel").on("swipeDown scroll touchcancel MSPointerCancel pointercancel", function (e) {
                !isAndroid && $el.css("height", "100%");
                if ($el.scrollTop() == 0) {
                    log('触发到达顶部');
                    self.trigger("scrollTop");
                    if (self.bounceBox) {
                        !self.bounceBox.hasClass("utra") && self.bounceBox.addClass("utra");
                        var status = self.model.get("bounceStatus");
                        if (!status || status == 0) {
                            self.reset();
                        } else if (status == 1) {
                            self.reload();
                        }
                    }
                }
            });

            var scrollContainer = $el;
            if ($el[0].tagName == "BODY")
                scrollContainer = $(document);
            scrollContainer.off("scroll").on("scroll", function () {
                if (self.bounceBox) {
                    var $elHeight = $el.height();
                    if (!isAndroid) {
                        var diff = $el.scrollTop() + $elHeight - $el[0].scrollHeight;
                        if (Math.abs(diff) <= DIFF_THRESHOLD) {
                            self.trigger("scrollbottom");
                        }
                        return;
                    }

                    //这里计算是否滑动到底部
                    var bounceBoxHeight = self.bounceBox.height();
                    var left = $el.scrollTop() + $elHeight;
                    var right = bounceBoxHeight + headerHeight;
                    var diff = right - left;//差值
                    log("diff = " + diff);
                    if (Math.abs(diff) <= DIFF_THRESHOLD) {
                        self.trigger("scrollbottom");
                    }
                }
            })
        }
    });
    $.scrollbox = function ($el, option) {
        if ($el.scrollView) {
            $el.scrollView.model.set(option);
            return $el.scrollView;
        }
        var opt = _.extend({}, option);
        var model = new scrollBoxConfig(opt);
        return new scrollView({
            $el: $el,
            model: model
        });
    }
})($);

//滚动view的实例
var scrollViewInstance;

/**
 * 初始化下拉刷新
 *
 * @param pullDownRefreshCallback 下拉刷新的回调
 * @param pullUpLoadingCallback 上拉到底部的回调
 * @param isShowTips 是否显示提示语
 * @param cbScrollTop 滚动到顶部的回调方法
 */
function initPullDownRefresh(pullDownRefreshCallback, pullUpLoadingCallback, isShowTips, cbScrollTop) {
    var $el = $("body");
    var isShowTipsCurrent = true;
    if (isShowTips != null) {
        isShowTipsCurrent = isShowTips;
    }
    scrollViewInstance = $.scrollbox($el);
    scrollViewInstance.on("releaseToReload", pullDownRefreshCallback
    )
        .on("onReloading", function (a) {//if onreloading status, drag will trigger this event
        })
        .on("dragToReload", function () {//到达下拉刷新的边界 drag over 30% of bounce height,will trigger this event
        })
        .on("draging", function (percent) {//正在下拉on draging, this event will be triggered.
        })
        .on("scrollbottom", pullUpLoadingCallback)  // 滚动到底部
        .on('scrollTop', cbScrollTop);  // 滚动到顶部

    if (isShowTipsCurrent == false) {
        // $('.bounce_status').addClass("uhide");
        scrollViewInstance.hide();
        return;
    }

    //提示语
    var STR_DRAG_FLASH = tools.getString("STR_DRAG_FLASH");
    var STR_RELEASE_FLASH = tools.getString("STR_RELEASE_FLASH");
    var STR_LOAD_MORE = tools.getString("STR_LOAD_MORE");
    //这里可以定义下拉的样式
    $('#draging').html(STR_DRAG_FLASH);
    $('#dragToReload').html(STR_RELEASE_FLASH);
    $('#releaseToReload').html(STR_LOAD_MORE);
}

/**
 * 初始化滚动到顶部
 *
 * @param cbScrollTop   滚动到顶部的回调方法
 */
function initScrollTop(cbScrollTop) {
    scrollViewInstance = $.scrollbox($el);
    scrollViewInstance.on('scrollTop', cbScrollTop);
}

/**
 * 主动调用下拉刷新
 */
function pullDownRefresh() {
    scrollViewInstance.reload();
}

/**
 * 结束下拉刷新
 */
function endPullDownRefreshLately(timeout) {
    setTimeout(function () {
        scrollViewInstance.reset();
    }, timeout);
}

function endPullDownRefresh() {
    scrollViewInstance.reset();
}