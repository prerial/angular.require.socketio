define(['angular'], function(angular) {

    'use strict';
    var directives = angular.module('directives', ['ngAnimate']);

    directives.directive('comCenterIcon', ['$animate', function($animate) {
        return function(scope, element, attrs) {
            element.on('click', function() {
                if(scope.opened || scope.opened === undefined){
                   $('#comcenter').width(0);
                   scope.opened = false;
                }else{
                   $('#comcenter').width(710);
                   scope.opened = true;
                }
                if(!scope.initialized){
                    scope.initialized = true;
                    $("#btn-video-add").hide()
                    $('#btn-audio-add').hide();
                    $('#phone-container').width(0);
                    $('#video-container').width(0);
                }
                $(window).resize();
            });
        };
    }]);
    directives.directive("alertUtil", function($animate) {

        return  {
          templateUrl : 'partials/directives/alert.html',
          replace : true,
          compile : function (element, attributes, transclude) {},
          link : function ($scope, $element, $attrs) {},
          scope : true,
          controller : function ($scope, $element, $attrs) {
            $scope.$watch($attrs.alertUtil, function(newVal) {
                if (newVal) {
                    $animate.addClass($element, "connect-alert");
                } else {
                    $animate.removeClass($element, "connect-alert");
                }
            });
          },
          transclude : true
        }
    });
    directives.directive('toolbarDirective', ['$animate', '$timeout', function($animate, $timeout) {
        return function(scope, element, attrs) {
            element.on('click', function() {
                $('.modeItem').removeClass('selected');
                $animate.addClass(element, 'selected');
                $("#btn-video-add").hide()
                $('#btn-audio-add').hide();
                $('#chat-container').width(0);
                $('#phone-container').width(0);
                $('#video-container').width(0);
                switch(element.attr('idx')){
                    case '0':
                        $('#chat-container').width(400);
                        break
                    case '1':
                        $('#btn-audio-add').show();
                        $('#phone-container').width(400);
                        $timeout(function(){
    //                        alert('Coming soon\nPlease use Chat');
                        },2000);
                        break
                    case '2':
                        $("#btn-video-add").show()
                        $('#video-container').width(400);
                        $timeout(function(){
    //                        alert('Coming soon\nPlease use Chat');
                        },1000);
                        break
                }
            });
        };
    }]);

    directives.directive('resizeDirective', ['$animate', function($animate) {
        return function(scope, element, attrs) {
            $(window).on('resize', function(){
                $('#comcenter').height(window.innerHeight-80);
                var height = $(window).height() - (HEADER_HEIGHT + FOOTER_HEIGHT);
                $('.comcenter').height(height);
                $('.chat-pane-left').height(height-66);
                $('.contactGroupList').height(height - 100);
                $('.comcenter-display').height(height-50);
                $('#chat-container, #video-container, #phone-container').height(height-136);
                $('#chat_display_holder').height(height-210);
                $('.chatContacts').height(height-210);
            });
        };
    }]);

    return directives;
});
