appcan.define("tab", function ($, exports, module) {
    var model_tab = '<div class="ub ub-f1" data-index="<%=index%>">\
    <div class="ub-f1 ub ub-ver item ub-ac sc-text-tab">\
    <%if(option.hasIcon){%><div class="ub-f1 fa tx-c"><%=data.icon%></div><%}%>\
    <%if(option.hasLabel){%><div class="fontSize7 tx-c"><%=data.label%></div><%}%>\
    </div>\
    <div class="ulev-2 bc-text-head baseColor12" id="<%="badge_"+index%>"><%if(option.hasBadge && data.badge){%><div class="red tab_badge ub-ac ub-pc ub ulev0 badge"><%=data.badge%></div><%}%></div>\
    </div>';

    var tabViewTmp = appcan.view.template(model_tab);

    function TabView(option) {
        appcan.extend(this, appcan.eventEmitter);
        var self = this;
        self.option = $.extend({
            selector: null,
            hasIcon: true,
            hasLabel: true,
            hasAnim: true,
            hasBadge: true,
            itemName: "TAB" + parseInt(Math.random() * 10),
            index: 0
        }, option, true);
        if (!self.option.selector || !self.option.data)
            return;
        self.ele = $(self.option.selector);

        if (self.option.data) {
            self.set(self.option.data, self.option.index);
        }
    }

    TabView.prototype = {
        focusAnim: function (index, container) {
            var self = this;
            if (self.option.hasAnim) {
                var s = window.getComputedStyle(self.ele[0], null);
                var width = parseInt(parseInt(s.width) / self.itemCount);
                self.focus = self.focus || $('<div class="focus utra bg-color-primary"></div>');
                self.focus.css("width", width);
                self.focus.css("-webkit-transform", "translateX(" + index * width + "px)");
                if (container)
                    container.append(self.focus);
            }
        },
        focusText: function (index) {
            var self = this;
            if (self.option.hasAnim && self.option.hasIcon && self.option.hasLabel) {
                return;
            }
            else {
                var items = $(".item", self.ele);
                if (items.length) {
                    items.removeClass("tab-active");
                    $(items[index]).addClass("tab-active");
                }
            }
        },
        set: function (data, index) {
            var self = this;
            self.itemCount = data.length;
            if (self.focus)
                self.focus = null;
            self.ele.empty();
            var container = $('<div class="uf t-bla ub" ></div>');
            if (self.option.hasIcon && self.option.hasLabel) {
                // container.addClass("tab_m");
            }
            else if (self.option.hasLabel) {
                container.addClass("tab_l");
            }
            else if (self.option.hasIcon) {
                container.addClass("tab_i");
            }
            self.focusAnim(index, container);
            for (var i in data) {
                var ele = $(tabViewTmp({
                    data: data[i],
                    option: self.option,
                    index: i
                }));
                ele.on('tap', function (evt) {
                    self.itemClick(evt)
                });
                container.append(ele);
            }
            self.ele.append(container);
            self.focusText(index);
            return self;
        },
        badge: function (index, count) {
            if (count == "" || count == 0) {
                $("#badge_" + index, self.ele).html('');
            } else {
                $("#badge_" + index, self.ele).html('<div class="red tab_badge ub-ac ub-pc ub ulev0 badge">' + count + '</div>');
            }
        },
        itemClick: function (evt) {
            var self = this;
            var obj = $(evt.currentTarget);
            var index = parseInt(obj.attr("data-index"));
            self.focusAnim(index);
            self.focusText(index);
            this.emit("click", this, obj, index);
        },
        moveTo: function (index) {
            var self = this;
            self.focusAnim(index);
            self.focusText(index);
        }
    };
    module.exports = function (option) {
        return new TabView(option);
    };
});
