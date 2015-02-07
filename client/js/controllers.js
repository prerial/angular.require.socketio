define(['angular', 'socketio'], function(angular, SocketIO) {

    'use strict';
    var controllers = angular.module('controllers', []);

    controllers.controller("AlertCtrl", ['$scope', function($scope) {
        $scope.isHidden = false;
        $scope.showAlert = function() {
            $(".alert-box-message").html(arguments[0].message)
            $(".alert-box-title").html(arguments[0].title)
            $scope.isHidden = !$scope.isHidden;
            if(App.isiPad) $('#sendMessage').blur();
        }
    }]);

    controllers.controller('AppController', ['$rootScope',
        function ($rootScope) {
            $rootScope.$on('socketMessage', function(event, args) {
                switch (args.data.event) {
                    case 'chatMessage':
                        if (Prerial.Config.User.chid !== args.data.user.chid) {
                            var user = Prerial.Config.TestChatList[args.data.user.profile.email];
                            var name = user.profile.firstname + '&nbsp;' + user.profile.lastname;
                            var liItem = $('<li style="display:block;" class="bubble bubble--alt"></li>').append(name + ':&nbsp;' + args.data.message);
                            $('#chat_display_holder ul').append(liItem);
                            $('.modeChat').click();
                            $rootScope.$emit('handleEmit', {event: 'chatToolbarContact', data: args.data.user});
                        }
                        break;
                    case 'setPresence':
                        var presence = Prerial.Config.User['presence'];
                        App.chat.conversations.Websocket.send({ 'event': 'updatePresence', 'chid': Prerial.Config.User.chid, 'data': Prerial.Config.User });
                        break;
                    case 'updatePresence':
                        if (Prerial.Config.User.chid !== args.data.chid) {
                            args.data = args.data;
                            args.event = 'updatePresence';
                        }
                        break;
                }
                $rootScope.$broadcast(args.event, args.data);
            });
            $rootScope.$on('handleEmit', function(event, args) {
                if(args.event === 'loginUser'){
                    $rootScope.user = args.data;
                }
                if(args.event === 'getLoginUser'){
                    args.data = $rootScope.user;
                    args.event = 'setLoginUser';
                }
                $rootScope.$broadcast(args.event, args.data);
            });
            $(window).on('unload', function(){
                Prerial.Config.User.presence = 'offline';
                App.chat.conversations.Websocket.send({ 'event': 'updatePresence', 'chid': Prerial.Config.User.chid, 'data': Prerial.Config.User });
            });
            $(window).on('beforeunload', function(){
                Prerial.Config.User.presence = 'offline';
                App.chat.conversations.Websocket.send({ 'event': 'updatePresence', 'chid': Prerial.Config.User.chid, 'data': Prerial.Config.User });
            });
    }]);

    controllers.controller('chatController', ['$scope',
      function ($scope) {
        $scope.onKeyUp = function ($event) {
            if($event.keyCode === 13){

                if(App.chat.conversations.active !== null){
                    var presence = angular.element('#chat_toolbar').scope().getPresence();
                    if(presence !== 'online'){
                        angular.element(document.body).scope().showAlert({'title':'Chat', 'message':'Selected Contact is not Online'});
    //                    alert('Selected Contact is not Online');
                        return;
                    }
                }else{
                    angular.element(document.body).scope().showAlert({'title':'Chat', 'message':'Please select Contact'});
                    //alert('Please select Contact');
                    return;
                }
                App.chat.conversations.Websocket.send({'event': 'chatMessage', 'user': Prerial.Config.User, 'message':$('#sendMessage').val()});
                var liItem = $('<li style="display:block;" class="bubble"></li>').append('Me:&nbsp;' + $('#sendMessage').val());
                $('#chat_display_holder ul').append(liItem);
                $('#sendMessage').val('').blur();
            }
        };
    }]);

    controllers.controller('videoController', ['$scope',
      function ($scope) {
        $scope.startVideoCall = function(){
            alert('Video coming soon');
        };
        $scope.$watch('sharedObj.type', function(){
            if($scope.sharedObj.type === 'video'){
                $scope.startVideoCall();
            }
        });
    }]);

    controllers.controller('phoneController', ['$scope',
      function ($scope) {
        $scope.startAudioCall = function(){
            alert('Audio coming soon');
        };
        $scope.$watch('sharedObj.type', function(){
            if($scope.sharedObj.type === 'audio'){
                $scope.startAudioCall();
            }
        });
    }]);

    controllers.controller('workAreaController', ['$scope',
      function ($scope) {
        var sharedObj = {
            type: 'foo'
        };
        $scope.sharedObj = sharedObj;
        $scope.startVideo = function () {
            $scope.sharedObj.type = 'video';
        };
        $scope.startAudio = function () {
            $scope.sharedObj.type = 'audio';
        };
    }]);

    controllers.controller('contactsCtrl', ['$scope', '$http',
      function ($scope, $http) {
        $scope.userstr = 1;
            $scope.$on('updatePresence', function(event, args) {
                angular.element('#user_'+args.data.chid).scope().contact.presence = args.data.presence;
                $scope.$apply();
            });
            $scope.$on('setLoginUser', function(event, args) {
                if(args === undefined) args = {name: "John Doe",user: "1",value: "john.doe@citi.com"};
                $scope.userstr = args.user;
                $scope.userContact = Prerial.Config.User = Prerial.Config.TestChatList[args.value];
                $scope.$emit('handleEmit', {event: 'userContactContact', data: $scope.userContact});
                $http.get('data/chatContactList00' + $scope.userstr + '.js').success(function(data) {
                    $scope.contacts = data;
                    $scope.$emit('handleEmit', {event: 'setContacts', data: data});
                });
            });
            $scope.setContact = function(cont, event) {
                $(".contact-list").removeClass('hilited');
                $(event.target)[0].tagName === 'li'? $(event.target).addClass('hilited') : $(event.target).closest('li').addClass('hilited');
                $scope.$emit('handleEmit', {event: 'chatToolbarContact', data: cont});
            };
            $scope.$emit('handleEmit', {event: 'getLoginUser', data: ''});
    }]);

    controllers.controller('chatToolbarCtrl', ['$scope','$timeout',
        function ($scope, $timeout) {
            $scope.contacts = [];
            $scope.$on('setContacts', function(event, args) {
                $scope.contacts = args;
            });
            $scope.$on('chatToolbarContact', function(event, args) {
                var presence = args.presence;
                args.presence = 'offline';
                $scope.contact = args;
                $scope.mainImageUrl = args.avatar;
                App.chat.conversations.active = args.profile.email;
                $timeout(function(){
                    args.presence = presence;
                    $scope.contact = args;
                },500)
            });
            $scope.getPresence = function() {
                return $scope.contact.presence;
            };
    }])

    controllers.controller('userContactCtrl', ['$scope',
        function ($scope) {
            $scope.$on('userContactContact', function(event, args) {
                $scope.contact = args;
                Prerial.Config.User['presence'] = 'online';
/*
                App.chat.conversations.Websocket = new WebSocket({
                    url: 'https://chat.firebaseIO.com/prerial/',
                    userid: Prerial.Config.User['chid'],
                    onmessage: function(data){
                        $scope.$emit('socketMessage', {data: data});
                    },
                    useStatus: true
                });
*/
                App.chat.conversations.Websocket = new NodeWebSocket({
                    websocket: SocketIO,
                    evt:'message',
                    onmessage:     function(data){
                        $scope.$emit('socketMessage', {data: data});
//                        App.eventManager.trigger("serverMessage", { data: data });
                    },
//                    $('#messages').append($('<li>').text(data.type));},
//                    url: 'https://chat.firebaseIO.com/prerial/',
                    userid: Prerial.Config.User['chid'],
                    useStatus: true
                });
                App.chat.conversations.Websocket.send({'event': 'setPresence', 'chid': Prerial.Config.User['chid'], 'presence':'online'});
            });
    }]);

    controllers.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$compile',
        function ($scope, $rootScope, $location, $timeout, $compile) {
            $scope.users = Prerial.Config.LoginData;
            $rootScope.globals.currentUser = $scope.users[0];
            $scope.myUser = $scope.users[0];
            $scope.setContact = function(cont) {
                $location.path('/');
                $scope.$emit('handleEmit', {event: 'loginUser', data: cont});
                $timeout(function(){
                    $("#btn-video-add").hide()
                    $('#btn-audio-add').hide();
                    $('#comcenter').width(710);
                    $(window).resize();
                },1000)
            };
    }]);

    return controllers;
});
