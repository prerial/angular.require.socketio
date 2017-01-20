require.config({
  paths: {
    'socketio': 'libs/socket.io/socket.io-1.0.6',
    'angular': 'libs/angular/angular',
    'jquery': 'libs/jquery/dist/jquery',
    'angular-route': 'libs/angular-route/angular-route',
    'angular-resource':'libs/angular-resource/angular-resource',
    'angular-animate':'libs/angular-animate/angular-animate',
    'domready': 'libs/require/domready'
  },
  shim: {
    'angular': {
      deps: [ 'jquery'],
      exports: 'angular'
    },
    'angular-route': {
        deps: ['angular']
    },
    'angular-resource':{
        deps:['angular']
    },
    'angular-animate':{
        deps:['angular']
    }
  }
});

require(['angular','angular-route', 'angular-animate', 'app', 'domready'],
    function (angular, route, anim, app, domready) {
        domready(function() {
            app.init();
        });
});
