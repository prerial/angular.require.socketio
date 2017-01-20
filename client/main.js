require.config({
  paths: {
    'socketio': 'libs/socket.io/socket.io-1.0.6',
    'angular': 'bower_components/angular/angular',
    'jquery': 'bower_components/jquery/dist/jquery',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-resource':'bower_components/angular-resource/angular-resource',
    'angular-animate':'bower_components/angular-animate/angular-animate',
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
