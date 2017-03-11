define(['angular'], function(angular) {
    'use strict';

    var animations = angular.module('animations', ['ngAnimate']);

    animations.animation('.img-toolbar-contact', function() {

      var animateUp = function(element, className, done) {
        if(className != 'active') {
          return;
        }
        element.css({
          position: 'absolute',
          top: 70,
          left: 0,
          display: 'block'
        });

        jQuery(element).animate({
            opacity:1,
          top: 0
        }, done);

        return function(cancel) {
          if(cancel) {
            element.stop();
          }
        };
      };

      var animateDown = function(element, className, done) {
        if(className != 'active') {
          return;
        }
        element.css({
          position: 'absolute',
          left: 0,
          top: 0
        });

        jQuery(element).animate({
            opacity:0,
          top: -70
        }, done);

        return function(cancel) {
          if(cancel) {
            element.stop();
          }
        };
      };

      return {
        addClass: animateUp,
        removeClass: animateDown
      };
    });

    animations.animation(".connect-alert", function() {
        return {
            addClass: function(element, className, done) {
                element.css({
                  position: 'absolute',
                  top: -370,
                  left: '50%',
                  display: 'block'
                });

                jQuery(element).animate({
                    top: '30%'
                }, done);

                return function(cancel) {
                  if(cancel) {
                    element.stop();
                  }
                };
            },
            removeClass: function(element, className, done) {
                element.css({
                  position: 'absolute',
                  left: '50%',
                  top: '30%'
                });

                jQuery(element).animate({
                    top: -370
                }, done);

                return function(cancel) {
                  if(cancel) {
                    element.stop();
                  }
                };
            }
        }
    });

    return animations;
});
