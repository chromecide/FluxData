if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['dgram'], function(dgram){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;

            if(!self.get('heartbeat')){
                self.set('heartbeat', {});
            }

            for(var key in cfg){
                self.set('heartbeat.'+key, cfg[key]);
            }
            
            if(!self.get('heartbeat.port')){
                heartbeat.port = 43280;
            }

            if(!self.get('heartbeat.type')){
                self.set('heartbeat.type', 'udp4');
            }
            
            if(self.get('heartbeat.autolisten')!==false){
                self.publish('heartbeat.listen', {});
            }

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;
            switch(topic){
                case 'heartbeat.listen':
                    console.log('STARTING BROADCAST');
                    self.heartbeatServer = dgram.createSocket("udp4");
                    var server_ip = self.get('heartbeat.ip') || '0.0.0.255';
                    var server_port = self.get('heartbeat.port');

                    self.heartbeatServer.on("message", function (msg, rinfo) {
                        var msgparts = msg.toString().split('.');
                        var remoteId = msgparts[0];
                        var port = msgparts[1];
                        
                        if(remoteId!=self.get('id').toString()){
                            self.emit(msg.toString(), {});
                            //console.log(self.get('id')+" got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
                        }
                    });

                    self.heartbeatServer.on("listening", function () {
                      var address = self.heartbeatServer.address();
                    });

                    self.heartbeatServer.bind(server_port);
                    break;
                case 'heartbeat.ignore':

                    break;
            }
        }
    };
    
    return mixin;
});