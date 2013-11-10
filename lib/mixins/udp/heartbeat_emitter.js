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
            
            if(!self.get('heartbeat.message')){
                self.set('heartbeat.message', self.get('id')+'.heartbeat');
            }

            if(!self.get('heartbeat.port')){
                self.set('heartbeat.port', 43280);
            }

            if(!self.get('heartbeat.interval')){
                self.set('heartbeat.interval', 5000);
            }

            if(!self.get('heartbeat.type')){
                self.set('heartbeat.type', 'udp4');
            }

            var message = new Buffer(self.get('heartbeat.message'));

            self.hbEmitter = function(){
                var client = dgram.createSocket("udp4");
                
                client.bind();
                client.on("listening", function () {
                    client.setBroadcast(true);
                    
                    client.send(message, 0, message.length, self.get('heartbeat.port'), self.get('heartbeat.ip'), function(err, bytes) {
                        client.close();
                    });
                });
            };

            if(self.get('heartbeat.autostart')!==false){
                self.publish('heartbeat.start', {});
            }

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var self = this;
            switch(topic){
                case 'heartbeat.stop':
                    clearInterval(self.hbInterval);
                    break;
                case 'heartbeat.start':
                    self.hbInterval = setInterval(self.hbEmitter, self.get('heartbeat.interval'));
                    break;
            }
        }
    };
    
    return mixin;
});