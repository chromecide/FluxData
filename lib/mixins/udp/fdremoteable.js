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

            var s = dgram.createSocket('udp4', function(data, rinfo){
                var jsonString = data.toString();
                var message = JSON.parse(data);

                var topicParts = message.topic.split('.');
                var senderId = topicParts[0];

                if(senderId==self.get('id') && topicParts[1]=='publish'){
                    self.publish(topic.replace(self.get('id')+'.publish.',''), message.data);
                }
            });

            s.bind(1234, function() {
                s.addMembership(self.get('broadcast_address') || '224.0.0.14');
            });

            self.onAny(function(data){
                var topic = self.get('id')+'.'+this.event;
                var msg = data.get();
                var msgObj = {
                    topic: topic,
                    data: msg
                };

                var message = new Buffer(JSON.stringify(msgObj));
                s.send(message, 0, message.length, 1234, "0.0.0.0", function(err, bytes) {});
            });

            if(callback){
                callback(errs, self);
            }
        },
        //called when something is published to this channel
        publish: function(topic, data){
            
        }
    };
    
    return mixin;
});