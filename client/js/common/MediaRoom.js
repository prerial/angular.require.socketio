function onMediaError(e) {
    console.error('Error:', e.name, e.message);
};

var mediaRoom = function() {
    var _this = this;
    var args = arguments[0];
    this.type = args.type;
    this.localContainer = $('#' + args.localcontainer);
    this.remoteContainer = $('#' + args.remotecontainer);
    this.miniContainer = $('#' + args.minicontainer);
    this.initialized = false;

    this.initialize = function () {
        _this.localStream = null;
        _this.remoteStream = null;
        _this.isVideoMuted = false;
        _this.isAudioMuted = false;
        _this.activeUser = null;
        _this.peers = {};
    };

    this.gotLocalStream = function (stream) {
        debugger
    };

    this.start = function (param) {
        _this.initialized = false;
        _this.sessionid = param.sessionid;
        _this.user = param.user;
        _this.targetUser = param.targetUser;
        console.log("Requesting local stream");
        navigator.getUserMedia(InviewApp.Config.Constrains.UserMedia[_this.type], _this.gotLocalStream, onMediaError );
    };

    this.call = function () {
        var arg = arguments[0];
        console.debug("================== Starting ==========================");
        console.log('Creating PeerConnection.');
        createPeerConnection();
        console.log('Adding local stream.');
        _this.peers[_this.user].addStream(_this.localStream);
        _this.activeUser = _this.user;
        if (App[_this.type].moderator) {
            _this.peers[_this.user].createOffer(setLocalAndSendMessage, onMediaError, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
            console.debug('Sending offer to peer, with constraints:', InviewApp.Config.Constrains.MediaConstraints[_this.type]) ;
        }
    };

    function createPeerConnection() {
        try {
            _this.peers[_this.user] = new RTCPeerConnection(iceServers, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
            _this.peers[_this.user].onicecandidate = onIceCandidate;
            _this.peers[_this.user].onaddstream = onRemoteStreamAdded;
            _this.peers[_this.user].onremovestream = onRemoteStreamRemoved;
            console.log('Created RTCPeerConnnection with: ', iceServers, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object; \
            WebRTC is not supported by this browser.');
            return;
        }
    };

    this.doAnswer = function () {
        console.debug('Sending answer to peer.');
        _this.peers[_this.user].createAnswer(setLocalAndSendMessage, onMediaError, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
        console.debug('Sending answer to peer, with constraints:', InviewApp.Config.Constrains.MediaConstraints[_this.type]) ;
    }

    function setLocalAndSendMessage(sessionDescription) {
        _this.peers[_this.user].setLocalDescription(sessionDescription);
        var data = {};
        data.type = _this.type + sessionDescription.type;
        data.sdp = sessionDescription.sdp;
        sendMessage(data);
    };

    function sendMessage(message) {
        var msgString = JSON.stringify(message);
        console.log('C->S: ', message.sdp? message.sdp: message);
        console.log('=======================================');
        App[_this.type][_this.type + 'Socket'].send(message);
    };

    function onIceCandidate(event) {
        if (event.candidate) {
            sendMessage({
                type: _this.type + 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    };

    this.reattachMediaStream = function (to, from) {
        to.src = from.src;
    };

    function onRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        if(_this.type === 'video'){
            _this.reattachMediaStream(miniVideo, localVideo);
            miniVideo.src = localVideo.src;
            var mediaElement = $('<video autoplay="autoplay" style="top:0;position:absolute;border:4px solid #fff;"></video>');
            mediaElement[0].src = URL.createObjectURL(event.stream);
            mediaElement[0].id = 'video_' + _this.targetUser;
            try{
                _this.remoteContainer.append(mediaElement);
            } catch (ex) {
                debugger
            }
            _this.remoteStream = event.stream;
        }else{
            $('#remotePhone')[0].src = URL.createObjectURL(event.stream);
            _this.remoteStream = event.stream;
        }
        waitForRemoteVideo();
    };

    function onRemoteStreamRemoved(event) {
        console.log('Remote stream removed.');
    };

    this.hangup = function () {
        if (_this.remoteStream !== null) {
        console.log('Hanging up.');
        transitionToWaiting();
//                if (App.video.moderator) {
            sendMessage({ type: _this.type + 'hangup', mode: 'remote' });
//                } else {
//                    sendMessage({ type: 'hangup', mode: 'local' });
//                }
        _this.localContainer.css('opacity', 0);
        _this.remoteContainer.css('opacity', 0);
        setTimeout(function () {
            stop();
            console.debug('Clicked hangup.');
        }, 1000);
        }
    };

    this.onRemoteHangup = function () {
        transitionToWaiting();
        setTimeout(function () {
           _this.initialized = false;
            stop();
        }, 1000);
    };

    function stop() {
        if (_this.remoteStream !== null) {
            App.video.moderator = false;
            _this.isAudioMuted = false;
            _this.isVideoMuted = false;
            try{
                console.debug("Remote Stream: ", _this.remoteStream);
                console.debug("Connection: ", _this.peers[_this.user]);
                if(_this.remoteStream.stop) _this.remoteStream.stop();
                _this.remoteStream = null;
                delete _this.remoteStream;
                _this.localStream.stop();
                _this.localStream = null;
                delete _this.localStream;
                _this.peers[_this.user].close();
                _this.peers[_this.user] = null;
                console.debug('Remove peer');
            }catch(ex){
            }
            $('#localVideo')[0].src = "";
            $('#miniVideo')[0].src = "";
            _this.remoteContainer.find('video').remove();
            _this.localContainer.css('opacity', 1);
            if(_this.miniContainer !== null) _this.miniContainer.css('opacity', 1);
            App.eventManager.trigger('setPresence', 'online');
            console.debug('Session terminated.');
            console.debug("================== End ==========================");
            _this.initialized = true;
            _this.initialize();
        }
    };

    function waitForRemoteVideo() {
        videoTracks = _this.remoteStream.getVideoTracks();
        try{
            if (videoTracks.length === 0 || $('#video_'+_this.targetUser)[0].currentTime > 0) {
                _this.localContainer.css('opacity', 0.1);
                _this.remoteContainer.css('opacity', 0.1);
                setTimeout(transitionToActive, 1000);
            } else {
                setTimeout(waitForRemoteVideo, 1000);
            }
        }catch(ex){
        }
    };

    function transitionToActive() {
        _this.remoteContainer.css('display', 'block').css('opacity', 1);
        if(_this.miniContainer !== null) {
            _this.miniContainer.css('opacity', 1).css('width', '110px')
        }
    };

    function transitionToWaiting() {
        if(_this.miniContainer !== null) _this.miniContainer.css('width', '0px');
        _this.remoteContainer.css('display', 'none').css('opacity', 0);
        if (App.video.moderator) {
            console.debug('transitionToWaiting' + App.video.moderator);
            _this.localContainer.css('opacity', 1);
        } else {
            console.debug('transitionToWaiting' + App.video.moderator);
            _this.localContainer.css('opacity', 0);
        }
        setTimeout(function () {
            if(localVideo && localVideo.src) localVideo.src = '';
            if(miniVideo && miniVideo.src) miniVideo.src = '';
            if(remoteVideo && remoteVideo.src) remoteVideo.src = '';
        }, 1000);
    };
/*
    $(window).on('beforeunload', function () {
        console.debug('beforeunload', _this.type + 'hangup')
        sendMessage({ type: _this.type + 'hangup', mode: 'window' });
    });
*/
    function enterFullScreen() {
        container.webkitRequestFullScreen();
    };

    this.toggleVideoMute = function() {
        var videoTracks = this.localStream.getVideoTracks();
        if (videoTracks.length === 0) {
            console.log('No local video available.');
            return;
        }
        if (this.isVideoMuted) {
            for (i = 0; i < videoTracks.length; i++) {
                videoTracks[i].enabled = true;
            }
            console.log('Video unmuted.');
        } else {
            for (i = 0; i < videoTracks.length; i++) {
                videoTracks[i].enabled = false;
            }
            console.log('Video muted.');
        }
        this.isVideoMuted = !this.isVideoMuted;
    };

    this.toggleAudioMute = function() {
        var audioTracks = this.localStream.getAudioTracks();
        if (audioTracks.length === 0) {
            console.log('No local audio available.');
            return;
        }
        if (this.isAudioMuted) {
            for (i = 0; i < audioTracks.length; i++) {
                audioTracks[i].enabled = true;
            }
            console.log('Audio unmuted.');
        } else {
            for (i = 0; i < audioTracks.length; i++) {
                audioTracks[i].enabled = false;
            }
            console.log('Audio muted.');
        }
        this.isAudioMuted = !this.isAudioMuted;
    };

};
