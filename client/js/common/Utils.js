


        var randomBetween = function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        };

        var createUUID= (function (uuidRegEx, uuidReplacer) {
            return function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
            };
        })(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 3 | 8);
            return v.toString(16);
        });

        var createDialog = function (options) {

            return new DialogView(options);

        };

        var busy = function (show, zIndex) {
            if (show) {
                BusyOverLay.open(zIndex);
            } else {
                BusyOverLay.close();
            }
        };

        var byte2Str = function (val) {
            var possibleTypes = ['bytes', 'KB', 'MB', 'GB'],
                canContinue = false,
                count = 0;

            var size = parseInt(val, 10) ? Math.floor(parseInt(val, 10)) : '';
            if (size == '') return '0 bytes';

            do {

                if (size > 1000) {
                    size = Math.floor((size / 1024) * 100) / 100;
                    count++;
                    canContinue = true;
                } else {
                    canContinue = false;
                }
            } while (canContinue);
            return size + ' ' + possibleTypes[count];
        };

        var string = {
            contains: function (str, needle) {
                if (needle === '') return true;
                if (str == null) return false;

                str = str.toLowerCase();
                needle = needle.toLowerCase();
                return String(str).indexOf(needle) !== -1;
            },
            trim: function (str) {

                if (str == null) return '';
                return str.replace(/^\s+|\s+$/g, '');
            },
            isNumber: function (input) {
                return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
                //return !isNaN(parseFloat(n)) && isFinite(n);
            }
        };


    /****************************************/
    /*                    Dialog            */
    /****************************************/
    // Dialog view
    //require("Backbone");
/*
    var DialogView = Backbone.View.extend({
        tagName: 'div',
        id: utils.createUUID(),
        attributes: {
            'class': "dialog-box"
        },
        view: null, //new Backbone.View({initialize:function(){},  render:function(){ $(this.el).html('hello');return this;}}),
        initialize: function (params) {
            var self = this;
            if (params && params.view) {
                self.view = params.view;
                self.view.parentView = self;
                self.onClose = params.onClose;
            }
        },

        render: function () {
            var self = this;
            this.bodyoverflow = $('body').css('overflow-y');
            $('body').css({ 'overflow-y': 'hidden' });
            this.$el.hide();
            $('body').append(this.el);
            var inside_view = self.view.render();
            this.$el.html(inside_view.$el);
//debugger
            setTimeout($.proxy(function () {
                // position dialog
                //$(self.el).outerWidth()
//
//                var top = ($(window).height() - $(self.$el).outerHeight()) * 0.5;
//                var left = ($(window).width() - $(self.$el).outerWidth()) * 0.5;

//                $(self.el).css({
//                    position: 'absolute',
//                    top: top + 'px',
//                    left: left + 'px',
//                    position: 'absolute',
//                    'z-index': 10005
//                });

//                inside_view.$el.css({
//                    position: 'relative'
//                });

//                $('body').css({ 'overflow-y': this.bodyoverflow });
//
            }, this), 10);
            return this;
        },
        open: function () {
            //$('BODY').addClass('blackout');
            $('body').append('<div id="' + this.id + '_overlay" class="blackout fullwindow"></div>');
            this.render();
            this.$el.fadeIn(250);
            window.dialog = this;
        },
        close: function () {
            //$('BODY').removeClass('blackout');
            $('#' + this.id + '_overlay').remove();
            var self = this;
            self.view.remove();
            self.remove();

            if (self.onClose) {
                self.onClose();
            }
        }
    });
*/
    var BusyOverLay = (function () {
        var overlay_id = createUUID();
        return {
            open: function (zIndex) {
                var zstr = 'z-index:20000';
                if (zIndex) {
                    zstr = 'z-index:' + zIndex;
                }
                $('body').append('<div style="' + zstr + '" id="' + overlay_id + '_overlay" class="blackout fullwindow"><div style="" class="vault-busy"><div class="vault-busy-loading"></div></div></div>');
            },
            close: function () {
                $('#' + overlay_id + '_overlay').remove();
            }

        };

    })();
