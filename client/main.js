require.config({
  paths: {
    'socketio': 'bower_components/socket.io-client/dist/socket.io',
    'angular': 'bower_components/angular/angular',
    'jquery': 'bower_components/jquery/dist/jquery',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-resource':'bower_components/angular-resource/angular-resource',
    'angular-animate':'bower_components/angular-animate/angular-animate',
    'domready': 'bower_components/requirejs-domready/domReady'
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
