if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['dgram'], function(dgram){
    var mixin = {
        //called when first mixing in the functionality
        init: function(cfg, callback){
            var self = this;
            var errs = false;
            
            for(var key in cfg){
                self.set(key, cfg[key]);
            }

            self.socket = dgram.createSocket('udp4', function(data, rinfo){
                var jsonString = data.toString();
                var message = JSON.parse(data);
                var topic = message.topic;
                var topicParts = message.topic.split('.');
                
                var senderId = topicParts[0];
                if(senderId==self.get('id')){
                    self.emit(topic.replace(self.get('id')+'.',''), message.data);
                }
            });

            self.socket.bind(self.get('port') || 1234, function() {
                self.socket.addMembership(self.get('broadcast_address') || '224.0.0.14');
            });
            
            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            var messageObj = {
                topic: self.get('id')+'.publish.'+topic,
                data:data
            };

            var message = new Buffer(messageObj);
            self.socket.send(message, 0, message.length, self.get('port') || 1234, "0.0.0.0", function(err, bytes) {});
        }
    };
    
    return mixin;
});